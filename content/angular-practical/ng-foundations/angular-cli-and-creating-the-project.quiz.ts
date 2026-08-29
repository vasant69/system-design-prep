import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "angular-cli-and-creating-the-project-1",
    question: "`ng serve` aur `ng build` me sabse bada practical farak kya hai?",
    options: [
      "`ng serve` production ke liye hai, `ng build` sirf testing ke liye",
      "`ng serve` in-memory build deta hai localhost par live reload ke saath (optimize nahi); `ng build` disk par optimized production bundle `dist/` me likhta hai",
      "Dono bilkul same hain, sirf naam alag hai",
      "`ng build` browser khol deta hai, `ng serve` nahi",
    ],
    correctIndex: 1,
    explanation:
      "`ng serve` local development ke liye hai — compile memory me, port 4200, file change par auto reload, koi minify/hash nahi. `ng build` deploy ke liye — minified, tree-shaken, hashed files `dist/<project>/browser/` me. Option A ulta hai. Option C galat — behaviour aur output alag hai. Option D galat — `--open` flag `ng serve` ke saath browser kholta hai, `ng build` kuch serve karta hi nahi.",
    difficulty: "easy",
  },
  {
    id: "angular-cli-and-creating-the-project-2",
    question: "`ng generate component features/employees/employee-list` chalane par kya milta hai?",
    options: [
      "Sirf ek `.ts` file `src/app/` me",
      "`src/app/features/employees/employee-list/` folder me component TS + HTML (+ styles + spec test file), sahi naming ke saath",
      "Ek naya Angular project",
      "Kuch nahi, kyunki path ke saath generate allowed nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "`ng g c <path/name>` diye gaye path par component ka folder banata hai jisme component class, template, styles, aur ek spec (test) file hoti hai — Angular naming conventions ke saath. Option A galat — CLI pura folder aur multiple files deta hai. Option C galat — wo `ng new` hai. Option D galat — path dena normal aur recommended hai.",
    difficulty: "easy",
  },
  {
    id: "angular-cli-and-creating-the-project-3",
    question:
      "Ek developer ke paas 2 saal purana global `@angular/cli` hai, aur wo ek naya v18 project pe `ng serve` chalata hai — ajeeb errors aate hain. Best fix kya hai?",
    options: [
      "Project delete karke dobara banao",
      "Project ke andar `npx ng serve` chalao (project-local CLI use hota hai), ya global CLI ko `npm i -g @angular/cli@latest` se update karo",
      "Errors ignore karo, chal jaayega",
      "`node_modules` git me commit kar do taaki versions lock ho jaayein",
    ],
    correctIndex: 1,
    explanation:
      "Global CLI version aur project ka expected CLI version mismatch hone par yehi classic problem hoti hai. `npx ng` project ke `node_modules` wala CLI (jo `package.json` me pinned hai) chalata hai. Ya global CLI update kar do. Option A overkill. Option C — errors real hain, chalega nahi. Option D — `node_modules` kabhi commit nahi karte; `package-lock.json` hi version lock karta hai.",
    difficulty: "medium",
  },
  {
    id: "angular-cli-and-creating-the-project-4",
    question: "Modern Angular me `ng new` se bana project by default kaisa hota hai?",
    options: [
      "`app.module.ts` (NgModule) based, har component `declarations` me register",
      "Standalone components based — koi root `AppModule` nahi, `main.ts` me `bootstrapApplication`",
      "Bina TypeScript ke, plain JavaScript",
      "Sirf server-side rendering (SSR) ke saath, client-side option nahi",
    ],
    correctIndex: 1,
    explanation:
      "v17+ me `ng new` ka default standalone hai — component apni dependencies `imports` me leta hai, aur app `bootstrapApplication(App, appConfig)` se `main.ts` me start hoti hai. Koi `AppModule`/`declarations` nahi. Option A purana default tha. Option C galat — Angular TypeScript-first hai. Option D galat — SSR ek opt-in flag hai (`--ssr`), default client-side.",
    difficulty: "medium",
  },
];

export default quiz;
