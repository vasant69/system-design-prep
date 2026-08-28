import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "api-versioning-1",
    question:
      "Hamare live API me employee response ka `FullName` field ab `FirstName` + `LastName` me split karna hai, aur teen mobile apps plus ek partner system purana shape consume kar rahe hain. Sabse safe tareeka kya hai?",
    options: [
      "`FullName` ko turant hata kar `FirstName`/`LastName` deploy kar do, clients ko email bhej do",
      "`v2` add karo naye shape ke saath, `v1` ko as-is chalate raho aur `Deprecated` mark karo, ek sunset date announce karo, phir `v1` hatao",
      "Response me dono rakho — `FullName` bhi aur `FirstName`/`LastName` bhi — hamesha ke liye",
      "Ek query parameter `newShape=true` add karo jo naya format toggle kare",
    ],
    correctIndex: 1,
    explanation:
      "Field rename/remove ek breaking change hai. API versioning ka poora point yahi hai: naya contract (`v2`) aur purana contract (`v1`) ek server par ek saath chalte hain, clients apni marzi se migrate karte hain, aur purana version deprecate-then-remove hota hai. Turant rename karne se purane clients ka parsing toot jaayega (option A). Dono fields hamesha rakhna response ko permanently bloat karta hai aur intent chhupata hai. Ek ad-hoc boolean toggle ek chhupa hua un-versioned contract ban jaata hai jise document/test karna mushkil hai.",
    difficulty: "easy",
  },
  {
    id: "api-versioning-2",
    question:
      "In changes me se kaunsa ek version bump DEMAND karta hai (baaki bina bump ke safe hain)?",
    options: [
      "Response me ek naya field `costCentre` add karna",
      "Ek naya optional query parameter `includeInactive` add karna",
      "Default page size ko 20 se 50 kar dena",
      "Ek bilkul naya endpoint `GET /api/employees/{id}/documents` add karna",
    ],
    correctIndex: 2,
    explanation:
      "Default behaviour badalna (page size 20 se 50) existing clients ko bina code badle tod sakta hai — jo 20 rows expect kar rahe the unhe achanak 50 milenge, pagination logic ya UI break ho sakta hai. Naya field, naya optional param, aur naya endpoint sab additive hain: purane clients unhe ignore karte hain, koi bump nahi chahiye. Rule: 'kya koi existing client bina code badle toot sakta hai?' — haan to bump, nahi to mat karo.",
    difficulty: "medium",
  },
  {
    id: "api-versioning-3",
    question:
      "`AddApiVersioning` me `AssumeDefaultVersionWhenUnspecified = true` aur `DefaultApiVersion = new ApiVersion(1, 0)` set karne ka effect kya hai?",
    options: [
      "Har request ko `v1` par force kar deta hai, `v2` unreachable ho jaata hai",
      "Jis client ne koi version nahi bheja (jaise versioning add hone se pehle ka purana caller) usse `1.0` maan liya jaata hai — is se versioning add karna backward compatible ban jaata hai",
      "Swagger me sirf `v1` doc dikhata hai",
      "Unsupported version request par `400` ki jagah `1.0` serve kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Ye do settings milkar version-less callers ko default (`1.0`) par map karti hain, isliye ek chalti hui API me versioning introduce karna kisi ko turant nahi todta. `v2` abhi bhi `/api/v2/...` ya `api-version=2.0` se reachable hai. Swagger docs `AddApiExplorer` aur `ConfigureSwaggerOptions` se control hote hain, in flags se nahi. Ek client jo explicitly ek non-existent version (jaise `9.0`) maangta hai use phir bhi `400 UnsupportedApiVersion` milega — default sirf 'unspecified' ke liye lagta hai, 'wrong' ke liye nahi.",
    difficulty: "medium",
  },
  {
    id: "api-versioning-4",
    question:
      "Team ne sirf header-based versioning (`X-Api-Version: 2.0`) use kiya aur ek CDN ke peeche API rakhi, bina `Vary: X-Api-Version` set kiye. Kya galat hoga?",
    options: [
      "Kuch nahi — headers caching ko affect nahi karte",
      "CDN/proxy ek version ka cached response doosre version ke client ko serve kar dega — silent data corruption",
      "`X-Api-Version` header requests me strip ho jaayega",
      "Swagger UI kaam karna band kar dega",
    ],
    correctIndex: 1,
    explanation:
      "Cache key by default URL par bata hota hai. Header-based versioning me `/api/employees` ka URL dono versions ke liye same hai, isliye CDN `v1` ka response cache karke `v2` maangne wale client ko de sakta hai (ya ulta). `Vary: X-Api-Version` cache ko batata hai ki us header par response alag hota hai. Yahi header strategy ka bada nuksan hai — browser se test bhi nahi kar sakte. URL-segment strategy (`/api/v1/...`) me URL hi cache key hai, isliye wo caching-friendly hai aur hamari default choice hai.",
    difficulty: "hard",
  },
];

export default quiz;
