import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "reactive-forms-fundamentals-1",
    question: "Reactive form ka model kahan define hota hai?",
    options: [
      "Template me `ngModel` se",
      "Component class me explicitly — `FormControl`/`FormGroup`/`FormArray`, usually `FormBuilder` se; template `[formGroup]` + `formControlName` se bind karta hai",
      "`angular.json` me",
      "Backend se aata hai",
    ],
    correctIndex: 1,
    explanation:
      "Reactive forms me form ki shape code me visible hoti hai. `ReactiveFormsModule` import karo, `fb.nonNullable.group({...})` se model banao, aur template use naam se bind karta hai.",
    difficulty: "easy",
  },
  {
    id: "reactive-forms-fundamentals-2",
    question: "`setValue` aur `patchValue` me kya farak hai?",
    options: [
      "Koi farak nahi",
      "`setValue` ko form ke HAR control ki value chahiye (partial object par throw karta hai); `patchValue` sirf diye gaye fields set karta hai, baaki chhod deta hai",
      "`patchValue` sirf disabled controls par kaam karta hai",
      "`setValue` async hai, `patchValue` sync",
    ],
    correctIndex: 1,
    explanation:
      "`setValue({...})` strict hai — sab controls chahiye. `patchValue({ firstName: 'X' })` partial-friendly hai — edit form me API se aaye employee ko load karne ke liye common.",
    difficulty: "medium",
  },
  {
    id: "reactive-forms-fundamentals-3",
    question: "`<option>` me non-string value (jaise `departmentId` number) bind karne ke liye kya use karte hain?",
    options: [
      "`[value]=\"d.id\"`",
      "`[ngValue]=\"d.id\"` — `[value]` sab kuch string bana deta hai (`departmentId` `\"4\"` ho jaata), `[ngValue]` actual type (number/object) preserve karta hai",
      "`[(ngModel)]=\"d.id\"`",
      "`selected=\"d.id\"`",
    ],
    correctIndex: 1,
    explanation:
      "`[value]` HTML attribute string me coerce karta hai. `[ngValue]` Angular ka binding hai jo `<select>` me numbers/objects ko type-safe rakhta hai. Number IDs ke liye `[ngValue]` zaroori hai.",
    difficulty: "medium",
  },
  {
    id: "reactive-forms-fundamentals-4",
    question: "`fb.nonNullable.group({...})` (vs plain `fb.group`) ka faayda?",
    options: [
      "Faster",
      "Controls non-nullable typed hote hain (`FormControl<string>` na ki `FormControl<string | null>`), aur `reset()` control ko uski initial value par le jaata hai `null` par nahi — mapping/patch code saaf rehta hai",
      "Validation automatically add ho jaati hai",
      "`ReactiveFormsModule` ki zaroorat khatam ho jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "Default me har reactive control `T | null` hota hai (reset `null` set karta hai). `fb.nonNullable` isse hatata hai — types cleaner, aur `reset()` initial value deta hai, jisse DTO mapping me `?? ''` spam nahi karna padta.",
    difficulty: "medium",
  },
];

export default quiz;
