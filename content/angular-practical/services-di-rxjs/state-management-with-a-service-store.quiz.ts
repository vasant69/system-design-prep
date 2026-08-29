import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "state-management-with-a-service-store-1",
    question: "Ek 'hovered row index' jaisi UI state kahan rehni chahiye?",
    options: [
      "App-wide global store me",
      "Us component ke local signal me — sirf ek component ko chahiye, isliye lowest level",
      "URL query params me",
      "Backend par",
    ],
    correctIndex: 1,
    explanation:
      "State ko lowest level par rakho jahan wo kaam karta hai. Hover/toggle/local draft = component signal. Sirf jab 3+ components share karein tab feature store, aur poori app ko chahiye tab hi root store.",
    difficulty: "easy",
  },
  {
    id: "state-management-with-a-service-store-2",
    question: "Ek signal-based service store ka safe shape kya hai?",
    options: [
      "Ek public writable signal jise koi bhi `set` kar sake",
      "Ek private state `signal`, read-only selectors (`computed`), aur explicit update methods (`setSearch`, `load`) jo immutably update karein",
      "Har component me alag copy",
      "Sab kuch `localStorage` me",
    ],
    correctIndex: 1,
    explanation:
      "Single source of truth (private signal), read-only bahar (computed selectors), aur controlled mutations (methods) — yehi predictable state management ka core hai, chahe signal store ho ya NgRx.",
    difficulty: "medium",
  },
  {
    id: "state-management-with-a-service-store-3",
    question: "Feature store ko route ke `providers` me rakhne ka kya faayda hai?",
    options: [
      "Wo faster load hota hai",
      "Store route enter par create aur route exit par destroy ho jaata hai — per-feature lifecycle, fresh state next visit, koi manual cleanup nahi",
      "Wo automatically NgRx ban jaata hai",
      "Wo SSR me hi kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Route-level `providers` ek scoped injector deta hai jo route ke saath jeeta aur marta hai. Employees area chhodne par `EmployeesStore` destroy — agli visit par saaf state, bina `ngOnDestroy` cleanup ke.",
    difficulty: "medium",
  },
  {
    id: "state-management-with-a-service-store-4",
    question: "NgRx (ya koi formal store library) kab justify hoti hai?",
    options: [
      "Har Angular app me, best practice hai",
      "Jab kai features ek complex shared state ko mutate karein, time-travel/devtools/effect-middleware chahiye, ya badi team ko ek enforced pattern chahiye — chhote/medium apps me signal stores usually kaafi",
      "Jab app me 2 se zyada components hon",
      "Kabhi nahi, wo deprecated hai",
    ],
    correctIndex: 1,
    explanation:
      "NgRx structure + devtools + ecosystem deta hai, par boilerplate aur learning curve ke saath. Zyadatar EMS-size apps ke liye per-feature signal stores + ek chhota root store enough hai. Sabse bade hammer se shuru mat karo.",
    difficulty: "medium",
  },
];

export default quiz;
