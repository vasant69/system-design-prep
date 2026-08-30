import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ts-1",
    question:
      "Transform stream kya hota hai, aur pipeline mein iski jagah kahan hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Transform ek Duplex stream hai jisme readable-side ka output writable-side ke input ka result hota hai. Pipeline ke beech mein baithta hai: source se data aata hai, Transform use reshape karta hai, aur destination ko aage bhejta hai. zlib.createGzip aur crypto.createCipheriv iske built-in examples hain.",
    detailedAnswer:
      "Transform `stream.Duplex` ko extend karta hai lekin ek constraint ke saath: jo tum readable side se padhoge wo writable side pe likhe data ka transform hai. Plain Duplex (jaise TCP socket) ke read/write ends independent hote hain. Tum apna Transform do tarah se banate ho: (1) inline — `new Transform({ transform(chunk, enc, cb) {}, flush(cb) {} })`, (2) subclass — `class CsvToJson extends Transform { _transform() {} }`. Andar do internal buffers hote hain (writable-side pending input, readable-side pending output) aur `highWaterMark` decide karta hai kab backpressure lage. Typical use: `pipeline(fs.createReadStream(src), gzip, fs.createWriteStream(dest), cb)` — file chunk-by-chunk padhti hai, gzip Transform compress karta hai, output disk pe jata hai, poori file kabhi memory mein nahi aati.",
    followUp:
      "Agar tumhe ek reusable transformation class chahiye jo project mein kai jagah use ho, tum inline object doge ya subclass?",
    redFlag:
      "\"Transform aur Duplex bilkul same hain\" — nahi, plain Duplex ke ends independent ho sakte hain; Transform mein output input se derive hota hai.",
  },
  {
    id: "ts-2",
    question:
      "`_transform(chunk, encoding, callback)` ke andar `push()` aur `callback()` ka role alag-alag samjhao.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`this.push(data)` readable side pe output daalta hai — ise ek `_transform` call mein 0 se N baar call kar sakte ho. `callback()` ek hi baar call hota hai aur matlab hota hai 'is input chunk ka kaam khatam, agla bhejo'. `callback(err)` stream ko error kar deta hai. `callback(null, data)` = `push(data); callback()` ka shortcut.",
    detailedAnswer:
      "Ye dono confuse hote hain kyunki dono 'output se related' lagte hain, lekin kaam alag hai. `push` = 'ye result consumer ke liye ready hai'. Ek chunk se agar do lines nikli to `push` do baar; agar abhi output ready nahi (buffering kar rahe ho) to `push` zero baar. `callback` = flow-control signal: jab tak tum `callback()` nahi karte, Node samajhta hai tum abhi busy ho aur agla `_transform` invoke nahi karta — isliye `callback()` bhoolna pipeline hang kar deta hai (na error, na output). Har code path pe `callback` exactly ek baar. Agar transform async hai (await DB), to `callback` await ke baad call karo, sync nahi.\n\n```javascript\ntransform(chunk, enc, callback) {\n  this._buf = (this._buf || '') + chunk.toString('utf8');\n  const lines = this._buf.split('\\n');\n  this._buf = lines.pop();\n  for (const line of lines) this.push(line);\n  callback();\n}\n```",
    followUp: "`flush(callback)` hook is line-splitter mein kis liye chahiye?",
    redFlag:
      "`push()` kar ke `callback()` skip kar dena, ya `callback()` ko har chunk pe kai baar call karna.",
  },
  {
    id: "ts-3",
    question:
      "Ye code kya print karega, aur kyun? (backpressure / pipeline behaviour)",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "`.pipe()` errors forward nahi karta — agar transform ya destination fail ho to source destroy nahi hota aur file descriptor leak hota hai. `pipeline()` version har stream ko error par clean destroy karta hai aur callback mein error deta hai. Isliye production mein hamesha `pipeline()`.",
    detailedAnswer:
      "Consider:\n\n```javascript\nconst { pipeline, Transform } = require('node:stream');\nconst fs = require('node:fs');\nconst boom = new Transform({\n  transform(chunk, enc, cb) { cb(new Error('bad chunk')); }\n});\npipeline(\n  fs.createReadStream('big.txt'),\n  boom,\n  fs.createWriteStream('out.txt'),\n  (err) => console.log('pipeline cb:', err && err.message)\n);\n```\n\nOutput: `pipeline cb: bad chunk`. `pipeline` ne `boom` ke `cb(err)` ko pakda, read stream aur write stream dono ko `destroy()` kiya (koi FD leak nahi), aur final callback ko error diya. Agar yahi `createReadStream('big.txt').pipe(boom).pipe(createWriteStream('out.txt'))` hota, to `boom` error emit karta, lekin read stream khula reh jata, `out.txt` ka handle khula reh jata, aur error par koi central handler nahi hota — process crash ho sakta tha 'Unhandled error event' se. Yahi `.pipe()` vs `pipeline()` ka core farak hai.",
    followUp:
      "`stream/promises` ka `await pipeline(...)` isse kaise alag hai?",
  },
  {
    id: "ts-4",
    question:
      "Ek 4 GB log file se sare credit-card numbers redact karke client ko HTTP response mein bhejni hai. Design batao.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`pipeline(fs.createReadStream(log), lineSplitter, redactTransform, res, cb)`. lineSplitter Buffer chunks ko complete lines mein todta hai, redactTransform har line pe regex se card numbers mask karta hai, output seedha response socket pe. Memory ~50 MB constant, backpressure automatic — client slow ho to disk read dheema ho jata hai.",
    detailedAnswer:
      "Steps: (1) `fs.createReadStream(logPath)` — 64 KB chunks. (2) Ek `lineSplitter` Transform (`readableObjectMode: true`) — internal buffer, `\\n` pe split, aakhri adhoora piece `_flush` mein push. Ye zaroori hai kyunki ek card number chunk boundary pe bat sakta hai. (3) `redactTransform` — har line pe `line.replace(/\\b(?:\\d[ -]*?){13,16}\\b/g, 'XXXX')`, phir `this.push(masked + '\\n')`. (4) Destination `res` (the HTTP ServerResponse, jo Writable hai). (5) `pipeline(readStream, lineSplitter, redactTransform, res, (err) => { if (err) { logger.error(err); if (!res.headersSent) res.status(500).end(); } })`.\n\nKyun streaming: `readFile` se 4 GB memory spike -> pod OOM. Kyun `pipeline`: error par sare streams clean destroy hote hain, warna client disconnect hone par read stream chalti rehti aur FD leak hota. Kyun lineSplitter alag: redaction ko poori line chahiye, raw Buffer chunk pe regex galat match dega.",
    followUp:
      "Agar client beech mein disconnect kar de to kya hota hai, aur tum ensure kaise karoge ki file handle band ho jaye?",
    redFlag:
      "`fs.readFile` + `.replace()` + `res.send()` — 4 GB memory, poora request tak block, aur ek slow client sab connections khaa lega.",
  },
  {
    id: "ts-5",
    question:
      "Transform stream ke alternatives kya hain, aur kab plain `Array.map` / async generator better hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Agar data already memory mein aur chhota hai — plain `map`/loop, stream ka setup overhead bekaar. Modern Node mein async generator ko `pipeline(src, async function* (s) { for await (const c of s) yield f(c); }, dest)` mein daal sakte ho — koi Transform class nahi. `through2` library purana tareeka hai, ab built-in `Transform` kaafi hai.",
    detailedAnswer:
      "Options: (1) **Plain function / `map`** — input chhota, poora memory mein. Stream banane ka fixed cost (buffers, event wiring) fayde se zyada. (2) **Async generator as transform** — `pipeline` teesre arg mein ek async generator function le leta hai: `for await (const chunk of source) yield transform(chunk)`. Ye Transform class se saaf hai, `this`/`callback`/`push` ka jhamela nahi, aur backpressure phir bhi milta hai. (3) **`Readable.from(asyncIterable)`** — source hi ek generator se banao. (4) **`through2`** — pre-Node-10 ka library; naye code mein avoid, sirf legacy codebases mein. (5) **`stream/promises` pipeline** — `await` hota hai, try/catch se error. Rule: bade streaming data pe async generator ya `Transform`; chhote in-memory data pe plain JS; global operations (sort/dedupe across whole dataset) pe streaming natural nahi — sab buffer karna padega.",
    followUp:
      "async generator wale approach mein backpressure kaise milta hai jab usme `push()`/`callback()` hai hi nahi?",
  },
];

export default questions;
