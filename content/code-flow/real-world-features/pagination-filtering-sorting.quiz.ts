import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "pagination-filtering-sorting-1",
    question:
      "`GetEmployeesAsync` me `CountAsync` ko pipeline me kahan call karna chahiye?",
    options: [
      "`Skip`/`Take` ke baad, taaki sirf current page count ho",
      "Filters (`Where`) ke baad lekin `Skip`/`Take` se pehle",
      "Sabse pehle, koi filter lagne se pehle",
      "`ToListAsync` ke baad, in-memory `items.Count` use karke",
    ],
    correctIndex: 1,
    explanation:
      "Total count filtered result set ka hona chahiye, isliye `Where` ke baad. Lekin `Skip`/`Take` se pehle, warna count max `pageSize` tak cap ho jaayega. Option A galat — woh sirf page ke rows count karega. Option C galat — bina filter ke count galat total dega (UI 'Page 1 of 4000' dikhayega jabki filter ke baad 2 pages hain). Option D `items.Count` sirf current page ka size hai, total nahi.",
    difficulty: "medium",
  },
  {
    id: "pagination-filtering-sorting-2",
    question:
      "Client bhejta hai `?pageSize=500000`. `EmployeeQueryParameters.PageSize` ka setter `MaxPageSize = 100` pe clamp karta hai. Iska sabse bada practical faayda kya hai?",
    options: [
      "Response JSON valid rahe ga",
      "Ek hi request se poori table load karke API ko memory/DoS se bachaana",
      "SQL Server `OFFSET` clause faster ho jaata hai",
      "Sorting deterministic ban jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "Bina clamp ke `pageSize=500000` effectively pagination bypass hai — ek request poori table maang leti hai, memory spike aur easy DoS. Clamp isse rokta hai. Option A galat — JSON size se valid/invalid nahi hota. Option C galat — clamp `OFFSET` ki speed se related nahi. Option D galat — determinism `OrderBy` se aati hai, `pageSize` se nahi.",
    difficulty: "easy",
  },
  {
    id: "pagination-filtering-sorting-3",
    question:
      "`Skip((page-1)*pageSize).Take(pageSize)` lagaya gaya hai lekin koi `OrderBy` nahi. Kya problem hai?",
    options: [
      "EF Core compile-time error dega",
      "Har page identical rows return karega",
      "Row order undefined hai — page 2 pe wahi rows aa sakti hain jo page 1 pe thi, ya kuch rows miss ho sakti hain",
      "`pageSize` ignore ho jaayega aur poori table aayegi",
    ],
    correctIndex: 2,
    explanation:
      "SQL me bina `ORDER BY` ke row order guaranteed nahi hota, isliye `OFFSET/FETCH` non-deterministic ho jaata hai — pages overlap ya gap kar sakti hain. Isliye kam se kam `OrderBy(e => e.Id)` chahiye. Option A galat — ye runtime behavior hai, EF Core warning de sakta hai par error nahi. Option B galat — rows identical nahi, bas unpredictable. Option D galat — `Take` phir bhi apply hoga.",
    difficulty: "medium",
  },
  {
    id: "pagination-filtering-sorting-4",
    question:
      "Ek 2-crore-row transaction table hai jahan har second naye rows insert hote hain, aur client ko 'load more' infinite scroll chahiye. Offset ya keyset pagination?",
    options: [
      "Offset — 'jump to page' feature zaroori hai",
      "Keyset/cursor — constant speed aur naye inserts se page shifting nahi hoti",
      "Dono me koi farak nahi is scale pe",
      "Offset, lekin `pageSize` ko 1000 kar do",
    ],
    correctIndex: 1,
    explanation:
      "High-churn + deep scrolling exactly wahi case hai jahan offset tootta hai: deep `OFFSET` slow hota hai (throwaway rows) aur naye inserts se rows duplicate/skip hoti hain. Keyset (`WHERE Id > lastSeenId ORDER BY Id`) constant index-seek speed deta hai aur cursor stable pointer hai. Option A galat — infinite scroll me jump-to-page chahiye hi nahi. Option C galat — scale pe farak bahut bada hai. Option D galat — bada `pageSize` deep-offset problem aur bigaad ta hai.",
    difficulty: "hard",
  },
];

export default quiz;
