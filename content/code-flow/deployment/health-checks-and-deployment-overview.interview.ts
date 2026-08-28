import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "health-1",
    question:
      "Liveness aur readiness health check me kya farak hai? ASP.NET Core me kaise implement karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Liveness = `kya process responsive hai` — fail par orchestrator restart karta hai, isliye ye external dependency check nahi karta. Readiness = `kya instance abhi serve kar sakta hai` — DB/cache/downstream check hote hain, fail par instance ko traffic se hataya jaata hai (restart nahi). `AddHealthChecks()` par checks register + tag, phir do endpoints map.",
    detailedAnswer:
      "`AddHealthChecks()` par checks chain karo: `AddDbContextCheck<AppDbContext>` (tag `ready`), `AddRedis(...)` (tag `ready`), aur `AddCheck<PanVerificationHealthCheck>` with `failureStatus: HealthStatus.Degraded` (tag `ready`). Phir do endpoints map karo. Liveness endpoint `/health/live` par `Predicate = _ => false` — koi check nahi chalta, `200` sirf ye kehta hai ki Kestrel request-response kar pa raha hai. Readiness endpoint `/health/ready` par ek predicate jo sirf `ready`-tagged checks chalata hai, plus ek custom `ResponseWriter` jo per-check status aur duration JSON me deta hai. Aggregation: ek bhi `Unhealthy` -> overall `503`; sab `Healthy` ya `Degraded` -> `200`.",
    followUp:
      "Liveness check me DB check daalne se kya problem hoti hai?",
    redFlag:
      "Readiness ko sirf `return Ok()` bana dena bina kisi dependency check ke — DB down hone par bhi LB traffic bhejta rahega.",
  },
  {
    id: "health-2",
    question:
      "Liveness check ko DB ya downstream API par depend karana kyun anti-pattern hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Liveness fail = restart. DB down hone par restart se DB theek nahi hota — sirf crash-loop banta hai, aur jab DB wapas aata hai to saare instances ek saath restart cycle me hote hain. Liveness ko dependency-free rakho.",
    detailedAnswer:
      "Liveness ka contract hai: `agar ye fail hua, mujhe restart karo`. Restart tabhi meaningful hai jab problem process ke andar ho (deadlock, unrecoverable state, memory thrash). Agar liveness DB touch karta hai aur DB ka failover 60-90s leta hai, har pod us window me liveness fail karega, orchestrator sabko restart karega — ab tum DB outage ke upar ek full app restart storm bhi jhel rahe ho, aur naye pods bhi boot par fail honge. Dependency health readiness ka kaam hai: readiness fail par instance traffic se hat-ta hai (no restart), DB wapas aane par apne aap wapas rotation me. Isliye `/health/live` par `Predicate = _ => false`.",
    followUp:
      "Startup slow hone par (30-40s boot) k8s me kya use karoge taaki liveness premature restart na kare?",
    redFlag:
      "`ek hi endpoint dono ke liye use kar lo` — restart aur traffic-removal ki semantics bilkul alag hain.",
  },
  {
    id: "health-3",
    question:
      "Custom `IHealthCheck` kaise likhte ho? Ek example do jahan `Degraded` return karna sahi ho, `Unhealthy` nahi.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`IHealthCheck` me ek method `CheckHealthAsync` jo `HealthCheckResult.Healthy/Degraded/Unhealthy` return karta hai. External PAN-verification API down hai par app ka core (employee CRUD) chal raha hai -> `Degraded`: instance traffic leta rahe, par dashboard/alert dikhe.",
    detailedAnswer:
      "```csharp\npublic sealed class PanVerificationHealthCheck : IHealthCheck\n{\n    private readonly IHttpClientFactory _factory;\n    public PanVerificationHealthCheck(IHttpClientFactory f) => _factory = f;\n\n    public async Task<HealthCheckResult> CheckHealthAsync(\n        HealthCheckContext context, CancellationToken ct = default)\n    {\n        try\n        {\n            var client = _factory.CreateClient(PanClientName);\n            using var res = await client.GetAsync(HealthPath, ct);\n            return res.IsSuccessStatusCode\n                ? HealthCheckResult.Healthy()\n                : HealthCheckResult.Degraded();\n        }\n        catch (Exception ex)\n        {\n            return HealthCheckResult.Unhealthy(exception: ex);\n        }\n    }\n}\n```\nRegister: `AddCheck<PanVerificationHealthCheck>` with `failureStatus: HealthStatus.Degraded` aur tag `ready`. `Degraded` overall report ko `200` par rakhta hai (app serve kar sakti hai) par ek visible signal deta hai; `Unhealthy` tabhi jab dependency ke bina instance bekaar hai (jaise primary DB).",
    followUp:
      "Ye check har few seconds chalta hai — isse PAN API par load na pade, iske liye kya karoge?",
  },
  {
    id: "health-4",
    question:
      "Ek .NET API ke liye CI/CD pipeline describe karo — commit se production tak kaunse stages?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`restore -> build -> test -> publish -> docker build + push (tag = commit SHA) -> deploy`. Tests deploy se pehle gate karte hain, image tag immutable (SHA), secrets pipeline ke secret store se.",
    detailedAnswer:
      "GitHub Actions me: `actions/checkout`, `setup-dotnet` (8.0.x), phir `dotnet restore`, `dotnet build --no-restore -c Release`, `dotnet test --no-build -c Release` (red test = deploy block), `dotnet publish EmployeeManagement.Api -c Release -o out`. Phir `docker/login-action` se registry login (creds `secrets.*` context se, ya OIDC short-lived token), `docker build -t ghcr.io/acme/emp-api:$GITHUB_SHA .` + `docker push`. Deploy step platform-specific — `az containerapp update --image ...:$GITHUB_SHA`, ya `kubectl set image`, ya `aws ecs update-service`. Image SHA se tag karna traceability aur clean rollback deta hai. Environments/approvals se prod deploy gate hota hai.",
    followUp:
      "Rollback kaise karoge agar naya deploy production me error rate spike kar de?",
    redFlag:
      "Secrets ko YAML me plain text ya `echo` karna — PR runs aur forks me leak.",
  },
  {
    id: "health-5",
    question:
      "Hosting options — Azure App Service, Azure Container Apps, AWS ECS/Fargate, VM + systemd, Kubernetes — ek .NET Web API ke liye kaunsa kab chunoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "App Service: least ops, standard API, chhoti-medium team. Container Apps: serverless containers, spiky/event-driven, scale-to-zero. ECS/Fargate: AWS shop jinhe containers chahiye par full k8s nahi. VM + systemd: 1-2 services, no Docker culture. Kubernetes: bade multi-service estates with a platform team.",
    detailedAnswer:
      "Decision ops-capacity aur scale se drive hota hai. App Service — PaaS, TLS/autoscale/deployment-slots built-in, container ya zip; jab tum infra nahi chalana chahte. Container Apps — KEDA autoscale, scale-to-zero, Dapr, no cluster to manage; microservices aur bursty workloads. ECS/Fargate — no node management, deep AWS integration (ALB, IAM, Secrets Manager); AWS-native container teams. VM + systemd — framework-dependent publish + `.service` unit + Nginx; legacy ya minimal footprint, par patching/TLS/scaling manual. Kubernetes (AKS/EKS) — max control, portability, Helm/operators/service-mesh ecosystem; sirf tab jab service count aur team maturity isse justify kare, warna complexity net-negative hai.",
    followUp:
      "Team ke paas dedicated platform/DevOps engineers nahi hain — tumhari default recommendation kya hogi?",
    redFlag:
      "`Kubernetes hamesha best hai` — 2-3 services ke liye ye over-engineering aur ongoing ops burden hai.",
  },
  {
    id: "health-6",
    question:
      "Zero-downtime deployment ke liye kaunsi strategies aur mechanisms use karte ho?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Rolling update (default, ek-ek instance replace, naya tabhi live jab readiness pass), blue-green (poora naya env, smoke test, LB flip, instant rollback), connection draining (graceful `SIGTERM` + deregister delay), aur EF migrations expand/contract me.",
    detailedAnswer:
      "Rolling update har platform ka default hai — extra capacity nahi chahiye par ek mixed-version window hota hai, isliye har change backward-compatible hona chahiye. Blue-green me green env full khada hota hai, automated smoke suite (including `/health/ready` assertion) pass hone par LB/mesh weight blue se green shift; rollback = wapas blue, instant, par ~2x capacity cutover ke dauraan. Connection draining — instance deregister hone ke baad in-flight requests ko finish hone ka time (yahi wajah exec-form `ENTRYPOINT` ki, taaki `SIGTERM` app tak pahunche). EF migrations kabhi ek step me breaking nahi — expand (add nullable column), deploy code, contract (drop old) alag releases me, kyunki rolling window me purana+naya code dono DB hit karte hain.",
    followUp:
      "Blue-green me database ek hi hai dono environments ke liye — schema change kaise handle karoge?",
    redFlag:
      "`deploy ke time thoda downtime le lenge, maintenance window me` — BFSI/payment paths me acceptable nahi, aur avoidable hai.",
  },
  {
    id: "health-7",
    question:
      "Production observability ke liye kya set up karoge? Sirf `Console.WriteLine` logs kyun kaafi nahi?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Structured JSON logs (Serilog) ek central sink pe (Seq/ELK/App Insights) with `TraceId`/`CorrelationId` fields, metrics (rate/errors/p95-p99), OpenTelemetry distributed tracing, aur SLO-based alerting. Plain text logs queryable nahi, correlate nahi hote, aur multi-instance me bikhre rehte hain.",
    detailedAnswer:
      "Plain `Console.WriteLine` ek instance ke stdout me jaata hai, koi structure nahi — `grep` hi tool hai, aur ek request ko API se DB se downstream tak follow karna impossible. Setup: (1) Serilog se JSON logs, har line me `TraceId`, `EmployeeId`, `CorrelationId` enriched, ek central store (Seq, Elasticsearch/Kibana, Loki, Application Insights) jahan tum field pe query karte ho. (2) Metrics — request rate, error rate, latency percentiles, DB connection pool usage — `System.Diagnostics.Metrics`/OpenTelemetry se Prometheus/Azure Monitor. (3) Distributed tracing — OpenTelemetry se span tree (incoming request -> EF query -> HttpClient call), Jaeger/Tempo/App Insights me, taaki `ye request 3s kyun lagi` ka jawaab mile. (4) Alerting SLO symptoms par — `error rate over 1% for 5 min`, `readiness failing on more than 1 instance` -> PagerDuty/Opsgenie, har transient blip par nahi.",
    followUp:
      "Har request ke liye ek `CorrelationId` end-to-end kaise propagate karoge?",
  },
  {
    id: "health-8",
    question:
      "Health check endpoint ke response ka status code kya hota hai, aur multiple checks ka result kaise aggregate hota hai?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "`200` = Healthy ya Degraded, `503` = Unhealthy. Aggregation: ek bhi check `Unhealthy` -> poori report `Unhealthy` -> `503`. Sab `Healthy`/`Degraded` -> `200`.",
    detailedAnswer:
      "`HealthCheckService` selected checks (default parallel) run karke ek `HealthReport` banata hai jisme har entry ka apna `HealthStatus` (`Healthy`/`Degraded`/`Unhealthy`) hota hai. Overall status = sabse kharab individual status. Default `HealthCheckOptions.ResultStatusCodes` mapping: `Healthy` aur `Degraded` dono `200` (app abhi serve kar sakti hai), `Unhealthy` `503`. Isliye ek non-critical dependency ke liye `failureStatus: HealthStatus.Degraded` set karna endpoint ko `200` par rakhta hai par JSON body me us check ka `Degraded` status dikhta hai. Orchestrator sirf status code dekhta hai; dashboard body dekhta hai.",
    followUp:
      "Agar tum chahte ho ki `Degraded` bhi load balancer ko instance nikaalne pe majboor kare, to kya badloge?",
  },
];

export default questions;
