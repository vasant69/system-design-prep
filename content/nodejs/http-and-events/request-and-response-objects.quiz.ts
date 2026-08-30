import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "request-and-response-objects-1",
    question:
      "Raw Node HTTP handler mein POST request ka body kaise milta hai?",
    options: [
      "`req.body` property mein automatically parsed hota hai",
      "`req` ek readable stream hai — body ko `req.on(\"data\")` chunks se collect karke `req.on(\"end\")` par assemble karna padta hai (ya pipe/await)",
      "`req.read()` ek hi call mein poora body sync return karta hai",
      "Body headers ke saath `req.headers.body` mein aata hai",
    ],
    correctIndex: 1,
    explanation:
      "`http.IncomingMessage` ek readable stream hai. Handler tab chalta hai jab headers parse ho jate hain — body abhi aa raha hota hai, isliye wo 'data' events (Buffer chunks) mein aata hai, aur 'end' par complete hota hai. Option A galat — `req.body` sirf tab hota hai jab Express `express.json()` jaisa middleware use ho. Option C galat — koi sync full-body read nahi. Option D galat — headers aur body alag hote hain.",
    difficulty: "easy",
  },
  {
    id: "request-and-response-objects-2",
    question:
      "Body collect karte waqt size limit (MAX_BODY counter) na lagane ka kya nateeja hai?",
    options: [
      "Kuch nahi — Node khud 100 KB par cap kar deta hai",
      "Request slow ho jati hai lekin safe rehti hai",
      "Ek malicious/buggy client unbounded data bhej sakta hai; chunks memory mein jamaa hote rehte hain aur process OOM ho sakta hai — ek DoS hole",
      "Sirf `JSON.parse` fail hoga, koi aur risk nahi",
    ],
    correctIndex: 2,
    explanation:
      "Bina byte-counter ke, har 'data' chunk `chunks` array mein push hota rehta hai bina kisi upper bound ke. Ek gigabyte upload `Buffer.concat` ko OOM kara sakta hai aur chhote container ko seconds mein kill. Isliye running counter + `MAX_BODY` cap, cross hone par `413` + `req.destroy()`. Option A galat — raw `http` koi default limit nahi lagata (ye Express `express.json()` ka 100 KB default hai). Option B/D risk ko undersell karte hain.",
    difficulty: "medium",
  },
  {
    id: "request-and-response-objects-3",
    question:
      "`req.headers` ke baare mein konsa statement sahi hai?",
    options: [
      "Keys original casing mein aate hain, jaise `req.headers[\"Content-Type\"]`",
      "Saari header keys lowercased hoti hain — `req.headers[\"content-type\"]` sahi, `req.headers[\"Content-Type\"]` undefined",
      "`req.headers` ek string hai, object nahi",
      "Headers sirf `req.on(\"headers\")` event se milte hain",
    ],
    correctIndex: 1,
    explanation:
      "Node HTTP parser saari incoming header field names ko lowercase kar deta hai, isliye `req.headers` object mein hamesha lowercase keys hote hain. `Content-Type` casing se access karoge toh `undefined` milega. Multi-value headers jaise `set-cookie` array ban jate hain, baaki comma-joined. Option A galat (casing preserve nahi hota), C galat (object hai), D galat (headers parse hone par hi handler chalta hai, wo `req.headers` mein ready hote hain).",
    difficulty: "easy",
  },
  {
    id: "request-and-response-objects-4",
    question:
      "`res.setHeader(\"X-Foo\", \"bar\")` kab tak allowed hai?",
    options: [
      "Kabhi bhi, `res.end()` ke baad bhi",
      "Sirf handler ke pehle line par",
      "Sirf pehle `res.write()` / `res.end()` / `res.writeHead()` se pehle — uske baad headers flush ho chuke hote hain aur set karna throw karta hai",
      "Sirf agar `Content-Length` already set ho",
    ],
    correctIndex: 2,
    explanation:
      "`res.setHeader()` header ko ek internal map mein rakhta hai. Pehla `write`/`end`/`writeHead` status line + saare headers socket par flush kar deta hai; iske baad `setHeader` 'Cannot set headers after they are sent' throw karta hai. Isliye saari header logic body likhne se pehle honi chahiye. Option A clearly galat, B unnecessarily strict (kahin bhi pehle, bas flush se pehle), D unrelated.",
    difficulty: "medium",
  },
];

export default quiz;
