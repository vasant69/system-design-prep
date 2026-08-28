import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "jwt-end-to-end-1",
    question: "Ek JWT ke teen dot-separated parts kaunse hain?",
    options: [
      "Username, password, signature",
      "Header, payload, signature",
      "Issuer, audience, expiry",
      "Algorithm, claims, secret",
    ],
    correctIndex: 1,
    explanation:
      "JWT = base64url(header).base64url(payload).base64url(signature). Header me alg/typ, payload me claims (sub, role, exp, iss, aud), signature header+payload ka HMAC hash. Username/password token me nahi jaate. Issuer/audience/expiry payload ke andar claims hain, alag parts nahi. Secret server pe rehta hai, token me nahi.",
    difficulty: "easy",
  },
  {
    id: "jwt-end-to-end-2",
    question: "JWT ke baare me kaunsa statement sahi hai?",
    options: [
      "Payload encrypted hota hai, isliye usme sensitive data safe hai",
      "Payload base64url-encoded hai; koi bhi decode karke claims padh sakta hai, signature sirf tampering rokta hai",
      "Signature payload ko encrypt karti hai",
      "Bina secret ke bhi payload nahi padha ja sakta",
    ],
    correctIndex: 1,
    explanation:
      "JWT signed hai, encrypted nahi. Payload plain base64url hai — jwt.io pe paste karke padha ja sakta hai bina kisi key ke. Signature ka kaam sirf integrity hai: koi claim badle to signature mismatch ho jaayega aur token reject hoga. Isliye password/PAN/salary kabhi token me nahi.",
    difficulty: "medium",
  },
  {
    id: "jwt-end-to-end-3",
    question:
      "TokenValidationParameters me ClockSkew ka default kya hai aur production me use kya karna chahiye?",
    options: [
      "Default 0; production me 5 minute rakho",
      "Default 5 minute; production me 30-60 second tak kam karo",
      "Default 1 hour; production me 1 hour hi theek hai",
      "Default 30 second; production me badha kar 10 minute karo",
    ],
    correctIndex: 1,
    explanation:
      "ClockSkew ka default 5 minute hai — matlab ek expired token 5 minute aur accept hoga. Ye clock drift ke liye buffer hai par 5 minute zyada hai; 30-60 second kaafi. Isse expiry lagbhag exact rehti hai. 0 rakhna edge failures deta hai jab server/client ghadi thoda alag ho.",
    difficulty: "medium",
  },
  {
    id: "jwt-end-to-end-4",
    question:
      "Token issue karte waqt SigningCredentials(key, SecurityAlgorithms.HmacSha256) ka kya role hai?",
    options: [
      "Ye token ko AES se encrypt karta hai",
      "Ye key aur algorithm ka pair hai jisse header+payload ka HMAC signature banta hai aur alg:HS256 header set hota hai",
      "Ye token ki expiry set karta hai",
      "Ye client ko secret key bhej deta hai taaki wo verify kar sake",
    ],
    correctIndex: 1,
    explanation:
      "SigningCredentials symmetric key + algorithm (HS256) ko bundle karta hai; JwtSecurityToken ise use karke signature compute karta hai aur header me alg:HS256 likhta hai. Koi encryption nahi hoti. Expiry alag se expires param se aati hai. Secret kabhi client ko nahi jaata — HS256 symmetric hai, secret sirf server ke paas.",
    difficulty: "hard",
  },
];

export default quiz;
