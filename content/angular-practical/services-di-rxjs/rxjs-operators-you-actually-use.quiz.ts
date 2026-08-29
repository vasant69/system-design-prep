import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "rxjs-operators-you-actually-use-1",
    question: "Search-as-you-type ke liye kaunsa flattening operator sahi hai aur kyun?",
    options: [
      "`mergeMap` — sabhi requests parallel chalein",
      "`switchMap` — nayi search term aane par purani (stale) request cancel ho jaati hai, sirf latest result aata hai",
      "`concatMap` — requests queue me ek ke baad ek",
      "`exhaustMap` — pehli search ke baad baaki ignore",
    ],
    correctIndex: 1,
    explanation:
      "`switchMap` naye source value par purana inner subscription cancel karta hai. Search me user latest term ka result chahta hai; `mergeMap` se slow purani response nayi ke baad aake galat results dikha sakti hai (stale-response bug).",
    difficulty: "medium",
  },
  {
    id: "rxjs-operators-you-actually-use-2",
    question: "`debounceTime(300)` aur `throttleTime(300)` me kya farak hai?",
    options: [
      "Dono same hain",
      "`debounceTime` value emit karne se pehle 300ms ki silence ka wait karta hai (typing ke liye); `throttleTime` pehli value turant deta hai phir 300ms ignore karta hai (scroll/resize ke liye)",
      "`throttleTime` sirf HTTP ke liye hai",
      "`debounceTime` values ko double kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Debounce = 'jab tak activity ruk na jaaye, wait'. Throttle = 'ek deo, phir thodi der chup'. Typing me debounce chahiye (user ke rukne par search); high-frequency events (scroll) me throttle chahiye (regular sampling).",
    difficulty: "medium",
  },
  {
    id: "rxjs-operators-you-actually-use-3",
    question: "`catchError(err => ...)` ke callback ko kya return karna chahiye?",
    options: [
      "Ek plain value jaise `[]`",
      "Ek Observable — ya to ek fallback (`of(defaultValue)`) jo stream ko alive rakhe, ya `throwError(() => err)` jo error ko aage bhej de",
      "`undefined`",
      "`true` ya `false`",
    ],
    correctIndex: 1,
    explanation:
      "`catchError` ka handler ek naya Observable return karta hai jo error hone par switch-in hota hai. `of([])` recovery deta hai (downstream ko empty milta hai, koi error nahi). `throwError(() => err)` rethrow karta hai. Plain value ya `undefined` return karna error deta hai.",
    difficulty: "medium",
  },
  {
    id: "rxjs-operators-you-actually-use-4",
    question: "`forkJoin([a$, b$, c$])` kab emit karta hai?",
    options: [
      "Jab bhi koi ek input emit karein",
      "Sirf ek baar, jab teenon inputs complete ho jaayein — unki last values ek array me. Agar koi input complete na ho (jaise `interval`), forkJoin kabhi emit nahi karega",
      "Har second",
      "Jab pehla input emit karein",
    ],
    correctIndex: 1,
    explanation:
      "`forkJoin` 'sab parallel chalao, sab ke complete hone ka wait, phir final values ek saath' — parallel HTTP loads ke liye ideal. `combineLatest` iske ulta: jab bhi koi badle, sab ki latest values. Non-completing source `forkJoin` ko hang kara deta hai.",
    difficulty: "hard",
  },
];

export default quiz;
