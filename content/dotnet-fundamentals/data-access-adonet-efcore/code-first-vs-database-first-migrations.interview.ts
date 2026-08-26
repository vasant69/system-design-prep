import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "codefirst-tr-1",
    question: "Code-First aur Database-First approach me fundamental difference kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Cognizant", "Accenture"],
    shortAnswer: "Code-First me C# classes se schema generate hota hai (migrations); Database-First me existing database se C# classes generate hoti hain (scaffolding).",
    detailedAnswer:
      "Code-First me developer entity classes likhta hai, aur EF Core Migrations (`dotnet ef migrations add` + `dotnet ef database update`) us se actual database schema generate/apply karta hai — C# code source of truth hai. Database-First me database already exist karta hai, aur `dotnet ef dbcontext scaffold` command use inspect karke matching entity classes aur DbContext reverse-generate karta hai — database source of truth hai. Direction bilkul opposite hai.",
    followUp: "Kis type ke project me kaunsa approach zyada natural fit hota hai?",
  },
  {
    id: "codefirst-tr-2",
    question: "Ek naya greenfield microservice bana rahe ho jahan tumhari team hi schema design control karti hai. Code-First ya Database-First — kaunsa choose karoge, aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Code-First — schema evolution application development ke saath tightly coupled honi chahiye, aur migrations schema history ko code ke saath version-control me rakhte hain.",
    detailedAnswer:
      "Greenfield project me, jahan koi existing database nahi hai aur team khud schema design karti hai, Code-First natural fit hai. Migrations ke through, har schema change ek versioned, reviewable artifact ban jaata hai jo application code ke saath ek hi PR/commit me ja sakta hai — feature aur uske schema changes ek hi jagah track hote hain. Ye CI/CD me automated deployment bhi enable karta hai (`database update` ek deployment step ban sakta hai).",
  },
  {
    id: "codefirst-tr-3",
    question: "Team lead kehta hai 'Database-First outdated approach hai, hamesha Code-First use karna chahiye.' Kya ye sahi hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — dono genuinely alag project realities ke liye hain, universal 'better' nahi hai.",
    detailedAnswer:
      "Ye ek oversimplification hai. Database-First genuinely zaroori hota hai jab database ek existing, mature, ya multiple-application-shared resource hai jise application team unilaterally control nahi kar sakti (jaise ek central enterprise database jise DBA team govern karti hai). Aise scenario me Code-First force karna galat hoga — application ko schema changes drive karne ka koi mandate nahi hai. Choice project ki reality pe depend karta hai, ek approach universally 'behtar' nahi hai.",
    redFlag: "Bina context ke ek approach ko universally superior declare karna — engineering judgement ki kami dikhata hai.",
  },
  {
    id: "codefirst-tr-4",
    question: "`dotnet ef migrations add InitialCreate` chalane ke baad kya-kya generate hota hai, aur `dotnet ef database update` se pehle kya review karna chahiye?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Ek migration class file (Up/Down methods) generate hoti hai; apply karne se pehle generated SQL/operations review karna chahiye, especially destructive changes ke liye.",
    detailedAnswer:
      "`migrations add` ek naya C# class file generate karta hai current model snapshot ke against — usme `Up()` method (schema ko naye state me le jaane wale operations) aur `Down()` method (rollback). `database update` isse actually apply karta hai. Production ke liye best practice: `dotnet ef migrations script` se pehle actual SQL generate karo aur manually review karo — especially destructive operations (column drop, type narrowing, NOT NULL constraint add karna existing data ke saath) ke liye, jo bina careful review ke data loss cause kar sakte hain.",
    followUp: "Agar production me ek migration apply karne ke baad koi issue mile, kaise rollback karoge?",
  },
  {
    id: "codefirst-tr-5",
    question: "Ek team ne pehle Database-First se schema scaffold kiya tha, ab wo aage se schema changes ko better version-control karna chahti hai. Kya ye possible hai bina poora schema dobara design kiye?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Haan — ek common hybrid pattern hai: existing scaffold ko baseline maan kar, aage ke changes ke liye Code-First migrations adopt karna.",
    detailedAnswer:
      "Ye ek realistic, common scenario hai. Team current schema ko ek baseline migration ki tarah 'adopt' kar sakti hai (EF Core is process ko support karta hai — existing schema ko match karne wala ek initial migration create karke, use as-already-applied mark karna), aur uske baad se naye schema changes normal Code-First `migrations add`/`database update` workflow se karna. Ye migration ka poora schema history redesign nahi karta, sirf future changes ko better-tracked banata hai.",
  },
  {
    id: "codefirst-tr-6",
    question: "Do developers parallel branches pe kaam kar rahe hain aur dono independently migrations generate karte hain. Merge karte waqt kya issue aa sakta hai, aur kaise avoid karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Migration conflicts/schema drift ho sakta hai; team convention hona chahiye ki migrations ko main branch se turant pehle regenerate/rebase kiya jaaye.",
    detailedAnswer:
      "Agar dono developers alag-alag model snapshots se migrations generate karte hain, merge ke baad EF Core ka model snapshot inconsistent ho sakta hai — dono migrations ek hi table pe conflicting assumptions kar sakti hain. Best practice: migrations ko merge se pehle main/latest branch pe rebase karke regenerate karo (ya kam se kam verify karo ki tumhari migration latest snapshot ke against sahi hai), aur team convention rakho ki ek time pe schema-changing PRs sequentially merge/review ho, parallel schema changes minimize kiye jaayein.",
  },
  {
    id: "codefirst-tr-7",
    question: "Kya ye statement sahi hai: 'Database-First approach me, agar database schema change ho jaaye, C# code automatically sync ho jaata hai'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat — scaffolding dobara manually/explicitly run karni padti hai, koi automatic sync nahi hota.",
    detailedAnswer:
      "Database-First me, agar underlying database schema change hoti hai (kisi aur tool ya DBA se), C# entity classes automatically update nahi hote. Developer ko explicitly `dotnet ef dbcontext scaffold` dobara run karna padta hai naya current-state code generate karne ke liye — aur agar pehle se koi manual customizations the generated files me, wo overwrite ho sakti hain (isliye partial classes ya separate config files use karna recommended hai customizations ke liye).",
    redFlag: "'Database-First automatically sync rehta hai' jaisa galat statement — batata hai workflow ka practical mechanism samjha nahi gaya.",
  },
];

export default questions;
