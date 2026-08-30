import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "fs-module-1",
    question:
      "Ek live HTTP server ke request handler ke andar `fs.readFileSync('./big.json')` call karne ki sabse badi problem kya hai?",
    options: [
      "Sync methods deprecated ho chuke hain",
      "Jab tak disk se data nahi aata, poora Node process block rehta hai — koi doosri request, timer ya I/O handle nahi hota",
      "readFileSync sirf text files padh sakta hai",
      "readFileSync Buffer return nahi karta, sirf string",
    ],
    correctIndex: 1,
    explanation:
      "Sync fs call ke dauraan main thread OS syscall pe ruka rehta hai; event loop kuch aur nahi kar sakta, isliye ek slow disk poore server ki throughput/latency ko hit karta hai. Sync sirf startup/CLI ke liye. Option A galat — sync methods supported hain. Option C galat — encoding na do toh Buffer milta hai, text bhi chalta hai. Option D ulta hai — bina encoding Buffer hi milta hai.",
    difficulty: "easy",
  },
  {
    id: "fs-module-2",
    question:
      "`if (fs.existsSync(path)) { fs.readFileSync(path); }` pattern kyun risky hai?",
    options: [
      "existsSync hamesha false return karta hai",
      "Check aur actual read ke beech file delete/rename/permission-change ho sakti hai — ye ek TOCTOU race hai; behtar hai seedha padho aur err.code handle karo",
      "existsSync sirf directories ke liye kaam karta hai",
      "readFileSync ke baad existsSync call karna chahiye, pehle nahi",
    ],
    correctIndex: 1,
    explanation:
      "Time-of-check to time-of-use (TOCTOU): existsSync true de, par uske baad file gayab ho jaye toh readFileSync phir bhi ENOENT throw karega — check bekaar. Sahi pattern: operation try karo, `err.code === 'ENOENT'` (ya EACCES) pe branch karo. Option A/C galat behaviour describe karte hain; option D meaningless hai.",
    difficulty: "medium",
  },
  {
    id: "fs-module-3",
    question:
      "`fs.readFile('./photo.jpg', (err, data) => {...})` — yahan `data` kis type ka hoga?",
    options: [
      "Ek utf8 string",
      "Ek Buffer (raw bytes), kyunki koi encoding argument nahi diya gaya",
      "Ek base64 string",
      "null, kyunki jpg text nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Encoding argument (jaise 'utf8') na do toh fs.readFile Buffer deta hai — raw bytes, jo binary files (jpg/pdf/zip) ke liye bilkul sahi hai. 'utf8' dene par string milti hai (text ke liye). Option A tab sahi hota jab 'utf8' pass kiya hota. Option C/D galat — na base64 auto-hota hai, na null.",
    difficulty: "easy",
  },
  {
    id: "fs-module-4",
    question:
      "Kaunsi situation ke liye `fs.promises.writeFile(path, data, { flag: 'wx' })` sahi choice hai?",
    options: [
      "Jab file ke end mein new line add karni ho",
      "Jab tum chahte ho ki write sirf tabhi ho jab file pehle se exist NAHI karti — warna EEXIST error mile (atomic create)",
      "Jab file ko truncate karke overwrite karna ho",
      "Jab bina permission ke bhi file likhni ho",
    ],
    correctIndex: 1,
    explanation:
      "Flag 'wx' = create, but fail with EEXIST agar path already hai — 'sirf tabhi likho jab naya ho' ke liye. 'a' = append (option A), 'w' = truncate+write (option C, default). Option D — flags permission bypass nahi karte.",
    difficulty: "medium",
  },
];

export default quiz;
