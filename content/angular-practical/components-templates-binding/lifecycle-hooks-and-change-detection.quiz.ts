import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lifecycle-hooks-and-change-detection-1",
    question: "`constructor` aur `ngOnInit` me kya farak hai — component me API call kahan karni chahiye?",
    options: [
      "Dono same hain, kahin bhi call karo",
      "`constructor` sirf dependency injection ke liye; `ngOnInit` tab chalta hai jab inputs set ho chuke hote hain — API call `ngOnInit` me",
      "`ngOnInit` `constructor` se pehle chalta hai, isliye API call constructor me",
      "API call `ngAfterViewInit` me hi honi chahiye",
    ],
    correctIndex: 1,
    explanation:
      "`constructor` Angular ki wiring se pehle chalta hai — `@Input` values abhi nahi milti, aur constructor side-effects testing hard karte hain. `ngOnInit` ek baar, inputs ready hone ke baad — initial data fetch/setup yahan. Option C ulta hai; option D unnecessary (view ready hone ka wait data fetch ke liye zaroori nahi).",
    difficulty: "easy",
  },
  {
    id: "lifecycle-hooks-and-change-detection-2",
    question: "Default change detection strategy me CD cycle kis wajah se trigger hota hai?",
    options: [
      "Sirf jab aap manually `detectChanges()` call karo",
      "zone.js browser ke async APIs (events, setTimeout, Promise, XHR) ko patch karta hai; inme se koi complete ho to Angular poore component tree ko check karta hai",
      "Har 16 milliseconds par ek fixed timer se",
      "Sirf route change par",
    ],
    correctIndex: 1,
    explanation:
      "Default me zone.js async operations ke complete hone par Angular ko notify karta hai, aur Angular root se leaf tak sabhi components ke bound expressions check karta hai. Manual `detectChanges()` bhi possible hai par primary trigger zone hai. Fixed timer ya sirf-route-change galat.",
    difficulty: "medium",
  },
  {
    id: "lifecycle-hooks-and-change-detection-3",
    question: "Ek `OnPush` component kab check hota hai?",
    options: [
      "Kabhi nahi — OnPush ka matlab component freeze",
      "Har CD cycle me, Default ki tarah",
      "Jab: `@Input` ki reference badle, component ke andar event fire ho, consumed signal badle, `async` pipe emit karein, ya `markForCheck()` call ho",
      "Sirf `ngOnInit` par ek baar",
    ],
    correctIndex: 2,
    explanation:
      "OnPush component ko in specific triggers par hi dirty maana jaata hai, isliye baaki cycles me wo (aur uska subtree) skip ho jaata hai — bade apps me bada perf win. Option A/B/D galat: OnPush update hota hai, bas triggers restricted hain.",
    difficulty: "medium",
  },
  {
    id: "lifecycle-hooks-and-change-detection-4",
    question: "`ngOnDestroy` me subscription unsubscribe karna kyun zaroori hai?",
    options: [
      "Warna component ka HTML DOM me reh jaata hai",
      "Long-lived observables (route params, stores, websockets, intervals) callbacks chalate rehte hain aur destroyed component instance ko memory me rokte hain — memory leak aur duplicate work",
      "Angular error throw karta hai agar unsubscribe na karo",
      "Sirf performance metrics ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Agar observable component se lambi life rakhta hai, to bina unsubscribe ke subscription active rehti hai — GC component ko collect nahi kar paata, aur callback bar-bar chalta hai (jaise har navigation par ek naya interval). `takeUntilDestroyed()` ya `async` pipe isse automatically handle karte hain. Angular khud error nahi deta — leak silent hota hai.",
    difficulty: "hard",
  },
];

export default quiz;
