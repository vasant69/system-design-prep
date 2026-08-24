import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "abstract-classes-1",
    question: "`public abstract class Shape { public abstract double Area(); }` — `var s = new Shape();` likhne par kya hoga?",
    options: [
      "Runtime exception aayega jab Area() call hoga",
      "Compile-time error — abstract class ka direct instance nahi ban sakta",
      "Silently ek default Shape object ban jaayega, Area() 0 return karega",
      "Sirf warning aayega, code chal jaayega",
    ],
    correctIndex: 1,
    explanation:
      "Abstract class ko directly instantiate karna compile-time error hai (CS0144), runtime tak pahunchne ka sawaal hi nahi. Compiler ise code run hone se pehle hi catch kar leta hai. Option A galat hai kyunki error runtime pe nahi, compile time pe aata hai. Option C aur D dono galat hain — koi silent fallback ya warning-only behavior nahi hai, ye hard compile error hai.",
    difficulty: "easy",
  },
  {
    id: "abstract-classes-2",
    question: "Abstract class aur interface (pre-default-interface-methods) me sabse bada functional difference kya tha?",
    options: [
      "Abstract class multiple ho sakti thi ek class ke liye, interface sirf ek",
      "Abstract class concrete implementation aur instance state (fields) rakh sakti thi, interface bilkul nahi",
      "Interface hamesha faster execute hota tha abstract class se",
      "Abstract class sirf structs ke liye applicable thi",
    ],
    correctIndex: 1,
    explanation:
      "Pre-C#-8 duniya me interface sirf signatures de sakta tha, koi implementation ya fields nahi. Abstract class dono de sakti thi — concrete methods aur instance fields. Option A ulta hai — ek class multiple interfaces implement kar sakti hai lekin sirf ek class/abstract class se inherit ho sakti hai. Option C ek unfounded performance claim hai. Option D galat hai, abstract class structs ke liye applicable hi nahi hai (structs abstract nahi ho sakte).",
    difficulty: "medium",
  },
  {
    id: "abstract-classes-3",
    question: "Abstract class ka constructor kab chalta hai, agar class khud instantiate nahi ho sakti?",
    options: [
      "Kabhi nahi chalta, dead code hai",
      "Har baar jab koi derived class ka instance banta hai, implicitly ya explicitly base() ke through",
      "Sirf tab jab derived class explicitly `AbstractClass.Constructor()` likhe",
      "Sirf application startup pe ek baar",
    ],
    correctIndex: 1,
    explanation:
      "Abstract class ka constructor directly call nahi ho sakta, lekin jab bhi koi derived class ka instance banta hai, uska constructor implicitly (parameterless base ke liye) ya explicitly (`: base(args)`) abstract class ka constructor call karta hai — shared initialization ke liye. Option A galat hai, ye real, chalne wala code hai. Option C ek invalid syntax describe karta hai. Option D galat hai — ye per-instance chalta hai, sirf startup pe ek baar nahi.",
    difficulty: "medium",
  },
  {
    id: "abstract-classes-4",
    question: "Ek abstract class ke concrete (non-abstract) method ko derived class me override karna hai. Kya extra chahiye?",
    options: [
      "Kuch nahi, sab concrete methods automatically overridable hote hain",
      "Base class me us method ko `virtual` mark karna zaroori hai, warna derived class me use `new` se hide kiya jaayega na ki override",
      "Method ko bhi `abstract` mark karna padega",
      "Sirf derived class me `override` likhna kaafi hai, base me kuch nahi chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Abstract class ke concrete methods by default non-virtual hote hain — automatically overridable nahi. Agar polymorphic override chahiye, base method ko explicitly `virtual` mark karna hoga. Bina `virtual` ke, derived class me same-signature method likhna sirf method HIDING hota hai (`new` keyword ke saath, warning ke saath), true override nahi. Option A galat hai, C galat hai (already-implemented method ko abstract nahi bana sakte), D galat hai kyunki bina `virtual` base method ke `override` compile hi nahi hoga.",
    difficulty: "hard",
  },
];

export default quiz;
