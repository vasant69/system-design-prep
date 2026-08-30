import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "util-1",
    question:
      "`util.promisify` kya karta hai aur kab use karoge? Ek example do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`util.promisify(fn)` ek error-first callback function ko ek naye function mein badalta hai jo Promise return karta hai — taaki tum legacy callback APIs ko `await` kar sako. Callback mein `err` mila to Promise reject, warna result se resolve.",
    detailedAnswer:
      "Node ke purane core APIs aur bahut se npm packages error-first callback convention par hain: `fn(...args, (err, result) => {})`. `util.promisify` isi shape ko samajhta hai.\n\n```javascript\nconst util = require('node:util');\nconst dns = require('node:dns');\nconst lookup = util.promisify(dns.lookup);\n\nconst { address } = await lookup('example.com');\n```\n\nDhyaan dene ki baatein: (1) ye sirf error-first, single-result callbacks par out-of-the-box chalta hai; multi-value (`(err, a, b)`) ya non-standard callbacks ke liye `util.promisify.custom` symbol chahiye. (2) Object method promisify karte waqt `this` lost ho jata hai — `util.promisify(obj.method.bind(obj))`. (3) Agar Node ne pehle se promisified version diya hai (`fs.promises`, `timers/promises`, `stream/promises`) to promisify ki zaroorat hi nahi. Manual `new Promise` wrap ki jagah promisify isliye better hai ki wo convention-correct hai aur callback ko do baar resolve karna / error case bhoolna jaise subtle bugs se bachata hai.",
    followUp: "Multi-value callback ko promisify kaise karoge?",
    redFlag:
      "`util.promisify` ko har callback par blindly lagana — non-error-first callback (jaise plain `setTimeout`) galat resolve karega.",
  },
  {
    id: "util-2",
    question:
      "`util.callbackify` ka kya use case hai? Wo `util.promisify` se kaise alag hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`util.callbackify` ulta karta hai: ek `async` (Promise-returning) function ko error-first callback-style function mein badalta hai. Zaroorat tab jab tumhara code modern async hai lekin koi purana caller ya API sirf `(err, result)` callbacks samajhta hai.",
    detailedAnswer:
      "`promisify`: callback -> Promise. `callbackify`: Promise -> callback.\n\n```javascript\nasync function getUser(id) {\n  return { id, name: 'Asha' };\n}\nconst getUserCb = util.callbackify(getUser);\ngetUserCb(42, (err, user) => {\n  if (err) return console.error(err);\n  console.log(user);\n});\n```\n\nPromise fulfil -> `cb(null, value)`; reject -> `cb(reason)`. Ek gotcha: agar `async` function `null` ya `undefined` se reject kare, `callbackify` use ek special wrapper error mein daal deta hai taaki `cb(err)` mein `err` truthy rahe (warna `if (err)` check fail ho jata). Real use: ek library jo callback-based plugin interface expose karti hai, lekin uske andar ka logic async/await mein likha gaya.",
    followUp:
      "Agar tum khud dono taraf ka code control karte ho, to callbackify ki zaroorat kyun nahi honi chahiye?",
  },
  {
    id: "util-3",
    question:
      "Logs mein ek object ke andar API keys / passwords leak ho rahe hain. `util` se ise kaise rok sakte ho?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Us class par `[util.inspect.custom]()` method define karo jo ek masked string return kare. `console.log`, `console.dir`, error dumps — sab internally `util.inspect` se guzarte hain, to object khud ko safe tareeke se serialize karega chahe kahin bhi log ho.",
    detailedAnswer:
      "```javascript\nconst util = require('node:util');\n\nclass Secret {\n  constructor(value) { this.value = value; }\n  [util.inspect.custom]() {\n    return `Secret(****${String(this.value).slice(-4)})`;\n  }\n}\n\nconst s = new Secret('sk_live_abcd1234');\nconsole.log(s);            // Secret(****1234)\nconsole.log({ token: s }); // { token: Secret(****1234) }\n```\n\nKyun kaam karta hai: `console.log` non-string args ko `util.inspect` se format karta hai, aur `util.inspect` `[util.inspect.custom]` symbol ko honor karta hai. Isse raw secret log lines, crash reports, aur log-aggregation service tak nahi pahunchta. Note: `JSON.stringify` is symbol ko ignore karta hai — uske liye alag se `toJSON()` chahiye. Aur ye ek defense-in-depth layer hai, primary fix nahi — sensitive fields ko structured logger ke redaction config mein bhi daalo.",
    followUp:
      "`util.inspect` ke `depth` option ka default kya hai aur wo debugging mein kaise bite karta hai?",
    redFlag:
      "'Bas `delete obj.password` kar dete hain log karne se pehle' — har call site par yaad rakhna padega aur nested/rename cases miss ho jaate hain.",
  },
  {
    id: "util-4",
    question:
      "`util.deprecate` kya hai aur kaun use karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`util.deprecate(fn, message, code)` ek function ko wrap karke ek naya function deta hai jo call hone par `stderr` par ek deprecation warning print karta hai — har unique call site par sirf ek baar. Library aur framework maintainers ise purane API ko phase-out karne ke liye use karte hain.",
    detailedAnswer:
      "```javascript\nconst util = require('node:util');\nexports.oldParse = util.deprecate(\n  function oldParse(input) { /* ... */ },\n  'oldParse() deprecated hai, use parse() instead',\n  'MYLIB_DEP001',\n);\n```\n\nUser jab `oldParse()` call karega, use console par `(node:12345) [MYLIB_DEP001] DeprecationWarning: oldParse() deprecated hai...` dikhega, ek hi baar us call site ke liye (spam nahi). Node core khud ise use karta hai apne deprecated APIs ke liye. Consumers `node --no-deprecation` se silence kar sakte hain, ya `node --throw-deprecation` se warning ko error bana sakte hain (CI mein useful taaki koi deprecated API use na kar de). Application code mein iski zaroorat kam padti hai — ye mainly shared-library concern hai.",
    followUp:
      "CI mein tum kaise ensure karoge ki tumhari team kisi deprecated dependency API ko use na kare?",
  },
  {
    id: "util-5",
    question:
      "`util.parseArgs` ke bare mein batao — kab use karoge aur kab `commander`/`yargs` par jaoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`util.parseArgs` ek chhota built-in, zero-dependency CLI argument parser hai (Node v18.3+, stable v20+). Boolean/string options, short flags, aur defaults deta hai, plus `values` aur `positionals` wapas. Chhoti internal scripts ke liye enough; subcommands, auto `--help`, ya rich validation chahiye to `commander`/`yargs`.",
    detailedAnswer:
      "```javascript\nconst { values, positionals } = util.parseArgs({\n  options: {\n    verbose: { type: 'boolean', short: 'v' },\n    out: { type: 'string', short: 'o', default: 'dist' },\n  },\n  allowPositionals: true,\n});\n// node build.js -v --out build src/\n// values = { verbose: true, out: 'build' }, positionals = ['src/']\n```\n\nFayda: koi `node_modules` entry nahi, `process.argv` slicing/parsing ka boilerplate gaya. Limitations: sirf `boolean` aur `string` types (no numbers coercion), no subcommands (`mytool deploy ...`), no auto-generated help text, no 'required' enforcement — wo sab tumhe khud likhna padega. Decision rule: agar CLI ek-do flags wali ek script hai, `parseArgs`. Agar wo ek product-grade tool ban rahi hai jisme multiple commands, help screens, aur validation chahiye, to shuru se hi `commander` ya `yargs`.",
    followUp:
      "`util.parseArgs` se ek numeric flag (`--retries 3`) kaise handle karoge, jab wo sirf string deta hai?",
  },
];

export default questions;
