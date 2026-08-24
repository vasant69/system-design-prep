import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "idisposable-tr-1",
    question: "IDisposable kya hai, aur ye kis problem ko solve karta hai jo GC khud nahi solve kar sakta?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Amazon"],
    shortAnswer: "IDisposable.Dispose() deterministic cleanup deta hai unmanaged resources (file handles, connections) ke liye, jinhe GC directly samajh hi nahi paata.",
    detailedAnswer:
      "GC sirf managed memory (heap pe allocated .NET objects) track karta hai. File handles, DB connections, sockets jaise unmanaged/OS-level resources uski understanding se bahar hain — agar explicit cleanup na ho, ye leak ho sakte hain chahe underlying .NET object eventually garbage collect ho jaaye. IDisposable interface (single method Dispose()) ek explicit contract deta hai: 'is object ko use karne ke baad, mujhe zaroor call karo taaki main apne unmanaged resources release kar sakoon.'",
    followUp: "using statement Dispose() ko kaise guarantee karta hai?",
  },
  {
    id: "idisposable-tr-2",
    question: "using block aur using declaration (C# 8) me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Dono same guarantee dete hain (Dispose() at scope end), lekin using declaration braces ke bina likha jaata hai — Dispose() enclosing scope ke end tak automatically call hoti hai.",
    detailedAnswer:
      "Classic using block (`using (var x = ...) { ... }`) explicitly ek scope define karta hai jiske end pe Dispose() call hoti hai. using declaration (`using var x = ...;`, C# 8, 2019) koi braces nahi leta — Dispose() automatically call hoti hai jab enclosing method ya block khatam hota hai. Dono compiler internally try/finally me translate karte hain, isliye guarantee same hai — using declaration sirf syntax ko cleaner banata hai jab multiple disposables ek method me sequentially use ho rahe hon.",
  },
  {
    id: "idisposable-tr-3",
    question: "Finalizer (`~ClassName()`) aur `Dispose()` me exact difference kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Dispose() deterministic hai (caller explicitly call karta hai, ya using guarantee karta hai); finalizer non-deterministic hai (GC decide karta hai kab call karega, agar bhi).",
    detailedAnswer:
      "Dispose() ek regular method hai jo tum khud call karte ho (ya using automatically call karta hai) — timing predictable hai, tumhare control me. Finalizer (Object.Finalize() ka override) GC-triggered hai — jab object unreachable ban jaata hai, GC eventually usse collect karega aur agar finalizer defined hai to collect karne se pehle usko call karega. Lekin 'eventually' ka koi guarantee nahi hai timing pe — isliye finalizer ko primary cleanup mechanism nahi, sirf ek safety net (jab Dispose() call karna bhool jaao) maana jaana chahiye.",
    followUp: "GC.SuppressFinalize() kya karta hai aur Dispose() ke andar isko call karna kyun zaroori hai?",
  },
  {
    id: "idisposable-tr-4",
    question: "Ye kya print/behave karega?\n```csharp\nvoid ReadFile(string path)\n{\n    using var reader = new StreamReader(path);\n    if (reader.EndOfStream) return;\n    var line = reader.ReadLine();\n    Console.WriteLine(line);\n}\n```\nAgar `return` statement se pehle exit ho jaaye, kya reader properly dispose hoga?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Haan — using declaration guarantee karta hai Dispose() call ho method ke KISI BHI exit point pe (return, exception, ya normal end), na ki sirf method ke last line pe.",
    detailedAnswer:
      "using declaration ka guarantee sirf 'method ke end' tak simit nahi hai — ye method se BAHAR nikalne ke kisi bhi raste pe apply hota hai, chahe wo early return ho, exception ho, ya normal fall-through completion. Compiler internally poore method body ko effectively try/finally jaisa treat karta hai jahan finally me Dispose() call hoti hai. Isliye upar wale example me, chahe `return` early trigger ho, reader.Dispose() guaranteed call hogi.",
  },
  {
    id: "idisposable-tr-5",
    question: "Ye kya hoga? Standard Dispose pattern wali class me:\n```csharp\npublic void Dispose()\n{\n    Dispose(true);\n    // GC.SuppressFinalize(this); -- ye line missing hai\n}\n```\nIs missing line ka kya impact hoga?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Object phir bhi finalization queue me jaayega chahe resources already manually clean ho chuke hon — extra, avoidable GC overhead aata hai.",
    detailedAnswer:
      "GC.SuppressFinalize(this) GC ko batata hai 'is object ke liye finalizer run karne ki zaroorat nahi, cleanup already ho chuka hai.' Agar ye call missing hai, chahe Dispose() ne saara resource clean kar diya ho, object abhi bhi apni finalization queue entry carry karega — GC isse extra overhead ke saath handle karega (finalization queue me daalna, finalizer thread se process karna, phir hi memory poori tarah reclaim karna — 2 GC cycles lagenge normal 1 ki jagah). Ye ek real, measurable, easily-missed perf issue hai.",
    redFlag: "Standard Dispose pattern likhte waqt GC.SuppressFinalize(this) ko bhool jaana — ye ek chhoti si missing line hai jo silently perf cost add karti hai, koi error nahi deti.",
  },
  {
    id: "idisposable-tr-6",
    question: "Tumhare paas ek high-throughput API endpoint hai jo baar-baar SqlConnection banata hai lekin peak load pe 'Timeout expired, the timeout period elapsed prior to obtaining a connection from the pool' error aane lagti hai. Kya debug karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Check karo ki har code path (including exception paths) me SqlConnection properly disposed ho raha hai — kahin using ke bina connection create to nahi ho raha, jisse connection pool exhaust ho raha ho.",
    detailedAnswer:
      "Ye classic connection-pool-exhaustion symptom hai. Sabse pehla suspect: koi code path jahan SqlConnection using/using-declaration ke bina banaya gaya hai, ya jahan ek exception path Dispose() ko skip kar raha hai (jaise manually try/catch likha hai bina finally ke). Agar connections properly dispose nahi ho rahe, connection pool dheere-dheere exhaust ho jaata hai peak traffic me, aur naye requests ko koi available connection nahi milta timeout window ke andar. Fix: har DB access ko using/using declaration se wrap karo, aur code review me specifically check karo koi 'naked' `new SqlConnection(...)` bina using ke to nahi hai.",
    followUp: "GC finalizer se ye issue kyun 'apne aap' fix nahi hota, chahe technically SqlConnection bhi finalizable ho?",
  },
  {
    id: "idisposable-tr-7",
    question: "Ek IDisposable class ka Dispose(bool disposing) method likho jo managed aur unmanaged resources dono correctly handle kare.",
    type: "coding",
    difficulty: "advanced",
    shortAnswer: "disposing=true pe managed objects bhi safely dispose karo, disposing=false (finalizer se call) pe sirf unmanaged handles cleanup karo — kyunki managed objects finalizer ke waqt already collected ho sakte hain.",
    detailedAnswer:
      "```csharp\npublic class ResourceHolder : IDisposable\n{\n    private bool _disposed;\n    private readonly FileStream _stream;\n\n    public ResourceHolder(string path) => _stream = File.OpenRead(path);\n\n    public void Dispose()\n    {\n        Dispose(true);\n        GC.SuppressFinalize(this);\n    }\n\n    protected virtual void Dispose(bool disposing)\n    {\n        if (_disposed) return;\n        if (disposing)\n        {\n            _stream?.Dispose(); // managed resource — sirf safe hai jab caller ne khud Dispose() call kiya ho\n        }\n        // unmanaged handles cleanup yahan hoga, dono paths (disposing true/false) me\n        _disposed = true;\n    }\n\n    ~ResourceHolder() => Dispose(false);\n}\n```\ndisposing parameter ka fark: caller-invoked Dispose() (disposing=true) me managed objects abhi zinda hain, unhe safely touch kar sakte ho. Finalizer-invoked (disposing=false) me doosre managed objects already collect ho chuke ho sakte hain (finalization order guaranteed nahi hai), isliye sirf apne khud ke unmanaged handles clean karo.",
  },
  {
    id: "idisposable-tr-8",
    question: "Kya ye statement sahi hai: 'Agar main apni class me finalizer likh doon, to Dispose() call karna optional ho jaata hai — GC eventually sab clean kar dega'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — finalizer ek non-deterministic safety net hai, primary mechanism nahi. Isse resources der tak (ya crash jaisi edge cases me kabhi nahi) held rehte hain, jo production me real problems banata hai.",
    detailedAnswer:
      "Ye ek dangerous misconception hai. Finalizer ka execution GC ke schedule pe depend karta hai — koi timing guarantee nahi. High-throughput application me agar sab Dispose() calls skip karke finalizer pe depend kiya jaaye, resources (jaise DB connections) unexpectedly der tak held rahenge, jisse connection pool exhaustion jaisa real production incident ban sakta hai peak load pe. Application crash jaisi edge cases me finalizer kabhi run hi nahi hota. Isliye Dispose() (via using) hamesha PRIMARY mechanism hona chahiye, finalizer sirf ek safety net hai jab koi caller galti se Dispose() call karna bhool jaaye.",
    redFlag: "'GC sab sambhal lega' jaisi soch rakhna unmanaged resources ke baare me — ye interviewer ko turant lagta hai candidate ne GC ke managed-vs-unmanaged boundary ko nahi samjha.",
  },
];

export default questions;
