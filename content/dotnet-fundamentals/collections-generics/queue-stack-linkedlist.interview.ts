import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "queue-stack-ll-tr-1",
    question: "`Queue<T>` aur `Stack<T>` ki ordering semantics me kya fark hai, aur real-world me inka ek-ek use case do.",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer: "Queue FIFO hai (task processing/BFS), Stack LIFO hai (undo-redo/DFS/browser history).",
    detailedAnswer:
      "`Queue<T>` first-in-first-out hai — jo pehle add hua wahi pehle nikalta hai, jaise ek real-world line. Use case: task-processing queues, BFS graph traversal. `Stack<T>` last-in-first-out hai — jo sabse aakhri add hua wahi pehle nikalta hai, jaise plates ka dher. Use case: undo/redo functionality, browser back-button history, DFS graph traversal.",
    followUp: "Function call stack ka Stack<T> se kya connection hai?",
  },
  {
    id: "queue-stack-ll-tr-2",
    question: "Ye code kya print karega?\n```csharp\nvar q = new Queue<int>();\nq.Enqueue(10);\nq.Enqueue(20);\nConsole.WriteLine(q.Peek());\nConsole.WriteLine(q.Count);\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "\"10\" phir \"2\" — Peek() sirf front element dekhta hai bina remove kiye, isliye Count unchanged rehta hai.",
    detailedAnswer:
      "`Peek()` queue ke front element (jo sabse pehle Enqueue hua tha, yahan `10`) return karta hai, lekin usko remove nahi karta — isliye `Count` `2` hi rehta hai. Output: `10` phir `2`.",
  },
  {
    id: "queue-stack-ll-tr-3",
    question: "Ek text editor me undo/redo feature implement karna hai. Kaunsa collection use karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Do `Stack<T>` — ek undo actions ke liye, ek redo actions ke liye. LIFO semantics exactly matches 'sabse recent action pehle undo hona chahiye'.",
    detailedAnswer:
      "Undo functionality ki natural semantics LIFO hai — jo action sabse recently perform hua, wahi sabse pehle undo hona chahiye. `Stack<Action> undoStack` me har action Push hota hai jab wo perform hota hai; undo karte waqt `Pop()` se sabse recent action nikalta hai. Redo ke liye ek doosra `Stack<Action> redoStack` use hota hai — jab kuch undo hota hai, wo redo-stack me push ho jaata hai, taaki agar user redo kare to wapas apply ho sake.",
  },
  {
    id: "queue-stack-ll-tr-4",
    question: "`LinkedList<T>` me index-based access (`linkedList[2]`) kyun support nahi hota?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Kyunki LinkedList contiguous memory nahi hai — har node alag heap-allocated object hai, jisse i-th node tak pahunchne ke liye pointers follow karke traverse karna padta hai (O(n)), array jaisa direct address-calculation possible nahi hai.",
    detailedAnswer:
      "Array ya `List<T>` me index-based access O(1) hota hai kyunki data contiguous memory block me hai — address seedha calculate ho jaata hai. `LinkedList<T>` me har node ek separate, potentially kahin bhi heap pe allocated object hai, sirf agle/pichhle node ka reference rakhta hai. Isse 'i-th node' tak pahunchne ka koi direct formula nahi hai — traverse karna hi padta hai, jo O(n) operation hai. Isiliye `LinkedList<T>` deliberately indexer expose nahi karta, sirf `First`/`Last` aur enumeration (`foreach`) deta hai.",
  },
  {
    id: "queue-stack-ll-tr-5",
    question: "Ye code kya karega?\n```csharp\nvar ll = new LinkedList<int>();\nvar node1 = ll.AddLast(1);\nvar node2 = ll.AddLast(2);\nll.AddAfter(node1, 99);\nConsole.WriteLine(string.Join(\",\", ll));\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"1,99,2\" — 99, node1 (value 1) ke turant baad insert hota hai, node2 (value 2) se pehle.",
    detailedAnswer:
      "Starting sequence `AddLast` se: `1 -> 2`. `AddAfter(node1, 99)` `node1` (value `1`) ke turant baad `99` insert karta hai — result: `1 -> 99 -> 2`. Output: `1,99,2`.",
  },
  {
    id: "queue-stack-ll-tr-6",
    question: "Kya `LinkedList<T>` hamesha `List<T>` se better performance deta hai insertions ke liye, kyunki O(1) vs O(n) hai theoretically?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — real-world me `List<T>` ka cache-friendly contiguous memory aur amortized-O(1) end-append usually behtar practical performance deta hai, especially chhote-medium collections me.",
    detailedAnswer:
      "Big-O complexity theoretical asymptotic behavior batata hai, lekin real-world performance CPU cache behavior se bhi heavily influenced hota hai. `List<T>` ka contiguous array CPU cache lines ko efficiently use karta hai (spatial locality) — sequential access bahut fast hota hai. `LinkedList<T>` ke nodes memory me scattered ho sakte hain — har node access potentially ek cache miss ho sakta hai. Isliye chhote-medium collections me, ya jab insertions mostly end/start pe ho rahi hon (jahan `List<T>` bhi reasonably fast hai), `List<T>` practically jeet jaata hai despite worse theoretical Big-O for middle-insertion. `LinkedList<T>` genuinely tab shine karta hai jab: data bahut bada ho AND frequent known-position insertions ho rahi hon.",
    redFlag: "Blindly Big-O complexity ke basis par data structure choose karna bina real-world cache-behavior consider kiye — ye ek common junior-level mistake hai.",
  },
  {
    id: "queue-stack-ll-tr-7",
    question: "Compiler/runtime function calls ko internally kaise track karta hai, aur iska Stack<T> se kya conceptual connection hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Runtime ek 'call stack' maintain karta hai — har function call ek frame push karta hai, return hone par pop hota hai. Ye exactly LIFO semantics hai jo Stack<T> explicitly expose karta hai.",
    detailedAnswer:
      "Jab ek function doosre function ko call karta hai, runtime us call ki information (local variables, return address) ek 'stack frame' ke roop me call stack pe push karta hai. Jab function return karta hai, uska frame pop ho jaata hai, aur control wapas caller ke frame pe chala jaata hai — jo sabse recently called function tha, wahi sabse pehle return/complete hota hai. Ye bilkul LIFO ordering hai, jo `Stack<T>` collection generalize karke expose karta hai application-level use ke liye (jaise undo functionality).",
  },
  {
    id: "queue-stack-ll-tr-8",
    question: "Multiple riders ko incoming delivery orders fair tareeke se assign karne hain — jo order pehle aaya use pehle process karna hai. `List<Order>` ya `Queue<Order>` — kaunsa use karoge aur kyun?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer: "`Queue<Order>` — FIFO semantics exactly 'first come, first served' fairness guarantee ko naturally enforce karti hai, aur API misuse (jaise beech se element nikalna) ko prevent karti hai.",
    detailedAnswer:
      "`Queue<Order>` use karna sirf functionally correct nahi, semantically bhi behtar hai — API khud restrict karta hai ki sirf front se hi remove ho sakta hai (`Dequeue`), jisse accidentally koi order out-of-order process hone ka risk hi nahi rehta. `List<Order>` bhi technically kaam kar sakta hai (index 0 se remove karke), lekin ye API caller ko galti se beech ka element access/remove karne ki freedom deta hai, jo fairness guarantee ko accidentally break kar sakta hai — Queue is intent ko explicitly enforce karta hai.",
  },
];

export default questions;
