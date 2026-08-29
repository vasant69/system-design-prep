import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "amcc-1",
    question: "Angular Material aur CDK ka rishta samjhao. Kab kya use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Material = styled Material Design components (accessible, themeable), built on the CDK. CDK = the reusable behaviour layer: `Overlay`, `a11y` (`FocusTrap`, `LiveAnnouncer`, `ListKeyManager`), `DragDrop`, virtual scroll, `cdk-table` (headless), `Portal`, `BreakpointObserver`. Use Material when Material Design is fine; use the CDK to build custom-styled components with correct behaviour.",
    detailedAnswer:
      "Decision tree: (1) internal tool / Material Design acceptable -> `ng add @angular/material`, theme it, ship. (2) strict brand / custom look -> build your own components ON the CDK so overlay positioning, focus management, and keyboard nav are correct. (3) trivial app -> a few hand-rolled components with a11y care. Don't mix Material and custom in one app. Import Material per-component for tree-shaking.",
    followUp: "M3 (Material 3) theming Angular Material me kaise kaam karта hai — SCSS mixins vs CSS tokens?",
  },
  {
    id: "amcc-2",
    question: "Ek custom `Select`/combobox component banana hai. CDK ke kaunse pieces use karoge aur kyun?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`Overlay` for the positioned dropdown panel (flips at viewport edges, follows the trigger on scroll). `ListKeyManager` for arrow-key navigation, type-ahead, and Home/End. `a11y` `FocusMonitor` + proper `role=\"combobox\"`/`role=\"listbox\"`/`aria-activedescendant` wiring. `Portal` to render the panel outside the component's overflow.",
    detailedAnswer:
      "Getting a select right is deceptively hard: the panel must position relative to the trigger, reposition on scroll/resize, flip when there's no room below, close on outside-click/Escape, and manage focus so the trigger keeps DOM focus while arrows move a virtual 'active' option (`aria-activedescendant`) — plus type-ahead ('type d-i-y to jump to Diya'). `Overlay` + `ListKeyManager` provide the mechanics; you provide markup, styles, and the ARIA attributes. Rolling this from scratch almost always ships bugs (edge positioning, focus loss, no keyboard support).",
    followUp: "`aria-activedescendant` pattern aur actually moving DOM focus into the listbox — kab kaunsa?",
  },
  {
    id: "amcc-3",
    question: "Virtual scrolling kab zaroori hai, aur uske trade-offs kya hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "When a list can have thousands of DOM nodes (long tables, chat history, logs). `cdk-virtual-scroll-viewport` renders only the visible window + a buffer. Trade-offs: fixed or measured item heights (variable heights need `autosize` and are less smooth), Ctrl+F doesn't find off-screen rows, and anchor links/`scrollIntoView` to a hidden item need special handling.",
    detailedAnswer:
      "Without virtualisation, ~1000+ rows with bindings each start to jank on scroll and inflate memory/CD cost. `*cdkVirtualFor` + a `itemSize` (fixed) is smoothest; `autosize` (from `@angular/cdk-experimental/scrolling`) handles variable heights with more cost. Downsides to communicate: browser find-in-page misses virtualised rows; deep-linking to row N requires `viewport.scrollToIndex(n)`; and print/export must use the full data, not the DOM. For most admin tables, server-side pagination avoids needing virtual scroll at all — use virtual scroll when you genuinely must show a very long list at once.",
    followUp: "Server-side pagination aur virtual scroll — dono ki zaroorat kab padti hai ek saath?",
  },
  {
    id: "amcc-4",
    question: "Team debate: 'Material use karein ya apna design system banaein'. Aap decision kaise frame karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ask: (1) Is Material Design acceptable to the product/brand? (2) How much design capacity does the team have? (3) Timeline? Material: fast, accessible, maintained, but you get Material's look. Custom-on-CDK: full control, but you own components, docs, a11y, and maintenance forever. Internal tools usually -> Material; consumer/brand products -> custom-on-CDK.",
    detailedAnswer:
      "Material's real cost isn't the library — it's that escaping its look ('make it not look like Material') fights the framework. Custom-on-CDK's real cost is ongoing: every component needs design, build, a11y, tests, docs, and version maintenance; a 2-person team will drown. Middle path: Material with heavy M3 theming for a semi-branded look, or a thin wrapper layer over Material so you can swap later. Decide early — retrofitting a design system into a large app is expensive.",
    followUp: "Material components ko thin wrappers me wrap karna — future-proofing ke liye worth it?",
  },
  {
    id: "amcc-5",
    question: "Custom components me accessibility ke liye CDK `a11y` kya-kya deta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`cdkTrapFocus` / `FocusTrap` (keep Tab inside a modal), `LiveAnnouncer` (announce async changes to screen readers via `aria-live`), `FocusMonitor` (know if focus came from keyboard/mouse/program — for focus-visible styling), `ListKeyManager` / `ActiveDescendantKeyManager` (arrow-key roving focus in menus/listboxes), and `InteractivityChecker` (is an element focusable/tabbable).",
    detailedAnswer:
      "Concrete uses: a dialog wraps its content in `cdkTrapFocus`, restores focus to the trigger on close, and `LiveAnnouncer.announce('Employee saved')`. A search result count updates -> `LiveAnnouncer` so SR users hear '12 results'. A custom menu uses `ListKeyManager` for Up/Down/Home/End/type-ahead and sets `aria-activedescendant`. `FocusMonitor` lets you show a focus ring only for keyboard focus. These are the parts people skip when hand-rolling, and they're exactly why the CDK is worth adopting even without Material.",
    followUp: "`LiveAnnouncer` aur ek plain `aria-live` region — kab kaunsa?",
  },
];

export default questions;
