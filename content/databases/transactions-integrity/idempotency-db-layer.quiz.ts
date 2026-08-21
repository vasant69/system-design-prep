import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "idemdb-1",
    question:
      "Payment table ke `idempotency_key` column pe UNIQUE constraint lagane ka sabse bada fayda kya hai, application-level 'check if exists, then insert' pattern ke comparison mein?",
    options: [
      "UNIQUE constraint queries ko fast bana deta hai, isliye better hai",
      "UNIQUE constraint atomically enforce hota hai database engine ke andar, isliye concurrent duplicate INSERTs ke beech ka race condition poori tarah eliminate ho jaata hai",
      "UNIQUE constraint application code ko simpler bana deta hai, performance se koi lena dena nahi",
      "Dono approaches equally safe hain, UNIQUE constraint sirf ek best practice hai",
    ],
    correctIndex: 1,
    explanation:
      "Application-level check-then-insert do separate steps hain jinke beech mein ek race window hota hai — do concurrent requests dono 'not found' dekh sakte hain aur dono insert kar sakte hain. Database ka UNIQUE constraint ek single atomic operation ke through enforce hota hai, isliye chahe dono INSERTs bilkul same time pe try hon, sirf ek hi succeed karega. Option A galat hai — query speed iska core benefit nahi hai, correctness hai. Option C galat hai — yeh correctness guarantee deta hai, sirf simplicity nahi. Option D poori tarah galat hai — yehi is topic ka central point hai ki dono approaches EQUALLY safe nahi hain.",
    difficulty: "easy",
  },
  {
    id: "idemdb-2",
    question:
      "Do concurrent requests same `idempotency_key` ke saath aati hain aur application 'SELECT * WHERE idempotency_key = ?' se pehle check karta hai, phir INSERT karta hai (check-then-insert). Kya galat ho sakta hai?",
    options: [
      "Kuch nahi, yeh pattern hamesha safe hai",
      "Dono requests almost simultaneously SELECT chala sakte hain aur dono ko 'row nahi mili' mil sakta hai, isliye dono INSERT kar dete hain — duplicate record ban jaata hai",
      "Database automatically dusri request ko reject kar dega bina kisi constraint ke",
      "Sirf first request process hogi, doosri automatically ignore ho jaayegi",
    ],
    correctIndex: 1,
    explanation:
      "Yeh exact race condition hai jo check-then-insert pattern ko unsafe banati hai — dono requests ka SELECT ek doosre ke INSERT se pehle execute ho sakta hai, isliye dono ko empty result milta hai aur dono duplicate INSERT kar dete hain. Option A galat hai, yehi vulnerability is topic ka core warning hai. Option C galat hai — bina UNIQUE constraint ke, database khud kuch reject nahi karega, yehi to problem hai. Option D galat hai, koi automatic ignore mechanism exist nahi karta bina explicit constraint ke.",
    difficulty: "medium",
  },
  {
    id: "idemdb-3",
    question:
      "`INSERT INTO Payment (...) VALUES (...) ON CONFLICT (idempotency_key) DO NOTHING RETURNING *` chalane pe agar yeh key already exist karta hai, to kya hota hai, aur application ko aage kya karna chahiye?",
    options: [
      "Database error throw karega, application ko 500 return karna chahiye",
      "INSERT silently skip ho jaata hai aur RETURNING kuch wapas nahi karta — application ko chahiye ki existing record ko SELECT karke wahi original result customer ko wapas de",
      "Purana record overwrite ho jaata hai naye data se",
      "Ek naya duplicate row insert ho jaata hai alag payment_id ke saath",
    ],
    correctIndex: 1,
    explanation:
      "`ON CONFLICT DO NOTHING` conflict ko silently handle karta hai — koi error nahi aata, bas INSERT skip ho jaata hai aur RETURNING empty aata hai. Application is signal se samajh jaata hai ki yeh already processed hai, aur existing record fetch karke wahi result wapas deta hai — isse customer ko double charge nahi hota aur consistent response milta hai. Option A galat hai, koi hard error nahi aata is pattern mein. Option C galat hai, DO NOTHING ka matlab hi hai overwrite NAHI karna (DO UPDATE alag pattern hota). Option D galat hai, UNIQUE constraint hi to duplicate insert ko prevent karta hai — yehi poora point hai.",
    difficulty: "medium",
  },
  {
    id: "idemdb-4",
    question:
      "Ek team decide karti hai ki idempotency key server-side generate hogi, har incoming request pe automatically naya UUID assign karke. Yeh design decision kyun problematic hai?",
    options: [
      "Server-generated UUIDs database mein store nahi ho sakte",
      "Agar client retry karta hai (jaise network timeout ke baad), server har baar naya key generate karega, isliye retry ko original request se link hi nahi kiya ja sakega — duplicate detection kaam nahi karega",
      "Server-side generation client-side generation se slow hota hai",
      "Koi problem nahi hai, yeh standard practice hai",
    ],
    correctIndex: 1,
    explanation:
      "Idempotency key ka poora purpose hi yeh hai ki same logical operation ke multiple attempts (retries) ko ek doosre se link kiya ja sake. Agar server key generate karta hai per-incoming-request, to ek retry bhi ek 'naya' request lagega server ko, aur naya unique key milega — matlab duplicate detection completely fail ho jaayega. Key client se aani chahiye aur retry pe wahi purani key reuse honi chahiye. Option A galat hai, koi technical restriction nahi hai. Option C galat hai, yeh performance ka issue nahi hai, correctness ka hai. Option D poori tarah galat hai, yeh ek well-known anti-pattern hai.",
    difficulty: "hard",
  },
];

export default quiz;
