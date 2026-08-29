import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "acci-1",
    question: "Naya Angular project kaise start karoge? Kaunse flags common hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`ng new <name>` se scaffold karta hoon. Common flags: `--routing` (routes file ready), `--style=scss`, `--ssr=true/false`. Modern default standalone hota hai.",
    detailedAnswer:
      "`npm i -g @angular/cli` (ya `npx @angular/cli`), phir `ng new ems-frontend --routing --style=scss --ssr=false`. `--routing` ek `app.routes.ts` de deta hai. `--style` component styles ka format. `--ssr` server-side rendering opt-in. `ng new` npm install bhi kar deta hai. Uske baad `ng serve` se dev server. Flags explicitly dena scripts/CI me predictable rehta hai, warna CLI interactive prompt maangta hai.",
    followUp: "`--ssr=true` karne se project structure me kya extra aata hai?",
  },
  {
    id: "acci-2",
    question: "`ng serve` aur `ng build` ka farak samjhao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`ng serve` local dev server hai — in-memory build, port 4200, live reload, optimize nahi karta. `ng build` deploy ke liye optimized bundle `dist/<project>/browser/` me likhta hai.",
    detailedAnswer:
      "`ng serve` development loop ke liye: file save karo, incremental rebuild (esbuild-based, aksar under 1s), browser auto-refresh. Ye disk par kuch permanent nahi likhta aur minify/hash nahi karta, isliye iska output kabhi deploy nahi hota. `ng build` production ke liye: tree-shaking, minification, content-hash file names (cache-busting ke liye), aur `dist/` folder. CI me `ng build` chalta hai aur `dist/.../browser/` ko static host / CDN pe deploy kiya jaata hai. `ng build --configuration development` bhi possible hai debugging ke liye.",
    followUp: "Production build ki `.js` files ke naam me hash kyun hota hai?",
    redFlag: "'ng serve ka dist folder deploy kar dete hain' — ng serve koi dist folder banata hi nahi.",
  },
  {
    id: "acci-3",
    question: "`ng generate` (ng g) kyun use karte ho, files khud kyun nahi banate?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Generators consistent naming, correct folder structure, aur ek spec (test) file dete hain — boilerplate aur human error dono khatam. Team-wide structure same rehta hai.",
    detailedAnswer:
      "`ng g c features/employees/employee-list` component class + template + styles + `.spec.ts` sahi selector aur class-name convention ke saath bana deta hai. `ng g s`, `ng g guard --functional`, `ng g interceptor`, `ng g pipe`, `ng g directive` — sab similar. Faayde: (1) naming/structure standard, (2) test file free me, (3) schematics future-proof (CLI update ke saath conventions badle to generator adjust ho jaata hai). Haath se banane par log aksar spec file skip kar dete hain aur folder structure har jagah alag ho jaata hai.",
    followUp: "`ng g c --skip-tests` kab justified hai?",
  },
  {
    id: "acci-4",
    question:
      "Ek team member ne galti se `node_modules` git me commit kar diya. Problem kya hai aur sahi tareeka kya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`node_modules` bahut bada hota hai aur machine/OS-specific binaries rakhta hai — repo bloat aur merge conflicts. Sahi: `.gitignore` me `node_modules` (CLI already daalta hai), aur `package-lock.json` commit karo — wo exact versions reproduce karta hai `npm ci` se.",
    detailedAnswer:
      "`node_modules` hazaaron files aur sometimes compiled native modules hota hai. Commit karne se clone slow, diff unreadable, aur cross-platform break. Fix: `git rm -r --cached node_modules`, ensure `.gitignore` me entry hai, commit. Reproducibility `package-lock.json` (ya `pnpm-lock.yaml`) se aati hai — CI me `npm ci` lockfile se exact tree install karta hai. Isliye lockfile commit karna zaroori hai, `node_modules` nahi.",
    followUp: "`npm install` aur `npm ci` me kya farak hai, aur CI me kaunsa use karna chahiye?",
  },
  {
    id: "acci-5",
    question: "Angular ka naya major version aa gaya. Upgrade kaise karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`ng update @angular/core @angular/cli` chalao — ye dependencies bump karta hai aur automated code migrations (schematics) apply karta hai. Ek version at a time, update.angular.dev guide follow karke.",
    detailedAnswer:
      "Angular `ng update` ke through incremental, migration-assisted upgrades deta hai. Steps: clean git tree se shuru, `ng update` bina args chala kar dekho kya outdated hai, phir `ng update @angular/core@<next-major> @angular/cli@<next-major>`. CLI dependency versions update karta hai aur breaking changes ke liye codemods chalata hai (jaise renamed APIs, control-flow migration). Ek baar me ek major version — v16 se seedha v18 nahi. Third-party Angular libs bhi compatible versions me bump karni padti hain. Har step ke baad build + test.",
    followUp: "Agar koi third-party library abhi naye Angular version ko support nahi karti to kya karoge?",
    redFlag: "'package.json me versions manually badal dete hain' — migrations skip ho jaati hain, subtle breakage aata hai.",
  },
];

export default questions;
