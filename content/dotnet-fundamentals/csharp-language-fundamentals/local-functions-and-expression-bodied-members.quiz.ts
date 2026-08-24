import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "local-fn-1",
    question: "Ek local function jo koi bhi outer variable capture nahi karti, use ke baare me kaunsa statement sahi hai?",
    options: [
      "Ye hamesha ek closure object heap pe allocate karti hai, lambda ki tarah",
      "Ye typically koi closure allocation nahi karti — lambda se lighter ho sakti hai",
      "Ye compile hi nahi hoti bina outer variable capture ke",
      "Ye sirf static methods ke andar define ho sakti hai",
    ],
    correctIndex: 1,
    explanation:
      "Agar local function koi outer variable capture nahi karti, compiler ko koi closure object banane ki zarurat nahi padti — ye equivalent capturing-lambda se genuinely lighter ho sakti hai. Option A ulta hai. Option C galat hai, no-capture bilkul valid hai. Option D galat hai, local functions instance methods ke andar bhi define ho sakti hain.",
    difficulty: "medium",
  },
  {
    id: "local-fn-2",
    question: "Expression-bodied member (`=>` syntax) ka block-body (`{ }`) equivalent se kya runtime difference hai?",
    options: [
      "Expression-bodied members faster execute hote hain",
      "Koi runtime difference nahi — purely syntactic sugar, same IL",
      "Expression-bodied members heap pe allocate hote hain",
      "Block-body methods JIT ke through faster optimize hote hain",
    ],
    correctIndex: 1,
    explanation:
      "Expression-bodied syntax (`=>`) purely compile-time sugar hai — compiler equivalent IL generate karta hai jaise ek `{ return ...; }` block body likha gaya ho. Koi runtime performance difference nahi hota. Options A, C, D sab galat premises hain.",
    difficulty: "easy",
  },
  {
    id: "local-fn-3",
    question: "Ek local function ko directly `Func<int,int>` parameter ki tarah pass karne ke liye kya zaroori hai?",
    options: [
      "Kuch nahi, local functions automatically delegate-compatible hain",
      "Local function ko ek delegate variable me assign/wrap karna padega",
      "Local function ko static banana zaroori hai",
      "Ye possible hi nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Local function khud ek delegate value nahi hai — agar use kisi jagah value ki tarah pass karna hai (jaise ek Func<> parameter me), use explicitly ek delegate-typed variable me assign/wrap karna padta hai (jaise `Func<int,int> f = LocalFn;`), jo phir pass ho sakta hai. Option D galat hai, ye possible hai, bas direct nahi.",
    difficulty: "hard",
  },
  {
    id: "local-fn-4",
    question: "Local function ka ek genuine advantage kya hai class-level private helper method ke upar, jab helper sirf ek method ke andar hi meaningful ho?",
    options: [
      "Better performance hamesha guaranteed hota hai",
      "Encapsulation — helper class ke namespace me kahin aur se accidentally callable nahi hota",
      "Local functions automatically thread-safe hote hain",
      "Local functions overload nahi ho sakte, isliye safer hain",
    ],
    correctIndex: 1,
    explanation:
      "Local function outer method ke bahar completely invisible hoti hai — class ke public/private method-list me clutter nahi hoti aur kahin aur accidentally call nahi ho sakti, jo genuinely single-use helpers ke liye better encapsulation deta hai. Option A galat hai — performance benefit sirf tab hai jab no-capture ho. Options C aur D irrelevant/galat claims hain.",
    difficulty: "medium",
  },
];

export default quiz;
