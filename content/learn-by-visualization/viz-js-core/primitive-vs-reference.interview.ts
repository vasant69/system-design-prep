import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pvr-1",
    question: "Primitive aur reference types mein farak kya hai? JS mein kaunse primitive hote hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Primitives (string, number, boolean, null, undefined, symbol, bigint) immutable hain aur value se copy hote hain. Reference types (object, array, function) heap par rehte hain; variable sirf pointer rakhta hai, to copy karne par dono variable ek hi object share karte hain.",
    detailedAnswer:
      "Primitive assign karne par ek independent duplicate banta hai — `b = a` ke baad `a` aur `b` ka koi link nahi. Object assign karne par sirf address copy hota hai — `y = x` ke baad `x` aur `y` same object par point karte hain, `y.n = 42` `x.n` ko bhi badal deta hai. Yehi function arguments par bhi lagoo hota hai: primitive pass karo to function ek copy ke saath khelta hai; object pass karo to function tumhaare object ko mutate kar sakta hai. `===` primitives ko value se, objects ko identity (same reference?) se compare karta hai.",
    followUp: "`typeof null` kya deta hai, aur wo primitive hai ya nahi?",
    redFlag: "\"Objects bhi value se copy hote hain, bas thoda slow\" — nahi, sirf reference (pointer) copy hota hai.",
  },
  {
    id: "pvr-2",
    question:
      "`function f(o, s) { o.x = 1; s = 'x'; } const obj = {}; let str = ''; f(obj, str); console.log(obj.x, str);` — output aur wajah?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`1 ''`. `obj` ke through pointer gaya, to `o.x = 1` real object ko mutate karta hai. `str` primitive tha — `s` uski copy; `s = 'x'` sirf local parameter badalta hai, bahar `str` waisa hi.",
    detailedAnswer:
      "JS hamesha 'pass by value' hai, par object ke case mein wo 'value' ek reference (pointer) hoti hai. `o` aur `obj` dono same heap object par point karte hain — property mutation (`o.x = 1`) bahar dikhta hai. Lekin `o = {...}` (parameter ko reassign) bahar nahi dikhta, kyunki wo sirf local `o` ko naye object par point karata. Primitive `s` toh poori tarah copy hai — uspe kuch bhi karo, `str` untouched.",
    followUp: "Agar function ke andar `o = { x: 99 }` likh dein to bahar `obj` par kya asar?",
  },
  {
    id: "pvr-3",
    question:
      "Ek function ko object pass kar rahe ho par nahi chahte wo use mutate kare. Kya options hain?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Shallow copy pass karo (`{ ...obj }` / `structuredClone(obj)` for deep), ya `Object.freeze(obj)` se mutation silently/loudly block karo, ya defensive copy function ke andar banao. Best long-term: immutable data patterns aur clear ownership.",
    detailedAnswer:
      "`{ ...obj }` / `Object.assign({}, obj)` ek level copy karte hain — nested objects abhi bhi shared hain. Deep isolation ke liye `structuredClone(obj)` (modern, functions/DOM nahi handle karta) ya JSON round-trip (`JSON.parse(JSON.stringify(obj))`, jo `Date`/`undefined`/`Map` khota hai). `Object.freeze` object ko read-only banata hai (strict mode mein write par error, warna silent no-op) par wo bhi shallow hai. Team scale par sabse saaf: har layer apna data khud own kare aur mutate karne ke bajaye naya object return kare (`return { ...state, x: 1 }`).",
    followUp: "`structuredClone` aur `JSON.parse(JSON.stringify(...))` mein kya-kya farak hai?",
  },
  {
    id: "pvr-4",
    question:
      "Do arrays ke liye `a === b` `true` aaya. Iska kya matlab hai — kya wo 'same' hain? Content-wise equal kaise check karoge?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`a === b` `true` ka matlab dono variable EXACT same array object par point karte hain (same reference), na ki 'inke elements same hain'. Content compare karne ke liye manual loop, `JSON.stringify` (order-sensitive, shallow-ish), ya lodash `isEqual` chahiye.",
    detailedAnswer:
      "`===` reference types ke liye identity check hai. `[1,2] === [1,2]` hamesha `false` (do alag objects). `true` sirf tab jab dono naam literally ek hi object hain (`const b = a`). 'Deep equal' JS mein built-in nahi: chhote flat cases ke liye `a.length === b.length && a.every((v, i) => v === b[i])`; general case ke liye recursive compare ya `lodash.isEqual` / `node:util` ka `isDeepStrictEqual`. `JSON.stringify(a) === JSON.stringify(b)` kaam chala deta hai par key-order, `undefined`, `NaN`, circular refs par tootta hai.",
    followUp: "`Object.is(NaN, NaN)` `===` se kaise alag hai?",
  },
];

export default questions;
