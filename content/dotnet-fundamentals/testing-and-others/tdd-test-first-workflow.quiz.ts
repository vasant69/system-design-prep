import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "tdd-workflow-1",
    question:
      "Red-Green-Refactor cycle me 'Green' step ka goal kya hai?",
    options: [
      "Sabse elegant, production-ready implementation likhna",
      "Bas itna code likhna jo test ko pass karwa de, minimum, even naive implementation",
      "Sabhi edge cases ke liye tests likhna",
      "Code ko refactor karna bina naye tests ke",
    ],
    correctIndex: 1,
    explanation:
      "'Green' step deliberately minimum-to-pass implementation allow karta hai — even hardcoded/naive code chalega is step pe. Polish 'Refactor' step me aata hai. Option A galat hai kyunki ye over-engineering ki taraf le jaata hai jo TDD ke incremental nature ko defeat karta hai. Option C 'Red' step ka part hai (naya test likhna), aur option D 'Refactor' ko galat describe karta hai.",
    difficulty: "easy",
  },
  {
    id: "tdd-workflow-2",
    question:
      "TDD ka 'asli' value proposition interview me kaise best describe kiya jaata hai?",
    options: [
      "Sirf ye ki tests likhe jaate hain, jo achhi practice hai",
      "Design pressure jo testable, loosely-coupled code ki taraf push karta hai, plus refactoring confidence",
      "Ye code ko automatically fast banata hai",
      "Ye documentation likhne ki zaroorat khatam kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "TDD ka core value sirf 'tests exist karte hain' se aage jaata hai — test-first workflow developer ko testable design ki taraf force karta hai (agar test likhna mushkil hai, design me problem hai), aur ek comprehensive test suite refactoring confidence deta hai. Options A, C, aur D iska actual value proposition capture nahi karte.",
    difficulty: "medium",
  },
  {
    id: "tdd-workflow-3",
    question:
      "Kya TDD har situation me use karna chahiye?",
    options: [
      "Haan, universal mandate hai, koi exception nahi",
      "Nahi — exploratory/spike code aur trivial CRUD logic pe overhead ROI justify nahi karta",
      "Sirf tab jab team ke paas 100+ developers hon",
      "Sirf .NET Framework projects me, .NET Core me nahi",
    ],
    correctIndex: 1,
    explanation:
      "TDD selectively apply hota hai practically — complex, non-trivial business logic pe iska real value milta hai, lekin exploratory/spike code (jahan requirements khud clear nahi) ya simple CRUD me rigid test-first workflow friction add karta hai bina proportional benefit ke. Options A, C, aur D fictional/absolute constraints hain jo reality reflect nahi karte.",
    difficulty: "medium",
  },
  {
    id: "tdd-workflow-4",
    question:
      "Agar ek developer ko ek class ke liye test likhna genuinely mushkil lag raha hai, TDD perspective se iska kya matlab ho sakta hai?",
    options: [
      "Testing framework me bug hai",
      "Ye ek signal hai ki class ki design me problem ho sakti hai — tight coupling ya hidden dependencies",
      "Class bahut chhoti hai",
      "Developer ko zyada tests likhne chahiye, design se koi lena dena nahi",
    ],
    correctIndex: 1,
    explanation:
      "TDD ka core insight yahi hai — hard-to-test code aksar poor design ka symptom hota hai (tight coupling, static dependencies, ek class jo bahut zyada responsibilities le rahi hai). Ye TDD ka 'design pressure' value hai. Options A, C, aur D is diagnostic signal ko galat interpret karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
