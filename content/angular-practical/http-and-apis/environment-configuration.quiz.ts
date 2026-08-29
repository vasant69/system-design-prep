import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "environment-configuration-1",
    question: "`angular.json` ka `fileReplacements` production build me kya karta hai?",
    options: [
      "Saari `.ts` files ko minify karta hai",
      "Build ke waqt `src/environments/environment.ts` ko `environment.prod.ts` se replace kar deta hai — code hamesha `environment.ts` import karta hai par prod bundle me prod values inline hoti hain",
      "Environment variables ko OS se read karta hai",
      "Ek `config.json` fetch karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Build-time approach: ek hi import path, aur `--configuration production` par CLI file swap kar deta hai. Result: har environment ka apna build with its own inlined values.",
    difficulty: "easy",
  },
  {
    id: "environment-configuration-2",
    question: "Front-end bundle me API secret / private key rakhna kyun galat hai?",
    options: [
      "Bundle size badh jaata hai",
      "Browser bundle 100% public hai — koi bhi DevTools me poora JS aur `environment` object dekh sakta hai; secrets sirf backend par honi chahiye",
      "TypeScript compile nahi karta",
      "Angular isko allow nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Client-side code jo browser me chalta hai wo inspectable hai. `environment.prod.ts` me daala gaya secret har user ko ship ho jaata hai. Public URLs aur feature flags theek; secrets backend par.",
    difficulty: "easy",
  },
  {
    id: "environment-configuration-3",
    question: "Services me `environment` ko directly import karne ke bajaye `API_BASE_URL` InjectionToken use karne ka faayda?",
    options: [
      "Faster hota hai",
      "Testing me `{ provide: API_BASE_URL, useValue: 'http://test' }` se easily override ho jaata hai, aur services `environment` file se decoupled rehti hain",
      "Token automatically encrypt hota hai",
      "Token ke bina services compile nahi hotin",
    ],
    correctIndex: 1,
    explanation:
      "DI token config ko injectable aur swappable banata hai. Unit tests real URL ki jagah test URL inject kar sakte hain bina `environment` file ko touch kiye.",
    difficulty: "medium",
  },
  {
    id: "environment-configuration-4",
    question: "Runtime `config.json` approach (build-time `fileReplacements` ke bajaye) kab better hai?",
    options: [
      "Kabhi nahi",
      "Jab aap ek hi immutable build artifact ko multiple environments (staging -> prod) me promote karna chahte ho bina rebuild ke — har environment apna `config.json` serve karta hai, app boot par (`APP_INITIALIZER`) use fetch karta hai",
      "Jab app chhoti ho",
      "Jab TypeScript use na ho",
    ],
    correctIndex: 1,
    explanation:
      "Build-time approach har environment ke liye alag build maangta hai. Runtime config 'build once, deploy anywhere' enable karta hai — cost sirf ek startup fetch jo render se pehle resolve hona chahiye.",
    difficulty: "medium",
  },
];

export default quiz;
