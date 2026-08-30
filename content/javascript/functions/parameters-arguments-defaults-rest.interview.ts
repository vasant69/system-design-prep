import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "padr-1",
    question: "Parameter aur argument mein kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Parameter function ki definition mein likha naam/placeholder hota hai. Argument wo actual value hai jo function ko call karte waqt pass ki jaati hai. Ek line: parameter definition ka, argument call ka.",
    detailedAnswer:
      "`function greet(name, greeting) { ... }` mein `name` aur `greeting` parameters hain. `greet('Vasant', 'Hi')` mein `'Vasant'` aur `'Hi'` arguments hain. Call ke waqt engine arguments ko positionally parameters se bind karta hai. Agar arguments kam hain to missing parameters ko `undefined` milta hai; zyada hain to extra values ignore hoti hain (par legacy `arguments` object aur rest `...args` unhe capture kar lete hain). Ye distinction interview mein warm-up hota hai — asli follow-up default kab lagta hai aur `arguments` vs rest pe hota hai.",
    followUp:
      "Agar main 2-parameter function ko 5 arguments ke saath call karun to baaki 3 ka kya hota hai?",
  },
  {
    id: "padr-2",
    question:
      "Default parameter exactly kab trigger hota hai? `f(null)` pe lagta hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Default sirf tab lagta hai jab us position ki value `undefined` ho — argument missing ho ya explicitly `undefined` pass ho. `null`, `0`, `''`, `false` real values hain, unpe default nahi lagta. `f(null)` ka parameter `null` hi rahega.",
    detailedAnswer:
      "Rule ek hi trigger hai: `undefined`. `function f(x = 5) {}` ke liye `f()` aur `f(undefined)` dono `x = 5` dete hain, par `f(null)` -> `null`, `f(0)` -> `0`, `f('')` -> `''`. Agar tumhe falsy values pe bhi fallback chahiye to default parameter kaafi nahi — body mein `x = x ?? 5` (nullish, `null`/`undefined` dono) ya `x = x || 5` (har falsy, risky) likho. Dusra important point: default expression har call pe left-to-right evaluate hota hai, shared nahi — `function id(t = Date.now()) {}` har missing-arg call pe naya timestamp deta hai. Default expression pehle wale params ko refer kar sakta hai (`function f(a, b = a * 2) {}`) par right wale ko nahi (TDZ).",
    followUp:
      "`function f(a, b = a) {}` valid hai. `function f(a = b, b) {}` kyun nahi?",
    redFlag:
      "\"Default har falsy value pe lag jaata hai\" — sirf undefined pe lagta hai.",
  },
  {
    id: "padr-3",
    question:
      "`arguments` object aur rest parameter `...args` mein farak batao. Kaunsa prefer karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`arguments` array-LIKE object hai (length + index, par array methods nahi), sirf non-arrow functions mein milta hai, aur signature se intent chhupata hai. `...args` ek real Array hai, arrow functions mein bhi kaam karta hai, sirf listed params ke baad wale args leta hai, aur last position pe hi ho sakta hai. Modern code mein hamesha `...args`.",
    detailedAnswer:
      "`arguments` har normal function mein automatically hota hai aur saare passed values rakhta hai chahe koi parameter listed ho ya nahi. Dikkatein: `arguments.map(...)` fail hota hai (`Array.from` / spread chahiye); arrow functions mein `arguments` hota hi nahi; strict mode mein `arguments` params se de-link ho jaata hai; aur function signature dekh ke pata nahi chalta ki wo variadic hai. Rest parameter `function log(level, ...messages) {}` — `messages` real array, `level` ke baad ke sab args. Rest sirf ek aur last ho sakta hai. Ek aur farak: `arguments` mein sab args aate hain, `...rest` mein sirf jo explicit params ke baad bache. `fn.length` bhi rest ko count nahi karta. Practically `...args` `arguments` ka har jagah replacement hai — usko hi use karo.",
    followUp:
      "Ek function jo apne saare args ko doosre function ko forward karta hai — pehle kaise likhte the (apply + arguments), ab kaise (spread + rest)?",
  },
  {
    id: "padr-4",
    question:
      "`function a(x, y) {}`, `function b(x, y = 1) {}`, `function c(x, ...r) {}` — teeno ki `.length` kya hai aur kyun matter karta hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "a.length = 2, b.length = 1, c.length = 1. `fn.length` pehle default parameter se pehle wale simple params count karta hai — defaults aur rest exclude. Ye matter karta hai kyunki kuch libraries (Express middleware, curry helpers) arity se behaviour decide karti hain.",
    detailedAnswer:
      "`fn.length` ka matlab: 'kitne mandatory positional params expected hain, pehle default/rest se pehle tak'. `a` -> `x, y` dono simple -> 2. `b` -> `x` simple, `y` default -> count `x` tak = 1. `c` -> `x` simple, `...r` rest exclude -> 1. `function d(x = 1, y) {}` -> pehla hi default, to 0. Real impact: Express `fn.length === 4` dekh ke middleware ko error-handler maanta hai (`(err, req, res, next)`); agar tum us signature mein kisi param ka default de do to `length` badal jaata hai aur Express use normal middleware treat kar deta hai — silent bug. Ramda/lodash curry bhi `fn.length` se arity nikaalte hain, isliye default params curry ko tod sakte hain.",
    followUp:
      "Lodash `_.curry` ke saath ek default-parameter wala function pass karo to kya problem aati hai?",
  },
  {
    id: "padr-5",
    question:
      "3+ optional parameters wali function ka signature kaise design karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Positional params ki jagah ek destructured options object with per-key defaults: `function f({ a = 1, b = 2, c = 3 } = {}) {}`. Call-site pe naam dikhta hai, order yaad nahi rakhna padta, aur missing options apne defaults le lete hain.",
    detailedAnswer:
      "Problem `f(a, b = 1, c, d = 2, e)` jaise signature mein: `c` ya `e` dene ke liye beech mein `undefined` placeholders pass karne padte hain (`f(1, undefined, 3)`), aur call-site pe `f(1, 0, null, 2, true)` bilkul unreadable hai — kaunsa flag kya hai pata nahi. Fix: `function createClient({ baseUrl = '/api', timeout = 5000, retries = 3, headers = {} } = {}) {}`. Ab `createClient({ timeout: 1000 })` — sirf jo chahiye wahi, naam ke saath. Outer `= {}` zaroori hai taaki `createClient()` bina arg ke bhi chale (warna `undefined` destructure karne pe crash). Downside: `fn.length` ab hamesha 0 ya 1 hoga, aur agar sirf 1-2 required params hain to options object over-engineering lagta hai — tab positional theek hai.",
    followUp:
      "Options object pattern ka ek downside batao required (non-optional) parameters ke context mein.",
  },
];

export default questions;
