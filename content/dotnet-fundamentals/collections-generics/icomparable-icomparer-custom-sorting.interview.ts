import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "icomparable-icomparer-tr-1",
    question: "`IComparable<T>` aur `IComparer<T>` me exact fark kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "`IComparable<T>` type khud implement karta hai apni ek natural ordering ke liye; `IComparer<T>` ek external, swappable strategy object hai jo multiple orderings allow karta hai bina type ko modify kiye.",
    detailedAnswer:
      "`IComparable<T>` type ke andar hi implement hota hai — 'is type ka default, natural sort order kya hai' ka jawab, ek hi possible ordering. `IComparer<T>` ek separate class/object hai jo bahar se ordering define karta hai — same type ke liye multiple, alag-alag `IComparer<T>` implementations ban sakte hain, jinme se koi bhi `Sort()`/`OrderBy()` me pass kiya ja sakta hai runtime pe. `IComparable` = 'main khud jaanta hoon kaise sort hona hai'; `IComparer` = 'koi bahar se decide karega kaise sort karna hai.'",
    followUp: "IComparer<T> Strategy design pattern se kaise relate karta hai?",
  },
  {
    id: "icomparable-icomparer-tr-2",
    question: "Ye code kya karega?\n```csharp\nvar products = new List<Product> { /* Prices: 30, 10, 20 */ };\nproducts.Sort(); // Product implements IComparable<Product>, sorts by Price\nConsole.WriteLine(products[0].Price);\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "10 — `Sort()` bina arguments ke `IComparable<T>.CompareTo()` use karta hai, jo yahan Price ke basis pe ascending order deta hai.",
    detailedAnswer:
      "`List<T>.Sort()` (bina argument ke) `T`'s `IComparable<T>` implementation use karta hai agar available ho. `Product`'s `CompareTo` Price ke basis pe compare karta hai (`Price.CompareTo(other.Price)`), jo ascending order deta hai by default. Sorted order: 10, 20, 30. `products[0].Price` isliye `10` hoga.",
  },
  {
    id: "icomparable-icomparer-tr-3",
    question: "Ek job portal me results ko 'Relevance', 'Newest', aur 'Salary High-to-Low' — teen tareeke se sort karna hai, user selection ke basis pe. Design kaise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`JobListing` me koi single natural order force mat karo — teen separate `IComparer<JobListing>` classes banao aur user selection ke hisaab se sahi comparer `Sort()`/`OrderBy()` me pass karo.",
    detailedAnswer:
      "Kyunki teen genuinely alag, equally-valid orderings hain (koi ek 'natural' default nahi hai), `IComparable<JobListing>` yahan galat tool hoga (sirf ek order force karta). Sahi approach: `RelevanceComparer`, `DateComparer`, `SalaryComparer` — teen alag `IComparer<JobListing>` classes, aur UI ke dropdown selection ke basis pe `jobListings.Sort(selectedComparer)` call karna. Naya sorting option future me add karna sirf ek naya comparer class add karna hai, `JobListing` ko touch kiye bina.",
  },
  {
    id: "icomparable-icomparer-tr-4",
    question: "Ye code kya karega?\n```csharp\npublic class Item\n{\n    public int Id { get; set; }\n    public override bool Equals(object? obj) => obj is Item other && Id == other.Id;\n    // GetHashCode() override NAHI kiya gaya\n}\n\nvar set = new HashSet<Item>();\nset.Add(new Item { Id = 1 });\nbool found = set.Contains(new Item { Id = 1 });\nConsole.WriteLine(found);\n```",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "False (most likely) — `GetHashCode()` override nahi kiya, isliye default (reference-based) hash use hota hai. Do alag Item instances, chahe Equals() se 'equal' hon, alag hash rakhte hain, isliye HashSet unhe same bucket me nahi dhoondhta.",
    detailedAnswer:
      "`Equals()` override kiya gaya hai (value-based, Id ke basis pe), lekin `GetHashCode()` nahi — isliye compiler warning bhi degi ('override Equals but not GetHashCode'), aur runtime pe default `object.GetHashCode()` (reference-identity-based) use hoga. Do alag `new Item { Id = 1 }` instances ka reference-hash different hoga, isliye `HashSet` unhe DIFFERENT buckets me treat karega, chahe `Equals()` unhe 'same' bole. `Contains()` sahi bucket search hi nahi karega, isliye `false` (ya undefined/inconsistent behavior) milega — ye exactly wo bug hai jo Equals/GetHashCode ko saath override na karne se aata hai.",
    redFlag: "Sirf Equals() override karna aur GetHashCode() ko ignore karna — ye compiler warning ko bhi ignore karne jaisa hai, aur production me silent, hard-to-debug bugs deta hai.",
  },
  {
    id: "icomparable-icomparer-tr-5",
    question: "`Comparer<T>.Create()` kya hai aur kab use karna chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ek shortcut static method jo ek lambda se `IComparer<T>` instance bana deta hai, bina poori separate class likhe — one-off ya simple comparisons ke liye convenient.",
    detailedAnswer:
      "`Comparer<T>.Create(Func<T,T,int> comparison)` ek `IComparer<T>` instance return karta hai jiski `Compare` method di gayi lambda ko delegate karti hai. Useful hai jab ordering logic simple ho aur ek dedicated named class banana overkill lage — jaise `products.Sort(Comparer<Product>.Create((a, b) => a.Name.CompareTo(b.Name)));`. Named class better hai jab logic complex ho ya reused hona ho multiple jagah, lambda-based approach better hai one-off, inline scenarios ke liye.",
  },
  {
    id: "icomparable-icomparer-tr-6",
    question: "Kya `IComparable<T>` aur `IEquatable<T>` ek hi cheez hain — dono equality ke baare me?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — `IComparable<T>` ORDERING (kaun pehle/baad aata hai) ke baare me hai, `IEquatable<T>` EQUALITY (same hain ya nahi) ke baare me hai. Related lekin distinct concepts hain.",
    detailedAnswer:
      "`IComparable<T>.CompareTo()` teen-way result deta hai (negative/zero/positive) — 'sort order me relative position kya hai.' `IEquatable<T>.Equals()` sirf `bool` deta hai — 'ye do genuinely same hain ya nahi.' Ek type dono implement kar sakta hai independently — `CompareTo` returning zero aur `Equals` returning true ideally consistent hone chahiye (agar `CompareTo` 0 kehta hai, `Equals` bhi true kahe, generally), lekin ye do separate interfaces hain, alag purposes ke liye — sorting vs hashing-collection membership.",
    redFlag: "IComparable aur IEquatable ko same purpose ka samajh kar sirf ek implement karna jab dono genuinely chahiye ho (jaise sorting bhi karni hai aur HashSet me bhi use karna hai).",
  },
  {
    id: "icomparable-icomparer-tr-7",
    question: "`string.Compare(x.Name, y.Name, StringComparison.Ordinal)` ke bajaye `x.Name.CompareTo(y.Name)` use karne me kya trade-off hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "`.CompareTo()` culture-sensitive default comparison use karta hai (locale-dependent), jabki explicit `StringComparison.Ordinal` predictable, culture-independent, aur faster byte-level comparison deta hai.",
    detailedAnswer:
      "`string.CompareTo()` current culture ke rules follow karta hai by default — different locales me sorting result technically different aa sakta hai (jaise kuch accented characters ka ordering culture-specific hota hai). `StringComparison.Ordinal` explicitly raw character-code comparison karta hai — predictable, culture-independent, aur typically fast bhi. Data-sensitive ya cross-culture-consistent sorting chahiye (jaise database keys, file paths, case-sensitive identifiers) to explicit `StringComparison` specify karna best practice hai, implicit culture-dependent default pe rely karne ke bajaye.",
  },
  {
    id: "icomparable-icomparer-tr-8",
    question: "Ek `SortedDictionary<Product, int>` banana hai jahan Product khud IComparable implement nahi karta. Ye possible hai kya?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Haan — `SortedDictionary<TKey,TValue>` ka constructor optionally ek `IComparer<TKey>` accept karta hai; agar do to `IComparable<TKey>` na hone par bhi ye kaam karega.",
    detailedAnswer:
      "`SortedDictionary<TKey,TValue>(IComparer<TKey> comparer)` overload exactly is scenario ke liye hai — agar `TKey` khud `IComparable<TKey>` implement nahi karta (ya tumhe uske default order ke alawa kuch aur chahiye), tum ek custom `IComparer<Product>` bana kar constructor me pass kar sakte ho: `new SortedDictionary<Product, int>(new ProductPriceComparer())`. Ye `IComparer<T>` ki flexibility ka ek concrete example hai — sirf `List<T>.Sort()` tak limited nahi, saari sorted collections isko accept karti hain.",
  },
];

export default questions;
