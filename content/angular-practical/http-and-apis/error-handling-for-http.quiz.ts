import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "error-handling-for-http-1",
    question: "`HttpErrorResponse.status === 0` ka kya matlab hai?",
    options: [
      "Request successful thi",
      "Koi HTTP response mila hi nahi — network down, DNS fail, CORS block, ya offline; `err.error` ek `ProgressEvent` hota hai server body nahi",
      "Server ne 200 bheja",
      "Request abhi pending hai",
    ],
    correctIndex: 1,
    explanation:
      "`status: 0` matlab browser ko koi HTTP response mila hi nahi. Isko 'network problem' message se handle karo. 4xx client error, 5xx server error, aur 0 network — teenon alag messages deserve karte hain.",
    difficulty: "easy",
  },
  {
    id: "error-handling-for-http-2",
    question: "`retry()` kaunse requests par lagana SAHI hai?",
    options: [
      "Har request par blindly",
      "Sirf transient failures par — `5xx` aur network errors — reads (ya idempotent writes) ke liye, backoff ke saath. `4xx` retry se kuch theek nahi hota; non-idempotent `POST` retry se double records ban sakte hain",
      "Sirf `POST` par",
      "Kabhi nahi",
    ],
    correctIndex: 1,
    explanation:
      "`400`/`404`/`409` deterministic hain — retry waste hai. `5xx`/network transient ho sakte hain. Non-idempotent writes ko blind-retry karne se duplicate data. Retry + exponential/linear backoff on 5xx reads.",
    difficulty: "medium",
  },
  {
    id: "error-handling-for-http-3",
    question: "`catchError` ke callback ka return kya hona chahiye, aur search pipeline me kahan rakhein?",
    options: [
      "Plain value return karo; `switchMap` ke bahar rakho",
      "Ek Observable return karo — `of(fallback)` recover karne ke liye ya `throwError(() => normalizedError)` rethrow ke liye; search me `catchError` ko `switchMap` ke ANDAR rakho taaki ek failed query poore stream ko na maare",
      "`null` return karo; kahin bhi rakho",
      "`throw` statement use karo",
    ],
    correctIndex: 1,
    explanation:
      "`catchError` ek Observable return karta hai jo error par switch-in hota hai. Inner (`switchMap` ke andar) catch se ek query fail ho to bhi agli keystrokes kaam karti hain; outer catch poore subscription ko terminate kar deta hai.",
    difficulty: "hard",
  },
  {
    id: "error-handling-for-http-4",
    question: "Load pipeline me `finalize(() => this.loading.set(false))` `subscribe`'s `next`/`error` me manual reset ke bajaye kyun better hai?",
    options: [
      "`finalize` faster hai",
      "`finalize` next, error, AUR unsubscribe teenon par chalta hai — ek jagah, isliye error par spinner kabhi stuck nahi hota aur duplication nahi",
      "`finalize` errors ko suppress karta hai",
      "`finalize` retry trigger karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Manual `loading = false` `next` aur `error` dono me likhna padta hai (aur cancel case miss hota hai). `finalize` guaranteed cleanup deta hai — loading state reliably clear.",
    difficulty: "medium",
  },
];

export default quiz;
