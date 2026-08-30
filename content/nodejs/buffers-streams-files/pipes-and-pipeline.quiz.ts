import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "pipes-and-pipeline-1",
    question: "`src.pipe(dest)` kaunsi cheez automatically handle karta hai?",
    options: [
      "Errors ko forward karna aur failure pe saare streams destroy karna",
      "Backpressure — `dest.write()` `false` de toh `src.pause()`, `'drain'` pe `src.resume()` — plus `src` ke `'end'` pe `dest.end()`",
      "Data ko encrypt karna transit mein",
      "Retry logic jab dest temporarily unavailable ho",
    ],
    correctIndex: 1,
    explanation:
      "`.pipe()` ka core kaam: `'data'` ko `write()` se jodna, backpressure ka pause/resume dance, aur `'end'` propagate karke `dest.end()` call karna. Jo wo NAHI karta: errors forward (Option A — ye `pipeline` karta hai), encryption (Option C), ya retries (Option D). Isliye `.pipe()` chain production mein fd leak aur crash ka source hai.",
    difficulty: "easy",
  },
  {
    id: "pipes-and-pipeline-2",
    question: "`stream.pipeline(a, b, c, cb)` `.pipe()` chain se kis cheez mein behtar hai?",
    options: [
      "`pipeline` tez hai kyunki wo backpressure skip karta hai",
      "`pipeline` saare stages ke errors ko ek callback/promise mein le aata hai AUR kisi bhi failure pe saare streams `destroy()` karta hai (koi fd/socket leak nahi); `.pipe()` errors forward nahi karta aur streams leak karta hai",
      "`pipeline` sirf 2 streams support karta hai, `.pipe()` unlimited",
      "`pipeline` synchronous hai, `.pipe()` asynchronous",
    ],
    correctIndex: 1,
    explanation:
      "Dono backpressure karte hain — wo farak nahi hai (common trap). Asli farak: `.pipe()` error forward nahi karta (unhandled `'error'` = crash) aur failure pe streams destroy nahi karta (fd/socket leak, hang). `pipeline` har stream pe `stream.finished()` lagata hai, kisi bhi error pe baaki sab `destroy()` karta hai, aur error ek jagah (callback ya promise reject) deta hai. Option A/C/D galat.",
    difficulty: "medium",
  },
  {
    id: "pipes-and-pipeline-3",
    question:
      "`fs.createReadStream(f).pipe(zlib.createGzip()).pipe(s3Upload)` — S3 upload intermittently timeout karta hai. Kuch dino baad service `EMFILE: too many open files` se marti hai. Kyun?",
    options: [
      "gzip memory leak karta hai har call pe",
      "`.pipe()` failure pe upstream streams (read stream, gzip) destroy nahi karta — har failed upload ek file descriptor leak karta hai, aur `ulimit` (aksar 1024) hit hone pe naye fd nahi khul sakte",
      "S3 SDK har request pe naya socket khata hai jo band nahi hota",
      "`zlib` ko har baar naya thread pool chahiye jo exhaust ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Jab `s3Upload` (dest) error karta hai, `.pipe()` `read stream` aur `gzip` ko khula chhod deta hai — unke underlying file descriptors release nahi hote. Har failed run ek leak. Linux default `ulimit -n` aksar 1024 — ~1024 failures baad `EMFILE`. Fix: `await pipeline(fs.createReadStream(f), zlib.createGzip(), s3Upload)` — timeout pe teeno streams destroy ho jaate hain. Option A/C/D galat root cause.",
    difficulty: "medium",
  },
  {
    id: "pipes-and-pipeline-4",
    question:
      "`await pipeline(fs.createReadStream(p), res)` fail ho gaya. `catch` block mein `res.status(500).send('error')` karne pe `ERR_STREAM_WRITE_AFTER_END` aata hai. Kyun aur sahi approach kya hai?",
    options: [
      "`pipeline` ko `res` ke saath use nahi kar sakte; hamesha `.pipe()` use karo response ke liye",
      "`pipeline` failure pe `res` ko already `destroy()` kar chuka hota hai, isliye uspe dobara likhna error deta hai; `catch` mein sirf log karo, ya `res.headersSent` / `res.writableEnded` check karke hi respond karo",
      "`res.status` ko `res.statusCode` likhna chahiye tha",
      "Error is wajah se aata hai ki `pipeline` promise form `res` support nahi karta, callback form use karo",
    ],
    correctIndex: 1,
    explanation:
      "`pipeline` ka contract: kisi bhi failure pe saare streams destroy — `res` bhi. Destroyed/ended `res` pe `.send()` matlab write-after-end. Sahi: `catch` mein sirf logging; agar tum response bhejna chahte ho toh pehle `if (!res.headersSent) res.status(500).end()` guard lagao. Behtar — errors ko pipeline se pehle detect karo (jaise `fs.access` se file check) taaki headers bhejne ke baad fail hone ki naubat hi na aaye. Option A/C/D galat.",
    difficulty: "hard",
  },
];

export default quiz;
