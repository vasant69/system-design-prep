import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cmp-1",
    question:
      "Interviewer poochta hai \"Amplify kyun nahi use kiya, wo bhi to yahi kaam karta hai?\" Sabse strong response kya hai?",
    options: [
      "Amplify ek weak/buggy service hai isliye avoid kiya",
      "Amplify internally S3+CloudFront hi use karta hai; deliberately underlying components (cache policies, OAC, TTL, invalidation) khud samajhne ke liye direct choose kiya, but SSR ya fast team CI/CD chahiye hoti to Amplify better hota",
      "Amplify sirf mobile apps ke liye hai, web ke liye nahi",
      "Amplify AWS ka naya service hai isliye stable nahi maana",
    ],
    correctIndex: 1,
    explanation:
      "Sahi answer pattern ye hai: pehle Amplify ki genuine strength acknowledge karo (wo yahi stack internally use karta hai, built-in CI/CD deta hai), phir specific reason do (learning goal — underlying components samajhna), aur phir bolo ki kis scenario me Amplify actually better hota. Option A factually galat hai aur dismissive lagta hai. Option C bhi galat hai — Amplify web hosting ke liye bhi widely use hota hai. Option D bhi ek weak, unsupported claim hai.",
    difficulty: "medium",
  },
  {
    id: "cmp-2",
    question:
      "CloudFront lagane se cost 'badhta nahi, kam hota hai' — ye counter-intuitive claim kis fact pe based hai?",
    options: [
      "CloudFront khud free hai, koi charge hi nahi lagta",
      "S3-se-CloudFront data transfer free hai jabki S3-se-internet direct transfer per GB charge hota hai, aur cache hits se S3 requests bhi kam hoti hain",
      "CloudFront S3 storage cost automatically waive kar deta hai",
      "CloudFront use karne pe AWS ek discount credit deta hai",
    ],
    correctIndex: 1,
    explanation:
      "S3-to-CloudFront data transfer AWS ke andar free hai, jabki S3 se seedha internet pe transfer ~$0.09/GB charge hota hai. Iske upar, cache hits ki wajah se S3 pe actual requests bhi 85%+ kam ho jaati hain, jisse request-based cost bhi girta hai. Option A galat hai — CloudFront ka apna pricing hai (free tier ke baad), bas is specific data-transfer path free hai. Option C aur D dono fictional mechanisms hain jo AWS actually offer nahi karta.",
    difficulty: "hard",
  },
  {
    id: "cmp-3",
    question:
      "Lambda vs EC2/Fargate ka decision sabse zyada kis factor pe depend karta hai?",
    options: [
      "Kaunsa service pehle seekha gaya tha",
      "Traffic pattern — spiky/low traffic Lambda ke liye favorable hai, steady/high throughput EC2 ya Fargate ke liye",
      "Sirf team ki preference, technical factor koi nahi",
      "Programming language — Lambda sirf Python support karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Lambda ka economics traffic pattern pe depend karta hai: idle cost zero hone ki wajah se spiky/low/unpredictable traffic pe clearly sasta hai, lekin constantly high aur steady traffic (jaise 24 ghante 5,000 req/s) pe per-request pricing add up hoke EC2 with Savings Plans ya Fargate se mehnga pad sakta hai. Option A aur C dono non-technical, irrelevant factors hain jo interview me weak signal dete hain. Option D factually galat hai — Lambda multiple languages (Python, Node.js, Java, Go, etc.) support karta hai.",
    difficulty: "medium",
  },
  {
    id: "cmp-4",
    question:
      "Self-hosted SMTP server ko \"option hi nahi hai\" kyun bola jaata hai (SES/SendGrid ke against compare karte waqt)?",
    options: [
      "Kyunki SMTP protocol deprecated ho chuka hai",
      "Kyunki EC2 pe outbound port 25 by default blocked hota hai, aur naye IP ki reputation zero se banana hafton ka kaam hai",
      "Kyunki AWS self-hosted SMTP server allow hi nahi karta kisi bhi service pe",
      "Kyunki self-hosted SMTP sirf enterprise-tier accounts ke liye available hai",
    ],
    correctIndex: 1,
    explanation:
      "EC2 instances pe outbound port 25 by default blocked hota hai (spam prevention ke liye), aur even agar unblock ho bhi jaaye, IP reputation zero se build karna — jisse mailbox providers naye IP ko default suspicious treat na karein — hafton ka operational kaam hai. Option A factually galat hai, SMTP abhi bhi widely used protocol hai. Option C bhi galat hai — ye ek networking default hai, blanket ban nahi. Option D bhi ek fictional constraint hai.",
    difficulty: "medium",
  },
];

export default quiz;
