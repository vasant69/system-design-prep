import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "higher-order-functions-1",
    question: "In mein se kaunsa higher-order function ka sabse sateek definition hai?",
    options: [
      "Jo function bahut saare arguments leta hai",
      "Jo function ya to kisi function ko argument leta hai, ya function return karta hai, ya dono",
      "Jo function `class` ke andar define hota hai",
      "Jo function recursion use karta hai",
    ],
    correctIndex: 1,
    explanation:
      "HOF ki definition sirf functions ke input/output pe hai: function-as-argument (jaise `map`, `filter`, `setTimeout`) ya function-as-return (jaise ek factory), ya dono (decorator). Arguments ki sankhya, class membership, ya recursion se koi lena-dena nahi.",
    difficulty: "easy",
  },
  {
    id: "higher-order-functions-2",
    question:
      "`setTimeout(greet(), 1000)` aur `setTimeout(greet, 1000)` — farak kya hai?",
    options: [
      "Dono bilkul same hain",
      "Pehla `greet` ko abhi chala kar uska return value schedule karta hai; doosra `greet` ko 1s baad chalata hai",
      "Pehla 1s baad chalata hai; doosra abhi",
      "Dono syntax error hain",
    ],
    correctIndex: 1,
    explanation:
      "`greet()` ka matlab hai 'greet ko abhi call karo aur uska result do'. To `setTimeout(greet(), 1000)` greet ko turant chala deta hai aur uska return (usually `undefined`) timer ko de deta hai. Callback dene ke liye reference chahiye: `setTimeout(greet, 1000)`. Ye HOF ke saath sabse common galti hai.",
    difficulty: "easy",
  },
  {
    id: "higher-order-functions-3",
    question:
      "`function power(exp) { return (n) => n ** exp; } const square = power(2); square(5);` — output, aur `exp` kahan se aaya?",
    options: [
      "`25` — inner arrow ne `exp` (= 2) ko closure mein capture kiya",
      "`10` — `exp` ignore ho gaya",
      "`ReferenceError` — `power` return hone ke baad `exp` gayab",
      "`NaN`",
    ],
    correctIndex: 0,
    explanation:
      "`power(2)` ek inner function return karta hai jo `exp` ko closure mein yaad rakhta hai, `power` ke return ho jaane ke baad bhi. `square(5)` -> `5 ** 2` = `25`. Yahi factory pattern hai: HOF config (`exp`) fix karke ek specialised function banata hai.",
    difficulty: "medium",
  },
  {
    id: "higher-order-functions-4",
    question:
      "Ek array ke har item pe validation chalani hai aur code reusable rakhna hai. HOF approach kya hai?",
    options: [
      "Har jagah alag-alag `for` loop copy-paste karo",
      "Ek `validateAll(items, validatorFn)` banao jo `validatorFn` ko har item pe chalaye — validator alag se pass ho",
      "Validation ko `validateAll` ke andar hardcode kar do",
      "`eval()` use karke rule ki string chalao",
    ],
    correctIndex: 1,
    explanation:
      "HOF ka core fayda: 'kaise iterate karna hai' (loop) ek jagah, 'kya check karna hai' (validator) alag se inject. `validateAll(items, isEmail)`, `validateAll(items, isNonEmpty)` — same iteration, alag rules, zero duplication. Hardcode karne se reusability khatam; `eval` security aur performance dono ke liye kharab.",
    difficulty: "medium",
  },
];

export default quiz;
