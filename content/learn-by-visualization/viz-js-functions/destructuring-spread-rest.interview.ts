import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dsr-1",
    question: "Spread aur rest dono `...` hain — inhe distinguish kaise karte ho?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Position se. `...` giving/reading context mein (function call args, array literal, object literal) = spread, jo ek cheez ko kai mein expand karta hai. `...` receiving context mein (destructuring pattern ka left side, function parameter list) = rest, jo kai cheezein ek array/object mein collect karta hai.",
    detailedAnswer:
      "Spread examples: fn(...args), [...a, ...b], { ...o1, ...o2 } — yahan ... existing collection ko 'khol' raha hai. Rest examples: const [head, ...tail] = arr, function f(a, ...others) {}, const { id, ...others } = obj — yahan ... 'jo bacha usse ek array/object bana do'. Thumb rule: agar ... ke aage tum data DE rahe ho to spread; agar tum data LE rahe ho to rest. Rest hamesha last position pe hota hai.",
    followUp: "Rest element ke baad koi aur element kyun nahi aa sakta?",
    redFlag: "\"Spread aur rest alag operators hain\" — same syntax hai, context se role decide hota hai.",
  },
  {
    id: "dsr-2",
    question: "`const { a = 1, b = a * 2 } = { a: 5 };` — a aur b kya honge?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "a = 5 (property maujood hai, default skip), b = 10 (b missing hai, to default a * 2 chala aur us waqt tak a = 5 ho chuka tha). Defaults left-to-right evaluate hote hain aur pehle bind hue names ko dekh sakte hain.",
    detailedAnswer:
      "Destructuring defaults sirf undefined pe lagti hain. Yahan a di gayi hai (5), to uska default 1 use nahi hua. b di hi nahi gayi, to b = a * 2 chala — aur kyunki a pehle process ho chuka tha, b = 10. Agar order ulta hota ({ b = a * 2, a = 1 }) to b ke waqt a abhi TDZ mein hota aur ReferenceError aata.",
    followUp: "Nested destructuring mein parent object hi missing ho to kya hota hai?",
  },
  {
    id: "dsr-3",
    question:
      "Interviewer: '`{ ...obj }` deep copy hai kya?' — jawab aur ek failing example.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi, shallow hai. Sirf top-level keys copy hoti hain; koi bhi nested object/array value reference se copy hoti hai, to naya aur purana dono same nested object share karte hain.",
    detailedAnswer:
      "const a = { p: { n: 1 } }; const b = { ...a }; b.p.n = 99; ab a.p.n bhi 99 — kyunki b.p aur a.p ek hi object hain. Yahi Object.assign({}, a) ke saath bhi hota hai. Deep copy chahiye to structuredClone(a) (modern, Date/Map/Set/cycles handle karta hai), ya har level recursively spread, ya JSON.parse(JSON.stringify(a)) (functions, undefined, Date, BigInt pe fail karta hai).",
    followUp: "structuredClone kin cheezon ko clone nahi kar sakta?",
  },
  {
    id: "dsr-4",
    question:
      "Destructuring ka function parameters mein sabse acha use kya hai — options-object pattern samjhao.",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Positional args (fn(true, false, 10, null)) ki jagah ek options object leke usse destructure karo with defaults: function createUser({ name, isAdmin = false, retries = 3 } = {}) {}. Call site self-documenting ho jaata hai aur arg order matter nahi karta.",
    detailedAnswer:
      "function connect({ host = 'localhost', port = 5432, ssl = false } = {}) {} — caller connect({ port: 6000 }) likhta hai, baaki defaults. Fayde: (1) arguments named hain, boolean-trap nahi; (2) naya option add karna backward-compatible; (3) = {} fallback taaki bina args call bhi na phate. Nuksaan: har call ek chhota object allocate karta hai (hot loop mein dhyaan), aur bahut nested destructuring signature ko unreadable bana deta hai.",
    followUp: "= {} default na do to connect() call pe kaunsa error aata hai?",
  },
];

export default questions;
