import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "kestrel-reverse-proxies-tr-1",
    question: "Kestrel kya hai aur ye purane ASP.NET (.NET Framework era) ke hosting model se kaise alag hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Kestrel ASP.NET Core ka apna embedded, cross-platform web server hai — purane ASP.NET ko IIS ke andar hi host hona padta tha, poori tarah IIS-dependent.",
    detailedAnswer:
      "Har ASP.NET Core app apna khud ka web server carry karta hai — Kestrel — jo Windows/Linux/macOS pe same tareeke se chal sakta hai bina kisi external web-server dependency ke. Ye .NET Core ke cross-platform goal ka direct nateeja tha. Purana ASP.NET (.NET Framework) IIS ke andar hi run hota tha end-to-end — IIS khud request handling karta tha, app ka apna independent server nahi tha.",
  },
  {
    id: "kestrel-reverse-proxies-tr-2",
    question: "Production me Kestrel ko reverse proxy ke peeche kyun rakha jaata hai, agar wo khud itna fast aur capable hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Kestrel deliberately minimal hai — TLS hardening, slow-client defense, multi-app routing, load balancing edge-layer responsibilities hain jo dedicated proxy behtar handle karta hai.",
    detailedAnswer:
      "Kestrel raw request-handling throughput ke liye highly optimized hai, lekin ye ek 'edge web server' nahi hai. Reverse proxy (IIS/Nginx/cloud LB) TLS termination, slow/malicious-client protection, ek hi public port se multiple apps route karna, aur load balancing jaisi responsibilities uthaata hai — ye battle-tested, hardened concerns hain jo Kestrel jaanbujh kar reinvent nahi karta, apni core strength (fast app-request handling) pe focus karta hai.",
    followUp: "Ye setup exactly kaam kaise karta hai — request flow kya hai?",
  },
  {
    id: "kestrel-reverse-proxies-tr-3",
    question: "Reverse-proxy-fronted setup me request flow step-by-step explain karo.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Client → Reverse Proxy (TLS termination, routing) → Kestrel (app logic) → response wapas proxy se hote hue client tak.",
    detailedAnswer:
      "Client HTTPS request bhejta hai reverse proxy (jaise Nginx) ko. Proxy TLS terminate karta hai (certificate management centrally), request ko internal network pe plain HTTP (ya re-encrypted) se Kestrel tak forward karta hai, saath me `X-Forwarded-For`/`X-Forwarded-Proto` headers add karta hai original client info preserve karne ke liye. Kestrel app logic process karta hai, response wapas proxy ko deta hai, proxy client ko response forward karta hai.",
  },
  {
    id: "kestrel-reverse-proxies-tr-4",
    question: "`ForwardedHeadersMiddleware` kya problem solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Reverse proxy ke peeche app ko real client IP/scheme dikhata hai, warna har request proxy machine se aayi lagegi.",
    detailedAnswer:
      "Bina is middleware ke, ASP.NET Core app `HttpContext.Connection.RemoteIpAddress` me hamesha reverse proxy ka IP dekhega, actual client ka nahi — kyunki TCP connection technically proxy se hi aa raha hai. Isse client-IP-based logging, rate-limiting, geo-blocking sab galat data pe kaam karenge. `ForwardedHeadersMiddleware` `X-Forwarded-For` (original client IP) aur `X-Forwarded-Proto` (original scheme — http/https) headers padh kar in values ko correctly restore karta hai app ke andar.",
    followUp: "Iske security implications kya hain agar galat configure ho jaaye?",
  },
  {
    id: "kestrel-reverse-proxies-tr-5",
    question: "`ForwardedHeadersMiddleware` galat configure hone se (jaise koi bhi client ko `X-Forwarded-For` set karne dena) kya security risk ban sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Spoofed `X-Forwarded-For` se koi bhi client apna IP fake kar sakta hai — IP-based security controls bypass ho sakte hain.",
    detailedAnswer:
      "`X-Forwarded-For` ek regular HTTP header hai jo koi bhi client apne request me directly set kar sakta hai agar proxy usse overwrite/sanitize nahi karta. Agar app blindly is header pe trust kare bina ye verify kiye ki request genuinely trusted proxy se aayi hai (`KnownProxies`/`KnownNetworks` configure karke), ek attacker apna IP spoof karke IP-based rate-limiting, geo-blocking, ya audit logging bypass kar sakta hai. `ForwardedHeadersOptions.KnownProxies` set karna is risk ko mitigate karta hai.",
    redFlag: "Production me `ForwardedHeadersMiddleware` bina `KnownProxies` restrict kiye enable karna — spoofing risk create karta hai.",
  },
  {
    id: "kestrel-reverse-proxies-tr-6",
    question: "IIS ka role modern ASP.NET Core deployment me kya hai — kya ye ab bhi relevant hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Haan — IIS abhi bhi Windows-based hosting me reverse proxy ke roop me use hota hai, ASP.NET Core Module ke through Kestrel ko internally forward karta hai.",
    detailedAnswer:
      "Purane ASP.NET (.NET Framework) me IIS khud request pipeline handle karta tha. Modern ASP.NET Core deployments me, IIS 'ASP.NET Core Module' (ANCM) use karta hai — jo IIS ko ek reverse proxy ke roop me kaam karne deta hai, jo requests ko internally Kestrel process ko forward karta hai. Ye Windows-based on-premise ya IIS-familiar shops ke liye still ek valid, common production setup hai.",
  },
  {
    id: "kestrel-reverse-proxies-tr-7",
    question: "Kubernetes environment me Kestrel deployment thoda alag kaise ho sakta hai traditional Nginx/IIS setup se?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ingress controller khud reverse-proxy-jaisi responsibilities uthata hai, isliye kabhi Kestrel directly uske peeche expose hota hai bina alag Nginx layer ke.",
    detailedAnswer:
      "Kubernetes me ek Ingress Controller (jaise NGINX Ingress, Traefik) already TLS termination, routing, load balancing jaisi edge responsibilities handle karta hai cluster-level pe. Isliye kuch deployments me app pod ke andar Kestrel directly is Ingress ke peeche expose ho jaata hai, bina ek separate in-app Nginx layer ke — kyunki wo zimmedariyan already cluster infrastructure level pe cover ho rahi hoti hain. Ye principle wahi hai (edge-layer concerns Kestrel se bahar rakho), implementation jagah badal jaati hai.",
  },
  {
    id: "kestrel-reverse-proxies-tr-8",
    question: "Kya ye statement sahi hai: 'Kestrel production-grade nahi hai, isliye reverse proxy zaroori hai'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat framing — Kestrel genuinely production-grade aur fast hai; reverse proxy iski kami nahi, balki architectural separation of concerns hai.",
    detailedAnswer:
      "Ye ek common misconception hai. Kestrel ek weak ya 'toy' server nahi hai — ye benchmarks me consistently top-tier throughput deta hai aur production workloads ke liye bilkul designed hai. Reverse proxy iski kisi 'kami' ko cover nahi karta, balki ek deliberate architectural separation hai — Kestrel app-request handling me focus karta hai, edge/network-layer hardening dedicated component ko di jaati hai. Ye microservices/layered-architecture ke 'single responsibility' principle jaisa hi ek pattern hai, weakness nahi.",
    redFlag: "'Kestrel weak hai isliye proxy chahiye' bolna — actual reasoning (separation of concerns, specialized hardening) miss karta hai.",
  },
  {
    id: "kestrel-reverse-proxies-tr-9",
    question: "Ye code snippet kya karta hai, aur ye kab zaroori hai?\n```csharp\napp.UseForwardedHeaders(new ForwardedHeadersOptions\n{\n    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto\n});\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Middleware pipeline me `X-Forwarded-For`/`X-Forwarded-Proto` headers ko process karke original client IP aur scheme restore karta hai — reverse proxy ke peeche deployment me zaroori hai.",
    detailedAnswer:
      "Ye `ForwardedHeadersMiddleware` add karta hai jo incoming request ke `X-Forwarded-For` aur `X-Forwarded-Proto` headers ko padh kar `HttpContext.Connection.RemoteIpAddress` aur `HttpContext.Request.Scheme` ko update kar deta hai, taaki app ko lagne wala 'client info' proxy ka nahi, actual original client ka ho. Ye tab zaroori hai jab app kisi reverse proxy ke peeche deploy ho — bina iske, IP-based logic aur logging galat hogi.",
  },
];

export default questions;
