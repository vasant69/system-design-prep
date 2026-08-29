import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "subject-and-behaviorsubject-1",
    question: "`Subject` ke baare me kaunsa statement sahi hai?",
    options: [
      "Wo sirf ek Observable hai",
      "Wo Observable bhi hai aur observer bhi — aap `next(v)` se values push kar sakte ho, aur log subscribe kar sakte hain; hot aur multicast",
      "Wo values ko cache karta hai permanently",
      "Wo sirf HTTP responses ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "Subject dono roles nibhata hai: producer (`next`) aur stream (`subscribe`). Sab subscribers ek hi execution share karte hain (multicast/hot). Plain Subject late subscriber ko purani values replay nahi karta.",
    difficulty: "easy",
  },
  {
    id: "subject-and-behaviorsubject-2",
    question: "`Subject` aur `BehaviorSubject` me core farak?",
    options: [
      "`BehaviorSubject` faster hai",
      "`BehaviorSubject` ek initial value leta hai, ek 'current value' hold karta hai, aur naye subscriber ko wo turant deta hai; plain `Subject` sirf subscribe ke baad wali values deta hai",
      "`Subject` deprecated hai",
      "`BehaviorSubject` multicast nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "`BehaviorSubject` = Subject + 'latest value' memory (+ synchronous `.value`). Isliye wo state ke liye ideal hai — koi bhi late subscriber ko current state milta hai. Plain `Subject` events ke liye (jinka koi 'current' nahi).",
    difficulty: "easy",
  },
  {
    id: "subject-and-behaviorsubject-3",
    question: "Ek service me shared state ko expose karne ka safe pattern kya hai?",
    options: [
      "`public data$ = new Subject()` — sab direct next() kar sakein",
      "`private _data$ = new BehaviorSubject(init)` aur `public data$ = this._data$.asObservable()` + update methods — consumers read-only stream paate hain, sirf service push karti hai",
      "State ko ek plain public array me rakho",
      "Har component me alag Subject",
    ],
    correctIndex: 1,
    explanation:
      "Private subject + `.asObservable()` se consumers subscribe to kar sakte hain par `next()` nahi — single source of truth aur controlled mutations. Public subject se koi bhi state corrupt kar sakta hai.",
    difficulty: "medium",
  },
  {
    id: "subject-and-behaviorsubject-4",
    question: "Ek toast/notification event system ke liye `Subject` ya `BehaviorSubject`?",
    options: [
      "`BehaviorSubject` — taaki naya toast-host purane toasts bhi dikhaye",
      "`Subject` — toast ek event hai, koi 'current toast' concept nahi; naya toast-host ko purane (dismiss ho chuke) toasts replay nahi hone chahiye",
      "Dono galat, plain array use karo",
      "Farak nahi padta",
    ],
    correctIndex: 1,
    explanation:
      "Toast ek fire-and-forget event hai. `BehaviorSubject`/`ReplaySubject` use karne se ek late-mounted host purane toasts replay kar dega — galat UX. Auth user / filters jaise state ke liye `BehaviorSubject` sahi hai.",
    difficulty: "medium",
  },
];

export default quiz;
