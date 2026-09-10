import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rxjs-1",
    question: "Cold vs hot Observables samjhao aur Angular me HTTP ke liye kyun matter karta hai.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Cold Observable apna producer per subscriber start karti hai, isliye har `subscribe()` fresh run trigger karta hai. `HttpClient` cold hai: do subscriptions do requests, zero subscriptions zero requests. Hot Observable ek producer sab subscribers me share karti hai (`Subject`, ya cold ko `share()` se).",
    detailedAnswer:
      "Practical: same `http.get()` par do baar subscribe karke ek call expect mat karo — agar multiple consumers ko same response chahiye to `shareReplay(1)` use karo. Aur jis `http.get()` ka result ignore karoge wo kuch nahi karega, jo Promise-based code se aane walon ko surprise karta hai jahan request turant fire hoti thi.",
    followUp: "`async` pipe subscription story ko kaise badalta hai?",
  },
  {
    id: "rxjs-2",
    question: "switchMap ko mergeMap, concatMap, ya exhaustMap ke upar kab choose karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "switchMap: naya value aane par pichhli inner stream cancel — autocomplete, latest-wins reads. mergeMap: sab parallel, order guaranteed nahi. concatMap: queue karo aur order preserve — sequential writes. exhaustMap: jab tak ek in flight hai naye ignore — double submit rokna.",
    detailedAnswer:
      "Deciding question: 'jab naya outer value aaye to pichhli inner Observable ka kya ho?' switchMap use unsubscribe karta hai (risk: ek write beech me cancel ho sakta hai, isliye saves ke liye mat use karo). concatMap ordering guarantee karta hai latency ke cost par. exhaustMap login-button operator hai. mergeMap ko heavy work ke liye concurrency limit chahiye.",
    redFlag: "Search box ke liye by default mergeMap lena, jisse slow purani response nayi ko overwrite kar deti hai.",
  },
  {
    id: "rxjs-3",
    question: "Subscription leaks kaise rokte ho, aur kaunsi streams actually leak karti hain?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Jo streams kabhi complete nahi hoti wo leak karti hain: `interval`, `fromEvent`, router events, service ka `Subject`, `valueChanges`. Fixes: `async` pipe (destroy par auto-unsubscribe), `takeUntilDestroyed()`, ya `takeUntil(this.destroy$)` ek `destroy$` `Subject` ke saath jo `ngOnDestroy` me complete ho.",
    detailedAnswer:
      "Jo streams khud complete hoti hain — ek single `HttpClient` call, `of(...)`, `timer(x)` — unhe manual teardown nahi chahiye, chahe harmless ho. Leak ka asli nuksaan sirf memory nahi: leaked subscription callbacks chalate rehti hai jo destroyed component ko touch karte hain, isse duplicate HTTP calls, stale UI updates, aur navigation ke baad errors aate hain.",
  },
];

export default questions;
