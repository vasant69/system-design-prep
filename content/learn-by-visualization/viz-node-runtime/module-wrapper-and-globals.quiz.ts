import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "module-wrapper-and-globals-1",
    question: "`require`, `module`, `__dirname` har file mein kaise available hote hain?",
    options: [
      "Ye real global variables hain, `global` object pe rakhe hue",
      "Node har CommonJS file ko ek wrapper function mein lapet ke unhe parameters ke roop mein pass karta hai",
      "V8 engine inhe har scope mein inject karta hai",
      "Ye keywords hain, `if`/`for` jaise",
    ],
    correctIndex: 1,
    explanation:
      "Node compile se pehle file ke code ko `(function (exports, require, module, __filename, __dirname) { ... })` mein wrap karta hai aur us function ko per-file values ke saath call karta hai. Isliye ye 5 identifiers function arguments hain, real globals nahi — `global.require` undefined hota hai. Ye keywords bhi nahi hain (tum inhe shadow kar sakte ho).",
    difficulty: "easy",
  },
  {
    id: "module-wrapper-and-globals-2",
    question: "Ek file mein `var x = 10;` top-level pe likha. `global.x` kya dega?",
    options: [
      "10 — top-level var global ban jaata hai",
      "undefined — var wrapper function ke andar scoped hai, global pe nahi",
      "ReferenceError",
      "null",
    ],
    correctIndex: 1,
    explanation:
      "Browser scripts mein top-level `var` `window` pe chipak jaata hai, lekin Node mein file wrapper function ke andar hoti hai — to `var x` us function ka local variable ban jaata hai, `global` object ko touch tak nahi karta. Isi wajah se do modules same naam ke top-level vars rakh sakte hain bina takraye.",
    difficulty: "medium",
  },
  {
    id: "module-wrapper-and-globals-3",
    question: "`exports = function foo() {}` likhne ke baad `require` us file ka kya return karta hai?",
    options: [
      "[Function: foo]",
      "Original (khali) `module.exports`, yaani `{}` — reassignment ne kuch export nahi kiya",
      "undefined",
      "TypeError",
    ],
    correctIndex: 1,
    explanation:
      "`exports` sirf ek parameter hai jo shuru mein `module.exports` (ek `{}`) ko point karta hai. `exports = fn` us LOCAL parameter ko naye function pe re-point karta hai — `module.exports` abhi bhi purana `{}` hai, aur `require` wahi return karta hai. Poora export replace karne ke liye `module.exports = fn` likhna padta hai. `exports.foo = fn` (property add) kaam karta hai kyunki wo same object ko mutate karta hai.",
    difficulty: "medium",
  },
  {
    id: "module-wrapper-and-globals-4",
    question: "`__dirname` aur `process.cwd()` mein kya farak hai?",
    options: [
      "Dono hamesha same value dete hain",
      "`__dirname` = us file ka folder (fixed); `process.cwd()` = jahan se `node` command chalayi (badal sakta hai)",
      "`__dirname` current working directory hai, `process.cwd()` file ka path",
      "`__dirname` sirf ESM mein milta hai",
    ],
    correctIndex: 1,
    explanation:
      "`__dirname` wrapper ke through pass hota hai aur hamesha usi file ke folder ka absolute path deta hai, chahe command kahin se bhi chalayi jaaye. `process.cwd()` wo directory hai jahan se Node process launch hua — alag folder se chalane pe badal jaata hai. File-relative paths ke liye hamesha `path.join(__dirname, ...)` use karo. (Aur haan, `__dirname` classic CJS mein hota hai; ESM mein `import.meta.url` se nikalna padta hai.)",
    difficulty: "medium",
  },
];

export default quiz;
