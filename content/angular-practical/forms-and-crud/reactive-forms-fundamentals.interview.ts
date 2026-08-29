import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rff-1",
    question: "Reactive form kaise structure karte ho? Building blocks aur template wiring.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Class me `form = fb.nonNullable.group({ field: [initial, [validators]], skills: fb.array<string>([]) })`. Template: `<form [formGroup]=\"form\" (ngSubmit)=\"submit()\">`, `<input formControlName=\"field\">`, `formArrayName`/`[formControlName]=\"$index\"` for arrays, `[ngValue]` for non-string selects. `ReactiveFormsModule` in imports.",
    detailedAnswer:
      "`FormControl` = ek field, `FormGroup` = named controls ka object, `FormArray` = dynamic list. `FormBuilder` shorthand; `fb.nonNullable` non-nullable typed controls. Read: `form.value` (disabled omit), `getRawValue()` (include disabled), `form.valid`, `control.errors`. Control: `patchValue`/`setValue`/`reset`/`disable`/`setErrors`/`markAllAsTouched`. React: `control.valueChanges`/`form.valueChanges`/`statusChanges` (with `takeUntilDestroyed`). Strictly typed since v14.",
    followUp: "`FormRecord` aur `FormArray` — dynamic keys wale form ke liye kaunsa?",
  },
  {
    id: "rff-2",
    question: "`valueChanges` ke real use cases? Ek trap batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Dependent fields (`departmentId` change -> reload roles), live/derived values (total = qty * price), autosave drafts (`form.valueChanges.pipe(debounceTime(500))`), enable/disable a field based on another, and conditional validators. Trap: subscribing without `takeUntilDestroyed()`/`async` -> leak; and `patchValue` inside a `valueChanges` handler can loop.",
    detailedAnswer:
      "`control.valueChanges` ek field ko, `form.valueChanges` poore form ko observe karta hai — har keystroke par emit. Autosave: `debounceTime` + `distinctUntilChanged` + `switchMap(save)`. Dependent dropdown: `deptId.valueChanges.pipe(switchMap(loadRoles))`. Loop trap: agar handler `form.patchValue(...)` kare aur wo dobara `valueChanges` fire kare -> infinite. `patchValue(x, { emitEvent: false })` se break karo. Conditional validators: `field.setValidators(...)` + `field.updateValueAndValidity()` on another field's change.",
    followUp: "`patchValue(x, { emitEvent: false })` kab zaroori hai, aur uska side-effect kya?",
  },
  {
    id: "rff-3",
    question: "Typed reactive forms (Angular 14+) ne kya badla? `fb.nonNullable` kis problem ko solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Pehle `form.value` `any` tha aur `form.get('x')` `AbstractControl | null`. Ab `form.value` ek typed object hai, `form.controls.x` ek `FormControl<T>`. Default me har control `T | null` hota hai (`reset()` `null` set karta hai) — `fb.nonNullable` (ya `{ nonNullable: true }`) control ko `FormControl<T>` banata hai aur `reset()` initial value par le jaata hai.",
    detailedAnswer:
      "Untyped era: `this.form.get('email')!.value` — cast/bang everywhere, typos runtime pe pakde jaate. Typed: `this.form.controls.email.value` compile-checked. Nullability: reactive controls historically nullable the (partly reset semantics). `T | null` har `patchValue`/mapping me `?? ''` forces. `fb.nonNullable.group({...})` ya `new FormControl('', { nonNullable: true })` se `email: string` (not `string | null`), aur `reset()` `''` deta hai. Legacy untyped forms ke liye `UntypedFormGroup` migration escape hatch hai.",
    followUp: "`form.value` aur `form.getRawValue()` ke types me kya farak hai disabled controls ke saath?",
  },
  {
    id: "rff-4",
    question:
      "Ek form me 3 fields conditionally required hain (jaise 'is contractor?' true ho to 'agency name' required). Kaise implement karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`isContractor.valueChanges` par subscribe: `if (v) { agencyName.setValidators([Validators.required]); } else { agencyName.clearValidators(); } agencyName.updateValueAndValidity();`. Ya ek group validator jo cross-field rule check kare. `takeUntilDestroyed()` + initial run for edit mode.",
    detailedAnswer:
      "Approach 1 (dynamic validators): field ke validators ko runtime par set/clear karo aur `updateValueAndValidity()` call karo (warna change register nahi hota). Edit mode me initial value ke liye ek baar manually run. Approach 2 (group validator): `{ validators: (g) => g.get('isContractor')?.value && !g.get('agencyName')?.value ? { agencyRequired: true } : null }` — error group par, dikhana thoda extra. Approach 1 field-level errors deta hai (cleaner UI); approach 2 declarative. Bade forms me a small helper `conditionalValidator(predicate, validator)` bana lo.",
    followUp: "Conditionally disabled field ka value `form.value` me aata hai ya nahi, aur submit par kya karoge?",
  },
  {
    id: "rff-5",
    question: "Reactive form ki testability template-driven se kaise better hai? Ek test sketch.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Reactive form ka model ek plain object hai jise aap render kiye bina test kar sakte ho: `component.form.patchValue({ email: 'bad' }); expect(component.form.controls.email.errors).toEqual({ email: true }); component.form.patchValue({ email: 'a@b.com', ... }); expect(component.form.valid).toBe(true); component.submit(); expect(apiSpy.create).toHaveBeenCalledWith(...)`.",
    detailedAnswer:
      "Template-driven form ki logic template me bandhi hai — test karne ke liye render + `fixture.detectChanges()` + DOM `input` events fire karne padte hain. Reactive form ke controls/validators code me hain: `patchValue`, assert `valid`/`errors`, call `submit()`, assert the service spy. Async validators bhi test hote hain (`fakeAsync` + `tick`). Cross-field group validators ka bhi direct test. Isliye complex form logic reactive me + a focused spec = fast, stable tests.",
    followUp: "Async validator (email uniqueness) ka unit test `fakeAsync`/`tick` ke saath kaisa dikhta hai?",
  },
];

export default questions;
