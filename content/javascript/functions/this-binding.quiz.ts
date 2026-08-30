import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "this-binding-1",
    question:
      "`const o = { x: 10, get() { return this.x; } }; const g = o.get; console.log(o.get(), g());` — (strict mode) output?",
    options: [
      "10 10",
      "10 aur phir TypeError — g() standalone call hai, this undefined, this.x crash",
      "10 undefined",
      "undefined undefined",
    ],
    correctIndex: 1,
    explanation:
      "`o.get()` — implicit binding, dot ke left `o`, isliye `this.x` = 10. `const g = o.get` sirf function reference copy karta hai; `g()` standalone call hai — koi dot, koi new, koi call nahi — to default binding: strict mode mein `this` `undefined`, aur `undefined.x` `TypeError` deta hai. Yahi 'method ko variable/callback mein rakhne' wala classic bug hai.",
    difficulty: "medium",
  },
  {
    id: "this-binding-2",
    question:
      "`this` ke 4 binding rules ka precedence order (highest pehle) kya hai?",
    options: [
      "implicit (obj.method) > new > explicit (call/bind) > default",
      "new > explicit (call/apply/bind) > implicit (obj.method) > default",
      "default > implicit > explicit > new",
      "explicit > new > default > implicit",
    ],
    correctIndex: 1,
    explanation:
      "`new` sabse pehle — naya object banta hai aur wahi `this`. Phir explicit `call`/`apply`/`bind` — diya gaya object. Phir implicit `obj.method()` — dot ke left ka object. Sabse aakhir default — strict mode `undefined`, sloppy global. Arrow functions in sab ko bypass karke `this` lexically enclosing scope se lete hain.",
    difficulty: "medium",
  },
  {
    id: "this-binding-3",
    question:
      "Class method ke andar `setInterval(function () { this.n++; }, 1000)` `this.n` ko `NaN` bana deta hai. Sabse saaf fix?",
    options: [
      "setInterval ko setTimeout se replace karo",
      "Callback ko arrow bana do: setInterval(() => { this.n++; }, 1000) — arrow lexically constructor ka this leta hai",
      "this.n ko globally declare karo",
      "n ko string bana do",
    ],
    correctIndex: 1,
    explanation:
      "`setInterval` apne regular-function callback ko standalone call karta hai — koi dot nahi — to `this` `undefined`/global, instance nahi, aur `undefined.n++` `NaN` deta hai. Arrow callback ka apna `this` nahi hota; wo enclosing constructor ka `this` (instance) lexically leta hai, to `this.n` sahi property hai. `.bind(this)` ya `const self = this` bhi kaam karte hain par arrow sabse readable.",
    difficulty: "medium",
  },
  {
    id: "this-binding-4",
    question:
      "`function f() { return this; }` — `f()`, `new f()`, `f.call('hi')` (strict mode) mein `this` kya hai?",
    options: [
      "Teeno mein global object",
      "undefined; naya object; 'hi' (boxed String in some engines, warna 'hi')",
      "undefined; undefined; undefined",
      "global; global; 'hi'",
    ],
    correctIndex: 1,
    explanation:
      "`f()` — default binding, strict mode mein `this` `undefined`. `new f()` — `new` binding, `this` ek fresh object jo `f()` return kar deta hai (kyunki koi explicit object return nahi). `f.call('hi')` — explicit binding, `this` = passed value `'hi'` (strict mode mein primitive as-is, sloppy mode mein `String` object mein box ho jaata). Har call form alag `this` deta hai — yahi 'this call-site pe decide hota hai' ka core.",
    difficulty: "hard",
  },
];

export default quiz;
