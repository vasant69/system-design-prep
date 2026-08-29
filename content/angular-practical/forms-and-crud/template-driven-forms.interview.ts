import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "tdf-1",
    question: "Template-driven aur reactive forms me farak? Kab kaunsa?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Template-driven: form model template me (`ngModel` + directives), Angular `FormGroup` infer karta hai, `FormsModule` chahiye — small/static forms. Reactive: form model explicitly class me (`FormGroup`/`FormControl`/`FormBuilder`), `ReactiveFormsModule` chahiye — cross-field/async/dynamic validation, programmatic control, testable.",
    detailedAnswer:
      "Template-driven asynchronous hota hai (control tree next tick me banta hai), model implicit, validation HTML attributes se. Reactive synchronous, model upfront visible, validation composable functions se, `valueChanges`/`statusChanges` observables. Decision: login / 1-6 fields / built-in single-field validation -> template-driven ok. 10+ fields, conditional fields, 'confirm password', async email check, `FormArray` (dynamic rows), ya form logic ka unit test -> reactive. Bahut teams consistency ke liye sab jagah reactive use karti hain.",
    followUp: "Ek hi form me dono mix kar sakte ho? Karna chahiye?",
  },
  {
    id: "tdf-2",
    question: "`NgForm` (`#f=\"ngForm\"`) kya deta hai, aur `(ngSubmit)` `(submit)` se kyun better hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Angular har `<form>` par ek `NgForm` directive auto-attach karta hai; `#f=\"ngForm\"` se aapko `f.value` (aggregate), `f.valid`, `f.controls`, `f.reset()` milta hai. `(ngSubmit)` native submit ko intercept karta hai (page reload prevent) aur tab fire hota hai jab form valid submission conditions meet kare.",
    detailedAnswer:
      "`(submit)` native event hai — default browser behaviour (full page reload) rokna padta hai manually. `(ngSubmit)` Angular ka wrapper hai jo `preventDefault` karta hai aur ek clean hook deta hai. Submit par `markAllAsTouched()` (`f.form.markAllAsTouched()`) se saare pending errors reveal ho jaate hain. `f.reset()` values + state (pristine/untouched) dono reset karta hai.",
    followUp: "Submit par saare field errors dikhane ke liye exactly kya call karoge?",
  },
  {
    id: "tdf-3",
    question:
      "'Confirm password matches password' — template-driven me kaise, aur kyun ye reactive me cleaner hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Template-driven me ek custom directive banani padti hai jo `NG_VALIDATORS` me register ho aur form/group ke level par cross-field check kare — verbose aur wiring-heavy. Reactive me ek simple group validator function `(group) => group.get('pwd')?.value === group.get('confirm')?.value ? null : { mismatch: true }` seedha `FormGroup` par lag jaata hai.",
    detailedAnswer:
      "Cross-field validation ko ek single control ke attribute se express nahi kar sakte — use group ke level par chahiye. Template-driven me: `@Directive({ selector: '[appMatch]', providers: [{ provide: NG_VALIDATORS, useExisting: MatchDirective, multi: true }] })` + `validate()` implement + template me `appMatch`. Reactive me: `this.fb.group({ pwd: [''], confirm: [''] }, { validators: matchValidator })`. Reactive form model code me visible aur composable hai, isliye group-level rules natural. Ye ek classic 'reactive kyun' example hai.",
    followUp: "Group validator ka error kis control par dikhaoge — `pwd`, `confirm`, ya group?",
  },
  {
    id: "tdf-4",
    question: "Control state flags (`pristine/dirty`, `touched/untouched`, `pending`) ka matlab aur UX me use?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`pristine` = value kabhi nahi badli; `dirty` = badli. `untouched` = kabhi blur nahi hua; `touched` = blur ho chuka. `pending` = async validator abhi chal raha. UX: error dikhao `invalid && (touched || dirty)`; async check ke dauran spinner `pending` par; 'unsaved changes' guard `dirty` par.",
    detailedAnswer:
      "`dirty`/`pristine` value-change track karta hai (typing). `touched`/`untouched` focus-blur track karta hai. Common pattern: `@if (ctrl.invalid && ctrl.touched) { error }` — user ne field chhoda tab error, na ki type karte hue har keystroke par. Submit par `markAllAsTouched()`. `pending` async validator (email uniqueness) ke dauran true — submit button ko `form.invalid || form.pending` par disable karo. Save success ke baad `form.markAsPristine()` taaki unsaved-changes guard misfire na kare.",
    followUp: "`markAsPristine()` save ke baad kyun zaroori hai `CanDeactivate` guard ke saath?",
  },
  {
    id: "tdf-5",
    question: "Team consistency ke liye 'sab forms reactive' vs 'chhote forms template-driven' — aap kya recommend karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Zyadatar teams ke liye: default reactive forms everywhere. Ek hi mental model, ek testing approach, aur ek chhota login form bhi grow kar sakta hai (2FA, remember-me, captcha). Template-driven ko sirf genuinely throwaway/prototype forms ke liye reserve karo.",
    detailedAnswer:
      "'Sab reactive' ka cost: ek 2-field login bhi ~10 lines TS. Faayda: koi 'ye form kaunsa flavour hai' confusion nahi, cross-field/async future changes trivial, aur `ReactiveFormsModule` ek hi import. Template-driven ka niche: ek settings toggle group, ek inline filter — jaha model itna trivial hai ki explicit `FormGroup` overhead lagta hai. Pragmatic policy: reactive default, template-driven ko justify karna pade code review me.",
    followUp: "Signal-based forms (Angular ka upcoming forms model) is decision ko kaise badal sakta hai?",
  },
];

export default questions;
