import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "rxjs-and-observables-in-angular-1",
    question: "Search-as-you-type feature banate waqt, purani in-flight API call ko naye keystroke pe automatically cancel karne ke liye kaunsa operator use karoge?",
    options: [
      "mergeMap, kyunki wo sab requests ko handle kar leta hai",
      "concatMap, kyunki wo order maintain karta hai",
      "switchMap, kyunki wo naya inner observable start karte hi purana cancel kar deta hai",
      "filter, kyunki wo unwanted values ko hata deta hai",
    ],
    correctIndex: 2,
    explanation: "switchMap exactly is behavior ke liye designed hai — jab naya outer value aata hai (naya keystroke), wo purane inner observable (pending API call) ko cancel kar deta hai aur naya start karta hai. mergeMap sab ko parallel chalne deta hai bina cancel kiye, concatMap strictly order me queue karta hai — dono is use-case ke liye galat fit hain.",
    difficulty: "medium",
  },
  {
    id: "rxjs-and-observables-in-angular-2",
    question: "Observable aur Promise me ek key difference kya hai jo Promise nahi kar sakta?",
    options: [
      "Promise multiple values emit kar sakta hai, Observable nahi",
      "Observable ko subscribe karne se pehle hi execution start ho jaata hai",
      "Observable ko unsubscribe karke cancel kiya ja sakta hai, Promise ko cancel nahi kiya ja sakta",
      "Promise hamesha synchronous hota hai, Observable hamesha asynchronous",
    ],
    correctIndex: 2,
    explanation: "Observable cancellable hai — unsubscribe() call karke ek in-progress operation rok sakte ho, jaise user page chhod de to pending HTTP call cancel karna. Promise ek baar start hone ke baad cancel nahi kiya ja sakta. Multiple values emit karna Observable ki capability hai, Promise ki nahi — pehla option ulta hai.",
    difficulty: "easy",
  },
  {
    id: "rxjs-and-observables-in-angular-3",
    question: "Template me `{{ (user$ | async)?.name }}` likhne ka sabse bada fayda kya hai manual `.subscribe()` ke comparison me?",
    options: [
      "async pipe API calls ko cache kar deta hai automatically",
      "async pipe automatically subscribe aur component destroy hone pe unsubscribe kar deta hai, memory leak ka risk khatam",
      "async pipe sirf reactive forms ke saath kaam karta hai",
      "async pipe change detection ko completely disable kar deta hai",
    ],
    correctIndex: 1,
    explanation: "async pipe khud subscription lifecycle manage karta hai — component render hote hi subscribe, destroy hote hi unsubscribe. Isse developer ko manually cleanup code (ngOnDestroy me unsubscribe) likhne ki zaroorat nahi padti, jo manual subscription approach me ek common memory-leak source hai.",
    difficulty: "medium",
  },
  {
    id: "rxjs-and-observables-in-angular-4",
    question: "Ek component me `ngOnInit` ke andar `.subscribe()` manually call kiya gaya hai bina kisi cleanup ke. Component destroy hone ke baad kya problem ho sakti hai?",
    options: [
      "Kuch nahi, Angular automatically sab subscriptions clean kar deta hai",
      "Subscription zinda rehti hai aur callback fire hota rehta hai, jo memory leak aur destroyed component pe property update jaisi issues create karta hai",
      "App crash ho jayega turant",
      "Observable khud-ba-khud complete ho jayega component destroy hote hi",
    ],
    correctIndex: 1,
    explanation: "Angular automatically manual subscriptions clean nahi karta — sirf async pipe wali subscriptions auto-cleanup hoti hain. Manual .subscribe() ko explicitly unsubscribe karna padta hai (takeUntil pattern ya takeUntilDestroyed se), warna subscription zinda rehti hai aur memory leak + unexpected callback firing ho sakta hai.",
    difficulty: "medium",
  },
];

export default quiz;
