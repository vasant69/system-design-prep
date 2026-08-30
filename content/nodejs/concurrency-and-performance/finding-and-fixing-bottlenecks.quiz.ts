import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "finding-and-fixing-bottlenecks-1",
    question:
      "Ek endpoint dev par 30ms leta hai lekin production load par p50 120ms / p99 4200ms deta hai, CPU 95%. Ye symptom pattern sabse zyada kis cheez ki taraf ishara karta hai?",
    options: [
      "Ek memory leak — RSS badh raha hoga",
      "Event loop blocking — kuch synchronous CPU-heavy kaam har request par loop ko sekron ms rok raha hai, jo sirf concurrent load par serialize ho ke surface hota hai",
      "Network latency between the client and server",
      "Ek missing database index",
    ],
    correctIndex: 1,
    explanation:
      "'Dev fine, load bad' + high CPU + 'p50 OK, p99 terrible' classic event-loop-congestion signature hai: ek sync block dev par (ek request at a time) chhupa rehta hai, load par saare requests ek thread par serialize ho jaate hain. Memory leak (option A) RSS growth aur eventual OOM dikhata, CPU spike nahi. Network latency (option C) CPU high nahi karti. Missing index (option D) possible hai lekin wo flamegraph flat rakhta (CPU idle, waiting on DB) — yahan CPU 95% hai, to sync CPU work.",
    difficulty: "medium",
  },
  {
    id: "finding-and-fixing-bottlenecks-2",
    question:
      "Flamegraph (CPU profile) padhte waqt kaunsa frame tumhara pehla optimization target hona chahiye?",
    options: [
      "Sabse tall (deepest) tower, kyunki wo sabse complex code path hai",
      "Sabse wide frame (sabse zyada total time), kyunki width hi time-spent represent karti hai — ek tall-but-thin tower time-wise sasta hai",
      "Jo frame flamegraph mein sabse upar (top) hai",
      "Jo frame red colour mein hai",
    ],
    correctIndex: 1,
    explanation:
      "Flamegraph mein width = time. Widest frame sabse zyada CPU time consume kar raha hai — wahi #1 target. Height sirf call-stack depth hai (ek deep chain jo fast execute hoti hai wide nahi hoti). Colour aur vertical position meaningful nahi hote (colour aksar bas hashing/random hota hai). Self-time bhi dekho — ek wide frame jiska time saara children mein hai wo bas ek dispatcher hai.",
    difficulty: "medium",
  },
  {
    id: "finding-and-fixing-bottlenecks-3",
    question:
      "Case study mein `POST /report` idempotency key ke liye `crypto.pbkdf2Sync(body, salt, 200000, 64, 'sha512')` use kar raha tha. Sabse achha fix kya hai?",
    options: [
      "pbkdf2 iterations ko 200000 se 50000 kar dena",
      "Idempotency dedup ke liye ek KDF ki zaroorat hi nahi — `crypto.createHash('sha256').update(body).digest('hex')` use karo, jo same input par ~5ms leta hai vs pbkdf2Sync ka ~120ms; agar genuinely ek heavy KDF chahiye (jaise password verify) to use worker_threads / piscina par offload karo",
      "Hash ko poori tarah hata do — idempotency important nahi",
      "`pbkdf2Sync` ko `setTimeout(() => pbkdf2Sync(...), 0)` mein wrap karo",
    ],
    correctIndex: 1,
    explanation:
      "KDF ka slow-ness deliberately brute-force ko mehnga karne ke liye hai — content dedup mein iska koi matlab nahi. `createHash('sha256')` collision-resistant fingerprint deta hai fraction of the cost par. Agar KDF genuinely chahiye (password), to async `pbkdf2` ya worker pool. Option A abhi bhi blocking (bas kam). Option C requirement todta hai. Option D useless — `setTimeout` sync kaam ko block hone se nahi rokta, bas thoda baad karta hai, aur function abhi bhi event loop par hi chalega.",
    difficulty: "hard",
  },
  {
    id: "finding-and-fixing-bottlenecks-4",
    question:
      "Teen bottlenecks identify hue. Inhe ek saath deploy karne ke bajaye ek-ek karke fix karke re-measure kyun karte hain?",
    options: [
      "Kyunki Node ek waqt mein sirf ek code change accept karta hai",
      "Taaki har fix ka impact attributable rahe (kaunse ne kitna help kiya), aur agar koi change kuch regress kare (jaise ek cache jo GC pressure badha de) to wo net improvement ke peeche chhupe nahi, turant pakda jaye",
      "Ek saath deploy karna hamesha build ko tod deta hai",
      "Re-measuring optional hai; ek saath deploy karna theek hai agar numbers improve ho jaayen",
    ],
    correctIndex: 1,
    explanation:
      "Iterative fixing se: (1) har change ka effect isolate hota hai — case study mein hash fix ne sabse zyada diya (58 to 145 req/s); (2) regressions net gain ke peeche hide nahi hote; (3) reviewer ko har change evidence ke saath justify kar sakte ho. Option A/C technically galat. Option D exactly wo mindset hai jo attribution aur regression detection dono kho deta hai.",
    difficulty: "medium",
  },
];

export default quiz;
