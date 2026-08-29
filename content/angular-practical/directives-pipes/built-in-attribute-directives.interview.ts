import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "biad-1",
    question: "Attribute directive aur structural directive me kya farak hai? Examples do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Attribute directive ek existing element ka look/behaviour badalti hai bina use add/remove kiye — `ngClass`, `ngStyle`, `ngModel`, custom `appHighlight`. Structural directive DOM me elements add/remove karti hai — historically `*ngIf`, `*ngFor`, `*ngSwitch` (ab `@if`/`@for`/`@switch` blocks).",
    detailedAnswer:
      "Structural directives ka `*` prefix ek `<ng-template>` desugar karta tha; wo template ko conditionally/repeatedly instantiate karti thi. Attribute directives element par as an attribute selector match karti hain aur `ElementRef`/`Renderer2`/`HostBinding`/`HostListener` se use manipulate karti hain. Naye Angular me built-in control flow blocks structural directives ki jagah le rahe hain, par custom structural directives (`*appIfRole`) abhi bhi likh sakte ho.",
    followUp: "Ek custom structural directive kaise banate ho — kaunsa token inject karte ho?",
  },
  {
    id: "biad-2",
    question: "`[class.x]`, `[ngClass]`, `[style.x]`, `[ngStyle]` — inme se kaunse ko import chahiye aur kaunse ko nahi?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`[class.x]` aur `[style.prop]` core template syntax hain — koi import nahi. `[ngClass]` aur `[ngStyle]` `NgClass`/`NgStyle` directives hain (`CommonModule` se) — standalone component ke `imports` me chahiye.",
    detailedAnswer:
      "Bahut se log `ngClass` ko har jagah use karte hain jabki 90% cases `[class.x]` se ho jaate hain — kam ceremony, no import, thoda faster. `ngClass`/`ngStyle` tab justified jab classes/styles ka set genuinely dynamic ho (object ek data-driven map se). Best practice: static classes `class=\"...\"`, ek-do conditionals `[class.x]`, bade maps `[ngClass]=\"computedObj\"`.",
    followUp: "`[class]=\"someString\"` (binding to the whole class attribute) kab useful hai?",
  },
  {
    id: "biad-3",
    question:
      "Ek code review me `<span [ngClass]=\"{ 'text-red': balance < 0, 'text-green': balance > 0 }\">` dikhta hai jo har render pe naya object banata hai. OnPush component hai. Problem hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Functionally theek chalega, par har CD cycle me naya object literal banta hai. `NgClass` use diff karta hai, isliye kaam to karta hai, par best practice hai object ko `computed()` me banana — stable reference, kam allocation, clearer intent.",
    detailedAnswer:
      "`NgClass` internally object ki keys ko iterate karke compare karta hai, isliye naya-object-har-baar se galat output nahi aata. Lekin: (1) allocation har cycle, (2) OnPush ke saath ye pattern logon ko confuse karta hai ('yeh to har baar naya hai'), (3) complex expressions template me chhupe rehte hain. `statusClasses = computed(() => ({ 'text-red': this.balance() < 0, ... }))` cleaner: testable, memoized, aur template padhne me halka. Isi tarah `[style.x]` prefer over `ngStyle` inline object.",
    followUp: "Agar `computed()` na ho (koi signal nahi), to same optimization getter se kaise karoge?",
  },
  {
    id: "biad-4",
    question: "`ngStyle` se poora component style karne ke kya nuqsaan hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Inline styles me `:hover`/`:focus`, media queries, keyframe animations, aur theme CSS variables use nahi kar sakte; specificity high hoti hai (override mushkil); styles har element par duplicate; aur design system se decouple ho jaate hain.",
    detailedAnswer:
      "CSS classes cascade, theming (`var(--color-danger)`), responsive breakpoints, aur pseudo-states support karti hain. `ngStyle` ka legitimate use: value jo runtime data se aati hai aur class me express nahi ho sakti — ek progress bar ki width `%` me, ek chart bar ki height `px` me, ek user-picked color. Usse bhi behtar aksar `[style.--bar-width]=\"w\"` (CSS custom property set karna) hota hai, phir CSS me `width: var(--bar-width)` — dynamic value + full CSS power.",
    followUp: "CSS custom property ko Angular binding se set karke phir stylesheet me use karna — ye pattern kab best hai?",
  },
  {
    id: "biad-5",
    question: "`class=\"badge\"` aur `[class.badge]=\"true\"` ek hi element par likhe hain. Kya hoga, aur kya ye theek hai?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "`badge` class lagegi (dono agree karte hain). Angular static `class` aur `[class.x]` bindings ko merge karta hai. Par same class par dono likhna redundant aur confusing hai — static chahiye to `class`, conditional chahiye to `[class.x]`.",
    detailedAnswer:
      "Angular final class list ko static `class` attribute + har `[class.x]` binding + `[ngClass]` result ko combine karke banata hai. Conflict tab hota hai jab `[class.badge]=\"false\"` ho par `class=\"badge\"` bhi — is case me binding jeetta hai aur class hat jaati hai, jo maintainer ko surprise kar sakta hai. Rule: ek class ek jagah se control karo.",
    followUp: "`[ngClass]` aur `[class.x]` dono ek element par ek hi class ko target karein to precedence kya hai?",
  },
];

export default questions;
