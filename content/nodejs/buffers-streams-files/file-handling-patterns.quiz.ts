import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "file-handling-patterns-1",
    question:
      "Ek Express route handler ke andar `fs.readFileSync('./small.json')` hai. File sirf 3 KB ki hai. Kya problem hai?",
    options: [
      "Koi problem nahi, file chhoti hai",
      "Jab tak wo sync read chalti hai, us process ki saari doosri concurrent requests, timers aur I/O callbacks block ho jaate hain — high traffic pe tail latency spike",
      "readFileSync sirf text files padh sakta hai, JSON nahi",
      "File har baar cache ho jayegi apne aap",
    ],
    correctIndex: 1,
    explanation:
      "Problem file size ka nahi, concurrency ka hai. `*Sync` main thread pe blocking syscall karta hai — us dauraan event loop poora ruk jaata hai, chahe read 3 ms ho ya 50 ms. 200 req/s pe ye cumulative freeze massive latency deta hai. Hot path pe async `fs.promises.readFile` (+ cache) chahiye. Option C galat — readFileSync Buffer/string dono deta hai. Option D galat — koi auto-cache nahi hota.",
    difficulty: "medium",
  },
  {
    id: "file-handling-patterns-2",
    question:
      "Ek 2 GB CSV file har raat process karni hai. Ek dev bolta hai 'main `fs.readFile` (async) use karunga taaki event loop block na ho' — ye theek hai?",
    options: [
      "Haan, async hai to bilkul safe hai",
      "Nahi — async hone se sirf event loop free rehta hai, lekin poori 2 GB file phir bhi memory mein aati hai; concurrent runs pe OOM. Stream/pipeline chahiye",
      "Haan, lekin sirf agar UV_THREADPOOL_SIZE badha do",
      "Nahi, kyunki fs.readFile 1 GB se badi file padh hi nahi sakta",
    ],
    correctIndex: 1,
    explanation:
      "`fs.readFile` async hone ka matlab hai I/O ke dauraan event loop free — lekin callback ke waqt poora 2 GB buffer memory mein hota hai. Do runs overlap ho gaye to 4 GB — OOM. Badi file = `pipeline(createReadStream, transform, createWriteStream)` ya `readline`, jahan memory ~64 KB constant rehti hai. Option D galat — technically padh sakta hai (buffer limit ~2 GB tak), bas nahi karna chahiye. Option C thread pool se memory problem hal nahi hoti.",
    difficulty: "hard",
  },
  {
    id: "file-handling-patterns-3",
    question:
      "App apni state ko `state.json` mein save karti hai. Crash-safe likhne ka sahi pattern kaunsa hai?",
    options: [
      "fs.writeFile('state.json', json) — seedha, simple",
      "Pehle fs.unlink('state.json') phir fs.writeFile('state.json', json)",
      "json ko ek tmp file pe likho, phir fs.rename(tmp, 'state.json') — same-filesystem rename atomic hota hai",
      "JSON ko chunks mein tod ke appendFile se add karo",
    ],
    correctIndex: 2,
    explanation:
      "Seedha `writeFile` beech mein crash hone par aadhi file chhod deta hai — reader ko corrupt JSON milta hai. tmp + `rename` mein reader ko ya poori purani file dikhti hai ya poori nayi — kabhi aadhi nahi (same-fs rename O(1) aur atomic). Option A/D corrupt-window rakhte hain. Option B aur bura — ab ek window aisa hai jab file exist hi nahi karti.",
    difficulty: "medium",
  },
  {
    id: "file-handling-patterns-4",
    question:
      "Ek 1 GB video ko HTTP response pe bhejna hai, kai users ek saath. Best choice aur kyun?",
    options: [
      "fs.readFileSync(path) phir res.end(buffer) — ek hi baar disk hit",
      "fs.promises.readFile(path) phir res.end(buffer) — async to safe",
      "pipeline(fs.createReadStream(path), res) — per-connection memory ~64 KB, backpressure slow clients ko handle karta hai, disconnect pe read ruk jata hai",
      "File ko base64 mein convert karke JSON response mein bhejo",
    ],
    correctIndex: 2,
    explanation:
      "Stream pe har connection sirf ~64 KB buffer use karta hai, chahe 50 users ho; slow client pe backpressure disk read throttle kar deta hai; client disconnect pe stream destroy hoke read ruk jaata hai. `readFileSync` event loop freeze karega aur har user ke liye 1 GB buffer — 5 users = 5 GB OOM (option A aur B dono). Option D base64 size 33% badha deta hai aur poori file memory mein.",
    difficulty: "medium",
  },
];

export default quiz;
