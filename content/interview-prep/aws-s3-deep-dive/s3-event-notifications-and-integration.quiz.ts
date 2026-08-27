import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3-events-1",
    question: "S3 ka ObjectCreated event notification payload me kya include hota hai?",
    options: [
      "Object ke actual bytes/content, taaki consumer directly process kar sake bina alag GetObject call ke",
      "Sirf metadata — bucket name, object key, event type, timestamp — actual bytes kabhi nahi",
      "Sirf object key, koi aur information nahi hoti",
      "Poora bucket ka listing snapshot",
    ],
    correctIndex: 1,
    explanation: "Sahi hai — event payload me sirf metadata hota hai, consumer ko actual content ke liye alag GetObject call karni padti hai. Option A galat hai kyunki bytes kabhi payload me nahi aate. Option C galat hai, payload me bucket name, event type, timestamp jaisi aur details bhi hoti hain. Option D galat hai, ye ek single object ke event ki information hai, poora bucket listing nahi.",
    difficulty: "easy",
  },
  {
    id: "s3-events-2",
    question: "Ek Lambda `originals/` prefix se ObjectCreated event pe trigger hoke apna processed output bhi `originals/` prefix me hi likh deta hai. Iska sabse likely result kya hoga?",
    options: [
      "Kuch nahi hoga, S3 automatically duplicate events ko detect karke ignore kar dega",
      "Ek infinite loop create hoga jaha har write naya event fire karta hai, jisse invocations aur bill exponentially badhte hain",
      "S3 automatically error throw karega aur write reject kar dega",
      "Lambda sirf ek baar hi trigger hoga chahe output usi prefix me jaaye",
    ],
    correctIndex: 1,
    explanation: "Sahi hai — output aur trigger prefix overlap karne se self-perpetuating infinite loop ban jaata hai, jo exponentially bill badhata hai. Option A galat hai, S3 aisi koi automatic deduplication nahi karta trigger loops ke liye. Option C galat hai, S3 write ko reject nahi karta, ye configuration-level issue hai jise S3 detect nahi karta. Option D galat hai, exactly ye assumption galat hone ki wajah se loop banta hai.",
    difficulty: "hard",
  },
  {
    id: "s3-events-3",
    question: "SNS ko S3 event destination ke roop me kab choose karna best hota hai?",
    options: [
      "Jab sirf ek single consumer ne event process karna ho aur immediate compute chahiye ho",
      "Jab processing rate control karni ho aur ek hi consumer apni speed pe events consume kare",
      "Jab ek hi event ko multiple independent subscribers (jaise alag Lambda functions, email alerts) tak fan-out karna ho",
      "Jab content-based filtering aur cross-account routing chahiye ho",
    ],
    correctIndex: 2,
    explanation: "Sahi hai — SNS fan-out pattern ke liye best hai jaha ek event multiple independent subscribers ko parallel deliver hona chahiye. Option A Lambda ka use case hai. Option B SQS ka use case hai. Option D EventBridge ka use case hai jo sabse flexible content-based routing deta hai.",
    difficulty: "medium",
  },
  {
    id: "s3-events-4",
    question: "Ek infinite-loop trigger incident ke dauraan bill turant rokne ka sabse fast reliable tareeka kya hai?",
    options: [
      "Sirf trigger configuration me prefix filter edit karna",
      "Lambda function ko delete kar dena",
      "Lambda ke execution role se trigger prefix par write permission hata dena, taaki output write hi na ho sake chahe code me bug ho",
      "Bucket ko public bana dena taaki traffic redirect ho jaaye",
    ],
    correctIndex: 2,
    explanation: "Sahi hai — IAM-level write permission hatana loop ko physically impossible bana deta hai, ye code fix se independent aur turant effective hota hai. Option A galat hai kyunki configuration changes propagate hone me time lag sakta hai aur underlying code bug fix nahi hota. Option B extreme hai aur legitimate traffic bhi break kar sakta hai bina root cause address kiye. Option D irrelevant aur dangerous hai, bucket ko public banane ka is problem se koi lena dena nahi.",
    difficulty: "hard",
  },
];

export default quiz;
