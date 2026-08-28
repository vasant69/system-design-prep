import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "hrj-1",
    question: "REST kya hai? Kya ye ek protocol hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "REST ek architectural style hai, protocol nahi. Data ko resources ke roop me model karo, noun URLs se address karo, aur ek chhote fixed set of HTTP verbs se manipulate karo; stateless communication.",
    detailedAnswer:
      "REST (Representational State Transfer) ke core constraints: (1) resources — har cheez ek URL se identify hoti hai, jaise `/api/employees/7`; (2) uniform interface — sab resources same tarike se behave karte hain (GET list, POST create, PUT/PATCH update, DELETE remove); (3) statelessness — har request self-contained, server session memory nahi rakhta; (4) representations — client aur server JSON/XML jaise format me resource ka representation exchange karte hain, actual object nahi. HTTP is style ka sabse common transport hai lekin REST khud HTTP-bound nahi. Protocol HTTP hai; REST usko use karne ka disciplined tareeka hai.",
    followUp: "Tumhari API 'RESTful' hai ya sirf 'HTTP API' — farak kaise batao ge?",
    redFlag: "'REST ek protocol hai jo JSON bhejta hai' — style aur protocol ka fark nahi pata.",
  },
  {
    id: "hrj-2",
    question: "PUT aur PATCH me kya difference hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "PUT poora resource replace karta hai given URL par aur idempotent hai. PATCH partial update hai — sirf bheje gaye fields badalte hain — aur generally idempotent nahi maana jaata.",
    detailedAnswer:
      "`PUT /api/employees/7` ke saath tum poora employee representation bhejte ho; server us URL par resource ko us body se replace kar deta hai (missing fields null/default ho sakte hain). Same body 10 baar bhejo, same end state — idempotent. `PATCH /api/employees/7` sirf changes bhejta hai, jaise `{ \"email\": \"new@x.com\" }`; baaki fields chhoote nahi. PATCH ka semantic partial hai aur (especially JSON Merge Patch / JSON Patch me) idempotency guarantee nahi. Practical rule: single/few fields change karne ho to PATCH; client poora object owns aur overwrite karna chahta hai to PUT.",
    followUp: "Agar client PUT bheje lekin body me kuch fields chhod de, tumhara server kya karega?",
  },
  {
    id: "hrj-3",
    question: "201 aur 200 me kab kya bhejte ho? 204 kab?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "200 = success + body (GET, ya update jis par updated resource wapas de rahe ho). 201 = naya resource bana + Location header. 204 = success par bhejne ko body nahi (jaise DELETE).",
    detailedAnswer:
      "`200 OK` general success with a response body. `201 Created` specifically resource-creation ke liye — response me `Location` header naye resource ka URL deta hai aur body me aksar naya resource. `204 No Content` jab operation safal hua par response body ki zaroorat nahi — typical DELETE, ya PUT jab tum updated body wapas nahi bhejte. In codes ka sahi use client ko branch logic dene deta hai bina body parse kiye.",
    followUp: "DELETE ek non-existent id par — 204 doge ya 404? Dono defensible hain, tum kaunsa aur kyun?",
  },
  {
    id: "hrj-4",
    question: "401 aur 403 me kya farak hai? Naam se to dono 'authorization' lagte hain.",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "401 = authentication problem (tum kaun ho pata nahi — token missing/invalid/expired). 403 = authenticated ho, par is action/resource ki permission nahi.",
    detailedAnswer:
      "HTTP spec me `401 Unauthorized` ka matlab actually 'unauthenticated' hai — client ne valid credentials nahi diye; response me `WWW-Authenticate` header aata hai. `403 Forbidden` matlab server ne pehchaan liya kaun ho, lekin ye request allow nahi — dobara login karne se fayda nahi. Example: bina token `GET /api/employees` = 401; ek normal user `DELETE /api/employees/7` jab sirf admin delete kar sakta hai = 403.",
    redFlag: "401 ko 'permission nahi' aur 403 ko 'login nahi' batana — ulta.",
  },
  {
    id: "hrj-5",
    question:
      "Ek team 'delete employee' ko `GET /api/employees/7/delete` se implement karti hai. Kya problem hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "GET safe aur idempotent hona chahiye — koi state change nahi. Prefetch, crawlers, antivirus URL scanners, ya caching proxies isse chup-chaap trigger/cache kar sakte hain.",
    detailedAnswer:
      "GET ko HTTP semantics me 'safe' maana jaata hai, isliye tools uspe assume karke kaam karte hain: browsers link prefetch karte hain, security scanners URLs open karte hain, proxies GET responses cache karte hain. Ek destructive action GET ke peeche rakhne se accidental deletes aur cache poisoning ho sakte hain. Sahi design: `DELETE /api/employees/7` — na safe, na cacheable, intent explicit, aur idempotent (dobara call karo, resource gaya hi rehta hai; 204 ya 404).",
    followUp: "Agar client ka HTTP library DELETE support nahi karta (purana firewall block karta hai) to kya karoge?",
  },
  {
    id: "hrj-6",
    question:
      "Serialization aur deserialization kya hai, aur ASP.NET Core me ye kahan hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Serialization = C# object se JSON text banana (response). Deserialization = incoming JSON se C# object banana (request). ASP.NET Core `System.Text.Json` se ye automatically formatters/model binding me karta hai.",
    detailedAnswer:
      "HTTP body sirf bytes le jaata hai, isliye ek `Employee` object ko wire par bhejne se pehle text (JSON) me convert karna padta hai. Jab tum controller me `return Ok(employee)` likhte ho, output formatter object ko JSON me serialize karta hai; response header `Content-Type: application/json`. Incoming `POST` par `[FromBody] CreateEmployeeDto dto` parameter par model binding JSON ko us DTO me deserialize karta hai. Default `System.Text.Json` C# `PascalCase` ko JSON `camelCase` me map karta hai (`FullName` to `fullName`); ye behavior `JsonSerializerOptions` se configure hota hai.",
    followUp: "Agar incoming JSON me ek extra field ho jo DTO me nahi hai, default me kya hota hai?",
  },
  {
    id: "hrj-7",
    question:
      "Idempotency kya hai aur ye BFSI/payments context me kyun important hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Idempotent request ko 1 baar ya N baar bhejne se end state same rehta hai. Flaky networks par clients retry karte hain — non-idempotent create/update duplicate transactions bana sakta hai.",
    detailedAnswer:
      "GET, PUT, DELETE naturally idempotent hain; POST nahi. Payments me: client `POST /api/payments` bhejta hai, response timeout ho jaata hai, client retry karta hai — agar server ne pehla request process kar liya tha to ab do payments. Solution: client ek `Idempotency-Key` header bhejta hai; server pehli baar key + result store karta hai, aur usi key ke repeat request par naya kaam kiye bina pehla hi result wapas deta hai. Isse retry safe ho jaata hai bina duplicate side effects ke.",
    followUp: "Idempotency key ko server par kitni der store rakhoge aur kahan?",
    redFlag: "'POST ko bas PUT bana do' — hamesha possible nahi jab server hi id generate karta hai.",
  },
  {
    id: "hrj-8",
    question:
      "Ek API error par `200 OK` deta hai aur body me `{ \"success\": false, \"message\": \"...\" }` rakhta hai. Isme kya galat hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Status code hi machine-readable error signal hai. `200` par clients, proxies, retries, aur monitoring 'sab theek' maan lete hain — error handling aur alerting silently toot jaati hai.",
    detailedAnswer:
      "HTTP ecosystem status codes par bharosa karta hai: HTTP client libraries `EnsureSuccessStatusCode()` par throw karti hain, load balancers 5xx par unhealthy mark karte hain, dashboards 4xx/5xx rate track karte hain, browsers cache decisions status se lete hain. Sab kuch `200` me daalne se ye layers blind ho jaati hain — client ko har response ka body parse karke `success` field check karna padega, aur monitoring me error spike kabhi nahi dikhega. Sahi: invalid input `400`, missing `404`, conflict `409`, unhandled server bug `500`, aur body me consistent error shape (e.g. RFC 7807 problem+json).",
    redFlag: "'200 me error dena zyada convenient hai frontend ke liye' — short-term convenience, long-term blind spot.",
  },
];

export default questions;
