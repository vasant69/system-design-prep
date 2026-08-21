import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "iam-ugm-1",
    question:
      "Access key rotation ke steps me purani key ko turant delete karne ke bajaye pehle 'Inactive' kyun kiya jaata hai?",
    options: [
      "Inactive karna delete karne se sasta hai",
      "Inactive status reversible hai — agar monitoring window me koi consumer abhi bhi purani key use kar raha nikle, ek CLI command se wapas Active kiya ja sakta hai bina naya key generate kiye",
      "AWS directly delete allow hi nahi karta, pehle Inactive karna mandatory step hai",
      "Inactive karna access key ko permanently secure bana deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Inactive-first approach reversibility deta hai — agar 24-48 hour monitoring window me pata chale ki koi forgotten consumer abhi bhi purani key use kar raha hai, use ek command se wapas Active kiya ja sakta hai, naya rotation cycle shuru kiye bina. Delete karne ke baad ye wapas laana possible nahi hai. Option A galat hai — pricing ka issue nahi hai. Option C galat hai — AWS directly delete allow karta hai, ye best-practice hai mandatory step nahi. Option D galat hai, ye security se related nahi, operational safety se related hai.",
    difficulty: "easy",
  },
  {
    id: "iam-ugm-2",
    question:
      "Ek policy me `\"Condition\": {\"Bool\": {\"aws:MultiFactorAuthPresent\": \"true\"}}` (bina IfExists ke) ke saath Allow lagaya gaya hai. EC2 instance role se aane wali request ka kya hoga?",
    options: [
      "Allow milega, kyunki EC2 roles automatically MFA-verified maane jaate hain",
      "Deny milega (implicit), kyunki EC2 instance role requests me aws:MultiFactorAuthPresent key maujood hi nahi hoti aur plain Bool operator missing key ko match nahi kar pata",
      "Allow milega kyunki Bool operator default true maan leta hai",
      "Error aayega, policy invalid hogi",
    ],
    correctIndex: 1,
    explanation:
      "EC2 instance role se aane wali requests me aws:MultiFactorAuthPresent key hoti hi nahi (service-originated request hai, MFA concept applicable nahi). Plain Bool operator (bina IfExists ke) missing key ko match nahi kar pata, isliye condition fail ho jaata hai aur Allow trigger nahi hota — result implicit deny. Isi wajah se BoolIfExists use karna zaroori hota hai jab service-principal requests ko bhi accommodate karna ho. Option A aur C dono galat hain, EC2 roles automatically MFA-verified nahi maane jaate. Option D galat hai, ye syntactically valid policy hai.",
    difficulty: "hard",
  },
  {
    id: "iam-ugm-3",
    question:
      "aws:MultiFactorAuthPresent aur aws:MultiFactorAuthAge condition keys me practical fark kya hai?",
    options: [
      "Dono same cheez check karte hain, sirf naming convention alag hai",
      "MultiFactorAuthPresent batata hai session shuru me MFA use hua tha ya nahi (poori session ke liye true reh sakta hai), jabki MultiFactorAuthAge batata hai MFA kitna purana hai — sensitive actions ke liye freshness check yahi hai",
      "MultiFactorAuthPresent sirf root user ke liye applicable hai, MultiFactorAuthAge sirf IAM users ke liye",
      "MultiFactorAuthAge sirf hardware MFA devices ke saath kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "aws:MultiFactorAuthPresent ek boolean hai jo batata hai AssumeRole/login ke waqt MFA use hua tha ya nahi — ye poori session (jo 12 hours tak ho sakti hai) ke liye true rehta hai, chahe MFA 11 ghante pehle use hua ho. aws:MultiFactorAuthAge (seconds me) batata hai MFA kitna purana hai — production deletion jaisi sensitive actions ke liye isi se 'fresh MFA' enforce kiya jaata hai (jaise MultiFactorAuthAge > 900 par deny). Options C aur D dono galat hain, ye keys device-type ya user-type specific nahi hain.",
    difficulty: "medium",
  },
  {
    id: "iam-ugm-4",
    question:
      "'Deny without MFA' policy likhte waqt NotAction me iam:EnableMFADevice, iam:ChangePassword jaisi actions ko exempt karna kyun zaroori hai?",
    options: [
      "Kyunki ye actions billing se related hain aur MFA check unpe apply hi nahi hota",
      "Warna ek chicken-and-egg problem ban jaata hai — user MFA setup karne ke liye bhi MFA maanga jaayega, jabki abhi tak uske paas MFA hai hi nahi",
      "Kyunki AWS in actions ko automatically exempt kar deta hai, explicitly likhna sirf documentation ke liye hai",
      "Kyunki ye actions sirf root user use kar sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "Agar 'deny without MFA' policy me MFA-setup actions (iam:CreateVirtualMFADevice, iam:EnableMFADevice, iam:ChangePassword, etc.) ko NotAction se exempt na kiya jaaye, to ek naya user jiske paas abhi MFA hai hi nahi, wo apna MFA device enable karne ki koshish bhi nahi kar payega — kyunki wahi action bhi MFA maangega. Ye classic chicken-and-egg lockout hai. Option A galat hai, billing se koi lena dena nahi. Option C galat hai — AWS automatically exempt nahi karta, policy author ko explicitly likhna padta hai. Option D galat hai.",
    difficulty: "medium",
  },
];

export default quiz;
