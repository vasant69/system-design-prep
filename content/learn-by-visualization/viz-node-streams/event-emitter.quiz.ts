import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "event-emitter-1",
    question: "`emitter.emit('x', data)` listeners ko kaise call karta hai?",
    options: [
      "Asynchronously, agle tick pe, parallel mein",
      "Synchronously, registration order mein, ek ke baad ek — phir `emit` return karta hai",
      "Sirf sabse aakhri registered listener ko",
      "Random order mein, `setImmediate` ke through",
    ],
    correctIndex: 1,
    explanation:
      "`emit` ek simple loop hai: us event ke listeners array pe iterate karke har ek ko turant call karta hai, jis order mein wo `on()` se add hue. Sab return kar dein tab `emit` return karta hai aur agli line chalti hai. Isliye listener ke andar blocking sync kaam pure event loop ko rok deta hai. Async behaviour chahiye to listener khud `setImmediate`/`queueMicrotask` use kare.",
    difficulty: "easy",
  },
  {
    id: "event-emitter-2",
    question: "`once('data', fn)` aur `on('data', fn)` mein farak kya hai?",
    options: [
      "`once` listener ko pehle emit se pehle hi remove kar deta hai, isliye wo kabhi nahi chalta",
      "Koi farak nahi, `once` bas `on` ka alias hai",
      "`once` listener pehli baar call hone ke baad khud remove ho jaata hai; aage ke emits use skip karte hain",
      "`once` listener har emit pe chalta hai par sirf pehla return value yaad rakhta hai",
    ],
    correctIndex: 2,
    explanation:
      "`once` internally listener ko ek wrapper mein daalta hai jo call hone par pehle khud ko `removeListener` karta hai, phir asli fn chalata hai — yani exactly ek baar. `on` permanent hai jab tak manually `off()` na karo. `once` streams ke `drain`/`finish` jaise one-shot signals ke liye ideal hai.",
    difficulty: "medium",
  },
  {
    id: "event-emitter-3",
    question: "`emitter.emit('error', err)` hua aur us emitter pe koi `error` listener nahi — kya hota hai?",
    options: [
      "Kuch nahi, event silently drop ho jaata hai",
      "Sirf ek warning print hoti hai par process chalta rehta hai",
      "Node isko special-case karta hai: `err` throw hota hai aur unhandled hone par process crash kar jaata hai",
      "`emit` `false` return karta hai aur bas",
    ],
    correctIndex: 2,
    explanation:
      "EventEmitter `error` ko special treat karta hai: agar `emit('error', err)` ke time koi `error` listener registered nahi, to wo `err` ko throw kar deta hai — jo aksar uncaught hoke process exit karwa deta hai. Isliye har long-lived emitter (streams, sockets, DB clients) pe `error` listener lagana mandatory hai. Normal events pe `emit` `true`/`false` return karta hai (listener tha ya nahi).",
    difficulty: "medium",
  },
  {
    id: "event-emitter-4",
    question: "Ek hi event pe 11 listeners add karne pe Node kya karta hai aur kyun?",
    options: [
      "11th listener ko silently ignore kar deta hai",
      "`MaxListenersExceededWarning` print karta hai — probable memory leak ka hint (default limit 10)",
      "Process turant crash kar deta hai",
      "Baaki sab listeners remove karke sirf naya wala rakhta hai",
    ],
    correctIndex: 1,
    explanation:
      "Default `defaultMaxListeners` 10 hai. 11th listener pe Node stderr pe `MaxListenersExceededWarning` deta hai — ye error nahi, sirf hint hai ki shayad tum kisi loop ya route handler mein baar-baar `on()` kar rahe ho bina `off()` kiye (leak). Genuinely zyada listeners chahiye to `emitter.setMaxListeners(n)`. Listeners kaam karte rehte hain, sirf warning aati hai.",
    difficulty: "easy",
  },
];

export default quiz;
