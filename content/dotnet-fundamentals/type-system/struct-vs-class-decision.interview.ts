import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "struct-class-tr-1",
    question: "Struct use karne ka decision kaise loge — concrete criteria batao, sirf definition nahi.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Microsoft ki 4-point guideline: chhota (~16 bytes), logically single immutable value, no inheritance need, aur frequently boxed nahi hoga.",
    detailedAnswer:
      "Saari conditions saath satisfy honi chahiye: (1) type small ho, roughly 16 bytes ya kam, taaki copy cost negligible rahe; (2) type logically ek single value represent kare, na ki complex identity-based entity; (3) immutable ho, kyunki mutable struct copy-semantics ki wajah se confusing bugs deta hai; (4) frequently object/interface types me boxed na ho, warna heap allocation ka overhead struct ke benefit ko negate kar deta hai. Inme se koi ek fail ho to class better choice hai.",
    followUp: "Ek bade struct ka real performance risk kya hai?",
  },
  {
    id: "struct-class-tr-2",
    question: "Mutable struct genuinely dangerous kyun mane jaate hain — ek concrete example do.",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Copy semantics ki wajah se 'modification' silently ineffective ho sakti hai — jaise collection se nikala gaya struct modify karna original ko affect nahi karta.",
    detailedAnswer:
      "`Point p = someList[0]; p.X = 99;` — ye sirf local copy `p` ko modify karta hai, `someList[0]` untouched rehta hai, kyunki `Point` ek struct hai aur indexer se retrieval ek copy return karta hai. Naye developers isse expect karte hain reference-type-jaise mutation, aur silently galat behavior milta hai bina kisi exception/error ke — ye class of bug debug karna genuinely mushkil hota hai kyunki koi crash nahi hoti, bas galat result milta hai.",
    redFlag: "Ye assume karna ki struct ko mutable rakhna 'normal' hai jaisa class ke saath hota hai — copy-semantics ka impact samjha na hona dikhata hai.",
  },
  {
    id: "struct-class-tr-3",
    question: "Ek 80-byte struct ko ek hot loop me lakhon baar method parameter ke roop me pass kiya ja raha hai. Iska performance implication kya hoga, aur fix kya ho sakta hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Har call pe poore 80 bytes copy honge — measurable overhead. Fix: type ko class banao, ya `in` parameter use karo copy avoid karne ke liye.",
    detailedAnswer:
      "Struct har parameter-pass pe poora copy hota hai. 80 bytes, lakhon calls ke saath, ye genuinely measurable CPU/memory-bandwidth cost hai — class ke 8-byte pointer copy se zyada expensive. Do fixes possible hain: (1) type ko class bana do agar identity-semantics bhi appropriate hain, ya (2) `in` keyword use karo (readonly reference parameter) jo struct ko genuinely bina copy kiye pass karta hai, agar struct semantics genuinely chahiye.",
  },
  {
    id: "struct-class-tr-4",
    question: "Kya struct interfaces implement kar sakta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Haan — struct interfaces implement kar sakta hai, lekin kisi class/struct se inherit nahi kar sakta.",
    detailedAnswer:
      "Struct multiple interfaces implement kar sakta hai, exactly class ki tarah. Jo ye support nahi karta wo hai class/struct inheritance — koi struct kisi doosre type se derive nahi ho sakta (except implicit System.ValueType). Agar design ko ek shared base implementation chahiye jo derived types extend karein, struct ye nahi de sakta.",
  },
  {
    id: "struct-class-tr-5",
    question: "DateTime, Guid, aur decimal jaise BCL types struct kyun hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Kyunki ye Microsoft ki apni guideline follow karte hain — chhote, logically single value, immutable — aur bahut frequently create/copy hote hain, isliye heap allocation avoid karna performance-critical hai.",
    detailedAnswer:
      "Ye types codebases me lakhon baar create hote hain (har `DateTime.Now`, har naya `Guid`). Agar ye classes hote, har ek heap allocation trigger karta aur GC pressure badhata. Struct hone se, ye stack/inline memory me directly store hote hain, koi extra allocation nahi, aur ye Microsoft ki apni struct-appropriateness guideline (small, immutable, single-value) ko bhi perfectly satisfy karte hain.",
  },
  {
    id: "struct-class-tr-6",
    question: "Ek team ne ek 15-field 'MarketTick' type ko struct banaya 'performance ke liye,' bina measure kiye. Ye decision sahi tha ya galat?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Likely galat — itni badi struct (100+ bytes) ka baar-baar copy hona actual measurement me class ke reference-pass se zyada expensive nikal sakta hai.",
    detailedAnswer:
      "'Struct = fast' ek oversimplified assumption hai jo size ignore karti hai. 15 fields wali struct likely 16-byte guideline se kaafi bade hai — har copy me poori struct duplicate hoti hai. High-frequency scenarios (jaise tick processing, lakhon operations/sec) me ye copy cost class ke sirf-pointer-pass se zyada expensive ho sakta hai. Sahi approach: guideline follow karna aur, doubt hone par, actual benchmark karna, sirf assumption pe decide na karna.",
    redFlag: "Bina measure kiye 'struct hamesha faster hai' bolna aur decision justify karna — ye superficial performance-reasoning dikhata hai.",
  },
  {
    id: "struct-class-tr-7",
    question: "Ek readonly struct kya hota hai, aur normal (mutable) struct se kaise better hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "`readonly struct` compiler-enforced immutability deta hai — saare fields readonly honi chahiye, jisse mutable-struct wale confusing bugs structurally impossible ho jaate hain.",
    detailedAnswer:
      "`readonly struct` (C# 7.2) ek modifier hai jo compiler ko enforce karne deta hai ki struct ke saare fields readonly hon — koi bhi method jo state modify karne ki koshish kare, compile error dega. Ye exactly wo guideline (structs should be immutable) ko language-level guarantee banata hai, taaki mutable-struct-copy-semantics wale confusing bugs (jaise foreach loop me silently ineffective mutation) structurally hi possible na ho.",
  },
  {
    id: "struct-class-tr-8",
    question: "Kya ek struct ke andar reference-type field rakha ja sakta hai (jaise struct ke andar ek List<T>)?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Haan, technically allowed hai, lekin isse struct 'genuinely immutable/value-semantics' hone ka guarantee kamzor ho jaata hai — reference field ke through shared mutable state aa sakti hai.",
    detailedAnswer:
      "Struct me reference-type field (jaise `List<int>`) rakhna compile hota hai. Lekin iska matlab hai struct ka copy banane par, reference field ka sirf address copy hota hai (value-type copy semantics sirf top-level fields ke liye guarantee deta hai, deeper reference objects wahi share hote hain jo mutable rehte hain). Isse struct ka 'genuinely independent value' hone ka guarantee toot jaata hai — ye ek subtle design trap hai jo struct-appropriateness guideline (logically single value) ko bhi violate karta hai.",
  },
];

export default questions;
