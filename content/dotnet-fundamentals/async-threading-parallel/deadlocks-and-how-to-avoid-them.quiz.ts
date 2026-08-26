import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "deadlocks-1",
    question: "Ye code WPF button-click handler me chalaya jaata hai: `var result = GetDataAsync().Result;` jahan `GetDataAsync` andar `await Task.Delay(1000)` karta hai bina `ConfigureAwait(false)` ke. Kya hoga?",
    options: [
      "1 second baad normally complete ho jaayega",
      "Turant `NullReferenceException` aayega",
      "UI thread hamesha ke liye hang ho jaayega — deadlock",
      "Compile error aayega",
    ],
    correctIndex: 2,
    explanation:
      "`.Result` UI thread ko block karta hai. Andar ka `await` (bina `ConfigureAwait(false)`) usi UI thread pe resume hone ke liye context capture karta hai. Lekin UI thread already `.Result` me block hai, kabhi free nahi hoga continuation chalane ke liye — dono ek dusre ka wait karte reh jaate hain, permanent deadlock. Option A galat hai kyunki ye exact scenario deadlock create karta hai. Option B galat hai — koi null reference involved nahi hai. Option D galat hai — ye valid, compiling code hai, runtime behavior problematic hai.",
    difficulty: "hard",
  },
  {
    id: "deadlocks-2",
    question: "Is deadlock ko fix karne ka sabse correct/recommended tarika kya hai?",
    options: [
      "`.Result` ko `.Wait()` se replace karna",
      "`Task.Delay` ko hata dena",
      "Poori call chain me `await` use karna, `.Result`/`.Wait()` bilkul avoid karna",
      "Method ko `static` bana dena",
    ],
    correctIndex: 2,
    explanation:
      "`await` calling thread ko block nahi karta — control caller ko return ho jaata hai, aur completion pe continuation queue ho jaata hai. Ye root-cause fix hai. Option A galat hai — `.Wait()` bhi same tarah blocking hai, koi improvement nahi. Option B galat hai — `Task.Delay` sirf ek example hai, koi bhi awaited operation same problem create karega. Option D irrelevant hai — `static` hone se koi fark nahi padta.",
    difficulty: "medium",
  },
  {
    id: "deadlocks-3",
    question: "Ye exact deadlock scenario ASP.NET Core (modern, .NET Core+) me typically kyun nahi hota?",
    options: [
      "ASP.NET Core async/await support hi nahi karta",
      "ASP.NET Core me koi request-bound SynchronizationContext nahi hai, isliye continuation kisi bhi available thread pe resume ho sakta hai",
      "ASP.NET Core automatically `.Result` calls ko `await` me convert kar deta hai",
      "ASP.NET Core single-threaded hai isliye deadlock hi possible nahi",
    ],
    correctIndex: 1,
    explanation:
      "Classic ASP.NET (System.Web) request-bound `SynchronizationContext` maintain karta tha. ASP.NET Core ne isko hata diya — continuation kisi bhi thread-pool thread pe resume ho sakta hai, isliye 'continuation ko wahi specific blocked thread chahiye' wala circular wait nahi banta. Options A aur C dono factually galat hain. Option D bhi galat hai — ASP.NET Core multi-threaded hai, single-threaded nahi.",
    difficulty: "hard",
  },
  {
    id: "deadlocks-4",
    question: "`ConfigureAwait(false)` ko deadlock fix ke roop me use karte waqt sabse bada risk kya hai?",
    options: [
      "Ye fix hi nahi karta, sirf ek myth hai",
      "Har awaited call ki transitive chain me isko lagana zaroori hai — ek bhi miss hone se deadlock wapas aa sakta hai",
      "Ye performance ko drastically slow kar deta hai",
      "Ye sirf .NET Framework me kaam karta hai, .NET Core me nahi",
    ],
    correctIndex: 1,
    explanation:
      "`ConfigureAwait(false)` sirf us specific `await` ke liye context-capture skip karta hai jahan wo lagaya gaya hai. Agar call chain ke kisi bhi deeper method me koi `await` isse miss karta hai, wo `await` phir se original context capture kar sakta hai aur deadlock wapas trigger kar sakta hai — isliye ye ek fragile fix hai poore chain me consistency maangta hai. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
