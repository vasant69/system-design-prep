import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "control-flow-if-for-switch-1",
    question: "Naya `@if` / `@for` / `@switch` control flow use karne ke liye kya import karna padta hai?",
    options: [
      "`CommonModule`",
      "`NgIf` aur `NgFor`",
      "Kuch nahi — ye compiler ka built-in feature hai, koi import nahi",
      "`ControlFlowModule`",
    ],
    correctIndex: 2,
    explanation:
      "Block control flow Angular compiler me built-in hai — zero imports. Purana `*ngIf`/`*ngFor` `CommonModule` (ya `NgIf`/`NgFor`) maangta tha. `ControlFlowModule` jaisa kuch exist nahi karta.",
    difficulty: "easy",
  },
  {
    id: "control-flow-if-for-switch-2",
    question: "`@for (x of list; track x.id)` me `track` ka kya kaam hai, aur kya wo optional hai?",
    options: [
      "Optional hai; list ko sort karta hai",
      "Mandatory hai; har item ki identity batata hai taaki list badalne par Angular DOM nodes reuse kare (perf + focus/scroll preserve)",
      "Optional hai; sirf debugging ke liye",
      "Mandatory hai; duplicate items hata deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`@for` me `track` syntactically required hai. Ye item identity deta hai; reorder/filter par Angular matching DOM node ko move karta hai instead of recreate. Legacy `*ngFor` me `trackBy` optional tha aur skip karna classic performance bug tha. `track` sort/dedupe nahi karta.",
    difficulty: "medium",
  },
  {
    id: "control-flow-if-for-switch-3",
    question: "`@if (user) { ... }` jab `user` falsy ho jaaye to andar ke elements ka kya hota hai?",
    options: [
      "Wo bas CSS se hide ho jaate hain (`display: none`), DOM me rehte hain",
      "Wo DOM se remove ho jaate hain aur child components destroy ho jaate hain (state/scroll/focus gaya)",
      "Wo disabled ho jaate hain par visible rehte hain",
      "Kuch nahi hota, `@if` sirf logging ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "`@if` conditionally DOM ko add/remove karta hai; false hone par subtree destroy ho jaata hai (component instances, unsaved form state, scroll, focus sab gaye). Sirf visually chhupana ho to `[hidden]` ya CSS class use karo — tab component alive rehta hai.",
    difficulty: "medium",
  },
  {
    id: "control-flow-if-for-switch-4",
    question: "Ek list jahan items filter/reorder hoti hain, aur har item me ek `<input>` hai. `track` ke liye kya use karna chahiye?",
    options: [
      "`track $index` — position se track karo",
      "`track item.id` — ek stable unique identifier, taaki filter/reorder par input values sahi rows ke saath rahein",
      "`track item` — pura object",
      "`track Math.random()`",
    ],
    correctIndex: 1,
    explanation:
      "Stable unique id (`item.id`) par track karne se Angular DOM nodes ko sahi items ke saath move karta hai — input focus/value preserve. `$index` position hai, identity nahi: reorder par values galat rows me dikhengi. `track item` naya-object har render pe todta hai; `Math.random()` har baar sab kuch recreate karega.",
    difficulty: "hard",
  },
];

export default quiz;
