import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "exceptions-1",
    question: "Custom exception class kab banani chahiye?",
    options: [
      "Har naye error scenario ke liye, taaki naming clear rahe",
      "Sirf jab caller ko us specific failure ko genuinely alag tareeke se handle karna ho, aur built-in type kaam na aaye",
      "Kabhi nahi, hamesha generic Exception hi throw karna chahiye",
      "Sirf jab exception cross-AppDomain jaana ho",
    ],
    correctIndex: 1,
    explanation:
      "Custom exception ka fayda tabhi hai jab caller ko us failure ko specifically catch karke alag handle karna ho, ideally structured extra data ke saath. Option A unnecessary type clutter create karta hai. Option C galat hai — specific exceptions callers ke liye zyada useful hote hain. Option D ek outdated/narrow scenario hai, aaj ke .NET me largely irrelevant.",
    difficulty: "medium",
  },
  {
    id: "exceptions-2",
    question: "Custom exception class kis class se inherit karni chahiye modern .NET guidance ke hisaab se?",
    options: [
      "ApplicationException",
      "Exception",
      "SystemException",
      "Object",
    ],
    correctIndex: 1,
    explanation:
      "Modern Microsoft guidance hai directly Exception se inherit karna. ApplicationException legacy guidance thi jo ab deprecated maani jaati hai. SystemException .NET runtime ke apne exceptions ke liye reserved hai, custom exceptions ke liye nahi. Object bahut generic hai, Exception hierarchy ka part hi nahi hai directly.",
    difficulty: "medium",
  },
  {
    id: "exceptions-3",
    question: "throw ex; aur throw; me exact difference kya hai ek catch block ke andar?",
    options: [
      "Dono bilkul same hain, koi difference nahi",
      "throw ex; original stack trace ko reset kar deta hai; throw; original stack trace preserve karta hai",
      "throw; sirf custom exceptions ke liye kaam karta hai",
      "throw ex; naya exception object banata hai, throw; nahi",
    ],
    correctIndex: 1,
    explanation:
      "throw; current exception ko as-is rethrow karta hai, original stack trace intact rehti hai — debugging ke liye better. throw ex; treat karta hai jaise ek naya throw ho raha ho current location se, isliye original failure point ki stack trace information lose ho jaati hai. Options C aur D dono factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "exceptions-4",
    question: "Ye anti-pattern kaunsa hai — 'User not found' jaisi expected condition ke liye exception throw karna?",
    options: [
      "Ye best practice hai, sab errors exceptions hi honi chahiye",
      "Exceptions ko control flow ke liye use karna — expected/frequent outcomes ke liye nullable return ya result pattern better hota hai",
      "Ye sirf performance issue hai, design issue nahi",
      "Ye sirf tab problem hai jab async method ho",
    ],
    correctIndex: 1,
    explanation:
      "Exceptions exceptional, unexpected conditions ke liye hain. 'Not found' jaisa expected outcome ek regular case hai, isko exception se model karna performance (stack trace capture) aur readability (normal flow bhi try/catch se guzarta hai) dono ko hurt karta hai. Option A galat hai — ye core anti-pattern hai. Option C incomplete hai, ye design issue bhi hai. Option D irrelevant constraint hai.",
    difficulty: "medium",
  },
];

export default quiz;
