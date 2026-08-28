import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "httpclientfactory-1",
    question: "`new HttpClient()` ko loop me kyun nahi use karna chahiye, aur iske badle kya?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Dispose ke baad socket TIME_WAIT me baithta hai; load par ports khatam ho kar SocketException aata hai. Iske badle IHttpClientFactory (typed client).",
    detailedAnswer:
      "HttpClient IDisposable hai lekin dispose par underlying socket turant free nahi hota — wo ~4 minute TIME_WAIT me rehta hai. High throughput par machine ke ephemeral ports (~28k) khatam ho jaate hain aur naye connections fail hote hain. Ek static HttpClient socket issue solve karta hai par DNS/IP changes miss karta hai. IHttpClientFactory handlers ko pool karti hai aur har ~2 minute rotate karti hai — connection reuse + periodic DNS refresh dono. Main AddHttpClient of T se ek typed client register karta hoon.",
    followUp: "IHttpClientFactory handler ka default lifetime kitna hai, aur ise kyun badalte hain?",
    redFlag: "Ye kehna ki har call par using new HttpClient() theek hai kyunki dispose ho raha hai.",
  },
  {
    id: "httpclientfactory-2",
    question: "Named client aur typed client me farq batao. Tum kaunsa prefer karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Named = AddHttpClient with a string name, resolve via IHttpClientFactory.CreateClient(name). Typed = AddHttpClient of T, ek class jo HttpClient inject karti hai. Production me typed.",
    detailedAnswer:
      "Named client string-keyed hai — har call site ko factory aur exact name pata hona chahiye, typo-prone. Typed client ek dedicated class hai jisme base URL, request shaping, JSON deserialize aur error-to-outcome mapping encapsulated rehta hai; business service seedha us class ko inject karti hai aur HTTP ke baare me kuch nahi jaanti. Isliye typed default hai; named tab jab class banane layak logic na ho ya ek endpoint bahut alag configs se chahiye.",
    followUp: "Typed client ka lifetime kya hota hai — transient, scoped ya singleton?",
  },
  {
    id: "httpclientfactory-3",
    question:
      "Standard resilience handler kya deta hai? Uske teen core pieces samjhao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Retry (exponential backoff + jitter), circuit breaker (sustained failure par open, fast-fail), aur do-level timeout (per-attempt + total). Plus ek rate limiter.",
    detailedAnswer:
      "Retry: transient failures (408/429/5xx, timeout) par automatic retries, har baar wait double + random jitter taaki failed requests ek saath retry na karein (thundering herd). Circuit breaker: agar ek sampling window me failure ratio threshold (default ~50%) cross kare, circuit open ho jaata hai — agle kuch seconds sab calls turant BrokenCircuitException se fail hoti hain, provider ko hit kiye bina, phir half-open ek test call. Timeout: per-attempt timeout ek slow call ko retry budget khaane se rokta hai; total timeout retries+backoff milke bhi caller ko forever hang hone se rokta hai.",
    followUp: "Circuit breaker ka half-open state kya karta hai?",
  },
  {
    id: "httpclientfactory-4",
    question: "Retry policy kaunse operations par khatarnak hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Non-idempotent operations — create-payment, create-order, create-employee POST. Provider request process kar chuka ho aur sirf response drop hua ho to retry duplicate banata hai.",
    detailedAnswer:
      "Idempotent calls (GET, PAN verify, PUT with a full body) safe hain — N retries = 1 call jaisa effect. Ek payment initiate POST par network ne response drop kiya lekin server ne charge kar diya — retry double charge. Solutions: request me ek idempotency key bhejo jise provider dedupe kare, ya un endpoints par retry off rakho. Backoff/jitter sirf load smooth karte hain, duplicate problem solve nahi karte.",
    followUp: "Idempotency key server side kaise implement hoti hai?",
    redFlag: "Blanket AddStandardResilienceHandler har client par bina ye soche ki wo endpoint idempotent hai ya nahi.",
  },
  {
    id: "httpclientfactory-5",
    question:
      "Ek dev ne per-user bearer token ko `client.DefaultRequestHeaders.Authorization` par set kiya. Kya problem hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Handler pooled hai aur DefaultRequestHeaders us client instance par shared hain — user A ka token user B ki request par chala jaayega. Serious data leak.",
    detailedAnswer:
      "IHttpClientFactory HttpClient instances aur unke handlers reuse karti hai. DefaultRequestHeaders registration ke waqt ke static headers (jaise ek fixed API key) ke liye theek hai, lekin per-request/per-user data ke liye nahi — wo pooled client par set ho kar dusri concurrent request par leak karega. Per-call headers HttpRequestMessage par set karo (request.Headers.Authorization) ya ek DelegatingHandler use karo jo current request context se token uthaaye.",
    followUp: "DelegatingHandler kya hai aur ye per-call auth ke liye kaise use hota hai?",
  },
  {
    id: "httpclientfactory-6",
    question:
      "Ye code kya karega?\n```csharp\nvar client = _factory.CreateClient(\"pan\"); // BaseAddress = https://api.x/v1/\nvar res = await client.GetAsync(\"/pan/status\");\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Request https://api.x/pan/status par jaayegi — leading slash ne base path ka /v1/ segment gira diya — aur shaayad 404 aayega.",
    detailedAnswer:
      "Jab BaseAddress me ek path (/v1/) ho aur relative URI leading slash se shuru ho (/pan/status), to Uri combination base ke path ko discard kar deta hai aur sirf host + absolute path use hota hai. Sahi: bina leading slash — client.GetAsync(\"pan/status\") — jo https://api.x/v1/pan/status banata hai. Ye ek classic silent bug hai jahan sab compile hota hai par URL galat hai.",
    followUp: "BaseAddress me trailing slash zaroori kyun hai?",
    redFlag: "Ye maan lena ki leading slash sirf cosmetic hai.",
  },
  {
    id: "httpclientfactory-7",
    question: "Typed client ko unit test kaise karoge bina real network ke?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ek custom HttpMessageHandler (stub) banao jo SendAsync override karke canned HttpResponseMessage return kare, us se ek HttpClient banao, aur typed client ke constructor me pass karo.",
    detailedAnswer:
      "Typed client ke andar HttpClient hai aur uske andar HttpMessageHandler. Test me hum handler ko fake karte hain: ek StubHandler jiska SendAsync ek fixed status + JSON body deta hai. `new HttpClient(stubHandler) { BaseAddress = ... }` bana ke `new PanVerificationClient(http)` — ab koi socket, DNS ya provider nahi. Alag tests: 200 -> parsed result, 404 -> NotFound outcome, 500 -> exception, malformed JSON -> exception. Resilience pipeline ka test: handler pehli 2 calls par 503 phir 200 de, assert final success (retry ne bacha liya).",
    followUp: "Resilience pipeline khud ko integration-test karne ke liye kya setup chahiye?",
  },
];

export default questions;
