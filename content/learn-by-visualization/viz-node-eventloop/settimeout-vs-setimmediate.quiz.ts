import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "settimeout-vs-setimmediate-1",
    question:
      "`fs.readFile(__filename, () => { setTimeout(() => console.log('T'), 0); setImmediate(() => console.log('I')); });` — output?",
    options: [
      "`T` phir `I`",
      "`I` phir `T` — hamesha",
      "Run-to-run non-deterministic",
      "Sirf `I` (T kabhi nahi chalta)",
    ],
    correctIndex: 1,
    explanation:
      "readFile callback poll phase ke andar chalta hai. Poll ke turant baad check phase aata hai, jahan `setImmediate` (`I`) chalta hai. `setTimeout` timers phase ke liye hai jo agle loop iteration mein aata hai, isliye `T` baad mein. I/O callback ke andar ye order deterministic hai — `I` hamesha pehle.",
    difficulty: "medium",
  },
  {
    id: "settimeout-vs-setimmediate-2",
    question: "`setTimeout(fn, 0)` mein `fn` ka actual minimum wait kitna hai?",
    options: [
      "0 ms — exactly turant",
      "1 ms — Node `0` ko 1 pe clamp karta hai",
      "4 ms — HTML5 spec ki tarah",
      "16 ms — ek frame",
    ],
    correctIndex: 1,
    explanation:
      "Node `setTimeout` delay ko minimum 1ms treat karta hai (`0` aur negative bhi 1 ban jaate hain). Plus wo tabhi chalega jab loop timers phase tak pahunche aur stack khali ho — busy loop mein ye 1ms se kaafi zyada ho sakta hai. Browser ka nested-timeout 4ms clamp yahan lagu nahi hota.",
    difficulty: "easy",
  },
  {
    id: "settimeout-vs-setimmediate-3",
    question: "`setImmediate(cb)` ka callback kis event loop phase mein chalta hai?",
    options: ["timers phase", "check phase", "poll phase", "pending callbacks phase"],
    correctIndex: 1,
    explanation:
      "`setImmediate` specifically check phase ke liye design kiya gaya hai, jo poll phase ke turant baad aata hai. Isiliye ek I/O (poll) callback ke andar se `setImmediate` usi tick mein chal jaata hai. `setTimeout` timers phase mein hai, jo loop ke shuruaat mein.",
    difficulty: "easy",
  },
  {
    id: "settimeout-vs-setimmediate-4",
    question:
      "Main module ke top pe: `setTimeout(() => console.log('a'), 0); setImmediate(() => console.log('b'));` — output order guaranteed hai?",
    options: [
      "Haan — hamesha `a` phir `b`",
      "Haan — hamesha `b` phir `a`",
      "Nahi — process ko loop start tak pahunchne mein laga time decide karta hai; dono order possible",
      "Nahi — dono kabhi nahi chalte kyunki koi I/O nahi",
    ],
    correctIndex: 2,
    explanation:
      "Main module se ye ek race hai. Jab loop pehli baar timers phase check karta hai, agar 1ms already beet chuka hai to `setTimeout` ready hai aur `a` pehle; warna loop check phase pe pahunch ke `b` pehle chalata hai. Machine speed aur startup cost pe depend karta hai, isliye output run-to-run flip ho sakta hai. (Dono callbacks chalte zaroor hain.)",
    difficulty: "medium",
  },
];

export default quiz;
