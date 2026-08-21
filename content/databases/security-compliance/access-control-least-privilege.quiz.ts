import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "acl-1",
    question: "Ek team har service ko ek single, powerful admin-level database credential deti hai 'simplicity ke liye.' Yeh kya risk create karta hai?",
    options: [
      "Database ki performance slow ho jaati hai",
      "Kisi bhi ek service ka compromise hona poore database ka full breach ban sakta hai",
      "Query syntax likhna mushkil ho jaata hai",
      "Backup lena impossible ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Least privilege ka core violation yehi hai — jab har service ke paas full access hota hai, ek chhoti si compromised service (jaise ek internal reporting tool) bhi attacker ko poore database tak access de deti hai. Options A, C, D is core security concern se unrelated hain.",
    difficulty: "easy",
  },
  {
    id: "acl-2",
    question: "Audit log table ko 'INSERT-only' banaya jaata hai, even us service ke liye jo usme legitimately likhti hai. Iska sabse bada fayda kya hai?",
    options: [
      "Isse table ka storage kam hota hai",
      "Agar audit-writing service khud compromise ho jaaye, attacker bhi existing audit rows modify/delete nahi kar sakta, kyunki woh permission database level pe exist hi nahi karti",
      "Isse query performance improve hoti hai",
      "Yeh SQL ka mandatory requirement hai har table ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Yeh access-control-enforced immutability ka core value hai — chahe application code ki niyat kuch bhi ho, agar UPDATE/DELETE permission hi exist nahi karti kisi role ke paas, to ek compromised credential bhi historical rows tamper nahi kar sakta. Options A, C, D is design decision ke actual purpose se unrelated/galat hain.",
    difficulty: "medium",
  },
  {
    id: "acl-3",
    question: "RBAC (Role-Based Access Control) approach mein permissions kaise assign ki jaati hain?",
    options: [
      "Har individual user/service ko directly, alag-alag permissions grant ki jaati hain",
      "Roles define karke (jaise reporting_readonly, ledger_writer), unhe minimum necessary permissions dekar, phir services/humans ko appropriate role assign karke",
      "Sabko ek default 'user' role diya jaata hai jisme sab kuch allowed hota hai",
      "Permissions randomly rotate hoti hain har din",
    ],
    correctIndex: 1,
    explanation:
      "RBAC ka core idea hai centrally-defined roles jinme minimum necessary permissions hon, aur services/humans ko un roles se map karna — isse permission logic ek jagah manage hoti hai aur review/audit karna aasan hota hai. Option A directly RBAC ka opposite hai (ad-hoc per-user grants, jo scale nahi karta). Options C aur D factually galat/absurd hain.",
    difficulty: "medium",
  },
  {
    id: "acl-4",
    question: "RBAC-based access design periodic 'access review/recertification' ko kyun enable karta hai jabki ad-hoc individual permissions is practice ko mushkil banate hain?",
    options: [
      "RBAC roles automatically expire kar deta hai har mahine",
      "Clearly-defined roles ka matlab hai ek centralized jagah se 'kis role ke paas kya access hai' review kiya ja sakta hai, jabki ad-hoc grants scattered aur untraceable ho jaate hain",
      "RBAC mein review karne ki zaroorat hi nahi hoti",
      "Ad-hoc permissions automatically zyada secure hoti hain",
    ],
    correctIndex: 1,
    explanation:
      "RBAC ka structural benefit yeh hai ki roles centrally defined hote hain, isliye ek security/compliance team asaani se dekh sakti hai ki har role ke paas kya access hai aur kya woh abhi bhi justified hai. Ad-hoc, individually-granted permissions ke saath yeh centralized visibility exist hi nahi karti. Options A, C, D factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
