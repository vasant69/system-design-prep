import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ec-1",
    question: "Multi-environment configuration Angular me kaise handle karte ho?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Build-time: `environment.ts` (dev) + `environment.prod.ts` (+ staging), swapped by `angular.json` `fileReplacements` on `ng build --configuration <env>`. Code hamesha `environment.ts` import karta hai. Values ko `InjectionToken` se expose karo (`API_BASE_URL`, `FEATURE_FLAGS`) taaki services decoupled aur testable rahen.",
    detailedAnswer:
      "Har config me `apiBaseUrl`, `featureFlags`, `production` boolean, maybe `logLevel`. `ng build --configuration production` file replace karta hai aur prod values inline. Secrets kabhi nahi (bundle public). Runtime alternative: `config.json` + `APP_INITIALIZER` fetch — ek artifact, N deployments. Ek codebase, config-driven — per-environment branches/repos anti-pattern.",
    followUp: "`featureFlags` ko `environment.ts` me rakhna vs ek dedicated flag service (LaunchDarkly-style) — kab kya?",
  },
  {
    id: "ec-2",
    question: "Build-time (`fileReplacements`) aur runtime (`config.json`) config — detailed trade-offs.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Build-time: simplest, zero runtime cost, values inlined + tree-shaken, dead-flag code eliminated. Cost: har environment ka alag build, value change = rebuild. Runtime: build once, promote same artifact, change config without rebuild. Cost: extra startup fetch (blocking render), can't tree-shake flags, slightly more infra.",
    detailedAnswer:
      "Build-time jeetta hai jab: environments stable hain, CI har env ke liye build kar sakti hai, aur aap chahte ho `if (environment.production)` dead code prod se completely remove ho. Runtime jeetta hai jab: immutable-artifact promotion pipeline (staging bundle === prod bundle), ya config ops team change karein bina dev involvement, ya white-label (per-tenant `config.json`). Hybrid: build-time for `production` boolean + logLevel, runtime for `apiBaseUrl` + tenant config.",
    followUp: "Runtime config ke saath `if (environment.production)` guarded code ka kya hota hai tree-shaking me?",
  },
  {
    id: "ec-3",
    question: "Runtime `config.json` fetch ko `APP_INITIALIZER` me kyun daalna zaroori hai? Na daalein to?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`APP_INITIALIZER` (ya `provideAppInitializer`) app ke render hone se pehle apne Promise ke resolve hone ka wait karta hai. Bina iske app turant render ho jata hai, `API_BASE_URL` abhi undefined, aur pehli HTTP requests galat/relative URL par jaati hain ya crash karti hain.",
    detailedAnswer:
      "`provideAppInitializer(() => firstValueFrom(inject(HttpClient).get<AppConfig>('/config.json')).then(c => Object.assign(CONFIG, c)))`. Angular initializer resolve hone tak bootstrap ko rok deta hai. `API_BASE_URL` ko `useFactory: () => CONFIG.apiBaseUrl` se provide karo (factory initializer ke baad chalta hai). Edge: config fetch fail ho to ek fallback + error screen — warna app permanently blank. Loading screen `index.html` me (Angular boot se pehle) rakho.",
    followUp: "Config fetch fail hone par graceful degradation kaise design karoge?",
  },
  {
    id: "ec-4",
    question:
      "Ek junior ne `environment.prod.ts` me `stripeSecretKey` aur `dbConnectionString` daal diye. Kya samjhaoge?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Ye har user ke browser me ship ho jaayenge — `dist/main.js` me plain text, DevTools me visible. Front-end bundle ek secret store nahi hai. DB connection string ka front-end me hona bhi nahi chahiye (front-end DB se directly baat nahi karta). Stripe: front-end sirf **publishable** key use karta hai; secret key backend par.",
    detailedAnswer:
      "Rule: agar ek value browser me leak hone se harm ho, wo front-end me nahi. Payment: front-end publishable key + backend secret key (backend charge create karta hai). Auth: front-end OAuth client ID public ok, client secret backend. Third-party APIs jinke keys secret hain -> ek backend proxy endpoint banao. `environment.*.ts` me sirf public base URLs, public client IDs, feature flags, aur non-sensitive tuning.",
    followUp: "Ek third-party API jise front-end se call karna hai par uska key secret hai — architecture kya?",
  },
  {
    id: "ec-5",
    question: "Feature flags ko environment config me rakhna kaafi hai, ya ek runtime flag system chahiye? Kab kya?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`environment.ts` flags build-time hain — flip karne ke liye redeploy. Simple, per-environment on/off ke liye theek. Runtime flag system (config.json flags, ya LaunchDarkly-style) chahiye jab: gradual rollout, per-user/per-tenant targeting, ya non-dev log flags toggle karen without deploy.",
    detailedAnswer:
      "Build-time flags ka bonus: `if (environment.featureFlags.newDash)` ke `false` branch tree-shake ho sakta hai. Cost: har change redeploy. Runtime flags: instant toggle, A/B, kill-switch (bug aaya to feature turant off). Middle ground: `config.json` flags + `APP_INITIALIZER` — ops team edit karein. Full system tab jab targeting (roles, %, geography) aur analytics chahiye. Ek `FeatureFlagService` abstraction rakho taaki source badalna (build -> runtime -> vendor) consumers ko na affect karein.",
    followUp: "Flag-guarded dead code ko production bundle se kaise ensure karoge ki wo tree-shake ho?",
  },
];

export default questions;
