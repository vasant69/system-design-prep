import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "eepv-1",
    question: "Edit form ka full flow batao — load se save tak.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Route `:id` se employee load karo (spinner). Dependent field ke options pehle load karo. `form.patchValue(emp, { emitEvent: false })` + `markAsPristine()`. User edits -> `form.dirty`. `CanDeactivate` guard `dirty` par prompt. Submit -> `getRawValue()` -> DTO -> `PUT`/`PATCH` -> `finalize(saving false)` -> `markAsPristine()` -> navigate + toast.",
    detailedAnswer:
      "Reuse: same `buildEmployeeForm` builder aur validators as Add. Load via `effect(() => api.getById(Number(this.id())))` ya a resolver. Hydration me two subtleties: (1) dependent-field race — options-first + `emitEvent: false`; (2) `Date` <-> `'yyyy-MM-dd'` for `<input type=date>`. Guard: `markAsPristine()` after load AND after save. Submit maps `getRawValue()` -> `toUpdateEmployeeDto`. Server `422` -> `setErrors({ server })` inline.",
    followUp: "Add aur Edit ke liye ek shared `EmployeeFormComponent` vs do alag pages — kaunsa design aur kyun?",
  },
  {
    id: "eepv-2",
    question: "`{ emitEvent: false }` option kya karta hai, aur uska risk?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`patchValue`/`setValue`/`setValue` ke saath `{ emitEvent: false }` us update ke liye `valueChanges` aur `statusChanges` ko suppress karta hai. Hydration me perfect (dependent handlers na chalein). Risk: agar aapki koi aur logic un events par depend karti hai (derived values, autosave), wo is patch ke liye skip ho jaayegi — chup breakage.",
    detailedAnswer:
      "Use it deliberately for programmatic hydration where you don't want `valueChanges` side effects. After hydration, call `form.updateValueAndValidity()` if validators need to re-run, and manually trigger any derived state you skipped. Alternative to `emitEvent: false` for the dependent-field race: set the parent first, wait for options to load, then patch the child — but that's more choreography. `emitEvent: false` is cleaner if you handle the follow-up (`markAsPristine`, re-derive) explicitly.",
    followUp: "Hydration ke baad validators re-run karwane ke liye kya call karoge?",
  },
  {
    id: "eepv-3",
    question: "Unsaved-changes protection ko production-grade kaise banaoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "(1) `markAsPristine()` after load and after save. (2) A `CanDeactivate` guard checking `form.dirty`, showing an app modal (not `window.confirm`) that returns `Observable<boolean>`. (3) `@HostListener('window:beforeunload')` for tab-close/refresh. (4) On the guard's 'stay', don't run any post-navigation logic.",
    detailedAnswer:
      "Guard: `const guard: CanDeactivateFn<HasDirtyForm> = c => c.form.pristine ? true : c.confirmLeave()` where `confirmLeave()` opens a styled `ConfirmModal` returning `Observable<boolean>`. `beforeunload` can't show custom UI (browser generic prompt) but must `event.preventDefault()` + set `returnValue`. Edge cases: multi-step forms (track dirty across steps), and 'Save & continue' where you want to leave after saving — call `markAsPristine()` synchronously before `navigate`. Also reset `dirty` if the user manually reverts every field (rare; usually skip).",
    followUp: "`window.confirm` vs ek app modal in a `CanDeactivate` guard — return type ka farak?",
  },
  {
    id: "eepv-4",
    question: "PUT (full) vs PATCH (only changed) for edit — kab kaunsa, aur PATCH ke liye changed fields kaise nikaloge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "PUT jab API full-replace semantics rakhta hai aur aapke paas poora resource hai (`getRawValue()` -> full DTO). PATCH jab API partial updates support karta hai aur aap sirf badle fields bhejna chahte ho (kam payload, kam accidental overwrite). Changed fields: form ke dirty controls ko iterate karke ek partial object banao.",
    detailedAnswer:
      "```ts\nfunction onlyDirty(form: FormGroup): Record<string, unknown> {\n  const out: Record<string, unknown> = {};\n  for (const [k, c] of Object.entries(form.controls))\n    if (c.dirty) out[k] = c.value;\n  return out;\n}\n```\nPATCH pros: smaller payload, avoids clobbering fields another user changed concurrently (last-write-wins only on the fields you touched). PUT pros: simpler, idempotent, no 'which fields' logic. If the API only offers PUT, you must send the full DTO — sending partial fields makes the rest null. Concurrency-sensitive data (money, status) -> PATCH + optimistic-concurrency (`If-Match`/version).",
    followUp: "Concurrent edits (do users same employee edit karein) ko kaise handle karoge — version / ETag?",
  },
  {
    id: "eepv-5",
    question: "Edit page load ke liye resolver use karein ya component me `effect`/`resource`? Trade-offs.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Resolver: data ready before the route activates — no in-component loading state, but navigation blocks on the fetch (frozen feel if slow), and error handling lives in the resolver. In-component `resource()`/`effect`: route activates instantly, show a skeleton, load in place — better perceived performance, more component code.",
    detailedAnswer:
      "Modern lean: `id = input.required<string>()` + `employee = resource({ params: () => ({ id: this.id() }), loader })` + a skeleton while `employee.isLoading()`. The form hydrates in an `effect` when `employee.value()` arrives. Resolver still makes sense for SEO/prerender or when 'no record -> redirect to 404' is cleanest as a guard-like step. Don't use a resolver with a slow, unbounded call and no progress indicator.",
    followUp: "`resource()` ke value aane par form hydrate karne ke liye `effect` me kya guard rakhoge (double-hydrate avoid)?",
  },
];

export default questions;
