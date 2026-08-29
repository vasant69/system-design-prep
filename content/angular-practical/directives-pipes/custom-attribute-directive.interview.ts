import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cad-1",
    question: "Custom attribute directive kaise banate ho? Ek chhota example.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`@Directive({ selector: '[appHighlight]' })` class banao, `inject(ElementRef)` ya host bindings se element ko access karo, `@HostListener`/`@HostBinding` se behaviour add karo, `input()` se configure karo. Standalone hai — component ke `imports` me add.",
    detailedAnswer:
      "```ts\n@Directive({ selector: '[appHighlight]' })\nexport class HighlightDirective {\n  private el = inject(ElementRef<HTMLElement>);\n  color = input('yellow', { alias: 'appHighlight' });\n  @HostListener('mouseenter') on() { this.el.nativeElement.style.background = this.color(); }\n  @HostListener('mouseleave') off() { this.el.nativeElement.style.background = ''; }\n}\n```\nUse: `<p appHighlight>` ya `<p [appHighlight]=\"'#cde'\">`. Production me `nativeElement.style` ke bajaye `@HostBinding('style.background')` prefer karo.",
    followUp: "Ek element par teen directives lagi hain — unka execution order kaise decide hota hai?",
  },
  {
    id: "cad-2",
    question: "`@HostBinding` aur `host` metadata object — dono me se kya use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Dono equivalent hain. `host: { '[class.x]': 'expr', '(click)': 'onClick()' }` metadata me concise hai aur ek jagah dikhta hai. `@HostBinding`/`@HostListener` decorators class members par lagte hain — jab binding ka logic ek getter/method me ho to natural. Team consistency zyada matter karti hai.",
    detailedAnswer:
      "`host` object recommended hai naye style guide me kyunki saare host interactions ek jagah, aur decorator overhead nahi. `@HostBinding` tab handy jab value ek computed getter ho (`@HostBinding('class.invalid') get invalid() { return this.control.invalid; }`). Mixing avoid karo — ek directive me ek style.",
    followUp: "`@HostBinding('attr.aria-disabled')` aur `@HostBinding('disabled')` me kab kaunsa?",
  },
  {
    id: "cad-3",
    question: "`ElementRef` aur `Renderer2` me kya farak hai? Kab kaunsa?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`ElementRef` seedha native element deta hai (`nativeElement`) — direct DOM access, browser-only, XSS/SSR risk. `Renderer2` ek abstraction hai (`setStyle`, `addClass`, `listen`, `setAttribute`) jo SSR, Web Workers, aur sanitization ke saath safely kaam karta hai.",
    detailedAnswer:
      "Chhoti, browser-only apps me `ElementRef` se `focus()` ya `getBoundingClientRect()` jaise reads theek hain. Writes (styles, classes, attributes, listeners) `Renderer2` se karో taaki: (1) server-side rendering pe crash na ho, (2) `innerHTML`-style injection se bacho, (3) platform-agnostic rahe. Sabse behtar aksar `@HostBinding`/`host` — declarative aur Angular khud Renderer use karta hai.",
    followUp: "`Renderer2.setProperty(el, 'innerHTML', userInput)` bhi risky hai kya?",
    redFlag: "'Directive me hamesha nativeElement.innerHTML set karta hoon' — direct XSS surface.",
  },
  {
    id: "cad-4",
    question:
      "EMS me role-based UI chahiye — kuch buttons sirf HR Admin ko dikhein. Directive-based approach design karo.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ek structural directive `*appHasPermission=\"'employee.delete'\"` — `TemplateRef` + `ViewContainerRef` inject, `AuthService.hasPermission(perm)` check, allowed hone par `createEmbeddedView`, warna `clear`. `effect()` se auth signal change par re-evaluate. Server par bhi same check (frontend gating sirf UX).",
    detailedAnswer:
      "Design points: (1) permission strings ek central enum/const me, taaki typos na hon; (2) structural (DOM se remove) vs attribute (`[hidden]`) — sensitive actions ke liye remove, taaki DOM inspect karke bhi na dikhe; (3) `input.required<string>()` se permission mandatory; (4) `AuthService` permissions ko signal me rakhe taaki login/role-change par UI auto-update ho; (5) ek `canPermission()` method service par bhi expose karo programmatic checks ke liye (guards, disabling). Security note: ye purely UX hai — API endpoints ko independently authorize karna zaroori hai.",
    followUp: "Agar 20 jagah `*appHasPermission` laga ho aur permission model badle, to regression se kaise bachoge?",
  },
  {
    id: "cad-5",
    question: "Ek directive `scroll` event par kaam karta hai aur app janky ho jaati hai. Kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`scroll`/`mousemove` bahut frequent hain — har event ke baad Angular CD chalta hai. Fix: listener ko `NgZone.runOutsideAngular` me register karo, work ko throttle/`requestAnimationFrame` se batch karo, aur sirf zaroorat par `ngZone.run(() => ...)` se wapas zone me aao.",
    detailedAnswer:
      "Default me `@HostListener('scroll')` har scroll tick par ek CD pass trigger karta hai — 60+ times/sec poore tree ke liye. Steps: (1) `constructor` me `inject(NgZone).runOutsideAngular(() => el.addEventListener('scroll', handler))`; (2) handler me `requestAnimationFrame` ya a throttle se actual DOM read/write batch karo; (3) agar handler ko component state badalni ho jo template me bind hai, to us chhote hisse ko `ngZone.run(...)` me wrap karo (ya signal set karo jo apne aap schedule ho jaata hai). Passive listener (`{ passive: true }`) scroll performance aur behtar karta hai.",
    followUp: "Signals ke saath ye problem kitni kam ho jaati hai, aur kyun?",
  },
];

export default questions;
