import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "sql-nosql-1",
    question: "Ek e-commerce checkout flow mein order place karna, inventory decrement karna, aur payment record karna ek hi atomic operation honi chahiye. Yeh requirement kis database type ke liye natural fit hai, aur kyun?",
    options: [
      "NoSQL key-value store, kyunki writes fast hoti hain",
      "Relational (SQL) database, kyunki multi-table ACID transactions natively support hoti hain",
      "Dono equally accha kaam karenge, koi difference nahi",
      "Document store, kyunki flexible schema chahiye",
    ],
    correctIndex: 1,
    explanation: "Relational databases multi-table ACID transactions natively support karte hain, jo exactly yeh use case chahiye — agar ek step fail ho, poora transaction rollback ho sakta hai. NoSQL stores mein multi-record atomicity limited ya absent hoti hai, isliye application layer mein manually consistency handle karni padegi. Yeh dono database types ke liye equally suitable scenario nahi hai, aur flexible schema yahan requirement hi nahi hai.",
    difficulty: "easy",
  },
  {
    id: "sql-nosql-2",
    question: "Ek IoT platform lakhon devices se per-second sensor readings ingest kar raha hai, simple key-based writes ke saath. Yeh workload kis database category ke liye better fit hai?",
    options: [
      "Relational database, kyunki sabhi data structured hona chahiye",
      "NoSQL key-value ya wide-column store, kyunki yeh horizontal partitioning aur massive simple-key write throughput ke liye design kiye gaye hain",
      "Koi bhi database use nahi karna chahiye, files mein store karo",
      "Relational database with a single large table aur no indexes",
    ],
    correctIndex: 1,
    explanation: "NoSQL key-value ya wide-column stores exactly is pattern ke liye design kiye gaye hain — massive write throughput, simple key-based access, aur native horizontal partitioning across many machines. Relational databases bhi structured data handle kar sakte hain lekin unhe horizontally scale karna (sharding) manually complex hota hai is scale pe. Files use karna ya indexes na rakhna dono impractical approaches hain production ke liye.",
    difficulty: "medium",
  },
  {
    id: "sql-nosql-3",
    question: "Polyglot persistence ka matlab kya hai, aur real-world large systems mein yeh kyun common hai?",
    options: [
      "Ek hi database mein saari data types store karna",
      "Alag-alag workloads ke liye alag-alag database types use karna, kyunki har workload ki consistency, schema, aur scale requirements alag hoti hain",
      "Sirf multiple programming languages use karna backend mein",
      "Database ko har 6 mahine mein replace karna",
    ],
    correctIndex: 1,
    explanation: "Polyglot persistence ka matlab hai ki ek hi system ke andar different workloads (jaise financial transactions, session cache, flexible-schema content, high-volume telemetry) apne liye best-fit database type use karte hain, ek single database ko sabke liye force-fit karne ke bajaye. Yeh ek hi database mein sab kuch store karne ke opposite hai, programming languages se unrelated hai, aur database replacement schedule se koi lena-dena nahi hai.",
    difficulty: "medium",
  },
  {
    id: "sql-nosql-4",
    question: "Interview mein SQL vs NoSQL poocha jaaye to sabse weak answer approach kaunsa hai?",
    options: [
      "Data relationships, consistency requirement, schema stability, aur access pattern/scale ko systematically evaluate karna",
      "Reflexively ek side pick karna (jaise NoSQL hamesha modern aur scalable hai) bina actual requirements evaluate kiye",
      "Yeh mention karna ki different parts of the same system alag database types use kar sakte hain",
      "Ek concrete failure mode explain karna galat choice ka, jaise financial transactions ko NoSQL mein force karna",
    ],
    correctIndex: 1,
    explanation: "Sabse weak approach hai binary reflexive thinking — jaise NoSQL ko automatically better maan lena bina actual consistency, relationship, ya scale requirements dekhe. Baaki teeno options (systematic framework, polyglot persistence mention karna, concrete failure mode explain karna) strong interview answers ki nishani hain jo dikhate hain ki candidate trade-offs samajhta hai.",
    difficulty: "hard",
  },
];

export default quiz;
