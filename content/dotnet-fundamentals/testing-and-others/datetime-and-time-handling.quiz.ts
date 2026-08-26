import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "datetime-time-handling-1",
    question:
      "`DateTime.Kind = DateTimeKind.Unspecified` ka kya matlab hai?",
    options: [
      "Value definitely UTC hai",
      "Value definitely local time hai",
      ".NET ko pata nahi ye value UTC hai ya local — koi conversion operation apni khud ki (potentially galat) assumption banayegi",
      "Ye ek invalid/corrupt DateTime value hai",
    ],
    correctIndex: 2,
    explanation:
      "`Unspecified` ka literal matlab hai ki Kind metadata clearly UTC ya Local nahi bataata. Ye ek common source of bugs hai kyunki `.ToLocalTime()`/`.ToUniversalTime()` jaisi operations apni khud ki assumption bana legi (jaise value ko UTC maan lena) jo galat ho sakti hai. Options A aur B galat hain kyunki `Unspecified` explicitly na UTC hai na Local. Option D factually galat hai — ye ek valid DateTimeKind value hai.",
    difficulty: "medium",
  },
  {
    id: "datetime-time-handling-2",
    question:
      "`DateTimeOffset` `DateTime` se kis tarah fundamentally different hai?",
    options: [
      "DateTimeOffset sirf date store karta hai, time nahi",
      "DateTimeOffset ek explicit UTC offset value ke saath carry karta hai, jisse ye unambiguous point-in-time represent karta hai",
      "DateTimeOffset sirf .NET Framework me available hai, .NET Core me nahi",
      "Koi functional difference nahi, sirf naam alag hai",
    ],
    correctIndex: 1,
    explanation:
      "DateTimeOffset value ke saath ek explicit offset (jaise +05:30) store karta hai, jo bataata hai ye moment UTC se kitna door hai — isse ambiguity structurally khatam ho jaati hai jo DateTime.Kind ke saath exist karti hai. Option A galat hai — DateTimeOffset time bhi store karta hai. Option C factually galat hai. Option D galat hai — ye ek genuine, meaningful functional difference hai.",
    difficulty: "medium",
  },
  {
    id: "datetime-time-handling-3",
    question:
      "DateTime handling ke liye industry-standard best practice kya hai?",
    options: [
      "Database me hamesha server local time store karo",
      "Database me hamesha UTC store karo, aur local time me convert sirf display layer pe karo",
      "Har request me user se unki timezone poochho aur wahi store karo",
      "DateTime.Kind ko hamesha Unspecified rakho consistency ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Standard practice UTC ko single source of truth ki tarah store karna hai — isse server location, deployment region, ya user timezone change hone se data ki meaning nahi badalti. Conversion sirf display/UI layer pe honi chahiye. Options A, C, aur D sab practical problems create karte hain (ambiguity, inconsistency, unnecessary complexity).",
    difficulty: "easy",
  },
  {
    id: "datetime-time-handling-4",
    question:
      "Ek 'date of birth' field ke liye C# 10+ me kaunsa type sabse appropriate hai?",
    options: [
      "DateTime, time part ko zero-out karke",
      "DateOnly",
      "TimeOnly",
      "TimeSpan",
    ],
    correctIndex: 1,
    explanation:
      "DateOnly specifically date-only data ke liye C# 10 me introduce kiya gaya — 'date of birth' jaisi fields ke liye time-of-day genuinely irrelevant hai, aur DateOnly use karna intent ko explicit banata hai. Option A purana workaround hai jo ambiguity create karta hai. TimeOnly (option C) sirf time ke liye hai, date ke liye nahi. TimeSpan (option D) ek duration represent karta hai, ek specific calendar date nahi.",
    difficulty: "easy",
  },
];

export default quiz;
