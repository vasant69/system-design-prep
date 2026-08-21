import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "e2e-1",
    question:
      "User `https://myproject.com` type karta hai. TLS handshake exactly kahan terminate hoti hai, aur ye kyun matter karta hai?",
    options: [
      "S3 origin pe — isliye origin ka RTT lagta hai",
      "CloudFront edge pe — origin ka RTT nahi lagta, isliye latency kam hoti hai",
      "API Gateway pe — sirf API calls ke liye TLS lagti hai",
      "Route 53 pe — DNS layer hi encryption handle karta hai",
    ],
    correctIndex: 1,
    explanation:
      "TLS CloudFront edge pe terminate hoti hai, origin (S3) pe nahi — isliye handshake ka round-trip time origin ka nahi, nearest edge ka hota hai, jo latency ka bada win hai. Option A galat hai kyunki origin tak connection CloudFront khud OAC/SigV4 se banata hai, browser TLS wahan tak nahi jaati. Option C aur D dono galat premises hain — Route 53 sirf naam resolve karta hai, encryption nahi karta.",
    difficulty: "medium",
  },
  {
    id: "e2e-2",
    question:
      "File upload flow me 5 GB tak ki file kaise upload hoti hai jabki Lambda ka synchronous payload limit sirf 6 MB hai?",
    options: [
      "Lambda timeout badha diya jaata hai taaki poori file process ho sake",
      "File ko chunks me todke Lambda ko multiple baar bheja jaata hai",
      "Lambda sirf ek presigned URL generate karta hai; browser file ko directly S3 pe PUT karta hai, backend ko bypass karke",
      "CloudFront file ko compress karke Lambda ki limit ke andar la deta hai",
    ],
    correctIndex: 2,
    explanation:
      "Lambda file ko touch hi nahi karta — wo sirf ek short-lived presigned PUT URL generate karta hai jo browser ko wapas milta hai, aur browser directly S3 pe upload karta hai. Isliye 6 MB payload limit yahan irrelevant hai. Option A galat hai kyunki timeout badhane se payload limit change nahi hoti. Option B galat hai — chunking ka concept multipart upload me hai, lekin wo bhi seedha S3 se hota hai, Lambda se nahi. Option D ek fictional mechanism hai jo CloudFront actually nahi karta.",
    difficulty: "medium",
  },
  {
    id: "e2e-3",
    question:
      "Upload aur thumbnail-generation ke liye S3 me alag-alag prefixes (`originals/` aur `thumbnails/`) kyun use kiye jaate hain?",
    options: [
      "Sirf organization ke liye, koi functional reason nahi",
      "Alag prefix rakhne se billing alag track hoti hai",
      "Taaki thumbnail-generator Lambda ka apna output khud ko dobara trigger na kare — infinite loop physically impossible ho jaata hai",
      "S3 ek hi prefix me do event triggers allow nahi karta",
    ],
    correctIndex: 2,
    explanation:
      "Agar thumbnail usi prefix me likha jaata jispe ObjectCreated event Lambda ko trigger karta hai, to har thumbnail write khud ek naya event bana deta aur Lambda apne aap ko baar-baar trigger karta rehta — ek classic infinite loop. Alag prefix rakhne se (aur IAM role me input prefix pe write permission na dekar) ye scenario design se hi possible nahi rehta. Option A ise sirf cosmetic bata raha hai jabki ye ek real failure-mode prevention hai. Option B factually galat hai. Option D bhi galat hai — S3 multiple prefixes pe alag triggers allow karta hai, ye limitation nahi hai.",
    difficulty: "hard",
  },
  {
    id: "e2e-4",
    question:
      "Same architecture EC2 pe (t3.small + ALB + EBS) chalane ka minimum monthly cost approximately kitna hoga, jabki serverless version ka cost kya hai?",
    options: [
      "Dono lagbhag same hain, ~$1/month",
      "EC2 version $35-65/month minimum (chahe zero traffic ho), serverless ~$1/month",
      "EC2 version sasta hai kyunki reserved instances free hote hain",
      "Serverless version costlier hai kyunki har request ka alag charge lagta hai",
    ],
    correctIndex: 1,
    explanation:
      "Serverless stack (Route 53 + CloudFront + S3 + Lambda + SES) lagbhag $1/month me chalta hai, jyadatar free-tier ki wajah se. Wahi setup EC2 (t3.small ~$15) + ALB (~$16) + EBS (~$3) + optional NAT (~$32) pe kam se kam $35-65/month lagta hai, chahe traffic zero ho, kyunki instance aur load balancer hamesha chalte rehte hain. Option A aur C dono factually galat hain. Option D bhi galat hai — is traffic pattern (low, bursty) pe serverless ka per-request pricing free tier ke andar hi reh jaata hai.",
    difficulty: "easy",
  },
];

export default quiz;
