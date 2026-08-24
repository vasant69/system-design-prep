import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "value-ref-types-tr-1",
    question: "Value type aur reference type me exact difference kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Value type apna data directly store aur copy karta hai; reference type heap object ka reference store karta hai, aur copy par reference hi copy hota hai.",
    detailedAnswer:
      "Value types (struct, enum, int/bool/double jaise primitives) assignment ya method-pass par poori value copy karte hain — do independent copies ban jaati hain. Reference types (class, interface, delegate) assignment/pass par sirf reference (heap address) copy karte hain — dono variables same underlying object ko point karte hain. Isliye reference type ke through modification dusri variable se bhi dikhta hai, value type me nahi.",
    followUp: "Kya value type hamesha stack par hota hai? Iska sahi jawaab kya hai?",
  },
  {
    id: "value-ref-types-tr-2",
    question: "'Value type hamesha stack par allocate hota hai' — ye statement sahi hai ya galat? Justify karo.",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — value type ka location uske containing context par depend karta hai, hamesha stack nahi.",
    detailedAnswer:
      "Agar value type ek local variable ya method parameter hai, to wo typically stack par hota hai. Lekin agar wahi value type kisi class ka field hai, to wo apne parent object ke saath heap par jaata hai — kyunki poora containing object heap par allocate hota hai, aur value type field uska hi inline part hai, alag se allocate nahi hota. Ye ek bahut common misconception hai jo interviewer specifically probe karta hai.",
    redFlag: "Bina qualify kiye 'value type = stack, reference type = heap' bol dena — interviewer isi oversimplification ko catch karna chahta hai.",
  },
  {
    id: "value-ref-types-tr-3",
    question: "Ye output kya hoga?\n```csharp\nstruct Point { public int X; }\nvoid Modify(Point p) => p.X = 999;\n\nvar pt = new Point { X = 5 };\nModify(pt);\nConsole.WriteLine(pt.X);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "5 — struct by value pass hota hai, method ke andar sirf copy modify hui, original untouched raha.",
    detailedAnswer:
      "`Point` ek struct hai (value type). Jab `Modify(pt)` call hota hai, `pt` ki poori VALUE copy hoti hai method parameter `p` me. Method ke andar `p.X = 999` sirf us local copy ko modify karta hai — caller ka original `pt` object bilkul unaffected rehta hai. Isliye `pt.X` still `5` hi print hoga.",
    followUp: "Agar method signature `void Modify(ref Point p)` hoti, to output kya hota?",
  },
  {
    id: "value-ref-types-tr-4",
    question: "Ye output kya hoga?\n```csharp\nclass Point { public int X; }\nvoid Modify(Point p) => p.X = 999;\n\nvar pt = new Point { X = 5 };\nModify(pt);\nConsole.WriteLine(pt.X);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "999 — class ek reference type hai, method ko wahi object mila jo caller ke paas hai, isliye modification visible hai.",
    detailedAnswer:
      "`Point` yahan class hai (reference type). `Modify(pt)` call karne par sirf REFERENCE copy hoti hai — method parameter `p` aur caller ka `pt` dono SAME heap object ki taraf point karte hain. `p.X = 999` us shared object ko directly modify karta hai, isliye caller ka `pt.X` bhi `999` ho jaata hai. Same code, sirf `class` vs `struct` badalne se output completely different hai — ye distinction interview me heavily test hoti hai.",
  },
  {
    id: "value-ref-types-tr-5",
    question: "Boxing exactly kab hoti hai, aur iska cost kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Jab value type ko object/interface type me assign karte ho, CLR heap par ek wrapper allocate karta hai — ye ek real, measurable heap allocation cost hai.",
    detailedAnswer:
      "Boxing tab trigger hoti hai jab ek value type (jaise int, struct) ko implicitly ya explicitly `object` type variable me, ya kisi interface type me assign karte ho jise wo type implement karta hai. CLR heap par ek naya object allocate karta hai, value ko usme copy karta hai. Ye ek real allocation hai — GC ko is memory ko track/collect karna padta hai, jo especially hot paths (loops, high-throughput APIs) me measurable perf cost aur GC pressure create karta hai.",
    followUp: "Ek generic method (`void Log<T>(T value)`) boxing avoid kaise karta hai jo `void Log(object value)` nahi karta?",
  },
  {
    id: "value-ref-types-tr-6",
    question: "Production API me ek hot-path method `void RecordMetric(string key, object value)` signature use kar raha hai, aur `value` hamesha `int`/`double` hota hai. Iska performance implication kya hai, aur fix kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Har call par boxing ho rahi hai (heap allocation) — fix: generic method banao (`void RecordMetric<T>(string key, T value) where T : struct`) taaki boxing avoid ho.",
    detailedAnswer:
      "`object value` parameter ka matlab hai har baar jab caller `int`/`double` pass karega, CLR implicitly box karega — ek naya heap object per call. High-throughput hot path (jaise metrics recording, jo per-request call ho sakta hai) me ye significant GC pressure create karta hai. Fix: method ko generic banao — `void RecordMetric<T>(string key, T value)` — jisse compiler har concrete type ke liye specialized code generate karta hai (value types ke liye), boxing completely avoid ho jaati hai.",
    followUp: "Generic constraints (`where T : struct`) yahan kyun useful ho sakte hain?",
  },
  {
    id: "value-ref-types-tr-7",
    question: "`string` value type hai ya reference type? Iska behavior confusing kyun lagta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Reference type hai, lekin immutable design ki wajah se value-type jaisa behave karta hai.",
    detailedAnswer:
      "`string` technically ek reference type hai — heap par allocate hota hai. Lekin `string` immutable hai — koi bhi 'modification' (jaise concatenation, `.ToUpper()`) actually ek NAYA string object banati hai, original ko change nahi karti. Isi wajah se `string` value-type jaisa 'feel' hota hai (koi unexpected shared-mutation surprise nahi milti), lekin underlying mechanism reference type hi hai — heap allocation, reference copy on assignment, sab reference-type rules follow hote hain.",
    redFlag: "'`string` ek value type hai kyunki wo immutable hai' bolna — immutability aur value-vs-reference-type ek dusre se independent concepts hain.",
  },
  {
    id: "value-ref-types-tr-8",
    question: "Ek naya developer har chhoti data class ko `struct` bana raha hai 'performance ke liye — heap allocation avoid hogi.' Ye kab sahi approach hai, aur kab galat?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Sahi hai chhote (~16 bytes se kam), immutable, short-lived data ke liye; galat hai agar type bada hai, mutable hai, ya method-pass-heavy code path me hai (copy cost heap-allocation cost se zyada ho sakta hai).",
    detailedAnswer:
      "Structs stack-allocation (jab local/parameter ho) aur no-GC-pressure ka benefit dete hain, lekin ye copy-by-value hote hain — agar struct bada hai (multiple fields) ya frequently method-pass hota hai, to har pass ek poori copy hai, jo bade structs ke liye actually EXPENSIVE ho sakta hai — heap allocation se bhi zyada, kyunki copying baar-baar ho sakti hai. Microsoft ka guideline hai struct ko ~16 bytes ke andar rakho. Agar mutable behavior chahiye jo reference semantics pe depend kare, ya inheritance chahiye, class hi sahi choice hai.",
    redFlag: "'Struct hamesha class se fast hota hai' — ek blanket, context-independent claim jo bade/mutable structs ke case me galat sabit hoti hai.",
  },
];

export default questions;
