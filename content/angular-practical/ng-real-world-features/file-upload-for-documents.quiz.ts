import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "file-upload-for-documents-1",
    question: "`FormData` se file POST karte waqt `Content-Type` header kya set karna chahiye?",
    options: [
      "`multipart/form-data`",
      "Kuch nahi — browser khud `multipart/form-data; boundary=...` set karta hai; manually set karne se `boundary` missing ho jaata hai aur server parse nahi kar paata",
      "`application/json`",
      "`application/octet-stream`",
    ],
    correctIndex: 1,
    explanation:
      "`FormData` ke saath browser ko `Content-Type` khud set karne do. Manual header `boundary` ke bina hota hai, jisse server multipart body parse nahi kar paata (400 / empty file).",
    difficulty: "medium",
  },
  {
    id: "file-upload-for-documents-2",
    question: "Upload progress bar ke liye `HttpClient` call me kya chahiye?",
    options: [
      "`observe: 'body'`",
      "`observe: 'events'` + `reportProgress: true` — phir Observable `HttpEventType.UploadProgress` events (`loaded`/`total`) emit karta hai, aur end me `HttpEventType.Response`",
      "Ek alag WebSocket",
      "`responseType: 'blob'`",
    ],
    correctIndex: 1,
    explanation:
      "Default `observe: 'body'` sirf final response deta hai. `observe: 'events'` + `reportProgress: true` se aapko progress events milte hain jinse `Math.round(100 * loaded / total)` calculate karke bar bharte hain.",
    difficulty: "medium",
  },
  {
    id: "file-upload-for-documents-3",
    question: "Client-side file validation (`accept`, type/size check) kaisa safeguard hai?",
    options: [
      "Poora security — server ko check nahi karna padta",
      "Sirf UX/convenience — instant feedback deta hai, par server ko independently type, size, aur malware validate karna zaroori hai (client bypass ho sakta hai)",
      "Sirf tab kaam karta hai jab file chhoti ho",
      "Zaroori nahi hai kabhi",
    ],
    correctIndex: 1,
    explanation:
      "`accept` sirf file picker ka hint hai, aur JS checks bypass ho sakte hain (Postman, disabled JS). Client validation acchi UX hai; server par type/size/scan enforce hona hi chahiye.",
    difficulty: "easy",
  },
  {
    id: "file-upload-for-documents-4",
    question: "500 MB file upload karne ke liye best approach kya hai?",
    options: [
      "File ko `FileReader` se base64 me convert karke JSON me bhejo",
      "Apne API se ek pre-signed URL (jaise S3) lo, file ko seedha storage par `PUT` karo (progress events ke saath), phir API ko batao 'done, here's the key' — API server ki bandwidth/memory nahi kharch hoti",
      "Chunk-by-chunk 100 alag JSON requests",
      "Sync XHR use karo",
    ],
    correctIndex: 1,
    explanation:
      "Bade files ko API server ke through proxy karna uski memory/bandwidth waste karta hai. Pre-signed URL se browser seedha storage se baat karta hai; Angular code lagbhag same, sirf target URL alag.",
    difficulty: "medium",
  },
];

export default quiz;
