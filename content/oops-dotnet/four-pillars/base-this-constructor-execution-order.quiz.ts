import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "constructor-order-1",
    question: "Agar `Manager : Employee` hai aur `Employee` ke paas sirf ek parameterized constructor hai (koi parameterless nahi), aur `Manager` ka constructor `base(...)` explicitly nahi likhta, kya hoga?",
    options: [
      "Compile ho jaayega, C# automatically sahi base constructor chun lega",
      "Compile error — jab base class ke paas parameterless constructor na ho, derived class ko base(...) explicitly likhna mandatory hai",
      "Runtime exception aayega jab Manager instantiate hoga",
      "Employee ka default (zero-arg) constructor automatically generate ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "C# implicitly sirf parameterless base constructor call karta hai agar kuch na likha jaaye. Agar base class ke paas woh exist hi nahi karta, derived class ko compile-time pe explicitly base(...) likhna hi padega — warna compile error aayega, ye runtime issue nahi hai. Options A, C, D sab is compile-time requirement ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "constructor-order-2",
    question: "3-level inheritance chain (Grandparent -> Parent -> Child) me `new Child()` call karne par exact execution order kya hota hai?",
    options: [
      "Child field init -> Child body -> Parent field init -> Parent body -> Grandparent field init -> Grandparent body",
      "Grandparent field init -> Grandparent body -> Parent field init -> Parent body -> Child field init -> Child body",
      "Sab field initializers ek saath, phir sab constructor bodies ek saath",
      "Random order, guarantee nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Execution hamesha top of hierarchy se shuru hoti hai aur neeche flow karti hai — har level ke field initializers us level ki constructor body se pehle chalte hain, aur poora ek level complete hone ke baad hi agla level shuru hota hai. Option A order ko ulta bataata hai. Options C aur D dono is deterministic, well-defined order ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "constructor-order-3",
    question: "Ek constructor `this(...)` se same class ke doosre constructor ko chain karta hai. Field initializers kitni baar chalte hain?",
    options: [
      "Do baar — ek baar har constructor ke liye",
      "Ek baar — sirf us constructor path me jo actually base(...) call karta hai, this() chaining me duplicate nahi hote",
      "Zero baar, this() chaining field initializers ko skip kar deta hai",
      "Depends on the number of parameters",
    ],
    correctIndex: 1,
    explanation:
      "Field initializers per-object sirf EK baar chalte hain — us constructor me jo actually base(...) ko call karta hai (chain ka 'root'). Agar constructor A, this(...) se constructor B ko delegate karta hai, initializers B ke path me hi chalte hain, A ke liye dobara nahi. Options A, C, D sab is behavior ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "constructor-order-4",
    question: "Jab tak derived class ka constructor BODY run ho raha hota hai, base class ke baare me kya guarantee hoti hai?",
    options: [
      "Base class abhi bhi construct ho rahi ho sakti hai, race condition possible hai",
      "Base class (field initializers + constructor body dono) fully complete ho chuki hoti hai, isliye inherited state safely use kiya ja sakta hai",
      "Base class construct hi nahi hoti jab tak explicitly call na ho",
      "Guarantee sirf sealed classes ke liye hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "C#'s execution order guarantee karta hai ki base class ka poora construction (field initializers + constructor body) derived class ki constructor body shuru hone se pehle hi complete ho chuka hota hai — isliye derived constructor body safely inherited fields/properties use kar sakti hai bina kisi uninitialized-value risk ke. Options A, C, D sab is core guarantee ko galat represent karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
