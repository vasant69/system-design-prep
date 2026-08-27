import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3-perms-1",
    question: "Agar ek IAM policy S3 access allow karti hai lekin koi SCP (Service Control Policy) usi action ko explicitly deny karti hai, to kya hoga",
    options: [
      "Access allow hoga kyunki IAM policy ne allow kiya",
      "Access denied hoga kyunki explicit deny hamesha jeetta hai",
      "Dono policies conflict karengi aur error throw hoga",
      "Jo policy pehle evaluate hoti hai wo jeetegi",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — AWS policy evaluation me explicit Deny hamesha wins, chahe kahin bhi ho (IAM, bucket policy, SCP). Option 1 galat hai kyunki deny allow ko override karta hai. Option 3 aur 4 galat hain, AWS ka evaluation model conflict-error ya order-based nahi hai, ye ek fixed precedence rule follow karta hai.",
    difficulty: "medium",
  },
  {
    id: "s3-perms-2",
    question: "Cross-account S3 access grant karne ke liye kya-kya zaroori hai",
    options: [
      "Sirf bucket policy me doosre account ko allow karna kaafi hai",
      "Sirf requester ke IAM policy me allow karna kaafi hai",
      "Dono taraf allow chahiye - requester ki IAM policy AND bucket ki resource policy",
      "Sirf ACL grant karna kaafi hai",
    ],
    correctIndex: 2,
    explanation: "Sahi jawab option 3 hai — cross-account access ke liye dono side allow karna zaroori hai, requester ke account ki IAM policy AND bucket ki resource-based policy, dono me se koi ek missing ho to access denied milega. Options 1, 2, aur 4 sab incomplete hain, ek hi taraf ka grant kaafi nahi hota.",
    difficulty: "medium",
  },
  {
    id: "s3-perms-3",
    question: "Block Public Access (BPA) ka role kya hai jab ek bucket policy technically valid public access allow kar rahi hai",
    options: [
      "BPA ka bucket policies pe koi effect nahi padta",
      "BPA enabled hone pe bucket policy ka public-allowing effect override ho jaata hai, chahe policy valid ho",
      "BPA sirf ACLs ko block karta hai, bucket policies ko nahi",
      "BPA sirf naye objects pe apply hota hai, existing objects pe nahi",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — BPA ek higher-priority override hai jo valid bucket policy ke public-access-granting effect ko bhi neutralize kar deta hai jab tak explicitly disabled na ho. Option 1 aur 3 galat hain kyunki BPA specifically bucket policies aur ACLs dono ko cover karta hai (4 alag settings). Option 4 bhi galat hai, BPA overall access ko control karta hai, kisi specific object-age se bound nahi.",
    difficulty: "hard",
  },
  {
    id: "s3-perms-4",
    question: "Modern AWS best practice ke hisaab se naye S3 buckets me ACLs ka kya status hona chahiye",
    options: [
      "ACLs primary access control mechanism honi chahiye, IAM se zyada trusted",
      "ACLs 'Bucket owner enforced' setting ke through fully disable honi chahiye, IAM + bucket policy use karo",
      "ACLs sirf cross-account access ke liye use honi chahiye",
      "ACLs aur bucket policy dono ek saath equally use karni chahiye har object pe",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — AWS April 2023 se 'Bucket owner enforced' ko default banata hai jo ACLs ko fully disable kar deta hai, kyunki ACLs error-prone aur debug-karna-mushkil hoti hain. Option 1 galat hai, ACLs legacy mechanism hain, primary nahi. Option 3 galat hai, cross-account access ke liye bucket policy recommended hai, ACL nahi. Option 4 galat hai, dono ko mix karna complexity aur galtiyon ka risk badhata hai.",
    difficulty: "medium",
  },
];

export default quiz;
