import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dtos-1",
    question: "Entity ko directly `[HttpPost]` action parameter banane ka sabse bada security risk kya hai?",
    options: [
      "Compilation slow ho jaati hai",
      "Over-posting — client extra/internal fields bhi apne request me bhej sakta hai jo unintentionally set ho jaate hain",
      "Entity classes automatically public ho jaati hain",
      "Database migrations fail hone lagti hain",
    ],
    correctIndex: 1,
    explanation:
      "Agar entity directly model-bind hoti hai, model binder request body ke saare matching fields set kar deta hai — jisme internal/sensitive fields (jaise approval status, computed scores) bhi shamil ho sakte hain jo client ko set nahi karne chahiye. Ye over-posting attack hai. Options A, C, D sab factually galat/unrelated hain is risk se.",
    difficulty: "medium",
  },
  {
    id: "dtos-2",
    question: "Request aur response ke liye alag-alag DTOs banane ki sabse strong justification kya hai?",
    options: [
      "Alag DTOs hamesha performance better deti hain",
      "Request aur response ki fields/shape independently evolve karti hain — ek shared DTO future me refactor karna painful ban jaata hai",
      "C# compiler ek hi DTO ko dono directions me use karne nahi deta",
      "Ye sirf ek naming convention hai, koi real benefit nahi",
    ],
    correctIndex: 1,
    explanation:
      "Request aur response DTOs ki zaroorat time ke saath alag directions me diverge kar sakti hai (jaise response me computed/derived fields chahiye jo request me na ho) — shared DTO rakhne se future changes messy ho jaate hain. Option A galat hai, ye primarily performance ka concern nahi hai. Option C factually galat hai — C# me technically ek hi type reuse ho sakti hai, ye design choice hai compiler restriction nahi. Option D galat hai, ye ek genuine architectural benefit hai.",
    difficulty: "medium",
  },
  {
    id: "dtos-3",
    question: "`[ApiController]` attribute hone par, agar ek DTO ka `[Required]` field missing ho request body me, kya hota hai?",
    options: [
      "Action method run hota hai, dto property null hoti hai",
      "Framework automatically 400 Bad Request return kar deta hai, action method body chalta hi nahi",
      "App crash ho jaata hai unhandled exception ke saath",
      "Field silently default value le leti hai, koi error nahi",
    ],
    correctIndex: 1,
    explanation:
      "[ApiController] attribute automatic model-state validation enable karta hai — agar DataAnnotations validation fail ho (jaise Required field missing), framework khud action method chalne se pehle hi 400 response de deta hai. Option A galat hai, action body tak pahunchta hi nahi. Option C galat hai, ye graceful validation hai, crash nahi. Option D bhi galat hai, silent default nahi hota, explicit validation error milta hai.",
    difficulty: "medium",
  },
  {
    id: "dtos-4",
    question: "Manual mapping vs AutoMapper-style mapping ke beech is topic ka opinionated rule of thumb kya hai?",
    options: [
      "Hamesha AutoMapper use karo, manual mapping outdated hai",
      "Hamesha manual mapping use karo, AutoMapper kabhi use nahi karna chahiye",
      "Chhote DTOs ke liye manual mapping (explicit, debuggable), bade complex object graphs ke liye tool-assisted mapping consider karo",
      "Dono equally acceptable hain, koi context-based recommendation nahi di gayi",
    ],
    correctIndex: 2,
    explanation:
      "Topic explicitly ek context-based recommendation deta hai: chhote, simple DTOs ke liye manual mapping better hai (explicit, debug-friendly); bade object graphs ke liye jahan boilerplate genuinely zyada ho jaaye, tool-assisted mapping worth ho sakti hai. Options A aur B dono absolute statements hain jo topic ki actual guidance se match nahi karte. Option D galat hai, ek clear opinionated stance diya gaya hai.",
    difficulty: "medium",
  },
];

export default quiz;
