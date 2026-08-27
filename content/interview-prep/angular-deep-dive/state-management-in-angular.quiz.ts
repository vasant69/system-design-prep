import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "state-mgmt-1",
    question: "Ek chhoti Angular app me jahan sirf 2 components ke beech ek simple cart state share karna hai, sabse honest recommendation kya hai?",
    options: [
      "Service + BehaviorSubject (ya Signals) - NgRx ki complexity yahan zaroorat nahi",
      "Turant NgRx setup karna kyunki wo 'best practice' hai",
      "Global variable use karna sabse simple hai",
      "Har component me apna alag copy of state rakhna",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - chhoti app me simple service pattern sufficient hota hai, NgRx ka boilerplate justify nahi hota. Option B galat hai - ye is topic ka core over-engineering warning hai, NgRx 'always best practice' nahi hai. Option C galat hai - global variables Angular ke DI aur change detection ke saath achhe se integrate nahi hote aur testing mushkil banate hain. Option D galat hai - alag copies rakhna hi to state ko out-of-sync kar dega, jo state management ka poora purpose defeat karta hai.",
    difficulty: "easy",
  },
  {
    id: "state-mgmt-2",
    question: "NgRx me reducer ke andar kya nahi hona chahiye?",
    options: [
      "Side effects jaise HTTP calls - reducers pure functions hone chahiye",
      "Naya state object return karna",
      "Purane state ko action ke saath combine karke naya state compute karna",
      "Immutable update logic",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - reducers strictly pure functions hone chahiye (same input se hamesha same output, koi side effect nahi); async kaam Effects me hota hai. Option B, C, aur D sab reducer ke legitimate, expected responsibilities hain - naya state return karna, state aur action ko combine karke compute karna, aur immutably update karna, ye sab exactly wahi kaam hai jo reducer ko karna chahiye.",
    difficulty: "medium",
  },
  {
    id: "state-mgmt-3",
    question: "Angular Signals aur RxJS Observables ke beech relationship ko sabse accurately kaun describe karta hai?",
    options: [
      "Signals synchronous state ke liye lightweight hain, RxJS complex async streams ke liye rehta hai - dono interoperate karte hain",
      "Signals ne RxJS ko poori tarah replace kar diya hai Angular me",
      "RxJS sirf HTTP calls ke liye hai, Signals baaki sab kuch handle karta hai",
      "Signals aur Observables bilkul same cheez hain, sirf naam alag hai",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - Signals synchronous, glitch-free state ke liye hain jabki RxJS debounce/switchMap/combineLatest jaisi complex async operations ke liye better fit hai, aur toSignal/toObservable se dono interoperate karte hain. Option B galat hai - RxJS abhi bhi zaroori hai async streams ke liye. Option C galat hai - RxJS ka use HTTP se kaafi zyada broad hai (websockets, event streams, debouncing wagera). Option D galat hai - dono ka underlying model alag hai, Signals synchronous aur pull-based hain jabki Observables push-based streams hain.",
    difficulty: "hard",
  },
  {
    id: "state-mgmt-4",
    question: "BehaviorSubject-based service pattern kab break hone lagta hai, bade apps me?",
    options: [
      "Jab state kahin se bhi mutate ho sakta hai isliye debugging aur trace karna mushkil ho jaata hai",
      "Kyunki BehaviorSubject kabhi current value hold nahi karta",
      "Kyunki async pipe BehaviorSubject ke saath kaam nahi karta",
      "Kyunki services Angular me singleton nahi hote",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - bade apps me bahut saare services/methods se state mutate hone lagta hai bina kisi enforced structure ke, isse 'state kyun change hua' trace karna mushkil ho jaata hai - yahi gap NgRx fill karta hai. Option B galat hai - BehaviorSubject ki defining property hi ye hai ki wo current value hold karta hai. Option C galat hai - async pipe BehaviorSubject/Observable dono ke saath perfectly kaam karta hai. Option D galat hai - providedIn root wali services default me singleton hi hoti hain Angular me.",
    difficulty: "medium",
  },
];

export default quiz;
