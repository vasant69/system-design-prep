import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "equality-double-vs-triple-1",
    question:
      "`0 == ''` -> true, `0 == '0'` -> true, par `'' == '0'` -> false. Isse kya sabse important baat pata chalti hai `==` ke baare mein?",
    options: [
      "`==` strings ke saath kaam nahi karta",
      "`==` transitive nahi hai — a==b aur a==c hone se b==c guaranteed nahi, isliye ise avoid karte hain",
      "Ye ek JS engine bug hai",
      "`''` aur `'0'` internally same hote hain",
    ],
    correctIndex: 1,
    explanation:
      "`0 == ''` mein `''` ToNumber hoke `0` banta hai. `0 == '0'` mein `'0'` ToNumber hoke `0` banta hai. Par `'' == '0'` mein dono already string hain — koi coercion nahi, aur `'' !== '0'` as strings. Matlab `==` mathematically transitive nahi hai, jo equality operator ke liye ek serious defect hai. Yahi akela reason kaafi hai `===` prefer karne ka.",
    difficulty: "medium",
  },
  {
    id: "equality-double-vs-triple-2",
    question: "`===` ka `==` se sabse core farak kya hai?",
    options: [
      "`===` tez chalta hai",
      "`===` koi type coercion nahi karta — agar operands ke types alag hain to seedha false; `==` pehle ek common type mein coerce karta hai",
      "`===` sirf numbers ke liye kaam karta hai",
      "`==` objects compare kar sakta hai, `===` nahi",
    ],
    correctIndex: 1,
    explanation:
      "`===` pehle type check karta hai — mismatch pe turant `false`, koi conversion nahi. Same type ho to value (primitives) ya reference (objects) compare. `==` mismatched types ko ek common type (roughly number) mein laata hai phir compare karta hai, jisse `0 == ''`, `false == '0'`, `[] == ![]` jaise surprising results aate hain. Speed practically relevant nahi; dono objects ko reference se hi compare karte hain.",
    difficulty: "easy",
  },
  {
    id: "equality-double-vs-triple-3",
    question:
      "Kis ek case mein `==` use karna widely accepted hai, aur kyun?",
    options: [
      "`flag == true` — boolean check ke liye readable hai",
      "`x == null` — ye cleanly null AUR undefined dono ko match karta hai aur kisi aur value ko nahi",
      "`value == 0` — empty aur zero ek saath check karne ke liye",
      "`id == '42'` — number/string dono forms handle karne ke liye",
    ],
    correctIndex: 1,
    explanation:
      "`x == null` `true` deta hai sirf `null` aur `undefined` ke liye (`null == 0` bhi `false`). Ye ek safe, concise idiom hai 'value absent hai?' check karne ka, isliye ESLint `eqeqeq` bhi `{ null: 'ignore' }` se ise allow karta hai. Baaki options `==` ke coercion traps hi hain: `flag == true` (`2 == true` false), `value == 0` (`'' == 0` true), `id == '42'` — sab strict-equality + explicit handling se likhne chahiye.",
    difficulty: "easy",
  },
  {
    id: "equality-double-vs-triple-4",
    question:
      "`Object.is` `===` se kin cases mein alag behave karta hai?",
    options: [
      "Object.is objects ka content compare karta hai, === reference",
      "Sirf do cases: Object.is(NaN, NaN) -> true (=== deta false), aur Object.is(-0, 0) -> false (=== deta true)",
      "Object.is coercion karta hai, === nahi",
      "Koi farak nahi, Object.is bas naya syntax hai",
    ],
    correctIndex: 1,
    explanation:
      "`Object.is` 'SameValue' algorithm use karta hai jo `===` jaisa hi hai sivaay do edge cases ke: `NaN` ko khud ke barabar maanta hai, aur `-0` ko `+0` se alag maanta hai. Baaki sab (`1`, `'a'`, objects by reference) `===` jaisa. React internally `Object.is` use karta hai state/props bailout ke liye. Deep/content equality ke liye phir bhi Lodash `isEqual` ya custom helper chahiye.",
    difficulty: "medium",
  },
];

export default quiz;
