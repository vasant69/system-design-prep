import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "hnec-1",
    question:
      "`node app.js` chalane par step-by-step kya hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Node process start (V8 + libuv init), file read, code ko CommonJS wrapper function mein wrap (`exports`, `require`, `module`, `__filename`, `__dirname` as params), V8 parse+compile, phir saara top-level synchronous code poora chalta hai. Uske baad `process.nextTick` queue aur microtask (Promise) queue drain hoti hain, aur tab event loop enter hota hai.",
    detailedAnswer:
      "Sequence: (1) process start — V8 initialize, libuv event loop create, `process`/`global` set up. (2) `app.js` disk se sync padhi jaati hai. (3) Module wrap — `(function (exports, require, module, __filename, __dirname) { ...your code... })`. (4) V8 AST -> bytecode. (5) Wrapper function call — saari top-level synchronous lines ek ke baad ek poori chalti hain, koi async callback beech mein nahi. (6) `process.nextTick` queue drain, phir microtask (Promise `.then`/`await`) queue drain. (7) Event loop enter — libuv ka loop phases mein: timers -> pending callbacks -> poll (I/O) -> check (`setImmediate`) -> close callbacks; har phase ke beech `nextTick` + microtasks drain. (8) Loop tab tak chalta hai jab tak koi pending timer, pending I/O callback, ya open handle (listening server, `setInterval`, open socket) hai. (9) Kuch nahi bacha -> auto exit code 0; `process.exit(code)` -> turant forced.\n\nSync-first design isliye taaki setup code (require, config, server create) pura ho jaye isse pehle koi callback interleave kare — warna reasoning namumkin.",
    followUp: "Sync code aur pehle callback ke beech `process.nextTick` aur Promise microtasks mein se kaunsa pehle drain hota hai?",
    redFlag: "\"Node line-by-line chalata hai aur async ke liye rukta hai\" — nahi, saara sync code poora, phir event loop.",
  },
  {
    id: "hnec-2",
    question:
      "CommonJS module wrapper kya hai aur wo kya cheezein enable karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Node tumhari file ke code ko as-is nahi chalata — wo use `(function (exports, require, module, __filename, __dirname) { ... })` mein wrap karta hai. Isse `require`/`module`/`exports`/`__dirname`/`__filename` har file ko milte hain (actually parameters, globals nahi), aur top-level declarations file-scoped rehti hain.",
    detailedAnswer:
      "Teen consequences: (1) `require`, `module`, `exports`, `__filename`, `__dirname` 'magically' available lagte hain, actually wrapper function ke parameters hain — har module ko apna set. (2) Top-level `var`/`function` file-scoped hain, global nahi — browser mein top-level `var` `window` par chipakta hai, Node mein nahi (wrapper ki wajah se). Cross-file sharing ke liye `module.exports`. (3) CommonJS mein top-level `this` `module.exports` ko point karta hai, `global` ko nahi.\n\nESM (`.mjs` ya `\"type\": \"module\"`) mein ye wrapper nahi hota — `import`/`export` static hain, `__dirname`/`__filename` nahi milte (`import.meta.url` use karo), aur top-level `await` allowed hai.",
    followUp: "ESM file mein `__dirname` ka equivalent kya hai?",
  },
  {
    id: "hnec-3",
    question:
      "\"Mera program turant exit ho gaya aur async se kuch print nahi hua\" — kaise debug karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Sync code khatam hone par koi pending async kaam bacha hi nahi — aksar ek `async` entrypoint call kiya gaya lekin uska Promise `await`/`.catch` nahi kiya, aur andar real loop-ref karne wala I/O bhi nahi hai. Fix: entrypoint ko `main().catch((e) => { console.error(e); process.exitCode = 1; })` se drive karo.",
    detailedAnswer:
      "Event loop tab tak zinda rehta hai jab tak koi pending timer, pending I/O callback, ya open handle ho. Common failure:\n\n```javascript\nasync function main() {\n  const data = await fetchStuff();\n  process(data);\n}\nmain(); // Promise ignore kiya\n```\n\nAgar `main` ke andar ki koi cheez reject kare -> silent unhandled rejection. Aur agar timing aisi ho ki loop ko lage kuch pending nahi, process exit ho sakta hai kaam khatam hone se pehle. Fix hamesha:\n\n```javascript\nmain().catch((e) => { console.error(e); process.exitCode = 1; });\n```\n\nESM mein top-level `await` bhi kaam karta hai — module tab tak 'settle' nahi hota. Debug: `--unhandled-rejections=strict` laga ke silent rejections ko crash bana do taaki wo dikhein.",
    followUp: "`process.exit(1)` vs `process.exitCode = 1` — kaunsa aur kyun?",
    redFlag: "\"Async callback background mein chalta rahega chahe main function return kar de\" — nahi, use `await` karo.",
  },
  {
    id: "hnec-4",
    question:
      "Ek CLI script ka kaam ho gaya lekin terminal hang ho gaya. Kya wajah aur kaise pakdoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ek open handle event loop ko ref kar raha hai jo close nahi kiya — `pg.Pool`, Redis client, active `setInterval`, ya listening socket. Fix: `try/finally` mein `pool.end()` / `client.quit()` / `clearInterval()` / `server.close()`. Pakadne ke liye `why-is-node-running` package ya `process.getActiveResourcesInfo()`.",
    detailedAnswer:
      "```javascript\nconst pool = new pg.Pool();\nasync function main() {\n  try {\n    const { rows } = await pool.query('select ...');\n    console.log(rows);\n  } finally {\n    await pool.end(); // warna pool ka socket loop ko ref karta rahega\n  }\n}\nmain().catch((e) => { console.error(e); process.exitCode = 1; });\n```\n\nOpen handles jo hang karate hain: DB pools, Redis/AMQP clients, `setInterval` (bina `clearInterval`), `fs.watch` watchers, listening HTTP servers. Servers ke liye ye behaviour sahi hai; scripts ke liye bug.\n\nDebug: `npm i why-is-node-running`, script ke end mein `log()` call karo — wo print karega kaunse handles zinda hain aur unhe kahan create kiya gaya. Newer Node: `process.getActiveResourcesInfo()`. Last resort `process.exit(0)` hai lekin wo pending stdout/log flush cut kar sakta hai — pehle asli handle close karo.",
    followUp: "`unref()` kya karta hai aur wo kab useful hai?",
  },
  {
    id: "hnec-5",
    question:
      "`process.exit()` ke saath kya problem ho sakti hai? Kab use karna theek hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`process.exit()` process ko turant maar deta hai — agar `stdout` pipe/file par redirect ho (jahan wo async hota hai), buffered output flush hone se pehle cut ho jata hai aur aakhri log lines gayab. Better: `process.exitCode = 1` set karo aur loop ko naturally khatam hone do. `process.exit()` sirf fatal unrecoverable errors ya CLI ke end mein jab pata ho koi output pending nahi.",
    detailedAnswer:
      "Problem cases: (1) `console.log('done'); process.exit(0);` — jab output ek pipe/file par hai, `console.log` async hai; `process.exit` use flush se pehle kaat deta hai. (2) Ek web request handler ke andar `process.exit()` -> poora server gir jata hai, saare in-flight requests drop. (3) 'Script khatam karne' ke liye `process.exit()` — natural exit better hai; agar hang hai to asli open handle close karo, exit se paper mat karo.\n\nTheek hai jab: (a) ek fatal, unrecoverable error jahan aage kuch karna safe nahi; (b) ek CLI jisme kaam done hai aur tum jaante ho koi buffered output pending nahi; (c) signal handlers (`SIGTERM`) mein graceful shutdown ke baad, ek timeout fallback ke saath forced exit. Behtar default: `process.exitCode = 1` set karo, resources `finally` mein close karo, process ko apne aap exit hone do.",
    followUp: "Graceful shutdown (`SIGTERM` par) kaise implement karoge ek HTTP server ke liye?",
    redFlag: "\"`process.exit()` script khatam karne ka normal tareeka hai\" — output truncate ho sakta hai; natural exit prefer karo.",
  },
];

export default questions;
