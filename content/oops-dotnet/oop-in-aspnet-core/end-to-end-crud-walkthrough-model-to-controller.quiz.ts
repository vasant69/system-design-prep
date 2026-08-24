import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "e2e-1",
    question: "Fixed 5-piece order me, Interface ka exact kaam kya hai?",
    options: [
      "Actual database calls likhna",
      "Sirf method signatures (contract) define karna, bina implementation ke",
      "HTTP requests ko receive karna",
      "Data ka shape define karna",
    ],
    correctIndex: 1,
    explanation:
      "Interface sirf batata hai 'kya-kya method available honge' — koi `{ }` body nahi hoti, sirf signature aur semicolon. Actual implementation Service class me hoti hai. Option A galat hai (wo Service ka kaam hai). Option C galat hai (wo Controller ka kaam hai). Option D galat hai (wo Model ka kaam hai).",
    difficulty: "easy",
  },
  {
    id: "e2e-2",
    question: "`_db.Products.Add(product);` likhne ke baad, agar `await _db.SaveChangesAsync();` na likha jaaye to kya hoga?",
    options: [
      "Compile error aayega",
      "Object sirf in-memory track hoga, database me kabhi save nahi hoga — koi error bhi nahi dikhega",
      "Automatically 5 second baad save ho jaayega",
      "App crash ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "`Add()` sirf DbContext ke change tracker me object ko register karta hai — actual SQL `SaveChangesAsync()` chalne par hi jaata hai. Isko bhool jaana ek silent bug hai kyunki koi error/exception nahi aata, bas data save hi nahi hota. Options A, C, D sab galat hain — na koi compile error hai, na auto-save hota hai, na app crash hoti hai.",
    difficulty: "medium",
  },
  {
    id: "e2e-3",
    question: "Controller ka constructor `IProductService` inject karta hai, `ProductService` (concrete class) nahi. Iska kya fayda hai?",
    options: [
      "Koi fayda nahi, dono same cheez hain",
      "Compile time thoda fast hota hai",
      "Controller abstraction pe depend karta hai — implementation swap/mock karna easy ho jaata hai bina controller ka code badle",
      "Interface inject karna mandatory hai, class inject karna allowed hi nahi",
    ],
    correctIndex: 2,
    explanation:
      "Ye DI + abstraction ka real payoff hai (Module 1 se connect) — Controller sirf contract (interface) jaanta hai, actual implementation nahi. Kal koi doosri implementation ban sakti hai, ya testing ke liye ek mock inject kiya ja sakta hai, controller ka code bilkul nahi badalta. Option A galat hai — ye fundamental difference hai. Option B irrelevant hai. Option D galat hai — concrete class bhi inject ki ja sakti hai, bas usse ye benefit nahi milta.",
    difficulty: "medium",
  },
  {
    id: "e2e-4",
    question: "`public async Task<Product?> GetByIdAsync(int id)` — is signature ke baare me kaunsa statement GALAT hai?",
    options: [
      "`async` keyword ke bina is method ke andar `await` likhna compile error dega",
      "`Product?` ka matlab hai method `null` bhi return kar sakta hai",
      "`Task<...>` ka matlab hai method turant, synchronously result dega",
      "`Async` suffix naam me sirf convention hai, compiler ke liye mandatory nahi",
    ],
    correctIndex: 2,
    explanation:
      "Option C hi galat statement hai — `Task<...>` ka exact ulta matlab hai: method turant result nahi deta, ek 'promise' (Task) deta hai jo baad me result ke saath complete hoga, isliye caller `await` karta hai. Options A, B, D teeno sahi statements hain — `async`-`await` ka pairing mandatory hai compile ke liye, `?` nullable batata hai, aur `Async` suffix sirf naming convention hai.",
    difficulty: "hard",
  },
];

export default quiz;
