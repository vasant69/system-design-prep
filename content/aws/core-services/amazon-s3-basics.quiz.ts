import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3b-1",
    question: "S3 me `photos/2024/goa.jpg` dikh raha hai. Isko kaise samjhna sahi hai?",
    options: [
      "'photos' aur '2024' alag folder objects hain, aur 'goa.jpg' unke andar hai",
      "Ye ek hi flat object hai jiski poori key 'photos/2024/goa.jpg' hai — koi alag folder object exist nahi karta",
      "S3 automatically ek filesystem-like directory tree maintain karta hai",
      "Ye teen alag objects hain jo S3 automatically link karta hai",
    ],
    correctIndex: 1,
    explanation:
      "S3 ek key-value store hai, filesystem nahi. Poori string 'photos/2024/goa.jpg' ek single object ki key hai. Console me 'folder' jaisa jo dikhta hai wo sirf UI ka rendering hai key me maujood '/' characters ka. Isliye folder rename jaisa operation exist nahi karta. Options A, C, aur D sab ye galat maante hain ki S3 me actual hierarchy/directory objects hain.",
    difficulty: "easy",
  },
  {
    id: "s3b-2",
    question: "Ek bucket ka data har hafte access hota hai. Standard-IA me shift karna sahi rahega ya nahi?",
    options: [
      "Haan, IA hamesha sasta hota hai kyunki per-GB storage price kam hai",
      "Nahi — frequently accessed data (jaise weekly) pe IA ka retrieval fee aur 30-din minimum duration ki wajah se total cost Standard se zyada ho sakta hai",
      "Haan, kyunki IA me koi retrieval fee lagta hi nahi",
      "Isse koi farak nahi padta, dono classes same price ki hoti hain",
    ],
    correctIndex: 1,
    explanation:
      "IA sasti sirf per-GB storage price me hai — usme retrieval fee bhi hota hai aur 30 din ka minimum billable duration bhi. Agar data weekly access hota hai, retrieval charges bar bar lagenge aur total cost Standard se zyada ho sakta hai. Sirf per-GB price dekhna interview me weak answer maana jaata hai — total cost of ownership dekhna chahiye. Options A, C aur D sab galat premises hain.",
    difficulty: "medium",
  },
  {
    id: "s3b-3",
    question: "CloudFront ke saath OAC use karke bucket private rakhna hai. Kaunsa S3 endpoint use karna chahiye?",
    options: [
      "Website endpoint, kyunki wo index.html auto-serve karta hai",
      "REST endpoint, kyunki OAC sirf REST endpoint ke saath kaam karta hai — website endpoint HTTP-only hai aur bucket public maangta hai",
      "Dono endpoints OAC ke saath equally kaam karte hain",
      "Koi bhi endpoint chalega, OAC endpoint-agnostic hai",
    ],
    correctIndex: 1,
    explanation:
      "Website endpoint sirf HTTP support karta hai aur bucket ko public hona zaroori hai — dono hi OAC ke goals (private bucket, HTTPS) ke against hain. REST endpoint HTTPS support karta hai aur OAC ke saath kaam karta hai, isliye production setups me REST endpoint + CloudFront + OAC combination use hota hai. Options A, C, D sab is incompatibility ko miss karte hain.",
    difficulty: "medium",
  },
  {
    id: "s3b-4",
    question: "Versioning enabled bucket me ek object ko bina version ID diye DELETE kiya. Kya hota hai?",
    options: [
      "Object turant aur permanently delete ho jaata hai",
      "Kuch nahi hota, DELETE silently ignore ho jaata hai",
      "Object actually delete nahi hota — ek 'delete marker' version create hoti hai jo latest ban jaati hai, aur GET pe 404 aata hai",
      "Saare purane versions bhi automatically delete ho jaate hain",
    ],
    correctIndex: 2,
    explanation:
      "Versioning ON hone par bina version ID ke DELETE ek naya 'delete marker' version banata hai jo latest ban jaata hai — isse GET karne pe 404 milta hai lekin underlying object data safe rehta hai. Us delete marker ko delete karke object wapas recover kiya ja sakta hai. Sirf specific version ID ke saath DELETE karne se hi permanent, irreversible deletion hoti hai. Options A, B, D sab is behaviour ko galat describe karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
