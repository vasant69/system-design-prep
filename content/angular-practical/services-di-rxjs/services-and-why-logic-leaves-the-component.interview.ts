import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "swlc-1",
    question: "Service kya hai aur components me logic kyun nahi rakhte?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Service ek `@Injectable` class hai jo view se decoupled logic rakhti hai — HTTP/data access, business rules, shared state, helpers. Components me daalne se: duplication (multiple components same call), tough testing (render + mocks), aur no single source of truth.",
    detailedAnswer:
      "Component ki responsibility hai template render karna aur user events handle karna. Data kaise laaya jaaye, rules kya hain, state kaha rahe — ye service me. Faayde: reuse (ek `getAll()` teen jagah), testability (pure method, no DOM), single source of truth (shared state ek jagah), aur DI se swap-ability (test me fake service). `providedIn: 'root'` singleton + tree-shakeable. Service view-agnostic honi chahiye — koi DOM, koi formatting-jo-pipe-kar-sake.",
    followUp: "Ek helper jo koi state nahi rakhta aur koi dependency nahi — wo service ho ya sirf ek exported function?",
  },
  {
    id: "swlc-2",
    question: "`providedIn: 'root'` aur component-level `providers` me kya farak hai? Kab kaunsa?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`providedIn: 'root'` = ek app-wide singleton, tree-shakeable, 95% cases ka default. Component `providers: [X]` = us component aur uske children ke liye ek naya, scoped instance — deliberately isolation ke liye (ek wizard/form ka apna state, ek list ka apna filter-store).",
    detailedAnswer:
      "Hierarchical DI: injector tree me jahan service provide hoti hai wahi se (aur neeche) resolve hoti hai. `root` -> ek instance. Component `providers` -> har baar wo component instantiate hone par naya service instance, jo uske subtree ko milta hai. Use cases for scoped: (1) ek reusable `<app-employee-wizard>` jise har instance ka apna draft state chahiye; (2) route-level `providers` me ek feature store jo route chhodne par destroy ho. Galti: app-wide service ko component `providers` me daal dena -> shared state silently toot jaata hai.",
    followUp: "Route ke `providers` me diya service kab create aur kab destroy hota hai?",
  },
  {
    id: "swlc-3",
    question:
      "Ek `EmployeeService` 600 lines ka ho gaya hai — HTTP, caching, business rules, CSV export, notification triggers. Kya karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "God service smell. Responsibility ke hisaab se split: `EmployeeApiService` (HTTP + DTO mapping), `EmployeeRulesService` ya pure functions (validation/eligibility), `EmployeeExportService` (CSV), aur notification triggers ko `NotificationService` par event/call se delegate.",
    detailedAnswer:
      "Single Responsibility: har service ka ek reason-to-change ho. HTTP shape badle -> Api service. Business rule badle -> Rules. Export format badle -> Export. Ye chhote services independently test hote hain aur unke consumers minimal dependencies lete hain. Ek 'facade' service optionally rakh sakte ho jo inhe compose kare agar consumers ko convenience chahiye, par core logic split rahe. Bonus: pure functions (koi DI nahi) ko service banane ki zaroorat bhi nahi — ek `employee-rules.ts` module.",
    followUp: "Facade pattern kab helpful hai aur kab wo bhi ek god-object ban jaata hai?",
  },
  {
    id: "swlc-4",
    question: "DI service ko testable kaise banata hai? Ek concrete example.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Component apni dependency `inject()` se maangta hai, `new` se nahi banata. Test me `TestBed` ke `providers` me real service ki jagah ek fake/spy inject kar dete ho — component ko pata bhi nahi chalta.",
    detailedAnswer:
      "```ts\nTestBed.configureTestingModule({\n  providers: [{ provide: EmployeeService, useValue: fakeEmployeeService }]\n});\n```\n`fakeEmployeeService` ek object with `getAll: () => of([...])`. Ab `EmployeeListPage` ka test bina real HTTP ke chalta hai, deterministic. Ya `HttpClient` ke level par `provideHttpClientTesting()` + `HttpTestingController` se requests assert karo. DI ke bina (component `new EmployeeService()` karta) ye substitution impossible hota.",
    followUp: "`useValue`, `useClass`, `useFactory`, `useExisting` — inme se testing me kaunsa kab?",
  },
  {
    id: "swlc-5",
    question: "Service me shared mutable state rakhna kab problem banta hai, aur behtar approach kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Agar service ek plain mutable object/array expose karti hai jise koi bhi consumer directly mutate kar sakta hai, to changes untracked hote hain — OnPush components update nahi honge, aur 'kisne badla' debug karna mushkil. Behtar: state ko `signal`/`BehaviorSubject` ke andar rakho, sirf readonly expose karo, aur update methods do.",
    detailedAnswer:
      "Pattern: `private _employees = signal<Employee[]>([])`, public `employees = this._employees.asReadonly()`, aur `add(e)`, `update(e)`, `remove(id)` methods jo immutably `_employees.update(...)` karte hain. Consumers `service.employees()` read karte hain (reactive, OnPush-friendly) par mutate nahi kar sakte. `BehaviorSubject` version: `private subject`, public `state$ = subject.asObservable()`. Ye 'store' pattern hai — chhoti scale par service+signal enough, badi scale par NgRx/other.",
    followUp: "`signal.asReadonly()` aur `computed()` — dono read-only hain, farak kya hai?",
  },
];

export default questions;
