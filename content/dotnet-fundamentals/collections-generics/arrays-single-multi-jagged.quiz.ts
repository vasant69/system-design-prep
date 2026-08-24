import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "arrays-1",
    question: "`int[][] jagged = new int[3][];` ke turant baad `jagged[0][0] = 1;` likhne par kya hoga?",
    options: [
      "1 successfully assign ho jaayega",
      "`NullReferenceException` — `jagged[0]` abhi bhi `null` hai",
      "Compile error dega",
      "`IndexOutOfRangeException` aayega",
    ],
    correctIndex: 1,
    explanation:
      "`new int[3][]` sirf outer array banata hai jisme 3 slots hain, sab abhi `null` (koi inner array allocate nahi hua). `jagged[0]` ko access karne se pehle `jagged[0] = new int[...]` explicitly karna padta hai, warna `jagged[0]` null hone se `jagged[0][0]` ek NullReferenceException dega. Option A galat hai kyunki row abhi allocate nahi hui. Option C galat hai — ye syntactically valid code hai, runtime pe fail hota hai. Option D galat hai — index range ka issue nahi hai, null reference ka hai.",
    difficulty: "medium",
  },
  {
    id: "arrays-2",
    question: "Rectangular array (`int[,]`) aur jagged array (`int[][]`) me memory layout ka fundamental fark kya hai?",
    options: [
      "Dono exactly same tarah memory allocate karte hain",
      "Rectangular ek single contiguous block hai; jagged me outer array references store karta hai aur har row alag heap object hai",
      "Jagged ek single contiguous block hai; rectangular me har row alag object hai",
      "Rectangular arrays stack pe allocate hote hain, jagged heap pe",
    ],
    correctIndex: 1,
    explanation:
      "Rectangular array (`int[,]`) genuinely ek single contiguous memory block hai jisme saara data ek saath hota hai. Jagged array (`int[][]`) me outer array sirf references (pointers) store karta hai, aur har inner row apna khud ka separate, independently-sized heap-allocated array hai. Option C ulta hai — galat. Option D galat hai, dono heap pe hi allocate hote hain (arrays reference types hain C# me, chahe element type value type ho).",
    difficulty: "medium",
  },
  {
    id: "arrays-3",
    question: "Kis scenario me jagged array, rectangular array se better fit hai?",
    options: [
      "Jab har row ka length exactly same ho, jaise ek fixed 8x8 chessboard",
      "Jab matrix multiplication karni ho",
      "Jab har row ka length genuinely alag-alag ho, jaise ek graph ki adjacency list",
      "Jagged array kabhi bhi rectangular se better nahi hota",
    ],
    correctIndex: 2,
    explanation:
      "Jagged arrays variable-length rows ke liye designed hain — jab data ka real shape genuinely uneven ho (jaise graph adjacency list jahan har node ke alag number of neighbours hain, ya departments jahan employee count alag-alag hai). Option A aur B genuinely fixed-grid use cases hain, jahan rectangular array better fit hai (uniform length, contiguous block). Option D factually galat hai.",
    difficulty: "easy",
  },
  {
    id: "arrays-4",
    question: "`int[] marks = { 90, 85, 78, 92 };` ke baad `marks.Count` likhne par kya hoga (bina `using System.Linq;` ke)?",
    options: [
      "4 print hoga, kyunki Count array ki property hai",
      "Compile error — arrays me `Count` property nahi hoti, sirf `Length`",
      "0 print hoga",
      "Runtime exception aayega",
    ],
    correctIndex: 1,
    explanation:
      "Arrays me sirf `Length` property hoti hai, `Count` nahi. `Count` `List<T>` jaisi collections ki property hai, ya `System.Linq` ka `Count()` extension method (jo `IEnumerable` par kaam karta hai) — lekin sirf `using System.Linq;` ke saath available hota hai. Bina LINQ import kiye `marks.Count` compile error dega. Option A galat hai kyunki property exist hi nahi karti bina LINQ ke; C aur D bhi galat hain, ye ek compile-time issue hai, runtime ka nahi.",
    difficulty: "easy",
  },
];

export default quiz;
