import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "wisd-1",
    question: "Interviewer ne bola 'design a URL shortener'. Sabse pehla kadam kya hona chahiye?",
    options: [
      "Seedha database schema design karna shuru kar do",
      "Functional aur non-functional requirements clarify karo (scale, read/write ratio, custom alias chahiye ya nahi)",
      "Sabse latest tech stack (Kafka, Kubernetes) discuss karna shuru kar do",
      "Interviewer se poocho ki 'correct' answer kya hai",
    ],
    correctIndex: 1,
    explanation:
      "Requirements clarify kiye bina design shuru karna sabse common red flag hai — interviewer ko lagta hai tumne bina samjhe answer rat liya. Schema seedha design karna (option A) bhi isi galti ka hissa hai. Tech-stack name-drop karna (option C) bina reasoning ke junior signal deta hai. Interviewer se 'correct answer' poochna (option D) shows tumhe khud sochna nahi aata — system design mein koi single correct answer hota hi nahi.",
    difficulty: "easy",
  },
  {
    id: "wisd-2",
    question: "RADIO framework mein 'O' kis cheez ke liye stand karta hai?",
    options: [
      "Operations team ko involve karna",
      "Optimize — bottlenecks aur trade-offs discuss karna, scale badhana",
      "Online availability guarantee karna",
      "Object-oriented design apply karna",
    ],
    correctIndex: 1,
    explanation:
      "O = Optimize, matlab high-level design ke baad bottlenecks identify karna aur unhe address karne ke trade-offs discuss karna. Operations team (A) is unrelated. Online availability (C) ek non-functional requirement hai, poora 'O' step nahi. Object-oriented design (D) coding-level concept hai, system design framework se alag hai.",
    difficulty: "medium",
  },
  {
    id: "wisd-3",
    question: "Ek candidate bolta hai 'hum caching use karenge taaki system fast ho'. Interviewer follow-up mein cache invalidation pooch leta hai aur candidate ka jawab hai 'hum bas TTL laga denge'. Yeh response kya signal deta hai?",
    options: [
      "Strong senior-level depth",
      "Shallow understanding — sirf keyword pata hai, underlying trade-offs (staleness, thundering herd) nahi soche",
      "Perfect answer, kuch aur discuss karne ki zaroorat nahi",
      "Interviewer ka sawaal galat tha",
    ],
    correctIndex: 1,
    explanation:
      "TTL ek valid tool hai, lekin sirf 'TTL laga denge' bolna deeper trade-offs (stale data kitni der tak dikhega, thundering herd jab TTL expire ho aur sab requests DB pe jaayein) ko address nahi karta. Yeh exactly wahi 'depth on follow-up' dimension hai jahan candidates fail hote hain — option A aur C dono galat hain kyunki yeh response depth nahi dikhata.",
    difficulty: "medium",
  },
  {
    id: "wisd-4",
    question: "Senior/Staff level system design interview mein extra kya expect kiya jaata hai jo SDE-1/2 level mein utna zaroori nahi?",
    options: [
      "Sirf zyada components draw karna",
      "Organizational trade-offs — team ownership, migration cost, operational/on-call burden jaise factors",
      "Sabse naya tech stack use karna",
      "Diagram ko zyada colorful banana",
    ],
    correctIndex: 1,
    explanation:
      "Senior/Staff level pe judgment ka scope technical se badhkar organizational ho jaata hai — jaise 'abhi team chhoti hai isliye microservices ka operational overhead justify nahi hota'. Zyada components draw karna (A) ya naya tech use karna (C) depth ka substitute nahi hai — infact yeh often junior signal hota hai. Diagram ki styling (D) is irrelevant to the evaluation.",
    difficulty: "hard",
  },
];

export default quiz;
