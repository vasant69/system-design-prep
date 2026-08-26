import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "deployment-models-fdd-scd-tr-1",
    question: "Framework-Dependent aur Self-Contained deployment me exact fark kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer: "FDD sirf app code publish karta hai, target pe Runtime chahiye; SCD poora Runtime bundle karta hai, target pe kuch install nahi hona chahiye.",
    detailedAnswer:
      "Framework-Dependent Deployment (FDD, default) me publish output me sirf app ki apni `.dll` files aur NuGet dependencies hoti hain — .NET Runtime khud shamil nahi hota, target machine pe pehle se matching Runtime installed hona zaroori hai. Self-Contained Deployment (SCD) me poora .NET Runtime hi output ke saath bundle ho jaata hai — target machine pe .NET install hone ki koi zaroorat nahi, lekin output size significantly bada ho jaata hai aur ye platform-specific (RID-based) hota hai.",
    followUp: "Kis scenario me kaunsa choose karoge?",
  },
  {
    id: "deployment-models-fdd-scd-tr-2",
    question: "Kis situation me Framework-Dependent deployment better choice hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Jab tum apna infrastructure control karte ho — Runtime shared hoti hai, chhota output, central security patching.",
    detailedAnswer:
      "Jab deployment target apne control me ho (jaise production servers ya container base images jinme Runtime already hai), FDD better hai — multiple apps ek hi Runtime install share kar sakti hain (disk/memory efficient), publish output chhota aur fast hota hai, aur Runtime-level security patch ek jagah apply hone se saari apps ko fayda milta hai bina individually re-deploy kiye.",
  },
  {
    id: "deployment-models-fdd-scd-tr-3",
    question: "Kis situation me Self-Contained deployment better choice hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Jab target machine unpredictable ho (customer machines) ya strict per-app Runtime version isolation chahiye.",
    detailedAnswer:
      "Jab deployment target control me nahi hai — jaise ek on-premise customer machine jaha .NET install hone ki guarantee nahi — Self-Contained genuinely zero-dependency deployment deta hai. Ye tab bhi useful hai jab multiple apps ek hi machine pe alag-alag, potentially conflicting Runtime versions pe depend karti hain aur unhe strictly isolate karna ho.",
    followUp: "Iska trade-off kya hai security patching ke context me?",
  },
  {
    id: "deployment-models-fdd-scd-tr-4",
    question: "Self-contained deployment ka security-patching trade-off kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Runtime vulnerability fix hone par har self-contained app individually re-publish/re-deploy karni padti hai — koi central patch nahi.",
    detailedAnswer:
      "Framework-dependent deployments me, agar Runtime me security vulnerability fix hoti hai, machine-level Runtime ko update karna kaafi hai — saari apps jo us Runtime ko share karti hain automatically patched ho jaati hain. Self-contained deployments me har app apna khud ka Runtime copy carry karti hai, isliye har ek ko individually rebuild/re-publish/re-deploy karna padta hai jab bhi Runtime-level patch aata hai. Ye operational overhead genuinely significant ho sakta hai agar bahut saari self-contained apps deploy hain.",
  },
  {
    id: "deployment-models-fdd-scd-tr-5",
    question: "Self-contained publish karte waqt Runtime Identifier (RID) specify karna zaroori kyun hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Kyunki output me actual, platform-specific native Runtime binaries bundle hoti hain.",
    detailedAnswer:
      "Self-contained output ek specific OS/architecture ke liye compiled hota hai kyunki Runtime binaries khud platform-specific native code hain (`linux-x64`, `win-x64`, `osx-arm64` alag-alag). Isliye publish command me `-r <RID>` explicitly specify karna padta hai, aur ek RID ka self-contained build doosre platform pe nahi chalega — Framework-dependent deployment isse zyada portable hota hai kyunki wo runtime resolution target machine pe hi hoti hai.",
  },
  {
    id: "deployment-models-fdd-scd-tr-6",
    question: "`PublishSingleFile=true` kya karta hai, aur ye kis deployment model ke saath sabse common combination hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Saari dependencies ek executable me pack karta hai; self-contained ke saath combine karke ek genuinely standalone .exe banta hai.",
    detailedAnswer:
      "`PublishSingleFile=true` publish output ki multiple `.dll` files ko ek single executable me bundle kar deta hai, distribution simplify karta hai. Self-contained + single-file combo sabse common pattern hai jab ek genuinely standalone executable chahiye ho jise koi installation ya prerequisite ke bina directly run kiya ja sake — jaise customer ko diya jaane wala ek utility tool.",
    followUp: "Kya single-file matlab literally zero extra files runtime pe?",
  },
  {
    id: "deployment-models-fdd-scd-tr-7",
    question: "Production support team complain karti hai ki ek framework-dependent app deploy karne ke baad start hi nahi ho rahi naye server pe. Sabse likely root cause kya hoga, aur kaise verify karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Naye server pe matching .NET Runtime install nahi hai ya wrong version hai — `dotnet --list-runtimes` se verify karo.",
    detailedAnswer:
      "Framework-dependent deployment ki sabse common failure mode hi ye hai — target machine pe compatible Runtime missing ya wrong major version. `dotnet --list-runtimes` chala kar check karo kaunse versions installed hain, aur app ki `.runtimeconfig.json` me declared target version se compare karo. Fix: matching Runtime install karo, ya deployment model self-contained me switch karo agar Runtime provisioning consistently problematic hai.",
  },
  {
    id: "deployment-models-fdd-scd-tr-8",
    question: "Kya ye statement sahi hai: 'Self-contained deployment hamesha zyada secure hai kyunki har app apna isolated Runtime rakhta hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Misleading — isolation ek benefit hai, lekin agar patches consistently apply nahi hoti to har app independently outdated/vulnerable reh sakti hai.",
    detailedAnswer:
      "Isolation apne aap me security guarantee nahi hai. Framework-dependent setup me, ek central Runtime update se saari apps ek saath patch ho jaati hain — operationally ye actually zyada reliably secure rehta hai agar central patching process disciplined hai. Self-contained apps ke saath, har app team ko independently apni app re-publish karni padti hai jab Runtime CVE fix aaye — agar koi team miss kar jaaye, wo specific app silently outdated/vulnerable Runtime pe chalti reh sakti hai bina kisi central signal ke. Isolation ek trade-off hai, unconditional security upgrade nahi.",
    redFlag: "'Self-contained = zyada secure, hamesha' jaisa blanket statement — patching discipline ka factor ignore karna.",
  },
];

export default questions;
