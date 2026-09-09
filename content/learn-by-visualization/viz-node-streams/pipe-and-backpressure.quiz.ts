import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "pipe-and-backpressure-1",
    question: "`dest.write(chunk)` `false` return kare to iska matlab kya hai?",
    options: [
      "Chunk reject ho gaya, use dobara bhejo",
      "Write fail ho gaya, error aane wala hai",
      "Chunk accept ho gaya par internal buffer `highWaterMark` cross kar gaya — aur mat likho jab tak `drain` event na aaye",
      "Stream band ho gaya",
    ],
    correctIndex: 2,
    explanation:
      "`write()` ka return ek advisory flow-control signal hai. `false` matlab: chunk queue ho gaya (lost nahi hua), par buffer target se upar hai — producer ko pause karke `drain` ka wait karna chahiye. Ignore karke likhte raho to Node mana nahi karega, bas buffer aur memory badhti jaayegi. `true` = keep writing.",
    difficulty: "medium",
  },
  {
    id: "pipe-and-backpressure-2",
    question: "`src.pipe(dest)` aur `pipeline(src, dest)` mein core farak kya hai?",
    options: [
      "Koi farak nahi, `pipeline` naya naam hai",
      "`pipe` sirf backpressure handle karta hai; `pipeline` backpressure + har stage ka error propagate + failure pe saari streams destroy/cleanup karta hai",
      "`pipeline` backpressure handle nahi karta, sirf errors",
      "`pipe` faster hai kyunki wo error-checking skip karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Dono backpressure (pause/resume) karte hain. Farak error handling aur cleanup ka hai: `a.pipe(b).pipe(c)` mein `b` fail ho to `a` khula reh jaata hai (fd/socket leak) aur error automatically aage nahi jaata. `pipeline(a, b, c, cb)` har stream pe error sunta hai, first error pe sabko `destroy()` karta hai, aur ek callback ya promise se error deta hai. Production mein `pipeline` default hona chahiye.",
    difficulty: "medium",
  },
  {
    id: "pipe-and-backpressure-3",
    question: "`highWaterMark` kya control karta hai?",
    options: [
      "Stream ki maximum total size",
      "Internal buffer ka target threshold — itna data queue hone par Readable padhna rok deta hai / Writable `write()` `false` deta hai",
      "Kitne listeners attach ho sakte hain",
      "Har chunk ka exact size, hamesha",
    ],
    correctIndex: 1,
    explanation:
      "`highWaterMark` ek soft limit hai (default 16 KB byte streams, 16 for objectMode). Writable: itna buffered hone par `write()` `false` deta hai. Readable: internal buffer itna bhar jaane par source se aur padhna rok deta hai. Ye hard cap nahi — ek bada chunk isse cross kar sakta hai — bas 'ab pause karo' ka trigger point hai. Latency vs memory ke trade-off ke liye tune karo.",
    difficulty: "hard",
  },
  {
    id: "pipe-and-backpressure-4",
    question: "Backpressure ignore kiya jaaye to kya failure hota hai?",
    options: [
      "Data corrupt ho jaata hai",
      "Kuch nahi, Node hamesha auto-handle karta hai",
      "Writable ka internal buffer unbounded badhta hai -> memory spike -> OOM crash (ya bada latency spike)",
      "CPU 100% ho jaata hai",
    ],
    correctIndex: 2,
    explanation:
      "Fast producer + slow consumer + no pause = jitna producer generate karta hai sab Writable ke queue mein jama hota hai. RSS memory chadhti jaati hai jab tak process OOM-kill na ho jaaye. Ye classic 'big file ko slow disk/socket pe bhejna bina pipe ke' bug hai. `pipe`/`pipeline`/`for await` isko rokte hain. Data corrupt nahi hota (jab tak crash na ho), par memory aur latency blow up hote hain.",
    difficulty: "easy",
  },
];

export default quiz;
