import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "callbacks-and-callback-hell-1",
    question:
      "Node ki error-first callback convention mein callback ka signature kaisa hota hai?",
    options: [
      "`callback(data, err)` — data pehle",
      "`callback(err, data)` — err pehle, success pe `err` null hota hai",
      "`callback(err)` sirf error ke liye, alag `onSuccess` success ke liye",
      "`callback(result)` — error `throw` hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Node convention: pehla argument `err` (koi error nahi to `null` ya `undefined`), uske baad data. Har callback ke start mein `if (err) return ...` likha jaata hai. `throw` async callback mein kaam nahi karta kyunki wo alag tick pe chalta hai aur bahar ka `try/catch` use nahi pakadta — isi wajah se err ko value ki tarah pass kiya jaata hai.",
    difficulty: "easy",
  },
  {
    id: "callbacks-and-callback-hell-2",
    question:
      "`try { fs.readFile('x', (err, data) => { if (err) throw err; }); } catch (e) { handle(e); }` — file missing hone pe kya hoga?",
    options: [
      "`catch` block `e` ko pakad lega",
      "`throw err` ek alag tick pe chalta hai, bahar wala `catch` use miss karega — uncaught exception",
      "Build error, `try` ke andar callback allowed nahi",
      "`readFile` sync ho jaata hai `try` ke andar",
    ],
    correctIndex: 1,
    explanation:
      "`fs.readFile` turant return kar deta hai; callback baad mein event loop se chalta hai jab `try/catch` block kab ka khatam ho chuka. Us waqt `throw err` ke liye koi surrounding `catch` nahi — process pe `uncaughtException`. Isi problem ki wajah se error-first pattern mein error ko `throw` nahi, callback ke `err` param se handle karte hain (ya promise + `.catch`).",
    difficulty: "medium",
  },
  {
    id: "callbacks-and-callback-hell-3",
    question: "'Callback hell' ya 'pyramid of doom' se kya matlab hai?",
    options: [
      "Bahut saare callbacks memory leak kar dete hain",
      "Dependent async steps ek dusre ke callback mein nested hote jaate hain — deep indentation, padhna aur maintain karna mushkil, har level pe alag error handling",
      "Callbacks recursion se stack overflow kar dete hain",
      "Ek callback ko galti se do baar call kar dena",
    ],
    correctIndex: 1,
    explanation:
      "Jab step 2 ko step 1 ka result chahiye, step 3 ko step 2 ka — har call pichle ke callback ke andar jaata hai, code daayein badhta hai aur nested `if (err)` bikhar jaate hain. Ye readability aur maintainability ka problem hai, memory ya stack ka nahi. Fix: named functions, ya promise chaining / async-await jo ise ek flat sequence bana dete hain.",
    difficulty: "medium",
  },
  {
    id: "callbacks-and-callback-hell-4",
    question:
      "Callback hell ko flatten karne ka sabse standard modern tareeka kya hai?",
    options: [
      "Saare callbacks ko ek hi line mein likh do",
      "`setTimeout` se har step ko delay karo",
      "Promise chaining ya `async/await` — sequence flat aur error handling ek jagah",
      "Global variables mein har step ka result store karo",
    ],
    correctIndex: 2,
    explanation:
      "Promises `.then` chain ko ek level pe rakhti hain aur ek `.catch` poori chain ke errors sambhal leta hai; `async/await` to use bilkul sync-jaisa top-to-bottom bana deta hai. Global variables (option D) race conditions aur hidden coupling laate hain. Ek line mein likhna readability aur bhi kharab karta hai.",
    difficulty: "easy",
  },
];

export default quiz;
