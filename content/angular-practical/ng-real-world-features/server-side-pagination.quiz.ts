import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "server-side-pagination-1",
    question: "Server-side pagination me API response me kya hona zaroori hai 'Page X of Y' dikhane ke liye?",
    options: [
      "Sirf `items` array",
      "`items` ke saath ek `total` count (`Paged<T> = { items, total, page, pageSize }`) — `totalPages = Math.ceil(total / pageSize)`",
      "Ek `nextPageUrl` string",
      "Har row par ek `pageNumber` field",
    ],
    correctIndex: 1,
    explanation:
      "`total` ke bina aap total pages calculate nahi kar sakte. Offset pagination `total` return karta hai; cursor pagination `nextCursor` deta hai par 'page X of Y' nahi dikha sakta.",
    difficulty: "easy",
  },
  {
    id: "server-side-pagination-2",
    question: "Filter/search change hone par `page` ko 1 par reset kyun karna chahiye?",
    options: [
      "Performance ke liye",
      "User page 7 par ho sakta hai; naye filter ke sirf 2 pages hon to page 7 empty aayega aur user ko lagega 'no results' jabki data hai",
      "URL saaf rakhne ke liye",
      "Reset zaroori nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Filter result-set ka size badalta hai. Current high page naye (chhote) result-set me out of range ho sakta hai. Isliye koi bhi filter/search/sort change par `page: 1`.",
    difficulty: "medium",
  },
  {
    id: "server-side-pagination-3",
    question: "Page/query signal ko `switchMap` se drive karne ka faayda kya hai?",
    options: [
      "Requests parallel chalti hain",
      "Naya page/query aane par purani in-flight request cancel ho jaati hai — fast Next clicks par stale page render nahi hota",
      "Response cache ho jaata hai",
      "Retry automatic ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`switchMap` latest-wins hai. Bina iske page 4 ki response page 5 ke baad aake galat rows dikha sakti hai. `switchMap` purani request cancel karke sirf latest ka result render karta hai.",
    difficulty: "medium",
  },
  {
    id: "server-side-pagination-4",
    question: "Client-side pagination (poora data laake array slice karna) kab acceptable hai?",
    options: [
      "Hamesha, simplest hai",
      "Sirf jab dataset chhota aur bounded ho (jaise 200 rows) jise aap comfortably ek baar load kar sakein — bade lists ke liye first render aur memory dono suffer karte hain",
      "Kabhi nahi",
      "Sirf jab API pagination support na kare",
    ],
    correctIndex: 1,
    explanation:
      "Chhoti fixed lists (dropdown options, ek chhota lookup table) me client-side slicing theek hai — instant page switches, trivial code. 10,000+ rows ke liye server-side pagination zaroori hai.",
    difficulty: "medium",
  },
];

export default quiz;
