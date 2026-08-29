import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pbd-1",
    question: "Angular app ko production ke liye build aur deploy karne ka poora process batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`ng build` -> optimized static files in `dist/<app>/browser/` (minified, tree-shaken, AOT, content-hashed, budgets enforced). Deploy those to any static host/CDN. Configure a SPA fallback (unknown paths -> `index.html` 200), `--base-href` if under a sub-path, `immutable` caching on hashed assets + `no-cache` on `index.html`, gzip/brotli, and security headers. CI: `npm ci` -> lint -> test -> `ng build` -> deploy on `main`.",
    detailedAnswer:
      "Because it's just static files, hosting is cheap and scalable (S3+CloudFront, Netlify, Vercel, Nginx). The build's content hashing enables aggressive caching with safe invalidation. The two things that bite: the SPA history-fallback (per-host config) and `base-href` when not at the domain root. Environment values via build-time `fileReplacements` or a runtime `config.json`. SSR/prerender (`@angular/ssr`) for public/SEO pages; internal apps behind login usually skip it.",
    followUp: "Zero-downtime deploy ke liye kya dhyaan rakhoge (purane clients naye hashes maang sakte hain)?",
  },
  {
    id: "pbd-2",
    question: "SPA fallback ke bina exactly kya toot-ta hai, aur different hosts par kaise configure karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Deep links and refreshes on any client-side route (`/employees/42`) hit the server, which has no such file -> 404. Config: Nginx `try_files $uri $uri/ /index.html;`; Apache `RewriteRule ... index.html`; Netlify `/* /index.html 200`; Vercel a rewrite to `/index.html`; S3+CloudFront set the 403/404 error document to `/index.html` with a 200 response code.",
    detailedAnswer:
      "The fallback must return `index.html` with **status 200**, not a 301/302 redirect (a redirect changes the URL and breaks deep-link semantics). It must NOT catch real asset requests (JS/CSS/images) — `try_files $uri` checks for the file first. For CloudFront, a Function/Lambda@Edge or the custom error response maps 404 -> `/index.html` 200. Also: the API (often a different origin) needs its own routing and CORS; the fallback is only for the app's static host. Test by hard-refreshing every route type after deploy.",
    followUp: "Fallback ko 302 redirect se karne me kya problem hai deep-link ke liye?",
  },
  {
    id: "pbd-3",
    question: "Content hashing + caching strategy ko samjhao. Deploy par kya invalidate hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Each JS/CSS/chunk gets a content hash in its filename (`main.abc123.js`). Change the code -> new hash -> a different URL -> the browser fetches it fresh; unchanged files keep their hash and stay cached. So: hashed assets `Cache-Control: immutable, max-age=1y`; `index.html` `no-cache` (it holds the current hash map and must always be re-fetched).",
    detailedAnswer:
      "On deploy, only files whose content changed get new hashes; the rest are byte-identical and served from cache. `index.html` is the single unhashed entry point — it must never be cached hard, or users load the old `index.html` pointing at deleted hashed files (white screen / chunk load errors). Some setups also keep the previous deploy's chunks around briefly so a client mid-navigation doesn't 404 on a lazy chunk (zero-downtime consideration). CDN cache invalidation of `index.html` (or a very short TTL) on each deploy is the safety net.",
    followUp: "Ek user 10 min purane `index.html` ke saath ek lazy route pe navigate kare aur wo chunk delete ho chuka ho — kaise handle karoge?",
  },
  {
    id: "pbd-4",
    question: "Ek CI/CD pipeline design karo is Angular app ke liye. Steps aur gates.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "On every PR: `npm ci` -> `npm run lint` -> `ng test --watch=false --browsers=ChromeHeadless` -> `ng build` (budgets + template errors fail here). On merge to `main`: the same, then deploy `dist/<app>/browser/` to the host, then invalidate the CDN's `index.html`. Cache `~/.npm` between runs.",
    detailedAnswer:
      "`npm ci` (not `install`) for a lockfile-exact, clean install. Gates: lint blocks style/quality issues; tests block behaviour regressions; `ng build` blocks template compile errors and budget overruns. Optional gates: `npm audit --audit-level=high`, a bundle-size diff comment, an e2e smoke test (Playwright/Cypress) against a preview deploy, and Lighthouse CI. Deploy only from `main` (or tagged releases). Use preview deploys per PR (Netlify/Vercel do this automatically) so reviewers see the change live. Store the deploy target's token as a CI secret, never in the repo.",
    followUp: "PR preview deploy ke liye environment config kaise handle karoge (staging API)?",
  },
  {
    id: "pbd-5",
    question: "SSR / prerendering Angular me kab worth hai? Internal EMS-type app ke liye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Worth it for public, content-heavy, SEO-sensitive pages (marketing, blog, product pages, e-commerce) — SSR + hydration gives a fast first contentful paint and crawlable HTML. An internal admin app behind login (like the EMS) gets little benefit: no SEO need, users tolerate a short JS boot, and SSR adds a server to run and maintain.",
    detailedAnswer:
      "`ng add @angular/ssr` scaffolds a Node server that renders the initial HTML; the client then hydrates (reuses the DOM instead of re-rendering). Benefits: better Core Web Vitals (FCP/LCP), social/OG previews, crawler support. Costs: a server runtime (or edge functions), careful handling of browser-only APIs (`window`, `localStorage`) guarded by `isPlatformBrowser` / `afterNextRender`, cookie/auth handling on the server, and more moving parts. For the EMS: skip SSR; a well-code-split CSR app with a fast shell and `@defer` is enough. Reconsider only if a public marketing/portal surface is added.",
    followUp: "SSR me `window`/`localStorage` access ko safely kaise guard karoge?",
  },
];

export default questions;
