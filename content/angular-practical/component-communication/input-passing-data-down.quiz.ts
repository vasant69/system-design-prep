import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "input-passing-data-down-1",
    question: "Input se data kis direction me flow karta hai?",
    options: [
      "Child se parent",
      "Parent se child, one-way — `<app-child [x]=\"value\">`",
      "Dono taraf automatically",
      "Sibling components ke beech",
    ],
    correctIndex: 1,
    explanation:
      "Inputs parent se child ki taraf one-way data pass karte hain. Child ko change chahiye to wo ek event (`@Output`/`output()`) emit karta hai — parent ki state directly nahi badalta. Sibling communication ek shared service/parent se hoti hai.",
    difficulty: "easy",
  },
  {
    id: "input-passing-data-down-2",
    question: "`employee = input.required<Employee>()` ka `@Input() employee!: Employee` par kya faayda hai?",
    options: [
      "Kuch nahi, dono same",
      "Agar parent `[employee]` bind na kare to compile-time error milta hai (runtime `undefined` surprise nahi); aur ye ek signal hai jo `computed`/`effect` me directly kaam karta hai",
      "`input.required` faster HTTP karta hai",
      "`input.required` ko `FormsModule` chahiye",
    ],
    correctIndex: 1,
    explanation:
      "`input.required()` binding ki absence ko build time par catch karta hai; `@Input() x!` sirf TypeScript ko chup karata hai aur runtime par `undefined` de sakta hai. Signal input `x()` OnPush aur `computed` ke saath naturally integrate hota hai.",
    difficulty: "medium",
  },
  {
    id: "input-passing-data-down-3",
    question: "Signal input `employee` ko template me kaise access karte hain?",
    options: [
      "`{{ employee.firstName }}`",
      "`{{ employee().firstName }}` — signal hai, call karna padta hai",
      "`{{ employee | async }}`",
      "`{{ this.employee.firstName }}`",
    ],
    correctIndex: 1,
    explanation:
      "`input()` ek signal deta hai, isliye value read karne ke liye use call karna padta hai: `employee()`. Bare `employee` function reference hoga. `async` pipe Observables ke liye hai, signals ke liye nahi.",
    difficulty: "easy",
  },
  {
    id: "input-passing-data-down-4",
    question: "Child component ke andar `this.employee().isActive = false` karna kyun galat hai (jab `employee` ek input hai)?",
    options: [
      "Ye compile nahi hoga kabhi bhi",
      "Ye parent ki object ko in-place mutate karta hai — one-way data flow toot jaata hai, OnPush parent update nahi hota, aur 'kisne value badli' trace karna impossible ho jaata hai. Sahi: ek event emit karo",
      "Ye sirf production build me fail hota hai",
      "Kuch galat nahi, ye normal pattern hai",
    ],
    correctIndex: 1,
    explanation:
      "Input object parent ka data hai. Child use mutate kare to shared reference chupke se badalta hai — predictability aur OnPush dono khatam. Child ko change chahiye to `output()` se parent ko batao, parent apni state update kare (immutably).",
    difficulty: "medium",
  },
];

export default quiz;
