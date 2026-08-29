import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "delete-with-confirm-and-optimistic-update-1",
    question: "Production me delete confirmation ke liye `window.confirm()` kyun avoid karte hain?",
    options: [
      "Wo deprecated hai",
      "Wo JS thread block karta hai, style nahi hota, unit-test karna mushkil hai, aur native OS dialog app ke design se mismatch karta hai — ek reusable modal component better hai",
      "Wo sirf desktop par kaam karta hai",
      "Wo hamesha `true` return karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`window.confirm` synchronous blocking hai, unstyleable, aur test-unfriendly. Ek `<app-confirm-modal>` (`confirmed`/`cancelled` outputs) reusable hai (delete/discard/leave) aur design-consistent.",
    difficulty: "easy",
  },
  {
    id: "delete-with-confirm-and-optimistic-update-2",
    question: "Delete ke baad 'refetch the list' approach ka main trade-off kya hai?",
    options: [
      "Wo kabhi kaam nahi karta",
      "Simple aur hamesha server ke saath consistent, par ek extra network round-trip hota hai row hatne se pehle (aur page/count shift ho sakta hai)",
      "Wo optimistic se zyada code leta hai",
      "Wo rollback logic maangta hai",
    ],
    correctIndex: 1,
    explanation:
      "Refetch = no rollback logic, server truth. Cost: visible delay aur pagination shift. Admin CRUD me 300ms delay usually invisible, isliye ye sensible default hai.",
    difficulty: "medium",
  },
  {
    id: "delete-with-confirm-and-optimistic-update-3",
    question: "Optimistic delete implement karte waqt failure se pehle kya capture karna zaroori hai?",
    options: [
      "Kuch nahi",
      "Current state ka ek snapshot (`const snapshot = this.employees()`) — taaki DELETE fail hone par aap exact previous list (order/pagination) restore kar sako",
      "Sirf deleted item ka id",
      "Poora component re-render",
    ],
    correctIndex: 1,
    explanation:
      "Optimistic update turant local state se row hata deta hai. Fail hone par `this.employees.set(snapshot)` se rollback hota hai. Bina snapshot ke exact pichhla state (jaise ordering) recover nahi hota.",
    difficulty: "medium",
  },
  {
    id: "delete-with-confirm-and-optimistic-update-4",
    question: "Ek single row delete ke dauran loading kaise dikhana chahiye?",
    options: [
      "Poore page par ek global spinner",
      "Ek per-row `deletingId` signal — spinner sirf us row ke delete button par jab `deletingId() === emp.id`",
      "Kuch nahi dikhao",
      "Poori list ko disable kar do",
    ],
    correctIndex: 1,
    explanation:
      "Global spinner poori list blank kar deta hai ek chhoti action ke liye. `deletingId` se sirf affected button spinner dikhta hai, baaki list usable rehti hai.",
    difficulty: "easy",
  },
];

export default quiz;
