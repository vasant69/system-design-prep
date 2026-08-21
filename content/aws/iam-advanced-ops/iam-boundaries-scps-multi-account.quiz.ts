import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "iam-bsm-1",
    question:
      "Ek permissions boundary me sirf `s3:*` hai, aur identity policy me `AdministratorAccess` attached hai. Effective permission kya hoga?",
    options: [
      "AdministratorAccess — boundary sirf extra warning deti hai",
      "Sirf s3:* — effective permission dono ka intersection hota hai",
      "Kuch nahi — dono policies conflict karke implicit deny ban jaayengi",
      "Jo bhi policy baad me attach hui ho, wahi jeetegi",
    ],
    correctIndex: 1,
    explanation:
      "Permissions boundary kabhi grant nahi karti — ye ek ceiling hai. Effective permissions = (identity policies) ∩ (boundary). Yahan AdministratorAccess ka intersection s3:* ke saath sirf s3:* deta hai. Option A galat hai kyunki boundary sirf warning nahi, actual enforcement hai. Option C galat hai — ye conflict nahi, intersection hai. Option D galat hai, attach order se koi fark nahi padta.",
    difficulty: "medium",
  },
  {
    id: "iam-bsm-2",
    question:
      "SCP aur permissions boundary dono account ko lock kar sakte hain agar galat likhi jaayein. Management account ke liye kaunsa statement sach hai?",
    options: [
      "SCPs management account par bhi lagti hain, isliye wahan extra saavdhaani chahiye",
      "SCPs management account par nahi lagti — isi wajah se best practice hai ki wahan koi workload na chalao",
      "Permissions boundary management account ke root par automatically lag jaati hai",
      "Management account me SCP aur boundary dono disabled rehte hain by design",
    ],
    correctIndex: 1,
    explanation:
      "SCPs sirf member accounts par lagti hain, management account par nahi — isi wajah se management account 'always reachable' rehta hai agar kisi galat SCP se poora org lock ho jaaye, aur isi wajah se best practice hai ki wahan koi workload ya developer access na ho. Option A galat hai (bilkul ulta). Option C galat hai — root ke paas boundary hoti hi nahi. Option D galat hai, SCP member accounts par to lagti hi hai, disabled nahi hoti.",
    difficulty: "hard",
  },
  {
    id: "iam-bsm-3",
    question:
      "Ek platform team apne developers ko `iam:CreateRole` dena chahti hai taaki wo apne Lambda roles bana sakein, lekin unhe admin nahi banne dena. Is 'safe delegation' problem ka sahi solution kya hai?",
    options: [
      "Developers ko seedha AdministratorAccess de do aur trust par chhod do",
      "`iam:CreateRole` deny kar do sabke liye, developers khud kuch na banayein",
      "`iam:CreateRole` allow karo with `iam:PermissionsBoundary` condition jo ek DevBoundary policy force kare naye role par",
      "Ek SCP lagao jo poore account me role creation hi block kar de",
    ],
    correctIndex: 2,
    explanation:
      "Permissions boundary ka primary use case hi ye hai — `iam:CreateRole` ko is condition ke saath allow karo ki naya role sirf tab bane jab uspar DevBoundary lagi ho. Isse developer role bana sakta hai lekin us role ki permissions boundary se upar nahi ja sakti. Option A trust-based hai, koi enforcement nahi. Option B developer ko unblock karne ka goal hi hara deta hai. Option D SCP ka scope poora account/OU hai, ye per-team delegation ke liye galat tool hai (coarse-grained).",
    difficulty: "medium",
  },
  {
    id: "iam-bsm-4",
    question:
      "Multi-tenant SaaS application me har naye tenant ke liye ek naya IAM role banana kyun problematic ho sakta hai scale par?",
    options: [
      "IAM roles har din auto-delete ho jaate hain",
      "Roles per account ki quota (default 1,000, max 10,000) hit ho sakti hai; session policies se ek hi broad role scale karta hai",
      "IAM roles sirf ek hi trust policy support karte hain, tenants ke liye nahi bante",
      "Cross-tenant roles automatically S3 access de dete hain",
    ],
    correctIndex: 1,
    explanation:
      "Har tenant ke liye alag role banana IAM ki roles-per-account quota (default 1,000, max badhake 10,000) se takra sakta hai jab tenants hazaaron me ho jaayein. Session policy pattern — ek broad role, per-request scoped session policy — isi problem ko solve karta hai bina per-tenant role banaye. Option A aur D factually galat hain. Option C bhi galat hai, roles multiple use cases ke liye ban sakte hain.",
    difficulty: "easy",
  },
];

export default quiz;
