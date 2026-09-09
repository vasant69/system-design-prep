import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "promise-combinators-1",
    question:
      "`Promise.all([p1, p2, p3])` jahan `p2` reject hota hai `p1`/`p3` se pehle — result?",
    options: [
      "Ek array `[v1, undefined, v3]`",
      "`p2` ke reason se turant reject; `p1`/`p3` ke results discard (wo phir bhi complete hote hain, unke settlements ignore)",
      "`allSettled` jaisa array of statuses",
      "Wait karta hai jab tak teeno settle na ho, phir reject",
    ],
    correctIndex: 1,
    explanation:
      "`Promise.all` fail-fast hai: pehla rejection aate hi returned promise us reason se reject ho jata hai, baaki ke settle hone ka wait kiye bina. `p1`/`p3` background mein complete to ho jate hain par unki values kahin nahi milti. Agar tum sabka outcome chahte ho fail hone pe bhi, to `allSettled` use karo.",
    difficulty: "easy",
  },
  {
    id: "promise-combinators-2",
    question:
      "'Jo pehle SUCCESS de use lo, failures ignore karo, sab fail ho tabhi error' — kaunsa combinator?",
    options: [
      "`Promise.race`",
      "`Promise.all`",
      "`Promise.any`",
      "`Promise.allSettled`",
    ],
    correctIndex: 2,
    explanation:
      "`Promise.any` pehle fulfilment pe settle hota hai aur rejections ko tab tak ignore karta hai; sab reject ho to `AggregateError` (`.errors` array ke saath). `Promise.race` galat hoga kyunki wo pehle settle pe rukta hai — agar sabse fast promise reject hua to `race` reject kar dega. `all`/`allSettled` 'pehla success' semantics nahi dete.",
    difficulty: "medium",
  },
  {
    id: "promise-combinators-3",
    question:
      "`Promise.allSettled([ok, fail])` resolve hota hai — value kaisi dikhti hai?",
    options: [
      "`[okValue, failReason]`",
      "`[{ status: 'fulfilled', value: ... }, { status: 'rejected', reason: ... }]`",
      "Reject hota hai `fail` ke reason se",
      "`[okValue]` sirf — rejected entries skip",
    ],
    correctIndex: 1,
    explanation:
      "`allSettled` kabhi reject nahi karta; har input ke liye ek object deta hai — fulfilled ke liye `{ status: 'fulfilled', value }`, rejected ke liye `{ status: 'rejected', reason }`. Isliye tumhe har call ka result AUR failure dono milte hain, ek jagah. Best-effort dashboards aur bulk operations ke liye ideal.",
    difficulty: "medium",
  },
  {
    id: "promise-combinators-4",
    question: "`Promise.all` ka sabse typical sahi use kaunsa?",
    options: [
      "Ek search box pe API calls debounce karna",
      "Ek page ke liye zaroori 4 independent API calls parallel fire karke sabke aane pe render karna",
      "Ek promise ko timeout dena",
      "Retry logic banana",
    ],
    correctIndex: 1,
    explanation:
      "`Promise.all` tab jab tumhe SAARE results chahiye aur wo independent hain — 4 calls ek saath, total time = sabse slow wali. Timeout ke liye `Promise.race([task, timeoutPromise])`. Debounce aur retry combinators ka kaam nahi. Dhyaan: `all` mein koi ek fail to poora fail, isliye partial-OK cases mein `allSettled`.",
    difficulty: "easy",
  },
];

export default quiz;
