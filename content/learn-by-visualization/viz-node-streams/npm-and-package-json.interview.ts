import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "npkg-1",
    question: "package.json aur package-lock.json — dono kyun chahiye, ek se kaam nahi chalta?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "package.json human intent hai — version ranges (jaise ^4.18) aur scripts. package-lock.json machine output hai — har package ki exact resolved version, integrity hash, aur poori nested tree. Pehla batata hai kya chahiye, doosra batata hai kya actually mila, taaki har jagah wahi tree bane.",
    detailedAnswer:
      "package.json tum haath se edit karte ho: dependencies, devDependencies, scripts, engines. Yahan versions ranges hoti hain kyunki tum minor/patch fixes automatically lena chahte ho. Problem: ^4.18.2 aaj 4.18.2 resolve kare, teen mahine baad 4.25.0 — do developers ke node_modules alag ho jaate hain. package-lock.json isko fix karta hai: install ke time jo bhi resolve hua (exact version, resolved URL, integrity sha512 hash, dependencies ka nested breakdown) sab likh deta hai. Lockfile ko commit karo. Ab npm ci sabko byte-identical tree deta hai. Rule: lockfile hamesha version control mein.",
    followUp: "Do developers alag npm versions use karein to lockfile format conflict ho sakta hai — kaise avoid karoge?",
    redFlag: "\"lockfile to auto-generated hai, gitignore kar do\" — isse reproducibility hi khatam ho jaati hai.",
  },
  {
    id: "npkg-2",
    question: "^1.2.3, ~1.2.3 aur 1.2.3 mein kya farak hai? ^0.2.3 ka answer alag kyun hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "^1.2.3 = 1.2.3 se 2.0.0 se pehle tak (minor+patch float). ~1.2.3 = 1.2.3 se 1.3.0 se pehle tak (patch only). 1.2.3 = exact pin. ^0.2.3 special hai: 0.2.3 se 0.3.0 se pehle tak — kyunki 0.x mein har minor bump breaking maana jaata hai.",
    detailedAnswer:
      "Semver = MAJOR.MINOR.PATCH. Caret left-most non-zero digit ko lock karta hai. Normal case: ^1.2.3 mein wo 1 hai, to upper bound 2.0.0. Lekin ^0.2.3 mein left-most non-zero 2 (minor) hai, to upper bound 0.3.0 — yani tilde jaisa. ^0.0.3 aur bhi tight, effectively exactly 0.0.3. Logic: 0.x packages ko unstable maana jaata hai jahan minor bumps bhi break kar sakte hain. Tilde hamesha patch-level float deta hai jab tak minor specified ho. Exact pin (koi operator nahi) tab use karo jab ek dependency ne pehle break kiya ho aur tum manually control chahte ho.",
    followUp: "`npm outdated` aur `npm update` in ranges ke saath kaise interact karte hain?",
  },
  {
    id: "npkg-3",
    question: "CI pipeline randomly fail ho raha hai — kabhi pass, kabhi ek dependency error. Kya check karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Sabse pehle: CI `npm install` use kar raha hai ya `npm ci`? `npm install` ranges dobara resolve karke naye transitive versions la sakta hai jo kisi ne test nahi kiye. `npm ci` pe switch karo — lockfile se exact, deterministic install. Aur confirm karo ki lockfile committed hai.",
    detailedAnswer:
      "Flaky CI ka classic cause: build har baar apni dependency tree dobara compute kar raha hai. `npm install` package.json ranges dekhta hai aur 'newest satisfying' pick karta hai — matlab kisi maintainer ne kal patch publish kiya, aaj tumhare CI mein aa gaya, kisi ne test nahi kiya. Fix: (1) package-lock.json commit karo, (2) CI step ko `npm ci` banao (wipe plus install from lock only, mismatch pe fail), (3) dependency bumps ko deliberate PRs banao (Renovate/Dependabot) jahan lockfile diff review hota hai. Bonus: `npm ci` `npm install` se faster bhi hota hai kyunki resolution skip hoti hai.",
    followUp: "Dependabot/Renovate lockfile-only update PRs kaise banate hain aur wo manual bump se better kyun hai?",
    redFlag: "\"job retry kar do, chal jaata hai\" — root cause (non-reproducible install) ko ignore karna.",
  },
  {
    id: "npkg-4",
    question: "`npm install` chalane ke baad package-lock.json mein diff aa gaya jabki tumne koi dependency add nahi ki. Kyun?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Common reasons: tumhari npm version team se alag hai (lockfile metadata/format badal jaata hai), ya kisi range ke andar naya version publish hua aur `npm install` ne use pick kar liya, ya `node_modules` pehle se stale/edited tha. `npm ci` isse bachata hai kyunki wo lockfile likhta hi nahi.",
    detailedAnswer:
      "`npm install` ka kaam hai package.json, registry aur current node_modules ko reconcile karna, aur wo lockfile ko 'fix up' karta hai. Triggers: (a) npm major version mismatch (lockfileVersion 1 vs 2 vs 3), (b) ek caret/tilde range ke andar naya version available ho gaya (^4.18.2 pehle 4.18.2, ab 4.19.0), (c) manually deleted ya edited lock, (d) platform-specific optional deps. Best practice: jab dependencies change nahi kar rahe to installs ke liye `npm ci`; `npm install pkg` sirf jab genuinely add/update karna ho, aur us diff ko PR mein review karo. Sab devs same Node/npm version pin karein (engines field plus .nvmrc).",
    followUp: "lockfileVersion 1 vs 2 vs 3 mein kya farak hai?",
  },
];

export default questions;
