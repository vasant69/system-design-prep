import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cab-1",
    question: "call, apply aur bind ka farak, aur kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Teeno function ka this explicitly set karte hain. call: this + comma args, turant run. apply: this + args array, turant run. bind: run nahi karta, ek naya function return karta hai jiska this (aur leading args) fix ho jaate hain.",
    detailedAnswer:
      "call aur apply behaviour mein identical hain, sirf args dene ka tarika alag: `fn.call(ctx, a, b)` vs `fn.apply(ctx, [a, b])`. apply tab use karo jab args pehle se array mein hain ya variadic forwarding karni ho. bind alag hai — wo eager execution nahi karta, ek bound function deta hai jise baad mein kabhi call kar sakte ho; iska use hai callback ka this lock karna (`el.addEventListener('click', obj.handler.bind(obj))`) aur partial application (`add.bind(null, 5)`). Modern spread syntax ne apply ki bahut si zarurat khatam kar di (`Math.max(...arr)`), par method borrowing aur bind abhi bhi common hain.",
    followUp: "bind hua function dobara bind karne se this badalta hai?",
    redFlag: "\"bind bhi function ko turant chala deta hai\" — bind kabhi invoke nahi karta.",
  },
  {
    id: "cab-2",
    question:
      "`Array.prototype.slice.call(arguments)` ka matlab samjhao — ye kyun likha jaata tha?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "arguments ek array-like object hai (length aur index hain, par slice/map jaise array methods nahi). slice ko call se udhaar lete hain aur uska this arguments pe point karte hain — result ek real array ban jaata hai.",
    detailedAnswer:
      "Purane function-based code mein arguments pe seedha `.map()` ya `.slice()` nahi chalta kyunki wo Array nahi hai. `Array.prototype.slice.call(arguments)` slice method ko borrow karta hai aur uska this arguments bana deta hai — slice bina start/end ke poore array-like ko copy karke ek naya real Array return karta hai. Aajkal iski jagah `Array.from(arguments)` ya rest parameter `function f(...args)` use hota hai, jo seedha real array deta hai.",
    followUp: "Aaj arguments ko array banane ka modern tarika kya hai?",
  },
  {
    id: "cab-3",
    question:
      "Class ya DOM handler mein this kho jaata hai. bind se kaise fix karoge, aur bind ka cost kya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Handler ko constructor mein ek baar `this.onClick = this.onClick.bind(this)` karo, ya class field arrow use karo. Cost: har bind ek naya function object banata hai, isliye render ke andar inline `.bind(this)` har baar naya reference deta hai jo memoized children ko bewajah re-render karwa sakta hai.",
    detailedAnswer:
      "Problem: `element.addEventListener('click', obj.onClick)` mein onClick object se detach ho jaata hai, call ke waqt this undefined. Fix: (1) ek baar bind karke stable reference store karo; (2) class field arrow `onClick = () => {}` — lexical this, single reference. Anti-pattern: render/JSX ke andar `onClick={this.onClick.bind(this)}` — har render pe naya function, child ke props badalne se unnecessary re-render. bind ka raw runtime cost chhota hai, par reference stability zyada matter karti hai.",
    followUp: "Inline arrow `onClick={() => this.onClick()}` ka bhi wahi reference problem hai?",
  },
  {
    id: "cab-4",
    question:
      "`const bound = fn.bind(a, 1); bound.call(b, 2);` — fn ke andar this aur arguments kya honge?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "this === a (bind ke baad call ka context ignore hota hai). Arguments: pehle bind ka 1, phir call ka 2 — yaani fn ko (1, 2) milta hai.",
    detailedAnswer:
      "bind do cheezein lock karta hai: this aur leading (partial) arguments. Ek baar bound hone ke baad us function pe call/apply/bind sirf extra arguments append kar sakte hain — this hamesha wahi rehta hai jo pehle bind mein diya gaya (`a`). To `bound.call(b, 2)` mein `b` discard ho jaata hai aur fn ko `(1, 2)` milta hai `this === a` ke saath. Yahi wajah hai ki already-bound library callbacks ko aap re-point nahi kar sakte.",
    followUp: "Arrow function pe call/apply/bind ka this argument kya asar dalta hai?",
  },
];

export default questions;
