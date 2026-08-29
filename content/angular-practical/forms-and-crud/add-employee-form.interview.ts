import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "aef-1",
    question: "Ek 'create' form screen ko end-to-end kaise banaoge? Steps.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "(1) Typed `fb.nonNullable.group` with validators (built-in + custom + group + async). (2) Dependent fields via `valueChanges`. (3) `submit()`: guard `if (form.invalid) { markAllAsTouched(); return; }`. (4) Map `getRawValue()` -> request DTO. (5) `create()` + `finalize(saving false)`. (6) Success -> navigate + toast; `422` -> bind field errors; other -> banner. Disable submit on `invalid || pending || saving`.",
    detailedAnswer:
      "Structure: services injected (`api`, `lookups`, `router`, `toast`), `saving`/`formError` signals, lookups as `toSignal`. The dependent dropdown lives in the constructor (`departmentId.valueChanges` -> reset/enable `roleId` + fetch roles, `takeUntilDestroyed`). Submit maps form -> DTO because shapes differ (ISO dates, no wrapper noise, dropped derived fields). Server field errors go inline via `setErrors({ server })`, not a toast. This exact pattern repeats for every 'Add X' screen.",
    followUp: "Is component ka test kaisa hoga — kaunse cases cover karoge?",
  },
  {
    id: "aef-2",
    question: "Dependent dropdown (department -> role) ko robustly kaise implement karoge? Edge cases?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`departmentId.valueChanges.pipe(takeUntilDestroyed())` -> reset `roleId` to null + disable, clear roles; if a dept is chosen, fetch roles then enable `roleId`. Edge cases: rapid switching (use `switchMap` to cancel stale role fetches), edit mode (set dept and role together without a race), and 'no roles' for a dept.",
    detailedAnswer:
      "Better version: `this.roles = toSignal(toObservable(deptIdSignal).pipe(switchMap(id => id ? this.lookups.getRoles(id) : of([]))))` and derive `roleId` disabled state from `deptId`. Edit mode race: if you `patchValue({ departmentId, roleId })`, the `valueChanges` handler resets `roleId` to null right after — fix by loading roles first, then patching both, or by passing `{ emitEvent: false }` when patching and manually triggering the role load. Also: if the chosen department later has zero roles, keep `roleId` required but show an empty-state.",
    followUp: "Edit mode me department aur role dono ko sahi order me set karne ke 2 tareeke?",
  },
  {
    id: "aef-3",
    question:
      "Submit par aap `this.api.create(this.form.value)` bhej rahe ho. Do problems batao.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "(1) `form.value` disabled controls ko omit karta hai — ek temporarily-disabled `roleId` payload me nahi jaayega. (2) Form shape ≠ API shape — dates raw strings, `skills` FormArray value shape, aur maybe derived/UI-only fields. Fix: `toCreateEmployeeDto(this.form.getRawValue())`.",
    detailedAnswer:
      "`getRawValue()` disabled controls include karta hai. DTO mapper: `joinDate` -> ISO string, `salary` -> number (already), `skills` -> `string[]` (array value already fine), drop anything the API doesn't accept. The mapper also documents the request contract and is unit-testable. Sending `form.value` blindly is a common source of '400 Bad Request' and 'why is roleId null on the server'.",
    followUp: "DTO mapper aur form model ko sync me rakhne ke liye kya technique use karoge?",
  },
  {
    id: "aef-4",
    question:
      "Async email-uniqueness check pass ho gaya, par user ke submit karne tak koi aur us email se register ho gaya (race). Server `409` deta hai. UX kaisa rakhoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Server `409`/`422` ko field error me map karo: `form.get('email')?.setErrors({ server: 'This email was just taken' })`, submit button re-enable, aur user ko email badalne do. Async 'available' check ek hint hai — DB unique constraint hi truth hai.",
    detailedAnswer:
      "Front-end async validator kabhi authoritative nahi ho sakta (TOCTOU race). Design: (1) backend par a real unique constraint (DB), jo `409 Conflict` deta hai; (2) front-end us `409` ko `email` control par `setErrors({ server })` se surface kare; (3) `saving` false, form editable; (4) optionally re-run the async validator so the field shows invalid immediately. The async check reduces bad submits (good UX) but the server is the gate. Don't hide the submit button forever on a stale 'available'.",
    followUp: "Kya async validator ko submit ke just-before dobara run karna worth hai?",
  },
  {
    id: "aef-5",
    question: "Is form component ke unit test me kaunse scenarios cover karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Invalid submit -> `markAllAsTouched` called, `api.create` NOT called. Valid submit -> `api.create` called with the mapped DTO, navigate + toast on success. `422` response -> `email` control has a `server` error. Dependent dropdown -> changing `departmentId` resets `roleId` and calls `lookups.getRoles`. `saving` toggles and clears on error (`finalize`).",
    detailedAnswer:
      "Setup: `TestBed` with `provideHttpClientTesting()` or fake `EmployeeService`/`LookupService` spies, a fake `Router`, a fake `ToastService`. Reactive form makes this easy: `component.form.patchValue({...valid...})`, `component.submit()`, `expect(apiSpy.create).toHaveBeenCalledWith(expectedDto)`. Async validator with `fakeAsync`/`tick(400)`. No DOM interaction needed for the logic — a few `fixture.detectChanges()` for the disabled-button assertions. This is exactly why the form is reactive, not template-driven.",
    followUp: "`fakeAsync` + `tick` vs `waitForAsync` — async validator test me kaunsa aur kyun?",
  },
];

export default questions;
