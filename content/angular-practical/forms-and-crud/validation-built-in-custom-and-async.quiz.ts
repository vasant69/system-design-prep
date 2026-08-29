import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "validation-built-in-custom-and-async-1",
    question: "Ek Angular validator function kya return karta hai?",
    options: [
      "Ek boolean (`true` = valid)",
      "Ek `ValidationErrors` object (`{ someKey: true }`) jab invalid ho, ya `null` jab valid ho",
      "Ek string error message",
      "Ek Promise hamesha",
    ],
    correctIndex: 1,
    explanation:
      "`null` = valid; ek errors object = invalid, jisme keys (`required`, `minAge`) errors identify karti hain aur values context deti hain. Template `control.hasError('key')` se message dikhata hai.",
    difficulty: "easy",
  },
  {
    id: "validation-built-in-custom-and-async-2",
    question: "Custom validator ko empty value par kya karna chahiye?",
    options: [
      "`{ required: true }` return karna",
      "`null` return karna — emptiness ko `Validators.required` handle karne dena; warna message galat aur `required` redundant ho jaata hai",
      "Throw karna",
      "`undefined` return karna",
    ],
    correctIndex: 1,
    explanation:
      "Ek `minAge` validator ko khaali field par 'age invalid' nahi bolna chahiye. Empty par `null`, aur `required` ko alag se lagao. Isse errors clean aur composable rehte hain.",
    difficulty: "medium",
  },
  {
    id: "validation-built-in-custom-and-async-3",
    question: "Cross-field validation (jaise 'confirm password matches') kahan attach hoti hai?",
    options: [
      "Confirm password `FormControl` par",
      "`FormGroup` par (`fb.group({...}, { validators: [matchValidator] })`) — kyunki use do controls compare karne hote hain; error group par rehta hai",
      "Template me `ngModel` par",
      "`app.config.ts` me",
    ],
    correctIndex: 1,
    explanation:
      "Single control apne siblings ko nahi dekh sakta. Group-level validator `group.get('pwd')` aur `group.get('confirm')` compare karta hai. Error `form.errors` par aata hai; dikhana deliberate decision hai (field ke paas ya summary me).",
    difficulty: "medium",
  },
  {
    id: "validation-built-in-custom-and-async-4",
    question: "Async validator (email uniqueness) ke saath 2 zaroori practices kaunsi hain?",
    options: [
      "Har keystroke par sync call, aur failure par form block",
      "Validator ke andar debounce (`timer(400)`), aur `catchError(() => of(null))` taaki network failure par form permanently invalid na ho; submit button ko `form.pending` par bhi disable karo",
      "Validator ko `Promise` me convert karna zaroori hai",
      "Async validator ko `FormArray` par lagana",
    ],
    correctIndex: 1,
    explanation:
      "Debounce server ko keystroke-flood se bachata hai. `catchError(of(null))` ek transient network error par form ko usable rakhta hai. `form.pending` true hone par submit disable karo taaki check ke beech submit na ho.",
    difficulty: "hard",
  },
];

export default quiz;
