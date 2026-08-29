import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "llrg-1",
    question: "Lazy loading kaise implement karte ho modern Angular me? `loadComponent` vs `loadChildren`?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`loadComponent: () => import('./x/x-page').then(m => m.XPage)` — ek standalone component lazily. `loadChildren: () => import('./x/x.routes').then(m => m.X_ROUTES)` — ek poora feature area (uski nested routes) lazily. Dono `import()` se ek separate JS chunk banate hain, first visit par downloaded.",
    detailedAnswer:
      "`loadComponent` chhote isolated screens ke liye (ek reports page). `loadChildren` feature areas ke liye jinke apne child routes, guards, aur route-level `providers` (stores) hain. Standalone era me `loadChildren` ek plain `Routes` array export karta hai (`export const X_ROUTES: Routes = [...]`), no `NgModule`. Add `withPreloading(PreloadAllModules)` (ya custom strategy) taaki initial load fast rahe par subsequent navigation instant. Keep `import()` paths static string literals — bundler tabhi chunk split kar sakta hai.",
    followUp: "Custom preloading strategy kab likhoge (PreloadAllModules ke bajaye)?",
  },
  {
    id: "llrg-2",
    question: "Functional route guard kaise likhte ho? Class-based guards se kyun shift hua?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`export const authGuard: CanActivateFn = (route, state) => { const auth = inject(AuthService); return auth.isLoggedIn() ? true : inject(Router).parseUrl('/login'); }`. Functional guards lightweight hain, `inject()` use karte hain, tree-shakeable, aur compose karna aasan (ek array me multiple). Class guards (`implements CanActivate`) v15 se deprecated-ish, functional standard hai.",
    detailedAnswer:
      "Guard return kar sakta hai `boolean` (allow/block), `UrlTree` (redirect), ya `Observable`/`Promise` of those (async). `canActivate: [authGuard, adminGuard]` — sab pass hone chahiye. Functional form ke faayde: no boilerplate class, `inject()` for deps, easy to unit test (call the function with mocked injector), aur `mapToCanActivate` se legacy class guards bhi adapt ho jaate hain. Multiple guards short-circuit karte hain — pehla jo `false`/`UrlTree` de wo jeet jata hai.",
    followUp: "Ek guard jise ek parameter chahiye (`permissionGuard('employee.delete')`) — factory kaise likhoge?",
  },
  {
    id: "llrg-3",
    question:
      "Ek admin-only lazy `settings` area hai. Non-admin us route par na ja sake AUR us chunk ko download bhi na karein. Kaunsa guard?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`CanMatch`. `{ path: 'settings', canMatch: [adminGuard], loadChildren: () => import('./settings/settings.routes') }`. `CanMatch` `false` return karein to route match hi nahi hota — lazy chunk download nahi, aur router agli matching route (ya `**`) try karta hai. `CanActivate` sirf activation rokta hai, chunk phir bhi aa sakta hai.",
    detailedAnswer:
      "`CanActivate`: route matched + chunk possibly loaded, phir activation blocked -> user ko '403-ish' behaviour, aur bandwidth waste. `CanMatch`: route effectively invisible for that user — cleaner semantics aur no download. Bonus: `CanMatch` se aap same `path` par do routes rakh sakte ho alag guards ke saath (feature-flag A/B: `{ path: 'dashboard', canMatch: [newDashGuard], loadComponent: NewDash }, { path: 'dashboard', loadComponent: OldDash }`). Non-admin ke liye `**` not-found (ya ek explicit `/forbidden`) fall-through hota hai.",
    followUp: "Feature-flag ke saath do same-path routes — Angular kaise decide karta hai kaunsa lena hai?",
  },
  {
    id: "llrg-4",
    question: "`CanDeactivate` guard kya solve karta hai? Ek reusable version kaise banaoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Unsaved-changes protection — user edit form chhod raha hai bina save kiye, guard confirm poochhta hai. Reusable: ek interface `CanComponentDeactivate { canDeactivate(): boolean | Observable<boolean> }` aur ek generic guard `const guard: CanDeactivateFn<CanComponentDeactivate> = c => c.canDeactivate();`. Har form component `canDeactivate()` implement karein (`form.pristine || confirm(...)`).",
    detailedAnswer:
      "Generic guard reuse: `canDeactivate: [pendingChangesGuard]` on every edit route; component decides via its own dirty check. Better UX than `window.confirm`: ek app modal (`ConfirmModal`) jo Observable<boolean> return karein, taaki styling/i18n consistent ho. Also handle browser-level navigation (tab close) with `@HostListener('window:beforeunload', ['$event'])`. Edge: after a successful save, mark the form `pristine` (`form.markAsPristine()`) so the guard doesn't fire on the post-save redirect.",
    followUp: "Successful save ke baad guard ko fire hone se kaise rokoge programmatically?",
  },
  {
    id: "llrg-5",
    question:
      "Details page par data resolver se load ho raha hai par slow API se navigation 2-3 sec 'hang' hota hai. Kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Resolver navigation ko block karta hai. Options: (1) resolver hatao, route turant activate karo, component me `resource()`/`rxResource()` + skeleton se load karo — user ko instant feedback; (2) resolver rakho par a global router-events loading bar dikhao; (3) resolver me `timeout` + fallback. Modern preference: in-component signal `resource` + skeleton.",
    detailedAnswer:
      "Resolver ka faayda 'no empty flash' hai, par cost 'frozen nav' hai. Modern Angular ka `resource({ params: () => ({ id: this.id() }), loader })` component ko turant render hone deta hai, `isLoading()` true, skeleton dikhta hai, phir data. `@defer` bhi heavy sub-sections ke liye. Agar resolver rakhna hi hai (jaise SEO/prerender, ya guard-jaisi 'no data = redirect' logic), to ek `NavigationStart`/`NavigationEnd` driven top progress bar (jaise ngx-progressbar style) UX bacha leta hai. Never a resolver with an unbounded slow call and no feedback.",
    followUp: "`@defer` block aur `resource()` — details page ke different parts me kab kaunsa?",
  },
];

export default questions;
