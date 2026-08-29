import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "configuring-routes-and-router-outlet-1",
    question: "`<router-outlet />` ka kya kaam hai?",
    options: [
      "Ek naya route define karta hai",
      "Wo jagah markara karta hai jahan current URL se match hua component render hoga",
      "Wo router ko configure karta hai",
      "Wo navigation links banata hai",
    ],
    correctIndex: 1,
    explanation:
      "`<router-outlet>` ek placeholder hai layout template me — matched route ka component yahan inject hota hai. Config `provideRouter(routes)` se hoti hai, links `routerLink` se.",
    difficulty: "easy",
  },
  {
    id: "configuring-routes-and-router-outlet-2",
    question: "Routes `[{ path: 'employees/:id', ... }, { path: 'employees/new', ... }]` order me hain. `/employees/new` par kya hota hai?",
    options: [
      "`employees/new` wala component render hota hai",
      "`employees/:id` pehle match ho jaata hai (first-match-wins), `id` ban jaata hai `\"new\"` — galat component. Fix: `employees/new` ko upar rakho",
      "Dono render hote hain",
      "404 aata hai",
    ],
    correctIndex: 1,
    explanation:
      "Router top-to-bottom first-match-wins hai. `:id` kisi bhi segment ko match karta hai, isliye `new` bhi. Specific/static routes ko parameterised routes se pehle likhna chahiye.",
    difficulty: "medium",
  },
  {
    id: "configuring-routes-and-router-outlet-3",
    question: "`{ path: '', redirectTo: 'dashboard' }` me `pathMatch: 'full'` na dene par kya hota hai?",
    options: [
      "Kuch nahi, ye optional hai",
      "Default `pathMatch: 'prefix'` empty string ko har URL ke prefix ke roop me match kar leta hai — har navigation `dashboard` par redirect ho jaati hai",
      "Build error aata hai",
      "Redirect kaam hi nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Empty path `''` har URL ka prefix hai. `pathMatch: 'full'` ke bina redirect har route par trigger hota hai. Isliye empty-path redirects me hamesha `pathMatch: 'full'`.",
    difficulty: "hard",
  },
  {
    id: "configuring-routes-and-router-outlet-4",
    question: "`{ path: '**', component: NotFoundPage }` ko routes array me kahan rakhna chahiye aur kyun?",
    options: [
      "Sabse upar — taaki jaldi match ho",
      "Sabse neeche (last) — `**` sab kuch match karta hai, isliye uske baad likhi routes kabhi match nahi hongi",
      "Kahin bhi, order matter nahi karta",
      "`**` route allowed nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Wildcard `**` har unmatched URL pakadta hai. First-match-wins hone ki wajah se agar wo upar ho to har URL 404 ho jaayega. Isliye ise hamesha aakhri me rakhte hain.",
    difficulty: "easy",
  },
];

export default quiz;
