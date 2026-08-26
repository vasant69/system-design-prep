import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cts-and-cls-tr-1",
    question: "CTS (Common Type System) kya hai aur ye kya guarantee karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer: "CTS CLR ka poora type-system rulebook hai — ye guarantee karta hai ki har `.NET` language same underlying types (jaise `System.Object` root) use kare.",
    detailedAnswer:
      "CTS define karta hai ki types kaise structure hote hain (value vs reference), inheritance kaise kaam karta hai, aur sabse important — har type ultimately `System.Object` se hi derive karta hai (reference types directly, value types `System.ValueType` ke through). Isi wajah se C#, F#, VB.NET jaisi alag languages same CLR type system ke against compile hoti hain — ek C# `int` aur VB.NET `Integer` dono runtime pe `System.Int32` hi hain.",
    followUp: "Ye System.Object-root design decision `oops-dotnet` section me kahan cover kiya gaya hai?",
  },
  {
    id: "cts-and-cls-tr-2",
    question: "CLS (Common Language Specification) CTS se kaise alag hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "CLS, CTS ka ek narrower, opt-in-checked subset hai — sirf wo features jo guaranteed har `.NET` language me kaam karengi.",
    detailedAnswer:
      "CTS bahut permissive hai — CLR jo bhi support karta hai, wo CTS-valid hai. Lekin har `.NET` language CTS ki har cheez support nahi karti (jaise unsigned types). CLS is gap ko address karta hai — ye CTS ka ek stricter subset define karta hai jisme sirf guaranteed-cross-language-compatible features hain. Agar tumhari public API CLS-compliant hai, koi bhi CLS-compliant `.NET` language usse safely use kar sakti hai.",
  },
  {
    id: "cts-and-cls-tr-3",
    question: "`uint` CTS-valid hai lekin CLS-compliant nahi — is contradiction ko explain karo.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "CLR `uint` ko fully support karta hai (CTS-valid), lekin sab `.NET` languages unsigned types support nahi karte, isliye ye CLS ke stricter subset se bahar hai.",
    detailedAnswer:
      "'CTS-valid' ka matlab hai CLR ye type ko samajh sakta hai aur execute kar sakta hai — `uint` (`System.UInt32`) ke liye ye true hai. 'CLS-compliant' ka matlab hai ye type/feature guaranteed har `.NET` language me representable hai — kai languages me unsigned integer types nahi hote, isliye `uint` ko public CLS-compliant API me expose karna un languages se consumption break kar sakta hai. Yahi wajah hai BCL apni public APIs me `int` use karti hai `uint` ki jagah, jahan bhi possible ho.",
  },
  {
    id: "cts-and-cls-tr-4",
    question: "Kya CTS aur CLS ek hi cheez hain, sirf do naam?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Nahi — CTS poora type system hai (mandatory), CLS uska ek narrower, opt-in subset hai (interoperability guarantee ke liye).",
    detailedAnswer:
      "Ye ek common confusion hai kyunki dono naam similar sound karte hain ('Common Type System' vs 'Common Language Specification'). CTS ke bina CLR chal hi nahi sakta — har type CTS rules follow karti hai. CLS optional hai — sirf tab relevant jab tum guaranteed multi-language interoperability chahte ho, aur explicitly `[assembly: CLSCompliant(true)]` attribute se check enable karna padta hai.",
    redFlag: "'CTS aur CLS same hain, dono bas type-system rules hain' bolna — ye scope aur enforcement ka fark miss karta hai.",
  },
  {
    id: "cts-and-cls-tr-5",
    question: "`oops-dotnet` section me `System.Object` root ka topic already deeply cover ho chuka hai. CTS is concept se kaise directly connect hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "CTS wahi mechanism hai jo enforce karta hai ki har type — value ya reference — `System.Object` se derive kare; ye CTS ka ek core rule hai, sirf ek observation nahi.",
    detailedAnswer:
      "`what-is-oop-and-why-dotnet` topic me dikhaya gaya hai ki `int` bhi ultimately `System.Object` se derive karta hai `System.ValueType` ke through. Ye behavior 'aise hi ho gaya' nahi hai — ye CTS ki definition ka hi part hai: CTS specify karta hai ki CLR pe har type ka ek single-root hierarchy ho, aur `System.Object` hi wo root hai. Isliye CTS ko samajhna is pehle-covered concept ko architecturally justify karta hai.",
  },
  {
    id: "cts-and-cls-tr-6",
    question: "Ek internal, purely-C# microservice team ke liye CLS-compliance kitni practically relevant hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Largely academic — CLS sirf tab actively matter karta hai jab multiple `.NET` languages se interop guarantee karni ho, jaise ek public NuGet library.",
    detailedAnswer:
      "Agar poori team sirf C# use kar rahi hai aur code kabhi kisi doosri `.NET` language se consume nahi hoga, CLS-compliance checking (jaise `uint` avoid karna) genuinely zaroori nahi hai — ye extra constraint bina real benefit ke hoga. CLS ka real value tab dikhta hai jab public-facing libraries ya mixed-language enterprise codebases (jaise legacy VB.NET + naya C#) ho.",
    followUp: "Kaunse real-world scenarios me tumhe CLS-compliance active enforce karni padegi?",
  },
  {
    id: "cts-and-cls-tr-7",
    question: "Ek enterprise me purana VB.NET module aur naya C# module ek hi shared 'Utilities' library use kar rahe hain. Library ka public API `uint` return karta hai. Iska VB.NET side pe kya impact ho sakta hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Agar VB.NET (ya koi bhi language jo unsigned types support nahi karti) usse consume karne ki koshish kare, to compatibility issues aa sakti hain — CLS-compliance is risk ko compile-time pe hi flag kar deta.",
    detailedAnswer:
      "`uint` CTS-valid hai isliye CLR level pe koi crash nahi hoga, lekin consuming language agar unsigned types cleanly represent nahi karti, to developer experience friction-full ho sakta hai (conversions, warnings, ya unexpected behavior). Agar Utilities library `[assembly: CLSCompliant(true)]` set karti aur `uint` ki jagah `int`/`long` use karti, ye risk hi avoid ho jaata — CLS-compliance ka poora point yahi hai: cross-language friction ko design-time pe hi pakadna.",
  },
  {
    id: "cts-and-cls-tr-8",
    question: "Agar tumhe ek naya cross-language-consumable NuGet package design karna ho, CTS aur CLS ka gyaan tumhare design decisions ko kaise guide karega?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Public API surface ko CLS-compliant rakho (`unsigned` types avoid karo, case-sensitivity pe depend na karo), internal implementation me CTS ki full richness use kar sakte ho.",
    detailedAnswer:
      "CTS full type system hai, isliye internal (non-public) implementation me tum `uint`, case-sensitive overloads, ya koi bhi CTS-valid feature freely use kar sakte ho — koi restriction nahi. Lekin public API surface (jo external consumers, potentially doosri `.NET` languages se, use karenge) ko CLS rules ke andar design karna chahiye: `int`/`long` prefer karo `uint`/`ulong` ke bajaye, case-sensitivity pe kabhi depend mat karo public member names me. `[assembly: CLSCompliant(true)]` lagakar compiler se hi in violations ko design-time pe pakadwa sakte ho, bina manually har jagah check kiye.",
    followUp: "Agar koi internal helper method CLS-non-compliant type use kare, kya wo bhi warning trigger karega?",
  },
];

export default questions;
