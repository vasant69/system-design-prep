import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lsp-1",
    question: "Liskov Substitution Principle ka core idea kya hai?",
    options: [
      "Derived class ka naam base class ke naam se related hona chahiye",
      "Derived type ka object base type ke object ki jagah use ho sakna chahiye bina program ka correctness break kiye",
      "Ek class sirf ek hi interface implement kar sakti hai",
      "Base class me hamesha kam se kam ek abstract method hona chahiye",
    ],
    correctIndex: 1,
    explanation:
      "LSP ka core idea substitutability hai — jahan base type expect hota hai, wahan derived type ka object use karne se program ka behavior galat nahi hona chahiye. Ye purely behavioral contract ke baare me hai, naming (A) se, interface count (C) se, ya abstract methods (D) se koi lena dena nahi.",
    difficulty: "easy",
  },
  {
    id: "lsp-2",
    question: "Rectangle/Square example me LSP violation exactly kaha hota hai?",
    options: [
      "Square class compile nahi hoti",
      "Square, Height set karne par Width bhi silently badal deta hai, jisse ek Rectangle-expecting caller ki assumption (Width/Height independent hain) toot jaati hai",
      "Square ke paas Area() method nahi hai",
      "Rectangle aur Square dono ka same memory layout hai",
    ],
    correctIndex: 1,
    explanation:
      "Violation compile-time nahi, RUNTIME BEHAVIOR me hai — Square apne invariant (dono sides equal) maintain karne ke liye Height set karne par Width bhi badal deta hai, jo caller code ki implicit assumption todta hai ki Width aur Height independently settable hain. Option A galat hai (code compile hota hai). Option C aur D irrelevant/galat hain.",
    difficulty: "medium",
  },
  {
    id: "lsp-3",
    question: "LSP violation ko type system (compiler) kab catch karta hai?",
    options: [
      "Hamesha, compile-time pe hi error aa jaata hai",
      "Kabhi nahi compile-time pe — LSP violations valid, compiling code hote hain jo runtime behavior break karte hain",
      "Sirf jab class 'sealed' na ho",
      "Sirf jab interface use ho, class inheritance me nahi",
    ],
    correctIndex: 1,
    explanation:
      "Ye ek crucial, aksar-missed point hai — LSP violations type-safe, compiling code hote hain. Compiler sirf structural correctness check karta hai (kya sahi methods/properties hain), behavioral contract nahi. Isliye Rectangle/Square dono compile hote hain bawajood is baat ke ki Square substitutability todta hai. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "lsp-4",
    question: "Rectangle/Square problem ka sahi (recommended) fix kya hai?",
    options: [
      "Square me Width aur Height ko private kar do",
      "Rectangle aur Square dono ko ek shared IShape (ya similar) abstraction implement karwao independently, koi inheritance na ho unke beech",
      "Square class ko sealed bana do",
      "Rectangle class me virtual keyword hata do",
    ],
    correctIndex: 1,
    explanation:
      "Sahi fix hai underlying design problem — galat inheritance relationship — hi hatana. Rectangle aur Square ko independent classes banao jo ek common IShape jaisi abstraction implement karein (contract: sirf Area()), koi ek dusre se inherit na kare. Options A, C, D sab surface-level keyword patches hain jo actual design issue solve nahi karte.",
    difficulty: "medium",
  },
];

export default quiz;
