import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "call-apply-bind-1",
    question: "`fn.call` aur `fn.apply` mein exact farak kya hai?",
    options: [
      "`call` `this` set karta hai, `apply` nahi karta",
      "Dono `this` set karke turant chalate hain; `call` args comma-separated leta hai, `apply` ek array leta hai",
      "`call` naya function return karta hai, `apply` turant chalata hai",
      "`apply` sirf arrays pe kaam karta hai, `call` sirf objects pe",
    ],
    correctIndex: 1,
    explanation:
      "Dono ka kaam identical hai — `this` explicitly set karo aur function ko usi waqt invoke karo. Sirf argument-passing ka tareeka alag: `fn.call(ctx, a, b, c)` vs `fn.apply(ctx, [a, b, c])`. `apply` tab handy hai jab args pehle se ek array mein hain. Naya function toh `bind` return karta hai, `call`/`apply` nahi.",
    difficulty: "easy",
  },
  {
    id: "call-apply-bind-2",
    question: "`const f = greet.bind(obj);` ke baad kya `greet` chal chuka hota hai?",
    options: [
      "Haan, `bind` `greet` ko turant invoke kar deta hai",
      "Nahi — `bind` sirf ek naya function `f` banata hai; `greet` tab chalega jab tum `f()` call karoge",
      "Haan, par sirf strict mode mein",
      "Nahi, `bind` `greet` ko permanently disable kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`bind` invoke nahi karta — wo ek naya function object return karta hai jiska `this` `obj` pe permanently locked hai. Original `greet` untouched rehta hai. Jab tum `f()` call karoge tab actual execution hoga, `this === obj` ke saath. Yahi `call`/`apply` se sabse bada farak hai.",
    difficulty: "easy",
  },
  {
    id: "call-apply-bind-3",
    question:
      "`function add(a, b) { return a + b; } const add5 = add.bind(null, 5); add5(3);` — output?",
    options: ["`8`", "`5`", "`NaN`", "`[5, 3]`"],
    correctIndex: 0,
    explanation:
      "`bind` ke doosre argument se aage jo bhi ho, wo bound function ke leading arguments ban jaate hain (partial application). `add.bind(null, 5)` matlab `a` hamesha `5`. Phir `add5(3)` mein `3` `b` ban jaata hai -> `5 + 3` = `8`. `this` yahan `null` hai kyunki `add` `this` use hi nahi karta.",
    difficulty: "medium",
  },
  {
    id: "call-apply-bind-4",
    question:
      "`const bound = fn.bind(objA); bound.call(objB);` — `fn` ke andar `this` kaun hoga?",
    options: [
      "`objB` — `call` hamesha jeet jaata hai",
      "`objA` — ek baar `bind` ho gaya to baad ke `call`/`apply`/`bind` `this` ko override nahi kar sakte",
      "`undefined`",
      "`globalThis`",
    ],
    correctIndex: 1,
    explanation:
      "Bound function ka `this` permanently fix ho jaata hai. Uspe dobara `call`, `apply`, ya `bind` lagane se `this` nahi badalta — sirf naye arguments append hote hain. Isliye `bound.call(objB)` mein bhi `this === objA`. Arrow functions ke saath bhi yahi — teeno methods unke lexical `this` ko override nahi kar paate.",
    difficulty: "medium",
  },
];

export default quiz;
