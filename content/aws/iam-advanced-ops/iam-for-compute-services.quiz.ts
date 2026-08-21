import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "iam-cs-1",
    question:
      "IMDSv1 enabled EC2 instance ke saath sabse bada security risk kya hai?",
    options: [
      "IMDSv1 credentials refresh nahi karta",
      "SSRF vulnerability wale app se attacker simple GET request se instance credentials directly nikal sakta hai — Capital One breach ka exact vector",
      "IMDSv1 sirf IPv6 instances par kaam nahi karta",
      "IMDSv1 credentials ka expiry time nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "IMDSv1 token-based nahi hai — sirf ek GET request se credentials mil jaate hain. Agar app me SSRF bug hai (attacker arbitrary URL fetch karwa sakta hai), to wo 169.254.169.254 fetch karke instance credentials nikaal leta hai. Ye exactly Capital One ke 2019 breach ka mechanism tha. IMDSv2 PUT + custom header maangta hai jo typical SSRF se nahi ho sakta. Options A, C, D factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "iam-cs-2",
    question:
      "EKS Pod Identity, IRSA se operationally kaise better hai?",
    options: [
      "Pod Identity credentials kabhi expire nahi hoti",
      "Pod Identity me per-cluster OIDC provider register karne ki zaroorat nahi, aur cluster recreate hone par trust policies update nahi karni padtin",
      "Pod Identity sirf public clusters ke liye kaam karta hai",
      "IRSA deprecated ho chuka hai aur ab kaam nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "IRSA me har cluster ka apna OIDC issuer register karna padta hai aur role trust policy me cluster-specific issuer URL hota hai — cluster recreate hone par (naya OIDC ID) sab roles update karne padte hain. Pod Identity ek addon-based association use karta hai jisme trust policy me generic pods.eks.amazonaws.com principal hota hai, koi per-cluster OIDC registration nahi. Option A galat hai, dono temporary credentials hi hain. Option C galat hai. Option D galat hai — IRSA abhi bhi valid aur supported hai, khaaskar cross-account edge cases me.",
    difficulty: "medium",
  },
  {
    id: "iam-cs-3",
    question:
      "Lambda ke 'execution role' aur 'resource-based policy (function policy)' me kya fark hai?",
    options: [
      "Dono same cheez hain, sirf naming alag hai",
      "Execution role batata hai function kya kar sakta hai (outbound); function policy batata hai kaun function ko invoke kar sakta hai (inbound)",
      "Execution role sirf S3 access ke liye hai, function policy baaki sab ke liye",
      "Function policy Lambda console me set hi nahi ho sakti",
    ],
    correctIndex: 1,
    explanation:
      "Execution role (outbound) function ke code ko permissions deta hai — jaise logs likhna ya S3 padhna. Function/resource-based policy (inbound) control karti hai ki API Gateway, EventBridge, S3, ya SNS jaisi services function ko invoke kar sakti hain ya nahi. Direction yaad rakhne ka tareeka: execution role = outbound, function policy = inbound. Options A, C, D sab galat hain.",
    difficulty: "easy",
  },
  {
    id: "iam-cs-4",
    question:
      "Ek Lambda execution role ke paas `secretsmanager:GetSecretValue` hai lekin secret access phir bhi AccessDenied de raha hai. Sabse likely missing cheez kya hai?",
    options: [
      "Lambda timeout kam hai",
      "Secret KMS CMK se encrypted hai aur execution role ko us key par alag se kms:Decrypt permission nahi di gayi",
      "Lambda function ka naam bahut lamba hai",
      "Secrets Manager IAM support hi nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Agar secret ek customer-managed KMS key se encrypted hai, to secretsmanager:GetSecretValue ke saath-saath us key par kms:Decrypt bhi chahiye — ye ek alag, easily-forgotten permission hai jo KMS ke apne evaluation model (key policy delegation) se juda hai. Options A, C, D is scenario se related nahi hain.",
    difficulty: "hard",
  },
];

export default quiz;
