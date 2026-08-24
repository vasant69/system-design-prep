import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "diamond-problem-1",
    question: "`interface IA { void Ping() => ...; } interface IB { void Ping() => ...; } class C : IA, IB { }` — kya hoga?",
    options: [
      "Compile ho jaayega, IA ka Ping() automatically use hoga (pehla interface)",
      "Compile error — na IA na IB ka default 'most specific' hai, C ko khud resolve karna padega",
      "Runtime exception aayega jab Ping() call ho",
      "Dono default implementations ek saath chalenge",
    ],
    correctIndex: 1,
    explanation:
      "Jab do unrelated interfaces same-signature member ke liye default implementation dete hain, compiler kisi ek ko automatically nahi choose karta — ye compile-time error hai jab tak class khud (public implementation ya dono explicit implementations ke through) ambiguity resolve na kare. Option A galat hai, koi 'pehla interface jeetega' jaisa rule nahi hai. Option C galat hai, ye compile time pe hi pakda jaata hai. Option D galat hai, do implementations same call pe simultaneously nahi chal sakte.",
    difficulty: "hard",
  },
  {
    id: "diamond-problem-2",
    question: "Upar wale IA/IB/C scenario ko fix karne ke DO tareeke kya hain?",
    options: [
      "Sirf ek interface ko delete karna",
      "C apna khud ka public Ping() implementation de, YA dono ko explicit implementation ke through resolve kare",
      "IA aur IB ko same interface me merge karna hi ek option hai",
      "C# me isse fix karna possible hi nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Do valid fixes hain: (1) class apna khud ka public implementation de, jo automatically 'most specific' maana jaata hai aur dono interface references se call hone par yahi chalega; (2) dono ko explicitly implement karo alag bodies ke saath, agar genuinely alag behavior chahiye har interface ke liye. Option A aur C practical/necessary fixes nahi hain — original design ko todhna padta. Option D galat hai, ye ek well-defined, resolvable scenario hai.",
    difficulty: "medium",
  },
  {
    id: "diamond-problem-3",
    question: "C# me classic 'multiple base class' diamond problem (jaisa C++ me hota hai) kyun nahi hota?",
    options: [
      "Kyunki C# me interfaces exist hi nahi karte",
      "Kyunki C# multiple class inheritance allow hi nahi karta — ek class sirf ek base class extend kar sakti hai",
      "Kyunki C# me sab methods automatically virtual hote hain",
      "Kyunki .NET runtime automatically ambiguity resolve kar leta hai",
    ],
    correctIndex: 1,
    explanation:
      "C# language design se hi multiple class inheritance disallow karta hai (`class C : A, B` jahan A, B dono classes hain — seedha compile error) — isliye classic multi-base-class diamond ambiguity scenario exist hi nahi kar sakta. Option A galat hai, interfaces C# me core feature hain. Option C ek unrelated, factually galat statement hai. Option D galat hai, .NET runtime kuch automatically resolve nahi karta — ye language-level restriction hai jo problem ko hone hi nahi deta.",
    difficulty: "medium",
  },
  {
    id: "diamond-problem-4",
    question: "Ye diamond-via-DIM ambiguity scenario kis C# version se possible hua, aur kyun usse pehle nahi tha?",
    options: [
      "C# 1.0 se, kyunki interfaces hamesha se the",
      "C# 8 se, kyunki tabhi interfaces ko default implementation dene ki permission mili (DIM)",
      "C# 9 se, records ke saath",
      "Ye kabhi possible nahi tha, sirf theoretical hai",
    ],
    correctIndex: 1,
    explanation:
      "Pre-C#-8 interfaces me koi implementation allowed hi nahi thi — sirf signatures. Do interfaces ka same-signature member sirf ek naming collision tha, koi genuine ambiguity nahi (explicit implementation se trivially resolve ho jaata). Genuine 'competing default implementations' ka ambiguity scenario tabhi possible hua jab C# 8 me default interface methods aaye. Option A aur C dono galat versions hain. Option D galat hai, ye ek real, documented, reproducible compile-time scenario hai C# 8+ me.",
    difficulty: "hard",
  },
];

export default quiz;
