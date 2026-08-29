import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cccr-1",
    question: "Naya Angular project start se lekar pehle commit tak kaunse commands chalaoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`npm i -g @angular/cli` (ya `npx @angular/cli`), `ng new ems --routing --style=scss --ssr=false`, `cd ems`, `npx ng serve -o`, `npx ng g c features/dashboard`, then `git init` (CLI does it), `git add -A`, `git commit -m 'Initial scaffold'`, `git branch -M main`, `git remote add origin <url>`, `git push -u origin main`.",
    detailedAnswer:
      "`ng new` already runs `git init` and makes the first commit and installs dependencies. After that you add a remote and push. Daily: `npx ng serve` for dev, `npx ng g ...` for files, `npm run lint` / `npm test` / `npx ng build` to verify, git for version control. Use `npx ng` (not global) so the CLI version matches the project.",
    followUp: "`ng new` ke prompts (SSR, SSG, style) me kya choose karoge ek internal admin app ke liye?",
  },
  {
    id: "cccr-2",
    question: "`git merge` aur `git rebase` me farak. Kaunsa kab, aur ek golden rule?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`merge` combines two branches with a merge commit — history shows the branch structure, non-destructive. `rebase` replays your branch's commits on top of the target — linear history, but rewrites commit hashes. Golden rule: never rebase a branch others have pulled (shared/pushed history).",
    detailedAnswer:
      "Use `merge` to bring a feature branch into `main` (a PR merge). Use `rebase` to keep your own in-progress feature branch up to date with `main` (`git rebase main`) so the eventual merge is clean and the history is linear — but only while the branch is yours alone. Rebasing shared history forces everyone else to reconcile diverged copies. `git pull --rebase` is a common config to avoid noisy merge commits when syncing. Interactive rebase (`git rebase -i`) is for tidying local commits before a PR (squash, reword) — again, before anyone else has them.",
    followUp: "`git pull` default (merge) vs `git pull --rebase` — team ke liye kaunsa set karoge?",
  },
  {
    id: "cccr-3",
    question: "Galti se ek secret (`.env` / API key) commit ho gaya aur push bhi. Kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Treat the secret as compromised — rotate it immediately (new key/token) regardless of git cleanup. Then remove it from history (`git filter-repo` or BFG), force-push the cleaned history (coordinate with the team), and add the file to `.gitignore`. A plain `git rm` + new commit is NOT enough — the old commit still has it.",
    detailedAnswer:
      "Order matters: (1) rotate the secret first — history rewrites don't help if someone already cloned/cached it; (2) `git rm --cached .env`, add to `.gitignore`, commit; (3) purge from all history with `git filter-repo --path .env --invert-paths` (or BFG Repo-Cleaner), then `git push --force` (with the team aware, and unprotect the branch temporarily); (4) everyone re-clones or resets. For hosted repos, also invalidate any cached views (GitHub keeps some). Prevention: a pre-commit hook / `gitleaks` scan, and secrets in a vault / CI secrets, never in the repo.",
    followUp: "Pre-commit hook se secrets ko commit hone se kaise rokoge?",
  },
  {
    id: "cccr-4",
    question: "`ng update` se Angular major version upgrade karne ka safe process?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Start from a clean git tree. `ng update` (no args) to see what's outdated. `ng update @angular/core@<next-major> @angular/cli@<next-major>` — one major at a time — which bumps versions and runs automated code migrations. Then `ng build` + `ng test`, fix issues, commit. Repeat per major. Bump third-party Angular libs to compatible versions too.",
    detailedAnswer:
      "`ng update` is migration-assisted: for each major it applies codemods (renamed APIs, new control-flow, standalone migrations, config changes) so you don't hand-edit hundreds of lines. Never jump multiple majors (v16 → v18) in one go — do v16 → v17 → v18. Check `update.angular.dev` for the guide and manual steps. If a third-party lib doesn't support the new version, you may need to wait, find an alternative, or pin. Commit after each successful major so you can bisect a regression. `--allow-dirty` / `--force` exist but avoid them.",
    followUp: "Ek critical third-party lib naya Angular version support nahi karti — options?",
  },
  {
    id: "cccr-5",
    question:
      "`npm audit` high-severity vulns dikha raha hai. Step-by-step kya karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`npm audit` to read the report (which package, path, severity, is a fix available). `npm audit fix` for safe patch/minor bumps. For a transitive dep with no direct fix, use `overrides` in `package.json` to force a patched version, or update the parent. If it's a dev-only tool and not exploitable in your context, note it and move on. Add `npm audit --audit-level=high` as a CI gate.",
    detailedAnswer:
      "Not every audit finding is a real risk — assess: is the vulnerable code path reachable in your app? is it runtime or build-time only? `npm audit fix` handles most; `npm audit fix --force` can do breaking major bumps (review carefully). `npm ls <pkg>` shows why it's installed. `overrides` (npm) / `resolutions` (yarn/pnpm) force a safe transitive version without waiting for the maintainer. Track with Dependabot/Renovate so patches land as PRs. Document accepted risks (an `.nsprc` / audit allowlist) with a reason and a review date, don't just silence them.",
    followUp: "`overrides` se ek transitive version force karne ke side-effects kya ho sakte hain?",
  },
];

export default questions;
