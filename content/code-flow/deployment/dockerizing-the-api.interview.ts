import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "docker-1",
    question: "Ek .NET Web API ke liye Dockerfile walk-through do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Multi-stage. Build stage `mcr.microsoft.com/dotnet/sdk:8.0` — pehle sirf `.csproj` files copy karke `dotnet restore` (layer caching), phir source copy karke `dotnet publish -c Release`. Runtime stage `mcr.microsoft.com/dotnet/aspnet:8.0` — `COPY --from=build` sirf publish output, `USER app` non-root, `EXPOSE 8080`, `ENTRYPOINT` exec form me.",
    detailedAnswer:
      "Build stage SDK image se: `WORKDIR /src`, `COPY` sln + har `.csproj`, `RUN dotnet restore`, phir `COPY . .` aur `RUN dotnet publish EmployeeManagement.Api -c Release -o /app/publish --no-restore`. Runtime stage: `FROM mcr.microsoft.com/dotnet/aspnet:8.0`, `WORKDIR /app`, `USER app` (image ka built-in non-root user, UID 1654), `COPY --from=build /app/publish .`, `EXPOSE 8080`, `ENV ASPNETCORE_HTTP_PORTS=8080`, `ENTRYPOINT [dotnet, EmployeeManagement.Api.dll]` (JSON array). Final image me na compiler na source — sirf runtime + publish output, ~180 MB vs single-stage ~800 MB+. Config run time par `-e` env vars se aati hai. Ek `.dockerignore` `bin/`, `obj/`, `.git/`, `appsettings.Development.json` ko context se bahar rakhta hai.",
    followUp: "Clean Architecture ke 4 projects hon to Dockerfile aur `COPY` lines kaise badalte hain?",
    redFlag:
      "Single-stage Dockerfile jisme SDK image hi ship ho — bada image, compiler production me, slow pull.",
  },
  {
    id: "docker-2",
    question: "Multi-stage build ka exact faayda kya hai? Bina uske kya-kya kharab hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Ek hi file me do `FROM` blocks: bhaari SDK image app build karti hai, patli runtime image sirf build ka output copy karti hai. Final image me compiler, NuGet cache, source — kuch nahi. Bina iske image ~800 MB+, bada attack surface, aur source/secrets layers me leak ho sakte hain.",
    detailedAnswer:
      "`FROM sdk:8.0 AS build` stage restore + publish karta hai; `FROM aspnet:8.0` stage `COPY --from=build /app/publish .` se sirf artifact leta hai. Runtime image (~110-220 MB base OS par) me MSBuild, `dotnet` CLI, ya `.cs` files nahi hoti — ek RCE bug ke liye kam tools reachable. Single-stage me `COPY . .` (bina `.dockerignore`) local `appsettings.Development.json` ki dev connection string image layer me daal sakta hai, jo `docker history` se koi bhi dekh le. Alpine tag (`aspnet:8.0-alpine`) ~110 MB, Debian-based ~220 MB — Alpine chhota par musl libc ke native-lib gotchas kabhi-kabhi aate hain.",
    followUp: "Runtime image ke liye Alpine chunoge ya Debian-based? Kis cheez par depend karega?",
  },
  {
    id: "docker-3",
    question:
      "`ENTRYPOINT` exec form vs shell form — code-output style: `docker stop` bhejne par kya farak padta hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Exec form (`[dotnet, App.dll]`): `dotnet` PID 1 hai, `SIGTERM` seedha milta hai, graceful shutdown chalta hai. Shell form (`ENTRYPOINT dotnet App.dll`): `sh -c` PID 1 hai, wo `SIGTERM` forward nahi karta, app ko signal nahi milta, 10s baad `SIGKILL`.",
    detailedAnswer:
      "`docker stop` pehle `SIGTERM`, phir default 10 second baad `SIGKILL` bhejta hai. ASP.NET Core `SIGTERM` par graceful shutdown karta hai — naya traffic accept karna band, in-flight requests complete karna, `IHostApplicationLifetime.ApplicationStopping` hooks, DB connections close. Shell form me `/bin/sh -c dotnet App.dll` PID 1 banta hai aur `dotnet` uska child; `sh` signals child ko propagate nahi karta, isliye graceful shutdown skip ho jaata hai aur requests beech me kat-te hain. Exec form (JSON array) me koi shell involved nahi, `dotnet` khud PID 1, signal seedha. Isliye hamesha exec form.",
    followUp: "Agar app ko real init system chahiye (zombie reaping) to kya use karoge?",
    redFlag: "'Dono same hai, bas syntax alag' — signal handling ka farak nahi pata.",
  },
  {
    id: "docker-4",
    question: "`.dockerignore` me kya rakhoge aur kyun? Isse concretely kya farak padta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`**/bin/`, `**/obj/`, `**/.git/`, `**/.vs/`, `**/*.user`, `**/appsettings.Development.json`, aur `Dockerfile`/`docker-compose.yml` khud. Yeh build context ko 100s of MB se kuch MB kar deta hai aur dev secrets ko image layers me jaane se rokta hai.",
    detailedAnswer:
      "Build context wo files hain jo Docker daemon ko upload hoti hain `docker build` par. `bin/`/`obj/` me purane build outputs hote hain jo image me kaam ke nahi. `.git/` history poori upload ho jaati hai. Local `appsettings.Development.json` me aksar ek dev connection string hoti hai — agar `COPY . .` se image me chali gayi to `docker history` / layer inspection se plaintext dikhti hai, security scan release block kar sakta hai. `.dockerignore` context transfer tez karta hai aur cache invalidation bhi kam karta hai (irrelevant file change se `COPY . .` layer dobara nahi chalti).",
    followUp: "Agar `.dockerignore` me `Dockerfile` bhi ignore kiya hai to build kaise chalti hai?",
  },
  {
    id: "docker-5",
    question:
      "Container immutable hai — to production me connection string aur secrets kaise andar aate hain?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Run time par: `docker run -e ASPNETCORE_ENVIRONMENT=Production -e ConnectionStrings__Default=...`. Double underscore nested key ke liye — wahi mechanism jo non-container config me hai. Production me secrets orchestrator ke secret store se aate hain, plain `-e` sirf local testing.",
    detailedAnswer:
      "Image me koi secret bake nahi hota. `ConnectionStrings__Default` env var `appsettings.json` ki `ConnectionStrings:Default` ko override karta hai (`.NET` `__` ko `:` ki tarah treat karta hai). Multiple values ke liye `--env-file prod.env`. Production me: Kubernetes `Secret` ko env var ya mounted file ke roop me inject karo, ya ECS task definition me AWS Secrets Manager integration, ya Azure Container Apps secrets. Plain `-e` par secret shell history aur `docker inspect` me dikhta hai, isliye wo sirf local dev/test ke liye. App side par `ValidateOnStart` se missing secret boot par crash karega, silently galat config ke saath nahi chalega.",
    followUp: "`-e` se pass kiya secret `docker inspect` me dikhta hai — orchestrator secret store isse kaise better hai?",
    redFlag: "Secrets ko Dockerfile me `ENV` ya `ARG` se daalna — image layers me permanently reh jaate hain.",
  },
  {
    id: "docker-6",
    question:
      "`dotnet publish /t:PublishContainer` Dockerfile ke bina image bana deta hai. Kab yeh use karoge, kab handwritten Dockerfile?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "PublishContainer: chhote services, koi Dockerfile maintain nahi, non-root aur correct ports by default, SDK caching handle karta hai. Handwritten Dockerfile: jab custom OS packages (`apt-get`), multi-arch tweaks, ya explicit/portable control chahiye — bade teams aksar yahi rakhti hain.",
    detailedAnswer:
      "`dotnet publish EmployeeManagement.Api -c Release /t:PublishContainer -p:ContainerImageName=emp-api -p:ContainerImageTags=latest` SDK ke built-in container support se image banata hai — base automatically `mcr.microsoft.com/dotnet/aspnet:8.0`, non-root default, ports set. Pros: kam boilerplate, MSBuild layer caching. Cons: custom base-image tweaks (native deps install karna, specific OS) mushkil, aur build agent par ek container runtime (Docker/podman) chahiye. Handwritten Dockerfile explicit hai — koi bhi padhkar samajh le, aur CI/CD portable. Chhote internal API ke liye PublishContainer bahut clean hai; complex ya compliance-heavy setup me Dockerfile.",
    followUp: "Base image ka SHA digest pin karna (`aspnet:8.0@sha256:...`) kis approach me aasan hai?",
  },
  {
    id: "docker-7",
    question:
      "Container ko root ke bajaye non-root user se chalane par kyun zor diya jaata hai? BFSI container platforms me aur kya rules hote hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Agar container compromise ho to attacker ko root nahi, ek unprivileged user milta hai — container breakout aur host attacks mushkil. `aspnet` image `USER app` (UID 1654) ke saath aata hai, bas wo line add karo.",
    detailedAnswer:
      "Defence in depth: `USER app` ke baad sab kuch us user ke roop me chalta hai, filesystem writes restricted, privileged ports bind nahi kar sakta (isliye 8080). BFSI platforms me typical additional rules: base image ka SHA digest pin (`FROM ...aspnet:8.0@sha256:...`) taaki mutable `:8.0` tag silently na badle; ek weekly job jo digest update karke PR kholta hai (patched base, par kabhi surprise change nahi); image vulnerability scan CI me (findings threshold se upar = block); read-only root filesystem; aur non-root enforcement admission controller se. `USER app` in sab ka pehla step hai.",
    followUp: "Read-only root filesystem ke saath app ko temp files likhne hon to kya karoge?",
    redFlag: "`USER` line chhod dena aur maan lena ki container isolation hi kaafi hai.",
  },
];

export default questions;
