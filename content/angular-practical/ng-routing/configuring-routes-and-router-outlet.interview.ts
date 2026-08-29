import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "crro-1",
    question: "Modern Angular me routing kaise setup karte ho, start se end tak?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`Routes` array define karo (`path` + `component`/`loadComponent`). `app.config.ts` me `provideRouter(routes)` (optionally features jaise `withComponentInputBinding()`). Layout template me `<router-outlet />`. Navigation `routerLink` / `Router.navigate`.",
    detailedAnswer:
      "```ts\nexport const routes: Routes = [\n  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },\n  { path: 'login', component: LoginPage },\n  { path: 'employees', loadChildren: () => import('./features/employees/employees.routes') },\n  { path: '**', component: NotFoundPage },\n];\n```\nNo `RouterModule`, no `AppRoutingModule`. `provideRouter` features: `withComponentInputBinding()` (params as inputs), `withViewTransitions()`, `withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })`, `withHashLocation()` if needed. Feature areas own their own `*.routes.ts`.",
    followUp: "`withInMemoryScrolling` aur `scrollPositionRestoration` kya problem solve karte hain?",
  },
  {
    id: "crro-2",
    question: "Route matching ke rules kya hain? Ek ordering bug ka example.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "First-match-wins, top-to-bottom. Har route ka `path` current URL segments se match hota hai; `:param` kisi bhi ek segment ko match karta hai; `**` sab; `''` empty. Bug: `employees/:id` ko `employees/new` se pehle rakhna -> `/employees/new` me `id='new'`.",
    detailedAnswer:
      "Router URL ko `/`-separated segments me todta hai aur routes ke against greedily match karta hai. Kyunki pehla match jeetta hai, specificity ke hisaab se order karo: static (`employees/new`) -> parameterised (`employees/:id`) -> wildcard (`**`). Doosra classic bug: empty-path redirect bina `pathMatch: 'full'` -> `prefix` match har URL par. Teesra: do routes ka same effective path -> pehla hi kabhi chalega.",
    followUp: "Do sibling routes ka same path ho par alag `canMatch` guard ho — Angular kaise resolve karta hai?",
  },
  {
    id: "crro-3",
    question:
      "30+ routes wali app ka routing kaise organise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Top-level `app.routes.ts` chhoti rakho — sirf shell, redirects, `**`, aur har feature ke liye ek `loadChildren` entry. Har feature apna `feature.routes.ts` export kare (apne children, guards, resolvers). Lazy-load feature areas.",
    detailedAnswer:
      "```ts\n// app.routes.ts\n{ path: 'employees', loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEE_ROUTES) }\n// employees.routes.ts\nexport const EMPLOYEE_ROUTES: Routes = [\n  { path: '', component: EmployeeListPage },\n  { path: 'new', component: AddEmployeePage },\n  { path: ':id', component: EmployeeDetailsPage },\n  { path: ':id/edit', component: EditEmployeePage },\n];\n```\nFaayde: (1) feature ownership — team apni routes khud manage kare; (2) lazy loading — har feature apna bundle; (3) feature-scoped `providers` (stores) route level par; (4) `app.routes.ts` review karna easy. Anti-pattern: ek 300-line flat routes file.",
    followUp: "`loadChildren` aur `loadComponent` — dono lazy hain, farak kya?",
  },
  {
    id: "crro-4",
    question: "`provideRouter` ke kuch useful features batao aur wo kya karte hain.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`withComponentInputBinding()` — route/query params + resolver data as component inputs. `withViewTransitions()` — native View Transitions API animations. `withInMemoryScrolling({ scrollPositionRestoration, anchorScrolling })` — restore scroll on back, jump to `#fragment`. `withDebugTracing()` — console log every router event. `withHashLocation()` — hash-based URLs.",
    detailedAnswer:
      "`provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }), withViewTransitions())`. `withComponentInputBinding` ne `ActivatedRoute` subscribe karne ki bahut si zaroorat khatam ki. `scrollPositionRestoration: 'enabled'` bina iske back button par page top pe reset ho jaata hai (annoying). `withPreloading(PreloadAllModules)` lazy routes ko background me preload karta hai. Ye sab opt-in hain — legacy `RouterModule.forRoot(routes, { ... })` options ka modern equivalent.",
    followUp: "`withPreloading(PreloadAllModules)` vs custom preloading strategy — kab custom chahiye?",
  },
  {
    id: "crro-5",
    question: "Ek route ka `title` set karne ke kitne tareeke hain? Dynamic title (jaise employee ka naam) kaise?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Static: `{ path: 'dashboard', component: DashboardPage, title: 'Dashboard | EMS' }` — built-in `TitleStrategy` `document.title` set karta hai. Dynamic: `title` ko ek resolver function do (`title: employeeTitleResolver`), ya component me `inject(Title).setTitle(...)` call karo data aane par.",
    detailedAnswer:
      "Angular ka default `TitleStrategy` route ke `title` (string ya `ResolveFn<string>`) ko navigation ke baad apply karta hai. Custom strategy: `provide: TitleStrategy, useClass: MyTitleStrategy` — jaise har title ke aage ' | EMS' append karna. Fully dynamic (employee details page): resolver se employee fetch karke `title: (route) => 'Employee ' + route.data['employee'].name`, ya component `ngOnInit`/`effect` me `this.title.setTitle(...)`. Accessibility/SEO ke liye per-route titles important hain.",
    followUp: "SPA me route change par screen-reader ko naye page ka title announce karna — kaise handle karoge?",
  },
];

export default questions;
