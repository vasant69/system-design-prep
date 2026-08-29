import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cpnc-1",
    question: "Content projection kya hai? `@Input` se kaise alag hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Content projection (`<ng-content>`) se parent component ke tags ke beech markup/UI pass karta hai, jise wrapper apne layout me render karta hai. `@Input` data (values) pass karta hai; `<ng-content>` markup pass karta hai. Dono complementary hain.",
    detailedAnswer:
      "`<app-card><h3>Title</h3><button>Act</button></app-card>` — Card ke `<ng-content>` ki jagah ye markup aata hai, Card ke `.card` shell ke andar. Card sirf structure/style deta hai; content consumer ka. Ye 'composition over configuration' hai — ek `[bodyText]` string input se aap rich content (buttons, links, nested components) pass nahi kar sakte, but projection se kuch bhi. Multi-slot: `<ng-content select=\"[header]\" />` etc.",
    followUp: "Ek `Card` ko `[title]` input do vs ek `[cardTitle]` projection slot do — kab kaunsa?",
  },
  {
    id: "cpnc-2",
    question: "Projected content kis component ke context me bind hota hai? Iska practical implication kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Parent (jisne content diya) ke context me. Iska matlab projected markup me `{{ x }}`, `(click)`, `[prop]` sab parent ke properties/methods refer karte hain — wrapper ke nahi. Wrapper us content ke internals ko directly nahi padh/badal sakta.",
    detailedAnswer:
      "Wrapper sirf placement decide karta hai (`<ng-content>` kahan hai) aur `contentChild(ren)` se structural detection kar sakта hai. Data ko projected content tak pahunchane ke liye wrapper ke paas do options: (1) CSS custom properties / classes; (2) `<ng-template>` + `ngTemplateOutlet` with `context` — jo actually wrapper se content ko data pass karne deta hai (render-prop pattern). Plain `<ng-content>` context share nahi karta — wo pure placement hai.",
    followUp: "Agar wrapper ko projected list-item template ko har row ka data dena ho, to kaunsa mechanism use karoge?",
  },
  {
    id: "cpnc-3",
    question:
      "Ek reusable `Modal` design karo. Kaunse slots, kaunse inputs, kaunse outputs?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Slots: `[modalTitle]`, default (body), `[modalFooter]`. Inputs: `open` (signal/boolean), `size`, `closeOnBackdrop`. Outputs: `closed`. Behaviour inside: backdrop, centering, focus trap, Escape-to-close, scroll lock, animation. Modal ko content ka kuch pata nahi.",
    detailedAnswer:
      "```ts\n@Component({ selector: 'app-modal', template: `\n  @if (open()) {\n    <div class=\"backdrop\" (click)=\"onBackdrop()\">\n      <div class=\"dialog\" role=\"dialog\" aria-modal=\"true\">\n        <header><ng-content select=\"[modalTitle]\" /></header>\n        <section><ng-content /></section>\n        <footer><ng-content select=\"[modalFooter]\" /></footer>\n      </div>\n    </div>\n  }\n`})\n```\nConsumers: delete-confirm, add-employee, assign-role — sab isi Modal me apna content daalte hain. Accessibility (focus trap, `aria-modal`, return focus on close) ek jagah. Alternative: a CDK Overlay + a service-driven `dialog.open(Component)` API for fully dynamic modals.",
    followUp: "Service-driven dynamic dialog (`dialog.open(AddEmployeeComponent)`) aur slot-based `<app-modal>` — trade-offs?",
  },
  {
    id: "cpnc-4",
    question: "Named slot ka `select` selector match na kare to kya hota hai? Debugging tip?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Unmatched content default `<ng-content>` (bina `select`) me chala jaata hai; agar wo bhi nahi hai to content silently drop ho jaata hai — koi error nahi. Debug: selector aur consumer ka attribute/class/element exactly compare karo, aur ek temporary default `<ng-content>` daalkar dekho content aa raha hai ya nahi.",
    detailedAnswer:
      "Common causes: attribute selector `[panelActions]` par consumer `panel-actions` (kebab) likhta hai; ya `select=\".actions\"` par consumer class nahi lagta; ya consumer ne content ko ek extra `<div>` me wrap kiya jisse selector top-level node par nahi. `<ng-content>` sirf **direct** projected nodes par selector apply karta hai. Fix: selector consistent rakho (attribute selectors sabse robust), aur ek fallback default slot rakho taaki unmatched content dikh jaaye during dev.",
    followUp: "`<ng-content>` ke andar fallback/default content (jab kuch project na ho) kaise dete ho?",
  },
  {
    id: "cpnc-5",
    question: "Wrapper component se projected content ko style karna hai. `::ng-deep` kyun avoid karein, aur options kya hain?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`::ng-deep` deprecated hai aur view encapsulation ko bypass karke global leak deta hai — brittle, refactor par toot-ta hai. Options: (1) CSS custom properties wrapper se expose karo; (2) consumer apni classes laaye; (3) `ViewEncapsulation.None` sirf jab genuinely ek theme component ho; (4) documented class hooks.",
    detailedAnswer:
      "Encapsulation ka poora point hai ki ek component doosre ke DOM ko accidentally style na kare. `::ng-deep` us guarantee ko todta hai. Behtar contract: wrapper `--card-padding`, `--card-radius` jaise CSS variables define kare jo consumer override kar sake; ya wrapper apne slots ke around wrapper elements par stable classes de (`.card__body`) jo consumer target kare (documented). Design systems yahi karte hain — theming CSS variables se, structural styling wrapper ke andar.",
    followUp: "CSS custom properties se theming ka ek concrete example do ek button component ke liye.",
  },
];

export default questions;
