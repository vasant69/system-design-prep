import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "bip-1",
    question: "Pipe kya hai? Kuch common built-in pipes batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Pipe ek template-level transform hai jo display ke liye value ko format karta hai — `{{ value | pipe:args }}`. Common: `date`, `currency`, `number`, `percent`, `uppercase`/`lowercase`/`titlecase`, `slice`, `json`, `keyvalue`, `async`.",
    detailedAnswer:
      "Pipes formatting logic ko component se template me shift karte hain, taaki component sirf raw data rakhe. `date`/`currency`/`number`/`percent` locale-aware hain (`LOCALE_ID`). `async` special hai — Observable/Promise subscribe karta hai. Standalone components me pipe ko `imports` me lena padta hai (`DatePipe` etc. ya `CommonModule`). Args `:` se, chaining allowed (`{{ x | slice:0:10 | uppercase }}`).",
    followUp: "`date` pipe ko timezone ke saath kaise use karte ho?",
  },
  {
    id: "bip-2",
    question: "Pure aur impure pipe me kya farak hai? Default kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Pure (default): pipe sirf tab re-run hota hai jab input ki reference/primitive value badle — Angular result memoize karta hai. Impure (`pure: false`): har change-detection cycle me run hota hai, chahe input same ho.",
    detailedAnswer:
      "Pure pipe fast hai kyunki wo change detection me practically free rehta hai jab tak input identity same. Isliye object/array ko in-place mutate karne par pure pipe update nahi hota (reference same). Impure pipe har CD par chalta hai — `async` pipe internally impure-jaisa hai (naye emissions ke liye), aur kuch legacy `slice`/`keyvalue` scenarios. Custom impure pipe likhna rare aur risky — har CD par heavy work = janky UI. Zyadatar 'mujhe impure chahiye' ka matlab hota hai logic component/`computed` me honi chahiye.",
    followUp: "`async` pipe pure hai ya impure, aur wo naye values kaise deliver karta hai?",
  },
  {
    id: "bip-3",
    question:
      "Ek team `{{ orders | filterPending | sortByDate }}` jaise pipes use kar rahi hai lists ke liye. Kya problem hai aur kya suggest karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Pure pipes list ko tabhi re-filter karenge jab array reference badle — items ke andar change miss ho sakta hai. Impure banao to har CD cycle me poora filter+sort — bade lists par slow. Filtering/sorting ko component state me le jao: `pending = computed(() => orders().filter(...).sort(...))`.",
    detailedAnswer:
      "Angular official guidance: filtering aur sorting pipes se mat karo. Reasons: (1) pure pipe reference-based memoization list mutations ke saath galat behave karta hai; (2) impure pipe = O(n log n) har change detection par, poore app ke liye; (3) logic template me chhup jaati hai, test karna mushkil. Sahi jagah: component me `computed()` signals (`filtered = computed(() => ...)`), ya server-side filtering/sorting (bade datasets ke liye). Pipe sirf single-value formatting ke liye rakho.",
    followUp: "Server-side filtering par switch karne ka decision kis dataset size par ldoge?",
    redFlag: "'Impure pipe bana do, kaam ho jaayega' — perf cost aur maintainability dono ignore.",
  },
  {
    id: "bip-4",
    question:
      "Same observable ko template me teen jagah `| async` kiya hai aur network tab me teen HTTP calls dikhte hain. Kyun aur fix?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Har `| async` ek alag subscription banata hai; HttpClient ka observable cold hai, to har subscription ek nayi request fire karta hai. Fix: `shareReplay(1)`, ya ek `computed`/`toSignal` me convert karke ek hi source share karo, ya `@if (data$ | async; as data)` se ek baar subscribe karke `data` reuse karo.",
    detailedAnswer:
      "Cold observable = har subscriber ke liye producer dobara chalta hai. `| async` x3 = 3 subscribers = 3 GETs. Options: (1) `data$ = this.http.get(...).pipe(shareReplay({ bufferSize: 1, refCount: true }))`; (2) `data = toSignal(this.http.get(...))` aur template me `data()` (signal, single source); (3) template me ek wrapper `@if (data$ | async; as d) { ...d... }` aur andar `d` ko teeno jagah use karo. Modern preference: `toSignal` ya ek `computed` store.",
    followUp: "`shareReplay` me `refCount: true` kyun important hai leak avoid karne ke liye?",
  },
  {
    id: "bip-5",
    question: "`currency` pipe `$` dikha raha hai jabki app Indian hai. Kya missing hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Default `LOCALE_ID` `en-US` hai. Indian formatting ke liye `registerLocaleData(localeEnIn)` call karo (usually `main.ts`/config me) aur `{ provide: LOCALE_ID, useValue: 'en-IN' }` provide karo. Phir `currency:'INR'` `₹` aur Indian digit grouping deta hai.",
    detailedAnswer:
      "Angular locale-specific formatting data on-demand load karta hai. `en-US` built-in hai; baaki locales ke liye `@angular/common/locales/en-IN` import karke `registerLocaleData` se register karna padta hai. `LOCALE_ID` provider `date`/`number`/`currency`/`percent` sab ke default ko drive karta hai. `currency:'INR':'symbol'` explicitly INR force karta hai; symbol `₹`, grouping `1,23,456.00` (Indian) locale se aata hai. i18n builds me `LOCALE_ID` build-time set hota hai.",
    followUp: "Multi-locale app me user apni locale switch kar sake — architecture kaisa rakhoge?",
  },
];

export default questions;
