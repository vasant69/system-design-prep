import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "fhp-1",
    question:
      "`fs.readFileSync`, `fs.readFile`, aur `fs.createReadStream` mein kya farak hai aur kaunsa kab use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`readFileSync` blocking hai — poori file memory mein, thread ruk jaata hai; sirf startup/CLI/scripts mein. `fs.readFile` async hai — event loop free, lekin poori file phir bhi memory mein; chhoti-medium files jo pura chahiye. `createReadStream` chunk-by-chunk async — badi files, ya jab kahin pipe karni ho, ya line-by-line chahiye.",
    detailedAnswer:
      "Decision chaar factors pe: (1) file size — KBs pe koi bhi, GBs pe stream; (2) hot path — har request pe chalega to `Sync` bilkul nahi, ek slow disk read poore server ko freeze karta hai; (3) poori file ek saath chahiye — JSON parse ke liye haan, log scan ke liye nahi; (4) pipe kar rahe ho — file ko `res`/gzip/S3 ko bhej rahe ho to stream, taaki backpressure mile. Mapping: startup config = `readFileSync` (simplest, blocking acceptable, fail-fast); chhota template har request pe = `fs.promises.readFile` + in-memory cache; 500 MB log scan = `readline` over `createReadStream`; 1 GB download = `pipeline(createReadStream, res)`; 2 GB CSV transform = `pipeline(createReadStream, transform, createWriteStream)`.",
    followUp:
      "`fs.readFile` async hai to badi file pe bhi safe hai — sahi ya galat?",
    redFlag:
      "\"Sab jagah readFileSync theek hai kyunki simple hai\" — request handler mein Sync event loop freeze karta hai.",
  },
  {
    id: "fhp-2",
    question:
      "Interviewer: \"100 GB access log se un IPs ki list chahiye jinke 500 errors 1000 se zyada hain. Kaise karoge?\"",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Streaming line-by-line: `readline` over `fs.createReadStream(logPath)`, `for await (const line of rl)`, har line parse karo, ek `Map<ip, count>` maintain karo, end pe count `> 1000` wale filter karo. Memory sirf unique-IP map jitni, file size se independent.",
    detailedAnswer:
      "`fs.readFile` / `readFileSync` yahan impossible — 100 GB memory nahi. Approach:\n\n```javascript\nconst rl = readline.createInterface({\n  input: fs.createReadStream(logPath),\n  crlfDelay: Infinity,\n});\nconst counts = new Map();\nfor await (const line of rl) {\n  if (!line.includes(' 500 ')) continue;\n  const ip = line.split(' ', 1)[0];\n  counts.set(ip, (counts.get(ip) || 0) + 1);\n}\nconst hot = [...counts].filter(([, c]) => c > 1000).map(([ip]) => ip);\n```\n\nMemory = unique IPs ka map (~lakhs of entries = few MB), file kitni bhi badi ho. Agar unique IPs bhi memory mein na aaye to next step: external sort ya map-reduce (file ko shard karo, per-shard count, merge). Bonus points: `createReadStream` ka `highWaterMark` badhana throughput ke liye, ya multiple files ko `Promise`-parallel karna thread pool (4) ke saath.",
    followUp:
      "Agar unique IPs ki ginti itni zyada ho ki `Map` bhi memory mein na aaye, phir kya?",
    redFlag:
      "`fs.readFile` ya `split('\\n')` poori file pe — 100 GB string/array banane ki koshish.",
  },
  {
    id: "fhp-3",
    question:
      "Atomic file write kya hai aur kyun zaroori hai? Pattern likho.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Seedhe target file pe likhte waqt agar process crash ho jaye to file aadhi-likhi corrupt reh jaati hai. Atomic pattern: pehle ek temp file pe poora content likho, phir `fs.rename(tmp, target)` — same filesystem pe rename ek atomic metadata operation hai, to reader ko ya poori purani ya poori nayi file dikhti hai.",
    detailedAnswer:
      "```javascript\nconst fsp = require('node:fs/promises');\nasync function atomicWriteJson(path, obj) {\n  const tmp = `${path}.${process.pid}.${Date.now()}.tmp`;\n  await fsp.writeFile(tmp, JSON.stringify(obj, null, 2));\n  await fsp.rename(tmp, path); // atomic swap on same fs\n}\n```\n\nKyun kaam karta hai: POSIX `rename(2)` same filesystem pe atomic hai — directory entry ek hi step mein naye inode ko point karne lagta hai. Koi bhi reader jo beech mein `path` kholta hai use ya purana complete file milta hai ya naya complete, kabhi half-written nahi. Gotchas: (1) tmp aur target **same filesystem/directory** mein hone chahiye, warna `rename` `EXDEV` dega aur cross-device fallback (copy+unlink) atomic nahi. (2) Extra durability ke liye rename se pehle `filehandle.sync()` (fsync) call karte hain taaki data disk pe flush ho. (3) Windows pe target file agar kisi ne khol rakhi hai to rename fail ho sakta hai.",
    followUp:
      "Docker container mein `/tmp` pe likh ke app-dir mein rename karne se kya dikkat aa sakti hai?",
    redFlag:
      "`fs.writeFile(target, data)` seedha, ya pehle `unlink` phir `writeFile` — dono corruption/missing-file window chhodte hain.",
  },
  {
    id: "fhp-4",
    question:
      "libuv thread pool ka file I/O se kya connection hai? Default size kya hai aur kab badhaoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`fs.readFile`, `fs.createReadStream`, `crypto.pbkdf2`, `dns.lookup` sab libuv ke thread pool pe chalte hain kyunki disk I/O zyadatar OS pe truly async nahi hota. Default size 4. Agar app bahut saare concurrent file/crypto operations karti hai aur wo queue ho ke slow lag rahe hain, `UV_THREADPOOL_SIZE` (max 1024) badhao — ideally CPU cores ke aas-paas.",
    detailedAnswer:
      "Node ka network I/O (sockets) OS ke epoll/kqueue/IOCP se truly async hota hai — thread pool nahi lagta. Lekin file system calls aur kuch CPU-bound crypto/zlib operations ke liye libuv ek background thread pool use karta hai (default 4 threads). Iska matlab: agar tum 100 files ek saath `fs.readFile` karo, sirf 4 ek waqt mein actually padhi ja rahi hain, baaki 96 queue mein. Symptom: file reads ki latency load ke saath badhti hai jabki CPU idle hai. Fix: `UV_THREADPOOL_SIZE` env var process start se pehle set karo (runtime pe change nahi hota reliably), thread pool size roughly available cores ke barabar rakho. Saath hi dhyaan: `dns.lookup` (jo `http` requests karta hai hostname resolve karne ke liye) bhi isi pool pe hai — heavy fs load DNS ko bhi slow kar sakta hai. Alag isolation chahiye to worker threads.",
    followUp:
      "`dns.lookup` aur `dns.resolve` mein se kaunsa thread pool use karta hai aur kaunsa nahi?",
  },
  {
    id: "fhp-5",
    question:
      "`fs.watch` production file-watching ke liye reliable kyun nahi hai? Kya use karoge?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`fs.watch` platform-dependent hai (Linux inotify, macOS FSEvents, Windows ReadDirectoryChangesW) — behaviour alag, ek save pe aksar 2 events, kabhi `filename` `null`, aur network/Docker mounts pe silently kaam nahi karta. Production ke liye `chokidar` library use hoti hai jo ye sab normalize + debounce karti hai.",
    detailedAnswer:
      "Concrete problems: (1) Ek editor save aksar `rename` + `change` do events deta hai (atomic-save editors tmp file rename karte hain), to naive handler do baar reload karega. (2) Recursive watching `{ recursive: true }` sirf macOS/Windows pe supported tha kaafi der tak, Linux pe nahi (Node 20+ mein aaya). (3) `filename` argument kuch platforms pe `null` aata hai — pata hi nahi kaunsi file badli. (4) NFS, SMB, Docker bind mounts, aur kuch cloud filesystems pe inotify events aate hi nahi. (5) Event file-write complete hone se pehle fire ho sakta hai — turant padho to aadhi file milegi (debounce chahiye). `chokidar` in sab ko handle karta hai: debouncing, `awaitWriteFinish` option, consistent event names (`add`/`change`/`unlink`), polling fallback (`usePolling`) network mounts ke liye. Isliye webpack, nodemon, VS Code sab chokidar (ya usse milta-julta) use karte hain, raw `fs.watch` nahi.",
    followUp:
      "chokidar ka `awaitWriteFinish` option kya solve karta hai?",
    redFlag:
      "\"`fs.watch` kaam karta hai, maine dev machine pe test kiya\" — dev macOS/local disk pe theek chalega, prod Linux/mounted volume pe fail hoga.",
  },
];

export default questions;
