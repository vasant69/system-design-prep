import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "suppressfinalize-collect-tr-1",
    question: "`GC.SuppressFinalize()` kya karta hai aur kab call karna chahiye?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "TCS", "Infosys"],
    shortAnswer: "Object ko finalization queue se hataata hai — call karo `Dispose()` ke andar, jab class me finalizer ho aur cleanup already ho chuka ho.",
    detailedAnswer:
      "Finalizer-having classes ke instances allocation ke time finalization queue me register hote hain. Agar `Dispose()` explicitly call ho chuki hai (cleanup already ho chuka), finalizer ko phir se chalana redundant work hai. `GC.SuppressFinalize(this)` object ko is queue se hata deta hai, taaki wo normal, single-cycle collection me reclaim ho — bina finalizer ko phir se chalaye. Ye Dispose pattern ka standard part hai, public `Dispose()` ke andar `Dispose(true)` ke turant baad call hota hai.",
    followUp: "Agar SuppressFinalize call na kiya jaaye, kya practical impact hoga?",
  },
  {
    id: "suppressfinalize-collect-tr-2",
    question: "Ek finalizable object bina `SuppressFinalize()` ke reclaim hone me kitne GC cycles leta hai, aur kyun?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Kam se kam 2 — pehla cycle finalizer run karta hai, doosra actual memory free karta hai.",
    detailedAnswer:
      "Jab finalizable object unreachable ban jaata hai, GC use turant free nahi karta — pehle usse ek freachable queue me daalta hai (indicating 'finalizer needs to run'). Ek separate finalizer thread eventually finalizer run karta hai. Sirf iske baad, agle GC cycle me, object ki memory actually reclaim hoti hai. Isliye finalizable objects genuinely 'extra expensive' hote hain GC ke liye compared to non-finalizable objects jo ek hi cycle me reclaim ho jaate hain.",
  },
  {
    id: "suppressfinalize-collect-tr-3",
    question: "Kya `GC.Collect()` ko production code me manually call karna chahiye?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Almost never — ye GC ke apne tuned heuristics ko fight karta hai aur typically performance ko hurt karta hai, help nahi.",
    detailedAnswer:
      "GC apne allocation-pattern observations ke basis pe khud decide karta hai kab collect karna optimal hai. Manual `GC.Collect()` is decision-making ko bypass karta hai — ye genuinely short-lived Gen 0 objects ko bhi force-scan karta hai jo natural cycle me hi mar jaate, aur repeated forced calls objects ko premature promote kar sakte hain higher (expensive) generations me. Net effect almost hamesha worse performance hota hai. Bahut narrow, measured exceptions hain (one-time large-load cleanup, GC-behavior tests) — routine production paths me kabhi nahi.",
    redFlag: "'Memory high dikh raha hai, GC.Collect() daal do' — batata hai candidate ko GC ki tuned nature ki samajh nahi hai.",
  },
  {
    id: "suppressfinalize-collect-tr-4",
    question: "Ek batch-processing service me developer har item process hone ke baad `GC.Collect()` daal deta hai. Total processing time kaise affect hoga, aur kyun?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Total time typically badh jaayega — repeated forced collections genuinely short-lived objects ko bhi scan/promote karte hain, aur premature promotion Gen 2 collection frequency badhata hai.",
    detailedAnswer:
      "Har `GC.Collect()` call ek 'survival test' hai — objects jo abhi collect hone chahiye the (ya jinhe natural cycle me hi Gen 0 me collect ho jaana chahiye tha) forcibly evaluate hote hain, aur jo abhi bhi kisi tarah reachable dikhte hain (jaise stack pe temporarily) unnecessarily promote ho sakte hain. Ye pattern Gen 2 (expensive, full-scan) collection ko zyada frequent bana deta hai, jo overall throughput ko significantly hurt karta hai. Fix: `GC.Collect()` hatao, GC ki natural scheduling ko trust karo.",
    followUp: "Agar tumhe genuinely lagta hai ek specific point pe collection helpful hoga, kaise verify karoge ye assumption sahi hai?",
  },
  {
    id: "suppressfinalize-collect-tr-5",
    question: "Kaunse narrow scenarios me `GC.Collect()` genuinely justified hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ek known one-time large memory operation ke baad (measured benefit ke saath), GC-behavior unit tests, ya profiling baselines.",
    detailedAnswer:
      "Teen genuinely-accepted use cases: (1) application startup pe ek bahut bade dataset load-and-transform karne ke turant baad, jahan measured evidence ho ki immediate reclaim helpful hai (jaise memory-constrained environment me). (2) Unit/integration tests jo specifically GC behavior verify kar rahe hain — jaise confirm karna ki koi object genuinely collectable hai, tab `GC.Collect()` + `GC.WaitForPendingFinalizers()` deterministic testing ke liye use hota hai. (3) Diagnostic/profiling tools jo clean measurement baseline chahte hain. In sabme common thread hai: measured, evidence-based decision, 'just in case' nahi.",
  },
  {
    id: "suppressfinalize-collect-tr-6",
    question: "`GC.Collect()` ek generation parameter accept kar sakta hai, jaise `GC.Collect(0)`. Kya isse manual collection safe/recommended ho jaata hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — generation parameter sirf scope specify karta hai (Gen 0 tak limit karo), lekin core problem (GC ki apni scheduling bypass karna) wahi rehta hai. Recommendation same rehti hai: avoid it.",
    detailedAnswer:
      "`GC.Collect(0)` sirf Gen 0 collection force karega instead of full collection — ye 'thoda kam nuksaan' kar sakta hai bade forced Gen 2 collection ke against, lekin fundamental issue solve nahi karta: tum abhi bhi GC ki apni timing-decision ko override kar rahe ho bina uske heuristics jitni information ke. Zyadatar guidance yahi rehti hai ki manual `GC.Collect()` calls (kisi bhi generation parameter ke saath) avoid karo jab tak genuinely measured, narrow justification na ho.",
  },
  {
    id: "suppressfinalize-collect-tr-7",
    question: "Ye code review karo:\n```csharp\npublic void Dispose()\n{\n    Dispose(true);\n}\n~MyClass() => Dispose(false);\n```\nKya missing hai, aur iska practical impact kya hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "`GC.SuppressFinalize(this)` missing hai — chahe `Dispose()` explicitly call ho, finalizer phir bhi queue me rahega aur baad me redundantly run hoga.",
    detailedAnswer:
      "Bina `GC.SuppressFinalize(this)` ke, object hamesha finalization queue me registered rehta hai chahe `Dispose()` explicitly call ho chuka ho. Iska matlab: object ko fully reclaim hone me abhi bhi 2 GC cycles lagenge (ek redundant finalizer run ke liye, jismein `Dispose(false)` phir se chalega — jo agar `_disposed` flag check nahi kar raha, dobara cleanup try karega, potentially harmless lekin wasteful). Fix: `Dispose()` ke end me `GC.SuppressFinalize(this);` add karna.",
  },
];

export default questions;
