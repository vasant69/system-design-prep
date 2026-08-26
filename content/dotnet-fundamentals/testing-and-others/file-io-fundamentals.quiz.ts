import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "file-io-fundamentals-1",
    question:
      "ASP.NET Core request handler me sync `File.ReadAllText` use karne ka high-load scenario me kya risk hai?",
    options: [
      "Koi risk nahi, disk local hai isliye fast hai",
      "Calling thread pool thread poore read duration ke liye block ho jaata hai, jo thread pool exhaustion aur reduced server throughput ka risk create karta hai",
      "File corrupt ho sakti hai",
      "Ye compile error dega",
    ],
    correctIndex: 1,
    explanation:
      "Disk I/O ek genuine OS-level blocking system call hai. Sync file read ek thread pool thread ko block karta hai jab tak disk operation complete na ho — high-concurrency scenario me ye thread pool ko exhaust kar sakta hai, jisse server naye requests handle karne ki capacity kam ho jaati hai. Options C aur D factually galat hain, aur option A common lekin galat reasoning hai — 'local' hone se blocking nature khatam nahi hoti.",
    difficulty: "medium",
  },
  {
    id: "file-io-fundamentals-2",
    question:
      "`FileStream` object ko `using` statement ke saath wrap karna kyun zaroori hai?",
    options: [
      "Sirf code ko chhota dikhane ke liye",
      "FileStream ek unmanaged OS file handle wrap karta hai jise explicitly Dispose() karna padta hai",
      "using na lagane se compile error aata hai",
      "Ye sirf async methods ke saath zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "FileStream IDisposable implement karta hai kyunki ye ek unmanaged resource (OS file handle) hold karta hai — GC ise automatically turant clean nahi karta. using statement guarantee karta hai Dispose() call ho, warna file handle leak ho sakta hai aur baad me file access errors aa sakte hain. Option C galat hai — ye runtime resource-leak issue hai, compile error nahi.",
    difficulty: "medium",
  },
  {
    id: "file-io-fundamentals-3",
    question:
      "Path.Combine(baseDirectory, \"uploads\", fileName) use karne ka main fayda kya hai hardcoded string concatenation ke comparison me?",
    options: [
      "Ye faster execute hota hai",
      "Ye OS-specific path separators (Windows ka \\ vs Linux/Mac ka /) ko sahi tarah handle karta hai, cross-platform bugs avoid karta hai",
      "Ye automatically file create kar deta hai",
      "Ye file ko encrypt kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Path.Combine current OS ke correct path separator ka use karta hai automatically — hardcoded '\\' ya '/' se manually concatenate karne se Windows pe theek chalne wala code Linux deployment pe break ho sakta hai (ya vice versa). Options A, C, aur D iska actual purpose describe nahi karte.",
    difficulty: "easy",
  },
  {
    id: "file-io-fundamentals-4",
    question:
      "Ek multi-GB log file ko line-by-line process karna hai bina poori file memory me load kiye. Kaunsa approach sahi hai?",
    options: [
      "File.ReadAllText() poori file ek string me load karke",
      "File.ReadAllLines() jo saari lines ek array me load kare",
      "StreamReader ke ReadLineAsync() se ek-ek line stream karke",
      "File.ReadAllBytes() poori file byte array me load karke",
    ],
    correctIndex: 2,
    explanation:
      "StreamReader.ReadLineAsync() file ko line-by-line stream karta hai bina poori file ko memory me load kiye — large files ke liye memory-efficient approach hai. Options A, B, aur D sab poori file (ya uski saari lines) ek saath memory me load karte hain, jo multi-GB file ke liye OutOfMemoryException ka risk create kar sakta hai.",
    difficulty: "medium",
  },
];

export default quiz;
