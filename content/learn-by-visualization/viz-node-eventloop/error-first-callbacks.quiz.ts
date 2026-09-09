import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "error-first-callbacks-1",
    question: "Node ki error-first callback convention mein callback ka pehla argument kya hota hai?",
    options: [
      "Hamesha data / result",
      "Ek error object agar fail hua, warna `null` (ya `undefined`)",
      "Ek boolean `success` flag",
      "Callback ka naam (string)",
    ],
    correctIndex: 1,
    explanation:
      "Convention hai `callback(err, data)`. Pehla slot error ke liye reserved hai: fail pe `Error` object, success pe `null`/`undefined`. Isiliye caller pehle `if (err)` check karta hai. Boolean flag ya data-first shape non-standard hai aur `util.promisify` jaise tools ke saath tootta hai.",
    difficulty: "easy",
  },
  {
    id: "error-first-callbacks-2",
    question:
      "`try { fs.readFile('x', (err, data) => { JSON.parse(data); }); } catch (e) { /* handle */ }` — `x` missing hai. Kya hota hai?",
    options: [
      "`catch` block chalta hai, error handle ho jaata hai",
      "`catch` chalta hi nahi; `data` `undefined` hai, `JSON.parse(undefined)` callback ke andar throw karta hai -> uncaught exception",
      "`fs.readFile` sync error throw karta hai, `catch` pakad leta hai",
      "Kuchh nahi hota, silently pass",
    ],
    correctIndex: 1,
    explanation:
      "`fs.readFile` async hai — wo turant return karta hai, error baad mein poll phase ke callback mein `err` ke through aata hai. `try/catch` tab tak khatam ho chuka (alag call stack). Yahan code `err` ignore karke `JSON.parse(undefined)` karta hai jo `SyntaxError` throw karta hai — callback ke andar, bina kisi catch ke — to process crash. Yehi wajah hai error-first convention ki.",
    difficulty: "medium",
  },
  {
    id: "error-first-callbacks-3",
    question: "`if (err) { console.error(err); }` — programmer `return` bhool gaya. Kya risk hai?",
    options: [
      "Koi risk nahi, `console.error` kaafi hai",
      "Error log hone ke baad bhi success-path code chalta hai `data` `undefined` ke saath — aksar baad mein crash ya galat behaviour",
      "`return` ke bina `console.error` kaam nahi karta",
      "Node warning deta hai par code theek chalta hai",
    ],
    correctIndex: 1,
    explanation:
      "`if (err)` block sirf log karta hai, execution rukti nahi — control neeche success-path pe pahunch jaata hai jahan `data` `undefined` hai. `data.length` ya `JSON.parse(data)` ab throw karega, ya aur bura, corrupt state aage propagate karega. Isiliye pattern hamesha `if (err) return handle(err);` hai — early return.",
    difficulty: "easy",
  },
  {
    id: "error-first-callbacks-4",
    question: "Apna error-first function likh rahe ho. Success case mein callback kaise call karoge?",
    options: [
      "`cb(result)`",
      "`cb(null, result)`",
      "`cb(result, null)`",
      "`cb(true, result)`",
    ],
    correctIndex: 1,
    explanation:
      "Success pe pehla argument explicitly `null` hona chahiye taaki caller ka `if (err)` false ho, aur asli value doosre argument mein: `cb(null, result)`. `cb(result)` galat hai — caller `result` ko `err` samjhega. Error case mein: `cb(new Error('...'))` — sirf pehla argument.",
    difficulty: "medium",
  },
];

export default quiz;
