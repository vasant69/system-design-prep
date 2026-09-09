import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pev-1",
    question: "`process` object kya hai? Kuch commonly used properties batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`process` ek global hai jo chal rahe Node process ko represent karta hai. Common: `process.argv` (CLI args), `process.env` (env vars), `process.cwd()` (working dir), `process.pid`, `process.version`/`process.platform`, `process.stdin`/`stdout`/`stderr`, aur events jaise `exit`, `SIGINT`, `SIGTERM`, `uncaughtException`, `unhandledRejection`.",
    detailedAnswer:
      "`process` bina `require` ke har module mein available hai. Kaam: (1) Input — `process.argv` (array, index 2 se tumhare args), `process.env` (config/secrets object, saari values strings). (2) Info — `process.cwd()`, `process.pid`, `process.uptime()`, `process.memoryUsage()`, `process.version`. (3) I/O — `process.stdout.write(...)` (jo `console.log` internally use karta hai), `process.stdin` streams. (4) Control — `process.exit(code)`, `process.exitCode`, `process.nextTick(fn)`. (5) Lifecycle events — `process.on('SIGINT', ...)` Ctrl+C ke liye, `'SIGTERM'` orchestrator shutdown ke liye, `'exit'` final sync cleanup, `'uncaughtException'`/`'unhandledRejection'` last-resort error logging.",
    followUp: "`process.nextTick` aur `setImmediate` mein kya farak hai?",
    redFlag: "\"`process` ko `require('process')` karna zaroori hai\" — wo global hai (though require bhi kaam karta hai).",
  },
  {
    id: "pev-2",
    question: "App config aur secrets kaise manage karoge Node app mein?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Sab kuch `process.env` se padho — code mein kuch hardcode nahi. Local dev mein `.env` file + `dotenv` (ya `node --env-file`); prod mein platform ke env vars / secret manager. Startup pe required vars validate karo aur missing hone pe fail fast.",
    detailedAnswer:
      "Principle: 12-factor 'config in the environment'. Same build artifact har environment mein chale, sirf env vars badle. Practically: (1) Ek `config.js` module jo `process.env` ko read karke ek typed object export kare, defaults aur validation ke saath — `const PORT = Number(process.env.PORT ?? 3000);`. (2) Missing critical vars (DB URL, API keys) pe startup pe hi `throw` — runtime pe surprise nahi. (3) Secrets kabhi repo mein nahi; `.env` ko `.gitignore` mein, aur `.env.example` mein sirf keys (values nahi). (4) Type cast — env values strings hain, `Number(...)`/`=== \"true\"` se convert karo. (5) Prod mein AWS Secrets Manager / Vault / platform config se inject, plain files nahi.",
    followUp: "`process.env.DEBUG` ko boolean ki tarah `if (process.env.DEBUG)` check karne mein kya bug ho sakta hai?",
    redFlag: "\"Config ko ek JS file mein rakh dete hain jisme API keys likhi hoti hain, repo mein commit.\"",
  },
  {
    id: "pev-3",
    question:
      "`if (process.env.FEATURE_X)` se feature flag check kar rahe ho. `FEATURE_X=false` set karne pe feature phir bhi ON hai. Kyun?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`process.env` values strings hain. `\"false\"` ek non-empty string hai, jo truthy hoti hai — to `if` block chalta hai. Explicit check chahiye: `process.env.FEATURE_X === \"true\"`.",
    detailedAnswer:
      "Env vars kabhi boolean nahi hote — hamesha string ya `undefined`. `FEATURE_X=false` ka matlab `process.env.FEATURE_X === \"false\"` (7-char string). JavaScript mein `\"false\"`, `\"0\"`, `\"no\"` sab truthy hain (sirf `\"\"` falsy hai). Isliye `if (process.env.FEATURE_X)` `\"false\"` pe bhi true. Fix: `const enabled = process.env.FEATURE_X === \"true\";` ya ek helper `const bool = (v) => v === \"true\" || v === \"1\";`. Yehi bug numeric compares mein bhi: `process.env.PORT > 1024` string comparison karta hai.",
    followUp: "Number env var (`MAX_CONN=10`) ko safely kaise parse karoge, invalid input handle karke?",
    redFlag: "\"JavaScript automatically string ko boolean bana deta hai\" — nahi, non-empty string truthy hai.",
  },
  {
    id: "pev-4",
    question:
      "Production Node service ko Kubernetes restart kar raha hai. In-flight requests drop ho rahe hain. Graceful shutdown kaise karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`process.on('SIGTERM')` handler add karo: HTTP server ko `server.close()` se naye connections rokо, chal rahe requests ko finish hone do (ek timeout ke saath), DB pool / message queue connections gracefully close karo, phir `process.exit(0)`. Health check ko bhi turant 'not ready' karo taaki LB traffic hata le.",
    detailedAnswer:
      "Kubernetes pod terminate karte waqt `SIGTERM` bhejta hai, phir grace period (default 30s) ke baad `SIGKILL`. Steps: (1) `SIGTERM` (aur `SIGINT` local dev) sun-ne ke liye handler. (2) Readiness probe ko fail karao ya `Connection: close` bhejo — load balancer naya traffic band kar dega. (3) `server.close(cb)` — ye naye connections accept nahi karta par existing ko drain hone deta hai; `cb` tab chalta hai jab sab done. (4) Ek `setTimeout(() => process.exit(1), 10000).unref()` safety net — agar requests hang ho to bhi process nikal jaaye. (5) DB/Redis/Kafka clients ke `.end()`/`.disconnect()` call karo, pending writes flush. (6) Sab clean hone pe `process.exit(0)`. Idempotent banao — do signals aa sakte hain. `process.exit()` seedhe call karna (bina drain) hi wo bug hai jo requests drop karta hai.",
    followUp: "`server.close()` hang kyun kar sakta hai, aur keep-alive connections ka isme kya role hai?",
  },
];

export default questions;
