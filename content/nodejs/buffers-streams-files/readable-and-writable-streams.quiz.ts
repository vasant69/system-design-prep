import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "readable-and-writable-streams-1",
    question: "Readable stream ke paused aur flowing mode mein kya farak hai?",
    options: [
      "Paused mode mein stream band hota hai; flowing mode mein khula",
      "Paused mode mein tum `.read()` se data pull karte ho; flowing mode mein stream `'data'` events ke through tum par data push karta hai",
      "Paused mode sirf binary ke liye, flowing sirf text ke liye",
      "Flowing mode slower hai kyunki wo har chunk ko validate karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Paused (pull) — default state; data tab tak nahi aata jab tak tum `.read()` call na karo. Flowing (push) — stream source ki speed pe `'data'` events emit karta hai. Stream flowing mein jaata hai jab tum `.on('data')` lagao, `.pipe()` karo, ya `.resume()` call karo; `.pause()` wapas paused. Option A/C/D galat concepts hain.",
    difficulty: "easy",
  },
  {
    id: "readable-and-writable-streams-2",
    question: "`writable.write(chunk)` ka boolean return value kya batata hai?",
    options: [
      "`true` = write disk pe complete ho gaya; `false` = write fail ho gaya",
      "`true` = aur write kar sakte ho; `false` = internal buffer `highWaterMark` tak bhar gaya, ruk jao jab tak `'drain'` event na aaye",
      "`true` = chunk valid tha; `false` = chunk invalid tha",
      "Return value ka koi meaning nahi, hamesha `true` hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`write()` synchronously disk pe nahi likhta — chunk internal buffer mein jaata hai. `true` matlab buffer mein jagah hai, likhte raho. `false` matlab buffered bytes `highWaterMark` (default 64 KB) cross kar gaye — producer ko rokna chahiye aur `'drain'` event ka intezaar karna chahiye jo tab aata hai jab buffer neeche aa jaaye. Ye backpressure ka core signal hai. Option A galat — write async hai. Option D galat.",
    difficulty: "medium",
  },
  {
    id: "readable-and-writable-streams-3",
    question:
      "`readable.on('data', c => writable.write(c))` — fast readable, slow writable. Kya hoga aur sahi fix kya hai?",
    options: [
      "Node automatically readable ko slow kar dega; koi fix nahi chahiye",
      "writable ka internal buffer unbounded badhega (memory leak/OOM); fix: `write()` `false` de toh `readable.pause()`, phir `writable.once('drain', () => readable.resume())` — ya `pipe()`/`pipeline()` use karo",
      "writable crash ho jaayega turant, isliye try/catch lagao",
      "chunks silently drop ho jaayenge, data loss hoga par memory theek rahegi",
    ],
    correctIndex: 1,
    explanation:
      "`.on('data')` readable ko flowing mode mein rakhta hai — wo apni speed pe chunks emit karta rehta hai. `writable.write()` `false` return karta hai par code ignore karta hai, isliye chunks writable ke buffer mein jama hote hain aur RSS badhta hai. Manual fix: `pause()` on `false`, `resume()` on `'drain'` (with `.once()`). Better: `stream.pipeline(readable, writable, cb)` jo ye khud karta hai. Option A galat — bina pipe/pipeline ke Node khud nahi rokta. Option D galat — data drop nahi hota, buffer hota hai.",
    difficulty: "medium",
  },
  {
    id: "readable-and-writable-streams-4",
    question:
      "`writable.on('end', () => cleanup())` likha hai par `cleanup` kabhi nahi chalta. Kyun?",
    options: [
      "`cleanup` function undefined hai",
      "Writable stream `'end'` event emit karta hi nahi — Readable pe `'end'` hota hai; Writable pe `'finish'` (`.end()` ke baad sab flush) ya `'close'` (fd released) hota hai",
      "`'end'` event ke liye pehle `.pause()` call karna padta hai",
      "Writable pe events sirf `.once()` se sunte hain, `.on()` se nahi",
    ],
    correctIndex: 1,
    explanation:
      "Event ownership: `'end'` sirf Readable ka hai (source ka data khatam). Writable ka completion event `'finish'` hai — `.end()` call karne ke baad jab saara buffered data underlying resource pe flush ho jaaye. `'close'` dono pe ho sakta hai jab underlying fd/resource release ho. `writable.on('end', ...)` ek valid call hai par wo event kabhi fire nahi hota, isliye silent no-op. Option A/C/D galat.",
    difficulty: "hard",
  },
];

export default quiz;
