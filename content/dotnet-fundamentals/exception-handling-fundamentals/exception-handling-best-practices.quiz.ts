import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "bestpractice-1",
    question: "Ek method me 'user not found' ek genuinely common, expected lookup outcome hai. Best practice ke mutabik ise kaise handle karna chahiye?",
    options: [
      "Ek custom exception throw karo har baar jab user na mile",
      "Nullable return type (`User?`) ya TryGet-style pattern use karo, exception nahi",
      "Generic `Exception` throw karo",
      "Application ko crash hone do",
    ],
    correctIndex: 1,
    explanation:
      "Exceptions genuinely UNEXPECTED conditions ke liye hain. 'Record not found' ek normal, expected lookup outcome hai, isliye ek nullable return ya boolean-returning TryGet pattern zyada appropriate hai — caller ko normal if-check se handle karne deta hai, exception ka perf-cost aur obscured control-flow avoid karta hai.",
    difficulty: "easy",
  },
  {
    id: "bestpractice-2",
    question: "Sabse dangerous exception-handling anti-pattern kaunsa hai jo production incidents ka repeated silent root cause raha hai?",
    options: [
      "Specific catch blocks likhna",
      "`throw;` use karna",
      "Empty `catch (Exception) { }` block — failure completely silently swallow ho jaata hai",
      "`_logger.LogError(ex, ...)` use karna",
    ],
    correctIndex: 2,
    explanation:
      "Empty catch block ek exception ko completely silently discard karta hai — na log, na trace, na indication. Application 'successfully' continue karta hai jabki actually kuch corrupt/fail ho chuka hota hai. Ye genuinely repeated real-world production incident cause raha hai.",
    difficulty: "easy",
  },
  {
    id: "bestpractice-3",
    question: "`_logger.LogError(ex, \"Failed to process order {OrderId}\", order.Id)` is pattern me `ex` ko pehle parameter ke roop me kyun pass karte hain?",
    options: [
      "Sirf convention hai, koi functional fark nahi",
      "Ye poora stack trace aur InnerException chain automatically capture karta hai logging framework ke through",
      "Ye exception ko rethrow kar deta hai",
      "Ye compile-time zaroori hai, warna error aayega",
    ],
    correctIndex: 1,
    explanation:
      "`ILogger`'s `LogError(Exception, string, params object[])` overload exception object ko specifically accept karta hai taaki poora stack trace, `InnerException` chain, aur exception metadata structured logging output me automatically capture ho jaaye — sirf message string se ye information nahi milti.",
    difficulty: "medium",
  },
  {
    id: "bestpractice-4",
    question: "Ek method me multiple unrelated operations (validation, processing, email sending, inventory update) ek hi bade try block me wrapped hain, ek generic catch ke saath. Iska main downside kya hai?",
    options: [
      "Code compile nahi hoga",
      "Exact failure point unclear ho jaata hai, aur alag operations ke liye alag acceptable-failure-handling express nahi ho paata",
      "Performance drastically slow ho jaati hai",
      "Koi downside nahi, ye best practice hai",
    ],
    correctIndex: 1,
    explanation:
      "Bade try block me debugging mushkil ho jaati hai kyunki exception aane par pata nahi chalta exactly kaunsi operation fail hui. Alag operations ka alag 'is failure acceptable hai ya fatal' criteria ho sakta hai (jaise email failure non-fatal ho sakti hai, payment failure fatal) — jo ek generic catch me express nahi ho pata. Tight-scoped try blocks har operation ke liye specific handling allow karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
