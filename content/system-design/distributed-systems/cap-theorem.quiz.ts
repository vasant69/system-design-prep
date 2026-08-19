import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cap-1",
    question: "'CAP theorem ka matlab hai tum kisi bhi 2 properties (C, A, P) ko free mein pick kar sakte ho' — yeh statement kyun galat hai?",
    options: [
      "Kyunki CAP theorem sirf NoSQL databases pe apply hota hai, SQL pe nahi",
      "Kyunki partition tolerance real-world distributed systems mein effectively mandatory hai — networks partition hoti hi hain — isliye asli choice sirf C vs A hai, wo bhi sirf during a partition",
      "Kyunki Consistency aur Availability actually same cheez hain",
      "Kyunki CAP theorem sirf single-node databases ke liye valid hai",
    ],
    correctIndex: 1,
    explanation:
      "Distributed systems mein multiple nodes network se connected hote hain, aur networks eventually partition hote hain — yeh avoidable nahi hai, isliye 'CA' (partition tolerance skip karna) ek realistic option nahi hai. Asli choice hai C vs A, aur wo bhi specifically jab partition ho raha ho. CAP SQL/NoSQL dono pe apply hota hai jab distributed ho (A galat), C aur A alag properties hain (C galat), aur CAP single-node systems ke liye irrelevant hai kyunki wahan partition ho hi nahi sakta (D galat).",
    difficulty: "medium",
  },
  {
    id: "cap-2",
    question: "Ek banking ledger system partition ke during ek read request pe 'service unavailable' error return karta hai instead of possibly-stale balance dikhane ke. Yeh kaunsa choice hai?",
    options: [
      "AP — availability ko prioritize kar raha hai",
      "CP — consistency ko prioritize kar raha hai, galat balance dikhane se better hai error dena",
      "CA — dono consistency aur availability ek saath de raha hai",
      "Yeh CAP theorem se koi relation nahi rakhta",
    ],
    correctIndex: 1,
    explanation:
      "System yahan error return kar raha hai (unavailable ho raha hai) taaki galat/stale balance na dikhe — yeh classic CP behavior hai, correctness ko availability se zyada priority. AP hota agar system stale balance serve kar deta (A galat). CA distributed system mein partition ke during possible nahi hai (C galat) — yehi CAP theorem ka core point hai (D galat).",
    difficulty: "easy",
  },
  {
    id: "cap-3",
    question: "DynamoDB aur Cassandra dono ko commonly 'AP systems' bola jaata hai. Ek senior-level answer mein is label ke saath kya nuance add karna chahiye?",
    options: [
      "Kuch nahi, AP label hamesha 100% accurate hai in dono systems ke liye har situation mein",
      "Yeh label sirf during-partition behavior describe karta hai, aur consistency level often tunable/configurable hota hai per-query (jaise Cassandra ka QUORUM option) — normal operation mein dono C aur A mil sakte hain",
      "AP label galat hai, yeh dono actually CP systems hain",
      "AP ka matlab hai yeh systems kabhi consistency provide hi nahi karte",
    ],
    correctIndex: 1,
    explanation:
      "CAP label ek system ka permanent fixed identity nahi hai — yeh describe karta hai system partition ke during kya karega, aur real systems (jaise Cassandra) per-query tunable consistency dete hain. Bina partition ke, system dono C aur A de sakta hai. 'Hamesha 100% accurate' (A) oversimplification hai, dono CP nahi hain (C galat), aur woh consistency bilkul provide karte hain, sirf default mein availability prioritize karte hain (D galat).",
    difficulty: "hard",
  },
  {
    id: "cap-4",
    question: "Ek e-commerce app ka product catalog page AP-style (stale price dikha sakta hai) hai, lekin uska checkout/payment flow CP-style hai. Yeh design choice kya dikhata hai?",
    options: [
      "Ki developer ne galti se inconsistent design banaya hai",
      "Ki CAP ek poore system ke liye single fixed label nahi hai — different components/operations apni criticality ke hisaab se alag C vs A trade-off le sakte hain",
      "Ki yeh system CAP theorem follow hi nahi karta",
      "Ki catalog page actually zyada important hai checkout se",
    ],
    correctIndex: 1,
    explanation:
      "Yeh ek intentional, mature design choice hai — catalog browsing mein stale data ka cost low hai (bura UX), lekin checkout mein stale/wrong data ka cost high hai (double order, wrong inventory), isliye alag components alag CAP trade-offs lete hain. Yeh galti nahi hai (A galat), CAP theorem har distributed component pe apply hota hai (C galat), aur importance ka matlab yeh nahi ki correctness matter nahi karti (D galat, checkout correctness-critical hai).",
    difficulty: "medium",
  },
];

export default quiz;
