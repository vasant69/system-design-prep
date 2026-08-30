import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "buf-1",
    question: "Buffer kya hai aur Node ne ise kyun introduce kiya jab JavaScript mein string pehle se thi?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Buffer ek fixed-length off-heap byte array hai (`Uint8Array` ka subclass) jisme raw bytes rehte hain. JS string UTF-16 text ke liye bani hai — arbitrary binary daaloge toh invalid byte sequences replacement character se replace ho ke data silently corrupt ho jaata hai. Files, sockets, crypto ke liye Node ko bytes chahiye the, isliye Buffer bana.",
    detailedAnswer:
      "JavaScript string ka internal representation UTF-16 hai — har unit ek valid text code unit hona chahiye. Agar tum ek PNG ke bytes ko string mein rakho, jo byte sequences valid Unicode nahi banate unhe engine `U+FFFD` (replacement char) se badal deta hai. Us string ko wapas bytes mein likho toh file toot chuki hoti hai. 2009 mein jab Node aaya, JS mein binary type tha hi nahi (`ArrayBuffer`/`TypedArray` ES2015 mein aaye), aur Node ko HTTP/TCP ke liye byte handling chahiye thi — isliye `Buffer` core mein bana. Ab `Uint8Array` standard hai, toh Node ne Buffer ko uska subclass bana diya: saare typed-array methods milte hain, plus Node ke extras (`.toString('base64')`, `.readInt32BE`, `Buffer.concat`). Memory off-heap hai isliye badi binary GC pe pressure nahi daalti aur libuv/OpenSSL ke saath zero-copy pass hoti hai.",
    followUp: "Buffer aur Uint8Array mein aaj kya farak bacha hai?",
    redFlag: "\"Buffer basically ek binary string hai\" — nahi, string decode/encode karti hai aur corrupt kar sakti hai; Buffer raw bytes ka array hai.",
  },
  {
    id: "buf-2",
    question: "Buffer.alloc, Buffer.allocUnsafe aur Buffer.from mein kya farak hai? Kaunsa default hona chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`Buffer.alloc(n)` — naya `n`-byte block, zero-filled, safe, thoda slow — yahi default. `Buffer.allocUnsafe(n)` — fill nahi karta, fast, par recycled memory (purana process data) de sakta hai — sirf tab jab poora buffer turant overwrite ho. `Buffer.from(x)` — existing string/array/arraybuffer/buffer se banata hai.",
    detailedAnswer:
      "`alloc` har byte `0` set karta hai — predictable content, koi data leak nahi. `allocUnsafe` wo zero-fill skip karta hai (aur chhote sizes ke liye ek shared 8 KB internal pool se slice karta hai), isliye 2x-5x tez, lekin jo memory milti hai usme kisi purane buffer ya freed allocation ka data ho sakta hai. Agar tum allocUnsafe se 100 bytes lo aur sirf 40 likho, baaki 60 mein sensitive data ho sakta hai jo tum network pe bhej doge. Rule: default `alloc`; `allocUnsafe` tabhi jab (a) performance-critical hot path ho aur (b) tum guarantee karo poora buffer likha jayega (jaise `sharp`, `zlib` internally karte hain). `Buffer.from('text', 'base64')` / `Buffer.from(arrayOfBytes)` conversion ke liye — string case mein encoding argument matter karta hai.",
    followUp: "allocUnsafe internally 8 KB pool se kaise slice karta hai, aur poolSize kya hai?",
    redFlag: "allocUnsafe ko performance ke naam pe default bata dena bina security caveat ke.",
  },
  {
    id: "buf-3",
    question: "Ye code kya print karega aur kyun?\n\n```javascript\nconst s = 'A₹';\nconsole.log(s.length);\nconsole.log(Buffer.byteLength(s, 'utf8'));\nconsole.log(Buffer.from(s, 'utf8').length);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`2`, phir `4`, phir `4`. `s.length` UTF-16 code units ginta hai (`A` = 1, `₹` = 1 unit). Lekin UTF-8 mein `₹` 3 bytes leta hai, isliye byte length aur Buffer length dono `4` hain (`1 + 3`).",
    detailedAnswer:
      "`String.prototype.length` UTF-16 code units count karta hai — most characters 1, kuch (astral plane, jaise emoji) 2. `₹` (U+20B9) BMP mein hai toh 1 code unit — `s.length` = `2`. Jab tum ise UTF-8 bytes mein encode karte ho, `A` = 1 byte, `₹` = 3 bytes, total `4`. `Buffer.byteLength(s, 'utf8')` bina buffer banaye ye count deta hai; `Buffer.from(s).length` actual buffer banakar wahi `4` deta hai. Practical impact: `Content-Length` header, request size limits, DB column length checks — sabme `Buffer.byteLength` use karo, `str.length` nahi, warna multibyte input pe response truncate hota hai ya `400`/hang aata hai.",
    followUp: "Agar `s` mein ek emoji (jaise family emoji) ho toh `s.length` kya hoga?",
    redFlag: "\"str.length hamesha bytes deta hai\" — sirf pure ASCII ke liye sanjog se sahi hota hai.",
  },
  {
    id: "buf-4",
    question: "Tumne ek service mein request body ke Buffer chunks ko `let body = ''; req.on('data', c => body += c)` se joda tha aur kabhi-kabhi corrupt data mil raha tha. Kya galat tha aur fix kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`body += c` har Buffer chunk ko implicitly `utf8` decode karta hai. Agar ek multibyte character (jaise `₹` ya emoji) ke bytes do TCP chunks ke beech split ho gaye, dono aadhe hisse alag-alag decode hote hain aur `U+FFFD` ban jaate hain — data corrupt. Fix: chunks ko array mein collect karo aur `Buffer.concat(chunks)` se ek baar jodo, phir poore buffer pe `.toString('utf8')` ya `JSON.parse`.",
    detailedAnswer:
      "TCP stream byte-oriented hai — chunk boundaries arbitrary hain, character boundaries se align nahi. `req.on('data')` ka har `c` ek Buffer hai. `'' + Buffer` ya `body += c` V8 ko force karta hai `c.toString()` (default utf8) call karne ke liye har chunk pe alag se. Agar `₹` ke 3 bytes `[e2, 82]` ek chunk mein aur `[b9]` agle mein aaye, pehla decode `e2 82` ko incomplete sequence maan ke replacement char deta hai, doosra `b9` ko bhi. Sahi pattern:\n\n```javascript\nconst chunks = [];\nreq.on('data', (c) => chunks.push(c));\nreq.on('end', () => {\n  const raw = Buffer.concat(chunks);\n  const body = raw.toString('utf8'); // ab poora buffer, boundaries safe\n});\n```\n\nBonus: `raw` Buffer signature verification (HMAC) ke liye bhi chahiye hota hai — string se wapas nahi bana sakte kyunki whitespace/key-order badal jaata hai. Aur size limit `raw.length` (bytes) se check karo. Kai frameworks (`express.json`, `body-parser`) ye already sahi karte hain — apna raw parser likhte waqt hi ye trap aata hai.",
    followUp: "`StringDecoder` class is problem ko kaise solve karti hai streams ke liye?",
    redFlag: "\"Chunk boundary character boundary hi hota hai\" ya `body += c` ko safe maan lena.",
  },
  {
    id: "buf-5",
    question: "`.slice()` / `.subarray()` ke saath kaunse do bugs aate hain? Interview mein kaise samjhaoge?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "(1) Shared memory: `.subarray()` naya buffer object deta hai par underlying bytes wahi hote hain — ek ko mutate karoge toh doosra badlega. (2) Memory retention: ek chhota subarray bahut der pakde rakhne se poora bada parent buffer GC nahi hota. Dono ka fix: `Buffer.from(buf.subarray(...))` se asli copy lo.",
    detailedAnswer:
      "Node ke docs khud kehte hain `Buffer.prototype.slice` `Uint8Array.prototype.slice` (jo copy karta hai) se semantically clash karta hai, isliye Node 17+ mein deprecated hai — `.subarray()` use karo, jo dono jagah 'view' semantics rakhta hai. View semantics ke do consequences: (1) `const hdr = packet.subarray(0, 20); hdr.writeUInt8(0, 0);` — `packet[0]` bhi `0`. Parsing code mein ye silent corruption deta hai. (2) `const firstByte = hugeBuf.subarray(0, 1)` ko ek long-lived cache ya array mein daalna — `firstByte` alive hai toh `hugeBuf` ki poori off-heap memory alive rehti hai (5 MB retained for 1 byte). Interview mein: \"subarray ek window hai, photo nahi — agar mujhe independent data chahiye ya parent ko free hone dena hai toh `Buffer.from(slice)` se copy leta hoon.\"",
    followUp: "Ek 100 MB file padhne ke baad usme se sirf ek chhota metadata field chahiye — memory-safe kaise nikaaloge?",
    redFlag: "`.subarray()` / `.slice()` ko hamesha independent copy maan lena.",
  },
];

export default questions;
