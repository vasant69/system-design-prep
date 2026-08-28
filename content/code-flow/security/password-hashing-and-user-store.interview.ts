import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pwd-store-1",
    question: "Tum ek Web API me passwords kaise store karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Kabhi plaintext ya reversible nahi. Ek slow, per-user salted one-way hash — PBKDF2 via `PasswordHasher<User>`, ya BCrypt, ya Argon2. Sirf digest DB me jaata hai.",
    detailedAnswer:
      "`User` row pe sirf `PasswordHash` column hota hai, plaintext ke liye kuch nahi. Register pe `HashPassword` chalata hoon jo per-user random salt + hazaaron iterations ke saath ek self-describing digest string banata hai (algorithm marker + iterations + salt + hash). Login pe `VerifyHashedPassword` wahi salt aur iterations se dobara hash karke constant-time compare karta hai. Digest se original password wapas nahi nikaala ja sakta, isliye DB leak hone pe bhi passwords directly expose nahi hote. .NET me built-in `PasswordHasher<User>` PBKDF2-HMAC-SHA256 use karta hai aur salt digest ke andar embed karta hai — alag `Salt` column ki zaroorat nahi.",
    followUp: "Salt digest ke andar hota hai to alag salt column kyun nahi chahiye?",
    redFlag:
      "Ye kehna ki `SHA-256` ya `MD5` kaafi hai, ya ki password ko decrypt kar paana ek feature hai.",
  },
  {
    id: "pwd-store-2",
    question:
      "SHA-256 ek cryptographic hash hai. Phir use password ke liye kyun nahi use karte?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "SHA-256 deliberately fast hai — ek modern GPU crore hashes/second nikaalta hai. Password hash ko jaan-boojh kar slow (high work factor) aur salted hona chahiye.",
    detailedAnswer:
      "SHA-256 integrity aur signatures ke liye banaya gaya hai, jahan speed achhi baat hai. Password cracking me wahi speed attacker ki dost ban jaati hai: ek leaked table ke against poori wordlist minuto me chal jaati hai, khaaskar bina salt ke jab same password ka same hash hota hai. PBKDF2 / BCrypt / Argon2 andar SHA jaisi primitive ko laakhon baar (ya memory-hard tareeke se) chalate hain taaki ek single verify 50-250 ms le — legit login ke liye kuch nahi, brute-force ke liye deewar. Plus har user ka apna random salt.",
    followUp: "Argon2 ko 'memory-hard' kehte hain — iska matlab kya hai aur kyun matter karta hai?",
    redFlag:
      "Ye kehna ki bas SHA-256 ko do-teen baar chala do to kaafi ho jaata hai.",
  },
  {
    id: "pwd-store-3",
    question:
      "Iteration count / work factor kaise chunte ho? Zyada hamesha behtar hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Work factor security aur availability ke beech trade-off hai — target ye hai ki ek verify server pe ~50-250 ms le, current OWASP guidance ke aas-paas.",
    detailedAnswer:
      "OWASP 2024 guidance: PBKDF2-HMAC-SHA256 ke liye ~600,000 iterations, BCrypt cost 10-12, Argon2id ~19 MiB memory. Apne production hardware pe measure karo aur aisa value chuno jo ~100-200 ms de. Bahut high rakhne se har login ek CPU core khaa jaata hai aur thode concurrent logins server ko choke kar dete hain — effectively self-inflicted DoS. Isliye brute-force defence ko sirf iteration count pe mat chhodo; per-IP rate limiting aur account lockout alag layer hain. Work factor time ke saath badhao aur `SuccessRehashNeeded` se purane digests login pe upgrade karo.",
    followUp: "Agar tum iteration count badha do to purane users ke digests ka kya hoga?",
    redFlag:
      "Ye kehna ki jitna zyada iteration utna achha, availability ka koi zikr nahi.",
  },
  {
    id: "pwd-store-4",
    question:
      "Login endpoint me kaunse error message aur status code loge, aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ek hi generic message — `Invalid username or password` — aur ek hi status (401) dono cases (username galat / password galat) ke liye. User-not-found pe bhi ek dummy verify chalao.",
    detailedAnswer:
      "Agar tum alag messages do — user not found vs wrong password — to attacker valid usernames enumerate kar leta hai. Isliye dono ka same message, same code. Isi wajah se user-not-found path pe bhi ek dummy `VerifyHashedPassword` chalao taaki response time password-galat case jaisa rahe, warna timing se hi enumeration ho jaati hai. Account lockout (5 fails -> 15 min) ya rate limit brute-force ko dheema karta hai. Sensitive systems me kabhi-kabhi locked account ke liye bhi generic 401 dete hain taaki lockout state leak na ho.",
    followUp: "Account lockout ka ek downside kya hai aur usse kaise handle karoge?",
    redFlag:
      "`User does not exist` aur `Wrong password` alag-alag lautana.",
  },
  {
    id: "pwd-store-5",
    question:
      "Ye code dekho. Isme security problem kya hai?\n```csharp\nvar user = await _db.Users.SingleAsync(u => u.Username == req.Username);\nif (user.PasswordHash == Sha256(req.Password))\n    return Ok(_tokenService.CreateToken(user));\nreturn Unauthorized();\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Teen problem: fast unsalted `Sha256`, `==` se non-constant-time compare, aur `SingleAsync` user-not-found pe exception phenk kar alag behaviour deta hai (enumeration + 500).",
    detailedAnswer:
      "1) `Sha256` fast aur (yahan) unsalted hai — leaked table trivially crack hoti hai; `PasswordHasher.VerifyHashedPassword` ya BCrypt chahiye. 2) `==` string comparison pehle mismatched char pe return kar deta hai, jisse timing side-channel banta hai; libraries ka fixed-time compare use karo. 3) `SingleAsync` jab username nahi milta to exception -> 500, aur milne vs na-milne me alag response/timing -> username enumeration. Fix: `SingleOrDefaultAsync`, null pe dummy verify + generic 401, aur `VerifyHashedPassword` ka enum handle karo (`Failed` / `Success` / `SuccessRehashNeeded`).",
    followUp: "`SuccessRehashNeeded` case aaye to tum kya karoge?",
    redFlag:
      "Sirf 'hash use kar raha hai' dekh kar code ko theek batana.",
  },
  {
    id: "pwd-store-6",
    question:
      "Hashing aur encryption me password ke context me kya farak hai? Password verification ke liye kaunsa?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Hashing one-way hai — verify kar sakte ho, wapas nahi nikaal sakte. Encryption reversible hai. Password verification ke liye hamesha hashing.",
    detailedAnswer:
      "Encryption me ek key hoti hai jo ciphertext ko wapas plaintext bana deti hai — matlab jise wo key mili, use har password mil gaya, aur wo key aksar usi server pe hoti hai. Hashing me koi master key hai hi nahi; server sirf itna kar sakta hai ki naya hash bana kar purane se compare kar le. Reversible storage sirf tab justified hai jab tumhe original value sach me wapas chahiye — jaise kisi third-party API ka credential jo tumhe unhe bhejna hai — aur wo alag problem hai (secret storage / vault), password verification nahi.",
    followUp: "'Password yaad dila do' feature kyun impossible hai aur uski jagah kya hota hai?",
  },
  {
    id: "pwd-store-7",
    question:
      "ASP.NET Core Identity aur ek manual `Users` table plus `PasswordHasher` — kab kaunsa?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Identity tab jab tumhe poora package chahiye — lockout, email confirmation, 2FA, external logins, password reset tokens. Manual store tab jab sirf ek user table + JWT chahiye.",
    detailedAnswer:
      "Identity `UserManager` / `SignInManager`, stores, aur ye saare flows ready deta hai — reinvent karne ki zaroorat nahi jab requirement rich ho. Lekin wo schema, DI, aur conventions ka ek bada surface bhi laata hai. Agar hamare jaisa case ho — ek `Users` table, ek role claim, JWT issue — to manual store lighter, samajhne me saaf, aur test karna aasan hai, aur phir bhi `IPasswordHasher<User>` reuse karke hashing sahi rehti hai. Beech ka raasta: manual store + selective Identity pieces (jaise sirf `PasswordHasher` aur `PasswordValidator`).",
    followUp: "Manual store me tum lockout aur password policy khud kaise add karoge?",
    redFlag:
      "Ye kehna ki Identity ke bina passwords securely store karna possible hi nahi.",
  },
  {
    id: "pwd-store-8",
    question:
      "Ek legacy system ke users import karne hain jinke passwords MD5 me stored hain. Kaise migrate karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "MD5 digests ko as-is naye system me daalo ek marker ke saath, phir har successful login pe us password ko strong algorithm se rehash karke replace karo (rehash-on-login).",
    detailedAnswer:
      "Tum original passwords jaante nahi, isliye seedha PBKDF2 me convert nahi kar sakte. Do common raaste: (1) Rehash-on-login — stored digest ka format detect karo; agar legacy MD5 hai to pehle MD5 se verify karo, pass hone par turant `PasswordHasher` se rehash karke `PasswordHash` update karo. Kuch mahino me active users migrate ho jaate hain. (2) Wrapping — legacy hash ko strong function ke andar wrap karke store karo (`bcrypt(md5(pw))`) taaki turant sabhi digests strong ho jaayein, phir bhi login pe verify path do-step ho. Inactive users ke liye ek cutoff date ke baad forced reset. Poore process me MD5 ko kabhi naya password hashing algorithm mat banao.",
    followUp: "Rehash-on-login me jo users kabhi login nahi karte unka kya karoge?",
  },
];

export default questions;
