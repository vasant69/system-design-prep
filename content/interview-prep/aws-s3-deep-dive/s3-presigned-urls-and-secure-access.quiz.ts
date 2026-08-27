import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3-presigned-1",
    question: "Presigned URL me embedded signature ka purpose kya hai?",
    options: [
      "Ye ek specific operation, object key, aur expiry ko cryptographically encode karta hai taaki S3 request-time pe koi separate IAM check kiye bina hi authorize kar sake",
      "Ye object ko server-side encrypt karta hai taaki data at rest secure rahe",
      "Ye request ko CloudFront ke edge cache se serve karwata hai",
      "Ye ensure karta hai ki sirf bucket owner hi URL use kar sake",
    ],
    correctIndex: 0,
    explanation: "Sahi hai — signature (SigV4) operation, key, aur expiry encode karta hai, S3 sirf signature verify karta hai. Option B galat hai kyunki encryption at rest ek alag concept hai (SSE). Option C galat hai kyunki presigned URL CloudFront se related nahi. Option D galat hai kyunki koi bhi jisko URL mile wo use kar sakta hai, sirf bucket owner nahi.",
    difficulty: "easy",
  },
  {
    id: "s3-presigned-2",
    question: "Ek Lambda apni execution role (temporary STS credentials) se presigned URL generate karta hai with ExpiresIn=604800 (7 din). URL actually kab tak valid rahega?",
    options: [
      "Poore 7 din, kyunki ExpiresIn wahi value hai jo honi chahiye",
      "Underlying role session ke apne expiry tak hi — jo typically 1 ghanta ya kam hota hai, ExpiresIn value se chhota",
      "Kabhi expire nahi hoga kyunki Lambda role hamesha valid rehta hai",
      "Sirf 24 ghante, kyunki ye Lambda ke liye hardcoded maximum hai",
    ],
    correctIndex: 1,
    explanation: "Sahi hai — temporary/STS credentials se signed URL ki real validity underlying session credential ke expiry tak hi cut ho jaati hai, chahe ExpiresIn kitna bhi lamba likha ho. Option A galat hai kyunki ye sirf long-lived IAM user credentials ke liye sach hai. Option C aur D galat hain kyunki wo hardcoded numbers nahi, actual role session expiry pe depend karta hai.",
    difficulty: "hard",
  },
  {
    id: "s3-presigned-3",
    question: "Client-to-S3 direct upload pattern (presigned PUT) use karne ka sabse bada architectural fayda kya hai?",
    options: [
      "File bytes backend server ke through route nahi hote, isliye backend memory/bandwidth file transfer se free rehta hai aur sirf orchestration karta hai",
      "S3 automatically file ko compress kar deta hai",
      "Presigned URL apne aap file ka virus scan kar leta hai",
      "Ye backend ko IAM permissions se completely bypass kar deta hai",
    ],
    correctIndex: 0,
    explanation: "Sahi hai — backend sirf authorize karta hai aur short-lived signed URL issue karta hai, actual bytes seedha client se S3 tak jaate hain. Option B aur C galat hain, presigned URL koi automatic compression ya scanning nahi karta. Option D galat hai — backend ko phir bhi IAM permissions chahiye hoti hain URL sign karne ke liye.",
    difficulty: "medium",
  },
  {
    id: "s3-presigned-4",
    question: "Agar ek presigned URL galti se ek public forum me post ho jaaye, security team turant kya kar sakti hai us specific URL ko revoke karne ke liye?",
    options: [
      "S3 console me jaakar sirf uss URL ko delete kar sakti hai",
      "Koi per-URL revocation mechanism nahi hai — sirf signing credentials rotate karke us URL ko invalidate kiya ja sakta hai, jisse baaki active URLs bhi invalid ho jaayenge",
      "Bucket ko private karke URL apne aap invalid ho jaayega, baaki URLs par asar nahi padega",
      "Object ko rename karke URL ko harmless bana sakti hai bina kisi aur URL ko affect kiye",
    ],
    correctIndex: 1,
    explanation: "Sahi hai — presigned URLs ka koi individual revocation nahi hota; sirf underlying signing credentials rotate karna hi option hai, jisse us waqt ke saare active URLs bhi invalid ho jaate hain. Option A galat hai, aisi koi console feature nahi hai. Option C partially kaam kar sakta hai object access block karne ke liye lekin ye 'revoke URL' ka mechanism nahi hai aur bucket-wide impact daalta hai. Option D galat hai kyunki key change karna deployment complexity badhata hai aur guarantee nahi deta jab tak object delete na ho.",
    difficulty: "medium",
  },
];

export default quiz;
