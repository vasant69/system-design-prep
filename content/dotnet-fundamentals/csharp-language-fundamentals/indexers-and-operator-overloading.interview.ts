import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "indexer-op-tr-1",
    question: "Indexer kya hai aur ise kaise define karte hain? Ek example do.",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "`this[param] { get; set; }` syntax se ek custom type ko array-jaisa [] access diya jaata hai.",
    detailedAnswer:
      "```csharp\npublic class Settings\n{\n    private readonly Dictionary<string, string> _values = new();\n    public string this[string key]\n    {\n        get => _values.TryGetValue(key, out var v) ? v : null;\n        set => _values[key] = value;\n    }\n}\n```\nIndexer ek property jaisi hai lekin naam ki jagah `this[parameter]` use karti hai — caller `settings[\"theme\"] = \"dark\";` jaisa array/dictionary-jaisa syntax use kar sakta hai, chahe underlying implementation ek `Dictionary` ho ya kuch aur.",
    followUp: "Kya ek class me multiple indexers ho sakti hain different parameter types ke saath?",
  },
  {
    id: "indexer-op-tr-2",
    question: "`Money` jaisa type banao jo `+` operator support kare, currency-mismatch ko safely handle karte hue.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "static operator+ method define karo jo same currency check kare, mismatch pe exception throw kare.",
    detailedAnswer:
      "```csharp\npublic readonly struct Money\n{\n    public decimal Amount { get; }\n    public string Currency { get; }\n    public Money(decimal amount, string currency) { Amount = amount; Currency = currency; }\n\n    public static Money operator +(Money a, Money b)\n    {\n        if (a.Currency != b.Currency)\n            throw new InvalidOperationException(\"Currency mismatch\");\n        return new Money(a.Amount + b.Amount, a.Currency);\n    }\n}\n```\nYe pattern value-type arithmetic ko domain-safe banata hai — natural `+` syntax milta hai, lekin genuinely invalid operations (cross-currency add) loudly fail hoti hain, silently wrong result nahi dete.",
  },
  {
    id: "indexer-op-tr-3",
    question: "Agar tum `==` overload karo lekin `Equals()`/`GetHashCode()` ko override na karo, kya practical problem aa sakti hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Dictionary/HashSet jaise collections Equals/GetHashCode use karte hain, `==` nahi — inconsistency se duplicate keys ya missed lookups jaisi bugs aa sakti hain.",
    detailedAnswer:
      "`Dictionary<TKey,TValue>` aur `HashSet<T>` internally `Equals()` aur `GetHashCode()` use karte hain equality/uniqueness determine karne ke liye, `==` operator ko directly nahi consider karte. Agar `==` custom logic use kare (jaise value-based equality) lekin `Equals()`/`GetHashCode()` default (reference-based) rehta hai, do 'equal-by-==' objects HashSet me alag entries ban sakte hain — jo surprising, hard-to-debug bugs deta hai. Isliye jab bhi `==` overload karo, `Equals()`/`GetHashCode()` ko bhi same logic se consistently override karna chahiye.",
    redFlag: "== overload karna aur Equals()/GetHashCode() ko touch hi na karna — ye ek classic interview red-flag hai.",
  },
  {
    id: "indexer-op-tr-4",
    question: "Kya `+` operator ek class ke liye overload kiya ja sakta hai jahan `+` ka koi obvious meaning na ho? Kya ye achha practice hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Technically possible hai, lekin bad practice — operator ka meaning surprising ho jaata hai, named methods zyada clear communicate karte hain.",
    detailedAnswer:
      "C# compiler kisi bhi type pe operator overload karne se rokta nahi — `Employee operator +(Employee a, Employee b)` likhna technically valid hai. Lekin ye code readability ko hurt karta hai kyunki `+` ka domain me koi natural, self-evident meaning nahi hai — reader ko implementation dekhni padegi ye samajhne ke liye ki `employee1 + employee2` actually kya karta hai. Best practice: operator overloading sirf tab jab meaning genuinely obvious/natural ho (Money, Vector); warna ek clearly-named method (`MergeWith()`, `CombineTeams()`) use karo.",
  },
  {
    id: "indexer-op-tr-5",
    question: "Ye code kya karega?\n```csharp\nvar settings = new Settings(); // string-keyed indexer\nvar value = settings[\"nonexistent-key\"];\nConsole.WriteLine(value);\n```\n(Settings implementation upar diye TryGetValue-based pattern jaisi hai)",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Prints empty line (null) — TryGetValue-based indexer missing key ke liye default (null) return karta hai, exception nahi.",
    detailedAnswer:
      "Agar indexer `TryGetValue`-based implementation use kar raha hai (upar dikhaya gaya pattern), missing key ke liye ye `null` return karta hai — `Dictionary` ke direct `[]` indexer (jo `KeyNotFoundException` throw karta) se deliberately alag behavior. Design choice depend karti hai use-case pe — settings jaisi optional-lookup jagah `null` return karna often better hai exception throw karne se.",
  },
  {
    id: "indexer-op-tr-6",
    question: "Indexer ke andar heavy computation ya database call daalna kyun problematic ho sakta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Callers `[]` syntax se lightweight, fast access expect karte hain (array-jaisi) — indexer ke andar heavy logic ye expectation violate karta hai, unexpected performance issues laa sakta hai.",
    detailedAnswer:
      "`obj[key]` syntax visually ek property/array access jaisa dikhta hai — callers naturally assume karte hain ye O(1)-ish, side-effect-free operation hai, jaise `array[i]` ya `dict[key]`. Agar ek indexer ke andar database call, network request, ya heavy computation ho, caller ko koi visual cue nahi milta ki ye operation expensive ho sakta hai — ye leads to accidental performance issues (jaise ek loop me repeatedly ek 'cheap-looking' indexer call karna jo actually har baar DB hit karta hai).",
    redFlag: "Indexer ke getter/setter me I/O ya heavy computation daalna bina documentation/naming se caller ko warn kiye.",
  },
  {
    id: "indexer-op-tr-7",
    question: "Kya operator overloading `static` methods hain? Ye kaise call hoti hain internally?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Haan — `operator +` jaisi declaration ek static method hai; `a + b` compile-time pe `Type.operator+(a, b)` call me resolve hoti hai.",
    detailedAnswer:
      "`public static Money operator +(Money a, Money b)` ek regular static method hai, bas special `operator` keyword syntax ke saath declared. Jab compiler `a + b` dekhta hai jahan `a`/`b` `Money` type ke hain, wo is static method ko call karne ke liye resolve karta hai — bilkul waisa hi jaise extension methods `obj.Method()` ko `Class.Method(obj)` me resolve karte hain. Ye poora feature compile-time syntactic convenience hai.",
  },
  {
    id: "indexer-op-tr-8",
    question: "`>=` operator overload karne ke liye kya `>` aur `==` dono overload karna mandatory hai compiler dwara?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — `==`/`!=` pair strictly mandatory hai, lekin comparison operators (`<`/`>`/`<=`/`>=`) ka pairing convention hai (`<` ke saath `>` expected), compiler hard-enforce nahi karta unhe.",
    detailedAnswer:
      "C# compiler strictly sirf `==`/`!=` ko pair-mandatory banata hai — ek overload karo to doosra bhi likhna padega, warna compile error. Comparison operators (`<`, `>`, `<=`, `>=`) ke liye koi hard compiler-enforcement nahi hai ki sab chaaron ek saath overload karo, lekin ye strongly expected convention hai — sirf `<` overload karke `>` chhod dena confusing, inconsistent API deta hai. Best practice: agar comparison semantics chahiye, `IComparable<T>` implement karo aur consistently saare relevant operators overload karo.",
    redFlag: "Sirf ek comparison operator (jaise <) overload karna aur baaki (>, <=, >=) ko chhod dena — asymmetric, confusing API.",
  },
];

export default questions;
