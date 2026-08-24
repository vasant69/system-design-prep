import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "var-dynamic-1",
    question: "`var name = \"Asha\"; name = 42;` — ye code compile hoga?",
    options: [
      "Haan, var kisi bhi type ko accept kar leta hai",
      "Nahi — compile error, name string type me infer ho chuka hai, int assign nahi ho sakta",
      "Haan, lekin runtime pe exception aayega",
      "Sirf tab compile hoga jab dynamic use kiya jaaye",
    ],
    correctIndex: 1,
    explanation:
      "`var` sirf compile-time type inference hai — ek baar `name` string infer ho gaya, wo variable utna hi strictly typed hai jitna `string name` likhne se hota. `int` assign karna compile error dega, kyunki `var` 'dynamically typed' nahi hai, sirf syntax sugar hai type declaration ke liye.",
    difficulty: "easy",
  },
  {
    id: "var-dynamic-2",
    question: "`dynamic obj = 42; Console.WriteLine(obj.Length);` — ye code kya karega?",
    options: [
      "Compile error, kyunki int me Length nahi hota",
      "Compile ho jaayega, lekin runtime pe RuntimeBinderException throw karega",
      "0 print karega",
      "Compile aur run dono successfully honge",
    ],
    correctIndex: 1,
    explanation:
      "`dynamic` ke saath compile-time type-checking skip ho jaati hai — compiler kuch bhi verify nahi karta, code compile ho jaata hai. Runtime pe DLR try karta hai `Length` member resolve karne ka, lekin `int` me `Length` member exist nahi karta, isliye `RuntimeBinderException` throw hota hai. Ye `var` (jo yehi galti compile-time pe pakadta) se bilkul opposite behavior hai.",
    difficulty: "medium",
  },
  {
    id: "var-dynamic-3",
    question: "Ek shared library me `public const int MaxItems = 10;` hai. Library ki value 10 se 20 badal di gayi aur naya version publish hua, lekin ek consuming project ne apna reference update/recompile nahi kiya. Consumer ko kaunsi value milegi?",
    options: [
      "20, kyunki NuGet automatically latest value pull karta hai",
      "10 — purani value, kyunki const value consumer ke IL me build-time pe hi bake ho chuki thi",
      "Runtime error, version mismatch ki wajah se",
      "0, default value",
    ],
    correctIndex: 1,
    explanation:
      "`const` values compile-time pe consuming assembly ke IL me literal ke roop me embed ho jaati hain. Agar consumer apna code recompile nahi karta, wo purani baked-in value (10) hi use karta rahega, chahe library ka naya DLL install ho jaaye. Ye `const` ka well-known cross-assembly staleness gotcha hai, jo `readonly`/`static readonly` ke saath nahi hota.",
    difficulty: "hard",
  },
  {
    id: "var-dynamic-4",
    question: "`readonly` field ko kahan set kiya ja sakta hai?",
    options: [
      "Sirf field declaration pe",
      "Field declaration pe, ya constructor ke andar",
      "Kisi bhi instance method me, jab bhi zaroorat ho",
      "Sirf ek static method me",
    ],
    correctIndex: 1,
    explanation:
      "`readonly` field ko field declaration ke time pe, YA constructor ke andar set kiya ja sakta hai — dono valid hain. Ek baar constructor complete ho jaaye, field immutable ho jaata hai — koi bhi baad ka method (declaration/constructor ke alawa) usse assign nahi kar sakta, compile error dega.",
    difficulty: "medium",
  },
];

export default quiz;
