import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "depsdev-1",
    question: "dependencies aur devDependencies mein kya farak hai? Kuch examples do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "dependencies wo packages hain jo deployed, running production process ko chahiye — express, pg, zod, jsonwebtoken. devDependencies wo hain jo sirf build, test, ya lint ke liye chahiye — typescript, jest, eslint, prettier, nodemon, @types/*. Decision rule: kya running production process ise import/require karega?",
    detailedAnswer:
      "`npm install <pkg>` default `dependencies` mein daalta hai; `npm install -D <pkg>` (ya `--save-dev`) `devDependencies` mein. Local development mein `npm install` (bina flag) dono buckets laata hai, isliye dono available rehte hain. Production deploy `npm ci --omit=dev` chalata hai jo sirf `dependencies` laata hai. dependencies ke examples: web framework (express/fastify), DB driver/ORM (pg, mysql2, mongoose, @prisma/client), runtime utils (zod, dayjs, bcrypt, axios, dotenv agar prod .env load karta hai). devDependencies: compilers/bundlers (typescript, webpack, esbuild, vite), test tooling (jest, vitest, supertest), lint/format (eslint, prettier), dev helpers (nodemon, ts-node), aur saare `@types/*` packages (compiled JS mein type nahi rehta).",
    followUp: "@types/express kaunse bucket mein aur kyun?",
    redFlag: "\"Dono ek jaise hain, bas npm install sab le aata hai\" — prod install --omit=dev ki samajh na hona.",
  },
  {
    id: "depsdev-2",
    question: "Production Docker image chhoti kaise banaoge ek Node app ke liye? devDependencies ka isme kya role hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Multi-stage build. Build stage mein `npm ci` (saari deps) chala ke `npm run build` (tsc/bundle) karo. Runtime stage mein fresh slim base pe `npm ci --omit=dev` (sirf dependencies) karo, aur build stage se sirf `dist/` copy karo. Final image mein typescript, jest, eslint, @types/* kuch nahi — chhoti image, kam attack surface.",
    detailedAnswer:
      "```dockerfile\nFROM node:20 AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-slim AS runtime\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY --from=build /app/dist ./dist\nCMD [\"node\", \"dist/index.js\"]\n```\n\nKey points: (1) build stage ko poori toolchain chahiye — `npm ci` sab laata hai. (2) runtime stage ek naya layer set hai; wahan `--omit=dev` sirf `dependencies` laata hai. (3) `COPY --from=build` sirf compiled output uthata hai, source aur node_modules build ka nahi. Real impact: ek BFSI API mein 380MB -> 190MB, aur `npm audit --omit=dev` ki vuln count aadhi kyunki dev tooling ke CVEs image mein hi nahi rahe. Agar `typescript` galti se `dependencies` mein hota, toh `--omit=dev` bhi use laata aur ye saving nahi milti.",
    followUp: "Agar app runtime pe native addon (jaise bcrypt) use karti hai jo compile hota hai, multi-stage mein kya dhyan rakhna hoga?",
  },
  {
    id: "depsdev-3",
    question: "`npm install` aur `npm ci --omit=dev` different trees dete hain — galat dependency classification local mein kyun nahi pakdi jati?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Local `npm install` (aur CI ka default install) dono buckets laata hai, isliye ek runtime dep jo galti se devDependencies mein hai wo local aur CI dono jagah present rehti hai aur sab chalta hai. Wo tabhi missing hoti hai jab production `npm ci --omit=dev` chalata hai. Fix: CI mein ek dedicated job `npm ci --omit=dev && node dist/index.js` (ya smoke test) chalao.",
    detailedAnswer:
      "Classic scenario: `dotenv` ya `pg` ko `-D` se install kar diya. Development: `npm install` -> dependencies + devDependencies dono -> `require('pg')` chalta hai. CI test job: usually `npm ci` (bina --omit) -> dono buckets -> tests pass. Production: `npm ci --omit=dev` -> sirf `dependencies` -> `pg` absent -> app boot pe `Cannot find module 'pg'` -> outage. Ulta bug bhi hota hai: `typescript`/`webpack` `dependencies` mein -> prod image bloat, badi attack surface, koi runtime fayda nahi. Dono ko pakadne ka tareeka: (a) CI mein prod-parity stage — `npm ci --omit=dev` phir actual start/smoke test; (b) `npm ls --omit=dev` se dekho prod tree mein kya jaayega; (c) code review mein har naye dependency ka bucket check. Local testing par bharosa mat karo — wo galat bucket ko mask kar deta hai.",
    followUp: "Ek CI job kaise likhoge jo dono direction ke misclassification pakde?",
    redFlag: "\"Local pe chal raha hai toh classification sahi hai\" — --omit=dev ke bina misfiled runtime dep dikhta hi nahi.",
  },
  {
    id: "depsdev-4",
    question: "optionalDependencies kya hai aur ye normal dependencies se kaise alag behave karti hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "optionalDependencies wo hain jinka install fail ho jana acceptable hai — npm error nahi karta, chup-chaap skip kar deta hai aur exit code 0 rakhta hai. Use case: platform-specific native addons jaise `fsevents` jo sirf macOS pe build hota hai; Linux/CI pe skip ho jata hai bina `npm install` tode. Code ko `try { require('fsevents') } catch {}` se guard karna padta hai.",
    detailedAnswer:
      "`\"optionalDependencies\": { \"fsevents\": \"^2.3.3\" }`. Normal dependency ka install fail -> poora `npm install` fail, non-zero exit. Optional ka install fail -> warning, install continue, exit 0. Isliye ye tab use hoti hain jab: (1) dependency platform-specific hai (macOS file-watching ke liye fsevents; baaki OS pe Node ka polling fallback use hota hai); (2) ek nice-to-have performance binary jiske bina slower par working fallback hai. Zaroori: consuming code ko defensive hona padta hai — `let watcher; try { watcher = require('fsevents'); } catch { /* fallback */ }`. Agar tum bina guard ke `require` karoge aur wo skip ho gayi thi, toh runtime crash. peerDependencies se farak: peer = 'host provide karega, warna warning'; optional = 'main install karne ki koshish karunga, fail ho toh chhod dunga'.",
    followUp: "Agar ek optionalDependency har platform pe chahiye lekin kabhi-kabhi network se download fail hota hai — kya optionalDependencies sahi choice hai?",
  },
  {
    id: "depsdev-5",
    question: "Interview: \"typescript ko dependencies mein daalein ya devDependencies mein?\" — poora reasoning do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "devDependencies. Deployment artifact plain compiled `.js` hota hai — running production process ko `tsc` chahiye hi nahi, wo sirf build step ka tool hai. dependencies mein hone se `npm ci --omit=dev` bhi use laayega: image ~50MB bada, attack surface bada, zero runtime fayda.",
    detailedAnswer:
      "Rule apply karo: 'kya running production process ise import/require karega?' TypeScript ke case mein nahi — `tsc` build time pe `.ts` ko `.js` mein badalta hai, aur deploy hoti hai `dist/*.js`. Isliye `devDependencies`. Dono direction ke consequences samjhao: (1) build tool `dependencies` mein (galat) -> prod image bloat, badi supply-chain surface. (2) runtime dep `devDependencies` mein (galat) -> `npm ci --omit=dev` ke baad `Cannot find module` -> prod crash. Edge cases jahan TS runtime dep ban sakta hai: agar app `ts-node`/`tsx` se production mein directly `.ts` chalati hai (anti-pattern — slower startup, extra memory, no build-time type check gate) — tab `ts-node` + `typescript` genuinely runtime deps. Better practice: build karke plain JS deploy karo, `typescript` ko dev mein rakho. Library publish kar rahe ho jo `.d.ts` types ship karti hai -> `typescript` phir bhi dev; consumers ke paas apna TS hota hai.",
    followUp: "Agar koi bole \"hum ts-node se prod chalate hain, isse deploy simple hai\" — kya trade-offs batao ge?",
    redFlag: "\"Farak nahi padta\" — image size, cold start, aur attack surface ko dismiss karna.",
  },
];

export default questions;
