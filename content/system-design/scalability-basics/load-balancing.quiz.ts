import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lb-1",
    question: "L4 aur L7 load balancer mein sabse fundamental difference kya hai?",
    options: [
      "L4 sirf HTTPS support karta hai, L7 sirf HTTP",
      "L4 IP/port level pe route karta hai bina packet content dekhe, L7 HTTP request ko parse karke URL/header/cookie ke basis pe route kar sakta hai",
      "L7 hamesha L4 se fast hota hai",
      "L4 sirf ek server ke liye kaam karta hai, L7 multiple servers ke liye",
    ],
    correctIndex: 1,
    explanation:
      "L4 sirf transport-layer info (IP, port) dekhta hai aur fast/dumb hota hai; L7 application layer pe HTTP content parse karke smart, content-based routing kar sakta hai lekin extra CPU cost ke saath. HTTPS/HTTP support (A) ka layer se direct relation nahi hai is tarah. L7 actually L4 se slower hota hai parsing ki wajah se (C galat). Dono multi-server pools ke liye hote hain (D galat).",
    difficulty: "easy",
  },
  {
    id: "lb-2",
    question: "Ek system mein requests ka processing time bahut vary karta hai (kuch fast, kuch slow). Round robin use karne mein sabse bada risk kya hai?",
    options: [
      "Round robin technically implement hi nahi ho sakta variable request cost ke saath",
      "Ek server jo slow requests zyada process kar raha hai use bhi round robin blindly equal naye requests deta rahega, jo usse aur overload kar sakta hai",
      "Round robin sirf L7 load balancers pe kaam karta hai",
      "Round robin automatically slow servers ko detect karke skip kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Round robin sirf cyclic order follow karta hai, current load ya request cost consider nahi karta — isliye ek already-overloaded slow server ko bhi naye requests milte rehte hain, jo cascading overload create kar sakta hai. Isi wajah se variable-cost workloads ke liye least-connections better fit hai. Implementation possible hai (A galat), layer-agnostic hai (C galat), aur round robin mein koi automatic load-awareness nahi hai (D galat).",
    difficulty: "medium",
  },
  {
    id: "lb-3",
    question: "Production mein ek bad deploy ke baad bhi load balancer un broken server instances ko traffic bhejta raha. Sabse likely root cause kya hai?",
    options: [
      "Load balancer ne L4 use kiya tha instead of L7",
      "Health check threshold/interval bahut lenient configure kiya gaya tha, ya health-check endpoint khud slow/misleading response de raha tha",
      "Round robin algorithm use ho raha tha",
      "DNS TTL bahut chhota tha",
    ],
    correctIndex: 1,
    explanation:
      "Health checks ka poora purpose hi hai broken instances ko traffic se hataana — agar threshold bahut lenient hai ya health endpoint khud accurate signal nahi de raha, LB broken servers ko healthy samajhta rahega. L4 vs L7 (A) is issue se directly related nahi hai. Algorithm choice (C) health detection se alag concern hai. Chhota DNS TTL (D) actually faster failover mein help karta, problem nahi.",
    difficulty: "hard",
  },
  {
    id: "lb-4",
    question: "Load balancer khud single point of failure na bane, iske liye kaunsa approach valid solution NAHI hai?",
    options: [
      "DNS round robin ke through multiple LB instances register karna",
      "Floating/virtual IP ke saath active-standby LB pair rakhna (keepalived-style)",
      "AWS ELB jaisa cloud-managed, multi-AZ redundant load balancer use karna",
      "Sirf ek powerful LB instance rakhna aur uska CPU/RAM upgrade karte rehna",
    ],
    correctIndex: 3,
    explanation:
      "Ek single LB ko vertically upgrade karte rehna capacity to badha sakta hai lekin redundancy nahi deta — woh instance crash ho to poora traffic path down ho jaata hai, chahe woh kitna bhi powerful ho. DNS round robin, virtual IP failover, aur managed cloud LBs teeno genuinely LB layer ko redundant banate hain, isliye yeh valid solutions hain.",
    difficulty: "medium",
  },
];

export default quiz;
