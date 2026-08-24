import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "customex-tr-1",
    question: "Custom exception kab banani chahiye, aur kab built-in exception reuse karni chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Flipkart", "Accenture"],
    shortAnswer: "Jab caller ko genuinely is specific failure ko differently handle karna ho — extra data ya distinct catch logic ki zaroorat ho. Warna built-in reuse karo.",
    detailedAnswer: "Decision test simple hai: 'agar main ye exception catch karoon, kya mujhe genuinely kuch alag karna hai is case me, kisi doosre error se?' Agar haan — jaise `InsufficientFundsException` jisse UI ek specific 'add funds' flow trigger kare, ya jisme structured data (`RequestedAmount`, `AvailableBalance`) ho jo caller ko chahiye — custom exception justified hai. Agar sirf `Exception` ko naya naam de rahe ho, ya `ArgumentException`/`InvalidOperationException`/`KeyNotFoundException` jaisa built-in type already exact same meaning carry karta hai, naya type sirf codebase me clutter add karta hai.",
    followUp: "Ek custom exception class me kaunse constructors provide karne chahiye, aur kyun?",
  },
  {
    id: "customex-tr-2",
    question: "Exception filter (`catch (Ex e) when (condition)`) kya hai, aur ye catch-check-rethrow se kaise better hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Filter catch block ko conditionally trigger karta hai — readable hai, aur agar condition false ho, exception completely untouched propagate hota hai bina explicit rethrow ke.",
    detailedAnswer: "C# 6 me introduce hue exception filters (`when` clause) ek catch clause ko sirf tab activate karte hain jab additional boolean condition true ho. Iske bina, tumhe manually catch karke, condition check karke, match na ho to `throw;` likhna padta — extra boilerplate. Filters ek subtle correctness benefit bhi dete hain: agar condition false hai, exception us catch clause ko poori tarah bypass kar deta hai, jaise clause exist hi nahi karta — jo debugging tools (jaise first-chance exception breaks) ke saath cleaner interact karta hai.",
  },
  {
    id: "customex-tr-3",
    question: "Ye code kya karega agar external API call 429 (Too Many Requests) return kare?\n```csharp\ntry { await CallApiAsync(); }\ncatch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.TooManyRequests)\n{\n    await RetryWithBackoffAsync();\n}\ncatch (HttpRequestException ex)\n{\n    throw;\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Pehla catch block trigger hoga (filter condition true), retry logic chalega — doosra catch kabhi nahi reach hoga is case me.",
    detailedAnswer: "Jab `StatusCode` `TooManyRequests` ho, pehla catch clause ka filter condition true hota hai, isliye wahi block execute hota hai — `RetryWithBackoffAsync()` chalta hai. Doosra generic `catch (HttpRequestException ex)` sirf tab reach hota jab StatusCode kuch aur hota (filter false, pehla clause skip). Agar dono match na karein (koi aur exception type), exception aage propagate hota.",
  },
  {
    id: "customex-tr-4",
    question: "Custom exception class me `[Serializable]` attribute ki zaroorat hai kya modern .NET (Core/5+) me?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Largely irrelevant ab — historically cross-AppDomain/remoting ke liye zaroori tha, jo modern .NET Core/5+ me deprecated/absent hai.",
    detailedAnswer: "`[Serializable]` originally isliye zaroori tha kyunki .NET Framework remoting/cross-AppDomain scenarios me exceptions ko serialize karna padta tha jab wo boundary cross karte the. Modern .NET Core/5+ me remoting hi largely deprecated/absent hai, isliye ye attribute practically irrelevant ho chuka hai naye code ke liye — lekin purane codebases me still commonly dikhta hai legacy convention ki wajah se.",
  },
  {
    id: "customex-tr-5",
    question: "Ek payment service me `InsufficientFundsException` custom type banaya gaya hai jisme `RequestedAmount` aur `AvailableBalance` properties hain. Ye design decision kyun sahi hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ye genuinely structured, actionable data provide karta hai jo caller ko chahiye — sirf ek string message se ye information reliably extract nahi ki ja sakti.",
    detailedAnswer: "Agar caller ko sirf 'Insufficient funds' message milta, use programmatically kuch nahi mil sakta except string-parsing (fragile, locale-dependent). Structured properties (`RequestedAmount`, `AvailableBalance`) caller ko allow karte hain UI me exact numbers dikhane, ya business logic decide karne (jaise 'agar shortfall < 100, auto-suggest ek chhota amount') — ye exactly wo genuine value-add hai jo custom exception ko justify karta hai, sirf naam badalna nahi.",
  },
  {
    id: "customex-tr-6",
    question: "Kya exception filter ke andar side-effecting code (jaise logging) likhna sahi practice hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Technically possible (filter ek method call kar sakta hai jo log karke false return kare), lekin readability ki wajah se usually catch-block-with-throw zyada clear hota hai.",
    detailedAnswer: "Ek advanced pattern hai `catch (Exception ex) when (LogAndReturnFalse(ex))` — jahan `LogAndReturnFalse` side-effect ke roop me log karta hai aur hamesha `false` return karta hai, isliye catch kabhi trigger nahi hota, exception untouched propagate hota hai but logging ho chuki hoti hai. Ye clever hai lekin readers ke liye surprising ho sakta hai ki ek 'condition' actual me logging kar raha hai. Zyada teams `catch (Exception ex) { _logger.LogError(ex, ...); throw; }` explicit pattern prefer karti hain — same result, zyada obvious intent.",
    redFlag: "Filter ke andar heavy/expensive computation likhna bina samjhe ki filters multiple matching catch clauses ke against evaluate ho sakte hain.",
  },
  {
    id: "customex-tr-7",
    question: "Ek naya team member `NotFoundException`, `InvalidException`, `FailedException` jaise generic custom exceptions bana raha hai poori codebase me, har jagah ek naya type. Code review me kya feedback doge?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Ye anti-pattern hai — generic-sounding custom exceptions bina distinct handling need ke sirf `Exception` types ka clutter badhate hain. Built-in types (`ArgumentException`, `InvalidOperationException`, `KeyNotFoundException`) already ye cases cover karte hain.",
    detailedAnswer: "`NotFoundException`, `InvalidException` jaise generic-naam wale custom types almost kabhi genuinely justified nahi hote — ye built-in exceptions (`KeyNotFoundException`, `ArgumentException`, `InvalidOperationException`) se conceptually indistinguishable hain, sirf naam alag hai, koi extra data/behavior nahi. Feedback: har naye custom type ke liye poochna 'is se caller ko genuinely kya alag milta hai jo built-in se nahi milta' — agar answer 'kuch nahi' hai, built-in reuse karo.",
    redFlag: "'Har domain concept ka apna exception type hona chahiye' jaisi bina-nuance guidance dena.",
  },
  {
    id: "customex-tr-8",
    question: "Ek catch clause me multiple exception types ko SAME tarike se handle karna hai (jaise `TimeoutException` aur `SocketException` dono retry logic trigger karein). Kaise likhoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ek exception filter use karo jo `is` pattern se multiple types check kare: `catch (Exception ex) when (ex is TimeoutException or SocketException)`.",
    detailedAnswer: "C# 9's pattern combinators (`or`) exception filters ke andar bhi kaam karte hain — `catch (Exception ex) when (ex is TimeoutException or SocketException)` ek hi catch block se dono types ko match kar sakta hai, bina alag-alag identical-body catch blocks duplicate kiye. Ye readability improve karta hai jab multiple exception types genuinely same handling deserve karte hain.",
  },
];

export default questions;
