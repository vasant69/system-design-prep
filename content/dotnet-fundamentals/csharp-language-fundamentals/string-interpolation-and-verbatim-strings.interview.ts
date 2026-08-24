import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "string-interp-tr-1",
    question: "String interpolation `string.Format()` se kaise different hai — functionally aur syntactically?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Cognizant"],
    shortAnswer: "Functionally almost same (interpolation compile-time pe string.Format()-jaisi call me translate hoti hai), syntactically interpolation zyada readable hai — placeholder aur value ek jagah dikhte hain.",
    detailedAnswer:
      "`$\"Name: {name}, Age: {age}\"` compile-time pe roughly `string.Format(\"Name: {0}, Age: {1}\", name, age)` jaisi hi ek call ban jaati hai — koi runtime performance difference nahi hai. Fayda purely readability ka hai — interpolation me variable/expression seedha `{}` ke andar dikhta hai, `string.Format()` me index-based placeholders (`{0}`, `{1}`) alag se track karne padte hain arguments list ke saath, jo lambe strings me error-prone ho sakta hai.",
    followUp: "Format specifiers (jaise :C, :N2) interpolation ke andar kaise use hote hain?",
  },
  {
    id: "string-interp-tr-2",
    question: "Verbatim string ka `@` prefix exactly kya karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Escape-sequence processing disable karta hai — backslash aur (mostly) special characters literal ban jaate hain, string multi-line bhi ho sakta hai.",
    detailedAnswer:
      "Normal string me `\\n`, `\\t`, `\\\\` sab special escape sequences hote hain jo compiler interpret karta hai. `@` prefix ye interpretation poori tarah band kar deta hai — `\\` bas ek literal backslash character reh jaata hai, koi escape meaning nahi. Isse Windows paths (`@\"C:\\Users\\Amit\"`) aur regex patterns likhna kaafi zyada readable ban jaata hai. Verbatim strings literally multiple lines pe bhi span kar sakte hain — newline characters bhi literal treat hote hain.",
  },
  {
    id: "string-interp-tr-3",
    question: "Ek verbatim string ke andar literal double-quote kaise likhoge?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "`\"\"` (double double-quote) use karo — `@\"She said \"\"Hi\"\" today\"`.",
    detailedAnswer:
      "Verbatim strings me `\\\"` KAAM nahi karta (escape processing hi disabled hai) — literal quote ke liye `\"\"` (do consecutive double-quotes) use karna hota hai, jo compiler ek single literal `\"` ki tarah interpret karta hai. `@\"She said \"\"Hi\"\" today\"` ka actual content: `She said \"Hi\" today`.",
  },
  {
    id: "string-interp-tr-4",
    question: "Raw string literals (C# 11) kis genuine problem ko solve karte hain jo verbatim strings solve nahi karte the?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Content jisme bahut saare double-quotes mixed hon (jaise JSON) — verbatim me har quote ko \"\" karna padta, raw strings me koi escaping ki zarurat nahi.",
    detailedAnswer:
      "Ek JSON string ko verbatim string me embed karna har `\"` ko `\"\"` me convert karna maangta hai, jo genuinely unreadable ho jaata hai bade JSON payloads ke liye. Raw string literals (`\"\"\"...\"\"\"`, C# 11) is problem ko poori tarah eliminate karte hain — content ke andar kitne bhi double-quotes ho sakte hain bina kisi escaping ke, jab tak khud content triple-quote sequence na ho. Ye especially test fixtures, embedded config templates, aur API-response mocking me useful hai.",
  },
  {
    id: "string-interp-tr-5",
    question: "Ye code kya output karega?\n```csharp\nint count = 5;\nConsole.WriteLine($\"{count} item{(count == 1 ? \"\" : \"s\")}\");\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "\"5 items\" — interpolation ke andar ek ternary expression evaluate ho rahi hai.",
    detailedAnswer:
      "`{count}` seedha `5` print karta hai. `{(count == 1 ? \"\" : \"s\")}` ek nested expression hai — `count == 1` false hai (5 hai), isliye ternary `\"s\"` return karta hai. Poora output: '5 items'. Ye dikhata hai ki interpolation ke andar sirf simple variables nahi, arbitrary valid C# expressions (including nested ternary) evaluate ho sakti hain.",
  },
  {
    id: "string-interp-tr-6",
    question: "`$@\"...\"` aur `@$\"...\"` — dono valid hain? Kaunsa C# version se?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Haan, dono order valid hain — C# 8.0 se pehle sirf `$@` order allowed tha, C# 8.0 ne `@$` order bhi add kiya.",
    detailedAnswer:
      "Shuruaat me (jab combined prefix pehli baar introduce hua) sirf `$@\"...\"` order compile hota tha. C# 8.0 (2019) ne is restriction ko relax kar diya — ab `@$\"...\"` bhi equally valid hai, dono exact same behavior dete hain (verbatim + interpolation combined). Ye ek chhota lekin genuinely-asked syntax-history detail hai jo depth dikhata hai.",
  },
  {
    id: "string-interp-tr-7",
    question: "Kya raw string literal purane .NET Framework projects me compile hoga?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — raw string literals C# 11 feature hain, project ko C# 11+ language version (typically .NET 7+ SDK) target karna zaroori hai.",
    detailedAnswer:
      "C# language version project ke target framework se largely determine hoti hai (auto-detected by default, ya explicitly `<LangVersion>` .csproj me set kiya ja sakta hai). Ek purana .NET Framework 4.x ya .NET Core 3.1 project by default older language version target karta hai jahan raw string literal syntax (`\"\"\"...\"\"\"`) syntax error dega. Isse use karne ke liye project ko .NET 7+ SDK ke saath build karna hoga (LangVersion 11 ya latest).",
    redFlag: "Assume karna ki naya C# syntax automatically har project me kaam karega, chahe target framework kuch bhi ho.",
  },
  {
    id: "string-interp-tr-8",
    question: "Windows network path ko dynamic batchId ke saath ek string me build karna hai. Kaunsa syntax use karoge, aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`$@\"\\\\server\\share\\imports\\{batchId}\\\"` — verbatim (backslash-heavy path) + interpolation (dynamic batchId) combined.",
    detailedAnswer:
      "Path `\\\\server\\share\\imports\\` me bahut saare literal backslashes hain — bina `@`, ise `\"\\\\\\\\server\\\\share\\\\imports\\\\\"` jaisa likhna padta, jo genuinely unreadable hai. `batchId` ek dynamic value hai jo embed karni hai. `$@\"\\\\server\\share\\imports\\{batchId}\\\"` dono zarooratein poori karta hai ek saath — verbatim ka clean-backslash-handling AUR interpolation ka dynamic-value-embedding.",
  },
];

export default questions;
