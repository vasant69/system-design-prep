import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "fcos-1",
    question: "Angular component kya hai? Uske teen core parts batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Component ek class hai jispe `@Component` decorator hai. Teen core parts: `selector` (custom HTML tag), `template`/`templateUrl` (rendered HTML), aur `styles`/`styleUrl` (scoped CSS). Class me component ki state aur methods.",
    detailedAnswer:
      "`@Component({ selector, template, styles, imports })` decorator class ko component metadata deta hai. Selector se component ko doosre template me place karte ho. Template me Angular syntax chalta hai — `{{ }}` interpolation, `[prop]` binding, `(event)` binding, `@if`/`@for`. Styles by default us component ke elements tak scoped hote hain (view encapsulation). Standalone component `imports` me apni template dependencies list karta hai. Class me properties (state) aur methods; template inhi ko bind karta hai. Angular selector match hone par class ka instance banata hai, template compile/render karta hai, aur state change par minimal DOM update karta hai.",
    followUp: "`template` inline vs `templateUrl` external — kab kaunsa?",
  },
  {
    id: "fcos-2",
    question: "Ek component screen par kaise aata hai? Do tareeke batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "(1) Kisi parent component ke template me uska selector tag rakh do (standalone me parent ke `imports` me bhi ho). (2) Router config me kisi route ka `component` (ya `loadComponent`) us component ko set kar do, aur `<router-outlet>` usse render karega.",
    detailedAnswer:
      "Nesting: `App` template me `<app-employee-list />`. Routing: `{ path: 'employees', component: EmployeeList }` + parent template me `<router-outlet />`. Dono cases me Angular ek component instance banata hai aur uska rendered output us jagah DOM me daalta hai. Ek third indirect tareeka bhi hai — dynamic rendering (`ViewContainerRef.createComponent` / `NgComponentOutlet`) — jo modals/plugin-style UIs me use hota hai.",
    followUp: "Dynamic component render kab zaroori padta hai routing/nesting ke bajaye?",
  },
  {
    id: "fcos-3",
    question: "`@for` (naya control flow) aur purana `*ngFor` — farak aur `track` ka role?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`@for (item of items; track item.id) { }` built-in control flow hai (v17+), template me directly, koi import nahi. `*ngFor` structural directive thi jise `CommonModule`/`NgFor` chahiye tha. Dono me `track` list diff ke liye item identity deta hai — DOM node reuse, better performance.",
    detailedAnswer:
      "Naya `@for` compiler-level feature hai: faster, `track` mandatory (syntax hi enforce karta hai), aur `@empty { }` block deta hai khaali list ke liye. Purana `*ngFor=\"let item of items; trackBy: trackFn\"` optional `trackBy` leta tha jise log aksar skip kar dete the, jisse har change par poora list re-render hota tha. `track` ke bina bade lists me: (1) performance drop, (2) `<input>` focus/scroll state loss, (3) unnecessary component re-creation. Best practice: stable unique key (usually `id`); agar sach me koi identity nahi to `track $index`.",
    followUp: "`track $index` kab safe hai aur kab dangerous?",
    redFlag: "'track optional hai, chhod do' — naye `@for` me syntactically required hai, aur purane me skip karna common bug source tha.",
  },
  {
    id: "fcos-4",
    question:
      "Ek junior ne 400-line ka HTML poore 'Employees' page ke liye ek hi component ke inline `template` string me daal diya. Aap kya feedback doge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Do problems: (1) 400-line inline string me koi HTML tooling nahi (highlight, format, lint) aur merge conflicts painful; (2) ek component itna bada matlab wo bahut saari responsibilities le raha hai. Isko chhote components me todo (toolbar, table, row, paginator) aur templates external files me.",
    detailedAnswer:
      "Refactor direction: `EmployeesPage` (route component: data fetch + state), `EmployeeToolbar` (search + add), `EmployeeTable` (dumb, `@Input` rows + `@Output` events), `Paginator`. Har component ka template `templateUrl` me. Isse: reusability (table dobara use ho sakti hai), testability (chhota component isolate karke test), aur readability. Guideline: component ki TS logic roughly 200 lines se kam, template itna ki ek screen me samajh aa jaaye. Bada inline template sirf tab theek jab wo genuinely 5-10 lines ka ho.",
    followUp: "'Smart' (container) aur 'dumb' (presentational) component split se ye refactor kaise map hota hai?",
  },
  {
    id: "fcos-5",
    question: "Component selector aur class naam ke naming conventions kya hain, aur kyun matter karte hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Selector: kebab-case with app prefix (`app-employee-list`), taaki custom elements native HTML se collide na karein aur project-wide consistent rahein. Class: PascalCase (`EmployeeList`). Files: kebab-case.",
    detailedAnswer:
      "Prefix (`app-` by default, `angular.json` me configurable) ownership signal karta hai — teesri-party components apne prefix use karte hain (`mat-`, `nz-`), isliye clash nahi hota. Kebab-case custom element spec follow karta hai. Consistent naming se `ng g c` output predictable, aur code review me pattern turant pehchana jaata hai. CLI generators ye sab automatically theek karte hain — isliye manually banane ke bajaye `ng g c` use karna chahiye.",
    followUp: "Ek shared component library banao to prefix kya rakhoge aur kaise configure karoge?",
  },
];

export default questions;
