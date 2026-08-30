import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "type-coercion-and-conversion-1",
    question: "`'5' + 1` aur `'5' - 1` kya dete hain?",
    options: [
      "Dono 6",
      "'51' aur 4 — '+' string ke saath concat karta hai, '-' ke paas string version nahi to dono side ToNumber",
      "'51' aur '4'",
      "6 aur 4",
    ],
    correctIndex: 1,
    explanation:
      "`+` overloaded hai: agar koi operand string hai to concatenation hoti hai — `'5' + 1` -> `'5' + '1'` -> `'51'`. `-` ke paas string variant nahi, wo hamesha dono operands ko ToNumber karta hai — `'5' - 1` -> `5 - 1` -> `4` (number). Yahi `*`, `/`, `%` ke saath bhi hota hai. Isliye `'5' + 1 !== '5' - 1` — JS ka classic gotcha.",
    difficulty: "easy",
  },
  {
    id: "type-coercion-and-conversion-2",
    question: "In mein se kaunse SAB truthy hain? `\"0\"`, `[]`, `{}`, `\" \"`, `\"false\"`",
    options: [
      "Koi nahi — sab falsy hain",
      "Sirf \" \" (space)",
      "Saare paanch truthy hain — falsy list mein sirf false, 0, -0, 0n, \"\", null, undefined, NaN hain",
      "Sirf [] aur {}",
    ],
    correctIndex: 2,
    explanation:
      "Exactly 8 falsy values hain: `false`, `0`, `-0`, `0n`, `\"\"` (empty string), `null`, `undefined`, `NaN`. In 8 ke alawa SAB truthy hai. `\"0\"` aur `\"false\"` non-empty strings hain, `\" \"` mein ek space char hai, `[]` aur `{}` objects hain — sab truthy. Isliye `if (arr)` empty array pe bhi chalta hai; emptiness ke liye `arr.length === 0`.",
    difficulty: "medium",
  },
  {
    id: "type-coercion-and-conversion-3",
    question:
      "Server code: `const limit = Number(req.query.limit) || 20;` — request `?limit=0` ke saath aati hai. `limit` kya hai?",
    options: [
      "0 — query se 0 aaya",
      "20 — Number('0') = 0, aur 0 falsy hai to || 20 kick in karta hai; user ka 0 lost ho gaya (bug)",
      "NaN — query params number nahi hote",
      "'0' — query params string rehte hain",
    ],
    correctIndex: 1,
    explanation:
      "`Number('0')` `0` deta hai (query params string aate hain, isliye Number() zaroori). Phir `0 || 20` — `0` falsy hai, to `||` right-hand `20` deta hai. User ne explicitly `limit=0` maanga par code ne `20` maan liya. Fix: `Number(req.query.limit ?? 20)` ya `req.query.limit != null ? Number(req.query.limit) : 20` — `??`/explicit-check `0` ko respect karta hai.",
    difficulty: "medium",
  },
  {
    id: "type-coercion-and-conversion-4",
    question:
      "React: `{items.length && <List items={items} />}` — `items` ek empty array hai. Screen pe kya render hota hai?",
    options: [
      "Kuch nahi — length 0 hai, condition falsy",
      "Ek literal '0' text screen pe — kyunki `0 && x` `0` deta hai aur React 0 ko render karta hai (null/false/undefined ke ulat)",
      "<List /> render hota hai empty array ke saath",
      "Error: objects are not valid as a React child",
    ],
    correctIndex: 1,
    explanation:
      "`items.length` `0` hai, `0 && <List />` short-circuit hoke `0` return karta hai. React `null`, `undefined`, `false`, `\"\"` ko render nahi karta par `0` aur `NaN` ko karta hai — to ek akela `0` dikh jaata hai. Fix: `{items.length > 0 && <List />}` ya `{items.length ? <List /> : null}`. Ye har React codebase mein at least ek baar hota hai.",
    difficulty: "easy",
  },
];

export default quiz;
