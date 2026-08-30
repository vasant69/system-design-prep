import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "function-declarations-vs-expressions-1",
    question:
      "`greet(); function greet() { console.log('hi'); }` — kya hota hai?",
    options: [
      "ReferenceError: greet is not defined",
      "'hi' print hota hai — declaration poori hoist hoti hai, isliye line se pehle call valid hai",
      "TypeError: greet is not a function",
      "undefined print hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Function declaration ka naam aur body dono creation phase mein hoist ho jaate hain, isliye `greet()` uski definition se pehle bhi chal jaata hai. Option A/C tab hote jab ye ek `var`/`const` expression hota. Option D `var`-expression call se bhi nahi milta — wahan `TypeError` aata.",
    difficulty: "easy",
  },
  {
    id: "function-declarations-vs-expressions-2",
    question:
      "`sayBye(); const sayBye = function () {};` — kaunsa error aata hai aur kyun?",
    options: [
      "Koi error nahi, function chal jaata hai",
      "TypeError: sayBye is not a function, kyunki binding undefined hai",
      "ReferenceError: Cannot access 'sayBye' before initialization — const binding TDZ mein hai",
      "SyntaxError build time pe",
    ],
    correctIndex: 2,
    explanation:
      "Function expression mein sirf variable binding hoist hota hai, body nahi. `const` binding block start se declaration line tak Temporal Dead Zone mein rehta hai, isliye pehle access `ReferenceError` deta hai. Option B tab sahi hota jab `var sayBye` use hota (binding `undefined`, call pe `TypeError`). `const` ke saath TDZ pehle hit hota hai.",
    difficulty: "medium",
  },
  {
    id: "function-declarations-vs-expressions-3",
    question:
      "`const fact = function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }; factorial(5);` — aakhri line ka result?",
    options: [
      "120",
      "ReferenceError: factorial is not defined — naam sirf function ke andar visible hai",
      "TypeError",
      "undefined",
    ],
    correctIndex: 1,
    explanation:
      "Named function expression ka naam (`factorial`) sirf us function ke apne scope ke andar bind hota hai — recursion ke liye. Bahar sirf `fact` available hai. Isliye bahar `factorial(5)` `ReferenceError` deta hai; `fact(5)` `120` deta. Baaki options tab hote jab naam bahar bhi leak karta, jo spec ke against hai.",
    difficulty: "medium",
  },
  {
    id: "function-declarations-vs-expressions-4",
    question:
      "IIFE `(function () { var x = 1; })()` pre-modules era mein kis liye use hota tha?",
    options: [
      "Function ko fast banane ke liye",
      "Ek private scope banane ke liye taaki var global na bane aur libraries clash na karein",
      "Recursion enable karne ke liye",
      "Hoisting disable karne ke liye",
    ],
    correctIndex: 1,
    explanation:
      "IIFE turant chalta hai aur apna function scope deta hai — andar ke `var` globals nahi bante, jaise jQuery plugins `(function ($) {...})(jQuery)`. Aaj ES modules har file ko scope dete hain, isliye ye pattern kam dikhta hai. Ye speed, recursion, ya hoisting se related nahi hai.",
    difficulty: "easy",
  },
];

export default quiz;
