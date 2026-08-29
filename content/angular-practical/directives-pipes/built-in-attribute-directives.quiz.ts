import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "built-in-attribute-directives-1",
    question: "Angular me directives ke teen types kaunse hain?",
    options: [
      "Public, private, protected directives",
      "Component (directive with a template), attribute directive (changes an existing element), structural directive (adds/removes DOM)",
      "ngClass, ngStyle, ngModel",
      "Template, reactive, hybrid directives",
    ],
    correctIndex: 1,
    explanation:
      "Component ek directive hai jiske paas template hota hai. Attribute directives (`ngClass`, `ngStyle`, custom `appHighlight`) element ka look/behaviour badalti hain. Structural directives (`*ngIf`/`*ngFor`, ab `@if`/`@for` blocks) DOM add/remove karti hain. Baaki options types nahi.",
    difficulty: "easy",
  },
  {
    id: "built-in-attribute-directives-2",
    question: "`[class.active]=\"employee.isActive\"` aur `[ngClass]=\"{...}\"` me kya farak hai?",
    options: [
      "`[class.active]` deprecated hai",
      "`[class.active]` ek single conditional class ke liye core syntax hai (no import); `[ngClass]` ek object/array/string se kai classes ek saath map karta hai aur `CommonModule` chahiye",
      "`[ngClass]` sirf static classes ke liye hai",
      "Dono ek hi hain, alias",
    ],
    correctIndex: 1,
    explanation:
      "`[class.x]` core binding hai — 1-3 conditionals ke liye ideal, koi import nahi. `[ngClass]` `NgClass` directive (`CommonModule`) se aata hai aur object/array/string se multiple classes handle karta hai. Option A/C/D galat.",
    difficulty: "easy",
  },
  {
    id: "built-in-attribute-directives-3",
    question: "`[ngClass]=\"{ 'badge-green': status === 'active' }\"` ko template me inline likhne ka kya downside hai?",
    options: [
      "Kuch nahi, ye recommended hai",
      "Har change-detection cycle me ek naya object literal banta hai — OnPush aur performance ke liye bura; object ko `computed()` / getter me banana behtar",
      "`ngClass` object literal accept nahi karta",
      "Ye sirf production build me kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Template me `{...}` har CD run par naya reference deta hai, jisse Angular ko lagta hai kuch badla. `computed()` me object sirf tab banta hai jab dependencies badlein — stable reference, OnPush-friendly. Option A galat, C/D galat.",
    difficulty: "medium",
  },
  {
    id: "built-in-attribute-directives-4",
    question: "`ngStyle` ke bajaye CSS class kab prefer karni chahiye?",
    options: [
      "Kabhi nahi, `ngStyle` hamesha behtar",
      "Zyadatar time — CSS classes theming, `:hover`, media queries, aur specificity ke saath kaam karti hain; `ngStyle` sirf genuinely dynamic values (jaise data se aayi width in px) ke liye",
      "Sirf jab component OnPush ho",
      "Sirf Angular Material ke saath",
    ],
    correctIndex: 1,
    explanation:
      "Inline styles (`ngStyle`) me pseudo-classes, media queries, ya theme variables use nahi kar sakte, aur wo har jagah duplicate hote hain. CSS class me styling rakho; `ngStyle`/`[style.x]` sirf tab jab value sach me runtime data se aati ho (progress width, chart bar height).",
    difficulty: "medium",
  },
];

export default quiz;
