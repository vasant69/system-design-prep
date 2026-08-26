import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "httpclient-factory-1",
    question:
      "`using (var client = new HttpClient())` pattern ko har request pe use karna production me kya problem cause karta hai?",
    options: [
      "Memory leak, kyunki HttpClient garbage collect nahi hota",
      "Socket exhaustion — disposed HttpClient ka underlying TCP socket TIME_WAIT state me linger karta hai, high traffic me sockets exhaust ho jaate hain",
      "Compile-time error",
      "HTTP requests slower response time dete hain, koi failure nahi",
    ],
    correctIndex: 1,
    explanation:
      "Jab HttpClient dispose hota hai, uska underlying TCP socket turant release nahi hota — OS level pe TIME_WAIT state me kuch minutes tak rehta hai. High-frequency per-request creation/disposal me, naye sockets banne ki rate release hone ki rate se zyada ho jaati hai, jisse eventually SocketException aata hai. Option A galat hai — ye memory leak nahi, socket-level issue hai. Option C galat hai — ye syntactically valid code hai. Option D galat hai — ye eventually genuine failures (exceptions) deta hai, sirf slowness nahi.",
    difficulty: "hard",
  },
  {
    id: "httpclient-factory-2",
    question:
      "`IHttpClientFactory` internally kis cheez ko pool/reuse karta hai jo socket exhaustion solve karta hai?",
    options: [
      "HttpClient instances ko khud",
      "Underlying HttpMessageHandler (connection pooling manage karta hai)",
      "DNS cache entries",
      "HTTP response bodies",
    ],
    correctIndex: 1,
    explanation:
      "IHttpClientFactory ka core insight ye hai ki HttpClient khud lightweight hai, lekin uska underlying HttpMessageHandler expensive/pool-worthy hai kyunki wo actual connection pooling manage karta hai. Factory handlers ko internally pool karke reuse karta hai multiple HttpClient instances ke beech. Options A, C, aur D iske actual mechanism ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "httpclient-factory-3",
    question:
      "Typed client pattern ka main advantage kya hai named client pattern ke comparison me?",
    options: [
      "Typed clients faster hain",
      "External API interaction logic ek dedicated class me encapsulate hota hai, consumer ko IHttpClientFactory ka existence pata nahi hona padta",
      "Named clients .NET Framework me kaam nahi karte",
      "Typed clients socket exhaustion se immune hain, named clients nahi",
    ],
    correctIndex: 1,
    explanation:
      "Typed clients (ek dedicated class jo HttpClient wrap karti hai, jaise WeatherApiClient) API interaction logic ko cleanly encapsulate karte hain, aur consumer classes directly us dedicated class ko inject karti hain bina IHttpClientFactory ke saath directly deal kiye. Ye cleanest, most maintainable pattern hai bade codebases me. Option A galat hai (performance same hai). Options C aur D factually galat hain — dono patterns socket exhaustion se equally protected hain, ye IHttpClientFactory ka hi benefit hai.",
    difficulty: "medium",
  },
  {
    id: "httpclient-factory-4",
    question:
      "Ek forever-reused single static `HttpClient` instance (bina IHttpClientFactory ke) socket exhaustion to avoid kar deta hai, lekin iska kya downside hai?",
    options: [
      "Koi downside nahi, ye perfect solution hai",
      "Ye DNS changes ko respect nahi karta — connection pooled rehta hai purane resolved IP address pe",
      "Ye memory leak create karta hai",
      "Ye thread-safe nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Ek forever-reused static HttpClient socket exhaustion to avoid kar deta hai (koi frequent dispose/recreate nahi), lekin ye DNS resolution changes ko miss kar sakta hai — agar target server ka DNS record change ho jaaye (jaise failover/load-balancer switch), pooled connection purane IP pe hi connected rehta hai. IHttpClientFactory is trade-off ko bhi handle karta hai (handler lifetime management ke through). Options C aur D factually galat hain — HttpClient khud thread-safe hai for concurrent requests.",
    difficulty: "hard",
  },
];

export default quiz;
