import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "buffers-1",
    question: "`Buffer.from('café', 'utf8').length` kya hai? (`é` ek multi-byte char hai)",
    options: [
      "4 — har character ka ek byte",
      "5 — `é` UTF-8 mein 2 bytes leta hai, baaki teen 1-1 byte",
      "8 — har char 2 bytes",
      "OS ke hisaab se badalta hai",
    ],
    correctIndex: 1,
    explanation:
      "`c`, `a`, `f` ASCII range mein hain to ek-ek byte, par `é` UTF-8 mein 2 bytes (0xC3 0xA9). Total 3 + 2 = 5. `Buffer.length` hamesha bytes count karta hai, jabki `'café'.length` (string) 4 deta hai (code units). Ye farak samajhna zaroori hai jab tum offsets calculate karo ya slice karo.",
    difficulty: "medium",
  },
  {
    id: "buffers-2",
    question: "`Buffer.alloc(4)` aur `Buffer.allocUnsafe(4)` mein farak kya hai?",
    options: [
      "Koi farak nahi, `allocUnsafe` bas purana naam hai",
      "`alloc` zeroed memory deta hai (safe, thoda slow); `allocUnsafe` pool se uninitialised memory deta hai (fast, par purana data leak kar sakta hai jab tak fully overwrite na karo)",
      "`allocUnsafe` sirf tab kaam karta hai jab size 8 ka multiple ho",
      "`alloc` heap pe allocate karta hai, `allocUnsafe` stack pe",
    ],
    correctIndex: 1,
    explanation:
      "`Buffer.alloc(n)` har byte ko 0 karta hai — predictable, par zeroing ka cost hai. `Buffer.allocUnsafe(n)` internal pool se memory grab karta hai jo pehle kisi aur ne use ki thi — content garbage hota hai, aur bina fully overwrite kiye expose karne pe sensitive data leak ho sakta hai. `allocUnsafe` sirf tab jab tum turant poora buffer likhne wale ho.",
    difficulty: "medium",
  },
  {
    id: "buffers-3",
    question: "`buf.toString('hex')` aur `buf.toString('base64')` mein kya milta hai aur kaunsa kab choose karoge?",
    options: [
      "Dono same output dete hain, alias hain",
      "`hex` har byte ko 2 hex-digits mein deta hai (readable, debuggable); `base64` 3 bytes ko 4 ASCII chars mein pack karta hai (shorter, JSON/URL mein bhejne layak) — dono compression nahi",
      "`hex` sirf ASCII bytes ke liye kaam karta hai",
      "`base64` binary ko compress karke chhota kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`hex` = fixed 2 chars per byte, easy to eyeball aur align (hashes, low-level debugging). `base64` = lagbhag 4/3 expansion (33% overhead vs hex ka 100%), isliye JSON, URL ya email mein binary compact bhejne ke liye. Dhyaan: base64 compression nahi hai — sirf binary ko text-safe banata hai. `base64url` variant URL-safe chars use karta hai.",
    difficulty: "medium",
  },
  {
    id: "buffers-4",
    question: "Stream ki `data` event mein jo chunk milta hai wo default kya hota hai?",
    options: [
      "Hamesha ek string",
      "Ek Buffer — jab tak tumne stream pe encoding set na ki ho (`setEncoding('utf8')` ya `{ encoding }` option)",
      "Ek plain array of numbers",
      "Ek JSON object",
    ],
    correctIndex: 1,
    explanation:
      "Readable streams default binary mode mein hain — har `data` chunk ek Buffer. `readable.setEncoding('utf8')` ya `fs.createReadStream(path, { encoding: 'utf8' })` se chunks strings ban jaate hain (aur Node multi-byte char ko chunk boundary pe todhne se bachata hai). Binary data (image, gzip, protobuf) ke liye Buffer hi rakho — string coerce karne se corruption hota hai.",
    difficulty: "easy",
  },
];

export default quiz;
