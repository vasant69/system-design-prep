import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rest-semantics-tr-1",
    question: "HTTP verbs me se kaunse idempotent hain, aur idempotency ka exact matlab kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Amazon", "TCS", "Flipkart"],
    shortAnswer: "GET, PUT, DELETE idempotent hain — same request N baar bhejne se server ki final state same rehti hai. POST idempotent nahi hai.",
    detailedAnswer:
      "Idempotency ka matlab hai resulting server state par guarantee, exact response par nahi. GET sirf read karta hai, koi state change nahi. PUT ek resource ko poori tarah given representation se replace karta hai — same PUT baar-baar bhejne se end state same rehta hai. DELETE ek resource remove karta hai — pehli call delete karti hai, baad ki calls 'already gone' state confirm karti hain, koi naya side-effect nahi. POST typically naya resource create karta hai — har call potentially ek naya resource bana sakta hai, isliye ye idempotent nahi hai by default.",
    followUp: "Production me POST ko safely retry-able kaise banate ho?",
  },
  {
    id: "rest-semantics-tr-2",
    question: "400, 404, 409, aur 422 status codes me exact difference batao.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft", "Infosys"],
    shortAnswer: "400 = malformed request; 404 = resource doesn't exist; 409 = resource exists but conflicts; 422 = well-formed but semantically invalid.",
    detailedAnswer:
      "400 Bad Request structural problem hai — malformed JSON, missing required field, wrong type. 404 Not Found requested resource exist hi nahi karta URL pe. 409 Conflict resource exist karta hai lekin current state request se clash karti hai — jaise duplicate unique-key create karne ki koshish, ya optimistic concurrency version mismatch. 422 Unprocessable Entity request syntactically bilkul valid hai (well-formed), lekin data ek business/semantic rule violate karta hai — jaise negative quantity ya invalid date range.",
  },
  {
    id: "rest-semantics-tr-3",
    question: "`201 Created` response me `Location` header kyun include karna chahiye?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Ye client ko batata hai naye bane resource ka exact URL, taaki wo turant follow-up GET/PUT/DELETE us URL pe kar sake.",
    detailedAnswer:
      "REST principle hai ki responses discoverable hone chahiye — jab POST ek naya resource create karta hai, client ko us resource ka URL pata hona chahiye future operations ke liye, bina khud construct kiye. `CreatedAtAction()` helper in ASP.NET Core automatically Location header set karta hai based on the referenced action aur route values. Bina Location header ke, client ko manually assume karna padta ya response body se ID nikaal kar URL banana padta, jo fragile hai.",
  },
  {
    id: "rest-semantics-tr-4",
    question: "Ye code review comment sahi hai ya galat: 'GET request me ek page-view counter increment karna theek hai, kyunki data actually GET se change nahi ho raha'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — GET ko idempotent aur side-effect-free contract follow karna chahiye; server-side state change (counter increment) is contract ko todhta hai chahe response same dikhe.",
    detailedAnswer:
      "GET verb ka poora contract ye hai ki ye safe aur idempotent hai — caching layers, browsers, prefetchers, retry logic sab is guarantee pe depend karte hain ki GET call karna 'free' hai, koi observable state change nahi karega. Agar GET internally ek counter increment kar raha hai, ye technically ek side-effect hai jo caching/prefetch/retry ke saath silently interfere kar sakta hai — jaise ek CDN ya browser prefetch multiple baar GET call kare bina user ke actually page dekhe, counter artificially inflate ho jaayega. Analytics tracking jaisa kaam POST ya ek dedicated tracking endpoint se hona chahiye, GET se nahi.",
    redFlag: "'GET response change nahi ho raha isliye side-effect theek hai' — ye idempotency ke actual contract (server state, response nahi) ko misunderstand karta hai.",
  },
  {
    id: "rest-semantics-tr-5",
    question: "API versioning ke teen common approaches kya hain, aur kaunsa sabse zyada practically use hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "URL-segment (/api/v1/...), query string (?api-version=1.0), aur header-based — URL-segment sabse common hai kyunki explicit aur cache-friendly hai.",
    detailedAnswer:
      "URL-segment versioning (`/api/v1/orders` vs `/api/v2/orders`) most discoverable hai — koi bhi consumer sirf URL dekh kar version samajh sakta hai, aur different URLs different cache entries treat hoti hain (CDN/browser caching ke liye clean). Query-string versioning (`?api-version=1.0`) similar hai lekin thoda kam explicit. Header-based versioning (custom header ya Accept media-type) cleanest REST-purist approach maana jaata hai (URL resource ko identify karta hai, version nahi) lekin practically discoverability aur caching me thoda friction laata hai — isliye industry me URL-segment approach sabse zyada dominant hai.",
  },
  {
    id: "rest-semantics-tr-6",
    question: "Ek e-commerce checkout API me client network-timeout ke baad `POST /orders` retry karta hai. Idempotency-Key mechanism ke bina, kya problem ho sakti hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Duplicate order create ho sakta hai — customer se do baar charge ho sakta hai, ya inventory do baar deduct ho sakti hai.",
    detailedAnswer:
      "Timeout ka matlab ye nahi hai ki original request server tak pahunchi hi nahi — ho sakta hai server ne process kar diya ho lekin response client tak wapas na pahuncha ho network issue ki wajah se. Client isse 'failed' maan kar retry karega. Bina Idempotency-Key ke, server ye distinguish nahi kar sakta ki ye ek genuinely nayi request hai ya ek retry — dono ko independent POST treat karega, resulting me duplicate order/charge. Idempotency-Key (client-generated, request ke saath bheja gaya unique token) is ambiguity ko resolve karta hai — server key ko track karta hai aur duplicate key pe original stored response wapas deta hai, dobara process kiye bina.",
  },
  {
    id: "rest-semantics-tr-7",
    question: "PATCH verb idempotent hai ya nahi — precise answer do.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Spec-wise guaranteed idempotent nahi hai, PUT ki tarah — depends on implementation, though most well-designed PATCH operations behave idempotently in practice.",
    detailedAnswer:
      "PATCH partial update ke liye design hua hai, aur HTTP spec isse PUT jaisi hard idempotency guarantee nahi deta. Ek PATCH operation jo ek field ko ek absolute value set karti hai (jaise 'set status to Shipped') practically idempotent hoti hai — repeat karne se same end state milta hai. Lekin ek PATCH jo relative change karta hai (jaise 'increment quantity by 1', ya JSON Patch ka 'add' operation ek array me) genuinely non-idempotent ho sakta hai — repeat karne se different result milega. Isliye interview me precise answer hai: 'depends on implementation,' PUT ki tarah unconditional guarantee nahi.",
  },
  {
    id: "rest-semantics-tr-8",
    question: "`202 Accepted` kab use karoge, `200 OK` ki jagah?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Jab request accept ho gayi ho lekin processing asynchronous hai aur turant complete nahi hui — jaise ek background job queue hui.",
    detailedAnswer:
      "202 signal karta hai 'maine tumhari request receive kar li hai aur valid hai, lekin actual processing abhi background me chal rahi hai, complete nahi hui.' Ek typical use case: bulk report generation endpoint jahan actual report banane me minutes lag sakte hain — client ko turant 202 + ek status-check URL (ya job ID) mil jaata hai, wo baad me poll kar sakta hai. 200 OK use hota jab response turant, synchronously ready ho — 202 explicitly signal karta hai ki result abhi available nahi hai.",
  },
];

export default questions;
