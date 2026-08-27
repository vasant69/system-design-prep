import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lambda-exec-1",
    question: "Cold start ke dauran INIT phase me kya chalta hai?",
    options: [
      "Sirf handler function ka code",
      "Handler ke bahar likha gaya code - imports, SDK clients, DB connection setup",
      "Sirf Firecracker microVM ka boot process",
      "Sirf error logging code",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — INIT phase me handler ke bahar likha gaya code chalta hai jaise imports, SDK client creation, aur connection pool setup, jo max 10 second tak allowed hai. Option A galat hai kyunki handler code INIT ke baad separately chalta hai. Option C sirf ek part hai, poora INIT phase nahi. Option D irrelevant hai.",
    difficulty: "medium",
  },
  {
    id: "lambda-exec-2",
    question: "Invocation complete hone ke baad execution environment ka kya hota hai?",
    options: [
      "Turant permanently destroy ho jaata hai",
      "Freeze ho jaata hai (state preserved), reuse ho sakta hai ya idle rehne pe eventually destroy hota hai",
      "Automatically dusre AWS region me migrate ho jaata hai",
      "Handler code dubara turant re-run hota hai",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — environment freeze hota hai, agli invocation jaldi aane pe reuse (warm start) hota hai, warna eventually torn down hota hai. Option A galat hai, ye immediate destroy nahi karta. Option C aur D bilkul galat facts hain.",
    difficulty: "easy",
  },
  {
    id: "lambda-exec-3",
    question: "100 concurrent requests ek Lambda function ko hit karte hain. Kya hota hai?",
    options: [
      "Ek hi execution environment saari 100 requests ko multi-threaded tarike se handle karta hai",
      "Lambda 100 separate execution environments spin up karta hai (concurrency limit ke andar), har ek ek waqt me ek hi request handle karta hai",
      "Requests queue me wait karte hain jab tak pehli request complete na ho",
      "Lambda automatically requests ko drop kar deta hai",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — ek execution environment ek waqt me sirf ek invocation process karta hai, isliye concurrent requests ke liye alag-alag environments spin up hote hain, jinke beech koi shared memory nahi hoti. Option A traditional multi-threaded server model hai, Lambda ka nahi. Option C aur D galat facts hain (jab tak concurrency limit exceed na ho).",
    difficulty: "medium",
  },
  {
    id: "lambda-exec-4",
    question: "DB connection ko handler ke andar (har invocation pe naya) banane ka sabse bada practical risk kya hai?",
    options: [
      "Code readability kharab ho jaati hai",
      "Har invocation slow hoti hai aur high concurrency me database connection limits exhaust ho sakte hain",
      "Lambda function crash ho jaata hai turant",
      "AWS billing automatically double ho jaati hai",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab B hai — har invocation naya connection banata hai jo latency badhata hai, aur high concurrency pe sainkdo simultaneous connections database ke max_connections limit ko exhaust kar sakte hain, jo poore system ko down kar sakta hai. Option A minor issue hai but ye asal risk nahi hai. Option C aur D galat/exaggerated facts hain.",
    difficulty: "medium",
  },
];

export default quiz;
