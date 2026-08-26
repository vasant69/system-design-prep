import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "aot-and-readytorun-tr-1",
    question: "AOT compilation kya hai, aur ye JIT se kaise fundamentally alag hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "TCS", "Infosys"],
    shortAnswer: "AOT native code ko app run hone se pehle hi generate karta hai; JIT runtime pe, per-method, on-demand compile karta hai.",
    detailedAnswer:
      "JIT (Just-In-Time) IL ko runtime pe, method-by-method, jab wo pehli baar call ho, native code me translate karta hai. AOT (Ahead-of-Time) ye compilation publish-time pe hi kar deta hai — jab app actually run hoti hai, native code already ready hota hai. `.NET 7`+ ka Native AOT is idea ko extreme tak le jaata hai: poori app self-contained native executable ban jaati hai, JIT/CLR dependency runtime pe hoti hi nahi.",
    followUp: "AOT ka koi genuine downside bhi hai, ya ye sirf strictly better hai JIT se?",
  },
  {
    id: "aot-and-readytorun-tr-2",
    question: "ReadyToRun aur Native AOT me kya fark hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "ReadyToRun ek hybrid hai (pre-compiled native code + IL fallback, JIT still present); Native AOT poori tarah JIT/CLR-free hai.",
    detailedAnswer:
      "ReadyToRun (R2R) assembly me pre-compiled native code embed karta hai, lekin full IL bhi saath rakhta hai — agar native version kisi wajah se use na ho sake, normal JIT fallback ho jaata hai. Isliye R2R startup improve karta hai bina flexibility poori tarah qurbaan kiye. Native AOT is se aage jaata hai — koi IL hi nahi bachta runtime ke liye, koi JIT nahi, koi CLR dependency nahi. R2R ek 'safe middle ground' hai, Native AOT ek 'full commitment' hai.",
  },
  {
    id: "aot-and-readytorun-tr-3",
    question: "Native AOT me heavy reflection use karne wale code ke saath kya problem aati hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Native AOT publish-time trimming karta hai (unused code remove), aur reflection compile-time pe predict nahi ho sakta ki kaunse types runtime pe access honge — isse trimming galat cheezein remove kar sakti hai.",
    detailedAnswer:
      "Trimming ka goal hai final binary chhoti rakhna — sirf wo code include karo jo genuinely use hota hai. Lekin agar code reflection se dynamically kisi type ko access karta hai (jaise `Type.GetType(someString)` ya ek ORM jo entity properties ko reflection se discover karta hai), compiler ko compile-time pe pata nahi chalta ki wo type/member zaroori hai — trimming usse remove kar sakta hai, jisse runtime pe `MissingMethodException`-jaisi failures aa sakti hain. Solution: source generators (compile-time code generation) jo reflection ka kaam bina runtime reflection ke kar dete hain.",
    followUp: "System.Text.Json source generators kis tarah ye problem solve karte hain?",
  },
  {
    id: "aot-and-readytorun-tr-4",
    question: "Kya Native AOT hamesha Normal JIT se better choice hai kyunki startup fast hoti hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — Native AOT runtime-adaptive optimizations qurbaan karta hai aur reflection-heavy/dynamic-loading code ke saath compatibility issues la sakta hai. Ye ek trade-off hai, unconditional upgrade nahi.",
    detailedAnswer:
      "JIT ka fayda ye hai ki wo actual runtime execution behavior dekh kar optimize kar sakta hai (jaise kaunsa branch zyada liya ja raha hai, kaunsi method genuinely hot hai) — Native AOT ye sab compile-time pe hi guess karta hai, kuch scenarios me suboptimal ho sakta hai. Saath hi, heavy reflection/dynamic code loading use karne wali libraries Native AOT ke trimming ke saath conflict kar sakti hain. Isliye choice context-dependent hai — startup-critical scenarios (serverless, CLI tools) me AOT jeetta hai, general-purpose long-running apps me Normal JIT ka runtime-adaptive optimization zyada value deta hai.",
    redFlag: "'Native AOT hamesha use karna chahiye, ye strictly better hai' bolna — trade-offs (reflection compatibility, runtime-adaptive optimization loss) ko ignore karta hai.",
  },
  {
    id: "aot-and-readytorun-tr-5",
    question: "Ek ASP.NET Core Minimal API ko AWS Lambda pe deploy karna hai jahan cold-start latency directly user-facing delay banti hai. Kaunsa compilation approach recommend karoge, aur kyun?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Native AOT — cold-start-sensitive serverless environments exactly wahi use case hain jiske liye Native AOT design kiya gaya (near-instant startup, no JIT warm-up).",
    detailedAnswer:
      "Serverless functions baar-baar cold-start hoti hain — har cold-start pe agar Normal JIT chal raha ho, methods ko compile hone me lagne wala time directly user-facing latency banta hai. Native AOT publish-time pe hi sab kuch native compile kar deta hai, isliye startup near-instant hota hai — koi JIT warm-up delay nahi. `.NET 8`+ ASP.NET Core Minimal APIs officially Native AOT support karti hain isi use case ke liye. Trade-off: team ko verify karna padega ki unka code (middleware, serializers, DI setup) AOT-compatible hai, reflection-heavy dependencies nahi hai.",
    followUp: "Agar app ki koi dependency Native AOT-incompatible nikle, to kya alternative hai?",
  },
  {
    id: "aot-and-readytorun-tr-6",
    question: "ReadyToRun kis scenario me Native AOT se better choice ho sakta hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Jab app startup improvement chahti ho lekin heavy reflection/dynamic-loading use karti ho jo Native AOT-incompatible ho — R2R full compatibility maintain karte hue bhi startup fast karta hai.",
    detailedAnswer:
      "Agar ek app ka significant hissa runtime reflection, dynamic assembly loading, ya plugin-style architecture pe depend karta hai (jo Native AOT trimming ke saath cleanly kaam nahi karega), lekin startup time abhi bhi improve karna hai, ReadyToRun ek pragmatic middle ground deta hai — pre-compiled native code jahan possible ho, full IL/JIT fallback jahan zaroori ho. Ye 'sab kuch AOT-compatible banao' ka overhead avoid karta hai.",
  },
  {
    id: "aot-and-readytorun-tr-7",
    question: "Ye statement kitna accurate hai: 'ReadyToRun basically ek chhota version of Native AOT hai'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat framing — R2R aur Native AOT alag philosophy pe based hain. R2R hybrid/fallback-based hai, Native AOT complete replacement hai (no JIT at all).",
    detailedAnswer:
      "R2R 'chhota AOT' nahi hai — ye ek fundamentally different design hai jahan native code aur IL dono coexist karte hain, aur JIT ek fallback mechanism ke roop me active rehta hai. Native AOT me JIT hota hi nahi, IL hota hi nahi runtime pe — puri app self-contained native binary hai. Behavior aur compatibility guarantees dono alag hain: R2R full reflection/dynamic-loading support karta hai (JIT fallback ki wajah se), Native AOT nahi.",
    redFlag: "R2R aur Native AOT ko ek hi spectrum pe 'kam vs zyada' samajhna, unke fundamentally alag JIT-dependency model ko miss karte hue.",
  },
  {
    id: "aot-and-readytorun-tr-8",
    question: "Ek CLI tool jo developers apne local machine pe baar-baar chalate hain (jaise ek code-formatter), Native AOT se kaise fayda uthaa sakta hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "CLI tools frequently invoke hote hain aur short-lived hote hain — startup time hi total execution time ka bada hissa hota hai, isliye Native AOT ka near-instant startup direct user-experience improvement deta hai.",
    detailedAnswer:
      "Ek CLI tool jo baar-baar (har baar naya process ke roop me) invoke hoti hai, uske liye total runtime me startup overhead ka proportion bahut zyada hota hai compared to ek long-running server app (jahan startup ek baar hi hota hai, phir app ghanton chalta hai). Isliye Native AOT jaisi startup-latency-minimizing approach CLI tools ke liye especially valuable hai — koi JIT warm-up delay nahi, tool turant chal jaata hai. Ye Normal JIT ke against ek significant, noticeable user-experience improvement de sakta hai.",
  },
];

export default questions;
