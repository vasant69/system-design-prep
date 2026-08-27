import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dependency-injection-in-web-api-1",
    question: "Ek Singleton service ke constructor me directly ek Scoped service (jaise DbContext) inject karne se kya problem hoti hai?",
    options: [
      "Koi problem nahi hoti, DI container automatically handle kar leta hai",
      "Captive dependency -- Singleton pehli baar resolve hone pe jo Scoped instance capture karta hai, wahi poori application lifetime ke liye freeze ho jaata hai",
      "Application startup hi nahi hoga",
      "Scoped service automatically Transient ban jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — ye captive dependency create karta hai, jisme short-lived (Scoped) service ek long-lived (Singleton) service ke andar permanently capture ho jaata hai, jabki uska design per-request-fresh rehne ka tha. Options 1, 3, aur 4 galat hain — Development environment me by default ye exception throw karta hai (option 3 ke close lagta hai lekin app startup crash nahi hota, resolution time pe exception aati hai), lekin core problem lifetime mismatch hai.",
    difficulty: "medium",
  },
  {
    id: "dependency-injection-in-web-api-2",
    question: "DbContext ko AddDbContext<T>() se register karne pe uska default lifetime kya hota hai, aur kyun?",
    options: [
      "Singleton -- performance ke liye ek hi instance reuse hoti hai",
      "Transient -- har query ke liye fresh instance chahiye",
      "Scoped -- ek HTTP request ke andar consistent change tracking milta hai, requests ke beech fresh state milta hai",
      "DbContext ka koi fixed lifetime nahi hota, developer ko har baar explicitly specify karna padta hai",
    ],
    correctIndex: 2,
    explanation:
      "Sahi jawab option 3 hai — DbContext Scoped register hota hai taaki ek request ke andar entities ka consistent tracked state mile, lekin naye request pe fresh DbContext mile jisse ek request ka data doosre request me leak na ho. Option 1 galat hai kyunki Singleton DbContext thread-safety aur staleness issues create karega. Option 2 galat hai kyunki Transient unnecessary overhead aur inconsistent tracking create karega ek hi request ke andar. Option 4 galat hai, AddDbContext ek sensible default (Scoped) provide karta hai.",
    difficulty: "medium",
  },
  {
    id: "dependency-injection-in-web-api-3",
    question: "Ek Singleton background worker ko occasionally Scoped data (jaise DbContext se) chahiye. Sahi approach kya hai?",
    options: [
      "Directly DbContext ko constructor me inject kar do",
      "DbContext ko bhi Singleton bana do taaki compatibility issue na ho",
      "IServiceScopeFactory inject karo aur jab zaroorat ho tab explicitly ek naya scope create karke us scope se DbContext resolve karo",
      "Static field me ek DbContext instance globally store kar do",
    ],
    correctIndex: 2,
    explanation:
      "Sahi jawab option 3 hai — IServiceScopeFactory inject karke on-demand scope create karna hi correct pattern hai jab ek Singleton ko Scoped data ki zaroorat ho; scope dispose hone pe uska Scoped services bhi properly cleaned up ho jaate hain. Option 1 captive dependency create karega. Option 2 DbContext ki design intent (per-request state) todh deta hai aur thread-safety issues laata hai. Option 4 bhi effectively ek Singleton-jaisa hi anti-pattern hai jo same problems create karega.",
    difficulty: "hard",
  },
  {
    id: "dependency-injection-in-web-api-4",
    question: "ASP.NET Core ki 'Cannot consume scoped service from singleton' exception kab by default throw hoti hai?",
    options: [
      "Har environment me hamesha, Production included",
      "Development environment me by default (ValidateScopes = true default hai Development host me)",
      "Sirf jab explicitly try-catch block me code likha ho",
      "Ye exception .NET me exist hi nahi karti",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — ValidateScopes validation Development environment ke default host configuration me on hoti hai, jisse captive dependency scenario resolution time pe hi exception ke roop me pakda jaata hai. Production me agar ye explicitly enable na ho to same bug silently, bina crash kiye, staleness/thread-safety issues create kar sakta hai. Options 1, 3, aur 4 factually incorrect hain.",
    difficulty: "hard",
  },
];

export default quiz;
