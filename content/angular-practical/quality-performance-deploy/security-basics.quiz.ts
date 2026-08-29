import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "security-basics-1",
    question: "`{{ userComment }}` (interpolation) me user ka `<script>alert(1)</script>` daala jaaye to kya hota hai?",
    options: [
      "Script execute ho jaata hai (XSS)",
      "Wo text ki tarah render hota hai — Angular interpolation hamesha HTML escape karta hai, kabhi execute nahi karta",
      "Build fail ho jaata hai",
      "Angular error throw karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Interpolation `textContent` set karta hai, `innerHTML` nahi. `<script>` literally dikhta hai. Isliye Angular templates default se XSS-safe hain jab tak aap `[innerHTML]` + `bypassSecurityTrust` na use karein.",
    difficulty: "easy",
  },
  {
    id: "security-basics-2",
    question: "Angular app me XSS ka sabse common source kya hai?",
    options: [
      "Interpolation ka use",
      "`bypassSecurityTrustHtml` (aur variants) ka misuse — Angular ki sanitization band karke user/third-party content ko `[innerHTML]` me render karna",
      "`HttpClient` GET requests",
      "Reactive forms",
    ],
    correctIndex: 1,
    explanation:
      "`bypassSecurityTrust*` sanitization off kar deta hai. Ise sirf poori tarah controlled content par use karo. User-generated ya external content ke saath = direct XSS hole. Rich content server-side sanitize karo (DOMPurify).",
    difficulty: "medium",
  },
  {
    id: "security-basics-3",
    question: "Route guard aur `*appHasPermission` directive ke baare me sahi statement kaunsa hai?",
    options: [
      "Ye routes aur actions ko securely lock karte hain",
      "Ye sirf UX hain — UI hide/show karte hain; user Postman/devtools se API directly call kar sakta hai, isliye har endpoint ko server par independently authorize karna zaroori hai",
      "Ye backend authorization replace kar dete hain",
      "Ye XSS se bachate hain",
    ],
    correctIndex: 1,
    explanation:
      "Client-side checks bypassable hain. Wo 'user ko wo cheezein mat dikha jo wo nahi kar sakta' ke liye hain. Actual authorization (kaun kya kar sakta hai) server par enforce hoti hai, har request par.",
    difficulty: "medium",
  },
  {
    id: "security-basics-4",
    question: "Cookie-based auth me CSRF se kaise bachte hain?",
    options: [
      "Kuch nahi karna padta",
      "Auth cookie par `SameSite=Strict/Lax` + state-changing requests ke liye ek anti-CSRF token (Angular `HttpClient` me built-in XSRF-TOKEN cookie -> X-XSRF-TOKEN header support hai)",
      "Token ko `localStorage` me rakh do",
      "HTTPS use karo bas",
    ],
    correctIndex: 1,
    explanation:
      "CSRF tab relevant hai jab browser cookies auto-attach karta hai. `SameSite` cross-site cookie sending restrict karta hai; anti-CSRF token double-submit pattern se protect karta hai. Bearer-header auth CSRF-prone nahi (browser headers auto-attach nahi karta) par XSS-prone hai agar galat store ho.",
    difficulty: "hard",
  },
];

export default quiz;
