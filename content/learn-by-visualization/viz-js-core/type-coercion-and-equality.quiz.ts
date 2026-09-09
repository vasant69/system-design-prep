import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "type-coercion-and-equality-1",
    question: "`console.log(1 + '2' + 3);` — output?",
    options: ["`6`", "`'123'`", "`'33'`", "`'15'`"],
    correctIndex: 1,
    explanation:
      "`+` left-to-right chalta hai. `1 + '2'` — ek operand string hai to number bhi string ban jaata hai -> `'12'`. Phir `'12' + 3` -> `'123'`. `+` hi ek aisa operator hai jo string ki taraf jhukta hai; `1 - '2'` hota to `-1` (number) milta.",
    difficulty: "easy",
  },
  {
    id: "type-coercion-and-equality-2",
    question: "`console.log(0 == '', 0 == '0', '' == '0');` — output?",
    options: ["`true true true`", "`true true false`", "`false false false`", "`true false false`"],
    correctIndex: 1,
    explanation:
      "`0 == ''` -> `Number('')` is `0`, to `0 == 0` -> `true`. `0 == '0'` -> `Number('0')` is `0` -> `true`. `'' == '0'` -> dono already string hain, koi conversion nahi, `''` aur `'0'` alag -> `false`. Yahi `==` ki non-transitivity ka classic example hai.",
    difficulty: "medium",
  },
  {
    id: "type-coercion-and-equality-3",
    question: "`console.log(null == undefined, null == 0, undefined == 0);` — output?",
    options: ["`true true true`", "`true false false`", "`false false false`", "`true true false`"],
    correctIndex: 1,
    explanation:
      "Spec mein `null` aur `undefined` loosely sirf ek doosre ke (aur khud ke) barabar hain -> `null == undefined` is `true`. `null == 0` -> `false` kyunki is comparison mein `null` ko number mein coerce nahi kiya jaata. `undefined == 0` bhi `false` isi wajah se. Isliye `== null` ek common idiom hai 'null ya undefined' check karne ke liye.",
    difficulty: "medium",
  },
  {
    id: "type-coercion-and-equality-4",
    question: "`console.log([] == ![]);` — output aur wajah?",
    options: [
      "`false` — array kabhi boolean ke barabar nahi",
      "`true` — `![]` becomes `false` -> `0`, aur `[]` becomes `''` -> `0`, to `0 == 0`",
      "`TypeError`",
      "`true` — dono truthy hain isliye equal",
    ],
    correctIndex: 1,
    explanation:
      "`!` pehle chalta hai: `[]` truthy hai to `![]` -> `false`. Ab `[] == false`. `==` boolean ko number banata hai -> `[] == 0`. Object side primitive banta hai: `[].toString()` -> `''`, phir `Number('')` -> `0`. `0 == 0` -> `true`. Ye exactly wahi kism ka gotcha hai jiske liye `==` avoid kiya jaata hai.",
    difficulty: "hard",
  },
];

export default quiz;
