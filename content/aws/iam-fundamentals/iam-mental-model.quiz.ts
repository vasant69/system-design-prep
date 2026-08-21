import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "iam-mm-1",
    question:
      "Ek IAM role ki trust policy me Principal ke roop me arn:aws:iam::123456789012:root diya gaya hai. Iska matlab kya hai?",
    options: [
      "Sirf account 123456789012 ka actual root user (email/password wala) ye role assume kar sakta hai",
      "Account 123456789012 ki koi bhi principal jise apni account ki identity policy se sts:AssumeRole ki permission mili ho",
      "Ye syntax invalid hai, root sirf resource-based policies me use nahi ho sakta",
      "Sirf IAM users ye role assume kar sakte hain, roles nahi",
    ],
    correctIndex: 1,
    explanation:
      "':root' Principal ka matlab literally root user nahi hai — iska matlab hai us account ki koi bhi authorized identity (user ya role) jise uski apni account ki identity policy se permission mili ho. Ye AWS ki confusing naming hai jo bahut logon ko trap karti hai. Option A galat hai (ye specifically root user restrict nahi karta). Option C galat hai (ye bilkul valid aur common pattern hai). Option D galat hai (roles bhi is tarah assume kar sakti hain).",
    difficulty: "medium",
  },
  {
    id: "iam-mm-2",
    question:
      "IAM User aur IAM Role me sabse fundamental difference kya hai?",
    options: [
      "User sirf console access ke liye hai, Role sirf API access ke liye hai",
      "User ke paas permanent credentials hoti hain jo manually rotate karni padti hain; Role ke paas koi credentials nahi hoti, assume karne par STS fresh temporary credentials (default 1 hour) deta hai",
      "Role sirf ek waqt me ek hi principal assume kar sakta hai, User multiple log use kar sakte hain",
      "User aur Role dono me practically koi fark nahi hai, bas naam alag hai",
    ],
    correctIndex: 1,
    explanation:
      "IAM User ke paas password/access keys jaisi permanent credentials hoti hain jo tab tak valid rehti hain jab tak manually rotate na ki jaayen. IAM Role ke paas koi apni credentials nahi hoti — sirf permission set aur trust policy — aur jab koi ise assume karta hai, STS fresh temporary credentials deta hai jo default 1 hour me khud expire ho jaati hain. Option A galat hai (dono API se use ho sakte hain, aur User console bhi use kar sakta hai). Option C ulta hai — role ko hazaaron log simultaneously assume kar sakte hain, har ek apna independent session paata hai. Option D galat hai, ye fundamental difference hai.",
    difficulty: "easy",
  },
  {
    id: "iam-mm-3",
    question:
      "IAM ka control plane kis region me rehta hai, aur iska practical implication kya hai?",
    options: [
      "Har region me alag IAM control plane hota hai, isliye roles per-region banane padte hain",
      "us-east-1 me — quota increase requests sirf us-east-1 se maang sakte ho, aur CloudTrail me IAM events us-east-1 me global service events ke roop me log hote hain",
      "eu-west-1 me, kyunki AWS ka original data center wahan tha",
      "IAM ka koi fixed control plane region nahi hai, ye fully distributed hai",
    ],
    correctIndex: 1,
    explanation:
      "IAM ka control plane commercial partition me us-east-1 me rehta hai. Isse practical implications hain: quota increase requests sirf us-east-1 se maang sakte ho, CloudTrail me IAM events us-east-1 me global service events ke roop me log hote hain (regional trail me 'global service events' include na karo to miss ho jaayenge), aur us-east-1 ka outage naye roles/policies banane (writes) ko affect kar sakta hai. Option A galat hai — IAM roles/policies har region me valid hote hain, per-region banane ki zaroorat nahi. Option C galat hai. Option D galat hai — IAM ka ek specific control-plane home region hai (us-east-1), sirf iska data replicate hota hai globally.",
    difficulty: "medium",
  },
  {
    id: "iam-mm-4",
    question:
      "Permissions boundary aur SCP jaisi 'limiting' policies ko identity-based aur resource-based 'granting' policies ke saath kaise combine kiya jaata hai?",
    options: [
      "Sab policies ka union liya jaata hai — jo bhi kisi bhi policy me allow ho wo mil jaata hai",
      "Effective permissions = intersection of all limiting policies, intersected with union of all granting policies",
      "Sirf sabse recent policy jo attach hui ho wo effective hoti hai",
      "Limiting policies ko ignore kar diya jaata hai agar identity policy me AdministratorAccess ho",
    ],
    correctIndex: 1,
    explanation:
      "Granting policies (identity-based, resource-based) apas me union hote hain (jo bhi allow ho), lekin limiting policies (permissions boundary, SCP, RCP, session policy) sirf ceiling lagati hain — kabhi grant nahi karti. Final effective permissions un dono ka intersection hai: jo grant hua hai AUR jo har limiting layer ke andar bhi hai. Option A galat hai kyunki ye limiting policies ko ignore kar deta hai. Option C galat hai — ye policy attachment ka time-based override nahi hai. Option D bilkul galat hai — chahe identity policy me AdministratorAccess ho, agar SCP ne sirf s3:* allow kiya hai to effective permissions sirf S3 tak simit rahengi.",
    difficulty: "hard",
  },
];

export default quiz;
