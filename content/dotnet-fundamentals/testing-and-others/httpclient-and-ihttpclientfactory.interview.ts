import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "httpclient-factory-tr-1",
    question: "`new HttpClient()` ko har request pe banana aur dispose karna kyun problematic hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Amazon", "Flipkart", "Swiggy"],
    shortAnswer:
      "Socket exhaustion — disposed HttpClient ka underlying TCP socket turant release nahi hota, TIME_WAIT state me linger karta hai; high-frequency creation isse exhaust kar deta hai.",
    detailedAnswer:
      "HttpClient.Dispose() call karne par underlying TCP connection OS level pe turant close nahi hota — TCP protocol design ki wajah se ye TIME_WAIT state me kuch minutes tak rehta hai (delayed packets properly handle karne ke liye). Agar application har request pe naya client bana ke dispose kare, high traffic me naye sockets ki demand release hone ki rate se aage nikal jaati hai — system available sockets/ports exhaust kar deta hai, resulting SocketException.",
    followUp: "Ye problem low-traffic testing me kyun nahi dikhti?",
  },
  {
    id: "httpclient-factory-tr-2",
    question: "IHttpClientFactory ye problem kaise solve karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Ye underlying HttpMessageHandler ko internally pool aur reuse karta hai multiple HttpClient instances ke beech, isliye har logical HttpClient use naya socket nahi banata.",
    detailedAnswer:
      "IHttpClientFactory ka core insight ye hai ki HttpClient object khud lightweight hai, lekin actual connection-management work HttpMessageHandler karta hai, jo expensive/pool-worthy resource hai. Factory in handlers ka ek pool maintain karta hai (periodically recycle bhi karta hai, DNS changes respect karne ke liye), isliye developer ko manually connection lifecycle manage karne ki zaroorat nahi padti — bas factory se client maangna hai.",
  },
  {
    id: "httpclient-factory-tr-3",
    question: "Basic, named, aur typed client — teeno usage patterns me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Basic: CreateClient() bina naam ke, default config. Named: CreateClient(\"name\") string-key se configured clients ke liye. Typed: ek dedicated class jo HttpClient ko encapsulate karti hai, directly DI-injected.",
    detailedAnswer:
      "Basic pattern simplest hai, sirf ek generic client chahiye tab. Named clients tab useful hain jab multiple external services ke liye alag configuration (base URL, headers) chahiye ho bina dedicated class banaye. Typed clients sabse maintainable pattern hain — ek class (jaise WeatherApiClient) ke andar API-specific methods encapsulate hote hain, consumer sirf us class ko inject karta hai, HttpClient/factory wiring completely hidden rehta hai.",
    followUp: "Bade codebase me kaunsa pattern generally prefer kiya jaata hai aur kyun?",
  },
  {
    id: "httpclient-factory-tr-4",
    question: "Kya IHttpClientFactory se mila HttpClient manually Dispose() karna chahiye?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Nahi — factory-managed HttpClient instances ko dispose karna zaroori nahi hai, factory internally handler lifecycle manage karta hai.",
    detailedAnswer:
      "Ye ek common confusion hai — developers purani `using (var client = ...)` habit ko IHttpClientFactory ke saath bhi continue karne ki koshish karte hain. Lekin factory-created clients ka underlying handler pool se manage hota hai, isliye Dispose() call karna unnecessary hai (ye harmful nahi hai, lekin redundant hai — factory khud lifecycle handle karta hai).",
    redFlag: "Factory-created HttpClient ko bhi purani 'using' habit se dispose karna, ye samajhe bina ki factory ne poora problem hi different tareeke se solve kiya hai.",
  },
  {
    id: "httpclient-factory-tr-5",
    question: "Ek forever-reused single static HttpClient instance kyun 'complete' solution nahi hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Ye socket exhaustion to avoid kar deta hai, lekin DNS changes ko respect nahi karta — connection permanently purane resolved IP address se bound rehta hai.",
    detailedAnswer:
      "Agar ek HttpClient forever reuse ho, underlying connection pooled rehta hai ek specific resolved IP address ke against. Agar target server ka DNS record change ho jaaye (load balancer failover, server migration), static client purane, ab-invalid IP pe hi requests bhejta rahega jab tak app restart na ho. IHttpClientFactory handlers ko periodically recycle karta hai (default 2 minutes), isliye DNS changes eventually pick up ho jaate hain — ye static-client approach se better hai.",
  },
  {
    id: "httpclient-factory-tr-6",
    question: "Polly IHttpClientFactory ke saath kaise integrate hota hai, aur kya problem solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Microsoft.Extensions.Http.Polly package se `AddPolicyHandler` ke through retry/circuit-breaker/timeout policies directly HttpClient registration pe attach ki ja sakti hain — transient failures ke liye automatic, consistent resilience.",
    detailedAnswer:
      "External API calls transient failures (network blips, temporary 5xx errors) face kar sakti hain. Polly policies (jaise exponential-backoff retry) ko manually har call site pe implement karna duplicate aur inconsistent hota hai. `.AddHttpClient<T>(...).AddPolicyHandler(...)` se ek baar policy define karke, wo automatically har request pe apply hoti hai us typed/named client ke through, bina developer ko har jagah retry loop likhne ki zaroorat ke.",
    followUp: "Circuit breaker pattern retry se kaise different hai?",
  },
  {
    id: "httpclient-factory-tr-7",
    question: "Ek team production me intermittent SocketException dekh rahi hai, lekin sirf peak-traffic hours me, staging me kabhi nahi dikha. Ye kis common bug ka signature hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ye classic HttpClient socket exhaustion ka symptom hai — per-request HttpClient creation/disposal jo sirf high-traffic load ke under manifest hota hai.",
    detailedAnswer:
      "Ye exact pattern (low-traffic testing me invisible, high-traffic production me intermittent SocketException) socket exhaustion ka telltale sign hai — TIME_WAIT sockets sirf tab accumulate hote hain jab creation rate high ho. Fix: codebase me `new HttpClient()` per-request usage dhoondo aur IHttpClientFactory (preferably typed client pattern) pe migrate karo.",
    redFlag: "Is symptom ko sirf 'network flakiness' bol ke dismiss kar dena bina root cause investigate kiye — ye ek well-known, diagnosable pattern hai.",
  },
];

export default questions;
