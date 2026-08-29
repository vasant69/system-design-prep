import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "template-refs-and-viewchild-1",
    question: "`<input #box />` me `#box` ka scope kya hai?",
    options: [
      "Poori application",
      "Sirf usi template me jisme wo declare hui hai — doosre components ke templates me visible nahi",
      "Sirf CSS ke liye",
      "Parent component ka template bhi",
    ],
    correctIndex: 1,
    explanation:
      "Template reference variable sirf apne hi template me usable hai. Native element par `#x` DOM element deta hai; component par `#x` uska instance (ya `exportAs` value). Class me laane ke liye `@ViewChild`/`viewChild()`.",
    difficulty: "easy",
  },
  {
    id: "template-refs-and-viewchild-2",
    question: "`@ViewChild` aur `@ContentChild` me kya farak hai?",
    options: [
      "Koi farak nahi",
      "`ViewChild` component ke apne template ke elements/children ko dekhta hai; `ContentChild` wo elements dekhta hai jo parent ne `<ng-content>` ke through project kiye",
      "`ContentChild` sirf pipes ke liye hai",
      "`ViewChild` deprecated hai",
    ],
    correctIndex: 1,
    explanation:
      "`ViewChild` = own view. `ContentChild` = projected content (jo `<ng-content>` slot me parent se aaya). Ye alag DOM regions hain — ek wrapper component apne template ka element `ViewChild` se, aur consumer ka diya content `ContentChild` se access karta hai.",
    difficulty: "medium",
  },
  {
    id: "template-refs-and-viewchild-3",
    question: "Classic `@ViewChild('box') box!: ElementRef;` kab reliably available hota hai?",
    options: [
      "`constructor` me",
      "`ngAfterViewInit` ke baad (ya `ngOnInit` me agar `{ static: true }` set ho aur element `@if`/`@for` ke bahar ho)",
      "Kabhi bhi, hamesha",
      "Sirf `ngOnDestroy` me",
    ],
    correctIndex: 1,
    explanation:
      "View render hone ke baad hi `@ViewChild` populate hota hai — yani `ngAfterViewInit`. `{ static: true }` non-conditional elements ko `ngOnInit` tak available kara deta hai. `@if`/`@for` ke andar ka element tab tak `undefined` jab tak wo condition render na karein.",
    difficulty: "medium",
  },
  {
    id: "template-refs-and-viewchild-4",
    question: "In me se kaunsa `@ViewChild` ka legitimate use hai, aur kaunsa anti-pattern?",
    options: [
      "Legitimate: `<input>` ko focus karna / 3rd-party widget init / child ka imperative method (`table.clearSelection()`). Anti-pattern: parent se `this.child().someFlag = true` set karna",
      "Sab uses legitimate hain",
      "Sab uses anti-pattern hain, kabhi use mat karo",
      "Legitimate: child ki private properties badalna. Anti-pattern: focus karna",
    ],
    correctIndex: 0,
    explanation:
      "Imperative-only kaam (focus, scroll, DOM measure, non-Angular lib init, child ka public method call) ke liye `ViewChild` sahi hai. Parent se child ki internal state set karna encapsulation todta hai aur change detection/reusability problems deta hai — uske liye `@Input`.",
    difficulty: "medium",
  },
];

export default quiz;
