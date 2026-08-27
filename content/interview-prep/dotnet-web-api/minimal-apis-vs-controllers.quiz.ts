import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "minapi-ctrl-1",
    question: "Minimal API me dependency injection kaise resolve hoti hai ek endpoint ke andar?",
    options: [
      "Constructor injection ke through, jaise controllers me hota hai",
      "Endpoint lambda ke parameters me directly — framework automatically detect kar leta hai service hai ya route parameter",
      "Manually IServiceProvider.GetService() call karke",
      "Minimal APIs dependency injection support hi nahi karte",
    ],
    correctIndex: 1,
    explanation: "Minimal API endpoints me lambda parameters directly DI container se resolve hote hain — framework automatically figure out kar leta hai ki parameter ek registered service hai ya route/query parameter. Option A galat hai kyunki minimal APIs me koi class/constructor nahi hota, C ek valid but unnecessary manual approach hai jo framework khud handle karta hai, D bilkul galat hai.",
    difficulty: "easy",
  },
  {
    id: "minapi-ctrl-2",
    question: "Bade, complex API surface (50+ endpoints, heavy shared filters) ke liye controllers minimal APIs se better fit kyun maane jaate hain?",
    options: [
      "Kyunki controllers hamesha faster execute hote hain",
      "Kyunki convention-driven structure (base classes, [ApiController] automatic validation, mature filter pipeline) large codebase ko zyada maintainable rakhta hai",
      "Kyunki minimal APIs 50 se zyada endpoints support hi nahi karte",
      "Kyunki controllers me dependency injection zyada powerful hai",
    ],
    correctIndex: 1,
    explanation: "Controllers ka convention-driven approach (attribute routing, automatic model validation, mature action-filter pipeline) large, complex API surfaces me organization aur maintainability provide karta hai jo minimal APIs me manually replicate karna padta hai. Option A galat hai (performance difference typically negligible), C technically galat hai (minimal APIs kitne bhi endpoints support karte hain, bas organization manual hoti hai), D galat hai — DI dono me equally powerful hai.",
    difficulty: "medium",
  },
  {
    id: "minapi-ctrl-3",
    question: "MapGroup minimal APIs me kya purpose serve karta hai?",
    options: [
      "Ye database queries ko group karta hai performance ke liye",
      "Ye ek common route prefix aur shared behaviors (jaise RequireAuthorization) ko multiple endpoints pe apply karta hai, controllers ke [Route]+[Authorize] jaisa",
      "Ye automatically Swagger documentation generate karta hai",
      "Ye minimal API endpoints ko controllers me convert kar deta hai",
    ],
    correctIndex: 1,
    explanation: "MapGroup route groups create karta hai jaha common prefix aur shared filters/authorization ek jagah define karke multiple endpoints pe apply ho sakte hain — controllers ke class-level [Route] aur [Authorize] attributes ka organizational equivalent. Options A, C, aur D sab unrelated ya galat functionality describe karte hain.",
    difficulty: "medium",
  },
  {
    id: "minapi-ctrl-4",
    question: "\"Minimal API hamesha controllers se fast hota hai isliye har project me minimal API use karna chahiye\" — is statement me kya galti hai?",
    options: [
      "Statement bilkul sahi hai, koi galti nahi",
      "Performance difference measurable hai lekin zyadatar business apps ke liye practically negligible — architecture choice API surface size aur maintainability pe based honi chahiye, sirf raw benchmark pe nahi",
      "Minimal APIs actually controllers se slow hote hain",
      "Performance ka is decision se koi lena-dena hi nahi hota",
    ],
    correctIndex: 1,
    explanation: "Minimal APIs ka startup/throughput edge real hai (controller-discovery aur action-selector skip hota hai) lekin zyadatar production business apps ke liye ye difference practically irrelevant hota hai — sahi decision API surface size, team conventions, aur maintainability ke basis pe leni chahiye. Option A galat hai kyunki oversimplification hai, C factually galat hai, D bhi galat hai kyunki performance ek genuine (chhota) factor hai, sirf akela decisive factor nahi.",
    difficulty: "hard",
  },
];

export default quiz;
