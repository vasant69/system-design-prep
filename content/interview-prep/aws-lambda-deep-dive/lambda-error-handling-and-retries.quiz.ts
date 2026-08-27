import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lambda-retries-1",
    question: "Ek Lambda function API Gateway ke peeche synchronously invoke hota hai aur fail ho jaata hai. Lambda kya karega?",
    options: [
      "Automatically 2 baar retry karega jaise async invocations me hota hai",
      "Koi automatic retry nahi karega — error seedha caller ko return hoga, retry logic caller ki responsibility hai",
      "Message ko DLQ me bhej dega",
      "Function ko permanently disable kar dega",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — synchronous invocations (jaise API Gateway ke peeche) me Lambda koi automatic retry nahi karta, error directly caller ko return hota hai. Option 1 galat hai kyunki 2 retries sirf async invocations ke liye hain. Option 3 galat hai, DLQ sirf async/SQS ke liye applicable hai. Option 4 asal me hota hi nahi.",
    difficulty: "easy",
  },
  {
    id: "lambda-retries-2",
    question: "DynamoDB Streams se triggered Lambda function me ek record consistently fail ho raha hai aur `BisectBatchOnFunctionError`/`MaximumRetryAttempts` configure nahi hai. Kya hoga?",
    options: [
      "Wo record automatically skip ho jaayega aur baaki records normally process honge",
      "Poora shard block ho jaayega jab tak wo failing record succeed na ho ya expire na ho jaaye - poison pill problem",
      "Lambda automatically ek DLQ create karega us record ke liye",
      "Stream processing khud-ba-khud disable ho jaayega",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — shard-based ordering ki wajah se by default ek failing record poore batch/shard ki processing ko block kar deta hai jab tak configure na kiya jaaye ki failure ko kaise handle karna hai. Option 1 galat hai bina configuration ke automatic skip nahi hota. Option 3 galat hai kyunki DLQ streams ke liye applicable nahi hai. Option 4 galat hai.",
    difficulty: "hard",
  },
  {
    id: "lambda-retries-3",
    question: "DLQ (Dead Letter Queue) aur Destinations feature me ek badi difference kya hai?",
    options: [
      "DLQ sirf success events capture karta hai, Destinations sirf failure",
      "Destinations success aur failure dono ke liye configure ho sakta hai aur stream-based sources (Kinesis/DynamoDB Streams) ke saath bhi kaam karta hai, jabki DLQ sirf failure aur sirf async/SQS ke liye hai",
      "DLQ newer feature hai, Destinations purana hai",
      "Dono exactly same hain, koi functional difference nahi",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — Destinations zyada powerful hai: success aur failure dono target configure kar sakte ho, richer context milta hai, aur stream sources ke saath bhi kaam karta hai jo DLQ nahi karta. Option 1 reverse hai (galat). Option 3 galat hai, DLQ purana hai Destinations se. Option 4 galat hai, functional differences significant hain.",
    difficulty: "medium",
  },
  {
    id: "lambda-retries-4",
    question: "SQS-triggered Lambda function me duplicate processing se bachne ka sabse reliable pattern kya hai?",
    options: [
      "SQS visibility timeout ko 0 set karo",
      "Har message ke unique ID (jaise transaction ID) ke saath DynamoDB me conditional put try karo - agar already exists to processing skip karo",
      "Lambda ke retry count ko 0 kar do",
      "Function ko synchronous invocation me convert kar do",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — chunki SQS/Lambda at-least-once delivery guarantee dete hain, duplicate events aana normal hai, aur idempotency table (conditional put with attribute_not_exists) is problem ko reliably solve karta hai. Option 1 galat aur dangerous hai (turant duplicate processing badhega). Option 3 retry ko rokta hai lekin duplicate delivery ka root cause solve nahi karta. Option 4 fundamentally invocation model hi badal deta hai, practical nahi.",
    difficulty: "medium",
  },
];

export default quiz;
