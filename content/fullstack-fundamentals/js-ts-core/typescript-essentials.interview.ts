import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "tse-1",
    question: "interface vs type alias — kab kaunsa choose karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "interface object/class contracts ke liye jo implement ya extend honge, aur jahan declaration merging useful ho (library typings). type jab union, intersection, tuple, primitive alias, ya mapped/conditional type chahiye — jo interface express nahi kar sakta.",
    detailedAnswer:
      "Plain object shape ke liye dono chalte hain aur teams aksar ek pe standardise kar lete hain. Asli forcing functions: sirf `type` `A | B` ban sakta hai; sirf `interface` reopen aur augment ho sakta hai (`declare global`, module augmentation). Bade object types ke liye `interface` ke error messages kabhi cleaner hote hain. Dono me se koi runtime par exist nahi karta.",
    followUp: "Kya ek interface union type ko extend kar sakta hai? Kyun ya kyun nahi?",
  },
  {
    id: "tse-2",
    question: "Discriminated union kya hai aur similar objects ke plain union se behtar kyun hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Object types ka union jo sab ek literal tag field share karte hain (jaise `kind: 'circle' | 'rect'`). Compiler us tag se narrow karta hai: `case 'circle'` ke andar use pata hota hai ki shape me `radius` hai. Look-alike shapes ka plain union reliably narrow nahi ho sakta.",
    detailedAnswer:
      "Ek `default` branch add karo jo value ko `never` variable me assign kare aur tumhe compile-time exhaustiveness milti hai — naya variant add karo aur ek case bhool jaao, build fail. Ye pattern bikhre hue runtime `if ('radius' in s)` checks ko replace karta hai aur 'ek value jo N known shapes me se ek hai' model karne ka idiomatic tareeka hai.",
  },
  {
    id: "tse-3",
    question: "`any` vs `unknown`, aur `as` ko fix kyun nahi maana jaata?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`any` type checking se opt out karta hai aur jo bhi touch kare usme silently faila deta hai. `unknown` safe top type hai — koi bhi value rakh sakte ho par use karne se pehle narrow (typeof, instanceof, type guard) karna padta hai. `as` compiler assertion hai, conversion nahi: wo bina validate kiye error suppress karta hai.",
    detailedAnswer:
      "Galat `as` (jaise `JSON.parse(s) as User`) bina warning ke runtime bug deta hai, kyunki runtime par koi `User` nahi hai. External data ke liye sahi approach ek runtime validation step (manual guards ya schema library) hai jiska output type trusted shape ho. `any` ko genuine escape hatches ke liye rakho aur tab bhi `unknown` prefer karo.",
    redFlag: "Deadline pressure me red squiggles chhupane ke liye reflex me `as` cast karna.",
  },
];

export default questions;
