import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "nrlr-1",
    question: "`routerLink` aur `Router.navigate()` — dono kab use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`routerLink` template me user ke direct clicks ke liye — ek real `<a>` render hota hai, SPA navigation, new-tab/middle-click kaam karta hai. `Router.navigate(commands, extras)` code se — action ke baad redirect (form save, login, logout), guard redirects, conditional flows.",
    detailedAnswer:
      "`routerLink` array form dynamic segments deta hai (`['/employees', id, 'edit']`); query params `[queryParams]`, fragment `fragment`. `Router.navigate` wahi commands array leta hai plus `extras` (`queryParams`, `relativeTo`, `replaceUrl`, `state`, `queryParamsHandling`) aur `Promise<boolean>` return karta hai (guard cancel -> `false`). Rule: agar user click karke jaayega aur destination static-ish hai -> `routerLink`. Agar navigation ek side-effect hai -> service.",
    followUp: "Ek nav item jo click par navigate bhi karein aur ek dropdown bhi khole — kaise structure karoge?",
  },
  {
    id: "nrlr-2",
    question: "`routerLinkActive` kaise kaam karta hai? `exact` option kab chahiye?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`routerLinkActive=\"cls\"` uske `routerLink` ke current URL se match hone par `cls` class (aur optionally `[ariaCurrentWhenActive]`) lagata hai. Default match prefix-based hai; `[routerLinkActiveOptions]=\"{ exact: true }\"` sirf exact URL par.",
    detailedAnswer:
      "Prefix matching se `/employees` link `/employees/42` par bhi active rehta hai — sidebar section highlight ke liye ye chahiye. Lekin home `/` link har route ka prefix hai, to `/` link hamesha active dikhega — waha `{ exact: true }`. Angular 17+ me `IsActiveMatchOptions` (`{ paths, queryParams, fragment, matrixParams }`) se fine-grained control. Accessibility: active link par `aria-current=\"page\"` bhi set karo (`ariaCurrentWhenActive`).",
    followUp: "Query params ke saath active-matching — jaise `?tab=details` par hi ek link active ho — kaise?",
  },
  {
    id: "nrlr-3",
    question:
      "Auth guard user ko login par bhej raha hai aur login ke baad wapas original page par laana hai. Kaise implement karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Guard redirect me `returnUrl` query param bhejo: `router.navigate(['/login'], { queryParams: { returnUrl: state.url } })`. Login success par `router.navigateByUrl(route.snapshot.queryParams['returnUrl'] || '/dashboard')`, usually `{ replaceUrl: true }` ke saath.",
    detailedAnswer:
      "Guard: `const returnUrl = router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }); return returnUrl;` (functional guard ek `UrlTree` return kar sakta hai redirect ke liye — cleaner than side-effect navigate). Login component: submit success par `const target = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard'; this.router.navigateByUrl(target, { replaceUrl: true });`. `replaceUrl` taaki back button login pe na aaye. Security: `returnUrl` ko validate karo (only same-origin relative paths) — open-redirect se bachne ke liye.",
    followUp: "`returnUrl` ke through open-redirect vulnerability kaise aata hai aur kaise rokoge?",
  },
  {
    id: "nrlr-4",
    question: "Nav menu me links `<button (click)=\"router.navigate([...])\">` se banaye gaye hain. Kya feedback?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ye `<a>` semantics kho deta hai: no real `href`, no middle-click/Ctrl+click 'open in new tab', screen readers ise link nahi button announce karte, aur `routerLinkActive` styling nahi milti. Navigation links `<a routerLink>` hone chahiye; `<button>` sirf actions ke liye.",
    detailedAnswer:
      "Accessible aur user-friendly navigation ke liye `<a routerLink>` chahiye — browser aur AT dono use link ki tarah treat karte hain, aur users expect karte hain ki wo new tab me khol sakein. `<button>` + `router.navigate` sirf tab jab navigation ek genuine side-effect ho (form submit ke baad). Menu items, breadcrumbs, list-to-detail — sab `<a routerLink>`. Bonus: `routerLink` ke saath Angular `<a>` ko preconnect/prefetch hints bhi de sakta hai.",
    followUp: "Kya ek `<a>` ko `role=\"button\"` de kar dono behaviours mila sakte ho? Achha idea?",
  },
  {
    id: "nrlr-5",
    question: "`router.navigate` ka `Promise<boolean>` return value kab check karna zaroori hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Jab aap navigation success par kuch aur karna chahte ho, ya jab ek guard/`CanDeactivate` navigation cancel kar sakti hai. `const ok = await this.router.navigate(...); if (!ok) { /* stayed on page, maybe show why */ }`.",
    detailedAnswer:
      "`navigate` resolves `true` (succeeded), `false` (guard cancelled / same URL no-op), ya rejects (error in a resolver/guard). Example: 'Save & close' button — agar `CanDeactivate` unsaved-changes guard navigation rok de, to aap close-modal logic nahi chalana chahte. Ya multi-step wizard me next step par jaane se pehle confirm karna. Fire-and-forget navigation (simple link-style redirects) me check ki zaroorat nahi, par flows me hai.",
    followUp: "Navigation ke dauran ek error (resolver throw) ko globally kaise handle karoge?",
  },
];

export default questions;
