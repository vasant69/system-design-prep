import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "scb-1",
    question: "Standalone components kya hain? NgModule ki jagah kya aaya?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Standalone component apni template dependencies apne `imports` array me khud declare karta hai — koi NgModule `declarations`/`imports` nahi. App-wide setup ab `ApplicationConfig` ke `providers` me `provide*` functions se hota hai.",
    detailedAnswer:
      "Pehle har component ek NgModule ke `declarations` me register hota tha aur us module ke `imports` template dependencies deta tha. Standalone me component `@Component({ imports: [RouterOutlet, EmployeeCard, DatePipe] })` — self-contained. NgModule-level cheezein (`RouterModule.forRoot`, `HttpClientModule`, `BrowserAnimationsModule`) provider functions ban gayi: `provideRouter`, `provideHttpClient`, `provideAnimations`, jo `bootstrapApplication(App, { providers: [...] })` me jaati hain. Faayde: kam files, visible per-component deps, simpler lazy loading (`loadComponent`), behtar tree-shaking. v17 se default.",
    followUp: "Agar 50 components sabko `CommonModule` jaisi cheezein chahiye to standalone me duplication kaise handle karoge?",
    redFlag: "'Standalone matlab component ko koi dependency nahi chahiye' — galat; dependencies component khud declare karta hai.",
  },
  {
    id: "scb-2",
    question: "`ApplicationConfig` kya hai aur usme kya rakhte ho?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`ApplicationConfig` ek `{ providers: [...] }` shape ka object hai jo `bootstrapApplication` ko pass hota hai. Isme app-wide providers rehte hain — router, HTTP client, animations, global error handler, app-level services.",
    detailedAnswer:
      "`app.config.ts` me: `export const appConfig: ApplicationConfig = { providers: [ provideRouter(routes), provideHttpClient(withInterceptors([authInterceptor])), provideAnimations() ] }`. Ye providers root injector me register hote hain, isliye poori app me inject-able. `providedIn: 'root'` services yahan likhne ki zaroorat nahi (wo khud register ho jaati hain), lekin jinhe explicit config chahiye (jaise `provideHttpClient` ke options) wo yahan aati hain.",
    followUp: "`provideHttpClient(withInterceptors([...]))` aur purana `HTTP_INTERCEPTORS` multi-provider — farak kya hai?",
  },
  {
    id: "scb-3",
    question:
      "Ek purana Angular codebase migrate karna hai standalone me. Approach kya hogi?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Angular ka automated schematic use karo: `ng generate @angular/core:standalone` — teen phases me (components standalone banao, NgModules hatao, `bootstrapApplication` me switch). Har phase ke baad build + test.",
    detailedAnswer:
      "Schematic 3 steps deta hai: (1) 'Convert all components, directives and pipes to standalone' — har declarable me `standalone: true` + apne `imports`; (2) 'Remove unnecessary NgModule classes' — ab-khaali modules delete; (3) 'Bootstrap the project using standalone APIs' — `AppModule`/`bootstrapModule` ko `bootstrapApplication(App, appConfig)` me. Bade codebase me feature-by-feature karo, har step commit karo. Third-party libs jo NgModule export karti hain wo `imports` me directly di ja sakti hain (NgModule standalone component ke `imports` me allowed hai). Risk areas: `entryComponents` (purana), `forRoot()` patterns, aur test setup jo `TestBed.configureTestingModule({ declarations })` use karta hai.",
    followUp: "Standalone component ke `imports` me ek NgModule daalna allowed hai — ye kaise possible hai?",
  },
  {
    id: "scb-4",
    question: "`bootstrapApplication` aur `bootstrapModule` me kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`bootstrapModule(AppModule)` NgModule-based apps ke liye tha — ek root module leta hai. `bootstrapApplication(App, appConfig)` standalone ke liye — ek root component aur `ApplicationConfig` leta hai.",
    detailedAnswer:
      "`bootstrapModule` `@angular/platform-browser-dynamic` se aata tha aur `AppModule` ke `bootstrap: [AppComponent]` ko render karta tha; saare providers `AppModule.providers` aur imported modules se aate the. `bootstrapApplication` `@angular/platform-browser` se aata hai, seedha root standalone component render karta hai, aur providers `appConfig.providers` se. Naye projects sirf `bootstrapApplication` use karte hain.",
    followUp: "`main.ts` me `.catch(err => console.error(err))` kyun lagate hain bootstrap ke baad?",
  },
  {
    id: "scb-5",
    question:
      "Ek developer ne ek app-wide service ko har feature component ke `@Component({ providers: [DataService] })` me daal diya. Kya problem hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Har component ko `DataService` ka apna alag instance milega — singleton toot gaya. Shared state ya cache expect kar rahe ho to har component alag copy dekhega.",
    detailedAnswer:
      "Component-level `providers` ek naya instance us component (aur uske children) ke liye banata hai. App-wide singleton chahiye to `@Injectable({ providedIn: 'root' })` (ya `app.config.ts` ke `providers`). Component `providers` sirf tab use karo jab jaan-boojh ke scoped instance chahiye — jaise ek wizard/form component jise apna isolated state chahiye har baar mount pe. Symptom: 'ek jagah data update hota hai par doosri jagah purana dikhta hai' — do alag instances.",
    followUp: "`providedIn: 'root'` service tree-shakeable kaise hoti hai agar wo kahin inject na ho?",
    redFlag: "'providers har jagah daal do, safe rehta hai' — ye silently singletons tod deta hai.",
  },
];

export default questions;
