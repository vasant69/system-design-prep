import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "overload-ext-1",
    question: "Ek class me instance method `Greet()` aur ek extension method jiska signature same hai, dono available hain. `obj.Greet()` call karne par kaunsa run hoga?",
    options: [
      "Extension method, kyunki wo baad me define hui",
      "Instance method — hamesha priority leta hai extension method se",
      "Ambiguous call compile error aayega",
      "Depends on jo pehle using statement me import hui ho",
    ],
    correctIndex: 1,
    explanation:
      "Compiler resolution order me instance methods hamesha extension methods se pehle check hote hain — agar ek matching instance method mil jaaye, extension method consider hi nahi ki jaati, koi ambiguity error nahi aata. Option A aur D galat hain, definition order ya import order is priority ko change nahi karte. Option C galat hai, ye valid, unambiguous code hai.",
    difficulty: "medium",
  },
  {
    id: "overload-ext-2",
    question: "Extension method likhne ke liye kaunsa requirement MANDATORY nahi hai?",
    options: [
      "Method ek static class ke andar honi chahiye",
      "Pehla parameter `this` modifier ke saath hona chahiye",
      "Method public honi chahiye",
      "Class ka naam 'Extensions' se end hona chahiye",
    ],
    correctIndex: 3,
    explanation:
      "Static class ka naam kuch bhi ho sakta hai — 'Extensions' suffix ek common naming CONVENTION hai, mandatory requirement nahi. Static class, static method, aur `this` modifier pehle parameter pe — ye teeno genuinely mandatory hain extension method banane ke liye. Method public honi chahiye taaki wo kahin aur se accessible ho (technically internal bhi ho sakti hai agar sirf same assembly me use karni ho, lekin public typical case hai).",
    difficulty: "easy",
  },
  {
    id: "overload-ext-3",
    question: "LINQ ke `Where`, `Select` jaise methods kis mechanism pe based hain jo unhe `List<T>`, arrays, aur custom `IEnumerable<T>` collections sab pe kaam karne dete hain?",
    options: [
      "Reflection ke through runtime type-checking",
      "Extension methods on IEnumerable<T>",
      "Multiple inheritance",
      "Dynamic typing",
    ],
    correctIndex: 1,
    explanation:
      "`Enumerable` static class me defined extension methods `IEnumerable<T>` pe extend hote hain — isliye koi bhi type jo `IEnumerable<T>` implement karta hai (array, List, HashSet, custom collections) automatically LINQ methods use kar sakta hai, bina un types me kuch add kiye. Options A, C, D koi bhi is mechanism ka actual basis nahi hain — C# multiple inheritance support hi nahi karta (classes ke liye).",
    difficulty: "medium",
  },
  {
    id: "overload-ext-4",
    question: "Ek extension method kisi type ke private field ko access karne ki koshish kare, to kya hoga?",
    options: [
      "Compile ho jaayega, private field access ho jaayegi",
      "Compile error — extension method sirf public members access kar sakta hai",
      "Runtime warning aayega lekin chalega",
      "Reflection use karke automatically access mil jaayegi",
    ],
    correctIndex: 1,
    explanation:
      "Extension method ek external static method hai — us class ke andar likha gaya code nahi hai, isliye private/protected members tak koi special access nahi hai. Compile error aayega agar private member access karne ki koshish ki jaaye. Option D galat hai — reflection explicitly use kiye bina automatic access nahi milti, aur explicitly reflection use karna 'extension method jaisa clean access' nahi rehta.",
    difficulty: "medium",
  },
];

export default quiz;
