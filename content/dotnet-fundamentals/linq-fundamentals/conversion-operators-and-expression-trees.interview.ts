import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "expr-trees-tr-1",
    question: "Expression tree kya hota hai, aur `IQueryable`/EF Core ke liye ye kyun fundamental hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon", "TCS"],
    shortAnswer: "Expression tree ek data structure hai jo code ko 'code as data' represent karta hai — provider isko inspect karke SQL jaisi doosri language me translate kar sakta hai, jo ek compiled delegate ke saath possible nahi.",
    detailedAnswer:
      "Jab ek lambda ko `Expression<TDelegate>` type me assign kiya jaata hai, compiler usse ek executable delegate ke bajaye ek tree data structure me compile karta hai — operators, operands, method calls sab nodes ke roop me. `IQueryable<T>`'s LINQ methods (`Where`, `Select`) isi `Expression<Func<...>>` type ke parameters lete hain. EF Core jaisa provider is tree ko traverse (walk) karta hai aur uske structure ko dekh kar equivalent SQL generate karta hai. Ye poora mechanism hai jo LINQ query ko SQL me translate hone deta hai — bina expression trees ke, provider ko sirf ek compiled, opaque delegate milta jise wo inspect nahi kar sakta.",
    followUp: "IEnumerable ka Where kyun plain delegate leta hai, expression tree nahi?",
  },
  {
    id: "expr-trees-tr-2",
    question: "`Func<T, bool>` aur `Expression<Func<T, bool>>` me fundamental fark kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Func<T, bool> ek compiled, directly-callable delegate hai. Expression<Func<T, bool>> ek inspectable tree data structure hai jise execute karne se pehle .Compile() karna padta hai.",
    detailedAnswer:
      "`Func<T, bool>` normal C# compilation follow karta hai — lambda body IL/machine code me compile hoti hai, aur delegate ko directly `f(x)` jaisa invoke kiya ja sakta hai. `Expression<Func<T, bool>>` alag compile hota hai — compiler lambda ko ek object graph (Expression Tree) me build karta hai jo lambda ki structure (NodeType, Left, Right operands, etc.) ko represent karta hai, executable code nahi. Isse directly call nahi kiya ja sakta — `expression.Compile()` call karke pehle ek actual delegate banana padta hai agar execute karna ho. Iska fayda ye hai ki tree ko runtime pe inspect/analyze/translate kiya ja sakta hai, jo compiled delegate ke saath possible nahi.",
  },
  {
    id: "expr-trees-tr-3",
    question: "Ye code kya karega, aur kyun?\n```csharp\nvar result = dbContext.Employees\n    .Where(e => e.Age > 30)\n    .AsEnumerable()\n    .Where(e => ComplexNonTranslatableMethod(e));\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Pehla Where SQL me translate ho kar database-side filter karega (Age > 30). AsEnumerable() ke baad, dusra Where in-memory (LINQ to Objects) chalega, isliye ComplexNonTranslatableMethod ko SQL translate karne ki koshish nahi hogi.",
    detailedAnswer:
      "`Where(e => e.Age > 30)` abhi bhi `IQueryable` par hai, isliye SQL me translate hoga aur database-side execute hoga (`WHERE Age > 30`). `AsEnumerable()` static type ko `IEnumerable<Employee>` me badal deta hai (koi immediate execution nahi, lekin AAGE ke operators ab `Enumerable`'s overloads resolve karenge). Dusra `.Where(e => ComplexNonTranslatableMethod(e))` isliye in-memory, delegate-based execution use karega — jo already database-filtered results (`Age > 30` waale) par C# me directly chalega, bina koi translation attempt kiye. Ye pattern useful hai jab ek predicate provider translate nahi kar sakta.",
  },
  {
    id: "expr-trees-tr-4",
    question: "`ToDictionary` ko duplicate keys wale source par call karne se kya hota hai, aur isse kaise avoid karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "ArgumentException throw hoga. Duplicates hone par ya to GroupBy use karo (agar multiple values per key chahiye), ya key-selection logic fix karo taaki genuinely unique ho.",
    detailedAnswer:
      "`ToDictionary(keySelector, valueSelector)` internally ek `Dictionary<TKey, TValue>` build karta hai, jo by-definition unique keys enforce karta hai — duplicate key milte hi `ArgumentException` ('An item with the same key has already been added') aata hai. Agar duplicates genuinely expected hain aur tumhe har key ke multiple values chahiye, `GroupBy` use karo (jo `IGrouping` deta hai) instead of `ToDictionary`. Agar duplicates ek data bug hain, `ToDictionary` ka exception hi correct, fail-fast signal hai.",
  },
  {
    id: "expr-trees-tr-5",
    question: "Ek dynamic filtering API banani hai jahan end-users runtime pe apne filter conditions define kar sakein (jaise 'Age > 30 AND Department == IT'), bina raw SQL string-concatenation ke. Expression trees isme kaise madad karte hain?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Expression trees ko runtime pe Expression.GreaterThan, Expression.Equal, Expression.AndAlso jaise builder methods se manually construct kiya ja sakta hai, phir .Where() me pass kiya ja sakta hai — EF Core usse safely SQL me translate kar deta hai, SQL injection risk ke bina.",
    detailedAnswer:
      "`System.Linq.Expressions` namespace expression trees ko programmatically build karne ke liye APIs deta hai (`Expression.Parameter`, `Expression.Property`, `Expression.GreaterThan`, `Expression.AndAlso`, etc.). User-provided filter conditions ko in APIs se ek `Expression<Func<T, bool>>` me runtime pe construct kiya ja sakta hai, phir `.Where(dynamicallyBuiltExpression)` me pass kiya ja sakta hai. Kyunki ye ek genuine, structured expression tree hai (raw string nahi), EF Core provider isse normal LINQ query ki tarah hi SQL me translate karta hai — koi SQL-injection risk nahi, kyunki koi string concatenation nahi ho rahi.",
  },
  {
    id: "expr-trees-tr-6",
    question: "`AsQueryable()` kis scenario me use hota hai, aur kya isse koi real query-translation fayda milta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Mostly testing/interface-compatibility ke liye — ek already in-memory List ko IQueryable-expecting method me pass karne ke liye. Koi real translation fayda nahi milta kyunki underlying data already memory me hai.",
    detailedAnswer:
      "`AsQueryable()` ek `IEnumerable<T>` (jaise ek plain `List<T>`) ko `IQueryable<T>` interface ka roop de deta hai — internally ye `EnumerableQuery<T>` wrap karta hai. Ye common use-case unit-testing hai, jahan production code ek `IQueryable<T>` parameter accept karta hai (EF Core ke saath use karne ke liye), aur test me ek in-memory `List<T>.AsQueryable()` pass kiya jaata hai taaki type-compatibility mile bina real database ke. Lekin isse koi genuine performance/translation fayda nahi milta — data already memory me hai, koi SQL translation actually nahi ho rahi, sirf interface-level compatibility hai.",
  },
  {
    id: "expr-trees-tr-7",
    question: "Kya `Expression<Func<T, bool>>` ko directly `if` condition me use kiya ja sakta hai, jaise `if (expr(x))`?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — Expression<T> directly callable nahi hai. Pehle .Compile() karna padega ek delegate banane ke liye, tabhi call kiya ja sakta hai.",
    detailedAnswer:
      "`Expression<Func<T, bool>>` ek data structure hai, function nahi — isko directly invoke karne ki koshish (`expr(x)`) compile error dega. Execute karne ke liye `var compiled = expr.Compile();` karna padega, jo ek actual `Func<T, bool>` delegate return karta hai, phir `compiled(x)` call kiya ja sakta hai. Ye repeatedly compile karna (jaise ek loop ke andar) performance-costly hai — agar ek hi expression baar-baar execute karni hai, ek baar compile karke result cache karna best practice hai.",
    redFlag: "Expression<T> ko seedha function ki tarah call karne ki koshish karna — ye compile hi nahi hota, ye samajh ki kami dikhata hai ki expression tree aur delegate alag cheezein hain.",
  },
  {
    id: "expr-trees-tr-8",
    question: "`Cast<T>()` aur `OfType<T>()` (jo pehle filtering-projection topic me cover hua tha) ko compare karo — dono conversion/casting-related lagte hain.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Cast<T>() har element ko forcefully T me cast karta hai, non-matching element par InvalidCastException. OfType<T>() sirf matching-type elements filter karta hai, non-matching ko silently skip karta hai.",
    detailedAnswer:
      "`Cast<T>()` assume karta hai sequence ke SAARE elements `T` type ke hain (ya usme cast ho sakte hain) — agar koi element cast fail kare, `InvalidCastException` throw hota hai. Ye use karo jab tumhe pakka pata ho sab elements same/compatible type ke hain, jaise ek non-generic legacy `ArrayList` ko generic `IEnumerable<T>` me convert karna jab sab elements genuinely `T` hain. `OfType<T>()` (element operators/filtering se related) mixed-type collections ke liye safer hai — non-matching elements ko exception ke bajaye silently filter-out kar deta hai.",
  },
];

export default questions;
