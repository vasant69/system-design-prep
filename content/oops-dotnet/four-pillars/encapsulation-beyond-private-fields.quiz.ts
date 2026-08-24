import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "encapsulation-1",
    question: "Ek class me `public int Age { get; set; }` hai, koi validation nahi. Kya ye encapsulation hai?",
    options: [
      "Haan, kyunki property syntax use ho rahi hai, field nahi",
      "Nahi, kyunki koi invariant enforce nahi ho raha — ye ek relabeled public field hai",
      "Haan, kyunki `get`/`set` C# keywords hain",
      "Nahi, kyunki properties C# me exist hi nahi karte",
    ],
    correctIndex: 1,
    explanation:
      "Encapsulation ka real payoff invariant protection hai — object ko invalid state me jaane se rokna. Bina validation ke auto-property koi invariant enforce nahi karti, isliye ye technically syntax-wise encapsulation dikhta hai lekin behavior-wise sirf ek public field jaisa hi hai. Option A aur C sirf syntax pe focus karte hain, actual protection pe nahi. Option D factually galat hai.",
    difficulty: "easy",
  },
  {
    id: "encapsulation-2",
    question: "`private set` aur `readonly` field me kya fundamental difference hai?",
    options: [
      "Dono bilkul same hain, koi difference nahi",
      "`readonly` sirf constructor/declaration me set ho sakti hai; `private set` waali property class ke andar kahin bhi (kisi bhi method se) reassign ho sakti hai",
      "`readonly` sirf structs pe use ho sakta hai",
      "`private set` compile time pe check hoti hai, `readonly` runtime pe",
    ],
    correctIndex: 1,
    explanation:
      "`readonly` ek stricter guarantee deta hai — value sirf constructor ya field declaration ke time set ho sakti hai, uske baad class ke andar se bhi change nahi ho sakti. `private set` waali property class ke andar kisi bhi method se reassign ho sakti hai, sirf class ke bahar se blocked hai. Option A galat hai, dono alag guarantees dete hain. Option C galat hai, readonly classes pe bhi use hota hai. Option D confused hai — dono hi compile-time enforced hain.",
    difficulty: "medium",
  },
  {
    id: "encapsulation-3",
    question: "Order class me `Total` public settable field hai. Iska sabse bada risk kya hai?",
    options: [
      "Performance slow ho jaayegi",
      "Koi bhi external code directly Total ko invalid value (jaise negative) set kar sakta hai, jisse invariant silently toot jaata hai",
      "Code compile hi nahi hoga",
      "Memory leak hoga",
    ],
    correctIndex: 1,
    explanation:
      "Public settable field ka matlab hai koi bhi caller directly, bina kisi validation ke, state modify kar sakta hai — jaise `order.Total = -500`. Ye invariant ('Total kabhi negative nahi') ko silently violate kar deta hai, aur bug kahin aur (downstream) surface hota hai. Options A, C, D sab is specific risk se unrelated hain.",
    difficulty: "easy",
  },
  {
    id: "encapsulation-4",
    question: "Har field ke liye trivial `private` field + pointless public getter-setter pair banana kis category ki mistake hai?",
    options: [
      "Ye best practice hai, hamesha karna chahiye",
      "Ye over-encapsulation hai — boilerplate badhata hai bina koi invariant protect kiye",
      "Ye security vulnerability create karta hai",
      "Ye C# me allowed hi nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Encapsulation sirf tab meaningful hai jab koi actual invariant protect ho raha ho. Har field ko blindly wrap karna (bina validation logic ke) sirf verbosity badhata hai, koi real benefit nahi deta — ye ek recognized anti-pattern hai. Option A galat hai, ye blanket best practice nahi hai. Option C aur D dono factually galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
