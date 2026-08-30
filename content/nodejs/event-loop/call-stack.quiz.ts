import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "call-stack-1",
    question:
      "Call stack ka order kya hai aur ek JS engine mein kitne call stack hote hain?",
    options: [
      "FIFO order, aur har module ka apna stack hota hai",
      "LIFO order, aur exactly ek call stack hota hai — isliye ek waqt mein ek hi frame chalta hai",
      "Random order, aur do stack hote hain (sync aur async ke liye alag)",
      "LIFO order, lekin har async operation ke liye naya parallel stack banta hai",
    ],
    correctIndex: 1,
    explanation:
      "Call stack LIFO hai (jo aakhir mein push hua wo pehle pop hota hai) aur engine ke paas exactly ek hota hai — yahi 'single-threaded' ka concrete matlab hai. Option A galat, stack per-module nahi hota. Option C/D galat — async callbacks bhi wapas isi ek stack pe aate hain jab wo khali ho; koi parallel JS stack nahi banta.",
    difficulty: "easy",
  },
  {
    id: "call-stack-2",
    question:
      "Ek request handler ke andar 400ms ka synchronous `for` loop chal raha hai. Un 400ms mein server ka behaviour kya hoga?",
    options: [
      "Server normal chalega, Node dusre core pe baaki requests handle karega",
      "Server koi bhi dusri request process nahi karega — event loop tab tak block hai jab tak wo frame stack se pop na ho",
      "Node automatically us loop ko worker thread pe move kar dega",
      "Baaki requests thodi slow hongi lekin phir bhi parallel chalengi",
    ],
    correctIndex: 1,
    explanation:
      "Sync loop ek frame ke andar chal raha hai jo poore 400ms stack pe baitha rehta hai. Event loop tabhi agla callback uthata hai jab stack khali ho, isliye us dauraan koi aur request, timer, ya I/O callback nahi chalta — yahi 'blocking' hai. Node khud kuch worker thread pe move nahi karta (Option C); JS execution parallel nahi hoti (Option A/D).",
    difficulty: "medium",
  },
  {
    id: "call-stack-3",
    question:
      "`RangeError: Maximum call stack size exceeded` kis wajah se aata hai aur ise kaise handle kar sakte hain?",
    options: [
      "Heap memory khatam ho gayi; sirf `--max-old-space-size` badha ke fix hota hai",
      "Fixed-size call stack deep recursion (bina base case ke) se bhar gaya; yeh ek synchronous error hai jise `try/catch` pakad sakta hai, aur iteration/depth-limit se rokte hain",
      "Event loop mein bahut zyada callbacks queue ho gaye; queue ka size limit hai",
      "Ek async function ne khud ko dobara call kiya; async recursion hamesha overflow karti hai",
    ],
    correctIndex: 1,
    explanation:
      "Call stack ek fixed-size memory region hai (Node main thread pe roughly 984 KB). Bina base case ki recursion frames push karti rehti hai jab tak wo bhar na jaye, phir V8 synchronous `RangeError` throw karta hai — `try/catch` se pakad sakte ho. Fix: recursion ko iteration se replace karo ya explicit depth cap lagao. Option A heap ki baat kar raha hai (alag cheez). Option C galat — queue overflow yeh error nahi hai. Option D galat — async continuations naye khali stack pe chalte hain, isliye async recursion overflow nahi karti.",
    difficulty: "medium",
  },
  {
    id: "call-stack-4",
    question:
      "Ek deep-nested JSON payload bahar se aata hai aur uspe tum recursive `walk()` chala rahe ho. Sabse robust fix kya hai?",
    options: [
      "`walk()` ke around `try/catch` laga do aur `RangeError` aane pe 200 OK return kar do",
      "Recursion ko explicit-stack iteration se replace karo, ya ek `MAX_DEPTH` guard add karo jo limit cross hone pe controlled error de",
      "`node --stack-size=8000` set kar do taaki stack kabhi na bhare",
      "`walk()` ko `setImmediate` mein wrap kar do — phir kitna bhi deep ho chalega",
    ],
    correctIndex: 1,
    explanation:
      "Attacker payload ki depth control kar sakta hai, isliye structural fix chahiye: iteration (heap pe grow hota hai, RangeError nahi) ya ek explicit MAX_DEPTH guard jo predictable 4xx error de. Option A crash ko chhupata hai lekin galat status deta hai aur har bar half-processed data. Option C sirf bar upar sarkata hai — thoda aur deep payload phir gira dega, aur bada stack OS thread stack se collide kar sakta hai. Option D har node ko alag tick pe chalayega — bahut slow, aur infinite-depth ab memory blow karega.",
    difficulty: "hard",
  },
];

export default quiz;
