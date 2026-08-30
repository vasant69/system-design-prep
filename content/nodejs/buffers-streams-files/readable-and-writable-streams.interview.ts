import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rws-1",
    question: "Readable stream ke paused aur flowing modes samjhao. Stream flowing mode mein kaise jaata hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Paused (pull) — default; data tab tak nahi aata jab tak tum `.read()` na karo. Flowing (push) — stream `'data'` events se tum par chunks push karta hai source ki speed pe. Flowing trigger: `.on('data', fn)` lagana, `.pipe(dest)` karna, ya `.resume()` call karna. `.pause()` wapas paused mein le aata hai.",
    detailedAnswer:
      "Jab Readable banta hai wo paused hota hai — koi data event nahi. `.read()` call karne pe wo internal buffer se ek chunk deta hai (ya `null` agar khali). `'readable'` event batata hai ki `.read()` karne layak data hai. Jaise hi tum `.on('data')` listener add karte ho ya `.pipe()` karte ho, stream flowing mein switch ho jaata hai aur jitni tezi se source deta hai utni tezi se `'data'` emit karta hai — agar tum consume nahi kar rahe toh wo memory mein jaata hai (flowing mode khud backpressure nahi karta jab tak tum `pause()` na karo). Modern code mein teesra option best hai: `for await (const chunk of readable) { ... }` — ye internally pull/paused semantics use karta hai, har iteration pe next chunk maangta hai, isliye tumhare loop body ke async kaam ke dauran source apne aap ruka rehta hai — backpressure free.",
    followUp: "`for await...of` ke beech agar tum `break` kar do to stream ka kya hota hai?",
    redFlag: "\"Flowing mode automatically slow producer ko handle karta hai\" — nahi, sirf pipe/pipeline ya manual pause karta hai.",
  },
  {
    id: "rws-2",
    question: "Backpressure kya hai? Ek fast Readable se slow Writable ko memory-safe likhne ka code likho.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Backpressure = slow consumer ka fast producer ko rokna taaki consumer ka buffer overflow na ho. `writable.write()` `false` de toh `readable.pause()`; `writable.once('drain', () => readable.resume())`. Ya seedha `stream.pipeline(readable, writable, cb)` jo ye pura khud karta hai.",
    detailedAnswer:
      "Manual:\n\n```javascript\nreadable.on('data', (chunk) => {\n  const ok = writable.write(chunk);\n  if (!ok) {\n    readable.pause();\n    writable.once('drain', () => readable.resume());\n  }\n});\nreadable.on('end', () => writable.end());\nreadable.on('error', (err) => writable.destroy(err));\nwritable.on('error', (err) => readable.destroy(err));\n```\n\nKey points: `.once('drain')` (not `.on`) — har pause cycle ke liye exactly ek listener, warna `MaxListenersExceededWarning` aur repeated `resume`. `readable.on('end')` pe `writable.end()`. Dono taraf `error` handlers jo doosre stream ko destroy karein, warna fd leak. Production mein ye 12 lines mat likho — `require('stream/promises').pipeline(readable, writable)` ek line mein backpressure + error propagation + cleanup deta hai. Manual sirf tab jab har chunk pe custom routing/branching chahiye jo pipe nahi kar sakta.",
    followUp: "`.once('drain')` ke bjaya `.on('drain')` likh do to exactly kya galat hoga?",
    redFlag: "`write()` ka return value ignore karna, ya `drain` handler ko `.on()` se attach karna.",
  },
  {
    id: "rws-3",
    question: "`'end'`, `'finish'`, aur `'close'` events mein kya farak hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`'end'` — Readable pe, jab saara data consume ho gaya aur aur nahi aayega. `'finish'` — Writable pe, `.end()` call karne ke baad jab saara buffered data underlying resource pe flush ho gaya. `'close'` — dono pe, jab underlying resource (file descriptor, socket) release ho gaya.",
    detailedAnswer:
      "Ye teeno alag lifecycle points hain aur mix karna common bug hai. Readable ka data khatam hone ka signal `'end'` hai — sirf tab aata hai jab tum poora consume karo (flowing ya `for await`). Writable ka 'kaam poora' signal `'finish'` hai — `.end()` ke baad, sab flush hone par. `writable.on('end', ...)` likhna silent no-op hai kyunki Writable wo event emit hi nahi karta. `'close'` sabse aakhri hai — fd band, koi aur event nahi aayega; cleanup/resource-tracking ke liye ise sunо. Ek pipe `a.pipe(b)` mein: `a` `'end'` deta hai, phir `b.end()` implicitly call hota hai, phir `b` `'finish'` deta hai. `stream.finished(stream, cb)` utility teeno cases (end/finish/error/close) ko ek jagah normalize karti hai — usually isse behtar hai manually events pakadne se.",
    followUp: "`stream.finished()` utility kis problem ko solve karti hai?",
    redFlag: "`'end'` aur `'finish'` ko interchangeable use karna.",
  },
  {
    id: "rws-4",
    question: "Tumne ek proxy banaya jo upstream response ko client tak forward karta hai. Slow clients pe memory 2-3 GB tak jaati hai. Kya galat hai aur kaise theek karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Code `upstream.on('data', c => clientRes.write(c))` kar raha hai aur `write()` ka `false` return ignore kar raha hai. Slow client pe `clientRes` ka buffer unbounded badhta hai. Fix: `stream.pipeline(upstream, clientRes, err => {...})` — ye backpressure (pause/resume), error propagation, aur client-disconnect pe upstream destroy sab handle karta hai. Memory flat ho jaati hai.",
    detailedAnswer:
      "Manual `.on('data')` + `.write()` bina return-value check ke matlab: readable flowing mode mein upstream ki full speed pe chunks deta hai, `clientRes.write()` unhe apne buffer mein rakhta hai kyunki slow client TCP-level pe unhe utni tezi se nahi le raha, aur buffer highWaterMark se bahut upar chala jaata hai. `pipeline` version:\n\n```javascript\nconst { pipeline } = require('stream/promises');\ntry {\n  await pipeline(upstream, clientRes);\n} catch (err) {\n  // client disconnect ya upstream error — dono streams already destroyed\n}\n```\n\nAb `pipeline` `clientRes.write()` ke `false` pe `upstream.pause()` karta hai, TCP receive window shrink hota hai, upstream server bhejna slow karta hai — backpressure end-to-end propagate hota hai. Client disconnect (`clientRes` `'close'`/`'error'`) pe `upstream` `destroy()` ho jaata hai, isliye socket aur memory leak nahi hote. Jahan har chunk pe custom logic chahiye (jaise content rewriting), wahan ek Transform stream pipeline mein daalo — phir bhi manual `.on('data')` avoid karo.",
    followUp: "`pipeline` client disconnect ko kaise detect karta hai aur upstream ko destroy karta hai?",
    redFlag: "\"Bas `--max-old-space-size` badha do\" — root cause (unbounded buffering) address nahi hota.",
  },
  {
    id: "rws-5",
    question: "`readable.pause()` call karne ke turant baad bhi kabhi-kabhi ek-do `'data'` events aa jaate hain. Ye bug hai kya?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Nahi, ye expected hai. `pause()` naye reads rok deta hai par jo chunks pehle se internal pipeline / process queue mein the wo abhi bhi emit ho sakte hain. Isliye backpressure logic ko idempotent aur guarded rakho — double-pause/double-resume se bacho, aur `resume` tabhi karo jab actually paused ho.",
    detailedAnswer:
      "Stream ka flow libuv aur event loop ke through jaata hai; `pause()` synchronously ek flag set karta hai jo agla `_read` rok deta hai, par jo data already read ho chuka aur `'data'` emit hone ki queue mein hai wo deliver hoga. Practical impact: agar tumhara handler `pause()` ke baar-baar call hone pe fragile hai (jaise har `'data'` pe naya `drain` listener add karna), toh listener leak ho jaata hai. Safe pattern: ek `paused` boolean rakho, `if (!ok && !paused) { paused = true; readable.pause(); writable.once('drain', () => { paused = false; readable.resume(); }); }`. Ya behtar — `pipeline()` use karo aur ye khud mat handle karo. Ye edge case exactly wo wajah hai ki manual backpressure code production mein risky hai.",
    followUp: "`for await...of` is race condition se kaise bacha jaata hai?",
    redFlag: "`pause()` ko synchronous hard-stop maan lena jiske baad zero `'data'` events guaranteed hain.",
  },
];

export default questions;
