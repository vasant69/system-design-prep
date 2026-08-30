import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cab-1",
    question: "`call`, `apply` aur `bind` mein kya farak hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Teeno `this` explicitly set karte hain. `call` aur `apply` function ko turant invoke karte hain — `call(thisArg, a, b)` args individually, `apply(thisArg, [a, b])` args array mein (A = Array). `bind(thisArg, ...preArgs)` invoke nahi karta — ek naya function return karta hai jiska `this` permanently fixed hai, optionally kuch leading args pre-filled (partial application).",
    detailedAnswer:
      "`call` vs `apply`: sirf argument passing ka farak. `greet.call(user, 'Hi', '!')` === `greet.apply(user, ['Hi', '!'])`. `apply` tab handy jab args pehle se ek array mein hon (`Math.max.apply(null, nums)`) — spread operator se pehle yahi variadic-array trick tha. `bind`: `const sayHi = greet.bind(user, 'Hi')` — `sayHi('!')` baad mein call hota hai, `this` hamesha `user`, `'Hi'` pehle se locked. Bind ek naya exotic function object banata hai jo target + fixed this + preArgs store karta hai. Gotchas: bound function re-bind nahi hota; `new BoundFn()` bound `this` ignore karta hai (preArgs rakhta hai); har `.bind()` call naya object deta hai (React identity / removeEventListener issue).",
    followUp:
      "`Math.max.apply(null, nums)` ko modern JS mein kaise likhoge?",
    redFlag:
      "\"bind function ko call bhi kar deta hai\" — nahi, bind sirf naya function return karta hai.",
  },
  {
    id: "cab-2",
    question:
      "Method borrowing kya hai? `Array.prototype.slice.call(arguments)` kya karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Method borrowing = ek object ke method ko doosre object pe chalana `call`/`apply` se `this` set karke. `Array.prototype.slice.call(arguments)` `slice` ko borrow karke uska `this` `arguments` bana deta hai, aur `arguments` (array-like) ki ek real array copy return karta hai.",
    detailedAnswer:
      "`arguments`, `NodeList`, `HTMLCollection`, strings — ye 'array-like' hain (`length` + numeric indices) par `Array.prototype` methods nahi rakhte. `slice` ka implementation sirf `this.length` aur `this[i]` use karta hai — usse farak nahi padta ki `this` asli array hai ya nahi. `Array.prototype.slice.call(arguments)` bina start/end args ke `slice` chalata hai `this = arguments` ke saath -> element-by-element ek naya real array. `[].slice.call(...)` bhi wahi (chhota). `[].forEach.call(nodeList, fn)` NodeList pe iterate karta hai. Modern replacements: `Array.from(arrayLike)`, spread `[...arrayLike]` (agar iterable ho), ya rest param. Interview mein ye 'array-like vs array' aur `this`-borrowing dono test karta hai.",
    followUp:
      "`Array.from` aur `[...arguments]` mein kaunsa NodeList pe kaam karega aur kaunsa nahi — kyun?",
  },
  {
    id: "cab-3",
    question:
      "`bind` se partial application kaise karte hain? Ek example do.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`bind` ka doosra aur aage ke arguments target function ke leading parameters pe pre-fill ho jaate hain. `const add = (a, b) => a + b; const add5 = add.bind(null, 5); add5(10) // 15`. `this` yahan use nahi ho raha isliye `null` pass karte hain.",
    detailedAnswer:
      "Partial application = ek multi-arg function ke kuch args ab fix karo, baaki baad mein do. `function log(level, module, msg) { console.log(`[${level}][${module}] ${msg}`); }` — `const errLog = log.bind(null, 'ERROR'); const authErr = errLog.bind(null, 'AUTH'); authErr('login failed')` -> `[ERROR][AUTH] login failed`. Har `bind` ek aur leading arg lock karta hai. `this` ki zarurat na ho to first arg `null` (ya `undefined`). Alternative jo zyada explicit hai: arrow closure — `const add5 = x => add(5, x)`. Libraries `_.partial` / `_.curry` isko generalize karti hain. Note: bound preArgs `new` ke saath bhi rehte hain, sirf bound `this` ignore hota hai.",
    followUp:
      "`bind(null, 5)` aur `x => add(5, x)` — dono partial karte hain; ek concrete farak batao.",
  },
  {
    id: "cab-4",
    question:
      "`bind` ka koi downside ya gotcha bataiye jise dev aksar miss karte hain.",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Har `.bind()` call ek naya function object return karta hai. Isliye `el.addEventListener('click', fn.bind(this))` ke baad `el.removeEventListener('click', fn.bind(this))` kaam nahi karta — dono alag references hain. React mein inline `.bind` har render naya function deta hai, jo memoized children ko re-render karwa deta hai.",
    detailedAnswer:
      "Bound function ki identity original se alag hoti hai aur har bind call pe nayi hoti hai. Practical consequences: (1) Event listeners — bound reference ko ek variable/field mein store karo (`this.onClick = this.onClick.bind(this)` constructor mein), tabhi baad mein remove kar paoge. (2) React — `onClick={this.save.bind(this)}` JSX inline har render pe naya function; `React.memo`/`shouldComponentUpdate` prop-changed dekhte hain -> wasted renders. Fix: constructor bind ya class field arrow. (3) Re-bind — bound function ko dobara bind ya `.call`/`.apply` karo to bound `this` badalta nahi. (4) `new` — `new BoundFn()` bound `this` ko throw kar deta hai aur fresh object use karta hai (par preArgs rakhta hai) — polyfill likhte waqt ye handle karna padta hai. (5) `bound.name` `'bound '` prefix ke saath aata hai aur `bound.length` preArgs ke hisaab se ghat jaata hai.",
    followUp:
      "Apna `bind` polyfill likhte waqt `new` wale case ko kaise handle karoge?",
  },
  {
    id: "cab-5",
    question:
      "Aaj ke JavaScript mein `apply` aur `bind` ki jagah kya use karoge, aur kab abhi bhi ye better hain?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`apply`-for-array-spread ki jagah spread operator: `fn(...arr)`. `bind`-for-lexical-this ki jagah arrow function: `() => obj.method()`. Par `apply` abhi bhi tab useful jab tum dynamically `this` + array-args dono forward kar rahe ho; `bind` tab jab ek stable reusable bound reference chahiye (event listener add/remove) ya partial application.",
    detailedAnswer:
      "Replacements: `Math.max.apply(null, nums)` -> `Math.max(...nums)` — koi `null` jugaad nahi, clearer. `setTimeout(this.tick.bind(this), 1000)` -> `setTimeout(() => this.tick(), 1000)` — arrow lexical `this`, readable. Jahan purana form abhi bhi jeetta hai: (1) `fn.apply(ctx, argsArray)` jab `ctx` aur `argsArray` dono runtime pe aa rahe hain aur tum ek generic wrapper likh rahe ho (decorator/proxy) — spread `this` set nahi karta. (2) `bind` jab tumhe ek function reference chahiye jo baad mein use hoga aur uski identity stable rehni chahiye — `this.handler = this.handler.bind(this)` taaki `addEventListener` aur `removeEventListener` dono usi reference ko dekhein; arrow-wrap har baar naya function deta. (3) Partial application jahan `this` bhi lock karna ho.",
    followUp:
      "Ek generic `function wrap(fn) { return function (...args) { return fn.apply(this, args); }; }` — yahan `apply` ko spread se kyun nahi replace kar sakte poori tarah?",
  },
];

export default questions;
