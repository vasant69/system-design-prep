import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "trycatch-tr-1",
    question: "`finally` block ka exact guarantee kya hai — ye kab-kab chalta hai aur kab nahi?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer:
      "`finally` normal completion, caught exception, uncaught exception, ya early return — sab cases me chalta hai. Sirf process crash pe skip hota hai.",
    detailedAnswer:
      "`finally` guaranteed chalta hai jab bhi control `try` block se kisi bhi normal C# mechanism se exit karta hai — successful completion, ek exception catch hone ke baad, ek exception jo bubble up ho rahi ho (finally pehle chalta hai, phir exception aage propagate hoti hai), ya `try` ke andar `return`/`break`/`continue`. Guarantee sirf tab break hoti hai jab poora process crash ho jaaye — `Environment.FailFast()`, ek unrecoverable `StackOverflowException`, ya OS-level force-kill — kyunki in cases me normal CLR unwinding hi nahi hoti.",
    followUp: "Agar `finally` ke andar bhi ek exception throw ho jaaye jab try block already exception throw kar raha tha, tab kya hota hai?",
  },
  {
    id: "trycatch-tr-2",
    question: "Ye code kya output dega?\n```csharp\nstatic int GetValue()\n{\n    try\n    {\n        throw new InvalidOperationException();\n    }\n    finally\n    {\n        Console.WriteLine(\"Cleanup\");\n    }\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"Cleanup\" print hoga, phir `InvalidOperationException` unhandled exception ke roop me propagate hoga (koi catch nahi hai).",
    detailedAnswer:
      "`try` block exception throw karta hai. Kyunki koi matching `catch` nahi hai, exception directly `finally` tak jaata hai — `finally` execute hota hai (\"Cleanup\" print hota hai), aur uske baad exception apna normal propagation continue karta hai caller ki taraf, eventually agar kahin catch nahi kiya gaya to program crash karega ya top-level handler tak pahunchega. `finally` exception ko suppress nahi karta jab tak explicitly `return` ya naya exception uske andar na ho.",
  },
  {
    id: "trycatch-tr-3",
    question: "`SystemException` aur `ApplicationException` me kya fark hai, aur custom exceptions kis se inherit karni chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`SystemException` CLR khud use karta hai. `ApplicationException` custom exceptions ke liye thi lekin ab deprecated guidance hai — `System.Exception` seedha use karo.",
    detailedAnswer:
      "`SystemException` un exceptions ka base hai jo .NET runtime/CLR khud throw karta hai (`NullReferenceException`, `IndexOutOfRangeException`, waghera). `ApplicationException` originally intent thi ki application-level custom exceptions is se inherit karein taaki 'framework vs app' exceptions distinguish ho sakein. Practically ye distinction consistently follow nahi hui — bahut se conceptually 'application' errors (`InvalidOperationException`) khud `SystemException` se derive hote hain. Current Microsoft guidance: custom exceptions seedha `System.Exception` se inherit karo, `ApplicationException` avoid karo.",
  },
  {
    id: "trycatch-tr-4",
    question: "Ye multi-catch code compile hoga ya error dega?\n```csharp\ntry { }\ncatch (ArgumentException ex) { }\ncatch (Exception ex) { }\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Compile ho jaayega — ye specific-to-general order me hai, valid hai.",
    detailedAnswer:
      "Ye order sahi hai: specific exception (`ArgumentException`) pehle, general (`Exception`) baad me. Compiler har catch clause ko check karta hai ki wo reachable hai ya nahi — yahan dono reachable hain, koi conflict nahi. Ulta order (general pehle) hota to compile error aata.",
  },
  {
    id: "trycatch-tr-5",
    question: "Kya `finally` block ke andar `return` likhna sahi practice hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — `finally` me `return` try ka return value silently override karta hai aur in-flight exceptions ko swallow kar deta hai.",
    detailedAnswer:
      "`finally` ke andar `return` legal C# hai, lekin ek genuine anti-pattern hai. Agar `try` ne pehle se ek value return kiya tha, `finally` ka `return` use silently overwrite kar deta hai. Aur agar `try` ne exception throw ki thi, `finally` ka `return` us exception ko bhi completely swallow kar deta hai — exception kabhi caller tak propagate hi nahi hota, bina kisi trace/log ke. Roslyn analyzers explicitly is pattern par warning dete hain.",
    redFlag: "'finally me return likhna to normal hai' bolna, ye samjhe bina ki ye exceptions ko silently swallow kar sakta hai.",
  },
  {
    id: "trycatch-tr-6",
    question: "Ek method me resource cleanup (jaise file handle close karna) karni hai chahe method kaise bhi exit ho. Kahan likhoge, aur kyun?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer: "`finally` block me (ya uske syntactic sugar `using` statement me) — guarantee milta hai chahe try normally complete ho, exception aaye, ya early return ho.",
    detailedAnswer:
      "`finally` (ya `using`, jo compile hokar `try/finally` hi banta hai) ek hi jagah hai jahan se ye guarantee milta hai ki cleanup code hamesha chalega — chahe `try` successfully complete ho, chahe beech me exception aaye, chahe `try` ke andar hi `return` ho jaaye. 'Method ke aakhir me' cleanup likhna unsafe hai kyunki agar beech me exception ya early return ho jaaye, wo code kabhi reach hi nahi hoga.",
  },
  {
    id: "trycatch-tr-7",
    question: "Agar `try` block ke andar `catch` na ho, sirf `finally` ho, aur exception throw ho jaaye — kya hota hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`finally` chalta hai, phir exception normally propagate karta hai upar — `try-finally` bina catch ke bhi valid hai.",
    detailedAnswer:
      "`try-finally` (bina `catch`) ek genuinely useful pattern hai jab tumhe exception ko handle nahi karna (usse propagate hi hone dena hai caller tak), lekin cleanup guarantee chahiye. `finally` block execute hota hai, phir uske baad exception apni normal propagation continue karta hai — exactly waisa hi jaisa `finally` block hi nahi hota, sirf beech me cleanup extra ho jaata hai.",
  },
  {
    id: "trycatch-tr-8",
    question: "`System.Exception` hierarchy me `IndexOutOfRangeException` kahan fit hoti hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "`System.Exception` → `System.SystemException` → `IndexOutOfRangeException` — ye CLR khud throw karta hai.",
    detailedAnswer:
      "`IndexOutOfRangeException` ek runtime/CLR-thrown exception hai (array ke bounds se bahar access karne par), isliye ye `SystemException` se derive hoti hai, jo khud `System.Exception` se derive hoti hai. Custom application exceptions is chain me nahi aati — wo seedha `System.Exception` se derive honi chahiye, `SystemException` se nahi (jo CLR-owned exceptions ke liye reserved concept hai, though technically enforceable nahi hai).",
  },
  {
    id: "trycatch-tr-9",
    question: "Ek team ka code review me `catch (Exception ex) { }` (empty body) dikha. Ye kyun problematic hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Exception ko silently swallow karta hai — koi log, koi rethrow, koi trace nahi. Production bugs invisible ho jaate hain.",
    detailedAnswer:
      "Empty catch block exception ko completely silently discard karta hai — na koi logging, na koi indication ki kuch fail hua. Production me agar koi genuine failure ho (jaise database connection drop), application chalta rahega jaise sab normal hai, lekin actually data corrupt ho sakta hai ya operation silently skip ho sakta hai. Minimum baseline: kam se kam log karo (`_logger.LogError(ex, ...)`), aur decide karo ki rethrow karna hai ya genuinely handle karna hai.",
    redFlag: "Empty catch block ko 'safe fallback' bolna bina ye samjhe ki failures ab completely invisible ho jaate hain.",
  },
];

export default questions;
