import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "fs-1",
    question: "fs module ke teen API flavours kaunse hain aur kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Sync (`fs.readFileSync`) — result seedha return, par event loop block; sirf startup/CLI. Callback (`fs.readFile(path, cb)`) — error-first, legacy APIs ke liye. Promises (`fs.promises` / `node:fs/promises`) — async/await, modern default, baaki sab jagah.",
    detailedAnswer:
      "Teeno ek hi kaam karte hain, farak timing aur error handling ka hai. Sync: main thread OS syscall pe block hota hai, koi request/timer/I/O nahi chalta — isliye sirf tab jab concurrency matter nahi karti (server listen se pehle config load, build scripts, CLI tools). Callback: error-first `(err, data)`, Node ke shuru se hai, ab mostly legacy APIs ya jab promisify avoid karna ho. Promises: Node 10+ stable, `try/catch` wapas kaam karta hai, code flat rehta hai — naya code hamesha yahi. Internally async dono (callback + promise) libuv thread pool (default 4) use karte hain; sync nahi.",
    followUp: "Async fs call ke dauraan main thread kya karta hai?",
    redFlag: "\"Farak sirf syntax ka hai\" — asli farak: sync poore process ko rok deta hai.",
  },
  {
    id: "fs-2",
    question: "`fs.existsSync` se pehle check karke phir file padhna — isme kya galat hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "TOCTOU race: check (existsSync) aur use (readFile) ke beech file delete/rename/permission-change ho sakti hai, toh check ke bawajood read fail hoga. Behtar: seedha padho, `err.code === 'ENOENT'` handle karo.",
    detailedAnswer:
      "Time-of-check to time-of-use race condition. Example galat pattern:\n\n```javascript\nif (fs.existsSync(p)) {\n  const data = fs.readFileSync(p); // yahan tak file ja sakti hai -> ENOENT\n}\n```\n\nCheck sirf ek snapshot hai; file system concurrent hai. Sahi:\n\n```javascript\ntry {\n  const data = await fsp.readFile(p, 'utf8');\n} catch (err) {\n  if (err.code === 'ENOENT') return null;\n  throw err;\n}\n```\n\nException: `existsSync` un decisions ke liye theek hai jahan race matter nahi karta — jaise startup pe 'optional config file present hai kya' branch.",
    followUp: "Kaunse err.code aate hain fs operations se?",
    redFlag: "\"existsSync bilkul theek hai, maine hamesha use kiya hai\" — race ko samajhna zaroori hai.",
  },
  {
    id: "fs-3",
    question:
      "Ek 2 GB log file ko process karna hai — line-by-line filter karke naya file likhna. `fs.readFile` kyun galat hai, kya use karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`fs.readFile` poori file (2 GB) RAM mein load karta hai — OOM risk. `fs.createReadStream` + line splitting (ya `readline`) + `fs.createWriteStream`, `pipeline` se connect — constant ~64 KB memory.",
    detailedAnswer:
      "`readFile`/`readFileSync` ki memory cost ≈ file size, plus JSON.parse ho toh usse bhi zyada. 2 GB file process ka RSS 2 GB+ kar degi. Stream approach:\n\n```javascript\nconst { pipeline } = require('node:stream/promises');\nconst rl = require('node:readline').createInterface({\n  input: fs.createReadStream('big.log'),\n});\nconst out = fs.createWriteStream('filtered.log');\nfor await (const line of rl) {\n  if (line.includes('ERROR')) out.write(line + '\\n');\n}\nout.end();\n```\n\nStream ek baar mein ~64 KB (highWaterMark) rakhta hai, backpressure handle hota hai. Rule: known-small file -> readFile; bada/unknown/streaming source -> stream.",
    followUp: "Backpressure kya hai aur pipeline usse kaise handle karta hai?",
  },
  {
    id: "fs-4",
    question:
      "`fs.readFile` callback ke `err` object ka `code` property kya hota hai? Kuch common codes batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`err.code` ek stable short string hai jo failure ka type batata hai — `ENOENT` (file/dir nahi mili), `EACCES` (permission denied), `EEXIST` (file already hai, 'wx' flag ke saath), `EISDIR` (file expected par directory mili), `ENOTDIR`. Branching iss code pe karo, message pe nahi.",
    detailedAnswer:
      "`err.message` Node version aur OS locale ke saath badal sakta hai, isliye us pe `if (err.message.includes(...))` likhna fragile hai. `err.code` ek documented contract hai. Common:\n\n- `ENOENT` — no such file or directory (sabse common)\n- `EACCES` — permission denied\n- `EEXIST` — path already exists (create-exclusive flags)\n- `EISDIR` — file operation par directory mila\n- `ENOTDIR` — path ka koi component file hai jahan dir chahiye tha\n- `EMFILE` — too many open files (fd leak ka signal)\n- `ENOSPC` — no space left on device\n\nPattern: `if (err.code === 'ENOENT') { ... } else throw err;`",
    followUp: "EMFILE aaye toh kya debug karoge?",
  },
  {
    id: "fs-5",
    question:
      "`fs.writeFile` ke `flag` option ke `w`, `a`, `wx` mein kya farak hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`w` — file banao ya (agar hai toh) truncate karke overwrite (writeFile ka default). `a` — file ke end mein append (appendFile ka default). `wx` — file banao, par agar already exist karti hai toh `EEXIST` se fail karo (exclusive create).",
    detailedAnswer:
      "Flags POSIX open(2) se aate hain:\n\n- `w`: create/truncate. `writeFile(p, data)` yahi use karta hai — purana content chala jata hai.\n- `wx`: `w` + `x` (exclusive). Agar `p` maujood hai toh operation `EEXIST` throw karta hai. 'Sirf naya likho, existing overwrite mat karo' ke liye — jaise idempotent upload jahan duplicate id ko reject karna hai.\n- `a`: append. Har write file ke current end pe jata hai. Log lines ke liye. `ax` bhi hai (append + exclusive create).\n- `r+`: read/write without truncate.\n\nAtomic write chahiye toh common trick: temp file pe `w` likho, phir `fs.rename(tmp, final)` — rename atomic hai same filesystem pe.",
    followUp: "Atomic file write kaise karoge taaki reader ko kabhi half-written file na mile?",
    redFlag: "\"writeFile hamesha append karta hai\" — nahi, default `w` truncate karta hai.",
  },
];

export default questions;
