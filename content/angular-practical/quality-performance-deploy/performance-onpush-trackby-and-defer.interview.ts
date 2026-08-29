import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "potd-1",
    question: "Ek Angular app ko fast karne ke levers batao, impact ke order me.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "(0) Measure with Angular DevTools Profiler. (1) OnPush everywhere + signals/immutable state. (2) `track` in `@for` with a stable id. (3) No function calls / impure pipes in templates -> `computed()`. (4) `@defer` heavy sub-trees; lazy routes + preloading. (5) `runOutsideAngular` for high-frequency non-UI work, `NgOptimizedImage`, bundle budgets in CI.",
    detailedAnswer:
      "OnPush + signals is the dominant win — it turns a whole-tree dirty check into checking only the components whose inputs/signals actually changed. Templates must stay cheap: expressions run every CD cycle, so a function or impure pipe there is repeated work; move to memoized `computed()`. `@for` `track` decides DOM reuse vs recreate. `@defer` and lazy routes shrink and split the bundle. Everything else (detach CD, `runOutsideAngular`, image optimisation) is situational and should follow a profile. The endgame is zoneless (`provideZonelessChangeDetection`), which signals-first code is already compatible with.",
    followUp: "Zoneless change detection kya badalta hai, aur uske liye code kaise ready rakhoge?",
  },
  {
    id: "potd-2",
    question: "OnPush change detection kaise kaam karta hai? Kab check hota hai aur kab skip?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "An OnPush component (and its subtree) is checked only when: an `@Input`'s reference changes, an event fires from within the component, a signal it reads changes, an `async` pipe in its template emits, or `markForCheck()` is called. Otherwise the whole subtree is skipped in that CD cycle.",
    detailedAnswer:
      "Default strategy checks every component on every zone-triggered CD pass (event, timer, XHR). OnPush prunes: Angular marks a component 'dirty' only on those specific triggers, and checks dirty components + their ancestors' path. Consequence: mutating an `@Input` object in place (`data.items.push`) doesn't change the reference, so no check — you get a stale view. Fixes: immutable updates (spread) or signals (a `.set`/`.update` explicitly notifies). `markForCheck()` schedules a check on the next cycle (for when state changes outside Angular's knowledge); `detectChanges()` runs a synchronous check now (heavier, can cause re-entrancy).",
    followUp: "`markForCheck()` aur `detectChanges()` — kab kaunsa, aur `detectChanges()` ka risk?",
  },
  {
    id: "potd-3",
    question: "`@defer` ke triggers aur `@placeholder`/`@loading`/`@error` blocks — kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Triggers: `on viewport` (below-the-fold widgets), `on idle` (non-critical, after the page settles), `on interaction`/`on hover` (load when the user shows intent), `on timer(Ns)`, `when condition`. `prefetch on <trigger>` to fetch the chunk early but render later. Blocks: `@placeholder` (shown before), `@loading (after Nms; minimum Nms)` (while the chunk loads), `@error` (chunk/render failed).",
    detailedAnswer:
      "`@placeholder` should be a cheap, correctly-sized stand-in (a skeleton) so there's no layout shift. `@loading (after 100ms)` avoids a spinner flash for fast chunks; `minimum 500ms` avoids a flicker if it loads instantly. `@error` needs a real fallback + retry. Common pattern: `@defer (on viewport; prefetch on idle)` — prefetch the code during idle time, then render when scrolled into view, so there's no wait. Use for charts, maps, rich text editors, comment threads, an activity feed — heavy things not always seen. Don't defer above-the-fold critical content.",
    followUp: "`@defer` block ke andar ka component uske apne `ngOnInit` HTTP call ke saath — timing kaisa hota hai?",
  },
  {
    id: "potd-4",
    question:
      "Profiler dikha hai ek list component har mouse-move par re-render ho raha hai. Diagnose karo.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Its parent (or itself) is on `Default` CD, so every zone event (including `mousemove` if something listens) triggers a full check. And likely a template function/impure pipe makes each check expensive. Fix: `OnPush` on the component + parents, move template computations to `computed()`, and check what's listening to `mousemove` (a directive doing per-move work should `runOutsideAngular`).",
    detailedAnswer:
      "`mousemove` itself doesn't trigger CD unless code (a `@HostListener`, an `addEventListener`, a drag directive) runs inside the zone on it. Steps: (1) find the `mousemove` listener; if it's for a drag/resize, register it via `NgZone.runOutsideAngular` and only `ngZone.run(...)` the final state change; (2) make the list and its ancestors `OnPush` so unrelated CD passes skip it; (3) replace any `{{ fn() }}` / impure pipe with `computed()`; (4) ensure `@for` uses `track id`. After that, moving the mouse should cause ~zero list work.",
    followUp: "`runOutsideAngular` ke andar state badalne ke baad UI update kaise trigger karoge?",
  },
  {
    id: "potd-5",
    question: "Bundle size aur initial load ko kaise control me rakhte ho, aur regressions kaise catch karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Lazy-load feature areas (`loadChildren`/`loadComponent`) + `withPreloading(PreloadAllModules)`. `@defer` heavy widgets. `NgOptimizedImage` for images. Analyse with `source-map-explorer` / `ng build --stats-json` + a bundle analyzer. Set `budgets` in `angular.json` so CI fails when the initial bundle grows past a threshold.",
    detailedAnswer:
      "Initial bundle = the app shell + eager routes + everything they import. Keep it thin: only the login + shell + dashboard eager, everything else lazy. `budgets` (`{ type: 'initial', maximumWarning: '500kb', maximumError: '1mb' }`) turn a size regression into a red build. Periodically run a bundle analyzer to spot a fat dependency (a date lib, a full lodash, moment) and replace/trim it. `optimization`, `outputHashing`, and modern build (esbuild) are on by default in production. SSR/prerender + hydration improves perceived load for content-heavy pages.",
    followUp: "Ek third-party dependency bundle ka 40% le rahi hai — options?",
  },
];

export default questions;
