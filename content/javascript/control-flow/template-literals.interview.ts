import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "tl-1",
    question: "Template literals string concatenation ke muqable kya extra dete hain? Teen cheezein.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "(1) Interpolation — dollar-brace expression syntax mein koi bhi expression, + aur quote-juggling ke bina. (2) Native multiline strings bina backslash-n. (3) Tagged templates — literal ke aage ek function jo static parts aur interpolated values alag-alag receive karke custom output banata hai.",
    detailedAnswer:
      "```javascript\n// concat\nconst s = 'Hi, ' + name + '! You have ' + count + ' messages.';\n// template literal\nconst s = `Hi, ${name}! You have ${count} messages.`;\n```\n\nInterpolation ke andar sirf variable nahi — arithmetic, ternary, method chains sab valid (expressions, statements nahi). Multiline: backticks ke andar newline literally string mein aata hai — SQL, HTML fragments, help text likhne ke liye. Tagged templates advanced feature hai: literal ke aage ek function naam likho aur use (strings, ...values) milta hai aur wo output control karta hai — styled-components, graphql-tag, aur SQL/HTML escapers isi pe bane hain.",
    followUp: "Interpolation ke andar statement (if/for) kyun nahi daal sakte, aur uska workaround kya hai?",
    redFlag: "\"Template literals bas + ka shortcut hain\" — tagged templates aur multiline miss kar rahe ho.",
  },
  {
    id: "tl-2",
    question: "Tagged template kya hai? Tag function ko exactly kya arguments milte hain, aur ek real use case batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Literal ke theek pehle (bina parentheses) likha function. Use (strings, ...values) milta hai: strings = static text ke tukdon ka array, values = har placeholder ka evaluated result. strings.length hamesha values.length + 1. Use case: styled-components, GraphQL gql, SQL/HTML escapers.",
    detailedAnswer:
      "```javascript\nfunction tag(strings, ...values) {\n  // strings = ['Sum of ', ' and ', ' is ', '.']\n  // values  = [5, 10, 15]\n}\nconst a = 5, b = 10;\ntag`Sum of ${a} and ${b} is ${a + b}.`;\n```\n\nTag ko pehle-se-joda hua string nahi milta — use parts alag milte hain, isliye wo dynamic values ko process kar sakta hai (escape, parameterize, transform) static text ko chhue bina. Real: styled-components ka styled.button tagged template CSS static parts aur functions ko alag rakh ke render time pe props ke saath resolve karta hai. Ek sql tagged template user value ko literal daalne ke bajaye parameterized query banata hai (SQL injection se bachav). strings.raw property bhi hoti hai — escape sequences un-processed (String.raw isko use karta hai).",
    followUp: "styled-components ka tag function props kaise access karta hai jab literal define hote waqt props hote hi nahi?",
  },
  {
    id: "tl-3",
    question: "Ek developer ne single quotes mein 'Total: ' likh ke usme placeholder syntax daala aur expect kiya value insert ho — nahi hui. Kyun?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Single quotes use kiye, backticks nahi. Interpolation sirf template literals (backticks) ke andar evaluate hota hai — quotes ke andar wo literal text hai. Koi error nahi aata, isliye ye silent bug hai.",
    detailedAnswer:
      "Placeholder interpolation ek template-literal-only syntax hai. Single ya double quotes ke andar dollar, brace aur close-brace bas normal characters hain, to string literally jaise likhi hai waisi hi rehti hai. Koi SyntaxError nahi — isliye ye tab tak pakda nahi jaata jab tak koi output dekhe. Fix: backticks. Prevention: ESLint prefer-template rule (concat ko template literal banata hai) aur editor syntax highlighting jo interpolation ko quotes ke andar highlight nahi karti — dono is galti ko surface karte hain. Ye code review mein bhi common catch hai.",
    followUp: "prefer-template ESLint rule exactly kya enforce karta hai?",
    redFlag: "\"Placeholder syntax har string mein kaam karta hai\" — sirf backticks mein.",
  },
  {
    id: "tl-4",
    question: "User input ko template literal se HTML mein interpolate karna kab khatarnak hai? Safe alternatives?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Jab result innerHTML mein jaaye. Interpolation raw text daalta hai, escape nahi karta — agar userInput mein ek script tag ya onerror attribute ho to XSS. Safe: textContent (auto-escape), React JSX (auto-escape), ya escaper tagged template jo sirf values sanitize kare.",
    detailedAnswer:
      "Template literal interpolation value ko literally string mein daalta hai — koi HTML-escaping nahi. Jab wo string innerHTML / outerHTML / insertAdjacentHTML mein jaati hai, browser use markup ki tarah parse karta hai, to ek image tag with onerror handler execute ho jaata hai. Static markup interpolate karna theek hai — risk sirf untrusted dynamic value pe hai. Options:\n\n1. el.textContent = userInput — text ke roop mein set, koi parsing nahi.\n2. React/Vue/Svelte — JSX/template expressions auto-escape hote hain.\n3. Escaper tagged template — static parts as-is chhode aur sirf interpolated values ko HTML entities (ampersand-lt, ampersand-gt) mein convert kare.\n4. DOMPurify — jab genuinely rich HTML allow karna ho.\n\nSQL mein bhi yahi — id ko seedha interpolate karna injection hai; parameterized query ya sql tag use karo.",
    followUp: "Ek escaper tagged template kaise likhoge jo strings ko chhode par values escape kare?",
  },
  {
    id: "tl-5",
    question: "Multiline template literal use karte waqt kaunsa common surprise hota hai, aur usse kaise handle karte ho?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Backticks ke andar jo bhi whitespace/newline likha hai — leading indentation bhi — wo literally string ka hissa ban jaata hai. Ek indented code block mein likha multiline literal expected se zyada spaces le aata hai. Fix: .trim(), ya ek dedent helper.",
    detailedAnswer:
      "```javascript\nfunction build(title) {\n  const html = `\n    <div>\n      <h1>${title}</h1>\n    </div>\n  `;\n  return html;\n}\n```\n\nYahaan html ki shuruaat mein ek newline aur 4 spaces hain, har line pe function ki indentation bhi, aur end pe newline aur 2 spaces. Agar tum ise strict-equality se compare kar rahe ho ya ek pre element mein daal rahe ho to ye whitespace matter karta hai. Handling:\n\n- .trim() — leading/trailing whitespace hata deta hai (beech ki indentation rehti hai).\n- Dedent library (dedent, common-tags ka stripIndent) — har line se common leading indentation hata deta hai.\n- Literal ko left margin pe (indentation ke bina) likhna — readability kharab karta hai.\n\nString concat ya array join mein ye problem nahi hoti par wo kam readable hai.",
    followUp: "Ek tagged template se dedent kaise implement karoge?",
  },
];

export default questions;
