import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lec-1",
    question: "Ek network partition ke baad, do halves alag alag leaders elect kar lete hain aur dono independently writes accept karne lagte hain. Yeh problem kya kehlaati hai, aur consensus protocol ise kaise prevent karta hai?",
    options: [
      "Deadlock — protocol timeout se prevent karta hai",
      "Split brain — protocol prevent karta hai kyunki leader banne ke liye majority votes chahiye, aur do majorities same term mein simultaneously exist nahi kar sakti (woh overlap karengi)",
      "Race condition — protocol locking se prevent karta hai",
      "Cache invalidation — protocol TTL se prevent karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Yeh classic split-brain problem hai. Consensus protocols (Raft) ise prevent karte hain majority (quorum) requirement se — kyunki N nodes mein se koi bhi do majority groups mathematically kam se kam ek node overlap karengi, ek shared node dono majorities ko same term mein vote nahi de sakta, isliye ek time pe ek hi leader ban sakta hai per term. Deadlock (A), race condition (C), aur cache invalidation (D) yahan applicable concepts nahi hain — yeh sab alag problems hain.",
    difficulty: "medium",
  },
  {
    id: "lec-2",
    question: "Raft mein election timeout ko randomized (jaise 150-300ms range mein) rakha jaata hai, fixed value ke bajaye. Aisa kyun?",
    options: [
      "Randomization security ke liye hai, taaki attacker predict na kar sake",
      "Agar sab followers ka timeout same ho, sab ek saath candidate ban jaate aur votes split ho jaate, election baar-baar fail hoti — randomization ensure karta hai usually ek node pehle candidate banta hai aur cleanly majority le leta hai",
      "Randomization se network bandwidth kam use hota hai",
      "Yeh purely historical convention hai, koi functional reason nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Agar timeout fixed/same hota sab followers ke liye, to leader failure pe sab ek saath candidate ban jaate, votes evenly split ho jaate, aur koi majority na milne se election fail ho jaati — yeh baar-baar repeat ho sakta hai. Randomized timeout ensure karta hai ki typically ek follower thoda pehle candidate banta hai aur baaki abhi follower hi hain, isliye woh cleanly majority vote le leta hai. Security (A) aur bandwidth (C) is design decision ka reason nahi hai, aur yeh ek deliberate, well-reasoned engineering choice hai, sirf convention nahi (D galat).",
    difficulty: "hard",
  },
  {
    id: "lec-3",
    question: "Raft mein ek write kab 'committed' mana jaata hai, aur is rule ka kya benefit hai?",
    options: [
      "Jab leader use apne local log mein likh leta hai — kyunki leader hi authority hai",
      "Jab majority nodes (leader including) ne write ko apne log mein replicate kar liya ho — isse guarantee milta hai ki agar leader turant crash ho bhi jaaye, naya elected leader (jo majority ka hissa hoga) us write ko already apne log mein rakhta hai",
      "Jab saare nodes (100%) ne write ko replicate kar liya ho, warna commit nahi hota",
      "Jaise hi client ne write bheja, turant committed maana jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Raft mein write sirf tab committed maana jaata hai jab majority nodes ne use apne log mein likh liya ho — yeh crucial hai kyunki agar leader turant fail ho jaaye, jo bhi naya leader banega woh necessarily us majority ka hissa hoga (majority overlap property), isliye woh committed write already apne paas rakhta hoga, koi data loss nahi hota. Sirf leader ke local log (A) mein likhna insufficient hai, crash ho to woh write lose ho sakta hai. 100% nodes (C) ka wait karna availability bahut kam kar deta — ek slow/down node poora system block kar dega. Turant client-side committed maan lena (D) galat hai, koi durability guarantee nahi degi.",
    difficulty: "medium",
  },
  {
    id: "lec-4",
    question: "Paxos aur Raft dono consensus protocols hain jo similar guarantees dete hain. Raft ko Paxos ke baad specifically kis goal ke saath design kiya gaya tha?",
    options: [
      "Raft ko faster banane ke liye, Paxos se better performance ke liye",
      "Raft ko zyada 'understandable' (samajhne mein aasan) banane ke liye — explicit roles (follower/candidate/leader) aur terms ke saath, jabki same safety/liveness guarantees maintain karte hue",
      "Raft ko sirf single-node systems ke liye banaya gaya tha",
      "Raft ko Paxos ko completely replace karne ke liye kyunki Paxos incorrect tha",
    ],
    correctIndex: 1,
    explanation:
      "Raft ke authors (Ongaro aur Ousterhout) ne explicitly 'understandability' ko primary design goal banaya — Paxos mathematically correct tha lekin notoriously samajhna/implement karna hard tha. Raft ne wahi guarantees explicit states (follower/candidate/leader) aur terms ke through zyada intuitive banaya. Performance improvement (A) primary goal nahi tha. Raft distributed multi-node systems ke liye hi hai, single-node ke liye nahi (C galat). Paxos incorrect nahi tha — woh mathematically sound tha, sirf hard-to-understand tha (D galat).",
    difficulty: "easy",
  },
];

export default quiz;
