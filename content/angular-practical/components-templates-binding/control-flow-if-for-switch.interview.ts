import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cfifs-1",
    question: "Modern Angular ka built-in control flow kya hai? Legacy directives se kaise alag?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`@if`/`@else if`/`@else`, `@for (... ; track ...)` + `@empty`, `@switch`/`@case`/`@default` — compiler me built-in, koi import nahi. Legacy `*ngIf`/`*ngFor`/`*ngSwitch` structural directives the jinhe `CommonModule` chahiye tha, `else` verbose tha via `<ng-template>`, aur `trackBy` optional tha.",
    detailedAnswer:
      "Naya syntax v17 me stable hua. Faayde: zero imports, inline `@else`/`@empty`, `track` mandatory (perf by default), aur compiler-optimized runtime (kuch benchmarks me significantly faster). Semantics wahi — conditional DOM add/remove, list rendering — bas syntax aur ergonomics behtar. Legacy directives abhi bhi supported hain, par naye code me block syntax use hota hai. Migration schematic: `ng g @angular/core:control-flow`.",
    followUp: "`@if (data(); as d)` syntax kya karta hai?",
  },
  {
    id: "cfifs-2",
    question: "`@for` me `track` mandatory kyun banaya gaya? Bina proper track ke kya hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`track` Angular ko har item ki identity deta hai, taaki list badalne par wo existing DOM nodes ko match karke reuse/move karein instead of sab destroy-recreate. Bina proper identity ke: unnecessary re-renders, lost `<input>` focus, reset scroll, aur bade lists me janky performance.",
    detailedAnswer:
      "Legacy `*ngFor` me `trackBy` optional tha aur developers routinely skip kar dete the — har list update par Angular saare rows dobara render karta tha, jo ek top interview 'performance bug' example ban gaya. Naye `@for` me syntax hi `track` enforce karta hai. Best: stable unique key (`item.id`). Agar sach me id nahi aur list append-only hai to `track $index`. Kabhi `track` me naya object/`Math.random()` mat do.",
    followUp: "`track $index` kab safe hai aur kab silent bug deta hai?",
    redFlag: "'track optional detail hai, chhod do' — new syntax me compile error, aur concept top perf pitfall hai.",
  },
  {
    id: "cfifs-3",
    question: "`@if` se element hide karna aur `[hidden]`/CSS se hide karna — kab kaunsa?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`@if` element ko DOM se remove karta hai — child components destroy, un, wapas aane par fresh. Heavy/rarely-shown content ke liye achha (kam DOM, kam CD). `[hidden]`/CSS element ko alive rakhta hai, sirf chhupata hai — frequently toggled cheez ya jab state preserve karni ho (form draft, scroll) ke liye.",
    detailedAnswer:
      "Example: ek collapsible 'Advanced filters' panel jo user baar-baar khol-band karta hai aur jisme adhoora bhara form ho — `@if` use karne se har baar band karne par input values gum. `[hidden]` behtar. Ulta: ek 'Delete confirmation' area jo bahut kam dikhta hai aur bhaari hai — `@if` behtar, warna wo hamesha DOM/CD me hai. Rule of thumb: preserve state + frequent toggle -> hide; expensive + rare -> `@if`.",
    followUp: "Ek tab group me active tab ke content ke liye `@if` use karoge ya `[hidden]`? Trade-off?",
  },
  {
    id: "cfifs-4",
    question:
      "Ek legacy component me `<div *ngIf=\"loading; else content\">...</div><ng-template #content>...</ng-template>` hai. Ise naye syntax me convert karo.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`@if (loading) { <div>...</div> } @else { ... }` — `else` template ab inline `@else` block hai, `<ng-template #content>` ki zaroorat khatam.",
    detailedAnswer:
      "Legacy `*ngIf` ka `else`/`then` `<ng-template>` refs par depend karta tha, jo indirection add karta tha. Block syntax me sab kuch ek jagah nested hota hai — padhna aasan. Poore codebase ke liye manual mat karo: `ng g @angular/core:control-flow` schematic `*ngIf`/`*ngFor`/`*ngSwitch` ko automatically migrate karta hai, phir diff review kar lo (khaaskar jaha `trackBy` nahi tha wahan track kya bana).",
    followUp: "Migration schematic un `*ngFor` ke liye kya karta hai jinme `trackBy` nahi tha?",
  },
  {
    id: "cfifs-5",
    question: "`@empty` block ka kya faayda hai `@if (list.length === 0)` ke muqable?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`@empty` `@for` ka hissa hai aur automatically tab render hota hai jab collection me koi item nahi — ek separate condition maintain nahi karni, aur do jagah truth-source rakhne ka risk nahi.",
    detailedAnswer:
      "`@for (e of items; track e.id) { <row/> } @empty { <p>No results</p> }` — Angular khud track karta hai items empty hai ya nahi. `@if (items.length === 0)` alag likhne se: (1) duplication, (2) `items` async/undefined hone par `.length` crash, (3) refactor par ek jagah update karna bhool jaana. `@empty` in sab se bachata hai.",
    followUp: "Agar 'empty' aur 'loading' dono states chahiye to template structure kaise rakhoge?",
  },
];

export default questions;
