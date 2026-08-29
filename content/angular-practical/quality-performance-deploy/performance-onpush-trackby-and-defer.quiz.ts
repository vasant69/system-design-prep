import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "performance-onpush-trackby-and-defer-1",
    question: "Angular app 'slow' hai. Pehla kaam kya?",
    options: [
      "Har component me change detection detach kar do",
      "Measure karo — Angular DevTools Profiler / Chrome Performance tab se actual bottleneck dhoondho; guess-based optimization aksar cheezein todta hai",
      "OnPush hata do",
      "Poore app ko lazy load kar do",
    ],
    correctIndex: 1,
    explanation:
      "Profile pehle. 90% baar cause hota hai: ek template function call jo har CD cycle me chal raha, ek `@for` bina proper `track`, ya ek giant list bina pagination. Blindly detach CD karna bugs deta hai.",
    difficulty: "easy",
  },
  {
    id: "performance-onpush-trackby-and-defer-2",
    question: "Template me `{{ getActiveCount(employees) }}` (ek function call) rakhne ka performance problem kya hai?",
    options: [
      "Kuch nahi, ye normal hai",
      "Ye har change-detection cycle me chalta hai — busy screen par kai baar per second — silent repeated work. `computed()` / getter / pure pipe me nikalo",
      "Ye compile nahi hoga",
      "Function calls sirf events me allowed hain",
    ],
    correctIndex: 1,
    explanation:
      "Template expressions har CD cycle me re-evaluate hote hain. Ek function ya impure pipe wahan repeated computation hai. `computed(() => ...)` sirf tab recompute karta hai jab dependencies badlein — memoized.",
    difficulty: "medium",
  },
  {
    id: "performance-onpush-trackby-and-defer-3",
    question: "`@defer` block kya karta hai?",
    options: [
      "Ek delay add karta hai render me",
      "Us block ka code (aur dependencies) ek alag chunk me daal deta hai jo ek trigger par (`on viewport`/`idle`/`interaction`/`hover`/`timer`/`when`) load aur render hota hai — heavy below-the-fold sub-trees ke liye",
      "Change detection disable karta hai",
      "Ek route lazy load karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`@defer` template-level code-splitting hai. Chart, rich editor, comments section jaise heavy cheezein jinhe user shayad na dekhe — unhe `@defer (on viewport)` me daalo, `@placeholder`/`@loading`/`@error` ke saath.",
    difficulty: "medium",
  },
  {
    id: "performance-onpush-trackby-and-defer-4",
    question: "OnPush component ka biggest requirement kya hai state ke baare me?",
    options: [
      "State hamesha `any` type ka ho",
      "State immutable treat karo (reference replace karo, mutate nahi) ya signals use karo — warna OnPush component stale view dikha hai",
      "State sirf strings me ho",
      "State ko `localStorage` me rakho",
    ],
    correctIndex: 1,
    explanation:
      "OnPush component `@Input` reference change / event / signal change par hi update hota hai. `arr.push(x)` reference nahi badalta -> no update. Immutable updates ya signals (jinke saath OnPush automatically correct hai) zaroori hain.",
    difficulty: "medium",
  },
];

export default quiz;
