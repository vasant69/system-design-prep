import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "middleware-pipeline-deep-dive-1",
    question: "Agar UseAuthorization() ko UseAuthentication() se pehle register kar diya jaaye to kya hota hai?",
    options: [
      "Kuch farak nahi padta, dono order-independent hain",
      "Authorization checks user identity establish hone se pehle chalte hain, so requests galat tarike se unauthorized ho sakti hain",
      "App startup pe hi crash ho jaata hai",
      "Routing kaam karna band kar deta hai",
    ],
    correctIndex: 1,
    explanation: "Authentication HttpContext.User set karta hai; authorization usi identity pe decision leta hai. Order swap karne pe authorization ko user identity milti hi nahi, isliye behavior unreliable ho jaata hai. Ye startup-crash nahi karta, aur routing se iska direct relation nahi — sirf auth decisions galat hote hain.",
    difficulty: "medium",
  },
  {
    id: "middleware-pipeline-deep-dive-2",
    question: "app.Run() aur app.Use() me core difference kya hai?",
    options: [
      "Run() sirf production me kaam karta hai, Use() sirf development me",
      "Run() terminal middleware hai (no next parameter), Use() pipeline continue karta hai next() call karke",
      "Run() sirf synchronous code allow karta hai",
      "Dono same hain, sirf naming convention alag hai",
    ],
    correctIndex: 1,
    explanation: "app.Run() pipeline ka end mark karta hai — uske delegate me next parameter hota hi nahi. app.Use() ek pass-through middleware hai jo next() call karke control aage bhejta hai. Environment ya sync/async se koi lena-dena nahi hai.",
    difficulty: "easy",
  },
  {
    id: "middleware-pipeline-deep-dive-3",
    question: "Class-based middleware ke constructor me DbContext (scoped service) inject karna kyun problematic hai?",
    options: [
      "DbContext middleware classes me kabhi bhi use nahi ho sakta",
      "Constructor sirf ek baar app startup pe chalta hai, isliye scoped service effectively singleton ki tarah behave karta hai — stale/shared state ka risk",
      "Isse app boot hi nahi hoga",
      "DbContext ko sirf controllers me inject kiya ja sakta hai",
    ],
    correctIndex: 1,
    explanation: "Middleware constructor pipeline build ke time sirf ek baar chalta hai, per-request nahi. Scoped service (jaise DbContext) ko constructor me lena us instance ko poori app lifetime ke liye pin kar deta hai. Sahi tareeka InvokeAsync method parameter se inject karna hai, jo per-request resolve hota hai.",
    difficulty: "hard",
  },
  {
    id: "middleware-pipeline-deep-dive-4",
    question: "UseWhen() aur Map() me kya farak hai?",
    options: [
      "UseWhen() sirf GET requests pe kaam karta hai",
      "Map() pipeline ko permanently fork karta hai; UseWhen() ek nested branch chalata hai lekin condition ke baad main pipeline me wapas aa jaata hai",
      "Dono exactly same kaam karte hain",
      "UseWhen() sirf authentication ke liye use hota hai",
    ],
    correctIndex: 1,
    explanation: "Map()/MapWhen() branch ko permanent split kar dete hain — us branch me se wapas main pipeline continue karwana easy nahi hota. UseWhen() condition true hone pe nested pipeline chalata hai, aur uske baad control wapas main pipeline me continue hota hai — isliye targeted logic (jaise ek route group pe extra logging) ke liye zyada flexible hai.",
    difficulty: "medium",
  },
];

export default quiz;
