import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "file-upload-kyc-documents-1",
    question:
      "Extension allowlist aur declared `ContentType` check pass ho gaye. Magic-byte signature sniff phir bhi kyun zaroori hai?",
    options: [
      "Kyunki magic bytes file ko chhota kar dete hain",
      "Kyunki `FileName` aur `ContentType` dono client-controlled hain — `virus.exe` ko `photo.jpg` naam dena trivial hai; signature sniff hi asli content batata hai",
      "Kyunki EF Core migration ke bina file save nahi hoti",
      "Kyunki Kestrel bina signature ke request reject kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`IFormFile.FileName` aur `IFormFile.ContentType` request me client ne bheje hain, server ne verify nahi kiye. Attacker koi bhi extension aur MIME claim kar sakta hai. File ke pehle kuch bytes (PDF `25 50 44 46`, PNG `89 50 4E 47`, JPEG `FF D8 FF`) padh kar hi pata chalta hai file asli me kya hai. Option A galat hai, sniff size nahi badalta. Option C aur D galat hain, ye framework checks nahi hain.",
    difficulty: "medium",
  },
  {
    id: "file-upload-kyc-documents-2",
    question:
      "Bytes disk pe save karte waqt file ka naam kaise decide karna chahiye?",
    options: [
      "Seedha `Path.Combine(folder, file.FileName)` — client ka bheja naam use karo",
      "Ek naya stored name generate karo (`Guid` + validated extension); client ka original naam sirf metadata row me display ke liye rakho",
      "Client ke naam ke aage timestamp laga do, baaki wahi rakho",
      "File ka SHA-256 hash naam banao aur extension hata do",
    ],
    correctIndex: 1,
    explanation:
      "Client ka `FileName` disk path me daalna path-traversal deta hai (`..\\..\\appsettings.json`) aur overwrite/collision risk. Ek `Guid`-based stored name (`3f2a...9c.pdf`) traversal impossible bana deta hai aur collision practically zero. Original naam `Path.GetFileName` se saaf karke sirf `OriginalFileName` column me jaata hai. Option A directly vulnerable hai. Option C me bhi client ke path parts reh jaate hain. Option D extension hata dega to download pe content type set karna mushkil aur duplicate content alag files ko clash kara sakta hai.",
    difficulty: "medium",
  },
  {
    id: "file-upload-kyc-documents-3",
    question:
      "Ye do approaches me farak kya hai jab 100 log ek saath 5 MB files upload karte hain?\nA: `await file.CopyToAsync(memoryStream)` phir save\nB: `file.OpenReadStream()` se seedha target `FileStream` me `CopyToAsync`",
    options: [
      "Koi farak nahi, dono same",
      "A me har request poori file RAM me leti hai (100 x 5 MB spike, OutOfMemory risk); B constant ~80 KB buffer me stream karta hai",
      "B slower hai kyunki disk seek zyada hota hai",
      "A zyada secure hai kyunki memory me scan kar sakte ho",
    ],
    correctIndex: 1,
    explanation:
      "`CopyToAsync(memoryStream)` poori file ko process memory me buffer karta hai. Concurrency ke saath ye multiply hota hai aur OOM ho sakta hai. Seedha stream-to-`FileStream` (`CopyToAsync` with ~81920-byte buffer) memory ko flat rakhta hai chaahe file kitni bhi badi ho. Option A galat, memory profile bilkul alag hai. Option C galat, streaming generally same ya better throughput deta hai. Option D galat, scan disk pe ya quarantine folder me bhi ho sakta hai.",
    difficulty: "medium",
  },
  {
    id: "file-upload-kyc-documents-4",
    question:
      "KYC PDF/photo files kahan store karni chahiye production BFSI API me?",
    options: [
      "SQL Server `varbinary(max)` column me, taaki metadata ke saath ek hi transaction rahe",
      "Disk ya blob storage (S3 / Azure Blob) me bytes; DB me sirf pointer + metadata row",
      "`wwwroot/uploads/` me, taaki direct URL se serve ho jaayein",
      "`launchSettings.json` me base64 string ke roop me",
    ],
    correctIndex: 1,
    explanation:
      "Bade files `varbinary(max)` me DB size, backup time aur buffer pool sab kharab karte hain. Bytes disk/blob pe jaate hain, DB me sirf `StoredFileName`/blob key + size + content type. Multi-instance prod me local disk share nahi hota, isliye S3/Azure Blob (lifecycle/retention, encryption, cross-instance). Option A scale pe worst hai. Option C web-servable path pe uploaded content rakhna RCE risk hai. Option D absurd hai, `launchSettings.json` deploy hi nahi hoti.",
    difficulty: "easy",
  },
];

export default quiz;
