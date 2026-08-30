import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "synchronous-vs-asynchronous-js-1",
    question:
      "`console.log('A'); setTimeout(() => console.log('B'), 0); console.log('C');` ka output kya hai?",
    options: ["A B C", "A C B", "B A C", "C A B"],
    correctIndex: 1,
    explanation:
      "`console.log('A')` aur `console.log('C')` synchronous hain — turant order mein chalte hain. `setTimeout` ka callback, chahe delay `0` ho, browser ko delegate hota hai aur callback queue mein jaata hai; event loop use tab chalata hai jab current synchronous code (yaani `C` tak) poora ho jaaye. Isliye `A C B`. Option A galat hai kyunki `0ms` ko log 'turant' samajh lete hain. Option C/D galat — sync logs kabhi callback ke baad nahi aate.",
    difficulty: "easy",
  },
  {
    id: "synchronous-vs-asynchronous-js-2",
    question:
      "JavaScript single-threaded hai phir bhi ek page ek saath network call, animation aur user clicks kaise handle karta hai?",
    options: [
      "JS engine background mein extra threads bana kar har kaam parallel chalata hai",
      "Slow I/O kaam browser/Node ke APIs ko delegate hota hai; JS thread free rehta hai aur callbacks queue se turn-by-turn chalte hain",
      "Har async function apne alag CPU core pe chalta hai",
      "Browser JS ko multi-threaded mode mein switch kar deta hai jab zaroorat ho",
    ],
    correctIndex: 1,
    explanation:
      "JS ka apna code hamesha ek hi thread, ek call stack pe chalta hai. Concurrency ka bhram is liye hota hai kyunki network/timer/disk jaise kaam JS engine khud nahi, browser ya Node ke C++ APIs karte hain (jo alag threads use kar sakte hain), aur poora hone pe callback ek queue mein jaata hai jise event loop stack khali hone pe chalata hai. Option A/C/D sab 'JS code parallel chalta hai' wali galat dhaarna hai — JS code kabhi parallel nahi chalta.",
    difficulty: "medium",
  },
  {
    id: "synchronous-vs-asynchronous-js-3",
    question:
      "Ek function `while` loop se 3 second tak CPU busy rakhta hai. Is dauran page pe kya hota hai?",
    options: [
      "Kuch nahi — browser doosre thread pe UI chalata rehta hai",
      "Page poori tarah freeze — clicks, scroll, animation, aur pending setTimeout callbacks sab 3 second ke liye ruk jaate hain",
      "Sirf JavaScript rukta hai, CSS animations chalti rehti hain",
      "Browser 3 second baad us function ko force-kill kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Ek lambi synchronous loop call stack pe baithi rehti hai, isliye event loop kuch aur nahi chala sakta — na queued click handlers, na timer callbacks, na rendering. Isiliye heavy CPU kaam Web Worker mein ya chunks mein karna chahiye. Option A galat — UI usi main thread pe hai. Option C galat — main-thread block hone pe most rendering bhi ruk jaati hai. Option D galat — browser ek 'unresponsive page' warning de sakta hai par script ko turant kill nahi karta.",
    difficulty: "medium",
  },
  {
    id: "synchronous-vs-asynchronous-js-4",
    question:
      "`const data = fetchUser(); console.log(data.name);` — `fetchUser` ek async function hai. Kya hoga?",
    options: [
      "`data.name` sahi user ka naam print karega",
      "`data` ek pending Promise hai, isliye `data.name` `undefined` hoga (ya error) — result us line pe ready nahi hota",
      "Line automatically ruk kar response ka wait karegi, phir print karegi",
      "TypeError, kyunki async function ko `const` mein store nahi kar sakte",
    ],
    correctIndex: 1,
    explanation:
      "Async kaam ka result us line pe available nahi hota — wo baad ke event loop tick mein aata hai. `fetchUser()` turant ek Promise return karta hai, actual user nahi. Us Promise pe `.name` `undefined` deta hai. Sahi tarika: `const data = await fetchUser()` (async function ke andar) ya `fetchUser().then(data => ...)`. Option C galat — bina `await` ke line pause nahi hoti. Option D galat — Promise ko `const` mein rakhna bilkul valid hai.",
    difficulty: "easy",
  },
];

export default quiz;
