import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "filters-1",
    question: "Filters aur middleware me sabse fundamental difference kya hai?",
    options: [
      "Filters sirf authentication ke liye hote hain, middleware baaki sab ke liye",
      "Filters ko MVC action-level context (controller, action, arguments) pata hota hai; middleware ko sirf raw HttpContext milta hai",
      "Middleware sirf development environment me chalta hai",
      "Dono bilkul same cheez hain, sirf naming convention alag hai",
    ],
    correctIndex: 1,
    explanation:
      "Filters MVC pipeline ke andar, action-invocation ke context ke saath chalte hain — inhe pata hota hai kaunsa controller/action/arguments hain. Middleware poori HTTP pipeline ko wrap karta hai, isse sirf HttpContext milta hai, MVC-specific detail nahi. Option A galat hai, filters sirf authentication tak limited nahi. Option C factually galat hai. Option D bhi galat hai, dono genuinely alag mechanisms hain.",
    difficulty: "medium",
  },
  {
    id: "filters-2",
    question: "ASP.NET Core filters kis exact order me execute hote hain?",
    options: [
      "Result, Exception, Action, Resource, Authorization",
      "Authorization, Resource, Action, Exception, Result",
      "Sab ek saath parallel me",
      "Order random hota hai, framework decide karta hai runtime pe",
    ],
    correctIndex: 1,
    explanation:
      "Exact, fixed order hai: Authorization filters (sabse pehle) → Resource filters → Action filters → Exception filters (agar exception aaye) → Result filters. Ye ek well-documented, memorizable fact hai. Option A order ko ulta bata raha hai. Options C aur D dono factually galat hain — order sequential aur fixed hai.",
    difficulty: "hard",
  },
  {
    id: "filters-3",
    question: "`[LogExecutionTime]` jaisa custom attribute lagane ke baad, wo kaise 'execute' hota hai?",
    options: [
      "Attribute khud automatically ek background thread pe run ho jaata hai",
      "Framework reflection ke through action ko inspect karta hai, attribute discover karta hai, aur usko pipeline me invoke karta hai — koi explicit call ki zaroorat nahi",
      "Developer ko manually har action me attribute ka method call karna padta hai",
      "Attribute sirf documentation purpose ke liye hai, koi runtime behavior nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "Ye declarative/metadata-driven pattern ka core hai — attribute sirf metadata attach karta hai; ASP.NET Core framework reflection use karke actions ko inspect karta hai, unpe declare hue filter attributes ko discover karta hai, aur automatically invoke karta hai request-handling ke sahi point pe. Option A galat hai, koi automatic background thread involved nahi. Option C is pattern ka pura point miss karta hai — explicit call ki zaroorat hi nahi hoti. Option D galat hai, filter attributes ka real runtime effect hota hai (jab wo IFilterMetadata implement karte hain).",
    difficulty: "hard",
  },
  {
    id: "filters-4",
    question: "`ActionFilterAttribute` extend karke likha gaya ek custom filter kis base class se ultimately derive karta hai?",
    options: ["IDisposable", "System.Attribute", "ControllerBase", "System.Object hi directly, koi intermediate nahi"],
    correctIndex: 1,
    explanation:
      "ActionFilterAttribute (aur saare filter attributes) System.Attribute se derive karte hain — ye .NET ka base class hai jisse har custom attribute ultimately aata hai, chahe woh filter ho ya koi simple marker attribute. Option A galat hai, IDisposable se koi relation nahi. Option C galat hai, ControllerBase controllers ke liye hai, attributes ke liye nahi. Option D technically har type System.Object se aata hai lekin System.Attribute ek zaroori intermediate hai jo skip nahi hota.",
    difficulty: "medium",
  },
];

export default quiz;
