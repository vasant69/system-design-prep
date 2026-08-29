import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "built-in-pipes-1",
    question: "Pipe kya karta hai aur kahan likha jaata hai?",
    options: [
      "Component class me data ko API ke liye transform karta hai",
      "Template me `|` operator se ek value ko display ke liye transform karta hai (`{{ value | date:'dd MMM yyyy' }}`)",
      "Ek HTTP request bhejta hai",
      "Routes ko configure karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Pipe ek template-level display transform hai — `{{ value | pipeName:args }}`. Arguments `:` se, aur pipes chain ho sakti hain. Ye component ki logic nahi, sirf presentation.",
    difficulty: "easy",
  },
  {
    id: "built-in-pipes-2",
    question: "`async` pipe ka sabse bada faayda manual `.subscribe()` ke muqable kya hai?",
    options: [
      "Ye faster HTTP request bhejta hai",
      "Ye subscribe karta hai, latest value template ko deta hai, aur component destroy hone par automatically unsubscribe kar deta hai — memory leak nahi, aur OnPush-friendly",
      "Ye data ko cache karta hai permanently",
      "Ye Observable ko Promise me convert karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`async` pipe subscription lifecycle khud manage karta hai — `ngOnDestroy` me unsubscribe likhne ki zaroorat nahi — aur emit hone par `markForCheck` karta hai jisse OnPush components update hote hain. Baaki options galat.",
    difficulty: "medium",
  },
  {
    id: "built-in-pipes-3",
    question: "`{{ number | number:'1.2-2' }}` me `'1.2-2'` ka matlab?",
    options: [
      "Version 1.2.2",
      "Min 1 integer digit, min 2 fraction digits, max 2 fraction digits — yani hamesha exactly 2 decimals",
      "1 se 2 tak ke numbers dikhao",
      "2 significant figures",
    ],
    correctIndex: 1,
    explanation:
      "Digit format string `'{minInt}.{minFrac}-{maxFrac}'` hai. `'1.2-2'` = kam se kam 1 integer digit, aur exactly 2 decimal places. `'1.0-0'` = no decimals. `'1.0-2'` = 0 to 2 decimals.",
    difficulty: "medium",
  },
  {
    id: "built-in-pipes-4",
    question: "Employee list ko naam se filter karne ke liye ek custom pipe (`{{ employees | filterByName:term }}`) banana kaisa idea hai?",
    options: [
      "Best practice — pipes filtering ke liye hi bane hain",
      "Anti-pattern — pure pipe input reference badalne par hi chalega (naye filter miss ho sakte hain), aur impure banao to har CD cycle me chalega (slow). Filtering component me `computed()`/signal se karo",
      "Theek hai agar list chhoti ho",
      "Sirf tab galat jab list server se aati ho",
    ],
    correctIndex: 1,
    explanation:
      "Angular docs bhi explicitly filtering/sorting pipes se mana karti hain. Pure pipe memoization identity par hota hai; impure har change detection par — dono list-filtering ke liye problematic. Filtering logic component state (signals/`computed`) me rakho jahan wo predictable aur testable ho.",
    difficulty: "hard",
  },
];

export default quiz;
