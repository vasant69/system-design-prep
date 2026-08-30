import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "let-const-var-1",
    question: "`const nums = [1, 2, 3]; nums.push(4);` — kya hota hai?",
    options: [
      "TypeError, kyunki nums const hai",
      "Kuch nahi, push silently ignore hota hai",
      "nums ban jaata hai [1, 2, 3, 4] — const binding rokta hai, array mutation nahi",
      "SyntaxError build time pe",
    ],
    correctIndex: 2,
    explanation:
      "`const` sirf binding fix karta hai — `nums` hamesha usi array ko point karega. Us array ke andar mutation (push/pop/splice) allowed hai. `nums = []` zaroor TypeError deta. Option A/D `const` ko 'immutable value' samajhne ki galti hai. Option B galat — push normal chalti hai.",
    difficulty: "easy",
  },
  {
    id: "let-const-var-2",
    question:
      "`console.log(x); var x = 5;` aur `console.log(y); let y = 5;` — dono ka result?",
    options: [
      "Dono undefined print karte hain",
      "Pehla undefined; doosra ReferenceError (TDZ)",
      "Dono ReferenceError dete hain",
      "Pehla 5; doosra undefined",
    ],
    correctIndex: 1,
    explanation:
      "`var x` hoist hoke turant `undefined` set ho jaata hai, isliye pehla `undefined` print karta hai (silent). `let y` bhi hoist hota hai par declaration line tak Temporal Dead Zone mein rehta hai — waha access `ReferenceError` deta hai. Option A `let` ke TDZ ko ignore karta hai. Option C galat — `var` crash nahi karta. Option D galat — `var x` ki value declaration line pe milti hai, uske pehle `undefined`.",
    difficulty: "medium",
  },
  {
    id: "let-const-var-3",
    question:
      "`for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i)); }` kya print karta hai, aur `var` ko `let` karne se kya badalta hai?",
    options: [
      "var: 0 1 2; let: 0 1 2 — koi farak nahi",
      "var: 3 3 3; let: 0 1 2 — let har iteration ka apna binding banata hai",
      "var: 0 1 2; let: 3 3 3",
      "Dono 3 3 3 print karte hain",
    ],
    correctIndex: 1,
    explanation:
      "`var i` puri loop ke liye ek hi binding hai — jab tak teeno setTimeout callbacks chalte hain, `i` `3` ho chuka hota hai, isliye `3 3 3`. `let i` har iteration ke liye naya block-scoped binding banata hai, isliye har callback apni value capture karta hai — `0 1 2`. Ye closures + block scope ka classic interview example hai.",
    difficulty: "medium",
  },
  {
    id: "let-const-var-4",
    question: "Naye project mein variable declaration ki default choice kya honi chahiye aur kyun?",
    options: [
      "var — sabse compatible hai",
      "let — kyunki value badalne ki flexibility chahiye",
      "const by default, let sirf jab reassignment genuinely chahiye, var kabhi nahi",
      "Farak nahi padta, teeno same hain runtime pe",
    ],
    correctIndex: 2,
    explanation:
      "Most variables kabhi reassign nahi hote, isliye `const` default — reader ko poori body padhe bina pata chalta hai binding fixed hai, refactor safe hota hai. `let` sirf loop counters / accumulators jaise real reassignment cases mein. `var` ka function-scope aur `undefined`-hoisting silent bugs deta hai jabki `let`/`const` ka TDZ same galti pe loud error deta hai. Option D galat — scope/hoisting/reassign behaviour teeno mein alag hai.",
    difficulty: "easy",
  },
];

export default quiz;
