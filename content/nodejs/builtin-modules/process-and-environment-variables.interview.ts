import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "penv-1",
    question: "Config aur secrets ko Node app mein kaise manage karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "12-factor: config `process.env` se, code mein hardcode kuch nahi. App boot pe required vars ko schema (zod/envalid) se validate karta hoon; missing/wrong type pe `process.exit(1)` clear message ke saath. Dev mein gitignored `.env` (+ `.env.example` committed); production mein vars orchestrator/secret-manager se inject.",
    detailedAnswer:
      "Reasoning: ek immutable build har environment mein chalna chahiye, sirf env alag. Secrets git mein kabhi nahi (rotate karna padta hai + audit break). Flow: (1) first line pe `process.env` ko typed config object mein parse — `PORT` coerce to number, `NODE_ENV` enum, `DATABASE_URL` `.url()`. (2) Invalid/missing → saare errors ikatthe print, `process.exit(1)` — fail fast, half-configured app kabhi live na jaye. (3) Baaki code sirf frozen `config` object import kare, `process.env` directly nahi (testable + typo-proof). (4) Dev: `node --env-file=.env` ya dotenv. Prod: Kubernetes secrets / AWS Parameter Store / Vault — dotenv prod image mein hai hi nahi.",
    followUp: "`process.env` ko directly access karne ke bajaye config object kyun?",
    redFlag: "\".env production mein bhi use karta hoon aur repo mein commit hai\" — secret leak.",
  },
  {
    id: "penv-2",
    question: "Graceful shutdown kaise implement karoge? SIGTERM aane pe kya-kya hota hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`process.on('SIGTERM', ...)` mein: `server.close()` (naye connections refuse, in-flight complete hone do), phir DB pool `.end()` + queues/consumers drain, phir `process.exit(0)`. Plus ek `setTimeout(() => process.exit(1), 10000).unref()` safety net agar cleanup hang ho jaye.",
    detailedAnswer:
      "```javascript\nconst server = app.listen(3000);\nasync function shutdown(sig) {\n  console.log(`${sig} received, draining`);\n  server.close(async () => {\n    await pool.end();\n    await kafka.disconnect();\n    process.exit(0);\n  });\n  setTimeout(() => process.exit(1), 10_000).unref();\n}\n['SIGTERM', 'SIGINT'].forEach((s) => process.on(s, () => shutdown(s)));\n```\n\nKubernetes flow: pod ko endpoints se hataata hai, SIGTERM bhejta hai, ~30s grace period, phir SIGKILL. Bina handler ke Node default SIGTERM pe turant marta hai — 502s + leaked connections. `.unref()` isliye taaki timeout khud process ko alive na rakhe. SIGKILL/SIGSTOP catch nahi hote.",
    followUp: "`setTimeout(...).unref()` mein `.unref()` kya karta hai?",
    redFlag: "\"SIGTERM pe seedha process.exit() — server.close ki zaroorat nahi\".",
  },
  {
    id: "penv-3",
    question: "`process.exit()` aur `process.exitCode = 1` mein kya farak hai? Kab kaunsa?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`process.exit(n)` process ko **turant** terminate karta hai — pending async work (buffered stdout, DB writes, other requests) drop. `process.exitCode = n` sirf exit code set karta hai; process tab exit hota hai jab event loop naturally khali ho, us code ke saath. Prefer exitCode; `exit()` sirf jab kuch pending na ho (startup validation).",
    detailedAnswer:
      "Classic bug: `console.log(bigString); process.exit(0);` — stdout pipe pe ho toh log truncate ho sakta hai kyunki write async flush hota hai aur exit() usse cut kar deta hai. Sahi: kaam khatam karo, `process.exitCode = 1` set karo, functions return karne do — Node event loop empty hote hi us code se exit karega, sab flush hoke. Jayaz `process.exit()` cases: (1) startup config invalid — kuch async pending hai hi nahi; (2) CLI tool ne kaam khatam kiya aur explicit code chahiye aur koi lingering handle nahi. Never inside request handlers.",
    followUp: "Ek script exit hi nahi ho raha (hang), kya check karoge?",
  },
  {
    id: "penv-4",
    question: "`process.env` values ke saath ek common bug batao aur uska fix.",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Sab values strings hote hain. `const port = process.env.PORT` phir `port + 1` → `\"30001\"` (string concat), aur `if (process.env.DEBUG)` `\"false\"` pe bhi truthy. Fix: `Number(process.env.PORT) || 3000` aur `process.env.DEBUG === \"true\"`.",
    detailedAnswer:
      "```javascript\n// BUG\nconst port = process.env.PORT || 3000; // \"8080\" (string) ya 3000 (number) — mixed\nserver.listen(port + 1); // \"8080\" + 1 = \"80801\"\n\n// FIX\nconst port = Number(process.env.PORT) || 3000;\nconst debug = process.env.DEBUG === 'true';\nconst retries = Number.parseInt(process.env.RETRIES ?? '3', 10);\n```\n\nBoolean gotcha: `\"false\"`, `\"0\"`, `\"no\"` sab non-empty strings hain → truthy. Sirf `\"\"` aur `undefined` falsy. Isliye explicit `=== \"true\"`. Production apps `zod`'s `z.coerce.number()` / custom boolean parser se ye centralize karte hain.",
    followUp: "`process.env.PORT` set hai par `\"abc\"` — `Number(\"abc\") || 3000` kya dega?",
    redFlag: "\"env vars automatically typed hote hain agar value number jaisa dikhe\".",
  },
  {
    id: "penv-5",
    question:
      "`process.argv` kya hai? `node app.js --port 4000 file.csv` ke liye iski value kya hogi?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`process.argv` ek string array hai: `[0]` = node binary ka path, `[1]` = script ka path, `[2+]` = user-supplied args. Diye gaye command ke liye: `['/usr/bin/node', '/abs/app.js', '--port', '4000', 'file.csv']`. Real args ke liye `process.argv.slice(2)`.",
    detailedAnswer:
      "Note ki `--port 4000` do alag elements hain (`'--port'`, `'4000'`) — Node koi parsing nahi karta, sab raw strings. Manual parse chhota ho toh theek; warna `node:util`'s `parseArgs`:\n\n```javascript\nimport { parseArgs } from 'node:util';\nconst { values, positionals } = parseArgs({\n  options: { port: { type: 'string', default: '3000' } },\n  allowPositionals: true,\n});\n// values.port === '4000', positionals === ['file.csv']\n```\n\nBade CLIs ke liye `commander` / `yargs` — subcommands, help text, validation built-in.",
    followUp: "`util.parseArgs` aur `commander` mein kab kaunsa choose karoge?",
  },
];

export default questions;
