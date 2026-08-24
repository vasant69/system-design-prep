import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "records-immut-tr-1",
    question: "record C# ke type system me kya naya add karta hai jo class/struct pehle se nahi de rahe the?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Ek teesra category — reference type by default lekin structural (value-based) equality, compiler-generated, saath me with-expressions.",
    detailedAnswer:
      "Class default me reference equality deta hai, struct value/copy semantics deta hai lekin reflection-based slow default equality. `record` reference type ki heap-allocation model rakhta hai lekin structural equality (fast, compiler-generated Equals/GetHashCode/==) deta hai, plus `with`-expressions non-destructive mutation ke liye. Ye combination pehle manually likhna padta tha, ab declarative hai.",
    followUp: "with-expression exactly kya karta hai internally?",
  },
  {
    id: "records-immut-tr-2",
    question: "Immutability ke do concrete, technical (sirf 'best practice' nahi) benefits batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Thread-safety without locks (koi mutable shared state nahi), aur aliasing bugs ka elimination (shared reference se unexpected mutation impossible ho jaata hai).",
    detailedAnswer:
      "1) Thread-safety: agar object create hone ke baad kabhi change nahi hota, multiple threads usse bina synchronization ke safely read kar sakte hain — race condition ka scope hi nahi bachta. 2) Aliasing bugs: jab ek object reference multiple jagah share hota hai aur kisi ek jagah se mutation baaki jagah unexpectedly dikh jaata hai — immutable object ke saath ye poora bug-class structurally impossible hai, kyunki koi bhi jagah se object modify hi nahi kiya ja sakta.",
  },
  {
    id: "records-immut-tr-3",
    question: "Ye code kya print karega?\n```csharp\nrecord Point(int X, int Y);\nvar p1 = new Point(1, 2);\nvar p2 = p1 with { X = 5 };\nConsole.WriteLine($\"{p1.X},{p1.Y} | {p2.X},{p2.Y}\");\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"1,2 | 5,2\" — p1 unchanged, p2 ek naya instance hai jisme X change hua, Y copy hua.",
    detailedAnswer:
      "`with { X = 5 }` p1 ko modify nahi karta — ye ek naya `Point` instance banata hai jisme `X` explicitly specify kiya gaya (5) aur `Y` p1 se copy ho gaya (2). p1 khud bilkul untouched rehta hai (1, 2). Ye records ki non-destructive mutation ka defining behavior hai.",
  },
  {
    id: "records-immut-tr-4",
    question: "record struct kab prefer karoge plain record ke bajaye?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Jab data chhoti, short-lived, aur value-type-appropriate ho — heap allocation avoid karni ho lekin declarative equality/with-expression convenience bhi chahiye.",
    detailedAnswer:
      "`record` heap-allocated hai (reference type default), jabki `record struct` value type hai — copy semantics, no heap allocation for the record itself. Jab data genuinely chhoti hai (jaise coordinates, money amount) aur frequently created/copied hoti hai hot paths me, `record struct` GC pressure avoid karta hai jabki same `with`/structural-equality convenience deta hai jo `record` deta.",
    followUp: "struct-vs-class decision criteria kya hoti hai generally?",
  },
  {
    id: "records-immut-tr-5",
    question: "Kya record class ko mutable banaya ja sakta hai (init ke bajaye set properties)?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Haan technically possible hai, lekin aisa karna record ke poore point ko defeat karta hai — immutability aur structural equality dono ki reliability compromise ho jaati hai.",
    detailedAnswer:
      "C# record ko forcibly mutable banane deta hai — properties ko `init` ke bajaye plain `set` accessor diya ja sakta hai. Lekin ye anti-pattern hai: record ka poora design philosophy immutability aur value-based equality ke around hai; agar properties mutate ho sakte hain, `Equals()`/`GetHashCode()` ka behavior ab reliable nahi rehta (Dictionary key ke roop me use karne par wahi mutable-hash-key problem aa sakti hai jo classes me hoti hai). Best practice: record ko immutable hi rehne do.",
    redFlag: "'Record ko normal mutable class jaisa use karna theek hai' bolna — ye poore feature ke design-intent ka misunderstanding dikhata hai.",
  },
  {
    id: "records-immut-tr-6",
    question: "Ek payment event object (PaymentInitiatedEvent) multiple async handlers ke through pass ho raha hai. Kya isko class banana chahiye ya record?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Record — kyunki multiple handlers ke beech shared event object ka accidental mutation ek real, hard-to-debug bug class hai jo record structurally prevent karta hai.",
    detailedAnswer:
      "Jab ek object multiple independent consumers (async handlers) ke beech share hota hai, mutable class ka risk hai ki koi ek handler accidentally field modify kar de, jisse downstream handlers galat/inconsistent data dekhein — timing-dependent, intermittent bugs. Record use karne se ye poora problem eliminate ho jaata hai, kyunki koi handler event object ko modify hi nahi kar sakta, sirf apna naya `with`-derived copy bana sakta hai agar zaroorat ho.",
  },
  {
    id: "records-immut-tr-7",
    question: "record ke andar equality contract manually likhne se kaise related hai jo Equals/GetHashCode override karte waqt hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "record wahi Equals/GetHashCode/== contract automatically generate karta hai jo manually class me likhna padta — same guarantee, zero boilerplate.",
    detailedAnswer:
      "Manual class me correct equality ke liye developer ko khud Equals() aur GetHashCode() dono saath likhne padte hain, aur `==` operator ko bhi separately overload karna padta hai agar wo bhi structural equality chahiye. record compiler ko ye poora kaam automatically karne deta hai — declaratively, sirf properties list karke. Underlying mechanism/contract wahi hai, sirf boilerplate compiler-generated hai, error-prone manual implementation nahi.",
  },
  {
    id: "records-immut-tr-8",
    question: "Do record instances jinke properties order alag hai (lekin values same) — kya wo equal maane jaate hain?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Property order matter nahi karta, sirf property NAMES aur VALUES matter karte hain — record positional constructor order se banta hai lekin equality property-value-based hai.",
    detailedAnswer:
      "`record Person(string Name, int Age)` ka equality dono properties (`Name`, `Age`) ki values compare karta hai — 'order' jisme tum values pass karte ho constructor me matter karta hai kyunki wo determine karta hai kaunsi value kaunsi property ko milti hai, lekin equality check khud har property ko naam se compare karta hai, positional sequence se nahi. Do instances jinke `Name` aur `Age` dono match karte hain, hamesha equal honge, chahe kaise bhi construct kiye gaye ho.",
  },
];

export default questions;
