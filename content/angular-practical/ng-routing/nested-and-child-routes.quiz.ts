import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "nested-and-child-routes-1",
    question: "Child routes render hone ke liye parent component me kya hona zaroori hai?",
    options: [
      "Ek `@Input() children`",
      "Uska apna `<router-outlet />` — child components usme render hote hain",
      "`ngOnInit` me manual rendering",
      "`provideRouter` dobara call karna",
    ],
    correctIndex: 1,
    explanation:
      "Har layout/parent component ko apna `<router-outlet />` chahiye. Matched child us outlet me inject hota hai. Outlet bhoolne par children configured hone ke bawajood kuch render nahi hota.",
    difficulty: "easy",
  },
  {
    id: "nested-and-child-routes-2",
    question: "`{ path: \"\", canActivate: [authGuard], children: [...] }` (no `component`) kya hai?",
    options: [
      "Ek galat route config",
      "Ek pathless grouping route — koi UI nahi, bas ek jagah guard (ya resolver/data) laga kar uske saare children ko cover karna",
      "Ek redirect",
      "Ek lazy-loaded module",
    ],
    correctIndex: 1,
    explanation:
      "`path: \"\"` + `children` + no `component` = pure grouping. Ek `canActivate` yahan lagane se saare nested routes protected ho jaate hain — guard ek jagah likhna padta hai, har route par nahi.",
    difficulty: "medium",
  },
  {
    id: "nested-and-child-routes-3",
    question: "Employee details page par Profile / Documents / Leave tabs banane ka behtar tareeka?",
    options: [
      "Ek signal `activeTab` aur `@switch` se content toggle",
      "Child routes (`:id/profile`, `:id/documents`, `:id/leave`) + details page me nested `<router-outlet />` — tabs deep-linkable, back-button-safe, refresh par sahi tab",
      "3 alag top-level routes",
      "3 alag components ek hi route par",
    ],
    correctIndex: 1,
    explanation:
      "Tabs ko child routes banane se `/employees/42/documents` ek shareable URL banta hai, browser back tab-history respect karta hai, aur F5 par sahi tab restore hota hai. `@if`/`@switch` tabs me ye teenon kho jaate hain.",
    difficulty: "medium",
  },
  {
    id: "nested-and-child-routes-4",
    question: "Ek child route ke andar list par wapas jaane ke liye `<a>` kaise likhoge?",
    options: [
      "`routerLink=\"/employees\"` hamesha",
      "Relative navigation: `routerLink=\"../\"` (ek level upar) ya code me `router.navigate(['../'], { relativeTo: this.route })`",
      "`href=\"..\"`",
      "`routerLink=\"back\"`",
    ],
    correctIndex: 1,
    explanation:
      "Nested routes me relative links (`../`, `edit`, `['..', id]`) current route ke against resolve hote hain — refactor-safe agar parent path badle. Leading `/` absolute banata hai. `relativeTo: this.route` code me equivalent hai.",
    difficulty: "medium",
  },
];

export default quiz;
