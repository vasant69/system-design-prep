import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "us-1",
    question: "URL shortener mein simple auto-incrementing counter + base62 encoding approach ka sabse bada practical problem kya hai?",
    options: [
      "Base62 encoding bahut slow hai compute karne mein",
      "Ek single global counter distributed writes ke liye bottleneck/SPOF ban jaata hai, aur sequential IDs guessable hote hain",
      "Counter approach collision-prone hai jaise hash-based approach",
      "Base62 mein sirf numbers use ho sakte hain, letters nahi",
    ],
    correctIndex: 1,
    explanation:
      "Ek shared counter ko har distributed server ko increment karna padta hai, jo contention/bottleneck banata hai, aur sequential output easily guessable/scrapeable hota hai. Base62 encoding compute-cheap hai (A galat). Counter approach collision-free hoti hai by design, hash-based approach collision-prone hoti hai (C galat — ulta bola gaya). Base62 mein digits + lowercase + uppercase letters dono hote hain (D galat).",
    difficulty: "medium",
  },
  {
    id: "us-2",
    question: "URL shortener redirect ke liye 301 ke bajaye 302 status code kyun prefer kiya jaata hai jab click analytics chahiye ho?",
    options: [
      "302 zyada secure hai encryption ke through",
      "301 browser dwara cache ho jaata hai, isliye subsequent clicks server ko hit hi nahi karte aur count nahi ho paate; 302 har baar server ko hit karta hai",
      "301 sirf HTTPS ke saath kaam karta hai",
      "302 redirect faster hai network level pe",
    ],
    correctIndex: 1,
    explanation:
      "301 (permanent redirect) browser/proxy dwara cache ho jaata hai, isliye pehli visit ke baad server ko dobara hit nahi kiya jaata aur click analytics blind ho jaati hai. 302 (temporary) cache nahi hota, har click server tak pahunchta hai. Encryption ka status code se koi lena dena nahi (A galat), 301 HTTPS-specific nahi hai (C galat), aur network-level speed dono codes ke liye same hai (D galat) — asli farak caching behavior mein hai.",
    difficulty: "hard",
  },
  {
    id: "us-3",
    question: "Pre-generated key pool (Key Generation Service) approach mein app servers keys kaise consume karte hain taaki koi shared bottleneck na bane?",
    options: [
      "Har request pe seedha KGS ko hit karke ek naya key maangte hain",
      "App server ek batch/range of keys ek saath atomically claim kar leta hai aur local pool se serve karta hai",
      "Saare app servers same fixed key list share karte hain bina coordination ke",
      "Keys DB query time pe on-the-fly random generate hoti hain",
    ],
    correctIndex: 1,
    explanation:
      "Batch claiming (jaise 1000 keys ek saath) se har app server apne local pool se serve kar sakta hai bina baar-baar KGS ko hit kiye — yehi contention avoid karta hai. Har request pe KGS hit karna (A) wahi bottleneck reintroduce kar dega jo hum avoid karna chahte hain. Bina coordination ke same list share karna (C) collisions create karega. On-the-fly random generation (D) yeh hash-based approach ka pattern hai, key-pool ka nahi.",
    difficulty: "medium",
  },
  {
    id: "us-4",
    question: "Interview mein URL shortener ke liye database choice justify karte waqt sabse strong reasoning kaunsi hai?",
    options: [
      "NoSQL hamesha SQL se fast hota hai, isliye default choice hai",
      "Access pattern ek simple primary-key (short code) lookup hai bina complex joins ke, jo NoSQL key-value store ke sweet spot mein aata hai aur horizontal partitioning trivial banata hai",
      "SQL databases URLs store nahi kar sakte",
      "NoSQL free hota hai, SQL licensing costly hai",
    ],
    correctIndex: 1,
    explanation:
      "Sahi reasoning access pattern se aati hai — simple key lookup, koi joins nahi, billions of rows, hash-partitioning ki zaroorat — yeh sab NoSQL key-value store ko natural fit banate hain. 'NoSQL hamesha fast hai' (A) ek overgeneralization/myth hai. SQL bhi URLs store kar sakta hai (C galat premise). Licensing cost (D) ek irrelevant/incorrect reasoning hai is context mein.",
    difficulty: "easy",
  },
];

export default quiz;
