import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "vhs-1",
    question: "Vertical scaling ka sabse bada structural limitation kya hai?",
    options: [
      "Yeh application code mein bade changes require karta hai",
      "Ek hard physical/cost ceiling hoti hai, aur single point of failure bhi remove nahi hota",
      "Yeh sirf databases ke liye use ho sakta hai, servers ke liye nahi",
      "Yeh hamesha horizontal scaling se zyada expensive hota hai, chahe scale kuch bhi ho",
    ],
    correctIndex: 1,
    explanation:
      "Vertical scaling ki core limitation yeh hai ki ek single machine ki power infinitely badhaayi nahi ja sakti (physical ceiling) aur cost bhi high-end pe disproportionately badhta hai, plus machine crash hone par poora system down ho jaata hai (SPOF unresolved). Code change (A) galat hai — vertical scaling ka fayda hi yeh hai ki code change nahi chahiye. (C) galat hai, yeh kisi bhi single-machine system par apply hota hai. (D) galat hai — chhote scale par vertical scaling aksar cheaper hi hota hai.",
    difficulty: "easy",
  },
  {
    id: "vhs-2",
    question:
      "Horizontal scaling ko implement karna kyun automatically 'trivial win' nahi hota, agar servers stateful hain?",
    options: [
      "Horizontal scaling stateful servers ke saath technically possible hi nahi hai",
      "Stateful data ko multiple machines ke beech sync/partition karna padta hai, jo consistency aur network overhead jaisi genuine complexity add karta hai",
      "Stateful servers automatically slower ho jaate hain jab unhe horizontally scale kiya jaaye",
      "Horizontal scaling sirf read-only systems ke liye kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Stateful servers ke saath horizontal scaling possible hai (B correct) lekin us state ko multiple machines ke beech consistent rakhna padta hai — yehi complexity add karta hai (partitioning, replication, consistency). (A) galat hai, technically possible hai bas hard hai. (C) ek unfounded claim hai. (D) galat hai — horizontal scaling reads aur writes dono systems mein apply hota hai, bas stateful writes zyada complex hote hain.",
    difficulty: "medium",
  },
  {
    id: "vhs-3",
    question:
      "Ek early-stage startup ka traffic abhi kam hai aur ek single well-specced database instance comfortably load handle kar raha hai. Best approach kya hoga?",
    options: [
      "Turant horizontal sharding implement karna kyunki 'real companies' aisa karte hain",
      "Filhaal vertical scaling ke saath continue karna, kyunki simplicity ka benefit abhi distributed complexity ke cost se zyada hai",
      "Turant microservices mein poora system todna",
      "Koi bhi scaling decision avoid karna jab tak system crash na ho jaaye",
    ],
    correctIndex: 1,
    explanation:
      "Early-stage systems mein jab current scale par vertical scaling comfortably kaam kar raha ho, uski simplicity ka fayda distributed system ki complexity se zyada hota hai — premature horizontal scaling over-engineering hai. (A) aur (C) premature complexity add karte hain bina justification ke. (D) bhi galat hai — proactive planning zaroori hai, lekin uska matlab abhi hi horizontal scale karna nahi hai.",
    difficulty: "medium",
  },
  {
    id: "vhs-4",
    question:
      "Interview mein candidate bolta hai: 'Hum bas horizontally scale kar denge, yeh hamesha vertical scaling se better hai.' Is statement mein sabse badi problem kya hai?",
    options: [
      "Statement bilkul correct hai, koi problem nahi",
      "Yeh judgment ki kami dikhata hai — horizontal scaling apni complexity (state, consistency, network overhead) leke aata hai aur har situation mein automatically better nahi hota, especially early-stage ya hard-to-shard databases ke liye",
      "Horizontal scaling naam ka concept hi galat hai",
      "Vertical scaling kabhi bhi correct choice nahi ho sakta",
    ],
    correctIndex: 1,
    explanation:
      "Yeh statement 'horizontal is always better' ek oversimplification hai jo trade-offs ignore karta hai — horizontal scaling apni operational aur consistency complexity leke aata hai, aur vertical scaling kai genuine scenarios (early-stage, hard-to-shard databases, simplicity-first) mein sahi choice hoti hai. (A), (C), aur (D) sab extreme/galat positions hain jo nuanced trade-off ko miss karte hain.",
    difficulty: "hard",
  },
];

export default quiz;
