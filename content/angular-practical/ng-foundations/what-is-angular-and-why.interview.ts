import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "wiaw-1",
    question: "Angular kya hai? Ek-do line me batao, jaise interview ke shuru me poochha jaata hai.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Angular ek TypeScript-based SPA framework hai jo component model, templating, dependency injection, routing, forms, aur HTTP client ko ek integrated, officially-maintained package me deta hai.",
    detailedAnswer:
      "Angular Google ka open-source front-end framework hai (current 'Angular' = v2 se aage; AngularJS v1 alag purana framework hai). Ye single-page applications banane ke liye hai — HTML shell ek baar load hota hai, phir Angular state ke hisaab se DOM ka sirf zaroori hissa update karta hai (declarative rendering). 'Framework' isliye kyunki ye sirf view layer nahi deta — router, reactive/template-driven forms, DI system, HttpClient, aur testing utilities sab ek versioned release me aate hain. Bhaasha TypeScript hai, jisse bade codebases me refactoring aur tooling strong rehti hai. Typical use: enterprise / internal business apps jaise admin panels, HR portals, dashboards.",
    followUp: "Agar sab kuch bundled hai to iska downside kya hai?",
    redFlag: "'Angular aur AngularJS ek hi hain' — ye do alag frameworks hain, beech me poora rewrite hua.",
  },
  {
    id: "wiaw-2",
    question: "SPA aur MPA me kya farak hai? Angular kahan fit hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "MPA me har navigation par server naya HTML page bhejta hai aur browser poora page re-render karta hai. SPA me HTML ek baar load hota hai, phir client-side JS navigation aur partial DOM updates handle karta hai; data JSON me aata hai. Angular ek SPA framework hai.",
    detailedAnswer:
      "MPA (server-rendered multi-page): har link full round-trip, server HTML compose karta hai, browser sab kuch dobara paint karta hai — simple, SEO-friendly by default, par har interaction par flicker/reload. SPA: ek shell + JS bundle, uske baad router URL change ko intercept karta hai, sirf badla hua component swap hota hai, aur data `fetch`/XHR se JSON aata hai. SPA fast feels-native navigation deta hai aur rich interactivity (live filters, forms, dashboards) me strong hai, par initial bundle bada hota hai aur SEO ke liye SSR/prerender chahiye. Angular clearly SPA side pe hai (SSR ke liye Angular Universal / built-in hydration bhi ab available hai). EMS jaisa forms+tables-heavy internal app SPA ke liye ideal case hai.",
    followUp: "SPA ka SEO problem kaise solve karte hain?",
  },
  {
    id: "wiaw-3",
    question: "Angular vs React — main differences kya hain? Kab kya chunoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "React ek UI library hai — routing, forms, data fetching, state management sab aap alag se chunte ho, zyada flexibility. Angular ek opinionated full framework hai — ye sab official aur bundled, zyada consistency. Bade enterprise/team apps ke liye Angular; chhote ya highly custom apps ke liye React aksar.",
    detailedAnswer:
      "React: sirf view + component model deta hai; ecosystem se React Router, react-hook-form, TanStack Query, Redux/Zustand jaise pieces jodte ho. Zyada choice, par har team ka stack alag, onboarding me variance. JSX me JS aur markup mila hua. Angular: CLI, router, forms (2 flavours), DI, HttpClient, RxJS integration, testing setup sab in-the-box aur ek saath version-tested. Templates alag HTML syntax me (`@if`, `[prop]`, `(event)`). Angular ka DI aur RxJS learning curve sharp hai. Decision: badi team, lambi life, strict conventions chahiye, bahut sare CRUD screens -> Angular. Chhoti team, maximum flexibility, halka bundle -> React. Dono production-grade hain; 'kaunsa behtar' nahi, 'kaunsa is context me behtar' wali baat hai.",
    followUp: "Angular ke DI system ka ek concrete faayda batao jo React me by default nahi milta.",
    redFlag: "'React purana ho gaya' ya 'Angular dead hai' jaisa absolute statement — dono actively maintained aur widely used hain.",
  },
  {
    id: "wiaw-4",
    question:
      "Ek client ko ek 4-page marketing website chahiye — home, about, pricing, contact form. Kya aap Angular recommend karoge? Justify karo.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Itni chhoti, mostly-static site ke liye Angular ka bundle aur build setup overkill hai. Static site generator (Astro/Next static, ya plain HTML) behtar — fast load, better SEO by default, kam maintenance.",
    detailedAnswer:
      "Angular ka value tab dikhta hai jab app me heavy interactivity, bahut sare forms, shared state, role-based screens, aur lambi maintenance life ho. 4 static pages + ek contact form me se kuch bhi nahi. Angular chunne ka cost: bada JS bundle (slow first paint, mobile pe khaas kar), SEO ke liye extra SSR/prerender setup, aur ek build pipeline jise koi maintain kare. Behtar: static-first tooling, contact form ek serverless function ya form service se. Agar client bole 'aage ye ek pura portal banega with login and dashboards', tab conversation badal jaati hai — future scope genuine ho to SPA framework justify ho sakta hai.",
    followUp: "Agar wahi client 6 mahine baad ek logged-in customer dashboard maange, to aap kaise decide karoge migrate karna hai ya alag app banani hai?",
    redFlag: "'Main hamesha Angular use karta hoon isliye Angular' — tool ko problem se match karna aana chahiye.",
  },
  {
    id: "wiaw-5",
    question:
      "Modern Angular (v17+) me project setup purane tutorials se kaise alag hai? 'Standalone' ka kya matlab hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Purane Angular me har feature ko ek `@NgModule` me `declarations`/`imports` ke through register karna padta tha, aur app `app.module.ts` se bootstrap hoti thi. Standalone components me ye NgModule layer hat gaya — component apni dependencies khud `imports` array me leta hai, aur app `main.ts` me `bootstrapApplication()` se start hoti hai.",
    detailedAnswer:
      "Standalone APIs (v14 me introduce, v17 se default) ka goal boilerplate kam karna aur mental model simple karna hai. Ab: `@Component({ standalone: true, imports: [...] })` — component seedhe batata hai use kaunse dusre components/directives/pipes chahiye. Koi central `declarations` list nahi jise sync rakhna pade. Routing `provideRouter()`, HTTP `provideHttpClient()` jaise 'provider functions' se `bootstrapApplication(App, { providers: [...] })` me configure hota hai — koi `AppModule`, `AppRoutingModule`, `HttpClientModule` nahi. Iska practical asar: naye tutorials aur purane 2020-2022 wale tutorials structurally alag dikhte hain; purане se copy-paste karte waqt aapko error milega ki 'X is not a known element' kyunki wahan module-based registration expect hota hai. Is course me hum sirf standalone use karenge.",
    followUp: "Standalone components ke saath lazy loading kaise karte ho — `loadChildren` vs `loadComponent`?",
  },
];

export default questions;
