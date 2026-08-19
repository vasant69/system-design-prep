import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "ltb-1",
    question:
      "Highway analogy mein, agar highway par lanes (bandwidth) badha di jaayein, to ek single car ke travel time (latency) ka kya hoga?",
    options: [
      "Latency proportionally kam ho jaayegi jitni lanes badhi",
      "Latency roughly same rahegi — extra lanes se throughput ceiling badhta hai, ek single car ka travel time nahi",
      "Latency zero ho jaayegi",
      "Latency lanes ke inverse mein badh jaayegi",
    ],
    correctIndex: 1,
    explanation:
      "Bandwidth (lanes) throughput ki ceiling badhata hai — zyada cars ek saath ja sakti hain — lekin ek single car ka start-to-end travel time (latency) speed limit aur distance pe depend karta hai, lanes ki count pe nahi. Isliye (B) correct hai; baaki options is core distinction ko galat samajhte hain.",
    difficulty: "easy",
  },
  {
    id: "ltb-2",
    question:
      "Ek system writes ko batch karke process karta hai (100 writes ikattha karke ek commit). Isse system par kya effect padega?",
    options: [
      "Throughput aur latency dono improve honge, koi trade-off nahi hai",
      "Throughput improve hoga (per-write overhead amortize hoga), lekin individual write ki latency badh sakti hai kyunki usse batch fill hone tak wait karna padta hai",
      "Sirf latency improve hogi, throughput par koi asar nahi",
      "Dono metrics worse ho jaayenge",
    ],
    correctIndex: 1,
    explanation:
      "Batching classic latency-vs-throughput trade-off hai: per-operation overhead amortize hone se throughput badhti hai, lekin ek individual write ko batch complete hone tak wait karna padta hai, so uski latency badh sakti hai. (A) galat hai kyunki trade-off ignore karta hai; (C) aur (D) direction hi galat batate hain.",
    difficulty: "medium",
  },
  {
    id: "ltb-3",
    question:
      "Ek system ki average latency 50ms report hoti hai. Interviewer poochta hai 'is number par bharosa karoge?'. Sabse sahi response kya hoga?",
    options: [
      "Haan, average sabse reliable metric hai performance ke liye",
      "Nahi — average outliers ko hide kar sakta hai; p95/p99 dekhna chahiye taaki tail latency (worst-experience users) pata chale",
      "Nahi, average kabhi useful nahi hota, sirf p50 hi dekhna chahiye",
      "Average sirf throughput ke liye relevant hai, latency ke liye nahi",
    ],
    correctIndex: 1,
    explanation:
      "Average ek misleading metric ho sakta hai kyunki chand outliers (jaise ek request jo 5000ms le raha ho) average ko thoda hi badhaate hain lekin us user ka experience terrible hota hai. Percentiles (p95/p99) tail experience reveal karte hain jo average chhupa deta hai. (A) galat hai, (C) overstated hai (p50 bhi average jaisi hi limitation share karta hai partially, but percentiles overall better hain), (D) galat premise hai.",
    difficulty: "medium",
  },
  {
    id: "ltb-4",
    question:
      "Little's Law ki conceptual intuition ke according, Throughput = Concurrency / Latency. Agar ek system ki per-request latency high hai aur concurrency badhaayi nahi ja sakti, throughput ke baare mein kya sach hoga?",
    options: [
      "Throughput apne aap high ho jaayega bandwidth badhne se",
      "Throughput limited rahega, chahe bandwidth kitni bhi zyada ho — kyunki latency high hai aur concurrency fix hai",
      "Throughput ka latency ya concurrency se koi relation nahi hai",
      "Throughput hamesha latency ke barabar hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Formula ke according throughput seedha concurrency par depend karta hai aur latency ke inverse mein. Agar latency high hai aur concurrency badhaai nahi ja sakti, throughput ceiling low hi rahega — bandwidth is formula mein directly involved nahi hai, so bandwidth badhaana isse fix nahi karega. (A), (C), aur (D) formula ki basic relationship ko galat represent karte hain.",
    difficulty: "hard",
  },
];

export default quiz;
