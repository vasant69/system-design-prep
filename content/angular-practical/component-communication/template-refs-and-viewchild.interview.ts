import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "trvc-1",
    question: "Template reference variable kya hai? Native element aur component par lagne se kya milta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`#name` ek template me kisi element/component ko label karta hai, usable sirf us hi template me. Native element par -> DOM element (`HTMLInputElement`). Component/directive par -> uska instance (ya `exportAs` diya ho to wo, jaise `#f=\"ngForm\"`).",
    detailedAnswer:
      "`<input #box>` + `<button (click)=\"box.focus()\">` — koi class code nahi. `<app-child #c>` + `{{ c.title }}` — child instance. `<form #f=\"ngForm\">` — `NgForm` directive instance (`f.valid`, `f.value`). Ref sirf declaring template me visible; class me chahiye to `@ViewChild('box')` / `viewChild('box')`. Refs template-driven forms aur chhote local interactions me handy hain bina class properties banae.",
    followUp: "`#f` aur `#f=\"ngForm\"` me kya farak hai ek `<form>` par?",
  },
  {
    id: "trvc-2",
    question: "`@ViewChild` / `viewChild()` kab use karoge jab `@Input`/`@Output` available hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Jab kaam imperative hai aur declarative binding se express nahi hota: `<input>` focus/select, `scrollIntoView`, DOM measurement, ek non-Angular library ko ek element me mount karna, ya ek child component ka public imperative method call karna (`modal.open()`, `table.clearSelection()`).",
    detailedAnswer:
      "Default hamesha inputs/outputs — declarative, testable, decoupled. `ViewChild` tab jab: (1) focus management (accessibility, form UX); (2) integrate charts/maps/editors jo raw DOM node chahte hain; (3) ek genuinely imperative child API (jaise ek generic modal jise programmatically kholna). Anti-pattern: `ViewChild` se child ki state read/write karke props ki jagah use karna. Signal `viewChild()` modern preference — timing signal-based, `effect`/`afterNextRender` ke saath clean.",
    followUp: "`viewChild.required()` kab use karoge, aur wo timing ke baare me kya guarantee deta hai?",
  },
  {
    id: "trvc-3",
    question:
      "`ngOnInit` me `this.chart().nativeElement` access karne par `undefined` aata hai. Kyun aur fix?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "View abhi render nahi hua `ngOnInit` par, isliye `viewChild`/`@ViewChild` populate nahi. Fix: `ngAfterViewInit` (classic) me access karo, ya signal form me `afterNextRender(() => this.chart()?.nativeElement...)` / ek `effect()` jo chart signal defined hone par chale.",
    detailedAnswer:
      "Lifecycle: `ngOnInit` -> view creation -> `ngAfterViewInit`. `@ViewChild` bina `{ static: true }` ke `ngAfterViewInit` me ready. `{ static: true }` sirf tab kaam karta hai jab element kisi `@if`/`@for` ke andar nahi. Signal `viewChild()` ka value render ke baad set hota hai — `afterNextRender`/`afterEveryRender` ya `effect` best jagah. Agar element conditional hai (`@if (ready())`), to `effect(() => { const el = this.chart(); if (el) initChart(el); })`.",
    followUp: "SSR ke context me `afterNextRender` kyun `ngAfterViewInit` se safer hai DOM work ke liye?",
  },
  {
    id: "trvc-4",
    question:
      "Ek reusable `<app-panel>` chahiye jo optionally footer actions dikhaye agar consumer ne diye hon. Kaise detect karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Multi-slot content projection: `<ng-content select=\"[panelActions]\" />` ek footer slot me. Detect karne ke liye `contentChild(PanelActions)` ya `contentChildren` — agar present hai to footer container render karo (`@if (actions())`).",
    detailedAnswer:
      "```ts\n@Component({ selector: 'app-panel', template: `\n  <div class=\"body\"><ng-content /></div>\n  @if (hasActions()) {\n    <footer><ng-content select=\"[panelActions]\" /></footer>\n  }\n`})\nexport class Panel {\n  private actions = contentChildren(PanelActionsDirective);\n  hasActions = computed(() => this.actions().length > 0);\n}\n```\nConsumer: `<app-panel><div panelActions><button>Save</button></div></app-panel>`. `ContentChild(ren)` isliye kyunki actions parent ne project kiye, panel ke apne template me nahi. Isse panel apna layout consumer ke content ke hisaab se adapt karta hai.",
    followUp: "`contentChild` `ngAfterContentInit` me ready hota hai — `ngAfterViewInit` se ye kyun pehle hai?",
  },
  {
    id: "trvc-5",
    question:
      "Ek developer ne parent me `viewChild(ChildForm)` liya aur `this.childForm().formGroup.reset()` call kar raha hai. Kya feedback?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Parent child ke internal `formGroup` ko reach kar raha hai — tight coupling, brittle. Behtar: child ek public `reset()` method expose kare (ya ek `[resetSignal]` input jise child observe kare), taaki child apna internal model khud manage kare.",
    detailedAnswer:
      "`viewChild` se child ka public API call karna acceptable hai (`childForm().reset()`), par uske internals (`formGroup`, private fields) ko touch karna encapsulation break hai — child refactor kare (FormGroup se signals) to parent toot jaayega. Options: (1) child par `reset(): void` public method; (2) parent se ek `input()` (`resetToken = input(0)`) aur child me `effect(() => { this.resetToken(); this.form.reset(); })`; (3) agar parent ko form value chahiye to child `save = output<FormValue>()` emit kare. Rule: cross ONLY the public contract.",
    followUp: "Child ka public imperative method aur ek input-driven trigger — kab kaunsa design behtar hai?",
  },
];

export default questions;
