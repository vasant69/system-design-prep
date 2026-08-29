import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ipdd-1",
    question: "`@Input()` decorator aur `input()` signal function — dono samjhao aur farak batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`@Input() x: T` classic property-based input hai; parent `[x]=\"v\"` se set karta hai, change react karne ke liye `ngOnChanges` ya `@Input set`. `x = input<T>(default)` / `input.required<T>()` signal-based hai — read `x()`, required inputs compile-enforced, transforms built-in, `computed`/`effect` me natural, no `ngOnChanges` boilerplate.",
    detailedAnswer:
      "Dono me data one-way parent->child. `input()` v17.1+ ka hai. Faayde: (1) `input.required()` binding missing hone par build error; (2) signal hone se OnPush ke saath perfectly, aur derived state `computed(() => this.x() * 2)`; (3) `input(0, { transform: numberAttribute })` string attribute ko coerce; (4) alias `input(v, { alias: 'outer' })`. Signal inputs read-only hote hain child ke liye (immutability by design). Existing codebases me `@Input()` abhi bhi common hai, isliye dono aane chahiye.",
    followUp: "`input()` ka value child ke andar writable hai kya? Agar nahi to two-way ke liye kya use karoge?",
  },
  {
    id: "ipdd-2",
    question: "Input value change hone par child ko kuch karna hai (jaise naya id aane par data reload). Kaise?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Signal input ke saath: `effect(() => this.load(this.id()))` ya ek `computed`/resource jo `id()` par depend kare. Classic `@Input` ke saath: `ngOnChanges(changes)` me `changes['id']` check karo, ya `@Input set id(v) { ...; this.load(v); }`.",
    detailedAnswer:
      "`ngOnChanges` har input change par `SimpleChanges` deta hai (`previousValue`, `currentValue`, `firstChange`) — verbose par explicit. `@Input set` concise hai but ek private backing field chahiye. Signal `effect()` sabse clean: `id()` read hote hi dependency register, badalne par re-run. Data loading ke liye Angular ka `resource()` / `rxResource()` even better — `id()` signal par keyed, automatic loading/error/cancellation. Anti-pattern: `ngDoCheck` me manual comparison.",
    followUp: "`effect()` me HTTP call karna kya recommended hai, ya koi behtar API hai?",
  },
  {
    id: "ipdd-3",
    question: "Ek component ke 10 inputs ho gaye hain. Kya feedback doge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "10 inputs aksar signal hai ki component do-teen responsibilities le raha hai. Options: (1) related inputs ko ek typed config object me group karo; (2) component ko chhote presentational pieces me todo; (3) kuch 'inputs' actually content projection (`ng-content`) se aane chahiye.",
    detailedAnswer:
      "Concrete: agar `EmployeeCard` ke paas `showEdit`, `showDelete`, `showExport`, `showArchive` hain — ye ek `actions: CardAction[]` input ya projected `<app-employee-card><button>...</button></app-employee-card>` ban sakta hai. Agar `titleColor`, `titleSize`, `borderStyle` hain — ye CSS/theme concern hai, input nahi. Rule of thumb: presentational component ke 3-6 inputs healthy; usse zyada -> refactor. Har naya boolean input 'flag soup' ki taraf le jaata hai.",
    followUp: "Boolean flag inputs ki jagah ek discriminated-union 'variant' input kab better hai?",
  },
  {
    id: "ipdd-4",
    question: "`@Input({ transform: booleanAttribute })` kya karta hai? Ek use case do.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`booleanAttribute` HTML-attribute-style truthiness ko coerce karta hai: `<app-btn disabled>` (no value) -> `disabled === true`, `disabled=\"false\"` -> `false`, absent -> `false`. Native elements jaisa ergonomic API deta hai.",
    detailedAnswer:
      "Bina transform ke `<app-btn disabled>` string `\"\"` pass karta (jo truthy hota hai but confusing) aur `[disabled]=\"true\"` likhna padta. `booleanAttribute` presence-based boolean semantics deta hai. `numberAttribute` similarly `<app-pager page=\"3\">` ko number `3` banata hai. `input(false, { transform: booleanAttribute })` signal form me same. Ye reusable design-system components ke liye khaas useful — consumers native HTML ki tarah likh sakte hain.",
    followUp: "Ek custom transform function likho jo comma-separated string ko `string[]` bana de.",
  },
  {
    id: "ipdd-5",
    question: "Sibling components ko ek dusre se data chahiye. Inputs se to nahi hota — kya karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Do options: (1) State ko common parent me uthao — parent ek sibling se `output()` par sunta hai aur dusre ko `input()` se deta hai ('lift state up'). (2) Ek shared service (signals/`BehaviorSubject`) jise dono siblings inject karte hain.",
    detailedAnswer:
      "Chhote, tightly-coupled siblings (jaise ek filter bar aur ek list ek hi page par) ke liye parent me state rakhna simplest — data flow visible rehta hai. Jab siblings door hain ya kai jagah same state chahiye (auth user, notifications, cart) to ek `providedIn: 'root'` service with a signal store better — dono `inject(SharedService)` karke `service.value()` read/`service.set()` karte hain. Direct sibling-to-sibling wiring (ViewChild se dusre sibling ko dhoondhna) fragile hai — avoid.",
    followUp: "Service-based sharing me OnPush components auto-update kaise honge — signal vs BehaviorSubject?",
  },
];

export default questions;
