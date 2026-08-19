import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "rl-1",
    question: "Fixed window rate limiting ka 'boundary problem' kya hai?",
    options: [
      "Fixed window algorithm implement karna bahut complex hota hai",
      "Client window boundary ke around (jaise ek window ke last second aur agle window ke first second mein) do windows ki limits combine karke effectively ~2x rate tak burst kar sakta hai",
      "Fixed window sirf HTTPS APIs ke saath kaam karta hai",
      "Fixed window mein requests kabhi reject hi nahi hote",
    ],
    correctIndex: 1,
    explanation:
      "Fixed window boundary problem yeh hai ki agar client ek window ke end mein full limit use kare aur turant agle window ke start mein phir full limit use kare, dono individually apni window ki limit ke andar hain lekin combined effect short time span mein ~2x intended rate hai. Baaki options irrelevant ya factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "rl-2",
    question: "Token bucket aur leaky bucket algorithms mein sabse fundamental difference kya hai?",
    options: [
      "Token bucket sirf reads ke liye hai, leaky bucket sirf writes ke liye",
      "Token bucket bursts allow karta hai (accumulated tokens use karke), jabki leaky bucket output ko hamesha ek fixed constant rate pe process karta hai chahe input kitna bursty ho",
      "Dono algorithms functionally identical hain, sirf naam alag hai",
      "Leaky bucket sirf synchronous APIs ke liye use hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Token bucket idle time mein tokens accumulate karne deta hai, isliye client burst bhej sakta hai bucket capacity tak. Leaky bucket requests ko queue karke fixed constant rate pe process karta hai, output hamesha smooth rehta hai chahe input bursty ho. Baaki options galat hain.",
    difficulty: "medium",
  },
  {
    id: "rl-3",
    question: "Distributed system mein multiple API gateway instances parallel chal rahe hain aur ek shared rate limit enforce karna hai. Counter store karne ka standard reliable approach kya hai?",
    options: [
      "Har gateway instance apna local in-memory counter rakhe",
      "Redis mein atomic INCR + EXPIRE operations use karke ek shared counter maintain karo, taaki race conditions avoid hon",
      "Counter ko client-side cookie mein store karo",
      "Rate limiting sirf single-instance deployments mein hi possible hai",
    ],
    correctIndex: 1,
    explanation:
      "Multiple instances ke beech consistent, race-condition-free counting ke liye ek shared, fast, atomic store (jaise Redis ka INCR + EXPIRE) chahiye. Local in-memory counters (A) har instance ka alag count rakhenge, jisse global limit enforce nahi hoga. Client-side storage (C) trivially bypass ho sakta hai. Option D factually galat hai.",
    difficulty: "hard",
  },
  {
    id: "rl-4",
    question: "Jab ek client apni rate limit exceed kar deta hai, standard aur correct server response kya hona chahiye?",
    options: [
      "HTTP 500 Internal Server Error, kyunki request fail hui",
      "HTTP 429 Too Many Requests, saath mein Retry-After header jo bataye kitni der baad retry karein",
      "HTTP 200 OK lekin empty body",
      "Connection ko silently drop kar dena bina kisi response ke",
    ],
    correctIndex: 1,
    explanation:
      "HTTP spec mein specifically 429 status code isi purpose ke liye defined hai, aur Retry-After header client ko batata hai ki kab retry karna chahiye — yeh well-behaved clients ko efficient backoff karne deta hai. 500 (A) galat signal deta hai (server error nahi hui, client ne limit cross ki). 200 (C) misleading hai. Silent drop (D) client ko confuse karega.",
    difficulty: "medium",
  },
];

export default quiz;
