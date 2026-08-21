import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3ver-1",
    question:
      "S3 ka consistency model December 2020 me kya bana, aur ek important caveat kya hai jo log bhool jaate hain?",
    options: [
      "Saare operations strongly consistent ho gaye — object data aur bucket-level configuration dono par, bina koi exception ke",
      "Object data (PUT/GET/LIST) strongly read-after-write consistent ho gaya, lekin bucket-level configuration (policy, lifecycle, CORS) abhi bhi eventually consistent hai",
      "Sirf naye objects par strong consistency mili, overwrites/deletes abhi bhi eventually consistent hain",
      "Consistency sirf us-east-1 region me improve hui, baaki regions same reh gaye",
    ],
    correctIndex: 1,
    explanation:
      "December 2020 me AWS ne object data (saare operations — PUT, GET, LIST, overwrites, deletes) ko strongly consistent bana diya, saare regions me, bina extra cost ke. Lekin bucket-level configuration jaise policy, lifecycle rules, CORS, aur replication config abhi bhi eventually consistent hain — ye distinction interview me strong signal deta hai. Option A galat hai kyunki configuration abhi bhi eventual hai. Option C purana (2020 se pehle) behaviour describe karta hai. Option D factually galat hai — ye global change tha, region-specific nahi.",
    difficulty: "medium",
  },
  {
    id: "s3ver-2",
    question:
      "Versioned bucket me `DeleteObject` (bina version ID diye) call karne se kya hota hai?",
    options: [
      "Object permanently delete ho jaata hai, saare versions ke saath",
      "Ek delete marker create hota hai jo latest version ban jaata hai — object GET me 'gayab' dikhta hai lekin sab versions maujood rehte hain",
      "Sirf latest version delete hota hai, purane versions automatically promote ho jaate hain",
      "Error aata hai — versioned bucket me bina version ID DeleteObject call hi nahi kar sakte",
    ],
    correctIndex: 1,
    explanation:
      "Versioning on hone par DeleteObject actually kuch delete nahi karta — ek delete marker naye 'latest version' ke roop me insert ho jaata hai. Normal GET is marker ko dekh kar 404 return karta hai, jisse object 'gayab' lagta hai, lekin saare purane versions physically maujood rehte hain. Marker ko uske version ID se delete karne par object wapas visible ho jaata hai. Options A, C, aur D sab galat hain — koi permanent delete nahi hota aur koi error bhi nahi aata.",
    difficulty: "easy",
  },
  {
    id: "s3ver-3",
    question:
      "CRR (Cross-Region Replication) configure kiya gaya ek bucket par jisme pehle se 500 GB data tha. Kuch hafton baad DR bucket me sirf naya data hai, purana 500 GB missing hai. Kya wajah hai?",
    options: [
      "Replication role ki IAM permissions expire ho gayi",
      "Replication sirf configuration lagane ke baad ki NAYI writes par apply hoti hai — pre-existing objects replicate nahi hote, unke liye S3 Batch Replication alag se chalana padta hai",
      "Destination bucket ki storage class galat set thi",
      "RTC (Replication Time Control) disabled tha",
    ],
    correctIndex: 1,
    explanation:
      "Ye replication ka ek intentional gap hai jo bahut common confusion create karta hai: replication configuration sirf us waqt ke baad hone wali writes par lagti hai, existing objects automatically replicate nahi hote. Purana data copy karne ke liye S3 Batch Replication job alag se chalana zaroori hai. Options A aur C possible issues hain lekin diye gaye specific symptom (sirf purana data missing, naya theek se aa raha) ka classic reason nahi hain. Option D RTC ka matlab galat samajh raha hai — RTC sirf SLA/timing deta hai, replication scope nahi badalta.",
    difficulty: "hard",
  },
  {
    id: "s3ver-4",
    question:
      "2024 se pehle, do concurrent PUT requests ek hi S3 key par bhej di jaayein to kya hota tha?",
    options: [
      "S3 automatically dono ko merge kar deta tha",
      "Second request `412 PreconditionFailed` ke saath reject ho jaati thi",
      "Last writer wins — jo request pehle write karti hai wo silently lost ho jaati hai, koi error nahi milta",
      "S3 automatically dono versions ko alag version ID de deta, versioning off ho tab bhi",
    ],
    correctIndex: 2,
    explanation:
      "2024 se pehle S3 me koi atomic compare-and-swap primitive nahi tha — concurrent writes 'last writer wins' the, aur jo pehli write overwrite ho jaati thi wo silently lost ho jaati thi, bina kisi error ke. Ye tabhi fix hua jab conditional writes (IfNoneMatch Aug 2024, IfMatch Nov 2024) aaye, jo `412 PreconditionFailed` return karte hain jab condition match nahi karti. Option A galat hai (koi merging nahi hoti). Option B sirf conditional writes ke saath sach hai, default behaviour nahi. Option D galat hai — versioning off hone par sirf ek current object rehta hai.",
    difficulty: "medium",
  },
];

export default quiz;
