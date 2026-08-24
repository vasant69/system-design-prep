import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "arrays-tr-1",
    question: "Single-dimensional, rectangular multi-dimensional, aur jagged arrays me kya fark hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer:
      "Single-dimensional (`int[]`) ek linear list hai; rectangular (`int[,]`) ek uniform grid hai jahan har row same length ki hai; jagged (`int[][]`) array-of-arrays hai jahan har row independently-sized ho sakti hai.",
    detailedAnswer:
      "`int[]` ek basic linear collection hai. `int[,]` ek genuine 2D grid hai, single contiguous memory block me stored, jahan har row forcibly same length ki hoti hai. `int[][]` (jagged) outer array hai jisme har element khud ek alag, independently-allocated array hai — rows ka length vary kar sakta hai. Rectangular better fit hai genuinely fixed grids ke liye (matrix, chessboard); jagged better fit hai variable-length row data ke liye (adjacency list, uneven groupings).",
    followUp: "Performance ke hisaab se dono me kya difference hai?",
  },
  {
    id: "arrays-tr-2",
    question: "Ye code kya print karega?\n```csharp\nint[][] jagged = new int[2][];\njagged[0] = new int[] { 1, 2 };\nConsole.WriteLine(jagged[1] == null);\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "True — `jagged[1]` ko kabhi explicitly initialize nahi kiya gaya, isliye ab bhi `null` hai.",
    detailedAnswer:
      "`new int[2][]` sirf 2-slot ka outer array banata hai, dono slots default `null` par set hote hain. Sirf `jagged[0]` ko explicitly `new int[] { 1, 2 }` se assign kiya gaya — `jagged[1]` untouched raha, isliye ab bhi `null` hai aur `jagged[1] == null` `True` print karega.",
  },
  {
    id: "arrays-tr-3",
    question: "Kya array ka size runtime pe change ho sakta hai `Array.Resize()` se? Ye internally kaise kaam karta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — arrays genuinely fixed-size hain. `Array.Resize()` ek naya array allocate karta hai aur data copy karta hai, existing array ko in-place resize nahi karta.",
    detailedAnswer:
      "Arrays C# me creation ke time fix ho jaate hain, unke size ko change nahi kiya ja sakta. `Array.Resize(ref arr, newSize)` ek convenience method hai jo internally ek bilkul naya array allocate karta hai given size ka, purane array se elements copy karta hai (`Array.Copy`), aur `ref` parameter ko naye array ki taraf point kara deta hai. Ye `O(n)` operation hai har baar — agar frequent resizing chahiye, `List<T>` (jo internally isi tarah ka growth karta hai lekin amortized `O(1)` ke saath, doubling strategy se) zyada appropriate tool hai.",
    redFlag: "Ye sochna ki `Array.Resize()` existing memory block ko literally extend kar deta hai — ye galat hai, hamesha naya allocation hota hai.",
  },
  {
    id: "arrays-tr-4",
    question: "Ek employee-attendance system banana hai jahan har department me employees ka count alag-alag hai. Isko model karne ke liye array-based approach kya hoga aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`bool[][]` (jagged array) — kyunki har department ka employee count genuinely uneven hai, rectangular array wasteful hoga.",
    detailedAnswer:
      "Agar `bool[,]` (rectangular) use kiya jaaye, saari departments ko sabse bade department ke employee-count jitni columns allocate karni padengi — chhote departments ke liye bahut saari unused cells ban jaayengi, memory waste hoga. `bool[][]` (jagged) se har department apni khud ki, exact-size ki array rakh sakti hai — koi wastage nahi, aur data shape naturally real-world structure ko reflect karta hai.",
  },
  {
    id: "arrays-tr-5",
    question: "`int[,] matrix = new int[3, 4];` declare karne ke baad, `matrix.Length` kya return karega?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "12 — `Length` total element count deta hai (3 x 4), row ya column count nahi.",
    detailedAnswer:
      "Rectangular array ke liye `.Length` total number of elements deta hai (rows x columns = 3 x 4 = 12), row count ya column count individually nahi. Row count chahiye to `matrix.GetLength(0)` (3), column count ke liye `matrix.GetLength(1)` (4) use karna padta hai. Ye ek common confusion point hai jab log jagged array ke `.Length` (jo outer-row-count deta hai) ke saath rectangular array ke `.Length` (jo total-elements deta hai) ko confuse kar dete hain.",
  },
  {
    id: "arrays-tr-6",
    question: "Kya sabhi rows ka length same hona chahiye jagged array me? Agar row lengths same hi hain, to rectangular array use karna chahiye ya jagged?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Jagged me rows same length ki ho sakti hain lekin need nahi. Agar genuinely hamesha same length rahengi, rectangular array better hai — cleaner semantics, single allocation, thoda better locality.",
    detailedAnswer:
      "Jagged array technically allow karta hai ki sab rows same length ki ho, lekin agar data ka natural shape hamesha uniform hi rehne wala hai (jaise ek fixed matrix operation), rectangular array (`int[,]`) semantically zyada correct choice hai — ye compiler/reader ko batata hai ki 'ye ek genuine grid hai', single contiguous allocation deta hai (ek hi heap object, `n` alag inner-array allocations nahi), aur slightly better cache locality deta hai. Jagged tab choose karna chahiye jab flexibility genuinely chahiye ho, na ki convenience ke liye.",
  },
  {
    id: "arrays-tr-7",
    question: "Array element access `O(1)` kyun hai — mechanism explain karo.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Array ek contiguous memory block hai, isliye kisi bhi index ka address ek direct formula (base address + index * element size) se calculate ho jaata hai — koi traversal nahi chahiye.",
    detailedAnswer:
      "Kyunki array heap pe ek single contiguous block ke roop me allocate hota hai aur har element ka size fixed/known hota hai, `arr[i]` ka memory address seedha calculate ho jaata hai: `base_address + i * element_size`. Ye ek constant-time arithmetic operation hai, chahe array me 10 elements hon ya 10 million — isliye array access `O(1)` hai, `LinkedList<T>` jaise structures ke ulat jahan i-th element tak pahunchne ke liye traversal (`O(n)`) chahiye hota hai.",
  },
  {
    id: "arrays-tr-8",
    question: "Ek naya developer kehta hai 'main hamesha jagged arrays use karta hun kyunki wo zyada flexible hain, rectangular arrays ki koi zaroorat nahi'. Is statement me kya galat hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat approach — jab data genuinely uniform grid ho, rectangular array better fit hai: single allocation, better locality, aur code ka intent clearer hota hai. 'Zyada flexible' hone ka matlab 'hamesha better' nahi hota.",
    detailedAnswer:
      "Jagged arrays flexibility dete hain, lekin us flexibility ki apni cost hai — extra indirection (ek extra pointer dereference har access pe), `n+1` heap allocations `n` rows ke liye (rectangular sirf 1 allocation leta hai), aur koi compile-time/structural guarantee nahi ki sab rows same length hain (jabki genuinely uniform data ke liye ye guarantee hi sahi model hai). Jab data ka real shape ek genuine fixed grid hai, rectangular array sahi choice hai — flexibility jo use hi nahi ho rahi, sirf overhead hai bina benefit ke. Ye 'default to the most flexible tool' anti-pattern ka ek concrete example hai — data ki actual shape decide karni chahiye, habit nahi.",
    redFlag: "Har jagah 'most flexible' option choose karna bina data ki actual shape consider kiye — ye ek design-maturity red flag hai.",
  },
];

export default questions;
