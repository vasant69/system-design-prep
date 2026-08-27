import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "angular-routing-deep-dive-1",
    question: "Route me `/users/1` se `/users/2` navigate karte waqt agar same component instance reuse ho rahi hai, to param change detect karne ka sahi tareeka kya hai?",
    options: [
      "this.route.snapshot.paramMap.get(id) — snapshot hamesha latest value deta hai",
      "this.route.paramMap.subscribe() use karo kyunki snapshot sirf ek baar read hota hai",
      "ngOnInit() dobara call hoga automatically, kuch extra karne ki zaroorat nahi",
      "Component ko destroy karke phir se create karna padega manually",
    ],
    correctIndex: 1,
    explanation: "paramMap observable subscribe karna sahi hai kyunki jab component instance reuse hoti hai (same route, different param), snapshot update nahi hota — wo sirf ek point-in-time read hai. Observable subscribe karne se har param change pe naya value milta hai. ngOnInit() dobara call nahi hota jab tak component destroy-recreate na ho.",
    difficulty: "medium",
  },
  {
    id: "angular-routing-deep-dive-2",
    question: "Functional guards (jaise CanActivateFn) class-based guards (CanActivate interface) se kaise different hain?",
    options: [
      "Functional guards sirf development mode me kaam karte hain, production me nahi",
      "Functional guards ek plain function hote hain jo inject() se dependencies lete hain, provider class register karne ki zaroorat nahi hoti",
      "Functional guards sirf CanDeactivate ke liye use ho sakte hain",
      "Functional guards route parameters access nahi kar sakte",
    ],
    correctIndex: 1,
    explanation: "Functional guards (Angular 14.2+) plain functions hain jo inject() function se dependencies lete hain (class instantiate karne ki zaroorat nahi), jisse bundle size chhota hota hai aur testing simpler hoti hai. Ye CanActivate, CanDeactivate, sab types ke liye kaam karte hain, aur route/state params access kar sakte hain — dono galat options hain.",
    difficulty: "medium",
  },
  {
    id: "angular-routing-deep-dive-3",
    question: "Resolver aur guard me main functional difference kya hai?",
    options: [
      "Guard navigation allow/deny decide karta hai, resolver navigation se pehle data fetch karta hai — dono ek saath bhi use ho sakte hain",
      "Resolver sirf lazy-loaded routes ke saath kaam karta hai, guard sirf eager routes ke saath",
      "Guard aur resolver ek hi cheez hain, sirf naam alag hai",
      "Resolver access control ke liye hai, guard data fetching ke liye hai",
    ],
    correctIndex: 0,
    explanation: "Guard ka role hai yes/no decide karna ki navigation ho ya na ho (access control), resolver ka role hai component render hone se pehle zaroori data fetch kar lena. Dono independent concerns hain aur ek hi route pe combine ho sakte hain — pehle guard check hoga, phir resolver run hoga.",
    difficulty: "easy",
  },
  {
    id: "angular-routing-deep-dive-4",
    question: "Ek heavy resolver jo API se data fetch karta hai, 3 second lagata hai. User navigation link click karta hai. Kya hoga?",
    options: [
      "Component turant render ho jayega, data baad me update hoga",
      "Navigation 3 second tak block rahega — user ko blank/frozen screen dikhega jab tak resolver complete na ho",
      "Angular automatically loading spinner dikha dega, koi extra code nahi chahiye",
      "Resolver fail ho jayega agar 1 second se zyada time le",
    ],
    correctIndex: 1,
    explanation: "Resolver navigation ko block karta hai jab tak wo complete na ho — Router us waqt tak naya component activate nahi karta. Isliye slow resolver ka result hota hai perceived-frozen UI, jab tak developer khud koi loading indicator implement na kare (jo resolver ke bahar hota hai, jaise route change listener). Angular khud koi automatic spinner nahi deta.",
    difficulty: "hard",
  },
];

export default quiz;
