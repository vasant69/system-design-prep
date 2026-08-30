import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pkgjson-1",
    question: "package.json kya hai aur kaun-kaun ise padhta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Ye har Node project ke root mein ek JSON manifest file hai. Isme project ki identity (name, version), loading config (type, main, exports, bin), runnable commands (scripts), dependencies ke buckets, aur rules (engines, files, private) hote hain. Ise npm, Node runtime, aur lagbhag har tool (bundlers, test runners, linters) padhta hai.",
    detailedAnswer:
      "package.json ecosystem ka central manifest hai. Paanch role: (1) Identity — `name`, `version` (SemVer), `description`, `license`. (2) Loading — `type` (`.js` ko CJS ya ESM banata hai), `main` (legacy entry), `exports` (modern entry map + encapsulation), `bin` (CLI executables). (3) Commands — `scripts` object, jise `npm run <name>` chalata hai; `test`/`start` bina `run` ke chalte hain; `pre`/`post` prefix auto-wrap hote hain. (4) Dependencies — `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`. (5) Rules — `engines` (required Node version), `files` (publish whitelist), `private` (block publish). npm ise install ke liye padhta hai, Node module resolution ke liye, aur har build tool apna config/entry yahin se uthata hai. Git mein commit hota hai — single source of truth.",
    followUp: "package.json aur package-lock.json mein kya farak hai — dono kyun chahiye?",
    redFlag: "\"Ye sirf dependencies ki list hai\" — scripts, entry points, engines, publish rules ko miss karna.",
  },
  {
    id: "pkgjson-2",
    question: "`main` aur `exports` fields mein kya farak hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`main` ek single legacy entry point hai — `require('pkg')` kaunsi file load kare. `exports` ek modern map hai jo multiple named subpaths define karta hai, conditional resolution (import vs require, node vs browser) support karta hai, aur sabse important — encapsulation deta hai: jo path exports mein nahi likha, use consumer import/require nahi kar sakta.",
    detailedAnswer:
      "`main: \"./dist/index.js\"` — bas itna, ek entry. Consumer `require('pkg/dist/internal/db.js')` bhi kar sakta hai kyunki koi restriction nahi. `exports`:\n\n```json\n{\n  \"exports\": {\n    \".\": {\n      \"import\": \"./dist/index.mjs\",\n      \"require\": \"./dist/index.cjs\"\n    },\n    \"./utils\": \"./dist/utils.js\"\n  }\n}\n```\n\nIsse: (1) `pkg` aur `pkg/utils` importable, baaki sab `ERR_PACKAGE_PATH_NOT_EXPORTED` se block. (2) `import` vs `require` pe alag file de sakte ho (dual-package). (3) Library apni internal file structure bina consumers ko tode refactor kar sakti hai. Jab `exports` present hai, modern Node aur bundlers use `main` se pehle dekhte hain — isliye `exports` ki `.` entry galat ho toh `main` sahi hone par bhi import fail hoga. Application (non-library) code mein `exports` ki zaroorat nahi, sirf `main` (ya kuch bhi nahi) chalega.",
    followUp: "Dual-package hazard kya hai aur exports usse kaise deal karta hai?",
  },
  {
    id: "pkgjson-3",
    question: "peerDependencies aur optionalDependencies kab use karte hain? Ek-ek example do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "peerDependencies: jab tum ek plugin/library ho jo host application ki ek shared copy chahte ho, khud install nahi karna chahte — jaise `react-redux` `react` ko peer declare karta hai taaki app mein React ki ek hi copy rahe. optionalDependencies: jab ek dependency ka install fail ho jana acceptable hai — jaise `fsevents` sirf macOS pe build hota hai; Linux pe skip ho jata hai bina `npm install` tode.",
    detailedAnswer:
      "peerDependencies: `\"peerDependencies\": { \"react\": \">=18\" }`. npm 7+ inhe auto-install karta hai agar possible ho, warna incompatible version pe warning/error deta hai. Purpose: singleton-sensitive packages (React, a specific Express, a webpack plugin's webpack) ki ek hi copy poore app mein — do copies hone se context/hooks/instanceof toot jate hain. optionalDependencies: `\"optionalDependencies\": { \"fsevents\": \"^2.3.3\" }`. Agar download ya build fail ho, npm chup-chaap chhod deta hai, exit code 0. Code ko `try { require('fsevents') } catch {}` se guard karna padta hai. Use cases: platform-specific native addons, performance ke liye nice-to-have binary jinke bina fallback path hai. Dono ka common theme: 'ye normal dependency nahi hai' — ek host provide karega, ek ho toh accha na ho toh chalega.",
    followUp: "Agar peerDependency incompatible ho toh npm 7+ kya karta hai vs npm 6?",
    redFlag: "\"peerDependencies bilkul dependencies jaisa hi hai\" — sharing/singleton ka point miss karna.",
  },
  {
    id: "pkgjson-4",
    question: "npm scripts mein `pre` aur `post` prefix ka kya matlab hai? Ek example do.",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Kisi script `x` ke liye, agar `prex` script defined hai toh wo `x` se pehle automatically chalti hai, aur `postx` `x` ke baad. Manually call karne ki zaroorat nahi — `npm run x` teenon ko sequence mein chalata hai.",
    detailedAnswer:
      "```json\n{\n  \"scripts\": {\n    \"prebuild\": \"rimraf dist\",\n    \"build\": \"tsc\",\n    \"postbuild\": \"cp package.json dist/\"\n  }\n}\n```\n\n`npm run build` chalane pe order: `prebuild` (dist saaf) -> `build` (compile) -> `postbuild` (copy). Agar `prebuild` non-zero exit kare toh `build` chalega hi nahi. Ye lifecycle `test`, `start`, `publish` jaise built-in scripts ke saath bhi kaam karta hai — `prepublishOnly` ek common hook hai jo publish se pehle tests/build chalata hai. Note: npm 7+ mein arbitrary `pre`/`post` sirf named scripts ke liye hai; `install` jaise package lifecycle events alag hain. Chaining ke liye `&&` bhi likh sakte ho ek hi script mein, par `pre`/`post` cleaner hai jab steps logically alag hain.",
    followUp: "`npm test` aur `npm run test` mein koi farak hai?",
  },
  {
    id: "pkgjson-5",
    question: "Ek repo ki package.json review kar rahe ho aur `typescript` `dependencies` mein hai. Kya bologe?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Ye galat bucket hai. TypeScript ek build-time tool hai — compiled JS run karne ke liye `tsc` chahiye hi nahi. Ise `devDependencies` mein hona chahiye. `dependencies` mein hone se production install (`npm ci --omit=dev`) ise bhi laayega — image ~50MB bada, attack surface bada, koi runtime fayda nahi.",
    detailedAnswer:
      "Test: 'kya production mein chalte hue process ko ye package require/import karega?' TypeScript ke case mein nahi — deployment artifact plain `.js` hai, `tsc` sirf build step mein use hota hai. Isliye `devDependencies`. Galat bucket ke do direction ke bugs: (1) build tool `dependencies` mein — prod image bloat, jaise yahan. (2) runtime dep `devDependencies` mein (jaise `pg` ko `-D` se install kar diya) — local dev chalega (dev deps present), par prod `npm ci --omit=dev` ke baad `Cannot find module 'pg'` se crash karega. Fix: `npm uninstall typescript && npm install -D typescript`, phir `npm ci --omit=dev` se local pe verify karo ki prod install clean hai. Edge case: agar tum library publish kar rahe ho jo `.ts` types ship karti hai aur consumer ko compile karna hai — tab bhi TS peer/dev hoti hai, `dependencies` nahi. Exception jahan TS runtime dependency ban sakta hai: agar app `ts-node` se production mein directly `.ts` chalati hai (anti-pattern, par hota hai) — tab `ts-node` + `typescript` genuinely runtime deps hain.",
    followUp: "`ts-node` ko production mein use karna kyun anti-pattern maana jata hai?",
    redFlag: "\"Farak nahi padta, dono install ho jate hain\" — prod image size aur attack surface ko ignore karna.",
  },
];

export default questions;
