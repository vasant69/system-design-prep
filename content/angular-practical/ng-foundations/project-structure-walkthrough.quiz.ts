import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "project-structure-walkthrough-1",
    question: "`src/main.ts` ka kaam kya hai?",
    options: [
      "Ye app ka pehla component aur uska template define karta hai",
      "Ye entry point hai — `bootstrapApplication(App, appConfig)` call karke Angular chalu karta hai aur root component ko `<app-root>` me render karta hai",
      "Ye saare routes define karta hai",
      "Ye global CSS rakhta hai",
    ],
    correctIndex: 1,
    explanation:
      "`main.ts` browser ka entry point hai; wo `bootstrapApplication` se Angular boot karta hai, root component aur `ApplicationConfig` (providers) pass karta hai. Option A `app.ts`/`app.html` ka kaam hai. Option C `app.routes.ts`. Option D `styles.scss`.",
    difficulty: "easy",
  },
  {
    id: "project-structure-walkthrough-2",
    question:
      "Aapne ek npm UI library install ki jo apni CSS file ship karti hai. Component to import ho gaya par bina styling ke dikhta hai. Kahan fix karoge?",
    options: [
      "`main.ts` me library ko dobara import karo",
      "`angular.json` ke `styles` array me us CSS file ka path add karo (ya `styles.scss` me `@import` karo)",
      "`tsconfig.json` me `strict` off karo",
      "`package.json` me library ka version badlo",
    ],
    correctIndex: 1,
    explanation:
      "Global stylesheets `angular.json` ke `build > styles` array se load hote hain (ya `styles.scss` ke `@import` se). Component code aa raha hai matlab JS theek hai — sirf CSS load nahi ho rahi. Option A/C/D ka CSS loading se koi lena-dena nahi.",
    difficulty: "medium",
  },
  {
    id: "project-structure-walkthrough-3",
    question:
      "Component ke `.scss` file me likha CSS aur `src/styles.scss` me likha CSS — main farak kya hai?",
    options: [
      "Dono bilkul same, sirf location alag",
      "Component `.scss` default me sirf usi component ke elements par apply hota hai (view encapsulation); `styles.scss` global hai, sabpar",
      "`styles.scss` sirf production build me load hota hai",
      "Component `.scss` sirf tab kaam karta hai jab `ViewEncapsulation.None` set ho",
    ],
    correctIndex: 1,
    explanation:
      "Angular component styles ko default me encapsulate karta hai — attribute selectors add karke wo CSS sirf us component ke template par lagti hai. `styles.scss` bina scoping ke poori app par. Option C galat — dono dev aur prod dono me load hote hain. Option D ulta hai — `ViewEncapsulation.None` scoping HATA deta hai.",
    difficulty: "hard",
  },
  {
    id: "project-structure-walkthrough-4",
    question: "`package.json` me `dependencies` aur `devDependencies` ka farak?",
    options: [
      "`devDependencies` sirf senior developers install kar sakte hain",
      "`dependencies` app ko runtime par chahiye (framework, rxjs); `devDependencies` sirf development/build/test ke liye (CLI, TypeScript, test tools)",
      "`dependencies` production me install hoti hain, `devDependencies` kabhi install nahi hotin",
      "Koi farak nahi, dono ek hi tarah kaam karti hain",
    ],
    correctIndex: 1,
    explanation:
      "`dependencies` wo packages jo shipped app ke chalne ke liye zaroori hain. `devDependencies` build-time tools — inka code final bundle me nahi jaata. Option C thoda misleading — `npm install` (bina `--production`) dono install karta hai; CI build ko `devDependencies` chahiye hoti hain. Option A galat. Option D galat.",
    difficulty: "medium",
  },
];

export default quiz;
