import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lld-walkthrough-1",
    question: "Is design me AvailableCopies field ko public settable se private set kyun kiya gaya?",
    options: [
      "Performance improve karne ke liye",
      "Encapsulation ke liye — external code directly invalid value set na kar sake, sirf Borrow()/Return() methods ke through hi controlled tareeke se change ho",
      "C# me public fields allowed hi nahi hain",
      "Kyunki interfaces me fields nahi ho sakte",
    ],
    correctIndex: 1,
    explanation:
      "Public settable field koi bhi caller ko directly invalid state (jaise negative AvailableCopies) create karne deta hai. private set + controlled Borrow()/Return() methods encapsulation ka classic use hai — domain validation entity ke andar hi rehti hai. Option A irrelevant hai is decision se, C aur D dono factually galat statements hain.",
    difficulty: "medium",
  },
  {
    id: "lld-walkthrough-2",
    question: "Membership tiers (Regular/Premium) add karte waqt candidate ne inheritance (PremiumMember : Member) ki jagah composition (IMembershipPolicy) kyun choose kiya?",
    options: [
      "Composition hamesha inheritance se better hoti hai, no exceptions",
      "Kyunki membership tier runtime pe change ho sakta hai (upgrade), aur C# me ek object ka type runtime pe change nahi kiya ja sakta — composition (policy swap) ye trivially allow karta hai",
      "Kyunki interfaces classes se faster hote hain",
      "Kyunki inheritance C# me sirf ek level tak allowed hai",
    ],
    correctIndex: 1,
    explanation:
      "Ye is round ka specific decision-point tha — jab behavior runtime-mutable ho sakta hai (member Regular se Premium upgrade kar sakta hai), inheritance is wajah se fit nahi baithta kyunki object ka static type change nahi ho sakta runtime pe. Composition (policy object swap karna) ye seedha allow karta hai. Option A ek overgeneralization hai — context-specific reason hi asli justification hai. C aur D factually irrelevant/galat hain.",
    difficulty: "hard",
  },
  {
    id: "lld-walkthrough-3",
    question: "Do simultaneous requests same book ki last copy borrow karne ki koshish karein — is design me kya risk hai, aur production fix kya hai?",
    options: [
      "Koi risk nahi hai, C# automatically handle kar leta hai",
      "Race condition risk hai — dono AvailableCopies == 1 dekh sakti hain; fix hai database-level optimistic concurrency (RowVersion/ETag)",
      "Risk sirf tab hai jab async/await use na ho",
      "Ye sirf ek UI-level concern hai, backend ka nahi",
    ],
    correctIndex: 1,
    explanation:
      "Agar GetById aur Update alag operations hain bina concurrency control ke, dono requests same stale read dekh sakti hain aur dono Borrow() succeed kar jaayein, jisse AvailableCopies negative ho sakta hai. Production fix EF Core jaisi optimistic concurrency (RowVersion column) hai, jo concurrent conflicting update pe exception throw karti hai. Options A, C, D sab is real concurrency concern ko galat tareeke se dismiss karte hain.",
    difficulty: "hard",
  },
  {
    id: "lld-walkthrough-4",
    question: "Is design me LibraryController seedha Book/Member entities kyun return nahi karta, DTOs kyun use karta hai?",
    options: [
      "DTOs sirf performance ke liye zaroori hain",
      "Taaki internal domain model API contract se decoupled rahe aur bina external clients tode evolve ho sake",
      "Kyunki ASP.NET Core entities ko directly return karna allow hi nahi karta",
      "Sirf naming convention ke liye, koi functional reason nahi",
    ],
    correctIndex: 1,
    explanation:
      "DTOs API boundary ko internal domain model se decouple karte hain — agar Book entity kal internally restructure ho, jab tak DTO shape same rehti hai, external clients ko koi farak nahi padta. Ye over-posting/under-posting risk bhi kam karta hai. Option C factually galat hai — technically possible hai return karna, bas bad practice hai. Options A aur D dono real reason ko miss karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
