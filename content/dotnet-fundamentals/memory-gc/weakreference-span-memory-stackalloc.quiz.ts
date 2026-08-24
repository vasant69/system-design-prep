import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "weakref-span-1",
    question: "`WeakReference` normal (strong) reference se kaise different hai?",
    options: [
      "WeakReference object ko GC se hamesha protect karta hai, strong reference se zyada",
      "WeakReference object ka handle deta hai lekin GC ko use collect karne se ROKTA NAHI, jabki strong reference rokta hai",
      "Dono functionally identical hain, sirf naming convention alag hai",
      "WeakReference sirf value types ke saath kaam karta hai"
    ],
    correctIndex: 1,
    explanation:
      "Strong reference (normal reference) object ko GC-reachable rakhta hai, isliye GC use collect nahi kar sakta jab tak reference exist kare. `WeakReference` ek alternative handle deta hai jo object ko access karne deta hai (jab tak zinda hai) lekin GC ko use collect karne se ROKTA NAHI — isliye GC memory pressure me ise reclaim kar sakta hai. Ye classic cache scenarios me useful hai.",
    difficulty: "medium",
  },
  {
    id: "weakref-span-2",
    question: "`Span<T>` ek `ref struct` hai. Iska practical implication kya hai?",
    options: [
      "Span<T> sirf integers ke saath kaam kar sakta hai",
      "Span<T> ko class field, async method state, ya iterator me store nahi kiya jaa sakta — sirf stack pe reh sakta hai",
      "Span<T> hamesha ek heap allocation create karta hai",
      "Span<T> thread-safe nahi hota kabhi bhi"
    ],
    correctIndex: 1,
    explanation:
      "`ref struct` restriction compiler-enforced hai — `Span<T>` ko heap pe store nahi kiya jaa sakta (class field nahi ban sakta), async method ke across capture nahi ho sakta, iterator me store nahi ho sakta. Ye deliberately hai kyunki `Span<T>` internally ek pointer+length hold karta hai jo underlying memory (jaise stackalloc buffer) ke lifetime se bandha hota hai — heap storage allow karne se dangling reference bugs possible ho jaate.",
    difficulty: "hard",
  },
  {
    id: "weakref-span-3",
    question: "`stackalloc` se allocate kiya gaya buffer kab 'gone' ho jaata hai?",
    options: [
      "Jab GC collect kare",
      "Method return hote hi automatically — stack frame unwind hone ke saath, koi GC involvement nahi",
      "Kabhi nahi, application band hone tak zinda rehta hai",
      "Jab explicitly Dispose() call ki jaaye"
    ],
    correctIndex: 1,
    explanation:
      "`stackalloc` buffer stack pe hai, heap pe nahi — isliye GC ko iske baare me pata hi nahi chalta. Method return hote hi stack frame khud unwind hota hai, buffer normal local variables ki tarah automatically gone ho jaata hai. Koi Dispose(), koi GC cycle involved nahi hota iske lifecycle me.",
    difficulty: "medium",
  },
  {
    id: "weakref-span-4",
    question: "`Span<T>` aur traditional `array.Skip(2).Take(3).ToArray()` me core difference kya hai?",
    options: [
      "Koi fark nahi, dono same performance dete hain",
      "Span<T> ek zero-copy VIEW deta hai underlying memory ka; Skip/Take/ToArray naya array COPY create karta hai (extra heap allocation)",
      "Skip/Take/ToArray zyada fast hota hai Span<T> se",
      "Span<T> sirf strings ke saath kaam karta hai, arrays ke saath nahi"
    ],
    correctIndex: 1,
    explanation:
      "`Span<T>` (jaise `array.AsSpan(2, 3)`) underlying memory ka ek view deta hai bina copy kiye — koi extra heap allocation. `Skip().Take().ToArray()` ek nayi array allocate/copy karta hai. Ye difference high-throughput/hot-path code me GC pressure ke through measurable perf impact rakhta hai — Span<T> generally fewer allocations, kam GC pressure deta hai.",
    difficulty: "medium",
  },
];

export default quiz;
