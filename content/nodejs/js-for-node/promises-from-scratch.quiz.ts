import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "promises-from-scratch-1",
    question: "Ek Promise ki 3 states kaunsi hain aur kaunsa transition possible hai?",
    options: [
      "start, running, done — aur wo cycle mein ghoomte rehte hain",
      "pending, fulfilled, rejected — pending se fulfilled ya pending se rejected, aur uske baad state frozen",
      "open, closed, error — koi bhi state kisi bhi state mein ja sakti hai",
      "pending, resolved, cancelled — resolved se cancelled possible hai",
    ],
    correctIndex: 1,
    explanation:
      "Promise hamesha pending, fulfilled, ya rejected mein hota hai. Sirf do transitions: pending→fulfilled (resolve) ya pending→rejected (reject). Settle hone ke baad state aur value dono immutable. Option A/C galat model. Option D galat — native Promise mein 'cancelled' state hai hi nahi.",
    difficulty: "easy",
  },
  {
    id: "promises-from-scratch-2",
    question:
      "Ek Promise jo pehle se fulfilled hai, uspe `.then(fn)` lagane par `fn` kab chalta hai?",
    options: [
      "Turant, synchronously, usi line pe",
      "Agle microtask mein — current synchronous code khatam hone ke baad, lekin setTimeout callbacks se pehle",
      "Agle setTimeout tick ke baad",
      "Kabhi nahi — kyunki Promise already settle ho chuka hai",
    ],
    correctIndex: 1,
    explanation:
      "Spec guarantee karta hai ki `.then` handler hamesha asynchronously chale, chahe Promise pehle se settled ho — wo microtask queue mein jata hai aur call stack khali hote hi chalta hai, macrotasks (setTimeout/setImmediate) se pehle. Isse code ka execution order predictable rehta hai. Option A spec violation hai; option C macrotask ke saath confuse kar raha hai; option D galat.",
    difficulty: "medium",
  },
  {
    id: "promises-from-scratch-3",
    question:
      "`getUser(id).then(user => { getOrders(user.id); }).then(orders => console.log(orders))` — `orders` kya print hoga aur kyun?",
    options: [
      "getOrders ka result — chain automatically wait karti hai",
      "undefined — pehla .then kuch return nahi karta, isliye doosre .then ko undefined milta hai; aur getOrders ka Promise chain se bahar float karta hai",
      "Ek pending Promise object",
      "Error throw hoga kyunki .then ko hamesha return chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Pehla `.then` callback `getOrders(...)` call toh karta hai lekin `return` nahi karta, toh wo `undefined` return karta hai — agle `.then` ko `undefined` milta hai. Saath hi `getOrders` ka Promise kisi chain se attached nahi, toh uska rejection unhandled ho sakta hai. Fix: `return getOrders(user.id)`. Option A tabhi sahi hota jab `return` hota.",
    difficulty: "medium",
  },
  {
    id: "promises-from-scratch-4",
    question:
      "Kaunse case mein Promise galat tool hai aur async iterator / EventEmitter behtar hai?",
    options: [
      "Ek HTTP GET call ka result process karna",
      "Ek readable stream se aane wale har data chunk ko process karna, jo kai baar fire hota hai",
      "Teen independent DB queries parallel chala kar sabke result lena",
      "Ek file padhna aur uska JSON parse karna",
    ],
    correctIndex: 1,
    explanation:
      "Promise exactly ek baar settle hota hai. Stream ke 'data' event kai baar fire hote hain — har chunk ke liye Promise banana state aur backpressure ko tod deta hai. `for await (const chunk of stream)` ya `stream.on('data', cb)` sahi hai. Option A/C/D sab single-shot async results hain — Promise / Promise.all inke liye perfect.",
    difficulty: "medium",
  },
];

export default quiz;
