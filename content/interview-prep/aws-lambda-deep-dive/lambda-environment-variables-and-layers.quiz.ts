import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lambda-env-layers-1",
    question: "Ek developer database password ko environment variable me directly likh deta hai. Ye risky kyun hai?",
    options: [
      "Environment variables ka size limit sirf 128 bytes hota hai",
      "`lambda:GetFunctionConfiguration` permission wala koi bhi principal console ya API se plaintext value dekh sakta hai",
      "Environment variables cold start pe automatically delete ho jaate hain",
      "Environment variables sirf Python runtime me support hote hain",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — environment variables at rest encrypted hote hain, lekin GetFunctionConfiguration/GetFunction call unhe decrypt karke plaintext return karta hai, isliye ye permission rakhne wala koi bhi secret dekh sakta hai. Option 1 galat hai kyunki limit 4 KB hai, 128 bytes nahi. Option 3 galat hai, env vars persist karte hain jab tak version change na ho. Option 4 galat hai, sabhi runtimes support karte hain.",
    difficulty: "medium",
  },
  {
    id: "lambda-env-layers-2",
    question: "Ek function ke deployment package me 5 layers already attached hain aur combined unzipped size 240 MB hai. Ek naya 15 MB ka layer add karne ki koshish ki jaaye to kya hoga?",
    options: [
      "Successfully add ho jaayega, koi limit nahi hai",
      "Fail hoga kyunki max 5 layers ki limit already reach ho chuki hai aur 255 MB total 250 MB limit se zyada hai",
      "Purana layer automatically remove ho jaayega naye ke liye",
      "Sirf warning aayega, deployment phir bhi ho jaayega",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — do independent limits violate ho rahe hain: max 5 layers per function (already at limit), aur combined unzipped size 250 MB (240+15=255 MB exceed karta hai). Option 1 aur 4 galat hain kyunki ye hard limits hain, warning nahi. Option 3 galat hai, AWS automatically kuch remove nahi karta.",
    difficulty: "medium",
  },
  {
    id: "lambda-env-layers-3",
    question: "Team ek shared logging layer ko version 2 se version 3 me update karti hai (security fix ke saath). 10 functions is layer ka version 2 use kar rahe hain. Kya hoga?",
    options: [
      "Sabhi 10 functions automatically version 3 pe migrate ho jaayenge",
      "Version 2 delete ho jaayega aur sabhi functions break ho jaayenge",
      "Version 2 aur version 3 dono independently exist karte hain — functions jab tak explicitly re-point na kiye jaayen, version 2 hi use karte rahenge",
      "Sirf sabse recently deployed function auto-update hoga",
    ],
    correctIndex: 2,
    explanation: "Sahi jawab option 3 hai — layer versions immutable hain, naya version banane se purana delete nahi hota, aur koi automatic propagation nahi hai. Har function ka config manually version 3 ke ARN pe point karna padega. Option 1, 2, aur 4 sab galat hain kyunki koi automatic migration ya deletion nahi hota.",
    difficulty: "hard",
  },
  {
    id: "lambda-env-layers-4",
    question: "Secrets Manager se secret fetch karne ka sabse efficient pattern kaunsa hai jo cold start aur per-invocation cost dono ko balance kare?",
    options: [
      "Har invocation ke start me handler ke andar naya SecretsManagerClient banao aur fetch karo",
      "INIT phase (handler ke bahar) me client banao, pehli invocation pe secret fetch karke module-level variable me cache karo, agli invocations me cached value reuse karo",
      "Secret ko directly environment variable me plaintext store karo taaki fetch hi na karna pade",
      "Har request ke liye naya Lambda function deploy karo jisme secret hardcoded ho",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — INIT phase me client creation aur first-fetch caching se warm invocations me API call avoid hota hai, jo latency aur cost dono bachaata hai. Option 1 galat hai, har invocation pe naya client aur fetch expensive hai. Option 3 galat hai, plaintext env var secrets ke liye insecure hai. Option 4 galat aur impractical hai.",
    difficulty: "easy",
  },
];

export default quiz;
