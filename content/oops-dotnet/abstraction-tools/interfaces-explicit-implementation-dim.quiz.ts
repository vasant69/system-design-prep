import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "interfaces-dim-1",
    question: "Explicit interface implementation (`void IFoo.Bar()`) ko class ke apne instance se seedha call karne ki koshish karo — kya hoga?",
    options: [
      "Normal public method ki tarah call ho jaayega",
      "Compile error — explicit member sirf IFoo type ke reference se hi accessible hai",
      "Runtime exception aayega",
      "Sirf ek warning aayegi, code chal jaayega",
    ],
    correctIndex: 1,
    explanation:
      "Explicit implementation me koi access modifier nahi hota, aur ye member class ke public surface pe available hi nahi hota — sirf IFoo type ke reference (direct variable ya cast) se access ho sakta hai. Class ke apne instance type se seedha call karna compile error deta hai. Option A galat hai kyunki ye seedha accessible nahi hai. Option C aur D galat hain — ye ek hard compile-time error hai, runtime tak pahunchta hi nahi.",
    difficulty: "easy",
  },
  {
    id: "interfaces-dim-2",
    question: "Default Interface Methods (DIM) C# 8 me primarily kis problem ko solve karne ke liye add kiye gaye the?",
    options: [
      "Interfaces ko fields rakhne dene ke liye",
      "Widely-implemented interfaces ko naye members ke saath evolve karna, bina existing implementers ko compile-time break kiye",
      "Multiple class inheritance allow karne ke liye",
      "Performance improve karne ke liye method calls ki",
    ],
    correctIndex: 1,
    explanation:
      "DIM ka core motivation API evolution hai — agar ek interface ko naya method chahiye lekin usse 10 classes already implement karti hain, DIM ek default body deta hai taaki purani implementations turant na tootein. Option A galat hai — DIM ke baad bhi interfaces instance fields nahi rakh sakte. Option C galat hai, class multiple inheritance ab bhi disallowed hai. Option D ek unrelated claim hai, DIM ka performance se koi seedha lena-dena nahi.",
    difficulty: "medium",
  },
  {
    id: "interfaces-dim-3",
    question: "Do interfaces `IEmailSender` aur `ISmsSender` dono `void Send(string, string)` define karte hain. Ek class dono implement karti hai aur har channel ke liye alag behavior chahiye. Kya karna sahi approach hai?",
    options: [
      "Sirf ek public `Send` method likh do, dono interfaces automatically satisfy ho jaayenge same behavior ke saath",
      "Dono ko explicit implementation ke through likho, taaki har interface reference apna alag behavior resolve kare",
      "Ek interface ko rename karna padega, ye scenario hi invalid hai",
      "C# me ye scenario compile hi nahi hoga chahe kuch bhi karo",
    ],
    correctIndex: 1,
    explanation:
      "Jab genuinely alag behavior chahiye har interface ke liye, dono Send() ko explicit banao — `void IEmailSender.Send(...)` aur `void ISmsSender.Send(...)` — har ek apna alag implementation deta hai, aur caller interface reference ke through decide karta hai kaunsa chalega. Option A ek hi shared implementation degi, jo requirement (alag behavior) satisfy nahi karta. Option C aur D dono galat hain — ye ek valid, common C# pattern hai, koi rename ya compile-blocker nahi.",
    difficulty: "medium",
  },
  {
    id: "interfaces-dim-4",
    question: "`IPaymentGateway` interface me `RefundAsync` ek default body ke saath add kiya gaya. `RazorpayGateway : IPaymentGateway` isse override nahi karti. Kya hoga jab code `RazorpayGateway` object pe `RefundAsync()` call kare (interface reference ke through)?",
    options: [
      "Compile error — RefundAsync implement nahi kiya gaya",
      "Interface ka default body run hoga (jaise NotSupportedException throw karna, agar wahi default likha ho)",
      "Runtime pe RefundAsync silently kuch nahi karega",
      "RazorpayGateway automatically ChargeAsync ko call karega uski jagah",
    ],
    correctIndex: 1,
    explanation:
      "DIM ki wajah se RazorpayGateway compile hoti hai bina RefundAsync implement kiye — jab call hota hai, interface ka default body execute hota hai (chahe wo NotSupportedException throw karna ho ya kuch aur). Option A galat hai — yahi to DIM ka poora point hai, compile error nahi aata. Option C galat hai, default body definitely kuch execute karta hai (jo bhi likha gaya). Option D ek random, unrelated behavior hai jo actual C# semantics nahi hai.",
    difficulty: "hard",
  },
];

export default quiz;
