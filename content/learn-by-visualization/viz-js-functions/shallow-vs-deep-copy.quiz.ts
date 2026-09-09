import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "shallow-vs-deep-copy-1",
    question:
      "`a = { list: [1, 2] }; const b = { ...a }; b.list.push(3);` — ab `a.list` kya hai?",
    options: ["`[1, 2]`", "`[1, 2, 3]`", "`undefined`", "`TypeError`"],
    correctIndex: 1,
    explanation:
      "`{ ...a }` shallow copy hai — `b` naya object hai par `b.list` aur `a.list` ek hi array point karte hain. `b.list.push(3)` usi shared array ko mutate karta hai, to `a.list` bhi `[1, 2, 3]` ho jaata hai. Sirf top-level primitive (jaise `a.id`) hote to safe rehte.",
    difficulty: "easy",
  },
  {
    id: "shallow-vs-deep-copy-2",
    question:
      "`JSON.parse(JSON.stringify(obj))` deep copy ke liye — iski sabse badi kami kya hai?",
    options: [
      "Ye bahut fast hai, koi kami nahi",
      "Functions, `undefined`, `Date` (string ban jaati hai), `Map`/`Set`, `BigInt` (throw) aur circular refs (throw) sahi copy nahi hote",
      "Ye sirf arrays pe chalta hai",
      "Ye original ko mutate kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "JSON round-trip sirf JSON-representable data (plain objects, arrays, string, number, boolean, null) pe sahi kaam karta hai. Functions aur `undefined` values gayab ho jaati hain, `Date` ISO string ban jaati hai, `Map`/`Set` `{}` ban jaate hain, `BigInt` aur circular reference `TypeError` throw karte hain. Isliye modern code `structuredClone` prefer karta hai.",
    difficulty: "medium",
  },
  {
    id: "shallow-vs-deep-copy-3",
    question: "`structuredClone` kya sahi se clone NAHI kar paata?",
    options: [
      "Nested arrays aur plain objects",
      "`Date`, `Map`, `Set`, aur circular references",
      "Functions, DOM nodes (DataCloneError), aur class instance ke methods/prototype/`#private` fields (plain object ban jaata hai)",
      "Numbers aur strings",
    ],
    correctIndex: 2,
    explanation:
      "`structuredClone` `Date`, `Map`, `Set`, `ArrayBuffer`, typed arrays, aur circular refs — sab sahi handle karta hai (JSON hack in sab pe fail hota tha). Par functions aur DOM nodes pe wo `DataCloneError` throw karta hai, aur class instance ka clone ek plain object ban jaata hai — prototype, methods, aur `#private` fields chale jaate hain. Getters/setters bhi as plain values copy hote hain.",
    difficulty: "hard",
  },
  {
    id: "shallow-vs-deep-copy-4",
    question:
      "React state mein `state.items[0].done` toggle karna hai bina mutate kiye. Sabse chhota sahi tarika?",
    options: [
      "`state.items[0].done = !state.items[0].done`",
      "`structuredClone(state)` phir toggle — poora tree har update pe clone",
      "Sirf changing path ko copy: naya `items` array + us ek item ka `{ ...item, done: !item.done }`, baaki items same reference",
      "`{ ...state }` hi kaafi hai",
    ],
    correctIndex: 2,
    explanation:
      "Immutability ke liye poora deep copy zaroori nahi — sirf woh path jo change ho raha hai. Naya `items` array (`state.items.map(...)`), aur us ek item ke liye `{ ...item, done: !item.done }`; baaki items apna purana reference rakhte hain (fast + memoization-friendly). Direct mutation React ko change nahi dikhata; `structuredClone` har update pe unnecessary aur slow; `{ ...state }` nested `items` ko share hi chhod deta hai.",
    difficulty: "medium",
  },
];

export default quiz;
