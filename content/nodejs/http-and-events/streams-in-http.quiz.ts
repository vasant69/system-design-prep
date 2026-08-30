import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "streams-in-http-1",
    question:
      "Ek 500 MB file serve karne ke liye `fs.readFileSync(path)` + `res.end(buffer)` ke bajaye `pipeline(fs.createReadStream(path), res)` kyun use karte hain?",
    options: [
      "Streaming version hamesha files ko compress karta hai",
      "`readFileSync` poori 500 MB file event loop block karke RAM mein laata hai — 10 concurrent requests par ~5 GB spike aur OOM; streaming file ko ~64 KB chunks mein behata hai, memory payload size se independent, fast time-to-first-byte, aur backpressure handled",
      "`res.end` bade buffers accept nahi karta",
      "Dono identical hain, sirf syntax preference hai",
    ],
    correctIndex: 1,
    explanation:
      "Buffering approach ke teen costs: memory spike (N concurrent × payload), slow TTFB (client ko pehla byte tab milta hai jab poori file read ho chuki), aur DoS surface (attacker parallel large-file requests se RAM khatam kar sakta hai). `readFileSync` to event loop bhi block karta hai. Streaming: constant ~64 KB memory, pehla chunk milliseconds mein, `pipeline` backpressure + error cleanup dono karta hai. Option A/C/D galat.",
    difficulty: "medium",
  },
  {
    id: "streams-in-http-2",
    question:
      "HTTP streaming ke context mein 'backpressure' kya hai?",
    options: [
      "Jab client server par bahut saare requests bhejta hai",
      "Fast producer (disk `~500 MB/s`) ko slow consumer (mobile network `~2 MB/s`) se match karna — `res.write()` `false` return karta hai jab uska internal buffer bhar jaye, matlab source ko `pause()` karo aur `res` ke `'drain'` event par `resume()` karo; `pipe`/`pipeline` ye khud karte hain",
      "Server ka CPU usage 100% par pahunch jana",
      "Ek stream ka doosre stream se connect na ho pana",
    ],
    correctIndex: 1,
    explanation:
      "Bina backpressure ke, agar tum tez padhte jao aur `res.write()` karte jao, Node ke andar unwritten data ka buffer badhta jaata hai jab tak client use na le — ek fast disk + slow client ek request ke liye gigabytes RAM mein jama kar sakta hai. Backpressure: `write()` `false` -> source pause; `'drain'` -> resume. `pipe` aur `pipeline` ye poora dance automatically karte hain. Baaki options unrelated concepts hain.",
    difficulty: "medium",
  },
  {
    id: "streams-in-http-3",
    question:
      "`a.pipe(res)` aur `pipeline(a, res)` mein kya farak hai?",
    options: [
      "Koi farak nahi",
      "`a.pipe(res)` source error par `res` ko destroy NAHI karta — socket hang aur `a` ka file descriptor leak ho sakta hai; `pipeline(a, res, cb)` kisi bhi error par saari streams `destroy()` karta hai aur callback/promise ko reject karta hai — isliye naye code mein hamesha `pipeline`",
      "`pipe` async hai, `pipeline` synchronous",
      "`pipeline` sirf do streams accept karta hai, `pipe` unlimited",
    ],
    correctIndex: 1,
    explanation:
      "Purana `.pipe()` error propagation nahi karta — agar source (file stream) `ENOENT` par error de, `res` cleanly close nahi hoti aur FD leak hota hai. `pipeline` har error par sab streams destroy karta hai (FD leak nahi) aur reject/callback deta hai. `stream/promises` ka `pipeline` `await` ke saath cleaner hai. Option C/D galat — `pipeline(source, ...transforms, destination)` multiple stages leta hai.",
    difficulty: "medium",
  },
  {
    id: "streams-in-http-4",
    question:
      "Ek streaming response ke beech mein source stream fail ho jata hai, lekin `200` status + headers already ja chuke hain. Tum client ko `500` kaise bhejoge?",
    options: [
      "`res.writeHead(500)` call karke — wo previous headers overwrite kar dega",
      "Nahi bhej sakte — headers already sent hain; `if (!res.headersSent)` check karo, aur agar sent hain to `res.destroy()` hi option hai (connection abruptly cut hoti hai). Isliye streaming mein error handling zyada nuanced hai",
      "Ek naya response object bana ke usme `500` likho",
      "`res.status = 500` set kar do, HTTP wo baad mein bhi accept karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Streaming mein `200` + headers pehle chunk ke saath ja chuke hote hain. Beech mein source fail ho to tum `500` nahi bhej sakte — HTTP mein status line ek hi baar bhejti hai. `if (!res.headersSent)` check karke agar abhi nahi bheje to `500` bhej sakte ho; warna `res.destroy()` se connection cut — client ko incomplete response milta hai jise wo detect kar sakta hai (Content-Length mismatch ya chunked stream ka abrupt end). Option A/C/D HTTP protocol ke against hain.",
    difficulty: "hard",
  },
];

export default quiz;
