import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "process-thread-pool-tr-1",
    question: "Process, Thread, aur ThreadPool me kya fark hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer:
      "Process = isolated, own memory. Thread = execution unit inside a process, shares memory. ThreadPool = a managed set of reusable threads.",
    detailedAnswer:
      "Process ek independent unit hai apne khud ke memory space ke saath — OS-level isolation, expensive to create. Thread process ke andar chalta hai, apna call stack rakhta hai lekin process ki heap memory doosre threads ke saath share karta hai — thread creation bhi mehenga hai (stack allocation) lekin process se sasta. ThreadPool ek runtime-managed collection of reusable worker threads hai jo baar-baar thread create/destroy karne ka overhead avoid karta hai.",
    followUp: "Task aur Thread me kya fark hai?",
  },
  {
    id: "process-thread-pool-tr-2",
    question: "Ek process ke crash hone se doosre process par kya effect padta hai, aur kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Usually koi effect nahi — processes OS-level isolated hote hain, apna alag memory space rakhte hain.",
    detailedAnswer:
      "Har process ko OS apna khud ka virtual memory address space deta hai — ek process doosre ki memory ko directly access nahi kar sakta. Isliye ek process crash hone par doosra process independently chalta rehta hai (jab tak explicit IPC dependency na ho). Yahi wajah hai browsers alag tabs ko alag processes me chalate hain — ek tab crash ho, poora browser nahi girta.",
  },
  {
    id: "process-thread-pool-tr-3",
    question: "Same process ke do threads memory kaise share karte hain, aur isse kya risk aata hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Threads process ki heap memory share karte hain — shared mutable state par bina synchronization ke race conditions ban sakti hain.",
    detailedAnswer:
      "Ek process ke saare threads same heap memory access karte hain — same object references, same static variables sabko visible hote hain. Har thread ka sirf call stack aur registers isolated hote hain. Ye sharing power deta hai (fast inter-thread communication, no serialization needed) lekin danger bhi — agar do threads ek shared object ko simultaneously, bina lock ke, modify karein, race condition ban sakti hai (is module ke ek alag topic me detail me cover hota hai).",
  },
  {
    id: "process-thread-pool-tr-4",
    question: "ThreadPool ka basic purpose kya hai, aur ye raw `Thread` creation se better kyun hai repeated short-lived work ke liye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Thread reuse — baar-baar create/destroy ka overhead avoid karta hai.",
    detailedAnswer:
      "Har naya `Thread` banana OS-level allocation hai (stack allocation, kernel bookkeeping) — repeated short-lived kaam ke liye ye overhead accumulate ho jaata hai. ThreadPool pehle se banaye hue, reusable worker threads ka ek set maintain karta hai — kaam submit karo, ek free thread use hota hai, kaam khatam hone par thread destroy nahi hota, pool me wapas available ho jaata hai. Isse per-task overhead drastically kam ho jaata hai.",
  },
  {
    id: "process-thread-pool-tr-5",
    question: "Ye code kya karega?\n```csharp\nfor (int i = 0; i < 5000; i++)\n{\n    new Thread(() => Process(i)).Start();\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "5000 dedicated OS threads spawn karega — memory (stack allocations) aur context-switching overhead se system severely stressed ho sakta hai, potentially OutOfMemoryException.",
    detailedAnswer:
      "Har loop iteration ek naya, dedicated `Thread` banata hai — koi reuse nahi. 5000 threads ka matlab ~5000MB (default 1MB stack each, though OS may lazily commit) potential memory commitment, aur OS scheduler ko 5000 threads ke beech context-switch karna padega. Real systems me ye either severe performance degradation ya OutOfMemoryException/resource exhaustion tak le ja sakta hai. Fix: `Task.Run` ya `Parallel.ForEach` use karo, jo ThreadPool ke bounded, reusable threads se kaam lete hain.",
  },
  {
    id: "process-thread-pool-tr-6",
    question: "Kya `Task.Run()` hamesha ek naya thread banata hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — ye ThreadPool se ek existing, reusable thread leta hai, naya thread nahi banata.",
    detailedAnswer:
      "Ek common galat samajh hai ki `Task.Run` = `new Thread()`. Asal me `Task.Run` ThreadPool ko kaam queue karta hai — agar pool me ek free thread available hai, wahi reuse hoti hai, koi naya OS thread create nahi hota har baar. Sirf tab naya thread banega jab pool ke paas currently koi free thread na ho aur injection algorithm decide kare ki pool grow karna zaroori hai.",
    redFlag: "'Task.Run() hamesha naya thread create karta hai' bolna — ThreadPool ke reuse model ki galat samajh dikhata hai.",
  },
  {
    id: "process-thread-pool-tr-7",
    question: "Ek scenario: tumhe ek continuously-running, dedicated background worker chahiye jo poori app lifetime me ek hi thread par chale, koi pool sharing nahi. Kya use karoge — `Task.Run` ya raw `Thread`?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Raw `Thread` — kyunki iska use case genuinely ek dedicated, long-lived thread hai, na ki short-lived, reusable work.",
    detailedAnswer:
      "ThreadPool short-lived, bursty work ke liye optimize hai — reuse model. Agar tumhe genuinely ek hi thread ko poori app lifetime tak dedicated rakhna hai (jaise ek continuously-polling worker jise tum background priority set karna chahte ho, ya jisse tum `IsBackground` flag control karna chahte ho), raw `Thread` better fit hai. Lekin practically, `IHostedService`/`BackgroundService` (ASP.NET Core) is use case ko bhi ThreadPool ke upar hi cleanly handle kar deta hai — raw `Thread` ki zaroorat aajkal bahut rare hai.",
    followUp: "IHostedService kis tarah is problem ko solve karta hai?",
  },
  {
    id: "process-thread-pool-tr-8",
    question: "Process isolation aur thread 'isolation' me kya fundamental fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Process poori tarah isolated hai (memory bhi), thread sirf apna call stack isolated rakhta hai — heap memory shared hoti hai.",
    detailedAnswer:
      "Process-level isolation OS-enforced hai — ek process doosre ki memory ko access nahi kar sakta, crash bhi isolated rehta hai. Thread-level 'isolation' bahut narrower hai — sirf call stack aur registers per-thread hote hain, heap memory (objects, static fields) process ke saare threads ke beech shared rehti hai. Isliye ek thread ka unhandled exception poore process ko crash kar sakta hai — thread-level isolation process jitni strong nahi hai.",
  },
  {
    id: "process-thread-pool-tr-9",
    question: "ThreadPool suddenly ek bada burst of work receive karta hai — kya ye instantly utne hi naye threads spawn kar dega jitna kaam hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — ThreadPool ek controlled rate se naye threads add karta hai (thread injection algorithm), instant unlimited spawn nahi.",
    detailedAnswer:
      "Agar ThreadPool sudden burst par instantly hazaaron threads spawn kar de, wahi problem ho jaayegi jo raw `Thread` creation se hoti hai — memory aur context-switching overload. Isliye ThreadPool ek gradual 'thread injection' algorithm follow karta hai, roughly ek naya thread ek controlled interval par, taaki system stable rahe. Iska matlab hai ki bahut sudden, massive burst load me shuru me thoda queueing delay dikh sakta hai jab tak pool naturally grow na kare.",
  },
];

export default questions;
