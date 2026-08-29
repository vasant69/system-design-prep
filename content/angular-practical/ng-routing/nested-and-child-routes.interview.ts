import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ncr-1",
    question: "Child routes aur nested outlets samjhao. Ek use case.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Parent route ke `children` array child routes define karta hai; parent component apne template me apna `<router-outlet />` rakhta hai jahan wo children render hote hain. Use case: ek shared section layout (heading + sub-nav) jo navigation par persist kare jabki sirf inner content badle — jaise Employees section ya ek tabbed details page.",
    detailedAnswer:
      "Outlets stack: `app.html` outlet -> `ShellLayout` outlet -> `EmployeesLayout` outlet -> page. Har level ka matched segment apne parent ke outlet me. Faayde: layout ek baar render (no re-mount of header/sidebar on inner nav), aur ek parent guard/resolver sab children ko cover karta hai. Tabs ko child routes banane se wo deep-linkable ho jaate hain.",
    followUp: "Named outlets (`<router-outlet name='sidebar'>`) kab chahiye aur wo secondary routes kaise kaam karte hain?",
  },
  {
    id: "ncr-2",
    question: "Pure authenticated area ko guard karna hai. Har route par `canActivate` ya kuch behtar?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ek pathless `{ path: '', canActivate: [authGuard], component: ShellLayout, children: [...] }` — guard ek jagah, saare children automatically protected. `login`/`public` routes ko is wrapper ke bahar sibling rakho.",
    detailedAnswer:
      "Har route par `canActivate: [authGuard]` repeat karna error-prone (ek naya route add karke guard bhoolna = security hole). Pathless parent route DRY solution hai: guard + shared shell + shared resolvers (jaise current user) ek jagah. Structure: `[{ path: '', canActivate:[authGuard], component: ShellLayout, resolve: { user: userResolver }, children: [dashboard, employees, ...] }, { path: 'login', component: LoginPage }, { path: '**', component: NotFound }]`. Nested feature areas apne extra guards add kar sakte hain (`canActivate: [adminGuard]` on `settings`).",
    followUp: "`canActivateChild` aur parent `canActivate` me kya farak, aur kab `canActivateChild` chahiye?",
  },
  {
    id: "ncr-3",
    question:
      "Tabbed details page (`/employees/:id/profile|documents|leave`) me employee data har tab switch par dobara fetch ho raha hai. Kyun aur fix?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Agar employee load har tab component me hota hai, to tab switch (child route change) par har baar refetch. Fix: employee ko parent (`EmployeeDetailsPage`) ke resolver ya store me ek baar load karo; tab components use `route.parent.data` / parent store se padhein, khud fetch na karein.",
    detailedAnswer:
      "Parent route par `resolve: { employee: employeeResolver }` — resolver `:id` change par hi re-run hota hai (default), tab change par nahi (child route badalta hai, parent params nahi). Tab component: `employee = this.route.parent!.snapshot.data['employee']` ya better, ek feature store (`EmployeeDetailsStore` in the details route's `providers`) jo `load(id)` ek baar kare aur `employee` signal expose kare. Tabs sirf apna tab-specific data load karein (documents list, leave history). Isse tab switching instant aur network-free.",
    followUp: "Resolver aur ek route-`providers` store — is case me kaunsa prefer karoge?",
  },
  {
    id: "ncr-4",
    question: "Nested route me relative aur absolute `routerLink` — kab kaunsa, aur ek refactor risk?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Relative (`routerLink=\"edit\"`, `\"../\"`, `['..', id]`) jab aap current location ke relative move kar rahe ho — ye parent path rename hone par bhi kaam karta hai. Absolute (`routerLink=\"/employees\"`) jab aap ek fixed, unrelated jagah ja rahe ho. Risk: absolute links andar deeply nested me use karna — parent route rename -> saari links tooten.",
    detailedAnswer:
      "Child component ko ideally apne absolute path ka pata nahi hona chahiye. `../` (list) ya `../${id}` (sibling) ya `edit` (child) refactor-safe hain. Code me `router.navigate(['..'], { relativeTo: this.route })`. Absolute links top-level nav (sidebar), cross-feature jumps, aur guard redirects (`/login`) ke liye. Ek codebase me deep components me hardcoded `/employees/...` strings ek maintenance smell hain.",
    followUp: "`relativeTo` ke bina `router.navigate(['../x'])` kis base ke against resolve hota hai?",
  },
  {
    id: "ncr-5",
    question:
      "Team ne tabs ko `activeTab` signal + `@switch` se banaya hai routes ke bajaye. Trade-offs kya samjhaoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Signal tabs simple hain par kho dete hain: deep linking (`/x/42/documents` nahi ban sakta), browser back/forward tab history, refresh restore, aur per-tab lazy loading. Child routes ye sab free me dete hain, thodi zyada config ke saath. Internal-only, non-shareable widgets me signal tabs ok.",
    detailedAnswer:
      "Decision: agar tab ek 'view' hai jise user share/bookmark karna chahe, refresh par wapas chahe, ya back se navigate kare — child routes. Agar tabs ek chhote form ke sections hain (jinhe share karne ka koi matlab nahi) — signal + `@switch` (ya `[hidden]` for state preservation) fine. Bade detail pages (employee, order, ticket) practically hamesha routes-as-tabs. Bonus: routes-as-tabs se har tab `loadComponent` se lazy ho sakta hai — heavy tab (charts) initial load me nahi.",
    followUp: "Routes-as-tabs me active tab ka state (scroll, unsaved form) preserve karna ho to kya karoge?",
  },
];

export default questions;
