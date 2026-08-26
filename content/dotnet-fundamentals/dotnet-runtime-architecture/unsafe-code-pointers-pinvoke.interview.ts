import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "unsafe-code-pointers-pinvoke-tr-1",
    question: "Kya C# me pointers use ho sakte hain? Agar haan, to kaise aur kab?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft"],
    shortAnswer: "Haan, `unsafe` blocks ke andar raw pointers declare/dereference/arithmetic possible hai — narrow, performance-critical ya interop scenarios ke liye.",
    detailedAnswer:
      "C# `unsafe` keyword ek scoped block ko allow karta hai jaha raw pointers (`int* ptr`) declare, dereference, aur arithmetic ki ja sakti hai — bilkul C/C++ jaisa. Ye CLR ki normal memory-safety guarantees (bounds checking, type safety, GC-safe references) explicitly off kar deta hai. Isliye ye day-to-day business logic me use nahi hota — sirf genuinely performance-critical hot paths (jaise low-level parsing/serialization) ya native interop scenarios me use hota hai, aur `.csproj` me `AllowUnsafeBlocks` explicitly enable karna padta hai.",
    followUp: "`fixed` statement iske saath kyun zaroori hota hai?",
  },
  {
    id: "unsafe-code-pointers-pinvoke-tr-2",
    question: "`fixed` statement kyun zaroori hai jab hum ek managed array ka raw pointer le rahe hote hain?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "GC managed objects ko compaction ke dauraan move kar sakta hai — `fixed` object ko temporarily pin karta hai taaki raw pointer dangling na ho jaaye.",
    detailedAnswer:
      "GC ke generational/compacting collector managed heap objects ko move kar sakte hain (jaise Gen 0 se Gen 1 promotion ke dauraan compaction). Agar unsafe code ne kisi array ka direct memory address (pointer) le rakha hai aur GC beech me us array ko move kar de, wo pointer ab galat memory location point karega — undefined behavior/crash. `fixed (int* ptr = array) { ... }` GC ko us object ko block ke duration ke liye move karne se rokta hai (pin karta hai), taaki pointer valid rahe.",
  },
  {
    id: "unsafe-code-pointers-pinvoke-tr-3",
    question: "Long-lived `fixed` pinning se kya problem ho sakti hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "GC compaction efficiency hurt hoti hai — pinned object ko around move nahi kiya ja sakta, jo heap fragmentation badha sakta hai.",
    detailedAnswer:
      "GC compaction ke dauraan objects ko contiguous memory me rearrange karta hai, fragmentation kam karne ke liye. Ek pinned object (`fixed` block ke andar) ko is process me move nahi kiya ja sakta — agar bahut saare objects lambe samay ke liye pinned rehte hain, GC ko unke around 'kaam' karna padta hai, jo compaction ki effectiveness kam karta hai aur heap fragmentation badha sakta hai. Isliye `fixed` scope ko jaanbujh kar chhota rakha jaata hai.",
  },
  {
    id: "unsafe-code-pointers-pinvoke-tr-4",
    question: "`stackalloc` heap allocation se kaise alag hai, aur ye kab appropriate hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Stack pe allocate hota hai, method return hote hi automatically free ho jaata hai — koi GC involvement nahi. Chhoti, short-lived buffers ke liye appropriate hai.",
    detailedAnswer:
      "`stackalloc` memory ko current thread ke call stack pe allocate karta hai, heap pe nahi. Iska fayda: allocation genuinely fast hai, aur method return hote hi memory automatically reclaim ho jaati hai — GC ko kabhi involve hone ki zaroorat nahi padti. Ye chhoti, short-lived buffers ke liye appropriate hai (jaise ek parsing routine ka temporary scratch space) — bade ya lambe-jeevit data ke liye stack overflow risk ki wajah se inappropriate hai.",
    followUp: "Ise `unsafe` ke bina kaise use kiya ja sakta hai?",
  },
  {
    id: "unsafe-code-pointers-pinvoke-tr-5",
    question: "P/Invoke kya hai, aur `[DllImport]` attribute isme kya role play karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "P/Invoke managed C# ko native library functions call karne deta hai; `[DllImport]` batata hai method actually kis native `.dll` me define hai.",
    detailedAnswer:
      "P/Invoke (Platform Invoke) ek managed method declaration (`extern` keyword ke saath, body-less) ko ek native, unmanaged library ke actual exported function se link karta hai. `[DllImport(\"user32.dll\")]` attribute CLR ko batata hai kis native `.dll` me ye function dhoondna hai. Call hone par, CLR native function locate karta hai, managed aur unmanaged type representations ke beech marshaling karta hai (jaise C# `string` ko native `char*` me convert karna), aur native code invoke karta hai.",
  },
  {
    id: "unsafe-code-pointers-pinvoke-tr-6",
    question: "Ek company ke paas ek existing, battle-tested native C++ SDK hai hardware ke liye, aur koi .NET wrapper available nahi hai. .NET application se ise use karne ka best approach kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Poora SDK rewrite karne ke bajaye, P/Invoke ke through zaroori native functions ko call karo, ek thin managed wrapper class ke andar encapsulate karke.",
    detailedAnswer:
      "Native library ko poora C# me rewrite karna impractical aur risky hoga (bugs re-introduce hone ka risk, maintenance overhead). Better approach: `[DllImport]` ke saath zaroori native functions ke liye P/Invoke declarations banao, aur unhe ek dedicated, thin managed wrapper class ke andar encapsulate karo. Baaki application code sirf is clean, managed wrapper API se interact kare — P/Invoke ki complexity (marshaling, error handling) ek isolated jagah confined rehti hai, poore codebase me spread nahi hoti.",
    followUp: "Encapsulation ka ye pattern kis broader software-design principle se milta hai?",
  },
  {
    id: "unsafe-code-pointers-pinvoke-tr-7",
    question: "Kya ye statement sahi hai: '`unsafe` code hamesha bad practice hai, production code me kabhi use nahi karni chahiye'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Overly absolute — .NET runtime khud internally `unsafe` code use karta hai performance-critical, well-tested, encapsulated paths me.",
    detailedAnswer:
      "Ye blanket statement galat hai. `unsafe` genuinely risky hai (memory-safety off ho jaati hai) isliye casually avoid karna sahi default hai, lekin .NET runtime khud (jaise `Span<T>`/`Memory<T>` ka internal implementation, kuch high-performance collection internals) `unsafe` code heavily use karta hai — bas ye poori tarah encapsulated hoti hai safe, public APIs ke peeche, aur extensively tested hoti hai. Correct guidance hai: `unsafe` ko avoid karo jab tak genuinely justified na ho (interop, extreme perf-critical hot path), aur jab use karo to tightly encapsulate/test karo, blanket 'never use' nahi.",
    redFlag: "'unsafe code kabhi bhi use nahi karni chahiye' jaisa absolute statement — ye .NET runtime ke apne internal patterns ko bhi contradict karta hai.",
  },
  {
    id: "unsafe-code-pointers-pinvoke-tr-8",
    question: "P/Invoke call karte waqt marshaling galat ho jaaye (jaise ek complex struct ke liye) to kya symptoms dekh sakte ho?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Crash, corrupted data, ya undefined behavior — kyunki managed aur native memory layouts match nahi karenge.",
    detailedAnswer:
      "Agar CLR ka default marshaling ek complex type (jaise ek struct jisme specific field ordering/padding/string encoding chahiye) ko sahi tareeke se native representation me convert nahi kar paata, native function ko galat/corrupted data mil sakta hai — jo crash, silent data corruption, ya undefined behavior de sakta hai (kyunki native code apne expected memory layout ke against operate karta hai). Fix typically `[StructLayout]` aur `[MarshalAs]` attributes ke saath explicit marshaling hints dena hota hai, taaki managed-to-native conversion predictable ho.",
  },
];

export default questions;
