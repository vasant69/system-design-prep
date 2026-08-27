import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3-version-1",
    question: "Versioned bucket me bina version ID diye DELETE call karne se kya hota hai",
    options: [
      "Object permanently aur immediately delete ho jaata hai",
      "Ek delete marker banta hai as new current version, purane versions still exist karte hain",
      "S3 error deta hai, version ID mandatory hai versioned bucket me",
      "Sirf metadata delete hota hai, actual data unaffected rehta hai automatically visible",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — ek delete marker naya current version ban jaata hai, isse GET 404 dega lekin purane sabhi versions physically bucket me hi rehte hain. Option 1 galat hai, ye permanent delete nahi hai. Option 3 galat hai, S3 error nahi deta, delete marker create karta hai. Option 4 confusing aur galat hai, object logically inaccessible ho jaata hai default GET se.",
    difficulty: "easy",
  },
  {
    id: "s3-version-2",
    question: "Aaj ek team ne apne bucket pe Cross-Region Replication enable ki jisme already 5 TB data hai. Existing 5 TB data ka kya hoga",
    options: [
      "Automatically kuch hi minutes me replicate ho jaayega",
      "Kuch nahi hoga, sirf enable-karne-ke-baad ke naye writes replicate honge — purana data ke liye S3 Batch Replication chalana padega",
      "Replication enable hi nahi hogi jab tak existing data manually delete na karo",
      "Automatically replicate hoga lekin sirf Standard storage class ke objects ke liye",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — replication retroactive nahi hoti, sirf enable hone ke baad ke naye writes cover karti hai; existing data ke liye explicitly S3 Batch Replication job chalana padta hai. Option 1 galat hai, ye ek common misconception hai jo interview me trap ke roop me pucha jaata hai. Option 3 aur 4 dono galat/fabricated constraints hain jo actual S3 behavior nahi hai.",
    difficulty: "medium",
  },
  {
    id: "s3-version-3",
    question: "Versioning ko Enabled state se kaise 'off' kiya ja sakta hai",
    options: [
      "Direct 'Disable' option se, poora Unversioned state me wapas",
      "Sirf Suspend kiya ja sakta hai, purane versions rehte hain aur naye writes phir se non-versioned ho jaate hain",
      "Bucket ko delete karke naya bina-versioning bucket banana padega",
      "AWS Support ticket khol ke unhe request karni padegi",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — versioning ek one-way door hai, Enabled se sirf Suspended ho sakti hai, poora Unversioned state me kabhi wapas nahi ja sakti. Option 1 galat hai, aisa direct disable option exist nahi karta. Option 3 practically extreme aur galat approach hai jo actual mechanism nahi hai. Option 4 galat hai, ye ek self-service setting hai.",
    difficulty: "medium",
  },
  {
    id: "s3-version-4",
    question: "S3 Replication ke liye source aur destination bucket pe kaunsi prerequisite mandatory hai",
    options: [
      "Dono buckets same AWS account me hone chahiye",
      "Dono buckets pe versioning enabled honi chahiye",
      "Dono buckets same storage class use kar rahe hone chahiye",
      "Destination bucket empty hona chahiye replication enable karne se pehle",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — replication kaam hi nahi karti jab tak source aur destination dono buckets pe versioning enabled na ho. Option 1 galat hai, cross-account replication bhi supported hai. Option 3 galat hai, destination alag storage class use kar sakta hai. Option 4 galat constraint hai, aisi koi mandatory requirement nahi.",
    difficulty: "medium",
  },
];

export default quiz;
