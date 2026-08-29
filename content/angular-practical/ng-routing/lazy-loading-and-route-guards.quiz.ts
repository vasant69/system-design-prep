import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lazy-loading-and-route-guards-1",
    question: "`loadChildren: () => import(\"./features/employees/employees.routes\")` kya karta hai?",
    options: [
      "Employees routes ko eagerly initial bundle me daal deta hai",
      "Employees feature ka code ek alag JS chunk me daal deta hai jo tab download hota hai jab user pehli baar `/employees` par jaata hai — initial bundle chhota rehta hai",
      "Server par routes register karta hai",
      "Routes ko cache kar deta hai permanently",
    ],
    correctIndex: 1,
    explanation:
      "`import()` dynamic import hai — bundler us code ko separate chunk banata hai. Wo chunk sirf route visit par load hota hai. Isse first paint tez hota hai.",
    difficulty: "easy",
  },
  {
    id: "lazy-loading-and-route-guards-2",
    question: "Ek functional guard redirect karna chahe to kya return karna chahiye?",
    options: [
      "`false` aur guard ke andar `router.navigate(['/login'])` call karo",
      "Ek `UrlTree` — jaise `router.parseUrl('/login')` ya `router.createUrlTree(['/login'])` — router us redirect ko handle karta hai, race conditions nahi",
      "`throw new Error('redirect')`",
      "`null`",
    ],
    correctIndex: 1,
    explanation:
      "`UrlTree` return karna Angular ka sanctioned redirect mechanism hai — clean aur side-effect-free. `false` + manual `navigate` do navigations trigger karke race conditions de sakta hai.",
    difficulty: "medium",
  },
  {
    id: "lazy-loading-and-route-guards-3",
    question: "`CanActivate` aur `CanMatch` guard me core farak?",
    options: [
      "Koi farak nahi",
      "`CanActivate` route ko activate hone se rokta hai (par lazy chunk phir bhi download ho sakta hai); `CanMatch` `false` return karein to route match hi nahi hota (chunk download bhi nahi) aur router agli matching route try karta hai",
      "`CanMatch` sirf eager routes par kaam karta hai",
      "`CanActivate` deprecated hai",
    ],
    correctIndex: 1,
    explanation:
      "`CanMatch` role/feature-flag routing ke liye ideal hai — 'is user ke liye ye route exist hi nahi karta'. Wo download bachata hai aur fallback route (ya `**`) ko chalne deta hai. `CanActivate` sirf activation gate karta hai.",
    difficulty: "hard",
  },
  {
    id: "lazy-loading-and-route-guards-4",
    question: "Resolver route par lagane ka ek downside kya hai?",
    options: [
      "Resolver kabhi data return nahi karta",
      "Navigation resolver ke complete hone tak block rehta hai — agar API slow hai to app 'frozen' feel karti hai; alternative hai route turant activate karo aur component me signal `resource()` + skeleton dikhao",
      "Resolver sirf lazy routes par kaam karta hai",
      "Resolver guards ko disable kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Resolver 'no empty-state flash' deta hai par navigation ko rok deta hai. Fast fetch ke liye theek; slow ke liye in-component loading with a skeleton better UX hai.",
    difficulty: "medium",
  },
];

export default quiz;
