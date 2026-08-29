import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rp-1",
    question: "Route parameter padhne ke tareeke batao aur trade-offs.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "(1) `withComponentInputBinding()` -> `id = input()` on the component — cleanest, signal-native. (2) `ActivatedRoute.paramMap` Observable -> `switchMap` to load — reactive, handles component reuse. (3) `snapshot.paramMap.get('id')` -> one-time read — simple but stale if the component is reused across id changes.",
    detailedAnswer:
      "Snapshot ka bug: master-detail me `/x/1` se `/x/2` par component remount nahi hota, snapshot frozen. `paramMap` Observable re-emits — `paramMap.pipe(map(p => +p.get('id')!), switchMap(id => api.getById(id)))` + `async` pipe. `input()` signal + `resource({ params: () => ({ id: this.id() }), loader })` sabse modern — id change par auto reload + cancel. Params strings hote hain, coerce karo. `route.data` static per-route config ke liye.",
    followUp: "`resource()` / `rxResource()` id-driven loading me `switchMap` se kya extra deta hai?",
  },
  {
    id: "rp-2",
    question:
      "Ek details page `/orders/:id` par 'next order' button hai jo `:id` badalta hai. Data reload nahi ho raha. Diagnose.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Component likely `ngOnInit` me `snapshot` se id padhkar ek baar load kar raha hai. Same route par navigation component ko recreate nahi karta, `ngOnInit` dobara nahi chalta, snapshot purana. Fix: `paramMap` Observable + `switchMap`, ya `input()` signal + `effect`/`resource`.",
    detailedAnswer:
      "Router optimization: agar naya URL same route config match karta hai, Angular component instance reuse karta hai (aur `ngOnInit` skip). Options: (1) `this.route.paramMap.pipe(switchMap(p => this.api.get(+p.get('id')!))).subscribe(...)` (with `takeUntilDestroyed`) ya `| async`; (2) `id = input.required<string>()` + `constructor() { effect(() => this.load(this.id())) }`; (3) `runGuardsAndResolvers: 'paramsChange'` + resolver. Nuclear option: `onSameUrlNavigation` / a key on the route to force recreate — usually not needed.",
    followUp: "`runGuardsAndResolvers` ke options (`paramsChange`, `always`, ...) kya karte hain?",
  },
  {
    id: "rp-3",
    question: "Route param ko validate/transform karna hai (jaise `:id` number hona chahiye, warna 404). Kaise?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ek `canMatch`/`canActivate` guard jo param check kare aur invalid par `router.parseUrl('/not-found')` return kare; ya ek resolver jo fetch kare aur fail par redirect/throw kare; ya component me `paramMap` pipeline me guard karke redirect.",
    detailedAnswer:
      "Cleanest: functional `canMatch` guard — `const id = Number(route.params['id']); return Number.isInteger(id) && id > 0 ? true : router.parseUrl('/not-found');`. `canMatch` `false`/UrlTree dega to router agli matching route try karta hai (ya `**`). Data-level validation (id valid hai par record nahi mila) -> resolver jo `getById` kare aur `catchError(() => { router.navigateByUrl('/not-found'); return EMPTY; })`. Component ke andar handle karna bhi ok hai par guard/resolver me early exit cleaner aur reusable.",
    followUp: "`canMatch` aur `canActivate` guard me kya farak hai is validation use case ke liye?",
  },
  {
    id: "rp-4",
    question: "`route.params` aur `route.paramMap` — dono param dete hain, kaunsa aur kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`paramMap` prefer — ek `ParamMap` interface deta hai (`get`, `getAll`, `has`, `keys`) jo repeated params (`?tag=a&tag=b`) handle karта hai aur immutable hai. `params` ek plain object deta hai (`params['id']`), legacy, repeated params par sirf last value.",
    detailedAnswer:
      "`paramMap`/`queryParamMap` Angular 5.3+ ka recommended API hai. `get(key)` string|null, `getAll(key)` string[] (multi-value query params ke liye), `has(key)`. Plain `params` object convenient dikhta hai par typed access aur multi-value support kamzor hai. Behaviour dono me same: Observable form re-emits, snapshot form static.",
    followUp: "Query params me ek key multiple baar aaye (`?id=1&id=2`) to `paramMap.get` vs `getAll` kya deta hai?",
  },
  {
    id: "rp-5",
    question:
      "Ek page ko id-by-route (details) aur bhi ek 'create new' mode (no id) dono support karna hai — jaise `/employees/:id/edit` aur `/employees/new`. Design?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Do routes: `{ path: 'new', component: EmployeeFormPage, data: { mode: 'create' } }` aur `{ path: ':id/edit', component: EmployeeFormPage, data: { mode: 'edit' } }` (new ko :id se pehle). Component `mode` (route data) + optional `id` input padhe: create me empty form, edit me load + patch.",
    detailedAnswer:
      "Ek shared `EmployeeFormPage` dono ke liye — DRY. `mode = input<'create'|'edit'>()` (via `withComponentInputBinding` + route `data`) aur `id = input<string>()` (undefined in create). `effect(() => { if (this.mode() === 'edit') this.load(this.id()!); })`. Submit: create -> `POST`, edit -> `PUT`. Route order: `new` static route `:id/edit` se pehle warna `new` ko `id` samajh liya jaayega (agar path shape overlap kare). Alternative: ek `:id` param jahan `id === 'new'` sentinel ho — kam clean, avoid.",
    followUp: "Shared form component me create/edit differences ko kaise minimal rakhoge (validators, submit)?",
  },
];

export default questions;
