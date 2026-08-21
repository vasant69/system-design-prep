import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "iam-lab-1",
    question:
      "Lab cleanup karte waqt `aws iam delete-role --role-name LabReportRole` chalate hi `DeleteConflict` error aata hai. Kya galat hua?",
    options: [
      "Role name me typo hai",
      "Role abhi bhi instance profile se juda hai ya uspar policy attached hai — pehle detach/disassociate karna zaroori hai",
      "Role delete karne ke liye root user hona chahiye",
      "IAM roles kabhi delete nahi ho sakte, sirf disable ho sakte hain",
    ],
    correctIndex: 1,
    explanation:
      "IAM DeleteConflict tab deta hai jab entity abhi bhi kahin attached ho — role ko delete karne se pehle uski policies detach karni hoti hain aur instance profile se role remove karna hota hai. Sahi order hamesha: detach/disassociate -> delete child -> delete parent. Options A, C, D factually galat hain.",
    difficulty: "easy",
  },
  {
    id: "iam-lab-2",
    question:
      "CDK bootstrap ke baad `cfn-exec-role` ko default kya milta hai, aur iska practical implication kya hai?",
    options: [
      "Sirf ReadOnlyAccess — safe by default",
      "AdministratorAccess — matlab jo bhi `cdk deploy` chala sakta hai, wo effectively admin hai chahe uski apni IAM permissions limited hon",
      "Kuch nahi, role manually configure karna padta hai",
      "S3-only access, kyunki CDK assets S3 me store karta hai",
    ],
    correctIndex: 1,
    explanation:
      "CDK bootstrap default me cfn-exec-role ko AdministratorAccess deta hai kyunki CloudFormation isi role se resources banata hai. Iska matlab developer ki apni IAM permissions kam ho sakti hain, lekin agar wo cdk deploy chala sakta hai to CloudFormation ke through effectively kuch bhi kar sakta hai. Production me --cloudformation-execution-policies se isko lock karna chahiye. Options A, C, D factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "iam-lab-3",
    question:
      "Least privilege achieve karne ke process ka Phase 2 (Observe) kam se kam kitne time ka hona chahiye, aur kyun?",
    options: [
      "1 din — turant policy narrow kar do",
      "2-4 weeks, aur ek full business cycle cover karna chahiye taaki quarterly jobs aur month-end batches bhi observe ho sakein",
      "1 saal — jab tak sab code paths cover na ho jaayein",
      "Observation phase ki zaroorat hi nahi, seedha CloudTrail se policy generate kar do",
    ],
    correctIndex: 1,
    explanation:
      "2-4 weeks minimum observation chahiye aur usme ek full business cycle cover hona chahiye, warna quarterly reports, month-end batches, ya DR scripts jaise rare code paths generated policy me miss ho jaayenge aur baad me production incident ke roop me sample denge. Option A bahut short hai. Option C impractical hai — saare rare paths cover karna almost impossible hai. Option D galat hai, bina observation data ke CloudTrail-based generation meaningful nahi hoga.",
    difficulty: "medium",
  },
  {
    id: "iam-lab-4",
    question:
      "Ek SaaS company apne 10,000 end-customers ke liye directly IAM users banane ka plan bana rahi hai. Ye approach kyun scale nahi karegi?",
    options: [
      "IAM users free hain isliye koi problem nahi hai",
      "5,000 users ki hard (non-adjustable) limit hai, plus eventual consistency aur API rate limits is scale par IAM ko galat tool bana dete hain",
      "IAM users sirf AWS employees ke liye reserved hain",
      "SaaS applications IAM users use hi nahi kar sakte, technical restriction hai",
    ],
    correctIndex: 1,
    explanation:
      "IAM users per account ki hard limit 5,000 hai jo badh nahi sakti — 10,000 end-customers isse aage hi nikal jaate hain. Additionally IAM eventually consistent hai aur API rate limits hain, jo application-scale user management ke liye designed nahi hai. Sahi approach hai Cognito ya app-level RBAC apne DB me. Options A, C, D factually galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
