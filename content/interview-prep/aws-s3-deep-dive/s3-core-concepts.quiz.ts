import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3-core-1",
    question: "S3 console me 'photos/2024/vacation.jpg' dikhta hai jaise nested folders hon. Actual me ye kaise store hota hai",
    options: [
      "Ek real nested directory tree ke andar, filesystem inodes ke saath",
      "Ek hi flat opaque key string ke roop me, jisme slash sirf ek character hai",
      "Do separate folder objects plus ek file object, teeno linked",
      "Ek database table row jisme path column indexed hota hai",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — poora 'photos/2024/vacation.jpg' ek single flat key string hai, koi real directory structure nahi. Option 1 galat hai kyunki S3 me inodes ya directory tree exist nahi karta. Option 3 galat hai — koi separate 'folder object' automatically nahi banta jab tak explicitly zero-byte object create na karo. Option 4 galat hai, S3 ek object store hai, relational database nahi.",
    difficulty: "easy",
  },
  {
    id: "s3-core-2",
    question: "Aapko ek 20 GB file S3 me upload karni hai. Sahi approach kya hai",
    options: [
      "Single PUT request bhejo, S3 5 TB tak single PUT support karta hai",
      "File ko compress karke 5 GB se neeche lao phir single PUT karo",
      "Multipart Upload use karo, parts ko parallel upload karo",
      "Pehle ek empty 20 GB placeholder object banao phir usme data likho",
    ],
    correctIndex: 2,
    explanation: "Sahi jawab Multipart Upload hai — single PUT ki hard limit 5 GB hai (5 TB nahi, wo overall max object size hai), isliye 20 GB file single PUT se ja hi nahi sakti. Option 1 is galat fact pe based hai ki single PUT 5 TB tak jaata hai. Option 2 practical nahi hai aur zaroorat nahi. Option 4 S3 me koi aisa concept exist nahi karta.",
    difficulty: "medium",
  },
  {
    id: "s3-core-3",
    question: "S3 ka read-after-write consistency model 2026 me kya hai",
    options: [
      "Eventually consistent — kabhi kabhi purana data mil sakta hai turant read pe",
      "Strong consistency sirf naye objects ke liye, overwrites ke liye eventually consistent",
      "Strong read-after-write consistency sabhi operations ke liye, December 2020 se, bina extra cost/config",
      "Consistency region ke hisaab se vary karti hai, kuch regions strong hain kuch eventual",
    ],
    correctIndex: 2,
    explanation: "Sahi jawab option 3 hai — AWS ne December 2020 me S3 ko sabhi operations (new writes, overwrites, deletes) ke liye automatically strongly consistent bana diya, koi extra config ya cost nahi. Options 1 aur 2 purani (pre-2020) information hain jo interview me galat maani jaayegi. Option 4 galat hai, ye behavior sabhi regions me uniform hai.",
    difficulty: "medium",
  },
  {
    id: "s3-core-4",
    question: "Bucket naming ke baare me kaunsa statement sahi hai",
    options: [
      "Bucket name sirf apne AWS account ke andar unique hona chahiye",
      "Bucket name globally unique hona chahiye across saare AWS accounts",
      "Bucket name sirf apne region ke andar unique hona chahiye",
      "Bucket names duplicate ho sakte hain agar unke objects alag hain",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — bucket names globally unique hote hain kyunki wo DNS-compatible URLs banate hain (bucket-name.s3.amazonaws.com), isliye conflict kisi bhi account ke bucket se ho sakta hai. Options 1, 3, aur 4 sab galat scope define karte hain jo actual AWS constraint se match nahi karta.",
    difficulty: "easy",
  },
];

export default quiz;
