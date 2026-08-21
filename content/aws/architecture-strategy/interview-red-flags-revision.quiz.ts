import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "flags-1",
    question:
      "Interviewer ek unfamiliar topic pooch leta hai jo candidate ne apne project me use nahi kiya. Sabse strong response kya hai?",
    options: [
      "Guess laga ke ek confident-sounding answer de dena, taaki 'nahi pata' na lage",
      "'Sir, isko maine apne project me use nahi kiya. Mera understanding ye hai ki X, but main confident nahi hoon — main isko padhunga.'",
      "Topic ko avoid karke turant subject badal dena",
      "Bolna ki 'ye topic interview me relevant hi nahi hai'",
    ],
    correctIndex: 1,
    explanation:
      "Honestly limitation acknowledge karna aur ek tentative understanding dena — ye seniority ka signal hai, kyunki galat answer confidently dena ye predict karta hai ki production me bhi galat decisions confidently liye jaayenge. Option A sabse bada red flag hai jo is topic me specifically call out kiya gaya hai. Option C aur D dono evasive hain aur interviewer ko negative impression dete hain — avoid karna khud ek red flag hai.",
    difficulty: "easy",
  },
  {
    id: "flags-2",
    question:
      "\"DNS propagation me 24-48 ghante lagte hain\" statement ko red flag kyun mana jaata hai, aur sahi reframe kya hai?",
    options: [
      "Ye statement sahi hai, koi reframe zaroori nahi",
      "Route 53 khud ~60 seconds me propagate ho jaata hai; delay actually downstream resolvers ki TTL-based cached entries ki wajah se hota hai",
      "Propagation time hamesha exactly 24 ghante hota hai, 48 nahi",
      "Ye statement sirf private hosted zones ke liye sach hai",
    ],
    correctIndex: 1,
    explanation:
      "Route 53 API status ~60 seconds me INSYNC ho jaata hai — matlab AWS ke saare nameservers pe change turant propagate ho jaata hai. Jo delay observed hota hai wo downstream resolvers (jaise ISP DNS) ki cached entries ki wajah se hai, jo unke TTL tak purana answer serve karte rehte hain. Option A galat hai — statement khud ek common myth hai. Option C bhi galat hai, ek fixed number nahi hai ye. Option D irrelevant hai, public/private zone se koi lena dena nahi.",
    difficulty: "medium",
  },
  {
    id: "flags-3",
    question:
      "Behavioural red flags me se, sirf 'what' batana aur 'why' na batana kis example se best illustrate hota hai?",
    options: [
      "'CloudFront ek CDN hai' (what) vs 'maine CloudFront isliye lagaya kyunki S3 website endpoint HTTPS support nahi karta' (why)",
      "'CloudFront mehnga hai' vs 'CloudFront sasta hai'",
      "'Maine CloudFront use kiya' vs 'maine CloudFront use nahi kiya'",
      "Dono statements same hain, koi farq nahi",
    ],
    correctIndex: 0,
    explanation:
      "'CloudFront ek CDN hai' ek definition hai — factually correct but reasoning nahi dikhata. 'Maine CloudFront isliye lagaya kyunki S3 website endpoint HTTPS support nahi karta aur custom domain pe SSL chahiye tha' reasoning hai — ye batata hai ki decision kyun liya gaya. Interviewer specifically reasoning sunna chahta hai, sirf definition nahi. Options B, C, aur D koi bhi is what-vs-why distinction ko illustrate nahi karte.",
    difficulty: "medium",
  },
  {
    id: "flags-4",
    question:
      "Lambda ke bounce/complaint rate thresholds (SES ke context me) revision sheet me kya hain — kaunsa pair sahi hai?",
    options: [
      "Bounce rate: 5% review / 10% pause; Complaint rate: 0.1% review / 0.5% pause",
      "Bounce rate: 1% review / 2% pause; Complaint rate: 0.5% review / 1% pause",
      "Bounce rate: 10% review / 20% pause; Complaint rate: 1% review / 2% pause",
      "Ye thresholds SES me exist hi nahi karte",
    ],
    correctIndex: 0,
    explanation:
      "SES ke revision numbers ke hisaab se, bounce rate 5% pe review trigger hoti hai aur 10% pe sending pause ho jaata hai; complaint rate 0.1% pe review aur 0.5% pe pause. Ye numbers isliye yaad rakhne chahiye kyunki ye directly explain karte hain ki bounce/complaint handling pipeline (SNS + Lambda + suppression list) kyun zaroori hai — na banayi jaaye to sending accidentally pause ho sakti hai. Options B, C, aur D sab galat numbers ya galat claim hain.",
    difficulty: "hard",
  },
];

export default quiz;
