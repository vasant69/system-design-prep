import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ref-out-in-tr-1",
    question: "`ref` aur `out` me kya fark hai? Ek concrete example ke saath explain karo.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Wipro", "Infosys"],
    shortAnswer: "`ref` caller-initialized required, two-way modification; `out` caller-init optional lekin callee-assign mandatory, one-way out.",
    detailedAnswer:
      "`ref int x` — caller ko `x` pehle se initialize karna zaroori hai (`int x = 5;`), aur method optionally usko modify kar sakta hai, jo caller pe reflect hota hai. `out int result` — caller `int result;` bina initialize kiye bhi pass kar sakta hai, lekin method ko HAR return path pe `result` ko assign karna mandatory hai (compiler enforce karta hai). Classic `out` use-case: `bool TryParse(string s, out int value)` — multiple values (success flag + result) return karna bina exception throw kiye.",
    followUp: "`in` parameter ye dono se kaise different hai?",
  },
  {
    id: "ref-out-in-tr-2",
    question: "`in` parameter kab introduce hua aur kis problem ko solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "C# 7.2 me aaya — large struct ko by-value pass karne se hone waali copy overhead avoid karta hai, bina mutation allow kiye.",
    detailedAnswer:
      "Normally struct by-value pass hota hai — poora struct copy hota hai method call pe. Agar struct genuinely large hai (multiple fields, 32+ bytes), ye copy expensive ho sakta hai hot-path code me. `in` parameter (C# 7.2) reference se pass karta hai — koi copy nahi — lekin readonly enforce karta hai, taaki caller confident rahe ki method unka data modify nahi karega. Ye `ref` ki performance ke saath value-type immutability ki safety combine karta hai.",
  },
  {
    id: "ref-out-in-tr-3",
    question: "Ye code compile hoga ya error dega?\n```csharp\nvoid Increment(in int x)\n{\n    x++;\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — `in` parameter readonly hai, `x++` ek modification hai jo allowed nahi.",
    detailedAnswer:
      "`in` parameter compiler-enforced readonly hota hai — method body ke andar us parameter ki value ko badalne ki koshish (`x++`, `x = ...`) compile-time error deti hai: 'Cannot assign to variable because it is a readonly variable.' Ye deliberate design hai — `in` ka poora point hai ki caller ko guarantee mile ki method unka data modify nahi karega, sirf padhega.",
  },
  {
    id: "ref-out-in-tr-4",
    question: "`out` parameter ke saath ek method likho jo do integers ko divide kare, division-by-zero ko exception ke bina handle kare.",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer: "bool return + out result — TryDivide pattern, .NET ke TryParse jaisa.",
    detailedAnswer:
      "```csharp\nbool TryDivide(int numerator, int denominator, out int result)\n{\n    if (denominator == 0)\n    {\n        result = 0;\n        return false;\n    }\n    result = numerator / denominator;\n    return true;\n}\n```\nCaller: `if (TryDivide(10, 0, out int r)) { ... } else { /* handle failure, r is 0 */ }`. Ye pattern exception-throwing alternative se better hai jab division-by-zero ek EXPECTED, common failure mode hai, exceptional case nahi.",
  },
  {
    id: "ref-out-in-tr-5",
    question: "Kya `ref`/`out` ko async methods me use kiya ja sakta hai? Kyun ya kyun nahi?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — `async` methods `ref`/`out` parameters accept nahi karte, kyunki ye state-machine-based execution ke saath fundamentally incompatible hain.",
    detailedAnswer:
      "`async` method compiler dwara ek state machine me transform hota hai jo multiple times resume ho sakta hai (har `await` ke baad), potentially different thread pe. `ref`/`out` ek stack frame ke reference hote hain, jo async continuation ke across reliably track nahi kiye ja sakte — isliye C# compiler `async` methods me `ref`/`out` parameters ko explicitly disallow karta hai (compile error). Agar async method se by-reference-jaisa behavior chahiye, ek wrapper class/record return karna standard workaround hai.",
    redFlag: "Ye assume karna ki ref/out sabhi method kinds (including async) me equally kaam karte hain — ye ek genuine language-level restriction hai.",
  },
  {
    id: "ref-out-in-tr-6",
    question: "Ek performance-critical trading system me, tumhe ek 40-byte `PriceQuote` struct ko har microsecond call hone waale method me pass karna hai. Konsa parameter modifier use karoge aur kyun?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "`in PriceQuote quote` — copy avoid karta hai (40 bytes har call pe copy hona expensive hai) while readonly guarantee bhi deta hai.",
    detailedAnswer:
      "40-byte struct har call pe by-value pass hone se poora struct stack pe copy hoga — high-frequency hot path me ye measurable overhead ban sakta hai. `in PriceQuote quote` reference se pass karta hai (koi copy nahi), aur readonly enforce karta hai taaki accidental mutation na ho (jo `ref` allow karta lekin yahan intent nahi hai). `ref` bhi copy avoid karta, lekin galat signal deta ki method quote ko modify kar sakta hai — `in` zyada precise intent-communication hai.",
  },
  {
    id: "ref-out-in-tr-7",
    question: "Interfaces me `ref`/`out`/`in` parameters use ho sakte hain? Ek concrete example do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Haan — interface method signatures me bhi ref/out/in valid hain, implementing class ko exact same modifier match karna hoga.",
    detailedAnswer:
      "```csharp\ninterface IParser\n{\n    bool TryParse(string input, out int result);\n}\n\nclass NumberParser : IParser\n{\n    public bool TryParse(string input, out int result)\n        => int.TryParse(input, out result);\n}\n```\nInterface method signature aur implementing class dono me `out` (ya `ref`/`in`) match hona zaroori hai — signature mismatch (jaise `out` ko interface me rakhna lekin implementation me hatana) compile error deta hai.",
  },
  {
    id: "ref-out-in-tr-8",
    question: "Ye galat hai ya sahi: 'in' parameter chhote structs (jaise ek single int) ke liye bhi performance improve karta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — chhote types ke liye `in` ka overhead (indirection) khud struct-copy se zyada ya barabar ho sakta hai, koi real benefit nahi.",
    detailedAnswer:
      "`in` ka benefit tab hi real hai jab struct genuinely large ho (rule of thumb: roughly 16 bytes se zyada) — tabhi copy avoid karna reference-indirection ke overhead se zyada faayda deta hai. Ek `int` (4 bytes) ke liye `in` use karna koi meaningful benefit nahi deta — ulta, reference dereference karne ka chhota overhead ho sakta hai jo directly copy karne se zyada ho. Interview me ye ek achha follow-up trap hai ye check karne ke liye ki candidate `in` ko blindly 'always better' na maan raha ho.",
    redFlag: "Har parameter ko habitually `in` mark karna bina ye consider kiye ki struct genuinely large hai ya nahi.",
  },
];

export default questions;
