import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "template-driven-forms-1",
    question: "Template-driven form ka model kahan build hota hai?",
    options: [
      "Component class me ek `FormGroup` explicitly banake",
      "Template me `ngModel` + validator directives se — Angular background me `FormGroup`/`FormControl` tree infer kar leta hai",
      "`app.config.ts` me",
      "Ek JSON file me",
    ],
    correctIndex: 1,
    explanation:
      "Template-driven me aap HTML me form describe karte ho (`ngModel`, `required`, `name`), aur Angular uske peeche control tree banata hai. Reactive forms me aap `FormGroup` khud class me banate ho.",
    difficulty: "easy",
  },
  {
    id: "template-driven-forms-2",
    question: "`<form>` ke andar `ngModel` input par `name` attribute na dene par kya hota hai?",
    options: [
      "Kuch nahi",
      "Control `NgForm` me register nahi hota — `f.value` me wo field missing, aur console warning aati hai",
      "Form submit disable ho jaata hai",
      "`ngModel` two-way binding band ho jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "`NgForm` apne child controls ko unke `name` se track karta hai. Bina `name` ke Angular warn karta hai aur wo control form model ka hissa nahi banta (`[ngModelOptions]=\"{standalone:true}\"` alag case hai).",
    difficulty: "medium",
  },
  {
    id: "template-driven-forms-3",
    question: "Validation error kab dikhana chahiye?",
    options: [
      "Form load hote hi turant",
      "`invalid && touched` (ya `&& dirty`) — taaki fresh form red me na ho, aur user ke interact karne ke baad hi error dikhe",
      "Sirf submit ke baad hamesha",
      "Kabhi nahi",
    ],
    correctIndex: 1,
    explanation:
      "`touched` (blur ho chuka) ya `dirty` (value badli) ke saath `invalid` gate karo. Turant errors dikhana bad UX hai. Submit par sab controls ko `markAllAsTouched()` karke saare errors reveal kar sakte ho.",
    difficulty: "easy",
  },
  {
    id: "template-driven-forms-4",
    question: "Template-driven form kab reactive form se badal dena chahiye?",
    options: [
      "Kabhi nahi",
      "Jab form me cross-field validation (confirm password, date range), async validation (email uniqueness), dynamic add/remove rows (FormArray), ya programmatic control aur unit-testable form logic chahiye",
      "Jab form me 2 se zyada fields hon",
      "Jab form GET request bhejta ho",
    ],
    correctIndex: 1,
    explanation:
      "Template-driven small, static forms (login, quick filter) ke liye theek. Complex validation, dynamic fields, ya testable/programmatic form logic ke liye reactive forms — jaha model explicit aur code me hota hai.",
    difficulty: "medium",
  },
];

export default quiz;
