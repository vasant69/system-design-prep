import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "stored-procedures-and-functions-1",
    question: "Ek SQL function aur stored procedure mein sabse fundamental difference kya hai?",
    options: ["Function data modify kar sakta hai, procedure nahi", "Function hamesha ek value return karta hai aur query expression ke andar use ho sakta hai, procedure standalone CALL hota hai", "Procedure sirf SELECT statements ke liye hota hai", "Dono bilkul same hain, sirf naam alag hai"],
    correctIndex: 1,
    explanation: "Sahi jawab hai ki function value return karta hai aur SELECT jaisi query expression ke andar embed ho sakta hai, jabki procedure independently CALL kiya jaata hai aur zaroori nahi ki value return kare. Reality mein procedures typically data modify karte hain, functions side-effect-free hone chahiye — pehla option ulta hai. Procedure sirf SELECT tak limited nahi, woh INSERT/UPDATE/DELETE bhi kar sakta hai.",
    difficulty: "easy",
  },
  {
    id: "stored-procedures-and-functions-2",
    question: "Stored procedures ka sabse bada performance benefit kya hai jab app aur database alag network zones mein hon?",
    options: ["Yeh database ka storage size kam kar deta hai", "Multiple statements ek hi call mein execute hote hain, isliye network round-trips kam hote hain", "Yeh automatically deadlocks prevent kar deta hai", "Yeh query results ko cache kar deta hai"],
    correctIndex: 1,
    explanation: "Sahi jawab hai reduced network round-trips — jab 5 statements ek stored procedure ke andar execute hote hain, to sirf 1 round-trip lagta hai application se database tak, jabki 5 separate statements 5 round-trips lete. Storage size, deadlock prevention, aur caching iska direct benefit nahi hain.",
    difficulty: "medium",
  },
  {
    id: "stored-procedures-and-functions-3",
    question: "Ek team heavy business logic ko stored procedures mein daal deti hai, lekin baad mein realize karti hai ki feature changes bahut slow ho gaye hain. Yeh kis trade-off ka result hai?",
    options: ["Stored procedures hamesha slow hote hain execution mein", "Version control aur testing tooling stored procedures ke liye weaker hoti hai application code ke comparison mein", "Database ne stored procedures support karna band kar diya", "Yeh sirf ek coincidence hai, koi real trade-off nahi hai"],
    correctIndex: 1,
    explanation: "Sahi jawab hai ki stored procedures ko version control mein track karna, unit test likhna, aur CI/CD se deploy karna generally application code se harder hota hai — yehi wajah hai ki feature iteration slow ho jaata hai. Stored procedures execution mein slow nahi hote, actually precompiled hone se fast hote hain. Yeh koi coincidence nahi, ek well-known real trade-off hai.",
    difficulty: "medium",
  },
  {
    id: "stored-procedures-and-functions-4",
    question: "Ek team database vendor switch karne ki soch rahi hai (jaise Oracle se PostgreSQL). Heavy PL/SQL stored procedures is decision ko kaise affect karte hain?",
    options: ["Koi effect nahi, saara SQL syntax universal hota hai", "Migration bahut zyada costly ho jaata hai kyunki procedural syntax database-specific hai aur rewrite karna padta hai", "Stored procedures automatically naye database mein convert ho jaate hain", "Yeh migration ko actually easier bana deta hai"],
    correctIndex: 1,
    explanation: "Sahi jawab hai ki heavy database-specific procedural logic (jaise Oracle ka PL/SQL) migration ko bahut costly bana deta hai, kyunki naye database (jaise PostgreSQL ka PL/pgSQL) ka syntax alag hota hai aur sab kuch rewrite karna padta hai — yeh vendor lock-in ka classic example hai. SQL syntax basic level pe similar hota hai lekin procedural extensions vendor-specific hoti hain, universal nahi. Automatic conversion generally possible nahi hota complex logic ke liye.",
    difficulty: "hard",
  },
];

export default quiz;
