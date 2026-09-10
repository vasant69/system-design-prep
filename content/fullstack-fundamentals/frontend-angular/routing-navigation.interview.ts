import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rn-1",
    question: "Tum /orders/1 se /orders/2 navigate karte ho aur page abhi bhi order 1 ka data dikhata hai. Kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Component constructor / `ngOnInit` me `route.snapshot.paramMap` read karta hai. Jab sirf route parameter badle, router same component instance reuse karta hai, isliye `ngOnInit` dobara nahi chalta aur snapshot stale hai. `route.paramMap` par subscribe karo.",
    detailedAnswer:
      "Router component reuse karta hai jab matched route same ho aur sirf params alag hon. Fix: id ko stream ki tarah treat karo: `route.paramMap.pipe(map(p => p.get('id')), switchMap(id => api.get(id)))`, `async` pipe se consume karo. Ya `runGuardsAndResolvers` / route reuse strategy set karo, par reactive read idiomatic answer hai.",
    followUp: "Resolver yahan loading experience kaise badal deta?",
  },
  {
    id: "rn-2",
    question: "Lazy-loaded route ke liye canActivate aur canMatch me farak?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`canActivate` route match hone aur bundle download hone ke baad chalta hai — activation block karta hai, download nahi. `canMatch` route matching ke dauraan chalta hai; false return karne par router us route ko poora skip kar deta hai, isliye lazy chunk kabhi fetch nahi hota aur matching doosre route par fall through kar sakti hai.",
    detailedAnswer:
      "`canMatch` admin area par auth ke liye use karo taaki unauthorized users admin code kabhi download na karein, aur same path par condition (feature flag, role) ke hisaab se alag component serve karne ke liye. `canActivate` tab use karo jab code chahiye par per-navigation check with redirect chahiye. Jo guard `UrlTree` return karta hai wo sirf fail hone ke bajaye redirect karta hai.",
  },
  {
    id: "rn-3",
    question: "Route parameter aur query parameter me choose kaise karte ho?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Route param us cheez ke liye jo resource identify kare aur required ho (`/invoices/:id`). Query param optional, orthogonal view state ke liye — pagination, sorting, filters, active tab — jo refresh survive kare aur URL se shareable ho.",
    detailedAnswer:
      "Ek acha test: agar use hatane se URL meaningless ho jaaye, wo path param hai. Agar hatane se sirf view default par reset ho, wo query param hai. Query params cleanly stack bhi hote hain (`?page=2&sort=name&status=open`) aur router `queryParamsHandling` se unhe navigations me merge ya preserve karne deta hai.",
    redFlag: "Filter state sirf component me rakhna, taaki refresh ya shared link use kho de.",
  },
];

export default questions;
