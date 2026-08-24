import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "generics-fund-1",
    question: "`ArrayList` ke bajaye `List<T>` use karne ka sabse bada fayda kya hai value types (jaise `int`) ke context me?",
    options: [
      "`List<T>` disk pe automatically persist hota hai",
      "`List<T>` boxing avoid karta hai — value directly store hoti hai, koi heap allocation nahi har element ke liye",
      "`List<T>` `ArrayList` se syntax me bilkul same hai, koi fark nahi",
      "`List<T>` sirf reference types store kar sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "`ArrayList` `object` store karta hai, isliye har value type (jaise `int`) add karne par boxing hoti hai — extra heap allocation. `List<int>` compiler-generated specialized version use karta hai jisme `int` directly, bina boxing ke store hota hai. Option A galat hai — persistence se koi lena dena nahi. Option C galat hai — syntax genuinely alag hai, type parameter ke saath. Option D galat hai — `List<T>` value aur reference dono types ke liye kaam karta hai.",
    difficulty: "easy",
  },
  {
    id: "generics-fund-2",
    question: "`public class Factory<T> where T : new() { public T Create() => new T(); }` — is code me `new()` constraint kyun zaroori hai?",
    options: [
      "Bina iske `Factory<T>` class hi compile nahi hoga",
      "Bina `new()` constraint ke, compiler ko guarantee nahi hota ki har possible `T` ke paas parameterless constructor hai, isliye `new T()` compile error dega",
      "`new()` constraint sirf performance ke liye hai, functionality change nahi karta",
      "`new()` constraint ka matlab hai T sirf struct ho sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "Bina `where T : new()` ke, compiler `T` ke baare me sirf itna jaanta hai ki wo `object` hai — usko pata nahi ki har substituted type ke paas parameterless constructor hoga (kai types ke paas parameterized constructors hi hote hain, ya private constructors). `new()` constraint explicitly guarantee karti hai, jiske badle `new T()` allowed hota hai. Option A galat hai — class khud compile ho sakta hai bina constraint ke, sirf `new T()` line error degi. Option C galat hai — ye functionality (compile-ability) affect karta hai, sirf performance nahi. Option D galat hai — `new()` aur `struct` alag constraints hain.",
    difficulty: "medium",
  },
  {
    id: "generics-fund-3",
    question: "`where T : class, struct` likhna kya karega?",
    options: [
      "Ye T ko dono reference aur value types accept karne dega",
      "Compile error — `class` aur `struct` constraints mutually exclusive hain, ek saath nahi lag sakte",
      "Ye sirf `struct` constraint ko honor karega, `class` ignore ho jaayega",
      "Ye ek valid constraint hai jo sirf nullable types allow karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`class` constraint sirf reference types allow karta hai, `struct` constraint sirf value types — ek type dono simultaneously nahi ho sakta, isliye inhe ek saath lagana compile error deta hai. Option A galat hai — ye exact ulta hai, dono constraints ek saath mutually exclusive hone ki wajah se allowed hi nahi. Option C aur D dono factually galat hain — ye combination valid hi nahi hai.",
    difficulty: "medium",
  },
  {
    id: "generics-fund-4",
    question: "Generic method `T FindMax<T>(List<T> items) where T : IComparable<T>` ko `FindMax(intList)` (bina explicit `<int>` diye) call karne par kya hota hai?",
    options: [
      "Compile error — type parameter explicitly specify karna zaroori hai",
      "Compiler `intList` ke type se `T = int` automatically infer kar leta hai",
      "Runtime pe `T` ko `object` treat kiya jaata hai",
      "Ye sirf tab kaam karega jab class-level generic ho, method-level nahi",
    ],
    correctIndex: 1,
    explanation:
      "C# compiler generic method calls me type parameter ko argument types se infer kar sakta hai — `FindMax(intList)` me `intList` ka type `List<int>` hai, isliye `T = int` automatically infer ho jaata hai, explicit `FindMax<int>(intList)` likhne ki zaroorat nahi (halanki likh bhi sakte ho). Option A galat hai — inference exactly ye avoid karta hai. Option C galat hai — `T` genuinely `int` resolve hota hai, `object` nahi. Option D galat hai — type inference generic methods ki hi specific feature hai (generic classes me constructor call pe type specify karna padta hai, es tarah infer nahi hota generally).",
    difficulty: "medium",
  },
];

export default quiz;
