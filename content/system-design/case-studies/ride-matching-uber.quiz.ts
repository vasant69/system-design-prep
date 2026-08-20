import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "rmu-1",
    question:
      "Ek plain SQL query jaisa 'WHERE distance(lat, long, rider_lat, rider_long) < 2km' production scale par kyun problematic hai?",
    options: [
      "SQL mein distance function likhna syntactically invalid hai",
      "Yeh index-friendly nahi hai (lat/long pe normal index 2D 'nearby' concept solve nahi karta) aur is update frequency par disk-backed queries slow ho jaati hain",
      "SQL databases geospatial data store hi nahi kar sakte",
      "Yeh query sirf ek city ke liye kaam karti hai, multiple cities ke liye nahi",
    ],
    correctIndex: 1,
    explanation:
      "Row-by-row distance calculation ek regular index use nahi kar sakta kyunki 'nearby' ek 2D concept hai, aur lakhon high-frequency updates ke saath disk-backed store par simultaneously efficient nearby-queries serve karna scale nahi karta. Syntax (A) valid hai, geospatial data store karna technically possible hai (C galat), aur multi-city scoping (D) is core problem se unrelated hai.",
    difficulty: "medium",
  },
  {
    id: "rmu-2",
    question:
      "Geohashing mein 'boundary edge case' se kya matlab hai?",
    options: [
      "Do points jo physically bahut close hain lekin grid-cell boundary ke opposite sides par hain, unke geohash strings completely different ho sakte hain — isliye neighbor cells bhi check karne padte hain",
      "Geohash sirf equator ke paas kaam karta hai, poles ke paas nahi",
      "Boundary case sirf tab aata hai jab driver offline ho jaaye",
      "Geohash strings hamesha same length ki hoti hain regardless of precision",
    ],
    correctIndex: 0,
    explanation:
      "Geohash grid-cell based hai — agar do points ek cell boundary ke exactly opposite sides par hain, unka shared prefix chhota ya missing ho sakta hai, jabki woh physically close hain. Isliye sirf apne exact cell mein search karna kaafi nahi — neighboring cells bhi query karne padte hain. Equator/poles (B) is issue se unrelated hai. Driver offline status (C) alag concern hai. Geohash length precision ke basis par varies karti hai, fixed nahi (D galat).",
    difficulty: "hard",
  },
  {
    id: "rmu-3",
    question:
      "Driver location updates ke liye in-memory geospatial store (jaise Redis GEO) ek disk-backed database se better fit kyun hai?",
    options: [
      "Kyunki disk-backed databases geospatial queries support hi nahi karte",
      "Kyunki location data transient hai (sirf current position matter karta hai) aur update frequency itni high hai ki disk I/O latency is use-case mein acceptable nahi hai",
      "Kyunki in-memory stores automatically zyada accurate results dete hain",
      "Kyunki Redis crash hi nahi ho sakta",
    ],
    correctIndex: 1,
    explanation:
      "Location data ki durability critical nahi hai (transient, next update kuch second mein aa jaayega) aur update frequency itni high hai ki har baar disk I/O involve karna latency-prohibitive hota. In-memory store jaise Redis GEO commands isi use-case ke liye design hue hain. Disk-backed DBs geospatial support kar sakte hain (A galat), accuracy in-memory vs disk se independent hai (C galat), aur Redis bhi crash ho sakta hai — bas iska staleness cost acceptable hai (D galat premise).",
    difficulty: "medium",
  },
  {
    id: "rmu-4",
    question:
      "Matching Service ne top-ranked driver ko ride request bheji, lekin driver 15 second timeout ke andar respond nahi karta. Sahi next step kya hai?",
    options: [
      "Rider ko turant 'no drivers available' dikha dena aur poori request cancel kar dena",
      "Next-ranked candidate driver ko request bhejna (fallback chain), aur agar candidates khatam ho jaayein to search radius expand karna",
      "Usi driver ko dobara wahi request bhejna, bina timeout badle",
      "Poore system ko restart karna taaki fresh matching ho sake",
    ],
    correctIndex: 1,
    explanation:
      "Matching design mein timeout/reject par next-ranked candidate ko try karna ek core fallback mechanism hai, aur agar candidates radius ke andar khatam ho jaayein to radius expand karke aur candidates dhoondhe jaate hain. Turant fail ho jaana (A) poor UX hai jab options available hain. Same driver ko dobara try karna (C) waste hai jab woh already non-responsive hai. System restart (D) is problem se completely unrelated aur impractical hai.",
    difficulty: "easy",
  },
];

export default quiz;
