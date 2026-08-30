import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rid-1",
    question: "reduce kaise kaam karta hai? Callback ke arguments aur initial value ka role batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "reduce array ko left-to-right walk karta hai aur ek accumulator carry karta hai. Callback ko (accumulator, currentItem, index, array) milte hain; har call ka return agli call ka accumulator ban jaata hai. Initial value diya to woh starting accumulator hai aur iteration index 0 se; nahi diya to array[0] accumulator ban jaata hai aur iteration index 1 se.",
    detailedAnswer:
      "reduce ek 'fold' operation hai: poore array ko ek single value mein sameta jaata hai. Har step: naya_acc = callback(acc, item, index, array). Loop khatam hone par jo acc bacha wahi result. Initial value dono behaviour aur safety change karta hai. Init ke saath: acc = init, iteration index 0 se, aur empty array pe callback chalta hi nahi — seedha init return hota hai (safe). Init ke bina: acc = array[0], iteration index 1 se (pehla element consume), aur empty array pe TypeError: 'Reduce of empty array with no initial value'. Practical rule: hamesha init do jab tak array 100% non-empty na ho, aur init ka type wahi rakho jo final result ka type hai — object banana ho to {}, Map ho to new Map(), sum ho to 0. Galat type ka init (jaise sum ke liye '') silent bugs deta hai.",
    followUp: "Init na dene se performance ya correctness ka koi fayda hota hai kya?",
    redFlag: "reduce ko sirf 'array ka sum nikalne wala method' batana — accumulator kuch bhi ho sakta hai.",
  },
  {
    id: "rid-2",
    question:
      "reduce se groupBy implement karo — ek array of people ko unke city ke hisaab se group karo.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Object accumulator lo, har person pe uske city key ka array ensure karo aur usme push karo, phir acc return karo. Init {}.",
    detailedAnswer:
      "```javascript\nfunction groupBy(items, keyFn) {\n  return items.reduce((acc, item) => {\n    const key = keyFn(item);\n    (acc[key] ??= []).push(item);\n    return acc;\n  }, {});\n}\n\ngroupBy(people, p => p.city);\n// { Mumbai: [...], Pune: [...] }\n```\n\nDhyaan dene ki cheezein: (1) `return acc` har call pe — bhoole to agli iteration undefined acc pe crash. (2) `acc[key] ??= []` pehli baar array banata hai. (3) Init `{}` — result ka type object hai. Modern JS mein yeh directly built-in hai: `Object.groupBy(people, p => p.city)` (plain object, null prototype) ya `Map.groupBy(...)` (Map, agar keys non-string ho ya order/size chahiye). Interview mein bol do ki 'production mein main Object.groupBy use karta, yeh manual version samajhne ke liye hai'.",
    followUp: "Object.groupBy aur tumhare manual version mein prototype-key ke behaviour ka koi farak hai?",
  },
  {
    id: "rid-3",
    question:
      "Yeh code kya print karega? `console.log([[1,2],[3],[4,5]].reduce((a, b) => a.concat(b)))`",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "[1, 2, 3, 4, 5]. No init hai, isliye acc = array[0] yaani [1,2], phir [1,2].concat([3]) = [1,2,3], phir .concat([4,5]) = [1,2,3,4,5].",
    detailedAnswer:
      "Init nahi diya, to accumulator pehla element [1,2] ban jaata hai aur iteration index 1 se chalti. Step 1: [1,2].concat([3]) -> [1,2,3]. Step 2: [1,2,3].concat([4,5]) -> [1,2,3,4,5]. Yeh one-level flatten ka classic reduce pattern hai. Yaha no-init isliye theek chala kyunki elements khud arrays hain aur array[0] valid accumulator hai — lekin agar top-level array khaali hota to TypeError aata. Modern code mein seedha `arr.flat()` use karo; nested-depth ke liye `arr.flat(Infinity)`.",
    followUp: "Agar [[1,2],[3],[4,5]] ke jagah [] hota to?",
  },
  {
    id: "rid-4",
    question: "reduce se kab bachna chahiye aur kyun? Ek concrete example do.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Jab per-step logic bada/branchy ho, jab multiple accumulators chahiye, jab beech mein early exit chahiye, ya jab sirf side effects karne hain. In sab cases mein for...of loop zyada readable hai.",
    detailedAnswer:
      "reduce tab shine karta hai jab fold expression chhota ho (sum, max, ek set/push call). Ulta case: ek invoice ke line-items se subtotal, taxTotal, aur grandTotal ek pass mein — teen accumulators. reduce mein ek object-accumulator `{ subtotal, taxTotal, grandTotal }` lena padta, har branch mein woh return karna, rounding rules nest karni — 'read once, understand' nahi rehta. `for (const item of items)` loop mein teen `let` bahar, seedha `+=`, clear. Doosra case: 'pehla invalid item dhoondo aur ruk jao' — reduce ruk nahi sakta, poora array traverse karega; yaha `for...of` + `break` ya `find` sahi hai. Rule of thumb: agar reduce ka callback 5+ lines ya 2+ if ho jaaye, loop pe switch karo.",
    followUp: "reduce ke andar early exit ki koshish log kaise karte hain aur woh anti-pattern kyun hai?",
    redFlag: "'reduce hamesha loop se better/faster hai kyunki functional hai' — readability aur intent zyada matter karte hain.",
  },
  {
    id: "rid-5",
    question: "reduce aur reduceRight mein kya farak hai? reduceRight kab chahiye?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "reduce array ko left-to-right (index 0 se) fold karta hai, reduceRight right-to-left (last index se). Zyada tar aggregations (sum, max, count) mein direction se farak nahi padta, par right-associative operations aur function compose mein reduceRight chahiye.",
    detailedAnswer:
      "Mechanically dono same hain — sirf traversal direction ulti. reduceRight tab matter karta hai jab operation associative nahi hai ya order semantically important hai. Classic example function composition: `compose(f, g, h)(x)` ka matlab `f(g(h(x)))` — yaani last function pehle chale. `pipe` (left-to-right) `reduce` se banta hai: `fns.reduce((val, fn) => fn(val), x)`. `compose` (right-to-left) `reduceRight` se: `fns.reduceRight((val, fn) => fn(val), x)`. Doosra example: strings ko right se concat karna, ya ek right-fold jaha aakhri element se structure build hoti hai (jaise linked list ko array se banana). String/number sum jaise commutative-associative cases mein reduce hi use karo — reduceRight sirf confusion badhayega.",
    followUp: "pipe aur compose dono ek hi reduce-family se bante hain — user ke liye behaviour mein kya farak dikhega?",
  },
];

export default questions;
