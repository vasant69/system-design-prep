import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "inheritance-1",
    question: "C# `class C : A, B` (do classes se ek saath inherit) kyun compile error deta hai?",
    options: [
      "Syntax typo hai, comma allowed nahi hai",
      "Diamond problem se bachne ke liye — agar A aur B dono same member define karein, compiler ambiguously resolve nahi kar sakta kaunsa use kare",
      "C# me classes inherit hi nahi kar sakti",
      "Performance reasons se disallow kiya gaya hai",
    ],
    correctIndex: 1,
    explanation:
      "C# design-time hi multiple class inheritance disallow karta hai taaki diamond problem (ambiguous method resolution jab do base classes same member define karein) kabhi exist hi na kare. Option A galat hai, syntax rule nahi hai — semantic design decision hai. Option C factually galat hai. Option D irrelevant hai, ye ek correctness/design decision hai, performance se nahi.",
    difficulty: "medium",
  },
  {
    id: "inheritance-2",
    question: "Ek class kitni interfaces implement kar sakti hai, aur kitni base classes se inherit kar sakti hai?",
    options: [
      "Unlimited interfaces, unlimited base classes",
      "Unlimited interfaces, sirf ek base class",
      "Sirf ek interface, unlimited base classes",
      "Sirf ek interface, sirf ek base class",
    ],
    correctIndex: 1,
    explanation:
      "C# ka core asymmetry: interfaces jitne chaho implement karo (no limit), lekin class inheritance sirf single hi hai — ek hi direct base class. Ye 1-vs-many rule diamond problem avoid karne ke liye hai, kyunki interface implementation ambiguity-free hai (default interface methods ka narrow edge case chhodkar).",
    difficulty: "easy",
  },
  {
    id: "inheritance-3",
    question: "Interfaces multiple implementation allow karte hue bhi diamond problem se generally kaise bachte hain?",
    options: [
      "Interfaces me methods kabhi call hi nahi hote",
      "Kyunki (default interface methods se pehle) interface sirf signature define karta tha, koi implementation nahi — actual implementation ek hi jagah, implementing class ke andar, hoti hai",
      "Kyunki interfaces static hote hain",
      "Kyunki C# interfaces ko automatically merge kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Chunki interface method (default interface methods se pehle) sirf ek contract tha, koi behavior nahi — jab class do interfaces implement karti hai jo same-signature method declare karte hain, class khud ek hi implementation likhti hai jo dono contracts satisfy karti hai. Koi do competing implementations nahi hoti, isliye ambiguity nahi. Options A, C, D factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "inheritance-4",
    question: "'Fragile base class problem' kya describe karta hai?",
    options: [
      "Base class ka code hamesha buggy hota hai",
      "Deep inheritance chains me base class ka chhota change unpredictably neeche har derived class ko affect kar sakta hai",
      "Base classes runtime pe crash hoti hain",
      "Base class ko sealed nahi kiya ja sakta",
    ],
    correctIndex: 1,
    explanation:
      "Jab inheritance chains deep (multiple levels) hoti hain, base class me ek seemingly-safe change bhi neeche kai derived classes ke behavior ko unexpected tareeke se todh sakta hai, kyunki har derived class implicitly base ke internal assumptions pe depend kar sakti hai. Ye deep inheritance ka ek real maintenance risk hai. Options A, C, D isse describe nahi karte.",
    difficulty: "medium",
  },
];

export default quiz;
