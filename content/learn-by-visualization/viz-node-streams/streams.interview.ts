import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "strm-1",
    question: "Node streams kya hain aur chaar base types kaunse? Kab use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Streams data ko chunks mein handle karne ka interface hain — poora payload memory mein liye bina. Readable (source), Writable (sink), Duplex (dono, jaise socket), Transform (Duplex jo chunks map kare, jaise gzip/crypto). Use tab: large files, HTTP proxying, real-time data, ya jab data ka size unbounded ho.",
    detailedAnswer:
      "Har base type EventEmitter hai. Readable: `fs.createReadStream`, http IncomingMessage, `process.stdin` — chunks emit/pull karta hai. Writable: `fs.createWriteStream`, http ServerResponse, `process.stdout` — `write()` plus `end()`. Duplex: independent read aur write side (TCP socket). Transform: input chunk -> `_transform` -> output chunk (`zlib.createGzip()`, `crypto.createCipheriv()`, CSV parser). Fayde: (1) constant memory, (2) time-to-first-byte kam — pehla chunk aate hi aage bhej sakte ho, (3) composability via `pipe`/`pipeline`, (4) automatic backpressure. Trade-off: control flow zyada complex, aur error handling har stage pe deni padti hai (isliye `pipeline`).",
    followUp: "objectMode kya hai aur kab chahiye?",
    redFlag: "\"streams sirf files ke liye hain\" — HTTP, sockets, crypto, stdin/stdout sab streams hain.",
  },
  {
    id: "strm-2",
    question: "Ek 3 GB CSV process karna hai. `fs.readFileSync` se load karoge ya stream? readFileSync pe kya hoga?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Stream. `readFileSync('3gb.csv')` poori file ko ek Buffer/string mein laata hai — 3 GB+ RAM spike; string ke liye V8 ki max string length bhi cross ho jaati hai to error ya OOM crash. Stream se memory lagbhag 64 KB per chunk pe flat rehti hai.",
    detailedAnswer:
      "`readFileSync` ki teen problems: (1) memory — poora payload resident, doosre requests ke liye headroom nahi; (2) V8 limits — single string ya Buffer ki max size hoti hai (64-bit pe roughly 1 GB Buffer / 512 MB string), 3 GB allocate hi nahi hoga; (3) latency — pehli row process karne ke liye poori 3 GB read ka wait, aur sync call event loop block. Streaming: pipeline(createReadStream('3gb.csv'), split2(), csvParse(), transformRow(), createWriteStream('out.jsonl')) — ek time pe ek row, constant memory, event loop free, first row milliseconds mein. Per-row CPU-heavy kaam ho to worker pool bhi add kar sakte ho.",
    followUp: "Agar transform step kabhi-kabhi throw kare to poori pipeline ka kya hoga?",
    redFlag: "\"server pe RAM badha lenge\" — input ke linear-in-size memory design galat hai.",
  },
  {
    id: "strm-3",
    question: "`readable.on('data', ...)` add karne se pehle stream data emit nahi karti — kyun? Isse kya bug aa sakta hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Readable 'paused' mode mein start hoti hai; `data` listener (ya `pipe`/`resume`) use 'flowing' mode mein daalta hai. Bug: agar tum async kaam ke baad `data` listener attach karo, to jo chunks ya `end` us gap mein aaye wo miss ho sakte hain.",
    detailedAnswer:
      "Do consumption modes: paused (`.read()` se pull) aur flowing (`data` events push). Flowing mein switch: pehla `data` listener, ya `.pipe()`, ya `.resume()`. Classic bug: const s = getStream(); await something(); s.on('data', ...) — kuch streams already flowing ho sakte hain, ya `await` ke dauran internal buffer bhar jaata hai ya `end` nikal jaata hai, to shuruaati chunks / `end` miss. Fix: stream milte hi synchronously listeners ya `pipe` attach karo, ya `stream.pause()` karke baad mein `resume`. Modern: for await (const chunk of readable) — ye backpressure-aware hai aur mode confusion se bachata hai.",
    followUp: "`for await...of` ek readable pe backpressure kaise handle karta hai?",
  },
  {
    id: "strm-4",
    question: "`a.pipe(b).pipe(c)` chain mein beech ka Transform `b` error throw kare — kya `c` band hota hai aur `a` cleanup hota hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Nahi. Plain `pipe` error forward nahi karta aur upstream ko destroy nahi karta — `b` fail hua to `a` khula reh jaata hai (fd leak) aur `c` adhoora. Isiliye `stream.pipeline()` use karo: wo error propagate karta hai aur saari streams destroy/cleanup karta hai.",
    detailedAnswer:
      "`pipe` ka contract limited hai: data plus backpressure forward karta hai, `error` events nahi. Agar Transform `b` throw kare ya `error` emit kare aur uspe listener na ho -> unhandled -> crash; listener ho bhi to `a` (source fd/socket) aur `c` (partial output file) apne aap close nahi hote -> fd leak, corrupt output. `pipeline(a, b, c, cb)` (ya `stream/promises` ka `await pipeline(...)`) har stream pe error sunta hai, first error pe sabko `destroy()` karta hai, aur error ek hi jagah deta hai. Rule: production mein `pipe` ki jagah hamesha `pipeline`.",
    followUp: "`pipeline` ke saath ek stream ko conditionally skip karna ho to kaise karoge?",
    redFlag: "\"`pipe` sab handle kar leta hai\" — error propagation aur cleanup nahi karta.",
  },
];

export default questions;
