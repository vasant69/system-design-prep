import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sws-1",
    question: "switch mein fall-through kya hai? Ek example do jahan wo galti se bug banta hai aur ek jahan wo deliberate hota hai.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Matching case se code chalna shuru hota hai aur `break`/`return` tak rukta nahi — agle cases bhi chal jaate hain. Bug: ek case mein code hai par `break` bhoola. Deliberate: empty cases stack karke group karna (`case 'Sat': case 'Sun': return 'weekend'`).",
    detailedAnswer:
      "`switch` matching case pe 'entry point' set karta hai, 'exit' nahi — exit sirf `break`, `return`, `throw`, ya switch ke end pe hota hai. Accidental:\n\n```javascript\nswitch (role) {\n  case 'admin':\n    grantAdmin();   // break bhool gaye\n  case 'user':\n    grantUser();     // admin ko bhi mil gaya!\n}\n```\n\nDeliberate grouping:\n\n```javascript\nswitch (day) {\n  case 'Sat':\n  case 'Sun':\n    return 'weekend';\n  default:\n    return 'weekday';\n}\n```\n\n`'Sat'` case khaali hai to `'Sun'` mein gir jaata hai — dono ek hi return. ESLint `no-fallthrough` empty cases allow karta hai par code-wali case ke baad missing `break` ko error deta hai (jab tak `// falls through` comment na ho).",
    followUp: "Function ke andar switch ho to break ki jagah kya use karoge aur kyun?",
    redFlag: "\"switch har case ke baad automatically ruk jaata hai\" — nahi, explicitly break/return chahiye.",
  },
  {
    id: "sws-2",
    question: "switch cases kis equality se compare hote hain — == ya ===? Iska practical asar kya hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Strict `===`. Koi type coercion nahi — `switch (1)` `case '1':` ko match nahi karega. Isliye number/string input ko pehle align karna padta hai (`String(x)` ya `Number(x)`).",
    detailedAnswer:
      "Spec ke mutabik `switch` har `case` expression ko switch value ke saath `===` se check karta hai. `if`/`else if` mein tum `==` likh sakte ho par `switch` mein choice nahi. Real-world impact: form inputs, URL params, `dataset` attributes — sab strings hote hain. Agar tum `switch (Number(event.target.value))` bhool jao aur `case 1:` (number) likho, to kuch match nahi hoga aur silently `default` chala jayega. Do fixes: switch value ko normalize karo (`switch (String(x))`), ya case labels ko input ke type se match karao.",
    followUp: "NaN ke saath switch kaise behave karta hai? `switch (NaN) { case NaN: ... }`",
  },
  {
    id: "sws-3",
    question: "switch, if-else chain, aur object lookup table — teeno mein se kis situation mein kaun sa choose karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "switch: ek variable ke 3+ exact-match branches jinme real logic ho (reducer). Object/Map lookup: ek value ko doosri value ya handler pe map karna, ya dynamic keys. if-else: range conditions ya multiple variables.",
    detailedAnswer:
      "Decision:\n\n1. Conditions ranges hain (`score > 90`) ya ek se zyada variable involve hai -> `if / else if`. `switch` sirf `===` karta hai, ranges express nahi kar sakta.\n2. Har branch bas 'ek value ya function return' karti hai -> lookup object: `const MAP = { a: 'A', b: 'B' }; MAP[key] ?? fallback`. Ek line, test aasan, keys config/plugin se aa sakti hain, cases add karna trivial.\n3. Har branch mein multi-step logic hai aur 3+ discrete cases hain -> `switch` (jaise `useReducer`/Redux reducer). `return` use karo `break` ke bajaye.\n4. Sirf 2 branches -> plain `if` ya ternary.\n\nExtra: agar branches badi ho ke alag modules/classes ban jaayein, strategy pattern ya polymorphism. TypeScript mein `ts-pattern` exhaustive matching deta hai.",
    followUp: "Redux reducer mein switch itna common kyun hai, wahan lookup object kyun nahi use karte?",
  },
  {
    id: "sws-4",
    question: "`switch` ke ek case ke andar `let` ya `const` declare karne pe SyntaxError kyun aa sakta hai? Kaise fix karoge?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Saare cases ek single block scope share karte hain, to do cases mein same naam se `const`/`let` = duplicate declaration. Fix: jis case body mein declaration ho use apne `{ }` block mein wrap karo.",
    detailedAnswer:
      "```javascript\nswitch (type) {\n  case 'a':\n    const result = computeA();  // scope = poora switch block\n    return result;\n  case 'b':\n    const result = computeB();  // SyntaxError: 'result' already declared\n    return result;\n}\n```\n\n`case` labels naya scope nahi banate — wo bas jump targets hain. Fix har aisi case ko block deke:\n\n```javascript\nswitch (type) {\n  case 'a': {\n    const result = computeA();\n    return result;\n  }\n  case 'b': {\n    const result = computeB();\n    return result;\n  }\n}\n```\n\nAb har `{ }` ka apna scope hai, `result` clash nahi karta. Ye tab bhi zaroori hai jab TDZ ki wajah se ek case ka `const` doosre case ke code se accidentally accessible ho jaaye.",
    followUp: "case labels naya scope kyun nahi banate — spec mein wo kya hote hain?",
  },
  {
    id: "sws-5",
    question: "Ek 25-line switch jo har case mein sirf `return someString` karta hai — is code review mein tum kya suggest karoge?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Ise ek lookup object/Map se replace karo: `const MAP = { key1: 'val1', ... }; return MAP[key] ?? fallback`. Pure value-to-value mapping data hai, control flow nahi — 25 lines 4-5 ban jaati hain aur extend/test karna aasan.",
    detailedAnswer:
      "Jab har `case` ka body sirf `return <constant>` ho, `switch` ka koi control-flow faayda nahi — sirf boilerplate hai. Object literal:\n\n```javascript\nconst STATUS_LABELS = {\n  pending: 'In progress',\n  shipped: 'On the way',\n  delivered: 'Complete',\n};\nfunction label(status) {\n  return STATUS_LABELS[status] ?? 'Unknown';\n}\n```\n\nFaayde: (1) mapping ek jagah, data ki tarah, JSON se aa sakti hai; (2) `Object.keys(STATUS_LABELS)` se saare valid statuses mil jaate hain; (3) naya status = ek line; (4) unit test = ek object comparison. `switch` tab rakho jab kisi case mein multi-step logic ho, ya `default` ke alawa complex flow (multiple throws, early returns) ho. Handlers ke liye `Map` bhi option hai jab keys non-string ya dynamic hon.",
    followUp: "Lookup object ke saath 'prototype pollution' ka risk kaise avoid karoge jab key user input se aaye?",
  },
];

export default questions;
