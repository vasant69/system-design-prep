import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "production-build-and-deployment-1",
    question: "`ng build` ka output kahan jaata hai aur usme kya hota hai?",
    options: [
      "`ng serve` ki tarah memory me",
      "`dist/<app>/browser/` me — minified, tree-shaken, AOT-compiled, content-hashed static files (`index.html` + `main-<hash>.js` + lazy chunks + assets)",
      "`src/` folder me",
      "Ek single `.exe` file",
    ],
    correctIndex: 1,
    explanation:
      "Production build disk par optimized static files banata hai. `index.html` (unhashed) current hashed bundles ko point karta hai. Yahi folder deploy hota hai. `ng serve` disk par kuch nahi likhta.",
    difficulty: "easy",
  },
  {
    id: "production-build-and-deployment-2",
    question: "Deploy ke baad `/employees/42` refresh karne par 404 aata hai. Kyun aur fix?",
    options: [
      "Angular ka bug hai",
      "SPA me ek hi real HTML file hai; server par `/employees/42` naam ka file nahi, to server 404 deta hai. Fix: host ko configure karo ki har non-file path ke liye `index.html` (status 200) serve kare (SPA fallback)",
      "Route galat define hai",
      "Build dobara karna padega",
    ],
    correctIndex: 1,
    explanation:
      "Client-side routes server ko nahi pata. Har host ka apna SPA-fallback mechanism hai (Nginx `try_files`, Netlify `_redirects`, S3 error document, Vercel rewrite). Ye classic 'local pe theek, prod pe 404' bug hai.",
    difficulty: "medium",
  },
  {
    id: "production-build-and-deployment-3",
    question: "Caching headers kaise set karne chahiye Angular build output ke liye?",
    options: [
      "Sab kuch `no-cache`",
      "Hashed assets (`main.abc123.js`) ko `Cache-Control: immutable, max-age=31536000` (forever); `index.html` ko `no-cache` (hamesha re-fetch, taaki naye hashes mile)",
      "Sab kuch `immutable` including `index.html`",
      "Caching disable kar do",
    ],
    correctIndex: 1,
    explanation:
      "Hash file name me hai, to content badalne par naya name aata hai — safe to cache forever. `index.html` ka name fixed hai aur usme current hashes point hote hain, isliye wo hamesha fresh chahiye. Warna deploy ke baad stale hashes -> white screen.",
    difficulty: "medium",
  },
  {
    id: "production-build-and-deployment-4",
    question: "`angular.json` ke `budgets` kya karte hain?",
    options: [
      "Development server ka port set karte hain",
      "Bundle size limits enforce karte hain — initial/component-style size `maximumError` se upar jaaye to `ng build` FAIL ho jaata hai, jisse CI me size regressions catch hote hain",
      "Test coverage measure karte hain",
      "Kuch nahi, sirf documentation",
    ],
    correctIndex: 1,
    explanation:
      "`{ type: 'initial', maximumWarning: '500kb', maximumError: '1mb' }` jaise budgets ek fat dependency ke silently bundle double karne ko red build me badal dete hain. CI me ye regression gate hai.",
    difficulty: "medium",
  },
];

export default quiz;
