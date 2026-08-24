import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "idisposable-1",
    question: ".NET ka Garbage Collector unmanaged resources (jaise file handles, DB connections) ko directly kyun clean nahi kar sakta?",
    options: [
      "GC ka design purana hai, ye feature future me add hoga",
      "GC sirf managed memory (heap pe allocated .NET objects) samajhta hai — unmanaged/OS-level resources uski understanding se bahar hain",
      "GC sirf structs ko clean karta hai, classes ko nahi",
      "Unmanaged resources memory hi nahi use karte, isliye cleanup ki zaroorat nahi",
    ],
    correctIndex: 1,
    explanation:
      "GC ka scope sirf managed heap tak limited hai — .NET objects jo GC track karta hai. File handles, sockets, DB connections jaise unmanaged/OS-level resources GC ki understanding se bahar hain, isliye inhe explicit cleanup (IDisposable.Dispose()) chahiye hota hai. Option A galat hai, ye ek fundamental design boundary hai, 'future fix' wali baat nahi. Option C galat hai, ye class-vs-struct distinction se unrelated hai. Option D galat hai, unmanaged resources OS-level handles/memory use karte hain jo genuinely leak ho sakte hain.",
    difficulty: "medium",
  },
  {
    id: "idisposable-2",
    question: "`using` block ke andar exception aa jaaye to `Dispose()` call hogi ya nahi?",
    options: [
      "Nahi, exception aane pe Dispose() skip ho jaati hai",
      "Haan, guaranteed call hogi — compiler using block ko try/finally me translate karta hai, aur Dispose() finally block me hoti hai",
      "Sirf tab call hogi jab exception explicitly catch ki jaaye",
      "Ye depend karta hai exception ke type pe",
    ],
    correctIndex: 1,
    explanation:
      "using statement compile-time pe try/finally me translate hota hai — Dispose() finally block ke andar call hoti hai, jo guarantee karta hai ki cleanup ho, chahe try block me exception aaye ya normal completion ho. Options A, C, D sab is guarantee ko galat represent karte hain — Dispose() ka call exception handling se independent hai.",
    difficulty: "easy",
  },
  {
    id: "idisposable-3",
    question: "Finalizer (`~ClassName()`) ko resource cleanup ka PRIMARY mechanism kyun nahi banaya jaana chahiye?",
    options: [
      "Finalizers sirf structs pe kaam karte hain",
      "Finalizer timing non-deterministic hai — GC decide karta hai kab (ya crash jaisi edge cases me kabhi nahi) usse call karega, isliye resources der tak held reh sakte hain",
      "Finalizers hamesha compile error dete hain",
      "Finalizers sirf .NET Framework me the, .NET Core me remove ho gaye",
    ],
    correctIndex: 1,
    explanation:
      "Finalizer ka execution GC ke control me hai, tumhare control me nahi — koi guarantee nahi ki wo kab run hoga, sirf itna pata hai ki object garbage ban chuka hai to 'kabhi' run hoga. High-throughput systems me sirf finalizer pe depend karna resource exhaustion (jaise connection pool exhaustion) jaisa real incident bana sakta hai. Options A, C, D sab factually galat hain — finalizers classes ke liye hain, valid syntax hai, aur .NET Core me bhi exist karte hain.",
    difficulty: "medium",
  },
  {
    id: "idisposable-4",
    question: "GC generations (Gen 0, 1, 2) me se kaunsi collection sabse 'cheap' (fast) hoti hai, aur kyun?",
    options: [
      "Gen 2, kyunki usme sabse zyada objects hote hain",
      "Gen 0, kyunki ye ek chhota region hota hai jahan zyadatar objects already dead ho chuke hote hain — 'generational hypothesis' ye assume karta hai zyadatar objects short-lived hote hain",
      "Sabhi generations equally expensive hoti hain",
      "Gen 1, kyunki ye beech ka generation hai",
    ],
    correctIndex: 1,
    explanation:
      "Gen 0 collection sabse cheap hai kyunki ye sirf ek chhote 'nursery' region ko scan karta hai jahan zyadatar objects already unreachable (dead) ho chuke hote hain — 'generational hypothesis' (zyadatar objects short-lived hote hain) is design ka core assumption hai. Gen 2 sabse expensive hai kyunki usme long-lived objects hote hain aur usko scan karne me zyada kaam lagta hai. Option A ulta bata raha hai. Option C galat hai, generations specifically alag-alag cost ke liye design ki gayi hain. Option D bhi galat hai, Gen 1 Gen 0 se zyada expensive hai but Gen 2 se kam.",
    difficulty: "hard",
  },
];

export default quiz;
