import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "task-whenall-whenany-1",
    question: "Teen independent API calls hain. Kaunsa approach unhe CONCURRENTLY run karega, sequentially nahi?",
    options: [
      "await CallA(); await CallB(); await CallC();",
      "var t1 = CallA(); var t2 = CallB(); var t3 = CallC(); await Task.WhenAll(t1, t2, t3);",
      "Task.Run(() => { CallA(); CallB(); CallC(); });",
      "CallA().Wait(); CallB().Wait(); CallC().Wait();",
    ],
    correctIndex: 1,
    explanation:
      "Methods ko pehle call karke (bina turant await kiye) unhe start kiya jaata hai — wo turant concurrently execution shuru kar dete hain. Phir sabko ek saath `Task.WhenAll` se await karne se total wait time sabse slow task jitna hota hai, na ki sabka sum. Option A sequential hai — har call previous ke complete hone ka wait karta hai. Option C bhi sequential hai lambda ke andar. Option D blocking hai aur sequential bhi.",
    difficulty: "medium",
  },
  {
    id: "task-whenall-whenany-2",
    question: "`Task.WhenAll` ke saath do tasks fail hote hain, alag exceptions ke saath. `await Task.WhenAll(t1, t2)` ka try/catch block me kya milta hai?",
    options: [
      "Dono exceptions ek saath, ek List<Exception> ke roop me",
      "Sirf pehli exception — baaki dekhne ke liye Task object ka .Exception (AggregateException) explicitly check karna padta hai",
      "Koi exception nahi milta, WhenAll exceptions ko silently swallow kar deta hai",
      "Sirf ek generic 'Multiple failures' message, koi detail nahi",
    ],
    correctIndex: 1,
    explanation:
      "`await Task.WhenAll(...)` readability ke liye sirf pehli exception ko re-throw karta hai apne try/catch me. Poori set of exceptions 'lost' nahi hoti — wo underlying Task object ke `.Exception` property (ek `AggregateException`) me `InnerExceptions` collection ke through accessible rehti hai. Options A, C, D is behavior ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "task-whenall-whenany-3",
    question: "`Task.WhenAny(task1, task2)` me `task1` pehle complete hota hai, lekin ek exception ke saath fail hokar. Kya hota hai?",
    options: [
      "Task.WhenAny turant us exception ko throw kar deta hai",
      "Task.WhenAny us faulted task1 ko return kar deta hai bina exception throw kiye — exception tabhi throw hoga jab task1 ko await karoge",
      "task2 automatically cancel ho jaata hai",
      "Task.WhenAny ek default value return kar deta hai, exception ignore karke",
    ],
    correctIndex: 1,
    explanation:
      "`Task.WhenAny` sirf pehla-complete-hua Task return karta hai (success ya failure dono cases me) — khud koi exception throw nahi karta. Exception tabhi surface hoga jab tum us returned Task ko explicitly `await` karoge. `task2` cancel nahi hota, background me chalta rehta hai jab tak explicitly cancel na kiya jaaye. Options A, C, D galat hain.",
    difficulty: "hard",
  },
  {
    id: "task-whenall-whenany-4",
    question: "Ek timeout pattern implement karna hai — agar `FetchDataAsync()` 5 seconds se zyada le, timeout maan lena. Kaunsa approach sahi hai?",
    options: [
      "await Task.WhenAll(FetchDataAsync(), Task.Delay(5000));",
      "var result = await Task.WhenAny(FetchDataAsync(), Task.Delay(5000)); check karo kaunsa Task complete hua",
      "FetchDataAsync().Wait(5000);",
      "try { await FetchDataAsync(); } catch (TimeoutException) { }",
    ],
    correctIndex: 1,
    explanation:
      "`Task.WhenAny` classic timeout pattern hai — actual work aur ek `Task.Delay` ko race karwana, jo bhi pehle complete ho uske basis par decide karna. Option A galat hai — `WhenAll` dono ke complete hone ka wait karega, jo timeout ka purpose defeat karta hai. Option C `.Wait(timeout)` thread ko block karta hai, non-blocking pattern nahi hai. Option D galat hai kyunki `FetchDataAsync` khud koi `TimeoutException` throw nahi karega jab tak explicitly implement na kiya jaaye.",
    difficulty: "medium",
  },
];

export default quiz;
