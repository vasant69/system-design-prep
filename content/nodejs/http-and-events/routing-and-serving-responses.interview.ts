import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rsr-1",
    question: "Express ke bina ek small router likho jo GET/POST /users aur /health handle kare, 404 aur 405 ke saath.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`new URL(req.url, base)` se pathname nikalo, `req.method + ' ' + pathname` ko ek route table object mein lookup karo. Match nahi → check karo pathname kisi aur method se match karta hai (→ 405 with Allow header), warna 404. Ek `sendJSON` helper responses consistent rakhta hai.",
    detailedAnswer:
      "```javascript\nfunction sendJSON(res, status, data) {\n  const body = JSON.stringify(data);\n  res.writeHead(status, {\n    'Content-Type': 'application/json; charset=utf-8',\n    'Content-Length': Buffer.byteLength(body),\n  });\n  res.end(body);\n}\n\nconst routes = {\n  'GET /health': (req, res) => sendJSON(res, 200, { status: 'ok' }),\n  'GET /users': (req, res) => sendJSON(res, 200, { users: [] }),\n  'POST /users': (req, res) => sendJSON(res, 201, { created: true }),\n};\n\nhttp.createServer((req, res) => {\n  const url = new URL(req.url, 'http://' + req.headers.host);\n  const key = req.method + ' ' + url.pathname;\n  const handler = routes[key];\n  if (handler) return handler(req, res, url);\n\n  const methods = Object.keys(routes)\n    .filter((k) => k.split(' ')[1] === url.pathname)\n    .map((k) => k.split(' ')[0]);\n  if (methods.length) {\n    res.setHeader('Allow', methods.join(', '));\n    return sendJSON(res, 405, { error: 'method not allowed' });\n  }\n  sendJSON(res, 404, { error: 'not found' });\n}).listen(3000);\n```\n\nInterviewer dekhta hai: `URL` class ka use (manual split nahi), 404 vs 405 ka farak, `Allow` header, aur ek helper se consistency.",
    followUp: "Ab `/users/:id` param support karna ho — object-key lookup se kaise aage badhoge?",
  },
  {
    id: "rsr-2",
    question: "Node se ek static file serve karo. Kaunse teen cheezein zaroor handle karoge?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "(1) Path traversal guard — `path.join` ke baad `resolved.startsWith(rootDir)`, warna `403`. (2) Extension→MIME map se sahi `Content-Type`. (3) `fs.createReadStream(path).pipe(res)` with `stream.on('error')` — `ENOENT`→`404`, baaki→`500`.",
    detailedAnswer:
      "```javascript\nconst url = new URL(req.url, 'http://' + req.headers.host);\nconst rel = path.normalize(decodeURIComponent(url.pathname)).replace(/^([.][.][/\\\\])+/, '');\nconst filePath = path.join(PUBLIC_DIR, rel === '/' ? 'index.html' : rel);\n\nif (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }\n\nconst stream = fs.createReadStream(filePath);\nstream.on('open', () => {\n  res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });\n  stream.pipe(res);\n});\nstream.on('error', (err) => {\n  res.writeHead(err.code === 'ENOENT' ? 404 : 500);\n  res.end();\n});\n```\n\nKyun stream: ek 1 GB file bhi `~64 KB` constant memory mein jaati hai, aur `pipe` backpressure handle karta hai. Kyun `open` event par headers: agar file khulti hi nahi, hum abhi tak headers nahi bheje, toh error branch cleanly `404`/`500` de sakti hai. Production mein ye kaam aksar nginx/CDN karta hai (sendfile, range requests, ETag caching).",
    followUp: "Byte-range request (`Range: bytes=0-1023`) — video seeking ke liye — kaise support karoge?",
    redFlag: "Path traversal guard chhod dena — ye ek serious security hole hai, interview mein automatic red flag.",
  },
  {
    id: "rsr-3",
    question: "404 aur 405 mein kya farak hai? Client ke liye ye farak kyun matter karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`404 Not Found` — resource/path exist hi nahi karta. `405 Method Not Allowed` — path exist karta hai lekin us HTTP method ke liye nahi (e.g. `/users` par `GET`/`POST` hai par `DELETE` nahi); response mein `Allow` header valid methods list karta hai. Farak API consumers ko batata hai ki path galat hai ya sirf method.",
    detailedAnswer:
      "Practical impact: ek client jo `405` dekhta hai wo samajh jata hai ki endpoint sahi hai, bas usne galat verb use kiya — retry with correct method. `404` par wo path/URL debug karega. Agar tum dono cases mein `404` dete ho, method-related bug diagnose karna mushkil ho jata hai, aur API tooling (OpenAPI clients, HTTP caches) galat assumptions banate hain. Spec (RFC 7231) `405` ke saath `Allow` response header ko mandatory batata hai. Similarly `501 Not Implemented` (method server samajhta hi nahi) aur `403 Forbidden` (path hai, method hai, par tumhe permission nahi) — inhe alag rakhna clean API design hai.",
    followUp: "`OPTIONS` request aur CORS preflight ka isse kya connection hai?",
  },
  {
    id: "rsr-4",
    question: "Object-key route table (`routes['GET /users']`) ka lookup Express ke regex router se kaise alag hai? Trade-off?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Object-key lookup `O(1)` hash lookup hai — tez, simple, par sirf exact static paths match karta hai; `/users/:id` jaise params impossible. Express har route ko regex mein compile karke layers ko order mein try karta hai (`O(n)` in worst case) — dheema par params, wildcards, optional segments, nested routers support karta hai. Fastify radix tree use karta hai — `O(k)` (k = path length) plus params.",
    detailedAnswer:
      "Static exact-match apps ke liye object-key sabse fast aur readable hai. Jaise hi tumhe `/orders/:orderId/items/:itemId` chahiye, tum ya toh har request par regex banao (ganda) ya ek proper router library (`find-my-way`) use karo. Express ka linear layer scan chhote apps mein negligible hai par 200+ routes wale monoliths mein measurable — isliye high-throughput services Fastify (radix/prefix tree) pasand karte hain, jahan lookup cost route count se independent hota hai. Decision: exact static routes + performance-critical + minimal deps → object table; params/middleware/growth expected → Express; both params aur top-tier throughput → Fastify.",
    followUp: "Radix tree router `/users/:id` aur `/users/me` dono hone par kaunsa match karta hai aur kyun?",
  },
  {
    id: "rsr-5",
    question:
      "Ek project mein tumne routing khud likha instead of Express. Interviewer poochhta hai kyun — kya answer doge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "\"Ye ek internal metrics sidecar tha — 3 GET endpoints, koi params nahi, koi middleware nahi. `switch` on `req.method + url.pathname` + ek `sendJSON` helper 40 lines ka tha. Express ek dependency tree aur startup cost laata bina benefit ke. Humari public API — 50+ routes, `:id` params, JWT middleware, validation — wahan humne Fastify liya.\"",
    detailedAnswer:
      "Achha answer scope-matching dikhata hai. Points: (1) Route count aur shape — 3-5 static routes vs 50 routes with params. (2) Cross-cutting concerns — sidecar mein na auth thi na CORS na rate limiting; jahan wo sab chahiye, framework pipeline justify hota hai. (3) Operational — sidecar ko chhota, fast-cold-start, minimal-attack-surface rakhna tha. (4) Team — internal tool ek engineer maintain karta tha; public API poori team, toh known framework conventions better. Interviewer ye sunna chahta hai ki tum \"hamesha Express\" ya \"framework kabhi nahi\" jaisa dogma nahi rakhte — tum har service ke liye context (routes, middleware, team, perf) weigh karte ho.",
    followUp: "Agar wahi sidecar aage grow karke 15 routes tak pahunch jaye, tum kab migrate karoge aur kaise?",
    redFlag: "\"Express bloated hai, main hamesha raw http likhta hoon\" — 50-route API raw http mein maintain karna ek maintenance aur security burden hai.",
  },
];

export default questions;
