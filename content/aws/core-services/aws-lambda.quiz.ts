import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lam-1",
    question:
      "128 MB pe function 10 second leta hai. 1024 MB pe (CPU-bound kaam) duration 1 second ho jaata hai. Cost ka kya hoga?",
    options: [
      "Cost 8 guna badh jaayega kyunki memory 8 guna badhi",
      "Cost same rahega kyunki memory x duration constant hai",
      "Cost kam ho jaayega — memory x duration units 1280 se 1024 ho gaye, aur latency bhi 10x better ho gayi",
      "Cost calculate nahi kiya ja sakta bina exact pricing table dekhe",
    ],
    correctIndex: 2,
    explanation:
      "Lambda cost memory x duration (GB-seconds) pe based hai. 128 MB x 10s = 1280 memory-time units; 1024 MB x 1s = 1024 units — kam cost, aur latency bhi 10 guna better. Ye tabhi hota hai jab function CPU-bound ho, kyunki zyada memory = zyada proportional CPU = kam duration. Option A galat calculation hai. Option B galat hai kyunki duration linearly kam nahi hota memory ke sath (isse zyada favorably kam hota hai CPU-bound case me). Option D galat hai, formula se hi answer mil jaata hai.",
    difficulty: "hard",
  },
  {
    id: "lam-2",
    question: "Reserved concurrency aur Provisioned concurrency me core difference kya hai?",
    options: [
      "Dono same cheez hain, sirf naming alag hai",
      "Reserved concurrency free hai aur guarantee + hard cap deti hai; Provisioned concurrency paid hai aur environments pre-warm karke cold start khatam karti hai",
      "Reserved concurrency cold start khatam karti hai; Provisioned concurrency sirf ek cap hai",
      "Provisioned concurrency free hai, Reserved concurrency paid hai",
    ],
    correctIndex: 1,
    explanation:
      "Reserved concurrency ek function ke liye concurrency reserve/cap karti hai — free hai aur cold start pe koi seedha asar nahi karti, bas downstream protection aur starvation-prevention deti hai. Provisioned concurrency environments ko pehle se initialize karke rakhti hai jisse cold start practically khatam ho jaata hai, lekin idle time pe bhi charge hoti hai. Options A, C, D in roles ko swap ya conflate karte hain.",
    difficulty: "medium",
  },
  {
    id: "lam-3",
    question:
      "Terraform se S3 ObjectCreated trigger add kiya, lekin Lambda invoke hi nahi ho raha. Sabse likely wajah kya hai?",
    options: [
      "Execution role me S3 read permission missing hai",
      "Resource-based policy manually add nahi ki gayi — Terraform/CDK me S3 ko is function ko invoke karne ki permission (AWS::Lambda::Permission) explicitly deni padti hai, console ye automatic karta hai",
      "S3 events sirf console se configure ho sakte hain, IaC se nahi",
      "Lambda timeout bahut kam set hai",
      ],
    correctIndex: 1,
    explanation:
      "Execution role batata hai Lambda kya kar sakta hai (outbound), lekin resource-based policy batati hai kaun Lambda ko invoke kar sakta hai (inbound) — S3 service ko explicit invoke permission chahiye. Console se trigger add karne pe AWS ye automatically kar deta hai, lekin IaC tools me ise manually add karna padta hai. Ye bhool jaana ek bahut common bug hai. Option A wrong-direction permission hai (ye read failure dega, invoke failure nahi). Option C factually galat hai. Option D symptom se unrelated hai.",
    difficulty: "hard",
  },
  {
    id: "lam-4",
    question: "Lambda ka ek execution environment ek waqt me kitne requests handle kar sakta hai, aur iska implication kya hai?",
    options: [
      "Multiple requests parallel me, jaise ek thread pool — memory share hoti hai",
      "Sirf ek request ek waqt me — 100 concurrent requests ke liye 100 alag environments banenge jinke beech memory share nahi hoti",
      "Ye configurable hai, default 10 concurrent requests per environment",
      "Sirf async invocations me ek se zyada request handle hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "Lambda ka fundamental design ye hai ki ek execution environment ek waqt me sirf ek request process karta hai. Isliye concurrent load environments ki count badhata hai, na ki ek environment ke andar parallelism. Implication ye hai ki in-memory caching ya global variables sirf usi environment ke liye valid hain, aur next request kis environment pe jaayegi ye assume nahi kiya ja sakta. Options A, C, D sab is core design ko galat represent karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
