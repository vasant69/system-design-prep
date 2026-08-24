import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "memory-leaks-tr-1",
    question: "Garbage collector hone ke bawajood .NET application me memory leak kaise possible hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon", "Razorpay"],
    shortAnswer: "GC sirf truly unreachable objects reclaim karta hai — agar koi reference chain object ko artificially reachable rakhe, GC use kabhi collect nahi karega, chahe application ko uski zaroorat na ho.",
    detailedAnswer:
      "GC ka guarantee ye hai ki jo object kisi root se unreachable hai, wo eventually reclaim hoga. Lekin GC kabhi evaluate nahi karta ki koi 'reachable' object application ko genuinely chahiye ya nahi. Chaar classic sources: (1) static references jo application lifetime tak jeete hain, (2) unsubscribed event handlers — publisher subscriber ko reference karta hai, agar publisher lambe lifetime ka hai aur unsubscribe nahi hota, subscriber forever rooted rahega, (3) undisposed IDisposable resources — unmanaged handles ka leak, (4) closures jo zaroorat se zyada (jaise poora `this`) capture karte hain.",
    followUp: "In char me se sabse counter-intuitive kaunsa hai, aur kyun?",
  },
  {
    id: "memory-leaks-tr-2",
    question: "'Lapsed listener problem' kya hai? Ek concrete example do.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Jab ek long-lived publisher ek short-lived subscriber ko event ke through reference karta rehta hai kyunki subscriber ne unsubscribe nahi kiya — subscriber forever rooted rehta hai.",
    detailedAnswer:
      "Event subscription (`pub.Event += sub.Handler`) se Publisher ke andar Subscriber ki taraf ek reference ban jaata hai (delegate invocation list). Agar `Publisher` application-lifetime singleton hai aur `Subscriber` ek short-lived object (jaise ek UI screen ya request-scoped service) hai jo kabhi `pub.Event -= sub.Handler` call nahi karta, Subscriber GC ke liye hamesha reachable rahega — 'logically dead' hone ke bawajood. Fix: explicit unsubscribe cleanup path me, ya weak-reference-based event pattern.",
  },
  {
    id: "memory-leaks-tr-3",
    question: "Ye code consider karo:\n```csharp\npublic class ReportGenerator\n{\n    private readonly byte[] _hugeBuffer = new byte[50_000_000];\n    private string _name = \"Q1\";\n    public Action GetCallback() => () => Console.WriteLine(_name);\n}\n```\nAgar `GetCallback()` ka result kahin lambe samay tak store hota hai, iska memory impact kya hoga?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Poora `ReportGenerator` (50MB buffer samet) indirectly rooted rahega, kyunki `_name` access karne ke liye closure poora `this` capture karta hai.",
    detailedAnswer:
      "Lambda `_name` ko access kar raha hai, jo ek instance field hai — isliye compiler `this` (poora `ReportGenerator` instance) capture karta hai, sirf `_name` string ki value nahi. Isliye jab tak returned `Action` kahin reachable rehta hai (jaise ek list me store hota hai), poora `ReportGenerator` object — 50MB `_hugeBuffer` samet — bhi indirectly rooted rehta hai, chahe caller ko sirf ek chhoti string chahiye thi. Fix: locally ek copy le lo (`var name = _name;`) taaki closure sirf `name` capture kare, `this` nahi.",
  },
  {
    id: "memory-leaks-tr-4",
    question: "Static fields memory leak ka source kaise ban sakte hain?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Static fields application lifetime tak roots rehte hain — agar unme items add karte jaao bina kabhi remove kiye, wo unbounded grow karenge.",
    detailedAnswer:
      "Ek `static` field/collection application ki poori lifetime tak GC root rehta hai. Agar code `_staticCache.Add(item)` jaisa pattern follow karta hai bina kabhi eviction/expiry logic ke, items collection me forever accumulate hote rahenge — application band hone tak kabhi collect nahi honge, chahe unhe kabhi access na kiya jaaye. Fix: bounded cache (jaise `MemoryCache` size-limit ke saath), explicit expiry, ya weak-reference-based collections.",
  },
  {
    id: "memory-leaks-tr-5",
    question: "Production me suspect hai ki memory leak ho raha hai. Kaunsa diagnostic signal sabse reliable hoga, sirf 'total process memory' dekhne se better?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ek specific type ki instance count time ke saath track karo — agar wo monotonically badh rahi hai bina plateau kiye steady load ke under, ye genuine leak signal hai.",
    detailedAnswer:
      "Total process memory naturally fluctuate karta hai kyunki GC apni marzi se collect karta hai — akela unreliable indicator hai. Better approach: memory profiler (dotnet-gcdump, Visual Studio Diagnostic Tools, dotMemory) se 'instance count by type' track karo. Agar koi specific type (jaise `Subscriber`, `CustomerData`) ki count consistently badhti rahe steady/repeating load ke under bina kabhi plateau kiye, ye strongly indicate karta hai ki wo type kahin unintentionally rooted ho raha hai.",
    followUp: "Aisa type identify hone ke baad, agla debugging step kya hoga uska root cause pin down karne ke liye?",
  },
  {
    id: "memory-leaks-tr-6",
    question: "Kya ye statement sahi hai: 'C# me automatic garbage collection hai, isliye memory leak likhna genuinely mushkil/rare hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat direction ka overconfidence — managed memory leaks actually kaafi common hain production .NET apps me, especially event-handler aur static-cache patterns ke through.",
    detailedAnswer:
      "Ye ek dangerous half-truth hai. GC C/C++-style raw dangling-pointer bugs eliminate karta hai, lekin 'reachability-based leaks' (unsubscribed events, unbounded static collections, over-capturing closures) genuinely common hain real .NET codebases me, especially long-lived services/singletons ke saath interact karne wale short-lived objects ke context me. Interview me confidently 'leaks rare hain' bolna weak signal hai — better answer hai specific mechanisms explain karna jo actually leaks cause karte hain.",
    redFlag: "'.NET me memory leak likhna genuinely bahut mushkil hai' — overconfident aur galat, real production incidents ka pattern ignore karta hai.",
  },
  {
    id: "memory-leaks-tr-7",
    question: "Undisposed IDisposable resource aur 'managed memory leak' me kya technical fark hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Undisposed IDisposable ka managed wrapper eventually GC se collect ho sakta hai (agar reachable nahi), lekin underlying unmanaged resource leak ho sakta hai — ye 'resource leak' hai, 'managed memory leak' se technically different lekin symptoms similar.",
    detailedAnswer:
      "Managed memory leak me object khud reachable rehta hai isliye GC use kabhi collect nahi karta. Undisposed IDisposable case me object khud (managed wrapper) collectable ho sakta hai agar unreachable ban jaaye — lekin agar `Dispose()` kabhi call nahi hui aur proper finalizer bhi nahi hai, underlying unmanaged resource (file handle, socket, DB connection) release nahi hota, jo ek genuine resource leak hai, technically 'managed heap' leak se alag category, lekin practical symptoms (degrading performance, eventual resource exhaustion) similar hain.",
  },
];

export default questions;
