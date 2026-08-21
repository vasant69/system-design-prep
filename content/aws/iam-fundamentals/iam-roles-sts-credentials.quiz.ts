import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "iam-sts-1",
    question:
      "AssumeRole call successful hone ke liye kaunse do checks pass hone chahiye?",
    options: [
      "Sirf target role ki trust policy allow kare, caller ki identity policy check nahi hoti",
      "Target role ki trust policy caller ko allow kare (resource-side) AUR caller ki identity policy me us role ARN par sts:AssumeRole ho (identity-side) — dono chahiye",
      "Sirf caller ki identity policy me sts:AssumeRole ho, trust policy sirf documentation ke liye hai",
      "Caller ke paas MFA enabled honi chahiye, ye sabse important check hai",
    ],
    correctIndex: 1,
    explanation:
      "STS do independent checks karta hai: role ki trust policy (resource-based policy) caller ko allow karti hai, aur caller ki apni identity policy me us specific role ARN par sts:AssumeRole permission hai. Dono zaroori hain — ye ek AND condition hai, khaas taur par cross-account me. Option A aur C dono galat hain kyunki sirf ek side ka check kaafi nahi hai. Option D galat hai — MFA is checklist ka part nahi hai jab tak trust policy me explicitly condition na lagi ho.",
    difficulty: "medium",
  },
  {
    id: "iam-sts-2",
    question:
      "Ek IAM role ka MaxSessionDuration 12 hours set hai. Koi is role ko already assumed session se (role chaining) doosri baar assume karta hai. Maximum session duration kitna milega?",
    options: [
      "12 hours, kyunki role ki MaxSessionDuration setting hamesha respect hoti hai",
      "1 hour, kyunki role chaining hamesha 1-hour cap laga deta hai chahe target role ka max kuch bhi ho",
      "24 hours, kyunki chained sessions ko extra time milta hai",
      "0 seconds, kyunki role chaining allowed hi nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Jab ek assumed-role session se doosri AssumeRole call hoti hai (role chaining), maximum duration hamesha 1 hour (3600 seconds) ho jaata hai — chahe target role ka MaxSessionDuration 12 hours ho. DurationSeconds > 3600 pass karne par error milega. Ye AWS ka design hai taaki chained sessions frequently re-validate hon. Option A galat hai kyunki chaining specifically ye override karta hai. Option C bilkul galat hai. Option D galat hai — role chaining allowed hai, bas duration capped hai.",
    difficulty: "hard",
  },
  {
    id: "iam-sts-3",
    question:
      "Cross-account role assumption me External ID kis problem ko solve karta hai, aur ise kaun generate karta hai?",
    options: [
      "Confused deputy problem — third-party vendor ko galti se doosre customer ke behalf par tumhare account me call karne se rokta hai; External ID tum generate karte ho, vendor nahi",
      "Password brute-force attacks ko rokta hai; External ID vendor generate karke tumhe deta hai",
      "MFA ka replacement hai jab hardware key available nahi ho; koi bhi party generate kar sakti hai",
      "Sirf billing tracking ke liye use hota hai, security se related nahi hai",
    ],
    correctIndex: 0,
    explanation:
      "External ID confused deputy problem solve karta hai — jab ek third-party vendor multiple customers ko serve karta hai aur koi ek customer vendor ko trick karke doosre customer (tumhare) account me galat call karwa sakta hai. External ID ek secret hai jo tum generate karte ho (vendor nahi, warna wo guessable/predictable ho sakta hai) aur trust policy ki Condition me require kiya jaata hai. Option B, C, aur D sab is condition ke actual purpose se galat hain.",
    difficulty: "medium",
  },
  {
    id: "iam-sts-4",
    question:
      "STS ke global endpoint (sts.amazonaws.com) se mila token opt-in regions (jaise ap-east-1 Hong Kong) me kaam kyun nahi karta?",
    options: [
      "Global endpoint tokens sirf us-east-1 me hi ban sakte hain",
      "Global endpoint ka token version 1 hota hai jo sirf default-enabled regions me valid hai; opt-in regions me valid hone ke liye regional endpoint ka version 2 token chahiye, aur account setting ko 'valid in all regions' par set karna padta hai",
      "Opt-in regions STS support hi nahi karte",
      "Global endpoint tokens 5 minute me expire ho jaate hain isliye opt-in region tak pahunchte pahunchte expire ho jaate hain",
    ],
    correctIndex: 1,
    explanation:
      "Ye historical baggage hai: global endpoint (sts.amazonaws.com) ka token version 1 hai jo default-enabled regions me hi valid hai, opt-in regions (Hong Kong, Bahrain, etc.) me nahi. Regional endpoint ka token version 2 hai jo sab regions me valid hai. Account setting me 'Global endpoint token version' ko 'Valid in all AWS Regions' par set karke ye fix ho sakta hai. Option A galat hai. Option C galat hai — opt-in regions STS support karte hain, bas explicitly activate karna padta hai. Option D galat hai, expiry ka issue nahi hai, ye region-validity ka issue hai.",
    difficulty: "hard",
  },
];

export default quiz;
