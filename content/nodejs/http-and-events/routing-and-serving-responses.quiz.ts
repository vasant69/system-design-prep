import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "routing-and-serving-responses-1",
    question:
      "Raw Node server mein query string parse karne ke liye best approach kya hai?",
    options: [
      "`req.url.split(\"?\")[1].split(\"&\")` se manually",
      "`new URL(req.url, base)` banao aur `url.searchParams` (URLSearchParams) use karo",
      "`req.query` object seedha padho",
      "`JSON.parse(req.url)`",
    ],
    correctIndex: 1,
    explanation:
      "WHATWG `URL` class percent-encoding (`%20`), repeated keys (`?tag=a&tag=b`), aur missing values sahi handle karti hai; `url.searchParams.get()` decoded value deta hai. Manual `split` in edge cases par tootta hai. Option C galat — `req.query` Express ka addition hai, raw `http` mein nahi. Option D bakwaas — `req.url` JSON nahi hai.",
    difficulty: "easy",
  },
  {
    id: "routing-and-serving-responses-2",
    question:
      "Client `POST /users` route par `DELETE /users` bhejta hai jabki sirf GET aur POST defined hain. Sahi response kya hai?",
    options: [
      "404 Not Found — kyunki DELETE /users defined nahi",
      "405 Method Not Allowed, ideally `Allow: GET, POST` header ke saath — path exist karta hai, method galat hai",
      "200 OK, request ignore kar do",
      "500 Internal Server Error",
    ],
    correctIndex: 1,
    explanation:
      "`/users` path exist karta hai, sirf us par `DELETE` allowed nahi — ye exactly `405 Method Not Allowed` ka case hai, aur spec kehta hai `Allow` header mein valid methods list karo. `404` (option A) tab jab path hi na ho — API consumers ke liye 404 vs 405 ka farak debugging mein matter karta hai. Option C/D dono galat behaviour.",
    difficulty: "medium",
  },
  {
    id: "routing-and-serving-responses-3",
    question:
      "Static file serving mein `path.join(PUBLIC_DIR, url.pathname)` ke baad `resolvedPath.startsWith(PUBLIC_DIR)` check kyun zaroori hai?",
    options: [
      "Performance ke liye — lookup tez hota hai",
      "Path traversal se bachne ke liye — bina iske `GET /../../etc/passwd` (ya encoded `%2e%2e%2f`) server ki koi bhi file leak kar sakta hai",
      "`Content-Type` sahi set karne ke liye",
      "Ye optional hai, sirf Windows par chahiye",
    ],
    correctIndex: 1,
    explanation:
      "`../` sequences resolved path ko PUBLIC_DIR ke bahar le jaate hain. Guard ke bina attacker arbitrary file read kar sakta hai (classic directory-traversal CVE). `resolvedPath.startsWith(rootDir)` verify karta hai ki final path root ke andar hi hai, warna `403`. Option A/C unrelated. Option D galat — ye har OS par critical security check hai.",
    difficulty: "medium",
  },
  {
    id: "routing-and-serving-responses-4",
    question:
      "Manual routing kab chhod ke Express/Fastify adopt karna chahiye?",
    options: [
      "Jab bhi 1 se zyada route ho",
      "Kabhi nahi — framework hamesha overhead hai",
      "Jab path params (`/orders/:id/items/:itemId`), cross-cutting middleware (auth/CORS/rate-limit), aur body/cookie parsing har route par chahiye — tab framework ka router aur pipeline real value dete hain",
      "Sirf jab tumhe TypeScript use karna ho",
    ],
    correctIndex: 2,
    explanation:
      "Chhote services (few routes, no params, no middleware) ke liye raw `http` + route table theek hai. Lekin path params, middleware chain, aur repeated parsing manual mein jaldi ganda aur bug-prone ho jata hai — yahi wo point hai jahan Express/Fastify ka router + middleware pipeline justify hota hai. Option A too eager, B dogmatic, D unrelated (dono raw aur framework TS ke saath chalte hain).",
    difficulty: "easy",
  },
];

export default quiz;
