import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "iam-caf-1",
    question:
      "GitHub Actions ke liye OIDC trust policy me `sub` condition `StringLike: \"repo:jmfs/*\"` likha gaya. Iska sabse bada risk kya hai?",
    options: [
      "Kuch nahi, wildcard sirf performance improve karta hai",
      "Koi bhi branch — including ek fork se aayi malicious PR — us role ko assume kar sakti hai",
      "Ye syntax hi invalid hai aur trust policy fail ho jaayegi",
      "Ye sirf `main` branch tak automatically restrict ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`sub` claim me repo, branch/environment sab encode hote hain. Wildcard `repo:jmfs/*` matlab us org ki koi bhi repo, koi bhi branch, koi bhi PR (fork se aayi PR bhi) role assume kar sakti hai — ye real supply-chain attack vector raha hai. Option A galat hai, ye security risk hai, performance se lena dena nahi. Option C galat hai, ye valid StringLike syntax hai. Option D galat hai — wildcard restrict nahi karta, broaden karta hai.",
    difficulty: "hard",
  },
  {
    id: "iam-caf-2",
    question:
      "Confused deputy problem ke 'cross-service' flavour ka classic example kya hai, aur uska fix kya hai?",
    options: [
      "Ek IAM user doosre user ki policy copy kar leta hai; fix hai unique policy names",
      "S3 kisi bhi account se tumhare SNS topic ko notify kar sakta hai kyunki service principal generic hai; fix hai aws:SourceAccount + aws:SourceArn",
      "Ek SaaS vendor tumhara role assume kar leta hai attacker ke behalf par; fix hai ExternalId",
      "Root user ki credentials leak ho jaati hain; fix hai MFA",
    ],
    correctIndex: 1,
    explanation:
      "Cross-service confused deputy tab hota hai jab ek AWS service (jaise S3) tumhare resource ko access kar rahi ho aur service principal (s3.amazonaws.com) sabke liye same hone ki wajah se koi bhi account ka bucket tumhara SNS topic notify kar sakta hai. Fix aws:SourceAccount + aws:SourceArn hai. Option C actually cross-account (third-party) flavour hai, cross-service nahi — ye common confusion point hai jo interview me test hota hai. Options A aur D is problem se related hi nahi hain.",
    difficulty: "medium",
  },
  {
    id: "iam-caf-3",
    question:
      "Cross-account access ke liye role assumption ko resource-based policy se generally better kyun mana jaata hai?",
    options: [
      "Resource-based policies sirf S3 me kaam karti hain, kahin aur nahi",
      "Role assumption me ek jagah saari permissions define hoti hain, session duration limit lagti hai, aur CloudTrail me clean AssumeRole audit checkpoint milta hai",
      "Role assumption free hai, resource-based policy paid hai",
      "Resource-based policy sirf same-account access ke liye kaam karti hai",
    ],
    correctIndex: 1,
    explanation:
      "Role assumption centralizes permissions in one role, bounds session duration, adds session-tag/session-policy control, aur ek clean CloudTrail AssumeRole event deta hai audit ke liye. Option A galat hai — kai services (KMS, SQS, SNS, Lambda, etc.) resource-based policies support karti hain. Option C galat hai, dono free hain. Option D galat hai — resource-based policy ka poora point hi cross-account access enable karna hai.",
    difficulty: "medium",
  },
  {
    id: "iam-caf-4",
    question:
      "`aws:SourceArn` condition ke saath policy likhte waqt `StringEquals` use karne ka common gotcha kya hai?",
    options: [
      "StringEquals kabhi kaam hi nahi karta condition keys ke saath",
      "Kai services sirf partial ARN populate karte hain, isliye exact-match StringEquals silently fail ho jaata hai — ArnLike with wildcard safer hai",
      "StringEquals sirf numeric values ke saath kaam karta hai",
      "SourceArn condition sirf ArnEquals ke saath allowed hai, StringEquals se error aata hai",
    ],
    correctIndex: 1,
    explanation:
      "aws:SourceArn sirf tab available hota hai jab calling service usko populate kare, aur alag services alag format bhejte hain — kai baar partial ARN. StringEquals exact match maangta hai, isliye partial ARN par ye fail ho jaata hai aur integration silently toot jaata hai. ArnLike trailing wildcard ke saath safer hai. Option A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
