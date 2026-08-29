import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "psw-1",
    question: "Angular project ka structure walk-through karo — kaunsi file kya karti hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`package.json` = deps + scripts. `angular.json` = CLI build/serve/test config. `tsconfig*` = TypeScript settings. `src/index.html` = single page with `<app-root>`. `src/main.ts` = bootstrap. `src/app/app.config.ts` = app-wide providers. `src/styles.scss` = global CSS. `src/app/` = your code.",
    detailedAnswer:
      "Standalone project me: `index.html` me ek `<app-root>` aur `<base href>`. `main.ts` `bootstrapApplication(App, appConfig)` chalata hai. `app.config.ts` `ApplicationConfig` export karta hai jisme `provideRouter`, baad me `provideHttpClient`, interceptors, etc. `app.routes.ts` route array. `app.ts/html/scss` root component. `angular.json` batata hai entry files kahan hain, global `styles`/`scripts`, aur `production`/`development` configurations + budgets. `tsconfig.json` base (strict), `tsconfig.app.json`/`tsconfig.spec.json` extend karti hain. Convention: `core/` singletons, `shared/` reusable dumb UI, `features/` screens.",
    followUp: "Purane NgModule-based project me is list me se kya extra hota (app.module.ts) aur kya alag hota?",
  },
  {
    id: "psw-2",
    question: "`angular.json` kis liye hai? Ek example do jab tumne use edit kiya ho.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ye Angular CLI ki configuration hai — build/serve/test ke targets, entry file paths, global `styles` aur `scripts` arrays, assets, aur `production`/`development` jaise configurations with optimization + budgets.",
    detailedAnswer:
      "Common edits: (1) kisi UI library ki global CSS ko `build > styles` array me add karna; (2) `assets` me ek extra folder include karna; (3) production `budgets` badhaana jab bundle warning aaye; (4) `outputPath` ya `baseHref` deployment ke liye adjust karna; (5) ek nayi `configuration` (jaise `staging`) add karna alag `fileReplacements` ke saath. Ye strict JSON hai, isliye chhoti syntax galti build tod deti hai — chhote edits aur `ng build` se verify.",
    followUp: "`fileReplacements` kaise environment-specific builds enable karta hai?",
  },
  {
    id: "psw-3",
    question: "Global style aur component style — kahan kya rakhoge, aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "App-wide cheezein (CSS reset, font, theme variables, utility classes) `src/styles.scss` me. Ek component ke apne layout/look ke rules us component ke `.scss` me — wo default me scoped hota hai isliye leak nahi karta.",
    detailedAnswer:
      "Angular component styles ko View Encapsulation se scope karta hai (emulated by default — CSS selectors ke saath ek unique attribute add hota hai). Isliye `EmployeeCard` ke `.scss` me likha `.title { color: red }` sirf us card ke andar lagega, kisi aur `.title` par nahi. Jo cheez genuinely global honi chahiye (typography, spacing scale, `.btn` design-system class) wo `styles.scss` me — warna har component me duplicate karni padegi. Anti-pattern: `styles.scss` me component-specific selectors bhar dena, ya component me `::ng-deep` se doosre components ko style karna (deprecated, brittle).",
    followUp: "`::ng-deep` kyun avoid karte hain, aur uska modern alternative kya hai?",
    redFlag: "'Sab kuch styles.scss me daal deta hoon, aasan rehta hai' — encapsulation ka poora faayda khatam, naming collisions aur specificity wars.",
  },
  {
    id: "psw-4",
    question: "`core/`, `shared/`, `features/` folder convention ka rationale kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`core/` = app-wide singletons (services, guards, interceptors, models) jo ek hi baar exist karte hain. `shared/` = stateless reusable UI (components, pipes, directives) jo kai features use karte hain. `features/` = screen-level code, ek folder per feature area.",
    detailedAnswer:
      "Ye separation dependencies ki direction clear rakhta hai: `features` `shared` aur `core` par depend karte hain, `shared` sirf `core` par (ya kuch bhi nahi), `core` kisi feature par nahi. Isse: (1) circular deps avoid hote hain, (2) lazy-loaded features apna code apne bundle me le jaate hain jabki `shared`/`core` common rehta hai, (3) naya dev jaanta hai 'reusable button kahan', 'auth service kahan', 'employees screen kahan'. Standalone components ke saath ye purely folder + import discipline hai — koi NgModule enforce nahi karta.",
    followUp: "Agar do features ek hi component share karne lagein to wo `features` me rahe ya `shared` me move ho — kaise decide karoge?",
  },
  {
    id: "psw-5",
    question: "`src/index.html` me `<base href=\"/\">` kya karta hai, aur deploy par ye kab badalna padta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`<base href>` browser ko batata hai ki relative URLs (router links, assets) kis prefix se resolve hon. Agar app sub-path par deploy ho (jaise `example.com/ems/`) to `href` ko `/ems/` karna padta hai.",
    detailedAnswer:
      "Angular router aur asset paths `<base href>` ke relative kaam karte hain. Root domain par deploy (`example.com/`) me `/` theek hai. Lekin agar reverse proxy ya CDN app ko `example.com/ems/` par serve karein, to `<base href=\"/ems/\">` chahiye warna `/employees` jaise routes 404 denge aur images toot jaayengi. Isko build-time set karne ka tareeka: `ng build --base-href /ems/`. SPA ke liye server par bhi ek fallback rewrite chahiye (sab unknown paths -> `index.html`).",
    followUp: "SPA deploy par 'refresh karne se 404 aata hai' — kyun hota hai aur kaise theek karte ho?",
  },
];

export default questions;
