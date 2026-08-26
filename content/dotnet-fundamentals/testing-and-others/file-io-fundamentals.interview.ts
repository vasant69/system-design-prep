import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "file-io-fundamentals-tr-1",
    question: "Local disk I/O ke liye bhi async File APIs kyun use karni chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer:
      "Disk I/O ek genuine OS-level blocking system call hai — sync I/O server context me thread pool thread ko block karta hai, jo high-load scenario me throughput girata hai.",
    detailedAnswer:
      "Ek common misconception hai ki disk local hone ki wajah se async ki zaroorat nahi. Reality me disk read/write ek genuine blocking OS call hai — thread wait karta hai jab tak operation complete na ho. Server context (ASP.NET Core) me, ye us thread ko doosri requests serve karne se rok deta hai. Async I/O thread ko turant pool me wapas chhod deta hai, better overall server throughput deta hai under load.",
    followUp: "Ek simple console utility script me bhi ye equally critical hai?",
  },
  {
    id: "file-io-fundamentals-tr-2",
    question: "FileStream ko `using` ke bina use karne se kya problem ho sakti hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "FileStream ek unmanaged OS file handle wrap karta hai — Dispose() na hone se handle leak ho sakta hai, aur baad me file access 'file in use' error de sakta hai.",
    detailedAnswer:
      "FileStream IDisposable implement karta hai kyunki underlying resource (OS file handle) GC ki normal garbage collection se independently manage hota hai. Agar Dispose() explicitly (using ke through) call na ho, handle tab tak open reh sakta hai jab tak finalizer chal na jaaye (unpredictable timing), jisse concurrent file access errors ya resource exhaustion ho sakta hai.",
  },
  {
    id: "file-io-fundamentals-tr-3",
    question: "File.ReadAllText aur StreamReader me kab kya use karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "File.ReadAllText chhoti files ke liye jab poori content ek saath chahiye ho; StreamReader jab file badi ho aur line-by-line/streaming process karni ho bina poora memory me load kiye.",
    detailedAnswer:
      "File.ReadAllText simplicity deta hai lekin poori file memory me load karta hai — chhoti config files ke liye fine hai. Ek multi-GB log file ke liye ye OutOfMemoryException ka risk create karta hai. StreamReader.ReadLineAsync() se file ko incrementally process kiya ja sakta hai, memory footprint constant rehta hai file size se independent.",
    followUp: "Agar file ka size runtime pe pata nahi ho, kaunsa approach safer hai default?",
  },
  {
    id: "file-io-fundamentals-tr-4",
    question: "Path.Combine use karne ka kya fayda hai manual string concatenation ke bajaye?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Ye current OS ke sahi path separator (\\ ya /) automatically use karta hai, cross-platform deployment bugs avoid karta hai.",
    detailedAnswer:
      "Windows '\\' use karta hai, Linux/Mac '/' use karte hain. Agar tum hardcoded '\\' se path banao aur app Linux container me deploy ho, path resolution fail ho sakta hai. Path.Combine ye complexity abstract kar deta hai — automatically sahi separator use karta hai jo bhi OS pe app run ho raha ho.",
  },
  {
    id: "file-io-fundamentals-tr-5",
    question: "Ek high-traffic API endpoint file upload accept karta hai aur `File.WriteAllBytes` (sync) use karta hai. Load testing me response times spike ho rahe hain peak hours pe. Kya problem ho sakti hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Sync file write thread pool threads ko block kar raha hai — concurrent uploads badhne par thread pool exhaust ho raha hai, jisse naye requests queue me wait karte hain.",
    detailedAnswer:
      "Ye exactly wo pattern hai jo thread pool starvation cause karta hai — har concurrent upload request ek thread ko poore write duration ke liye block karta hai. Jab concurrent requests thread pool size se zyada ho jaate hain, naye requests ko available thread ka wait karna padta hai, jo response time spikes dikhta hai. Fix: `WriteAllBytesAsync` pe switch karna, jisse threads wait ke dauraan free ho jaate hain doosri requests serve karne ke liye.",
    redFlag: "Ye kehna ki 'disk local hai isliye sync I/O koi issue nahi create karega' — ye exactly wo misconception hai jo is bug ko cause karti hai.",
  },
  {
    id: "file-io-fundamentals-tr-6",
    question: "Directory.Exists check karne ke baad Directory.CreateDirectory call karna — is pattern me koi race condition concern hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Theoretically haan agar multiple processes/threads simultaneously same directory create karne ki koshish karein, lekin CreateDirectory khud idempotent hai — already-exists case me exception nahi deta, isliye practically safe hai.",
    detailedAnswer:
      "Directory.CreateDirectory ek 'create if not exists' semantics follow karta hai — agar directory already exist karti hai (chahe check-and-create ke beech kisi aur process ne bana di ho), ye exception nahi throwta, bas silently succeed hota hai. Isliye explicit Directory.Exists check technically redundant hai concurrent-safety ke liye (though readability ke liye kabhi likha jaata hai) — CreateDirectory akela hi safe hai.",
  },
  {
    id: "file-io-fundamentals-tr-7",
    question: "Kya sync File I/O APIs kabhi bhi acceptable hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Haan — simple console utility scripts ya one-off tools me jahan thread pool contention ka concern nahi hai, sync I/O poori tarah acceptable hai.",
    detailedAnswer:
      "Async I/O ka fayda specifically server scenarios me hai jahan limited thread pool capacity multiple concurrent requests serve kar rahi hoti hai. Ek standalone console application ya build script me, sync I/O simpler code deta hai bina kisi meaningful downside ke, kyunki wahan koi doosri request wait nahi kar rahi us thread ke free hone ka.",
  },
];

export default questions;
