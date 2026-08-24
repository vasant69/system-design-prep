import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "async-ctor-tr-1",
    question: "C# constructors async kyun nahi ho sakte?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Amazon", "Microsoft"],
    shortAnswer:
      "Constructor ka contract hai turant fully-constructed object return karna; async ka contract hai Task return karna — ye do cheezein incompatible hain.",
    detailedAnswer:
      "Constructors C# me kabhi bhi explicit return type declare nahi karte — wo implicitly instance type return karte hain, aur return hote hi object fully-ready hona chahiye. async keyword method ke return type ko effectively Task/Task<T>/ValueTask me wrap kar deta hai, jo future completion represent karta hai, immediate result nahi. Ye do contracts directly clash karte hain, isliye C# language spec level pe hi async constructors allow nahi karta.",
    followUp: "To genuinely async initialization ki zaroorat ho to kya pattern use karoge?",
  },
  {
    id: "async-ctor-tr-2",
    question: "Real-world workaround kya hai jab constructor ke andar async kaam (jaise remote config load karna) genuinely zaroori ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Private/minimal constructor rakho, aur ek public static async Task<T> factory method (jaise CreateAsync) expose karo jo actual async setup karke ready object return kare.",
    detailedAnswer:
      "Pattern: constructor ko private ya sirf sync field assignment tak limit karo. Ek static method jaise `CreateAsync` likho jo async operations (HTTP call, DB connect) await karta hai, phir private constructor call karke fully-ready object return karta hai. Caller `await MyClass.CreateAsync(...)` likhta hai, kabhi `new MyClass()` nahi. Naming convention (Async suffix) important hai taaki teammates ko clear ho ye blocking nahi hai.",
  },
  {
    id: "async-ctor-tr-3",
    question: "IAsyncDisposable IDisposable se kaise different hai, aur kab use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "IDisposable.Dispose() sync hai; IAsyncDisposable.DisposeAsync() genuinely async cleanup allow karta hai bina blocking ke.",
    detailedAnswer:
      "Jab cleanup logic khud async I/O involve karta hai (jaise ek connection ko gracefully flush-and-close karna), Dispose() ke andar us async call ko sync force karna (.Wait()/.Result) blocking hota hai — thread-pool starvation ka risk. IAsyncDisposable ek DisposeAsync() method deta hai jo ValueTask return karta hai, genuinely awaited ja sakta hai, aur await using statement automatically ise call karta hai scope end pe, non-blocking tareeke se.",
    followUp: "Ek class dono IDisposable aur IAsyncDisposable ek saath implement kar sakti hai kya?",
  },
  {
    id: "async-ctor-tr-4",
    question: "Ye code compile hoga kya?\n```csharp\npublic class MyClient\n{\n    public async MyClient(string url)\n    {\n        _config = await LoadAsync(url);\n    }\n}\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Nahi — compile error, constructors ke saath async keyword allow hi nahi hai.",
    detailedAnswer:
      "C# constructors koi return type declare nahi karte (implicit instance type), aur async keyword sirf un methods pe legal hai jo Task/Task<T>/void/ValueTask return karte hain. Constructor is category me fit hi nahi hota, isliye compiler seedha error deta hai: 'The modifier async is not valid for this item.' Sahi approach: static async factory method use karo.",
  },
  {
    id: "async-ctor-tr-5",
    question: "Ye code kya karega — await using ka behavior explain karo?\n```csharp\nawait using var session = new AsyncOrderSession(db);\nawait session.PlaceOrderAsync(dto);\n// scope end\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Scope khatam hote hi session.DisposeAsync() automatically await ho jayega, non-blocking tareeke se.",
    detailedAnswer:
      "await using compiler ko batata hai ki scope end hote hi (normal return ho ya exception ke through) DisposeAsync() call karo aur uska result await karo, bilkul try/finally ki tarah lekin async-aware. Ye guarantee karta hai cleanup deterministic hai aur thread ko block nahi karta jabki underlying cleanup khud async I/O kar raha ho.",
  },
  {
    id: "async-ctor-tr-6",
    question: "Ek high-throughput ASP.NET Core API me tumne dekha ki Dispose() method ke andar ek team-member ne `_asyncResource.CloseAsync().Wait()` likha hai. Iska kya risk hai, aur fix kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Thread-pool starvation/deadlock ka risk hai under load; fix hai IAsyncDisposable implement karke await using use karna.",
    detailedAnswer:
      "`.Wait()` calling thread ko block karta hai jab tak async operation complete na ho, jabki thread-pool ka thread us duration me kuch aur useful kaam kar sakta tha. High-throughput paths me ye jaldi thread-pool exhaustion tak le ja sakta hai, aur specific synchronization-context scenarios me deadlock bhi ho sakta hai. Fix: class ko IAsyncDisposable implement karao, DisposeAsync() ke andar genuinely await karo, aur caller side pe `using` ki jagah `await using` use karo.",
    followUp: "Agar class already IDisposable implement karti hai kisi legacy caller ke liye, dono kaise coexist karenge?",
    redFlag: "Sirf 'kaam to kar raha hai na' bolke ise ignore kar dena — production load me ye silently degrade karta hai, obvious crash nahi deta.",
  },
  {
    id: "async-ctor-tr-7",
    question: "Kya ye statement sahi hai: 'Har class jo koi async method use karti hai, usko IAsyncDisposable bhi implement karna chahiye'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi, galat hai — IAsyncDisposable sirf tab zaroori hai jab cleanup/dispose logic khud genuinely async ho.",
    detailedAnswer:
      "Bahut classes async methods use karti hain (jaise ek service jo await http.GetAsync(...) karta hai) lekin unka apna cleanup purely sync hota hai (bas ek in-memory cache clear karna) — aisi class ko IAsyncDisposable ki zaroorat nahi, plain IDisposable (ya kuch bhi nahi, agar unmanaged resource hi nahi hai) kaafi hai. IAsyncDisposable specifically tab chahiye jab DisposeAsync() ke andar khud await karna pade.",
    redFlag: "Har class pe blindly IAsyncDisposable add karna 'best practice hai' bolke — unnecessary complexity add karta hai bina real benefit ke.",
  },
  {
    id: "async-ctor-tr-8",
    question: "IAsyncDisposable aur IDisposable dono kab se available hain C# me?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "IDisposable shuru se C# 1.0 me tha; IAsyncDisposable aur await using C# 8.0 (.NET Core 3.0, 2019) me aaye.",
    detailedAnswer:
      "IDisposable .NET Framework ke shuruaati dino se hai, deterministic sync cleanup ke liye. IAsyncDisposable specifically C# 8.0 / .NET Core 3.0 (2019) me introduce hua, jab async-heavy resources (jaise EF Core ka DbContext, network streams) ke liye genuinely async cleanup ki zaroorat mehsoos hui.",
  },
  {
    id: "async-ctor-tr-9",
    question: "Ye output/behavior explain karo agar ek class dono IDisposable aur IAsyncDisposable implement karti hai, aur caller plain 'using' use karta hai (await using nahi):",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Dispose() (sync version) call hoga, DisposeAsync() nahi — jab tak Dispose() explicitly DisposeAsync() ko internally wire na kare.",
    detailedAnswer:
      "Plain `using` compiler ko sirf IDisposable.Dispose() call karne ke liye bind karta hai. Agar dono interfaces implement hain lekin Dispose() aur DisposeAsync() independent logic rakhte hain, sirf sync path chalega — jo bug ho sakta hai agar async cleanup zaroori tha. Best practice: Dispose() ke andar DisposeAsync().AsTask().GetAwaiter().GetResult() jaisa bridge rakho (sparingly), ya explicitly document karo ki caller ko await using hi use karna chahiye.",
    followUp: "Isko production code review me kaise catch karoge ki koi galti se plain using use kar raha hai async-cleanup-needing class pe?",
  },
  {
    id: "async-ctor-tr-10",
    question: "Ek async factory method (CreateAsync) exception throw kare initialization ke beech me — object partially construct ho chuka hoga kya?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Nahi — kyunki private constructor sirf tab call hota hai jab saara async setup successfully complete ho chuka ho.",
    detailedAnswer:
      "Factory pattern ka ek real benefit yahi hai: agar CreateAsync() ke andar await http.GetStringAsync(url) fail ho jaaye (exception throw kare), private constructor kabhi call hi nahi hota — koi partially-initialized object exist nahi karta, exception seedha caller tak propagate ho jaati hai. Ye ek genuine safety benefit hai factory pattern ka jo direct async constructor (agar wo possible hota) provide nahi kar paata — half-constructed object ka risk hi nahi hai.",
  },
];

export default questions;
