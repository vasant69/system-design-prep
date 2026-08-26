import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "race-tr-1",
    question: "Race condition kya hai? Ek concrete, code-level example ke saath explain karo.",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer:
      "Multiple threads shared mutable state ko bina synchronization ke read/write karte hain, isliye final result thread-scheduling timing pe depend karta hai — classic example: `_count++` se lost update.",
    detailedAnswer:
      "`_count++` ek atomic operation nahi hai — read (memory se value uthao), increment (register me badhao), write (wapas memory me daalo), teen steps. Agar do threads simultaneously ye interleave karte hain (dono same purani value read karte hain, dono apna-apna increment likhte hain), ek thread ka write doosre ka silently overwrite kar deta hai — ek increment 'lost' ho jaata hai. Result: expected count se kam milta hai, aur ye non-deterministic hai — kabhi hota hai, kabhi nahi.",
    followUp: "Isko fix karne ke kitne tarike hain, aur kab kaunsa use karoge?",
  },
  {
    id: "race-tr-2",
    question: "`lock` statement kya karta hai internally, aur ise kaise use karna chahiye (lock object ki choice sahit)?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`Monitor.Enter`/`Monitor.Exit` ka syntactic sugar (with try/finally) — ek dedicated private readonly object ko lock target banao, kabhi publicly-accessible object nahi.",
    detailedAnswer:
      "`lock (obj) { ... }` compile hokar `Monitor.Enter(obj); try { ... } finally { Monitor.Exit(obj); }` ban jaata hai — finally ensure karta hai exception aane par bhi lock release ho. Lock object ke liye ek private, dedicated `readonly object` best practice hai — `this` ya koi public/string object use karne se koi bahar ka unrelated code accidentally usi object pe lock le sakta hai, jisse unexpected contention ya even deadlock ban sakta hai.",
  },
  {
    id: "race-tr-3",
    question: "Ye code diya gaya hai — do threads ise concurrently call karte hain:\n```csharp\nprivate int _balance = 100;\npublic void Withdraw(int amount)\n{\n    if (_balance >= amount)\n    {\n        Thread.Sleep(10); // simulate some processing\n        _balance -= amount;\n    }\n}\n```\nDo threads `Withdraw(80)` simultaneously call karte hain. Kya problem ho sakti hai?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Dono threads check pass kar sakte hain (dono `_balance >= 80` true dekhte hain) is se pehle ki koi withdraw kare — balance negative ho sakta hai.",
    detailedAnswer:
      "Ye ek 'check-then-act' race condition hai. Thread A `_balance >= 80` check karta hai (true, `_balance = 100`), phir `Thread.Sleep(10)` ke dauraan Thread B bhi wahi check karta hai — us waqt bhi `_balance` abhi 100 hi hai, to Thread B ka check bhi true hota hai. Dono ab `_balance -= 80` karte hain — final `_balance = -60`, jo business rule (never negative) violate karta hai. Fix: poore check-and-act block ko ek `lock` ke andar atomic banana.",
    followUp: "Database level pe same problem ko kaise handle karoge (optimistic vs pessimistic concurrency)?",
  },
  {
    id: "race-tr-4",
    question: "Kya `lock` hamesha sahi solution hai race condition ke liye, ya kabhi ye overkill/wrong choice hota hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — kai cases me immutable data, `Interlocked` (simple atomic ops ke liye), ya `ConcurrentDictionary` jaisi collections zyada efficient aur simpler hote hain.",
    detailedAnswer:
      "`lock` general-purpose hai lekin har simple case ke liye best nahi. Sirf ek counter increment/decrement karna ho to `Interlocked.Increment`/`Decrement` (lock-free, CPU-level atomic instructions) zyada efficient hai. Shared collection manage karni ho to `ConcurrentDictionary`/`ConcurrentQueue` internal fine-grained locking use karte hain jo ek coarse `lock` se better perform karta hai. Agar state ko immutable bana sakte ho, koi synchronization ki zaroorat hi nahi. `lock` sabse general lekin sabse coarse-grained tool hai — reach for it jab specific tools fit na baithein.",
    redFlag: "Har concurrency problem ko sirf `lock` se solve karne ki koshish karna, bina alternatives (Interlocked, concurrent collections, immutability) consider kiye.",
  },
  {
    id: "race-tr-5",
    question: "Ek CI pipeline me ek test suite kabhi-kabhi (maybe 1 in 50 runs) ek assertion fail karta hai jo shared state involve karta hai, lekin baaki 49 runs pass ho jaate hain. Tumhara pehla suspicion kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ye ek genuine race condition ho sakti hai — 'flaky test' label deke ignore karna galat approach hai, code me actual unsynchronized shared-state access dhundhna chahiye.",
    detailedAnswer:
      "Intermittent, non-reproducible-on-demand failures ek classic race condition signature hain — timing-dependent bugs consistently fail nahi karte, sirf kabhi-kabhi jab specific thread interleaving ho jaaye. Bahut teams isko galti se 'flaky test, re-run kar do' bol kar ignore kar dete hain, jabki asal me ye production me bhi kabhi-kabhi fail karega, sirf kam frequency pe (aur real users ke liye zyada costly). Sahi approach: test ke under-test code me shared mutable state access dhundhna, aur verify karna ki proper synchronization (lock/Interlocked/concurrent collection) laga hai ya nahi.",
  },
  {
    id: "race-tr-6",
    question: "Ye code kya print karega, aur race condition kahan hai?\n```csharp\nvar list = new List<int>();\nParallel.For(0, 1000, i => list.Add(i));\nConsole.WriteLine(list.Count);\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Unpredictable — `List<T>.Add` thread-safe nahi hai, isliye ye crash bhi kar sakta hai (IndexOutOfRangeException jaisa internal error) ya galat count de sakta hai.",
    detailedAnswer:
      "`List<T>` explicitly documented hai as NOT thread-safe for concurrent writes. `Add()` internally array resize aur index management karta hai jo multiple threads se simultaneously call hone par corrupt ho sakta hai — result unpredictable hai: kabhi count 1000 se kam aayega (lost additions), kabhi runtime exception aayegi internal array corruption ki wajah se. Fix: `ConcurrentBag<int>` use karo, ya `lock` ke andar `Add` wrap karo, ya `Parallel.For` ka thread-local aggregation overload use karo.",
    followUp: "`ConcurrentBag<T>` aur `List<T>` + lock me performance ka fark kyun hota hai high-contention scenarios me?",
  },
];

export default questions;
