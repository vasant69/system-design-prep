import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "string-immut-tr-1",
    question: "`string` .NET me immutable kyun design kiya gaya? Teen genuine reasons batao.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer: "Thread-safety (no locking needed), safe dictionary-key hashing (hash kabhi change nahi hoti), aur string interning ko enable karta hai.",
    detailedAnswer:
      "(1) Thread-safety — immutable objects ko multiple threads bina lock ke safely share kar sakte hain, kyunki koi thread unhe modify nahi kar sakta. (2) Dictionary/HashSet keys — agar string mutable hoti, ek string ko key banane ke baad usko modify karna uska hash change kar deta, jo dictionary ko internally corrupt kar deta (item galat bucket me 'phas' jaata). (3) Interning — CLR ka multiple identical literals ko same object share karwana sirf immutability ki wajah se safe hai, warna ek reference ka change dusre ko bhi affect karta.",
    followUp: "Loop me string concatenation ka performance impact kya hai immutability ki wajah se?",
  },
  {
    id: "string-immut-tr-2",
    question: "Ek loop me 10,000 baar string concatenation karni hai. StringBuilder kyun better hai plain += se? Numbers ke saath explain karo.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`+=` O(n^2) character copies deta hai (har naya string purana poora content copy karta hai); StringBuilder O(n) amortized rehta hai internal resizable buffer ki wajah se.",
    detailedAnswer:
      "Har `+=` call ek naya string object banata hai jo (a) purana poora content copy karta hai, (b) naya part append karta hai. Agar final string length n characters hai (roughly), total copies sum(1 + 2 + ... + n) ≈ O(n²) ho jaate hain. StringBuilder internally ek resizable char array/buffer maintain karta hai — `Append()` sirf naye characters ko buffer me daalta hai (occasional resize ko amortize karte hue), total work O(n). 10,000 iterations ke liye ye difference production me seconds-vs-milliseconds jaisa dikh sakta hai.",
  },
  {
    id: "string-immut-tr-3",
    question: "`==` operator string ke liye kya karta hai — reference equality ya content equality? Kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Content equality — `string` class ne `==` operator ko explicitly overload kiya hai `Equals()` (content-based) use karne ke liye, default reference-equality nahi.",
    detailedAnswer:
      "Normally (kisi custom class ke liye) `==` default reference equality karta hai (do variables same object point karte hain ya nahi). `string` class deliberately `==` operator ko overload karta hai taaki wo content-equality kare (`string.Equals()` ke through) — kyunki developers intuitively `\"abc\" == \"abc\"` ko true expect karte hain, chahe wo alag objects hi kyun na hon. Ye ek genuinely special-cased, deliberate design decision hai `string` ke liye, saare reference types ke liye default nahi hai.",
  },
  {
    id: "string-immut-tr-4",
    question: "Ye code kya output karega?\n```csharp\nstring a = \"hello\";\nstring b = new string(\"hello\".ToCharArray());\nConsole.WriteLine(a == b);\nConsole.WriteLine(ReferenceEquals(a, b));\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "True (content equal), False (different objects — b explicitly ek naya, non-interned object hai)",
    detailedAnswer:
      "`a == b` `True` deta hai kyunki `==` content-equality karta hai, aur dono ka content 'hello' same hai. `ReferenceEquals(a, b)` `False` deta hai kyunki `b` explicitly `new string(...)` se bana hai — ye interning bypass karta hai, ek genuinely naya, alag heap object banata hai, chahe content wahi ho jo interned `a` ka hai.",
  },
  {
    id: "string-immut-tr-5",
    question: "Ek 50,000-row CSV report generate karna hai. Kya socho ge — StringBuilder use karoge ya kuch aur?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "StringBuilder — loop-based repeated append is exact use-case ke liye hai; alternative StreamWriter ho sakta hai agar directly file/stream me likhna ho bina poori string memory me rakhe.",
    detailedAnswer:
      "50,000 rows ke liye plain `+=` genuinely slow hoga (O(n²)). StringBuilder ek achha default choice hai agar poori report ek string ki tarah memory me chahiye (jaise return value ya further processing ke liye). Agar report directly disk/response stream pe likhi ja rahi hai aur poori string memory me hold karne ki zarurat nahi hai, `StreamWriter`/`TextWriter` seedha stream pe likhna aur bhi better ho sakta hai (memory footprint kam) — ye interview me ek achha 'aur bhi soch sakte ho' follow-up dikhata hai basic StringBuilder answer se aage.",
    followUp: "Agar report itna bada ho ki poora memory me nahi rakhna chahte, kya approach badlegi?",
  },
  {
    id: "string-immut-tr-6",
    question: "Kya `StringBuilder` thread-safe hai? Multiple threads ek hi StringBuilder instance ko safely use kar sakte hain?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — StringBuilder thread-safe NAHI hai. Multiple threads bina synchronization ke ek instance use karein to corrupted state/exceptions aa sakti hain.",
    detailedAnswer:
      "`string` immutable hai isliye inherently thread-safe hai, lekin `StringBuilder` deliberately MUTABLE hai (yahi to uska purpose hai) — is mutability ki wajah se ye thread-safe nahi hai. Agar multiple threads bina lock ke ek hi `StringBuilder` instance pe `Append()` call karein concurrently, internal buffer state corrupt ho sakta hai, ya `IndexOutOfRangeException` jaisi exceptions aa sakti hain. Multi-threaded scenario me har thread ko apna alag StringBuilder use karna chahiye (phir results combine karo), ya explicit locking lagani chahiye.",
    redFlag: "Ye assume karna ki StringBuilder bhi string jaisa automatically thread-safe hai — ye seedha ulta hai, StringBuilder specifically mutability ke liye design hua hai.",
  },
  {
    id: "string-immut-tr-7",
    question: "`string.Intern()` kya karta hai, aur ise manually call karna kab genuinely useful ho sakta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Ek runtime-constructed string ko explicitly intern pool me daal deta hai — useful jab bahut saari duplicate runtime strings memory waste kar rahi hon aur unhe deduplicate karna ho.",
    detailedAnswer:
      "`string.Intern(str)` check karta hai ki intern pool me `str` ke equal content waala koi string already hai — agar hai, wahi reference return karta hai; agar nahi, `str` ko pool me add kar ke usi ko return karta hai. Ye tab useful hai jab application bahut saari, potentially-duplicate strings runtime pe generate/parse karti hai (jaise ek large text file se repeated words parse karna) aur memory-deduplication genuinely value-add ho. Trade-off: intern pool ke objects poore application lifetime tak GC nahi hote (unless explicitly manage kiya jaaye) — isliye large/rarely-repeating strings ko intern karna ulta memory leak jaisa ho sakta hai.",
  },
  {
    id: "string-immut-tr-8",
    question: "Ek code-review me tumhe ek loop dikhta hai jo `+=` se ek log message build kar raha hai, sirf 3-4 concatenations ke saath, loop ke bahar. Kya tum StringBuilder suggest karoge?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi zaroori — 3-4 one-off concatenations ke liye plain `+`/string interpolation StringBuilder se zyada simple aur likely equally-efficient hai; ye premature optimization hoga.",
    detailedAnswer:
      "StringBuilder ka real benefit tab dikhta hai jab concatenation count bada ho ya genuinely loop ke andar repeated ho, jahan O(n²) vs O(n) ka fark measurable ban jaata hai. 3-4 fixed concatenations ke liye compiler khud bhi often `string.Concat()` calls me optimize kar deta hai (jo StringBuilder se comparable hai chhoti scale pe), aur StringBuilder object banane ka apna chhota overhead hai. Har jagah blindly StringBuilder suggest karna 'best practice' ki galat understanding hai — context (scale, loop vs one-off) matter karta hai.",
    redFlag: "Har concatenation dekhte hi reflexively StringBuilder suggest karna bina scale/context consider kiye.",
  },
];

export default questions;
