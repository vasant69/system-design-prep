import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "hof-1",
    question:
      "Higher-order function kya hai? Ek example do jo function leta hai aur ek jo function return karta hai.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "HOF wo function hai jo function ko argument leta hai ya function return karta hai (ya dono). Leta hai: Array.prototype.map(callback). Return karta hai: ek factory jaise multiplier(factor) jo n => n * factor return kare.",
    detailedAnswer:
      "JS mein functions first-class values hain — variable, argument, ya return value ban sakte hain. Isi wajah se HOF possible hain. Takes-a-fn: map, filter, reduce, forEach, sort ka comparator, addEventListener, setTimeout. Returns-a-fn: bind, function factories (makeAdder(5)), aur decorators/middleware jo ek fn ko wrap karke naya fn dete hain. Practical fayda: behaviour ko parameterise karo — iteration/timing/wrapping ka logic ek baar likho, actual kaam callback se aaye.",
    followUp: "map, filter, reduce mein se kaunsa HOF nahi hai?",
    redFlag: "\"HOF matlab jo bahut arguments leta hai\" — argument count se koi lena-dena nahi.",
  },
  {
    id: "hof-2",
    question:
      "`arr.forEach(item => save(item))` vs `arr.forEach(save)` — dono theek hain? Kab farak padta hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Chhote case mein dono same lag sakte hain, par arr.forEach(save) save ko teen args deta hai: (item, index, array). Agar save ka doosra parameter kuch aur expect karta hai (jaise parseInt ka radix), to bug aa jaata hai. Tab explicit arrow safer hai.",
    detailedAnswer:
      "Classic gotcha: ['1','2','3'].map(parseInt) -> [1, NaN, NaN], kyunki map parseInt(value, index) call karta hai aur index radix ban jaata hai. arr.map(x => parseInt(x, 10)) sahi hai. Rule: agar callback exactly wahi signature leta hai jo HOF deta hai, point-free (arr.forEach(save)) clean hai; warna wrap karo taaki sirf zaroori args jaayein.",
    followUp: "['1','2','3'].map(parseInt) ka output kya hai aur kyun?",
  },
  {
    id: "hof-3",
    question:
      "Ek once(fn) HOF likho jo fn ko sirf pehli baar chalaye, baaki calls pe pehla result de.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Closure mein ek called flag aur result rakho. Pehli call pe fn chalao, result cache karo, flag set karo; aage har call pe cached result return karo.",
    detailedAnswer:
      "Implementation: function once(fn) { let called = false, result; return (...args) => { if (!called) { called = true; result = fn.apply(this, args); } return result; }; }. Ye HOF 'takes a fn and returns a fn' hai; closure called/result ko calls ke beech yaad rakhta hai. Use cases: init logic, ek hi baar setup karna, expensive-call guard. Lodash ka _.once yahi karta hai.",
    followUp: "Isi pattern se memoize(fn) kaise banate?",
  },
  {
    id: "hof-4",
    question:
      "Middleware / decorator pattern HOF se kaise banta hai — ek logging wrapper ka example do.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ek HOF withLogging(fn) jo naya function return kare: call se pehle args log karo, fn(...args) chalao, result log karke return karo. Original fn untouched, behaviour bahar se add hua.",
    detailedAnswer:
      "const withLogging = (fn) => (...args) => { console.log('call', fn.name, args); const out = fn(...args); console.log('return', out); return out; }. Phir const safeDivide = withLogging(divide). Ye Express middleware, Redux middleware, retry/cache/auth wrappers — sabka base pattern hai: cross-cutting concern ko function ke around wrap karo bina uski body chhue. Multiple wrappers compose bhi ho sakte hain: withAuth(withLogging(handler)).",
    followUp: "Async fn ko wrap karte waqt kya extra dhyan rakhoge?",
  },
];

export default questions;
