import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "conn-disconn-1",
    question: "Disconnected architecture (`DataSet`/`DataTable`) me connection kab close hota hai?",
    options: [
      "Jab tak application shut down na ho, connection open rehta hai",
      "`Fill()` complete hone ke turant baad, automatically",
      "Sirf jab developer manually `Close()` call kare",
      "Kabhi close nahi hota, pool khud manage karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`SqlDataAdapter.Fill()` internally connection open karta hai, poora result memory me copy karta hai, aur turant connection close kar deta hai — yahi 'disconnected' naam ka reason hai. Data uske baad completely offline, in-memory hota hai. Option A connected model ke galat samajh ko describe karta hai, C aur D dono factually incorrect hain is default behavior ke liye.",
    difficulty: "easy",
  },
  {
    id: "conn-disconn-2",
    question: "Connection pooling ke context me, `SqlConnection.Close()`/`Dispose()` call karne par actually kya hota hai?",
    options: [
      "Physical TCP connection database se turant tod di jaati hai",
      "Physical connection ek pool me wapas chala jaata hai, reuse ke liye available",
      "Connection permanently corrupt ho jaata hai, dobara use nahi ho sakta",
      "Kuch nahi hota jab tak application restart na ho",
    ],
    correctIndex: 1,
    explanation:
      "Connection pooling ka core idea yahi hai — `Close()`/`Dispose()` physical database connection ko turant nahi todta, use ek pool me wapas rakh deta hai same connection string ke liye future reuse ke vaaste. Isi wajah se short-lived connections (baar-baar open/close) practically cheap hain. Option A batata hai jo pooling ke bina hota, jo galat assumption hai.",
    difficulty: "medium",
  },
  {
    id: "conn-disconn-3",
    question: "Ek developer application startup pe ek static, shared `SqlConnection` banata hai 'performance improve karne' ke liye, saari requests isi ko reuse karti hain. Ye approach kyun problematic hai?",
    options: [
      "Ye best practice hai, koi issue nahi hai",
      "Concurrent requests same connection object pe race karengi, jisse 'connection already in use' jaise errors aayenge, aur connection pooling ka fayda bhi khatam ho jaata hai",
      "SqlConnection thread-safe hota hai isliye ye fine hai",
      "Isse database load kam ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`SqlConnection` instance thread-safe nahi hai concurrent operations ke liye — ek hi connection object ko multiple requests simultaneously use karne se conflicts hote hain. Aur connection pooling already efficient reuse deta hai short-lived connections ke through, isliye manually ek shared connection banane ki koi zaroorat nahi — ye actual best practice ko defeat karta hai, improve nahi karta.",
    difficulty: "medium",
  },
  {
    id: "conn-disconn-4",
    question: "Ek query lakhon rows return karti hai, aur unhe process karke ek report file me likhna hai bina poora result memory me ek saath load kiye. Kaunsa approach zyada appropriate hai?",
    options: [
      "DataSet me poora result load karke phir process karo",
      "SqlDataReader use karo aur row-by-row stream karke process karo",
      "Query ko chhote-chhote batches me manually split karo",
      "ExecuteScalar use karo",
    ],
    correctIndex: 1,
    explanation:
      "`SqlDataReader` exactly is scenario ke liye design kiya gaya hai — connected, forward-only streaming jahan ek time pe sirf ek row memory me hoti hai. Ye lakhon rows ko bina bade memory footprint ke process karne deta hai. `DataSet` (option A) poora result memory me load karega, jo yahan wasteful/risky hai. Option C unnecessary complexity add karta hai, option D single value ke liye hai, list ke liye nahi.",
    difficulty: "medium",
  },
];

export default quiz;
