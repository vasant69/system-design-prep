import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "util-module-1",
    question:
      "`util.promisify(db.query)` call karne par promisified function ke andar `TypeError: Cannot read properties of undefined` aata hai. Sabse likely wajah kya hai?",
    options: [
      "`util.promisify` sirf Node core functions par kaam karta hai, custom objects par nahi",
      "`db.query` ke andar `this` `undefined` ho gaya kyunki method apne object se detach ho gaya — `util.promisify(db.query.bind(db))` chahiye",
      "Promise abhi tak resolve nahi hua, isliye value undefined hai",
      "`util.promisify` ko `await` ke saath hi call karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Jab tum `db.query` ko as a bare reference pass karte ho, wo apne `db` object se detach ho jata hai; call hone par `this` `undefined` hota hai aur method ke andar `this.connection` jaisa access crash karta hai. Fix: `util.promisify(db.query.bind(db))`. Option A galat — promisify kisi bhi error-first callback function par chalta hai. Option C/D galat — error promisify call par nahi, andar `this` par hai.",
    difficulty: "medium",
  },
  {
    id: "util-module-2",
    question:
      "`util.promisify.custom` symbol kis liye hota hai?",
    options: [
      "Promisified function ko synchronous banane ke liye",
      "Jab callback error-first single-result convention follow nahi karta (multi-value ya non-standard) — library author is symbol par apna Promise version attach karta hai aur util.promisify use prefer karta hai",
      "Promise ko cancel karne ke liye ek custom abort function attach karne ke liye",
      "util.promisify ko batane ke liye ki wo error ko ignore kar de",
    ],
    correctIndex: 1,
    explanation:
      "Default `util.promisify` maanta hai callback `(err, singleResult)` shape ka hai. Agar callback `(err, a, b)` deta hai ya pehla arg error nahi hai, library `fn[util.promisify.custom]` par ek proper Promise-returning implementation rakhti hai jise `util.promisify` prefer karta hai. `child_process.exec` isse `{ stdout, stderr }` deta hai. Baaki options galat — na sync banata hai, na cancel, na error ignore.",
    difficulty: "medium",
  },
  {
    id: "util-module-3",
    question:
      "`console.log(obj)` ek deeply nested object par `{ a: { b: [Object] } }` print kar raha hai. Kya ho raha hai aur fix kya hai?",
    options: [
      "Object corrupt hai; use JSON.parse(JSON.stringify(obj)) se repair karo",
      "`console.log` internally `util.inspect` use karta hai jiska default `depth` 2 hai — `console.log(util.inspect(obj, { depth: null }))` ya `console.dir(obj, { depth: null })` se full structure milega",
      "Nested objects ko print karne ke liye har level par alag console.log lagana padta hai",
      "`[Object]` ka matlab wo property circular reference hai",
    ],
    correctIndex: 1,
    explanation:
      "`util.inspect` ka default `depth` 2 hai, isliye us se gehre levels `[Object]`/`[Array]` ki tarah collapse ho jate hain. `{ depth: null }` unlimited depth deta hai. Object bilkul theek hai (option A/D galat). Option C galat — ek call `depth: null` ke saath kaafi hai.",
    difficulty: "easy",
  },
  {
    id: "util-module-4",
    question:
      "Ek chhoti internal script ke CLI flags parse karne ke liye kaunsa best fit hai, aur uski limitation kya hai?",
    options: [
      "`util.parseArgs` — built-in aur zero-dependency, boolean/string types aur short flags deta hai, lekin subcommands, auto `--help`, aur validation nahi deta",
      "`util.format` — kyunki wo `%s` aur `%d` ko arguments se replace karta hai",
      "`util.inspect` — kyunki wo `process.argv` ko readable form mein deta hai",
      "`util.promisify(process.argv)` — argv ko async parse karne ke liye",
    ],
    correctIndex: 0,
    explanation:
      "`util.parseArgs` ek chhota built-in CLI parser hai (Node v18.3+, stable v20+): `options` mein `type: 'boolean' | 'string'`, `short`, `default` de sakte ho, aur `values` + `positionals` wapas milte hain. Limitation: no subcommands, no generated help, no rich validation/coercion — badi CLI ke liye `commander`/`yargs`. `util.format` string formatting hai, `util.inspect` object printing hai — dono arg parsing nahi karte. Option D nonsense hai.",
    difficulty: "medium",
  },
];

export default quiz;
