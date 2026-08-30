import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "http-server-basics-1",
    question:
      "`http.createServer(handler)` internally kis cheez ke barabar hai?",
    options: [
      "`server.listen(handler)`",
      "`server.on(\"connection\", handler)`",
      "`server.on(\"request\", handler)` — server ek EventEmitter hai aur handler 'request' event ka listener ban jata hai",
      "`server.addRoute(\"/\", handler)`",
    ],
    correctIndex: 2,
    explanation:
      "`http.Server` EventEmitter se extend karti hai. `createServer(fn)` sirf ek shortcut hai `server.on(\"request\", fn)` ke liye — fn har parsed HTTP request par chalta hai. Option A galat, `listen` port bind karta hai. Option B galat, `connection` TCP-level event hai (per socket, per request nahi). Option D galat, raw `http` mein routing jaisa kuch nahi hota.",
    difficulty: "easy",
  },
  {
    id: "http-server-basics-2",
    question:
      "Raw `http` server mein handler ke andar `req.url` kya deta hai?",
    options: [
      "Poora absolute URL: protocol, host, port, path, query — sab",
      "Sirf path aur query string, jaise `/users?active=1` — host/protocol nahi",
      "Sirf path, query string alag `req.query` object mein",
      "Sirf domain name, path alag `req.path` mein",
    ],
    correctIndex: 1,
    explanation:
      "`req.url` request line se aata hai jismein client sirf path + query bhejta hai (e.g. `GET /users?active=1 HTTP/1.1`). Host `req.headers.host` mein alag milta hai. Option A galat — absolute URL khud banana padta hai. Option C/D galat — `req.query`/`req.path` Express ke additions hain, raw `http` mein nahi hote; query parse karne ke liye WHATWG `URL`/`URLSearchParams` use karna padta hai.",
    difficulty: "easy",
  },
  {
    id: "http-server-basics-3",
    question:
      "In dono mein se konsa statement `https` aur `http2` ke baare mein sahi hai?",
    options: [
      "`https.createServer` ko TLS key+cert chahiye; `http2` ek connection par multiple parallel streams (multiplexing) allow karta hai",
      "`https` sirf GET requests allow karta hai; `http2` sirf POST",
      "`http2` ko koi certificate nahi chahiye kabhi bhi; `https` browsers mein deprecated hai",
      "`https` aur `http` ka API bilkul alag hai; `http2` sirf client-side module hai",
    ],
    correctIndex: 0,
    explanation:
      "`https.createServer({ key, cert }, handler)` — TLS material zaroori. `http2` (aksar `http2.createSecureServer`) HTTP/2 deta hai: ek TCP connection par multiplexed streams, header compression. Option B galat — dono sab methods support karte hain. Option C galat — browsers practically HTTP/2 sirf TLS ke saath karte hain. Option D galat — `https` ka API `http` jaisa hi hai, aur `http2` server bhi banata hai.",
    difficulty: "medium",
  },
  {
    id: "http-server-basics-4",
    question:
      "Handler mein tumne `res.writeHead(200, { \"Content-Type\": \"text/plain\" })` likha, phir `res.setHeader(\"X-Id\", \"42\")`. Kya hoga?",
    options: [
      "`X-Id` header add ho jayega, sab theek",
      "Kuch nahi hoga, `setHeader` silently ignore ho jayega",
      "Error throw hoga: 'Cannot set headers after they are sent to the client' — kyunki `writeHead` headers bhej chuka hai",
      "Response 500 status ke saath bhej diya jayega",
    ],
    correctIndex: 2,
    explanation:
      "`res.writeHead()` headers ko socket par flush kar deta hai. Uske baad koi bhi `setHeader`/`writeHead` 'Cannot set headers after they are sent' throw karta hai. Sahi tareeka: saare headers `setHeader` se pehle, ya sab ek hi `writeHead(status, headersObject)` call mein do. Option A/B galat — ye silently succeed nahi hota. Option D galat — ye ek thrown error hai, automatic 500 nahi.",
    difficulty: "medium",
  },
];

export default quiz;
