import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "class-vs-object-1",
    question: "Class ki metadata CLR kitni baar load karta hai, agar us class ke 500 objects bante hain runtime pe?",
    options: [
      "500 baar — har object ke saath ek copy",
      "Sirf ek baar — class definition ek metadata ke roop me ek hi baar load hoti hai, chahe kitne bhi objects banein",
      "Kabhi nahi — class metadata load hi nahi hoti, sirf objects load hote hain",
      "Har method call pe alag se load hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "Class definition sirf ek baar metadata ke roop me CLR dwara load hoti hai, chahe us class se 0 objects banein ya 500. Har `new` call sirf ek naya heap object allocate karta hai, class metadata dobara load nahi hoti. Option A, C, D sab is fundamental behavior ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "class-vs-object-2",
    question: "Ek reference-type variable (jaise `var acc = new BankAccount();`) me `acc` actually kya store karta hai?",
    options: [
      "Poora object khud, saare fields ke saath",
      "Heap par object ki location ka ek reference (pointer), object khud heap par alag se hota hai",
      "Sirf class ka naam ek string ke roop me",
      "Object ka ek compressed/serialized version",
    ],
    correctIndex: 1,
    explanation:
      "Reference-type variable khud object nahi hota — ye heap par allocated object ki taraf point karne wala ek reference hota hai. Isi wajah se jab tum variable ko pass karte ho, reference copy hoti hai, poora object nahi. Options A, C, D sab factually galat hain memory model ke hisaab se.",
    difficulty: "medium",
  },
  {
    id: "class-vs-object-3",
    question: "Do objects `acc1` aur `acc2` same `BankAccount` class se bane hain, dono ka `Balance` abhi 0 hai. `acc1.Deposit(500)` call karne ke baad `acc2.Balance` kya hoga?",
    options: [
      "500, kyunki dono same class share karte hain",
      "0, kyunki har object apna independent state carry karta hai — ek object ka state modify karne se doosra unaffected rehta hai",
      "Error aayega, kyunki dono same class ke instances ek saath exist nahi kar sakte",
      "250, dono ke beech average ho jayega",
    ],
    correctIndex: 1,
    explanation:
      "Har `new` call apna alag heap memory allocate karta hai — isliye `acc1` aur `acc2` completely independent state carry karte hain, chahe dono same class ke instances hon. `acc1` ko modify karne ka `acc2` par koi effect nahi padta. Baaki options isi fundamental independence ko violate karte hain, jo galat hai.",
    difficulty: "easy",
  },
  {
    id: "class-vs-object-4",
    question: "`typeof(BankAccount)` aur `acc1.GetType()` (jahan `acc1` ek `BankAccount` object hai) ka comparison kya result dega?",
    options: [
      "Hamesha `false`, kyunki dono alag concepts hain",
      "Hamesha `true` — dono same, single `Type` object ko resolve karte hain jo CLR ne us type ke liye load kiya hai",
      "Ye depend karega kitne `BankAccount` objects bane hain",
      "Compile error dega",
    ],
    correctIndex: 1,
    explanation:
      "Chahe kitne bhi `BankAccount` objects bane hon, CLR sirf ek `Type` object maintain karta hai us class ke liye — `typeof(BankAccount)` aur kisi bhi instance ka `.GetType()` hamesha usi single `Type` object ko resolve karte hain, isliye comparison `true` deta hai. Ye class-vs-object separation ka ek direct proof hai.",
    difficulty: "hard",
  },
];

export default quiz;
