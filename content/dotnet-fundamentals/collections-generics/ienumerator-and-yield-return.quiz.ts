import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "yield-return-1",
    question: "`yield return` wala method compile hone par compiler internally kya generate karta hai?",
    options: [
      "Kuch nahi, ye sirf syntax sugar hai jo runtime pe koi transformation nahi karta",
      "Ek hidden class jo `IEnumerator<T>` implement karti hai — ek state machine jo pause/resume support karti hai",
      "Ek naya thread jo background me sequence generate karta hai",
      "Method ko automatically async bana deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Compiler `yield return` method ko poora rewrite kar deta hai ek hidden `IEnumerator<T>`-implementing class me — local variables class fields ban jaate hain, aur method body ek `MoveNext()` implementation ban jaata hai jo state track karta hai ki pichhli baar kahan pause hua tha. Options A galat hai — significant compile-time transformation hoti hai. Option C galat hai — koi naya thread nahi banta, ye synchronous hai (bina explicit async ke). Option D galat hai — `yield return` aur `async`/`await` alag mechanisms hain, chahe conceptually similar (state machine) hon.",
    difficulty: "hard",
  },
  {
    id: "yield-return-2",
    question: "```csharp\nIEnumerable<int> Numbers()\n{\n    Console.WriteLine(\"Starting\");\n    yield return 1;\n    yield return 2;\n}\n\nvar seq = Numbers();\nConsole.WriteLine(\"Before foreach\");\nforeach (var n in seq) { }\n```\nKya \"Starting\" print hoga \"Before foreach\" se pehle ya baad me?",
    options: [
      "Pehle — method call hote hi turant execute hota hai",
      "Baad me — method body tab tak execute nahi hota jab tak enumeration shuru na ho",
      "Kabhi nahi print hoga",
      "Compile error aayega",
    ],
    correctIndex: 1,
    explanation:
      "`yield return` wale methods lazy hain — `Numbers()` call karna sirf ek iterator object return karta hai, andar ka code turant execute nahi hota. Actual execution `MoveNext()` call hone par shuru hoti hai, jo `foreach` internally karta hai. Isliye \"Before foreach\" pehle print hoga, phir \"Starting\" (jab foreach loop shuru hota hai). Options A, C, D sab galat hain — ye exactly lazy-evaluation ka core concept hai.",
    difficulty: "medium",
  },
  {
    id: "yield-return-3",
    question: "Ek `yield return` method jisme `while (true) { yield return x; }` hai (infinite sequence), use `.Take(5).ToList()` se consume karna kya karega?",
    options: [
      "Infinite loop me hang ho jaayega",
      "Poora sequence pehle generate karega, phir 5 le lega",
      "Sirf 5 elements generate honge — Take(5) lagne ke baad enumeration ruk jaata hai",
      "Compile error dega",
    ],
    correctIndex: 2,
    explanation:
      "Ye lazy evaluation ka poora point hai — `Take(5)` sirf 5 `MoveNext()` calls karta hai, phir ruk jaata hai, chahe underlying sequence infinite ho. Har `MoveNext()` call generator ko exactly ek step aage badhata hai. Options A galat hai — infinite loop tabhi hota jab poora sequence eagerly materialize karne ki koshish ki jaaye bina kisi stopping condition ke (jaise direct `.ToList()` bina Take ke). Option B galat hai — poora sequence kabhi nahi generate hota, ye exactly wo cheez hai jo yield return avoid karta hai. Option D galat hai — ye valid, working code hai.",
    difficulty: "hard",
  },
  {
    id: "yield-return-4",
    question: "Ek `yield return` sequence ko do baar `foreach` se enumerate kiya jaata hai. Andar ek `Console.WriteLine(\"Generating...\")` hai. Kitni baar \"Generating...\" print hoga?",
    options: [
      "Ek baar, kyunki result cache ho jaata hai pehli enumeration ke baad",
      "Do baar — har naya enumeration poora method dobara se, shuru se chalata hai",
      "Zero baar",
      "Ye undefined behavior hai",
    ],
    correctIndex: 1,
    explanation:
      "`yield return` method har enumeration ke liye independently chalta hai — koi automatic caching nahi hoti. Do separate `foreach` loops means method do baar poora chalega, isliye side effect (`Console.WriteLine`) bhi do baar hoga. Ye ek common gotcha hai — agar caching chahiye, explicitly `.ToList()` karke result store karna padega. Options A, C, D sab galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
