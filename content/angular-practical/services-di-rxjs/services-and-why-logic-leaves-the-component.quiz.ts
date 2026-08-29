import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "services-and-why-logic-leaves-the-component-1",
    question: "Service me kya rakhna chahiye?",
    options: [
      "Ek component ki private UI state (jaise ek dropdown open/close flag)",
      "Non-view logic: HTTP/data access, business rules, shared app-wide state, cross-cutting helpers",
      "DOM manipulation aur `ElementRef` access",
      "View-only formatting jo ek pipe kar sakti hai",
    ],
    correctIndex: 1,
    explanation:
      "Service view se decoupled logic ke liye hai — data access, rules, shared state, helpers. DOM kaam directive/component ka, formatting pipe ka, aur ek component ki local UI state component me hi rehni chahiye.",
    difficulty: "easy",
  },
  {
    id: "services-and-why-logic-leaves-the-component-2",
    question: "`@Injectable({ providedIn: \"root\" })` ka kya matlab hai?",
    options: [
      "Service sirf root component me use ho sakti hai",
      "Service ek app-wide singleton hai (ek hi instance sab jagah) aur tree-shakeable — agar kahin inject na ho to bundle se hat jaati hai",
      "Service har component me naya instance banati hai",
      "Service ko manually `providers` array me daalna zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "`providedIn: 'root'` root injector me register karta hai — ek singleton jo poori app share karti hai — aur unused hone par tree-shaking se remove ho jaata hai. Component-level `providers` ek scoped (per-component) instance deta hai.",
    difficulty: "easy",
  },
  {
    id: "services-and-why-logic-leaves-the-component-3",
    question: "Ek business rule (`isEligibleForLeave(emp)`) ko service ke pure method me rakhne ka testing faayda kya hai?",
    options: [
      "Koi faayda nahi",
      "Use bina kisi component render/`TestBed`/DOM ke, sirf input-output se test kiya ja sakta hai — fast aur focused unit test",
      "Ye automatically e2e test ban jaata hai",
      "Rule ab template me likhna padta hai",
    ],
    correctIndex: 1,
    explanation:
      "Component me daali gayi logic ko test karne ke liye render, change detection, aur mocks chahiye. Service ka pure method ek plain function ki tarah test hota hai — `expect(service.isEligibleForLeave(emp)).toBe(true)`.",
    difficulty: "medium",
  },
  {
    id: "services-and-why-logic-leaves-the-component-4",
    question: "Do components ke beech shared state (jaise current user) rakhne ki sahi jagah kya hai?",
    options: [
      "Har component me alag copy",
      "Ek `providedIn: 'root'` service jise dono inject karein — single source of truth, signals ya BehaviorSubject se",
      "`localStorage` har render par read/write karke",
      "Ek global `window` variable",
    ],
    correctIndex: 1,
    explanation:
      "App-wide shared state ek singleton service me rakho — ek jagah update, sab consumers consistent. Signals ya `BehaviorSubject` change ko subscribers tak propagate karte hain. Per-component copies desync ho jaati hain; `window` untyped aur untestable.",
    difficulty: "medium",
  },
];

export default quiz;
