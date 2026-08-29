import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "vbca-1",
    question: "Custom sync validator kaise likhte ho? Parameterised validator?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`export function noWhitespace(c: AbstractControl): ValidationErrors | null { return c.value?.trim() === '' ? { whitespace: true } : null; }`. Parameterised = ek factory jo `ValidatorFn` return kare: `export function minAge(min: number): ValidatorFn { return c => !c.value ? null : (age(c.value) < min ? { minAge: { required: min, actual: age(c.value) } } : null); }`.",
    detailedAnswer:
      "Validator pure aur synchronous hona chahiye — no HTTP, no side effects (wo async validator ka kaam hai). Empty value par `null` return karo. Error object me useful context daalo (`{ min, actual }`) taaki message specific ho. Reactive form me `[validators]` array me pass karo; template-driven me ek directive wrap (`NG_VALIDATORS` multi-provider). Unit test trivial: `expect(minAge(18)(new FormControl('2010-01-01'))).toEqual({ minAge: {...} })`.",
    followUp: "Ek validator jise dusre control ki value chahiye (na ki apni) — kaise likhoge bina group validator ke?",
  },
  {
    id: "vbca-2",
    question: "Async validator ka poora anatomy — return type, timing, debounce, error handling.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`AsyncValidatorFn = (control) => Observable<ValidationErrors | null> | Promise<...>`. Sync validators pass hone ke baad chalta hai. Control `PENDING` rehta hai jab tak resolve na ho. Debounce validator ke andar (`timer(400)` + `switchMap`). Failure par `catchError(() => of(null))`. Submit button `form.pending` par disable.",
    detailedAnswer:
      "```ts\nemailUnique(api): AsyncValidatorFn {\n  return c => c.value ? timer(400).pipe(\n    switchMap(() => api.isEmailTaken(c.value)),\n    map(taken => taken ? { emailTaken: true } : null),\n    catchError(() => of(null)),\n  ) : of(null);\n}\n```\nKey points: (1) Angular async validators ko sync-pass ke baad chalata hai (redundant server calls avoid); (2) har naye value par purana async validator cancel hota hai (Angular internally handles), par debounce se extra requests bhi kam; (3) `PENDING` state ko UX me use karo (spinner, disable submit); (4) failure ko swallow karo taaki UX na toote — ek retry / a soft warning better than a hard block.",
    followUp: "Do async validators ek hi control par — wo parallel chalte hain ya sequential, aur errors kaise merge hote hain?",
  },
  {
    id: "vbca-3",
    question: "Conditional validation ('agency name required only if contractor') — approaches aur pitfalls.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Approach A: `isContractor.valueChanges` par `agencyName.setValidators(...)` / `clearValidators()` + `agencyName.updateValueAndValidity()`. Approach B: ek group validator. Pitfall A: `updateValueAndValidity()` bhoolna (validators lag jaate hain par re-check nahi hota), aur edit mode me initial run bhoolna. Pitfall B: error group par, field ke paas dikhana extra kaam.",
    detailedAnswer:
      "Approach A field-level errors deta hai (better UX, message field ke neeche). Steps: subscribe (`takeUntilDestroyed`), set/clear validators, `updateValueAndValidity({ emitEvent: false })` (loop avoid), aur `ngOnInit`/constructor me ek baar current value ke saath run (edit form). Approach B declarative: `{ validators: g => g.get('isContractor')?.value && !g.get('agencyName')?.value ? { agencyRequired: true } : null }`. Bade forms ke liye ek reusable `conditionalValidator(predicate: () => boolean, v: ValidatorFn)` helper. Conditionally disabled field ka value `form.value` me nahi aata — submit par `getRawValue()` ya explicitly handle.",
    followUp: "Conditionally disabled control ko submit payload me include karna ho to kya karoge?",
  },
  {
    id: "vbca-4",
    question:
      "10-field form me har error ke liye hand-written `<small>` maintainable nahi. Better pattern?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ek `<app-field-error [control]=\"...\" [label]=\"...\">` component jo `control.errors` ko iterate kare aur ek central `ERROR_MESSAGES` map (`{ required: l => l + ' is required', minlength: (l, e) => ... }`) se message render kare — gated on `control.invalid && control.touched`. 30 conditions -> 1 component + 1 map.",
    detailedAnswer:
      "```ts\n@Component({ selector: 'app-field-error', template: `@if (control().invalid && control().touched) { <small>{{ message() }}</small> }` })\nexport class FieldError {\n  control = input.required<AbstractControl>();\n  label = input('This field');\n  message = computed(() => {\n    const errs = this.control().errors; if (!errs) return '';\n    const key = Object.keys(errs)[0];\n    return (MESSAGES[key] ?? (() => 'Invalid'))(this.label(), errs[key]);\n  });\n}\n```\nBenefits: consistent wording, i18n ek jagah, aur naye validator ke liye sirf map me ek entry. Server field errors (`{ server: 'already taken' }`) bhi isi map se pass-through ho sakte hain.",
    followUp: "Multiple errors ek saath (required aur minlength dono) — sabhi dikhaoge ya sirf pehla?",
  },
  {
    id: "vbca-5",
    question: "Frontend validation aur backend validation — dono kyun, aur boundary kahan?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Frontend validation = fast feedback + fewer bad requests (UX). Backend validation = the real gate (security + data integrity), because a client can be bypassed (Postman, disabled JS). Frontend mirrors the rules it can; backend enforces all of them and returns structured field errors the frontend surfaces.",
    detailedAnswer:
      "Frontend: format, required, ranges, cross-field, aur async 'looks-available' checks — instant, no round-trip for obvious mistakes. Backend: same rules + authorization + business invariants + true uniqueness (race-condition-safe with a DB constraint) + anything needing secret data. Contract: backend rejects with `422` + `{ errors: { field: [msg] } }`; frontend maps those onto controls (`setErrors({ server: msg })`). Never trust the frontend check for correctness — the async 'email available' can be stale by submit time; the DB unique constraint is the truth.",
    followUp: "Async 'email available' check pass hua par submit par backend `409` deta hai (race). UX?",
  },
];

export default questions;
