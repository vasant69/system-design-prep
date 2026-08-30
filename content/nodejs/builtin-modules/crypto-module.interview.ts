import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "crypto-1",
    question:
      "User passwords kaise store karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Kabhi plain hash nahi — `sha256` GPU pe billions/sec hai. `bcrypt` ya `argon2id` (ya built-in `scrypt`), per-user random salt ke saath, work factor itna tuned ki ek hash ~200-300ms le. Verify ke waqt `crypto.timingSafeEqual` se compare, `===` se nahi. Async variant taaki libuv thread pool par chale, login endpoint block na ho. Encrypt bilkul nahi — password kabhi wapas nahi chahiye.",
    detailedAnswer:
      "Password hashing ka pura point deliberately slow + salted hona hai taaki brute-force economically impossible ho. `sha256`/`md5` fast general-purpose hashes hain — ek leaked DB GPU pe dino mein crack ho jaata hai.\n\n```javascript\nconst crypto = require('node:crypto');\n\nfunction hashPassword(pw) {\n  return new Promise((resolve, reject) => {\n    const salt = crypto.randomBytes(16);\n    crypto.scrypt(pw, salt, 64, (err, key) => {\n      if (err) return reject(err);\n      resolve(`${salt.toString('hex')}:${key.toString('hex')}`);\n    });\n  });\n}\n\nfunction verifyPassword(pw, stored) {\n  return new Promise((resolve, reject) => {\n    const [saltHex, keyHex] = stored.split(':');\n    const keyBuf = Buffer.from(keyHex, 'hex');\n    crypto.scrypt(pw, Buffer.from(saltHex, 'hex'), 64, (err, key) => {\n      if (err) return reject(err);\n      resolve(crypto.timingSafeEqual(keyBuf, key));\n    });\n  });\n}\n```\n\nPer-user unique random salt taaki rainbow tables aur 'same password -> same hash' na ho. Production mein aksar `argon2` (aaj ka recommended) library use karte hain — tuned defaults, memory-hard. Passwords encrypt karna galat hai: reversible = key leak = saare passwords plaintext, aur password kabhi decrypt karne ki zaroorat hi nahi — sirf compare; 'forgot password' reset flow se solve hota hai.",
    followUp: "Async `crypto.scrypt` libuv thread pool (default 4) use karta hai — login bursts mein iska kya asar, aur kaise tune karoge?",
    redFlag: "\"Main passwords ko sha256 kar deta hoon\" ya \"passwords encrypt kar deta hoon taaki zaroorat par decrypt kar sakein\".",
  },
  {
    id: "crypto-2",
    question:
      "Ek incoming webhook (Stripe/GitHub) genuine hai aur transit mein tamper nahi hua — ye kaise verify karoge? Plain `sha256` yahan kyun kaafi nahi?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Provider request body ko apni shared secret se HMAC-SHA256 karke ek header (`Stripe-Signature`, `X-Hub-Signature-256`) mein signature bhejta hai. Receiver **raw body** (parsed JSON nahi — byte-for-byte) par same HMAC apni copy of the secret se compute karta hai, aur `crypto.timingSafeEqual` se compare. Plain `sha256` kaafi nahi kyunki attacker body aur uska hash dono replace kar sakta hai — HMAC ka secret hi wo cheez hai jo attacker ke paas nahi.",
    detailedAnswer:
      "```javascript\nconst crypto = require('node:crypto');\n\nfunction verifyWebhook(rawBody, receivedSig, secret) {\n  const expected = crypto\n    .createHmac('sha256', secret)\n    .update(rawBody)\n    .digest('hex');\n  const a = Buffer.from(expected, 'hex');\n  const b = Buffer.from(receivedSig, 'hex');\n  return a.length === b.length && crypto.timingSafeEqual(a, b);\n}\n```\n\nKey points: (1) **raw body** — express ke `express.json()` ke baad `req.body` re-serialized JSON hai, byte-for-byte match nahi karega; `express.raw()` ya ek verify callback se raw buffer capture karo. (2) `timingSafeEqual` — `===` pehle mismatched byte pe return karta hai, jisse attacker response time se signature byte-by-byte guess kar sakta hai. (3) Length check pehle — `timingSafeEqual` unequal-length buffers par throw karta hai. (4) Replay protection ke liye timestamp bhi verify karo (Stripe `t=` in the header) — signature valid hone se replay nahi rukta.",
    followUp: "Agar `timingSafeEqual` ki jagah `crypto.timingSafeEqual` available hi na ho (bahut purana Node), to constant-time compare kaise karoge?",
    redFlag: "`if (receivedSig === expectedSig)` se signature compare karna, ya parsed+re-serialized body par HMAC compute karna.",
  },
  {
    id: "crypto-3",
    question:
      "Hash, HMAC, encryption, aur password hashing — char alag tools hain. Har ek kis problem ke liye hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Hash (`createHash('sha256')`): one-way fingerprint — dedup, ETag, non-adversarial integrity. HMAC (`createHmac` + secret): keyed hash — 'sahi sender + tamper nahi hua' prove karta hai (attacker present). Encryption (AES-256-GCM): reversible with key — secrets ko store karo, baad mein wapas plaintext. Password hashing (`scrypt`/`argon2`/`bcrypt`): deliberately slow + salted — user passwords.",
    detailedAnswer:
      "| Tool | Reversible? | Key? | Kis liye |\n|---|---|---|---|\n| Hash | Nahi | Nahi | File/content fingerprint, dedup, ETag, integrity (non-adversarial) |\n| HMAC | Nahi | Haan (shared secret) | Webhook signature verify, API request signing, tamper-proof tokens |\n| Encryption (AES-GCM) | Haan (key) | Haan | PII/secrets at rest, jise baad mein wapas padhna hai |\n| Password hash (scrypt) | Nahi | Nahi (par salt) | User passwords |\n\nGaltiyan: (1) Password ko `sha256` — bahut fast, GPU brute-force. (2) Password ko encrypt — reversible, key leak = total compromise, aur decrypt ki zaroorat hi nahi. (3) Integrity ke liye plain hash jab attacker involved — wo content aur hash dono badal deta hai; HMAC chahiye. Interviewer ye check karta hai ki tum tool ko problem ke shape se match karte ho aur 'don't roll your own crypto' samajhte ho.",
    followUp: "AES ke liye GCM mode kyun, CBC ya ECB kyun nahi?",
  },
  {
    id: "crypto-4",
    question:
      "AES-256-GCM se ek PII field encrypt/decrypt karne ka safe approach batao. IV aur auth tag ke bare mein kya dhyan rakhoge?",
    type: "coding",
    difficulty: "advanced",
    shortAnswer:
      "Har encryption par **fresh random IV** (`crypto.randomBytes(12)` for GCM) — same key + same IV dobara catastrophic hai. IV secret nahi — ciphertext ke saath store karo (`iv || authTag || ciphertext`). GCM ka **auth tag** integrity proof hai — decrypt se pehle `setAuthTag`; tamper hua ho to `final()` throw karega. Key 32 bytes, KMS/secret-manager se, code mein nahi.",
    detailedAnswer:
      "```javascript\nconst crypto = require('node:crypto');\nconst ALGO = 'aes-256-gcm';\n\nfunction encrypt(plaintext, key /* 32 bytes */) {\n  const iv = crypto.randomBytes(12);\n  const cipher = crypto.createCipheriv(ALGO, key, iv);\n  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);\n  const tag = cipher.getAuthTag();\n  return Buffer.concat([iv, tag, enc]).toString('base64');\n}\n\nfunction decrypt(payloadB64, key) {\n  const data = Buffer.from(payloadB64, 'base64');\n  const iv = data.subarray(0, 12);\n  const tag = data.subarray(12, 28);\n  const enc = data.subarray(28);\n  const decipher = crypto.createDecipheriv(ALGO, key, iv);\n  decipher.setAuthTag(tag);\n  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');\n}\n```\n\nDhyan: (1) IV reuse with same key = GCM ki security poori tarah tootti hai (auth key recover ho sakti hai, plaintexts XOR-leak) — fresh `randomBytes(12)` har baar. (2) IV public hai, ciphertext ke aage store karo. (3) `setAuthTag` decrypt se pehle; agar row DB mein tamper hui ho to `final()` exception dega — silently galat plaintext nahi milega, us record ko corrupt flag karo. (4) Key management: AWS KMS envelope encryption — per-record data key jo memory mein use hoke discard ho, master key kabhi app process mein na aaye.",
    followUp: "Ek key rotation event ke baad puraane ciphertexts ko kaise handle karoge?",
    redFlag: "Hardcoded ya reused IV, key code/repo mein, ya GCM ke bajaye CBC/ECB (no built-in integrity).",
  },
  {
    id: "crypto-5",
    question:
      "Session token / password-reset token / OTP generate karne ke liye kya use karoge, aur `Math.random()` kyun nahi?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`crypto.randomBytes(32).toString('hex')` (64-char, 256-bit token), `crypto.randomUUID()` (request/correlation IDs), `crypto.randomInt(0, 1_000_000)` (unbiased OTP). `Math.random()` ek non-crypto PRNG hai — output se aage ke values statistically predict kiye ja sakte hain, to attacker ek token dekh ke doosre guess kar sakta hai.",
    detailedAnswer:
      "`Math.random()` fast hai lekin cryptographically predictable — kuch outputs se internal state reconstruct ho sakta hai. Security-relevant randomness (tokens, OTP, keys, salts, nonces) ke liye hamesha `crypto`:\n\n```javascript\nconst crypto = require('node:crypto');\nconst sessionToken = crypto.randomBytes(32).toString('hex'); // 256 bits\nconst requestId = crypto.randomUUID();\nconst otp = crypto.randomInt(0, 1_000_000); // 0..999999, bias-free\n```\n\n`crypto.randomInt` isliye better hai `Math.floor(Math.random() * 1e6)` se: dono predictability aur modulo bias avoid karta hai. `Date.now()` to poori tarah predictable hai — kabhi token nahi. Email/id ka hash bhi galat — deterministic, guessable input. `randomBytes(32)` = 64 hex chars = 256 bits entropy, brute-force impossible.",
    followUp: "Ek token ko DB mein store karne se pehle usko hash (`sha256`) karna kyun acha idea ho sakta hai?",
    redFlag: "\"`Math.random().toString(36)` se token bana leta hoon\" ya \"`Date.now()` unique hai to token ke liye theek hai\".",
  },
];

export default questions;
