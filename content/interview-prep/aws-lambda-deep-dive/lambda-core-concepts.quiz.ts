import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lambda-core-1",
    question: "Serverless ka sahi matlab kya hai?",
    options: [
      "Server literally exist nahi karta",
      "Server exist karta hai, lekin uska provisioning/patching/scaling AWS ki responsibility hai",
      "Sirf small functions ke liye kaam karta hai",
      "Ek naya operating system jo bina hardware ke chalta hai",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — server physically exist karta hai kisi AWS data center me, bas aapko uski chinta nahi karni. Option A bilkul galat framing hai jo interview me weak lagta hai. Option C galat hai kyunki Lambda large workloads bhi handle kar sakta hai (limits ke andar). Option D bakwaas hai — serverless ek naya OS nahi hai, ek deployment/operations model hai.",
    difficulty: "easy",
  },
  {
    id: "lambda-core-2",
    question: "Function, Handler, aur Runtime me kya difference hai?",
    options: [
      "Teeno same cheez ke alag naam hain",
      "Function = deployment unit (code+config+role); Handler = entry point jo invoke hota hai; Runtime = language execution environment",
      "Handler ek billing unit hai, Runtime ek IAM role hai",
      "Function sirf Python me hota hai, Handler sirf Node.js me",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — teeno distinct concepts hain jo ek saath function bundle banate hain. Option A galat hai, ye teeno alag responsibilities cover karte hain. Option C in terms ko galat define karta hai. Option D bhi galat hai — sabhi runtimes me function/handler concept same tarah kaam karta hai.",
    difficulty: "easy",
  },
  {
    id: "lambda-core-3",
    question: "Lambda kis scenario me sabse zyada financial sense banata hai?",
    options: [
      "24x7 consistently high sustained traffic ke liye",
      "Spiky ya unpredictable, low-to-moderate traffic workloads ke liye",
      "Long-running batch jobs jo ghanton chalte hain",
      "Jab OS kernel level control chahiye",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — idle time me zero cost hone ki wajah se spiky/unpredictable traffic pe Lambda EC2 se sasta padta hai. Option A galat hai kyunki sustained high traffic pe EC2/Fargate zyada cost-effective ho sakte hain. Option C galat hai — 15 min max timeout ki wajah se Lambda long batch jobs ke liye designed hi nahi hai. Option D galat hai kyunki Lambda me underlying OS ka control nahi milta.",
    difficulty: "medium",
  },
  {
    id: "lambda-core-4",
    question: "Agar ek production Lambda function purani, deprecated runtime pe chal raha hai, to kya risk hai?",
    options: [
      "Function immediately delete ho jaata hai",
      "Kuch nahi hota, deprecated runtimes forever chalti rehti hain",
      "Naye function creation us runtime pe block ho jaate hain aur existing functions ko eventually force-upgrade ki deadline milti hai",
      "Billing automatically double ho jaati hai",
    ],
    correctIndex: 2,
    explanation: "Sahi jawab C hai — AWS deprecated runtimes pe naya function creation block karta hai aur existing functions ke liye upgrade deadlines announce karta hai, jo agar ignore kiya jaaye to last-minute scramble bana sakta hai. Option A aur D galat facts hain. Option B galat hai kyunki AWS periodically runtimes deprecate karta hai.",
    difficulty: "medium",
  },
];

export default quiz;
