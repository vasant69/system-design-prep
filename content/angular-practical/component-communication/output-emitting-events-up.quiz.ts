import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "output-emitting-events-up-1",
    question: "Child se parent ko kuch batane ke liye kya use karte hain?",
    options: [
      "Ek `@Input()`",
      "Ek `@Output()` / `output()` jo `emit(payload)` karta hai, aur parent `( )` event binding se sunta hai",
      "Parent ka method directly call karke",
      "`localStorage`",
    ],
    correctIndex: 1,
    explanation:
      "Output child -> parent one-way notification hai. Child `this.x.emit(value)` karta hai; parent `<app-child (x)=\"handler($event)\">` se sunta hai jahan `$event` emitted value hoti hai. Directly parent method call karna coupling badha deta hai.",
    difficulty: "easy",
  },
  {
    id: "output-emitting-events-up-2",
    question: "`EventEmitter` actually kya hai?",
    options: [
      "Ek Angular-specific class jo RxJS se alag hai",
      "RxJS `Subject` ki ek subclass — isliye legacy code me `.subscribe()` dikh sakta hai, par templates me sirf `( )` binding use karni chahiye",
      "Ek Promise wrapper",
      "Ek signal",
    ],
    correctIndex: 1,
    explanation:
      "`EventEmitter<T>` `Subject<T>` extend karta hai. Iska matlab technically subscribe/pipe ho sakta hai, par uska intended use sirf `@Output` template events hai. `output()` function ye Subject-baggage hatata hai.",
    difficulty: "medium",
  },
  {
    id: "output-emitting-events-up-3",
    question: "Output ka naam `onDelete` rakhna aur `(onDelete)` se bind karna — kya sahi hai?",
    options: [
      "Haan, `on` prefix recommended hai",
      "Nahi — convention hai output ko action/event ki tarah name dena (`delete`) aur `(delete)` se bind karna; `on` prefix redundant aur `(onDelete)` padhne me ajeeb",
      "Farak nahi padta",
      "`on` prefix sirf lifecycle hooks ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "Angular style guide: output naam ek noun/verb ho (`save`, `delete`, `pageChange`). Bind karte waqt `(delete)` natural padhta hai. `xChange` naam two-way `[(x)]` enable karta hai. `on`-prefixed output ek common code-smell hai.",
    difficulty: "easy",
  },
  {
    id: "output-emitting-events-up-4",
    question: "Ek reusable `EmployeeRow` ke `delete` button me hi `HttpClient.delete(...)` call karna kyun galat design hai?",
    options: [
      "HttpClient rows me inject nahi ho sakta",
      "Row ab ek specific API, error handling, aur confirm flow se coupled ho gaya — wo dashboard/search/report me reuse nahi ho sakta. Sahi: row `delete.emit(id)` karein, parent (jo context jaanta hai) API call karein",
      "Ye slow hota hai",
      "`delete` ek reserved word hai",
    ],
    correctIndex: 1,
    explanation:
      "Dumb/presentational components context-agnostic rehne chahiye. Row sirf 'delete pressed for id X' emit karein; parent decide karein confirm dialog, optimistic update, API endpoint, aur refresh. Isse ek row component har list screen me reuse hota hai.",
    difficulty: "medium",
  },
];

export default quiz;
