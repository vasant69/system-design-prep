import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "boe-1",
    question:
      "Back-of-the-envelope estimation mein interviewer sabse zyada kya evaluate kar raha hota hai?",
    options: [
      "Exact precise numbers calculate karne ki calculator-level ability",
      "Order-of-magnitude-correct estimation with clearly stated assumptions and a structured reasoning chain",
      "Kitni jaldi candidate calculation complete karta hai, reasoning matter nahi karta",
      "Candidate ko exact company traffic numbers yaad hain ya nahi",
    ],
    correctIndex: 1,
    explanation:
      "Estimation ka goal directional correctness aur clear, stated assumptions hain — exact precision (A) ya memorized real-world numbers (D) test nahi ho rahe. Speed akela (C) bhi goal nahi hai agar reasoning missing ho — structured process hi actual signal hai.",
    difficulty: "easy",
  },
  {
    id: "boe-2",
    question:
      "Seconds-in-a-day ko interview math mein 86,400 ki jagah 100,000 round karne ki wajah kya hai?",
    options: [
      "86,400 galat number hai, 100,000 hi sahi hai",
      "Yeh math ko significantly simplify karta hai aur error itna chhota hota hai (~15%) ki estimation ke context mein acceptable hai",
      "100,000 sirf leap years ke liye correct hota hai",
      "Interviewer hamesha 100,000 use karne ko explicitly require karta hai",
    ],
    correctIndex: 1,
    explanation:
      "86,400 accurate value hai, lekin interview speed ke liye 100,000 tak round karna calculation simplify kar deta hai aur resulting error (~15%) order-of-magnitude estimation ke liye completely acceptable hai. (A) galat hai kyunki 86,400 hi sahi value hai, (C) aur (D) fabricated reasons hain.",
    difficulty: "easy",
  },
  {
    id: "boe-3",
    question:
      "Ek Swiggy-scale estimate mein 20 million DAU hai, har user average 20 requests/day generate karta hai. Average QPS (using 100,000 seconds/day rounding) kitna aayega?",
    options: [
      "400 QPS",
      "4,000 QPS",
      "40,000 QPS",
      "400,000 QPS",
    ],
    correctIndex: 1,
    explanation:
      "Total requests/day = 20,000,000 x 20 = 400,000,000. Average QPS = 400,000,000 / 100,000 = 4,000 QPS. Baaki options ek ya do decimal places ki galti se aate hain — division ya multiplication step mein order of magnitude miss karna common mistake hai.",
    difficulty: "medium",
  },
  {
    id: "boe-4",
    question:
      "Do candidates ek hi system ke liye estimation karte hain — ek ka final answer 4,000 QPS aata hai, doosre ka 6,000 QPS, dono reasonable stated assumptions ke saath. Interview mein iska kya matlab hai?",
    options: [
      "Jiska number 'hidden correct answer' ke zyada kareeb hai, sirf wahi pass hoga",
      "Dono candidates fine hain agar unki reasoning chain aur assumptions sound hain — estimation mein ek hi 'exact correct' number nahi hota",
      "Dono candidates fail honge kyunki numbers match nahi karte",
      "Interviewer dobara calculation karke exact number verify karega",
    ],
    correctIndex: 1,
    explanation:
      "Back-of-envelope estimation mein koi single hidden correct number nahi hota — jab tak reasoning process structured hai aur assumptions explicitly stated hain, alag-alag reasonable final numbers dono acceptable hain. Options A, C, aur D estimation ke fundamental purpose ko galat samajhte hain (precision test nahi, process test hai).",
    difficulty: "hard",
  },
];

export default quiz;
