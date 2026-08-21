# Content Authoring Guide (reusable for any section)

This is the canonical, section-agnostic recipe for writing `.mdx` + `.quiz.ts`
content for this site. It has been used successfully for the System Design
section (40 topics) and the Database Design section (38 topics). Reuse it
for every future section (AWS, English Learning, API Design, ...) — copy
this file's rules into a domain-specific brief for whichever agents write
the actual content, adding only the domain's real-world-example flavor
(e.g. "prefer AWS's own docs terminology and Indian-context companies
where relevant" instead of "prefer BFSI companies").

## Where content lives

`content/<section-slug>/<module-id>/<topic-slug>.mdx` plus a co-located
`content/<section-slug>/<module-id>/<topic-slug>.quiz.ts`. The section must
first be registered in `config/sections.config.ts` (`enabled: true`, with
its `modules` array — id/title/description/order). Nothing else needs to
change — `lib/content.ts` reads the filesystem, `app/(learn)/[section]/`
and `app/(learn)/[section]/[slug]/` render whatever it finds. See
`PROJECT_GUIDE.md` for the full "adding a section" checklist including the
icon/theme wiring.

## Frontmatter schema (YAML, exact fields — see `lib/types.ts`)

```yaml
---
slug: "foo-bar"
title: "Human Title"
section: "section-slug"
module: "module-id"
order: 3
difficulty: "beginner" | "intermediate" | "advanced"
readingTime: 14
prerequisites: ["other-slug-1", "other-slug-2"]
tags: ["tag1", "tag2"]
englishDefinition: "2-4 sentence textbook definition, no Hindi."
interviewFrequency: "very-high" | "high" | "medium" | "low"
companies: ["Company1", "Company2"]
---
```

**YAML gotcha**: if `englishDefinition` needs an internal double-quote
character, avoid it or rephrase — don't break the YAML string.

## Content structure (body of the .mdx file, in this exact order)

```mdx
<SimpleDefinition>

[Same text as frontmatter englishDefinition, 2-4 sentences.]

</SimpleDefinition>

## Hinglish Deep Explanation

<Hinglish>

[Main teaching content. ### sub-headings, **bold**, lists, inline `code`
all work. This is the bulk of the topic.]

</Hinglish>

[Optional: <Tradeoff pros={[...]} cons={[...]} /> and/or <Callout type="tip|warning|trap"> here for a natural binary trade-off or a sharp one-liner.]

## Real World Example

<RealWorld company="CompanyName">

[1-3 of these blocks.]

</RealWorld>

## Numbers That Matter

<Numbers>

- Bullet list of concrete numbers

</Numbers>

## Interview Angle

<InterviewAngle>

[How this is actually asked, what's being tested, model answer shape.]

</InterviewAngle>

## Common Mistakes

<Mistake>

[One mistake per block — use 3-5 separate `<Mistake>` blocks.]

</Mistake>

## Diagram

<Diagram
  chart={`
flowchart TD
    A[...] --> B[...]
`}
  caption="One sentence on what to notice."
/>

## Quick Revision

<QuickRevision>

- 5-8 short cheat-sheet bullet lines

</QuickRevision>
```

## Custom MDX components — exact APIs (all auto-available, no import needed)

Defined in `components/mdx/`, wired in `components/mdx/index.tsx`:

- `<SimpleDefinition>text</SimpleDefinition>` — once, at the top.
- `<Hinglish>markdown</Hinglish>` — once, the main body.
- `<RealWorld company="X">text</RealWorld>` — 1-3 instances.
- `<Numbers><ul><li>...</li></ul></Numbers>` — must contain a real list.
- `<InterviewAngle>text</InterviewAngle>` — once.
- `<Mistake>text</Mistake>` — 3-5 separate instances.
- `<Diagram chart={\`mermaid source\`} caption="..." />` — self-closing,
  string prop. Use `flowchart TD/LR` or `sequenceDiagram` for
  processes/flows, `erDiagram` for schema/data-modeling topics (Mermaid
  supports it natively — see any Database Design topic for exact syntax).
- `<QuickRevision><ul>...</ul></QuickRevision>` — once, 5-8 bullets.
- `<Callout type="tip">text</Callout>` — optional, `tip`|`warning`|`trap`.
- `<Tradeoff pros={["a","b"]} cons={["c","d"]} />` — optional, self-closing.

## MDX parsing gotchas — these WILL break the build, and have repeatedly

These exact mistakes have broken real builds across both content pushes so
far. Every content-writing agent must be told these explicitly:

1. **No raw `<` or `>` in prose text.** MDX parses `<` as a JSX tag start.
   Wrap comparisons in inline code backticks: `` `n < m` ``.
2. **No stray `{` or `}` in prose text** outside an intentional JSX
   expression. A bare `{something}` (e.g. a URL path param, a JSON field
   name) gets parsed as a JS expression and crashes the build with
   "X is not defined" at *runtime* (not build time — it only breaks the
   specific page, which is why it's easy to miss). Wrap it in backticks:
   `` `{accountId}` ``, or spell it out in words. This exact bug broke a
   System Design case study (`{shortCode}` in a QuickRevision bullet).
3. **`<Diagram ... />` is always self-closing.** Never write a separate
   `</Diagram>` closing tag. This exact mistake — a leftover `</Diagram>`
   from restructuring — broke two System Design case-study builds.
4. **Pseudocode/SQL/code snippets go in fenced code blocks** (\`\`\`sql
   ... \`\`\`), never inline as prose.
5. **`next-mdx-remote` strips array/object/template-literal JSX props by
   default** (an XSS guard for untrusted content, `blockJS`). This repo's
   `lib/content.ts` already sets `blockJS: false` since all content is
   first-party — you don't need to do anything about this when writing
   content, but if you ever see `<Diagram>`/`<Tradeoff>` silently receive
   empty props, this is why. Don't re-enable `blockJS`.

## THE ONE RULE THAT MATTERS MOST: Roman script only

Hinglish means Roman-script Hindi + English technical terms — **never**
actual Devanagari script (देवनागरी). This is muscle-memory-prone (a single
mid-word slip like "isके" instead of "iske") and has happened repeatedly
across both content pushes so far, including in hand-written reference
topics, despite every agent explicitly checking. Before finishing each
topic, and again as a final pass across the whole section, run:

```bash
grep -P "[\x{0900}-\x{097F}]" content/<section>/**/*.mdx content/<section>/**/*.quiz.ts
```

(Note: on Windows/Git Bash, `grep -P` with `\x{...}` can error with "too
large" depending on locale — use the `Grep` tool instead, which handles
this fine: pattern `[\x{0900}-\x{097F}]` against the content directory.)

Zero matches required, in both `.mdx` and `.quiz.ts` files. **Always run
this check yourself, one more time, across the whole section after all
parallel agents report done** — every agent self-checks its own files and
still misses things sometimes (residual, real examples: "usके", "Isके",
"jaisे", "badhती", "isी", "dhीma"). Don't trust the self-report alone.

## Quiz files

```ts
import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "slug-1",
    question: "Hinglish question text",
    options: ["...", "...", "...", "..."], // exactly 4
    correctIndex: 1, // 0-based
    explanation: "Hinglish — why the correct answer is right AND why each wrong option is wrong",
    difficulty: "easy" | "medium" | "hard",
  },
  // exactly 4 questions per topic
];

export default quiz;
```

## Depth bar

Regular topics: 900-1400 words total, real trade-offs, a "when to use /
when NOT to" angle, at least one concrete failure scenario. Case-study /
capstone-style topics (a full end-to-end design or schema walkthrough):
1500-2200 words, structured with `###` sub-headings inside `<Hinglish>`
covering (adapt names to the domain): Requirements → Key
Entities/Architecture → Design (with a real diagram or fenced
DDL/pseudocode) → Query/Access Patterns or Deep Dive → Scaling/Failure
Considerations → Follow-Up Questions. Never write a topic that's just a
list of definitions.

## The parallel-agent workflow (how content actually gets built here)

This is the proven recipe — repeat it for every new section:

1. **Register the section** in `config/sections.config.ts` (`enabled:
   true`, modules with id/title/description/order), and add matching
   entries to `components/icon-map.ts` (`moduleIconMap`) and
   `lib/section-theme.ts` (`MODULE_THEMES`, one accent color per module —
   pick unused Tailwind color names so it's visually distinct from other
   sections' modules).
2. **Write ONE full reference topic yourself**, by hand, following this
   guide exactly. This is not optional — it validates the format works
   for the new domain (e.g. confirms `erDiagram` renders correctly before
   37 agents rely on it) and becomes the "gold standard" example every
   parallel agent reads first.
3. **Write a domain-specific authoring guide** (in your own scratchpad,
   not the repo) that copies this file's rules verbatim and adds: (a) the
   path to your hand-written reference topic, (b) domain-flavored
   real-world-example guidance, (c) any domain-specific diagram-type
   preference.
4. **Draft the full topic list** (module → ordered topics, each with
   slug/title/difficulty/readingTime/tags/interviewFrequency/companies/
   prerequisites — prerequisites can reference slugs other parallel
   agents haven't written yet, that's fine, they're just strings) and
   confirm scope with the user before dispatching a large batch — this
   session lost real effort once from a syllabus the user didn't
   actually ask to be that size.
5. **Dispatch parallel background agents**, one per module (split large
   modules — 6+ topics or case-study-depth topics — into two agents of
   3-4 each). Each agent's prompt: link to the domain authoring guide,
   the exact topic specs (slug/metadata/content-focus notes), and an
   explicit instruction to run the Devanagari + tag-balance self-check
   before reporting done.
6. **Handle agent failures.** Two failure modes have occurred: (a)
   transient API errors mid-run — resume via `SendMessage` to the same
   agent, telling it what's already on disk (check first) so it doesn't
   redo work; (b) hitting a session-level usage cap (fails immediately,
   message mentions a reset time) — don't bother resuming until near that
   time, instead check what's actually on disk (agents usually get very
   far, sometimes missing only the last file or two) and fill small gaps
   yourself directly rather than waiting or re-dispatching.
7. **After all agents report done, personally re-run the Devanagari check
   across the entire new section** (not per-module — the combined
   directory), fixing anything found directly.
8. **Verify**: `npm run build` (full static build, watch for MDX parse
   errors — they name the exact page), `npm run lint`. Fix any build
   errors by reading the actual file (past bugs: stray `</Diagram>`, bare
   `{word}` in prose — see gotchas above) rather than guessing.
9. **Visual spot-check with Playwright** (see `PROJECT_GUIDE.md`'s
   "Local verification" section for the exact pattern) — at minimum the
   home page (new section card shows), the section page (module list,
   diagram thumbnails load), and one topic page including a case-study
   one. Zero console errors is the bar, not just "the screenshot looks
   fine" — two real runtime bugs (a `useSyncExternalStore` infinite-loop
   warning, a missing `<Command>` wrapper crash) were only caught this
   way, not by build success alone.
10. **Commit with a scoped `git add`** — review `git status` before
    committing; do not sweep up unrelated in-progress changes from other
    concurrent sessions that may be touching this same repo (this has
    happened — see "Shared repo" in `PROJECT_GUIDE.md`).
11. **Push and redeploy** — see `PROJECT_GUIDE.md`'s deploy section.
