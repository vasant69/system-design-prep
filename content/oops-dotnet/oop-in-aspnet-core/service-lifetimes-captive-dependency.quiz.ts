import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lifetimes-1",
    question: "`AppDbContext` `AddDbContext<T>()` ke through register hone par default kaunsi lifetime paata hai?",
    options: ["Transient", "Scoped", "Singleton", "Koi default nahi, manually specify karna zaroori hai"],
    correctIndex: 1,
    explanation:
      "AddDbContext<T>() by default DbContext ko Scoped register karta hai — ek instance per HTTP request. Ye exactly isi wajah se important hai ki captive dependency bugs zyadatar DbContext ke saath hi hote hain. Option A/C galat hain, default Transient/Singleton nahi hai. Option D galat hai, ek sensible default already set hota hai.",
    difficulty: "easy",
  },
  {
    id: "lifetimes-2",
    question: "Captive dependency exactly tab hoti hai jab:",
    options: [
      "Ek Transient service ek Singleton inject karta hai",
      "Ek Singleton service ek Scoped ya Transient dependency ko constructor me inject karta hai",
      "Do Scoped services ek doosre ko inject karte hain",
      "Ek Scoped service dispose nahi hota request ke baad",
    ],
    correctIndex: 1,
    explanation:
      "Captive dependency tab hota hai jab longer-lived service (Singleton) ek shorter-lived dependency (Scoped/Transient) ko capture karta hai constructor me — us shorter-lived instance ki effective lifetime ab Singleton jaisi ban jaati hai. Option A ulta hai — ye bilkul valid hai, koi issue nahi. Option C aur D alag scenarios hain jo captive dependency define nahi karte.",
    difficulty: "hard",
  },
  {
    id: "lifetimes-3",
    question: "`ValidateScopes` setting ka Development aur Production environment me kya default behavior hai?",
    options: [
      "Dono me hamesha true",
      "Dono me hamesha false",
      "Development me default true (catches captive dependency at startup), Production me default false (perf ke liye)",
      "Ye setting sirf unit tests me applicable hai",
    ],
    correctIndex: 2,
    explanation:
      "ValidateScopes Development environment me default true hota hai, jo captive dependency ko app startup pe hi InvalidOperationException ke through catch kar leta hai. Production me perf reasons se ye default false hota hai — isliye agar sirf Production config me test kiya jaaye to ye bug silently ship ho sakta hai. Options A, B, D factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "lifetimes-4",
    question: "Ek Singleton `BackgroundService` ko `DbContext` chahiye hai kaam karne ke liye. Correct approach kya hai?",
    options: [
      "Directly constructor me DbContext inject kar lo, ASP.NET Core khud handle kar lega",
      "IServiceScopeFactory inject karo aur zaroorat padne par CreateScope() se fresh DbContext resolve karo",
      "DbContext ko static field me store kar do poore app ke liye",
      "DbContext ki jagah raw SQL connection string hardcode kar do",
    ],
    correctIndex: 1,
    explanation:
      "IServiceScopeFactory inject karke, jab actual kaam karna ho tab CreateScope() se ek fresh scope banao aur usme se DbContext resolve karo — ye Scoped ki lifetime ko sahi respect karta hai, per-use fresh instance milta hai. Option A exactly wahi captive dependency bug create karega jo topic explain karta hai. Options C aur D bade anti-patterns hain jo thread-safety aur maintainability dono kharab karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
