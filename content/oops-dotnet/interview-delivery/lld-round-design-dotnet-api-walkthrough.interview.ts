import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "lld-walkthrough-tr-1",
    question: "LLD interview round shuru karte waqt sabse pehla step kya hona chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Amazon", "Flipkart"],
    shortAnswer: "Scope clarify karna aur core entities identify karna, phir ek simple layered design se shuru karna.",
    detailedAnswer:
      "Directly code likhna shuru karne se pehle, requirements ko clarify karna zaroori hai — kaunse entities hain, kaunse operations chahiye, kya out-of-scope hai. Fir ek simple, layered architecture (Controller/Service/Repository) se shuru karo interfaces ke peeche, taaki design testable rahe aur requirements evolve hone par adapt ho sake bina bade rewrite ke.",
    followUp: "Agar interviewer requirements clarify karne se pehle hi 'bas code likho' bole to kya karoge?",
  },
  {
    id: "lld-walkthrough-tr-2",
    question: "Is design me Book.Borrow() method Book entity ke andar hi kyun rakha gaya, service layer me kyun nahi?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Domain validation entity ke saath honi chahiye — Book apna invariant (AvailableCopies >= 0) khud protect kare, service sirf orchestrate kare.",
    detailedAnswer:
      "Agar validation logic (available copies check) service layer me hoti, koi bhi doosra code path jo directly Book manipulate kare us validation ko bypass kar sakta. Entity ke andar rakhne se Book apna invariant khud enforce karta hai chahe kaunsa bhi caller ho — ye encapsulation ka core purpose hai (invariant protection), sirf 'private fields' se zyada.",
  },
  {
    id: "lld-walkthrough-tr-3",
    question: "Membership tiers add hone par candidate ne composition (IMembershipPolicy) choose kiya, inheritance nahi. Ye decision kis principle se justify hota hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Open/Closed Principle — naya tier add karne ke liye Member class modify nahi karni padti, sirf naya policy implementation.",
    detailedAnswer:
      "IMembershipPolicy strategy pattern Open/Closed Principle satisfy karta hai — system extension ke liye open hai (naya IMembershipPolicy implementation add karke) lekin modification ke liye closed hai (Member class ko touch nahi karna padta). Additionally, ye runtime-mutability bhi allow karta hai jo inheritance (static type) nahi kar sakta — member ka policy object runtime pe swap ho sakta hai bina object recreate kiye.",
    followUp: "Agar late fee calculation bhi member-tier-specific ho, isi pattern ko kaise extend karoge?",
  },
  {
    id: "lld-walkthrough-tr-4",
    question: "Ye code me kya bug/gap hai concurrency ke perspective se?\n```csharp\npublic void Borrow()\n{\n    if (AvailableCopies <= 0)\n        throw new InvalidOperationException(\"No copies available\");\n    AvailableCopies--;\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "In-memory ye safe lagta hai, lekin distributed/multi-instance scenario me check-then-act race condition ka risk hai agar underlying storage locking na kare.",
    detailedAnswer:
      "Ye method khud thread-safe lagta hai agar ek single object instance pe sequentially call ho, lekin real system me `Book` DB se load hota hai, method call hoti hai, phir save hota hai — beech me agar do requests parallel me same row load kar lein, dono `AvailableCopies <= 0` false dekhengi (dono ko 1 dikhega), dono decrement karengi, aur final save race karega. Fix production me database-level optimistic concurrency control se hota hai, sirf entity-level method se nahi.",
  },
  {
    id: "lld-walkthrough-tr-5",
    question: "Ye code kya throw karega, aur controller me isko kaise handle kiya gaya hai?\n```csharp\nvar book = _bookRepo.GetById(999)\n    ?? throw new BookNotFoundException(999);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Agar book ID 999 exist nahi karti, BookNotFoundException throw hoga, jo controller specifically catch karke 404 Not Found return karta hai.",
    detailedAnswer:
      "`?? throw` null-coalescing throw expression hai — agar `GetById(999)` null return kare, exception turant throw ho jaata hai us line pe. Controller isko specifically catch karta hai (`catch (BookNotFoundException ex) { return NotFound(ex.Message); }`), jo ek generic `catch (Exception)` se zyada precise hai — is wajah se custom exception ka use justified tha, exact HTTP status mapping ke liye.",
  },
  {
    id: "lld-walkthrough-tr-6",
    question: "Interviewer poochta hai: 'Late fee calculation add karna ho to design kaise extend karoge?' — kaise approach karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ek ILateFeeCalculator interface add karo jo Policy.WaivesLateFee check kare — existing Strategy pattern ko hi extend karo.",
    detailedAnswer:
      "Existing design me `IMembershipPolicy` already `WaivesLateFee` flag carry karta hai. Ek naya `ILateFeeCalculator` interface define karke, ek implementation likho jo return date ke basis pe fee calculate kare, lekin `Policy.WaivesLateFee` true ho to zero return kare. Ye existing abstractions ko reuse karta hai — koi existing class modify nahi karni padti, sirf naya component add hota hai, jo phirse OCP demonstrate karta hai.",
  },
  {
    id: "lld-walkthrough-tr-7",
    question: "Interviewer poochta hai: 'Agar search/filter books by author/title chahiye ho, repository interface kaise change karoge?'",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "IBookRepository me ek SearchAsync(criteria) method add karo; agar search genuinely complex ho jaaye, alag read-model/CQRS consider karo.",
    detailedAnswer:
      "Simple case me `IBookRepository` interface me ek naya method add kar sakte ho — `Task<IEnumerable<Book>> SearchAsync(string? title, string? author)`. Agar search requirements bahut complex ho jaayein (full-text search, pagination, ranking), tab ek alag read-optimized model ya CQRS-style separation consider karna sensible hoga — lekin shuru me over-engineer nahi karna, YAGNI respect karna important hai jab tak requirement genuinely justify na kare.",
    followUp: "ISP (Interface Segregation) ke perspective se, kya IBookRepository me search method add karna sahi hai ya alag interface banana chahiye?",
  },
  {
    id: "lld-walkthrough-tr-8",
    question: "Is poore design ko SOLID principles se map karo — har letter ka ek concrete example do.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "SRP (Book apna state manage karta hai), OCP (naya membership tier bina Member modify kiye), LSP (koi risky inheritance nahi), ISP (chhote focused interfaces), DIP (Service interfaces pe depend karta hai).",
    detailedAnswer:
      "SRP: `Book` apna borrow/return invariant khud manage karta hai, `LibraryService` orchestration karta hai, `LibraryController` sirf HTTP concerns handle karta hai — har class ka ek hi reason to change hai. OCP: naya `IMembershipPolicy` implementation add karke naya tier support hota hai, `Member` class untouched rehti hai. LSP: design me koi behavior-changing inheritance hai hi nahi, isliye violate hone ka risk avoid ho gaya. ISP: `IBookRepository` aur `IMemberRepository` alag, focused interfaces hain, ek fat interface nahi. DIP: `LibraryService` concrete repositories pe nahi, interfaces pe depend karta hai, DI container actual implementations wire karta hai.",
  },
  {
    id: "lld-walkthrough-tr-9",
    question: "Kya ye statement sahi hai: 'Chhoti LLD problems (jaise library system) me interfaces overkill hain, seedha concrete classes use karne chahiye speed ke liye'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — interfaces ka cost minimal hai aur testability/extensibility ka benefit turant milta hai, chhoti problem me bhi.",
    detailedAnswer:
      "Ye ek tempting lekin galat shortcut hai. Interfaces likhne ka extra effort minimal hai (ek method signature duplicate karna), aur immediate benefit milta hai — unit testing (Moq se mock), aur agar requirements evolve hoti hain (jaise storage swap, ya membership tiers jaisa is round me hua), design already flexible hota hai. LLD rounds specifically isi discipline ko test karte hain — 'chhota hai isliye shortcuts le lo' wala approach interviewer ko red flag lagta hai.",
    redFlag: "'Ye chhota system hai, itni abstraction ki zaroorat nahi' bolke seedha concrete classes likhna interview me — ye exactly ulta signal deta hai jo interviewer dekhna chahta hai.",
  },
  {
    id: "lld-walkthrough-tr-10",
    question: "Interviewer bolta hai: 'Design me sabse weak point kya lagta hai tumhe abhi?' — is round ke context me sahi answer kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Concurrency handling — race condition risk on AvailableCopies jab tak explicit optimistic concurrency control add na ho.",
    detailedAnswer:
      "Is transcript ke design me, jab tak specifically discuss nahi hua, concurrency ek genuine gap hai — do simultaneous borrow requests last copy pe race kar sakti hain. Proactively is gap ko raise karna (jaise upar candidate ne kiya) khud ek strong senior-level signal hai — self-aware hona apne design ki limitations ke baare me, bina interviewer ke poochne ka wait kiye, ye exactly wo cheez hai jo SDE-3+ level candidates ko differentiate karta hai.",
    followUp: "Agar high-scale library system ban raha ho (millions of books), aur kya architectural changes consider karoge?",
  },
];

export default questions;
