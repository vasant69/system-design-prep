import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "outboxcdc-1",
    question:
      "Application code database mein balance update karta hai, aur phir seedha alag se Kafka pe event publish karta hai (do independent operations). Yeh design kis problem ke against vulnerable hai?",
    options: [
      "Isolation anomaly — dirty read ho sakta hai",
      "Dual write problem — DB write aur queue publish independently fail ho sakte hain, ek succeed ho sakta hai aur doosra fail, system ko inconsistent chhod ke",
      "Lost update anomaly — dono operations ek doosre ko overwrite kar denge",
      "Yeh design bilkul safe hai, koi problem nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Dual write problem exactly yeh hai — do independent systems (database aur message queue) ko separately update karna, bina kisi cross-system atomicity guarantee ke. DB write succeed ho sakta hai jab ki publish fail ho jaaye, ya ulta, dono cases system ko inconsistent state mein chhod dete hain. Option A galat hai, dirty read isolation levels se related hai, yeh scenario alag hai. Option C galat hai, lost update concurrent read-modify-write se related hai, yahan scenario sequential hai (write then publish). Option D poori tarah galat hai, yeh exactly woh problem hai jo is topic mein solve kiya ja raha hai.",
    difficulty: "easy",
  },
  {
    id: "outboxcdc-2",
    question:
      "Outbox pattern mein event row ko business data change ke SAME local transaction mein insert karna kyun critical hai?",
    options: [
      "Kyunki isse query performance improve hoti hai",
      "Kyunki isse guarantee milti hai ki agar business change commit hua, outbox row bhi guaranteed commit hui (aur vice versa) — yehi atomicity ka core point hai jo dual write problem ko solve karta hai",
      "Kyunki database do alag transactions ek saath allow hi nahi karta",
      "Yeh optional hai, alag transaction mein bhi kar sakte ho koi farak nahi padta",
    ],
    correctIndex: 1,
    explanation:
      "Same local transaction mein dono operations (business change + outbox insert) hone se ek single atomic unit ban jaata hai — dono commit honge ya dono nahi, koi partial state possible nahi. Yehi guarantee outbox pattern ko dual write problem se safe banati hai. Option A galat hai, iska primary purpose performance nahi, correctness hai. Option C factually galat hai, databases multiple sequential transactions allow karte hain. Option D poori tarah galat hai — alag transactions mein karna exactly wahi mistake hai jo topic mein explicitly warn kiya gaya hai.",
    difficulty: "medium",
  },
  {
    id: "outboxcdc-3",
    question:
      "Change Data Capture (CDC) tools jaise Debezium kaise kaam karte hain, aur Outbox pattern se unka main structural difference kya hai?",
    options: [
      "CDC bhi ek outbox table maintain karta hai, bas naam alag hota hai",
      "CDC database ka apna internal transaction/replication log (jaise WAL ya binlog) seedha padhta hai, isliye koi separate outbox table maintain karne ki zaroorat nahi hoti — koi bhi row change automatically capture ho jaata hai",
      "CDC sirf NoSQL databases ke saath kaam karta hai",
      "CDC aur Outbox pattern bilkul same cheez hain, koi difference nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "CDC database ke apne existing transaction/replication log ko directly read karta hai (jo durability guarantee ke liye already maintain hota hai) — isliye application ko explicit outbox table maintain karne ki zaroorat nahi padti, koi bhi committed row change automatically stream ho jaata hai. Option A galat hai — yehi to key difference hai, CDC ko separate table ki zaroorat NAHI hoti. Option C factually galat hai, CDC relational databases (WAL, binlog) ke saath primarily kaam karta hai. Option D galat hai, dono mein meaningful structural aur trade-off differences hain jo topic mein explicitly cover kiye gaye.",
    difficulty: "medium",
  },
  {
    id: "outboxcdc-4",
    question:
      "Outbox pattern ya CDC se events downstream consumers tak 'at-least-once' delivery se pahunchte hain, 'exactly-once' se nahi. Iska downstream consumer design pe kya implication hai?",
    options: [
      "Koi implication nahi hai, at-least-once aur exactly-once practically same hain",
      "Downstream consumers ko idempotent design karna zaroori hai, taaki duplicate event delivery se galat/duplicate processing na ho — yeh directly is module ke idempotency topic se connect hota hai",
      "Downstream consumers ko events ko ignore kar dena chahiye agar duplicate lagen",
      "Iska matlab hai ki Outbox/CDC pattern fundamentally broken hai aur use nahi karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "At-least-once delivery ka matlab hai ki relay/CDC crash ya retry ki wajah se same event kabhi-kabhi doosri baar bhi deliver ho sakta hai. Isliye downstream consumers ko idempotent hona chahiye — same event do baar process hone pe bhi correct, consistent result aana chahiye (jaise idempotency-key based deduplication, jo pehle is module mein cover ho chuka hai). Option A galat hai, yeh do alag delivery guarantees hain jinke real implications hain. Option C oversimplified hai — 'ignore kar dena' ek naive approach hai, proper idempotent processing (jaise dedupe by event_id) zyada robust hai. Option D galat hai — yeh pattern ka fundamental limitation hai jise design se handle kiya jaata hai, yeh pattern ko invalid nahi banata.",
    difficulty: "hard",
  },
];

export default quiz;
