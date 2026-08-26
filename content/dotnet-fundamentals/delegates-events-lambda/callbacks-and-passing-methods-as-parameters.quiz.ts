import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "callbacks-1",
    question: "Callback aur event me sabse fundamental difference kya hai?",
    options: [
      "Callback sirf static methods ke liye hota hai, event instance methods ke liye",
      "Callback direct, one-off, one-to-one hota hai (caller explicitly ek method pass karta hai); event broadcast, one-to-many hota hai (publisher ko pata nahi kaun subscribe kiya hai)",
      "Callback sirf void return kar sakta hai, event kuch bhi return kar sakta hai",
      "Koi fundamental difference nahi hai, dono ek hi cheez hain",
    ],
    correctIndex: 1,
    explanation:
      "Callback ek direct, explicit relationship hai — caller ek specific method pass karta hai ek specific call ke liye ('jab khatam ho, mujhe wapas call karo'). Event broadcast hai — publisher ko koi idea nahi kitne ya kaun subscribers hain, kabhi bhi naye subscribers add ho sakte hain independently. Options A, C, D sab galat/irrelevant distinctions hain.",
    difficulty: "medium",
  },
  {
    id: "callbacks-2",
    question: "`RetryOperation(Action operation, int maxAttempts)` jaisa helper design karne ka fayda kya hai?",
    options: [
      "Ye sirf database operations ke saath kaam karta hai",
      "Ye generic reusable retry logic hai — kisi bhi Action-shaped operation ke saath use ho sakta hai, business logic se decoupled",
      "Ye automatically multi-threaded execution deta hai",
      "Ye sirf exceptions ko silently swallow karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Callback pattern ka poora point yahi hai — `RetryOperation` ko koi idea nahi kya operation actually karta hai (API call, DB save, kuch bhi), ye sirf generic 'kisi bhi Action ko N baar retry karo' logic hai. Isse same retry logic multiple, unrelated operations ke saath reuse ho sakta hai. Options A, C, D sab factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "callbacks-3",
    question: "`DownloadFile(url, ReportProgress)` — yahan `ReportProgress` ek named method hai, lambda nahi. Ye syntax valid hai kya?",
    options: [
      "Nahi, sirf lambda ya delegate instance pass ho sakta hai, named method directly nahi",
      "Haan — ye 'method group' conversion hai, compiler automatically named method ko matching delegate type me convert kar deta hai",
      "Sirf agar ReportProgress static method ho tabhi valid hai",
      "Sirf .NET Framework me valid tha, .NET Core me removed ho gaya",
    ],
    correctIndex: 1,
    explanation:
      "C# 'method group conversion' allow karta hai — koi bhi named method (static ya instance, jab tak signature match kare) directly delegate parameter me pass ho sakta hai bina lambda wrap kiye. Compiler automatically isse matching delegate type me convert kar deta hai. Options A, C, D sab is feature ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "callbacks-4",
    question: "Ek method `Action<int>? onProgress = null` optional callback parameter leta hai. Agar caller callback pass na kare aur method andar `onProgress(50)` seedha call kare (bina null-conditional ke), kya hoga?",
    options: [
      "Kuch nahi hoga, method silently skip ho jaayega",
      "`NullReferenceException` aayega kyunki onProgress null hai",
      "Compile error aayega",
      "Default empty callback automatically invoke ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "Agar caller ne optional callback pass nahi kiya, `onProgress` `null` hoga. Usse seedha `onProgress(50)` call karna (bina `?.Invoke()` ya null-check ke) `NullReferenceException` throw karega. Safe pattern hai `onProgress?.Invoke(50)`. Options A, C, D sab galat hain — ye ek genuine runtime exception scenario hai jo `?.` se avoid hota hai.",
    difficulty: "easy",
  },
];

export default quiz;
