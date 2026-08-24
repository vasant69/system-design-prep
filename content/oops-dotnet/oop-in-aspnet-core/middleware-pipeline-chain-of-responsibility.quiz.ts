import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "middleware-cor-1",
    question: "ASP.NET Core ka middleware pipeline kaunse design pattern ka concrete implementation hai?",
    options: ["Singleton", "Chain of Responsibility", "Observer", "Factory"],
    correctIndex: 1,
    explanation:
      "Middleware pipeline Chain of Responsibility pattern ka implementation hai — har middleware ek handler hai jo request ko khud handle kar sakta hai, agle handler ko pass kar sakta hai, ya dono. Options A, C, D alag patterns hain jo is exact structure ko describe nahi karte — Singleton object creation se related hai, Observer event subscription se, Factory object creation se.",
    difficulty: "medium",
  },
  {
    id: "middleware-cor-2",
    question: "Middleware pipeline me polymorphism kahan dikhta hai?",
    options: [
      "Har middleware ek alag base class se inherit karta hai",
      "Pipeline ke perspective se har middleware same InvokeAsync(HttpContext) shape follow karta hai, chahe internal logic kuch bhi ho",
      "Middleware me polymorphism ka koi role nahi hai",
      "Sirf authentication middleware polymorphic hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Pipeline sirf itna janta hai ki har middleware ek consistent shape (InvokeAsync/Invoke, HttpContext accept karke Task return karna) follow karta hai — internal implementation completely alag ho sakti hai (logging vs auth vs exception handling). Ye 'same contract, alag implementations' hi polymorphism hai. Option A galat hai — convention-based middleware ko formal inheritance ki zaroorat nahi. Option C aur D dono factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "middleware-cor-3",
    question: "`app.UseAuthorization()` ko `app.UseAuthentication()` se pehle likhne par kya hoga?",
    options: [
      "Compile error aayega",
      "App startup pe crash hoga",
      "Silently authorization checks fail ho sakte hain kyunki authenticated User context abhi populate nahi hua",
      "Koi fark nahi padta, order matter nahi karta",
    ],
    correctIndex: 2,
    explanation:
      "Middleware order runtime concern hai, compile-time nahi. Agar Authorization Authentication se pehle aata hai, authorization checks ke paas koi authenticated User nahi hoga check karne ke liye, jisse requests galat tarike se unauthorized treat ho sakti hain — silently, koi crash ya compile error ke bina. Options A aur B galat hain, ye compile-time ya immediate-crash error nahi hai. Option D bhi galat hai — order genuinely matter karta hai.",
    difficulty: "hard",
  },
  {
    id: "middleware-cor-4",
    question: "Ek middleware chain ko 'short-circuit' karne ka matlab kya hai?",
    options: [
      "Middleware crash ho jaata hai exception ke saath",
      "Middleware apni khud ki response generate karke `next()` ko call nahi karta, chain wahin ruk jaati hai",
      "Do middleware parallel me chalte hain",
      "Middleware pipeline se completely remove ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Short-circuiting ka matlab hai ek middleware decide karta hai ki wo khud response de dega aur age chain continue karne ki zaroorat nahi (jaise authentication fail hone par 401 return karna) — bas `next()` ko call nahi karta. Option A ek unrelated failure mode hai. Option C galat hai — pipeline sequential hai, parallel nahi. Option D bhi galat hai, middleware registered hi rehta hai, sirf is particular request ke liye chain aage nahi badhi.",
    difficulty: "medium",
  },
];

export default quiz;
