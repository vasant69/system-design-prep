import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "htdz-1",
    question:
      "Hoisting kya hai? `var`, `let`/`const` aur function declaration ka hoisting behaviour alag-alag batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Hoisting = har scope do phase mein chalta hai; phase 1 mein saare declarations register hote hain. `var` init hota hai `undefined` se (pehle read = undefined). Function declaration poori body ke saath hoist (pehle call = chal jaata hai). `let`/`const` naam reserve par TDZ mein, declaration line tak koi access = ReferenceError.",
    detailedAnswer:
      "Engine har scope ko enter karte hi ek creation phase chalata hai jisme wo saare `var`, function, `let`, `const`, `class` naam register kar leta hai. `var` ko turant `undefined` mil jaata hai — isliye declaration se pehle read karne par crash nahi, chup-chaap `undefined`. Function declaration poori (naam + body) store ho jaati hai — isliye use define karne se pehle call kar sakte ho. `let`/`const`/`class` bhi register hote hain par 'uninitialised' state mein — inhe declaration line se pehle chhoona (`typeof` samet) `ReferenceError` deta hai; is gap ko Temporal Dead Zone kehte hain. Function expression (`const f = () => {}`) sirf apne binding jitna hoist hota hai (yani `const` ki tarah TDZ), body assignment line par aati hai.",
    followUp: "TDZ ka crash `var` ke silent `undefined` se behtar kaise hai?",
    redFlag:
      "\"Declarations physically file ke top par move ho jaati hain\" — code move nahi hota, sirf creation phase mein naam register hote hain.",
  },
  {
    id: "htdz-2",
    question: "`console.log(a); console.log(b); var a = 1; let b = 2;` — line by line kya hoga?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Pehli line: `undefined` (var `a` hoist hoke undefined). Doosri line: `ReferenceError` (let `b` abhi TDZ mein). Execution doosri line par ruk jaata hai.",
    detailedAnswer:
      "Creation phase mein `a` aur `b` dono register hote hain, par `a` ko `undefined` milta hai jabki `b` uninitialised rehta hai. Phase 2 mein `console.log(a)` -> `undefined` print. `console.log(b)` par engine dekhta hai ki `b` abhi TDZ mein hai (uski `let b = 2` line abhi nahi chali) aur `ReferenceError: Cannot access 'b' before initialization` throw karta hai. Agar `let b` ki jagah `var b` hota to yeh bhi `undefined` deta.",
    followUp: "`var b` hota to output kaise badalta?",
  },
  {
    id: "htdz-3",
    question:
      "`typeof` ek undeclared variable par `\"undefined\"` deta hai, par TDZ wale variable par `ReferenceError`. Kyun?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`typeof` ka undeclared naam par safe behaviour ek purana design decision hai (feature detection ke liye). TDZ wala naam 'undeclared' nahi hai — wo declared hai par abhi uninitialised, aur spec kehta hai aise naam ko touch karna (`typeof` samet) ReferenceError de.",
    detailedAnswer:
      "Do alag situations hain. (1) Naam kahin declare hi nahi — historically `typeof x` ise `\"undefined\"` deta hai bina crash ke, taaki `if (typeof SomeGlobal !== \"undefined\")` jaisa feature detection likha ja sake. (2) Naam declare hai (`let`/`const`) par abhi TDZ mein — yeh 'exists but not ready' state hai; spec ne decide kiya ki aise naam par har access, including `typeof`, `ReferenceError` de, kyunki silent `undefined` wapas wahi bug chhupata jo `let` fix karne aaya tha.",
    followUp: "TDZ design mein kyun rakha gaya — spec sirf `undefined` de deta to kya bura tha?",
  },
  {
    id: "htdz-4",
    question:
      "Ek module mein helper functions ko file ke neeche rakhna hai par main logic upar. Kya safe hai, kya nahi?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Function declarations (`function helper() {}`) neeche rakhna bilkul safe hai — poori hoist hoti hain, upar call chal jaata hai. Arrow / function-expression helpers (`const helper = () => {}`) neeche rakhoge to upar call par `ReferenceError` (TDZ) milega.",
    detailedAnswer:
      "Function declaration ka pura body phase 1 mein available ho jaata hai, isliye 'define-after-use' pattern legit hai aur readability ke liye common bhi (top-level narrative upar, details neeche). Lekin agar helper `const`/`let` se bana arrow ya function expression hai, wo apne declaration tak TDZ mein rehta hai — pehle use karoge to crash. `class` bhi hoist hoke TDZ mein rehti hai, to class ko use se pehle define karna zaroori hai. Rule of thumb: agar 'upar use, neeche define' chahiye to function declaration use karo.",
    followUp: "`class` declaration hoist hoti hai ya nahi?",
  },
];

export default questions;
