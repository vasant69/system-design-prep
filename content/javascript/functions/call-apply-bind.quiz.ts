import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "call-apply-bind-1",
    question:
      "`call` aur `apply` mein exact farak kya hai?",
    options: [
      "call this set karta hai, apply nahi",
      "Dono function ko turant chalate hain aur this set karte hain; farak sirf args ka — call args individually leta hai, apply ek array mein",
      "apply naya function return karta hai, call turant chalata hai",
      "call sirf methods pe kaam karta hai, apply har function pe",
    ],
    correctIndex: 1,
    explanation:
      "`call` aur `apply` dono function ko us waqt invoke karte hain aur `this` ko diya gaya `thisArg` bana dete hain. Sirf argument passing alag hai: `fn.call(obj, 1, 2, 3)` vs `fn.apply(obj, [1, 2, 3])` (A = Array). Option C `bind` ka behaviour hai. Option A/D galat — dono `this` set karte hain aur har function pe available hain.",
    difficulty: "easy",
  },
  {
    id: "call-apply-bind-2",
    question:
      "`function f() { return this.x; } const g = f.bind({ x: 1 }); const h = g.bind({ x: 2 }); console.log(h());` — output?",
    options: [
      "2 — dobara bind se this update ho jaata hai",
      "1 — bound function re-bind nahi hota, pehla bind hi jeetta hai",
      "undefined",
      "TypeError",
    ],
    correctIndex: 1,
    explanation:
      "`bind` ek baar hone ke baad bound `this` permanently fix ho jaata hai. `g` `this` `{ x: 1 }` pe locked hai. `g.bind({ x: 2 })` ek naya function `h` deta hai, par uska `this` change karne ki koshish ignore hoti hai — `h()` bhi `1` deta hai. Yahi 'bound function cannot be re-bound' rule hai; `.call`/`.apply` bhi bound `this` ko override nahi kar paate.",
    difficulty: "medium",
  },
  {
    id: "call-apply-bind-3",
    question:
      "`arguments` (array-like) ko ek real array banane ka classic pre-ES6 tarika kya tha?",
    options: [
      "arguments.toArray()",
      "Array.prototype.slice.call(arguments) — slice ko borrow karke uska this arguments bana dena",
      "new Array(arguments)",
      "arguments.map(x => x)",
    ],
    correctIndex: 1,
    explanation:
      "`arguments` pe array methods nahi hote. `Array.prototype.slice.call(arguments)` `slice` ko borrow karta hai aur uska `this` `arguments` set kar deta hai; bina args ke `slice` poori shallow copy banata hai — result ek real array. Option D fail hota hai kyunki `arguments.map` exist nahi karta. Modern equivalents: `Array.from(arguments)`, `[...arguments]`, ya rest param `(...args)`.",
    difficulty: "medium",
  },
  {
    id: "call-apply-bind-4",
    question:
      "React class component mein `onClick={this.save.bind(this)}` (JSX mein inline) ka downside kya hai?",
    options: [
      "this galat bind hota hai",
      "Har render pe ek naya function object banta hai, jisse memo/PureComponent child bewajah re-render karte hain",
      "bind JSX mein kaam nahi karta",
      "save method mutate ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`this.save.bind(this)` har call pe ek naya function object return karta hai. JSX inline hone se ye har render pe chalta hai — `onClick` prop ki identity har baar badalti hai, to `React.memo`/`PureComponent` wale children ko prop-changed dikhta hai aur wo re-render karte hain. Fix: constructor mein ek baar `this.save = this.save.bind(this)`, ya class field arrow `save = () => {}`.",
    difficulty: "medium",
  },
];

export default quiz;
