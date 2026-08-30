import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "buffers-1",
    question: "Buffer ki memory kahan allocate hoti hai aur ye kis class ka subclass hai?",
    options: [
      "V8 heap ke andar; Array ka subclass",
      "V8 heap ke bahar (off-heap); Uint8Array ka subclass",
      "V8 heap ke bahar; String ka subclass",
      "Stack pe; ArrayBuffer ka subclass",
    ],
    correctIndex: 1,
    explanation:
      "Buffer ki asli bytes V8 JavaScript heap ke bahar allocate hoti hain — isliye badi binary data GC ko slow nahi karti aur C++ layer (libuv, OpenSSL) ke saath bina copy share hoti hai. Buffer `Uint8Array` ka subclass hai, isliye typed-array methods (`.set`, `.subarray`, `for...of`) chalte hain. Option A/C/D galat class ya galat memory location bataate hain.",
    difficulty: "easy",
  },
  {
    id: "buffers-2",
    question:
      "`Buffer.alloc(1000)` aur `Buffer.allocUnsafe(1000)` mein practical farak kya hai?",
    options: [
      "alloc bada buffer bana sakta hai, allocUnsafe ki limit chhoti hai",
      "alloc zero-filled aur safe hai par thoda slow; allocUnsafe fill nahi karta isliye fast, lekin usme purana recycled memory data ho sakta hai jise tumhe turant overwrite karna chahiye",
      "Dono identical hain, naam alag hai",
      "allocUnsafe encrypted memory deta hai, alloc plain",
    ],
    correctIndex: 1,
    explanation:
      "`alloc` har byte ko `0` set karta hai — safe default, par zero-fill ka cost hai. `allocUnsafe` wo step skip karta hai, isliye 2x-5x faster, lekin jo memory milti hai usme process ka purana data (tokens, passwords) ho sakta hai — sirf tab use karo jab tum poora buffer khud likhne wale ho ya turant `.fill(0)` karo. Option A galat (limit same). Option C/D galat.",
    difficulty: "medium",
  },
  {
    id: "buffers-3",
    question:
      "`const view = big.subarray(0, 10); view[0] = 0;` — `big` ka pehla byte ka kya hota hai?",
    options: [
      "Kuch nahi, view ek independent copy hai",
      "big[0] bhi 0 ho jaata hai kyunki subarray wahi underlying memory share karta hai",
      "Runtime error — subarray read-only hota hai",
      "big poora zero-fill ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`.subarray()` (aur purana `.slice()`) naya memory allocate NAHI karta — ye wahi underlying bytes ka window deta hai. `view` ko mutate karna `big` ko mutate karta hai, aur ulta bhi. Independent copy chahiye toh `Buffer.from(big.subarray(0, 10))`. Option A ye classic misconception hai. Option C galat — subarray writable hai. Option D galat.",
    difficulty: "medium",
  },
  {
    id: "buffers-4",
    question:
      "HTTP request body ke chunks (`req.on('data', ...)`) ko jodne ka sahi tareeka kaunsa hai aur kyun?",
    options: [
      "`let body = ''; req.on('data', c => body += c)` — simple aur sabse fast",
      "`const chunks = []; req.on('data', c => chunks.push(c)); req.on('end', () => Buffer.concat(chunks))` — kyunki `+=` har chunk ko implicitly decode karta hai aur multibyte character jo do chunks ke beech split hua ho wo corrupt ho jaata hai",
      "`JSON.parse` ko seedha stream pe call karo",
      "Har chunk ko `.toString('hex')` karke jodo, phir ek baar decode",
    ],
    correctIndex: 1,
    explanation:
      "Chunks Buffers hote hain. `body += c` string concatenation force karta hai, jo har chunk ko `utf8` decode karta hai — agar ek multibyte character (jaise `₹`) ek chunk boundary pe kat gaya, dono aadhe hisse `U+FFFD` ban jaate hain aur data corrupt. Buffers ko array mein collect karke `Buffer.concat` se ek baar jodna safe hai. Option A yahi bug introduce karta hai. Option C/D galat.",
    difficulty: "hard",
  },
];

export default quiz;
