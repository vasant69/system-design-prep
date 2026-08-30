import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "wwj-1",
    question:
      "`JSON.parse` aur `JSON.stringify` synchronous hain — iska production mein kya matlab hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Dono poore input pe ek hi blocking pass lagate hain, O(n). Chhote payload pe (KBs) koi dikkat nahi. Lekin ek 100 MB JSON body parse karna ~1-2 seconds ke liye poore event loop ko freeze kar deta hai — us dauraan koi doosri request, timer, ya health check nahi chalta — plus 3-5x memory spike.",
    detailedAnswer:
      "Node single-threaded event loop pe chalta hai. `JSON.parse`/`stringify` V8 ke andar C++ mein implemented hain lekin wo ek synchronous function call hai jo beech mein yield nahi karti. To 100 MB parse ke dauraan: (1) event loop us ek call pe atka hai, saari pending requests queue mein wait karti hain — tail latency spike, load balancer server ko 'unhealthy' maan ke traffic hata sakta hai; (2) memory mein input string (100 MB) + resulting object graph (aksar 2-5x kyunki har key/value alag heap object) — 300-600 MB ka jhatka, GC pressure. `stringify` pe bhi wahi: bade array ko `res.json()` karna block + spike. Isliye bade/unbounded payloads ke liye NDJSON + streaming, `stream-json`, ya worker thread. Chhote payloads (config, normal request body under limit) ke liye plain `JSON.parse` bilkul theek hai.",
    followUp:
      "Agar ek bada JSON blob parse karna unavoidable hai (third-party format, badal nahi sakte), event loop ko kaise bachaoge?",
    redFlag:
      "\"JSON.parse async hai\" ya \"V8 mein hai isliye fast hai, block nahi karta\".",
  },
  {
    id: "wwj-2",
    question:
      "NDJSON kya hai aur ek bade JSON array se behtar kyun hai bade data ke liye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "NDJSON (newline-delimited JSON, aka JSON Lines) = ek file/stream jahan har line ek chhota independent JSON object hai, ek bade `[...]` array ke bajaye. Fayda: line-by-line stream + parse kar sakte ho, memory ek line jitni constant, consumer pehli line milte hi kaam shuru kar deta hai, aur adhoori file bhi useful hai.",
    detailedAnswer:
      "Ek bada JSON array ka matlab: consumer ko poora `[` se `]` tak read karke ek `JSON.parse` chalana padta hai — sab kuch memory mein, ek blocking call. NDJSON mein:\n\n```text\n{\"id\":1,\"amt\":100}\n{\"id\":2,\"amt\":250}\n{\"id\":3,\"amt\":90}\n```\n\nConsumer: `readline.createInterface({ input: createReadStream(file) })`, `for await (const line of rl) { const rec = JSON.parse(line); handle(rec); }`. Har `JSON.parse` chhota (ek record), memory constant, aur processing streaming hai. Isliye ye Elasticsearch bulk API, BigQuery/Redshift loads, `pino` logs, aur kafi data-pipeline tools ka default format hai. Trade-off: aggregate operations (total sum, sort across all records) ko tumhe khud streaming fashion mein karna padta hai; array format mein wo `.reduce()` se free milta. Aur format dono ends ke control mein hona chahiye.",
    followUp:
      "NDJSON stream ke beech mein ek line corrupt aa jaye to tumhara consumer kya kare?",
  },
  {
    id: "wwj-3",
    question:
      "`JSON.parse` ko `try/catch` ke bina call karne mein kya risk hai? Ek example do.",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "`JSON.parse` invalid input pe `SyntaxError` throw karta hai. Agar wo external/untrusted data hai (HTTP body, file, queue message) aur `try/catch` nahi hai, to ek malformed input uncaught exception ban jaata hai — async context mein ye poore process ko crash kar deta hai.",
    detailedAnswer:
      "```javascript\napp.post('/webhook', (req, res) => {\n  const data = JSON.parse(req.rawBody); // no try/catch\n  res.json({ received: data.id });\n});\n```\n\nAgar koi `{ bad json` bhejta hai, `JSON.parse` `SyntaxError: Unexpected end of JSON input` throw karta hai. Express ke sync route handler mein ye 500 de dega (theek), lekin agar parse kisi `setImmediate`/promise/stream callback ke andar hota to `uncaughtException` ban ke process gir jaata. Safe version:\n\n```javascript\nlet data;\ntry {\n  data = JSON.parse(req.rawBody);\n} catch (err) {\n  return res.status(400).json({ error: 'invalid JSON' });\n}\n```\n\nRule: har `JSON.parse` jo external data pe chal raha hai — HTTP body, file content, Kafka/SQS/Redis message — `try/catch` mein wrap karo aur ek clean 4xx/skip do. `JSON.stringify` sirf circular ref ya `BigInt` pe throw karta hai, baaki input pe safe hai.",
    followUp:
      "`express.json()` use kar rahe ho to kya tumhe apne handler mein alag se try/catch chahiye?",
    redFlag:
      "\"parse kabhi fail nahi hoga kyunki frontend hamesha valid JSON bhejta hai\".",
  },
  {
    id: "wwj-4",
    question:
      "`JSON.parse(JSON.stringify(obj))` ko deep clone ke liye use karne mein kya kya toot jaata hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`undefined` values, functions, aur `Symbol` keys drop ho jaate hain; `Date` string ban jaata hai; `Map`/`Set` `{}` ban jaate hain; `NaN`/`Infinity` `null` ban jaate hain; `BigInt` aur circular reference pe to throw hi ho jaata hai. Sirf pure JSON-safe data (plain objects, arrays, numbers, strings, booleans, null) safely clone hota hai.",
    detailedAnswer:
      "```javascript\nconst src = {\n  when: new Date(),\n  missing: undefined,\n  fn: () => 1,\n  tags: new Set([1, 2]),\n  score: NaN,\n};\nconst copy = JSON.parse(JSON.stringify(src));\n// copy = { when: '2026-08-30T...', tags: {}, score: null }\n// missing aur fn gayab; when string; tags empty object; score null\n```\n\nSaath hi ye O(n) synchronous double-pass hai — bade objects pe slow. Modern fix: `structuredClone(obj)` — built-in (Node 17+), `Date`, `Map`, `Set`, `ArrayBuffer`, typed arrays, aur circular references sab handle karta hai (functions aur DOM nodes phir bhi nahi). Chhote pure-data objects ke liye `JSON.parse(JSON.stringify())` still theek hai — zero deps, predictable — lekin default clone tool `structuredClone` hona chahiye.",
    followUp: "`structuredClone` kya clone nahi kar sakta?",
  },
  {
    id: "wwj-5",
    question:
      "Interview: \"Ek reporting API 500 MB ka result set return karti hai aur server periodically hang hota hai. Kya badloge?\"",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Root cause: 500 MB ko ek array mein jama karke `JSON.stringify` + `res.send()` — synchronous, event loop seconds ke liye freeze, 2-5x memory spike. Fix: response ko NDJSON stream banao — DB cursor se row-by-row padho, har row `JSON.stringify` karke ek line likho `res` pe, backpressure ke saath. Ya pagination introduce karo.",
    detailedAnswer:
      "Diagnosis: hang ka period response size ke saath correlate karta hai; `--prof` ya event-loop-lag metric confirm karega ki stall `JSON.stringify` mein hai. Options, preference order mein: (1) **Pagination** — best agar client accept kar le; `?limit=1000&cursor=...`, har page chhota parse/stringify. (2) **NDJSON streaming** — agar client poora dataset chahiye: DB driver ka streaming cursor (`pg` ka `Cursor`, Mongo ka `.cursor()`), `for await (const row of cursor) res.write(JSON.stringify(row) + '\\n')`, `Content-Type: application/x-ndjson`. Memory constant, client incrementally process karta hai. (3) **`fast-json-stringify`** — agar array format zaroori hai aur schema fixed hai, precompiled stringify 2-5x faster, lekin phir bhi ek bada blob — sirf partial relief. (4) **Worker thread** — stringify ko offload karo, main loop free; last resort. Main point interviewer ko: bade payloads ko kabhi ek synchronous parse/stringify + single buffer mein mat handle karo — stream ya paginate.",
    followUp:
      "NDJSON streaming response ke beech mein DB query fail ho jaye (status 200 already bheja ja chuka) — client ko error kaise pata chalega?",
    redFlag:
      "\"RAM badha do server pe\" ya \"gzip laga do\" — gzip CPU aur memory dono pe aur load daalta hai, root cause synchronous stringify hai.",
  },
];

export default questions;
