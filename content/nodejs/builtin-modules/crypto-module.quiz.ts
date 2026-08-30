import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "crypto-module-1",
    question: "User passwords store karne ke liye `crypto.createHash('sha256')` kyun galat choice hai?",
    options: [
      "sha256 output bahut lamba hota hai, DB mein fit nahi hota",
      "sha256 deliberately fast hai — GPU pe billions/sec try ho sakte hain, toh leaked DB jaldi crack ho jaata hai; password hashing slow honi chahiye (scrypt/argon2/bcrypt) with per-user salt",
      "sha256 reversible hai, koi bhi decrypt kar sakta hai",
      "sha256 Node mein deprecated ho chuka hai",
    ],
    correctIndex: 1,
    explanation:
      "Password hashing ka pura point deliberately slow + salted hona hai taaki brute-force economically impossible ho. sha256/md5 fast general-purpose hashes hain — attacker leaked hashes ko GPU pe massively parallel crack kar leta hai. Use scrypt/argon2id/bcrypt, per-user random salt, work factor tuned to ~250ms. Option C galat — sha256 reversible nahi hai; option D galat — sha256 fine for non-password uses.",
    difficulty: "medium",
  },
  {
    id: "crypto-module-2",
    question:
      "Webhook signature verify karte waqt `if (receivedSig === expectedSig)` ke bajaye `crypto.timingSafeEqual` kyun use karte hain?",
    options: [
      "timingSafeEqual zyada fast hai",
      "`===` pehle mismatched byte pe return kar deta hai; response-time difference measure karke attacker signature ko byte-by-byte guess kar sakta hai — timingSafeEqual hamesha constant time leta hai",
      "`===` Buffers pe kaam nahi karta",
      "timingSafeEqual automatically HMAC compute kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "String/Buffer equality short-circuits at the first differing byte, jisse comparison ka time leaked secret ke prefix-match length ko reveal karta hai (timing side-channel). `crypto.timingSafeEqual(a, b)` dono buffers ko poora scan karta hai constant time mein. Dono buffers same length ke hone chahiye. Option C galat — `===` Buffers pe chalta hai (reference compare), bas galat hai for content.",
    difficulty: "medium",
  },
  {
    id: "crypto-module-3",
    question: "AES-256-GCM se encrypt karte waqt IV (initialization vector) ke baare mein kya sahi hai?",
    options: [
      "IV secret rakhna chahiye, isliye use bhi encrypt karo",
      "Har message ke liye fresh random IV generate karo aur use ciphertext ke saath (plaintext) store karo; same key+IV dobara use karna GCM ki security tod deta hai",
      "IV ek fixed constant hona chahiye taaki decrypt easy rahe",
      "IV ki zaroorat sirf CBC mode mein hoti hai, GCM mein nahi",
    ],
    correctIndex: 1,
    explanation:
      "IV/nonce unique-per-encryption hona chahiye (GCM ke liye 12 random bytes), par secret nahi — use ciphertext ke aage store karo (`iv || tag || ciphertext`). Nonce reuse with same key GCM mein catastrophic hai: auth key recover ho sakti hai aur plaintexts XOR-leak hote hain. Option A wrong (IV public), C wrong (fixed IV = reuse), D wrong (GCM ko nonce chahiye).",
    difficulty: "hard",
  },
  {
    id: "crypto-module-4",
    question: "Session token generate karne ke liye kaunsa sahi hai?",
    options: [
      "`Math.random().toString(36).slice(2)`",
      "`Date.now().toString(36)` — unique timestamp",
      "`crypto.randomBytes(32).toString('hex')` — CSPRNG se 256 bits entropy",
      "User ke email ka sha256 hash",
    ],
    correctIndex: 2,
    explanation:
      "Tokens unpredictable hone chahiye. `Math.random()` ek non-crypto PRNG hai — output se aage ke values statistically guess kiye ja sakte hain. `Date.now()` toh poori tarah predictable hai. Email hash deterministic hai (guessable input). `crypto.randomBytes` OS CSPRNG use karta hai; 32 bytes = 64 hex chars = 256 bits, brute-force impossible.",
    difficulty: "easy",
  },
];

export default quiz;
