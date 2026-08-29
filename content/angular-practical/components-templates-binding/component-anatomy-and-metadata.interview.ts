import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cam-1",
    question: "`@Component` decorator me kaunsi metadata fields hoti hain? Har ek ka role batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Core: `selector` (HTML tag), `template`/`templateUrl` (view), `styles`/`styleUrl` (scoped CSS), `imports` (template deps). Options: `changeDetection`, `encapsulation`, `host`, `providers`, `animations`.",
    detailedAnswer:
      "`selector` — kebab-case tag. `template`/`templateUrl` — rendered HTML (ek time me ek). `styles`/`styleUrl(s)` — component-scoped CSS. `imports` — standalone component ki dependencies (components/directives/pipes/NgModules). `changeDetection` — `Default` ya `OnPush`. `encapsulation` — `Emulated`/`None`/`ShadowDom`. `host` — root element par class/attr/event bindings. `providers` — component-scoped DI. `animations` — Angular animations metadata. Typical component 4-6 fields use karta hai.",
    followUp: "In me se kaunsi field template me kabhi visible nahi hoti par behaviour badal deti hai?",
  },
  {
    id: "cam-2",
    question: "View encapsulation ke teen modes samjhao. Default kaunsa aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`Emulated` (default) — Angular CSS selectors ko unique attributes se qualify karke scope karta hai, bina real Shadow DOM ke. `None` — styles global. `ShadowDom` — browser ka native Shadow DOM, real isolation.",
    detailedAnswer:
      "`Emulated` best of both: cross-browser, scoped styles, par `::slotted` jaisi shadow-DOM-only cheezein nahi. Angular har component element par `_ngcontent-xxx` attribute aur CSS rules par matching attribute add karta hai. `None`: koi scoping nahi — component ki CSS poori app ko affect karti hai (theme/global components me kabhi use, warna risky). `ShadowDom`: true encapsulation (styles andar-bahar dono direction me isolated), par global styles component ke andar penetrate nahi karte aur kuch tooling/testing friction. Default `Emulated` isliye kyunki 95% cases me yahi chahiye — predictable, portable.",
    followUp: "Agar ek third-party global CSS ko ShadowDom component ke andar apply karna ho to kaise karoge?",
    redFlag: "'Encapsulation component ko dusre components se hide karta hai' — ye sirf CSS scoping hai, JS/DOM visibility se koi lena-dena nahi.",
  },
  {
    id: "cam-3",
    question: "`host` property kab use karte ho? Ek example do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Jab component ke apne root element par kuch lagana ho — ek class, conditional class, ARIA attribute, ya event listener — bina template me wrapper element add kiye. Jaise `host: { class: 'card', role: 'article', '(keydown.escape)': 'close()' }`.",
    detailedAnswer:
      "`host` bindings component ke host element par apply hote hain: static values (`class`, `role`, `id`), dynamic bindings (`'[class.active]': 'isActive'`, `'[attr.aria-expanded]': 'open'`), aur listeners (`'(click)': 'onClick()'`). Faayda: DOM clean rehta hai (ek extra `<div>` nahi), aur styling predictable (component = ek element). Design-system components (buttons, chips) yeh heavily use karte hain. Alternative decorators `@HostBinding` / `@HostListener` bhi wahi kaam karte hain class properties/methods par, par `host` object metadata me concise hai.",
    followUp: "`@HostBinding` aur `host` metadata me se kaunsa prefer karoge aur kyun?",
  },
  {
    id: "cam-4",
    question:
      "Ek component me `template` aur `templateUrl` dono set hain. Kya hoga?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Angular compile-time error deta hai — ek component me `template` aur `templateUrl` dono nahi ho sakte. Ek chuno.",
    detailedAnswer:
      "Compiler explicitly is combination ko reject karta hai (`Component cannot have both 'template' and 'templateUrl'`). Same spirit `styles` vs `styleUrl` par bhi — waha technically dono merge ho sakte hain par confusing hai. Rule: chhota inline `template`, bada `templateUrl`. Ye galti aksar tab hoti hai jab inline template ko external file me move karte waqt purani line delete karna bhool jao.",
    followUp: "Inline template me multi-line HTML kaise likhte ho, aur uska ek downside kya hai?",
  },
  {
    id: "cam-5",
    question:
      "Team lead bolta hai 'sab components me `changeDetection: OnPush` daal do'. Ek developer ka existing code OnPush ke baad kuch jagah toot jaata hai. Kya diagnose karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "OnPush ke baad view sirf input-reference change / component event / signal change / async pipe emission par update hota hai. Toota hua code aksar object/array ko in-place mutate kar raha hota hai, ya bahar (setTimeout, non-Angular callback) se state badal raha hota hai bina change detection trigger kiye.",
    detailedAnswer:
      "Checklist: (1) `@Input` objects/arrays mutate ho rahe hain? — immutable update (spread) ya signals me convert karo. (2) State kisi third-party callback/`setTimeout`/websocket me badal raha hai? — signal use karo, ya `ChangeDetectorRef.markForCheck()` call karo, ya observable + `async` pipe. (3) Template me function calls jo har CD par recompute hote the — ab kam chalte hain, isliye stale dikh sakte hain — computed/signal me move karo. (4) Parent ne child ko input diya par reference kabhi nahi badla. Long-term fix: signals-first code, jaha OnPush automatically correct rehta hai.",
    followUp: "`markForCheck()` aur `detectChanges()` me kya farak hai?",
    redFlag: "'OnPush buggy hai, hata do' — problem OnPush nahi, mutation-based state hai; signals/immutability se dono theek.",
  },
];

export default questions;
