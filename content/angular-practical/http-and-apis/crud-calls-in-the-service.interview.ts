import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ccs-1",
    question: "Ek resource ke liye CRUD service kaise structure karoge?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`@Injectable({ providedIn: 'root' })` with `getAll(filters)`, `getById(id)`, `create(input)`, `update(id, input)`, `remove(id)`. Har method: base URL (`API_BASE_URL` token se) + `HttpParams` (conditional) build karein, DTO<->model map karein, typed Observable return karein. Koi loading/toast/navigation.",
    detailedAnswer:
      "```ts\ngetAll(f: EmployeeFilters) {\n  let p = new HttpParams().set('page', f.page).set('pageSize', f.pageSize);\n  if (f.search) p = p.set('search', f.search);\n  return this.http.get<Paged<EmployeeDto>>(this.base, { params: p })\n    .pipe(map(pg => ({ ...pg, items: pg.items.map(toEmployee) })));\n}\ncreate(i: EmployeeCreate) { return this.http.post<EmployeeDto>(this.base, toCreateDto(i)).pipe(map(toEmployee)); }\nremove(id: number) { return this.http.delete<void>(`${this.base}/${id}`); }\n```\nConsistent shape across entities -> ek `createCrudService<TDto, T>(base, mapper)` factory ya base class common parts generate kar sakti hai.",
    followUp: "Ek generic CRUD base class banana — kaunse type parameters aur kaunse overridable hooks?",
  },
  {
    id: "ccs-2",
    question: "Delete ke baad list ko refresh karne ke tareeke, aur unke trade-offs?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "(1) Refetch: `remove(id).subscribe(() => this.reload())` — simplest, hamesha consistent, ek extra request. (2) Optimistic local removal: turant list se hatao, fail par wapas daalo — instant UX, rollback logic. (3) Server returns updated list — rare. Zyadatar cases me refetch; high-interactivity lists me optimistic.",
    detailedAnswer:
      "Refetch: `switchMap` a `reload$` trigger — `remove(id).pipe(switchMap(() => this.service.getAll(this.filters())))`. Consistent (server truth), par page count / current page shift ho sakta hai. Optimistic: `this.items.update(a => a.filter(x => x.id !== id))` before the call; `catchError` me `this.items.update(a => [...a, removed])` + toast. Best UX par ordering/pagination edge cases. Ek store me ye pattern encapsulate karo taaki har list screen dobara na likhe.",
    followUp: "Optimistic delete ke baad agar user turant page change karein aur server call fail ho — rollback UX kaisa?",
  },
  {
    id: "ccs-3",
    question: "Service method me loading state / error toast daalne se kya problem hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Service ek specific UI se coupled ho jaati hai — `this.loading` kis component ka? Toast kaunsa? Reuse across screens tootta hai (dashboard bhi `getAll` use karta hai, use aapka toast nahi chahiye), aur `HttpTestingController` tests me UI concerns leak ho jaate hain. Loading/error component ya store me.",
    detailedAnswer:
      "Correct division: service returns a pure `Observable<T>` (with data-level concerns: mapping, normalized errors, retries). Component/store: `tap(() => loading.set(true))`, `catchError(e => { toast.error(...); return of(...) })`, `finalize(() => loading.set(false))`, aur navigation. Isse ek `EmployeeService.getAll` list page, dropdown, aur report — teenon me alag UX ke saath reuse hota hai. Cross-cutting error handling (401 -> logout, 500 -> generic toast) ek HTTP interceptor me, individual service me nahi.",
    followUp: "Cross-cutting concerns (auth header, global error) service me nahi to kahan — aur kyun interceptor better?",
  },
  {
    id: "ccs-4",
    question:
      "5 entities (Employee, Department, Role, Leave, Document) — sab ka CRUD service. Copy-paste se kaise bachoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ek generic factory ya base class: `createCrudService<TDto, T, TCreate>({ base, toModel, toCreateDto })` jo `getAll`/`getById`/`create`/`update`/`remove` provide karein. Entity-specific methods (`GET /employees/:id/history`) service class me add karo jo factory result ko extend/compose karein.",
    detailedAnswer:
      "```ts\nfunction createCrud<TDto, T>(http: HttpClient, base: string, toModel: (d: TDto) => T) {\n  return {\n    getAll: (params?: Record<string, any>) => http.get<Paged<TDto>>(base, { params }).pipe(map(p => ({ ...p, items: p.items.map(toModel) }))),\n    getById: (id: number) => http.get<TDto>(`${base}/${id}`).pipe(map(toModel)),\n    // ...\n  };\n}\n```\nya ek abstract `BaseCrudService<TDto, T>` with `protected abstract base; protected abstract toModel()`. Trade-off: factory functional/composable, base class familiar par inheritance rigidity. Dono se ~5 lines per entity, aur ek shared test suite common paths cover karta hai.",
    followUp: "Factory function vs abstract base class — is case me kaunsa aur kyun?",
  },
  {
    id: "ccs-5",
    question: "`getAll` bar-bar call ho raha hai jab filters signal me har keystroke par change hota hai. Kaise optimize karoge?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Component me: `toObservable(this.filters).pipe(debounceTime(200), distinctUntilChanged(deepEqual), switchMap(f => this.service.getAll(f)))`. `debounceTime` typing settle hone ka wait, `distinctUntilChanged` no-op changes skip, `switchMap` purani request cancel.",
    detailedAnswer:
      "Service method khud rate-limit nahi karti (wo pure hai). Optimization consumption layer par: debounce + distinct + switchMap. `distinctUntilChanged` ko ek structural equality function chahiye kyunki `filters` object har baar naya reference. Bonus: `getAll` result ko `shareReplay` mat karo (filters-keyed cache alag concern hai). Agar same filters ke liye caching chahiye to ek `Map<string, Observable>` keyed on serialized filters, TTL ke saath — service ya store me.",
    followUp: "Filter-keyed response cache with TTL kaise implement karoge, aur invalidation kab?",
  },
];

export default questions;
