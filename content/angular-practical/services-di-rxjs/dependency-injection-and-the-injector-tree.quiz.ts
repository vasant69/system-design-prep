import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dependency-injection-and-the-injector-tree-1",
    question: "Dependency injection ka core idea kya hai?",
    options: [
      "Har class apni dependencies khud `new` se banati hai",
      "Class declare karti hai use kya chahiye (`inject(X)` / constructor param), aur Angular decide karta hai kaise banega aur kaunsa instance milega",
      "Sab dependencies ek global object me rakhi jaati hain",
      "Dependencies runtime par download hoti hain",
    ],
    correctIndex: 1,
    explanation:
      "DI me construction ki zimmedari framework ke paas hai. Class sirf 'kya chahiye' batati hai; Angular provider + injector tree se instance resolve karta hai. Isse loose coupling aur testability milti hai.",
    difficulty: "easy",
  },
  {
    id: "dependency-injection-and-the-injector-tree-2",
    question: "Ek deep component `inject(EmployeeService)` karta hai. Angular resolution kaise karta hai?",
    options: [
      "Sidha root injector se",
      "Component ke apne injector se shuru karke upar walk karta hai (component -> route -> root) jab tak provider na mile; kahin nahi mila to `providedIn: 'root'` check, warna NG0201 error",
      "Alphabetical order me services dhoondta hai",
      "Random injector se",
    ],
    correctIndex: 1,
    explanation:
      "Injectors ek hierarchy banate hain. Request local injector se upar ki taraf resolve hoti hai. Isliye component-level `providers` upar wale ko shadow kar deta hai (naya scoped instance), aur `providedIn: 'root'` ek shared instance deta hai.",
    difficulty: "medium",
  },
  {
    id: "dependency-injection-and-the-injector-tree-3",
    question: "Ek string/config value (`API_BASE_URL`) ko inject karne ke liye kya chahiye, aur kyun?",
    options: [
      "Kuch nahi, string directly inject ho jaati hai",
      "Ek `InjectionToken` — kyunki inject karne ke liye ek identity chahiye aur string/config ke paas class (type) nahi hoti jo token ban sake",
      "Use ek service ke andar hardcode karo",
      "Ek global variable",
    ],
    correctIndex: 1,
    explanation:
      "DI token se dependency identify karta hai. Class apni identity khud hoti hai; ek plain string/object/function ke liye `new InjectionToken<T>('name')` banate hain, `useValue` se provide karte hain, aur `inject(TOKEN)` se lete hain. Isse env-specific config swap ho sakti hai.",
    difficulty: "medium",
  },
  {
    id: "dependency-injection-and-the-injector-tree-4",
    question: "\"NG0201: No provider for EmployeeService\" ka sabse common galat fix kya hai?",
    options: [
      "Service ko `providedIn: 'root'` dena",
      "Blindly har component/route ke `providers` array me `EmployeeService` daal dena — isse har jagah naya scoped instance banta hai aur agar service shared state rakhti hai to wo silently toot jaata hai",
      "Import path theek karna",
      "Service class ko export karna",
    ],
    correctIndex: 1,
    explanation:
      "App-wide singleton ke liye sahi fix `providedIn: 'root'` (ya `appConfig.providers`) hai. Use component `providers` me daalna 'error to gaya' par ab multiple instances ban gaye — shared cache/state kaam nahi karega. Root cause: service kahin provide hi nahi hui thi.",
    difficulty: "hard",
  },
];

export default quiz;
