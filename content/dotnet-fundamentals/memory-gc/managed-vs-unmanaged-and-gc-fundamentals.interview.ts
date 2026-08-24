import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "managed-unmanaged-tr-1",
    question: "Managed memory aur unmanaged resources me kya fark hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer:
      "Managed memory CLR ke garbage-collected heap pe allocate hoti hai aur automatically reclaim hoti hai; unmanaged resources (file handles, sockets, COM objects) CLR ki bookkeeping se bahar hain, explicit release chahiye.",
    detailedAnswer:
      "Managed memory wo hai jo `new` keyword se CLR ke managed heap pe allocate hoti hai — CLR is memory ka lifetime khud track karta hai aur GC ke through automatically reclaim karta hai. Unmanaged resources — file handles, DB connections, network sockets, COM objects, native memory blocks — OS ya native APIs ke through allocate hote hain, CLR ki understanding se bahar. GC in resources ke baare me kuch nahi jaanta, isliye inhe explicit cleanup (`IDisposable`/`using`) chahiye.",
    followUp: "Agar GC ko unmanaged resources ka pata hi nahi, to `IDisposable` classes me finalizer kyun likhte hain?",
  },
  {
    id: "managed-unmanaged-tr-2",
    question: ".NET ka GC mark-and-sweep algorithm high-level pe kaise kaam karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Mark phase: roots se reachability traverse karke jo bhi reachable hai use alive mark karta hai. Sweep phase: unreachable objects ki memory reclaim karta hai.",
    detailedAnswer:
      "Mark phase me GC ek fixed set of roots (static fields, stack pe local variables/parameters, CPU registers) se start karta hai aur reachability graph traverse karta hai — jo object kisi root se directly ya indirectly reach ho sakta hai, use 'alive' mark kar deta hai. Sweep phase me jo objects mark nahi hue unhe garbage treat kiya jaata hai, unki memory future allocations ke liye reclaim ho jaati hai.",
  },
  {
    id: "managed-unmanaged-tr-3",
    question: "GC roots kya hote hain? Kam se kam teen categories batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Static fields, currently-executing methods ke stack pe local variables/parameters, aur CPU registers me held references.",
    detailedAnswer:
      "Roots wo entry points hain jinse GC apni reachability traversal shuru karta hai: (1) static fields — application lifetime tak jeevit rehte hain, (2) har active thread ke stack pe local variables aur parameters, (3) CPU registers jinme currently reference values held ho sakti hain. Koi bhi heap object jo in roots se kisi bhi chain ke through reach ho sakta hai, GC ke liye 'alive' hai.",
  },
  {
    id: "managed-unmanaged-tr-4",
    question: "Ye code consider karo:\n```csharp\nvoid Process()\n{\n    var data = new byte[1000];\n    DoWork(data);\n}\n```\n`Process()` return hone ke baad `data` array ka kya hota hai?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "`Process()` return hote hi `data` local variable ab root nahi rehta — agar `DoWork` ne reference kahin store nahi ki, array unreachable ho jaata hai, agle GC cycle me collect ho sakta hai.",
    detailedAnswer:
      "`data` ek local variable hai, jo stack root hai sirf `Process()` ke execution ke dauraan. Method return hote hi ye root khatam ho jaata hai. Agar `DoWork(data)` ne array ka reference kahin bahar (jaise ek static field ya returned object) store nahi kiya, array ab kisi bhi root se unreachable hai, aur agla GC cycle jab bhi chale ise collect kar sakta hai — lekin ye turant nahi hota, GC ki apni scheduling pe depend karta hai.",
  },
  {
    id: "managed-unmanaged-tr-5",
    question: "Kya ye statement sahi hai: '.NET me GC hai, isliye memory leaks possible hi nahi hain'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat — unmanaged resources GC ki reach se bahar hain, aur reachable-but-unused managed objects (static refs, unsubscribed events) bhi 'logically leak' ho sakte hain.",
    detailedAnswer:
      "Ye ek common misconception hai. GC sirf unreachable managed memory reclaim karta hai. Do tarah se leak ho sakta hai: (1) unmanaged resources (file handles, sockets, DB connections) jinhe GC bilkul nahi jaanta, explicit Dispose zaroori hai; (2) managed objects jo technically reachable hain (koi static reference, ya event subscription unhe root se connected rakh raha hai) lekin application logically use nahi kar raha — GC unhe kabhi collect nahi karega kyunki wo genuinely reachable hain. Dono cases production incidents ka common source hain.",
    redFlag: "'GC hai to leaks impossible hain' bol dena — batata hai candidate ko GC ke actual mechanism aur scope ki samajh nahi hai.",
  },
  {
    id: "managed-unmanaged-tr-6",
    question: "Ek `SqlConnection` object bina `Dispose()` call kiye scope se bahar chala jaata hai. GC eventually managed wrapper collect kar dega. Kya database connection pool ka slot bhi turant release hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Zaroori nahi — connection pool slot ka release GC collection timing pe depend nahi karta; agar sirf finalizer pe depend kiya jaaye, release delayed ho sakta hai, high-load me pool exhaust ho sakta hai.",
    detailedAnswer:
      "`SqlConnection` ke andar underlying unmanaged native connection resource hota hai. Managed wrapper object collect hone ka matlab ye nahi ki underlying connection pool slot turant release hua — agar cleanup sirf finalizer (non-deterministic) pe depend kare, real release delayed ho sakta hai. High-throughput system me is delay ke accumulate hone se connection pool exhaust ho sakta hai, naye requests timeout dene lagte hain. Isliye `using`/`Dispose()` deterministic cleanup ke liye zaroori hai, sirf GC pe bharosa nahi kiya jaata.",
    followUp: "Is problem ko `using` declaration se kaise solve karoge, aur kyun ye finalizer se better hai?",
  },
  {
    id: "managed-unmanaged-tr-7",
    question: "GC memory allocate karne ke liye responsible hai ya sirf reclaim karne ke liye?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Allocation `new` keyword/CLR runtime ke through hoti hai; GC sirf unreachable memory reclaim (free) karne ke liye responsible hai.",
    detailedAnswer:
      "Jab tum `new SomeClass()` likhte ho, CLR managed heap pe memory allocate karti hai (aur bump-pointer style allocation Gen 0 me typically bahut fast hoti hai). GC iss allocation process ka part nahi hai — GC sirf tab trigger hota hai jab reclaim karna ho, yaani unreachable objects ki memory wapas usable pool me daalni ho. Allocation aur collection do alag concerns hain jo saath milkar memory management provide karte hain.",
  },
  {
    id: "managed-unmanaged-tr-8",
    question: "Kya C/C++ jaisi manual-memory-management languages me common dangling-pointer/double-free bugs .NET me bhi possible hain?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Normal (safe) managed code me nahi — CLR memory lifetime khud track karta hai. `unsafe` code blocks me ye class of bugs phir se possible ho jaati hai.",
    detailedAnswer:
      "Managed code me CLR object lifetime ko khud manage karta hai, references ko bounds-check karta hai — isliye dangling pointers (freed memory access) ya double-free errors structurally possible nahi hain normal C# code me. Lekin `unsafe` blocks me (raw pointers, `stackalloc`, `fixed`) tum in guarantees ke bahar chale jaate ho, aur ye poori class of bugs manually reintroduce ho sakti hai — yahi wajah hai `unsafe` code ko sparingly, aur interop scenarios tak limit rakha jaata hai.",
  },
];

export default questions;
