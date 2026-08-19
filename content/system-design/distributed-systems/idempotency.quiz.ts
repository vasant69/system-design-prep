import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "idem-1",
    question: "Ek client payment request bhejta hai, server payment successfully process kar leta hai, lekin response network glitch ki wajah se client tak nahi pahunchta. Client timeout dekhke request retry karta hai. Idempotency key ke bina kya risk hai?",
    options: [
      "Koi risk nahi, server automatically duplicate detect kar lega bina kisi extra mechanism ke",
      "User se double charge ho sakta hai, kyunki server ko pata nahi ki yeh retry hai ya nayi request — dono baar payment process ho sakta hai",
      "Request permanently fail ho jaayegi aur retry kaam hi nahi karega",
      "Yeh sirf GET requests ke saath hota hai, POST requests is problem se immune hote hain",
    ],
    correctIndex: 1,
    explanation:
      "Bina idempotency key ke, server ke paas koi tareeka nahi hai yeh distinguish karne ka ki incoming request ek genuine retry hai ya ek naya, independent payment request — isliye woh use dobara process kar sakta hai, jisse double charge ho sakta hai. Server automatic duplicate detection (A) bina explicit mechanism ke nahi kar sakta. Retry successfully bhi ho sakta hai server-side (bas galat effect ke saath), 'permanently fail' (C) galat hai. POST requests exactly wahi hain jo is risk ke sabse zyada susceptible hain, immune nahi (D galat).",
    difficulty: "easy",
  },
  {
    id: "idem-2",
    question: "HTTP methods mein se PUT aur DELETE idempotent by definition hain, lekin POST nahi hai. Isका practical implication kya hai payment APIs design karte waqt?",
    options: [
      "Payment APIs ko hamesha PUT use karna chahiye, POST kabhi use nahi karna chahiye",
      "POST-based 'create payment/charge' endpoints ko explicitly idempotency-key pattern implement karna chahiye kyunki HTTP khud POST ke liye koi duplicate-safety guarantee nahi deta",
      "Idempotency sirf GET requests ke liye relevant hai, POST/PUT/DELETE sabke liye irrelevant hai",
      "PUT aur DELETE ko bhi explicit idempotency keys chahiye, HTTP semantics kaafi nahi hain",
    ],
    correctIndex: 1,
    explanation:
      "Kyunki POST by HTTP spec definition idempotent nahi hai (har call naya effect create kar sakta hai), payment/order-creation jaise POST endpoints ko application-level explicit idempotency key mechanism implement karna zaroori hai. PUT/DELETE ko yeh nahi chahiye kyunki unki idempotency HTTP semantics se hi (correctly implemented hone par) guaranteed hoti hai (D galat). 'Hamesha PUT use karo' (A) practical nahi hai kyunki payment ek action/create operation hai jo naturally POST semantics fit karta hai. Idempotency GET ke alawa POST/PUT/DELETE sabke liye relevant hai (C galat).",
    difficulty: "medium",
  },
  {
    id: "idem-3",
    question: "'Add ₹500 to balance' operation vs 'Set balance to ₹5000' operation — inme se kaunsa naturally idempotent hai aur kyun?",
    options: [
      "Dono naturally idempotent hain, dono baar-baar chalane pe same result dete hain",
      "'Set balance to ₹5000' naturally idempotent hai kyunki chahe ek baar chale ya paanch baar, end state hamesha balance = ₹5000 hoga; 'Add ₹500' idempotent nahi hai kyunki repeat hone pe balance badhta hi jaayega",
      "'Add ₹500 to balance' naturally idempotent hai kyunki yeh ek simple arithmetic operation hai",
      "Dono mein se koi bhi idempotent nahi ho sakta, sirf GET requests idempotent ho sakti hain",
    ],
    correctIndex: 1,
    explanation:
      "'Set balance to X' ek absolute operation hai — end state hamesha same rehta hai chahe kitni baar bhi apply karo, isliye naturally idempotent hai. 'Add X to balance' ek relative operation hai — har repeat execution ek naya cumulative effect create karta hai, isliye idempotent nahi hai. Dono naturally idempotent hona (A) galat hai — yeh exactly is distinction ko miss karta hai. 'Add' ko idempotent bolna (C) galat hai. Idempotency HTTP methods tak limited nahi hai, business logic operations bhi naturally idempotent ya non-idempotent ho sakti hain (D galat).",
    difficulty: "medium",
  },
  {
    id: "idem-4",
    question: "Server ek duplicate idempotency key detect karta hai aur simply ek error return kar deta hai ('duplicate request rejected') instead of stored result return karne ke. Yeh approach mein kya problem hai?",
    options: [
      "Koi problem nahi, error return karna sabse safe approach hai",
      "Client ko lagega unka payment fail ho gaya jabki woh actually pehli baar successfully process ho chuka tha — isse user confusion aur unnecessary support tickets ban sakte hain; sahi behavior hai stored result wapas return karna",
      "Yeh approach security risk create karta hai",
      "Idempotency key sirf tabhi kaam karti hai jab duplicate ko reject kiya jaaye, yeh sahi approach hai",
    ],
    correctIndex: 1,
    explanation:
      "Idempotency key ka poora point yeh hai ki client ko wahi result mile jo unki original request ne produce kiya tha — sirf error dena client ko misleading signal deta hai ki payment fail ho gaya, jabki woh actually succeed ho chuka tha, jo confusion aur support load badhata hai. Error return karna 'safe' (A) nahi hai, yeh misleading hai. Security se iska direct relation nahi hai (C). Reject karna sahi approach nahi hai — sahi pattern hai stored, original result return karna (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
