import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "fdp-1",
    question: "Yeh case study doosre BFSI case studies (jaise core banking ledger ya credit card billing) se shape mein kaise alag hai?",
    options: [
      "Yeh koi database use nahi karta, sirf application code hai",
      "Yeh ek data pipeline/architecture problem hai, na ki ek single transactional schema design problem",
      "Isme koi real-time requirement nahi hai",
      "Yeh sirf ek algorithm hai, koi data storage nahi chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Fraud detection deliberately ek different shape ka problem hai — yeh multiple storage layers (feature store, event stream, data warehouse) ka architecture design test karta hai, na ki ek single OLTP schema (tables/foreign keys/constraints) jaisa baaki case studies. Yeh definitely database/storage use karta hai (A galat), ismein real-time requirement bahut extreme hai (C galat — tens of milliseconds), aur data storage genuinely central hai is problem mein (D galat).",
    difficulty: "easy",
  },
  {
    id: "fdp-2",
    question: "Real-time fraud scoring (tens of milliseconds latency budget ke saath) ke liye 'score this transaction now' query kahan se read karti hai?",
    options: [
      "Core OLTP payments database se seedha SUM/COUNT query",
      "Data warehouse se, jahan poora historical data hai",
      "FraudFeatureStore se — ek fast key-value store jisme precomputed rolling aggregates already stored hain",
      "Ek naya SQL query jo har baar features compute karta hai from scratch",
    ],
    correctIndex: 2,
    explanation:
      "Real-time scoring FraudFeatureStore (Redis-jaisi key-value store) se read hota hai, jahan features already precomputed/incrementally updated hote hain — yeh sub-millisecond lookup deta hai. Core OLTP database (A) ya data warehouse (B) pe per-transaction aggregation query chalana latency budget ke saath incompatible hai bade tables pe. Features ko har baar from scratch compute karna (D) bhi latency budget todta hai — isiliye precomputation zaroori hai.",
    difficulty: "medium",
  },
  {
    id: "fdp-3",
    question: "CDC/outbox pattern is architecture mein kya role play karta hai?",
    options: [
      "Yeh fraud scores calculate karta hai",
      "Yeh transaction events ko core payments database se stream out karta hai bina core transaction path ki latency ko affect kiye",
      "Yeh human review queue manage karta hai",
      "Yeh feature store ko encrypt karta hai",
    ],
    correctIndex: 1,
    explanation:
      "CDC/outbox core payments DB se fraud pipeline ko decouple karta hai — transaction events asynchronously stream hote hain bina core transaction commit path ko slow kiye ya fraud pipeline ki health se couple kiye. Fraud scores calculate karna (A) scoring service ka kaam hai, CDC ka nahi. Review queue management (C) FraudReviewQueue table ka role hai. Encryption (D) is topic ka focus nahi hai.",
    difficulty: "medium",
  },
  {
    id: "fdp-4",
    question: "Fraud pipeline khud down ho jaaye, to 'fail open' approach ka matlab kya hai, aur zyada production payment systems generally kya choose karte hain?",
    options: [
      "Fail open = transaction ko block kar do jab tak scoring wapas aaye; zyada systems fail closed choose karte hain",
      "Fail open = transaction allow kar do with stricter downstream controls; zyada production systems yehi choose karte hain kyunki total outage business ke liye costly hai",
      "Fail open aur fail closed same cheez hain",
      "Fail open ka matlab hai fraud pipeline ko permanently band kar dena",
    ],
    correctIndex: 1,
    explanation:
      "Fail open matlab scoring unavailable hone pe transaction ko allow kar dena (stricter downstream monitoring/limits ke saath) — business continuity priority. Zyada production payment systems isse choose karte hain kyunki total transaction outage directly business-costly hota hai. Fail closed (jo option A describe karta hai as fail open, galat) matlab transaction block karna jab tak scoring available na ho — safety priority but revenue/customer-experience impact. Options C aur D dono factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
