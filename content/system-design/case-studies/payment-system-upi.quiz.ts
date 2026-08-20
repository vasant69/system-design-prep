import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "psu-1",
    question:
      "Payer ki app ko ek payment request ka response nahi milta (timeout ho gaya). Sabse safe next step kya hai?",
    options: [
      "Turant same amount ke saath ek naya transaction ID generate karke retry karna",
      "User ko turant 'payment failed' dikha dena aur move on karna",
      "Same transaction ID ke saath status-check API call karna, tabhi decide karna retry karni hai ya nahi",
      "5 second wait karke phir se poora payment flow ek fresh request ki tarah initiate karna",
    ],
    correctIndex: 2,
    explanation:
      "Timeout ka matlab failure nahi hai — request process ho chuki ho sakti hai aur sirf response lost hua ho. Isliye pehle same transaction ID se status-check karo, phir decide karo. Naya transaction ID (A) ya fresh initiate (D) dono double-debit ka risk create karte hain agar original already succeed ho chuka tha. Turant 'failed' dikhana (B) galat hai kyunki actual status abhi unknown hai, na ki confirmed failure.",
    difficulty: "medium",
  },
  {
    id: "psu-2",
    question:
      "Is design mein idempotency key (transaction/reference ID) ka core purpose kya hai?",
    options: [
      "Transaction ko encrypt karna taaki bank details safe rahein",
      "Har hop ko yeh detect karne dena ki yeh request pehle process ho chuki hai, taaki retry par duplicate money-movement na ho",
      "Sirf transaction history UI mein sorting ke liye use hota hai",
      "Load balancer ko batana ki request kaunse server pe route karni hai",
    ],
    correctIndex: 1,
    explanation:
      "Idempotency key ek same ID hai jo poori chain (PSP se NPCI se bank tak) mein retry ke dauraan reuse hoti hai, taaki har hop check kar sake 'maine yeh pehle process kiya tha kya' aur duplicate operation na kare. Yeh encryption (A) nahi hai, sirf UI sorting (C) ke liye nahi hai, aur load balancing routing (D) se iska koi seedha lena-dena nahi.",
    difficulty: "easy",
  },
  {
    id: "psu-3",
    question:
      "Ledger design mein 'balance = balance - amount' jaisa single mutable update production payment systems mein kyun avoid kiya jaata hai?",
    options: [
      "Kyunki yeh query SQL mein likhna mushkil hai",
      "Kyunki yeh operation safely retriable nahi hai (retry par amount do baar minus ho sakta hai) aur audit trail nahi deta",
      "Kyunki yeh approach databases mein allowed hi nahi hai",
      "Kyunki isse balance hamesha negative ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Ek mutable balance update retry-unsafe hai — agar operation dobara chal jaaye (jaise ambiguous timeout ke baad), amount do baar deduct/add ho sakta hai. Iske alawa is approach mein koi immutable trail nahi hota audit/regulatory needs ke liye. Yeh SQL syntax ka issue nahi hai (A), databases isse allow karte hain (C) — problem correctness ki hai na ki permission ki, aur yeh negative balance guarantee nahi karta (D) — woh ek unrelated concern hai.",
    difficulty: "medium",
  },
  {
    id: "psu-4",
    question:
      "CAP theorem ke terms mein, ek UPI-jaisa payment system design explicitly kis choice ko prioritize karta hai, aur kyun?",
    options: [
      "AP — availability sabse important hai kyunki users ko app kabhi down nahi dikhni chahiye",
      "CP — consistency sabse important hai, availability chhodna acceptable hai lekin galat/stale balance dikhana nahi",
      "Dono equally important hain, koi trade-off nahi karna padta payment systems mein",
      "Na CP na AP — CAP theorem sirf NoSQL databases pe apply hota hai, payment systems pe nahi",
    ],
    correctIndex: 1,
    explanation:
      "Payment systems explicitly CP hote hain — network partition ki situation mein system availability sacrifice karega (jaise 'processing...' dikhana ya request reject karna) lekin kabhi wrong/stale balance nahi dikhayega, kyunki galat balance ka matlab hai paisa create/destroy hona. Sirf availability prioritize karna (A) is domain mein dangerous hai. Trade-off avoid nahi ho sakta (C) — CAP theorem ek fundamental constraint hai partition ke waqt. CAP sirf NoSQL tak limited nahi hai (D), yeh kisi bhi distributed system pe apply hota hai.",
    difficulty: "hard",
  },
];

export default quiz;
