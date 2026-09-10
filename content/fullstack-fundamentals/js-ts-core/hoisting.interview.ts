import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ho-1",
    question: "Kya `let` aur `const` hoisted hain? Apna jawab justify karo.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Haan. Binding scope enter hote hi ban jaati hai par declaration line tak uninitialised rehti hai — us gap me access karne par `ReferenceError` (temporal dead zone). Agar wo bilkul hoisted na hoti, to reference outer-scope variable par resolve ho jaata, throw nahi karta.",
    detailedAnswer:
      "`var` se farak initialisation hai, registration nahi. `var` top par `undefined` se initialise hota hai; `let`/`const` tab tak nahi jab tak execution wahan na pahunche. Toh sahi statement hai 'hoisted par not initialised', aur TDZ observable proof hai.",
    followUp: "`typeof someLetVariable` uski declaration line se pehle safe hai?",
  },
  {
    id: "ho-2",
    question: "Output predict karo: `foo(); function foo(){console.log(1)} bar(); var bar = function(){console.log(2)}`.",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "`1`, phir `TypeError: bar is not a function`. Function declaration `foo` poora hoist hota hai isliye `foo()` chalta hai. `bar` ek `var` hai jo `undefined` hoist hota hai, aur function baad me assign hota hai, isliye jaldi call karne par throw.",
    detailedAnswer:
      "Ye function declarations aur function expressions ke beech ka canonical farak hai. Declarations naam aur body lift karti hain; expressions sirf variable lift karte hain apne `var`/`let` rules se. Same code `let bar` ke saath `bar()` par `ReferenceError` deta, TDZ ki wajah se.",
  },
  {
    id: "ho-3",
    question: "Modern code style 'variables ko wahin declare karo jahan use karo' function ke top par nahi — kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`let`/`const` aur block scope ke saath, first use ke paas declare karne se variable ka live range chhota rehta hai, TDZ confusion avoid hoti hai, aur code hoisting rules jaane bina top se bottom padha jaata hai. Purani 'var top par' convention sirf isliye thi kyunki `var` waise bhi hoist ho jaata tha.",
    detailedAnswer:
      "`var` ka function scope matlab nested block me declare variable har jagah visible tha, isliye log declarations manually hoist karte the reality se match karne ke liye. `let`/`const` ne wo reason hata diya. Chhote scopes accidental reuse bhi kam karte hain aur refactoring safe banate hain.",
  },
];

export default questions;
