import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "string-interp-1",
    question: "`@\"She said \"\"Hello\"\"\"` — is verbatim string ka actual content kya hoga?",
    options: [
      "She said \\\"Hello\\\"",
      "She said \"Hello\"",
      "Compile error",
      "She said Hello (quotes drop ho jaate hain)",
    ],
    correctIndex: 1,
    explanation:
      "Verbatim strings me literal double-quote ke liye `\"\"` (double double-quote) use hota hai — ye runtime pe ek single literal `\"` ban jaata hai. Isliye actual content hai: She said \"Hello\". Option A galat hai kyunki verbatim strings me `\\` escape-processing hoti hi nahi, backslash literal treat hota agar hota, jo yahan hai hi nahi.",
    difficulty: "medium",
  },
  {
    id: "string-interp-2",
    question: "String interpolation (`$\"...\"`) compile-time pe kya banti hai?",
    options: [
      "Runtime pe har baar dynamically parse hoti hai, koi compile-time transformation nahi",
      "Roughly string.Format()-equivalent call me translate hoti hai — koi extra runtime magic nahi",
      "Ek naya IL instruction jo sirf interpolation ke liye specially bana hai",
      "StringBuilder calls me automatically convert hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "Interpolation purely compile-time syntactic sugar hai — compiler ise `string.Format()` (ya simple cases me `string.Concat()`) jaisi call me translate kar deta hai. Koi special runtime interpretation ya extra overhead nahi hai. Options A, C, D sab galat premises hain.",
    difficulty: "medium",
  },
  {
    id: "string-interp-3",
    question: "Raw string literals (C# 11, `\"\"\"...\"\"\"`) verbatim strings (`@\"...\"`) se kaunse specific case me better hain?",
    options: [
      "Jab string me sirf backslashes hon, quotes nahi",
      "Jab string me quotes bhi heavily mixed hon (jaise embedded JSON) — koi \"\" escaping nahi karni padti",
      "Jab string ek line ki honi chahiye",
      "Raw strings sirf performance ke liye better hain, functionality same hai",
    ],
    correctIndex: 1,
    explanation:
      "Raw string literals ka genuine advantage tab dikhta hai jab content me double-quotes bhi heavily mixed hon (jaise JSON embed karna) — verbatim strings me har literal quote ko `\"\"` karna padta, jo readability kharab karta. Raw strings me koi quote-escaping ki zarurat nahi (jab tak khud ka content triple-quote na ho). Option C galat hai — raw strings bhi multi-line ho sakte hain, verbatim ki tarah.",
    difficulty: "hard",
  },
  {
    id: "string-interp-4",
    question: "`$\"Total: {{100}}\"` kya output karega?",
    options: [
      "Total: 100",
      "Total: {100}",
      "Runtime error",
      "Total: {{100}}",
    ],
    correctIndex: 1,
    explanation:
      "Interpolation me literal `{` ya `}` chahiye ho to unhe double karna padta hai (`{{` ek literal `{`, `}}` ek literal `}`). `{{100}}` yahan `{{` ek literal `{` deta hai, phir `100` literal text hai, phir `}}` ek literal `}` deta hai — poora output 'Total: {100}' banta hai, koi expression evaluate nahi hoti kyunki `{{`/`}}` explicitly escaped braces hain, single `{`/`}` nahi.",
    difficulty: "hard",
  },
];

export default quiz;
