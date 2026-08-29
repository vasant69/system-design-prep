import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "two-way-binding-with-signals-1",
    question: "`[(ngModel)]=\"name\"` internally kis do bindings ke barabar hai?",
    options: [
      "`[ngModel]=\"name\"` do baar",
      "`[ngModel]=\"name\"` (property) + `(ngModelChange)=\"name = $event\"` (event)",
      "`(ngModel)=\"name\"` + `{{ name }}`",
      "Sirf `(ngModelChange)=\"name = $event\"`",
    ],
    correctIndex: 1,
    explanation:
      "'Banana in a box' `[( )]` ek property binding + ek `Change`-suffixed event binding ka shorthand hai. `[ngModel]` value andar bhejta hai, `(ngModelChange)` user input par class update karta hai. Baaki options is expansion ko galat dikhate hain.",
    difficulty: "easy",
  },
  {
    id: "two-way-binding-with-signals-2",
    question: "Apne component ke ek input `x` ko two-way (`[(x)]`) banane ke liye kya chahiye?",
    options: [
      "Kuch nahi, har `@Input` automatically two-way hota hai",
      "Ek `x` input + ek `xChange` output (`@Input x` + `@Output xChange`), ya seedha `x = model<T>(...)` jo dono generate karta hai",
      "`FormsModule` import karna",
      "Component ko `standalone: false` banana",
    ],
    correctIndex: 1,
    explanation:
      "`[(x)]` `[x]` + `(xChange)` me expand hota hai, isliye ek `xChange` output zaroori hai. `model()` signal ye output khud bana deta hai. Option A galat — inputs by default one-way. Option C sirf `ngModel` ke liye. Option D unrelated.",
    difficulty: "medium",
  },
  {
    id: "two-way-binding-with-signals-3",
    question: "`x = model<string>(\"\")` ke andar value kaise read/write karte ho?",
    options: [
      "`this.x` read, `this.x = \"v\"` write",
      "`this.x()` read, `this.x.set(\"v\")` ya `this.x.update(fn)` write — kyunki model ek writable signal hai",
      "`this.x.value` read, `this.x.next(\"v\")` write",
      "Sirf template me access ho sakta hai, class me nahi",
    ],
    correctIndex: 1,
    explanation:
      "`model()` ek writable signal hai: call karke read (`x()`), `set`/`update` se write. Ye parent ke liye ek `xChange` output bhi expose karta hai. Option A plain property syntax hai. Option C RxJS Subject syntax hai. Option D galat.",
    difficulty: "medium",
  },
  {
    id: "two-way-binding-with-signals-4",
    question: "Bade multi-field employee form (validation, submit, dirty tracking) ke liye kaunsa approach behtar hai aur kyun?",
    options: [
      "Har field par `[(ngModel)]` — sabse kam code",
      "Reactive forms — har control ka apna value/validity/dirty state, cross-field aur async validators structured, form value ek typed object",
      "Template me plain `[value]` + `(input)` har field par",
      "Two-way binding ek single object par",
    ],
    correctIndex: 1,
    explanation:
      "Reactive forms explicit `FormGroup`/`FormControl` model dete hain — per-control validity, `dirty`/`touched`, custom + async validators, aur `valueChanges` observable. `[(ngModel)]` chhoti transient UI state (filter/toggle) ke liye theek, par bade forms me state tracking messy ho jaati hai.",
    difficulty: "medium",
  },
];

export default quiz;
