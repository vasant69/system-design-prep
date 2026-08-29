import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "brpc-1",
    question: "Container/presentational (smart/dumb) pattern samjhao. Kya benefits hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Container/smart component services inject karta hai, data fetch karta hai, state hold karta hai, aur business decisions leta hai (usually route-bound). Presentational/dumb component sirf `@Input` leta hai, `@Output` emit karta hai, koi service nahi, `OnPush`. Benefits: reuse, trivial tests, fast CD, clear debugging boundaries, parallel development.",
    detailedAnswer:
      "Smart component template mostly dumb components ko compose karta hai aur unke outputs handle karta hai. Dumb component ek pure function of inputs hai — same inputs, same UI. Testing: dumb ka test = `TestBed` + inputs + assert (no mocks); smart ka test = service mocks + state assertions. Debugging: 'data galat' -> smart; 'UI/styling galat' -> dumb. Design consistency: ek `DataTable`, ek look, har screen. Cost: zyada files, aur ek genuinely one-off screen ke liye over-engineering ho sakta hai.",
    followUp: "Signals aane ke baad kya ye pattern kam relevant ho gaya, ya same rehta hai?",
  },
  {
    id: "brpc-2",
    question: "Ek reusable component ka input/output API kaise design karoge? Kya avoid karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Minimal, well-typed inputs; `input.required()` for mandatory; sensible defaults. Outputs action-named (`rowClick`, `sortChange`, `save`) with typed payloads. Avoid: flag soup (many booleans), leaking backend shapes as inputs, `on`-prefixed outputs, and injecting app services.",
    detailedAnswer:
      "Good API: `[columns] [rows] [loading]` + `(rowClick) (sortChange)`. Bad: `[showEdit] [showDelete] [showExport] [dense] [striped] [bordered]` — inko `[variant]` / config object / projection / CSS me consolidate karo. Backend leak: `[employee]` as the raw API DTO couples the component to that endpoint — ek narrow view-model type banao. Outputs ka payload minimal aur typed (`output<Row>()` not `output<any>()`). API galat design = har consumer ko baad me refactor.",
    followUp: "Ek `[variant]` union input aur teen boolean inputs — kab kaunsa behtar?",
  },
  {
    id: "brpc-3",
    question:
      "EMS me Employees, Departments, Roles, Leave sab list screens chahiye. Architecture kaise rakhoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ek shared dumb `DataTable` + `Paginator` + `ConfirmModal` + `Toolbar` `shared/ui/` me. Har entity ke liye ek smart `XListPage` component jo apni service inject kare, columns define kare, aur shared dumb components compose kare. Common list logic (pagination/filter/sort state) ek reusable hook/service me.",
    detailedAnswer:
      "Layers: (1) `shared/ui` — presentational, entity-agnostic. (2) `features/<entity>/` — `EmployeeListPage` (smart): `inject(EmployeeService)`, `columns: Column[]`, event handlers (`viewDetails`, `confirmDelete`, `sortChange`). (3) Common list state (page/pageSize/search/sort signals + derived query) ek `createListState()` factory ya a small `ListStore` class me — har smart page use kare, duplicate na ho. Result: naya entity = ~1 smart component + column config, baaki reuse. Consistency free me (same table, same paginator, same empty-state).",
    followUp: "Common list state ko ek base class, ek factory function, ya ek service — kaunsa aur kyun?",
  },
  {
    id: "brpc-4",
    question:
      "Ek team member bolta hai 'smart/dumb split bakwaas hai, extra files, main sab ek component me likhta hoon'. Kya jawab?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Chhoti ek-baar-use screen ke liye unki baat sahi ho sakti hai — split tab value deta hai jab reuse ya testability chahiye. Par bade apps me monolithic components 400+ line ke ho jaate hain, test karne ke liye poora backend mock chahiye, aur ek jagah ka change dusri jagah tod deta hai. Split boundaries deta hai.",
    detailedAnswer:
      "Balanced view: (1) YAGNI — ek settings toggle screen ke liye 5 dumb components mat banao. (2) Par jahan pattern repeat hota hai (list screens, forms, dialogs) wahan shared dumb components huge leverage dete hain. (3) Testability: ek dumb `DataTable` ka test 20 lines; ek monolithic list page ka test 150 lines with mocks. (4) Change detection: shared `OnPush` dumb components perf. Rule: extract jab (a) 2nd use case aaye, ya (b) component 200+ lines ho, ya (c) test karna painful ho.",
    followUp: "'Rule of three' (teesre duplication par abstract karo) is context me kaisa apply hota hai?",
    redFlag: "'Hamesha sab kuch ek component me' ya 'hamesha har cheez ko 5 components me todo' — dono extremes; context decide karta hai.",
  },
  {
    id: "brpc-5",
    question: "Dumb component ka unit test smart component ke test se structurally kaise alag hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Dumb: `TestBed.configureTestingModule({ imports: [Comp] })`, `fixture.componentRef.setInput('rows', data)`, `fixture.detectChanges()`, phir DOM assert aur emitted outputs (`spyOn`/subscribe) assert. Koi HTTP/router/service mock nahi. Smart: `provideHttpClientTesting()`, router harness ya `RouterTestingModule`, service ko `useValue`/spy se replace, phir state aur interactions assert.",
    detailedAnswer:
      "Dumb component test fast, stable, aur behaviour-focused hota hai — 'ye input do, ye dikhna chahiye, ye click karo, ye event emit hona chahiye'. Smart component test integration-ish hota hai — 'service ne ye diya, component ne ye state banaya, delete par service.delete call hua aur list refresh hua'. Isliye smart/dumb split test suite ko bhi fast aur maintainable rakhta hai: zyaadatar logic dumb components + pure functions me, kam se kam heavy smart-component tests.",
    followUp: "`fixture.componentRef.setInput()` aur directly `component.someInput = x` set karne me kya farak hai signal inputs ke saath?",
  },
];

export default questions;
