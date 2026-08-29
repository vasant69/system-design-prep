import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cli-and-console-command-reference-1",
    question: "CI pipeline me `npm install` ke bajaye `npm ci` kyun use karte hain?",
    options: [
      "`npm ci` faster type karна hai",
      "`npm ci` `node_modules/` delete karke lockfile se EXACTLY install karta hai — reproducible build; `npm install` dependencies resolve karta hai aur lockfile update kar sakta hai (versions drift ho sakti hain)",
      "`npm ci` sirf CI machines par kaam karta hai",
      "Koi farak nahi",
    ],
    correctIndex: 1,
    explanation:
      "`npm ci` (`ci` = clean install) lockfile ko authority maanta hai aur usse deviate nahi karta. CI me har build byte-identical dependency tree chahiye — isliye `ci`, `install` nahi.",
    difficulty: "medium",
  },
  {
    id: "cli-and-console-command-reference-2",
    question: "`ng serve` aur `ng build` ka core farak?",
    options: [
      "`ng serve` production ke liye, `ng build` testing ke liye",
      "`ng serve` = dev server (port 4200), in-memory build, live-reload, NO optimization — deploy nahi hota. `ng build` = optimized static files `dist/<app>/browser/` me — YAHI deploy hota hai",
      "Dono same output dete hain",
      "`ng build` browser khol deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`ng serve` local development ke liye — disk par kuch nahi likhta, minify/hash nahi karta. `ng build` disk par minified, tree-shaken, content-hashed bundle deta hai jo host hota hai.",
    difficulty: "easy",
  },
  {
    id: "cli-and-console-command-reference-3",
    question: "Project ke andar `npx ng ...` (vs global `ng ...`) use karne ka faayda?",
    options: [
      "Faster hota hai",
      "`npx ng` project-local CLI (jo `package.json`/lockfile me pinned hai) chalata hai — global CLI version aur project version mismatch se aane wale confusing errors se bachta hai",
      "`npx ng` extra features deta hai",
      "Global `ng` deprecated hai",
    ],
    correctIndex: 1,
    explanation:
      "2 saal purana global CLI + naya v18 project = ajeeb errors. `npx ng` project ke `node_modules` wala CLI use karta hai, jo project ke Angular version ke saath match karta hai.",
    difficulty: "medium",
  },
  {
    id: "cli-and-console-command-reference-4",
    question: "Inme se kaunsa git command DESTRUCTIVE hai (data loss ho sakta hai)?",
    options: [
      "`git status`",
      "`git reset --hard HEAD~1` — last commit aur uske changes DONO delete kar deta hai (recover sirf `git reflog` se). `git clean -fd` aur `git push --force` bhi risky",
      "`git revert <hash>`",
      "`git stash`",
    ],
    correctIndex: 1,
    explanation:
      "`git reset --hard` working tree + commit dono wipe karta hai. `git revert` (safe — ek naya undo commit banata hai), `git stash` (safe — changes side me), `git status` (read-only) sab recoverable/harmless hain.",
    difficulty: "medium",
  },
];

export default quiz;
