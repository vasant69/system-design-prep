import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "hoisting-and-tdz-1",
    question:
      "`foo(); function foo() { console.log('A'); } bar(); var bar = function () { console.log('B'); };` — kya hota hai?",
    options: [
      "`A` print, phir `B` print",
      "`A` print, phir `TypeError: bar is not a function`",
      "Dono lines `ReferenceError` deti hain",
      "`TypeError: foo is not a function` pehli line par",
    ],
    correctIndex: 1,
    explanation:
      "`foo` ek function declaration hai — phase 1 mein poori body ke saath hoist hoti hai, isliye `foo()` chalta hai aur 'A' print hota hai. `bar` `var` se banaya gaya: naam `undefined` ke saath hoist hota hai, function value `bar` ki line par assign hoti hai. `bar()` us waqt `undefined()` hai -> `TypeError: bar is not a function`. `ReferenceError` nahi kyunki naam `bar` exist karta hai, bas value undefined hai.",
    difficulty: "easy",
  },
  {
    id: "hoisting-and-tdz-2",
    question:
      "`console.log(typeof a); let a = 1;` ek jagah, aur `console.log(typeof b);` (jahan `b` kahin declare hi nahi) doosri jagah — dono ka output?",
    options: [
      "Dono `\"undefined\"` print karte hain",
      "Pehla `ReferenceError` (TDZ), doosra `\"undefined\"`",
      "Pehla `\"undefined\"`, doosra `ReferenceError`",
      "Dono `ReferenceError` dete hain",
    ],
    correctIndex: 1,
    explanation:
      "`let a` hoist to hota hai par apni declaration line tak TDZ mein rehta hai — is window mein koi bhi access, `typeof` bhi, `ReferenceError` deta hai. Jo naam kabhi declare hi nahi hua uspe `typeof` ek historical safe case hai: wo crash nahi karta, `\"undefined\"` string deta hai. Yahi TDZ ka signature farak hai.",
    difficulty: "medium",
  },
  {
    id: "hoisting-and-tdz-3",
    question: "Function declaration ko uski definition se pehle call karna kaise chal jaata hai?",
    options: [
      "JS us call ko delay karke definition ke baad chalata hai",
      "Creation phase (phase 1) mein poori function body naam ke saath memory mein aa jaati hai, execution shuru hone se pehle",
      "Engine file ko do baar execute karta hai",
      "Ye chalta hi nahi — hamesha `ReferenceError` aata hai",
    ],
    correctIndex: 1,
    explanation:
      "Phase 1 mein engine poore scope ko scan karke function declarations ko naam + poori body ke saath ready kar deta hai. Isliye phase 2 mein jab lines chalti hain, call se pehle hi function available hota hai. Function expression (`const f = ...`) ke saath aisa nahi hota — sirf naam hoist hota hai, body assignment line par milti hai.",
    difficulty: "medium",
  },
  {
    id: "hoisting-and-tdz-4",
    question: "Top-level par `let x = x + 1;` likhne se kya hota hai?",
    options: [
      "`x` ban jaata hai `NaN`",
      "`x` ban jaata hai `undefined`",
      "`ReferenceError` — right-hand side ka `x` abhi TDZ mein hai",
      "`SyntaxError` parse ke time",
    ],
    correctIndex: 2,
    explanation:
      "`let x` ka binding ban chuka hai par wo initialise tabhi hoga jab `=` ki right side evaluate ho jaaye. Right side ka `x` usi binding ko refer karta hai jo abhi TDZ mein hai (initialisation line chal rahi hai, khatam nahi hui) -> `ReferenceError`. `var x = x + 1` hota to `NaN` milta (`undefined + 1`). Syntax valid hai, error runtime par aata hai.",
    difficulty: "hard",
  },
];

export default quiz;
