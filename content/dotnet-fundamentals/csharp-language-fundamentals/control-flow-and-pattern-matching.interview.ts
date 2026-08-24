import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "control-flow-tr-1",
    question: "switch statement aur switch expression me kya fark hai? Kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "switch statement imperative control flow hai (multi-line branches), switch expression (C# 8) ek value directly return karta hai — concise mapping ke liye.",
    detailedAnswer:
      "switch statement traditional hai — har `case` block me arbitrary code, `break`/`return` chahiye, koi value directly return nahi hoti. switch expression `=>` syntax use karta hai, poora switch ek expression hai jo directly assign ho sakta hai. Main switch expression choose karta hoon jab goal ek simple input-to-value mapping ho (concise, declarative), aur switch statement jab har case me multi-statement side-effect-heavy logic ho (readable, imperative).",
    followUp: "Agar switch expression exhaustive nahi hai aur value match nahi hoti, kya hota hai runtime pe?",
  },
  {
    id: "control-flow-tr-2",
    question: "Property pattern kya hai? Ek real example do jahan ye nested if-else se readable ho.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Property pattern object ke properties ko directly switch/is expression me match karta hai, jaise `{ Total: > 10000 }`.",
    detailedAnswer:
      "Property pattern (C# 8) object ki internal properties ko destructure-jaisa access de kar match karta hai — `order switch { { Total: > 10000 } => \"High Value\", { Status: \"Cancelled\" } => \"Cancelled\", _ => \"Regular\" }`. Nested properties bhi supported hain (`{ Customer.IsVip: true }`). Ye equivalent nested if-else se kaafi zyada readable hai kyunki conditions ek decision-table jaisa dikhte hain, top-se-bottom scan-friendly.",
  },
  {
    id: "control-flow-tr-3",
    question: "Ye code kya output karega?\n```csharp\nint[] numbers = { 1, 2, 3, 4 };\nstring result = numbers switch\n{\n    [] => \"Empty\",\n    [var single] => $\"Single: {single}\",\n    [var first, .., var last] => $\"First: {first}, Last: {last}\",\n    _ => \"Other\",\n};\nConsole.WriteLine(result);\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "\"First: 1, Last: 4\" — array me 4 elements hain, list pattern [first, .., var last] match hota hai.",
    detailedAnswer:
      "List pattern (C# 11) array ki shape match karta hai. `numbers` me 4 elements hain — na to `[]` (empty) match hota hai, na `[var single]` (exactly one). `[var first, .., var last]` matches — 2 ya usse zyada elements ke liye, `first` first element bind karta hai, `last` last element, `..` beech ke sabko ignore karta hai. Output: 'First: 1, Last: 4'.",
  },
  {
    id: "control-flow-tr-4",
    question: "`case int n when n > 0:` — 'when' clause kya karta hai, aur evaluation order kya hai pattern ke against?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "when ek extra boolean guard hai jo pattern match hone KE BAAD evaluate hota hai — pehle type pattern check hota hai, phir when condition.",
    detailedAnswer:
      "Pattern (`int n`) pehle evaluate hota hai — value ka type check hota hai, agar match hua to variable `n` bind hoti hai. Sirf tabhi `when n > 0` guard check hota hai. Agar pattern hi match na kare (value int nahi hai), `when` evaluate hi nahi hoga, wo case skip ho jaayega. Ye order interview me kabhi confuse kiya jaata hai — `when` pattern ka replacement nahi, additional filter hai.",
  },
  {
    id: "control-flow-tr-5",
    question: "Kya switch expression me arms ka order matter karta hai? Ek scenario do jahan wrong order galat result de.",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Haan, top-to-bottom evaluate hota hai — pehla matching arm win karta hai, isliye specific patterns general patterns se pehle aane chahiye.",
    detailedAnswer:
      "Switch expression arms sequentially, top-to-bottom check hote hain — jo pehla match hota hai, wahi use hota hai, baaki skip ho jaate hain. Agar ek general pattern (jaise `int n`) ek specific pattern (jaise `int n and > 0`) se PEHLE likha jaaye, general pattern hamesha win karega aur specific pattern kabhi reach hi nahi hoga — compiler kai IDE-level warnings de sakta hai 'unreachable pattern' ke liye, lekin ye ek genuine logic bug ban sakta hai agar miss ho jaaye.",
    redFlag: "Assume karna ki switch expression 'best match' find karta hai jaise kuch languages karte hain — C# me ye strictly sequential, first-match-wins hai.",
  },
  {
    id: "control-flow-tr-6",
    question: "Relational aur logical patterns (`>`, `and`, `or`, `not`) kab introduce hue? Ek `and`/`or` combo example do jo range check karta ho.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "C# 9.0 (2020). Example: `age switch { >= 18 and <= 60 => \"Adult\", _ => \"Other\" }`.",
    detailedAnswer:
      "Relational patterns (`< 13`, `>= 18`) aur logical patterns (`and`/`or`/`not`) dono C# 9.0 me aaye. Ye range checks ko concise banate hain: `>= 18 and <= 60` ek range ko ek single pattern me express karta hai, jabki purane style me ye do separate `&&`-joined conditions likhna padta — `age >= 18 && age <= 60`. `not` bhi useful hai: `str is not (null or \"\")` — null-or-empty check ek line me.",
  },
  {
    id: "control-flow-tr-7",
    question: "switch statement me C# implicit fall-through kyun disallow karta hai, C/Java ke uljat?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Accidental fall-through ek common bug source thi C/Java me (missing break) — C# design-level pe isse impossible bana deta hai, explicit goto case se hi fall-through allowed hai.",
    detailedAnswer:
      "C/Java me `case` blocks default se fall-through karte hain agar `break` miss ho jaaye — ye ek extremely common, hard-to-spot bug rahi hai (developer ek `break` bhool jaaye, unintended code agla case bhi execute kar de). C# design team ne isse language-level pe disallow kiya — har non-empty case ka end `break`/`return`/`throw`/`goto case` se hona MANDATORY hai (compile error warna). Agar genuinely fall-through chahiye, `goto case X;` explicitly likhna padta hai — jo intent ko clear aur searchable banata hai.",
  },
  {
    id: "control-flow-tr-8",
    question: "Ek incoming `object input` ko classify karna hai — null, empty string, positive int, negative int, ya non-empty list. Ek switch expression likho jo ye sab handle kare.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Type patterns + relational patterns + property patterns combine karke ek single switch expression likha ja sakta hai.",
    detailedAnswer:
      "```csharp\nstring Classify(object? input) => input switch\n{\n    null => \"Null\",\n    int n and > 0 => $\"Positive int: {n}\",\n    int n and < 0 => $\"Negative int: {n}\",\n    int => \"Zero\",\n    string { Length: 0 } => \"Empty string\",\n    string s => $\"String: {s}\",\n    List<int> { Count: > 0 } list => $\"Non-empty list of {list.Count}\",\n    _ => \"Unrecognized\",\n};\n```\nYe example multiple pattern kinds (type, relational, logical `and`, property) ko ek switch me combine karta hai — bilkul waisa jaisa interview me deep C# pattern-matching knowledge test karne ke liye poocha jaata hai.",
  },
];

export default questions;
