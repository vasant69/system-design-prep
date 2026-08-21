import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "iam-debug-1",
    question:
      "`aws iam simulate-principal-policy` kehta hai ki action allowed hai, lekin real API call `AccessDenied` de raha hai. Sabse likely explanation kya hai?",
    options: [
      "Simulator hamesha wrong hota hai, use hi mat karo",
      "Simulator by default SCPs ko account nahi karta — ek Organizations SCP block kar rahi hogi",
      "Real API call aur simulator alag AWS accounts use karte hain",
      "IAM eventually consistent hai, kal try karo",
    ],
    correctIndex: 1,
    explanation:
      "simulate-principal-policy identity policies, resource policies (incompletely), aur boundaries check karta hai, lekin SCPs ko by default account nahi karta. Isliye 'allowed' result ke baawajood real call fail ho sakta hai agar SCP block kar rahi ho — ye sabse common explanation hai. Option A galat hai, simulator generally reliable hai apne scope ke andar. Option C factually galat hai. Option D bhi galat hai kyunki simulate ka SCP-blindspot ek design limitation hai, consistency issue nahi.",
    difficulty: "hard",
  },
  {
    id: "iam-debug-2",
    question:
      "`SignatureDoesNotMatch` error aane par debugging ka sabse pehla step kya hona chahiye?",
    options: [
      "Access key turant rotate kar do",
      "System clock check karo — AWS sirf ±5 minute skew tolerate karta hai aur ye sabse common cause hai",
      "IAM role delete karke wapas banao",
      "Region badal ke retry karo",
    ],
    correctIndex: 1,
    explanation:
      "SigV4 signature me timestamp include hota hai, aur AWS sirf ±5 minute clock skew tolerate karta hai. Docker containers, suspended VMs, aur galat timezone systems iske sabse common culprits hain. Log ghanton keys check karte hain jab asli problem clock hoti hai. Options A, C, D bina root cause investigate kiye actions hain jo problem solve nahi karenge agar cause clock skew hai.",
    difficulty: "medium",
  },
  {
    id: "iam-debug-3",
    question:
      "Ek developer ke paas `lambda:CreateFunction` aur `iam:PassRole` with `Resource: \"*\"` hai. Usne kabhi `AdministratorAccess` nahi paayi. Phir bhi ye combination khatarnaak kyun hai?",
    options: [
      "Ye combination khatarnaak nahi hai jab tak explicit AdministratorAccess na ho",
      "Developer ek Lambda function bana sakta hai jiska execution role koi bhi admin role ho, aur us function ke through effectively admin ban sakta hai",
      "iam:PassRole sirf EC2 ke liye kaam karta hai, Lambda ke liye nahi",
      "Ye sirf tab risky hai jab MFA disabled ho",
    ],
    correctIndex: 1,
    explanation:
      "iam:PassRole with Resource:'*' ka matlab hai developer koi bhi role kisi bhi service ko pass kar sakta hai. Agar account me ek AdminRole hai jise Lambda assume kar sakti hai, developer ek Lambda bana ke uska execution role AdminRole set kar sakta hai — code se admin-level actions kar sakta hai bina kabhi AdministratorAccess paaye. Isi wajah se PassRole ko hamesha specific role ARNs + iam:PassedToService condition se scope karna chahiye. Options A, C, D factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "iam-debug-4",
    question:
      "IAM ko strongly consistent kyun nahi banaya gaya — iska practical trade-off kya hai?",
    options: [
      "AWS ne engineering effort bacha liya, koi technical reason nahi",
      "Strongly consistent banane ke liye har API call ko us-east-1 se sync check karna padta — latency har request par aur us-east-1 outage se global AWS outage; isliye availability chuni gayi",
      "IAM strongly consistent hai, ye myth hai ki nahi hai",
      "Eventual consistency sirf cost bachane ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "Ye CAP theorem ka classic trade-off hai. Strong consistency ke liye har request ko control plane (us-east-1) se sync validate karna padta — extra latency har call par, aur us-east-1 down hone par poori duniya me AWS API calls fail ho jaate. Eventually consistent design me evaluation local hoti hai, latency ~0 rehti hai, aur us-east-1 outage me existing access chalti rehti hai (naye roles nahi ban sakte). Ye availability-over-consistency ka deliberate choice hai. Options A, C, D factually galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
