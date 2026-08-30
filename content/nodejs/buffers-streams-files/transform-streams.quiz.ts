import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "transform-streams-1",
    question:
      "Transform stream aur plain Duplex stream mein fundamental farak kya hai?",
    options: [
      "Transform sirf strings handle karta hai, Duplex Buffers",
      "Transform mein readable-side output writable-side input ka result hota hai; plain Duplex ke do ends independent ho sakte hain",
      "Duplex faster hai kyunki usme transform function nahi chalta",
      "Transform pipeline ke start mein lagta hai, Duplex end mein",
    ],
    correctIndex: 1,
    explanation:
      "Transform ek Duplex hi hai, lekin ek rishte ke saath: jo readable side se nikalta hai wo writable side pe aaye data ka transform result hai. Plain Duplex (jaise TCP socket) ke read aur write ends ka koi seedha rishta nahi hota. Option A galat — dono Buffer/object dono handle karte hain. Option C galat — transform function hi to Transform ka point hai. Option D galat — Transform hamesha beech mein baithta hai.",
    difficulty: "medium",
  },
  {
    id: "transform-streams-2",
    question:
      "`_transform(chunk, enc, callback)` ke andar `this.push(result)` kar diya lekin `callback()` call karna bhool gaye. Kya hoga?",
    options: [
      "Stream turant error throw karega",
      "Output do baar push hoga",
      "Pipeline silently hang ho jayega — Node samajhta hai chunk abhi process ho raha hai, isliye agla chunk nahi bhejta",
      "Kuch nahi, callback optional hai",
    ],
    correctIndex: 2,
    explanation:
      "`callback()` ka matlab hai 'is chunk ka kaam khatam, agla do'. Use skip karoge to Node maanta rahega ki tum abhi busy ho aur agla `_transform` call nahi karega — na error, na output, bas hang. `push()` aur `callback()` alag cheezein hain: `push` output deta hai, `callback` 'ready for next' signal deta hai. Option A/D galat — koi error ya optional-ness nahi. Option B galat — push ek hi baar hua.",
    difficulty: "medium",
  },
  {
    id: "transform-streams-3",
    question:
      "Ek 3 GB CSV file ko process karke DB mein daalna hai, memory limit 512 MB hai. Sabse sahi approach?",
    options: [
      "fs.readFileSync se poori file padho, JSON.parse jaisa loop chalao, phir insert",
      "pipeline(fs.createReadStream(csv), csvParseTransform, batchTransform, dbWriter) — chunk-by-chunk, backpressure automatic",
      "fs.readFile (async) use karo taaki event loop block na ho, baaki same",
      "File ko 6 tukdo mein manually kaat ke har ek readFileSync karo",
    ],
    correctIndex: 1,
    explanation:
      "Streaming pipeline constant ~50-100 MB memory mein chalti hai chahe file 3 GB ho ya 30 GB, aur `pipeline()` backpressure khud handle karta hai — DB slow ho to file read apne aap dheema ho jata hai. Option A crash karega (3 GB > 512 MB). Option C async hone se bhi poori 3 GB memory mein aayegi — OOM. Option D bhi har tukda memory mein laata hai aur manual, error-prone hai.",
    difficulty: "hard",
  },
  {
    id: "transform-streams-4",
    question:
      "`flush(callback)` hook kab chalta hai aur kis liye use hota hai?",
    options: [
      "Har chunk ke baad, buffer clear karne ke liye",
      "Stream banate hi ek baar, initialization ke liye",
      "Saara input consume hone ke baad, end se pehle ek baar — bacha hua buffered data (jaise line splitter ka aakhri adhoora line) push karne ke liye",
      "Error hone par cleanup ke liye",
    ],
    correctIndex: 2,
    explanation:
      "`_flush` tab chalta hai jab writable side pe `end()` aa gaya aur saare chunks `_transform` se guzar chuke — end event emit hone se theek pehle, sirf ek baar. Iska classic use: line splitter ne aakhri piece (jismein `\\n` nahi tha) internal buffer mein rok rakha tha, use `_flush` mein push karo. Option A/B/D galat timing/purpose bata rahe hain — per-chunk, init, aur error cleanup ke liye alag mechanisms hain.",
    difficulty: "medium",
  },
];

export default quiz;
