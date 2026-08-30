import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "v8-engine-1",
    question: "V8 me JavaScript execution ka pipeline kya hai?",
    options: [
      "Source ko seedha machine code me compile karke chalata hai, ek hi step me",
      "Source -> AST -> Ignition bytecode interpreter (sab yahin start) -> hot code TurboFan se optimized machine code -> galat type assumption par deopt",
      "Source ko Java bytecode me convert karke JVM par chalata hai",
      "Har line ko har baar dobara parse karke interpret karta hai, koi compilation nahi",
    ],
    correctIndex: 1,
    explanation:
      "V8 pehle parse karke AST banata hai, Ignition bytecode interpret karta hai (fast startup), phir profiling se hot functions ko TurboFan optimized machine code me compile karta hai (assumed types), aur assumption tootne par deoptimize karke bytecode par lautta hai. Option A galat — pure AOT nahi. Option C galat — V8 ka JVM se koi rishta nahi. Option D galat — V8 bytecode compile karta hai aur hot code JIT karta hai.",
    difficulty: "medium",
  },
  {
    id: "v8-engine-2",
    question:
      "Ek loop 1000 objects banata hai — kabhi `{id, name}` order me, kabhi `{name, id}` order me. V8 me iska perf par kya asar?",
    options: [
      "Koi asar nahi, property order irrelevant hai",
      "Alag property order = alag hidden classes; property-access sites polymorphic/megamorphic ho jaate hain, V8 access ko optimize nahi kar paata",
      "V8 crash kar dega inconsistent shapes par",
      "Sirf memory zyaada lagegi, speed same rahegi",
    ],
    correctIndex: 1,
    explanation:
      "V8 objects ko hidden class (shape) deta hai property add hone ke order se. Alag order = alag hidden class. Ek property-access site par 1 shape (monomorphic) fastest, 2-4 (polymorphic) slower, 5+ (megamorphic) slowest. Consistent shape ke liye ek factory se hamesha same order me saari keys init karo. Option A/D galat — order hidden class banata hai aur speed affect hoti hai. Option C galat — crash nahi, sirf slow.",
    difficulty: "medium",
  },
  {
    id: "v8-engine-3",
    question:
      "\"Node me GC automatic hai, isliye memory leak possible nahi\" — ye statement sahi hai?",
    options: [
      "Haan, GC har unused memory free kar deta hai",
      "Nahi — GC sirf UNREACHABLE memory free karta hai; ek growing module-level array, unremoved event listeners, ya unbounded cache reachable rehte hain, toh GC unhe nahi chhuta aur heap badhta jaata hai",
      "Haan, lekin sirf agar tum `global.gc()` manually call karo",
      "Nahi, kyunki Node me GC hai hi nahi, wo Rust ki tarah ownership use karta hai",
    ],
    correctIndex: 1,
    explanation:
      "GC reachability se kaam karta hai: jo object kisi live reference se pahuncha ja sakta hai wo 'live' maana jaata hai, chahe tum use kabhi use na karo. Classic leaks: global array me push karte rehna, listeners add karke remove na karna, cache without eviction, closures jo bada data hold karte hain. Ye sab reachable garbage hai. Option A/C galat — reachability rule change nahi hota. Option D galat — V8 me generational GC hai.",
    difficulty: "easy",
  },
  {
    id: "v8-engine-4",
    question:
      "V8 ki generational garbage collection me 'new space' aur 'old space' ka farak kya hai?",
    options: [
      "New space naye Node versions ke liye hai, old space purane ke liye",
      "New space chhota hai, naye objects yahan allocate hote hain, fast 'scavenge' GC frequently chalta hai (sub-ms); jo bach jaata hai wo old space me promote hota hai jahan slow stop-the-world mark-sweep-compact infrequently chalta hai",
      "Dono bilkul same hain, sirf naam alag",
      "New space CPU cache me hota hai, old space RAM me",
    ],
    correctIndex: 1,
    explanation:
      "Generational hypothesis: zyaadatar objects jaldi mar jaate hain. Isliye chhota new space (1-8 MB) fast scavenge se saaf hota hai bar-bar; survivors old space me promote. Old space bada aur long-lived; usme mark-sweep-compact chalta hai jo partly stop-the-world hai aur bade heap par tens of ms ka pause de sakta hai — yahi p99 latency spikes ka common culprit hai. Option A/C/D galat descriptions hain.",
    difficulty: "medium",
  },
];

export default quiz;
