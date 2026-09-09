import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "destructuring-spread-rest-1",
    question: "`const { x = 5 } = { x: null };` — `x` ki value kya hogi?",
    options: ["`5`", "`null`", "`undefined`", "`TypeError`"],
    correctIndex: 1,
    explanation:
      "Destructuring default SIRF tab lagti hai jab property `undefined` ho (missing ya explicitly undefined). Yahan `x` `null` hai — jo `undefined` nahi hai — isliye default `5` ignore ho jaata hai aur `x === null`. `0`, `''`, `false`, `NaN` pe bhi default nahi lagti; sirf `undefined` pe.",
    difficulty: "medium",
  },
  {
    id: "destructuring-spread-rest-2",
    question:
      "`const [a, ...b] = [1, 2, 3]` aur `foo(...[1, 2, 3])` — dono mein `...` ka role?",
    options: [
      "Dono jagah spread (expand)",
      "Dono jagah rest (collect)",
      "Pehle mein rest (`b = [2, 3]` collect), doosre mein spread (`foo(1, 2, 3)` expand)",
      "Pehle mein spread, doosre mein rest",
    ],
    correctIndex: 2,
    explanation:
      "Position se pata chalta hai: `...` agar assignment ke left side ya function parameter list mein hai to REST — bache elements ko array mein samet leta hai (`b = [2, 3]`). Agar `...` kisi call, array literal, ya object literal ke andar hai to SPREAD — contents ko bahar phaila deta hai (`foo(1, 2, 3)`). Syntax same, jagah alag.",
    difficulty: "easy",
  },
  {
    id: "destructuring-spread-rest-3",
    question:
      "`const copy = { ...original };` ke baad `copy.list.push(9)` — `original.list` pe kya asar?",
    options: [
      "Kuch nahi — `copy` poori tarah independent hai",
      "`original.list` mein bhi `9` aa jaata hai — spread shallow hai, nested `list` same reference",
      "`TypeError` — spread ke baad nested arrays frozen ho jaate hain",
      "`copy.list` `undefined` ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`{ ...original }` sirf top-level properties copy karta hai. `list` ek nested array hai — uski value ek reference hai jo copy to ho jaata hai, par point dono wahi ek array pe karte hain. To `copy.list.push(9)` `original.list` ko bhi badal deta hai. Deep independence ke liye har nested level explicitly copy karo ya `structuredClone`.",
    difficulty: "medium",
  },
  {
    id: "destructuring-spread-rest-4",
    question:
      "State `{ user: { name, age }, theme }` mein sirf `age` badalna hai bina mutate kiye. Sahi expression?",
    options: [
      "`state.user.age = newAge`",
      "`{ ...state, age: newAge }`",
      "`{ ...state, user: { ...state.user, age: newAge } }`",
      "`{ user: { age: newAge } }`",
    ],
    correctIndex: 2,
    explanation:
      "`state.user.age = newAge` direct mutation hai — React re-render trigger nahi karega aur undo/history tootega. `{ ...state, age: newAge }` `age` ko galat level pe (top pe) daal deta hai, `user.age` waisa hi rehta hai. `{ user: { age: newAge } }` baaki sab (`theme`, `user.name`) gira deta hai. Sahi: har badalne wale level ko spread karo — outer aur `user` dono.",
    difficulty: "medium",
  },
];

export default quiz;
