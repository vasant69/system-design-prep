import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "kestrel-reverse-proxies-1",
    question: "Kestrel kya hai?",
    options: [
      "Ek external, third-party web server jo alag se install karna padta hai",
      "ASP.NET Core ka apna, embedded, cross-platform web server jo har app ke andar built-in hota hai",
      "Ek database connection pooling library",
      "Ek deployment tool jaise Docker",
    ],
    correctIndex: 1,
    explanation:
      "Kestrel ASP.NET Core apps ke andar embedded, built-in web server hai — Windows, Linux, macOS sab pe same tareeke se chalta hai, koi external web-server dependency nahi chahiye. Options C aur D unrelated concepts hain; Option A galat hai kyunki Kestrel already app ke saath aata hai, separately install nahi karna padta.",
    difficulty: "easy",
  },
  {
    id: "kestrel-reverse-proxies-2",
    question: "Production me Kestrel ko directly internet-facing rakhne ke bajaye reverse proxy ke peeche kyun rakha jaata hai?",
    options: [
      "Kyunki Kestrel HTTPS support hi nahi karta",
      "Kyunki Kestrel deliberately minimal hai — TLS termination hardening, slow-client protection, multi-app routing jaisi edge-layer responsibilities dedicated proxy layer ko di jaati hain",
      "Kyunki Kestrel sirf Windows pe kaam karta hai",
      "Kyunki .NET apps bina reverse proxy ke start hi nahi hoti",
    ],
    correctIndex: 1,
    explanation:
      "Kestrel ek fast application server hai lekin jaanbujh kar minimal — edge-layer hardening (TLS termination, slow-client defense, multi-app routing, load balancing) ek dedicated reverse proxy (IIS/Nginx/cloud LB) ko di jaati hai jo in cheezon me battle-tested hai. Options A, C, D factually galat hain — Kestrel HTTPS support karta hai aur cross-platform hai.",
    difficulty: "medium",
  },
  {
    id: "kestrel-reverse-proxies-3",
    question: "Reverse proxy ke peeche chalne wale ASP.NET Core app me original client IP address kaise preserve/access kiya jaata hai?",
    options: [
      "Automatically, kuch bhi extra configure karne ki zaroorat nahi",
      "`ForwardedHeadersMiddleware` configure karke, jo `X-Forwarded-For`/`X-Forwarded-Proto` headers padhta hai",
      "Client IP kabhi bhi accurately nahi mil sakta reverse proxy ke peeche",
      "Sirf database query se manually lookup karke",
    ],
    correctIndex: 1,
    explanation:
      "Jab request reverse proxy se hokar aati hai, app ko by default lagta hai request proxy machine se hi aa rahi hai. `ForwardedHeadersMiddleware` (`app.UseForwardedHeaders(...)`) `X-Forwarded-For` aur `X-Forwarded-Proto` headers padh kar original client IP aur scheme restore karta hai. Ye automatic nahi hota (Option A galat), aur possible hai correctly configure karne par (Option C galat).",
    difficulty: "medium",
  },
  {
    id: "kestrel-reverse-proxies-4",
    question: "'Reverse proxy' term ka matlab kya hai, forward proxy se kaise alag hai?",
    options: [
      "Dono ek hi cheez hain, sirf naam alag hai",
      "Reverse proxy server-side hota hai (client ko lagta hai wo ek hi server se baat kar raha hai, actually request internally forward hoti hai); forward proxy client-side hota hai",
      "Reverse proxy sirf caching ke liye use hota hai",
      "Forward proxy sirf HTTPS ke liye hota hai, reverse proxy sirf HTTP ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Reverse proxy server-infrastructure-side sits karta hai — client ko lagta hai wo directly ek server se baat kar raha hai, lekin proxy request ko internally kisi doosre server (jaise Kestrel) tak forward karta hai. Forward proxy iske contrast me client-side hota hai, client ke behalf pe outbound requests karta hai (jaise corporate network proxy). Options C aur D galat characterizations hain.",
    difficulty: "hard",
  },
];

export default quiz;
