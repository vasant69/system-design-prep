import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "working-with-json-1",
    question:
      "Ek endpoint kabhi-kabhi 3-4 seconds ke liye saari requests pe respond karna band kar deta hai. Logs mein us waqt ek 80 MB webhook body aata dikhta hai. Sabse likely wajah?",
    options: [
      "Network slow ho gaya us request pe",
      "80 MB body ka JSON.parse synchronous aur O(n) hai — wo poore event loop ko us dauraan block kar deta hai, isliye baaki sab requests ruk jaati hain",
      "Garbage collector ne 4 second ka pause liya",
      "Express automatically bade bodies ko retry karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`JSON.parse` C++ mein hai lekin poori tarah synchronous — 80 MB parse karne mein 1-2+ seconds lag sakte hain aur us dauraan event loop kisi aur request/timer/callback ko touch nahi karta. Isliye ek bada body poore server ko freeze kar deta hai. Fix: bade payloads ko stream/NDJSON se lo. Option A galat — ek slow request baaki sabko block nahi karti. Option C possible but GC pause itna lamba nahi hota; parse hi asli culprit hai. Option D aisa feature nahi hai.",
    difficulty: "hard",
  },
  {
    id: "working-with-json-2",
    question:
      "`JSON.stringify({ id: 9007199254740993n, name: 'A' })` chalane pe kya hota hai?",
    options: [
      "'{\"id\":9007199254740993,\"name\":\"A\"}' return hota hai",
      "id ko null bana ke '{\"id\":null,\"name\":\"A\"}' return hota hai",
      "TypeError throw hota hai — BigInt serialize nahi hota",
      "id ko string '9007...' bana deta hai apne aap",
    ],
    correctIndex: 2,
    explanation:
      "`JSON.stringify` `BigInt` ke saath seedha `TypeError: Do not know how to serialize a BigInt` throw karta hai — na null banata hai, na auto-string. Bade IDs ke liye `String(id)` se explicitly serialize karo ya `replacer` mein handle karo, aur `reviver` se parse pe wapas `BigInt`. Circular reference bhi similarly throw karti hai. Baaki cases (`undefined`, functions) drop hote hain, throw nahi.",
    difficulty: "medium",
  },
  {
    id: "working-with-json-3",
    question:
      "Ek service ko 2 GB tak ke event export doosri service ko dena hai. Kaunsa design event loop aur memory dono ke liye sahi hai?",
    options: [
      "Sab events ko ek array mein daalo, JSON.stringify karo, res.send() — ek hi response",
      "NDJSON: har event ko alag line pe JSON.stringify karke stream mein likho; consumer readline se line-by-line parse kare — dono taraf memory constant",
      "express.json() ka limit 2gb kar do aur normal res.json bhejo",
      "Poora array JSON.stringify karo lekin setTimeout ke andar taaki block na ho",
    ],
    correctIndex: 1,
    explanation:
      "NDJSON mein har line ek chhota independent JSON object hai — producer ek-ek line stream karta hai, consumer `readline` se ek-ek parse karta hai, dono taraf memory ~ek line jitni, aur consumer pehli line milte hi kaam shuru kar deta hai. Option A aur C dono taraf 2 GB+ synchronous parse/stringify = seconds ka freeze + OOM. Option D: `setTimeout` ke andar bhi `JSON.stringify` ek hi synchronous call hai, wo tab bhi block karega.",
    difficulty: "hard",
  },
  {
    id: "working-with-json-4",
    question:
      "`JSON.parse(text, reviver)` mein `reviver` function ka kaam kya hai?",
    options: [
      "Invalid JSON ko theek karke parse karna",
      "Parse ke dauraan har key-value pair pe call hota hai; jo return karo wahi us key ki final value banti hai — jaise date strings ko new Date() banana",
      "Parse ko asynchronous banana taaki event loop block na ho",
      "Duplicate keys ko merge karna",
    ],
    correctIndex: 1,
    explanation:
      "`reviver(key, value)` har parsed property pe (bottom-up) call hota hai aur uska return value final value ban jaata hai. Classic use: `if (key === 'createdAt') return new Date(value)` — kyunki JSON mein Date hoti hi nahi, wo ISO string ban jaati hai aur `parse` use string hi rakhta hai. Option A galat — reviver invalid JSON theek nahi karta, parse pehle hi throw kar dega. Option C galat — reviver parse ko async nahi banata. Option D reviver ka kaam nahi.",
    difficulty: "medium",
  },
];

export default quiz;
