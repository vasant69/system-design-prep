import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ajwt-1",
    question: "Angular me poora JWT auth flow end-to-end samjhao.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`POST /auth/login` -> access token (short) + refresh token (long) + user. `AuthService` state ko signal me rakhta hai. `authInterceptor` har request par `Bearer` header lagata hai. `authRefreshInterceptor` `401` par `/auth/refresh` call karke request replay karta hai. `authGuard` unauthenticated users ko `/login?returnUrl=` par bhejta hai. `APP_INITIALIZER` reload par `/auth/refresh` try karta hai.",
    detailedAnswer:
      "Storage: access token in memory (signal), refresh token `httpOnly` Secure `SameSite` cookie me (backend sets). Concurrent `401`s ek shared in-flight refresh use karen. Login ke baad `navigateByUrl(returnUrl ?? '/dashboard', { replaceUrl: true })`. Logout: signal clear + `POST /auth/logout` (server-side refresh token invalidate). Client JWT claims sirf UI ke liye decode — server validates. Guard shell route par (pathless `''` + `canActivate`).",
    followUp: "SSR (Angular Universal) ke saath ye flow kaise badalta hai — cookie handling?",
  },
  {
    id: "ajwt-2",
    question: "Token storage options (memory, localStorage, sessionStorage, httpOnly cookie) ke trade-offs.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Memory: XSS-safe-ish, no CSRF, but lost on reload. `localStorage`: persists, no CSRF, but ANY XSS reads it = account takeover. `sessionStorage`: same XSS risk, per-tab. `httpOnly` Secure cookie: JS can't read it (XSS-resistant) but needs CSRF defense (`SameSite`, CSRF token) and backend cooperation. Best: access token in memory, refresh token in `httpOnly` cookie.",
    detailedAnswer:
      "No option is free. The threat model: XSS is the common front-end compromise (a bad npm dependency, an unsanitized `innerHTML`). `localStorage` fully exposes tokens to XSS. `httpOnly` cookies neutralize XSS token theft but open CSRF, mitigated by `SameSite=Strict/Lax` + anti-CSRF tokens for state-changing requests. In-memory access token + `httpOnly` refresh cookie = XSS can't steal the long-lived credential, and the short access token's blast radius is minutes. If cookies aren't possible, `localStorage` refresh token + aggressive hardening (CSP, SRI, dependency audit, sanitization) is the pragmatic fallback — and you document the accepted risk.",
    followUp: "`SameSite=Strict` refresh cookie ke saath ek external OAuth redirect flow kaise kaam karega?",
  },
  {
    id: "ajwt-3",
    question:
      "Refresh-on-401 interceptor me concurrency bug (N parallel 401s -> N refreshes) ko kaise fix karoge? Code sketch.",
    type: "coding",
    difficulty: "advanced",
    shortAnswer:
      "Ek `refreshInProgress` flag + `refreshResult$ = new BehaviorSubject<string | null>(null)`. Pehla `401`: flag set, `refresh()` call, result ko subject me next. Baaki `401`s: `refreshResult$.pipe(filter(Boolean), take(1), switchMap(token => next(replay)))`. Refresh khatam hone par flag reset aur subject ko `null`.",
    detailedAnswer:
      "```ts\nlet refreshing = false;\nconst tokenSubject = new BehaviorSubject<string | null>(null);\n// in catchError for 401:\nif (!refreshing) {\n  refreshing = true;\n  tokenSubject.next(null);\n  return auth.refresh().pipe(\n    switchMap(t => { refreshing = false; tokenSubject.next(t); return next(withToken(req, t)); }),\n    catchError(e => { refreshing = false; auth.logout(); return throwError(() => e); }),\n  );\n}\nreturn tokenSubject.pipe(filter((t): t is string => t !== null), take(1),\n  switchMap(t => next(withToken(req, t))));\n```\nAlternative: `auth.refresh()` ko internally `shareReplay(1)` + reset on completion. Interviewers is exact scenario ko poochhte hain — ye ek real, subtle production bug hai.",
    followUp: "Interceptor state (`refreshing` flag) ko interceptor function ke bahar kyun rakhna padta hai, aur uska scope kya hai?",
  },
  {
    id: "ajwt-4",
    question: "`authInterceptor` `/auth/login` aur `/auth/refresh` par bhi header laga raha hai. Problem aur fix?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Login ke waqt koi valid access token nahi (ya expired hai). Server bogus/expired header par reject kar sakta hai, ya refresh call hi loop me phas sakti hai. Fix: `SKIP_AUTH` `HttpContextToken` — `AuthService.login()`/`refresh()` requests par set karo, interceptor `if (req.context.get(SKIP_AUTH)) return next(req)`.",
    detailedAnswer:
      "Especially dangerous: agar `authRefreshInterceptor` `/auth/refresh` ke `401` ko bhi intercept karein, to refresh -> 401 -> refresh -> infinite loop. `SKIP_AUTH` context flag dono ko break karta hai: header nahi lagta, aur refresh interceptor `401` ko as-is throw karta hai (jo `logout()` trigger karta hai). URL-substring check bhi kaam karta hai par context explicit aur robust hai.",
    followUp: "`/auth/refresh` ke `401` par exactly kya sequence hona chahiye?",
  },
  {
    id: "ajwt-5",
    question: "Role-based UI (kuch buttons/routes sirf admin) — JWT claims se kaise, aur kya trust boundary?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`AuthService` login response se `user.roles` / decoded JWT `roles` ko ek signal me rakhe. UI: `*appHasRole=\"'admin'\"` directive ya `@if (auth.hasRole('admin'))`. Routes: `roleGuard` (`CanMatch`). Trust boundary: ye purely UX hai — server har request ko independently authorize karta hai; frontend gating security nahi.",
    detailedAnswer:
      "Flow: login -> `roles` signal; `hasRole = (r) => this.roles().includes(r)`; `hasPermission` similarly if the token carries fine-grained perms. UI hides what the user can't do (cleaner UX). Routes use `canMatch: [roleGuard]` so a non-admin never loads the admin chunk. But: a determined user can call the API directly (Postman) — so `POST /employees/:id` MUST check the role server-side regardless of what the UI showed. Frontend role checks = 'don't show the button'; backend role checks = 'don't allow the action'. Both required.",
    followUp: "Token me role badla (user promoted) par UI kab update hoga — next login, ya sooner?",
  },
];

export default questions;
