import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "eventemitter-and-custom-events-1",
    question:
      "`emitter.emit(\"go\")` ke turant baad wali line kab chalti hai?",
    options: [
      "Saare `\"go\"` listeners ke synchronously khatam hone ke baad — `emit` tab tak return nahi karta",
      "Turant, listeners ke chalne se pehle — listeners event loop ke agle tick par chalte hain",
      "Ek `setTimeout(0)` ke baad",
      "Kabhi nahi, `emit` blocking infinite hai",
    ],
    correctIndex: 0,
    explanation:
      "`emit` listeners ko synchronously, registration order mein, usi call stack par chalata hai aur sabke complete hone ke baad hi return karta hai. Isliye `emit` ke baad wali line saare listeners ke baad chalti hai. Option B ek common galatfehmi hai — `emit` deferred nahi hai. Agar defer chahiye to listener ke andar `setImmediate` khud lagana padta hai. Option C/D galat.",
    difficulty: "medium",
  },
  {
    id: "eventemitter-and-custom-events-2",
    question:
      "Ek custom `EventEmitter` `emit(\"error\", new Error(\"x\"))` karta hai aur us event ka koi listener nahi. Kya hota hai?",
    options: [
      "Kuch nahi — `emit` chupchaap `false` return karta hai",
      "Error ek log file mein chala jata hai automatically",
      "Node us `Error` ko throw kar deta hai; async context mein ye `uncaughtException` ban ke process crash kar sakta hai",
      "Error agle `emit` call tak queue ho jata hai",
    ],
    correctIndex: 2,
    explanation:
      "`\"error\"` event special-cased hai: listener na hone par emitted error throw hota hai. Sync context mein wo `emit` caller tak jata hai; async context (stream, socket) mein `uncaughtException` → crash. Isliye har error-emitting emitter par `.on(\"error\", ...)` mandatory hai. Baaki events par listener na ho to `emit` bas `false` deta hai (option A sirf non-error events ke liye sach hai).",
    difficulty: "medium",
  },
  {
    id: "eventemitter-and-custom-events-3",
    question:
      "Ek hi event par 11 listeners lagne par Node `MaxListenersExceededWarning` kyun deta hai?",
    options: [
      "Kyunki 10 se zyada listeners performance ke liye illegal hain",
      "Ye ek memory-leak detector hai — aksar galti se loop/handler ke andar `on` call ho raha hota hai bina `off` ke; genuine case mein `setMaxListeners(n)` se threshold badha sakte ho",
      "Kyunki `emit` sirf 10 listeners ko hi call kar sakta hai",
      "Ye ek error hai jo process ko rok deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Default limit 10 ek heuristic hai: itne listeners aksar ek accidental leak signal karte hain (per-request `on` bina cleanup). Warning informational hai — process nahi rukta, aur `emit` sab listeners ko call karta hai. Legit zaroorat ho to `emitter.setMaxListeners(20)` ya `0` (unlimited). Option A/C/D behaviour ko galat batate hain.",
    difficulty: "easy",
  },
  {
    id: "eventemitter-and-custom-events-4",
    question:
      "Kaunsa scenario EventEmitter ke liye best fit hai, Promise ke liye nahi?",
    options: [
      "Ek DB query ka single result aur uska error handle karna",
      "Ek file download object jo bar-bar `progress` (percent) aur ant mein `done` ya `error` report karta hai, jise UI aur logger dono sunte hain",
      "Ek config file ko ek baar padh ke parse karna",
      "Do API calls parallel chalakar dono ke results combine karna",
    ],
    correctIndex: 1,
    explanation:
      "Download progress ongoing hai — `progress` kai baar fire hota hai — aur multiple independent consumers (UI, logger) hain. Promise sirf ek baar settle hota hai, isliye repeated notifications ke liye fit nahi. Option A aur C one-shot async results hain (Promise/await). Option D `Promise.all` ka classic case hai. Multiple/ongoing + fan-out = EventEmitter ka sweet spot.",
    difficulty: "easy",
  },
];

export default quiz;
