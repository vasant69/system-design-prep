import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "obj-basics-1",
    question: "Dot notation aur bracket notation mein kya farak hai? Bracket kab zaroori hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Dot ke baad ek fixed valid identifier aata hai (compile time pe key pata). Bracket ek expression leta hai jise string mein convert karke key banata hai — isliye dynamic keys, aur space/dash/digit-start wali keys sirf bracket se access hoti hain.",
    detailedAnswer:
      "`obj.name` mein `name` literal key hai — engine hamesha string `'name'` dhoondta hai. `obj[expr]` mein `expr` evaluate hota hai, string mein coerce hota hai, aur wo result key banti hai. Bracket zaroori hai jab: (1) key ek variable ya loop iterator mein hai — `obj[key]`, `for (const k of keys) obj[k]`; (2) key valid identifier nahi — `obj['full name']`, `obj['content-type']` (dot version `obj.content-type` ko engine `obj.content - type` subtraction parse karta hai); (3) key digit se shuru hoti hai — `obj['3d']`. Creation ke waqt dynamic key ke liye computed-key syntax `{ [expr]: value }` hai.",
    followUp: "Computed key `{ [k]: v }` aur baad mein `obj[k] = v` karne mein koi farak hai?",
    redFlag: "\"Dono same hain, bas style choice hai\" — dynamic keys dot se possible hi nahi.",
  },
  {
    id: "obj-basics-2",
    question:
      "Object mein koi key mojood hai ya nahi — ye check karne ke kitne tarike hain aur kaunsa kab?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Teen: `key in obj` (own + prototype dono), `Object.hasOwn(obj, key)` (sirf own), aur `obj[key] !== undefined` (value bhi undefined nahi honi chahiye). Precise existence ke liye `Object.hasOwn` best.",
    detailedAnswer:
      "`'k' in obj` — `true` agar key own ho ya prototype chain mein ho. Isi liye `'toString' in obj` har object pe `true`. Useful jab inherited properties bhi count karni hon. `Object.hasOwn(obj, 'k')` (ES2022) — sirf object ki apni property; `hasOwnProperty` ka safe version (wo tab tootta hai jab object ne khud `hasOwnProperty` key define kar di ho, ya `Object.create(null)` ho). `obj.k !== undefined` — sabse aam, par `{ k: undefined }` pe `false` deta hai jabki key hai; aur missing key bhi `undefined` deti hai, to ye 'key nahi hai' aur 'value undefined hai' ko distinguish nahi karta. Jab presence hi asli sawaal ho, `Object.hasOwn` use karo.",
    followUp: "`Object.hasOwn` se pehle log kya use karte the aur uska risk kya tha?",
  },
  {
    id: "obj-basics-3",
    question: "`Object.freeze` kya karta hai? `const c = Object.freeze({ a: { b: 1 } }); c.a.b = 2;` — chalega?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Haan, `c.a.b = 2` chal jayega. `Object.freeze` shallow hai — sirf top-level keys (`a`) ko lock karta hai. `c.a` khud ek object hai jo frozen nahi, isliye uske andar mutation allowed hai.",
    detailedAnswer:
      "`Object.freeze(obj)` obj ko non-extensible bana deta hai aur uski existing own properties ko non-writable + non-configurable. Yani `c.a = ...` ya `delete c.a` block ho jata hai (non-strict mein silent, strict/module mein TypeError). Lekin freeze recursive nahi — `c.a` jis nested object ko point karta hai wo untouched hai, so `c.a.b = 2` valid. Deep freeze ke liye khud recurse karo:\n\n```javascript\nfunction deepFreeze(o) {\n  for (const k of Object.keys(o)) {\n    if (o[k] && typeof o[k] === 'object') deepFreeze(o[k]);\n  }\n  return Object.freeze(o);\n}\n```\n\nCheck karne ke liye `Object.isFrozen(c)`.",
    followUp: "`const` aur `Object.freeze` mein kya farak hai?",
  },
  {
    id: "obj-basics-4",
    question:
      "Plain object ko dictionary/map ki tarah use karne ke kya nuksan hain? Kab Map behtar hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Plain object ki keys sirf string ban jati hain, prototype keys (`toString`, `constructor`, `__proto__`) leak/interfere karti hain, size O(n) hai, aur clean iteration protocol nahi. Dynamic ya untrusted keys, non-string keys, ya frequent add/delete ke liye `Map` behtar.",
    detailedAnswer:
      "Pitfalls: (1) `obj[1]` chupke se `obj['1']` ban jata hai — number aur string key alag nahi. (2) Untrusted key `'__proto__'` ya `'constructor'` prototype pollution / weird behaviour de sakti hai. (3) `'toString' in obj` hamesha true — accidental hits. (4) Size ke liye `Object.keys(obj).length` (O(n)); `Map.size` O(1). (5) Integer-jaisi keys numeric order mein aati hain, insertion order nahi. `Map` fix karta hai: koi bhi type ki key (object bhi), guaranteed insertion order, `.size`, `.has`, `.get`, native iteration. Jab object 'lookup table' ban raha ho — cache, id-to-entity, word counts — `Map`. Fixed known shape (`user`, `config`, API response) ke liye plain object theek. Sasta beech ka rasta: `Object.create(null)` — prototype-less object.",
    followUp: "`Object.create(null)` aur `new Map()` mein kab kya chunoge?",
    redFlag: "\"Object aur Map bilkul same hain\" — keys, size, iteration, aur prototype behaviour alag hain.",
  },
  {
    id: "obj-basics-5",
    question: "`delete obj.key` aur `obj.key = undefined` mein kya farak hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`delete obj.key` property ko poori tarah hata deta hai — key + value dono. `obj.key = undefined` key ko rakhta hai, sirf value badalta hai. `'key' in obj` inhe alag batata hai (false vs true).",
    detailedAnswer:
      "`delete obj.key` ke baad `'key' in obj` -> `false`, `Object.keys(obj)` mein wo key nahi, `JSON.stringify` mein bhi nahi. `obj.key = undefined` ke baad `'key' in obj` -> `true`, `Object.keys` mein key dikhti hai, aur `JSON.stringify` mein wo key skip ho jati hai (JSON `undefined` values ko drop karta hai — ek aur jagah confusion hoti hai). Performance note: bahut baar `delete` karna kuch engines mein object ke hidden-class optimization ko tod deta hai, isliye hot code mein `Map` ya value ko `null`/`undefined` set karna faster ho sakta hai.",
    followUp: "`JSON.stringify({ a: undefined, b: null })` kya deta hai?",
  },
];

export default questions;
