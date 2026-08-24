import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "nullable-1",
    question: "`int? age = null; int x = age.Value;` — ye line kya karega?",
    options: [
      "Compile error dega",
      "`x` ko 0 assign kar dega (default value)",
      "Runtime pe `InvalidOperationException` throw karega",
      "Runtime pe `NullReferenceException` throw karega",
    ],
    correctIndex: 2,
    explanation:
      "`Nullable<T>.Value` ko `HasValue == false` hone par access karna `InvalidOperationException` deta hai ('Nullable object must have a value'), `NullReferenceException` nahi — kyunki `int?` ek value type (struct) hai, reference type nahi. Option A galat hai — ye compile time pe valid code hai. Option B galat hai — koi silent default nahi milta, exception aata hai. Option D galat hai — wo reference type ke null access ka exception hai, yahan applicable nahi.",
    difficulty: "medium",
  },
  {
    id: "nullable-2",
    question: "`<Nullable>enable</Nullable>` set karne ke baad, `string` (bina `?`) me `null` assign karna kya karega runtime pe?",
    options: [
      "Runtime error dega, null assign hi nahi hoga",
      "Compile-time warning dega, lekin runtime pe bilkul allowed hai — koi runtime check nahi hota",
      "Automatically empty string me convert ho jaayega",
      "Compile error dega, code build hi nahi hoga",
    ],
    correctIndex: 1,
    explanation:
      "Nullable Reference Types (NRT) sirf compile-time static analysis hai — runtime pe koi enforcement nahi. `string name = null;` ek warning dega, lekin compile ho jaayega aur runtime pe bilkul kaam karega (jab tak koi code usko dereference na kare, tab NullReferenceException aa sakta hai, jaisa NRT se pehle bhi hota tha). Option A aur D galat hain kyunki NRT enforcement nahi karta, sirf warn karta hai. Option C bhi galat hai, koi auto-conversion nahi hoti.",
    difficulty: "hard",
  },
  {
    id: "nullable-3",
    question: "`Nullable<T>` (jaise `int?`) kab introduce hua tha C# me, aur Nullable Reference Types kab?",
    options: [
      "Dono ek hi version (C# 8) me aaye",
      "`Nullable<T>` C# 2.0 (2005) me, Nullable Reference Types C# 8.0 (2019) me — 14 saal ka gap",
      "Nullable Reference Types pehle aayi, phir `Nullable<T>`",
      "Dono .NET Framework ke shuru se hi the, C# 1.0 se",
    ],
    correctIndex: 1,
    explanation:
      "`Nullable<T>` C# 2.0 (2005) me aaya, generics ke saath. Nullable Reference Types (NRT) bahut baad me, C# 8.0 (2019) me aaye. Ye 14-saal ka gap batata hai ki dono genuinely alag problems solve karte hain, alag timeline pe introduce hue. Options A, C, D sab factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "nullable-4",
    question: "Ek team NRT enable karti hai lekin CI me `TreatWarningsAsErrors` nahi set karti. Production me ek `NullReferenceException` aata hai jahan NRT warning bhi thi. Iska sabse likely reason kya hai?",
    options: [
      "NRT feature khud buggy hai",
      "Warnings sirf informational hote hain — bina enforce kiye (CI me error banaye), developers unhe ignore kar sakte hain aur code merge ho sakta hai",
      "`.NET` runtime NRT ko properly support nahi karta",
      "Ye impossible hai, NRT enabled hone par NullReferenceException aa hi nahi sakta",
    ],
    correctIndex: 1,
    explanation:
      "NRT sirf ek warning system hai — enforcement CI/build pipeline ki responsibility hai (`TreatWarningsAsErrors` jaisi settings ke through). Bina iske, warnings ko dekha ja sakta hai lekin ignore bhi kiya ja sakta hai, aur code merge ho jaata hai. Option A aur C dono galat premises hain. Option D directly galat hai — ye poore topic ka core misconception hai jo is question me test ho raha hai.",
    difficulty: "hard",
  },
];

export default quiz;
