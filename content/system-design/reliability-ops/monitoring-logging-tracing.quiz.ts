import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "mlt-1",
    question: "'Is system abhi healthy hai?' jaisa sawaal answer karne ke liye sabse pehla tool kaunsa hoga?",
    options: [
      "Distributed tracing",
      "Metrics / monitoring dashboards aur alerts",
      "Individual server logs, ek ek karke padhna",
      "Source code review",
    ],
    correctIndex: 1,
    explanation:
      "Metrics/monitoring aggregated numbers (CPU%, error rate, request rate) ke through ek glance mein overall system health batate hain — yehi sabse pehla layer hai. Tracing ek specific request ki journey ke liye hai (A galat), logs ek specific event ke detail ke liye hain, health snapshot ke liye nahi (C galat), aur source code review real-time health se unrelated hai (D galat).",
    difficulty: "easy",
  },
  {
    id: "mlt-2",
    question: "Ek request 12 microservices ko touch karta hai aur overall slow hai. Sirf logs aur metrics use karke yeh identify karna ki in 12 mein se konsa service slow hai, at scale kyun mushkil/impossible ho jaata hai?",
    options: [
      "Kyunki logs aur metrics encrypted hote hain",
      "Kyunki har service ke logs alag jagah stored hote hain aur unhe manually correlate karna at scale practically impossible hai — yehi exact gap distributed tracing fill karta hai",
      "Kyunki metrics sirf ek service ke liye kaam karte hain, multiple services ke liye nahi",
      "Kyunki logs sirf errors record karte hain, successful requests nahi",
    ],
    correctIndex: 1,
    explanation:
      "Har service ke apne separate logs hote hain, aur bina ek shared trace ID ke unhe manually correlate karna at scale impractical hai — yehi wajah hai distributed tracing exist karta hai, jo ek single trace tree mein sab spans ko stitch karta hai. Encryption (A) irrelevant hai, metrics multiple services pe kaam kar sakte hain bas per-request granularity nahi dete (C galat), aur logs successful events bhi record kar sakte hain (D galat).",
    difficulty: "medium",
  },
  {
    id: "mlt-3",
    question: "Distributed tracing mein trace ID ka role kya hai?",
    options: [
      "Yeh ek random number hai jo sirf logging ke liye use hota hai, tracing se unrelated",
      "Yeh ek unique ID hai jo request ke saath har downstream service call ke headers mein propagate hota hai, taaki har service ka span ek hi trace mein stitch ho sake",
      "Yeh sirf database queries ko identify karne ke liye use hota hai",
      "Yeh ek load balancer ka internal routing key hai",
    ],
    correctIndex: 1,
    explanation:
      "Trace ID request lifecycle ki shuruaat mein generate hota hai aur har downstream call ke headers ke through propagate hota hai, taaki har touched service apna span usi trace ke against report kar sake aur backend system sab spans ko ek tree mein assemble kar sake. Baaki options (A, C, D) trace ID ke actual purpose se unrelated hain.",
    difficulty: "medium",
  },
  {
    id: "mlt-4",
    question: "Ek team har chhoti internal metric (jaise CPU 80% cross hona, ek single pod restart) pe alert laga deti hai, symptom-based alerting (jaise elevated error rate) ke bajaye. Iska most likely operational consequence kya hoga?",
    options: [
      "System zyada reliable ho jaayega automatically",
      "Alert fatigue — on-call team itne saare low-value, non-actionable alerts se overwhelmed ho jaayegi ki woh genuinely critical alerts ko bhi miss/ignore karne lagegi",
      "Distributed tracing ki zaroorat khatam ho jaayegi",
      "Logs ki storage cost automatically kam ho jaayegi",
    ],
    correctIndex: 1,
    explanation:
      "Cause-based, low-value alerts ki flood alert fatigue create karti hai — on-call team eventually sab alerts ko ignore karna shuru kar deti hai, including critical ones. Yeh reliability automatically nahi badhaata (A galat), tracing ki zaroorat unrelated hai (C galat), aur log storage cost se iska koi direct link nahi hai (D galat). Symptom-based alerting (error rate, latency) is problem ko avoid karta hai.",
    difficulty: "hard",
  },
];

export default quiz;
