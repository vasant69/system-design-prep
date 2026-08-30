import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "template-literals-1",
    question: "`const x = 5; console.log('value is ${x}');` (single quotes) — kya print hota hai?",
    options: [
      "value is 5",
      "value is ${x} — literally, kyunki interpolation sirf backticks ke andar kaam karta hai",
      "SyntaxError",
      "value is undefined",
    ],
    correctIndex: 1,
    explanation:
      "`${...}` interpolation sirf backtick (template literal) strings ke andar evaluate hota hai. Single ya double quotes ke andar wo bas literal characters hain — koi error nahi, bas galat output: `value is ${x}`. Ye ek common silent bug hai; `prefer-template` / template-literal lint rules isse pakadte hain. Sahi: backticks use karo.",
    difficulty: "easy",
  },
  {
    id: "template-literals-2",
    question: "`${...}` ke andar kya daal sakte ho?",
    options: [
      "Sirf ek variable ka naam",
      "Koi bhi expression jo value return kare — ternary, function call, arithmetic, method chain — par statements (if/for) nahi",
      "Koi bhi JavaScript code, if aur for loops bhi",
      "Sirf strings aur numbers, objects nahi",
    ],
    correctIndex: 1,
    explanation:
      "`${}` ke andar ek **expression** hona chahiye — kuch jo evaluate hoke ek value de: `${a + b}`, `${x ? 'y' : 'z'}`, `${arr.map(f).join(',')}`, `${new Date().getFullYear()}`. Statements — `if`, `for`, `let` declarations — allowed nahi (unke liye ternary ya pehle se compute kiya variable). Option A galat — sirf variable se zyada allowed hai. Option C galat — statements nahi chalte.",
    difficulty: "easy",
  },
  {
    id: "template-literals-3",
    question: "Tagged template `` tag`Hi ${a} and ${b}` `` mein `tag` function ko kya arguments milte hain?",
    options: [
      "Ek hi string: 'Hi 5 and 10' (already interpolated)",
      "`strings` array (static parts, jaise ['Hi ', ' and ', '']) aur uske baad har `${}` value alag argument (`...values`)",
      "Sirf values ka array [a, b]",
      "Kuch nahi — tag ko manually string parse karni padti hai",
    ],
    correctIndex: 1,
    explanation:
      "Tag function ka signature `tag(strings, ...values)` hota hai: `strings` static text ke tukdon ka array (`['Hi ', ' and ', '']`), aur `values` har `${}` ka evaluated result. `strings.length` hamesha `values.length + 1` hota hai. Tag decide karta hai final output kaise bane (string hona bhi zaroori nahi). Yahi mechanism styled-components, graphql-tag, aur SQL/HTML escapers use karte hain. Option A galat — tag ko parts alag milte hain, taaki wo values ko process kar sake.",
    difficulty: "medium",
  },
  {
    id: "template-literals-4",
    question: "Ek template literal se banayi hui HTML string ko element.innerHTML pe set kiya jaata hai, jisme user ka input interpolate hua hai. Kya risk hai?",
    options: [
      "Koi risk nahi, template literals automatically escape karte hain",
      "XSS — agar user input mein ek script tag ya onerror attribute ho to wo execute ho jaata hai; interpolation raw text daalta hai, escape nahi karta",
      "SyntaxError kyunki HTML backticks mein allowed nahi",
      "Performance issue kyunki innerHTML slow hai",
    ],
    correctIndex: 1,
    explanation:
      "Template literal interpolation value ko as-is string mein daalta hai — koi escaping nahi. innerHTML ke saath, malicious user input (jaise ek image tag with onerror handler) execute ho jaata hai = XSS. Fix: textContent use karo (auto-escapes), React JSX (auto-escapes), ya ek escaper tagged template jo sirf interpolated values ko sanitize kare. Static markup interpolate karna theek hai — problem untrusted dynamic value hai.",
    difficulty: "medium",
  },
];

export default quiz;
