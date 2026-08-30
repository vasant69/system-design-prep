import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pvr-1",
    question:
      "JavaScript mein primitive aur reference types mein kya farak hai? Copy hone ke tareeke ke saath samjhao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "7 primitives (string, number, boolean, null, undefined, symbol, bigint) value variable mein directly store hote hain aur copy-by-value hote hain. Baaki sab (object, array, function, Date, Map, Set) reference types hain — variable mein heap object ka pointer hota hai, aur assignment/argument-passing pe wo pointer copy hota hai, data nahi.",
    detailedAnswer:
      "Primitive ek simple akeli value hai jise engine chhota aur fixed-size maan ke seedha variable ke saath rakh sakta hai. `let b = a` primitive ke saath `a` ki value ki nayi copy banata hai — `a` aur `b` ab independent. Primitives immutable bhi hain: `\"abc\".toUpperCase()` naya string return karta hai, purana badalta nahi.\n\nReference type ka size unbounded ho sakta hai, isliye engine object ko heap pe rakhta hai aur variable ssirf uska address (pointer) rakhta hai. `let y = x` object ke saath sirf address copy karta hai — `x` aur `y` ek hi object point karte hain. `y.prop = 1` us shared object ko mutate karta hai aur `x.prop` mein bhi dikhta hai ('bleeding through'). Do structurally-identical objects `===` nahi hote kyunki wo do alag addresses hain.\n\nIsolation chahiye to explicitly copy: `{ ...obj }` shallow (1 level), `structuredClone(obj)` deep.",
    followUp:
      "JavaScript 'pass by value' hai ya 'pass by reference'? Precise answer do.",
    redFlag:
      "\"JavaScript pass by reference hai\" bina nuance ke. Sahi: pass by value, jaha object ke liye value uska reference hai (call by sharing) — parameter ko reassign karne se caller ka variable nahi badalta.",
  },
  {
    id: "pvr-2",
    question:
      "`const arr = [1, 2, 3]; arr.push(4);` chalta hai, par `const arr = [1,2,3]; arr = [4];` TypeError deta hai. Explain karo.",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`const` binding ko lock karta hai, value ko nahi. `arr.push(4)` wahi array mutate karta hai — binding wahi rehti hai, allowed. `arr = [4]` binding ko naye array pe point karana hai — reassignment, blocked.",
    detailedAnswer:
      "Variable ke do hisse hain: naam (binding) aur wo reference jo wo hold karta hai. `const` sirf keh raha hai 'ye naam hamesha isi reference ko point karega'. Array reference type hai, aur array khud mutable hai — `push`, `pop`, `splice`, `sort`, index assignment sab us same array ko badalte hain bina reference change kiye, isliye `const` unhe nahi rokta. `arr = [4]` ek naya array banata hai aur `arr` ko uspe point karana chahta hai — yahi reassignment hai jo `const` block karta hai. Immutability chahiye to `Object.freeze(arr)` (shallow) ya na-mutate discipline.",
    followUp: "Object.freeze shallow kyun hai? Nested freeze kaise karoge?",
  },
  {
    id: "pvr-3",
    question:
      "`let x = { a: { b: 1 } }; let y = { ...x }; y.a.b = 99; console.log(x.a.b);` — output kya aur kyun?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "99. Spread shallow copy hai — `y` ek naya top-level object hai, par `y.a` aur `x.a` abhi bhi same nested object ka reference share karte hain. `y.a.b = 99` us shared nested object ko badalta hai.",
    detailedAnswer:
      "`{ ...x }` `x` ki apni-apni (own enumerable) properties ko naye object mein copy karta hai. `a` ki value ek object reference hai, to wo reference copy hota hai — deep clone nahi hota. Result: `x.a === y.a` `true`. Isliye `y.a.b = 99` dono mein dikhta hai. Agar `x` ki koi top-level primitive property hoti (`x.name`), uski copy independent hoti. Deep copy ke liye:\n\n```javascript\nconst y = structuredClone(x);\n// ya nested spread: { ...x, a: { ...x.a } }\n```\n\nYe bug React state updates mein bahut common hai — log top-level spread karte hain aur nested object ko galti se mutate kar dete hain.",
    followUp:
      "structuredClone kis cheez ko clone nahi kar sakta? (hint: functions, DOM nodes)",
  },
  {
    id: "pvr-4",
    question:
      "React mein 'don't mutate state' rule ka reference-types se kya connection hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "React re-render decide karne ke liye purane aur naye state ka reference compare (shallow) karta hai. Agar tum `state.items.push(x)` karke same reference `setState` karte ho, React ko same reference dikhta hai aur re-render skip kar deta hai — UI stale reh jaata hai.",
    detailedAnswer:
      "React (aur Redux, aur `React.memo`, `useMemo`) performance ke liye `Object.is`-style shallow comparison karte hain: 'kya prevState aur nextState ka reference same hai?' Agar haan, wo maan lete hain kuch nahi badla aur render skip kar dete hain. Mutation (`push`, direct property set) reference ko badalta nahi, sirf andar ka data — to React ko change dikhta hi nahi.\n\nSahi pattern: har badalne wale level pe naya object/array banao:\n\n```javascript\nsetState(prev => ({\n  ...prev,\n  items: [...prev.items, newItem],\n}));\n```\n\nAb `items` ka bhi naya reference hai, `prev` object ka bhi — React difference detect karta hai aur re-render karta hai. Ye immutability ka discipline reference semantics ki wajah se zaroori hai.",
    followUp:
      "Agar deeply nested state hai to har level spread karna padega — iska behtar solution kya hai? (hint: Immer, ya state normalize karna)",
  },
  {
    id: "pvr-5",
    question:
      "`[] === []` aur `NaN === NaN` — dono kya dete hain aur kyun different reasons se?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Dono `false`. `[] === []` false kyunki do alag array objects, do alag references. `NaN === NaN` false kyunki IEEE-754 spec kehta hai NaN kisi bhi cheez ke barabar nahi, khud ke bhi nahi.",
    detailedAnswer:
      "`[] === []` — arrays reference types hain, `===` reference identity compare karta hai. Do alag `[]` literals = do alag heap objects = `false`. Content compare karna ho to manual loop ya `JSON.stringify`.\n\n`NaN === NaN` — `NaN` ek primitive number value hai, to yaha reference ki baat nahi. Ye `false` isliye hai kyunki floating-point standard (IEEE-754) explicitly kehta hai NaN unordered hai aur kisi comparison mein equal nahi, including khud se. Isi wajah se `Number.isNaN(x)` ya `Object.is(x, NaN)` use karte hain check karne ke liye. `Object.is([], [])` bhi `false` (reference), par `Object.is(NaN, NaN)` `true` — ye special-case handle karta hai.",
    followUp:
      "Do arrays ka content compare karne ka sabse reliable tarika kya hai?",
  },
];

export default questions;
