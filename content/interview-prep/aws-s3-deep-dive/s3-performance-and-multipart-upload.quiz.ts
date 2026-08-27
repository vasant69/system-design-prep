import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3-perf-1",
    question: "S3 ka 3,500 PUT requests per second limit kis level par apply hota hai?",
    options: [
      "Poore AWS account par globally",
      "Har partitioned prefix par — prefixes unlimited hain isliye throughput distribute karke scale kiya ja sakta hai",
      "Poore bucket par ek single fixed limit ke roop me, chahe kitne bhi prefixes ho",
      "Sirf region ke andar ek bar allocate hoti hai poore lifetime ke liye",
    ],
    correctIndex: 1,
    explanation: "Sahi hai — limit har partitioned prefix ke liye alag hai, aur bucket me prefixes unlimited ho sakte hain, isliye keys ko distribute karke linearly scale kiya ja sakta hai. Option A aur D galat hain kyunki limit account-wide ya one-time nahi hai. Option C galat hai kyunki bucket-level single fixed limit nahi hai — ye per-prefix hai.",
    difficulty: "medium",
  },
  {
    id: "s3-perf-2",
    question: "Ek batch job crash ho jaata hai multipart upload ke `CompleteMultipartUpload` call se pehle. Iska kya impact hota hai?",
    options: [
      "S3 automatically kuch minutes ke andar incomplete upload ko delete kar deta hai, koi cost nahi lagti",
      "Uploaded parts S3 me storage consume karte rehte hain aur ye normal object listing me dikhte nahi, jab tak koi AbortIncompleteMultipartUpload lifecycle rule na ho",
      "Poora bucket temporarily locked ho jaata hai jab tak manually clear na kiya jaaye",
      "Koi impact nahi hota kyunki parts memory me hi rehte hain, disk/storage par kabhi save nahi hote",
    ],
    correctIndex: 1,
    explanation: "Sahi hai — incomplete multipart upload parts silently storage bill karte rehte hain aur listing me invisible rehte hain, isliye lifecycle rule (AbortIncompleteMultipartUpload) lagana zaroori hai. Option A galat hai, S3 automatically clean nahi karta. Option C galat hai, bucket lock nahi hota. Option D galat hai, uploaded parts actually S3 storage me physically save hote hain.",
    difficulty: "medium",
  },
  {
    id: "s3-perf-3",
    question: "Bade objects (jaise 2 GB file) upload karte waqt bottleneck typically kya hota hai, aur fix kya hai?",
    options: [
      "Bottleneck request rate hota hai — fix ye hai ki prefixes distribute karo",
      "Bottleneck single TCP connection ka bandwidth limit hota hai (~85-100 MB/s) — fix ye hai ki multipart parallel upload use karo",
      "Bottleneck hamesha S3 ki storage capacity hoti hai — fix koi nahi hai, wait karna padta hai",
      "Bottleneck DNS resolution hoti hai — fix ye hai ki path-style endpoint use karo",
    ],
    correctIndex: 1,
    explanation: "Sahi hai — bade objects ke liye bottleneck ek single connection ka bandwidth hota hai, aur parallel multipart upload se multiple connections use karke isse overcome kiya ja sakta hai. Option A galat hai, chhote objects ke liye request rate bottleneck hota hai na ki bade objects ke liye. Option C aur D galat hain — S3 storage capacity practically unlimited hai aur DNS resolution koi meaningful bottleneck nahi hai is context me.",
    difficulty: "medium",
  },
  {
    id: "s3-perf-4",
    question: "S3 Transfer Acceleration kab enable karna sabse zyada sensible hai?",
    options: [
      "Hamesha, kyunki ye har upload ko automatically faster banata hai",
      "Jab downloads ko cache karke repeated access speed up karna ho",
      "Jab users bucket ke region se geographically dur hain (jaise long-distance/cross-continent uploads), aur speed-test tool se benefit confirm ho chuka ho",
      "Jab bucket me multipart upload use nahi kiya ja raha ho",
    ],
    correctIndex: 2,
    explanation: "Sahi hai — Transfer Acceleration long-distance uploads ke liye faydemand hai jab user bucket ke region se dur ho, aur AWS ka speed-comparison tool test karke confirm karna chahiye. Option A galat hai, ye har situation me faster nahi hota, region-close users ke liye koi ya negative benefit hota hai. Option B galat hai, wo CloudFront ka use case hai, Transfer Acceleration ka nahi. Option D irrelevant hai, multipart upload se koi direct connection nahi hai Transfer Acceleration decision ka.",
    difficulty: "hard",
  },
];

export default quiz;
