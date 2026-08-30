import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "obj-iter-1",
    question: "Ek object ki keys pe loop karne ke kitne tareeke hain? Kaunsa prefer karte ho aur kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`for...in`, aur `Object.keys / values / entries` ke saath `for...of` ya `.forEach`. Main `for (const [k, v] of Object.entries(obj))` prefer karta hoon — own-only, enumerable-only, predictable order, aur destructuring readable hai. `for...in` prototype chain walk karta hai.",
    detailedAnswer:
      "`for...in` object ki own + inherited enumerable string keys deta hai — isliye agar kisi ne prototype pollute kiya to extra keys aa jati hain aur har iteration mein `if (Object.hasOwn(obj, k))` guard chahiye. `Object.keys(obj)` (ES5) sirf own enumerable string keys ka array deta hai; `Object.values` values ka; `Object.entries` `[key, value]` pairs ka. Inpe `for...of` chalao — `break`/`continue` kaam karte hain, aur `for (const [k, v] of Object.entries(obj))` sabse clean hai. Symbol keys chahiye to `Reflect.ownKeys`; non-enumerable bhi chahiye to `Object.getOwnPropertyNames`.",
    followUp: "`Object.entries` ke pairs kis order mein aate hain?",
    redFlag: "\"for...in default hai\" — plain objects pe wo prototype leak deta hai.",
  },
  {
    id: "obj-iter-2",
    question: "Shallow copy aur deep copy mein kya farak hai? `{ ...obj }` kaunsa deta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`{ ...obj }` aur `Object.assign({}, obj)` shallow copy dete hain: top-level primitive values copy hoti hain, par nested object/array ki sirf reference copy hoti hai — original aur copy wahi nested object share karte hain. Deep copy har level ko naya banati hai.",
    detailedAnswer:
      "Shallow copy ke baad `copy.name = 'x'` original ko nahi chhuta, par `copy.address.city = 'x'` original ko bhi badal deta hai kyunki `copy.address === original.address`. Ye React/Redux mein sabse common bug hai — reducer `{ ...state }` karta hai par nested field mutate karta hai, reference wahi rehti hai, component re-render nahi hota. Deep copy options: `structuredClone(obj)` (modern, built-in — nested objects, arrays, Date, Map, Set, typed arrays, circular refs sab handle; functions aur DOM nodes pe throw), `JSON.parse(JSON.stringify(obj))` (purana hack, sirf plain JSON-safe data), ya Lodash `cloneDeep`. State updates mein aksar poora deep clone chahiye hi nahi — sirf jitne levels change ho rahe utne spread kar do.",
    followUp: "React reducer mein `state.user.profile.name` update karna ho to kaise likhoge?",
  },
  {
    id: "obj-iter-3",
    question: "`structuredClone` kya-kya handle karta hai aur kahan fail hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Handle: nested objects/arrays, Date, RegExp, Map, Set, ArrayBuffer/typed arrays, aur circular references. Fail: functions, DOM nodes, class prototype identity, aur getters/setters (value copy hoti hai) — function pe `DataCloneError` throw hota hai.",
    detailedAnswer:
      "`structuredClone` structured clone algorithm use karta hai (wahi jo `postMessage` aur IndexedDB use karte hain). Ye `JSON.parse(JSON.stringify())` se bahut aage hai: `Date` wapas `Date` rehta hai (string nahi), `Map`/`Set` preserve hote hain, `NaN`/`Infinity` survive karte hain, aur circular reference throw nahi karti — properly clone hoti hai. Limitations: function ya DOM node kahin bhi ho to poora call `DataCloneError` se throw karta hai; class instance clone hota hai par prototype `Object.prototype` ban jata hai (`instanceof MyClass` false); property descriptors (getter/setter, non-enumerable) preserve nahi hote. Node 17+ aur saare modern browsers mein global hai.",
    followUp: "`postMessage` aur `structuredClone` ka connection kya hai?",
  },
  {
    id: "obj-iter-4",
    question:
      "`{ ...defaults, ...overrides }` aur `{ ...overrides, ...defaults }` mein kya farak hai?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Spread mein baad wali source ki keys pehle wali ko override karti hain. `{ ...defaults, ...overrides }` — overrides jeetta hai (jo usually chahiye). `{ ...overrides, ...defaults }` — defaults jeetta hai, yani user ke overrides bekaar ho jate hain.",
    detailedAnswer:
      "Object spread left-to-right evaluate hota hai; same key dobara aaye to last value wins. Config pattern mein hamesha `{ ...defaults, ...userConfig }` — pehle base bichhao, phir user ke changes upar likho. `Object.assign({}, defaults, userConfig)` bilkul same order semantics deta hai. Dhyaan: dono shallow hain — agar `defaults.db` aur `userConfig.db` dono objects hain to `userConfig.db` poora replace ho jata hai, merge nahi hota. Nested merge ke liye recursive helper ya library (`lodash.merge`).",
    followUp: "Agar dono mein `db` nested object ho aur tum unhe merge karna chahte ho to?",
  },
  {
    id: "obj-iter-5",
    question:
      "`for...in` array pe use karne se kya galat ho sakta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`for...in` indices ko string form mein deta hai (`'0'`, `'1'`), iteration order strictly guaranteed nahi, aur array ya `Array.prototype` pe add ki gayi kisi bhi enumerable property (custom methods, polyfills) ko bhi loop mein le aata hai. Arrays pe `for...of`, `.forEach`, ya classic `for` index loop use karo.",
    detailedAnswer:
      "Array bhi ek object hai jiski keys `'0'`, `'1'`, ... hain plus `length`. `for...in arr` in numeric-string keys ko deta hai, plus koi bhi non-index enumerable property jo kisi ne array pe ya uske prototype pe daal di ho. Isse `sum += arr[i]` jaisa code mein `i` string hota hai (`'0' + 1` = `'01'` type bugs alag context mein), aur ek stray `arr.customTag = 'x'` bhi iterate ho jata hai. `for...of arr` values deta hai clean, `.forEach((v, i) => ...)` value + numeric index, aur `for (let i = 0; i < arr.length; i++)` jab `break` ya index arithmetic chahiye. `for...in` sirf plain objects ke liye socho, arrays ke liye nahi.",
    followUp: "`for...of` aur `.forEach` mein `break` ke hisaab se kya farak hai?",
  },
];

export default questions;
