import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "static-classes-tr-1",
    question: "Static class kya hai, aur normal class se kaise alag hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Accenture"],
    shortAnswer: "Static class instantiate nahi ho sakti aur har member static hona zaroori hai — stateless helper functions ke grouping ke liye use hoti hai.",
    detailedAnswer:
      "`static class` likhne se compiler do cheezein enforce karta hai: `new` se instance nahi ban sakta, aur class ke andar har member ko explicitly `static` declare karna hi padega — koi instance field/method allowed nahi. Ye use hota hai jab class sirf related, stateless utility functions ka logical grouping ho — jaise .NET ka `Math` ya `Console`.",
    followUp: "Static member on a NORMAL (non-static) class — ye kaise behave karta hai instance fields ke against?",
  },
  {
    id: "static-classes-tr-2",
    question: "Normal class ke andar ek static field kaise behave karta hai instance field ke against?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Static field poore type ka ek hi shared copy hota hai; instance field har object ka apna, independent copy.",
    detailedAnswer:
      "Ek static field type-level pe exist karta hai — class load hote hi allocate hota hai, object ke bina bhi. Har `new` se bana instance same static field ko point karta hai, koi apna alag copy nahi rakhta. Instance field iske against — har object apna khud ka independent copy rakhta hai, ek object ka field modify karne se doosre object ka wahi-naam-wala field affect nahi hota.",
  },
  {
    id: "static-classes-tr-3",
    question: "Static constructor ki exact timing guarantee kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Type ke first use se pehle — chahe wo first static-member access ho ya first instance creation, jo bhi pehle ho — exactly ek baar, thread-safe.",
    detailedAnswer:
      "CLR guarantee karta hai ki static constructor type ke first use se pehle chalega, aur poori application lifetime me sirf EK baar. 'First use' do tareeke se trigger ho sakta hai: type ka koi static member access karna, ya type ka pehla instance banana. CLR internally locking use karta hai taaki agar do threads simultaneously first access karein, static constructor phir bhi sirf ek baar chale — race condition nahi.",
    followUp: "Kya static constructor ko explicitly kisi bhi tareeke se trigger kiya jaa sakta hai, jaise startup pe force karna?",
  },
  {
    id: "static-classes-tr-4",
    question: "Ye output kya hoga?\n```csharp\npublic class Counter\n{\n    private static int _count;\n    public Counter() => _count++;\n    public static int Count => _count;\n}\n\nvar c1 = new Counter();\nvar c2 = new Counter();\nvar c3 = new Counter();\nConsole.WriteLine(Counter.Count);\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "3 — teeno constructors ne same shared static field ko increment kiya.",
    detailedAnswer:
      "`_count` static field hai, poore Counter type ke liye ek hi shared copy. Har `new Counter()` call constructor ke through `_count++` chalata hai — teeno calls same field ko increment karte hain (per-instance copy nahi hai). Isliye final value 3 hoti hai, `Counter.Count` (static property, type ke through access) yahi print karti hai.",
  },
  {
    id: "static-classes-tr-5",
    question: "Ye output kya hoga, aur \"Regex compiled once\" kitni baar print hoga?\n```csharp\npublic class Validator\n{\n    static Validator()\n    {\n        Console.WriteLine(\"Regex compiled once\");\n    }\n    public bool Check() => true;\n}\n\nvar v1 = new Validator();\nvar v2 = new Validator();\nvar v3 = new Validator();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"Regex compiled once\" sirf EK baar print hoga, chahe teen instances bane hon.",
    detailedAnswer:
      "Static constructor poori type lifetime me sirf ek baar chalta hai, chahe kitni bhi instances banayi jaayein. Pehla `new Validator()` type ka first use trigger karta hai, jisse static constructor chalta hai aur print hota hai. `v2` aur `v3` ke liye static constructor dobara nahi chalta — sirf instance constructors (agar koi ho) chalte hain.",
  },
  {
    id: "static-classes-tr-6",
    question: "Tumhare paas ek high-traffic ASP.NET Core API hai jisme ek static `Dictionary<string, decimal>` field hai jo currency exchange rates cache karta hai, aur multiple background jobs isse concurrently update karte hain bina kisi lock ke. Kya risk hai, aur kaise fix karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Race condition risk hai — concurrent writes se Dictionary corrupt ho sakta hai ya exceptions throw ho sakti hain; fix: `ConcurrentDictionary` use karo ya explicit `lock` lagao.",
    detailedAnswer:
      "Plain `Dictionary<TKey, TValue>` thread-safe nahi hai — agar multiple threads simultaneously write karein (ya ek read kare jab doosra write kar raha ho), ye corrupt state ya `InvalidOperationException` (jaise 'Collection was modified') de sakta hai. Production fix: `System.Collections.Concurrent.ConcurrentDictionary<TKey, TValue>` use karo jo thread-safe operations deta hai, ya explicit `lock` statement se critical sections protect karo. Better still, is scenario me consider karo ki kya ye static field hona chahiye bhi ya IMemoryCache/IDistributedCache jaisa DI-managed, properly designed caching solution better fit hai.",
    followUp: "IMemoryCache (DI-based) is static Dictionary field se better kyun hoga?",
  },
  {
    id: "static-classes-tr-7",
    question: "Tumhara junior developer bolta hai: 'Humein DI Singleton use karne ki zaroorat nahi, main bas static field bana dunga, same cheez hai aur simpler hai.' Kya reply doge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Simpler lagta hai lekin real cost hai — testing me static state reset karna mushkil hai, aur ye interface ke bina hard-to-mock, tightly-coupled global state ban jaata hai.",
    detailedAnswer:
      "Static field short-term simpler dikhta hai lekin do real problems laata hai: (1) unit tests me isolation todhta hai — ek test agar static state modify kare, doosra test (jo alag order me chal sakta hai) accidentally affected ho sakta hai; (2) DI ke bina, dependent code directly static class se coupled ho jaata hai, interface-based mocking possible nahi rehta. DI Singleton same 'ek instance, poore app ke liye' guarantee deta hai, lekin container-managed, interface-based, aur testable rehta hai — thodi zyada setup ke liye ye trade-off worth hai production code me.",
    redFlag: "'Static aur Singleton same cheez hai, simpler wala use karo' — testability aur coupling ke real costs ko ignore karta hai.",
  },
  {
    id: "static-classes-tr-8",
    question: "Kya ye sahi hai: 'Static constructor application startup pe (jaise Program.cs ke Main() se pehle) automatically chal jaata hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — ye type ke FIRST USE se pehle chalta hai, jo application startup se kaafi der baad, ya kabhi bhi nahi ho sakta agar type kabhi touch hi na ho.",
    detailedAnswer:
      "Ye ek common trap hai. Static constructor lazily trigger hota hai — sirf tab jab type ka koi static member access ho ya uska pehla instance bane. Agar ek type application ke poore lifetime me kabhi use hi nahi hota, uska static constructor kabhi chalta hi nahi. Isse 'application startup pe eagerly sab kuch initialize ho jaata hai' jaisi galat assumption nahi banani chahiye — ye purely on-demand, lazy behavior hai.",
    redFlag: "'Sab static constructors app start hote hi chal jaate hain' — lazy, on-demand triggering ko miss karta hai.",
  },
  {
    id: "static-classes-tr-9",
    question: "Kya ye sahi hai: 'Static members inheritance me override ho sakte hain, jaise instance virtual methods'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — static members polymorphism (virtual/override) me participate nahi karte, ye compile-time, type-bound resolution use karte hain.",
    detailedAnswer:
      "Static members ka koi runtime polymorphic dispatch nahi hota — `override` keyword static members pe illegal hai. Agar derived class me same-name static member define karo, ye base class ke static member ko HIDE karta hai (jaise `new` keyword ke saath instance method hiding), override nahi. Static member call hamesha compile-time type ke basis pe resolve hota hai, kabhi runtime type ke basis pe nahi — kyunki static members object instances se jude hi nahi hain jinke paas ek runtime type ho.",
    redFlag: "'Static method ko override kar sakte hain jaise virtual method' — static members polymorphism system ka hissa hi nahi hain.",
  },
];

export default questions;
