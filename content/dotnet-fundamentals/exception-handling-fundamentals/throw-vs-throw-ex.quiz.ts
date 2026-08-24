import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "throwex-1",
    question: "`catch (Exception ex) { throw ex; }` likhne ka main downside kya hai?",
    options: [
      "Ye compile error deta hai",
      "Exception rethrow nahi hota, silently swallow ho jaata hai",
      "Stack trace reset ho jaata hai current line pe, original throw location lost ho jaati hai",
      "Ye `ex` variable ko dispose kar deta hai",
    ],
    correctIndex: 2,
    explanation:
      "`throw ex;` exception ko as-is rethrow to karta hai (propagate hota hai, swallow nahi hota), lekin uska `StackTrace` property is line se overwrite ho jaata hai — original throw location (jahan exception actually create hua tha) permanently lost ho jaati hai debugging ke liye.",
    difficulty: "medium",
  },
  {
    id: "throwex-2",
    question: "Original stack trace preserve karte hue exception ko log-and-rethrow karne ka correct syntax kya hai?",
    options: [
      "`throw ex;`",
      "`throw;`",
      "`throw new Exception(ex.Message);`",
      "`return ex;`",
    ],
    correctIndex: 1,
    explanation:
      "`throw;` (bina kisi expression ke, sirf keyword) bare rethrow hai — exception object as-is propagate hota hai, `StackTrace` untouched rehta hai. Option A stack trace reset karta hai. Option C original exception object hi discard kar deta hai, sirf message string reuse karta hai. Option D syntactically hi galat hai exception rethrow ke liye.",
    difficulty: "easy",
  },
  {
    id: "throwex-3",
    question: "`throw new OrderProcessingException(\"Failed\", ex)` (jahan `ex` original caught exception hai) is pattern ke baare me kya sahi hai?",
    options: [
      "Ye `throw ex;` jaisa hi bad practice hai — original stack trace lost ho jaata hai",
      "Original exception `InnerException` me preserved rehta hai, koi information lost nahi hoti",
      "Ye compile error dega kyunki `ex` already caught ho chuka hai",
      "Ye original exception ka type change kar deta hai bina koi trace rakhe",
    ],
    correctIndex: 1,
    explanation:
      "Ye `throw ex;` se fundamentally different hai. Ye ek genuinely NAYA exception object banata hai (jiska apna fresh, correct stack trace hai — ye sahi hai kyunki ye ek naya throw point hai), lekin original `ex` ko `InnerException` property me pass kar deta hai — koi information lost nahi hoti, dono exceptions (naya + original) accessible rehte hain.",
    difficulty: "medium",
  },
  {
    id: "throwex-4",
    question: "Roslyn analyzer ka kaunsa rule specifically `throw ex;` pattern ko flag karta hai?",
    options: [
      "CA1001",
      "CA2200",
      "CA1062",
      "CS0168",
    ],
    correctIndex: 1,
    explanation:
      "`CA2200` ('Rethrow to preserve stack details') specifically `throw ex;` pattern detect karta hai jab `ex` woh hi variable hai jo `catch` clause me declare hua tha, aur `throw;` use karne ki recommendation deta hai. Ye pattern itna common aur impactful mistake hai ki Microsoft ne isko first-class analyzer rule bana diya.",
    difficulty: "hard",
  },
];

export default quiz;
