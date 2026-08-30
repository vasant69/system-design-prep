import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "locksemver-1",
    question: "Semantic Versioning kya hai? MAJOR, MINOR, PATCH kab bump hote hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "SemVer har release ko `MAJOR.MINOR.PATCH` deta hai. PATCH bump = sirf bug fix, koi behaviour change nahi. MINOR bump = naya feature jo backward-compatible hai. MAJOR bump = breaking change, purana code toot sakta hai. Ye package author ka consumers se contract hai.",
    detailedAnswer:
      "Example `4.18.2`: `4` MAJOR, `18` MINOR, `2` PATCH. Rules: (1) Sirf backward-compatible bug fix -> PATCH badhao (`4.18.3`). (2) Naya functionality add kiya bina kuch tode -> MINOR badhao, PATCH `0` (`4.19.0`). (3) Koi bhi incompatible API change -> MAJOR badhao, MINOR aur PATCH `0` (`5.0.0`). Pre-release: `5.0.0-beta.1`. Iska practical fayda: agar author SemVer honestly follow kare, toh `^4.x` range ke andar tumhara code kabhi nahi tootega — tum minor/patch security fixes automatically le sakte ho. Jab author SemVer todta hai (patch release mein breaking change), tab teams us dep ko exact-pin kar deti hain.",
    followUp: "0.x versions SemVer mein alag kyun treat hote hain?",
    redFlag: "\"MINOR aur PATCH mein koi khaas farak nahi\" — backward-compat guarantee ka pura point yahi hai.",
  },
  {
    id: "locksemver-2",
    question: "`^`, `~`, aur exact version pinning mein kya farak hai? Aap kab konsa use karenge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`^1.4.2` = `>=1.4.2 <2.0.0` — MINOR aur PATCH updates allowed, MAJOR nahi (npm ka default). `~1.4.2` = `>=1.4.2 <1.5.0` — sirf PATCH. Exact `1.4.2` = bilkul wahi. Well-maintained libraries ke liye `^` theek hai; jab koi dep SemVer tod chuki ho ya regulated environment ho toh exact pin.",
    detailedAnswer:
      "`^` (caret): MAJOR-lock. Default jab `npm install <pkg>` karte ho. Automatic minor features + patch fixes. `~` (tilde): MINOR-lock, sirf patch. Zyada conservative — jab minor bumps se bhi risk lena ho. Exact: total control, lekin har security patch manually. `*` / `\"\"`: koi bhi version — production mein kabhi nahi, MAJOR bump silently aayega. `0.x` gotcha: `^0.4.2` -> `>=0.4.2 <0.5.0` (minor bhi locked); `^0.0.3` -> exactly `0.0.3`. Practical note: kyunki lockfile waise bhi exact version pin karti hai, `^` vs exact ka farak sirf tab dikhta hai jab tum `npm update` chalao ya lock regenerate ho — day-to-day install lock follow karta hai. Meri default: popular SemVer-respecting libs pe `^`, ek-do critical/flaky deps pe exact pin with a comment kyun.",
    followUp: "Agar lockfile waise bhi exact pin karti hai, toh `^` vs exact se practical farak kab padta hai?",
  },
  {
    id: "locksemver-3",
    question: "package-lock.json exactly kya store karta hai, aur ise git mein commit kyun karna chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Lockfile poore resolved dependency tree ko record karta hai: har package (transitive included) ka exact version, uska SHA-512 integrity hash, resolved registry URL, aur tree ka shape (kaunsa package kahan nested hai). Commit isliye — ranges flexible hain, alag installs alag trees de sakte hain; lock har machine (dev/CI/prod) pe bit-for-bit same tree guarantee karta hai plus tamper detection deta hai.",
    detailedAnswer:
      "`package.json` sirf top-level deps aur unki ranges rakhta hai. `package-lock.json` mein har node ke liye: `version` (exact), `resolved` (tarball URL), `integrity` (`sha512-...` hash), aur nesting. Do fayde: (1) Reproducibility — bina lock ke, `^4.18.2` aaj `4.18.2` kal `4.19.1` resolve kar sakta hai, aur transitive deps ke saath ye chhote differences hazaaron ban jate hain; 'works on my machine' bugs. (2) Security — integrity hash ensure karta hai ki registry se aaya tarball wahi content hai jo lock banate waqt tha; ek compromised republish ya MITM detect ho jata hai (event-stream-style attack). Isliye: application repos mein hamesha commit. Lockfile merge conflict ko hand-edit mat karo — `git checkout --ours/--theirs` phir `npm install` re-run, npm ise `package.json` se regenerate kar deta hai.",
    followUp: "Ek library publish karte waqt lockfile ka kya role hai — consumers use use karte hain?",
    redFlag: "\"Lockfile ki zaroorat nahi kyunki `^` version fix kar deta hai\" — `^` range hai, exact nahi.",
  },
  {
    id: "locksemver-4",
    question: "`npm install` aur `npm ci` mein kya farak hai? Har ek kab use karna chahiye?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`npm install` package.json padhta hai, lockfile ko starting point maanta hai, aur agar tumne range badli ya nayi dep add ki toh resolve karke lock update karta hai — development ke liye. `npm ci` node_modules poora delete karta hai, sirf lockfile se exact install karta hai, kuch resolve/write nahi karta, aur package.json-lock mismatch pe fail hota hai — CI aur production builds ke liye.",
    detailedAnswer:
      "npm install: incremental. `node_modules` mein jo sahi hai chhod deta hai, baaki patch karta hai. Range satisfy hoti ho toh lock ka version rakhta hai; nahi (naya `pkg@version`, ya nayi dep) toh resolve + lock update. Development mein yahi use hota hai jab tum deps add/change kar rahe ho. npm ci: (1) `package.json` aur `package-lock.json` sync check — out of sync toh turant exit (feature). (2) `node_modules` delete. (3) Lockfile se exact, deterministic install. (4) Lock kabhi nahi likhta. Isliye CI/CD, Docker builds, aur kisi bhi 'ye exact tree chahiye' scenario mein. Bonus: bade projects mein ~2x tez kyunki resolution phase skip. Real bug ye solve karta hai: CI mein `npm install` se ek transitive patch silently aa jata hai bina kisi visible change ke, aur build/test flaky ho jata hai — 'code toh badla hi nahi' debugging nightmare.",
    followUp: "`npm ci` chalane se pehle kya condition satisfy honi chahiye?",
  },
  {
    id: "locksemver-5",
    question: "`npm audit`, `npm outdated`, aur `npm audit fix --force` kya karte hain? `--force` ke saath kya savdhani?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`npm outdated` batata hai kaunse packages ke naye versions available hain (Current / Wanted / Latest columns). `npm audit` dependency tree ko npm ke vulnerability database se match karke known CVEs aur severity report karta hai. `npm audit fix` safe hai — sirf SemVer range ke andar updates. `npm audit fix --force` range ignore karke MAJOR bumps kar deta hai, isliye uske baad hamesha full test suite chalao.",
    detailedAnswer:
      "npm outdated: teen columns — `Current` (abhi installed), `Wanted` (range ke andar max available), `Latest` (registry pe newest). `Wanted` == `Current` matlab up-to-date within range; `Latest` > `Wanted` matlab ek MAJOR bump pending hai jo range se bahar hai. npm audit: har dependency ka version vuln DB se cross-check; output mein severity (low/moderate/high/critical), affected path, aur fix available hai ya nahi. CI mein aksar `npm audit --audit-level=high` pe fail karte hain taaki low/moderate noise ignore ho. npm audit fix: transitive deps ko range ke andar patched versions pe le jata hai — safe. `--force`: jab fix range se bahar ho, ye MAJOR version bhi bump kar deta hai, jo breaking API changes la sakta hai — build ya runtime tod sakta hai. Workflow: pehle plain `audit fix`, phir bache hue high/critical ke liye manually us package ka changelog padho aur controlled upgrade karo; `--force` sirf tab aur uske baad poora test + smoke test. Bahut saare audit findings unreachable code paths mein hote hain — blindly sab fix karna churn badhata hai bina real risk kam kiye.",
    followUp: "Ek high-severity audit finding jo tumhare code se reachable hi nahi — kya karoge?",
    redFlag: "\"`npm audit fix --force` chala ke commit kar do, wo sab theek kar deta hai\" — MAJOR bumps se silent breakage.",
  },
];

export default questions;
