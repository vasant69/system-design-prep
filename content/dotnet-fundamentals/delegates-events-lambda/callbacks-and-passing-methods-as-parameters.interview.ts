import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "callbacks-tr-1",
    question: "Callback kya hota hai C# me?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Ek method jo parameter ki tarah pass kiya jaata hai (delegate/Func/Action ke through) taaki receiving method usse sahi time pe invoke kar sake.",
    detailedAnswer:
      "Callback koi separate language feature nahi hai — ye delegates ka ek usage pattern hai. Caller ek method (named method, lambda, ya delegate instance) doosre method ko pass karta hai, aur receiving method us callback ko apni logic ke andar kisi specific point pe invoke karta hai — jaise completion signal karna, progress report karna, ya ek customizable step allow karna.",
    followUp: "Callback aur event me kya fark hai?",
  },
  {
    id: "callbacks-tr-2",
    question: "Callback aur event me practical fark kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Callback direct, one-off, one-to-one hai — caller explicitly ek method pass karta hai. Event broadcast, one-to-many hai — publisher ko pata nahi kaun subscribe kiya hai.",
    detailedAnswer:
      "`ProcessOrder(order, onSuccess, onError)` ek callback hai — caller ne EXPLICITLY, directly ye methods pass kiye ek specific call ke liye. Agar iske bajaye `OrderService` ek `event OrderProcessed` expose karta, koi bhi, kabhi bhi, kahin bhi subscribe kar sakta — decoupled, potentially many unrelated subscribers. Simple rule: exact, known caller-response chahiye to callback; multiple independent parts ko react karna ho bina ek doosre ko jaane, to event.",
  },
  {
    id: "callbacks-tr-3",
    question: "Callback pass karne ke teen tarike kya hain, aur inme kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Custom delegate type, built-in Func/Action, ya method group syntax (named method directly pass karna).",
    detailedAnswer:
      "1) Custom delegate (`public delegate void ProgressCallback(int percent);`) — self-documenting naam, lekin extra type declare karna padta hai. 2) `Func<>`/`Action<>` — concise, koi naya type declare nahi karna, modern code me most common. 3) Method group syntax — ek already-existing named method directly pass karna (`DownloadFile(url, ReportProgress)`), compiler automatically matching delegate type me convert kar deta hai, koi lambda wrap karne ki zaroorat nahi.",
  },
  {
    id: "callbacks-tr-4",
    question: "Ye code kya karega?\n```csharp\nvoid ReportProgress(int percent) => Console.WriteLine($\"{percent}%\");\nDownloadFile(\"url\", ReportProgress);\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "`ReportProgress` method group conversion ke through directly delegate parameter me pass ho jaata hai — DownloadFile jab bhi isse invoke karega, progress print hoga.",
    detailedAnswer:
      "Ye method group conversion ka example hai — `ReportProgress` ek already-defined named method hai jiska signature `DownloadFile`'s callback parameter (jaise `Action<int>`) se match karta hai. Compiler automatically isse matching delegate instance me convert kar deta hai, bina explicit lambda (`p => ReportProgress(p)`) likhe. Functionally dono equivalent hain.",
  },
  {
    id: "callbacks-tr-5",
    question: "Ek optional callback parameter (`Action<int>? onProgress = null`) ko safely invoke karne ka sahi tareeka kya hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "`onProgress?.Invoke(percent);` — null-conditional operator use karo, seedha `onProgress(percent)` call karne se null hone par NullReferenceException aa sakta hai.",
    detailedAnswer:
      "Agar caller ne optional callback pass nahi kiya, parameter default `null` hoga. `onProgress(percent)` seedha call karna, agar `onProgress` null hai, `NullReferenceException` throw karega. `onProgress?.Invoke(percent)` safely check karta hai — null hone par kuch nahi hota, warna callback invoke hota hai. Ye events ke `?.Invoke()` pattern jaisa hi hai.",
    redFlag: "Optional callback parameters ko bina null-check/null-conditional ke seedha invoke karna — production code me ye ek common NullReferenceException source hai jab caller callback pass karna optional samajhta hai.",
  },
  {
    id: "callbacks-tr-6",
    question: "Ek retry helper `RetryOperation(Action operation, int maxAttempts)` design karo jo koi bhi operation N baar retry kare failure pe. Iski design philosophy kya hai callback ke context me?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "RetryOperation ko operation ke andar kya ho raha hai uska koi idea nahi hota — sirf 'kisi bhi Action ko N baar retry karo' generic logic hai, jo callback pattern ki poori reusability value demonstrate karta hai.",
    detailedAnswer:
      "```csharp\npublic static void RetryOperation(Action operation, int maxAttempts = 3)\n{\n    for (int attempt = 1; attempt <= maxAttempts; attempt++)\n    {\n        try { operation(); return; }\n        catch when (attempt < maxAttempts) { /* log and continue */ }\n    }\n}\n```\nYahan `operation` business-logic-agnostic hai — API call ho, DB save ho, kuch bhi ho, `RetryOperation` ko fark nahi padta. Yahi callback pattern ka core value proposition hai: control-flow logic (retry karna) aur actual work (operation kya karta hai) ko decouple karna.",
  },
  {
    id: "callbacks-tr-7",
    question: "Kya callback aur higher-order function ek hi cheez hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Related hain lekin same nahi — higher-order function ek broader concept hai (koi bhi function jo function accept ya return kare), callback usme se ek specific, common use-case hai (function ko parameter ki tarah pass karna, invoke karne ke liye).",
    detailedAnswer:
      "Higher-order function ek functional-programming term hai jo kisi bhi function ko describe karta hai jo (a) function(s) ko parameter ki tarah accept kare, aur/ya (b) ek function return kare. Callback specifically pehla case hai — ek function jo parameter ki tarah pass hota hai taaki receiving method use invoke kar sake. `Where(Func<T, bool>)` bhi technically higher-order function hai jo ek callback (predicate) accept karta hai.",
  },
  {
    id: "callbacks-tr-8",
    question: "Deeply nested callbacks ('callback hell') se kaise bacha ja sakta hai modern C# me?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "`async`/`await` use karo asynchronous completion-signaling ke liye — ye deeply nested callback chains ko linear, sequential-looking code me convert kar deta hai.",
    detailedAnswer:
      "Pehle (jaise .NET 1.1 ke Asynchronous Programming Model me) async operations callback-chains ke through compose hote the — ek callback ke andar doosra callback, doosre ke andar teesra, jo readability ko significantly kharab kar sakta tha. `async`/`await` (C# 5.0) ne isse solve kiya — compiler internally state machine generate karta hai, lekin developer sequential, readable code likhta hai (`var result = await SomeAsyncOperation();`). Callback pattern khud galat nahi hai — chaining ki depth aur readability issue hai jo async/await largely eliminate karta hai.",
    followUp: "Kya callbacks aaj bhi kahin genuinely zaroori hain, async/await ke bawajood?",
  },
];

export default questions;
