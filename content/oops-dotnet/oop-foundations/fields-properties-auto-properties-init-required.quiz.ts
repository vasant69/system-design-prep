import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "fields-props-1",
    question: "Property ka sabse bada practical payoff kya hai field ke against?",
    options: [
      "Property fields se hamesha fast hoti hai runtime pe",
      "Property caller ka syntax change kiye bina validation/logic add karne deti hai — future me field ko property banana breaking change hota, shuru se property rakhna safe hai",
      "Property automatically thread-safe hoti hai",
      "Property ka data hamesha stack par store hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Property ka core payoff encapsulation hai bina API surface change kiye — caller `obj.Balance = x` hi likhta rehta hai chahe andar validation add ho jaye. Ek raw public field ko baad me property me convert karna compiled consumers ke liye binary-incompatible change hota hai. Options A, C, D factually galat hain — property inherently fast/thread-safe/stack-based nahi hoti.",
    difficulty: "medium",
  },
  {
    id: "fields-props-2",
    question: "`init` accessor `private set` se kaise different hai?",
    options: [
      "Dono exactly same hain, sirf naam alag hai",
      "`init` sirf object construction ke dauraan (initializer/constructor) set hone deta hai; `private set` class ke andar kabhi bhi, kisi bhi method se set ho sakta hai",
      "`init` sirf structs ke liye hai, private set sirf classes ke liye",
      "`init` public hai, private set hamesha private hi rehta hai",
    ],
    correctIndex: 1,
    explanation:
      "`init` strictly construction-time-only hai — object ban jaane ke baad wo property kabhi set nahi ho sakti, class ke andar se bhi nahi. `private set` isse zyada flexible hai — class ke andar koi bhi method usse baad me bhi call kar sakta hai. Options A, C, D factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "fields-props-3",
    question: "```csharp\npublic class CreateUserRequest\n{\n    public required string Email { get; init; }\n}\n\nvar req = new CreateUserRequest();\n```\nYe code compile hoga ya error dega?",
    options: [
      "Compile hoga, Email null rahega",
      "Compile error — required member Email object-initializer me set nahi kiya gaya",
      "Runtime exception aayega, compile time pe kuch nahi hoga",
      "Compile hoga, Email empty string default ban jayega",
    ],
    correctIndex: 1,
    explanation:
      "`required` (C# 11) ek compile-time check hai — agar object-initializer me required member set nahi kiya jaata, compiler error deta hai, code compile hi nahi hota. Ye runtime check nahi hai (option C galat), aur na hi silently default/null ban jaata hai (options A, D galat) — compiler ise pakadta hai.",
    difficulty: "medium",
  },
  {
    id: "fields-props-4",
    question: "Auto-property `public decimal Balance { get; private set; }` likhne par compiler ke peeche kya hota hai?",
    options: [
      "Koi backing field nahi banta, value directly memory me float karti hai",
      "Compiler khud ek hidden, unnamed backing field generate karta hai jise sirf get/set methods access kar sakte hain",
      "Ye syntax invalid hai, backing field manually likhna zaroori hai",
      "Balance ek static field ban jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Auto-property syntax (`{ get; set; }` ya `{ get; private set; }`) me compiler khud ek hidden backing field generate karta hai jo sirf us property ke get/set methods ke through accessible hota hai — developer ko manually backing field likhne ki zaroorat nahi padti jab tak custom logic na chahiye ho. Options A, C, D factually galat hain.",
    difficulty: "easy",
  },
];

export default quiz;
