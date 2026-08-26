import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cts-and-cls-1",
    question: "CTS aur CLS ke beech sabse accurate relationship kya hai?",
    options: [
      "Dono exactly same cheez hain, sirf naam alag hai",
      "CLS, CTS ka ek narrower, opt-in-checked subset hai — har CLS-compliant type CTS-valid hai, lekin har CTS-valid type CLS-compliant nahi",
      "CTS, CLS ka subset hai",
      "CLS sirf VB.NET ke liye hai, CTS sirf C# ke liye",
    ],
    correctIndex: 1,
    explanation:
      "CTS poora CLR-level type-system rulebook hai (mandatory). CLS uska ek narrower subset hai jo guarantee karta hai ki koi type/API har `.NET` language me kaam karega — ye opt-in checked hota hai. Option A galat hai — dono ek nahi hain. Option C reverse relationship batata hai, galat hai. Option D galat hai — dono language-agnostic concepts hain, kisi specific language ke liye nahi.",
    difficulty: "medium",
  },
  {
    id: "cts-and-cls-2",
    question: "`uint` (unsigned int) ke baare me kaunsa statement sahi hai?",
    options: [
      "Ye na CTS na CLS ke against valid hai",
      "Ye ek valid CTS type hai, lekin CLS-compliant nahi hai",
      "Ye CLS-compliant hai lekin CTS ke against invalid hai",
      "Ye dono, CTS aur CLS, ke against fully compliant hai",
    ],
    correctIndex: 1,
    explanation:
      "`uint` CLR ke type system (CTS) ka ek valid part hai — CLR isko support karta hai. Lekin kai `.NET` languages unsigned types support nahi karte, isliye `uint` CLS-compliant nahi hai — ye exact wo gap hai jo CTS aur CLS ke fark ko demonstrate karta hai.",
    difficulty: "medium",
  },
  {
    id: "cts-and-cls-3",
    question: "CLS-compliance kaise enforce/check ki jaati hai ek assembly me?",
    options: [
      "Automatically, koi action nahi chahiye",
      "`[assembly: CLSCompliant(true)]` attribute lagakar — ye opt-in hai, compiler tabhi warnings deta hai",
      "Runtime pe exception throw hoti hai agar non-compliant ho",
      "Sirf VB.NET compiler ye check karta hai",
    ],
    correctIndex: 1,
    explanation:
      "CLS-compliance by default enforce nahi hoti — developer ko explicitly `[assembly: CLSCompliant(true)]` lagana padta hai, uske baad compiler public API me non-compliant members (jaise `uint` expose karna) ke against warnings deta hai. Ye compile-time hai, runtime exception nahi. Ye C# ke saath-saath har `.NET` language ke compiler ke liye applicable concept hai.",
    difficulty: "hard",
  },
  {
    id: "cts-and-cls-4",
    question: "Ek team ek public NuGet library likh rahi hai jo C#, F#, aur VB.NET teams dono consume karengi. CTS/CLS knowledge ka isme kya practical impact hai?",
    options: [
      "Koi impact nahi, sab languages automatically compatible hote hain",
      "Public API ko CLS-compliant rakhna chahiye (unsigned types avoid karna, case-sensitivity pe depend na karna) taaki sab consuming languages me guaranteed kaam kare",
      "Library ko har language ke liye alag se rewrite karna padega",
      "CLS sirf documentation ke liye hai, code pe koi effect nahi",
    ],
    correctIndex: 1,
    explanation:
      "Multi-language consumption ka scenario exactly wahi hai jahan CLS-compliance genuinely matter karta hai — public API surface ko CLS rules ke andar rakhna guarantee deta hai ki koi bhi CLS-compliant `.NET` language bina friction ke library use kar payegi. Option A galat hai — CTS sab kuch support karta hai lekin har feature har language me nahi. Option C unnecessary hai — same assembly sab languages se consume ho sakti hai agar CLS-compliant ho. Option D galat hai — ye actual compiler-checked constraint hai.",
    difficulty: "hard",
  },
];

export default quiz;
