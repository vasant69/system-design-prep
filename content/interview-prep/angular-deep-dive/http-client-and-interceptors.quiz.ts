import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "http-client-and-interceptors-1",
    question: "Har outgoing HTTP request me auth token attach karne ka sabse maintainable tareeka kya hai?",
    options: [
      "Har component me manually headers object me token pass karna",
      "Ek HttpInterceptor banake use provideHttpClient(withInterceptors([...])) se register karna",
      "Token ko global variable me store karke HttpClient constructor me pass karna",
      "Har API call ke baad token ko manually response me check karna",
    ],
    correctIndex: 1,
    explanation: "Interceptor exactly is problem ke liye bana hai — ek jagah token attach karne ka logic likho, aur ye automatically har outgoing request pe apply hota hai bina har call site ko modify kiye. Manual per-component approach duplicate code aur maintenance burden create karta hai.",
    difficulty: "easy",
  },
  {
    id: "http-client-and-interceptors-2",
    question: "Ek interceptor me `req.headers.set(...)` se directly HttpRequest object modify karne ki koshish kyun fail hogi?",
    options: [
      "HttpRequest sirf GET requests ke liye editable hota hai",
      "HttpRequest immutable hai — modification ke liye .clone() se naya copy banana padta hai",
      "Headers sirf backend pe set kiye ja sakte hain, frontend pe nahi",
      "Angular headers ko automatically encrypt kar deta hai isliye direct access block hai",
    ],
    correctIndex: 1,
    explanation: "HttpRequest object immutable design follow karta hai (RxJS/Angular ke predictable-data-flow philosophy ke tarah) — directly mutate nahi kiya ja sakta. `.clone({ setHeaders: {...} })` se ek naya modified request object banta hai jo aage handle() ko pass kiya jaata hai.",
    difficulty: "medium",
  },
  {
    id: "http-client-and-interceptors-3",
    question: "Ek interceptor me `retry(2)` operator POST request pe blindly laga diya gaya hai jo ek payment submit karta hai. Isme kya risk hai?",
    options: [
      "Koi risk nahi, retry hamesha safe hota hai",
      "Agar response slow tha lekin request server pe process ho chuki thi, retry se duplicate payment (double-charge) ho sakta hai",
      "retry() sirf GET requests pe hi technically kaam karta hai, POST pe error dega",
      "retry() automatically duplicate requests detect karke skip kar deta hai",
    ],
    correctIndex: 1,
    explanation: "POST jaisi non-idempotent operations ko blindly retry karna dangerous hai — agar original request actually server pe successfully process ho chuki thi lekin response client tak time pe nahi pahuncha, retry ek duplicate operation (jaise double payment) trigger kar sakta hai. Idempotency keys ke bina POST retry avoid karna chahiye.",
    difficulty: "hard",
  },
  {
    id: "http-client-and-interceptors-4",
    question: "Angular 15+ ka functional interceptor API (HttpInterceptorFn) class-based interceptor se kaise different hai?",
    options: [
      "Functional interceptors sirf error handling ke liye use ho sakte hain",
      "Functional interceptor ek plain function hai jo inject() se dependencies leta hai, @Injectable class provider ki zaroorat nahi",
      "Functional interceptors request ko modify nahi kar sakte, sirf read kar sakte hain",
      "Functional interceptors sirf standalone components ke saath kaam karte hain, NgModule apps me nahi",
    ],
    correctIndex: 1,
    explanation: "Functional interceptors class aur @Injectable decorator ki zaroorat khatam kar dete hain — ek plain function hai jo inject() ke through dependencies leta hai, aur provideHttpClient(withInterceptors([...])) se register hota hai. Ye request modify bhi kar sakte hain (jaise class-based karte the) aur dono NgModule/standalone apps me kaam karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
