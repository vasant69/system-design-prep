import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "controller-base-1",
    question: "Pure JSON Web API controllers ke liye Microsoft ki official recommendation kya hai?",
    options: [
      "`Controller` se derive karo, extra flexibility ke liye",
      "`ControllerBase` se derive karo, kyunki `Controller` unnecessary Razor view-support members add karta hai",
      "Kisi bhi base class se derive karna zaroori nahi",
      "Dono se ek saath multiple inheritance ke through derive karo",
    ],
    correctIndex: 1,
    explanation:
      "Microsoft explicitly recommend karta hai ki API-only controllers ControllerBase se derive karein, kyunki Controller class extra Razor view-rendering members (View(), ViewBag, ViewData) add karti hai jo pure JSON APIs me kabhi use nahi hote. Option A ulta advice hai. Option C galat hai — ASP.NET Core routing infrastructure ko controller base class chahiye. Option D galat hai — C# multiple class inheritance support hi nahi karta.",
    difficulty: "easy",
  },
  {
    id: "controller-base-2",
    question: "`Controller` class ka `ControllerBase` se exact relationship kya hai?",
    options: [
      "Dono completely independent classes hain",
      "`Controller` khud `ControllerBase` se derive karta hai aur extra view-support members add karta hai",
      "`ControllerBase` `Controller` se derive karta hai",
      "Dono interfaces hain, classes nahi",
    ],
    correctIndex: 1,
    explanation:
      "Controller ControllerBase se hi derive karta hai — ye ek inheritance chain hai jahan Controller sab kuch jo ControllerBase deta hai, wo bhi paata hai, plus Razor view-rendering (View(), ViewBag, ViewData) extra add karta hai. Option A galat hai, ye related hain. Option C relationship ko ulta bata raha hai. Option D factually galat hai, dono concrete classes hain.",
    difficulty: "medium",
  },
  {
    id: "controller-base-3",
    question: "Ek `BaseApiController` (jo `ControllerBase` extend karta hai) banane ka legitimate use case kya hai?",
    options: [
      "Har chhota helper method usme daal dena, chahe sirf ek controller use kare",
      "Genuinely cross-cutting logic ke liye jo saare (ya zyada) controllers share karte hain, jaise Result-to-HTTP-status mapping",
      "Kyunki `ControllerBase` directly extend karna allowed nahi hai",
      "Sirf naming convention follow karne ke liye, functional benefit koi nahi",
    ],
    correctIndex: 1,
    explanation:
      "BaseApiController worth hai jab genuinely shared, cross-cutting logic ho — jaise ek Result<T> ko IActionResult me convert karna, jo har controller me repeat hone se bachta hai. Option A overloading hai jo God-class anti-pattern banata hai. Option C factually galat hai, ControllerBase directly extend karna bilkul valid hai. Option D bhi galat hai, ye ek real functional benefit deta hai, sirf naming nahi.",
    difficulty: "medium",
  },
  {
    id: "controller-base-4",
    question: "`[ApiController]` attribute (ControllerBase ke saath use hone par) kya automatic behavior deta hai?",
    options: [
      "Kuch nahi, ye sirf documentation ke liye hai",
      "Invalid ModelState ko automatically detect karke action method run hone se pehle hi 400 response return karta hai",
      "Automatically Razor views render karta hai",
      "Automatically database migrations run karta hai",
    ],
    correctIndex: 1,
    explanation:
      "[ApiController] attribute model-validation short-circuiting enable karta hai — agar ModelState invalid hai, framework khud action method body run hone se pehle hi 400 Bad Request return kar deta hai, developer ko manually har action me if (!ModelState.IsValid) check karne ki zaroorat nahi padti. Option A galat hai, ye real runtime behavior change karta hai. Options C aur D completely unrelated, factually galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
