import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "gc-gen-loh-1",
    question: "Ek object Gen 0 collection survive kar leta hai. Iske baad wo kahan hoga?",
    options: [
      "Wapas Gen 0 me hi rahega",
      "Gen 1 me promote ho jaayega",
      "Seedha Gen 2 me chala jaayega",
      "Large Object Heap pe move ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "Promotion rule simple hai: agar object apni current generation ka collection survive kare (abhi bhi reachable hai), wo agli generation me promote hota hai — Gen 0 se Gen 1. Seedha Gen 2 me jump nahi hota (Option C galat), na hi wapas Gen 0 me rehta hai (Option A galat). LOH me jaana object ki size pe depend karta hai (85KB threshold), survival pe nahi (Option D galat).",
    difficulty: "medium",
  },
  {
    id: "gc-gen-loh-2",
    question: "Large Object Heap (LOH) ke baare me kaunsa statement sahi hai?",
    options: [
      "LOH normal Gen 0/1/2 ki tarah har collection pe automatically compact hota hai",
      "LOH by default compact NAHI hota, isliye fragment ho sakta hai",
      "LOH sirf strings ke liye hai, arrays LOH pe kabhi nahi jaate",
      "LOH threshold 8.5MB hai",
    ],
    correctIndex: 1,
    explanation:
      "LOH large objects (bade arrays, buffers, strings) ko copy/compact karna expensive hone ki wajah se by default compact nahi hota — isse fragmentation ho sakta hai jab alag-alag sizes ke objects allocate/free hote rahein. Option A galat hai — ye exact opposite behavior hai. Option C galat hai — koi bhi 85KB+ object type (array, string, class instance) LOH pe jaa sakta hai. Option D galat hai — threshold 85KB hai, 8.5MB nahi.",
    difficulty: "medium",
  },
  {
    id: "gc-gen-loh-3",
    question: "Gen 0 collections Gen 2 collections se zyada fast aur frequent kyun hote hain?",
    options: [
      "Gen 0 ek chhota region hai jahan zyadatar objects already dead milte hain, kam scan/copy karna padta hai",
      "Gen 0 me GC ek alag, tez algorithm use karta hai jo Gen 2 se completely different hai",
      "Gen 0 collections background thread pe hote hain, Gen 2 foreground pe",
      "Koi fark nahi hota, dono equally expensive hain",
    ],
    correctIndex: 0,
    explanation:
      "Generational hypothesis ke wajah se Gen 0 (sabse chhota region) me zyadatar objects short-lived hote hain — collection ke time zyadatar already dead milte hain, isliye kam live objects ko move/track karna padta hai, jo collection ko fast banata hai. Gen 2 poora bada, long-lived-object-heavy region scan karta hai, isliye expensive hai. Same fundamental mark-and-sweep mechanism use hota hai (Option B galat) — sirf scope (region size) alag hai.",
    difficulty: "medium",
  },
  {
    id: "gc-gen-loh-4",
    question: "Ek service per-request 500KB byte arrays allocate/discard karta rehta hai. Kuch mahino baad memory usage badh raha hai bina live data badhe. Sabse likely root cause kya hai?",
    options: [
      "Gen 0 collection kaam nahi kar raha",
      "LOH fragmentation — bade objects allocate/free hone se gaps ban rahe hain jo naye allocations reuse nahi kar pa rahe",
      "Application me memory leak hi nahi ho sakta, ye normal GC behavior hai",
      "String interning ki wajah se",
    ],
    correctIndex: 1,
    explanation:
      "500KB arrays 85KB threshold se bahut bade hain, isliye LOH pe allocate hote hain. LOH by default compact nahi hota, isliye repeated allocate/free cycles se fragmentation ban sakta hai — gaps jo naye (thode bade) allocations ke liye reuse nahi ho paate, jisse process ko naya memory OS se maangna padta hai chahe total 'live' data kam ho. Fix typically `ArrayPool<byte>` jaisi pooling strategy hoti hai.",
    difficulty: "hard",
  },
];

export default quiz;
