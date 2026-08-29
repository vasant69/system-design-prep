import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "crud-calls-in-the-service-1",
    question: "Ek CRUD service method me kya hona chahiye aur kya NAHI?",
    options: [
      "Loading flags, toasts, aur `router.navigate` — sab ek jagah convenient",
      "Sirf: URL/params banana, DTO<->model map karna, typed Observable return karna. Loading state, toasts, navigation, aur retry-with-UI component/store ka kaam hai",
      "Sirf `console.log`",
      "Poora component ka logic",
    ],
    correctIndex: 1,
    explanation:
      "Thin, side-effect-free service methods reusable aur test-able rehte hain (`HttpTestingController` se). UI concerns (spinner, toast, navigate) component/store me, taaki ek service kai screens ko serve kar sake.",
    difficulty: "easy",
  },
  {
    id: "crud-calls-in-the-service-2",
    question: "`getAll` me `HttpParams` build karte waqt empty `search` ko bhi `params.set('search', '')` karne ka kya nuksan?",
    options: [
      "Kuch nahi",
      "URL me `?search=` noise aata hai, aur kuch backends empty-string ko literally 'empty string se match karo' samajh sakte hain — filters ko conditionally add karo (sirf jab value ho)",
      "`HttpParams` crash ho jaata hai",
      "Request POST ban jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "Sirf meaningful params bhejo. Conditional building (`if (filters.search) params = params.set(...)`) clean URLs aur predictable backend behaviour deta hai.",
    difficulty: "medium",
  },
  {
    id: "crud-calls-in-the-service-3",
    question: "PUT aur PATCH me kya farak hai CRUD update ke context me?",
    options: [
      "Koi farak nahi",
      "PUT poore resource ko replace karta hai (saare fields bhejo); PATCH partial update hai (sirf changed fields). API jo expect karein wahi use karo — PUT with missing fields unintended nulls de sakta hai",
      "PATCH sirf DELETE ke baad chalta hai",
      "PUT idempotent nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "PUT = full replace, isliye DTO me saare fields chahiye. PATCH = partial, `Partial<UpdateDto>` bhej sakte ho. Contract ke against galat verb use karna data corruption de sakta hai.",
    difficulty: "medium",
  },
  {
    id: "crud-calls-in-the-service-4",
    question: "`getAll` jo `Paged<EmployeeDto>` return karta hai — DTO mapping kaise karte hain?",
    options: [
      "Mapping ki zaroorat nahi",
      "`map(page => ({ ...page, items: page.items.map(toEmployee) }))` — wrapper (total/page/pageSize) rakho, sirf `items` array ke andar har DTO ko map karo",
      "Poore `page` object ko `toEmployee` me pass karo",
      "Component me har item map karo",
    ],
    correctIndex: 1,
    explanation:
      "`Paged<T>` ke `items` array par mapping lagti hai, metadata (`total`, `page`) as-is rehta hai. Mapping service me — component ko clean `Paged<Employee>` milta hai.",
    difficulty: "medium",
  },
];

export default quiz;
