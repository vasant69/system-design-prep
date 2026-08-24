import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "customex-1",
    question: "Ek naya `UserNotFoundException` custom exception banaya gaya jo sirf `Exception` ko naya naam deta hai, koi extra data ya alag handling nahi. Ye kis principle ko violate karta hai?",
    options: [
      "Custom exceptions kabhi bhi banane chahiye — ye sahi hai",
      "Custom exception sirf tabhi banao jab caller ko genuinely alag handle karna ho — bina value-add ke naya type sirf clutter hai",
      "Sabhi custom exceptions `ApplicationException` se inherit honi chahiye",
      "Exception naam me hamesha 'Custom' word hona chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Decision test: kya caller ko is specific failure ko genuinely alag handle karna hai? Agar naya type sirf existing `Exception` (ya built-in type jaise `KeyNotFoundException`) ka naya naam hai bina extra data/behavior/distinct-handling-need ke, to naya type banane ka koi practical fayda nahi.",
    difficulty: "easy",
  },
  {
    id: "customex-2",
    question: "Exception filter (`catch (Ex e) when (condition == false)`) me agar condition false ho jaaye, kya hota hai?",
    options: [
      "Catch block trigger hota hai lekin body skip ho jaata hai",
      "Exception is catch clause se completely untouched propagate hota hai, jaise ye clause exist hi na karta",
      "Compile error aata hai",
      "Exception silently swallow ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Ye exception filters ka ek subtle-but-important behavior hai — jab filter condition false ho, catch clause exception ko catch hi nahi karta, exception apni original, untouched state me aage propagate hota hai. Ye catch-then-check-then-rethrow se genuinely different hai, jahan exception technically pehle catch hota hai.",
    difficulty: "hard",
  },
  {
    id: "customex-3",
    question: "Custom exception class me current Microsoft guidance ke mutabik kaunse teen constructors provide karne chahiye?",
    options: [
      "Sirf ek — jo message accept kare",
      "Parameterless, `(string message)`, aur `(string message, Exception innerException)`",
      "Sirf `(string message, Exception innerException)` — baaki optional hain",
      "Ek static factory method, koi constructor nahi",
    ],
    correctIndex: 1,
    explanation:
      "Convention teen canonical constructors hai — parameterless, message-only, aur message+innerException — jo framework aur serialization utilities ke expectations ke saath compatible rehte hain. Extra domain-specific constructors add karna bhi valid hai, lekin ye teen baseline hain.",
    difficulty: "medium",
  },
  {
    id: "customex-4",
    question: "Exception filter (`when`) use karne ka ek genuine advantage catch-check-rethrow pattern ke upar kya hai?",
    options: [
      "Filters faster compile hote hain",
      "Filters readability improve karte hain aur exception ko untouched propagate hone dete hain jab condition false ho, bina explicit `throw;` ki zaroorat ke",
      "Filters exceptions ko automatically log kar dete hain",
      "Filters sirf custom exceptions ke saath kaam karte hain, built-in ke saath nahi",
    ],
    correctIndex: 1,
    explanation:
      "Filters catch-check-if-match-else-rethrow pattern ko avoid karte hain — code cleaner hota hai, aur exception jab condition match nahi karta to bina explicit `throw;` likhe hi apne-aap untouched propagate ho jaata hai. Filters built-in aur custom dono exception types ke saath equally kaam karte hain (option D galat hai).",
    difficulty: "medium",
  },
];

export default quiz;
