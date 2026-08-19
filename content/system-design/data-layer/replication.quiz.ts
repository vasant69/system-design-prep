import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "rep-1",
    question: "User apni profile photo update karta hai, page reload karta hai, aur purani photo dikhti hai kuch seconds ke liye. Yeh classic bug kis wajah se hota hai?",
    options: [
      "Database ne write ko silently drop kar diya",
      "Read ek follower se serve hui jo abhi tak leader se latest change replicate nahi kar paaya tha (replication lag)",
      "Browser cache corrupt ho gaya",
      "User ne galat button dabaya",
    ],
    correctIndex: 1,
    explanation:
      "Yeh classic read-your-own-writes issue hai — write leader ko commit hui, lekin read ek lagging follower se serve hui jise update abhi tak nahi mila. Write silently drop nahi hui (A galat, woh committed thi). Yeh browser cache issue nahi, backend replication timing issue hai (C galat). User action se bug ka koi lena-dena nahi (D galat).",
    difficulty: "easy",
  },
  {
    id: "rep-2",
    question: "Synchronous replication ka core trade-off kya hai asynchronous replication ke comparison mein?",
    options: [
      "Synchronous replication mein data loss risk kam hoti hai (leader crash pe follower ke paas already data hota hai), lekin write latency badh jaati hai kyunki follower confirmation ka wait karna padta hai",
      "Synchronous replication hamesha asynchronous se fast hoti hai",
      "Asynchronous replication mein koi data loss risk hi nahi hoti",
      "Synchronous replication sirf single-leader systems mein possible hai",
    ],
    correctIndex: 0,
    explanation:
      "Synchronous replication write ko tabhi commit maanta hai jab follower confirm kare — isse durability improve hoti hai lekin latency badhti hai (extra round trip). Yeh asynchronous se fast nahi, balki slow hoti hai (B galat). Async replication mein leader crash on the lag window mein data loss ho sakta hai (C galat). Sync replication multi-leader setups mein bhi ho sakti hai, single-leader tak restricted nahi (D galat).",
    difficulty: "medium",
  },
  {
    id: "rep-3",
    question: "Multi-leader (master-master) replication single-leader ke comparison mein kya problem introduce karta hai jo single-leader mein exist hi nahi karti?",
    options: [
      "Multi-leader mein reads possible hi nahi hote",
      "Concurrent writes on the same record do alag leaders par simultaneously ho sakte hain, jisse conflict resolution ek genuinely hard problem ban jaata hai",
      "Multi-leader systems replication lag se completely immune hote hain",
      "Multi-leader setups mein followers ki zaroorat hi nahi hoti",
    ],
    correctIndex: 1,
    explanation:
      "Multi-leader ka core naya challenge conflict resolution hai — jab same record do leaders par simultaneously alag values se update ho jaaye. Single-leader mein yeh possible hi nahi kyunki writes ek hi jagah se aate hain. Reads multi-leader mein bhi normal chalte hain (A galat). Multi-leader replication lag se immune nahi hota (C galat) — lag phir bhi ho sakta hai nodes ke beech sync hone mein. Followers ka concept multi-leader mein bhi rehta hai, sirf leaders multiple ho jaate hain (D galat).",
    difficulty: "medium",
  },
  {
    id: "rep-4",
    question: "Ek production leader database crash ho jaata hai. Naive failover logic 'jo bhi follower pehle respond kare use turant leader bana do' follow karti hai. Is approach mein sabse bada risk kya hai?",
    options: [
      "Koi risk nahi, yeh standard best practice hai",
      "Sabse zyada replication lag wala follower promote ho sakta hai (zyada data loss), aur agar purana leader wapas online aa jaaye, split-brain (do simultaneous leaders) ho sakta hai",
      "Failover hamesha instant hota hai is approach mein, koi downtime hi nahi hota",
      "Yeh approach sirf multi-leader systems mein applicable hai, single-leader mein nahi",
    ],
    correctIndex: 1,
    explanation:
      "Naive failover ke do bade risks hain: sabse lagging follower ko promote karna (zyada committed-but-unreplicated data lost ho sakta hai), aur split-brain — agar purana leader wapas aa jaaye aur khud ko still-leader samjhe, do leaders simultaneously conflicting writes accept kar sakte hain. Yeh best practice nahi, ek anti-pattern hai (A galat). Downtime aur data-loss risk dono real hain, 'instant, no downtime' galat claim hai (C). Yeh exactly single-leader setups mein applicable scenario hai — leader failover ka concept hi single-leader systems ke liye hai (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
