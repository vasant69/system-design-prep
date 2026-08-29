import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "building-reusable-presentational-components-1",
    question: "Presentational (dumb) component ki defining characteristic kya hai?",
    options: [
      "Wo hamesha chhota hota hai",
      "Wo sirf `@Input` se data leta hai aur `@Output` se events emit karta hai — koi app service inject nahi karta, koi HTTP/router nahi; pure function of its inputs",
      "Wo `@Component` decorator use nahi karta",
      "Wo sirf pipes render karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Dumb component inputs-in / outputs-out hota hai, bina service dependencies ke — isliye reusable aur test karna trivial (inputs do, DOM/events assert). Smart component services inject karta hai, data fetch karta hai, aur decisions leta hai.",
    difficulty: "easy",
  },
  {
    id: "building-reusable-presentational-components-2",
    question: "Ek reusable `DataTable` ke andar `inject(EmployeeService)` daalne se kya problem hoti hai?",
    options: [
      "Kuch nahi, convenient hai",
      "Table ab ek specific service/endpoint se coupled ho gaya — Departments/Roles/Leave screens me reuse nahi ho sakta, aur test me service mock chahiye. Behtar: table `sortChange` emit kare, smart parent service call kare",
      "`inject` sirf smart components me syntactically allowed hai",
      "Table slow ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "Service inject karte hi component ek specific data source aur uske contract se bandh jaata hai. Dumb rakhne se ek DataTable 5-10 list screens back kar sakta hai, aur uska test sirf `TestBed` + inputs hota hai.",
    difficulty: "medium",
  },
  {
    id: "building-reusable-presentational-components-3",
    question: "Reusable presentational components ke liye kaunsi change detection strategy honi chahiye aur kyun?",
    options: [
      "`Default` — simplest",
      "`OnPush` — ek shared component har screen par har CD cycle me re-check hone se real performance cost, aur OnPush inputs/signals ke saath naturally correct hota hai",
      "Change detection off",
      "Farak nahi padta reusable components me",
    ],
    correctIndex: 1,
    explanation:
      "Dumb components apne inputs ka pure function hote hain, isliye `OnPush` (input reference change / signal change / event par check) unke liye ideal aur safe hai — aur bade apps me bahut CD work bachata hai.",
    difficulty: "medium",
  },
  {
    id: "building-reusable-presentational-components-4",
    question: "Ye kaise pehchanoge ki ek component actually 'smart' hai (dumb nahi)?",
    options: [
      "Agar usme 100+ lines hain",
      "Agar uske `.spec.ts` me `HttpClientTestingModule` ya router mock chahiye, ya wo `inject()` se app services leta hai, ya wo ek route ka `component` hai",
      "Agar usme `@Input` hai",
      "Agar usme `<ng-content>` hai",
    ],
    correctIndex: 1,
    explanation:
      "Service dependencies, HTTP, routing, aur route-binding smart component ke signs hain. Dumb component ka test sirf `TestBed` + inputs set + DOM/event assertions hota hai — koi backend/router simulation nahi.",
    difficulty: "easy",
  },
];

export default quiz;
