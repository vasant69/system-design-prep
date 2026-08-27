import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "api-versioning-strategies-1",
    question: "URL segment versioning (/api/v2/customers) ka sabse bada advantage kya hai?",
    options: [
      "Ye REST resource identity ko sabse pure rakhta hai",
      "High discoverability aur CDN/proxy caching automatically version-aware hoti hai kyunki alag versions alag URLs hain",
      "Ye sirf approach hai jo Asp.Versioning.Mvc support karta hai",
      "Isme client ko koi header set karne ki zaroorat nahi padti kabhi bhi",
    ],
    correctIndex: 1,
    explanation: "URL segment versioning me har version ka alag URL hota hai, isliye browser me directly test ho sakta hai (discoverability) aur caching layers (CDN, reverse proxy) automatically alag cache entries banate hain per version. REST purists ka argument hai ki ye resource identity ko version se mix karta hai — jo ispe con hai, pure nahi.",
    difficulty: "easy",
  },
  {
    id: "api-versioning-strategies-2",
    question: "Ek naya optional field API response me add karna — kya isko naya API version release karne ki zaroorat hai?",
    options: [
      "Haan, har response change ke liye naya version chahiye",
      "Nahi, additive/backward-compatible changes (naya optional field) breaking nahi hote, versioning sirf genuinely breaking changes ke liye zaroori hai",
      "Sirf agar field required hai to version chahiye, optional ho to bhi nahi",
      "Ye database schema pe depend karta hai",
    ],
    correctIndex: 1,
    explanation: "Versioning ka purpose hi breaking changes se clients ko protect karna hai. Naya optional field add karna existing clients ko todta nahi (unhe field simply ignore ho jaata hai), isliye ye backward-compatible hai aur naye version ki zaroorat nahi. Overusing versioning har chhote change ke liye unnecessary maintenance burden badhata hai.",
    difficulty: "medium",
  },
  {
    id: "api-versioning-strategies-3",
    question: "Header-based versioning (X-Api-Version) ka main trade-off kya hai URL segment versioning ke comparison me?",
    options: [
      "Header versioning kabhi kaam hi nahi karta production me",
      "URL semantics pure rehte hain lekin discoverability aur browser-based testing kam ho jaati hai",
      "Header versioning sirf GET requests ke liye kaam karta hai",
      "Isme caching hamesha automatically sahi hoti hai",
    ],
    correctIndex: 1,
    explanation: "Header versioning me resource URL clean rehta hai (pure REST semantics), lekin client ko explicitly header set karna padta hai — browser me directly URL hit karke test nahi kar sakte, tooling (Postman/curl) chahiye, aur documentation me explicitly bataana padta hai.",
    difficulty: "medium",
  },
  {
    id: "api-versioning-strategies-4",
    question: "Ek acchi API deprecation strategy me kya include hona chahiye?",
    options: [
      "Purana version turant delete kar dena jaise hi naya release ho",
      "Sunset header ke saath deprecation date advertise karna, migration window dena, aur usage metrics track karke traffic negligible hone ke baad hi hard-remove karna",
      "Sirf ek email bhej dena clients ko, code me kuch change nahi karna",
      "Versioning ki zaroorat hi nahi hai agar documentation acchi ho",
    ],
    correctIndex: 1,
    explanation: "Responsible deprecation me naya version release karke, purane version pe Sunset header (RFC 8594) se exact decommission date advertise ki jaati hai, ek reasonable migration window (typically 6-12 months) diya jaata hai, aur usage metrics track karke jab purane version ka traffic negligible ho jaaye tabhi hata diya jaata hai — sirf email par depend karna ya achanak delete karna clients ko break kar deta hai.",
    difficulty: "hard",
  },
];

export default quiz;
