import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "calling-external-apis-with-httpclientfactory-1",
    question:
      "Ek ASP.NET Core service har outbound call par `using var client = new HttpClient()` karta hai. High traffic par kya failure aata hai aur kyun?",
    options: [
      "OutOfMemoryException, kyunki HttpClient bahut memory leta hai",
      "SocketException / port exhaustion, kyunki dispose ke baad socket TIME_WAIT me ~4 minute baithta hai aur ephemeral ports khatam ho jaate hain",
      "Kuch nahi, ye recommended pattern hai",
      "DeadlockException, kyunki HttpClient thread-safe nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "HttpClient dispose hone par underlying socket turant free nahi hota; wo TIME_WAIT me rehta hai. Load par machine ke ~28,000 ephemeral ports khatam ho jaate hain aur naye connections SocketException se fail hote hain. HttpClient thread-safe hai (yeh problem nahi), aur memory issue nahi — connections ka issue hai. Fix: IHttpClientFactory.",
    difficulty: "easy",
  },
  {
    id: "calling-external-apis-with-httpclientfactory-2",
    question:
      "Socket exhaustion se bachne ke liye ek team ne ek `static readonly HttpClient` bana liya. Iska residual problem kya hai?",
    options: [
      "Static field garbage collect nahi hota, memory leak",
      "Static HttpClient apne connections hamesha ke liye pin kar leta hai — provider ka DNS/IP badalne par service dead endpoint par hit karti rehti hai jab tak restart na ho",
      "Static HttpClient ek hi thread se use ho sakta hai",
      "Static HttpClient TLS support nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Ek forever-static client socket exhaustion to solve kar deta hai, par connection pooling permanent ho jaati hai — stale DNS. IHttpClientFactory ka handler rotation (default ~2 min) is exact trade-off ko balance karta hai: connections reuse bhi hote hain aur DNS periodically refresh bhi. Static HttpClient thread-safe hai aur TLS karta hai.",
    difficulty: "medium",
  },
  {
    id: "calling-external-apis-with-httpclientfactory-3",
    question: "Named client vs typed client — production me typed client kyun default choice hai?",
    options: [
      "Typed client tez hota hai runtime par",
      "Typed client compile-time safe hai (koi string key nahi), aur saara HTTP detail — base URL, JSON shape, error mapping — ek encapsulated class me rehta hai jise business code bina HttpClient jaane inject karta hai",
      "Named client sirf .NET Framework me kaam karta hai",
      "Typed client ko resilience handler nahi chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Named client ko har call site par IHttpClientFactory chahiye aur string name (typo-prone). Typed client ek class hai jo constructor me HttpClient leti hai; DI use inject karti hai, HTTP concerns ek jagah encapsulate ho jaate hain. Performance same hai, dono modern .NET par chalte hain, aur resilience handler dono par lag sakta hai.",
    difficulty: "medium",
  },
  {
    id: "calling-external-apis-with-httpclientfactory-4",
    question: "Retry policy kis operation par blindly nahi lagani chahiye, aur kyun?",
    options: [
      "GET requests par, kyunki wo cache ho jaati hain",
      "Non-idempotent operations par (jaise create-payment ya create-employee POST) — provider ne request process kar li ho aur sirf response drop hua ho, to retry duplicate bana deta hai",
      "Kisi bhi request par retry safe hai agar backoff ho",
      "Sirf HTTPS calls par",
    ],
    correctIndex: 1,
    explanation:
      "Retry tabhi safe hai jab operation idempotent ho — PAN verify (read-only) safe hai. Ek create/payment POST par response drop hone par server-side effect already ho chuka ho sakta hai; retry double-charge ya duplicate record banata hai. Aise calls par idempotency key bhejte hain ya retry disable karte hain. Backoff/jitter duplicate problem solve nahi karte.",
    difficulty: "medium",
  },
];

export default quiz;
