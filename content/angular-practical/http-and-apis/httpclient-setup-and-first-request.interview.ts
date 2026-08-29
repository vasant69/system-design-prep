import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "hsfr-1",
    question: "`HttpClient` ko setup se lekar pehli request tak kaise use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`provideHttpClient()` ek baar `app.config.ts` me. Ek `@Injectable` service me `http = inject(HttpClient)`, phir `http.get<T>(url, { params, headers })`. Service ek typed `Observable` return karti hai; component use `toSignal`/`async` se consume karta hai. Components `HttpClient` ko directly inject nahi karte.",
    detailedAnswer:
      "`provideHttpClient(withInterceptors([...]), withFetch())` — `withFetch()` XHR ki jagah Fetch API use karta hai (SSR/edge friendly). Service pattern: `EmployeeService` me `getAll`, `getById`, `create`, `update`, `remove` — thin wrappers. Response shape `<T>` generic se annotate; koi runtime validation nahi. `HttpParams` immutable — chain `p = p.set(...)`. Ek clear REST contract (paths, params, `Paged<T>`, DTOs) pehle define karo.",
    followUp: "`withFetch()` kab enable karoge aur uska XHR se kya trade-off hai?",
  },
  {
    id: "hsfr-2",
    question: "API camelCase expect karti thi par ab snake_case bhej rahi hai. UI silently toot gaya. Kyun aur kaise robust banaoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`http.get<Employee>()` ka `<Employee>` runtime pe validate/transform nahi karta — `firstName` undefined ho gaya bina error ke. Fix: service me ek explicit DTO -> model mapping (`map(dto => toEmployee(dto))`), ideally runtime schema validation (Zod/io-ts) ke saath jo mismatch par loudly fail karein.",
    detailedAnswer:
      "Layers: (1) `EmployeeDto` type = raw API shape; (2) `Employee` type = app model; (3) `toEmployee(dto): Employee` mapper; (4) optional `EmployeeDtoSchema.parse(raw)` (Zod) — dev me console error, prod me a monitored error. Ye 'anti-corruption layer' backend changes ko ek jagah absorb karta hai — 30 components edit nahi karne padte. Bonus: dates ko `Date` me parse, enums ko narrow, nullable ko normalize — sab mapper me.",
    followUp: "Har response ko Zod se validate karna — performance/bundle cost kaise justify karoge?",
  },
  {
    id: "hsfr-3",
    question: "`observe: 'body'` vs `observe: 'response'` vs `observe: 'events'` — kab kaunsa?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`'body'` (default) — sirf parsed response body. `'response'` — poora `HttpResponse` (status, headers, body) — jab aapko pagination headers, `Location`, ya `ETag` chahiye. `'events'` — har `HttpEvent` including upload/download `HttpProgressEvent` — file upload/download progress bars ke liye.",
    detailedAnswer:
      "`this.http.get<Employee[]>(url, { observe: 'response' })` -> `res.headers.get('X-Total-Count')`. `this.http.post(url, formData, { observe: 'events', reportProgress: true })` -> `filter(e => e.type === HttpEventType.UploadProgress)` se percent nikaalo. Default `'body'` 95% cases. `reportProgress: true` `'events'` ke saath zaroori progress events ke liye.",
    followUp: "Upload progress ke liye poora events pipeline kaisa dikhta hai?",
  },
  {
    id: "hsfr-4",
    question: "Ek cold HTTP observable ko 3 jagah use karna hai (list, count, header). Kya karoge?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Cold hone ki wajah se 3 subscriptions = 3 requests. Options: `toSignal(this.service.getAll())` aur signal ko 3 jagah read karo; ya `shareReplay({ bufferSize: 1, refCount: true })`; ya ek wrapper `@if (data$ | async; as d)` aur andar `d` reuse.",
    detailedAnswer:
      "Modern preference: `data = toSignal(this.service.getAll())` — ek execution, `data()?.items`, `data()?.total` sab jagah. `shareReplay(1, { refCount: true })` bhi kaam karta hai par `refCount` zaroori hai warna source subscribed rehta hai forever. Anti-pattern: teen `| async` bina share — DevTools me teen identical GETs.",
    followUp: "`toSignal` ke `initialValue` na dene par pehle render par `data()` kya hota hai?",
  },
  {
    id: "hsfr-5",
    question: "Ek service method aur component ke beech responsibility kaise divide karoge HTTP ke context me?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Service: URL construction, params, DTO<->model mapping, error normalization, retries/caching. Component: kab call karna hai (lifecycle/events), loading/error UI state, aur user actions. Component `HttpClient` ko kabhi import nahi karta; sirf `service.getAll(filters)` jaisa call.",
    detailedAnswer:
      "Isse: (1) ek endpoint ka logic ek jagah (reuse across screens); (2) service testable via `HttpTestingController` bina UI; (3) component testable via a fake service bina HTTP; (4) backend changes ek file me absorb. Component ka kaam: `effect`/`ngOnInit` me trigger, `loading`/`error` signals, `switchMap` for search, aur success par navigate/toast. Service ka kaam: `http.get<Dto>(...).pipe(map(toModel), retry(...), catchError(normalize))`.",
    followUp: "Caching (jaise departments list) service me — kaise implement karoge simple aur invalidatable?",
  },
];

export default questions;
