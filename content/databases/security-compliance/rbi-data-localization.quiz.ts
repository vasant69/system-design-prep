import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "rbi-1",
    question: "RBI ka data localization mandate India mein operate karne wale payment system providers ke liye kya require karta hai?",
    options: [
      "Data ko har region mein equally replicate karna",
      "Payment system data ko exclusively India ke andar located servers pe store karna",
      "Sirf encrypted data ko India ke bahar bhejna allowed hai",
      "Data localization sirf government-owned banks pe apply hota hai",
    ],
    correctIndex: 1,
    explanation:
      "RBI ka mandate specifically yeh kehta hai ki payment system data India ke andar located servers pe hi store ho, chahe woh company private ho ya government-owned. Option A galat hai — yeh normal multi-region playbook hai jo yahan apply nahi hota. Option C galat hai — encryption is requirement ko bypass nahi karta, data ki location hi core requirement hai. Option D galat hai — yeh PSPs/payment aggregators pe apply hota hai broadly, na ki sirf government banks pe.",
    difficulty: "easy",
  },
  {
    id: "rbi-2",
    question: "Ek global payments platform India mein bhi operate karta hai. Unke global disaster recovery (DR) design pe data localization ka kya real impact padta hai?",
    options: [
      "Koi impact nahi, DR strategy same rehti hai har jagah",
      "Indian payment data ka DR site bhi India ke andar hi hona chahiye — continent-spanning DR design yahan nahi chal sakta",
      "DR site ki zaroorat hi khatam ho jaati hai India ke liye",
      "DR site sirf ek doosre Asian country mein ho sakta hai, India ke bahar",
    ],
    correctIndex: 1,
    explanation:
      "Data localization ka matlab hai poora data lifecycle — including DR/backup — India ke andar rehna chahiye. Isliye geographic diversity ke liye India ke andar hi alag cities dhoondhni padti hain (jaise Mumbai-Hyderabad), continent-level diversity ka normal playbook yahan apply nahi hota. Option A galat hai kyunki yehi topic ka core point hai ki impact padta hai. Option C galat hai — DR ki zaroorat khatam nahi hoti, sirf uski geography constrained hoti hai. Option D galat hai — data India ke bahar kahin bhi (Asia included) DR ke liye nahi ja sakta.",
    difficulty: "medium",
  },
  {
    id: "rbi-3",
    question: "Ek fintech company apne global analytics dashboard ke liye Indian transaction data US region mein replicate karna chahti hai. Data localization ke hisaab se yeh kab acceptable hota hai?",
    options: [
      "Hamesha acceptable hai agar data encrypted ho",
      "Sirf jab aggregated/anonymized metadata replicate ki jaaye, na ki row-level transaction records",
      "Kabhi bhi acceptable nahi hai, chahe kuch bhi ho",
      "Sirf weekends pe acceptable hai",
    ],
    correctIndex: 1,
    explanation:
      "Data localization ka nuance yeh hai ki full/raw transaction-level data cross-border nahi ja sakta, lekin permitted, narrowly-defined aggregated ya anonymized metadata specific restrictions ke saath allow ho sakti hai global reporting jaise use cases ke liye. Option A galat hai — encryption is requirement ko bypass nahi karta. Option C over-simplified hai — kuch limited exceptions/permitted flows exist karte hain, poori tarah blanket 'kabhi nahi' sahi nahi hai. Option D irrelevant hai.",
    difficulty: "hard",
  },
  {
    id: "rbi-4",
    question: "Interview mein ek Indian fintech ke liye system design pucha jaata hai. Ek senior-level candidate proactively kya raise karega jo ek junior candidate miss kar sakta hai?",
    options: [
      "Database indexing strategy",
      "Data localization constraint — ki Indian payment data ko global multi-continent replication mein include nahi kiya ja sakta",
      "Frontend framework choice",
      "API rate limiting strategy",
    ],
    correctIndex: 1,
    explanation:
      "Data localization ek regulatory-specific constraint hai jo generic system design playbook (jaise 'multi-region replicate for resilience') se directly conflict karta hai — isse proactively raise karna senior-level regulatory awareness dikhata hai. Options A, C, D generic system design concerns hain jo important ho sakte hain lekin is specific BFSI-India distinguishing factor ko highlight nahi karte jaisa is topic mein discuss kiya gaya.",
    difficulty: "medium",
  },
];

export default quiz;
