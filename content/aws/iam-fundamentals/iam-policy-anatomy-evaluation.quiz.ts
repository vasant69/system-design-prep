import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "iam-policy-1",
    question:
      "Ek policy me `{\"Effect\":\"Allow\",\"Action\":\"s3:*\",\"NotResource\":\"arn:aws:s3:::secret-bucket/*\"}` likha gaya hai. Iska actual effect kya hoga?",
    options: [
      "secret-bucket ke alawa duniya ke har S3 resource par (doosre accounts ke public buckets bhi) sab kuch allow ho jaata hai",
      "Sirf apne account ke buckets par secret-bucket ke alawa access milta hai, doosre accounts touch nahi hote",
      "Ye statement invalid hai aur build fail karega",
      "secret-bucket ko explicitly deny kar deta hai, baaki kuch allow nahi hota",
    ],
    correctIndex: 0,
    explanation:
      "NotResource ke saath Allow pair karna almost hamesha bug hota hai — ye 'in resources ke alawa sab kuch' allow kar deta hai, jisme doosre accounts ke public S3 resources bhi shamil hain, sirf apna account nahi. Option B galat hai kyunki NotResource account-scoped nahi hota. Option C galat hai — ye syntactically valid JSON hai, bas semantically dangerous hai. Option D ulta hai — ye Deny nahi, Allow statement hai jo secret-bucket ko chhod baaki sab allow karta hai.",
    difficulty: "hard",
  },
  {
    id: "iam-policy-2",
    question:
      "Ek user cross-account S3 bucket access try kar raha hai. Uski apni account ki identity policy me s3:GetObject allow hai, lekin bucket owner ki resource policy me us user ko allow nahi kiya gaya. Kya access milega?",
    options: [
      "Haan, kyunki same-account rule 'ek policy kaafi hai' cross-account me bhi apply hoti hai",
      "Nahi — cross-account access ke liye identity policy AUR resource policy dono me explicit Allow chahiye, ye AND hai OR nahi",
      "Haan, kyunki identity policy hamesha resource policy se override karti hai",
      "Ye depend karta hai sirf is baat par ki bucket public hai ya nahi",
    ],
    correctIndex: 1,
    explanation:
      "Cross-account access ke liye dono side se Allow chahiye — source account ki identity policy AUR target account ki resource policy, ye AND condition hai. Same-account me OR (koi ek kaafi) chalta hai, lekin cross-account me nahi. Yahan resource policy allow nahi kar rahi, isliye access denied hoga chahe identity policy allow kare. Option A galat hai kyunki same-account rule cross-account par apply nahi hoti. Option C galat hai — koi bhi policy dusri ko automatically override nahi karti, dono zaroori hain. Option D irrelevant hai is specific scenario me.",
    difficulty: "medium",
  },
  {
    id: "iam-policy-3",
    question:
      "IAM ke 8-step evaluation precedence me sabse pehla check kaunsa hota hai, aur kyun?",
    options: [
      "Identity-based policy, kyunki ye sabse common policy type hai",
      "SCP, kyunki Organizations account se upar hoti hai",
      "Explicit Deny (kahin bhi ho), kyunki ye ek monotonic guarantee deta hai jo baaki kisi bhi Allow se override nahi ho sakta",
      "Resource-based policy, kyunki cross-account access sabse zyada complex hai",
    ],
    correctIndex: 2,
    explanation:
      "Explicit Deny — chahe wo identity policy, resource policy, SCP, RCP, boundary, ya session policy kisi me bhi ho — sabse pehle check hoti hai aur turant final decision ban jaati hai, koi bhi Allow ise override nahi kar sakta. Ye design monotonic guarantee deta hai: ek Deny dekh kar keh sakte ho ki access kabhi nahi hoga, baaki policies padhne ki zaroorat nahi. Options A, B, aur D sab evaluation chain me baad me aati hain — SCP/RCP explicit Deny check ke baad, aur resource/identity policies unke baad.",
    difficulty: "medium",
  },
  {
    id: "iam-policy-4",
    question:
      "Production environment me AWS managed policies (jaise AmazonS3FullAccess) ko avoid karne ki sabse badi practical wajah kya hai?",
    options: [
      "AWS managed policies free nahi hoti, customer managed policies free hoti hain",
      "AWS managed policies AWS ki marzi se silently update ho sakti hain, jisse compliance audits non-deterministic ho jaate hain, aur wo har customer ke liye likhi jaane ki wajah se hamesha over-permissive hoti hain",
      "AWS managed policies sirf console se attach ho sakti hain, CLI/CDK se nahi",
      "AWS managed policies me Condition elements use nahi kar sakte",
    ],
    correctIndex: 1,
    explanation:
      "AWS managed policies AWS khud maintain karta hai aur permission add kar sakta hai tumhari permission ke bina — jo attached har identity ko silently mil jaata hai. Aur ye har customer ke liye generically likhi jaati hain (jaise AmazonS3FullAccess = poore account ke har bucket par access), isliye hamesha over-permissive hoti hain. Regulated industries me ye audit findings ban sakta hai kyunki 'role ke paas kya hai' non-deterministic ho jaata hai. Option A galat hai — dono free hain, pricing ka issue nahi hai. Option C galat hai, CLI/CDK se bhi attach ho sakti hain. Option D galat hai, ye policy type se related nahi hai.",
    difficulty: "medium",
  },
];

export default quiz;
