import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "bp-1",
    question: "Backpressure kya hai aur Node streams mein wo mechanically kaise kaam karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Backpressure = slow consumer ka fast producer ko 'dheere' bolne ka feedback. Mechanism: `writable.write()` jab internal buffer `highWaterMark` se upar ho to `false` return karta hai; producer `pause()` karke `drain` event ka wait karta hai, phir `resume()`. `pipe`/`pipeline` ye loop khud chalate hain.",
    detailedAnswer:
      "Har Writable ka ek internal buffer plus `highWaterMark` (default 16 KB) hota hai. Flow: producer `write(chunk)` karta hai. Agar buffered bytes highWaterMark se upar ho, `write` `false` deta hai (chunk phir bhi queue hota hai). Well-behaved producer ab reading rok deta hai (`src.pause()` / `read()` band). Jab consumer buffer ko HWM ke neeche laa deta hai, Writable `drain` emit karta hai -> producer `resume()`. Readable side pe bhi symmetric HWM hai: internal buffer bhar jaaye to `_read` call nahi hoti. `pipe` internally exactly yahi karta hai. Modern alternative: for await (const chunk of readable) — loop body await hone tak Readable naturally paused rehta hai. Bina backpressure ke: queue unbounded, RSS badhta, OOM.",
    followUp: "`highWaterMark` badha dein to kya milta hai aur kya kharaab hota hai?",
    redFlag: "\"Node automatically handle kar leta hai\" — sirf tab jab `pipe`/`pipeline`/async-iterator use karo; manual `on('data')` + `write` mein tumhe khud pause karna padta hai.",
  },
  {
    id: "bp-2",
    question:
      "Ek service S3 se bada object read karke HTTP response mein bhej rahi hai via `s3Stream.on('data', c => res.write(c))`. Load pe memory spike karti hai. Kyun aur fix?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`res` (slow client / network) `s3Stream` (fast) se dheere hai, par code `res.write()` ka `false` ignore kar raha hai — chunks `res` ke buffer mein pile hote hain, per-request memory badhta hai, concurrent requests pe OOM. Fix: `s3Stream.pipe(res)` ya `pipeline(s3Stream, res)`.",
    detailedAnswer:
      "Manual `on('data')` plus `write` bina `write()` return check kiye = backpressure toota. Slow mobile client jitna dheere padhega, S3 stream utni tezi se `res` mein buffer bharega. 1000 concurrent slow clients * bade objects = memory blow. `pipe`/`pipeline` `res.write()` `false` hone par `s3Stream.pause()` karega aur `res` ke `drain` pe `resume`. `pipeline(s3Stream, res)` behtar: client disconnect kare (`res` error/close) to `s3Stream` destroy ho jaata hai -> S3 connection leak nahi, billed bytes bach jaate. Bonus: `Content-Length` ya chunked transfer encoding set karo aur range requests support karo.",
    followUp: "Client mid-download disconnect kare to `pipe` vs `pipeline` mein S3 stream ka kya hota hai?",
    redFlag: "\"`res.write` ko loop mein daal do bas\" — return value ignore karna hi to bug hai.",
  },
  {
    id: "bp-3",
    question: "`a.pipe(b).pipe(c)` — `b` (transform) error throw karta hai. `a` aur `c` ke saath kya hota hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "`b` ka `error` `a` ya `c` tak forward nahi hota. `a` khula reh jaata hai (fd/socket leak), `c` ka partial output band nahi hota, aur agar `b` ke `error` pe listener na ho to unhandled -> crash. `pipeline(a, b, c)` sabko destroy karke error ek jagah deta hai.",
    detailedAnswer:
      "`pipe` ka design: sirf data plus end-of-stream plus backpressure propagate karta hai, `error` nahi. `pipe` ki return value destination hoti hai (chaining ke liye), source nahi. To multi-stage `pipe` chain mein har intermediate stream pe alag `.on('error')` lagana padta, aur error hone par manually sabko `.destroy()` karna padta — practically kabhi sahi se nahi hota. `stream.pipeline(a, b, c, cb)` (ya `stream/promises`): (1) har stream pe error listener, (2) koi bhi fail -> baaki sabpe `destroy(err)`, (3) `cb(err)` / promise reject ek hi jagah. Yahi wajah hai ki 'always use pipeline, not pipe' ek standard rule hai.",
    followUp: "`pipeline` ke callback/promise mein error milne ke baad tumhe manually kuch cleanup karna hota hai?",
    redFlag: "\"`pipe` errors bhi handle karta hai\" — nahi, ye sabse common misconception hai.",
  },
  {
    id: "bp-4",
    question: "`writable.write()` `true` vs `false` return — dono cases mein chunk ka kya hota hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Dono cases mein chunk accept aur queue/write ho jaata hai — data lost nahi hota. `true` = buffer HWM ke neeche, likhte raho. `false` = buffer HWM par ya upar, ab pause karke `drain` ka wait karo. `false` reject nahi hai, sirf advisory hai.",
    detailedAnswer:
      "`write()` kabhi chunk drop nahi karta (jab tak stream destroyed/ended na ho). Return value ka matlab: `true` -> abhi aur `write` karna theek hai; `false` -> tumne HWM paar kar diya, agar tum responsible producer ho to ruk jao. `false` ke baad bhi likhte raho to Node accept karega aur buffer grow karega — koi error nahi, bas memory. `drain` event tab aata hai jab buffered amount HWM ke neeche gir jaaye — us par `write` resume karo. `pipe` isi contract ko implement karta hai. Ek aur baat: `write(chunk, cb)` ka `cb` tab call hota hai jab wo specific chunk flush ho jaaye — per-chunk durability tracking ke liye.",
    followUp: "`cork()` / `uncork()` is picture mein kya karte hain?",
  },
];

export default questions;
