import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "ch-1",
    question: "Naive `hash(key) % N` partitioning ka sabse bada problem kya hai jab node count change hota hai?",
    options: [
      "Yeh sirf read queries ke liye kaam karta hai, writes ke liye nahi",
      "N badalte hi almost saari keys ka target node change ho jaata hai, isliye massive data migration trigger hoti hai",
      "Yeh sirf single-node databases mein use ho sakta hai",
      "Yeh hash collisions ko completely rok deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Modulo operation N pe directly dependent hai, isliye N change hote hi roughly (N-1)/N keys ka result badal jaata hai — ek chhota scale event bhi massive risky migration bana deta hai. Options A, C, aur D is core problem se unrelated hain.",
    difficulty: "easy",
  },
  {
    id: "ch-2",
    question: "Consistent hashing ring mein ek key kis node ko assign hoti hai?",
    options: [
      "Sabse pehle jo node ring pe register hua tha",
      "Key ke hash position se clockwise chalke jo pehla node milta hai",
      "Sabse kam load wala node, real-time measure karke",
      "Ek random node, load balance karne ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Core rule yahi hai: key ke position se clockwise jaake pehla node jo milta hai, wahi key ka owner hota hai. Registration order (A), real-time load measurement (C), aur randomness (D) is assignment rule ka part nahi hain.",
    difficulty: "easy",
  },
  {
    id: "ch-3",
    question: "4-node ring (N1=10, N2=35, N3=60, N4=85) mein agar N3 crash ho jaaye, to K3 (hash 40) ka kya hota hai, aur baaki keys (K1, K2, K4, K5) ka?",
    options: [
      "Saari 5 keys reshuffle hoti hain, jaise naive mod-N mein hota",
      "Sirf K3 apna node badalta hai (N4 ko chala jaata hai); baaki keys completely unaffected rehti hain",
      "Poora ring invalid ho jaata hai aur sabko manually re-hash karna padta hai",
      "K3 permanently unreachable ho jaati hai jab tak N3 wapas na aaye",
    ],
    correctIndex: 1,
    explanation:
      "Sirf K3, jo N3 ko point kar rahi thi, naya clockwise node (N4) dhoondh leti hai. K1, K2, K4, K5 ka assignment bilkul same rehta hai — yehi consistent hashing ka poora point hai, ki node change sirf local/adjacent keys ko affect kare, global reshuffle na ho jaisa naive mod-N mein hota (A galat).",
    difficulty: "medium",
  },
  {
    id: "ch-4",
    question: "Sirf thode se nodes (jaise 4) ke saath plain consistent hashing use karne pe kya genuine limitation aa sakti hai, aur production systems isko kaise fix karte hain?",
    options: [
      "Koi limitation nahi hai, plain ring hamesha perfectly balanced hota hai",
      "Random hash placement ki wajah se ring coverage uneven ho sakta hai (ek node bahut bada arc own kar sakta hai); fix hai virtual nodes — har physical node ko ring pe 100-200+ points par represent karna",
      "Ring sirf even number of nodes ke saath kaam karta hai; fix hai hamesha even nodes rakhna",
      "Hash function ko har node add hone pe change karna padta hai",
    ],
    correctIndex: 1,
    explanation:
      "Random positions ki wajah se coverage bahut uneven ho sakta hai (jaise Dynamo/EVCache jaisi systems mein discuss hua) — ek node disproportionately zyada keys own kar sakta hai. Virtual nodes (100-200+ per physical node, jaise hash(node_id + '-0'), hash(node_id + '-1')...) is imbalance ko statistically average out karte hain, aur node removal ka load bhi kai neighbors mein spread karte hain. A galat hai kyunki imbalance genuinely hota hai; C aur D fictional constraints hain.",
    difficulty: "hard",
  },
];

export default quiz;
