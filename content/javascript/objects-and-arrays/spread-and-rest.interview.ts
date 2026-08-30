import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sar-1",
    question: "Spread aur rest mein kya farak hai? Same `...` token dono ke liye kaise?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Token same hai, kaam opposite. Spread ek iterable ya object ko individual pieces mein expand karta hai — `[...arr]`, `{ ...obj }`, `fn(...args)`. Rest bikhre hue elements ko ek single real array/object mein collect karta hai — `function f(...args)`, `const [a, ...rest] = arr`. Pehchaan position se: value/call side = spread, binding/parameter side = rest.",
    detailedAnswer:
      "Spread 'kholta' hai: `const merged = [...a, ...b]` do arrays ke elements ek naye array mein; `const copy = { ...obj }` object ki own enumerable properties ek naye object mein; `Math.max(...nums)` array ko separate arguments mein. Kisi bhi iterable pe (string, Set, NodeList) chalta hai.\n\nRest 'sameta' hai: `function sum(...nums)` mein caller ne jitne bhi args diye woh sab `nums` naam ke ek REAL array mein aa jaate hain; `const { id, ...rest } = obj` mein `id` ke alawa baaki sab `rest` object mein. Rest hamesha last position pe, aur ek hi allowed.\n\nMental model: jab `...` kisi value ke aage value-context mein likha ho (array literal, object literal, call arguments) to spread; jab kisi binding ke aage ho (parameter list, destructuring pattern) to rest.",
    followUp: "Object spread aur array spread mein internally kya farak hai — dono kis cheez pe chalte hain?",
    redFlag: "Yeh kehna ki spread aur rest do alag operators hain — token aur mechanism ek hi hai, context alag.",
  },
  {
    id: "sar-2",
    question:
      "`const clone = { ...original }` se clone banaya. Isme kya risk hai aur kaise theek karoge?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Spread copy sirf ek level deep hai (shallow). Agar `original` ke andar nested objects/arrays hain to woh `clone` aur `original` ke beech shared rehte hain — nested ko mutate karne pe dono jagah dikhega. Fix: jis nested level ko change kar rahe ho use bhi spread karo, ya poore deep copy ke liye `structuredClone(original)`.",
    detailedAnswer:
      "`{ ...original }` `original` ki top-level properties ke values naye object mein copy karta hai. Primitive values (string, number) genuinely copy hote hain. Lekin agar value ek object/array reference hai to woh **reference** copy hota hai — dono ab same nested object point karte hain.\n\n```javascript\nconst original = { name: 'V', address: { city: 'Pune' } };\nconst clone = { ...original };\nclone.address.city = 'Mumbai';\noriginal.address.city; // 'Mumbai' -- BUG\n```\n\nFixes: (1) targeted nested spread — `{ ...original, address: { ...original.address, city: 'Mumbai' } }` (React/Redux idiom). (2) `structuredClone(original)` — built-in deep copy, Date/Map/Set/nested sab handle karta hai, functions nahi. (3) `JSON.parse(JSON.stringify(original))` — quick par Date string ban jaati hai, `undefined`/functions gayab. Interview mein bolo: 'main jitna level change karna hai utna hi spread karta hoon, ya structuredClone'.",
    followUp: "structuredClone aur JSON.parse(JSON.stringify(...)) mein kya nahi survive karta?",
  },
  {
    id: "sar-3",
    question: "`arguments` object aur rest parameters mein kya farak hai? Kaunsa prefer karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`arguments` har normal (non-arrow) function mein implicit array-jaisa object hai — array methods nahi chalte, arrow functions mein hota hi nahi, aur named params ke saath sync hota hai. Rest params `...args` ek SACHA array dete ho jise tum naam dete ho, arrow functions mein bhi chalte hain, aur clear hote hain. Hamesha rest params prefer karo.",
    detailedAnswer:
      "`arguments` legacy feature hai: `function f() { return arguments[0]; }` — array-like (length hai, index access hai) par `Array.prototype` methods nahi, to `arguments.map(...)` fail karta hai (pehle `Array.from(arguments)` karna padta tha). Arrow functions ka apna `arguments` nahi hota (woh enclosing scope ka le lete hain — aksar bug). Non-strict mode mein `arguments` named parameters ke saath live-linked hota hai — `arguments[0]` change karo to first param bhi badalta hai, confusing.\n\nRest params: `function f(...args)` — `args` ek real `Array` hai, `args.map`/`args.filter` seedha. Arrow functions mein bhi kaam karta hai: `const f = (...args) => args.length`. Explicit hai — signature dekh ke pata chalta hai function variadic hai. Partial bhi ho sakta hai: `function log(level, ...messages)`. Modern code mein `arguments` ka koi reason nahi.",
    followUp: "Arrow function mein `arguments` use karne ki koshish karo to kya hota hai?",
  },
  {
    id: "sar-4",
    question:
      "`fn(...arr)` aur `fn.apply(null, arr)` — dono array ko separate arguments banate hain. Spread kya better karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Spread cleaner syntax hai, `this` ke saath khilwaad nahi karta (apply ka pehla arg `this` set karta hai), multiple sources combine kar sakta hai `fn(...a, x, ...b)`, aur constructor ke saath bhi chalta hai `new Thing(...args)` — jo `.apply` se possible nahi tha.",
    detailedAnswer:
      "`.apply(thisArg, argsArray)` do kaam karta tha: `this` bind karna aur array ko args mein todna. Agar tumhe sirf doosra chahiye to `null`/`undefined` `thisArg` mein daalna padta tha — noise. Spread purely argument-expansion hai: `Math.max(...nums)`. Aur zyada flexible: `fn(...defaults, ...overrides, extra)` — apply mein pehle manually concat karna padta. Sabse bada: `new Date(...[2024, 0, 1])` chalta hai; `Date.apply` se `new` nahi ho sakta tha, `Reflect.construct` ka jugaad chahiye tha. Caveat dono ke liye same: agar `arr` bahut bada hai (lakhon elements) to engine ke argument-count limit se `RangeError` aa sakta hai — tab reduce/loop use karo.",
    followUp: "Bahut bade array pe Math.max(...arr) kyun fail ho sakta hai aur alternative kya hai?",
    redFlag: "Yeh kehna ki spread aur apply bilkul identical hain — apply `this` bhi set karta hai aur `new` support nahi karta.",
  },
  {
    id: "sar-5",
    question: "Spread kab use nahi karna chahiye? Do concrete scenarios batao.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "(1) Loop ke andar accumulator build karte waqt — `acc = [...acc, x]` har iteration full copy karta hai, O(n^2); `acc.push(x)` use karo. (2) Deep clone ke liye — spread shallow hai, nested shared reh jaata hai; `structuredClone` use karo. Bonus: bahut bade array ko `fn(...arr)` mein spread karna RangeError de sakta hai.",
    detailedAnswer:
      "Spread ka har use ek naya array/object banata hai — yeh cost hai. Hot path mein: `let acc = []; for (const x of items) acc = [...acc, x];` — n items, har spread O(current length), total O(n^2). 10k items pe seconds lag sakte hain. Fix: `acc.push(x)` (mutable local, koi bahar nahi dekh raha to immutability ka koi fayda nahi).\n\nDeep clone: `const copy = { ...config }` phir `copy.db.host = 'x'` original ko bhi badalta hai. `structuredClone(config)` sahi hai.\n\nArgument limit: `fn(...arrayOfMillionItems)` — V8 pe roughly 65k-500k args ke baad `RangeError`. `arr.reduce(...)` ya explicit loop use karo. Aur object spread getters ko call karta hai — agar source object ke getters mein side effects hain to `{ ...obj }` unhe trigger kar dega.",
    followUp: "Immutability important kab hai aur kab woh sirf overhead hai?",
  },
];

export default questions;
