import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "enums-flags-1",
    question: "`[Flags]` enum ke members power-of-two (1, 2, 4, 8) kyun hone chahiye?",
    options: [
      "Ye sirf ek naming convention hai, functionally koi fark nahi padta",
      "Har value ek distinct bit represent karti hai, isliye bitwise OR se combine karne par koi overlap nahi hota",
      "Compiler enforce karta hai, non-power-of-two values compile error dete hain",
      "Performance ke liye — power-of-two values CPU pe faster process hoti hain",
    ],
    correctIndex: 1,
    explanation:
      "Power-of-two values (1=0001, 2=0010, 4=0100, 8=1000) me har value ek unique, non-overlapping bit position occupy karti hai. Bitwise OR se combine karne par har flag apni bit-position preserve karta hai, aur AND se check karne par bilkul precisely pata chal sakta hai koi specific flag set hai ya nahi. Non-power-of-two values ke saath ye guarantee toot jaati hai. Option C galat hai — compiler ye enforce nahi karta, ye developer ki responsibility hai.",
    difficulty: "medium",
  },
  {
    id: "enums-flags-2",
    question: "`OrderStatus invalid = (OrderStatus)999;` (jahan OrderStatus ke members 0-4 tak hi defined hain) — ye code kya karega?",
    options: [
      "Compile error, kyunki 999 koi defined member nahi hai",
      "Runtime exception, invalid enum value",
      "Compile aur run dono ho jaayega — enum runtime pe sirf ek integer hai, koi automatic validation nahi",
      "Automatically closest valid value (4) le lega",
    ],
    correctIndex: 2,
    explanation:
      "Enum compile-time type-safety deta hai (galat TYPE assign nahi ho sakta), lekin runtime pe ye sirf ek integer hai — koi built-in check nahi hai ki value kisi defined member se match kare. `(OrderStatus)999` compile aur run dono ho jaayega, `invalid` variable me technically '999' value store hogi jo koi named member match nahi karti. Isliye external input validate karne ke liye `Enum.IsDefined()` use karna best practice hai.",
    difficulty: "hard",
  },
  {
    id: "enums-flags-3",
    question: "Enum ka default underlying type kya hai, aur ise change kiya ja sakta hai?",
    options: [
      "long, aur change nahi kiya ja sakta",
      "int, aur ise kisi bhi integral type (byte, short, long, etc.) se change kiya ja sakta hai",
      "string, aur change nahi kiya ja sakta",
      "object, aur ise sirf int me change kiya ja sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "Enum ka default underlying type `int` hai, lekin `public enum SmallCode : byte { ... }` jaisi syntax se ise kisi bhi integral type (byte, sbyte, short, ushort, int, uint, long, ulong) me change kiya ja sakta hai. Ye memory-sensitive scenarios me useful hai jahan lakhon enum values store karni ho.",
    difficulty: "easy",
  },
  {
    id: "enums-flags-4",
    question: "`HasFlag()` method aur direct bitwise `&` comparison me practical difference kya hai?",
    options: [
      "Koi difference nahi, dono identical hain",
      "HasFlag() readable hai lekin internally boxing involve karta hai (slight perf cost); direct & thoda faster hai",
      "HasFlag() sirf [Flags] enums ke saath kaam karta hai, & sirf normal enums ke saath",
      "& operator deprecated hai, sirf HasFlag() use karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "`HasFlag()` `Enum` base class ka method hai jo internally `object` parameter leta hai, isliye boxing involve hoti hai — thoda slower. Direct bitwise `&` comparison (`(perms & Flag) == Flag`) faster hai kyunki koi boxing nahi. General code me `HasFlag()` ki readability worth hai, hot paths me direct `&` prefer kiya jaata hai.",
    difficulty: "medium",
  },
];

export default quiz;
