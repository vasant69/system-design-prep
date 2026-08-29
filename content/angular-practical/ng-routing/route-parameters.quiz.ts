import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "route-parameters-1",
    question: "Route `/employees/:id` par `/employees/42` khulne par `id` ki value kya hoti hai?",
    options: [
      "Number `42`",
      "String `\"42\"` — route params hamesha strings hote hain; number chahiye to `+id` / `Number(id)` karo",
      "`undefined`",
      "`{ id: 42 }`",
    ],
    correctIndex: 1,
    explanation:
      "URL segments text hote hain, isliye route params hamesha string. `pm.get('id')` deta hai `\"42\"`. Comparison/arithmetic ke liye coerce karo.",
    difficulty: "easy",
  },
  {
    id: "route-parameters-2",
    question: "`ActivatedRoute.paramMap` (Observable) aur `snapshot.paramMap` me core farak?",
    options: [
      "Koi farak nahi",
      "`paramMap` Observable param change par dobara emit karta hai (component recreate na ho tab bhi); `snapshot` ek-baar ka read hai jo update nahi hota",
      "`snapshot` sirf lazy routes me kaam karta hai",
      "`paramMap` sirf query params ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "`paramMap` reactive hai — `/x/1` se `/x/2` (same route) par wo naya value emit karega. `snapshot` navigation ke us moment ka frozen read hai; component reuse hone par stale.",
    difficulty: "medium",
  },
  {
    id: "route-parameters-3",
    question: "Master-detail screen (list left, details right) me `snapshot.paramMap.get('id')` kyun bug deta hai?",
    options: [
      "Snapshot slow hota hai",
      "Alag rows click karne par URL `:id` badalta hai par `EmployeeDetailsPage` remount nahi hota (same route) — snapshot purana id rakhta hai, galat employee dikhta hai",
      "Snapshot ko `await` karna padta hai",
      "`get('id')` galat method hai",
    ],
    correctIndex: 1,
    explanation:
      "Router same route config wale navigation par component instance reuse karta hai (performance). `snapshot` us pehle navigation par freeze ho jaata hai. `paramMap` Observable ya `input()` signal param change par react karte hain.",
    difficulty: "hard",
  },
  {
    id: "route-parameters-4",
    question: "`withComponentInputBinding()` ka kya faayda hai?",
    options: [
      "Wo routes ko lazy bana deta hai",
      "Route params (aur query params + resolver data) automatically matching naam ke component `@Input`/`input()` me bind ho jaate hain — `ActivatedRoute` subscribe karne ki boilerplate kam",
      "Wo guards ko bypass karta hai",
      "Wo `router-outlet` ki zaroorat khatam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`provideRouter(routes, withComponentInputBinding())` ke saath `:id` -> `id` input. Signal input (`id = input.required<string>()`) `computed`/`resource`/`effect` me directly use hota hai — cleaner than manually reading `ActivatedRoute`.",
    difficulty: "medium",
  },
];

export default quiz;
