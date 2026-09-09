import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "currying-1",
    question:
      "`const f = (a) => (b) => (c) => a + b + c;` — `f(1)(2)` kya return karta hai?",
    options: [
      "`3`",
      "Ek function jo `c` ka intezaar kar raha hai (closure mein `a = 1`, `b = 2`)",
      "`NaN`",
      "`TypeError: f(1) is not a function`",
    ],
    correctIndex: 1,
    explanation:
      "Curried function har call pe ek arg leta hai aur AGLA function return karta hai. `f(1)` -> `(b) => (c) => ...` (a fixed), `f(1)(2)` -> `(c) => ...` (a aur b fixed). Sirf `f(1)(2)(3)` pe teeno args milte hain aur `6` return hota hai. Beech ki har call ek function hai, value nahi.",
    difficulty: "easy",
  },
  {
    id: "currying-2",
    question: "Currying aur partial application mein kya farak hai?",
    options: [
      "Koi farak nahi, dono ek hi cheez ke naam hain",
      "Currying: har call exactly ek arg leti hai (`f(a)(b)(c)`). Partial application: ek call mein kitne bhi args fix kar do, baaki baad mein (`f.bind(null, a, b)`)",
      "Currying sirf arrow functions pe chalti hai",
      "Partial application function return nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Currying strict form hai — n-arg function n nested single-arg calls ban jaata hai. Partial application dheela hai — kuch (ek ya zyada) args ab bind/wrapper se fix karo, ek function milta hai jo baaki maangta hai. `add.bind(null, 5)` partial application hai, currying nahi. Practically log 'curry helper' ko dono ke liye use kar lete hain.",
    difficulty: "medium",
  },
  {
    id: "currying-3",
    question:
      "Generic `curry(fn)` helper ko kaise pata chalta hai ki saare args aa gaye aur ab `fn` chala dena chahiye?",
    options: [
      "`fn` ko har baar try-catch mein chalata hai",
      "Collected args ki count ko `fn.length` (declared parameters) se compare karta hai",
      "5 calls ke baad hamesha chala deta hai",
      "`arguments.length` ko `10` se compare karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`fn.length` original function ke declared (non-rest, non-default) parameters ki ginti deta hai — yaani arity. curry helper jab tak `args.length < fn.length` hai tab tak args jama karta rehta hai aur naya function return karta hai; jaise hi count `>=` ho jaaye, `fn(...args)` chala deta hai. Default/rest params `fn.length` ko kam kar dete hain, isliye unke saath ye check galat ho sakta hai.",
    difficulty: "hard",
  },
  {
    id: "currying-4",
    question: "Currying / partial application ka sabse strong real use case kaunsa hai?",
    options: [
      "Code ko chalane mein tez karna",
      "Ek general function se config fix karke chhote specialised reusable functions banana (`log = createLogger('API')`, handler with a fixed id)",
      "Memory usage kam karna",
      "Recursion ko rokna",
    ],
    correctIndex: 1,
    explanation:
      "Currying performance ke liye nahi hai (thoda overhead hi add karti hai — extra closures). Iska value readability aur reuse hai: pehla/config argument ek baar fix karke domain-specific helpers banao (`fetchJSON = request('GET')`, `onSelect = handleClick.bind(null, row.id)`). Point-free composition (`pipe(map(double), filter(isEven))`) bhi isi pe chalti hai.",
    difficulty: "medium",
  },
];

export default quiz;
