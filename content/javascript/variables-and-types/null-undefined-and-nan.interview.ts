import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "nun-1",
    question: "null aur undefined mein kya farak hai? typeof dono ka kya deta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "undefined JavaScript khud deta hai — uninitialised variable, missing function argument, missing object property, no-return function. null developer deliberately assign karta hai ye kehne ke liye 'yaha value nahi hai, on purpose'. typeof undefined -> 'undefined', typeof null -> 'object' (ek historical bug).",
    detailedAnswer:
      "undefined = 'value never assigned', aur ye 5 tarah se automatically aata hai: `let x;`, missing arg, `obj.missingKey`, function jo return nahi karta, array hole (`arr[99]`).\n\nnull = 'deliberately empty'. Developer likhta hai `selectedUser = null`, ya API 'not found' ke liye `null` return karti hai (jaise `document.getElementById` element na mile).\n\ntypeof: undefined -> 'undefined' (sahi). null -> 'object' — JS ke pehle implementation mein null ka type tag 0 tha jo objects ka bhi tha; fix karne se purana web tootta, to permanent ho gaya. Isliye null check `x === null` se karo, `typeof` se nahi.\n\nPractical rule: undefined ko naturally hone do, null ko choose karo. Dono ek saath check: `x == null`.",
    followUp: "typeof null 'object' kyun hai — spec kabhi fix kyun nahi hua?",
    redFlag: "\"Dono bilkul same hain, koi farak nahi\" — source aur intent dono alag hain.",
  },
  {
    id: "nun-2",
    question: "`x == null` — ye idiom kya karta hai aur '== hamesha avoid karo' rule ke bawajood ise kyun allow kiya jaata hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "x == null exactly do values pe true deta hai — null aur undefined — aur kisi aur pe nahi (0, '', false, NaN sab false). Ye ek safe, concise 'null ya undefined?' check hai, isliye Airbnb jaisi style guides ise == ka single accepted exception maanti hain.",
    detailedAnswer:
      "`==` ke abstract equality rules mein ek special clause hai: null aur undefined sirf ek-doosre ke aur khud ke barabar hote hain, kisi aur type ke saath compare karne pe wo pehle coerce nahi hote — seedha false. To:\n\n```javascript\nnull == undefined  // true\nnull == 0          // false\nnull == ''         // false\nundefined == false // false\n```\n\nIska matlab `x == null` behaves exactly like `x === null || x === undefined`, bas chhota hai. Alternatives: verbose `x === null || x === undefined`, ya agar default de rahe ho to `x ?? fallback`. ESLint `eqeqeq` rule ko `{ null: 'ignore' }` option se configure kiya jaata hai taaki ye ek idiom allowed rahe.",
    followUp: "Agar tumhe sirf undefined check karna hai, null nahi, to kya likhoge?",
  },
  {
    id: "nun-3",
    question: "NaN kya hai? typeof NaN kya deta hai? Ise reliably check kaise karoge?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "NaN = 'invalid numeric result' (0/0, Number('abc'), Math.sqrt(-1)). typeof NaN === 'number' (naam ke ulat). NaN kisi ke barabar nahi, khud ke bhi nahi (NaN === NaN false), isliye check ke liye Number.isNaN(x) use karo — global isNaN(x) pehle coerce karta hai aur misleading hai.",
    detailedAnswer:
      "NaN IEEE-754 ka 'not a valid number' sentinel hai. Numeric operation fail ho to crash ke bajaye NaN aata hai, jo phir chup-chaap propagate hota hai (`NaN + 1` -> NaN).\n\nKey property: `NaN === NaN` -> false. Ye JS ki only value hai jo `x === x` ko false banati hai.\n\nCheck karne ke tarike:\n- `Number.isNaN(x)` — best. true sirf jab x literally NaN ho, koi coercion nahi.\n- `Object.is(x, NaN)` — bhi kaam karta hai.\n- `x !== x` — clever trick, sirf NaN ke liye true.\n- Global `isNaN(x)` — AVOID. Pehle `Number(x)` karta hai; `isNaN('hello')` -> true, `isNaN(undefined)` -> true. Ye 'x parse karne pe NaN banega?' check hai, 'x NaN hai?' nahi.\n\n'Usable number hai?' ka practical check: `typeof x === 'number' && !Number.isNaN(x)`.",
    followUp: "Ek object mein aisi value aa gayi jo NaN hai — wo silently poore calculation ko NaN bana rahi hai. Kaise debug karoge?",
  },
  {
    id: "nun-4",
    question:
      "Ek React component crash ho raha hai 'Cannot read properties of null (reading value)'. Sabse likely wajah kya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Koi DOM lookup (document.getElementById / querySelector) ya ek API lookup null return kar raha hai — element/record mila nahi — aur code us null pe seedha .value ya .prop access kar raha hai bina guard ke. Fix: pehle null check ya optional chaining (el?.value).",
    detailedAnswer:
      "DOM APIs deliberately null return karti hain jab match na mile: `getElementById`, `querySelector`, `closest`. Agar tum `document.querySelector('#x').value` likhte ho aur `#x` render hone se pehle ye chala (ya id galat hai), to null pe property access = TypeError.\n\nFixes:\n```javascript\nconst el = document.querySelector('#x');\nif (el) { doSomething(el.value); }\n// ya\nconst val = document.querySelector('#x')?.value ?? '';\n```\n\nReact mein aksar behtar solution: DOM ko manually query hi mat karo, `useRef` use karo — `ref.current` bhi mount se pehle null hota hai, to `ref.current?.focus()` pattern rakho, ya effect ke andar access karo jaha ref set ho chuka hota hai.\n\nSame pattern APIs ke saath: `const user = await findUser(id); if (user == null) return notFound(); user.name;`.",
    followUp: "getElementById null deta hai par obj.missingProp undefined deta hai — API design mein ye choice kaise karte ho?",
  },
  {
    id: "nun-5",
    question:
      "`config.retries || 3` aur `config.retries ?? 3` — kab ye do alag results denge? Ek real bug scenario do.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Jab config.retries ek falsy-but-valid value ho: 0, '', false. `|| 3` un sab pe 3 de dega; `?? 3` sirf null/undefined pe 3 dega. Bug: user 'retries: 0' set karke retries band karna chahta hai, par `|| 3` use hone se 3 retries ho jaate hain.",
    detailedAnswer:
      "`||` right-hand side tab deta hai jab left falsy ho — aur 8 falsy values mein 0, '', false, NaN aise hain jo aksar legitimate config values hote hain.\n\n```javascript\nconst config = { retries: 0, prefix: '', debug: false };\nconfig.retries || 3;  // 3  <- BUG: user ne 0 chaha tha\nconfig.retries ?? 3;  // 0  <- sahi\nconfig.prefix || 'app-'; // 'app-'  <- BUG agar empty prefix intentional\nconfig.prefix ?? 'app-'; // ''  <- sahi\n```\n\n`??` (ES2020) sirf null/undefined pe fallback deta hai. Rule: 'value missing hai?' ke liye `??`; 'value falsy hai?' (jaise empty string ko treat-as-missing karna) ke liye jaan-boojh ke `||`. Zyada tar config/default code ko `??` chahiye. Ek gotcha: `a ?? b || c` SyntaxError hai — `??` ko `||`/`&&` ke saath bina parentheses mix nahi kar sakte.",
    followUp: "`a ?? b || c` SyntaxError kyun deta hai?",
  },
];

export default questions;
