import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "higher-order-functions-and-callbacks-1",
    question: "Higher-order function ki definition kya hai?",
    options: [
      "Jo function bahut fast chalta hai",
      "Jo function doosre function ko argument leta hai, ya ek function return karta hai, ya dono",
      "Jo function sirf async kaam karta hai",
      "Jo function class ke andar define hota hai",
    ],
    correctIndex: 1,
    explanation:
      "HOF = function ko argument ke roop mein leta hai (jaise `map`, `filter`, `setTimeout`) ya ek function return karta hai (jaise `multiplier(2)` jo `n => n*2` deta hai), ya dono. Jo na function leta na return karta (`add(a,b)`) wo first-order hai. Speed, async, ya class se koi lena-dena nahi.",
    difficulty: "easy",
  },
  {
    id: "higher-order-functions-and-callbacks-2",
    question:
      "In mein se kaunse callbacks SYNCHRONOUS hain? `[1,2].map(f)`, `setTimeout(f)`, `[3,1].sort(f)`, `el.addEventListener('click', f)`",
    options: [
      "Saare synchronous hain",
      "map aur sort synchronous; setTimeout aur addEventListener asynchronous",
      "Sirf setTimeout synchronous hai",
      "Saare asynchronous hain",
    ],
    correctIndex: 1,
    explanation:
      "`map` aur `sort` apne callback ko usi call stack mein, method ke return hone se pehle, har element pe chala dete hain — synchronous. `setTimeout` aur `addEventListener` callbacks event loop ke future tick pe chalte hain — asynchronous. 'Callback hamesha async hota hai' ek common galatfahmi hai.",
    difficulty: "medium",
  },
  {
    id: "higher-order-functions-and-callbacks-3",
    question:
      "`function once(fn) { let done = false, result; return (...args) => { if (!done) { done = true; result = fn(...args); } return result; }; }` — `done` aur `result` kahan store hote hain?",
    options: [
      "Global scope mein",
      "Returned function ke closure mein — har once() call ki apni private copy",
      "fn ke andar",
      "Ek hidden array mein jo saare once calls share karte hain",
    ],
    correctIndex: 1,
    explanation:
      "`done` aur `result` `once` ke local variables hain; returned arrow function unpe closure banata hai, isliye wo `once` ke return hone ke baad bhi zinda rehte hain. Har `once(someFn)` call ek naya scope banata hai — har wrapper ki apni independent `done`/`result`. Ye 'return a function + closure for private state' ka core pattern hai.",
    difficulty: "medium",
  },
  {
    id: "higher-order-functions-and-callbacks-4",
    question:
      "`compose(f, g)(x)` kis order mein evaluate hota hai?",
    options: [
      "f pehle, phir g — f(x) ka result g ko",
      "g pehle, phir f — f(g(x))",
      "Dono parallel chalte hain",
      "Order random hai",
    ],
    correctIndex: 1,
    explanation:
      "`compose` right-to-left chalata hai: `compose(f, g)(x) === f(g(x))` — pehle `g(x)`, uska result `f` ko. `pipe` iska ulta hai — left-to-right: `pipe(f, g)(x) === g(f(x))`. Math notation (`f ∘ g`) se match karne ke liye `compose` ulta hai; readability ke liye log aksar `pipe` prefer karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
