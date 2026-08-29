import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "filtering-and-debounced-search-1",
    question: "Debounced search pipeline me `debounceTime` aur `switchMap` dono kyun chahiye?",
    options: [
      "Sirf `debounceTime` kaafi hai",
      "`debounceTime` typing pause ka wait karta hai (kam requests); `switchMap` naye query par purani in-flight request cancel karta hai (no stale results). Dono alag problems solve karte hain",
      "`switchMap` debounce bhi karta hai",
      "Dono same kaam karte hain, ek redundant hai",
    ],
    correctIndex: 1,
    explanation:
      "`debounceTime` sirf frequency kam karta hai; agar do requests fir bhi overlap ho jaayein to slow purani nayi ke baad aa sakti hai. `switchMap` us race ko fix karta hai — latest wins.",
    difficulty: "medium",
  },
  {
    id: "filtering-and-debounced-search-2",
    question: "Search me `mergeMap` use karne se kya bug aata hai?",
    options: [
      "Requests slow ho jaati hain",
      "Purani requests cancel nahi hoti — ek slow purani response nayi ke baad aake galat (stale) results dikha deti hai",
      "Search box freeze ho jaata hai",
      "URL update nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "`mergeMap` sab requests parallel chalne deta hai. Agar 'aa' ki request 'aar' ki request se baad me return kare, to user ko 'aa' ke results dikhenge. `switchMap` purani ko cancel kar deta hai.",
    difficulty: "medium",
  },
  {
    id: "filtering-and-debounced-search-3",
    question: "Paginated list par client-side filtering (loaded array ko `computed` se filter karna) kyun galat hai?",
    options: [
      "Client-side filtering hamesha galat hai",
      "Aap sirf current page ke 20 rows filter kar rahe ho, poore dataset ke nahi — filter server ko `?search=` param se bhejna chahiye",
      "`computed` slow hai",
      "Filtering sirf backend kar sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "Server-side pagination me client ke paas sirf ek page hota hai. Us page ko client-side filter karne ka matlab hai 20 rows me se filter — baaki 800 rows ignore. Filter server par hona chahiye.",
    difficulty: "medium",
  },
  {
    id: "filtering-and-debounced-search-4",
    question: "Filter change par `router.navigate([], { ..., replaceUrl: true })` kyun?",
    options: [
      "Faster navigation",
      "Har keystroke/filter change ek nayi history entry na banaye — warna user ko search se bahar aane ke liye back button bahut baar dabana padta hai; `replaceUrl` current entry update karta hai",
      "Query params encode karne ke liye",
      "Guards skip karne ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Debounce ke saath `replaceUrl: true` matlab ek search session ~ek meaningful history entry. Bina iske browser history search noise se bhar jaati hai aur back button useless ho jaata hai.",
    difficulty: "medium",
  },
];

export default quiz;
