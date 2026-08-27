import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "subq-1",
    question: "Correlated subquery ko non-correlated subquery se kya cheez alag banati hai?",
    options: [
      "Correlated subquery hamesha faster hoti hai",
      "Correlated subquery outer query ki current row ko reference karti hai, isliye conceptually har outer row ke liye evaluate hoti hai",
      "Non-correlated subquery sirf WHERE clause mein use ho sakti hai",
      "Correlated subquery kabhi bhi aggregate function use nahi kar sakti",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — correlated subquery outer query ki row ko reference karti hai (jaise r.driver_id = d.driver_id), isliye woh independently evaluate nahi ho sakti, har outer row ke liye conceptually re-run hoti hai. A galat hai, correlated subqueries aksar slower hoti hain bina index ke. C galat hai, non-correlated subquery SELECT ya FROM mein bhi use ho sakti hai. D galat hai, correlated subquery mein aggregate functions (jaise MAX) freely use hote hain jaisa example mein dikhaya gaya.",
    difficulty: "medium",
  },
  {
    id: "subq-2",
    question: "CTE (WITH clause) ka sabse bada practical fayda kya hai nested subquery ke comparison mein?",
    options: [
      "CTE hamesha guaranteed faster execute hoti hai",
      "CTE readability improve karta hai jab query multiple logical steps mein todni ho, deeply nested subqueries ke bajaye",
      "CTE mein JOIN use karna allowed nahi hai",
      "CTE automatically data ko permanently ek naya table bana deta hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — CTE ka main value readability hai, especially multi-step logic ke liye har step ko naam dena. A galat hai, performance usually equivalent hoti hai (optimizer-dependent), guaranteed faster nahi. C galat hai, CTE ke andar aur baad wali main query mein JOIN freely use hote hain. D galat hai, CTE temporary hai, sirf usi query ke scope mein exist karta hai, permanent table nahi banata.",
    difficulty: "easy",
  },
  {
    id: "subq-3",
    question: "Ek recursive CTE mein 'base case' aur 'recursive case' ka kya role hota hai?",
    options: [
      "Dono ek hi cheez hain, koi difference nahi",
      "Base case starting rows deta hai, recursive case bar-bar khud ko reference karke ek level neeche jaata hai jab tak naye matching rows na milein",
      "Base case sirf error handling ke liye hai",
      "Recursive case hamesha base case se pehle execute hota hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — base case starting point (jaise direct reports) deta hai, recursive case usi CTE ko baar-baar employees table se join karke hierarchy mein neeche jaata hai, jab tak koi naya matching row na mile (termination). A galat hai, dono ka role clearly alag hai. C galat hai, base case error handling ke liye nahi, starting data ke liye hai. D galat hai, base case pehle chalti hai, phir recursive case uspe build karta hai.",
    difficulty: "medium",
  },
  {
    id: "subq-4",
    question: "Ek query mein same intermediate result set ko multiple alag statements mein reuse karna hai aur woh result set bahut bada hai — is scenario mein CTE se better option kya ho sakta hai?",
    options: [
      "Temp table, jo ek baar materialize hoke explicitly index bhi ho sakti hai",
      "Scalar subquery, kyunki woh sabse fast hoti hai",
      "CROSS JOIN, kyunki woh sabse flexible hai",
      "Koi option nahi hai, CTE hi hamesha best choice hai",
    ],
    correctIndex: 0,
    explanation: "Sahi answer A hai — jab intermediate result bada ho aur multiple separate statements mein reuse karna ho, temp table ek baar materialize hoke reuse ho sakti hai aur usse index bhi kiya ja sakta hai, jabki CTE sirf usi single query ke scope tak limited hai. B galat hai, scalar subquery sirf ek single value ke liye hai, bade result set ke liye nahi. C irrelevant hai, CROSS JOIN ka is problem se koi lena dena nahi. D galat hai, jaisa explain kiya CTE har scenario ke liye best nahi hai.",
    difficulty: "hard",
  },
];

export default quiz;
