import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "npmreg-1",
    question: "`npm install <pkg>` chalane par step-by-step exactly kya hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "npm registry se package ka metadata leta hai, package.json ki range se best version choose karta hai, us version ka tarball download karke local cache mein rakhta hai, SHA-512 integrity hash verify karta hai, node_modules mein extract karta hai (transitive deps ke saath), lifecycle scripts (postinstall) chalata hai, aur package.json + package-lock.json update karta hai.",
    detailedAnswer:
      "Sequence: (1) Resolve — registry (registry.npmjs.org) se package ka metadata (saare published versions). Agar package.json mein range di hai jaise `^4.18.0`, toh us range ka highest matching version. (2) Download + cache — us version ka `.tgz` tarball. npm ise `~/.npm/_cacache` mein bhi rakhta hai, isliye dobara install offline bhi ho jata hai. (3) Integrity — tarball ka SHA-512 hash compute karke lockfile/registry ke stored hash se match karta hai; mismatch = fail (tamper/corruption protection). (4) Extract — `node_modules/<pkg>/` mein khol deta hai; package ki apni dependencies bhi resolve hoti hain aur flat-ish layout mein hoist hoti hain. (5) Lifecycle scripts — `preinstall`/`install`/`postinstall` jo package declare karta hai (native addon compile karna, etc.). (6) Write — `package.json` ke `dependencies` mein entry, aur `package-lock.json` mein poora resolved tree + integrity hashes.",
    followUp: "Agar network down ho lekin tarball cache mein hai toh install chalega?",
    redFlag: "\"Bas GitHub se code download ho jata hai\" — registry GitHub nahi hai, aur resolution/caching/integrity/lockfile ka role miss karna.",
  },
  {
    id: "npmreg-2",
    question: "Local install aur global (-g) install mein kya farak hai? Global kab appropriate hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Local install project ke node_modules mein jata hai aur package.json/lockfile mein record hota hai — jo bhi code require/import karega wo local hona chahiye. Global install machine-wide ek location mein jata hai, PATH mein binary daalta hai, aur project mein record nahi hota. Global sirf standalone CLI tools ke liye theek hai jaise pm2, vercel — jo kisi ek project se bandhe nahi.",
    detailedAnswer:
      "Local (`npm install express`): `./node_modules/express`, `package.json` mein `dependencies` entry, `package-lock.json` mein pinned. Reproducible — `npm ci` se har machine pe same tree. Global (`npm install -g pm2`): ek shared prefix folder (jaise `/usr/local/lib/node_modules` ya nvm ke andar), `pm2` command PATH mein. Koi project record nahi. Problem tab hoti hai jab log build tools (typescript, eslint, webpack) global install karte hain — CI aur naye developers ke paas wo nahi hota, aur do projects ko alag versions chahiye toh clash. Rule: application dependencies aur dev/build tools = local (`dependencies` / `devDependencies`). Machine-wide daemons/CLIs jinka version project-specific nahi = global, ya better `npx`. Kabhi bhi production code ko kisi globally-installed package pe rely mat karwao.",
    followUp: "Agar do projects ko typescript ke alag versions chahiye toh global install se kya hoga?",
  },
  {
    id: "npmreg-3",
    question: "npx kya karta hai aur `npm install -g` se kaise alag hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "npx ek package ki executable ko chalata hai bina use permanently install kiye. Agar package local node_modules mein hai toh wahan se, warna registry se temporarily fetch karke chalata hai aur baad mein kuch permanent nahi chhodta. `npm install -g` package ko machine-wide install karke chhod deta hai.",
    detailedAnswer:
      "`npx create-next-app my-app` — npx dekhta hai ki `create-next-app` local `node_modules/.bin` mein hai kya; nahi hai toh registry se latest (ya `npx create-next-app@14` se pinned) version fetch karta hai, ek temp location mein rakhta hai, binary chalata hai, kaam khatam. Fayde: (1) scaffolding tools jaise `create-react-app` ko permanent install ki zaroorat nahi — saal mein 2 baar chalte hain. (2) hamesha latest version, koi stale global copy atki hui nahi. (3) local `node_modules/.bin` ke tools ko bina full path likhe chalane ka shortcut (`npx jest` = `./node_modules/.bin/jest`). `npm install -g` ke saath tumhe manually update karna padta hai aur version machine pe atak jata hai. Modern practice: scaffolding = npx; project tools = local devDependency + `npm run`.",
    followUp: "`npx jest` aur package.json ke scripts mein `\"test\": \"jest\"` — dono kaise resolve hote hain?",
  },
  {
    id: "npmreg-4",
    question: "pnpm npm se kaise alag hai? Ek team pnpm pe kyun switch karegi?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "pnpm ek global content-addressable store rakhta hai aur project ke node_modules mein hard-links banata hai, actual copies nahi. Isliye 20 projects ek hi lodash version share karein toh disk pe uski ek hi physical copy. Fast installs aur bada disk saving. Plus pnpm strict hai — package sirf apni declared dependencies access kar sakta hai, phantom (undeclared) deps nahi.",
    detailedAnswer:
      "npm har project ke node_modules mein packages ki alag copies extract karta hai (dedupe sirf ek project ke andar). pnpm ek `~/.pnpm-store` rakhta hai jahan har package version ek baar content-hash ke naam se store hota hai; project ke node_modules mein sirf hard-links / symlinks. Consequences: (1) Disk — multi-project machines pe aksar aadha ya usse kam. (2) Speed — already-store-mein-mojood packages ke liye sirf linking, koi extract nahi. (3) Correctness — pnpm ka node_modules layout non-flat hai; ek package sirf wahi import kar sakta hai jo usne `dependencies` mein likha, isliye 'kaam kar raha tha kyunki koi aur ne wo dep install ki thi' wale phantom-dependency bugs build time pe pakde jate hain. Trade-off: kuch purane tools jo flat node_modules assume karte hain unhe `node-linker=hoisted` chahiye, aur symlink-unaware setups (kuch bundlers, kuch Docker COPY patterns) mein tweak karna padta hai. Sab same npm registry use karte hain — sirf resolution aur disk layout alag.",
    followUp: "Yarn PnP (no node_modules at all) kya problem solve karta hai aur uska main downside kya hai?",
  },
  {
    id: "npmreg-5",
    question: "Ek junior `node_modules` ko git mein commit karna chahta hai \"taaki build reproducible rahe\". Kya samjhaoge?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Reproducibility node_modules se nahi, package-lock.json se aati hai — wo poora resolved tree plus integrity hashes pin karta hai. node_modules hazaaron files, platform-specific compiled binaries, aur MBs ka bloat hai jo diff-review impossible bana deta hai aur ek OS pe build ki hui native binary doosre pe toot sakti hai. Lockfile commit karo, folder `.gitignore` mein daalo.",
    detailedAnswer:
      "node_modules commit karne ke problems: (1) size — 200MB+ common, har PR ka diff unreadable. (2) native modules (jaise `bcrypt`, `sharp`) install ke time current OS/arch ke liye compile hote hain — Linux CI pe developer ke Mac wali binary kaam nahi karegi. (3) merge conflicts nightmare. Sahi approach: `package-lock.json` commit karo — ye har dependency (transitive bhi) ka exact version + SHA-512 integrity hash rakhta hai, isliye `npm ci` har machine pe bit-for-bit same tree (correct platform binaries ke saath) banata hai. `.gitignore` mein `node_modules/`. Agar registry availability ki chinta hai toh proper solution ek private registry mirror/proxy (Verdaccio, Artifactory) hai, ya npm cache ko CI mein persist karna — vendoring node_modules nahi. (Exception: kuch bade monorepos deliberately vendor karte hain with tooling jaise Yarn's offline mirror `.tgz` cache — lekin wo tarballs commit karte hain, extracted folder nahi.)",
    followUp: "package-lock.json exactly kya-kya pin karta hai jo package.json nahi karta?",
    redFlag: "\"node_modules commit karne se installs skip ho jate hain isliye tez\" — native binary aur cross-platform breakage ko ignore karna.",
  },
];

export default questions;
