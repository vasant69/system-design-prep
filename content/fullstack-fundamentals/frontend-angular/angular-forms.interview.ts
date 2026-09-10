import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "af-1",
    question: "Template-driven vs reactive forms — kaise decide karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Reactive jab form me dynamic structure ho, cross-field ya async validation ho, ya unit tests chahiye — model class me explicit hai aur synchronously update hota hai. Template-driven chhoti static forms ke liye jahan HTML me directives kam ceremony hain.",
    detailedAnswer:
      "Dono wahi `FormControl`/`FormGroup` tree banate hain; farak ye hai ki tum use kahan banate ho aur wo kitna testable hai. Reactive forms `valueChanges`/`statusChanges` streams, synchronous validity, dynamic lists ke liye `FormArray`, aur pure-function validators dete hain jo bina DOM ke test hote hain. Template-driven forms model construction ko change detection tak defer karte hain, isiliye unki state ek tick late settle hoti hai aur assert karna mushkil.",
    followUp: "Template-driven forms me har `ngModel` control par `name` attribute kyun chahiye?",
  },
  {
    id: "af-2",
    question: "Form par ek value screen par dikhti hai par `form.value` me wo field nahi hai. Kya hua?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Control disabled hai. Angular disabled controls ko `form.value` se omit kar deta hai. Unhe include karne ke liye `form.getRawValue()` use karo.",
    detailedAnswer:
      "Disabled controls validation se bhi skip hote hain. Agar value submit karni hai par field non-editable chahiye, to ya `getRawValue()` use karo, ya control enabled rakho aur template me read-only banao, ya submit se just pehle re-enable karo. Ye un logon ko bites karta hai jo UX ke liye fields disable karte hain aur phir payload incomplete milta hai.",
  },
  {
    id: "af-3",
    question: "'confirm password must match password' kaise implement karoge, aur wo validator kahan jaata hai?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Ye ek group-level validator hai jo `fb.group({...}, { validators: [matchPasswords] })` ke doosre argument me jaata hai. Function `FormGroup` leta hai, `group.get('password').value` aur `group.get('confirm').value` compare karta hai, aur `null` ya group par `{ mismatch: true }` return karta hai.",
    detailedAnswer:
      "Control validator sirf apna control dekhta hai, isliye do fields compare nahi kar sakta. Error phir group par rehta hai (`form.errors?.['mismatch']`), isliye message ko usse bind karo aur `form.get('confirm')?.touched` par gate karo taaki user ke type karne se pehle flash na ho. Async cross-field checks bhi same pattern async group validator ke saath.",
    redFlag: "Sibling control ki value ko single-control validator me closure se inject karne ki koshish — fragile aur order-dependent.",
  },
];

export default questions;
