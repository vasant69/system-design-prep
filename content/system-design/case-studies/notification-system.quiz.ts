import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "nts-1",
    question:
      "Order Service ko notification trigger karne ke liye directly SMS gateway ko synchronously call karne ki jagah ek message queue mein event publish karna kyun better hai?",
    options: [
      "Kyunki message queues hamesha cheaper hote hain direct API calls se",
      "Kyunki agar SMS gateway slow/flaky ho, synchronous call order-confirmation jaise core business flow ko block/slow kar degi — queue decoupling isse prevent karta hai",
      "Kyunki SMS gateways sirf queued messages accept karte hain, direct calls allowed hi nahi hote",
      "Kyunki queues automatically message content ko translate kar dete hain",
    ],
    correctIndex: 1,
    explanation:
      "Async/queue-based design ka core reason hai third-party channel providers (SMS, email) ki unreliability se core business logic ko isolate karna — agar order service synchronously wait karta, ek flaky provider order flow ko hi block kar sakta tha. Cost (A) core reason nahi hai. SMS gateways generally direct API calls accept karte hain (C galat premise). Translation (D) queue ka kaam nahi hai.",
    difficulty: "medium",
  },
  {
    id: "nts-2",
    question:
      "Kayi alag upstream teams (order, payment, marketing) ke liye ek shared Notification Service banane ka sabse bada architectural fayda kya hai?",
    options: [
      "Shared service hamesha zyada fast hota hai per-team integrations se",
      "Duplicate integration logic avoid hoti hai, consistent user-preference/anti-spam handling milta hai, aur naya channel add karna sirf ek jagah change hai",
      "Shared service ka matlab hai koi bhi team kabhi bhi rate-limited nahi hogi",
      "Isse har team apna khud ka alag SMS provider use kar sakti hai",
    ],
    correctIndex: 1,
    explanation:
      "Ek shared Notification Service N teams ko apna khud ka channel-integration logic dobara likhne se bachata hai, user preferences aur anti-spam ek jagah consistently enforce hote hain, aur naya channel (jaise WhatsApp) add karna sirf notification service mein hota hai, upstream services ko touch nahi karna padta. Speed guarantee (A) automatic nahi hai. Rate limiting still applicable hoti hai shared service mein bhi (C galat). Alag providers use karna (D) is design ka fayda nahi, balki ismein consistency hi lost ho jaati.",
    difficulty: "easy",
  },
  {
    id: "nts-3",
    question:
      "Push notification 2-3 minute ke andar deliver confirm nahi hoti. Production system typically kya karta hai?",
    options: [
      "Bas wait karte rehna indefinitely, koi fallback nahi",
      "Turant user ka account flag kar dena as inactive",
      "Automatically SMS jaise fallback channel pe escalate karna, agar notification urgent category ki ho",
      "Push provider ko permanently block kar dena",
    ],
    correctIndex: 2,
    explanation:
      "Production systems ek fallback chain design karte hain — push agar threshold time ke andar deliver confirm na ho, urgent notifications ke liye system SMS jaise reliable-but-costlier channel par escalate karta hai. Indefinite wait (A) poor UX hai time-sensitive updates ke liye. Account flagging (B) is problem se unrelated hai. Provider ko permanently block karna (D) ek single delivery-delay ki wajah se overreaction hai.",
    difficulty: "medium",
  },
  {
    id: "nts-4",
    question:
      "User preference (explicit opt-out) aur notification budget/anti-spam cap — yeh dono mechanisms kaise differ karte hain?",
    options: [
      "Dono exactly same cheez hain, ek hi mechanism ke do naam hain",
      "User preference user ka explicit choice hai (jaise marketing mute karna); notification budget ek system-enforced safety cap hai jo bugs/retry-loops se accidental spam rokta hai chahe user ne kuch explicitly mute na kiya ho",
      "User preference sirf email ke liye applicable hai, budget sirf SMS ke liye",
      "Notification budget sirf paid users ke liye hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Yeh do alag concerns hain — user preference ek explicit, user-controlled opt-in/opt-out hai per category, jabki notification budget ek system-wide safety mechanism hai jo protect karta hai accidental floods se (jaise ek buggy retry loop jo same event baar baar publish kar de), chahe user ne kuch mute kiya ho ya nahi. Yeh same mechanism nahi hain (A galat). Dono channel-agnostic concepts hain, kisi ek channel tak limited nahi (C galat). Paid/free status se koi seedha connection nahi hai (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
