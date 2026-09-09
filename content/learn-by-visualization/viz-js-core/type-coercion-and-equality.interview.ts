import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "coe-1",
    question: "`==` aur `===` mein farak kya hai? Interview mein kaunsa recommend karoge aur kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`===` (strict): pehle type check, agar type alag to seedha `false`, warna value compare — koi conversion nahi. `==` (loose): pehle dono ko ek common type mein coerce karta hai, phir compare. Hamesha `===` use karo; ise predict karna aasan hai.",
    detailedAnswer:
      "`==` ke coercion rules yaad rakhne mushkil hain aur surprising results dete hain: `0 == ''`, `0 == '0'`, `1 == true`, `'' == false` sab `true`, par `'' == '0'` `false` (non-transitive). `===` mein aisa kuch nahi — `1 === '1'` `false`, khatam. Best practice: `===`/`!==` default, aur jab types mila-jula ho to explicit `Number()` / `String()` / `Boolean()`. `==` ka ek acceptable use: `x == null` jo ek saath `null` aur `undefined` dono check karta hai.",
    followUp: "`==` ka koi legit use case hai bhi? (`x == null` idiom)",
    redFlag: "\"== aur === basically same hain, === thoda fast hai\" — farak semantic hai (coercion), speed ka nahi.",
  },
  {
    id: "coe-2",
    question: "`0 == ''`, `0 == '0'`, `'' == '0'` — teeno ka result batao aur samjhao yeh non-transitive kyun hai.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`true`, `true`, `false`. `0 == ''` aur `0 == '0'` mein string ko `Number` banaya jaata hai (`Number('')` aur `Number('0')` dono `0`). `'' == '0'` mein dono already string hain — koi conversion nahi, aur `''` `'0'` se alag hai.",
    detailedAnswer:
      "Transitivity ka matlab hota: agar `a == b` aur `a == c`, to `b == c`. Yahan `0 == ''` (true) aur `0 == '0'` (true) hone ke bawajood `'' == '0'` `false` hai. Wajah: `==` ke conversion rules operand ke types par depend karte hain — number vs string wale case mein string number banta hai, par string vs string wale case mein koi conversion hi nahi hoti. Isi liye `==` ki equality ko ek reliable 'equal' relation nahi maana ja sakta, aur code mein use karne se bugs aate hain.",
    followUp: "In three comparisons ko `===` se likhein to kya milega?",
  },
  {
    id: "coe-3",
    question: "`null == undefined` `true` hai — to `null === undefined` `false` kyun? Aur `== null` idiom kya hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`===` type check karta hai: `null` ka type `\"object\"` (historical bug), `undefined` ka `\"undefined\"` — types alag, to `false`. `==` ke rules mein ek special line hai jo `null` aur `undefined` ko ek doosre ke barabar maanti hai. `x == null` isi ka fayda uthata hai: ek expression mein `null` ya `undefined` dono ka check.",
    detailedAnswer:
      "`null == undefined` spec ki Abstract Equality mein explicitly `true` return karti hai, bina kisi number-conversion ke — isliye `null == 0` `false` rehta hai (`null` ko sirf `undefined` ke saath loosely-equal maana gaya). `x == null` common defensive idiom hai: `if (value == null) return defaultValue;` — matlab 'agar value missing hai (null ya undefined)'. Alternative jyada explicit: `value === null || value === undefined`, ya modern `value ?? defaultValue`.",
    followUp: "`??` (nullish coalescing) aur `||` mein farak kya hai?",
  },
  {
    id: "coe-4",
    question: "`NaN` ke baare mein: `typeof NaN` kya hai, `NaN === NaN` kya deta hai, aur sahi NaN-check kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`typeof NaN` -> `\"number\"` (NaN ek special numeric value hai). `NaN === NaN` -> `false` — NaN kisi ke barabar nahi, khud ke bhi nahi. Sahi check: `Number.isNaN(x)` (ya `Object.is(x, NaN)`).",
    detailedAnswer:
      "`NaN` 'Not a Number' hai par type-wise `number` hi hai — invalid math (`0/0`, `parseInt('abc')`, `Number(undefined)`) ka result. IEEE-754 spec kehta hai NaN kisi bhi comparison mein (`==`, `===`, `<`, `>`) `false` de, isliye `NaN === NaN` bhi `false`. Purana global `isNaN()` pehle argument ko `Number` mein coerce karta hai (`isNaN('abc')` -> `true`, jo bhramit karta hai); `Number.isNaN()` sirf actual `NaN` par `true` deta hai, koi coercion nahi. `Object.is(x, NaN)` bhi kaam karta hai.",
    followUp: "`Object.is` `===` se aur kis case mein alag behave karta hai (`+0` vs `-0`)?",
  },
];

export default questions;
