import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "mq-1",
    question: "Swiggy order flow mein payment processing ko async message queue pe kyun NAHI daalna chahiye?",
    options: [
      "Payment processing bahut chhota task hai, queue ki zaroorat nahi",
      "User ko turant pata chalna chahiye ki payment success hui ya fail — yeh immediate feedback ki requirement hai jo sync processing maangti hai",
      "Payment gateway async messages support hi nahi karta",
      "Queues sirf notifications ke liye bane hain",
    ],
    correctIndex: 1,
    explanation:
      "Sync vs async ka decision is baat pe depend karta hai ki user ko immediate feedback chahiye ya nahi. Payment ek aisi operation hai jahan user turant janna chahta hai success/failure, isliye sync rehna chahiye. Baaki options irrelevant ya galat premise hain.",
    difficulty: "easy",
  },
  {
    id: "mq-2",
    question: "Kafka mein consumers apna 'offset' track karte hain — iska sabse bada practical implication kya hai?",
    options: [
      "Consumers messages ko kabhi process nahi kar sakte agar offset galat ho",
      "Messages ko replay kiya ja sakta hai — jaise naya consumer add hone par purana data phir se process karna",
      "Offset sirf debugging ke liye use hota hai, functional impact nahi",
      "Har consumer ko same offset use karna zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "Kafka ka log-based design aur per-consumer offset tracking iska matlab hai ki messages disk pe rehte hain aur consumer chahe to offset reset karke purana data dobara process kar sakta hai — yeh replay capability Kafka ko event streaming/analytics ke liye especially powerful banati hai. Baaki options galat hain.",
    difficulty: "medium",
  },
  {
    id: "mq-3",
    question: "'Exactly-once delivery' ke baare mein sabse accurate statement kaunsa hai?",
    options: [
      "Sab modern message queues (Kafka, RabbitMQ, SQS) exactly-once ko trivially guarantee karte hain",
      "Exactly-once practically bahut hard hai across distributed systems boundaries — real systems usually at-least-once delivery + idempotent consumers pe rely karte hain",
      "Exactly-once ka matlab hai message kabhi lost nahi hoga, duplicate ho sakta hai",
      "Exactly-once sirf RabbitMQ mein possible hai, Kafka mein nahi",
    ],
    correctIndex: 1,
    explanation:
      "Distributed systems mein network failures ke wajah se true exactly-once guarantee dena extremely hard hai — jahan external systems involve hote hain (DB writes, external APIs), guarantee toot sakti hai. Isliye practical approach hai at-least-once delivery + idempotent processing. Baaki options galat claims hain.",
    difficulty: "hard",
  },
  {
    id: "mq-4",
    question: "Ek team ko infrastructure operate karne ka time/expertise nahi hai, aur unhe sirf simple task queue chahiye without complex routing ya replay. Best default choice kya hai?",
    options: [
      "Kafka, kyunki sabse powerful hai",
      "SQS, kyunki fully managed hai aur simple setup deta hai bina infra operate kiye",
      "RabbitMQ self-hosted, kyunki free hai",
      "Koi bhi queue use na karo, sab synchronous rakho",
    ],
    correctIndex: 1,
    explanation:
      "SQS specifically un cases ke liye achha default hai jahan team infrastructure operate nahi karna chahti aur advanced features (Kafka-style replay, RabbitMQ-style complex routing) ki zaroorat nahi hai. Kafka (A) aur self-hosted RabbitMQ (C) dono operational overhead maangte hain. Sab sync rakhna (D) is scenario ke liye sahi solution nahi hai.",
    difficulty: "medium",
  },
];

export default quiz;
