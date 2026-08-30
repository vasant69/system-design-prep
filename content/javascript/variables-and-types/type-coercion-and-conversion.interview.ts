import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "tcc-1",
    question: "Type coercion aur type conversion mein kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Conversion explicit hai — tum khud likhte ho: Number(x), String(x), Boolean(x). Coercion implicit hai — JavaScript operator ya context ke hisaab se automatically type badal deta hai: '5' * 2, if (value), `${count}`, x == y. Andar dono same machinery (ToString/ToNumber/ToBoolean) use karte hain, sirf trigger alag hai.",
    detailedAnswer:
      "Conversion: developer ka deliberate act. `Number('42')`, `String(42)`, `Boolean(0)`, ya shorthands `+x`, `!!x`, `` `${x}` ``. Intent code se clear hai.\n\nCoercion: engine ka automatic act jab type mismatch ho. `if (x)` -> ToBoolean(x). `'a' + x` -> ToString(x). `x - 1` -> ToNumber(x). `x == y` -> spec ke rules se ek ya dono side coerce.\n\nModern best practice: explicit conversion likho, implicit coercion pe rely mat karo — sivaay do idioms ke: `` `${x}` `` string building aur `x == null` null/undefined check. Reason: `[] == ![]` is `true`, `'5' + 1 !== '5' - 1` jaise traps silent bugs dete hain jo sirf runtime pe milte hain.",
    followUp: "Kaunse do implicit-coercion idioms aap phir bhi use karte ho aur kyun?",
    redFlag: "Dono ko synonyms samajhna — ya ye kehna ki JS 'randomly' types badalta hai (rules deterministic hain).",
  },
  {
    id: "tcc-2",
    question: "JavaScript ki 8 falsy values kaunsi hain? Ek aisi value batao jo aksar log galti se falsy samajhte hain.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "false, 0, -0, 0n (BigInt zero), '' (empty string), null, undefined, NaN. In 8 ke alawa SAB truthy hai. Common galti: '0' (string zero), 'false' (string), ' ' (space), [], {} — ye sab truthy hain.",
    detailedAnswer:
      "Poori list: `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined`, `NaN`.\n\nSurprises jo truthy hain:\n- `\"0\"` / `\"false\"` — non-empty strings, content chahe kuch bhi ho.\n- `\" \"` — ek space bhi character hai.\n- `[]` — empty array bhi ek object hai, aur sab objects truthy.\n- `{}` — same.\n- `Infinity`, `-1`, `3.14` — sirf `0`/`-0`/`NaN` numeric falsy hain.\n- `new Boolean(false)` — object, truthy.\n\nPractical consequence: `if (arr)` se empty array check nahi kar sakte — `arr.length === 0` chahiye. `if (str)` empty aur whitespace-only ko distinguish nahi karta — `str.trim() === ''` chahiye.",
    followUp: "`document.all` ke baare mein kuch pata hai? (historical extra falsy-ish case)",
  },
  {
    id: "tcc-3",
    question:
      "`1 + 2 + '3'` aur `'1' + 2 + 3` — dono kya dete hain? Step by step.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`1 + 2 + '3'` -> '33'. `'1' + 2 + 3` -> '123'. `+` left-to-right evaluate hota hai; jaise hi ek operand string banta hai, us point se aage sab concatenation ho jaata hai.",
    detailedAnswer:
      "`+` binary operator hai aur left-associative — do-do karke chalega.\n\n`1 + 2 + '3'`:\n1. `1 + 2` -> dono number -> `3`\n2. `3 + '3'` -> ek string -> concat -> `'33'`\n\n`'1' + 2 + 3`:\n1. `'1' + 2` -> ek string -> concat -> `'12'`\n2. `'12' + 3` -> ek string -> concat -> `'123'`\n\nRule: `+` ke saath, agar kisi bhi step pe koi operand string hai (ya object jo ToPrimitive ke baad string banta hai), wo step concatenation hai aur result string hai — jo phir agle step ko bhi concatenation bana deta hai. `-`, `*`, `/` ke saath aisa nahi — wo hamesha numeric hain: `'1' * 2 + 3` -> `2 + 3` -> `5`.",
    followUp: "`'1' - -'1'` kya deta hai?",
  },
  {
    id: "tcc-4",
    question:
      "Ek Express API `?active=false` query param pe `if (req.query.active) { ... }` check kar rahi hai. Kya problem hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "req.query.active ek STRING hai — 'false'. Non-empty string truthy hai, to `if (req.query.active)` `true` hota hai chahe value 'false' ho. Fix: `if (req.query.active === 'true')` ya proper boolean parsing.",
    detailedAnswer:
      "URL query params (aur `URLSearchParams`, aur `req.query`) hamesha strings deti hain, kabhi actual booleans/numbers nahi. `'false'`, `'0'`, `'null'` — sab non-empty strings, sab truthy.\n\n```javascript\n// bug\nif (req.query.active) { /* always runs if param present at all */ }\n\n// fix\nconst active = req.query.active === 'true';\nconst limit = Number(req.query.limit ?? 20);\nconst tags = (req.query.tags ?? '').split(',').filter(Boolean);\n```\n\nSame category ke bugs: `Number(req.query.limit) || 20` `?limit=0` ko `20` bana deta hai; `req.query.page` ko seedha arithmetic mein use karne se `'2' + 1` = `'21'`. Robust APIs har param ko explicitly parse+validate karti hain (ya zod/joi jaisa schema validator use karti hain).",
    followUp: "Ek reusable `parseBool(str)` helper kaise likhoge jo 'true'/'1'/'yes' ko true maane?",
  },
  {
    id: "tcc-5",
    question: "`[] + []`, `[] + {}` kya dete hain aur mechanism kya hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "`[] + []` -> '' (empty string). `[] + {}` -> '[object Object]'. `+` ke saath objects ko ToPrimitive kiya jaata hai (arrays ke liye toString -> join(','), so [] -> ''; {} -> '[object Object]'), phir string concatenation.",
    detailedAnswer:
      "Jab `+` ka operand object hai, engine ToPrimitive chalata hai hint 'default' ke saath: pehle `valueOf()`, wo primitive na de to `toString()`.\n\n- `[].valueOf()` -> array khud (primitive nahi) -> `[].toString()` -> `[].join(',')` -> `''`.\n- `({}).valueOf()` -> object khud -> `({}).toString()` -> `'[object Object]'`.\n\nToh:\n- `[] + []` -> `'' + ''` -> `''`\n- `[] + {}` -> `'' + '[object Object]'` -> `'[object Object]'`\n- `{} + []` -> statement position pe `{}` ko empty block samajh liya jaata hai, phir `+[]` -> `+''` -> `0` (console mein). Parentheses mein `({} + [])` -> `'[object Object]'`.\n\nPractical value: ye samajhna ki (a) `+` overloaded hai, (b) objects string ke through concat mein jaate hain, isliye `'User: ' + userObj` `'User: [object Object]'` deta hai — wahan `JSON.stringify` chahiye. Aise trick expressions production code mein kabhi mat likho.",
    followUp: "`'User: ' + user` `[object Object]` deta hai — properly log kaise karoge?",
    redFlag: "Ye kehna ki result 'undefined' ya 'error' hai — ya mechanism ke bina bas rata hua answer.",
  },
];

export default questions;
