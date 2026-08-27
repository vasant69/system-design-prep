import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lambda-config-1",
    question: "Lambda me kitni memory pe exactly 1 full vCPU allocate hoti hai?",
    options: ["512 MB", "1,024 MB", "1,769 MB", "10,240 MB"],
    correctIndex: 2,
    explanation: "Sahi jawab C hai — 1,769 MB memory pe exactly 1 full vCPU milti hai, ye Lambda ka proportional CPU allocation ka anchor point hai. Baaki options (A, B, D) galat numbers hain jo is exact threshold ko represent nahi karte.",
    difficulty: "medium",
  },
  {
    id: "lambda-config-2",
    question: "Ek I/O-bound Lambda function (mostly network wait) ki memory badhane se kya hota hai?",
    options: [
      "Duration significantly kam ho jaata hai kyunki zyada CPU milti hai",
      "Duration mostly unaffected rehta hai kyunki bottleneck CPU nahi, wait time hai - sirf cost badhta hai",
      "Function automatically fail hone lagta hai",
      "Timeout automatically badh jaata hai",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — I/O-bound workloads me bottleneck network/DB wait time hota hai, CPU nahi, isliye zyada memory dene se duration nahi ghatega, sirf cost badhega bina fayde ke. Option A CPU-bound functions ke liye sach hai, I/O-bound ke liye nahi. Option C aur D galat, unrelated facts hain.",
    difficulty: "medium",
  },
  {
    id: "lambda-config-3",
    question: "Ek synchronous, API Gateway se triggered Lambda ka timeout 900 seconds set kiya gaya hai. Practically iska kya asar hoga?",
    options: [
      "Function actually 900 seconds tak chal sakta hai bina kisi restriction ke",
      "API Gateway ka apna 29-second integration timeout effective cap ban jaata hai, isliye 900s setting mostly bekar hai is scenario me",
      "API Gateway automatically apna timeout bhi 900 seconds kar dega",
      "Ye configuration invalid hai aur deploy hi nahi hoga",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — API Gateway ka integration timeout max 29 seconds hai, isse zyada Lambda timeout set karna synchronous API-facing use case me practically kaam nahi aata kyunki client ko 29 second baad hi 504 mil jaayega. Option A galat hai, ye ceiling ignore karta hai. Option C galat fact hai. Option D galat hai, deployment successful hoga, sirf runtime behavior expected se alag hoga.",
    difficulty: "hard",
  },
  {
    id: "lambda-config-4",
    question: "Reserved concurrency ka dual purpose kya hai?",
    options: [
      "Sirf cost kam karna",
      "Guarantee (function ko minimum capacity milegi) aur hard cap (function is limit se zyada kabhi nahi jaayega, downstream protection)",
      "Sirf cold start eliminate karna jaise Provisioned Concurrency karta hai",
      "Function ko automatically multiple regions me deploy karna",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — reserved concurrency ek saath guarantee (baaki functions is function ko starve nahi kar sakte) aur hard cap (downstream systems jaise database ko overwhelm hone se bachana) dono provide karta hai. Option A galat hai, reserved concurrency free hai lekin iska primary purpose cost saving nahi hai. Option C Provisioned Concurrency ka kaam hai, Reserved concurrency ka nahi - dono alag features hain. Option D bilkul galat fact hai.",
    difficulty: "medium",
  },
];

export default quiz;
