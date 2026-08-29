import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "notifications-feed-1",
    question: "Toast notifications ke liye `Subject` `BehaviorSubject` se kyun better hai?",
    options: [
      "`Subject` faster hai",
      "Toast ek fire-and-forget event hai; `BehaviorSubject`/`ReplaySubject` use karne se ek naya-mounted toast host purane (dismiss ho chuke) toasts replay kar dega",
      "`BehaviorSubject` errors nahi handle karta",
      "Dono same hain",
    ],
    correctIndex: 1,
    explanation:
      "Toast ka koi 'current value' concept nahi. `Subject` sirf future events deta hai — jo hi sahi hai. `BehaviorSubject` late subscriber ko last value replay karega (galat UX). Auth user jaise state ke liye `BehaviorSubject`/signal.",
    difficulty: "medium",
  },
  {
    id: "notifications-feed-2",
    question: "Notification feed ke polling ko tab hidden hone par pause kyun karna chahiye?",
    options: [
      "Polling kaam nahi karega",
      "Ek background tab har 30s me request bhejta rahe to server load aur user battery dono waste — `document.visibilityState` check karke pause karo, aur wapas aane par ek fresh fetch trigger karo",
      "Browser polling allow nahi karta hidden tabs me",
      "Zaroori nahi, polling hamesha chalne do",
    ],
    correctIndex: 1,
    explanation:
      "`filter(() => document.visibilityState === 'visible')` se hidden tab me polls skip hote hain. `visibilitychange` par ek immediate refetch — user ko wapas aate hi fresh data.",
    difficulty: "medium",
  },
  {
    id: "notifications-feed-3",
    question: "Unread badge count aur feed list ko drift hone se kaise rokte hain?",
    options: [
      "Dono ke liye alag API calls",
      "Ek hi store me `items` rakho aur `unread` ko `computed`/derived rakho — ek source of truth, dono kabhi mismatch nahi karte",
      "Badge ko manually har 5s update karo",
      "List se `unread` count nahi nikalte, sirf badge se",
    ],
    correctIndex: 1,
    explanation:
      "Alag sources = 'badge 3 dikha raha hai par list me 5 unread'. Ek `NotificationStore` jo `items` + `unread` (ya `unread` = derived) rakhe, badge aur list dono usse padhein.",
    difficulty: "medium",
  },
  {
    id: "notifications-feed-4",
    question: "Notification feed ke liye default transport kya hona chahiye, aur SSE/WebSocket kab?",
    options: [
      "Hamesha WebSocket",
      "Polling (`interval` + `switchMap`, hidden par paused) default — simple aur har jagah kaam karta hai; SSE tab jab server-push one-way instant chahiye; WebSocket tab jab bidirectional/low-latency (chat, presence) chahiye",
      "Hamesha SSE",
      "Sirf manual refresh button",
    ],
    correctIndex: 1,
    explanation:
      "Zyadatar notification feeds 20-60s polling se theek hain. SSE (`EventSource`, auto-reconnect, one-way) tab jab 'instant' genuine requirement ho. WebSocket sirf jab dono direction chahiye. Sabse bade hammer se shuru mat karo.",
    difficulty: "medium",
  },
];

export default quiz;
