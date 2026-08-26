import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "assemblyloadcontext-reflection-tr-1",
    question: "`AssemblyLoadContext` kya hai aur ye .NET Framework ke kaunse concept ki jagah aaya?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft"],
    shortAnswer: "`AppDomain` ki jagah aaya — ek lighter-weight, isolated boundary jisme assemblies dynamically load hoti hain.",
    detailedAnswer:
      "`AppDomain` .NET Framework ka isolation primitive tha jo ek process ke andar multiple isolated domains banata tha, unload-able. .NET Core ke cross-platform CLR redesign me AppDomain ka poora model fit nahi baitha, isliye ye largely non-functional stub reh gaya. `AssemblyLoadContext` (ALC) iska replacement hai — har process ek Default ALC ke saath start hota hai, aur custom, `isCollectible: true` ALCs create karke assemblies ko isolated, unload-able context me load kiya ja sakta hai — plugin systems ke liye common pattern.",
    followUp: "Kya poora AppDomain ka isolation guarantee ALC deta hai?",
  },
  {
    id: "assemblyloadcontext-reflection-tr-2",
    question: "Ek collectible `AssemblyLoadContext` banaya, `Unload()` bhi call kiya, lekin memory free nahi ho rahi. Sabse likely reason kya hoga?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Kahin ek strong reference us ALC me loaded kisi type/instance ko host code se bahar hold kar raha hai, jo GC ko us ALC ko collect karne se rok raha hai.",
    detailedAnswer:
      "`Unload()` sirf ALC ko unloading ke liye eligible marta hai — actual collection tab hota hai jab koi bhi strong reference us ALC ke andar loaded kisi type, instance, ya delegate ko host code (Default ALC ya kisi doosre living context) se hold nahi kar raha. Agar host ne plugin ka koi object reference kahin store kar rakha hai (jaise ek static field, ek cached delegate, ya event subscription jo unsubscribe nahi hui), ALC unload nahi hoga — ye bilkul waisa hi hai jaise ek event-handler-leak object ko GC-rooted rakhta hai.",
    redFlag: "'Unload() call kar diya, memory turant free ho jaani chahiye' — ye galat expectation hai, GC lazy hai aur external references check karni padti hain.",
  },
  {
    id: "assemblyloadcontext-reflection-tr-3",
    question: "Reflection kya hai, aur ye compile-time type checking se kaise fundamentally alag hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Reflection runtime pe types/members discover aur invoke karta hai — compile-time type safety poori tarah kho jaati hai, typo runtime exception dega.",
    detailedAnswer:
      "Normal code me compiler compile-time pe check karta hai ki tum jis method/property ko call kar rahe ho wo exist karta hai, sahi signature ke saath. Reflection (`Type.GetMethod(\"MethodName\")`, `MethodInfo.Invoke(...)`) ye check runtime pe move kar deta hai — agar method name typo ho gaya ya signature match nahi hua, error compile-time pe nahi, runtime pe (ek exception ke roop me) pakda jaayega. Isliye reflection powerful hai (dynamic scenarios enable karta hai) lekin genuinely risk bhi carry karta hai jo static typing avoid karti hai.",
  },
  {
    id: "assemblyloadcontext-reflection-tr-4",
    question: "Ek plugin architecture design karo — host app ko runtime pe third-party `.dll` files load karke unke andar ke types use karne hain, bina compile-time pe unhe reference kiye. High-level approach kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ek shared interface/contract assembly define karo, custom collectible `AssemblyLoadContext` se plugin `.dll` load karo, `AssemblyDependencyResolver` se uske dependencies resolve karo, phir Reflection se instantiate/invoke karo (ya interface ke through cast karo).",
    detailedAnswer:
      "(1) Ek shared 'contract' assembly banao jisme ek interface ho (jaise `IPlugin` with `Execute()` method) — host aur plugin authors dono iske against build karte hain. (2) Host ek custom `AssemblyLoadContext` (isCollectible: true) banata hai per-plugin, `AssemblyDependencyResolver` ke saath plugin ki apni dependencies sahi resolve karne ke liye. (3) `loadContext.LoadFromAssemblyPath(pluginPath)` se assembly load karo. (4) `Assembly.GetTypes()` se `IPlugin` implement karne wale types dhoondo, `Activator.CreateInstance()` se instantiate karo, phir seedha interface ke through call karo (pure reflection `Invoke()` se better — interface cast ho jaaye to type-safe call milta hai). Plugin remove/reload karna ho to `loadContext.Unload()`.",
    followUp: "Interface ke through call karna pure MethodInfo.Invoke() se better kyun hai?",
  },
  {
    id: "assemblyloadcontext-reflection-tr-5",
    question: "Do plugins, alag versions ki `Newtonsoft.Json` use karte hain, ek hi host process me load ho rahe hain. `AssemblyLoadContext` isme kaise madad karta hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Har plugin ko apne alag ALC me load karke, unki dependencies isolate ho jaati hain — ek version doosre se conflict nahi karta.",
    detailedAnswer:
      "Agar dono plugins Default ALC me hi load hote, ek hi assembly name/version slot ke liye conflict ho sakta tha (jo assembly pehle load hui, wahi 'jeetegi', doosri version mismatch se fail ho sakti thi). Har plugin ko apne khud ke custom `AssemblyLoadContext` me load karke, har ek apni `Newtonsoft.Json` version independently resolve/load kar sakta hai — isolation ki wajah se conflict nahi hota, jab tak plugins ek doosre ke internal types directly share na kar rahe hon.",
  },
  {
    id: "assemblyloadcontext-reflection-tr-6",
    question: "`AssemblyDependencyResolver` ka role kya hai `AssemblyLoadContext`-based plugin loading me?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Plugin ki apni `.deps.json` metadata padh kar uski dependencies ko sahi tareeke se resolve karta hai, host app se independently.",
    detailedAnswer:
      "Jab ek plugin `.dll` apni khud ki dependency `.dll` files ke saath ship hoti hai (usi folder me), `AssemblyDependencyResolver` us plugin ke `.deps.json` (jo publish ke time generate hoti hai) padh kar batata hai kaunsi dependency `.dll` kaha se load karni hai. Bina iske, custom `Load()` override me manually path resolution likhna padta, jo error-prone hai. Ye ALC ke saath tightly paired API hai plugin scenarios ke liye specifically design kiya gaya.",
  },
  {
    id: "assemblyloadcontext-reflection-tr-7",
    question: "Kya ye statement sahi hai: 'Reflection ka use karne se hamesha significant performance hit hota hai, isliye production code me avoid karna chahiye'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Overly broad — one-time/infrequent reflection (jaise startup pe type discovery) fine hai; problem tab hai jab hot, frequently-called paths me bina caching ke use ho.",
    detailedAnswer:
      "Reflection genuinely ek overhead carry karta hai direct calls ke comparison me, lekin 'hamesha avoid karo' overly simplistic advice hai. Startup-time operations (jaise DI container ka assembly scanning, ek baar ke type discovery) me reflection ka cost negligible hai poore app lifecycle ke against. Real problem tab hai jab reflection **repeatedly, hot path me, without caching** use ho — jaise ek request handler jo har request pe fresh `Type.GetMethod()` call kare. Sahi mitigation caching (resolve once, reuse) ya compiled delegates/expression trees hai, blanket avoidance nahi.",
    redFlag: "'Reflection kabhi use hi nahi karni chahiye' jaisa absolute statement — nuanced cost/benefit samajh ka abhaav dikhata hai.",
  },
  {
    id: "assemblyloadcontext-reflection-tr-8",
    question: "Ye code kya karega?\n```csharp\nType? t = assembly.GetType(\"NonExistent.Type\");\nvar instance = Activator.CreateInstance(t);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "`GetType()` `null` return karega (default overload exception nahi throw karta), aur `Activator.CreateInstance(null)` `ArgumentNullException` throw karega.",
    detailedAnswer:
      "`Assembly.GetType(string)` (bina `throwOnError: true` ke) agar type nahi milta to `null` return karta hai, exception nahi throw karta by default. Isliye `t` yahan `null` hoga, aur `Activator.CreateInstance(t)` ko null pass karne par `ArgumentNullException` aayega. Ye ek classic reflection gotcha hai — developers assume kar lete hain `GetType()` fail hone par turant exception dega, lekin default behavior silent null return hai.",
  },
];

export default questions;
