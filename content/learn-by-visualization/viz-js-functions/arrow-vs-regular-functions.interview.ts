import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "arf-1",
    question: "Arrow function aur regular function mein farak batao — sirf syntax nahi.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Arrow ke paas apna this, arguments, prototype nahi hota aur new support nahi karta; uska this lexically bahar wale scope se aata hai. Regular function ko call-time pe apna this milta hai, apna arguments, constructor ban sakta hai, aur declaration form hoist hota hai.",
    detailedAnswer:
      "Paanch concrete farak: (1) this — regular ka this call site decide karta hai (default / implicit / explicit / new); arrow apna this rakhta hi nahi, define hone ki jagah ke scope ka this use karta hai. (2) arguments — regular ke paas apna array-like arguments; arrow ke paas nahi, isliye rest `...args` use karo. (3) new — regular constructor ban sakta hai; arrow pe new deta hai `TypeError: not a constructor`. (4) Hoisting — `function foo(){}` declaration poora hoist hota hai; `const foo = () => {}` expression hai, TDZ mein rehta hai. (5) prototype property arrow pe hoti hi nahi. Iske alawa arrow ka this `bind` / `call` / `apply` se badla nahi ja sakta — wo ignore ho jaata hai.",
    followUp: "Object method ko arrow se likhne pe kya galat hota hai?",
    redFlag: "\"Arrow bas chhota function likhne ka tarika hai\" — behaviour ka difference miss karna.",
  },
  {
    id: "arf-2",
    question:
      "`const obj = { id: 7, run() { setTimeout(function () { console.log(this.id); }, 0); } }; obj.run();` — kya print hoga aur kyun? Fix batao.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "undefined (ya strict mode ke bahar global). setTimeout ko diya gaya plain function baad mein bina owner ke call hota hai, to uska this obj nahi hai. Fix: callback ko arrow bana do taaki wo run() ka this borrow kare.",
    detailedAnswer:
      "`obj.run()` mein run ka this obj hai. Lekin setTimeout ko jo `function () {...}` diya, wo timer API baad mein khud call karti hai bina kisi owner ke — to us regular function ka this undefined (strict) ya globalThis ban jaata hai, aur `this.id` -> undefined. Fix options: (a) `setTimeout(() => console.log(this.id), 0)` — arrow lexically run ka this leta hai; (b) `const self = this` phir `self.id`; (c) `fn.bind(this)`. Modern code option (a) use karta hai.",
    followUp: "Agar run khud arrow hota to this.id kya deta?",
  },
  {
    id: "arf-3",
    question: "Arrow function ko constructor ki tarah kyun nahi use kar sakte?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Arrow function ke paas [[Construct]] internal method aur prototype property nahi hoti. new ko dono chahiye — naya object banane ke liye prototype link, aur constructor body chalane ke liye [[Construct]] — isliye new arrowFn() TypeError deta hai.",
    detailedAnswer:
      "`new Fn()` ye karta hai: ek naya object banata hai jiska prototype Fn.prototype hota hai, Fn ko us object pe this bind karke chalata hai ([[Construct]] path), aur object return karta hai. Arrow function design se this-less hai aur uska prototype undefined hota hai, to new ke liye zaroori machinery hi maujood nahi. Engine isliye new dekhte hi mana kar deta hai. Constructor pattern chahiye to class ya regular function use karo.",
    followUp: "class ke methods internally arrow hote hain ya regular?",
  },
  {
    id: "arf-4",
    question: "Kab arrow use karoge aur kab regular — ek practical checklist do.",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Arrow: callbacks (map / filter / forEach, setTimeout, promise .then, event listeners jinhe outer this chahiye), chhote pure transforms. Regular: object literal methods, class prototype methods, constructors, generators, aur jab dynamic this ya arguments chahiye.",
    detailedAnswer:
      "Checklist: (1) Callback jo bahar ka this preserve kare -> arrow. (2) Object method jo this se apni hi properties access kare -> regular `{ method() {} }`. (3) Constructor / cheez jise new lagega -> regular ya class. (4) arguments object chahiye -> regular (ya arrow + `...args`). (5) Prototype pe method -> regular; arrow class field har instance pe apni copy banata hai, thoda zyada memory. (6) DOM handler jise `this === element` chahiye -> regular function; jise component instance chahiye -> arrow class field. Default modern preference: standalone helpers aur callbacks arrow, structural cheezein (methods / classes) regular.",
    followUp: "Arrow ko class field banane se memory pe kya asar padta hai vs prototype method?",
  },
];

export default questions;
