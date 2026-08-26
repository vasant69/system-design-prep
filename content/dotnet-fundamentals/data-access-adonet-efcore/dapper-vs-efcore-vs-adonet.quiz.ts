import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dapper-efcore-1",
    question: "Dapper ko 'micro-ORM' kyun kaha jaata hai, aur raw ADO.NET se ye kaise alag hai?",
    options: [
      "Dapper SQL bhi khud generate karta hai jaise EF Core",
      "Dapper me SQL manually likhna padta hai (jaise ADO.NET), lekin ye row-to-object mapping automatically kar deta hai",
      "Dapper sirf chhote databases ke liye kaam karta hai",
      "Dapper aur ADO.NET bilkul identical hain",
    ],
    correctIndex: 1,
    explanation:
      "Dapper 'micro-ORM' isliye kehlata hai kyunki ye ek full ORM (jaise EF Core) ka poora feature-set nahi deta — developer khud SQL likhta hai, exactly ADO.NET ki tarah. Lekin Dapper is manual mapping boilerplate (reader.GetInt32 waghera) ko eliminate kar deta hai, automatically rows ko strongly-typed objects me map karke. Ye ADO.NET se genuinely alag hai (mapping automatic hai) aur EF Core se bhi alag hai (SQL manual hai, LINQ translation nahi).",
    difficulty: "medium",
  },
  {
    id: "dapper-efcore-2",
    question: "Performance ke terms me, teeno approaches ka roughly kaisa order hota hai (fastest to generally-slowest for a given query)?",
    options: [
      "EF Core > Dapper > Raw ADO.NET",
      "Raw ADO.NET aur Dapper bahut close (Dapper thoda overhead), EF Core generally sabse zyada overhead",
      "Dapper > Raw ADO.NET > EF Core",
      "Sab teeno exactly same performance dete hain hamesha",
    ],
    correctIndex: 1,
    explanation:
      "Dapper internally ADO.NET use karta hai aur sirf mapping layer add karta hai, jo minimal overhead hai — isliye Dapper raw ADO.NET ke bahut close hai performance me. EF Core generally sabse zyada per-query overhead deta hai (LINQ-to-SQL translation + change tracking bookkeeping), chahe practically ye difference bahut applications ke liye negligible ho.",
    difficulty: "medium",
  },
  {
    id: "dapper-efcore-3",
    question: "Ek mature production codebase me EF Core aur Dapper dono use karne ka kya common, sensible pattern hai?",
    options: [
      "Kabhi bhi dono ek saath use nahi karna chahiye, ek hi choose karna zaroori hai",
      "EF Core default rakhna (CRUD, migrations), aur Dapper ko specific, profiled hot paths ke liye use karna",
      "Sirf Dapper use karna aur EF Core ko completely avoid karna hamesha",
      "Har naye feature ke liye randomly ek choose karna",
    ],
    correctIndex: 1,
    explanation:
      "Ek proven, real-world pattern hai EF Core ko default rakhna (productivity, migrations, standard business logic ke liye) aur Dapper ko specifically un hot paths ke liye reach karna jahan profiling genuinely dikhaye ki EF Core overhead matter kar raha hai (complex aggregations, extremely high-throughput reads). Ye dono tools ko unki respective strengths pe use karta hai, bina ek ko dusre ke against force kiye.",
    difficulty: "hard",
  },
  {
    id: "dapper-efcore-4",
    question: "Ek team bina profiling kiye 'EF Core slow hai' assume karke poora codebase Dapper me rewrite karne ka decision leti hai. Iska kya risk hai?",
    options: [
      "Koi risk nahi, ye hamesha ek acchi decision hoti hai",
      "Premature optimization — significant engineering effort waste ho sakta hai agar actual bottleneck kahin aur ho ya meaningful scale pe exist hi na kare",
      "Dapper EF Core se hamesha slower hota hai isliye ye galat decision hai",
      "Ye decision database ko corrupt kar degi",
    ],
    correctIndex: 1,
    explanation:
      "Bina measurement/profiling ke performance decisions lena classic premature optimization hai — significant migration effort invest ho sakta hai jab actual bottleneck kuch aur ho sakta hai (database indexing, network latency, business logic inefficiency) ya EF Core ka overhead us specific scale pe bilkul negligible ho. Sahi approach: pehle profile karo, phir specific measured hot paths ko target karo, poora codebase blindly rewrite mat karo.",
    difficulty: "medium",
  },
];

export default quiz;
