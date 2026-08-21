import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "s3lab-1",
    question:
      "`aws s3api delete-bucket` `BucketNotEmpty` error deta hai, lekin console me bucket 0 objects dikha raha hai. Kya check karoge?",
    options: [
      "Bucket policy — shayad delete permission missing hai",
      "Object versions, delete markers, aur incomplete multipart uploads — teeno console/LIST me chhup sakte hain, especially incomplete uploads",
      "Bucket region galat set hai",
      "Bucket ka naam kisi aur account ne le rakha hai",
    ],
    correctIndex: 1,
    explanation:
      "Teen cheezein bucket ko 'non-empty' rakh sakti hain chahe console 0 objects dikhaye: object versions (agar versioning kabhi on thi), delete markers, aur incomplete multipart uploads — jo LIST API me bilkul nahi dikhte. Poora cleanup in teeno ko explicitly check aur delete/abort karna padta hai. Option A galat hai — ye ek different error class hai (AccessDenied), BucketNotEmpty nahi. Options C aur D is error message ka typical cause nahi hain.",
    difficulty: "medium",
  },
  {
    id: "s3lab-2",
    question:
      "Systematic AccessDenied debugging checklist me, agar bucket SSE-KMS use kar raha hai, to bucket policy aur IAM identity policy dono sahi hone ke bawajood access kyun fail ho sakta hai?",
    options: [
      "SSE-KMS objects kabhi bhi cross-account access nahi de sakte",
      "KMS key ki apni key policy me us principal ko `kms:Decrypt` allow nahi kiya gaya ho sakta — ye teesra, alag se check hone wala permission layer hai",
      "SSE-KMS ke saath ListBucket permission automatically revoke ho jaati hai",
      "Object Ownership hamesha SSE-KMS ke saath 'Object writer' par reset ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "SSE-KMS encrypted objects ke liye ek additional, independent permission layer hai — KMS key ki apni key policy — jo `s3:GetObject` allow karne ke bawajood alag se `kms:Decrypt` grant maangti hai. Ye debugging checklist ka step 5 hai aur sabse common miss hai jo AccessDenied deta hai jo dekhne me bucket policy ka lagta hai. Options A, C, aur D factually galat statements hain jo S3/KMS ke actual behaviour ko misrepresent karte hain.",
    difficulty: "hard",
  },
  {
    id: "s3lab-3",
    question:
      "S3 bill investigation me Cost Explorer 'Usage Type' breakdown me `TimedStorage` badha hai lekin object count same hai. Sabse likely cause kya hai?",
    options: [
      "Koi naya bucket bana diya gaya",
      "Versioning on hai aur purane (noncurrent) versions jamā ho rahe hain — current object count same rehta hai lekin har version storage le raha hai",
      "CloudFront cache miss rate badh gayi",
      "Gateway VPC endpoint remove ho gaya",
    ],
    correctIndex: 1,
    explanation:
      "Ye ek classic symptom-to-cause mapping hai: agar storage badh raha hai lekin (current) object count nahi badh raha, to sabse likely reason versioning hai — har overwrite ek nayi noncurrent version create karta hai jo bill me count hoti hai lekin `aws s3 ls` (jo sirf current versions dikhata hai) me nazar nahi aati. Option A is symptom se directly connect nahi hota. Option C DataTransfer-Out badhayega, TimedStorage nahi. Option D NatGateway line item badhayega, S3 ka TimedStorage nahi.",
    difficulty: "medium",
  },
  {
    id: "s3lab-4",
    question:
      "S3 ko FUSE se filesystem ki tarah mount karna kis workload ke liye sabse risky hai?",
    options: [
      "Read-heavy, sequential access, bade files (jaise ML training data)",
      "Write-heavy ya randomly-accessed workloads jahan multiple processes ek hi file ko modify kar sakte hain",
      "Log files ko process karna",
      "Ek baar likhi gayi, kabhi na badalne wali archive files padhna",
    ],
    correctIndex: 1,
    explanation:
      "S3 mount (Mountpoint for S3) filesystem semantics jaise atomic rename, file locking, aur partial writes ko emulate nahi kar sakta — write-heavy ya random-access workloads me ye leak ho jaata hai: renames non-atomic (COPY+DELETE) hote hain, koi file locking nahi hai (multiple writers = silent corruption ka risk), aur har write poora object re-upload karta hai. Options A, C, aur D sab wahi patterns hain jinke liye S3 mounting explicitly designed/recommended hai — read-heavy, sequential, large-file access.",
    difficulty: "easy",
  },
];

export default quiz;
