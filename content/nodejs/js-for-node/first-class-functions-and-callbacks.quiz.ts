import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "first-class-functions-and-callbacks-1",
    question:
      "\"Functions are first-class citizens in JavaScript\" ka concrete matlab kya hai?",
    options: [
      "Functions doosri cheezon se pehle execute hote hain",
      "Function ko variable mein rakh sakte ho, argument ki tarah pass kar sakte ho, aur return kar sakte ho — bilkul ek normal value ki tarah",
      "Sirf named functions allowed hain, anonymous nahi",
      "Functions memory mein sabse pehle allocate hote hain",
    ],
    correctIndex: 1,
    explanation:
      "First-class ka matlab hai function ke saath wahi sab kar sakte ho jo ek value (number/string/object) ke saath — store, pass, return. Option A/D 'first-class' ko 'priority/order' se confuse kar rahe hain, jo galat hai. Option C galat — anonymous aur arrow functions bhi first-class values hain.",
    difficulty: "easy",
  },
  {
    id: "first-class-functions-and-callbacks-2",
    question:
      "`arr.forEach(doThing())` aur `arr.forEach(doThing)` mein kya farak hai?",
    options: [
      "Dono same hain, brackets optional hain",
      "Pehle wala har element ke liye doThing chalata hai, doosra ek hi baar",
      "Pehle wala doThing ko abhi ek baar call karta hai aur uska return value forEach ko deta hai; doosra doThing ka reference deta hai jise forEach har element pe call karega",
      "Doosra syntax error hai",
    ],
    correctIndex: 2,
    explanation:
      "`doThing()` matlab 'abhi chalao' — uska return value (aksar undefined) forEach ko milta hai. `doThing` bina brackets matlab reference pass karna, jise forEach khud har element ke liye call karta hai. Isliye callback hamesha bina `()` ke pass karte hain. Option A/B ulta bata rahe hain; option D galat, dono valid syntax hain.",
    difficulty: "easy",
  },
  {
    id: "first-class-functions-and-callbacks-3",
    question:
      "Node ki 'error-first callback' convention kyun exist karti hai?",
    options: [
      "Taaki callback tez chale",
      "Kyunki async callback baad mein alag stack pe chalta hai, isliye use wrap karne wala try/catch uska error nahi pakad sakta — error ko explicitly pehle argument mein pass karna padta hai",
      "Kyunki JavaScript mein sirf ek hi argument allowed tha pehle",
      "Taaki success case handle na karna pade",
    ],
    correctIndex: 1,
    explanation:
      "Async callback event loop ke baad ke tick mein chalta hai, us waqt original try/catch block ka execution context ja chuka hota hai — isliye synchronous try/catch async error nahi pakadta. Node ne convention banayi: pehla arg hamesha error (ya null). Option A galat — convention performance se related nahi. Option C historically galat. Option D galat — success case (`data`) alag argument mein aata hai.",
    difficulty: "medium",
  },
  {
    id: "first-class-functions-and-callbacks-4",
    question:
      "Neeche kaunsa scenario callback ke liye theek hai aur Promise/async-await ki zaroorat nahi?",
    options: [
      "Teen files ek ke baad ek padhni hain, har agli file ka naam pichli file ke content se banta hai",
      "Ek readable stream ke 'data' event par har chunk process karna, jo kai baar fire hoga",
      "Ek API call ka result doosri API call mein bhejna, phir teesri mein",
      "Do independent DB queries parallel chalani hain aur dono ke result chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Stream ka 'data' event kai baar fire hota hai — Promise sirf ek baar resolve hota hai, isliye repeated events ke liye callback/EventEmitter hi sahi hai. Option A aur C sequential async steps hain (callback hell risk) — async/await better. Option D ke liye Promise.all sabse saaf hai. Multiple invocations = callback ka sweet spot.",
    difficulty: "medium",
  },
];

export default quiz;
