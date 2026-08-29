import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "standalone-components-and-bootstrap-1",
    question: "Standalone component ka matlab kya hai?",
    options: [
      "Ek component jise koi dependency nahi chahiye",
      "Ek component jo apni template dependencies (child components, directives, pipes) khud apne `imports` array me declare karta hai, bina kisi NgModule ke",
      "Ek component jo sirf lazy-loaded routes me chal sakta hai",
      "Ek component jo apna alag TypeScript file nahi rakhta",
    ],
    correctIndex: 1,
    explanation:
      "Standalone matlab component self-contained hai — jo bhi uske template me use hota hai wo uske `imports` me listed hai, NgModule ki zaroorat nahi. Option A galat — dependencies hoti hain, bas component khud declare karta hai. Option C galat — standalone components kahin bhi chalte hain. Option D galat — file structure se koi lena-dena nahi.",
    difficulty: "easy",
  },
  {
    id: "standalone-components-and-bootstrap-2",
    question: "Standalone app me `main.ts` kis function se boot hoti hai?",
    options: [
      "`bootstrapModule(AppModule)`",
      "`platformBrowserDynamic().bootstrap()`",
      "`bootstrapApplication(App, appConfig)` — pehla arg root component, doosra ApplicationConfig with providers",
      "`new App().render()`",
    ],
    correctIndex: 2,
    explanation:
      "Standalone bootstrap `bootstrapApplication(RootComponent, appConfig)` hai. Option A NgModule-era hai (`bootstrapModule` ek module leta hai, component nahi). Option B purane platform bootstrap ka hissa tha. Option D aisa koi Angular API nahi.",
    difficulty: "easy",
  },
  {
    id: "standalone-components-and-bootstrap-3",
    question:
      "Purane tutorial me `imports: [HttpClientModule]` aur `RouterModule.forRoot(routes)` dikhta hai. Modern standalone equivalent kya hai?",
    options: [
      "Same hi likho, dono abhi bhi recommended hain",
      "`app.config.ts` ke `providers` me `provideHttpClient()` aur `provideRouter(routes)`",
      "In dono ki zaroorat hi nahi, Angular auto-configure kar deta hai",
      "Har component ke `imports` me `HttpClientModule` aur `RouterModule` daalo",
    ],
    correctIndex: 1,
    explanation:
      "Modern pattern module imports ki jagah provider functions hai: `provideHttpClient()`, `provideRouter(routes)`, `app.config.ts` ke `providers` array me. Option A galat — ye legacy raasta hai. Option C galat — HTTP aur router explicitly provide karne padte hain. Option D galat aur repetitive — ye app-level config hai.",
    difficulty: "medium",
  },
  {
    id: "standalone-components-and-bootstrap-4",
    question:
      "Aapko error milta hai: \"'app-employee-card' is not a known element\". App-employee-card ek standalone component hai. Fix kya hai?",
    options: [
      "`app.config.ts` me EmployeeCard ko providers me add karo",
      "Jis component ke template me `<app-employee-card>` use ho raha hai, us component ke `@Component` `imports` array me `EmployeeCard` add karo",
      "`main.ts` me EmployeeCard import karo",
      "EmployeeCard ko `standalone: false` bana do",
    ],
    correctIndex: 1,
    explanation:
      "Standalone model me har component apni template dependencies khud import karta hai. `<app-employee-card>` use karne wale component ke `imports` me `EmployeeCard` class chahiye. Option A galat — ye ek component hai, provider nahi. Option C galat — `main.ts` sirf root boot karta hai. Option D galat aur backwards — `standalone: false` NgModule registration maangta hai.",
    difficulty: "medium",
  },
];

export default quiz;
