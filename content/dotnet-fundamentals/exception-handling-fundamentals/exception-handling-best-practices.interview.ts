import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "bestpractice-tr-1",
    question: "Exception handling ke liye tumhare top best practices kya hain?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon", "Wipro"],
    shortAnswer: "Specific-before-general catching, exceptions ko control flow ke liye use na karna, context ke saath logging, kabhi silently swallow na karna, aur try scope ko tight rakhna.",
    detailedAnswer: "Paanch core rules: (1) catch blocks specific-to-general order me, har ek genuinely distinct handling ke saath; (2) exceptions genuinely unexpected situations ke liye reserve karo, normal expected outcomes (jaise 'not found') ke liye nullable returns use karo; (3) hamesha exception object ko logger ka pehla parameter bana kar, structured context ke saath log karo; (4) kabhi bhi empty catch block se exception silently swallow mat karo; (5) try block ka scope tight rakho — sirf wo operation jo genuinely fail ho sakta hai aur jise specifically handle karna hai.",
    followUp: "In me se konsi rule sabse zyada production incidents cause karti hai, apne experience se?",
  },
  {
    id: "bestpractice-tr-2",
    question: "Ek code review me tumhe ye dikhta hai:\n```csharp\ntry { SaveOrder(order); }\ncatch (Exception) { }\n```\nKya feedback doge?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Empty catch block hai — failure completely invisible ho jaata hai. Minimum kam se kam log karo, ya properly handle/rethrow karo.",
    detailedAnswer: "Ye sabse dangerous exception-handling anti-pattern hai. `SaveOrder` fail ho sakta hai (database down, constraint violation, waghera) aur caller ko kabhi pata hi nahi chalega — order 'silently' save nahi hua, lekin application aage badh jaayega jaise sab theek hai. Minimum fix: `_logger.LogError(ex, \"Failed to save order {OrderId}\", order.Id);` phir decide karo ki genuinely gracefully handle kar sakte ho (retry, fallback) ya `throw;` se propagate karna hai.",
    redFlag: "'Ye theek hai, sirf ek edge case handle kar rahe hain' bolna empty catch block ke baare me.",
  },
  {
    id: "bestpractice-tr-3",
    question: "Kya exceptions ko 'user not found' jaisi situations ke liye use karna chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Nahi — ye ek expected, normal outcome hai kisi lookup ka, exceptional condition nahi. Nullable return ya TryGet pattern behtar hai.",
    detailedAnswer: "Core principle: exceptions genuinely EXCEPTIONAL, unexpected conditions ke liye hain. 'User not found' ek routine, expected outcome hai kisi bhi lookup operation ka — isko exception se signal karna do problems create karta hai: perf cost (exceptions expensive hain — stack trace capture, unwinding), aur readability (caller ko normal case ke liye bhi try/catch likhna padta hai). Better: `User? GetUser(int id)` nullable return, ya `bool TryGetUser(int id, out User user)` pattern — caller normal if-check se handle karta hai.",
  },
  {
    id: "bestpractice-tr-4",
    question: "Structured logging (`{OrderId}` named placeholders) aur string concatenation (`\"Order \" + orderId + \" failed\"`) me production debugging ke liye kya fark padta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Structured logging log-aggregation tools me searchable/filterable structured data deta hai; concatenation sirf ek free-text string deta hai jo query karna mushkil hai.",
    detailedAnswer: "`_logger.LogError(ex, \"Failed to process order {OrderId}\", order.Id)` (structured, named placeholder) log-aggregation tools (Seq, Application Insights, ELK) me `OrderId` ko ek queryable field ke roop me store karta hai — production me 'sab failures for order X dikhao' jaisi query aasan ban jaati hai. String concatenation sirf ek opaque text blob deta hai jisme structured querying possible nahi, sirf full-text search.",
  },
  {
    id: "bestpractice-tr-5",
    question: "Ek order-processing method me validation, payment, email confirmation, aur inventory update — sab ek hi try-catch me wrapped hain. Kaunsa problem isse aata hai, aur kaise fix karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Exact failure point unclear rehta hai, aur alag steps ke liye alag 'acceptable failure' criteria express nahi ho paata. Har step ka apna, tight-scoped handling do jahan zaroorat ho.",
    detailedAnswer: "Agar generic catch trigger hota hai, pata nahi chalta payment fail hui ya sirf email — dono treated same. Practically, email failure shayad non-fatal ho (order phir bhi valid hai, sirf notification miss hui), lekin payment failure fatal honi chahiye. Fix: sirf email-sending step ko apne chhote try-catch me wrap karo jo failure ko log kare lekin order processing continue rehne de; baaki steps (validation, payment) ko naturally propagate hone do agar wo fail hon, kyunki wo fatal hain.",
  },
  {
    id: "bestpractice-tr-6",
    question: "`async void SendNotificationAsync()` likhna kyun problematic hai (event handler ke alawa kisi context me)?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "`async void` methods ke exceptions caller catch nahi kar sakta — wo directly SynchronizationContext/process ko crash kar sakte hain.",
    detailedAnswer: "`async Task` methods ka exception `Task` object ke through propagate hota hai — caller `await` karke normally catch kar sakta hai. `async void` methods ka koi `Task` return nahi hota jise track kiya ja sake — agar exception throw ho, wo directly current `SynchronizationContext` pe (ya uske absence me process-level) throw hoti hai, jo often unhandled crash ka reason banti hai. `async void` sirf event handlers (jinka signature framework enforce karta hai) ke liye acceptable hai, kahin aur `async Task` use karo.",
    redFlag: "'async void aur async Task same hain, bas keyword ka fark hai' bolna.",
  },
  {
    id: "bestpractice-tr-7",
    question: "Ek generic `catch (Exception ex)` ke andar specific exception types (jaise `SqlException`, `ValidationException`) ko differently handle karna hai bina teen alag catch blocks likhe. Kya approach lena chahiye, aur kab ye acceptable hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Type-checking (`ex is SqlException sqlEx`) ek generic catch ke andar bhi kaam karta hai, lekin usually multiple specific catch blocks zyada readable hote hain — pattern matching sirf tab reasonable hai jab bahut saare types ka common prefix logic ho.",
    detailedAnswer: "Technically `catch (Exception ex) { if (ex is SqlException sqlEx) {...} else if (ex is ValidationException valEx) {...} }` valid hai — C# pattern matching (`is` with type pattern) yahan use ho sakta hai. Lekin usually explicit multiple catch blocks (specific-to-general order) zyada readable hain kyunki compiler khud enforce karta hai order correctness, aur code structure directly reflect karta hai intent. Generic-catch-with-type-check approach tabhi justified hai jab bahut saara SHARED logic ho jo condition ke bahar common ho, aur sirf ek chhota portion type-specific ho.",
  },
  {
    id: "bestpractice-tr-8",
    question: "Ek interviewer poochta hai: 'agar tumhare paas sirf 30 seconds hon exception handling best practices explain karne ke liye, kya kahoge?'",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Specific-to-general catch, exceptions sirf genuinely unexpected cases ke liye, hamesha context ke saath log karo, kabhi silently swallow mat karo.",
    detailedAnswer: "Ek crisp 30-second answer: 'Main specific exceptions ko general se pehle catch karta hoon, har ek ko distinct, actionable handling ke saath. Exceptions ko normal expected outcomes ke liye use nahi karta — jaise 'not found' ke liye nullable return. Jab bhi catch karta hoon, exception object ke saath structured context log karta hoon. Aur kabhi bhi empty catch block nahi likhta — ye production incidents ka sabse common silent root cause hai.' Ye ek tight, memorable summary hai jo depth aur judgment dono signal karta hai.",
  },
];

export default questions;
