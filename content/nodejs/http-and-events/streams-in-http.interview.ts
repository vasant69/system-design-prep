import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sih-1",
    question:
      "Ek bada file (say 2 GB) HTTP par kaise serve karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "RAM mein load nahi karunga. `res` khud ek writable stream hai, to `pipeline(fs.createReadStream(path), res)` — file `~64 KB` chunks mein padhi jaati hai, socket par likhi jaati hai, aur `pipeline` backpressure handle karta hai. Errors ke liye `pipeline` ke promise ko `try/catch` — wo sab streams destroy karta hai, FD leak nahi hota. `readFileSync` + `res.end` avoid — 2 GB memory spike, slow TTFB, DoS surface.",
    detailedAnswer:
      "```javascript\nconst { pipeline } = require('stream/promises');\nconst fs = require('fs');\n\napp.get('/download/:id', async (req, res) => {\n  const path = resolvePath(req.params.id);\n  res.setHeader('Content-Type', 'application/octet-stream');\n  try {\n    await pipeline(fs.createReadStream(path), res);\n  } catch (err) {\n    if (!res.headersSent) res.writeHead(500);\n    res.end();\n  }\n});\n```\n\nKey points: (1) `req`/`res` already streams hain — isi wajah se ye kaam karta hai. (2) `pipeline` (not `.pipe`) — error par sab destroy + reject. (3) Compression chahiye to beech mein `zlib.createGzip()` transform + `Content-Encoding: gzip`. (4) `Content-Length` mat set karo agar compress/dynamically generate kar rahe ho — Node chunked transfer use karega. (5) Production mein ye kaam aksar nginx/CDN karta hai — `sendfile`, range requests, caching native.",
    followUp: "Video seeking ke liye client `Range: bytes=1000-2000` bhejta hai — server ko kya karna chahiye?",
    redFlag: "Bade file ke liye `fs.readFileSync` + `res.end(buf)`, ya backpressure ka concept hi na pata hona.",
  },
  {
    id: "sih-2",
    question:
      "Backpressure kya hai aur streaming mein wo kyun zaroori hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Backpressure = fast producer ko slow consumer se match karna. Disk se padhne ki speed (~500 MB/s) aur ek mobile client ka network (~2 MB/s) alag hain. Bina control ke Node ke andar unwritten data ka buffer badhta jaata hai. `res.write()` `false` return karta hai jab uska buffer bhar jaye — source ko `pause()` karo, `res` ke `'drain'` event par `resume()`. `pipe`/`pipeline` ye khud karte hain.",
    detailedAnswer:
      "Bina backpressure ke: ek fast disk + slow client ek hi request ke liye gigabytes RAM mein jama kar sakta hai, kyunki data disk se aa raha hai lekin socket par nahi ja pa raha. Mechanism: har writable stream ka ek internal buffer (`highWaterMark`, fs ke liye `~64 KB`) hai. `write()` `false` deta hai jab buffer us limit se upar — signal 'ruk jao'. Source ko pause karo; jab `res` apna buffer client ko de deta hai, wo `'drain'` emit karta hai — tab source resume.\n\nManual code:\n```javascript\nsrc.on('data', (chunk) => {\n  if (!res.write(chunk)) src.pause();\n});\nres.on('drain', () => src.resume());\n```\n\nLekin `pipeline(src, res)` ye poora dance karta hai + error cleanup — isliye manual `write`/`drain` handling ki zaroorat practically kabhi nahi.",
    followUp: "`highWaterMark` kya hai aur ise badhane/ghatane se kya hota hai?",
  },
  {
    id: "sih-3",
    question:
      "`.pipe()` aur `stream.pipeline()` mein kya farak hai? Naye code mein kaunsa aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`a.pipe(b)` source error par `b` ko destroy NAHI karta — `b` hang, `a` ka file descriptor leak. `pipeline(a, b, cb)` (ya `stream/promises` ka `await pipeline(a, b)`) kisi bhi stage ke error par saari streams `destroy()` karta hai aur callback/promise ko reject karta hai. Naye code mein hamesha `pipeline`.",
    detailedAnswer:
      "Concrete leak: `fs.createReadStream('missing.txt').pipe(res)` — file `ENOENT` par error deti hai, `res` cleanly close nahi hoti (client ka socket hang), aur read stream ka FD close nahi hota. Har `.pipe()` ke saath tumhe manually `a.on('error', ...)` aur `b.on('error', ...)` lagane padte hain, aur ek stage se doosre ko cleanup manually forward karna padta hai.\n\n`pipeline` ye sab handle karta hai:\n```javascript\nconst { pipeline } = require('stream/promises');\ntry {\n  await pipeline(fs.createReadStream(src), zlib.createGzip(), res);\n} catch (err) {\n  // saari streams already destroyed; sirf response cleanup\n  if (!res.headersSent) res.writeHead(500);\n  res.end();\n}\n```\n\nNote: `pipeline` `res` (http response) ko special-case karta hai — use end par destroy nahi karta (taaki tum error response bhej sako agar headers na gaye hon).",
    followUp: "`pipeline` ke andar 3 streams hain aur middle wala fail hota hai — baaki do ka kya hota hai?",
  },
  {
    id: "sih-4",
    question:
      "On-the-fly gzip compression ek streaming response mein kaise add karoge? Kya cheezein dhyan mein rakhoge?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Beech mein ek transform stream: `pipeline(source, zlib.createGzip(), res)` aur `Content-Encoding: gzip` header set karo. Dhyan: `Content-Length` mat do (compressed size pehle se pata nahi — chunked transfer), aur already-compressed content (`.jpg`/`.zip`/`.mp4`) ko gzip mat karo (CPU waste, ~0 benefit).",
    detailedAnswer:
      "```javascript\nconst { pipeline } = require('stream/promises');\nconst zlib = require('zlib');\n\nres.writeHead(200, {\n  'Content-Type': 'application/json',\n  'Content-Encoding': 'gzip',\n});\ntry {\n  await pipeline(dbCursorStream, toJsonLines(), zlib.createGzip(), res);\n} catch (err) {\n  res.destroy(err);\n}\n```\n\n`zlib.createGzip()` ek Transform stream hai — plain bytes in, gzip bytes out. Considerations: (1) `Content-Length` hata do — Node chunked transfer encoding use karega. (2) Skip compression for already-compressed types — check `Content-Type`/extension; compressible: `text/*`, `application/json`, `application/javascript`. (3) High throughput par gzip ka CPU cost event loop time kha sakta hai — tab CDN/reverse proxy par offload karo, ya `compression` middleware jo threshold (default 1 KB) ke upar hi compress karta hai. (4) Client `Accept-Encoding: gzip` bhejta hai — usse honor karo, blindly gzip mat karo.",
    followUp: "brotli (`zlib.createBrotliCompress()`) gzip se kab better hai?",
  },
  {
    id: "sih-5",
    question:
      "Kab streaming use NAHI karna chahiye? Kab buffering theek hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Chhote responses (`< ~1 MB` JSON API payloads) — `res.end(JSON.stringify(obj))` simple aur theek. Jab poora data process karne se pehle chahiye (jaise poora JSON parse) — buffer karna hi padega, but size limit ke saath. Chhoti template-rendered HTML pages. Streaming ki nuance (error handling after headers-sent, no `Content-Length`, hard retry) chhote payloads par worth nahi.",
    detailedAnswer:
      "Streaming ka payoff bade/unbounded payloads aur transforms (compress/encrypt/parse) par hai. Chhote, bounded responses par uske downsides overhead ban jaate hain:\n\n- **Error handling nuanced** — headers bhej diye to `500` clean nahi bhej sakte (`if (!res.headersSent)` check).\n- **`Content-Length` pehle se nahi pata** — chunked transfer, kuch clients/proxies isse kam efficiently handle karte hain.\n- **Retry/idempotency mushkil** — half-streamed response resume karna trivial nahi.\n- **Debugging** — partial output, fail point pin karna harder.\n\nBuffer karo jab: response chhota (`<1 MB`), poora object client ko ek saath chahiye, ya tumhe poora payload chahiye transform karne se pehle (with a size limit to avoid DoS). Rule of thumb: JSON API responses buffer; files, exports, media, proxied responses stream.",
    followUp: "Ek endpoint jo DB se 100k rows return karta hai — buffer ya stream, aur kyun?",
  },
];

export default questions;
