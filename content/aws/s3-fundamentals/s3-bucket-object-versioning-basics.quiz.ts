import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3-bucket-versioning-1",
    question:
      "S3 console me `list-objects-v2 --prefix 'reports/' --delimiter '/'` chalane par `CommonPrefixes: [\"reports/2025/\", \"reports/2026/\"]` milta hai. Ye kya represent karta hai?",
    options: [
      "Do real directory objects jo S3 ne store kiye hain",
      "Runtime par calculate kiye gaye prefix groupings — koi 'reports/2025/' naam ka object actually exist nahi karta",
      "Cached folder metadata jo S3 background me maintain karta hai",
      "Ye sirf directory buckets me kaam karta hai, general purpose buckets me nahi",
    ],
    correctIndex: 1,
    explanation:
      "CommonPrefixes S3 ne LIST request ke waqt Delimiter parameter ke saath runtime par calculate kiye — koi stored 'folder' object nahi hota. Namespace flat hai. Option A aur C galat hain kyunki wo S3 ko hierarchical filesystem samajh rahe hain. Option D galat hai — ye general purpose buckets me hi standard behaviour hai (directory buckets me real hierarchy hoti hai, ye alag cheez hai).",
    difficulty: "easy",
  },
  {
    id: "s3-bucket-versioning-2",
    question:
      "Ek versioned bucket me `DeleteObject` bina version ID diye call kiya gaya. Actually kya hota hai?",
    options: [
      "Object permanently delete ho jaata hai, jaise unversioned bucket me hota",
      "Ek 'delete marker' create hota hai jo latest version ban jaata hai — normal GET 404 dega, lekin purane versions maujood rahenge aur billed hote rahenge",
      "Request fail ho jaata hai kyunki versioned bucket me version ID mandatory hai",
      "Object doosri storage class me automatically move ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Versioned bucket me unqualified DeleteObject actual data delete nahi karta — ek delete marker daal deta hai jo latest version ban jaata hai. GET 404 dega lekin sab versions still exist karte hain aur billed hote hain. Delete marker hata do to object wapas aa jaata hai. Permanent delete ke liye version ID specify karna padta hai. Option A galat hai (ye unversioned bucket ka behaviour hai). Option C galat hai — request succeed hoti hai, sirf ek marker create hoti hai. Option D irrelevant hai.",
    difficulty: "medium",
  },
  {
    id: "s3-bucket-versioning-3",
    question:
      "Ek team roz 1 GB report file ko same key par overwrite kar rahi hai, aur versioning enabled hai, lekin koi lifecycle rule nahi hai. 30 din baad storage bill kaisa dikhega?",
    options: [
      "Sirf latest version ka storage bill hoga, ~1 GB",
      "Roughly ~30 GB — har overwrite purani version ko poori tarah retain karta hai, aur ye purane versions `aws s3 ls` me invisible hote hue bhi billed hote hain",
      "S3 automatically duplicate data ko deduplicate kar dega, bill kam rahega",
      "Versioning bill par koi asar nahi daalti, sirf recovery ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "Versioning har overwrite ki purani copy poori tarah retain karti hai, diff store nahi karti. 30 roz overwrites = ~30 GB storage, jo `aws s3 ls` (sirf current version dikhata hai) me invisible rehta hai lekin fully billed hota hai. Isliye versioning enable karte hi NoncurrentVersionExpiration lifecycle rule lagana zaroori hai. Option A galat hai (purani versions bhi billed hoti hain). Option C galat hai, S3 aisi deduplication nahi karta. Option D directly galat hai.",
    difficulty: "medium",
  },
  {
    id: "s3-bucket-versioning-4",
    question:
      "80 MB aur 3 GB ke do alag uploads hain. Multipart upload ke baare me sahi statement kaunsa hai?",
    options: [
      "80 MB ke liye multipart mandatory hai, 3 GB ke liye optional hai",
      "3 GB ke liye multipart abhi bhi optional hai (5 GB hard limit se neeche), lekin 100 MB threshold se bade hone ki wajah se recommended hai — network glitch par poora upload dobara karne se bachne ke liye",
      "Dono ke liye multipart mandatory hai kyunki dono 5 MB se bade hain",
      "Dono ke liye single PutObjectCommand hi sahi approach hai, multipart sirf 5 GB se upar zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "Single PUT ki hard limit 5 GB hai — 3 GB isse neeche hai, isliye technically single PUT allowed hai, lekin 100 MB se bada hone ki wajah se multipart recommended hai (network failure par poora upload dobara karne ke bajaye sirf failed part retry hota hai). 80 MB bhi 100 MB threshold se neeche hai isliye single PUT reasonable hai, mandatory multipart nahi. Option A galat direction me hai. Option C galat hai — 5 MB koi threshold nahi hai jo mandatory banaye. Option D galat hai kyunki 100 MB+ ke liye multipart strongly recommended hai chahe technically optional ho.",
    difficulty: "hard",
  },
];

export default quiz;
