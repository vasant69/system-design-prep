import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3-mental-model-1",
    question:
      "S3 me console 'reports' folder dikhata hai jisme kuch objects hain. Actually storage layer me ye 'folder' kya hai?",
    options: [
      "Ek real container object jo apne andar child objects ke references rakhta hai",
      "Koi alag object exist nahi karta — ye sirf `Delimiter=/` ke saath LIST karke S3 ne runtime par calculate kiye CommonPrefixes hain",
      "Ek hidden inode jo S3 background me automatically maintain karta hai",
      "Ek DynamoDB table entry jo S3 console apne backend me rakhta hai",
    ],
    correctIndex: 1,
    explanation:
      "S3 flat key-value store hai. 'reports/2026/aug.csv' ek poora key hai; '/' sirf ek character hai. Console 'folders' Delimiter parameter ke saath LIST call karke CommonPrefixes calculate karta hai — koi stored folder object nahi hota. Option A/C/D sab galat hain kyunki wo S3 ko ek hierarchical filesystem samajh rahe hain, jo ye hai nahi.",
    difficulty: "easy",
  },
  {
    id: "s3-mental-model-2",
    question:
      "S3 Standard ki durability 11 nines (99.999999999%) hai. Iska sabse accurate matlab kya hai?",
    options: [
      "S3 hamesha 99.999999999% time available/reachable rahega",
      "Statistically, data loss ki probability itni kam hai ki 10 million objects me se ek khone me ~10,000 saal lagenge — lekin ye accidental deletion se protection nahi deta",
      "Koi bhi object kabhi delete nahi ho sakta, chahe API call kiya jaaye",
      "S3 ka SLA guarantee karta hai ki har request 99.999999999% fast hogi",
    ],
    correctIndex: 1,
    explanation:
      "Durability aur availability alag guarantees hain — availability (99.99% SLA) 'abhi access ho paayega ya nahi' batati hai, durability 'data kho jaayega ya nahi' batati hai (hardware failure ke against). Option A availability ki definition hai, durability ki nahi. Option C galat hai — agar code deleteObject call kare, S3 11 nines reliability ke saath delete kar dega; durability accidental/software deletion se nahi bachati. Option D speed se koi lena dena nahi hai.",
    difficulty: "medium",
  },
  {
    id: "s3-mental-model-3",
    question:
      "Ek team ne S3 keys is format me design kiye: `2026-08-21-14-30-00-<uuid>.json` (timestamp-first). Production me kya problem aa sakti hai?",
    options: [
      "Kuch nahi, S3 keys ka format performance se related nahi hota",
      "Sequential/timestamp-first keys ek hi partition par cluster ho jaate hain, jisse hotspot aur throttling ho sakta hai — jaise SQL me clustered-index hotspot",
      "S3 aise keys ko reject kar dega kyunki numbers se shuru nahi ho sakte",
      "Ye sirf directory buckets me problem hai, general purpose buckets me nahi",
    ],
    correctIndex: 1,
    explanation:
      "S3 keys ko hash karke partitions me distribute karta hai. Timestamp-first sequential keys ek hi time-window ke andar close hote hain, isse ek hi partition par load concentrate ho jaata hai — throttle ho sakta hai. Isliye key design ko performance design maana jaata hai. Option A galat hai (key format directly performance affect karta hai). Option C galat hai — keys numbers se shuru ho sakte hain. Option D bhi galat premise hai.",
    difficulty: "hard",
  },
  {
    id: "s3-mental-model-4",
    question:
      "Ek team har request ke liye EC2 se S3 me file upload/download kar rahi hai aur unke paas legacy code hai jo sirf `fs.readFile()` use karta hai. Wo EFS mount karne ka plan bana rahe hain kyunki 'S3 ka mountable version' lagta hai. Best advice kya hoga?",
    options: [
      "Sahi plan hai, EFS aur S3 functionally identical hain sirf mounting ka fark hai",
      "EFS S3 se roughly ~14x mehnga hai per GB — agar sirf filesystem-style read access chahiye, Mountpoint for Amazon S3 (FUSE-based) consider karo bina poora code rewrite kiye",
      "S3 ko kabhi mount nahi kiya ja sakta, EFS hi ekmatra option hai",
      "EBS use karna chahiye kyunki wo sabse sasta hai",
    ],
    correctIndex: 1,
    explanation:
      "EFS S3 se karib 14x mehnga hai per GB, aur sirf isliye poore data ko EFS pe daalna sirf legacy `fs.readFile()` compatibility ke liye costly galti hai. Mountpoint for Amazon S3 FUSE ke through S3 ko filesystem jaisa mount kar deta hai, khaas kar read-heavy workloads ke liye, bina rewrite ke S3 ki pricing deta hai. Option A galat hai (bahut alag cost/architecture). Option C galat hai, Mountpoint exist karta hai. Option D EBS ka use-case (block storage, single-instance) yahan fit nahi baithta.",
    difficulty: "medium",
  },
];

export default quiz;
