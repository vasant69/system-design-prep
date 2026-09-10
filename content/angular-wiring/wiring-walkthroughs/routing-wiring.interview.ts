import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rw-1",
    question: "Angular Router me URL se component tak ka connection kaunse teen pieces banate hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "(1) `Routes` array + `RouterModule.forRoot(routes)` — path-to-component ka table. (2) `<router-outlet>` — placeholder jahan matched component render hota hai. (3) `routerLink` (ya `Router.navigate`) — jo navigation trigger karta hai bina full page reload ke.",
    detailedAnswer:
      "Navigation par Router: URL match karta hai, guards/resolvers chalata hai, current outlet component destroy karta hai, matched component instantiate karke outlet me daalta hai, aur `history.pushState` se URL update karta hai. `forRoot` app root par ek hi baar; feature modules `forChild` use karte hain.",
    followUp: "`forRoot` aur `forChild` me kya farak hai?",
  },
  {
    id: "rw-2",
    question: "Route navigate karne par purana component ka kya hota hai — reuse hota hai ya naya banta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Default me purana component **destroy** ho jaata hai (`ngOnDestroy`) aur naye route ka component fresh **instantiate** hota hai (`ngOnInit`). Uski component-level state reset ho jaati hai jab tak wo state kisi service me na ho.",
    detailedAnswer:
      "Exception: agar tum same route par sirf param badalte ho (`/user/1` -> `/user/2`), Router same component instance reuse karta hai — tab `ngOnInit` dobara nahi chalta, isliye param ko `paramMap` stream se read karo `snapshot` se nahi. State preserve karni ho to service me rakho ya custom `RouteReuseStrategy`.",
    redFlag: "Ye maan lena ki component navigate ke baad apni scroll position / form values automatically yaad rakhega.",
  },
  {
    id: "rw-3",
    question: "`routerLink=\"/about\"` aur plain `href=\"/about\"` me kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`href` browser ko full page reload karwata hai — poora Angular app dobara boot hota hai, saari state chali jaati hai. `routerLink` directive click intercept karti hai, `preventDefault` karti hai, aur Router se client-side navigation karwati hai — koi reload nahi, state bani rehti hai, `history` update hota hai.",
    detailedAnswer:
      "`routerLink` `history.pushState` use karta hai, isliye back/forward buttons kaam karte hain aur URL shareable rehta hai. External links ya jaan-boojh kar full reload chahiye ho tabhi `href`. `routerLinkActive` se active link ko class laga sakte ho.",
  },
];

export default questions;
