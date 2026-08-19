import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "aslo-1",
    question: "SLI, SLO, aur SLA mein basic difference kya hai?",
    options: [
      "Teeno same cheez hain, bas alag naam hain",
      "SLI ek measured metric hai, SLO uska internal target hai, SLA customer ke saath external contractual commitment hai",
      "SLA sabse pehle define hota hai, phir SLO, phir SLI",
      "SLO sirf latency ke liye hota hai, SLA sirf availability ke liye",
    ],
    correctIndex: 1,
    explanation:
      "SLI ek raw measured number hai (actual uptime), SLO uspe based internal goal hai, aur SLA ek external contractual promise hai penalty ke saath. Order hamesha SLI se SLO se SLA hota hai, ulta nahi (C galat). SLO/SLA kisi bhi metric (latency, availability, error rate) ke liye ho sakte hain, sirf ek type tak limited nahi (D galat).",
    difficulty: "easy",
  },
  {
    id: "aslo-2",
    question: "99.9% uptime ka matlab saal mein approximately kitna downtime allowed hai?",
    options: [
      "3.65 din",
      "8.76 hours",
      "52.6 minutes",
      "5.26 minutes",
    ],
    correctIndex: 1,
    explanation:
      "99.9% ('three nines') = 0.1% downtime = 8.76 hours/saal. 3.65 din 99% ke liye hai (A), 52.6 minutes 99.99% ke liye hai (C), aur 5.26 minutes 99.999% ke liye hai (D) — har additional nine downtime ko roughly 10x kam kar deta hai.",
    difficulty: "medium",
  },
  {
    id: "aslo-3",
    question: "SLO ko SLA se strict (tighter) kyun rakha jaata hai?",
    options: [
      "Kyunki regulations aisa require karti hain",
      "Taaki ek buffer mile — internal target thoda miss ho bhi jaaye to bhi customer-facing SLA breach na ho aur penalty na lage",
      "Kyunki SLO measure karna SLA se zyada mehenga hota hai",
      "Actually SLO hamesha SLA se loose hona chahiye, tighter nahi",
    ],
    correctIndex: 1,
    explanation:
      "SLO ko SLA se tighter rakhna ek buffer/error budget create karta hai — agar internal target thoda miss ho, phir bhi contractual SLA ke andar rehne ka room hota hai. Yeh regulation ka mudda nahi hai (A galat), measurement cost se related nahi hai (C galat), aur ulta SLO loose rakhna (D) buffer khatam kar dega, jo exact opposite hai sahi practice ka.",
    difficulty: "medium",
  },
  {
    id: "aslo-4",
    question: "Ek team apna 99.9% SLO ka poora error budget ek mahine ke beech mein hi 'spend' kar chuki hai kai chhoti outages ki wajah se. Mature SRE practice ke hisaab se agla sahi step kya hai?",
    options: [
      "Kuch nahi karna, error budget sirf ek theoretical number hai, actual decisions pe impact nahi hona chahiye",
      "Turant SLA renegotiate karna customer ke saath taaki target hi lower ho jaaye",
      "Naye risky feature launches temporarily freeze/slow karna aur reliability-focused work pe shift karna jab tak budget replenish ho",
      "Sirf zyada nines chase karna — seedha 99.999% target set kar dena taaki future mein aisa na ho",
    ],
    correctIndex: 2,
    explanation:
      "Jab error budget khatam ho jaata hai, mature teams risky changes freeze kar dete hain aur stability pe focus karte hain jab tak budget wapas replenish ho — yehi poora point hai error budget ko ek actionable resource treat karne ka (A galat, ismein real decision-making impact hai). SLA renegotiate karna (B) drastic aur unnecessary hai ek single bad month ke liye. Seedha zyada nines target set karna (D) cost ko exponentially badha dega bina root cause fix kiye.",
    difficulty: "hard",
  },
];

export default quiz;
