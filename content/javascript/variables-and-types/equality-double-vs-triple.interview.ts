import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "eqt-1",
    question: "== aur === mein kya farak hai? Aapke code mein kaunsa default hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "=== type aur value dono strictly compare karta hai, koi coercion nahi — types alag ho to seedha false. == pehle operands ko ek common type mein coerce karta hai, jisse 0 == '', false == '0', [] == ![] jaise counter-intuitive aur non-transitive results aate hain. Default hamesha ===; == sirf x == null ke liye.",
    detailedAnswer:
      "`===` (strict): pehle type, mismatch pe turant false. Same type pe primitives value se, objects reference se compare.\n\n`==` (loose): mismatched types ko coerce karta hai (~10-step spec algorithm) — string<->number, boolean->number, object->primitive. Results:\n- `0 == ''` -> true, `0 == '0'` -> true, par `'' == '0'` -> false (non-transitive!)\n- `null == undefined` -> true, `null == 0` -> false\n- `[] == ![]` -> true\n- `'1' == 1` -> true, `false == '0'` -> true\n\nNon-transitivity akela reason kaafi hai avoid karne ka. Meri practice: `===` har jagah; `==` sirf `x == null` mein (null + undefined ek saath, kuch aur nahi). ESLint `eqeqeq` rule (`{ null: 'ignore' }`) ise team-wide enforce karta hai.\n\nEdge tools: `Number.isNaN(x)` NaN ke liye; `Object.is(a, b)` jab NaN/-0 ki exact semantics chahiye.",
    followUp: "== ka coercion algorithm roughly bata sakte ho? Kaunsi taraf coerce hota hai?",
    redFlag: "== ko defend karna 'agar rules pata ho to theek hai' — ya sirf 'value vs type' kehke coercion aur non-transitivity miss karna.",
  },
  {
    id: "eqt-2",
    question: "`[] == ![]` `true` kyun deta hai? Step by step.",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "![] pehle evaluate hota hai: [] truthy hai, to ![] -> false. Ab [] == false. == boolean ko ToNumber karta hai: false -> 0. Ab [] == 0. Object ko ToPrimitive: [].toString() -> '' -> ToNumber -> 0. Ab 0 == 0 -> true.",
    detailedAnswer:
      "Precedence: unary `!` binary `==` se pehle chalta hai.\n\n1. `![]` — `[]` ek object hai, sab objects truthy, to `!truthy` -> `false`.\n2. Expression ab `[] == false`.\n3. `==` rule: ek operand boolean hai -> boolean ko `ToNumber` -> `false` becomes `0`. Ab `[] == 0`.\n4. `==` rule: ek operand object, doosra number -> object ko `ToPrimitive` -> `[].toString()` -> `''` -> phir number context -> `ToNumber('')` -> `0`. Ab `0 == 0`.\n5. `0 == 0` -> `true`.\n\nInteresting: `[] == []` `false` hai (do alag references), par `[] == ![]` `true`. Ye exactly wo tarah ka result hai jo `==` ko unusable banata hai. Practical answer: 'main aise expressions likhta hi nahi, `===` use karta hoon — par mechanism ye hai.'",
    followUp: "`[] == []` kya deta hai aur kyun alag?",
  },
  {
    id: "eqt-3",
    question: "== kab use karna acceptable hai aur kyun exactly wahi case?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Sirf x == null (ya x != null). Ye true deta hai exactly null aur undefined ke liye, kisi aur value ke liye nahi — null == 0 bhi false. To ye ek safe, concise 'value absent/present hai?' check hai. ESLint eqeqeq bhi ise { null: 'ignore' } se allow karta hai.",
    detailedAnswer:
      "`==` ke coercion rules mein null aur undefined ka special clause hai: wo sirf ek-doosre ke (aur khud ke) barabar hote hain, kisi aur type ke saath compare pe coerce nahi hote — seedha false.\n\n```javascript\nnull == undefined  // true\nnull == 0          // false\nnull == ''         // false\nundefined == NaN   // false\n```\n\nTo `x == null` behaves exactly like `x === null || x === undefined`, bas chhota. Uska ulta `x != null` = 'value present hai' (null/undefined exclude, 0/''/false allow) — `??` operator ke mental model ke consistent.\n\nKisi aur `==` ka justification nahi: `flag == true`, `n == 0`, `id == '5'` — sab strict + explicit handling se likhne chahiye.",
    followUp: "Agar tumhe sirf undefined check karna hai (null nahi), to kaise likhoge?",
  },
  {
    id: "eqt-4",
    question:
      "Ek check `if (user.age == null)` code review mein aaya. Reviewer ne approve kar diya. Ek doosre PR mein `if (user.role == 'admin')` pe reviewer ne change maanga. Dono consistent hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Haan, consistent hai. `== null` woh ek allowed `==` idiom hai (null + undefined dono, safe). `role == 'admin'` ek non-null loose compare hai jo coercion traps mein aata hai (`role` agar `['admin']` array hua to `['admin'] == 'admin'` bhi true!) — wahaan `===` chahiye.",
    detailedAnswer:
      "ESLint ka common config `['error', 'always', { null: 'ignore' }]` exactly yahi distinction encode karta hai:\n- `x == null` / `x != null` — allowed. Intentional null+undefined check.\n- Baaki har `==` / `!=` — error.\n\n`role == 'admin'` problematic isliye hai kyunki agar `role` kabhi non-string ho jaaye (ek single-element array `['admin']`, ya ek `String` wrapper object), `==` use ToPrimitive karke galat match de sakta hai. `role === 'admin'` sirf tab true jab `role` literally string `'admin'` ho.\n\nReviewer dono baar sahi hai — rule mechanical nahi, intent-based hai: 'null-check idiom OK, coercion-prone compare not OK.'",
    followUp: "eqeqeq ke `smart` option ke baare mein kuch pata hai?",
  },
  {
    id: "eqt-5",
    question:
      "React state comparison ke liye kaunsa equality use karta hai, aur uska ek observable consequence kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "React Object.is use karta hai (=== nahi). Consequence: agar state NaN hai aur tum dobara NaN set karo, React re-render skip kar deta hai (Object.is(NaN, NaN) -> true), jabki plain === hote to wo hamesha 'changed' dikhta. Aur -0 vs +0 ko React alag maanta hai.",
    detailedAnswer:
      "`useState` ka bailout, `React.memo`, `useMemo`/`useCallback` ki dependency comparison — sab `Object.is` pe based hain.\n\n`Object.is` `===` jaisa hi hai except:\n- `Object.is(NaN, NaN)` -> `true` (=== -> false)\n- `Object.is(-0, +0)` -> `false` (=== -> true)\n\nPractical asar:\n1. `setCount(NaN)` do baar — doosri baar re-render nahi hota, kyunki React ko lagta hai value same hai.\n2. Objects/arrays abhi bhi reference se compare — isliye 'don't mutate state' rule; naya reference chahiye change detect karne ke liye.\n3. `-0`/`+0` distinction rarely kisi ko bite karta hai.\n\nInterview mein ye tab poochha jaata hai jab wo dekhna chahte hain ki tum React internals ke baare mein curious ho.",
    followUp: "React.memo ka default comparison shallow kyun hai, deep kyun nahi?",
  },
];

export default questions;
