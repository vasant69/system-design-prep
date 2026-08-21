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
- **AWS** (`aws` slug): 26/26 topics, 6 modules (core-services,
  architecture-strategy, iam-fundamentals, iam-advanced-ops,
  s3-fundamentals, s3-advanced-ops). Done — converted/adapted from the
  user-provided source material in `AWS/` at the repo root (that folder
  is raw source, kept for reference/backup, not read by the app at
  runtime). This section is different from System Design/Databases in
  one important way: content was **adapted from existing rich source
  material** (the user's own first-person interview-prep notes), not
  invented from a syllabus — see `docs/content-authoring-guide.md` if
  another section ever needs this same "convert existing material"
  approach again. Two real MDX bugs were found and fixed here that are
  worth knowing about for future content: a bare `<2%`/`<30 din` (raw
  `<` followed by a digit, including inside a markdown table cell) broke
  a build the same way `<Tag>` would — MDX doesn't distinguish "looks
  like a comparison operator" from "looks like a JSX tag start"; wrap
  such comparisons in words ("under 2%") or backticks.
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

## Next task: none queued

AWS is done (see "Current content state" above). No section is currently
queued as "next" — System Design, Database Design, and AWS are all
complete. Remaining untouched placeholders are **API Design** and
**English Learning** (`enabled: false` in `config/sections.config.ts`),
and Phase 2/3 stubs (Interview Mode, Revision queue, Progress dashboard)
are still "coming soon" pages. None of these have been requested yet —
don't start on them unless the user asks. The raw AWS source material
originally analyzed here has since been adapted into `content/aws/` and
is preserved at `AWS/` at the repo root purely for reference; see
`docs/content-authoring-guide.md` for the source-adaptation pattern used
if a future section needs the same "convert existing material" approach.

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
