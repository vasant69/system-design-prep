# Project Guide — System Design Prep

Read this first in any new session on this repo. It's the persistent
memory of everything built, decided, and learned so far — the chat history
that produced this app will not be available to you.

## What this is

A personal, ad-free, no-login interview-prep textbook built with Next.js
16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui (the **Base UI**
variant, not Radix — see "shadcn quirks" below) + MDX content. Deployed to
Vercel. Content lives as `.mdx` files in the repo (the filesystem is the
database), progress/bookmarks live in the visitor's `localStorage` — no
backend, no database, no auth.

Full original spec: see the very first user message in this project's
history if you have it; otherwise this file plus `docs/content-authoring-
guide.md` supersede it as the source of truth for current state.

## Architecture map

- `config/sections.config.ts` — the section registry. Every section
  (System Design, Databases, ...) and its modules are declared here.
  Adding a section/module needs **only**: an entry here, matching entries
  in `components/icon-map.ts` (`moduleIconMap`) and `lib/section-theme.ts`
  (`MODULE_THEMES`), and content files under `content/<slug>/`. No routing
  or component changes.
- `lib/content.ts` — reads the filesystem (frontmatter via `gray-matter`,
  body compiled via `next-mdx-remote/rsc`'s `compileMDX`), builds the
  topic graph (module grouping, ordering, prerequisites, prev/next). Also
  extracts each topic's first `<Diagram chart={...}>` source via regex
  (`extractDiagramChart`) for the section-page thumbnail feature.
- `app/(learn)/[section]/page.tsx` — section landing page (module
  "roadmap" list with diagram thumbnails).
- `app/(learn)/[section]/[slug]/page.tsx` — topic page (hero, TOC,
  progress bar, mark-complete/bookmark, prev/next).
- `components/mdx/` — the custom component library every `.mdx` file uses
  (`SimpleDefinition`, `Hinglish`, `RealWorld`, `Numbers`,
  `InterviewAngle`, `Mistake`, `Diagram`, `QuickRevision`, `Callout`,
  `Tradeoff`) plus `typography.tsx` (plain-HTML-element styling — no
  `@tailwindcss/typography` dependency, deliberately hand-rolled).
- `lib/progress.ts` + `hooks/use-topic-progress.ts` — localStorage
  mark-complete/bookmark state via `useSyncExternalStore`.
- `lib/search-index.ts` + `components/search/` — Cmd/Ctrl+K command
  palette (Fuse.js fuzzy search) + a real `/search` fallback page.
- `lib/section-theme.ts` — per-section and per-module color identity
  (gradient/icon/border/text/progressBar classes) used across home,
  section, and topic pages.

## Current content state

- **System Design**: 40/40 topics, 7 modules (fundamentals,
  scalability-basics, data-layer, distributed-systems,
  communication-async, reliability-ops, case-studies). Done.
- **Database Design** (`databases` slug, titled "Database Design", BFSI
  focus): 38/38 topics, 7 modules (relational-fundamentals,
  indexing-performance, transactions-integrity, bfsi-data-modeling,
  scaling-bfsi, security-compliance, bfsi-case-studies). Done.
- **AWS**: not started as a site section yet. **Source material has been
  provided by the user** in `AWS/` at the repo root (NOT under `content/`
  — that's the raw source, not site content) — see "Next task: AWS"
  below. Do not invent an AWS syllabus; read what's there first.
- **Git & GitHub** (`git` slug): appears to be built by a **different,
  concurrent process** editing this same repo — not something this
  session created. Leave it alone; don't revert or "clean it up" unless
  the user asks. See "Shared repo" below.
- **API Design**, **English Learning**: still placeholder
  (`enabled: false`), untouched, exactly as scaffolded in Phase 1.
- **Not yet built** (still "coming soon" stub pages, real Phase 2/3 work
  from the original spec that hasn't been picked up): Interview Mode,
  Revision queue (spaced repetition), Progress dashboard. Search,
  mark-complete/bookmark, and a command palette — originally also planned
  for these phases — **are already built** (see below), pulled forward
  ahead of schedule because the user asked for them directly.

## Design system

- Dark-first (`localStorage` key `sd-theme`, defaults to dark, toggle in
  header), with a full light-mode palette too — everything has been
  verified in both.
- Display font: **Fraunces** (serif, `--font-display` CSS var / Tailwind
  `font-[family-name:var(--font-display)]` utility) for hero/H1-scale
  headings only. Body text is Geist Sans. There was a real bug fixed here:
  the shadcn-scaffolded `--font-sans` token was self-referential
  (`--font-sans: var(--font-sans)`) and never actually resolved to Geist —
  fixed in `app/globals.css`'s `@theme inline` block to point at
  `var(--font-geist-sans)`.
- Per-section/module color identity via `lib/section-theme.ts` — **all
  class strings there are full literals**, never composed via template
  strings like `` `hover:${x}` `` — Tailwind's build-time class scanner
  only finds literal text, so a dynamically-composed class silently never
  gets its CSS generated. This bit us once already; don't reintroduce it.
- Topic pages: sticky auto-generated table of contents (client-side DOM
  scan of rendered `h2`/`h3`, not an MDX AST walk — see
  `components/topic/TableOfContents.tsx`), a reading-progress bar, a
  focus-mode toggle (hides header/TOC via a `body.focus-mode` class +
  `data-site-chrome` attribute + targeted CSS in `globals.css`), j/k and
  arrow-key navigation between adjacent topics.
- Section pages: per-topic diagram "thumbnails" — a genuinely tricky bit,
  see `components/topic/DiagramThumbnail.tsx`'s comments if touching it;
  the short version is Mermaid's `width="100%"` attribute must be
  stripped and replaced with the viewBox's real pixel size *before* the
  CSS `scale()` transform, or the diagram renders at an already-squashed
  size and looks blank.

## shadcn quirks (this scaffold uses Base UI, not Radix)

`components.json` style is `base-nova` — components wrap `@base-ui/react`
primitives, not Radix. Concretely different from most shadcn examples
you may know:
- No `asChild` prop — use `render={<Button .../>}` instead (see
  `SheetTrigger` usage in `components/layout/SiteHeader.tsx`).
- `TooltipProvider` takes `delay`, not `delayDuration`.
- `Command`/`CommandInput`/`CommandList` (from `cmdk`, wrapped in a Base UI
  `Dialog`) **must** be nested inside a `<Command>` root — omitting it
  crashes with "Cannot read properties of undefined (reading 'subscribe')"
  because `CommandInput` needs the root's internal store from context.
  This exact bug shipped once and was caught by the mandatory
  Playwright-with-console-error-check step, not by `npm run build`.

## Known-fixed bugs worth knowing about (don't reintroduce)

- **`next-mdx-remote` `blockJS` guard strips array/object/template-literal
  JSX props by default** (an XSS guard for untrusted MDX). `lib/content.ts`
  sets `blockJS: false` since all content is first-party — required for
  `<Diagram chart={\`...\`}>` and `<Tradeoff pros={[...]}>` to work at all.
- **`useSyncExternalStore`'s `getSnapshot` must be referentially stable**
  between real changes. `lib/progress.ts` keeps an in-memory cache
  (`cachedStore`) rather than re-parsing `localStorage` JSON on every
  call — re-parsing creates a new object each time and triggers React's
  "getSnapshot should be cached" infinite-loop warning.
- **Tailwind's class scanner needs literal strings** — see "Design
  system" above.
- **`rehype-autolink-headings` with `behavior: "wrap"`** puts the whole
  heading text inside an `<a>`, which then inherits the site's blue
  link-underline styling from `typography.tsx`. Using `behavior: "append"`
  instead (current setting in `lib/content.ts`) adds a small separate
  " #" anchor after the heading text so the heading itself stays styled
  as a heading.

## Local verification (do this before every push, no exceptions)

```bash
npm run build          # full static build — MDX parse errors name the exact page
npm run lint
```

Then a Playwright pass (install as a dev-only, non-persisted dependency —
`npm install --no-save playwright`, uninstall after:
`npm uninstall playwright --no-save`) hitting at minimum the home page,
one section page, and one topic page per section touched, checking
`page.on("console", ...)` / `page.on("pageerror", ...)` for **zero**
errors — not just that a screenshot looks plausible. Two real bugs this
session were only caught this way. Screenshot and actually look at the
image; don't just check exit codes. Clean up: `rm` your test script and
screenshots, kill the dev server (`Get-NetTCPConnection -LocalPort 3000
-State Listen | ... | Stop-Process`), `rm -rf .next` before committing so
you're not staging build output.

## Deploy process

This repo is on GitHub (`github.com/vasant69/system-design-prep`) and the
Vercel CLI in this environment is pre-authenticated (an ambient
`vercel@claude-plugins-official` plugin session — not something set up by
a prior Claude session, don't try to "log in", it already works). GitHub
auto-deploy is **not** connected (attempted once, failed — the Vercel
account doesn't have GitHub linked as a login method, which only the user
can authorize in their Vercel account settings). Until that's fixed, every
deploy is manual:

```bash
git add -A            # after reviewing `git status` — see "Shared repo" below
git commit -m "..."
git push
npx --yes vercel deploy --prod --yes
```

The `vercel deploy` step **intermittently fails once with `{"status":
"error", "reason": "deploy_failed", "message": "Not authorized"}`** for no
apparent reason, then succeeds immediately on a plain retry. This has
happened twice; just retry once before treating it as a real problem.
Live URL: `https://system-design-prep-one.vercel.app` (aliased
automatically on each successful prod deploy).

## Shared repo — you may not be the only session touching this

At least one other process/session has been observed writing to this same
working directory concurrently (a "Git & GitHub" section appeared in
`config/sections.config.ts`, `components/icon-map.ts`, and
`lib/section-theme.ts` mid-session, fully unprompted by this session). If
you notice files changed that you didn't touch:
- **Don't revert it.** Take it as current state.
- **Don't silently bundle it into your own commit** either — review
  `git status` before `git add -A` and use judgement; when in doubt (e.g.
  it affects whether something half-finished goes live), ask the user
  rather than guessing, once — they've previously said "push everything
  as-is" when asked, which is a reasonable default going forward too, but
  it was still worth asking the first time rather than assuming.

## Next task: AWS section

The user is providing source content directly rather than asking for an
invented syllabus — **read `AWS/` at the repo root before writing
anything**, don't design a curriculum from scratch like System
Design/Databases did. As of this note, `AWS/` contains:

```
AWS/FiveAmazonServices/aws-interview-prep.md          (~3600 lines)
AWS/FiveAmazonServices/AWS-Interview-Prep-Hinglish.md (~4450 lines)
AWS/IAM/aws-iam-deep-dive.md                          (~3700 lines)
AWS/IAM/IAM.pdf                                       (~30 MB)
AWS/S3/aws-s3-deep-dive.md                            (~4200 lines)
AWS/S3/S3_pdf.pdf                                     (~33 MB)
```

Observed structure (from headers only — these were not fully read yet,
by design, to leave context budget for the session that does the real
work):

- `FiveAmazonServices/aws-interview-prep.md` and
  `AWS-Interview-Prep-Hinglish.md` share **identical heading structure**
  (worth diffing to confirm if one is a superset/revision of the other
  before treating both as separate sources) and already follow an
  A-through-I per-service format very close to this site's own schema:
  A. Simple Explanation, B. Why It Exists / Problem It Solves, C. How It
  Actually Works (Internal Flow), D. Key Concepts & Terminology,
  E. Real-World Configuration, F. Common Mistakes & Gotchas, G. Cost
  Model, H. Security Best Practices, I. Interview Q&A — covering, in
  order: Route 53, CloudFront, S3, (presumably Lambda and SES follow,
  matching the title "Route 53, CloudFront, S3, Lambda, SES").
- `IAM/aws-iam-deep-dive.md` and `S3/aws-s3-deep-dive.md` share a
  **different** structure from each other than from the above: Ek Line Me
  → Problem Statement → Vocabulary Table → Mental Model → Questions &
  Answers → Hands-On Lab, and are noticeably CLI-command-heavy (real `aws`
  CLI invocations throughout, not just prose).
- **S3 is covered in both `FiveAmazonServices/*` and its own
  `S3/aws-s3-deep-dive.md`** — these likely overlap and need reconciling
  (pick one as canonical per sub-topic, or treat the deep-dive as a
  separate "advanced" topic building on the intro one) rather than
  duplicating content.
- Two large PDFs (`IAM.pdf`, `S3_pdf.pdf`) exist alongside their markdown
  counterparts — likely the original slide/course material the `.md`
  files were transcribed from. Probably reference-only; confirm with the
  user whether they contain anything not already in the markdown before
  spending context reading them (30MB PDFs are expensive to read).

Suggested first steps in the session that picks this up: read the four
markdown files properly (they're large — read in chunks, or delegate to
an Explore/general-purpose agent to summarize structure and flag overlaps
first), propose a module/topic breakdown to the user for confirmation
(per this project's established pattern — see
`docs/content-authoring-guide.md` step 4), **converting/adapting the
user's own material** into this site's `.mdx` schema rather than writing
fresh content from scratch, since the source is unusually close to the
target format already. Then follow the standard parallel-agent workflow
in `docs/content-authoring-guide.md`.

## Working style notes for this project specifically

- The user prefers being asked to confirm scope **before** a large
  parallel-agent content push (syllabus size, angle/focus), but otherwise
  wants execution to proceed without re-confirming each step — pushing to
  git/Vercel repeatedly without being re-asked each time has been the
  norm once a task is underway.
- Screenshots and visual verification are expected, not optional, for any
  UI/design change — the user has caught real regressions this way that
  build success alone missed.
- When something breaks, fix the root cause in the actual file (read it,
  understand it, fix it) — this project's history has no instances of
  papering over a bug with a workaround, and that standard should hold.
