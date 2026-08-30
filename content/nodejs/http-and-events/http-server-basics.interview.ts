import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "hsb-1",
    question:
      "Express ke bina, sirf Node core se, ek HTTP server likho jo `/` par 'Hello' aur `/health` par JSON de.",
    type: "coding",
    difficulty: "beginner",
    shortAnswer:
      "`http.createServer((req, res) => {})` use karo, `req.url` aur `req.method` check karke branch karo, har branch mein `res.writeHead(status, headers)` + `res.end(body)`, phir `server.listen(3000)`.",
    detailedAnswer:
      "```javascript\nconst http = require('http');\n\nconst server = http.createServer((req, res) => {\n  if (req.method === 'GET' && req.url === '/health') {\n    res.writeHead(200, { 'Content-Type': 'application/json' });\n    return res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));\n  }\n  if (req.method === 'GET' && req.url === '/') {\n    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });\n    return res.end('Hello\\n');\n  }\n  res.writeHead(404, { 'Content-Type': 'text/plain' });\n  res.end('Not Found\\n');\n});\n\nserver.on('error', (err) => {\n  if (err.code === 'EADDRINUSE') console.error('Port 3000 busy');\n});\n\nserver.listen(3000, () => console.log('listening on 3000'));\n```\n\nDhyaan dene layak: har branch ke baad `return` (warna double response), `Content-Type` har response par, aur `server.on('error')` taaki port busy hone par clean message mile.",
    followUp:
      "Ab isme POST body padhni ho `/health` par — kya change karoge? (Hint: req ek stream hai.)",
    redFlag:
      "`req.body` ko directly use karne ki koshish — raw `http` mein aisa koi property nahi hoti, wo Express + body-parser ka kaam hai.",
  },
  {
    id: "hsb-2",
    question: "Express internally kya karta hai? Wo Node ke http module se kaise related hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Express app ek request handler function hai jo `http.createServer(app)` ko pass hota hai (ya `app.listen` internally yahi karta hai). Har request par Express apna router chalata hai, middleware chain execute karta hai, aur `req`/`res` ke prototypes par helper methods (`res.json`, `req.params`) add karta hai.",
    detailedAnswer:
      "Base layer wahi rehta hai: `req` ek `http.IncomingMessage`, `res` ek `http.ServerResponse`. Express in par kuch nahi replace karta — bas prototype extend karta hai. Flow: `app.listen(3000)` -> `http.createServer(this).listen(3000)` -> har `request` event par Express ka top-level handler chalta hai -> wo middleware stack ko `next()` callbacks se iterate karta hai -> route match hone par tumhara handler chalta hai. `res.json(obj)` internally `res.setHeader('Content-Type', 'application/json')` + `res.end(JSON.stringify(obj))` hi karta hai. Isliye raw `http` samajhna Express ka har 'magic' demystify kar deta hai — routing, body parsing, error handling sab userland code hai jo isi ek handler ke andar chalta hai.",
    followUp: "Middleware chain mein `next()` na call karo toh kya hota hai?",
  },
  {
    id: "hsb-3",
    question:
      "`http`, `https`, aur `http2` mein kya farak hai? Production mein kaunsa use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`http` plain-text, TLS nahi. `https` same API but TLS cert (`key`+`cert`) chahiye. `http2` multiplexing (ek connection, parallel streams), header compression, server push deta hai — API thoda alag (`stream` events). Production mein aksar TLS/HTTP2 ko load balancer terminate karta hai aur Node ke paas plain `http` aata hai.",
    detailedAnswer:
      "Detail: `https.createServer({ key, cert }, handler)` — baaki `req`/`res` bilkul `http` jaisa. `http2.createSecureServer(opts, handler)` — HTTP/2 ke saath ek TCP connection par kai concurrent request/response streams chal sakti hain, jisse head-of-line blocking kam hota hai aur connection overhead ghatta hai. Practical production setup: ek reverse proxy / cloud load balancer (Nginx, ALB, Cloudflare) TLS aur HTTP/2 handle karta hai, internal network par Node ko plain `http` deta hai — isse cert rotation, TLS tuning aur HTTP/2 sab infra layer par centralize ho jata hai aur Node process simple rehta hai. Direct-to-Node TLS tab karte ho jab beech mein koi proxy na ho (chhota deployment, edge function).",
    followUp: "TLS ko load balancer par terminate karne ka ek downside kya hai?",
    redFlag:
      "Ye kehna ki `http2` ko certificate kabhi nahi chahiye — browsers practically HTTP/2 sirf HTTPS ke upar karte hain.",
  },
  {
    id: "hsb-4",
    question:
      "Server object ko EventEmitter kehte hain — konse events tumhe pata hone chahiye aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`request` (har HTTP request — yahi handler hai), `connection` (har naya TCP socket), `close` (server band hua), `error` (bind fail jaise `EADDRINUSE`), `clientError` (malformed request bytes). `error` handle na karo toh crash; `clientError` handle na karo toh malformed request noisy logs deta hai.",
    detailedAnswer:
      "`http.Server` `net.Server` se aur wo `EventEmitter` se extend hai. Important events:\n\n- `request` (req, res): parsed HTTP request — `createServer(fn)` isi ko subscribe karta hai.\n- `connection` (socket): naya TCP connection; keep-alive ke saath ek `connection` par kai `request` aate hain.\n- `close`: `server.close()` ke baad, jab saare connections khatam.\n- `error` (err): mostly `listen` fail — `EADDRINUSE` (port busy), `EACCES` (privileged port). Listener na ho toh process crash.\n- `clientError` (err, socket): client ne garbage bytes bheje headers parse hone se pehle — yahan tum `socket.end('HTTP/1.1 400 Bad Request\\r\\n\\r\\n')` bhej sakte ho.\n\nInterview point: `req` aur `res` khud bhi EventEmitters/streams hain — `req.on('data')`, `req.on('end')`, `res.on('finish')`, `res.on('close')`. Poora `http` module event-driven design ka textbook example hai.",
    followUp: "keep-alive ke saath ek `connection` par kai `request` — isse graceful shutdown mushkil kyun ho jata hai?",
  },
  {
    id: "hsb-5",
    question:
      "Kab raw `http` server use karna theek hai aur kab framework? Ek real decision batao.",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Raw `http`: 1-2 endpoints, koi routing/middleware/body-parsing nahi, dependency kam rakhni ho — jaise health-check sidecar, webhook receiver, tiny proxy, load-test target. Framework: 10+ routes, params, auth, validation, team consistency chahiye — Express/Fastify.",
    detailedAnswer:
      "Decision problem ke shape se aata hai. Ek webhook receiver jo ek POST leke payload ko queue mein daalta hai — yahan Express ek dependency tree laata bina benefit ke, toh raw `http` 30 lines mein kaafi hai aur cold start fast rehta hai. Lekin humari main REST API — 40+ routes, JWT auth, request validation, consistent error format — yahan sab haath se likhna weeks ka kaam aur bug-prone hai; humne Fastify liya kyunki routing + JSON schema validation + fast serialization ka real value tha. Middle ground: internal admin tool jahan 5-6 routes hain — Express theek hai, learning curve zero. Interviewer sunna chahta hai ki tum 'hamesha X' nahi bolte, balki trade-off (control vs boilerplate vs consistency) weigh karte ho.",
    followUp: "Fastify ko Express ke upar kyun chunoge — do concrete reasons?",
    redFlag:
      "\"Hamesha Express use karo\" ya \"framework kabhi mat use karo\" — dono dogmatic; context (route count, team, throughput) hi decide karta hai.",
  },
];

export default questions;
