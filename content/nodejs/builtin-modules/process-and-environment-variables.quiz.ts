import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "process-and-environment-variables-1",
    question:
      "`process.env.ENABLE_CACHE` ka value string `\"false\"` hai. `if (process.env.ENABLE_CACHE) { ... }` block chalega ya nahi?",
    options: [
      "Nahi chalega — Node `\"false\"` string ko boolean false mein convert kar deta hai",
      "Chalega — `\"false\"` ek non-empty string hai isliye truthy; boolean flags ke liye `=== \"true\"` explicit compare karna chahiye",
      "Error throw hoga kyunki env vars boolean nahi ho sakte",
      "Depends on NODE_ENV",
    ],
    correctIndex: 1,
    explanation:
      "process.env ke saare values strings (ya undefined) hote hain — koi auto-coercion nahi. Non-empty string `\"false\"` JavaScript mein truthy hai, toh `if` block chal jayega. Sahi tareeka: `process.env.ENABLE_CACHE === \"true\"`. Ye ek classic feature-flag bug hai.",
    difficulty: "easy",
  },
  {
    id: "process-and-environment-variables-2",
    question:
      "Ek HTTP request handler ke andar error aane par `process.exit(1)` call karna kyun bura hai?",
    options: [
      "process.exit sirf main module mein allowed hai",
      "Ye process ko turant maar deta hai — pending stdout writes, in-flight DB queries, aur baaki concurrent requests sab beech mein katt jaate hain (data loss, 502s)",
      "Exit code 1 reserved hai, sirf 0 use kar sakte ho",
      "Kuch bura nahi, ye recommended pattern hai",
    ],
    correctIndex: 1,
    explanation:
      "process.exit() event loop ko drain nahi karta — jo bhi async kaam pending hai (buffered logs, DB writes, doosri requests) wo lost ho jaata hai. Error case mein: response bhejo, log karo, zaroorat ho toh `process.exitCode = 1` set karo aur natural drain hone do. `process.exit()` sirf startup validation jaise cases mein OK hai jahan kuch pending hota hi nahi.",
    difficulty: "medium",
  },
  {
    id: "process-and-environment-variables-3",
    question:
      "Kubernetes ek pod ko terminate karte waqt pehle SIGTERM bhejta hai. Agar app SIGTERM handle nahi karti toh?",
    options: [
      "Kubernetes SIGTERM cancel kar deta hai aur pod chalta rehta hai",
      "Node ka default behaviour process ko turant terminate kar deta hai — in-flight requests fail (502) aur DB connections leak ho jaate hain",
      "App automatically graceful shutdown karti hai",
      "Pod restart ho jaata hai bina rukе",
    ],
    correctIndex: 1,
    explanation:
      "Bina `process.on('SIGTERM', ...)` handler ke, Node ka default SIGTERM action process ko terminate karna hai. Isse in-flight HTTP requests adhoori kat jaati hain aur DB pool cleanly close nahi hota. Sahi pattern: SIGTERM pe `server.close()` (naye conns band, existing complete), phir pool/queue drain, phir exit — plus ek timeout-based force-exit safety net. ~30s baad Kubernetes waise bhi SIGKILL bhej deta hai.",
    difficulty: "medium",
  },
  {
    id: "process-and-environment-variables-4",
    question:
      "Production deployment ke liye secrets (DB password, JWT secret) manage karne ka sahi approach kaunsa hai?",
    options: [
      "`.env` file banao, usme secrets rakho, aur git mein commit kar do taaki team ke paas rahe",
      "Secrets code mein constants ki tarah hardcode karo, minified build mein waise bhi dikhega nahi",
      "Orchestrator / secret-manager (Kubernetes secrets, AWS Parameter Store, Vault) se `process.env` mein inject karo; dev mein gitignored `.env` + `.env.example` committed; startup pe required vars validate karke fail-fast",
      "Har developer apne secrets Slack pe share kare",
    ],
    correctIndex: 2,
    explanation:
      "12-factor: config environment se aata hai, code se bahar. Production mein real env vars orchestrator/secret-manager se aate hain (rotation + audit ke saath), dotenv wahan use nahi hota. Dev mein `.env` gitignored, `.env.example` (dummy values) committed. App boot pe required vars ki schema-validation karke missing/invalid pe `process.exit(1)`. Option A/B secrets leak karte hain; option D auditable nahi.",
    difficulty: "easy",
  },
];

export default quiz;
