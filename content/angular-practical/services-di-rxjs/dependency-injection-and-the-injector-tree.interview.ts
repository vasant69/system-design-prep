import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dit-1",
    question: "Angular DI ka poora flow samjhao — providers, injectors, resolution.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Provider batata hai kaise banega (`useClass/useValue/useFactory/useExisting`). Injectors ek hierarchy banate hain (root -> route -> component). Jab koi `inject(X)` karta hai, resolution local injector se upar walk karta hai jab tak provider mile; nahi mila to `providedIn` check, warna NG0201.",
    detailedAnswer:
      "`providedIn: 'root'` ek provider registration hai root injector par. `appConfig.providers`, route `providers`, aur `@Component({ providers })` alag-alag levels par register karte hain. Resolution nearest-wins hai — component-level provider root wale ko shadow kar deta hai us subtree ke liye. Ek dependency ki ek hi instance hoti hai per injector jahan wo provide hui. Tokens (`InjectionToken`) non-class deps identify karte hain. Modifiers (`optional`, `self`, `skipSelf`, `host`) resolution ko tune karte hain.",
    followUp: "Do sibling components ek service ko ek hi instance kaise share karenge, aur alag instance kaise?",
  },
  {
    id: "dit-2",
    question: "`useClass`, `useValue`, `useFactory`, `useExisting` — har ek kab use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`useClass`: token ke liye ek class instantiate karni ho (default; mocking me alag class). `useValue`: ek ready constant/config/object. `useFactory`: instance banane me runtime logic/other deps chahiye. `useExisting`: ek token ko doosre ka alias banana (backward-compat, narrow interface).",
    detailedAnswer:
      "`{ provide: EmployeeService, useClass: FakeEmployeeService }` — testing/feature-swap. `{ provide: API_BASE_URL, useValue: env.apiBaseUrl }` — config. `{ provide: LOGGER, useFactory: () => new Logger(inject(Config).level) }` — dependency-driven construction. `{ provide: LoggerInterface, useExisting: ConsoleLogger }` — ek concrete ko ek interface token ke through expose karna bina naya instance banae. `useExisting` vs `useClass`: `useExisting` same instance share karta hai, `useClass` naya banata hai.",
    followUp: "`useFactory` me `deps` array aur `inject()` — dono kaam karte hain, kaunsa prefer karoge aur kyun?",
  },
  {
    id: "dit-3",
    question: "`inject()` function aur constructor injection — dono me kya farak, aur `inject()` kahan zaroori hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Dono same DI mechanism. `inject()` field initializers, functional guards/interceptors/resolvers, `useFactory`, aur inheritance-heavy code me cleaner (no `super()` param plumbing). Dono ko ek injection context chahiye. `inject()` outside that context (jaise ek async callback) `NG0203` deta hai.",
    detailedAnswer:
      "Constructor injection classic hai aur abhi bhi valid. `inject()` (v14+) ke faayde: (1) functional APIs (`CanActivateFn`, `HttpInterceptorFn`) me constructor hota hi nahi; (2) base class inheritance me constructor params forward nahi karne padte; (3) field initializer syntax concise. Constraint: injection context = constructor, field initializer, factory, ya `runInInjectionContext(injector, () => ...)`. `ngOnInit` bhi technically inject-safe nahi maana jaata reliably — field initializer best.",
    followUp: "Ek `setTimeout` ke andar `inject()` chahiye — legit approach kya hai?",
  },
  {
    id: "dit-4",
    question:
      "Ek reusable `<app-tree-node>` component recursively khud ko render karta hai. Har node ko apna expand/collapse state chahiye jo parent se independent ho. DI se kaise?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`@Component({ selector: 'app-tree-node', providers: [NodeStateService] })` — har node instance apna `NodeStateService` paata hai (element-level injector). Child nodes `inject(NodeStateService)` karein to unhe apne nearest (own) instance milta hai, parent ka nahi.",
    detailedAnswer:
      "Component-level `providers` element injector banata hai — har component instance ke liye alag. Recursive component me iska matlab har node ka apna scoped service. Agar aap `skipSelf: true` use karo to child parent node ka state dekh sakta hai (jaise 'parent expanded hai to hi mera state relevant'). Ye hierarchical DI ka poora point hai — tree-shaped UIs me tree-shaped state. `providedIn: 'root'` yahan galat hota: sab nodes ek hi state share karte.",
    followUp: "`@SkipSelf()` ke saath ek parent-linked-list of services kaise banti hai?",
  },
  {
    id: "dit-5",
    question:
      "Multi-environment app: dev/staging/prod ke alag API URLs aur feature flags. DI se kaise architect karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`InjectionToken`s: `API_BASE_URL`, `FEATURE_FLAGS`. `app.config.ts` me `{ provide: API_BASE_URL, useValue: environment.apiBaseUrl }` etc. `environment.ts` files build-time `fileReplacements` se swap hoti hain. Services inject karke use karte hain — koi hardcoded URL nahi.",
    detailedAnswer:
      "Layers: (1) `environments/environment.ts` + `environment.prod.ts` — plain objects, `angular.json` `fileReplacements` se build par swap. (2) Tokens — taaki config injectable aur test me overridable ho. (3) Optionally ek `AppConfigService` jo runtime config (`/config.json` fetch on bootstrap) merge kare for values jo build me nahi baked. Services aur guards `inject(API_BASE_URL)` / `inject(FEATURE_FLAGS)` karte hain. Test: `{ provide: FEATURE_FLAGS, useValue: { newDashboard: true } }`. Isse ek codebase, teen deployments, zero code branching.",
    followUp: "Build-time environment files vs runtime-fetched config — kab kaunsa, aur kya dono chahiye?",
  },
];

export default questions;
