import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "async-await-mechanics-1",
    question: "Jab compiler ek `async` method ko rewrite karta hai, local variables jo `await` ke across zinda rehte hain unka kya hota hai?",
    options: [
      "Wo stack par hi rehte hain, kuch nahi badalta",
      "Wo state machine ke fields ban jaate hain, kyunki stack sirf current call ki duration tak zinda rehta hai",
      "Wo automatically static variables ban jaate hain",
      "Wo har baar await ke baad reset ho jaate hain",
    ],
    correctIndex: 1,
    explanation:
      "Method 'pause' hokar baad me (potentially ek doosre thread par) resume hoga, isliye state ko stack pe rakhna possible nahi — stack sirf current call ki duration tak zinda rehta hai. Compiler in variables ko state machine (struct/class) ke fields banata hai, jo heap-referenced/state-machine-lifetime tak zinda rehte hain. Options A, C, D is transformation ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "async-await-mechanics-2",
    question: "`await` se pehle likha gaya code, ek `async` method ke andar, kaise execute hota hai?",
    options: [
      "Ek naya thread spawn hokar background me execute hota hai",
      "Synchronously, calling thread par hi — pause sirf await point par hota hai",
      "Wo bilkul execute nahi hota jab tak Task await na ho",
      "Ye ThreadPool ke schedule par depend karta hai, unpredictable hai",
    ],
    correctIndex: 1,
    explanation:
      "`await` se pehle ka code hamesha calling thread par synchronously execute hota hai — koi automatic thread hand-off nahi hota is point tak. Pause (agar hota hai) sirf `await` point par hota hai, aur wo bhi sirf tab jab awaited operation turant complete nahi hoti. Options A, C, D is fundamental behavior ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "async-await-mechanics-3",
    question: "Agar `await` kiya gaya operation turant, synchronously complete ho jaaye (jaise ek already-completed Task), to kya hota hai?",
    options: [
      "Method turant crash ho jaata hai",
      "Execution seedha aage continue hota hai bina return kiye — koi pause ya thread-switch overhead nahi",
      "Method hamesha ek naya thread spawn karta hai chahe operation complete ho ya na ho",
      "Compiler error deta hai, ye scenario invalid hai",
    ],
    correctIndex: 1,
    explanation:
      "State machine `awaiter.IsCompleted` check karta hai. Agar true hai (operation already complete), `state` field set karke return karne ki zaroorat nahi padti — execution seedha synchronously aage badh jaata hai, jaise `await` tha hi nahi (control-flow ke perspective se). Ye ek important optimization hai jo unnecessary context-switch overhead avoid karta hai. Options A, C, D galat hain.",
    difficulty: "hard",
  },
  {
    id: "async-await-mechanics-4",
    question: "State machine ka `AwaitOnCompleted` call exactly kya karta hai?",
    options: [
      "Awaited operation ko immediately cancel kar deta hai",
      "Ek continuation register karta hai — jab awaited operation complete ho, state machine ke MoveNext() ko dobara call kiya jaaye",
      "Calling thread ko block kar deta hai jab tak operation complete na ho",
      "Ek naya Task object create karta hai jo purane se unrelated hai",
    ],
    correctIndex: 1,
    explanation:
      "`AwaitOnCompleted(ref awaiter, ref this)` ek continuation register karta hai awaited operation ke saath — 'jab ye complete ho, mujhe (state machine ko) `MoveNext()` ke through wapas invoke karna.' Iske baad control turant caller ko return ho jaata hai — koi blocking wait nahi hota (option C galat). Options A aur D bhi is mechanism ko galat represent karte hain.",
    difficulty: "hard",
  },
];

export default quiz;
