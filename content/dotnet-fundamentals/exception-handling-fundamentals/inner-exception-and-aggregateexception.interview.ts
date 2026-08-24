import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "innerex-tr-1",
    question: "`InnerException` ka purpose kya hai, aur ise kab use karte ho?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Ek lower-level exception ko higher-level, meaningful exception me translate karte waqt original ko preserve karne ke liye — koi information lost nahi hoti.",
    detailedAnswer: "Jab ek low-level exception (jaise `SqlException`) caller ke liye directly meaningful nahi hota, use ek domain-level exception (jaise `OrderServiceException`) me wrap karte hain — lekin original exception ko `InnerException` me pass karte hain (`throw new OrderServiceException(msg, sqlEx)`). Iska fayda: caller ek clean, business-meaningful exception catch karta hai, lekin agar debugging ke liye deep detail chahiye, poori original exception (uska stack trace, message, type) `InnerException` chain se accessible rehti hai.",
    followUp: "Ye pattern `throw ex;` se kaise alag hai?",
  },
  {
    id: "innerex-tr-2",
    question: "Ye code kya karega, aur kyun ye ek common production gotcha hai?\n```csharp\ntry\n{\n    await Task.WhenAll(task1, task2, task3);\n}\ncatch (Exception ex)\n{\n    _logger.LogError(ex, \"Batch failed\");\n}\n```\n(maan lo teeno tasks alag reasons se fail hote hain)",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Sirf PEHLE-fail-hue task ka exception log hoga — baaki do failures silently unlogged reh jaayenge, jabki actually teeno failed the.",
    detailedAnswer: "`await Task.WhenAll(...)` catch block me exception ke roop me sirf pehla exception directly deta hai — `ex` yahan ek single exception hai, poora `AggregateException` nahi. Isliye is code me sirf 1 failure log hoga, jabki actually 3 hui thi. Correct fix: `Task.WhenAll(...)` ka result ek `Task` variable me store karo, `await` uspe karo, aur catch block me `task.Exception.Flatten().InnerExceptions` se sab failures individually log karo.",
    redFlag: "Ye maan lena ki `Task.WhenAll` ke saath ek generic `catch (Exception ex)` automatically sab failures capture kar leta hai.",
  },
  {
    id: "innerex-tr-3",
    question: "`AggregateException.Flatten()` kab genuinely zaroori hai, aur ise skip karne se kya risk hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Jab tasks nested hon (ek task ke andar aur tasks). Skip karne se `InnerExceptions` me khud ek nested AggregateException reh sakta hai jo simple foreach me miss ho jaata hai.",
    detailedAnswer: "Agar ek outer task khud kuch inner tasks spawn karta hai jo fail hote hain, poora failure chain `AggregateException`-within-`AggregateException` ban sakta hai. `Flatten()` bina is nesting ko collapse karke ek flat list deta hai jisme sab actual root-cause (non-Aggregate) exceptions directly milte hain. Agar `Flatten()` skip kiya, `InnerExceptions.foreach` loop me kuch entries khud `AggregateException` type ke honge, jinki apni `InnerExceptions` alag se dekhni padegi — asaan se miss ho jaata hai.",
  },
  {
    id: "innerex-tr-4",
    question: "Ye code kaunsa exception behavior dikhayega?\n```csharp\nvar fastFail = Task.Run(() => throw new TimeoutException());\nvar slowFail = Task.Run(async () => { await Task.Delay(5000); throw new InvalidOperationException(); });\n\ntry { await Task.WhenAny(fastFail, slowFail); }\ncatch (Exception ex) { Console.WriteLine(ex.GetType().Name); }\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "\"TimeoutException\" — WhenAny sirf pehle-complete-hue task ka result/exception return karta hai, slowFail abhi bhi background me chal raha hoga.",
    detailedAnswer: "`fastFail` pehle complete hota hai (immediately throw karta hai), isliye `Task.WhenAny` usi ko return karta hai — `await` uska exception directly unwrap karke `TimeoutException` throw karta hai. `slowFail` 5 seconds baad khud fail hoga, lekin us exception ko koi observe nahi kar raha — ye ek 'unobserved task exception' scenario hai, jise explicitly handle karna chahiye agar us task ka result/failure bhi matter karta hai.",
  },
  {
    id: "innerex-tr-5",
    question: "Deeply nested `InnerException` chain ko debug karte waqt kya approach loge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Top-level `ex.Message` se shuru nahi karoge — poori `InnerException` chain traverse karoge (ya `ex.ToString()`, jo automatically pura chain include karta hai) taaki root cause mile.",
    detailedAnswer: "`ex.ToString()` .NET me automatically pura `InnerException` chain (recursively) print karta hai, saath me stack traces bhi — production logging me isliye `ex.ToString()` ya structured logging ka poora exception object (`_logger.LogError(ex, ...)`) use karna chahiye, sirf `ex.Message` nahi, kyunki root cause aksar sabse andar wali `InnerException` me hoti hai, top-level message sirf 'ek generic wrapper description' hoti hai.",
  },
  {
    id: "innerex-tr-6",
    question: "Kya `AggregateException` khud kabhi directly catch karna chahiye, ya usko unwrap karke andar wale exceptions ko catch karna behtar hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Context-dependent — agar sirf 'kuch fail hua' jaanna hai to `AggregateException` catch karna theek hai, lekin har failure ko specifically handle karna hai to `Flatten().InnerExceptions` iterate karke andar wale exceptions ko individually inspect karo.",
    detailedAnswer: "Non-async, blocking code (`.Result`/`.Wait()`) `AggregateException` ko directly throw karta hai — us case me `catch (AggregateException aggEx)` genuinely appropriate hai, phir `aggEx.Flatten().InnerExceptions` se andar ke individual exceptions inspect karte ho agar unhe specifically handle karna ho (jaise sirf transient errors retry karna, baaki fail-fast). `await`-based code me ye scenario alag hai (sirf pehla exception directly milta hai), jaise pehle discuss kiya.",
  },
  {
    id: "innerex-tr-7",
    question: "Ek `catch` block me `ex.InnerException` `null` ho sakta hai kya? Kis case me?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Haan, bilkul — `InnerException` optional hai. Agar exception directly, without wrapping kisi doosre exception ko, throw hua ho, `InnerException` `null` rahega.",
    detailedAnswer: "`InnerException` sirf tab set hota hai jab exception ko explicitly ek constructor overload se banaya jaaye jo `innerException` parameter accept karta ho aur value pass ki gayi ho (`new Exception(msg, inner)`). Agar exception simply `new SomeException(\"message\")` se banaya gaya, ya CLR ne khud direct throw kiya (jaise `NullReferenceException`), uska `InnerException` `null` hoga. Code jo `InnerException` traverse karta hai use hamesha null-check karna chahiye.",
  },
  {
    id: "innerex-tr-8",
    question: "`Parallel.ForEach` me agar multiple iterations exception throw karein, kya behavior hoga?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Sab exceptions collect karke ek `AggregateException` throw karta hai jab loop complete (ya abort) hota hai — Task.WhenAll ki tarah, sab failures ek saath milte hain.",
    detailedAnswer: "`Parallel.ForEach` internally multiple iterations parallel run karta hai; agar unme se kai fail hon, `Parallel.ForEach` khud ek `AggregateException` throw karta hai jisme sab individual failures `InnerExceptions` me hote hain — is case me `await` wala 'sirf pehla exception' gotcha apply nahi hota kyunki ye synchronous API hai, `AggregateException` directly catch block me milta hai, `Flatten()` se unwrap karna standard practice hai.",
  },
];

export default questions;
