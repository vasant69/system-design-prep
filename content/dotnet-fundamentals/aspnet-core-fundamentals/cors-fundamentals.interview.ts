import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cors-tr-1",
    question: "CORS ka fundamental purpose kya hai, aur ye kahan enforce hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Zomato"],
    shortAnswer: "CORS same-origin policy ko relax karta hai server ki explicit permission se; ye browser-enforced hai, server-enforced nahi.",
    detailedAnswer:
      "Browsers by default same-origin policy enforce karte hain — JavaScript sirf apne khud ke origin se freely data read kar sakta hai. CORS server ko ek mechanism deta hai (response headers ke through) ye explicitly declare karne ke liye ki kaunse doosre origins bhi uske response ko read kar sakte hain. Server hamesha request process karta hai; CORS enforcement purely browser ke andar hota hai — browser response headers check karta hai aur based on that JavaScript ko response read karne deta hai ya block kar deta hai.",
    followUp: "Agar CORS server-enforced nahi hai, to ye security ke liye useful kaise hai?",
  },
  {
    id: "cors-tr-2",
    question: "Ek team member kehta hai 'humne CORS enable kar diya hai isliye ab hum safe hain unauthorized access se.' Ye statement kahan galat hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — CORS unauthorized SERVER access ko rokta nahi, sirf browser-JavaScript ko response read karne se rokta hai. Direct API calls (curl, server-to-server, Postman) CORS se completely unaffected rehte hain.",
    detailedAnswer:
      "CORS ek client-side (browser) mechanism hai jo sirf ye control karta hai ki webpage JavaScript kis origin ke response ko consume kar sakti hai. Ye server ko kisi bhi tarah ki request se protect nahi karta — koi bhi (attacker included) directly curl, Postman, ya apne server code se API call kar sakta hai, aur CORS wahan bilkul irrelevant hai kyunki koi browser hi involved nahi hai jo enforce kare. Actual server-side protection authentication (kaun request bhej raha hai verify karna), authorization (unhe permission hai ya nahi), aur input validation/rate limiting se aati hai — CORS in me se koi bhi provide nahi karta.",
    redFlag: "CORS ko ek authentication/authorization substitute samajhna — ye ek very common, security-relevant misconception hai jo interview me specifically probe kiya jaata hai.",
  },
  {
    id: "cors-tr-3",
    question: "Preflight OPTIONS request kab trigger hoti hai, aur ye kya achieve karti hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "'Non-simple' cross-origin requests (custom headers, JSON content-type, PUT/DELETE) ke liye — browser pehle server se check karta hai permission, phir actual request bhejta hai.",
    detailedAnswer:
      "Simple requests (GET/HEAD/POST with standard content-types) browser directly bhej deta hai. Non-simple requests — jaise Content-Type: application/json, Authorization header, ya PUT/DELETE verbs — pehle ek automatic OPTIONS preflight request trigger karti hain jisme browser Access-Control-Request-Method aur Access-Control-Request-Headers batata hai. Server agar in exact conditions ko allow karta hai (matching CORS policy configured hai), tabhi browser actual request bhejta hai. Ye ek safety check hai taaki server ko pehle se pata ho ki incoming non-simple cross-origin request expected/allowed hai.",
  },
  {
    id: "cors-tr-4",
    question: "Ye code snippet me kya problem hai?\n```csharp\npolicy.AllowAnyOrigin()\n      .AllowAnyHeader()\n      .AllowCredentials();\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Runtime exception aayega — AllowAnyOrigin() aur AllowCredentials() ek saath combine nahi ho sakte, ye CORS spec ka violation hai.",
    detailedAnswer:
      "CORS specification explicitly wildcard origin (`*`, jo AllowAnyOrigin() se aata hai) ko credentials (cookies, Authorization headers cross-origin bhejne) ke saath combine hone se rokta hai — security reason ye hai ki agar ye allowed hota, koi bhi malicious website victim ke browser se unke saved credentials ke saath requests bhej sakti thi kisi bhi API ko. ASP.NET Core is combination ko build/runtime pe exception ke saath reject karta hai. Fix: specific origins WithOrigins(\"https://app.com\") explicitly list karo agar credentials chahiye.",
  },
  {
    id: "cors-tr-5",
    question: "`app.UseCors()` ko middleware pipeline me kahan place karna chahiye, aur galat position rakhne se kya symptom dikhega?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "UseRouting() ke baad aur UseAuthorization() se pehle — galat position pe CORS headers response me sahi se apply nahi hongi.",
    detailedAnswer:
      "CORS middleware ko routing ke baad (taaki matched endpoint ki specific CORS policy apply ho sake, agar per-endpoint policies use ho rahi hon) aur authorization se pehle (taaki preflight OPTIONS requests, jo typically unauthenticated hoti hain, authorization check se pehle hi handle ho jaayen) place karna chahiye. Agar UseCors() authorization ke baad ho, preflight OPTIONS requests authorization middleware se reject ho sakti hain (kyunki unme typically auth token nahi hota), jisse actual request kabhi bhejta hi nahi browser aur CORS error console me dikhta hai jo asal me ek middleware-ordering bug hai.",
  },
  {
    id: "cors-tr-6",
    question: "Ek naya developer production me CORS error dekh kar server-side business logic me bug dhoondhna shuru kar deta hai. Ye approach kyun galat hai, aur actual debugging kahan karni chahiye?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "CORS error server-side business-logic bug nahi hai — ye almost hamesha missing/galat CORS configuration (AddCors/UseCors) ka signal hai, aur error browser console me dikhta hai, server logs me nahi.",
    detailedAnswer:
      "CORS error ka matlab hai server ne response bhej diya (business logic already successfully chal chuki), lekin browser ne us response ko JavaScript ko dikhane se mana kar diya kyunki origin allowed nahi tha ya headers missing the. Server-side application code (controller logic, database calls) yahan innocent hai — actual fix hamesha CORS policy configuration me hota hai (AddCors options, WithOrigins list, UseCors middleware placement). Server-side logs bhi is issue ko show nahi karenge kyunki server successfully respond kar chuka hota hai — sirf browser console me error dikhta hai.",
    redFlag: "CORS error dekh kar server-side breakpoints/logs me debug karna shuru karna — ye dikhata hai candidate ko CORS ka enforcement point (browser, not server) samajh nahi aaya.",
  },
  {
    id: "cors-tr-7",
    question: "Ek internal admin dashboard aur ek public customer app dono same backend API use karte hain, alag domains se. CORS policy kaise design karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Named CORS policies (AddPolicy) use karo, dono exact origins ko WithOrigins() me explicitly list karo — AllowAnyOrigin() avoid karo.",
    detailedAnswer:
      "ASP.NET Core multiple named CORS policies support karta hai — ek policy dono known, trusted origins (jaise https://app.example.com aur https://admin.example.com) ko WithOrigins() se explicitly list kar sakti hai, agar sabko same access level chahiye. Agar admin dashboard ko extra-sensitive endpoints chahiye jo public app ko nahi milne chahiye, alag policies define ki ja sakti hain aur different controllers/endpoints pe [EnableCors(\"policyName\")] se apply ki ja sakti hain. AllowAnyOrigin() avoid karna chahiye kyunki wo har unknown origin ko bhi implicitly trust kar leta hai.",
  },
];

export default questions;
