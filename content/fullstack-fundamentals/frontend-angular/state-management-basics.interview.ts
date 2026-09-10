import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "smb-1",
    question: "State rakhne wale plain service ke bajaye NgRx kab introduce karoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Jab kai feature areas same state share aur mutate karte hon, jab kai developers use touch karte hon aur enforced pattern chahiye, jab auditability / time-travel debugging chahiye, ya jab side-effect orchestration tangled ho raha ho. Chhote CRUD app ke liye signal ya BehaviorSubject service kaafi hai aur NgRx net overhead hai.",
    detailedAnswer:
      "NgRx single source of truth, strict unidirectional flow (action -> reducer -> store -> selector), memoized reads, replay ke saath devtools, aur async ke liye effects ka consistent ghar deta hai. Cost boilerplate aur indirection hai. Strong answer tipping point batata hai, NgRx ko universal best practice declare nahi karta.",
    redFlag: "'Scalability ke liye hamesha NgRx' bolna bina cost ki baat kiye.",
  },
  {
    id: "smb-2",
    question: "Signal store aur NgRx reducer dono me state updates immutable kyun hone chahiye?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Change detection aur memoized selectors reference se compare karte hain. Agar tum existing object mutate karo, reference same rehta hai, isliye OnPush components re-render skip karte hain aur selectors cached values return karte hain. Object replace karne (spread, map) se reference badalta hai aur update propagate hota hai.",
    detailedAnswer:
      "NgRx reducers contract se pure hain aur naya state object return karna zaroori hai. Signals `.update`/`.set` bhi dependents ke recompute ke liye nayi value expect karte hain. Mutation dev me default change detection ke saath chalta dikhta hai aur phir OnPush, selectors, ya `distinctUntilChanged` add karte hi toot jaata hai.",
  },
  {
    id: "smb-3",
    question: "Cart total jaise computed values store ke state me rehne chahiye? Samjhao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Unhe derive karo — signals ke liye `computed()`, NgRx ke liye `createSelector`. Derived data store karne ka matlab ab do cheezein sync me rakhni hain aur ek class ke bugs jahan wo disagree karein.",
    detailedAnswer:
      "State minimal aur normalized rakho: raw line items. Baaki sab (count, total, isEmpty, grouped views) uska function hai. Derived selectors memoized hote hain isliye cost negligible hai, aur exactly ek jagah hai jahan number galat ho sakta hai. Yahi principle filtered/sorted lists par bhi lagta hai.",
  },
];

export default questions;
