import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "exceptions-tr-1",
    question: "Custom exception kab banani chahiye, aur kab built-in exception reuse karni chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Flipkart"],
    shortAnswer: "Custom exception tabhi jab caller ko us specific failure ko genuinely alag handle karna ho; warna built-in type reuse karo.",
    detailedAnswer:
      "Agar caller ek failure ko specifically catch karke ek alag action lena chahta hai (retry, specific UI message, structured data use karna), custom exception justified hai. Agar tum sirf Exception ko naya naam de rahe ho bina extra behavior/data ke, ya ek built-in type (ArgumentException, InvalidOperationException) already semantically fit baithta hai, naya type banane ka koi real fayda nahi — sirf clutter badhta hai.",
    followUp: "Ek custom exception ka structure kya hona chahiye — kaunse constructors zaroori hain?",
  },
  {
    id: "exceptions-tr-2",
    question: "Ek custom exception class me kaunse 3 constructors hone chahiye standard convention ke hisaab se?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Parameterless, (string message), aur (string message, Exception innerException).",
    detailedAnswer:
      "Ye teeno .NET ki standard convention hain jo Exception base class khud follow karta hai. Parameterless basic case ke liye, (string message) ek descriptive error ke liye, aur (string message, Exception inner) exception chaining ke liye — jab tum ek lower-level exception ko catch karke ek higher-level, more meaningful exception me wrap karke throw karte ho, bina original error context lose kiye.",
  },
  {
    id: "exceptions-tr-3",
    question: "Exception filter (catch...when) kya hai aur kab use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ek catch block ko sirf tab trigger karta hai jab exception type match ho AND ek additional condition true ho — bina catch-then-rethrow ke.",
    detailedAnswer:
      "`catch (InsufficientFundsException ex) when (ex.RequestedAmount > 1000)` sirf tab chalega jab exception type match kare aur condition bhi true ho — agar condition false hai, exception bubble up karta hai jaise wo catch block exist hi nahi karta. Ye particularly useful hai jab same exception type ko alag scenarios me alag handle karna ho, jaise retry-worthy vs non-retry-worthy HTTP failures ko alag route karna, bina manually rethrow karne ke.",
  },
  {
    id: "exceptions-tr-4",
    question: "Ye code me kya problem hai?\n```csharp\ntry { ProcessOrder(order); }\ncatch (Exception ex)\n{\n    // ignore, not important\n}\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Empty catch block — error silently swallow ho raha hai, koi logging ya rethrow nahi hai.",
    detailedAnswer:
      "Ye code compile hoga aur run bhi hoga — koi crash nahi dikhega, lekin agar ProcessOrder genuinely fail ho raha ho, wo failure completely invisible ho jaata hai. Production me debugging impossible ho jaati hai kyunki koi trace hi nahi bacha. Minimum fix: at least log the exception (`_logger.LogError(ex, ...)`), aur agar caller ko pata hona chahiye, rethrow karo (`throw;`).",
  },
  {
    id: "exceptions-tr-5",
    question: "Ye code kya problem create karega debugging ke waqt?\n```csharp\ncatch (Exception ex)\n{\n    _logger.LogError(ex.Message);\n    throw ex;\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "throw ex; original stack trace reset kar deta hai — debug karte waqt asli failure line dikhna band ho jaata hai.",
    detailedAnswer:
      "`throw ex;` C# ko treat karwata hai jaise exception yahi is line se nayi shuru ho rahi hai, isliye original throw location ki stack trace information overwrite ho jaati hai. Production incident debug karte waqt ye bahut misleading ho sakta hai — stack trace catch block ki line dikhayega, actual failure ki nahi. Fix: sirf `throw;` likho, jo original exception object ko as-is, original stack trace ke saath propagate karta hai.",
    redFlag: "Ye na jaanna ki throw ex; aur throw; alag behave karte hain — bahut candidates dono ko interchangeable samajhte hain.",
  },
  {
    id: "exceptions-tr-6",
    question: "Tumhare paas ek lookup method hai jo har request ke 30% cases me 'record not found' return karta hai (ek normal, expected outcome hai, bug nahi). Ye currently exception throw karta hai. Kya problem hai, aur fix kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Exceptions ka control-flow-ke-liye misuse hai; fix hai nullable return ya result pattern use karna.",
    detailedAnswer:
      "30% requests me exception throw karna genuinely expensive hai (stack trace capture har baar), aur caller ko forced karta hai normal-looking business logic ke liye try/catch likhne ke liye, jo readability aur performance dono hurt karta hai. Fix: method ko `User? FindUser(int id)` jaisa nullable return karne do, ya ek `Result<User>`/`(bool found, User? user)` pattern use karo. Exception sirf tab reserve karo jab condition genuinely unexpected ho (jaise DB connection hi down ho jaana).",
    followUp: "Kya har 'not found' case me ye rule apply hota hai, ya koi exception hai jahan throwing sahi hoga?",
  },
  {
    id: "exceptions-tr-7",
    question: "Production me ek payment API ke paas do custom exceptions hain — PaymentGatewayTimeoutException aur PaymentDeclinedException — dono ek common base PaymentException se inherit karti hain. Ye design decision kyun sensible hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Caller specific type ke basis pe alag action le sakta hai (retry vs immediate decline message), phir bhi common base se generically bhi catch kar sakta hai.",
    detailedAnswer:
      "Common base class (`PaymentException`) allow karta hai ek generic catch block jo saare payment-related failures ko ek jagah handle kare (jaise logging), jabki specific subclasses (`PaymentGatewayTimeoutException`, `PaymentDeclinedException`) allow karte hain fine-grained handling — timeout pe retry logic chalana makes sense, decline pe nahi. Ye ek clean exception hierarchy design hai jo dono generality aur specificity provide karta hai.",
  },
  {
    id: "exceptions-tr-8",
    question: "Kya ye statement sahi hai: 'Custom exception banate waqt sirf message string pass karna kaafi hai, extra properties ki zaroorat nahi hoti'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat — custom exception ka poora fayda hi structured data attach karna hai jo caller programmatically use kar sake.",
    detailedAnswer:
      "Agar sirf message string chahiye thi, built-in Exception hi kaafi tha — koi naya type banane ki zaroorat nahi hoti. Custom exceptions ka real value ye hai ki tum extra properties (jaise `RequestedAmount`, `AvailableBalance`) attach kar sakte ho jo caller `catch` block me directly access kar sake, sirf message string parse kiye bina — jo bahut fragile approach hota.",
    redFlag: "Ye maan lena ki custom exception sirf 'naming' ke liye hai, functional value ke liye nahi.",
  },
  {
    id: "exceptions-tr-9",
    question: "[Serializable] attribute custom exceptions pe kab relevant tha, aur aaj ke .NET me iski kya status hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Cross-AppDomain/remoting scenarios ke liye relevant tha; modern .NET Core/5+ me largely irrelevant hai kyunki remoting deprecated hai.",
    detailedAnswer:
      ".NET Framework ke era me, agar ek exception AppDomain boundary cross karta tha (jaise .NET Remoting ke through), usko serializable hona zaroori tha taaki wo boundary cross kar sake. Modern .NET (Core aur baad ke versions) me remoting hi exist nahi karta, isliye [Serializable] largely historical/legacy concern reh gaya hai — purane codebases me dikhega, naye code me generally zaroori nahi.",
  },
  {
    id: "exceptions-tr-10",
    question: "Ye code review comment mila: 'Ye custom exception (OrderValidationException) sirf 'Invalid order' message throw karta hai, kuch aur nahi karta jo ArgumentException nahi kar sakta.' Iska kya matlab hai, aur kya fix karoge?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Reviewer sahi hai — bina extra value ke ek naya exception type banana unnecessary complexity hai; ya to built-in reuse karo, ya genuinely useful data add karo.",
    detailedAnswer:
      "Agar `OrderValidationException` sirf ek generic message deta hai bina koi structured context (jaise kaunsa field invalid tha, kya expected tha) ke, to `ArgumentException` ya `InvalidOperationException` bilkul wahi kaam karte, bina codebase me ek naya type add kiye. Fix ya to built-in exception reuse karna hai, ya agar custom exception genuinely justified hai, usme validation failures ki list ya specific field names jaisa structured data add karna hai jo caller ko real value de.",
  },
];

export default questions;
