import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "n-plus-1-1",
    question: "Ek query 200 `Order` rows return karti hai, aur loop ke andar har order ke lazy-loaded `Customer` property ko access kiya jaata hai. Total kitni database queries chalengi?",
    options: ["1 query", "200 queries", "201 queries", "400 queries"],
    correctIndex: 2,
    explanation:
      "1 query orders fetch karne ke liye, plus 200 queries (ek per order) customer fetch karne ke liye lazy loading ke through = 201 total queries. Ye exact N+1 formula hai: N parents + 1 initial query = N+1.",
    difficulty: "medium",
  },
  {
    id: "n-plus-1-2",
    question: "N+1 problem ko fix karne ka standard tareeka kya hai?",
    options: [
      "Lazy loading ko aur zyada properties ke liye enable karna",
      "Related data ke liye .Include() (eager loading) use karna taaki ek combined query me sab aa jaaye",
      "Application server ko restart karna",
      "DbContext ko Singleton bana dena",
    ],
    correctIndex: 1,
    explanation:
      "`.Include()` related data ko main query ke saath ek single (ya kam) combined query me fetch karta hai (typically SQL JOIN), N separate per-row queries ki zaroorat khatam kar deta hai. Ye N+1 ka standard, direct fix hai. Options A, C, D problem ko address nahi karte — A actually problem ko badhaata hai.",
    difficulty: "easy",
  },
  {
    id: "n-plus-1-3",
    question: "N+1 problem code me kyun aksar 'invisible' rehti hai jab tak scale/load na badhe?",
    options: [
      "Kyunki EF Core errors show karta hai sirf production me",
      "Kyunki lazy-loaded queries silently trigger hoti hain property access pe — code 'kaam karta hai' bina explicit error ke, sirf slow hota hai jab data size badhta hai",
      "Kyunki N+1 sirf specific database providers me hota hai",
      "Kyunki N+1 sirf async code me hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Lazy loading queries automatically, silently trigger hoti hain jab related property access hoti hai — koi visible error ya warning nahi milti, code functionally correct dikhta hai. Chhote data sets me query-count overhead negligible lagta hai, lekin jaise-jaise rows badhte hain, response time linearly (ya worse) degrade hota hai — isliye proactive query-count monitoring zaroori hai, sirf functional testing kaafi nahi.",
    difficulty: "hard",
  },
  {
    id: "n-plus-1-4",
    question: "Ek developer har query me 'safety ke liye' saare possible related entities `.Include()` kar deta hai, chahe wo us specific query me use ho ya na ho. Isse kya problem ho sakti hai?",
    options: [
      "Koi problem nahi, ye best practice hai",
      "Over-fetching — unnecessary bade JOINs aur zyada data transfer, performance kharaab kar sakta hai",
      "Ye SQL injection vulnerability create karta hai",
      "Ye code compile hi nahi hoga",
    ],
    correctIndex: 1,
    explanation:
      "Blindly saare related entities include karna 'over-fetching' create karta hai — unnecessary bade JOIN operations, zyada data database se transfer hota hai jo kabhi use hi nahi hoga. Ye N+1 ke opposite extreme jaisa hi ek performance anti-pattern hai. Sahi approach: sirf wahi related data eager-load karo jo genuinely us specific query/use-case me chahiye.",
    difficulty: "medium",
  },
];

export default quiz;
