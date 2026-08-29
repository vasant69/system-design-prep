import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "hi-1",
    question: "HTTP interceptor kya hai? Functional interceptor kaise likhte ho aur register karte ho?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Ek function jo har `HttpClient` request/response ke pipeline me chalta hai. `export const authInterceptor: HttpInterceptorFn = (req, next) => next(req.clone({ setHeaders: { Authorization: 'Bearer ' + inject(AuthService).token() } }))`. Register: `provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))`.",
    detailedAnswer:
      "`req` immutable — `clone()` to modify. `next(req)` chain ko aage bhejta hai aur `Observable<HttpEvent>` return karta hai, jise aap `.pipe(catchError, finalize, tap)` kar sakte ho response side handle karne ke liye. `inject()` interceptor function ke andar kaam karta hai (injection context). Functional interceptors (v15+) class-based `HTTP_INTERCEPTORS` multi-provider ko replace karti hain — kam boilerplate, tree-shakeable, order array se explicit.",
    followUp: "Interceptor ke andar ek dusra `HttpClient` call karna (jaise token refresh) — kya risk hai?",
  },
  {
    id: "hi-2",
    question: "Global loading indicator ke liye interceptor kaise design karoge? Overlapping requests ka kya?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`LoadingService` ek counter rakhe: `start()` -> `count++`, `stop()` -> `count--`, `isLoading = computed(() => count() > 0)`. Interceptor: `loading.start(); return next(req).pipe(finalize(() => loading.stop()))`. Bar tabhi hide jab counter 0 — overlapping requests me flicker nahi.",
    detailedAnswer:
      "Boolean flag se problem: 3 concurrent requests, pehla khatam -> `false` -> bar gaya jabki 2 abhi chal rahe. Counter se: bar tab tak jab tak koi bhi request pending. Refinements: (1) polling/background requests ko `HttpContext` flag se skip; (2) ek chhota debounce (100ms) taaki bahut fast requests bar flash na karen; (3) `finalize` (not just `next`) taaki error/cancel par bhi decrement ho. Bar ko `NgZone`/CD ke saath signal se drive karo.",
    followUp: "Ek request 30 sec le rahi hai — user ko kya feedback aur kab timeout?",
  },
  {
    id: "hi-3",
    question:
      "`authInterceptor` `/auth/login` par bhi `Authorization` header laga raha hai aur server reject kar raha hai. Fix kar  ke 2 tareeke.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "(1) `HttpContextToken` `SKIP_AUTH` — login call me `context.set(SKIP_AUTH, true)`, interceptor me `if (req.context.get(SKIP_AUTH) || !token) return next(req)`. (2) URL check — `if (req.url.includes('/auth/')) return next(req)`. Context approach cleaner aur explicit hai.",
    detailedAnswer:
      "URL-check simple par brittle (path badle to break, aur 'auth' substring false positives). `HttpContext` per-request intent explicitly carry karta hai — `AuthService.login()` khud decide karta hai 'ye request auth-free hai'. Aur bhi context flags: `SKIP_LOADING` (polling), `SKIP_ERROR_TOAST` (background), `SKIP_RETRY`. Ek jagah tokens define karo aur interceptors unhe respect karen.",
    followUp: "`HttpContext` values request ke saath server tak jaati hain ya sirf client-side hain?",
  },
  {
    id: "hi-4",
    question:
      "Ek buggy interceptor deploy ho gaya jo kuch requests par throw karta hai — poori app ke saare API calls fail. Prevention aur recovery strategy?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Prevention: interceptors ko small, single-purpose, defensive (try/catch around risky logic), aur unit-tested rakho — ek interceptor ko isolate karke test karna easy hai. Har interceptor ka apna test. Recovery: interceptors array me se offending one hata do (ek line config change) aur redeploy; feature-flag critical interceptors.",
    detailedAnswer:
      "Interceptor har request ka single point of failure hai. Discipline: (1) no business logic — sirf headers/logging/error-mapping/loading; (2) `next(req)` ko hamesha call karo (kisi path par return bhoolna = request kabhi nahi jaayegi); (3) risky code (token parse, JSON) ko guard karo; (4) `catchError` me hamesha ek Observable return karo. Testing: `TestBed` + `provideHttpClient(withInterceptors([x]))` + `HttpTestingController` — assert header added / error mapped. Rollout: naye interceptor ko `HttpContext` flag ke peechhe ya ek % rollout ke saath.",
    followUp: "Interceptor ka unit test kaisa dikhta hai `HttpTestingController` ke saath?",
  },
  {
    id: "hi-5",
    question: "Interceptor me caching implement karna — kab accha idea hai aur kya risks?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Sirf idempotent `GET`s ke liye, stable/rarely-changing data (departments, config, lookups). Cache key = URL + params. Risks: stale data (invalidation kab?), memory growth (TTL/LRU chahiye), aur `POST`/`PUT` ke baad related `GET` cache invalidate karna. Aksar ek dedicated cache service ya query library (TanStack Query) better than a DIY interceptor cache.",
    detailedAnswer:
      "Interceptor cache: `if (req.method !== 'GET') return next(req); const key = req.urlWithParams; if (cache.has(key)) return of(cache.get(key)); return next(req).pipe(tap(e => { if (e instanceof HttpResponse) cache.set(key, e, TTL); }))`. Problems in practice: (1) invalidation — after creating an employee, the `/employees` list cache is stale; (2) per-user data cached across a logout; (3) no `stale-while-revalidate`, no dedup of in-flight requests. A query library handles all of this. DIY interceptor cache only for truly static lookups with a short TTL.",
    followUp: "In-flight request deduplication (same GET fired twice before the first returns) interceptor me kaise karoge?",
  },
];

export default questions;
