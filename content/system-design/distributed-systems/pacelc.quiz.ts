import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "pacelc-1",
    question: "PACELC theorem CAP theorem se aage kaunsa gap fill karta hai?",
    options: [
      "Yeh batata hai ki partition ke during kya karna chahiye, jo CAP nahi batata",
      "Yeh batata hai ki normal, non-partitioned operation mein bhi system latency vs consistency ka trade-off continuously leta hai — jo CAP address hi nahi karta",
      "Yeh CAP ko completely replace kar deta hai, CAP ab irrelevant hai",
      "Yeh sirf SQL databases ke liye applicable hai, CAP sirf NoSQL ke liye",
    ],
    correctIndex: 1,
    explanation:
      "CAP sirf partition scenario cover karta hai (jo rare hai). PACELC extend karta hai yeh bolke ki even jab koi partition nahi hai (Else case), system ko latency vs consistency choose karna padta hai — jaise quorum ack wait karna ya nahi. CAP already partition wala case batata hai (A galat), PACELC CAP ko replace nahi karta balki extend karta hai (C galat), aur dono theorems kisi bhi distributed database pe apply hote hain, SQL/NoSQL specific nahi (D galat).",
    difficulty: "easy",
  },
  {
    id: "pacelc-2",
    question: "'P' aur 'E' cases mein PACELC ka 'C' (consistency) ka role kya hai?",
    options: [
      "Dono cases mein consistency ka matlab bilkul alag hota hai, unrelated concepts hain",
      "Consistency dono cases mein ek common option hai jise choose kiya ja sakta hai — partition ke time Availability ke against, aur normal time mein Latency ke against",
      "Consistency sirf 'E' (Else) case mein relevant hai, 'P' case mein irrelevant hai",
      "Consistency ek fixed guarantee hai jo har system automatically deta hai, choice nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "PACELC formula mein Consistency dono halves mein ek trade-off partner ke roop mein appear hoti hai — partition ke time yeh Availability ke against choose hoti hai (CAP wala part), aur normal time mein Latency ke against (naya 'Else' part). Yeh same underlying idea hai dono jagah — 'latest data guarantee' — bas dusra trade-off partner alag hai (A sahi hai, isliye baaki options galat). Consistency 'P' case mein bhi utni hi relevant hai (C galat), aur yeh ek explicit design choice hai, automatic guarantee nahi (D galat).",
    difficulty: "medium",
  },
  {
    id: "pacelc-3",
    question: "Ek coordinator write ko turant client ko 'success' bol deta hai apna local write karke, aur baaki replicas ko background mein async replicate karta hai. PACELC ke 'Else' axis pe yeh kaunsa choice hai?",
    options: [
      "Consistency prioritize kar raha hai, latency sacrifice kar raha hai",
      "Latency prioritize kar raha hai, consistency sacrifice kar raha hai — kyunki turant koi doosre replica se read kare to stale data mil sakta hai",
      "Yeh dono C aur L simultaneously de raha hai, koi trade-off nahi hai",
      "Yeh PACELC se related hi nahi hai kyunki koi partition nahi ho raha",
    ],
    correctIndex: 1,
    explanation:
      "Turant 'success' bolna (bina baaki replicas ke ack ka wait kiye) low latency deta hai, lekin agar koi doosra replica se turant read kare, use purana data mil sakta hai kyunki write abhi propagate nahi hua — yeh classic Latency-over-Consistency choice hai 'Else' (no partition) scenario mein. Yeh trade-off hai, dono simultaneously nahi milte (A aur C dono galat), aur yeh exactly PACELC ka 'E' half hai jo bina partition ke bhi apply hota hai (D galat — yehi to PACELC ka pura point hai).",
    difficulty: "hard",
  },
  {
    id: "pacelc-4",
    question: "DynamoDB ko PACELC notation mein PA/EL classify kiya jaata hai. Iska matlab kya hai?",
    options: [
      "Partition ke time bhi aur normal time mein bhi hamesha consistency prioritize karta hai",
      "Partition ke time Availability prioritize karta hai, aur normal (no-partition) time mein Latency prioritize karta hai — dono cases mein consistency ko default mein trade kiya jaata hai",
      "PA/EL ka matlab hai DynamoDB kabhi consistency provide hi nahi kar sakta",
      "PA/EL sirf ek marketing term hai, koi technical meaning nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "PA/EL padhne ka tareeka: partition ke time 'A' (Availability) prioritize hota hai, aur 'Else' (no partition) mein 'L' (Latency) prioritize hota hai — dono cases mein default behavior consistency ko trade karta hai speed/uptime ke liye. Yeh consistency-first nahi hai (A galat), DynamoDB explicit strongly-consistent reads offer karta hai jab maanga jaaye (C galat), aur yeh ek real technical classification hai jo system ke actual default behavior ko describe karta hai (D galat).",
    difficulty: "medium",
  },
];

export default quiz;
