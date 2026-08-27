import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lambda-iam-1",
    question: "Execution Role aur Resource-based Policy me kya fundamental difference hai?",
    options: [
      "Dono same cheez hain, alag naam se",
      "Execution Role outbound hai (Lambda kya kar sakta hai), Resource-based Policy inbound hai (Lambda ko kaun invoke kar sakta hai)",
      "Execution Role sirf S3 ke liye hai, Resource-based Policy sirf API Gateway ke liye",
      "Resource-based Policy sirf console se set hoti hai, kabhi IaC se nahi",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — Execution Role batata hai Lambda apne andar se kya kar sakta hai (outbound), Resource-based Policy batati hai kaun Lambda ko invoke kar sakta hai (inbound). Option A galat hai, ye do distinct mechanisms hain. Option C galat hai, dono generic concepts hain, specific service tak limited nahi. Option D galat hai - IaC me bhi resource-based policy explicitly set ki ja sakti hai, bas automatic nahi hoti.",
    difficulty: "easy",
  },
  {
    id: "lambda-iam-2",
    question: "Terraform se S3 trigger setup kiya gaya, lekin file upload karne pe Lambda function kabhi invoke nahi hota, na koi error dikhta hai. Sabse likely cause kya hai?",
    options: [
      "Execution role me S3 read permission missing hai",
      "aws_lambda_permission (resource-based policy) resource define karna bhool gaye",
      "Lambda function ka memory bahut kam set hai",
      "S3 bucket wrong region me hai",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — ye classic IaC bug hai jahan resource-based policy (inbound invoke permission) add karna bhool jaate hain. Trigger dikhta hai, function exist karta hai, lekin S3 ko Lambda invoke karne ki permission hi nahi hoti. Option A galat hai kyunki execution role read permission na hone pe invocation to hota, bas function ke andar fail hota (jo logs me dikhta). Option C aur D irrelevant/unlikely causes hain.",
    difficulty: "hard",
  },
  {
    id: "lambda-iam-3",
    question: "\"Trigger configured hai lekin function chalta nahi\" bug ko debug karte waqt sabse pehla step kya hona chahiye?",
    options: [
      "Seedha execution role delete karke recreate karna",
      "CloudWatch Logs check karna ki invocation record hua hi ya nahi",
      "Lambda function ka memory badha dena",
      "Poora infrastructure destroy karke redeploy karna",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — agar CloudWatch Logs me invocation record hi nahi hua, to problem resource-based policy (inbound) me hai, execution role me nahi. Ye distinction debugging time bachata hai. Option A galat approach hai bina diagnosis ke. Option C irrelevant hai is bug ke liye. Option D overkill aur wasteful approach hai.",
    difficulty: "medium",
  },
  {
    id: "lambda-iam-4",
    question: "Console se trigger add karne (jaise S3 event source) aur IaC (Terraform/CDK) se trigger add karne me kya key difference hai permissions ke context me?",
    options: [
      "Koi difference nahi, dono automatically resource-based policy add karte hain",
      "Console automatically resource-based policy add kar deta hai, IaC me ye explicitly ek separate resource ke through add karna padta hai",
      "IaC automatically karta hai, console me manually karna padta hai",
      "Dono me resource-based policy ki zaroorat hi nahi hoti",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — console UI trigger add karte waqt automatically resource-based policy statement create kar deta hai, lekin IaC tools me ye automatic magic nahi hoti, explicitly ek resource (jaise aws_lambda_permission) declare karna padta hai. Option A aur C facts ko ulta ya galat represent karte hain. Option D bilkul galat hai, resource-based policy dono cases me zaroori hai, bas kaise set hoti hai wo alag hai.",
    difficulty: "medium",
  },
];

export default quiz;
