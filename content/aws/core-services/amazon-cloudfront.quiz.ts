import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cf-1",
    question:
      "Origin ko analytics ke liye `User-Agent` header chahiye, lekin har browser version ki alag cache entry nahi banni chahiye. Kya karna sahi hai?",
    options: [
      "User-Agent ko Cache Policy me daalo",
      "User-Agent ko Origin Request Policy me daalo, Cache Policy me nahi",
      "User-Agent ko dono policies me daalo",
      "User-Agent forward karna hi possible nahi hai CloudFront se",
    ],
    correctIndex: 1,
    explanation:
      "Cache Policy decide karti hai cache key me kya jaayega — usme User-Agent daalne se har version ki alag entry banegi aur hit ratio tabah ho jaayega. Origin Request Policy sirf origin ko forward karti hai, cache key ko touch nahi karti — ye exact use case ke liye bani hai. Option A hit ratio todta hai. Option C unnecessary hai kyunki origin request policy hi kaafi hai. Option D factually galat hai.",
    difficulty: "hard",
  },
  {
    id: "cf-2",
    question: "CloudFront distribution ke liye ACM certificate kis region me hona chahiye, aur kyun?",
    options: [
      "Origin jis region me hai, usi region me",
      "Distribution create karte waqt jo region select karo, usi me",
      "Hamesha us-east-1 (N. Virginia) me, kyunki CloudFront ek global service hai aur uska control plane us-east-1 me hai",
      "Kisi bhi region me chalega, ACM certs region-agnostic hote hain",
    ],
    correctIndex: 2,
    explanation:
      "CloudFront global service hai aur AWS global services (IAM, CloudFront) ka control plane us-east-1 me rakhta hai — isliye cert wahan hona mandatory hai, origin ka region irrelevant hai. Ye ALB se ulta hai, jahan cert ALB ke apne region me hona chahiye. Option A confuse karta hai ALB ke rule ke saath. Option B galat hai kyunki CloudFront distributions region-less hain. Option D galat hai — ACM certs region-specific hote hain, sirf us-east-1 wale CloudFront ke dropdown me dikhte hain.",
    difficulty: "medium",
  },
  {
    id: "cf-3",
    question: "OAC (Origin Access Control) ki bucket policy me `AWS:SourceArn` condition kyun zaroori hai?",
    options: [
      "Iske bina bucket policy syntactically invalid ho jaati hai",
      "Iske bina koi bhi CloudFront distribution (kisi bhi account ka) us bucket ko read kar sakta hai — confused deputy problem",
      "Ye sirf logging ke liye hai, security se lena dena nahi",
      "Ye sirf SSE-KMS encrypted buckets ke liye zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "Bina SourceArn condition ke, bucket policy sirf 'cloudfront.amazonaws.com' service ko allow karti hai — jiska matlab hai duniya ka koi bhi CloudFront distribution us bucket se read kar sakta hai, na ki sirf aapki distribution. Ye classic confused deputy problem hai. Option A galat hai, policy valid rahegi bas overly permissive hogi. Option C galat hai, ye seedha security control hai. Option D galat hai, ye har OAC setup ke liye best practice hai.",
    difficulty: "hard",
  },
  {
    id: "cf-4",
    question:
      "Deploy ke baad users ko purana JS file dikh raha hai. Best long-term fix kya hai versioning approach me?",
    options: [
      "Har deploy ke baad `/*` invalidate karo",
      "TTL ko permanently 0 rakho saare files ke liye",
      "Build pipeline me content-hash filenames use karo (jaise main.a3f2b1.js) long TTL ke saath, sirf index.html ko short TTL pe rakho",
      "CloudFront distribution delete karke naya banao har deploy pe",
    ],
    correctIndex: 2,
    explanation:
      "Content-hashed filenames matlab naya content = naya URL = naya cache entry automatically, bina invalidation ki zaroorat ke — ye free aur instant hai. Sirf entry point (index.html) ko short/no-cache TTL pe rakhna padta hai kyunki wahi naye hashed files ko reference karta hai. Option A kaam karta hai but costly aur slow hai (invalidation charges + propagation time) aur cache poori khali kar deta hai. Option B latency aur origin load badha dega. Option D bilkul impractical aur destructive hai.",
    difficulty: "medium",
  },
];

export default quiz;
