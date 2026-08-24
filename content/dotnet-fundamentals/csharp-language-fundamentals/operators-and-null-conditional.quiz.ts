import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "operators-null-1",
    question: "`cache ??= new Dictionary<string, object>();` — agar `cache` already non-null hai, kya hoga?",
    options: [
      "Naya Dictionary ban kar cache ko overwrite kar dega",
      "`new Dictionary<...>()` evaluate hi nahi hoga, cache unchanged rahega",
      "Compile error aayega",
      "Runtime exception aayega",
    ],
    correctIndex: 1,
    explanation:
      "`??=` sirf tabhi right side assign karta hai jab left side currently null ho. Agar `cache` already non-null hai, right side (`new Dictionary<...>()`) evaluate hi nahi hota — koi wasted allocation nahi, cache apni existing value rakhta hai. Option A galat hai kyunki overwrite nahi hota. Options C aur D galat hain, ye valid, exception-free code hai.",
    difficulty: "medium",
  },
  {
    id: "operators-null-2",
    question: "`customer?.Address?.City` me agar `customer` null hai lekin `Address` property khud null-check nahi ho paati, to kya hota hai?",
    options: [
      "NullReferenceException aata hai jab Address access hota hai",
      "Poori chain short-circuit ho kar seedha null return karti hai, Address ko access karne ki koshish hi nahi hoti",
      "Compile error aata hai",
      "City ka default value (empty string) milta hai",
    ],
    correctIndex: 1,
    explanation:
      "`?.` chain me pehla null milte hi (yahan customer khud null hai) poori remaining chain short-circuit ho jaati hai — Address ko access karne ki koshish hi nahi hoti, seedha null result milta hai. Option A galat hai, yahi to `?.` ka poora point hai — exception avoid karna. Options C aur D bhi galat hain.",
    difficulty: "easy",
  },
  {
    id: "operators-null-3",
    question: "`&&` aur `&` (dono boolean operands ke saath use kiye jaayein) me kya practical fark hai?",
    options: [
      "Koi fark nahi, dono identical hain",
      "`&&` short-circuit karta hai (left false ho to right evaluate nahi hota), `&` dono sides hamesha evaluate karta hai",
      "`&` sirf integers ke saath kaam karta hai, booleans ke saath nahi",
      "`&&` sirf if-statements me use ho sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "`&&` logical AND short-circuit evaluation karta hai — agar left operand false hai, right operand evaluate hi nahi hota. `&` (bitwise/non-short-circuiting boolean AND) dono operands hamesha evaluate karta hai, chahe left already false ho. Option C galat hai — `&` booleans ke saath bhi valid hai (non-short-circuiting AND ke roop me). Option D galat hai, `&&` kahin bhi boolean expression me use ho sakta hai.",
    difficulty: "medium",
  },
  {
    id: "operators-null-4",
    question: "`string result = primary ?? secondary ?? \"default\";` — agar `primary` null hai aur `secondary` bhi null hai, `result` me kya aayega?",
    options: [
      "null",
      "Compile error, kyunki do `??` chain nahi ho sakte",
      "\"default\"",
      "secondary ki value, chahe wo null ho",
    ],
    correctIndex: 2,
    explanation:
      "`??` left-to-right evaluate hota hai aur chain ho sakta hai. `primary` null hai to `secondary` check hoga; `secondary` bhi null hai to next fallback `\"default\"` use hoga. Option A galat hai — poori chain ka purpose hi ek non-null fallback dena hai. Option B galat hai, chaining valid syntax hai. Option D galat hai — agar secondary null hota to wo use nahi hota, aage badha jaata.",
    difficulty: "easy",
  },
];

export default quiz;
