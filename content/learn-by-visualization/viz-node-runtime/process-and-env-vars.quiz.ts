import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "process-and-env-vars-1",
    question: "`node app.js serve --port 9000` chalane par `process.argv` kya hota hai?",
    options: [
      '["serve", "--port", "9000"]',
      '["node", "app.js", "serve", "--port", "9000"]',
      '["app.js", "serve", "--port", "9000"]',
      '["--port", "9000"]',
    ],
    correctIndex: 1,
    explanation:
      "`process.argv` ka index 0 hamesha Node binary ka path hota hai, index 1 script ka path, aur uske baad tumhare actual arguments. Isliye apne args nikaalne ke liye `process.argv.slice(2)` use karte hain — yahan wo `[\"serve\", \"--port\", \"9000\"]` dega.",
    difficulty: "easy",
  },
  {
    id: "process-and-env-vars-2",
    question: "`PORT=8080 node app.js` — andar `process.env.PORT` ka type kya hai?",
    options: [
      "number (8080)",
      "string ('8080') — env vars hamesha strings hoti hain",
      "boolean",
      "undefined jab tak `.env` file na ho",
    ],
    correctIndex: 1,
    explanation:
      "`process.env` ki saari values strings hoti hain, chahe tumne number jaisa likha ho. `process.env.PORT` = `\"8080\"`. Agar tum `process.env.PORT > 1024` ya arithmetic karoge to string coercion bugs aayenge — isliye pehle `Number(process.env.PORT)` ya `parseInt(...)` karo. `.env` file khud Node load nahi karta; wo `dotenv` jaisi library ya `node --env-file` karta hai.",
    difficulty: "easy",
  },
  {
    id: "process-and-env-vars-3",
    question: "`process.exit(1)` aur `process.exit(0)` mein kya farak hai, aur risk kya hai?",
    options: [
      "Koi farak nahi, dono process band karte hain",
      "`0` = success, non-zero (`1`) = error/failure signal; `exit()` pending async work (logs, writes) ko beech mein cut kar sakta hai",
      "`1` process ko pause karta hai, `0` resume",
      "`exit()` sirf main thread band karta hai, workers chalte rehte hain hamesha",
    ],
    correctIndex: 1,
    explanation:
      "Exit code convention: `0` = sab theek, non-zero = failure — shell/CI isi se pass/fail decide karte hain. Risk: `process.exit()` turant process kill kar deta hai, buffered `stdout` writes ya pending DB flush adhoore reh sakte hain. Behtar: `process.exitCode = 1` set karo aur natural exit hone do, ya cleanup ke baad exit karo.",
    difficulty: "medium",
  },
  {
    id: "process-and-env-vars-4",
    question: "Graceful shutdown ke liye kaun sa approach sahi hai jab container `SIGTERM` bhejta hai?",
    options: [
      "Kuch mat karo — Node khud DB connections band kar dega",
      "`process.on('SIGTERM', ...)` mein naye requests rokо, in-flight complete hone do, DB/connections close karo, phir exit",
      "`process.exit(0)` turant call kar do signal milte hi",
      "`uncaughtException` handler mein sab handle karo",
    ],
    correctIndex: 1,
    explanation:
      "Orchestrators (Kubernetes, ECS) shutdown se pehle `SIGTERM` bhejte hain. Sahi pattern: signal handler mein server ko naye connections accept karne se roko, chal rahe requests ko finish hone do (timeout ke saath), DB pool aur file handles close karo, phir `process.exit(0)`. Turant `exit` in-flight requests drop karta hai; `uncaughtException` shutdown ke liye galat tool hai (wo unexpected errors ke liye last resort hai).",
    difficulty: "medium",
  },
];

export default quiz;
