import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "evb-1",
    question: "Event binding ka syntax aur mechanism samjhao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`(eventName)=\"statement()\"` — parentheses around a DOM event ya component `@Output`. Event fire hone par template statement class me chalti hai; Angular listener attach aur cleanup handle karta hai, aur uske baad change detection.",
    detailedAnswer:
      "`<button (click)=\"save()\">`, `<input (input)=\"onSearch($event)\">`, `<app-row (delete)=\"remove($event)\">`. `$event` native events me `Event`, `@Output` me emitted value. Angular native `addEventListener` lagata hai aur component destroy par remove kar deta hai (koi manual cleanup nahi). Har event ke baad NgZone change detection trigger karta hai. Statement me method calls/assignments allowed, `++`/`new`/bitwise nahi.",
    followUp: "Event ke baad Angular ko kaise pata chalta hai ki CD chalani hai?",
  },
  {
    id: "evb-2",
    question: "Template expression aur template statement me kya farak hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Expression (`[x]=\"...\"`, `{{ ... }}`) side-effect-free hona chahiye aur ek value produce karta hai. Statement (`(e)=\"...\"`) side-effects ke liye hai — method calls aur assignments allowed, par dono me `new`, chaining operators, aur complex logic restricted.",
    detailedAnswer:
      "Expressions frequently re-evaluate hote hain (CD), isliye pure/cheap hone chahiye — assignment nahi. Statements user action par ek baar chalte hain, isliye `showMenu = !showMenu` ya `save()` theek. Dono sandboxed hain: global scope (window, document) accessible nahi, sirf component members. Ye deliberate hai — templates ko simple aur secure rakhne ke liye.",
    followUp: "Template expression me `console.log` kyun kaam nahi karta?",
  },
  {
    id: "evb-3",
    question:
      "Strict TypeScript me `(input)=\"search = $event.target.value\"` compile error deta hai. Kyun aur kaise theek karoge?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`$event.target` ka type `EventTarget | null` hai, jisme `value` property nahi hoti. Fix: ek method `onSearch(e: Event)` banao aur `(e.target as HTMLInputElement).value` cast karo.",
    detailedAnswer:
      "Angular template type-checking (strict templates) `$event.target.value` ko reject karta hai. Clean options: (1) `onSearch(e: Event) { this.search.set((e.target as HTMLInputElement).value); }` aur `(input)=\"onSearch($event)\"`. (2) Template reference variable: `<input #box (input)=\"search.set(box.value)\">`. (3) `$any($event.target).value` — kaam karta hai par type safety kho deta hai, avoid. Best practice option 1 ya 2.",
    followUp: "Reactive forms use karne par ye poora casting problem kyun gayab ho jaata hai?",
  },
  {
    id: "evb-4",
    question:
      "Ek reusable `EmployeeRow` component design karo jo parent ko edit/delete batata hai. Parent-child event flow kaisa hoga?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`EmployeeRow` `@Input()`/`input()` se `employee` leta hai aur `output<number>()` se `edit` aur `delete` events emit karta hai (`this.edit.emit(this.employee.id)`). Parent template `(edit)=\"openEdit($event)\"` `(delete)=\"confirmDelete($event)\"`. Row khud koi navigation/API call nahi karta — sirf event.",
    detailedAnswer:
      "Ye 'dumb component' pattern hai: row presentational, decisions container (`EmployeeList`) me. Faayde: row har jagah reuse ho sakta hai (dashboard, search results), test karna trivial (input do, emitted events assert karo), aur business logic ek jagah. Parent `edit` par edit route/modal kholta hai, `delete` par confirm dialog + API call + list refresh. Row ko API/router ka pata bhi nahi.",
    followUp: "Agar row ko 5 alag events emit karne pade to interface kaise saaf rakhoge?",
    redFlag: "Row ke andar seedha `HttpClient` inject karke delete call karna — reusability aur testability dono khatam.",
  },
  {
    id: "evb-5",
    question: "`(click.stop)` aur `(submit)` + `.prevent` jaise event modifiers ka kya faayda hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Ye `event.stopPropagation()` / `event.preventDefault()` jaise common calls ko inline template me handle kar dete hain — method me boilerplate `$event.stopPropagation()` likhne ki zaroorat nahi.",
    detailedAnswer:
      "`(click.stop)=\"delete()\"` — click parent tak bubble nahi hoga (nested clickable rows me useful). `(submit)` ke saath reactive forms already default submit rok dete hain; template-driven me `(ngSubmit)` use hota hai jo bhi prevent karta hai. Aur modifiers: `.once`, `.self`, `.passive`. Faayda: handler method pure business logic rakhta hai, event plumbing template me visible.",
    followUp: "Nested clickable elements (row click + row ke andar delete button) me event bubbling kaise handle karoge cleanly?",
  },
];

export default questions;
