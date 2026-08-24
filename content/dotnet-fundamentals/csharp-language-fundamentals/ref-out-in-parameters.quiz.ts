import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "ref-out-in-1",
    question: "`out` parameter ke baare me kaunsa statement sahi hai?",
    options: [
      "Caller ko variable pehle se initialize karna zaroori hai",
      "Method ke andar HAR return path pe assign karna mandatory hai, compiler enforce karta hai",
      "Method ke andar assign karna optional hai",
      "`out` sirf value types ke saath use ho sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "`out` parameter ko method ke har return path pe assign karna compiler-enforced mandatory hai — agar koi path miss ho, compile error aata hai. Caller ko initialize karne ki zaroorat NAHI hai (Option A galat). Option C galat hai, assignment mandatory hai optional nahi. Option D galat hai, out reference types ke saath bhi kaam karta hai.",
    difficulty: "medium",
  },
  {
    id: "ref-out-in-2",
    question: "`in` parameter ke andar method us parameter ko modify karne ki koshish kare, to kya hoga?",
    options: [
      "Runtime exception aayega",
      "Silently change ho jaayega lekin caller pe reflect nahi hoga",
      "Compile error aayega — in parameter readonly hai",
      "Sirf struct types ke liye error aayega, class types ke liye nahi",
    ],
    correctIndex: 2,
    explanation:
      "`in` parameter readonly reference hota hai — method ke andar usko modify karne ki koshish COMPILE ERROR deti hai, runtime tak pahunchti hi nahi. Options A aur B dono galat hain kyunki ye compile-time restriction hai, runtime behavior nahi. Option D galat hai — `in` primarily struct types ke liye meaningful hai (class references already indirection hain), aur restriction wahi consistent rehti hai.",
    difficulty: "medium",
  },
  {
    id: "ref-out-in-3",
    question: "`ref` aur `in` dono caller-side initialization require karte hain. Inme practical difference kya hai?",
    options: [
      "Koi fark nahi, dono identical hain",
      "`ref` method ko modify karne deta hai, `in` sirf readonly access deta hai",
      "`in` sirf async methods me use ho sakta hai",
      "`ref` sirf class types ke saath kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Dono caller-initialized variable ka reference pass karte hain, lekin `ref` method ko us value ko modify karne deta hai (two-way), jabki `in` ek readonly reference deta hai — method sirf padh sakta hai, modify nahi kar sakta (compile error agar koshish ki jaaye). `in` primarily large-struct-copy-avoidance ke liye hai, `ref` genuine two-way mutation ke liye.",
    difficulty: "easy",
  },
  {
    id: "ref-out-in-4",
    question: "Ye code kya print karega?\n```csharp\nbool TryDivide(int a, int b, out int result)\n{\n    if (b == 0) { result = 0; return false; }\n    result = a / b;\n    return true;\n}\n\nif (TryDivide(10, 0, out int r))\n    Console.WriteLine(r);\nelse\n    Console.WriteLine($\"Failed, r = {r}\");\n```",
    options: [
      "Runtime exception (division by zero)",
      "\"Failed, r = 0\"",
      "Compile error",
      "\"Failed, r = \" (r uninitialized error)",
    ],
    correctIndex: 1,
    explanation:
      "`b` 0 hai, isliye method `result = 0;` assign kar ke `false` return karta hai (koi exception nahi, division hoti hi nahi). `TryDivide` false return karta hai, isliye else branch chalta hai, aur `r` (jo `out` se already assign ho chuka hai — 0) print hota hai: 'Failed, r = 0'. Option C galat hai kyunki `out` parameter method ke andar har path pe assigned hai, valid code hai.",
    difficulty: "hard",
  },
];

export default quiz;
