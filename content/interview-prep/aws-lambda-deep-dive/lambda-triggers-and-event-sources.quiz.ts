import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lambda-triggers-1",
    question: "S3 ObjectCreated event se trigger hua Lambda kis category me aata hai?",
    options: [
      "Synchronous",
      "Asynchronous",
      "Poll-based",
      "Ye ek invalid trigger type hai",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — S3 events asynchronous category me aate hain, S3 event ko queue karke aage badh jaata hai, Lambda service khud 2 automatic retries karti hai. Option A galat hai kyunki S3 caller (uploader) response ka wait nahi karta. Option C galat hai kyunki S3 me Lambda service khud kuch poll nahi karti, S3 push karta hai. Option D bilkul galat hai.",
    difficulty: "easy",
  },
  {
    id: "lambda-triggers-2",
    question: "SQS-triggered Lambda me agar message processing baar baar fail ho raha ho, to kya hota hai?",
    options: [
      "Message turant permanently delete ho jaata hai",
      "Visibility timeout khatam hone ke baad message wapas queue me visible hota hai, aur maxReceiveCount cross hone pe DLQ me jaata hai",
      "Lambda service automatically 2 retries karti hai jaise async invocation me",
      "SQS queue turant paused ho jaati hai",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — poll-based invocation me retry semantics source (SQS) ki visibility timeout aur DLQ config pe depend karte hain, na ki Lambda ke apne async retry mechanism pe. Option A aur D galat facts hain. Option C galat hai kyunki 2-automatic-retries wala rule specifically asynchronous invocation ke liye hai, SQS poll-based ke liye nahi.",
    difficulty: "medium",
  },
  {
    id: "lambda-triggers-3",
    question: "Async invocation (jaise SNS se trigger) me agar Lambda function baar baar fail ho jaaye, to failed event ka kya hota hai agar DLQ/destination configure na ho?",
    options: [
      "Event forever retry hota rehta hai",
      "Event 2 automatic retries ke baad silently drop ho jaata hai, koi trace nahi milta",
      "Event automatically SQS me chala jaata hai bina configuration ke",
      "Lambda function automatically disable ho jaata hai",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — bina DLQ ya on-failure destination configure kiye, 2 retries fail hone ke baad event permanently drop ho jaata hai, jo debugging mushkil bana deta hai. Option A galat hai, retries finite hain (default 2). Option C galat hai kyunki DLQ/destination explicitly configure karna padta hai, automatic nahi hai. Option D bilkul galat fact hai.",
    difficulty: "medium",
  },
  {
    id: "lambda-triggers-4",
    question: "EventBridge ka Lambda ke saath dohra (double) use case kya hai?",
    options: [
      "Sirf scheduled/cron-jaisi invocations ke liye",
      "Sirf error logging ke liye",
      "Scheduled invocations aur pattern-matched event bus routing dono",
      "Sirf DynamoDB Streams ko replace karne ke liye",
    ],
    correctIndex: 2,
    explanation: "Sahi jawab C hai — EventBridge scheduled rules (cron-like periodic invocation) aur event bus pattern matching (AWS service ya custom application events route karna) dono kaam karta hai. Option A aadha sahi hai lekin incomplete hai. Option B galat hai — EventBridge logging service nahi hai. Option D galat hai, ye alag services hain jo replace nahi karte ek doosre ko.",
    difficulty: "medium",
  },
];

export default quiz;
