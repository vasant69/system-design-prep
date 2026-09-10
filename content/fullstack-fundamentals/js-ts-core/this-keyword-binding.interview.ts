import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "tkb-1",
    question: "Normal function call ke liye `this` ki value kaise tay hoti hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Call site se, chaar rules priority me: `new` (naya object), explicit `call`/`apply`/`bind` (diya gaya object), implicit `obj.fn()` (dot ke left wala object), aur default `fn()` (strict mode me undefined). Arrow functions ye sab bypass karte hain aur `this` lexically lete hain.",
    detailedAnswer:
      "Bachne wali galti: ye sochna ki `this` wahan fix hai jahan function define hua. `const m = obj.method; m()` ek bare call hai, isliye `this` undefined hai chahe `method` `obj` ke andar likha ho. Isiliye method ko callback ki tarah pass karte waqt ya to `bind` karo, arrow me wrap karo, ya arrow class field use karo.",
    followUp: "Object method ke andar nested plain function me `this` kya hota hai?",
  },
  {
    id: "tkb-2",
    question: "Kya ye kehna sahi hai ki arrow function `this` ko surrounding object par bind karta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Arrow function ka apna `this` hota hi nahi. Wo `this` lexical scope se resolve karta hai — wahi `this` jo enclosing function ya module ka hai. Aksar wo object hi hota hai, par hamesha nahi.",
    detailedAnswer:
      "Module top level par object literal par arrow method as method ke roop me `this` = `undefined`/module scope deta hai, object nahi, kyunki enclosing scope module hai object nahi. Arrows method ke *andar* (callbacks) ideal hain jahan enclosing `this` instance hai, aur method *ke roop me* galat hain.",
    redFlag: "Har object method ko arrow banana 'safety ke liye' — ye implicit binding tod deta hai.",
  },
  {
    id: "tkb-3",
    question: "call, apply, aur bind me farak?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`call(thisArg, ...args)` turant invoke, listed args ke saath. `apply(thisArg, argsArray)` turant invoke, args array me. `bind(thisArg, ...args)` invoke nahi karta — ek naya function return karta hai jo permanently `thisArg` se bound hai, pass kiye args pre-applied (partial application).",
    detailedAnswer:
      "`bind` one-way hai: ek baar bound hone ke baad baad ka `call`/`apply` ya doosra `bind` bhi `this` nahi badal sakta. `apply` pre-spread code me array ko positional args me spread karne ke liye kaam ka hai (`Math.max.apply(null, arr)`). Modern code uske liye spread operator use karta hai aur `bind` ko callback `this` fixing aur partial application ke liye rakhta hai.",
  },
];

export default questions;
