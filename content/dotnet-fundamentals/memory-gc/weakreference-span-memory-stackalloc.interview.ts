import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "weakref-span-tr-1",
    question: "`WeakReference` kya hai aur ek concrete use case do.",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon", "TCS"],
    shortAnswer: "Ek handle jo object ko access karne deta hai bina GC ko use collect karne se rokte — classic use case: shrinkable cache jo memory pressure ke against automatically evict ho sake.",
    detailedAnswer:
      "Normal strong reference GC ko object collect karne se rokta hai. `WeakReference` ek alternative provide karta hai — `weakRef.Target` se object access ho sakta hai jab tak wo zinda hai, lekin GC ko is reference ki wajah se collection rokna nahi padta. Classic use case: ek cache jahan tumhe items lambe samay tak reachable rakhne hain agar memory available hai, lekin agar memory pressure high ho jaaye, GC ko permission ho unhe collect karne ki — is se OutOfMemoryException risk kam hota hai, trade-off me cache-hit rate thoda unpredictable ho jaata hai.",
    followUp: "Agar tumhe kisi object ke saath metadata associate karna ho bina uski lifetime affect kiye, kaunsa specific type use karoge?",
  },
  {
    id: "weakref-span-tr-2",
    question: "`Span<T>` kis problem ko solve karta hai, aur ye `ref struct` kyun hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Array/string ke hisse pe kaam karne ke liye traditionally nayi copy banani padti thi — Span<T> ek allocation-free view deta hai. Ref struct isliye hai taaki underlying memory ke lifetime se bahar kabhi use na ho, compiler-enforced.",
    detailedAnswer:
      "Pehle, agar tumhe ek array/string ke ek subset pe kaam karna ho (`Substring`, `Skip().Take()`), ek nayi heap allocation banti thi har baar. `Span<T>` underlying memory (array, string, ya stackalloc buffer) ka ek pointer+length view deta hai bina copy kiye. Ye `ref struct` hai isliye kyunki agar `Span<T>` ko heap pe store hone diya jaaye (class field, async state machine), aur underlying memory (jaise ek stackalloc buffer) ka lifetime khatam ho jaaye jabki Span abhi bhi reachable ho, ek dangling reference ban jaayegi. `ref struct` restriction compiler-enforced hai — ye class field, async method, ya iterator me store nahi ho sakta, taaki ye bug class structurally impossible ho.",
  },
  {
    id: "weakref-span-tr-3",
    question: "`Span<T>` aur `Memory<T>` me kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Synchronous, stack-scoped code ke liye Span<T>; agar async method ke across ya class field me store karna ho, Memory<T>.",
    detailedAnswer:
      "`Span<T>` (`ref struct`) sirf synchronous, current-method-scoped code me use ho sakta hai — heap pe store nahi ho sakta. Jab tumhe similar slicing behavior chahiye lekin async method ke boundary cross karna ho, ya class field me store karna ho, `Memory<T>` use karo — ye ek normal (non-ref) struct hai, heap-allowed. Jab actually process karna ho, `.Span` property se ek temporary `Span<T>` nikaal sakte ho.",
  },
  {
    id: "weakref-span-tr-4",
    question: "`stackalloc` kab appropriate hai, aur iska risk kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Chhote, bounded, short-lived buffers ke liye hot-path code me — risk stack overflow hai agar size bada/unbounded ho.",
    detailedAnswer:
      "`stackalloc` buffer ko directly stack pe allocate karta hai — zero heap allocation, zero GC involvement, method return hote hi automatically gone. Ye high-performance, hot-path scenarios (parsing, serialization) me chhote buffers (typically kuch sau bytes) ke liye appropriate hai jahan heap allocation avoidance measurable perf benefit deta hai. Risk: agar size bada ho ya user-controlled/unbounded ho, ya recursion ke saath combine ho, stack overflow ho sakta hai — isliye size hamesha chhota aur bounded rakhna chahiye.",
    followUp: "Agar buffer size runtime pe pata chalta hai (user input se), stackalloc use karna safe hai kya?",
  },
  {
    id: "weakref-span-tr-5",
    question: "Ye code consider karo:\n```csharp\nint[] arr = { 10, 20, 30, 40, 50 };\nSpan<int> s = arr.AsSpan(1, 2);\ns[0] = 999;\nConsole.WriteLine(arr[1]);\n```\nKya print hoga?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "999 — kyunki Span<T> ek VIEW hai original array ke upar, copy nahi. s[0] modify karna arr[1] ko bhi modify karta hai.",
    detailedAnswer:
      "`arr.AsSpan(1, 2)` original array ke index 1-2 ka ek view deta hai, koi copy nahi banti. `s[0]` actually `arr[1]` ki hi memory location ko refer karta hai (same underlying storage). Isliye `s[0] = 999` set karne se `arr[1]` bhi 999 ho jaata hai — ye `Substring`/`Skip().Take()` ke exact opposite behavior hai, jo ek independent copy return karte.",
  },
  {
    id: "weakref-span-tr-6",
    question: "Kya `WeakReference` ko har cache implementation ke liye default choice hona chahiye?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — trade-off hai: cache-hit rate unpredictable ho jaata hai kyunki GC ki marzi pe depend karta hai. Predictable expiry/size-limit chahiye ho to normal bounded cache (jaise MemoryCache) better fit hai.",
    detailedAnswer:
      "`WeakReference`-based cache GC pressure ke against gracefully shrink hoti hai, jo OutOfMemoryException risk kam karta hai. Lekin iska downside ye hai ki items kab collect honge ye application ke control me nahi hai — GC ki apni scheduling pe depend karta hai, jisse cache-hit rate unpredictable ho jaata hai, aur debug karna mushkil (non-deterministic misses). Agar predictable size/expiry behavior chahiye (jaise LRU eviction), ek explicit bounded cache (`MemoryCache` size limits ke saath) generally better fit hota hai. Choice context-dependent hai, blanket default nahi.",
    redFlag: "'WeakReference hamesha best cache strategy hai' — trade-off (unpredictability) ko ignore karta hai.",
  },
  {
    id: "weakref-span-tr-7",
    question: "Ye code compile hoga kya?\n```csharp\npublic class Parser\n{\n    private Span<byte> _buffer; // field\n}\n```",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — Span<T> ek ref struct hai, isliye class field nahi ban sakta. Compile error aayega.",
    detailedAnswer:
      "`Span<T>` `ref struct` hai, jo compiler-enforced restriction rakhta hai: ye sirf stack pe reh sakta hai — class ka field, async method ka captured state, ya iterator ka field nahi ban sakta. Ye code compile error dega. Agar `Parser` ko is data ko field ke roop me store karna hai, `Memory<byte>` (jo normal struct hai, heap-allowed) use karna hoga instead — aur processing ke time `.Span` se ek temporary `Span<byte>` nikaal sakte hain.",
  },
];

export default questions;
