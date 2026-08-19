import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "shp-1",
    question: "Partitioning aur sharding mein exact technical difference kya hai?",
    options: [
      "Dono ek hi cheez hain, sirf naming convention alag hai",
      "Partitioning ek general concept hai (single server ke andar bhi ho sakti hai), sharding specifically data ko multiple separate physical servers ke across distribute karna hai",
      "Sharding sirf NoSQL databases mein hota hai, partitioning sirf SQL mein",
      "Partitioning sirf reads ke liye hota hai, sharding sirf writes ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Partitioning broader concept hai — data ko chhote pieces mein todna, chahe woh ek hi server ke andar ho. Sharding is concept ka specific form hai jahan pieces alag physical servers pe jaate hain. Dono same nahi hain, distinction real hai (A galat). Dono SQL aur NoSQL dono mein applicable hain (C galat). Dono reads aur writes dono ko affect karte hain (D galat).",
    difficulty: "easy",
  },
  {
    id: "shp-2",
    question: "Ek e-commerce system order data ko 'order date' ke range se shard karta hai. Big sale event ke din yeh design kya problem create karega?",
    options: [
       "Koi problem nahi, range-based sharding hamesha safe hai",
      "Us din ka saara naya order-write traffic ek hi 'today' shard pe concentrate ho jaayega, jabki baaki shards idle rahenge — classic hotspot",
      "Range-based sharding automatically load ko sabhi shards mein evenly distribute kar dega",
      "Yeh sirf read queries ko slow karega, writes pe koi asar nahi",
    ],
    correctIndex: 1,
    explanation:
      "Date-based range sharding mein naturally-clustering keys (jaise 'today' ke saare orders) ek hi shard pe concentrate ho jaate hain, jabki purani dates ke shards par bahut kam traffic aata hai — yeh classic hotspot hai. Range-based sharding hotspot-proof nahi hai (A galat) aur even distribution guarantee nahi karta (C galat) — yeh hash-based sharding ka fayda hai, range-based ka nahi. Yeh specifically write traffic ko affect karta hai kyunki naye orders hi is shard ki taraf ja rahe hain (D galat).",
    difficulty: "medium",
  },
  {
    id: "shp-3",
    question: "Ek system `hash(user_id) % 4` se 4 shards mein data distribute karta hai. Team ek 5th shard add karti hai aur scheme ko `hash(user_id) % 5` kar deti hai. Iska practical impact kya hoga?",
    options: [
      "Koi impact nahi, sirf naye users 5th shard pe jaayenge",
      "Almost saara existing data reshuffle karna padega, kyunki zyadatar keys ka naya modulo result purane se different hoga",
      "Sirf 5th shard ka data affect hoga, baaki 4 shards untouched rahenge",
      "Yeh scheme automatically detect kar lega ki kaunsa data move karna hai bina manual intervention ke",
    ],
    correctIndex: 1,
    explanation:
      "Naive `mod N` scheme mein N badalne se lagbhag saare keys ka modulo result change ho jaata hai (N=4 se N=5 jaane par roughly 80% keys ka target shard badal jaata hai), isliye massive data migration lagti hai. Sirf naye users ka mention (A) galat hai — existing data bhi heavily affected hota hai. Sirf ek shard affect hone ka claim (C) galat hai — problem exactly yeh hai ki almost sabhi shards ke keys reshuffle hote hain. Yeh migration automatic nahi hoti, explicit engineering effort chahiye (D galat) — yehi wajah hai consistent hashing ki zaroorat padti hai.",
    difficulty: "hard",
  },
  {
    id: "shp-4",
    question: "Ek Bollywood celebrity ka Instagram-jaisa account normal users se 100x zyada activity generate karta hai. Agar sharding purely `hash(user_id) % N` pe based hai, is scenario mein kya risk hai?",
    options: [
      "Koi risk nahi, hash function hamesha perfectly even load distribution guarantee karta hai chahe access pattern kuch bhi ho",
      "Us celebrity ka saara data aur uske access se related load ek hi shard pe concentrate ho jaata hai, jisse woh shard overloaded ho jaata hai jabki baaki normal load pe rehte hain",
      "Hash-based sharding is scenario ko automatically detect karke celebrity data ko multiple shards mein split kar deta hai",
      "Yeh sirf read traffic ko affect karta hai, celebrity ke writes normal rehte hain",
    ],
    correctIndex: 1,
    explanation:
      "Hash-based sharding sirf 'average case' mein even distribution deta hai — real-world skew (celebrity/viral accounts) is assumption ko todta hai, kyunki ek hi key (us user ka data) ek hi shard pe hai aur uska access volume normal se 100x zyada hai. Hash function load ko predict nahi karta, sirf key ko deterministically map karta hai (A galat). Plain hash-based sharding aisi automatic splitting nahi karta — yeh ek additional engineering solution hai jo alag se implement karna padta hai (C galat). Yeh writes aur reads dono ko affect karta hai — comments, likes, follows sab writes hain (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
