import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "csa-1",
    question:
      "`fs.readFileSync` vs `fs.readFile` vs Streams — kya choose karoge aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Do cheezon pe depend karta hai: code kahan chal raha hai (cold path jaise startup/CLI vs hot path jaise request handler), aur data kitna bada hai. Cold path + chhota data -> `readFileSync` (simple, fail-fast). Hot path + chhota bounded data -> `fs.promises.readFile`. Bada/unbounded/response-me-pipe -> `createReadStream` + `pipeline`.",
    detailedAnswer:
      "Framework:\n\n1. Startup / CLI / migration (cold path): koi concurrent user nahi, toh blocking se kisi ki latency nahi badhti. `fs.readFileSync` sabse simple hai, aur config missing hone par thrown error process ko turant gira deta hai (fail-fast) — desired. Yahan sync production me bilkul theek hai.\n\n2. Request handler, file chhoti aur bounded (template, chhota JSON): sync yahan har concurrent user ko block karega, toh `fs.promises.readFile` (async full read). File bounded hai toh poori memory me lena acceptable.\n\n3. File badi, ya user-controlled size, ya client ko bhejni hai (download/proxy), ya ek queue worker 2 GB file transform kar raha hai: `fs.createReadStream` + `pipeline()`. Reasons: (a) constant memory ~64 KB chahe file 10 MB ho ya 10 GB — `fs.promises.readFile` yahan poori file RAM me le aata (OOM risk); (b) backpressure — slow client par read khud slow ho jata; (c) time-to-first-byte kam.\n\nKey nuance jo interviewer sunna chahta hai: `fs.readFile` async hone se sirf event loop bachta hai, memory nahi — isliye bade input pe async full-read bhi galat hai, stream chahiye. Aur `require()` sync hai by design, wo is discussion se alag hai kyunki wo startup pe chalta hai.\n\nOne-liner: sync sirf cold path chhote data ke liye; hot path pe async; bada/unbounded/streaming-to-response pe stream.",
    followUp: "Agar tumhe file ka poora content ek object chahiye (random access) lekin file 300 MB hai, toh?",
    redFlag:
      "\"readFileSync production me kabhi nahi\" ya \"streams hamesha better\" — dono blanket rules galat hain; jawaab context-dependent hai.",
  },
  {
    id: "csa-2",
    question:
      "Kya `fs.readFileSync` production code me kabhi acceptable hai? Ek concrete example do.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Haan — jab koi concurrency na ho. App startup pe config/TLS cert/key load karna, CLI tools, DB migrations, build scripts, test setup. In sab me `readFileSync` acceptable aur actually preferable hai kyunki code simple rehta hai aur fail-fast behaviour milta hai. Galat sirf request-serving hot path me.",
    detailedAnswer:
      "Typical Express `server.js` top:\n\n```javascript\nconst config = JSON.parse(fs.readFileSync('./config/prod.json', 'utf8'));\nconst key = fs.readFileSync('./certs/key.pem');\nrequire('./routes');\napp.listen(config.port);\n```\n\nSab sync — aur best practice. Reasons: (1) ye `app.listen` se pehle chalta hai, koi request queue nahi ho rahi, toh event loop block hone se koi user affected nahi; (2) tum explicitly chahte ho ki config missing/corrupt hone par process startup pe hi crash kare (fail fast) — sync `readFileSync` ka thrown error seedha process ko non-zero exit code ke saath gira deta hai; (3) sync code padhne aur reason karne me aasaan.\n\nUlta side: `fs.readFileSync` ek request handler ke andar (per-request cert read, per-request template read) ek classic production bug hai — dev me file local aur chhoti, prod me network mount ya bada file, aur poora event loop thok jata hai.\n\nRule: 'sync banned' nahi; 'request path me sync banned, aur user-controlled input size pe sync banned'.",
    followUp: "Startup pe load ki hui config ko bina restart reload karna ho toh kaise design karoge?",
  },
  {
    id: "csa-3",
    question:
      "Ek `/report` endpoint har request pe `fs.readFileSync('template.html')` karta hai. Dev me sab theek, production me intermittent latency spikes. Kya ho raha hai aur kaise fix karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Per-request sync read event loop ko har call ke liye block kar raha hai. Dev me file local SSD pe aur cache-warm, 0.2 ms — dikhta nahi. Production me file network/EFS mount pe ya disk contention me, kabhi 50-200 ms — aur us doran har doosri concurrent request bhi ruk jati hai. Fix: template ko startup pe ek baar `readFileSync` se load karke module-level constant me rakho.",
    detailedAnswer:
      "Diagnosis: event loop delay metric dekho — spikes traffic ke saath correlate karenge. `clinic flame` ya `--prof` flame graph me `readFileSync` wide frame dikhega. Ya simply `grep -rn 'Sync(' src/` karke sab sync calls audit karo aur dekho kaunse request path me hain.\n\nFix options, best se: (1) Agar file badalti nahi (template, cert, static config): startup pe ek baar load karo — `const TEMPLATE = fs.readFileSync('template.html', 'utf8')` module top pe. Zero per-request I/O. (2) Agar file kabhi-kabhi badalti hai: startup pe load + `fs.watch` se change pe reload, ya ek TTL cache. (3) Agar sach me har request pe fresh chahiye: `await fs.promises.readFile` — kam se kam event loop free rahega, par (1) better hai.\n\nGeneral principle: jo cheez har request pe chahiye aur rarely badalti hai, use process memory me cache karo; disk ko hot path se hata do.",
    followUp: "`fs.watch` ke reliability issues kya hain aur unka workaround?",
    redFlag:
      "\"`readFileSync` ko `readFile` bana do\" bol ke ruk jana — async karne se event loop bachta hai par tab bhi har request ek disk hit karti hai; asli fix caching hai.",
  },
  {
    id: "csa-4",
    question:
      "`createReadStream(path).pipe(res)` likha, file exists, sab test me pass. Production me kabhi-kabhi poora process crash ho jata hai. Sabse likely wajah?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "`.pipe()` source stream ke `'error'` event ko destination tak propagate nahi karta. File mid-read fail hone par (disk error, file delete, permission), read stream ek `'error'` emit karta hai jiska koi listener nahi — Node me unhandled stream `'error'` process ko crash kar deta hai. Fix: `stream.on('error', ...)` lagao, ya behtar `pipeline(src, res, cb)` use karo jo errors + cleanup dono handle karta hai.",
    detailedAnswer:
      "`.pipe()` ka contract: wo data aur `end` forward karta hai, lekin errors nahi. Toh:\n\n```javascript\n// GALAT — read error unhandled -> crash\nfs.createReadStream(path).pipe(res);\n\n// THEEK — explicit handler\nconst s = fs.createReadStream(path);\ns.on('error', (err) => { res.statusCode = 500; res.end('error'); });\ns.pipe(res);\n\n// BEHTAR — pipeline errors + resource cleanup dono handle karta hai\nconst { pipeline } = require('stream/promises');\ntry {\n  await pipeline(fs.createReadStream(path), res);\n} catch (err) {\n  if (!res.headersSent) { res.statusCode = 500; res.end('error'); }\n}\n```\n\n`pipeline` extra benefit: agar client connection beech me toot jaye (`res` errors/closes), wo read stream ko bhi destroy kar deta hai — warna ek orphaned file descriptor + read leak ho jata hai. Isliye modern code me hamesha `pipeline`, kabhi bare `.pipe()` for anything that can fail.",
    followUp: "Agar client slow hai toh backpressure `pipeline` ke through kaise kaam karta hai?",
    redFlag:
      "\"`.pipe()` kaafi hai\" bina error handling ke — ye ek known production crash source hai.",
  },
  {
    id: "csa-5",
    question:
      "Ek queue worker ko ek 2 GB log file process karni hai (line-by-line transform, phir naye file me likhni). Sync, async full-read, ya stream — kya aur kyun?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Stream pipeline: `pipeline(createReadStream(src), transformStream, createWriteStream(dst))`. Sync ya async full-read dono 2 GB ko RAM me laane ki koshish karenge — Node ka Buffer max ~2 GB hai toh full-read literally throw kar sakta hai, aur nahi bhi toh OOM. Stream me memory constant (~64 KB * few buffers) rehti hai chahe file 2 GB ho ya 200 GB.",
    detailedAnswer:
      "Implementation shape:\n\n```javascript\nconst { pipeline } = require('stream/promises');\nconst fs = require('fs');\nconst readline = require('readline');\nconst { Transform } = require('stream');\n\nconst transform = new Transform({\n  transform(chunk, enc, cb) {\n    // line-splitting ke liye readline ya split2 better; illustrative\n    cb(null, processChunk(chunk));\n  },\n});\n\nawait pipeline(\n  fs.createReadStream('big.log'),\n  transform,\n  fs.createWriteStream('out.log'),\n);\n```\n\nKyun stream: (1) Memory bounded — `highWaterMark` (~64 KB) * pipeline stages, file size se independent. (2) Backpressure — agar write disk slow hai, `pipeline` read ko pause kar deta hai, toh RAM me unbounded buffering nahi. (3) Failure safety — `pipeline` kisi bhi stage ke error pe baaki sab streams destroy karta hai (no FD leak). (4) Worker doosre jobs ke beech responsive rehta hai kyunki event loop free hai.\n\nAgar transform CPU-heavy hai (regex-heavy parsing, compression), toh transform ko `worker_threads` pe daal do ya `Worker`-based stream use karo, taaki wo CPU bhi main event loop se hate.",
    followUp: "Line-by-line processing ke liye `readline` interface aur ek custom split Transform me kya trade-off hai?",
    redFlag:
      "2 GB file ke liye `fs.promises.readFile` suggest karna — 'async hai toh theek hai' soch, jo memory ignore karti hai.",
  },
];

export default questions;
