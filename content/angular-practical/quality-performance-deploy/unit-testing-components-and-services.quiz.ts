import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "unit-testing-components-and-services-1",
    question: "Ek service ki HTTP calls ko test karne ka standard tareeka kya hai?",
    options: [
      "Real API ke against test chalao",
      "`provideHttpClientTesting()` + `HttpTestingController` — `expectOne(url)` se request assert karo, `req.flush(body)` se response do, `httpMock.verify()` se stray requests catch karo",
      "`fetch` ko globally mock karo",
      "Service ke methods ko `spyOn` karke skip karo",
    ],
    correctIndex: 1,
    explanation:
      "`HttpTestingController` real network ke bina requests intercept karta hai. Aap exact URL/method/params/body assert karte ho aur controlled responses (`flush`) ya errors (`error`) supply karte ho. `verify()` afterEach me un-flushed/unexpected requests par fail karta hai.",
    difficulty: "medium",
  },
  {
    id: "unit-testing-components-and-services-2",
    question: "Component test me ek signal `input()` ki value kaise set karte hain?",
    options: [
      "`component.employee = value`",
      "`fixture.componentRef.setInput('employee', value)` — signal inputs ko property assignment se set nahi kar sakte",
      "`fixture.setInput(value)`",
      "Constructor me pass karo",
    ],
    correctIndex: 1,
    explanation:
      "Signal inputs read-only hote hain component ke liye; `setInput()` Angular ki input-binding machinery ke through value set karta hai (aur `ngOnChanges`/dependent computeds trigger karta hai). Direct assignment kaam nahi karta.",
    difficulty: "medium",
  },
  {
    id: "unit-testing-components-and-services-3",
    question: "DOM element ko test me query karne ke liye kya use karna chahiye?",
    options: [
      "CSS class selectors (`.btn-primary`)",
      "`data-test=\"...\"` attributes — styling refactor par tests nahi tootte; class-based queries brittle hote hain",
      "Element index (`querySelectorAll('button')[2]`)",
      "`ngModel` names",
    ],
    correctIndex: 1,
    explanation:
      "`data-test` (ya `data-testid`) attributes explicitly testing ke liye hote hain, styling se decoupled. CSS class ya element-index queries UI ke chhote changes par bhi break ho jaati hain.",
    difficulty: "easy",
  },
  {
    id: "unit-testing-components-and-services-4",
    question: "Healthy Angular test suite ka rough split kya hona chahiye?",
    options: [
      "Har cheez ke liye ek heavy `TestBed` component test",
      "~60% pure-function tests (mappers, validators, reducers) + ~30% dumb-component tests (inputs -> DOM, clicks -> outputs) + ~10% smart-component/integration tests (submit, delete, error paths)",
      "Sirf e2e tests",
      "50% snapshot tests",
    ],
    correctIndex: 1,
    explanation:
      "Cheap pure-function tests bahut hone chahiye (fast, stable). Dumb components inputs->output test hote hain bina mocks. Smart-component tests heavy hote hain (many providers) — sirf critical flows ke liye kuch. Ulta pyramid slow aur brittle.",
    difficulty: "medium",
  },
];

export default quiz;
