import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "callbacks-and-callback-hell-1",
    question:
      "Callback hell (pyramid of doom) ka asli root cause kya hai — sirf ugly indentation?",
    options: [
      "Haan, sirf indentation — prettier chalane se problem solve ho jati hai",
      "Nahi — asli issue ye hai ki dependent async steps ek doosre ke callback ke andar jaate hain, jisse error handling har level pe repeat hoti hai, err variables shadow karte hain, aur try/catch async par kaam nahi karta",
      "Callbacks browsers mein slow chalte hain isliye nesting bura hai",
      "Nesting se memory leak hota hai kyunki har callback stack pe permanently rehta hai",
    ],
    correctIndex: 1,
    explanation:
      "Indentation sirf symptom hai. Asli problems: repeated `if (err) return` har level pe, shadowed `err`, wrapping try/catch ka async error na pakadna, aur intermediate values ko kai step aage forward karna. Isiliye named functions (jo indentation flat kar dete hain) problem poori tarah solve nahi karte. Option A galat — cosmetic fix kaafi nahi. Option C galat — ye performance issue nahi. Option D galat — resolved callbacks stack pe nahi rehte, koi leak nahi.",
    difficulty: "medium",
  },
  {
    id: "callbacks-and-callback-hell-2",
    question:
      "3-level dependent callback chain (getUser -> getOrders -> getLineItems) ke around `try/catch` lagaya. DB query fail hone par kya hoga?",
    options: [
      "catch block error ko pakad lega aur handle kar dega",
      "catch block sirf pehle function ko call karne ki synchronous error pakadega; async DB error har callback ke `err` argument mein aati hai aur catch tak kabhi nahi pahunchti",
      "Poora Node process turant crash ho jayega bina kisi error ke",
      "try/catch async code ke saath illegal hai, syntax error milega",
    ],
    correctIndex: 1,
    explanation:
      "Jab tak async DB response aata hai, tab tak wo try block execute hokar khatam ho chuka hota hai — uska execution context ja chuka hai, isliye synchronous catch use nahi pakad sakta. Async error error-first callback ke pehle argument mein aati hai. Isiliye Node ne error-first convention banayi. Option A galat — yahi common misconception hai. Option C galat — agar `err` ignore kiya toh baad mein undefined access pe crash ho sakta hai, par try/catch ki wajah se nahi. Option D galat — syntax bilkul valid hai, bas async error nahi pakadta.",
    difficulty: "medium",
  },
  {
    id: "callbacks-and-callback-hell-3",
    question:
      "Custom async function mein `if (err) callback(err);` likha, phir neeche `callback(null, data);`. Error case mein kya galat hoga?",
    options: [
      "Kuch galat nahi, ye standard pattern hai",
      "callback error ke saath call hoga, phir `return` na hone ki wajah se success ke saath dobara call hoga — callback do baar invoke, jisse duplicate processing ya crash",
      "Second callback call pehle wale ko cancel kar dega",
      "JavaScript automatically doosri call ko ignore kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`return` missing hai, isliye `if (err) callback(err)` ke baad execution neeche `callback(null, data)` tak pahunch jata hai — callback do baar chalta hai (ek error, ek success). Downstream code duplicate DB write, double response, ya 'callback already called' error de sakta hai. Fix: `if (err) return callback(err);`. Option A galat — `return` ke bina ye buggy hai. Option C aur D galat — JS aisa koi auto-cancel ya auto-ignore nahi karta.",
    difficulty: "easy",
  },
  {
    id: "callbacks-and-callback-hell-4",
    question:
      "Callback pyramid ko named functions (onUser, onOrders, onLineItems) mein refactor karne ke baad kaunsi problem bachi rehti hai?",
    options: [
      "Koi problem nahi, named functions callback hell ko poori tarah khatam kar dete hain",
      "Indentation to flat ho jati hai, par control flow file mein bikhar jata hai aur ek step ki intermediate value (jaise `user`) ko 2 step aage le jaana manual aur awkward rehta hai",
      "Named functions callbacks se 10x slow chalte hain",
      "Named functions ke saath error-first convention kaam nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Named functions nesting hata dete hain (achhi baat), lekin ab `getUser(userId, onUser)` neeche hai aur `onUser` upar — control flow padhne ke liye file mein kudna padta hai. Aur agar `onLineItems` ko `user.name` bhi chahiye toh use `onUser -> onOrders -> onLineItems` manually thread karna padta hai. Promise chain / async/await isko naturally handle karte hain (scoped variables, linear flow). Option A galat — partial fix hi hai. Option C aur D galat — na performance issue, na convention break.",
    difficulty: "medium",
  },
];

export default quiz;
