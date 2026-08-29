import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "httpclient-setup-and-first-request-1",
    question: "Modern standalone Angular me `HttpClient` ko kaise enable karte hain?",
    options: [
      "Har component ke `imports` me `HttpClientModule`",
      "`app.config.ts` ke `providers` me `provideHttpClient()` (ek baar)",
      "`main.ts` me `new HttpClient()`",
      "Kuch nahi, wo automatically available hai",
    ],
    correctIndex: 1,
    explanation:
      "`provideHttpClient()` (from `@angular/common/http`) ek baar app config me — `HttpClientModule` ka standalone replacement. Bina iske 'No provider for HttpClient' error aata hai.",
    difficulty: "easy",
  },
  {
    id: "httpclient-setup-and-first-request-2",
    question: "`this.http.get<Employee>(url)` me `<Employee>` runtime par kya karta hai?",
    options: [
      "Response ko validate karta hai aur mismatch par error phenkta hai",
      "Kuch nahi — ye sirf compile-time type hint hai; Angular response body ko as-is `Employee` ki tarah treat karta hai bina check/transform ke",
      "Response ko `Employee` class ka instance banata hai",
      "Missing fields ko default values se bhar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Generic `<T>` TypeScript ke liye hai. Agar API galat shape bheje (snake_case, missing fields), aapko ek mistyped object milega, koi runtime error nahi. Validation/mapping service me manually (ya Zod se) karni padti hai.",
    difficulty: "medium",
  },
  {
    id: "httpclient-setup-and-first-request-3",
    question: "`HttpParams` ke saath ek common bug kya hai?",
    options: [
      "`HttpParams` slow hota hai",
      "`HttpParams` immutable hai — `params.set('page', '2')` ek naya instance return karta hai; return value ignore karne se param add nahi hota",
      "`HttpParams` sirf POST me kaam karta hai",
      "`HttpParams` ko `JSON.stringify` karna padta hai",
    ],
    correctIndex: 1,
    explanation:
      "`HttpParams` (aur `HttpHeaders`) immutable hain. `p = p.set(...)` / `p = p.append(...)` — return value assign karo. `p.set(...)` akela likhna no-op hai.",
    difficulty: "medium",
  },
  {
    id: "httpclient-setup-and-first-request-4",
    question: "`http.get<T>()` ka Observable kaisa hai?",
    options: [
      "Hot — sab subscribers ek hi request share karte hain",
      "Cold — har subscription ek nayi HTTP request fire karti hai; ek value emit karke complete ho jaata hai",
      "Wo ek Promise hai",
      "Wo kabhi complete nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "HttpClient observables cold hain: subscribe = request. 3 baar `| async` = 3 requests (`shareReplay(1)` / `toSignal` se dedupe). Ek response + complete, isliye auto-cleanup hota hai (leak risk kam).",
    difficulty: "easy",
  },
];

export default quiz;
