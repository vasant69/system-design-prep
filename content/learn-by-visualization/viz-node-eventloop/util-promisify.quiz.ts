import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "util-promisify-1",
    question: "`util.promisify(fn)` sahi se kaam kare, iske liye `fn` ka kya hona zaroori hai?",
    options: [
      "`fn` ko ek Promise return karna chahiye",
      "`fn` ko apna last argument ek error-first callback `(err, value)` lena aur usi ko call karna chahiye",
      "`fn` ko `async` keyword se declare hona chahiye",
      "`fn` ka naam `fs` se shuru hona chahiye",
    ],
    correctIndex: 1,
    explanation:
      "`util.promisify` maanta hai ki `fn` Node convention follow karta hai: aakhri parameter ek callback hai jise `fn` `(err, value)` ke saath call karta hai. Wrapper us callback ko supply karta hai — `err` pe `reject`, warna `value` pe `resolve`. Agar `fn` already promise deta hai to promisify ki zaroorat nahi; `async` hona ya naam se koi lena-dena nahi.",
    difficulty: "easy",
  },
  {
    id: "util-promisify-2",
    question: "`const data = await fs.readFile('f.txt', 'utf8');` (bina promisify, plain callback `fs`) — result?",
    options: [
      "File ka content milta hai",
      "`data` `undefined` hota hai — `fs.readFile` khud `undefined` return karta hai, uspe await no-op hai",
      "TypeError: fs.readFile is not a function",
      "Promise pending reh jaata hai hamesha",
    ],
    correctIndex: 1,
    explanation:
      "Callback-style `fs.readFile` ka return value `undefined` hai (wo result callback se deta hai). `await undefined` bas `undefined` de deta hai — koi error nahi, par `data` galat. Isiliye pehle `util.promisify(fs.readFile)` ya `require('fs/promises').readFile` use karo, jo actual Promise deta hai.",
    difficulty: "medium",
  },
  {
    id: "util-promisify-3",
    question: "`fs` ko `await` ke saath use karne ka built-in (bina khud promisify kiye) tarika kya hai?",
    options: [
      "`require('fs').async`",
      "`require('fs/promises')` ya `require('fs').promises`",
      "`fs.await = true` set karna",
      "Koi nahi — `fs` hamesha promisify karna padta hai",
    ],
    correctIndex: 1,
    explanation:
      "Node `fs/promises` (aur `fs.promises`) ship karta hai — same methods, par Promise-returning. Ye handle-based hai aur aksar manual promisify se behtar (`FileHandle`, better error info). `util.promisify(fs.readFile)` bhi chalega par redundant hai.",
    difficulty: "easy",
  },
  {
    id: "util-promisify-4",
    question:
      "`dns.lookup` apne callback ko `(err, address, family)` — do success values — ke saath call karta hai. `util.promisify(dns.lookup)('host')` kya resolve karta hai?",
    options: [
      "Sirf `address` string",
      "Ek `[address, family]` array",
      "Ek object `{ address, family }` (kyunki dns.lookup ke paas ek `util.promisify.custom` implementation hai)",
      "Error — multi-value callbacks promisify nahi ho sakte",
    ],
    correctIndex: 2,
    explanation:
      "By default `util.promisify` sirf callback ki *pehli* value resolve karta. Lekin `dns.lookup` ne `util.promisify.custom` symbol define kiya hua hai, jo dono values ko `{ address, family }` object mein deta hai. Apne multi-value function ke liye tum bhi `fn[util.promisify.custom] = ...` set karke shape control kar sakte ho.",
    difficulty: "hard",
  },
];

export default quiz;
