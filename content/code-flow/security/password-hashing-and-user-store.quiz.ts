import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "password-hashing-and-user-store-1",
    question:
      "Password ko database me store karne ka sahi tareeka kaunsa hai?",
    options: [
      "AES se encrypt karke, taaki zaroorat pe decrypt kiya ja sake",
      "Plain SHA-256 hash, salt ke bina",
      "Ek slow, per-user salted one-way hash jaise PBKDF2, BCrypt ya Argon2",
      "Base64 encode karke",
    ],
    correctIndex: 2,
    explanation:
      "Password verification ke liye one-way, deliberately slow, per-user salted hash chahiye. AES reversible hai — ek key sab kuch kholti hai aur wo key aksar compromised server pe hi hoti hai. Plain SHA-256 fast hai (GPU pe crore/second) aur bina salt ke rainbow tables kaam kar jaati hain. Base64 to encoding hai, security nahi.",
    difficulty: "easy",
  },
  {
    id: "password-hashing-and-user-store-2",
    question:
      "Per-user random salt lagane ka main faida kya hai?",
    options: [
      "Hash compute karna tez ho jaata hai",
      "Do users jinke passwords same hain unke digest alag aate hain, aur precomputed rainbow tables bekaar ho jaati hain",
      "Salt se password reversible ban jaata hai",
      "Salt se iteration count apne aap badhta hai",
    ],
    correctIndex: 1,
    explanation:
      "Salt har digest ko unique banata hai chahe do users ka password same ho, jisse ek precomputed table poori table pe reuse nahi ho sakti aur har guess har user ke liye alag se karna padta hai. Salt hash ko slow nahi karta (wo work factor ka kaam hai), reversible nahi banata, aur iteration count se uska koi rishta nahi.",
    difficulty: "easy",
  },
  {
    id: "password-hashing-and-user-store-3",
    question:
      "`PasswordHasher<User>.VerifyHashedPassword(...)` ka return `SuccessRehashNeeded` ho to sahi kadam kya hai?",
    options: [
      "Login reject kar do, digest corrupt hai",
      "User ko password reset email bhejo",
      "Login allow karo, aur provided password ko current parameters se dobara hash karke row update kar do",
      "Kuch mat karo, agli baar apne aap theek ho jaayega",
    ],
    correctIndex: 2,
    explanation:
      "`SuccessRehashNeeded` matlab password sahi tha par stored digest purane, kamzor work factor pe bana hai. Login pass hone do, phir turant naye default se rehash karke `PasswordHash` save karo — user ko pata bhi nahi chalta aur security parameters transparently upgrade ho jaate hain. Reject karna galat (password sahi tha); reset email zaroori nahi; khud kabhi theek nahi hoga jab tak tum rehash na karo.",
    difficulty: "medium",
  },
  {
    id: "password-hashing-and-user-store-4",
    question:
      "Login me jab username database me milta hi nahi, to code ek dummy `VerifyHashedPassword` kyun chalata hai phir bhi?",
    options: [
      "Taaki ek naya user apne aap ban jaaye",
      "Taaki 'user not found' aur 'wrong password' dono cases ka response time lagbhag same rahe aur timing se username enumeration na ho",
      "Kyunki bina verify chalaaye 401 return nahi ho sakta",
      "Performance improve karne ke liye",
    ],
    correctIndex: 1,
    explanation:
      "User-not-found case me agar hum turant return kar dein, wo response tezi se aayega, jabki user-exists case me poora slow hash chalta hai. Attacker is time difference se valid usernames guess kar leta hai. Ek dummy verify chala kar dono paths ko lagbhag same latency dena isko rokta hai. Ye naya user nahi banata, 401 ke liye technically zaroori nahi, aur performance ulta thoda kam karta hai — trade-off jaan-boojh ke.",
    difficulty: "hard",
  },
];

export default quiz;
