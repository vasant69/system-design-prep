import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "promises-1",
    question:
      "```javascript\ngetUser()\n  .then(u => { getOrders(u.id); })\n  .then(orders => console.log(orders));\n```\nDoosra `.then` kya print karega?",
    options: [
      "Orders ka array",
      "`undefined` — pehle `.then` ne `return` nahi kiya, isliye chain ne `getOrders` ka wait nahi kiya aur value aage nahi bahi",
      "Ek pending Promise",
      "TypeError",
    ],
    correctIndex: 1,
    explanation:
      "Pehle `.then` ne `getOrders(u.id)` call to kiya par `return` nahi kiya. Isliye us `.then` se return hone wala promise `undefined` par fulfil ho jaata hai, chain `getOrders` ka wait nahi karti, aur doosra `.then` ko `undefined` milta hai. Fix: `return getOrders(u.id)`. Ye Promise ka sabse common bug hai. Option A tab sahi hota jab `return` hota. Option C/D galat — chain valid hai, bas value flow nahi hui.",
    difficulty: "medium",
  },
  {
    id: "promises-2",
    question: "`Promise.all` aur `Promise.allSettled` mein mukhya farak kya hai?",
    options: [
      "`allSettled` tez hai kyunki wo parallel chalata hai aur `all` sequential",
      "`Promise.all` kisi ek promise ke reject hote hi turant reject ho jaata hai; `Promise.allSettled` kabhi reject nahi hota — sab ke settle hone par har ek ka `{status, value|reason}` deta hai",
      "`all` array deta hai, `allSettled` sirf pehla result deta hai",
      "Koi farak nahi, `allSettled` bas naya naam hai",
    ],
    correctIndex: 1,
    explanation:
      "Dono promises ko parallel hi chalate hain — farak result semantics ka hai. `Promise.all` fail-fast hai: pehla reject poore ko reject kar deta hai, aur tum baaki results nahi dekh paate. `Promise.allSettled` hamesha fulfil hota hai, ek array of status objects ke saath — har operation ka result ya error alag se milta hai. `all` tab use karo jab sab kuch chahiye aur ek fail = poora fail; `allSettled` jab partial success acceptable hai. Option A/C/D factually galat hain.",
    difficulty: "easy",
  },
  {
    id: "promises-3",
    question:
      "Ek Promise `resolve('a')` ke baad usi executor mein `resolve('b')` aur `reject('c')` bhi call karta hai. Consumer `.then`/`.catch` mein kya milega?",
    options: [
      "Pehle `.then` ko 'a', phir 'b', phir `.catch` ko 'c'",
      "Sirf `.then` ko 'a' — promise pehle `resolve` par settle ho gaya, uske baad ke `resolve`/`reject` calls ignore ho jaate hain",
      "`.catch` ko 'c' — aakhri call jeetti hai",
      "Error: promise ko ek se zyada baar settle nahi kar sakte",
    ],
    correctIndex: 1,
    explanation:
      "Promise settle exactly ek baar hota hai aur uske baad state permanently lock ho jaati hai. Pehla `resolve('a')` jeet gaya; baad ke `resolve('b')` aur `reject('c')` chup-chaap ignore ho jaate hain (koi exception bhi nahi). Yahi single-settle guarantee callback ke inversion-of-control problem ko fix karti hai. Option A/C multiple settle maan rahe hain. Option D galat — extra calls error nahi, silently no-op hain.",
    difficulty: "medium",
  },
  {
    id: "promises-4",
    question:
      "Ek chain mein doosre `.then` mein `throw new Error('x')` hota hai, aur uske baad teesra `.then` aur ek `.catch` hai. Kya chalega?",
    options: [
      "Teesra `.then` chalega `undefined` ke saath, phir `.catch`",
      "Teesra `.then` skip ho jaayega aur control seedha `.catch` par jaayega jise error 'x' milega",
      "Poora program crash ho jaayega",
      "`.catch` skip hoga kyunki `throw` `reject` se alag hai",
    ],
    correctIndex: 1,
    explanation:
      "`.then` ke andar `throw` us `.then` ke returned promise ko reject kar deta hai. Rejected state chain mein neeche propagate hoti hai, beech ke `.then` (jinme sirf `onFulfilled` handler hai) skip ho jaate hain, aur pehla `.catch` (ya `.then` ka `onRejected`) jise error milta hai wo chalta hai. `throw` aur `reject` chain ke liye barabar hain. Isiliye ek terminal `.catch` poore chain ka error handle kar sakta hai.",
    difficulty: "easy",
  },
];

export default quiz;
