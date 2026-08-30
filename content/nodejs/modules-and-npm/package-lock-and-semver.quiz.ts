import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "package-lock-and-semver-1",
    question:
      "`\"express\": \"^4.18.2\"` ka matlab kaunse versions acceptable hain?",
    options: [
      "Sirf exactly 4.18.2",
      "4.18.2 se lekar 5.0.0 se just neeche tak koi bhi version (>=4.18.2 <5.0.0) — MINOR aur PATCH updates allowed, MAJOR nahi",
      "4.18.2 se 4.19.0 se neeche tak (sirf PATCH)",
      "Koi bhi 4.x ya 5.x version",
    ],
    correctIndex: 1,
    explanation:
      "Caret (`^`) MAJOR version ko lock karta hai lekin MINOR aur PATCH ko allow karta hai: `^4.18.2` = `>=4.18.2 <5.0.0`. Option A exact pinning hai (`4.18.2` bina caret). Option C tilde (`~4.18.2`) ka behaviour hai. Option D galat — `^` 5.x ko allow nahi karta.",
    difficulty: "easy",
  },
  {
    id: "package-lock-and-semver-2",
    question:
      "`^0.4.2` aur `^4.4.2` ka range behaviour alag kyun hai?",
    options: [
      "Koi farak nahi, dono MINOR updates allow karte hain",
      "SemVer 0.x ko unstable maanta hai, isliye `^0.4.2` = `>=0.4.2 <0.5.0` (MINOR bhi locked, sirf PATCH), jabki `^4.4.2` = `>=4.4.2 <5.0.0` (MINOR allowed)",
      "`^0.4.2` koi bhi 0.x allow karta hai",
      "`^0.4.2` invalid syntax hai",
    ],
    correctIndex: 1,
    explanation:
      "Pre-1.0 mein SemVer spec MINOR bumps ko potentially breaking maanta hai (API abhi stabilize nahi hui). Isliye npm ka caret 0.x ke liye extra strict ho jata hai: `^0.4.2` sirf PATCH allow karta hai (`<0.5.0`), aur `^0.0.3` toh exactly `0.0.3`. `^4.4.2` normal MAJOR-lock behaviour deta hai. Option A/C galat, option D galat (valid hai).",
    difficulty: "medium",
  },
  {
    id: "package-lock-and-semver-3",
    question:
      "`package.json` mein sirf ranges hone ke bawajood `package-lock.json` kyun chahiye?",
    options: [
      "Taaki npm install tez ho jaye",
      "Kyunki ranges flexible hain — same package.json se do installs alag versions (aur alag transitive trees) resolve kar sakte hain; lockfile poore resolved tree ko exact versions + integrity hashes ke saath pin karke har machine pe same tree guarantee karta hai",
      "package-lock.json package.json ko replace kar deta hai",
      "Sirf published libraries ko lockfile chahiye",
    ],
    correctIndex: 1,
    explanation:
      "`^4.18.2` aaj `4.18.2` de sakta hai, kal `4.19.1` (dono range mein). Transitive deps ke saath ye differences multiply hote hain. Lockfile har package ka exact resolved version, SHA-512 integrity hash, aur tree shape record karta hai, jisse dev/CI/prod bit-for-bit same tree paate hain. Option A partial (ci tez hota hai) par asli reason reproducibility hai. Option C galat (dono chahiye). Option D ulta — applications ko sabse zyada chahiye.",
    difficulty: "medium",
  },
  {
    id: "package-lock-and-semver-4",
    question:
      "CI pipeline mein `npm install` ke bajaye `npm ci` kyun use karte hain?",
    options: [
      "npm ci devDependencies install nahi karta",
      "npm ci node_modules ko delete karke lockfile se exactly install karta hai, kuch resolve/update nahi karta, aur package.json-lock mismatch pe fail hota hai — isse har build deterministic rehta hai; npm install lock ko silently update kar sakta hai",
      "npm ci ko internet ki zaroorat nahi hoti",
      "npm install CI par kaam hi nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "npm ci: clean-slate (node_modules delete), lockfile as authority, no resolution, no lock writes, aur agar package.json aur lock out of sync ho toh turant fail. Ye guarantee deta hai ki CI wahi tree banaye jo committed lock mein hai. npm install incremental hai aur naye range-satisfying versions pull kar sakta hai bina koi visible change ke — 'kuch badla nahi phir bhi toota' bugs. Option A galat (ci sab install karta hai; --omit=dev se skip). Option C/D galat.",
    difficulty: "medium",
  },
];

export default quiz;
