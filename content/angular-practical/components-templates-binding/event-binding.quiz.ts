import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "event-binding-1",
    question: "`(click)=\"save()\"` me data kis direction me flow karta hai?",
    options: [
      "Class se view ki taraf",
      "View se class ki taraf — user action class ke method ko trigger karta hai",
      "Dono taraf",
      "Kahin nahi, ye sirf CSS ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "Event binding one-way view-to-class hai: DOM/component event fire hone par template statement (class method) chalti hai. Interpolation aur property binding uska ulta (class-to-view) hain. Two-way alag syntax `[( )]`.",
    difficulty: "easy",
  },
  {
    id: "event-binding-2",
    question: "`(input)=\"onSearch($event)\"` me `$event` kya hota hai?",
    options: [
      "Input ki value directly (string)",
      "Ek DOM `Event` object — value nikaalne ke liye `($event.target as HTMLInputElement).value`",
      "Component ka instance",
      "Hamesha `null`",
    ],
    correctIndex: 1,
    explanation:
      "Native DOM events me `$event` ek `Event` object hota hai; text input ki value `event.target.value` se milti hai (strict TS me cast chahiye). Sirf component `@Output` me `$event` seedha emitted payload hota hai. Option A tab hota agar Angular auto-unwrap karta (nahi karta).",
    difficulty: "medium",
  },
  {
    id: "event-binding-3",
    question: "Template statement me kya allowed NAHI hai?",
    options: [
      "Method call jaise `save()`",
      "Assignment jaise `showMenu = !showMenu`",
      "`count++`, `new Foo()`, bitwise operators",
      "`;` se do statements chain karna",
    ],
    correctIndex: 2,
    explanation:
      "Template statements method calls, assignments, aur `;` chaining allow karte hain, par `++`/`--`, `new`, bitwise, aur complex expressions nahi — wo logic class me jaani chahiye. Options A, B, D sab allowed hain.",
    difficulty: "medium",
  },
  {
    id: "event-binding-4",
    question: "`(keyup.enter)=\"add()\"` kya karta hai?",
    options: [
      "Har keyup par `add()` chalata hai",
      "Sirf tab `add()` chalata hai jab Enter key release ho — Angular ka key modifier",
      "Enter key ko disable kar deta hai",
      "Sirf forms ke andar kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`.enter` ek key modifier hai; Angular filter karta hai aur handler sirf Enter par chalata hai — manual `if (e.key === 'Enter')` ki zaroorat nahi. Aise hi `.escape`, `.arrowdown`, aur combos `.control.shift.z`.",
    difficulty: "easy",
  },
];

export default quiz;
