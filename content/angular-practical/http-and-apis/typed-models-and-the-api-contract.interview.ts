import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "tmac-1",
    question: "API response ko component tak le jaane ka clean architecture kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Teen layers: DTO type (raw API shape), view model type (app shape), aur ek pure mapper function (service me, `map(toModel)`). Services DTOs import karti hain aur view models return karti hain; components sirf view models import karte hain aur HttpClient ko chhoo bhi nahi rahe.",
    detailedAnswer:
      "Ye 'anti-corruption layer' (DDD term) API ki quirks ko app se decouple karta hai. DTO documents 'jo aata hai' (snake_case, string-money, ISO dates); view model documents 'jo chahiye' (camelCase, number, Date, derived `fullName`). Mapper pure aur unit-testable. Request side bhi: form/view model -> `toCreateDto` -> POST. Critical endpoints par Zod schema validation raw response par. Agar DTO === model exactly, layer skip.",
    followUp: "Agar backend bhi TypeScript hai to DTO layer kaise simplify hota hai?",
  },
  {
    id: "tmac-2",
    question: "Backend `salary` ko string `\"85000.00\"` bhejta hai aur dates ISO strings me. Front-end me kaise handle karoge?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Mapper me convert: `salary: Number(dto.salary)`, `joinDate: new Date(dto.join_date)`. View model me `salary: number`, `joinDate: Date`. Components saaf types ke saath kaam karte hain — templates me parsing nahi, aur `joinDate < cutoff` jaise comparisons sahi.",
    detailedAnswer:
      "String money par arithmetic/comparison galat (`\"9\" > \"10\"` true). String date par `<` lexicographic — mostly ISO ke saath kaam karta hai par fragile. Mapper me `Number()`/`new Date()` (invalid input ke liye guard: `Number.isNaN` check, `salary` ke liye maybe a decimal library agar precision critical hai — BFSI). Request side par ulta: `Date` -> `toISOString()`, `number` -> string agar API string maangti hai. Ek jagah, tested.",
    followUp: "BFSI context me money ko `number` rakhna safe hai ya decimal library chahiye — kaise decide karoge?",
  },
  {
    id: "tmac-3",
    question:
      "Team ne raw API objects ko har jagah pass kiya hai. Ab backend ne `name` ko `firstName`/`lastName` me split kiya aur 40 jagah kuch toota. Aage kaise rokoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ek anti-corruption layer introduce karo incrementally: har entity ke liye DTO type + view model + mapper. Services ko `map(toModel)` add karo. Ek baar migrate hone ke baad, aise breaking changes ek mapper me absorb hote hain, poore app me nahi.",
    detailedAnswer:
      "Migration plan: (1) sabse volatile/critical entity se shuru (Employee); (2) `EmployeeDto` (current API), `Employee` (ideal shape), `toEmployee`; (3) `EmployeeService` me `map(toEmployee)`; (4) components ko naye `Employee` type par migrate — compiler har mismatch dikhayega; (5) repeat per entity. Bonus: OpenAPI spec se DTO types generate karo (`openapi-typescript`) taaki DTO hand-maintained guess na ho. Ab contract drift compile error deta hai, silent bug nahi.",
    followUp: "OpenAPI-generated types aur hand-written DTO types — trade-offs?",
  },
  {
    id: "tmac-4",
    question: "Har API response ko Zod se validate karna — kab worth hai, kab nahi?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Worth it: external/third-party APIs, contract-unstable backends, critical data (money, permissions, auth), aur boundaries jahan bad data downstream corruption karta hai. Skip: internal stable APIs jinke types shared/generated hain, ya high-frequency endpoints jahan validation overhead matter karta ho.",
    detailedAnswer:
      "Zod cost: bundle size (schemas + lib), aur per-response parse time (usually negligible). Value: silent `undefined` propagation ko ek loud, logged, monitorable failure me badalна — jise aap alert par catch karo, na ki ek user bug report par. Pragmatic: critical endpoints par full validation, baaki par sirf mapper (jo shape assume karta hai). CI me contract tests (Pact / schema diff) bhi ek layer hai. Generated types + stable backend me runtime validation ki zaroorat kam.",
    followUp: "Ek monitored 'schema validation failed' error ko production me kaise surface karoge?",
  },
  {
    id: "tmac-5",
    question: "View model me derived fields (`fullName`, `isOverdue`) rakhna chahiye ya `computed`/pipe se banana chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Depends. Stable, cheap, universally-needed derivations (`fullName`) mapper me rakhna theek — har component ko free me milta hai. Time-dependent (`isOverdue` based on `now`), context-dependent, ya expensive derivations `computed`/pipe me — kyunki wo model ke baahar ki cheez par depend karte hain.",
    detailedAnswer:
      "Mapper output ideally ek pure snapshot hai — same DTO in, same model out. `fullName = firstName + ' ' + lastName` deterministic hai, mapper me ok. `isOverdue = dueDate < new Date()` `now` par depend karta hai — agar mapper me daala to wo model creation ke moment freeze ho jaata hai (stale). Waha `computed(() => this.dueDate() < this.now())` ya ek `timeAgo`-style approach. Context-dependent (`canEdit` based on current user role) definitely component/`computed`, model me nahi.",
    followUp: "`fullName` ko mapper me rakhna aur ek `fullName` pipe rakhna — dono ke pros/cons?",
  },
];

export default questions;
