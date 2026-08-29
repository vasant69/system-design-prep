import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "navigation-with-routerlink-and-router-1",
    question: "Internal navigation ke liye `<a href=\"/employees\">` kyun galat hai?",
    options: [
      "`href` sirf external links ke liye hai syntactically",
      "`href` browser ko full page reload karwata hai — poori Angular app dobara bootstrap hoti hai; `routerLink` client-side SPA navigation karta hai bina reload ke",
      "`href` slow load hota hai bas",
      "`href` accessible nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "`routerLink` Angular Router ko URL change intercept karne deta hai — sirf outlet ka content badalta hai, no reload. Plain `href` browser ka default navigation trigger karta hai jo poora document reload karta hai.",
    difficulty: "easy",
  },
  {
    id: "navigation-with-routerlink-and-router-2",
    question: "`[routerLink]=\"['/employees', emp.id]\"` ke saath query param `page=2` kaise add karte hain?",
    options: [
      "`[routerLink]=\"['/employees', emp.id, { page: 2 }]\"`",
      "Alag `[queryParams]=\"{ page: 2 }\"` binding — query params `routerLink` array me nahi jaate",
      "`routerLink=\"/employees/2?page=2\"`",
      "Query params support nahi hote `routerLink` me",
    ],
    correctIndex: 1,
    explanation:
      "`routerLink` array me object daalne se matrix params (`;page=2`) bante hain, query params nahi. Query params ke liye separate `[queryParams]` binding (ya `router.navigate` me `extras.queryParams`).",
    difficulty: "medium",
  },
  {
    id: "navigation-with-routerlink-and-router-3",
    question: "Form save hone ke baad details page par jaana hai. Kaunsa approach?",
    options: [
      "Template me ek hidden `routerLink` jo auto-click ho",
      "`Router` service: `this.router.navigate(['/employees', created.id])` save success ke callback me",
      "`window.location.href = ...`",
      "`<a routerLink>` par focus karke Enter press simulate karo",
    ],
    correctIndex: 1,
    explanation:
      "Action-ke-baad navigation imperative hai — `Router.navigate()` code se. `routerLink` user ke direct clicks ke liye hai. `window.location` full reload karega.",
    difficulty: "easy",
  },
  {
    id: "navigation-with-routerlink-and-router-4",
    question: "Login success ke baad `router.navigate(['/dashboard'], { replaceUrl: true })` kyun (plain navigate ke bajaye)?",
    options: [
      "Faster hota hai",
      "`replaceUrl: true` current history entry (login page) ko replace kar deta hai — user dashboard se back press karein to login par wapas nahi aata",
      "Query params preserve karta hai",
      "Guards ko skip karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Normal navigation ek nayi history entry push karti hai, to back button login page dikhata hai (ajeeb, aur user already logged in). `replaceUrl: true` login entry ko dashboard se replace kar deta hai. Logout par bhi useful.",
    difficulty: "medium",
  },
];

export default quiz;
