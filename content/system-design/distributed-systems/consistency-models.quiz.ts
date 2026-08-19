import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cm-1",
    question: "Ek user apna WhatsApp status update karta hai aur turant apne hi app mein woh status live dikhta hai, lekin uske friend ko woh 2 second baad dikhta hai. Yeh kaunsa consistency model hai?",
    options: [
      "Strong consistency — kyunki user ko turant update dikha",
      "Eventual consistency — kyunki friend ko der se dikha",
      "Read-your-writes consistency — user apna khud ka write turant dekhta hai, baaki users ke liye delay ho sakta hai",
      "Causal consistency — kyunki do writes ka order preserve ho raha hai",
    ],
    correctIndex: 2,
    explanation:
      "Yeh exactly read-your-writes consistency ka definition hai — user apne khud ke writes ko instantly dekh paata hai, chahe baaki users ko woh write propagate hone mein time lage. Sirf 'strong consistency' (A) galat hai kyunki yeh guarantee sirf writer ke liye hai, sabke liye nahi (jo strong consistency maangti). Sirf 'eventual' (B) bhi incomplete hai kyunki writer ke liye guarantee strong hai. Causal consistency (D) yahan applicable nahi kyunki koi do related writes ka order discuss nahi ho raha.",
    difficulty: "easy",
  },
  {
    id: "cm-2",
    question: "Ek WhatsApp group mein A poochta hai 'kal aa rahe ho?' aur B reply karta hai 'haan'. Causal consistency guarantee karta hai ki har group member ko yeh kaise dikhega?",
    options: [
      "Sab members ko exactly same millisecond pe dono messages dikhenge",
      "Question hamesha reply se pehle dikhega har member ko, kyunki yeh do writes causally related hain — chahe unrelated messages ka order kuch bhi ho",
      "Kisi ko bhi kabhi bhi koi bhi order mein dikh sakta hai, causal consistency koi ordering guarantee nahi deta",
      "Sirf A aur B ko sahi order dikhega, baaki members ko random order milega",
    ],
    correctIndex: 1,
    explanation:
      "Causal consistency specifically guarantee karta hai ki causally related writes (yahan: question phir uska reply) sab clients ko same relative order mein dikhein — question pehle, reply baad mein, hamesha. Unrelated writes (kisi doosre unrelated message) ka order alag ho sakta hai different members ke liye, aur woh acceptable hai. Exact same millisecond ka koi guarantee nahi hai (A galat, yeh linearizability se bhi zyada strict hoga), causal consistency zero ordering guarantee nahi deta — yehi to iska core purpose hai (C galat), aur guarantee sabhi members ke liye hai, sirf A/B ke liye nahi (D galat).",
    difficulty: "medium",
  },
  {
    id: "cm-3",
    question: "Concert ticket booking system mein last seat ke liye do simultaneous booking requests aati hain. Kaunsa consistency model zaroori hai yahan aur kyun?",
    options: [
      "Eventual consistency, kyunki yeh system ko fast rakhta hai",
      "Strong/linearizable consistency, kyunki galat inventory count se do logon ko same seat bech di jaa sakti hai — yeh business-critical correctness issue hai",
      "Causal consistency, kyunki dono requests causally related hain",
      "Read-your-writes, kyunki har user apna khud ka booking dekhna chahta hai",
    ],
    correctIndex: 1,
    explanation:
      "Seat booking jaisa inventory-decrement scenario strong/linearizable consistency maangta hai kyunki agar system stale state pe decide kare, do users ko same seat allot ho sakti hai — yeh ek real business/legal problem hai, sirf UX issue nahi. Eventual consistency (A) yahan risky hai exactly is double-booking risk ki wajah se. Causal consistency (C) inapplicable hai kyunki dono bookings independent, unrelated requests hain, causally connected nahi. Read-your-writes (D) yeh specific correctness problem solve nahi karta — woh sirf apne write dikhne ki guarantee deta hai, doosre concurrent write ke against protection nahi.",
    difficulty: "medium",
  },
  {
    id: "cm-4",
    question: "Ek engineer bolta hai: 'Hum poori application ke liye eventual consistency use karenge kyunki yeh scalable aur fast hoti hai.' Is statement mein kya problem hai?",
    options: [
      "Kuch problem nahi, yeh ek perfectly valid universal approach hai",
      "Eventual consistency actually sabse slow model hai, isliye yeh statement galat hai",
      "Consistency ek per-feature decision honi chahiye, poore system ke liye ek single model choose karna galat hai — payment/inventory jaisi cheezein strong consistency maangti hain even though eventual consistency baaki cheezon ke liye theek ho sakti hai",
      "Eventual consistency ka matlab hai data kabhi consistent hi nahi hota",
    ],
    correctIndex: 2,
    explanation:
      "Yeh classic mistake hai — consistency ko application-wide, one-size-fits-all decision samajhna. Real systems feature-by-feature decide karte hain: payment/inventory ke liye strong consistency zaroori hai (correctness-critical), jabki like counts jaise cheezon ke liye eventual consistency perfectly fine hai. Eventual consistency fast/scalable hoti hai, yeh sahi hai lekin universal application galat hai (A galat oversimplification), eventual consistency dari se slow nahi hoti — woh to sabse fast hoti hai (B galat), aur eventual consistency ka matlab hai 'eventually' converge hoga, kabhi nahi hoga aisa nahi (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
