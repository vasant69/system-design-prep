import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "data-binding-1",
    question: "`[(ngModel)]=\"searchTerm\"` internally kis do bindings ka syntactic sugar hai?",
    options: [
      "`[ngModel]=\"searchTerm\"` aur `(ngModelChange)=\"searchTerm = $event\"`",
      "`{{ searchTerm }}` aur `(click)=\"update()\"`",
      "`[value]=\"searchTerm\"` aur `(change)=\"searchTerm\"`",
      "Sirf ek hi binding hoti hai, sugar nahi hai",
    ],
    correctIndex: 0,
    explanation: "Two-way binding ek property binding (ngModel value ko input me daalta hai) aur ek event binding (ngModelChange naye value ko wapas class me le aata hai) ka combination hai. Ye 'banana in a box' pattern hai — jo option A me exactly desugared form dikhaya gaya hai.",
    difficulty: "medium",
  },
  {
    id: "data-binding-2",
    question: "Ek 10-field registration form banate waqt, jisme conditional fields aur field-level validation chahiye, kaunsa approach behtar hai aur kyun?",
    options: [
      "[(ngModel)] har field pe, kyunki fastest to write hai",
      "Reactive Forms, kyunki validation, conditional logic, aur testability structured tarike se class me manage hoti hai instead of spreading across the template",
      "Interpolation, kyunki forms me sirf display karna hota hai",
      "Event binding akela, bina kisi binding ke value track karne ke",
    ],
    correctIndex: 1,
    explanation: "Bade forms me template-driven two-way binding scale nahi karta — validation aur conditional logic template me hi fragment ho jaati hai. Reactive Forms (FormGroup/FormControl) is logic ko component class me centralize karta hai, jisse testing aur maintenance dono aasan hote hain.",
    difficulty: "medium",
  },
  {
    id: "data-binding-3",
    question: "`<button (click)=\"doSomething\"></button>` (bina parentheses ke) likhne se kya hota hai?",
    options: [
      "Ye normal kaam karega, jaisa `(click)=\"doSomething()\"` karta hai",
      "Ye method ko call nahi karega jaise expect kiya jaata hai — ye ek function reference expression hai, valid method-call syntax nahi",
      "Ye compile-time error dega turant",
      "Ye do baar method call karega",
    ],
    correctIndex: 1,
    explanation: "Event binding ke andar Angular ek template statement expect karta hai jaisa method call `doSomething()`. Bina parentheses ke likha gaya `doSomething` ek expression hai jo method invoke nahi karta jaisa developer intend karta hai — ye common beginner mistake hai jo silently galat behavior deti hai.",
    difficulty: "easy",
  },
  {
    id: "data-binding-4",
    question: "Ek custom component apne khud ka `[(value)]` two-way binding support karne ke liye kya define karna chahiye?",
    options: [
      "Sirf `@Input() value` — Output automatically ban jaata hai",
      "`@Input() value` aur `@Output() valueChange` (naming convention: input naam + Change)",
      "Sirf ek `@Output() valueChanged` — naming kuch bhi ho sakta hai",
      "Custom components two-way binding support hi nahi kar sakte, sirf ngModel kar sakta hai",
    ],
    correctIndex: 1,
    explanation: "Angular ka banana-box syntax kisi bhi component pe kaam karta hai agar naming convention follow ki jaaye — `@Input() value` ke saath exactly `@Output() valueChange` (input naam ke baad literal 'Change' suffix) hona chahiye. ngModel bhi internally isi convention ka ek built-in example hai.",
    difficulty: "hard",
  },
];

export default quiz;
