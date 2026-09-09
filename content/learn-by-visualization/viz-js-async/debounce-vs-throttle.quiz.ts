import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "debounce-vs-throttle-1",
    question:
      "Ek user 2 second tak lagataar type karta hai, phir ruk jaata hai. `debounce(fn, 300)` ke saath `fn` kitni baar chalega?",
    options: [
      "Har keystroke pe ek baar",
      "Sirf ek baar — aakhri keystroke ke 300ms baad",
      "Har 300ms mein ek baar typing ke dauran",
      "Bilkul nahi",
    ],
    correctIndex: 1,
    explanation:
      "Debounce har naye event pe pichla timer `clearTimeout` karke naya `setTimeout(delay)` lagata hai. Jab tak keystrokes 300ms se kam gap pe aate rahenge, timer baar-baar reset hota rahega aur `fn` nahi chalega. Typing rukne ke 300ms baad timer poora hota hai — tab ek call. 'Har 300ms mein ek baar' throttle ka behaviour hai.",
    difficulty: "easy",
  },
  {
    id: "debounce-vs-throttle-2",
    question:
      "`scroll` event 1 second mein lagbhag 50 baar fire hota hai. `throttle(fn, 100)` ke saath us second mein `fn` kitni baar chalega (lagbhag)?",
    options: ["50", "Lagbhag 10", "1", "0"],
    correctIndex: 1,
    explanation:
      "Throttle `fn` ko har `interval` (100ms) mein zyaada se zyaada ek baar chalne deta hai. 1 second = 1000ms, to lagbhag 10 windows, matlab lagbhag 10 calls — chahe event 50 baar fire ho. Debounce hota to poore scroll ke dauran 0 calls aur ruknay pe 1 call.",
    difficulty: "medium",
  },
  {
    id: "debounce-vs-throttle-3",
    question:
      "Search-as-you-type autocomplete ke liye debounce chahiye ya throttle, aur kyun?",
    options: [
      "Throttle — har 200ms mein result chahiye",
      "Debounce — user ke type karna band karne ka wait, phir ek API call; beech ke adhoore queries pe call bekaar hai",
      "Dono barabar theek hain",
      "Koi nahi — har keystroke pe call karna hi sahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Autocomplete mein tumhe sirf final (ya lagbhag final) query ka result chahiye. Debounce beech ke keystrokes pe call skip kar deta hai aur typing rukne pe ek call bhejta hai — kam requests, kam race conditions. Throttle beech-beech ke incomplete queries (`l`, `la`, `lap`) pe bhi call bhej dega — waste. Har keystroke pe call rate-limit aur race conditions laata hai.",
    difficulty: "medium",
  },
  {
    id: "debounce-vs-throttle-4",
    question:
      "Debounce aur throttle dono function apne timer/timestamp ko kis cheez mein rakhte hain?",
    options: [
      "Ek global variable mein",
      "Returned inner function ke closure mein (outer function ke scope ki variable)",
      "`localStorage` mein",
      "Ek CSS custom property mein",
    ],
    correctIndex: 1,
    explanation:
      "Dono ka pattern: outer function `let timer` ya `let last` declare karti hai aur ek inner function return karti hai. Inner function us variable ko closure ke through yaad rakhta hai — har call ke beech state survive karti hai bina global pollution ke. Isi liye har `debounce(fn, d)` call apna alag independent timer rakhta hai.",
    difficulty: "easy",
  },
];

export default quiz;
