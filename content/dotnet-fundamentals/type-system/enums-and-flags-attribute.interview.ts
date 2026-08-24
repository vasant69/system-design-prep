import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "enums-flags-tr-1",
    question: "[Flags] attribute enum ke behavior ko kaise change karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer: "Ise bitwise-combinable banata hai — multiple values ek saath ek variable me hold ho sakti hain, aur ToString() bhi smart, comma-separated output deta hai.",
    detailedAnswer:
      "Normal enum me ek variable sirf ek value hold kar sakta hai. `[Flags]` marked enum me, agar members power-of-two hon, tum bitwise OR (`|`) se multiple values combine kar sakte ho ek variable me — jaise permissions (Read | Write). `HasFlag()` ya bitwise `&` se check kiya ja sakta hai koi specific flag set hai ya nahi.",
    followUp: "Members power-of-two kyun hone chahiye [Flags] ke saath?",
  },
  {
    id: "enums-flags-tr-2",
    question: "Kya enum runtime pe fully type-safe hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — compile-time type-safe hai, lekin runtime pe sirf ek integer hai; arbitrary out-of-range values forcibly cast ki ja sakti hain.",
    detailedAnswer:
      "Enum compile-time pe type mismatches rokta hai (tum string ko enum variable me assign nahi kar sakte). Lekin runtime pe underlying representation sirf ek integer hai — koi built-in runtime check nahi hai ki cast ki gayi value kisi defined member se match kare ya nahi. `(SomeEnum)999` compile aur run dono ho jaayega chahe 999 koi defined member na ho. External/untrusted input ke liye `Enum.IsDefined()` se explicit validation zaroori hai.",
    redFlag: "'Enum hamesha valid value hi hold karega' bolna — runtime behavior ka misunderstanding dikhata hai.",
  },
  {
    id: "enums-flags-tr-3",
    question: "Ye code kya print karega?\n```csharp\n[Flags]\npublic enum Permissions { None = 0, Read = 1, Write = 2, Execute = 4 }\nvar p = Permissions.Read | Permissions.Execute;\nConsole.WriteLine(p);\nConsole.WriteLine(p.HasFlag(Permissions.Write));\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"Read, Execute\" phir \"False\" — combined value me Write set nahi hai.",
    detailedAnswer:
      "`Permissions.Read | Permissions.Execute` binary me `0001 | 0100 = 0101` deta hai, jo Read aur Execute dono bits set karta hai. `[Flags]` attribute ki wajah se `ToString()` isko readable format me dikhata hai: \"Read, Execute\". `HasFlag(Write)` check karta hai kya `0010` bit set hai `0101` me — nahi hai, isliye `False`.",
  },
  {
    id: "enums-flags-tr-4",
    question: "Ek naye [Flags] enum member ko galti se non-power-of-two value (jaise 3) diya gaya. Iska kya practical impact ho sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Ye value effectively existing do flags (1 aur 2) ke bitwise-equivalent ban jaati hai, jisse HasFlag() checks unexpectedly true return kar sakte hain un objects ke liye jinke paas ye specific new value nahi thi.",
    detailedAnswer:
      "Agar `HRAdmin = 3` add kiya jaaye jab `Read = 1` aur `Write = 2` already exist karte hain, `3` binary me `0011` hai — jo exactly `Read | Write` ke barabar hai. Koi bhi entity jiske paas `Read | Write` combined flags hain, wo `HasFlag(HRAdmin)` ke liye bhi `True` denge, chahe unhe explicitly `HRAdmin` role assign hi nahi kiya gaya — ye ek subtle, silent correctness bug hai jo compiler catch nahi karta.",
    redFlag: "Naya [Flags] member add karte waqt existing bit-pattern check na karna, sirf 'next number' assign kar dena.",
  },
  {
    id: "enums-flags-tr-5",
    question: "Enum ka underlying type memory ke perspective se kab matter karta hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Jab enum values ki bahut badi quantity store ki ja rahi ho (arrays, large collections) — byte-backed enum default int se 4x kam memory leta hai per value.",
    detailedAnswer:
      "Agar ek enum ka koi bada array (lakhon elements) store karna hai, default `int` underlying type (4 bytes) vs `byte` (1 byte) ka difference significant total memory bacha sakta hai. Chhote applications ya kam-quantity scenarios me ye difference negligible hai, lekin large-scale data processing (jaise ek stream processing pipeline jo lakhon status codes store karti hai) me measurable ho sakta hai.",
  },
  {
    id: "enums-flags-tr-6",
    question: "Kya ek [Flags] enum me None = 0 member hona zaroori hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Technically mandatory nahi, lekin strongly recommended — 'no flags set' state ko explicitly, readable tareeke se represent karta hai.",
    detailedAnswer:
      "Compiler `None = 0` require nahi karta, lekin agar wo missing ho, default(Permissions) ya ek empty-flags variable ka ToString() output kuch generic/numeric dikhayega (jaise \"0\") instead of ek meaningful name. `None = 0` include karna best practice hai — ye 'koi permission nahi' state ko explicitly, self-documenting tareeke se represent karta hai, aur `HasFlag`/comparisons me bhi ek clear baseline deta hai.",
  },
  {
    id: "enums-flags-tr-7",
    question: "Ek non-Flags (normal) enum ke members ka underlying integer value explicitly likhne ka koi practical fayda hai, ya default auto-increment (0,1,2,...) kaafi hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Persisted/serialized data (jaise database ya API contracts) ke liye explicit values likhna safer hai — naya member beech me insert karne se existing values shift nahi honi chahiye.",
    detailedAnswer:
      "Agar enum values kahin persist ho rahi hain (database column, JSON API response), aur koi naya member beech me add ho jaaye bina explicit values ke, saare baad ke members ki auto-incremented value shift ho jaati hai — jo existing stored data ko silently misinterpret karwa sakta hai (jaise `Shipped = 2` ab `Delivered` ban jaaye agar koi naya member 2 ki jagah insert ho gaya). Explicit values (`Pending = 0, Confirmed = 1, ...`) is risk ko eliminate karte hain, naye members hamesha end me ya unused numbers ke saath add kiye ja sakte hain.",
    redFlag: "Persisted enum values ko bina explicit assignment ke chhodna aur beech me naye members insert karna — ye ek real, silent data-corruption risk hai.",
  },
  {
    id: "enums-flags-tr-8",
    question: "Ye code kya print karega?\n```csharp\n[Flags]\npublic enum Days { None = 0, Mon = 1, Tue = 2, Wed = 4 }\nvar d = Days.Mon | Days.Wed;\nConsole.WriteLine((d & Days.Tue) == Days.Tue);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "False — d me sirf Mon aur Wed set hain, Tue bit set nahi hai.",
    detailedAnswer:
      "`d = Mon | Wed` binary me `0001 | 0100 = 0101`. `Tue` ka bit pattern `0010` hai. `d & Tue` = `0101 & 0010 = 0000`, jo `Tue` (`0010`) ke barabar nahi hai. Isliye comparison `False` return karta hai — d me Tuesday ka flag set hi nahi hai, sirf Monday aur Wednesday set hain.",
  },
];

export default questions;
