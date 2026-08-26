import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "config-ioptions-1",
    question:
      "`appsettings.json` me `Timeout: 30` hai aur ek environment variable `Timeout=60` set hai. Runtime pe konsi value use hogi?",
    options: [
      "30, kyunki JSON files priority me pehle hain",
      "60, kyunki environment variables JSON files ke baad register hote hain aur unhe override karte hain",
      "Dono values merge ho jaayengi kisi tarah",
      "Runtime error aayega, duplicate key conflict",
    ],
    correctIndex: 1,
    explanation:
      "Configuration providers ek chain me register hote hain, aur baad me register hone wala provider pehle wale ko override karta hai. Environment variables JSON files ke baad register hote hain, isliye unki value jeetegi — yahan 60. Option A order galat samajhta hai. Option C aur D — configuration merge scalar values ke liye replace karta hai, error nahi deta.",
    difficulty: "medium",
  },
  {
    id: "config-ioptions-2",
    question:
      "Ek Singleton service ke andar config chahiye jo live-reload ho (file change hone par turant reflect ho) — kaunsa IOptions variant use karoge?",
    options: [
      "IOptions<T>, kyunki Singleton services ke saath yahi compatible hai",
      "IOptionsSnapshot<T>, kyunki wo reload karta hai",
      "IOptionsMonitor<T>, kyunki ye Singleton hai aur CurrentValue live-update hoti hai",
      "Koi bhi variant kaam karega, sab same reload karte hain",
    ],
    correctIndex: 2,
    explanation:
      "IOptionsMonitor<T> Singleton lifetime hai (Singleton service me directly inject ho sakta hai) aur `.CurrentValue` real-time updated rehti hai jab underlying source change ho. IOptions<T> (Option A) Singleton hai lekin reload nahi karta. IOptionsSnapshot<T> (Option B) Scoped hai — Singleton service me directly inject nahi ho sakta, DI validation error dega.",
    difficulty: "hard",
  },
  {
    id: "config-ioptions-3",
    question: "Environment variable me nested config key (jaise `Feature:Enabled`) kaise likha jaata hai?",
    options: [
      "Feature:Enabled — colon exactly waisi hi jaisi JSON me",
      "Feature__Enabled — double underscore se colon ko replace kiya jaata hai",
      "Feature.Enabled — dot notation",
      "FeatureEnabled — koi separator nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "Colon (`:`) most shells/OS environment-variable naming me problematic hota hai, isliye ASP.NET Core convention hai double underscore (`__`) use karna jo internally colon ke equivalent treat hota hai. Options A, C, D in me se koi bhi actual convention nahi hai.",
    difficulty: "medium",
  },
  {
    id: "config-ioptions-4",
    question:
      "`IOptionsSnapshot<T>` ko ek Singleton-registered service ke constructor me directly inject karne ki koshish karne par kya hota hai?",
    options: [
      "Bina kisi issue ke kaam karta hai, koi difference nahi",
      "DI container captive-dependency mismatch detect karta hai — validation enabled hone par startup pe exception aata hai",
      "Value automatically Singleton scope me convert ho jaati hai",
      "IOptionsSnapshot silently IOptions ki tarah behave karne lagta hai",
    ],
    correctIndex: 1,
    explanation:
      "IOptionsSnapshot<T> Scoped lifetime hai. Ek Scoped dependency ko Singleton service me directly inject karna captive-dependency problem hai — .NET's DI container scope validation (jab enabled ho, jo Development environment me default hoti hai) startup pe hi is mismatch ko catch kar leta hai. Options A, C, D sab galat premises hain — ye silently kaam nahi karta.",
    difficulty: "hard",
  },
];

export default quiz;
