import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ehh-1",
    question: "Angular app me HTTP error handling ka layered approach kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Interceptor: cross-cutting — `401` -> refresh/logout, `403` -> forbidden, normalize `HttpErrorResponse` -> `AppError`, maybe a generic toast for `5xx`. Service: data-level — `retry` transient reads, `catchError(of(fallback))` for non-critical data. Component/store: UX — `error` signal, retry button, server field errors near the form.",
    detailedAnswer:
      "Ek normalized `AppError` ({ kind, status, user-safe message, fieldErrors }) poore app me flow karta hai, raw `HttpErrorResponse` nahi. Interceptor ek jagah 401/403 handle karta hai (har service me nahi). Service decide karta hai kaunsa data critical hai (fail loud) vs optional (`of([])`). Component `error()` se ek inline banner + Retry dikhata hai, aur `fieldErrors` ko `FormControl` errors me merge karta hai. `finalize` har jagah loading clear.",
    followUp: "Interceptor me error normalize karne ke baad component ko `AppError` kaise milta hai (Observable error channel par)?",
  },
  {
    id: "ehh-2",
    question: "`catchError` inner (switchMap ke andar) vs outer — search-as-you-type me kaunsa, aur kyun?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Inner. `search$.pipe(switchMap(t => api.search(t).pipe(catchError(() => of([])))))` — ek term fail ho to `[]` mile aur agli keystrokes chalti rahen. Outer `catchError` poore outer subscription ko terminate kar deta hai — pehli error ke baad search dead.",
    detailedAnswer:
      "RxJS me error stream ko complete kar deta hai. Agar `catchError` outer par ho aur ek query fail ho, to outer Observable error/complete ho jaata hai — subscription khatam, aage koi keystroke process nahi hoti. Inner catch (inner Observable ke andar) sirf us ek inner ko recover karta hai; outer stream alive. Same principle `mergeMap`/`concatMap` me. Interviewers ye specifically poochhte hain kyunki ye ek common production bug hai ('search ek baar fail hone ke baad kaam nahi karta').",
    followUp: "Agar aap chahte ho ki 3 consecutive failures ke baad search band ho jaaye — kaise?",
  },
  {
    id: "ehh-3",
    question: "Server form validation errors (422 with per-field messages) ko Angular reactive form me kaise surface karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Submit ke `error` handler me: `err.error.errors` (jaise `{ email: ['already registered'] }`) ko iterate karke `this.form.get(field)?.setErrors({ server: messages[0] })`. Template me har control ke errors me `server` error dikhao. Form change par un server errors ko clear karo.",
    detailedAnswer:
      "```ts\nsubmit() {\n  this.api.create(this.form.value).subscribe({\n    error: (e: AppError) => {\n      if (e.fieldErrors) for (const [k, msgs] of Object.entries(e.fieldErrors))\n        this.form.get(k)?.setErrors({ server: msgs[0] });\n      else this.formError.set(e.message);\n    }\n  });\n}\n```\nUX details: server errors ko `valueChanges` par clear karo (`form.get(k)?.updateValueAndValidity()` ya ek custom clear), warna user field theek karein par error dikhta rahe. Non-field errors (`e.message`) ko form ke top par ek summary me. Field naam mapping (API `email` -> form control `email`) consistent hona chahiye.",
    followUp: "API field naam aur form control naam alag hon to mapping kaise maintain karoge?",
  },
  {
    id: "ehh-4",
    question:
      "Dashboard ke 6 widgets me se ek ka API fail ho jaata hai aur poora dashboard blank ho jaata hai. Fix?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Har widget apna data independently load karein aur apna `catchError` rakhe — `api.getWidgetX().pipe(catchError(() => of(WIDGET_X_ERROR_STATE)))`. Ek widget ka failure sirf us widget me ek 'couldn't load' + retry dikhaye, baaki 5 render hote rahen.",
    detailedAnswer:
      "Anti-pattern: `forkJoin([w1$, w2$, ..., w6$])` — koi ek fail ho to `forkJoin` errors, poora dashboard gaya. Better: har widget ek independent component jo apna fetch karein, ya `forkJoin` me har inner ko `catchError(of(fallback))` de. Har widget ka apna loading/error/empty state. Global concerns (auth) interceptor me. Ye 'graceful degradation' — ek broken part poore page ko na le jaaye — resilient UIs ka core principle hai.",
    followUp: "`@defer` (deferrable views) is per-widget isolation me kaise help karta hai?",
  },
  {
    id: "ehh-5",
    question: "Over-catching (`catchError(() => of([]))` har jagah) ke kya risks hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Real bugs aur outages 'empty list' ban jaate hain — user ko lagta hai 'no data', developer ko koi signal nahi. Errors monitoring me nahi aate. Debugging nightmare: 'kyun khaali hai?' ka jawab 'API 500 de rahi thi par humne swallow kar liya'.",
    detailedAnswer:
      "Recover (`of(fallback)`) sirf tab jab fallback genuinely correct UX hai — ek optional sidebar widget, a non-critical count. Critical data (the main list, form submit) par error ko surface karo: rethrow (`throwError(() => normalized)`) aur component me error state. Aur: errors ko log/report karo (Sentry-style) chahe aap recover bhi kar rahe ho — `catchError(e => { reportError(e); return of([]); })`. Silent `of([])` ek code smell hai jab tak explicitly justified na ho.",
    followUp: "Ek error ko recover karke bhi monitoring tak pahunchane ka clean pattern kya hai?",
  },
];

export default questions;
