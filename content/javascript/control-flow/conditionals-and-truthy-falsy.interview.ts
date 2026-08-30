import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ctf-1",
    question: "JavaScript mein kaun si values falsy hain? Poori list do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Exactly 8: false, 0, -0, 0n (BigInt zero), \"\" (empty string), null, undefined, aur NaN. Baaki literally sab truthy hai — including \"0\", \"false\", \" \", [] aur {}.",
    detailedAnswer:
      "`if` condition ko JS pehle ToBoolean se coerce karta hai. Falsy list fixed hai aur chhoti: `false`, number `0` aur `-0`, BigInt `0n`, empty string `\"\"`, `null`, `undefined`, aur `NaN`. Iske alawa har value truthy hai. Sabse zyada log yahan galti karte hain: non-empty string `\"0\"` aur `\"false\"` truthy hain, ek space `\" \"` truthy hai, aur empty array `[]` aur empty object `{}` truthy hain kyunki wo objects hain — unka content check nahi hota. Isliye `if (arr)` kabhi 'array khaali hai' nahi batata; us ke liye `arr.length === 0` chahiye.",
    followUp: "typeof NaN kya hai, aur NaN ko check kaise karoge?",
    redFlag: "\"Empty array aur empty object falsy hote hain\" — bahut common galti, dono truthy hain.",
  },
  {
    id: "ctf-2",
    question: "`if (!count)` se 'count nahi mila' check karna kyun galat ho sakta hai? Sahi kaise likhoge?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "0 falsy hai, to legitimate zero ('0 items') bhi 'missing' branch mein chala jaata hai. Jab matlab sirf 'null ya undefined' ho to `count == null` ya `count === undefined` use karo.",
    detailedAnswer:
      "`!count` `count` ko boolean bana ke ulta karta hai. `0` ek valid quantity ho sakti hai (cart mein 0 items, page 0, temperature 0) par wo falsy hai — to `if (!count)` use `undefined`/`null` ki tarah treat kar deta hai. Yahi bug strings ke saath: `if (!name)` empty string `\"\"` ko 'missing' maan leta hai jabki user ne shayad jaan-boojh ke blank chhoda. Fix: jab specifically null-or-undefined check karna ho, `if (count == null)` likho — loose equality yahan idiomatic hai, ye sirf `null` aur `undefined` match karti hai aur `0`/`\"\"`/`false`/`NaN` ko nahi. Agar 0 aur missing dono handle karne hain to alag branches: `if (count === undefined) ... else if (count === 0) ...`.",
    followUp: "`== null` aur `=== null` mein kya farak hai?",
  },
  {
    id: "ctf-3",
    question: "React mein `{items.length && <List items={items} />}` — items khaali ho to screen pe kya aata hai aur kyun?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Screen pe literal 0 render hota hai. `items.length` `0` hai, `0 && anything` `0` return karta hai (short-circuit), aur React `0` ko renderable text ki tarah dikhata hai — null/undefined/false ko skip karta hai par 0 ko nahi.",
    detailedAnswer:
      "`&&` boolean nahi, apna ek operand return karta hai: `a && b` = `a` agar `a` falsy, warna `b`. Jab `items.length` `0` hai, `0 && <List/>` `0` hi return karta hai. React rendering rules: `null`, `undefined`, `false`, aur `true` render nahi hote, par `0` ek valid number child hai — to UI mein akela `0` dikh jaata hai. Fix ke do saaf tarike:\n\n```jsx\n{items.length > 0 && <List items={items} />}\n{items.length ? <List items={items} /> : null}\n```\n\nPehla `&&` ke left side ko genuine boolean bana deta hai; dusra ternary se explicitly `null` deta hai jab khaali ho.",
    followUp: "`items.length ? ... : null` aur `items.length > 0 && ...` mein se production code mein kaunsa prefer karoge?",
    redFlag: "\"React 0 ko ignore kar deta hai\" — nahi, React sirf null/undefined/false/true ignore karta hai, 0 aur \"\" render hote hain.",
  },
  {
    id: "ctf-4",
    question: "Strings pe `<` aur `>` kaise compare hote hain? `\"10\" < \"9\"` ka result?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Lexicographic — character-by-character, har char ke Unicode code point pe. `\"10\" < \"9\"` `true` hai kyunki pehla char `\"1\"` (code 49) `\"9\"` (code 57) se chhota hai. Number comparison `10 < 9` `false` hota.",
    detailedAnswer:
      "Jab dono operands strings hon, JS pehla-character se compare karta hai; agar barabar hon to agla character, aur aise aage. Comparison har char ke UTF-16 code unit pe hota hai. Isliye `\"apple\" < \"banana\"` `true` (`a` < `b`), lekin `\"Z\" < \"a\"` bhi `true` kyunki uppercase A-Z (65-90) lowercase a-z (97-122) se pehle aate hain. `\"10\" < \"9\"`: sirf pehle char dekhe jaate hain — `\"1\"` vs `\"9\"` — `\"1\"` chhota, to poora `true`. Agar ek operand number ho (`\"10\" < 9`) to string number mein coerce hota hai aur `10 < 9` `false`. Practical takeaway: numeric data ko compare karne se pehle `Number()` se convert karo, warna string sort/compare galat order dega.",
    followUp: "Array.prototype.sort() default mein numbers ko galat kyun sort karta hai?",
  },
  {
    id: "ctf-5",
    question: "Nested if ki jagah guard clauses kyun better hote hain? Ek example dikhao.",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Guard clauses bura case pehle nikaal dete hain (turant return/throw), jisse happy-path code nested nahi hota — left margin pe seedha rehta hai aur `else` ki zaroorat khatam. Deep nesting padhna aur modify karna mushkil hota hai.",
    detailedAnswer:
      "Nested version har precondition ko ek aur `if` level deta hai:\n\n```javascript\nfunction processOrder(order) {\n  if (order) {\n    if (order.items.length > 0) {\n      if (order.paid) {\n        // asli kaam, 3 levels andar\n      }\n    }\n  }\n}\n```\n\nGuard clause version:\n\n```javascript\nfunction processOrder(order) {\n  if (!order) return;\n  if (order.items.length === 0) return;\n  if (!order.paid) return;\n  // asli kaam, 0 levels andar\n}\n```\n\nFayde: (1) har failure case apni ek line pe explicit hai, (2) happy path indentation ke bina flat hai, (3) naya check add karna = ek line, poore block ko re-indent nahi karna. Yahi pattern loops mein `continue` se aur error handling mein early `throw` se banta hai.",
    followUp: "Kya guard clause ka matlab hai ki function mein multiple return statements OK hain? Kuch style guides single-return kehte hain.",
  },
];

export default questions;
