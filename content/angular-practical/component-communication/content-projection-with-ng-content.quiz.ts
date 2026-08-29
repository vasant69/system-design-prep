import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "content-projection-with-ng-content-1",
    question: "`<ng-content />` kya karta hai?",
    options: [
      "Ek HTTP request bhejta hai",
      "Parent ne component ke opening/closing tags ke beech jo markup diya, wo yahan render karta hai (default slot)",
      "Ek naya component define karta hai",
      "Child ke data ko parent me bhejta hai",
    ],
    correctIndex: 1,
    explanation:
      "`<ng-content>` content projection ka slot hai — `<app-card>...yahan ka sab...</app-card>` wrapper ke `<ng-content>` ki jagah render hota hai. Ye markup pass karne ka tareeka hai, jabki `@Input` data pass karne ka.",
    difficulty: "easy",
  },
  {
    id: "content-projection-with-ng-content-2",
    question: "Projected content ke andar `{{ employee.name }}` likha hai. Ye `employee` kiska property hai?",
    options: [
      "Wrapper (jaise Card) component ka",
      "Parent component ka — projected content parent ke context me bind hota hai, wrapper ke nahi",
      "Global scope ka",
      "Angular automatically inject karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Content projection me markup parent ke template ka hissa hai; wo parent ke scope me evaluate hota hai. Wrapper sirf position deta hai. Isliye `employee` parent ka hona chahiye, Card ka nahi.",
    difficulty: "medium",
  },
  {
    id: "content-projection-with-ng-content-3",
    question: "`<ng-content select=\"[panelActions]\" />` aur ek default `<ng-content />` dono hain. Consumer ka `<div panelActions>` aur ek `<p>` diya. Kya hoga?",
    options: [
      "Dono default slot me jaayenge",
      "`<div panelActions>` named slot me jaayega; `<p>` (jo kisi select se match nahi karta) default `<ng-content>` me jaayega",
      "Sab kuch drop ho jaayega",
      "Error aayega",
    ],
    correctIndex: 1,
    explanation:
      "Named `select` se matching content us slot me route hota hai; baaki (unmatched) default `<ng-content>` me. Agar koi default slot na ho to unmatched content drop ho jaata hai.",
    difficulty: "medium",
  },
  {
    id: "content-projection-with-ng-content-4",
    question: "Content projection kis situation ke liye best-fit hai?",
    options: [
      "Ek number ko double karne ke liye",
      "Reusable wrapper/container components (card, panel, modal, form-field) jinhe consumer ka arbitrary markup andar render karna hai",
      "HTTP interceptors banane ke liye",
      "Route guards ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Content projection 'composition over configuration' hai — wrapper layout/style/behaviour deta hai, consumer content. Card, panel, dialog, tabs, accordion, empty-state — sab isi pattern par bante hain. Data transforms ke liye `@Input`/`computed`, HTTP/routing ke liye services/guards.",
    difficulty: "easy",
  },
];

export default quiz;
