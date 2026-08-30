import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "streams-introduction-1",
    question:
      "2 GB file ko process karne mein `fs.readFile` aur `fs.createReadStream` ka core farak kya hai?",
    options: [
      "readFile tez hai kyunki ek hi system call hoti hai; stream slow hai",
      "readFile poori 2 GB RAM mein laata hai aur pehla byte tab deta hai jab poori padh li jaaye; stream ~64 KB chunks mein deta hai, constant memory, pehla chunk turant",
      "Dono same memory lete hain, sirf API alag hai",
      "Stream sirf text files ke liye kaam karta hai, readFile binary ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Streams ka pura point yahi hai: memory bounded rehti hai (sirf current chunk + internal buffer, ~64 KB) chahe file 2 GB ho ya 200 GB, aur processing pehla chunk milte hi shuru ho jaati hai (fast time-to-first-byte). `readFile` poori file memory mein laata hai aur complete hone tak kuch return nahi karta. Option A/C/D galat — stream aksar overall thoda slower per-byte hota hai par memory/latency mein bahut aage.",
    difficulty: "easy",
  },
  {
    id: "streams-introduction-2",
    question: "Node ke char stream types kaunse hain aur `zlib.createGzip()` kaunsa hai?",
    options: [
      "Input, Output, Pipe, Filter — gzip ek Filter hai",
      "Readable, Writable, Duplex, Transform — gzip ek Transform hai (Duplex jo data badalta hai)",
      "Read, Write, Append, Seek — gzip ek Seek stream hai",
      "Sync, Async, Buffered, Raw — gzip ek Buffered stream hai",
    ],
    correctIndex: 1,
    explanation:
      "Char types: Readable (source, jaise `createReadStream`), Writable (sink, jaise `createWriteStream`), Duplex (independent read + write, jaise TCP socket), aur Transform (Duplex jiska output uske input ka transformed version hai). `zlib.createGzip()`, `crypto.createCipheriv()` Transform streams hain. Baaki options invented terms hain.",
    difficulty: "easy",
  },
  {
    id: "streams-introduction-3",
    question:
      "`src.on('data', chunk => dst.write(chunk))` mein kaunsa problem hai jab `dst` slow disk hai aur `src` fast hai?",
    options: [
      "Koi problem nahi, Node automatically handle karta hai",
      "`dst` ka internal write buffer unbounded badhta hai kyunki `.on('data')` khud producer ko rok nahi sakta — memory phat sakti hai; `.pipe()` ya `pipeline()` chahiye jo backpressure handle kare",
      "`dst.write` synchronous hai isliye `src` apne aap rukega",
      "chunk Buffer nahi string hoga isliye crash",
    ],
    correctIndex: 1,
    explanation:
      "`.on('data')` listener Readable ko flowing mode mein rakhta hai aur wo `src` ki speed pe chunks emit karta rehta hai. Agar `dst` dheema hai, `dst.write()` `false` return karta hai (buffer full) par is code mein wo ignore ho raha hai — chunks `dst` ke internal buffer mein jama hote rehte hain aur RSS badhta hai. Fix: `.pipe()` / `stream.pipeline()` jo `write()` ka return dekh ke `src.pause()`/`resume()` karta hai. Option C galat — `dst.write` async hai.",
    difficulty: "medium",
  },
  {
    id: "streams-introduction-4",
    question:
      "Ek batch job DB se 40 million rows padh ke file likhta hai. Kaunsa design memory-safe hai?",
    options: [
      "`SELECT *` ka poora result array mein lo, `.map()` se format karo, `fs.writeFileSync`",
      "Ek objectMode Readable (query stream) → Transform jo har row format kare → `fs.createWriteStream`, sab `pipeline()` se joda, taaki memory row-count se independent flat rahe",
      "Rows ko 1000 ke batches mein `JSON.parse` karo",
      "`readFile` se DB dump padho phir process karo",
    ],
    correctIndex: 1,
    explanation:
      "Streaming pipeline mein sirf highWaterMark jitni rows (default 16 objectMode) kabhi memory mein hoti hain — 40M ya 400M rows, memory flat rehti hai. Option A poora result set memory mein laata hai — `JavaScript heap out of memory` few million rows pe. Option C abhi bhi sab rows load karta hai. Option D DB ke liye applicable nahi. objectMode + `pipeline()` yahan standard pattern hai.",
    difficulty: "medium",
  },
];

export default quiz;
