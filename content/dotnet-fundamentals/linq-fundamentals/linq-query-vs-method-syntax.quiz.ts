import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "linq-syntax-1",
    question: "LINQ query syntax aur method syntax ke beech runtime performance me kya fark hota hai?",
    options: [
      "Query syntax thodi slower hoti hai, extra parsing overhead ki wajah se",
      "Method syntax thodi slower hoti hai, extension method call overhead ki wajah se",
      "Koi fark nahi — compiler query syntax ko compile-time pe method syntax me desugar kar deta hai",
      "Fark data source par depend karta hai — IEnumerable vs IQueryable",
    ],
    correctIndex: 2,
    explanation:
      "Query syntax compile-time pe method syntax me convert ho jaati hai — dono exact same IL compile karte hain. Koi runtime overhead difference nahi hai. Options A aur B dono galat premises hain (koi extra runtime cost nahi). Option D bhi galat hai — desugaring dono cases (IEnumerable/IQueryable) me equally hoti hai.",
    difficulty: "easy",
  },
  {
    id: "linq-syntax-2",
    question: "Query syntax me `Count()` ya `First()` operator directly kyun nahi likha ja sakta?",
    options: [
      "Ye operators sirf method syntax ke liye specifically design kiye gaye hain",
      "Query syntax sirf ek subset of keywords (from/where/select/orderby/group/join/let) support karta hai — inke liye koi query-syntax keyword nahi hai",
      "Ye operators sirf IQueryable ke saath kaam karte hain, IEnumerable ke saath nahi",
      "Ye operators deprecated ho chuke hain",
    ],
    correctIndex: 1,
    explanation:
      "Query syntax C# ka ek limited keyword set hai — sirf from/where/select/orderby/group/join/let/into cover karta hai. Aggregation aur element operators (Count, Sum, First, Any, etc.) ke liye koi corresponding query-syntax keyword hi nahi hai, isliye pura query expression ko parenthesis me wrap karke method-syntax se chain karna padta hai. Options C aur D dono factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "linq-syntax-3",
    question: "Ye query syntax code method syntax me compile hone par kya banega?\n```csharp\nfrom p in people\nwhere p.Age >= 18\nselect p.Name;\n```",
    options: [
      "people.Select(p => p.Name).Where(p => p.Age >= 18)",
      "people.Where(p => p.Age >= 18).Select(p => p.Name)",
      "people.Filter(p => p.Age >= 18).Map(p => p.Name)",
      "Ye query syntax runtime pe interpret hoti hai, method syntax me convert nahi hoti",
    ],
    correctIndex: 1,
    explanation:
      "Compiler clauses ko unke order me hi desugar karta hai — `where` pehle aata hai to `.Where()` pehle chain hota hai, phir `select` se `.Select()`. Option A order galat rakhta hai. Option C galat method names use karta hai (LINQ me `Filter`/`Map` nahi, `Where`/`Select` hain). Option D galat hai — conversion compile-time pe hoti hai, runtime interpretation nahi.",
    difficulty: "medium",
  },
  {
    id: "linq-syntax-4",
    question: "Ek 5-table multi-join report likhna hai jisme beech me kuch intermediate calculated values (`let`) bhi chahiye. In do options me se kaunsa generally zyada readable maana jaata hai?",
    options: [
      "Method syntax, hamesha, har scenario me",
      "Query syntax — SQL-jaisi structure multi-join aur let-heavy queries me mentally parse karna aasan banati hai",
      "Dono equally unreadable hote hain badi queries ke liye",
      "Ye purely IDE ki setting par depend karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Query syntax SQL ke structure se milta-julta hai, isliye multi-join aur `let`-heavy complex queries me readability genuinely behtar hoti hai — yehi ek jagah hai jahan query syntax practically fayda deta hai. Option A ek overgeneralization hai jo is specific advantage ko ignore karta hai. Options C aur D dono factually incorrect claims hain.",
    difficulty: "hard",
  },
];

export default quiz;
