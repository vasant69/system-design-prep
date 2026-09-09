import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "streams-1",
    question: "Bade data pe streams ka main fayda kya hai?",
    options: [
      "Data automatically compress ho jaata hai",
      "Memory usage flat rehti hai — chunk-by-chunk process hota hai, poora data ek saath RAM mein nahi aata",
      "CPU multiple cores pe distribute ho jaata hai",
      "Disk I/O poori tarah skip ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Stream ek chhota chunk (files ke liye default lagbhag 64 KB) process karke aage bhej deta hai, phir agla — peak memory chunk-size ke aas-paas rehti hai, total data 10 GB ho ya 10 KB. `readFileSync` poora data RAM mein laata hai to bade file pe OOM. Compression sirf tab jab tum Transform (gzip) add karo; cores ke liye worker_threads chahiye.",
    difficulty: "easy",
  },
  {
    id: "streams-2",
    question: "Readable stream ke `flowing` aur `paused` mode mein farak kya hai aur flowing mode kaise on hota hai?",
    options: [
      "Stream hamesha flowing mode mein hi hota hai",
      "`paused` default hai; `.on('data', fn)` add karne se, `.pipe()` se, ya `.resume()` se flowing on hota hai — phir chunks apne aap aate hain",
      "`flowing` default hai; `.pause()` se hi rukta hai",
      "Mode sirf `objectMode` streams pe apply hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Readable paused mein start hota hai. Flowing switch on hota hai jab: (a) `data` listener add ho, (b) `pipe()` call ho, ya (c) `resume()` call ho. Flowing mein chunks jitni tezi se aayen emit hote hain — slow consumer ke saath manual handling pe data pile-up ya loss ho sakta hai. `pipe`/`pipeline` isko backpressure se automatically manage karte hain. Paused mein tum `.read()` se explicitly pull karte ho.",
    difficulty: "medium",
  },
  {
    id: "streams-3",
    question: "Transform stream ke `transform(chunk, enc, callback)` mein `callback` ka role kya hai?",
    options: [
      "`callback` call karna optional hai, sirf error ke liye",
      "`callback()` (ya `callback(null, data)`) signal deta hai ki is chunk ka processing done — tab tak stream agla chunk nahi bhejta (yahi backpressure ka hissa hai)",
      "`callback` output ko compress karta hai",
      "`callback` poore stream ko turant end kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`transform` async ho sakta hai; `callback` invoke karna batata hai 'main is chunk ke saath free hoon, agla bhejo'. Jab tak `callback()` nahi karte, stream us stage pe ruka rehta hai — automatic backpressure. Output do tareeke: `this.push(x)` (multiple baar) ya `callback(null, x)` (ek baar). `callback(err)` error propagate karta hai. `callback` kabhi na call karna = stream hang.",
    difficulty: "hard",
  },
  {
    id: "streams-4",
    question: "`data`, `end`, aur `error` events kya signal karte hain?",
    options: [
      "`data` = stream ready; `end` = error hua; `error` = data khatam",
      "`data` = ek naya chunk aaya; `end` = source ne saara data de diya (ab kuch nahi aayega); `error` = kisi stage pe failure",
      "Teeno sirf debugging ke liye hain, koi real meaning nahi",
      "`end` har chunk ke baad fire hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`data` har chunk pe (flowing mode). `end` ek baar, jab Readable exhausted — iske baad koi `data` nahi. `error` kisi bhi failure pe (file missing, socket reset, transform threw). Writable pe analogous events `drain` aur `finish` hain. `error` handle na karo to unhandled error se process crash — isliye `pipeline()` prefer kiya jaata hai jo har stage ka error catch karta hai.",
    difficulty: "easy",
  },
];

export default quiz;
