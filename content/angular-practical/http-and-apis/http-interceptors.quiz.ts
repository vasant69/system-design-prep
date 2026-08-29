import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "http-interceptors-1",
    question: "HTTP interceptor kis liye use karte hain?",
    options: [
      "Ek specific component ki HTTP call ke liye",
      "Cross-cutting concerns jo HAR request/response par chahiye — auth header, global loading bar, error normalization, trace id, logging, caching",
      "Routes define karne ke liye",
      "Templates render karne ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Interceptor har `HttpClient` request/response ke pipeline me chalta hai. Isse token, loading, aur error handling ek jagah hoti hai — har service me duplicate nahi.",
    difficulty: "easy",
  },
  {
    id: "http-interceptors-2",
    question: "Interceptor me request ko modify (header add) kaise karte hain?",
    options: [
      "`req.headers.set('Authorization', ...)` directly",
      "`req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })` — `HttpRequest` immutable hai, clone karke modify karo, phir `next(clonedReq)`",
      "`req.Authorization = token`",
      "Interceptor me request modify nahi ho sakti",
    ],
    correctIndex: 1,
    explanation:
      "`HttpRequest` immutable hai. `req.clone({ setHeaders | params | url | context })` se ek modified copy banao aur use `next()` me pass karo.",
    difficulty: "medium",
  },
  {
    id: "http-interceptors-3",
    question: "`withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor])` me order ka kya matlab hai?",
    options: [
      "Order matter nahi karta",
      "Request array-order me flow karti hai (`auth -> loading -> error -> backend`); response reverse order me wapas aati hai. Isliye auth ko token-dependent cheezon se pehle, error ko outer enough rakho",
      "Sirf pehla interceptor chalta hai",
      "Alphabetical order me chalte hain",
    ],
    correctIndex: 1,
    explanation:
      "Interceptors ek chain hain — request neeche jaati hai array order me, response upar wapas ulti order me. Galat order (auth ke baad kuch jo token expect karta hai) subtle bugs deta hai.",
    difficulty: "medium",
  },
  {
    id: "http-interceptors-4",
    question: "Ek specific request (jaise `/auth/login`) ke liye auth interceptor ko skip kaise karte hain?",
    options: [
      "Ek alag `HttpClient` instance banao",
      "Ek `HttpContextToken` (`SKIP_AUTH`) banao, request me `context: new HttpContext().set(SKIP_AUTH, true)` set karo, aur interceptor me `if (req.context.get(SKIP_AUTH)) return next(req)`",
      "Interceptor ko delete karo",
      "URL ko encode karo",
    ],
    correctIndex: 1,
    explanation:
      "`HttpContext` per-request metadata deta hai jise interceptors padh sakte hain — bina alag `HttpClient` banaye. Login (no token yet), background polling (no loading bar) jaise cases isse handle hote hain.",
    difficulty: "hard",
  },
];

export default quiz;
