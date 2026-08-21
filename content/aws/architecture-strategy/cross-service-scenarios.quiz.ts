import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "css-1",
    question:
      "Private S3 bucket ko CloudFront se serve karne ke liye OAC setup me bucket policy me `AWS:SourceArn` condition kyun critical hai?",
    options: [
      "Sirf performance improve karne ke liye — condition ke bina bhi security same rehti hai",
      "Iske bina duniya ka koi bhi CloudFront distribution (kisi bhi account ka) us bucket se GetObject kar sakta hai — confused deputy problem",
      "Ye condition sirf logging enable karta hai",
      "Ye condition CloudFront ki caching TTL set karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Bina `AWS:SourceArn` condition ke, bucket policy sirf 'CloudFront service principal' ko allow karti hai — jo koi bhi CloudFront distribution ho sakta hai, kisi bhi AWS account ka, kyunki service principal specific distribution identify nahi karta. SourceArn condition ise apni specific distribution tak lock karta hai, jisse confused deputy problem (koi aur distribution use karke tumhara data padhna) prevent hoti hai. Options C aur D dono fictional functions hain jo ye condition actually nahi karta. Option A security ke real impact ko underplay karta hai.",
    difficulty: "hard",
  },
  {
    id: "css-2",
    question:
      "Lambda ko S3 se 'Access Denied' mil raha hai jabki bucket policy allow karti hai. Sabse commonly missed cause kya hai?",
    options: [
      "Lambda function ka naam galat hai",
      "Object SSE-KMS se encrypted hai aur Lambda role ko us KMS key pe kms:Decrypt permission nahi hai",
      "S3 bucket ka naam bahut lamba hai",
      "Lambda memory allocation kam hai",
    ],
    correctIndex: 1,
    explanation:
      "Jab object SSE-KMS se encrypted hota hai, sirf s3:GetObject allow hona kaafi nahi hota — role ko us specific KMS key pe kms:Decrypt bhi chahiye, aur key policy me bhi wo role allowed hona chahiye. Ye sabse commonly missed cause hai kyunki S3 permissions dikhte theek hain lekin encryption layer alag se block kar rahi hoti hai. Options A, C, aur D koi bhi 'Access Denied' error produce nahi karte — ye sab unrelated ya fictional causes hain.",
    difficulty: "hard",
  },
  {
    id: "css-3",
    question:
      "'Poora site down hai' scenario me debugging kis order me karni chahiye, aur sabse important last step kya hai?",
    options: [
      "Sirf Lambda logs dekho, baaki kuch check karne ki zaroorat nahi",
      "Outside-in: DNS to CloudFront to origin to compute — aur last, most important step hai recent CloudTrail changes dekhna",
      "Inside-out: pehle Lambda code review karo, phir DNS check karo",
      "Random order me sab kuch ek saath check karo",
    ],
    correctIndex: 1,
    explanation:
      "Outside-in approach — user ke perspective se shuru karke andar (DNS -> CloudFront -> origin -> compute) — systematically har layer isolate karta hai. Sabse important step hai recent CloudTrail changes dekhna, kyunki zyadatar outages kisi recent change (deploy, IAM policy edit, cert expiry) se hi hote hain — isse root cause fast mil jaata hai. Option A bahut narrow hai aur DNS/CDN layer ke issues miss kar dega. Option C inefficient hai kyunki agar DNS hi broken hai to Lambda code review time waste hai. Option D systematic nahi hai, jo interview me weak signal deta hai.",
    difficulty: "medium",
  },
  {
    id: "css-4",
    question:
      "DR (disaster recovery) plan banate waqt SES ke liye sabse commonly bhoola jaane wala point kya hai?",
    options: [
      "SES sirf ek hi region me kaam kar sakta hai, koi doosra option nahi",
      "SES ka production access status per-region hota hai — secondary region me alag se production access lena padta hai, warna disaster ke time pata chalega ki wo sandbox me hai",
      "SES automatically failover karta hai, kuch extra setup nahi chahiye",
      "SES DR ke liye sirf DNS record change kaafi hai",
    ],
    correctIndex: 1,
    explanation:
      "SES ka production access (sandbox se bahar aana) per-region approval hota hai — agar sirf primary region me production access liya gaya hai aur secondary region me nahi, to disaster ke time SES sandbox restrictions (200 emails/24h, verified recipients only) hit ho jaayengi, exactly jab availability sabse zyada zaroori hai. Option A galat hai — SES multiple regions me deploy ho sakta hai. Option C bhi galat hai, SES automatic cross-region failover nahi karta, manual setup chahiye. Option D bhi incomplete hai, DNS change kaafi nahi, dono regions me identity verify + production access dono chahiye.",
    difficulty: "hard",
  },
];

export default quiz;
