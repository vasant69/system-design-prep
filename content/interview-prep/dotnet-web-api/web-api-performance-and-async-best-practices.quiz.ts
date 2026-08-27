import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "perf-async-1",
    question: "Sync-over-async pattern (.Result ya .Wait() ka use ek async method pe) high load pe sabse bada practical risk kya create karta hai ASP.NET Core me?",
    options: [
      "Application immediately crash ho jaata hai",
      "Thread pool exhaustion — blocked threads incoming requests process karne ke liye available threads kam kar dete hain, load badhne pe cascading slowdown",
      "Database connections automatically close ho jaate hain",
      "Memory leak turant occur hota hai",
    ],
    correctIndex: 1,
    explanation: "ASP.NET Core me by default SynchronizationContext nahi hoti, isliye classic deadlock kam common hai, lekin har blocked (.Result/.Wait()) call ek thread-pool thread ko bina kaam kiye occupy kar leta hai — high load pe ye threads exhaust ho sakte hain jisse naye requests process karne ke liye threads kam pad jaate hain. Options A, C, aur D sab galat/overstated claims hain.",
    difficulty: "hard",
  },
  {
    id: "perf-async-2",
    question: "Manually har request pe naya HttpClient create karna (using var client = new HttpClient()) kyun anti-pattern maana jaata hai?",
    options: [
      "HttpClient thread-safe nahi hai",
      "Har instance apna underlying socket connection hold karta hai; frequent create/dispose se sockets TIME_WAIT me accumulate hoke socket exhaustion ho sakta hai",
      "HttpClient sirf ek baar use kiya ja sakta hai poori application lifetime me",
      "Ye automatically memory leak create karta hai",
    ],
    correctIndex: 1,
    explanation: "Frequent HttpClient create/dispose se underlying sockets TIME_WAIT state me accumulate ho jaate hain high-throughput scenarios me, jo eventually socket exhaustion cause kar sakta hai. IHttpClientFactory is problem ko handler pooling/recycling se solve karta hai. Option A galat hai (HttpClient thread-safe hai), C galat hai (asal me opposite advice diya jaata tha static single instance ke liye, jo bhi DNS-change issue create karta), D overstated/imprecise hai.",
    difficulty: "medium",
  },
  {
    id: "perf-async-3",
    question: "EF Core me N+1 query pattern ko kaise fix kiya jaata hai typically?",
    options: [
      "Foreach loop ko parallel loop me convert karke",
      "Include() se eager loading use karke, taaki related data ek hi query (JOIN) me fetch ho jaaye",
      "AsNoTracking() add karke",
      "Database connection pool size badhaa kar",
    ],
    correctIndex: 1,
    explanation: "N+1 pattern tab hota hai jab ek query ke baad loop me har item ke liye alag related-data query chalti hai. Include() use karke related data eager-load kiya ja sakta hai ek single JOIN query me, jo N extra round-trips eliminate karta hai. Option A actual problem solve nahi karta (queries phir bhi alag-alag chalengi, bas parallel), C aur D relevant optimizations hain but N+1 ka root cause fix nahi karte.",
    difficulty: "medium",
  },
  {
    id: "perf-async-4",
    question: "ValueTask<T> ko Task<T> ke bajaye use karne ka genuine benefit kab milta hai, aur is se related kya caveat hai?",
    options: [
      "ValueTask hamesha faster hota hai, koi caveat nahi hai — hamesha use karna chahiye",
      "Benefit milta hai jab method zyadatar synchronously complete hota hai (allocation avoid hoti hai); caveat ye hai ki ValueTask ko multiple baar await karna ya store karke baad me use karna undefined behavior create kar sakta hai",
      "ValueTask sirf void-return methods ke liye use hota hai",
      "ValueTask database calls ko automatically cache kar deta hai",
    ],
    correctIndex: 1,
    explanation: "ValueTask<T> heap allocation avoid karta hai jab result synchronously available ho (jaise cache hit) — genuinely hot, high-frequency, mostly-synchronous paths me useful hai. Lekin Task ke unlike ise sirf ek baar consume karne ke liye design kiya gaya hai — multiple await ya later reuse undefined behavior create kar sakta hai. Option A ek galat oversimplification hai, C aur D bilkul galat/irrelevant claims hain.",
    difficulty: "hard",
  },
];

export default quiz;
