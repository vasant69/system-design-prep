import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "ratelimit-cache-1",
    question: "Token bucket rate limiting fixed window ke comparison me kaunsa specific problem solve karta hai?",
    options: [
      "Ye rate limiting ko authentication mechanism bana deta hai",
      "Ye window-boundary burst issue kam karta hai — bucket short bursts naturally accommodate karti hai jab tak tokens available hain, jabki sustained overuse still control me rehta hai",
      "Ye database load ko completely eliminate kar deta hai",
      "Ye sirf concurrent requests ko limit karta hai, rate ko nahi",
    ],
    correctIndex: 1,
    explanation: "Token bucket ek fixed rate se refill hone wali bucket use karta hai — short bursts (jab tak tokens available hain) naturally accommodate ho jaate hain, jabki fixed window ke boundary pe predictable double-burst exploit possible hota hai. Option A galat hai (rate limiting authorization nahi hai), C overclaim hai, D concurrency limiter ka description hai token bucket ka nahi.",
    difficulty: "medium",
  },
  {
    id: "ratelimit-cache-2",
    question: "Output caching middleware response caching middleware se fundamentally kaise alag hai?",
    options: [
      "Output caching sirf HTTP headers set karta hai, response caching actual storage karta hai",
      "Output caching server-side hi response store karta hai aur cache-hit pe endpoint logic dobara execute hi nahi hota; response caching sirf Cache-Control headers set karta hai jo client/proxy honor karte hain",
      "Dono exactly same cheez karte hain, sirf naam alag hai",
      "Response caching sirf POST requests ke liye kaam karta hai",
    ],
    correctIndex: 1,
    explanation: "Output caching server-side actual response store karta hai — cache-hit pe endpoint code re-run hi nahi hota, jisse server load genuinely kam hota hai. Response caching sirf headers set karta hai, actual caching client/CDN/proxy pe depend karti hai. Option A statement ulta hai, C galat hai (genuinely different mechanisms), D irrelevant/galat hai.",
    difficulty: "medium",
  },
  {
    id: "ratelimit-cache-3",
    question: "Personalized ya authorization-dependent API response ko output-cache karte waqt sabse bada risk kya hai agar cache key properly design na ho?",
    options: [
      "Response thoda slow ho jaayega",
      "Ek user ka cached response galti se doosre user ko serve ho sakta hai — genuine data-leak security bug",
      "Rate limiter automatically trigger ho jaayega",
      "Endpoint har request pe crash karega",
    ],
    correctIndex: 1,
    explanation: "Agar cache key me user-identity include na ho, ek user ka personalized/authorization-specific cached response galti se doosre authenticated user ko mil sakta hai — ye ek genuine cross-user data-leak vulnerability hai. VaryByValue me user identity explicitly include karna zaroori hai per-user data ke liye. Options A, C, aur D actual risk ko capture nahi karte.",
    difficulty: "hard",
  },
  {
    id: "ratelimit-cache-4",
    question: "Rate-limited requests jo reject hoti hain, typically kaunsa HTTP status code return karti hain?",
    options: [
      "403 Forbidden",
      "500 Internal Server Error",
      "429 Too Many Requests, often with a Retry-After header",
      "401 Unauthorized",
    ],
    correctIndex: 2,
    explanation: "Rate-limited/rejected requests standard practice ke hisaab se 429 Too Many Requests return karti hain, aksar Retry-After header ke saath jo client ko batata hai kitni der baad retry karna chahiye. 403 authorization-failure ke liye hai, 500 server error ke liye, 401 authentication-failure ke liye — in me se koi bhi rate-limiting ka standard response code nahi hai.",
    difficulty: "easy",
  },
];

export default quiz;
