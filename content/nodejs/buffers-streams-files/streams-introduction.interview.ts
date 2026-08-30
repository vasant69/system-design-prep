import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "strintro-1",
    question: "Stream kya hai aur ye `fs.readFile` se behtar kab hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Stream data ko chunk-by-chunk read/write karne ka abstraction hai — poora data kabhi ek saath memory mein nahi. `readFile` poori file RAM mein laata hai aur complete hone tak wait karwata hai; stream ~64 KB chunks deta hai constant memory pe aur pehla chunk turant. Badi, unbounded, ya client ko stream honi wali data ke liye stream behtar; chhoti bounded file ke liye `readFile` simpler.",
    detailedAnswer:
      "Stream ek 'data over time' abstraction hai. Do concrete faayde: (1) Memory — 2 GB file `readFile` se 2+ GB RSS spike deti hai, 10 concurrent requests container ko OOM-kill karti hain; stream ke saath har request ~64 KB rakhti hai. (2) Latency — `readFile` pehla byte tab deta hai jab poori file padh li jaaye; stream first chunk milte hi forward karta hai, isliye video/CSV-export/log-tail mein user ko turant response dikhta hai. Bonus: composability — `read.pipe(gzip).pipe(encrypt).pipe(upload)`, har stage memory-bounded aur reusable. Kab NA use karein: config file, chhota JSON (`< 1 MB` bounded) — `readFile` readable aur kaafi. Ya jab tumhe processing se pehle poora data chahiye (jaise `JSON.parse`).",
    followUp: "Agar tumhe streamed JSON chahiye jo poora fit nahi hota memory mein, kya karoge?",
    redFlag: "\"Stream matlab bas fast\" — asli faayda memory-bounded aur early-start hai, raw throughput nahi.",
  },
  {
    id: "strintro-2",
    question: "Node ke char stream types samjhao ek-ek example ke saath.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Readable — data source (`fs.createReadStream`, HTTP `req`, `process.stdin`). Writable — data sink (`fs.createWriteStream`, HTTP `res`, `process.stdout`). Duplex — independent read aur write ek hi object pe (`net.Socket`). Transform — Duplex jiska output input ka badla hua roop hai (`zlib.createGzip`, `crypto.createCipheriv`).",
    detailedAnswer:
      "Readable produce karta hai; tum `data` event ya `for await...of` se consume karte ho. Writable consume karta hai; tum `.write(chunk)` karte ho aur `.end()` se finish. Duplex dono karta hai par dono sides logically alag hoti hain — TCP socket pe tum bhi likhte ho aur server bhi bhejta hai, dono streams independent buffers rakhte hain. Transform ek special Duplex hai: jo tum `.write()` karte ho wo internally `_transform(chunk, enc, cb)` se process hoke readable side pe aata hai — gzip compression, encryption, CSV-to-object parsing sab Transform hain. Iske alawa `PassThrough` ek trivial Transform hai jo kuch nahi badalta, sirf observe/pipe karne ke liye use hota hai.",
    followUp: "`PassThrough` stream kis kaam aata hai?",
  },
  {
    id: "strintro-3",
    question: "Tumhari service ki memory badi files serve karte waqt spike kar rahi hai. Kaise debug aur fix karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Sabse pehle dhoondho kahin `fs.readFile` / `readFileSync` ya 'poora response string build karke bhejo' pattern to nahi hai. Use `fs.createReadStream(path).pipe(res)` (ya `pipeline`) se replace karo taaki har request sirf ek highWaterMark chunk memory mein rakhe. `Range` header support add karo seek ke liye.",
    detailedAnswer:
      "Debug: `process.memoryUsage().rss` ya heap snapshot lo load ke dauraan; aksar dikhta hai bade Buffers retained hain. Code mein `readFile`, `readFileSync`, `Buffer.concat` on request body, ya `data += chunk` grep karo. Fix pattern: `fs.createReadStream(filePath).pipe(res)` — ab peak memory `highWaterMark` (64 KB) per connection, hazaaron concurrent viewers ek box pe fit. Large uploads ke liye ulta: `req` (Readable) ko seedha `fs.createWriteStream` ya S3 multipart upload pe pipe karo, poora body memory mein mat lo. Production mein `pipe` ke bajaye `stream.pipeline(src, dst, cb)` use karo — error propagation aur cleanup ke liye. Aur `Content-Length` / `Range` headers handle karo taaki video scrubbing kaam kare aur client ko progress dikhe.",
    followUp: "`pipe` aur `pipeline` mein farak kya hai, production mein kaunsa?",
    redFlag: "Fix ke liye sirf `--max-old-space-size` badha dena — root cause (buffering) address nahi hota.",
  },
  {
    id: "strintro-4",
    question: "objectMode stream kya hai aur kab chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Default streams mein chunks Buffer ya string hote hain. `objectMode: true` set karne pe chunks arbitrary JS objects ho sakte hain — DB rows, parsed CSV records, log entries. Tab `highWaterMark` 'kitne bytes' ke bajaye 'kitne objects' (default 16) ho jaata hai. Record/row pipelines ke har stage pe set karna padta hai.",
    detailedAnswer:
      "Byte streams data ko flatten karke bytes mein bhejte hain. Agar tum ek Readable se `{ id: 1, name: 'x' }` push karo bina objectMode ke, Node use Buffer mein convert karne ki koshish karega aur `[object Object]` ya `TypeError` dega. objectMode se stream har `.push(obj)` ko as-is ek discrete chunk maanta hai. Common use: `pg-query-stream` / Mongo cursor (objectMode Readable) → ek Transform (`objectMode: true` dono taraf) jo row ko format kare → phir ya to string mein serialize karke byte Writable pe, ya seedha objectMode Writable pe. Gotcha: pipeline mein jaise hi tum objects ko file/socket pe likhna chahoge, ek stage pe `JSON.stringify` + newline karke wapas byte mode mein aana padta hai.",
    followUp: "objectMode stream mein backpressure kaise measure hota hai jab chunk ka size bytes mein nahi pata?",
  },
  {
    id: "strintro-5",
    question: "Streams `EventEmitter` extend karte hain — iska ek practical consequence batao jo log bhool jaate hain.",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Agar ek stream `error` event emit kare aur uska koi listener na ho, Node poora process crash kar deta hai (`Unhandled 'error' event`). Har stream pe — source, har transform, destination — `.on('error', ...)` chahiye, ya `stream.pipeline()` use karo jo saare streams ke errors ko ek callback/promise mein le aata hai aur baaki streams destroy kar deta hai.",
    detailedAnswer:
      "`.pipe()` errors ko forward NAHI karta — agar `a.pipe(b)` mein `a` fail ho jaaye, `b` ko pata nahi chalta, `b` ka `error` bhi tumne shayada handle na kiya ho, aur agar kisi ek stream pe listener missing hai toh crash. Isliye teen options: (1) har stream pe manually `.on('error')` — verbose aur galti se ek chhoot jaata hai; (2) `stream.pipeline(a, b, c, (err) => {...})` — ek jagah error, aur failure pe saare streams `destroy()` ho jaate hain (file descriptor leak nahi); (3) `require('stream/promises').pipeline(a, b, c)` — same, promise-based, `try/catch` ke saath. Production mein hamesha (2) ya (3). `.pipe()` sirf throwaway scripts ke liye jahan crash acceptable hai.",
    followUp: "`pipeline` failure pe streams destroy karta hai — agar ek stream already closed ho to?",
    redFlag: "Sirf source pe `error` listener lagana aur destination/transform ko bhool jaana.",
  },
];

export default questions;
