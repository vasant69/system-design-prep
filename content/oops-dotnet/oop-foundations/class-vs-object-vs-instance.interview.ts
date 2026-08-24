import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "class-vs-object-tr-1",
    question: "Class aur object me exact difference kya hai, memory ke level pe?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer:
      "Class ek compile-time blueprint hai jo sirf ek baar metadata ke roop me load hoti hai; object us blueprint ka runtime instance hai jo heap par apna independent memory leta hai.",
    detailedAnswer:
      "Class definition khud koi per-object memory nahi leti — CLR isse ek baar type metadata ke roop me load karta hai, chahe us class ke 0 objects banein ya 10,000. Jab `new` chalta hai, CLR heap par memory allocate karta hai, constructor run hota hai, aur ek reference return hota hai jo variable me store hota hai. Har object apna alag heap block hota hai, isliye independent state carry karta hai.",
    followUp: "To phir ye reference variable khud kahan store hoti hai — stack ya heap?",
  },
  {
    id: "class-vs-object-tr-2",
    question: "Agar ek class ke 1000 objects bante hain, to class ki methods bhi 1000 baar memory me duplicate hoti hain kya?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Nahi — method definitions class metadata ka part hain, sirf ek baar exist karti hain; sirf per-object data (fields) duplicate hota hai.",
    detailedAnswer:
      "Method ka actual compiled code (IL/JIT-compiled machine code) sirf ek baar memory me hota hai, class ke type metadata ke saath. Jab tum `acc1.Deposit(500)` call karte ho, runtime implicitly `this` parameter ke roop me `acc1` ka reference pass karta hai us shared method code ko — isliye method sirf ek jagah hai, lekin `this` ke through har object ke apne data pe operate karta hai. Ye CLR ka ek important memory-efficiency design hai.",
    followUp: "Static methods me `this` kyun nahi hota — uska iske saath kya connection hai?",
  },
  {
    id: "class-vs-object-tr-3",
    question: "Ye code kya print karega?\n```csharp\npublic class Counter { public int Value; }\n\nvar c1 = new Counter();\nvar c2 = new Counter();\nc1.Value = 10;\nConsole.WriteLine(c2.Value);\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "0 — c1 aur c2 do alag heap objects hain, c1.Value modify karne se c2 par koi effect nahi.",
    detailedAnswer:
      "`new Counter()` do baar call hua hai, isliye do alag heap allocations hui hain. `c1.Value = 10` sirf `c1` ke object ke andar `Value` field ko modify karta hai. `c2` ek completely alag object hai, uska `Value` apne default `int` value, `0`, par hi rehta hai. Ye exactly class-vs-object independence demonstrate karta hai.",
  },
  {
    id: "class-vs-object-tr-4",
    question: "Ye output kya hoga?\n```csharp\npublic class Sample { }\n\nvar a = new Sample();\nvar b = new Sample();\nConsole.WriteLine(a.GetType() == b.GetType());\nConsole.WriteLine(ReferenceEquals(a, b));\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "True, phir False — same Type object share hota hai, lekin objects khud alag heap locations hain.",
    detailedAnswer:
      "`a.GetType() == b.GetType()` `true` deta hai kyunki CLR har type ke liye sirf ek `Type` object maintain karta hai — chahe kitne bhi instances bane. `ReferenceEquals(a, b)` `false` deta hai kyunki `a` aur `b` do alag `new` calls se bane hain, alag heap memory locations hain. Ye do lines class-metadata-vs-object-instance distinction ko directly prove karti hain.",
    followUp: "Agar `Sample` ek `record` hota to `a == b` (equality operator) ka result kya hota?",
  },
  {
    id: "class-vs-object-tr-5",
    question: "Ek DI-registered service `Transient` lifetime pe hai. Ek hi HTTP request ke andar agar wo service do jagah inject hoti hai, kya dono same instance honge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Nahi — Transient har injection point pe ek naya object banata hai, chahe ek hi request ke andar ho.",
    detailedAnswer:
      "`Transient` lifetime ka matlab hai har baar jab service resolve hoti hai — chahe constructor injection ho ya `IServiceProvider.GetService` — DI container `new` call karta hai aur ek fresh object return karta hai. Isliye ek hi request ke andar bhi, agar service do controllers/classes me inject ho rahi hai, dono ko alag-alag objects milenge, apne-apne independent state ke saath (agar service koi mutable field maintain karti hai). Ye directly class-vs-object ka real-world DI application hai.",
    followUp: "Scoped lifetime me ye behavior kaise different hota?",
  },
  {
    id: "class-vs-object-tr-6",
    question: "Ek naya developer ye bol raha hai: 'Maine `Order` class ka ek static instance bana liya, taaki memory bache — har request naya object kyun banaye?' Isme kya risk hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ye ek race condition/state-leak risk hai — ek shared instance sab requests ke beech data mix kar sakta hai, especially concurrent requests me.",
    detailedAnswer:
      "Agar `Order` ek static/shared instance banake sab requests ke liye reuse kiya jaata hai, to ek request ka data doosri request ke process hone se pehle overwrite ho sakta hai — especially multi-threaded ASP.NET Core environment me jahan multiple requests parallel handle hoti hain. Object creation ka cost (heap allocation) modern .NET me bahut chhota hai for typical DTOs/entities — ye optimization galat trade-off hai jo correctness ko risk me daalta hai for negligible perf gain. Har request ko apna independent `Order` object milna chahiye.",
    redFlag: "'Memory bachane ke liye' shared mutable state use karna bina thread-safety consider kiye — ye ek classic production bug pattern hai.",
  },
  {
    id: "class-vs-object-tr-7",
    question: "Kya ye statement sahi hai: 'Class khud kabhi memory nahi leti, sirf objects memory lete hain'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Pura sahi nahi — class ki metadata bhi thodi memory leti hai (ek baar, type-load ke time), lekin per-object data class khud carry nahi karti.",
    detailedAnswer:
      "Ye ek nuanced trap hai. Class definition (metadata — `MethodTable`, method bodies ka compiled code, static fields) CLR dwara load hone par memory leti hai, aur wo memory type ke lifetime tak rehti hai. Lekin ye memory **per-object nahi hai** — chahe 0 objects banein ya 10,000, ye metadata memory constant rehti hai. Jo cheez per-object grow karti hai wo heap allocations hain jo har `new` call se aate hain. Isliye precise answer hai: 'class ki metadata ek fixed, one-time cost hai; per-object data variable cost hai jo object count ke saath scale karta hai.'",
    followUp: "Static fields kahan store hote hain — object ke saath ya class metadata ke saath?",
  },
  {
    id: "class-vs-object-tr-8",
    question: "'Object' aur 'instance' me kya technically koi difference hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Practically nahi — dono almost hamesha same cheez ke liye use hote hain, 'instance' thoda zyada specific-to-a-class context me use hota hai.",
    detailedAnswer:
      "Formal C#/.NET terminology me dono terms interchangeably use hote hain. 'Object' zyada generic term hai (koi bhi heap-allocated entity), 'instance' zyada precise tab lagta hai jab specific class ka reference de rahe ho ('`acc1` `BankAccount` ka instance hai'). Interview me ye distinguish karne ki koshish karna (jaise 'object aur instance bilkul alag concepts hain') galat signal deta hai — ye ek trap hai jahan overthinking nuksaan karta hai.",
    redFlag: "In dono terms ke beech ek fake, non-existent technical distinction banana — ye overconfidence ka signal deta hai, gyaan ka nahi.",
  },
  {
    id: "class-vs-object-tr-9",
    question: "Ek interviewer poochta hai: 'BankAccount class me 3 fields hain. Agar main 1000 BankAccount objects banaunga, to kitni memory approximately consume hogi?'",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Roughly 1000 baar (per-object field size + object header), plus class metadata ka ek chhota, fixed one-time cost.",
    detailedAnswer:
      "Har object apna khud ka memory block leta hai — fields ka actual data size plus ek small object header (type pointer + sync block index, typically ~16 bytes on 64-bit). Isliye total memory roughly `1000 × (fields size + header)` hoga. Class metadata (method table, compiled method bodies) ek fixed, one-time cost hai jo object count se independent hai — wo already counted hai chahe 1 object ho ya 1000. Exact number JIT/runtime internals pe depend karta hai, lekin core insight ye hai ki per-object cost linearly scale karta hai object count ke saath, metadata cost nahi.",
  },
];

export default questions;
