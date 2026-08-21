import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3sec-1",
    question:
      "Ek team ne S3 par per-tenant isolation banayi — `ListBucket` aur `GetObject` dono actions par `s3:prefix` condition laga di. Production me pata chala ki koi bhi tenant doosre tenant ki known key `GetObject` se padh sakta hai. Kya galat hua?",
    options: [
      "`s3:prefix` condition sirf `ListBucket` par kaam karti hai, `GetObject` par nahi — object-level access Resource ARN se restrict karna padta hai",
      "Condition keys bilkul kaam nahi karti, IAM policy hi galat likhi gayi thi",
      "Bucket policy me `Principal: '*'` reh gaya tha",
      "Block Public Access off tha",
    ],
    correctIndex: 0,
    explanation:
      "`s3:prefix` condition ek bucket-level attribute hai jo sirf `ListBucket` (jiska ARN `arn:aws:s3:::bucket` hai) par evaluate hoti hai. `GetObject` object-level action hai (ARN `arn:aws:s3:::bucket/*`) — usse restrict karne ka ek hi tareeka hai: Resource ARN me hi prefix likhna (`bucket/tenant-42/*`). Option B galat hai — condition keys sahi kaam karti hain, bas galat action par lagayi gayi thi. Option C aur D is scenario me irrelevant hain, sawal specifically prefix-isolation ke baare me hai.",
    difficulty: "hard",
  },
  {
    id: "s3sec-2",
    question:
      "Same-account principal ke liye S3 access allow karne ke liye kya chahiye, aur cross-account ke liye kya alag hai?",
    options: [
      "Dono cases me bucket policy aur IAM policy dono chahiye (AND)",
      "Same-account: bucket policy YA IAM policy (OR) kaafi hai. Cross-account: dono chahiye (AND)",
      "Same-account me sirf IAM policy chahiye, cross-account me sirf bucket policy",
      "Ye evaluation IAM role type par depend karta hai, account boundary par nahi",
    ],
    correctIndex: 1,
    explanation:
      "Same-account access ke liye bucket policy OR IAM identity policy me se koi ek allow kar de to kaafi hai. Cross-account access ke liye dono chahiye — target bucket ki policy me source account allow ho AUR source account ki apni IAM policy me bhi wahi permission ho. Option A overly strict hai same-account ke liye. Option C reverse hai galat tareeke se. Option D galat hai — ye specifically account boundary (same vs cross) par depend karta hai.",
    difficulty: "medium",
  },
  {
    id: "s3sec-3",
    question:
      "Ek bucket SSE-KMS se encrypted hai. Cross-account partner ko access diya — bucket policy aur partner ki IAM policy dono me allow hai, phir bhi `AccessDenied` aa raha hai. Sabse likely reason kya hai?",
    options: [
      "Bucket policy ka size 20 KB se zyada ho gaya",
      "Partner account ki tarah KMS key policy me bhi `kms:Decrypt` allow nahi kiya gaya",
      "Object Ownership 'Object writer' par set hai",
      "TLS enforce nahi kiya gaya",
    ],
    correctIndex: 1,
    explanation:
      "SSE-KMS ke saath cross-account access me teesri cheez chahiye hoti hai jo log bhool jaate hain: KMS key ki apni key policy me doosre account ko `kms:Decrypt` (aur zaroorat pade to `kms:GenerateDataKey`) allow karna. Bucket policy aur IAM policy sahi honay ke bawajood, ye missing hone par `AccessDenied` aata hai jo dekhne me bucket policy ka lagta hai. Options A, C, aur D valid concerns hain lekin diye gaye scenario (dono policies already sahi) ke sabse common culprit nahi hain.",
    difficulty: "hard",
  },
  {
    id: "s3sec-4",
    question:
      "April 2023 se naye S3 buckets me default kya hai?",
    options: [
      "ACLs enabled, Block Public Access off — backward compatibility ke liye",
      "Block Public Access ON aur ACLs disabled (Object Ownership: Bucket owner enforced)",
      "SSE-KMS default encryption, ACLs enabled",
      "Sirf Block Public Access on hua, ACLs ka default nahi badla",
    ],
    correctIndex: 1,
    explanation:
      "April 2023 se AWS ne S3 ka sabse bada security default badla: naye buckets me Block Public Access ke saare 4 switches ON hote hain aur Object Ownership 'Bucket owner enforced' default hai, jisme ACLs poori tarah disabled hain. Ye isliye kiya gaya kyunki countless data breaches sirf accidental public buckets ki wajah se hue the. Option A bilkul ulta hai. Option C part sahi hai (default encryption SSE-S3 January 2023 se hai, KMS nahi) lekin ACLs ka statement galat hai. Option D incomplete hai — dono cheezein badli.",
    difficulty: "easy",
  },
];

export default quiz;
