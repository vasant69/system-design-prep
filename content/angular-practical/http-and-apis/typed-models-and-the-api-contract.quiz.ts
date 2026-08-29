import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "typed-models-and-the-api-contract-1",
    question: "DTO type aur view model type me kya farak hai?",
    options: [
      "Koi farak nahi, dono ek hi hain",
      "DTO raw API JSON ki exact shape mirror karta hai (snake_case, string-money, ISO dates); view model wo clean/convenient shape hai jo components use karte hain (camelCase, number, Date)",
      "DTO sirf POST ke liye hota hai",
      "View model backend define karta hai",
    ],
    correctIndex: 1,
    explanation:
      "DTO = 'jo API bhejta hai'. View model = 'jo app ko chahiye'. Ek mapper (pure function, service me) beech me convert karta hai — yahi anti-corruption layer hai.",
    difficulty: "easy",
  },
  {
    id: "typed-models-and-the-api-contract-2",
    question: "Anti-corruption layer (DTO + view model + mapper) ka main faayda kya hai?",
    options: [
      "App faster chalti hai",
      "Backend ka field rename ya shape change ek jagah (mapper + DTO type) absorb hota hai — consuming components untouched rehte hain",
      "HTTP requests kam ho jaati hain",
      "TypeScript ki zaroorat khatam ho jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "Raw API objects ko poore app me pass karne se har backend change ek app-wide refactor ban jaata hai. Mapper isolate karta hai — 30 components ke bajaye 1 file badalti hai.",
    difficulty: "medium",
  },
  {
    id: "typed-models-and-the-api-contract-3",
    question: "Kab DTO + view model + mapper banana over-engineering hai?",
    options: [
      "Hamesha over-engineering hai",
      "Jab DTO aur view model bilkul same shape hain (koi rename, koi type conversion nahi) — tab ek hi type use karo, identity mapper skip karo",
      "Jab endpoint GET hai",
      "Jab response array hai",
    ],
    correctIndex: 1,
    explanation:
      "Layer ka value real mismatch (snake_case, string-money, ISO dates, nesting) me hai. Agar shapes identical hain to alag types + identity mapper pure overhead hai.",
    difficulty: "medium",
  },
  {
    id: "typed-models-and-the-api-contract-4",
    question: "Critical endpoint par runtime type safety kaise add karte hain?",
    options: [
      "`get<T>()` ka `<T>` isko handle karta hai",
      "Ek schema library (jaise Zod) se raw response ko validate karo — `map(raw => toModel(schema.parse(raw)))` — mismatch par ek caught, logged error milta hai silent corruption ke bajaye",
      "`JSON.parse` do baar karo",
      "Runtime validation possible nahi Angular me",
    ],
    correctIndex: 1,
    explanation:
      "`get<T>` compile-time only hai. Zod/io-ts jaise schema validators raw response ko check karte hain aur contract violation par loudly fail hote hain — jise aap monitor kar sakte ho.",
    difficulty: "medium",
  },
];

export default quiz;
