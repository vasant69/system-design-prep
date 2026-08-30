import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rro-1",
    question: "Node mein (bina framework ke) ek POST request ka JSON body kaise padhoge? Poora likho.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`req` readable stream hai. `req.on('data')` par Buffer chunks collect karo ek byte-counter ke saath (MAX_BODY cap), `req.on('end')` par `Buffer.concat().toString('utf8')` phir `JSON.parse` `try/catch` mein. Limit cross → `413` + `req.destroy()`; invalid JSON → `400`.",
    detailedAnswer:
      "```javascript\nconst MAX_BODY = 1_000_000;\n\nfunction readJson(req, res, cb) {\n  let size = 0;\n  const chunks = [];\n  req.on('data', (chunk) => {\n    size += chunk.length;\n    if (size > MAX_BODY) {\n      res.writeHead(413, { 'Content-Type': 'application/json' });\n      res.end(JSON.stringify({ error: 'payload too large' }));\n      req.destroy();\n    } else {\n      chunks.push(chunk);\n    }\n  });\n  req.on('end', () => {\n    if (res.writableEnded) return;\n    try {\n      cb(null, JSON.parse(Buffer.concat(chunks).toString('utf8')));\n    } catch {\n      res.writeHead(400, { 'Content-Type': 'application/json' });\n      res.end(JSON.stringify({ error: 'invalid JSON' }));\n    }\n  });\n  req.on('error', () => {\n    if (!res.writableEnded) { res.writeHead(400); res.end(); }\n  });\n}\n```\n\nKey points jo interviewer sunna chahta hai: (1) body stream hai, property nahi; (2) hard size limit warna DoS; (3) `JSON.parse` guarded; (4) `req.on('error')` for mid-upload disconnect; (5) `res.writableEnded` guard taaki double-response na ho.",
    followUp: "Isko ek Promise-returning helper mein kaise badloge taaki `await readJson(req)` likh sako?",
    redFlag: "Size limit ka zikr na karna, ya `JSON.parse` ko unguarded chhodna.",
  },
  {
    id: "rro-2",
    question: "`req` aur `res` streams hain — iska practically kya matlab hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`req` readable stream (`IncomingMessage`) hai — body chunk-by-chunk aati hai, isliye tum use pipe kar sakte ho (`req.pipe(fs.createWriteStream(dest))`) bina poora memory mein liye. `res` writable stream (`ServerResponse`) hai — `res.write()` se incremental data bhej sakte ho, `res.end()` close karta hai, aur backpressure respect hota hai.",
    detailedAnswer:
      "Kyunki dono streams hain, ek bada file download bina server RAM khaye ho sakta hai: `fs.createReadStream(file).pipe(res)` — Node source ki read speed ko socket ki write speed se match karta hai (backpressure). Ulta, upload: `req.pipe(fs.createWriteStream('out'))`. Beech mein transform daal sakte ho: `req.pipe(zlib.createGunzip()).pipe(writeStream)`. Agar tum `res.write` se pehle `res.writeHead` nahi karte toh pehla `write` implicit `200` + default headers bhej deta hai. Streams hone ki wajah se `res` par `'finish'` (sab data flush ho gaya) aur `'close'` (connection band, shayad prematurely) events milte hain — ye graceful cleanup ke liye useful hain.",
    followUp: "`res.write()` `false` return kare toh iska kya matlab hai aur tum kya karoge?",
  },
  {
    id: "rro-3",
    question: "`Content-Type` header galat ya missing ho toh kya bigadta hai? Ek concrete example do.",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Client bytes ko galat interpret karta hai. `JSON.stringify(obj)` bhejna bina `application/json` ke — kuch clients ise plain text maankar treat karte hain aur `response.json()` fail hota hai. HTML ko `text/plain` se bhejna — browser tags render nahi karega. Ulta, user input ko `text/html` se echo karna — stored/reflected XSS.",
    detailedAnswer:
      "`Content-Type` hi single source of truth hai bytes ke meaning ka. Examples: (1) Ek API `res.end(JSON.stringify(data))` karti hai bina header ke; ek strict HTTP client (ya `fetch(...).then(r => r.json())`) content-type check karke ya toh reject karta hai ya `text/plain` maan leta hai — intermittent bugs. Fix: `res.setHeader('Content-Type', 'application/json')`. (2) Ek endpoint user-submitted comment ko `res.end(comment)` se wapas bhejta hai with `Content-Type: text/html` — agar comment `<script>` hai toh wo execute hoga (reflected XSS). Fix: `text/plain` bhejo ya HTML-escape karo. (3) File download par `Content-Type: application/octet-stream` + `Content-Disposition: attachment; filename=...` na dena — browser file ko inline dikhane ki koshish karta hai. Rule: jo bytes bhej rahe ho unka exact type declare karo, aur user-controlled content kabhi `text/html` se as-is mat bhejo.",
    followUp: "`X-Content-Type-Options: nosniff` header kya karta hai aur kyun lagate hain?",
    redFlag: "\"Content-Type optional hai, client khud figure out kar leta hai\" — sniffing unreliable aur security risk hai.",
  },
  {
    id: "rro-4",
    question:
      "Ek POST handler mein tum body kabhi read nahi karte (na data, na pipe, na resume). Kya hota hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "`req` stream 'paused' rehta hai. Incoming body bytes socket/OS buffers mein jamaa hote hain, TCP flow control kick karta hai, aur connection eventually `requestTimeout` par cut ho jata hai. Agar body chahiye hi nahi toh `req.resume()` (ya `req.destroy()`) se stream ko drain/close karo.",
    detailedAnswer:
      "Readable stream by default flowing mode mein nahi hota jab tak koi `'data'` listener na lage ya `pipe`/`resume` na ho. Agar handler sirf `res.end('ok')` karke chala jata hai bina `req` ko touch kiye, to client jo body bhej raha hai wo consume nahi hota. Chhote bodies OS buffer mein fit ho jate hain aur kisi ko pata nahi chalta, lekin bade bodies par: socket write blocked, client hang, aur Node ka `server.requestTimeout` (v18+ default 5 min) us request ko error karke socket destroy karta hai. HTTP/1.1 keep-alive ke saath ye aur bura — half-read body agli request ke framing ko corrupt kar sakta hai agar connection reuse ho. Safe pattern: agar body ignore karni hai, `req.resume()` call karke use drain kar do, phir response bhejo.",
    followUp: "Express mein `express.json()` lagane ke baad bhi agar route body use nahi karta, kya wo consume ho jati hai?",
  },
  {
    id: "rro-5",
    question:
      "Production mein tum manual body parsing likhoge ya `express.json()` / Fastify use karoge? Kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Production mein library. `express.json({ limit })` ya Fastify ka schema-based parsing — inme size limit, charset/encoding handling, `Content-Type` matching, aur error-to-400 mapping already sahi se implement hai. Manual parsing sirf tab jab koi dependency add nahi karni ho (single tiny endpoint) ya learning ke liye.",
    detailedAnswer:
      "Manual parsing correct likhna asaan lagta hai par edge cases bahut hain: `charset` header (utf-8 vs latin1), `Content-Encoding: gzip` body, `Content-Length` vs chunked transfer mismatch, empty body, `Content-Type` with parameters (`application/json; charset=utf-8`), aur DoS limits. `raw-body` (jo Express use karta hai) ye sab handle karta hai. Fastify ek step aage — JSON schema se body validate + fast serialize karta hai, `req.body` typed milta hai. Toh decision: (1) full app / multiple endpoints → framework parser, no question. (2) Ek webhook receiver, zero-dependency requirement → manual, but limit + try/catch + error event zaroor. (3) File uploads → `busboy`/`multer`, kabhi manual multipart nahi. Interview mein ye batao ki tum wheel reinvent nahi karte jab battle-tested option ho, lekin tumhe pata hai andar kya ho raha hai.",
    followUp: "`express.json()` ki default limit kya hai aur usse badalna kyun padta hai?",
    redFlag: "\"Main hamesha khud parse karta hoon, libraries bloated hain\" — ye edge cases aur DoS surface ko ignore karna hai.",
  },
];

export default questions;
