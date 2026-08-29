import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ipb-1",
    question: "Angular me kitni tarah ki data binding hoti hai? Har ek ka ek example.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Chaar: interpolation `{{ name }}` (class -> view text), property binding `[disabled]=\"x\"` (class -> element/component property), event binding `(click)=\"save()\"` (view -> class), two-way `[(ngModel)]=\"name\"` (dono taraf). Pehli do one-way class-to-view, teesri view-to-class, chauthi combined.",
    detailedAnswer:
      "Interpolation aur property binding data ko class se view me push karte hain aur change detection par update hote hain. Event binding user actions ko class methods se jodta hai. Two-way `[(x)]` ek `[x]` property binding + `(xChange)` event binding ka syntactic sugar hai. Class/style binding (`[class.active]`, `[style.width.px]`) property binding ki hi specialized forms hain. Attribute binding `[attr.aria-label]` tab jab DOM property na ho.",
    followUp: "Two-way binding actually 'do alag bindings' kaise hai internally?",
  },
  {
    id: "ipb-2",
    question: "Interpolation aur property binding — kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Text content dikhana hai (label, count, status) -> interpolation. Element ya child component ki property set karni hai, khaaskar non-string (boolean/number/object) -> property binding.",
    detailedAnswer:
      "`<span>{{ fullName }}</span>` — text. `<button [disabled]=\"isSaving\">`, `<img [src]=\"url\">`, `<app-badge [status]=\"emp.isActive\">` — properties. Interpolation internally ek `[textContent]` binding jaisi hi hai, isliye `<span [textContent]=\"fullName\">` equivalent hai. Non-string cases me interpolation galат: `disabled=\"{{ x }}\"` string bhejta hai. Child component input hamesha `[input]=\"value\"` se.",
    followUp: "`<h1>{{ title }}</h1>` aur `<h1 [textContent]=\"title\">` me koi practical farak hai?",
  },
  {
    id: "ipb-3",
    question: "HTML attribute aur DOM property me kya farak hai? Angular is farak ko kaise handle karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Attribute HTML me likha initial value hai; property live DOM object ki current state hai. Angular ka `[x]` DOM property set karta hai; jab property exist nahi karti to `[attr.x]` se raw attribute set karte hain.",
    detailedAnswer:
      "Example: `<input value=\"hi\">` — `value` attribute initial hai; user type kare to DOM `input.value` property badal jaati hai par attribute `\"hi\"` hi rehta hai. `[value]=\"x\"` property ko set karta hai (jo actually dikhta hai). Kuch cheezein sirf attributes hain — `colspan`, `aria-*`, `data-*`, SVG — inke liye `[attr.colspan]=\"n\"`. Angular pehle dekhta hai element/directive par matching property hai kya; nahi to warning deta hai ki `[ ]` use nahi ho sakta, tab `[attr.]` chahiye.",
    followUp: "`[class.foo]` aur `[attr.class]` me se list of classes bind karne ke liye kaunsa sahi hai?",
    redFlag: "'Attribute aur property ek hi cheez hai' — reactive UIs me ye galatfehmi real bugs deti hai (jaise `value` attribute update na hona).",
  },
  {
    id: "ipb-4",
    question:
      "Ek template me `{{ orders.filter(o => o.pending).length }}` likha hai. Senior review me kya bolega?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ye expression har change-detection cycle me chalega — ek naya array banata hai aur count karta hai, bar-bar. Isko ek getter, `computed()` signal, ya precomputed property me nikaalo.",
    detailedAnswer:
      "Template expressions sasti honi chahiye kyunki CD unhe frequently re-run karta hai (Default strategy me har event par, poore tree ke liye). `filter` allocation + iteration har baar = wasted work, aur bade lists par janky UI. Behtar: signals ke saath `pendingCount = computed(() => this.orders().filter(o => o.pending).length)` — sirf tab recompute jab `orders` badle. Ya OnPush + ek plain property jo data set hote waqt update hoti hai. Rule: template me sirf reads aur trivial expressions; computation class me.",
    followUp: "Pure pipe is problem ko kaise partially solve karta hai, aur kyun woh bhi ideal nahi list-filtering ke liye?",
  },
  {
    id: "ipb-5",
    question: "Interpolation XSS ke against kaise safe hai? Kya property binding bhi safe hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Interpolation value ko `textContent` ki tarah render karta hai — HTML execute nahi hota, escape ho jaata hai. Property binding bhi safe contexts (jaise `[src]`, `[href]`) me Angular ki sanitization se guzarti hai; `[innerHTML]` sirf sanitized HTML render karta hai.",
    detailedAnswer:
      "Angular templates by default 'safe' hain: `{{ userInput }}` me `<script>` string banke dikhega. `[innerHTML]=\"html\"` par Angular DomSanitizer chalata hai jo dangerous tags/attributes strip kar deta hai. `[src]`/`[href]`/`[style]` jaise sensitive bindings bhi sanitized. Escape hatch `bypassSecurityTrust*` hai — jise sirf genuinely trusted content par use karna chahiye. Isliye Angular apps me XSS aam taur par tabhi aata hai jab koi `bypassSecurityTrust` ka misuse kare ya `innerHTML` ko raw unsanitized source se feed kare via a custom pipe.",
    followUp: "`bypassSecurityTrustHtml` kab genuinely justified hai, aur kaise minimize karoge risk?",
  },
];

export default questions;
