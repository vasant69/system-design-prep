import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "builtin-tr-1",
    question: "`NullReferenceException` exactly kab throw hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Wipro", "Capgemini"],
    shortAnswer: "Jab ek null reference (koi reference type variable jo null hai) ko dereference kiya jaaye — uski property/method access ki jaaye.",
    detailedAnswer: "`NullReferenceException` tab aata hai jab code ek `null` reference type value ke member (property, method, field) ko access karne ki koshish karta hai — jaise `string name = null; name.Length`. Ye .NET ki historically sabse common runtime exception rahi hai kyunki reference types default hi null ho sakte hain, aur pehle compiler kabhi warn nahi karta tha (ab Nullable Reference Types se compile-time warning milti hai, lekin runtime behavior same hi hai).",
  },
  {
    id: "builtin-tr-2",
    question: "`double` division by zero aur `int` division by zero ke behavior me kya fark hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Integer division by zero `DivideByZeroException` throw karta hai. Double/float division by zero `Infinity`/`NaN` return karta hai, koi exception nahi.",
    detailedAnswer: "`int a = 10 / 0;` runtime pe `DivideByZeroException` throw karta hai. `double x = 10.0 / 0.0;` IEEE 754 floating-point standard follow karta hai — koi exception nahi, result `Infinity` hota hai (ya `NaN` agar numerator bhi 0.0 ho). Ye behavior difference floating-point standard se aata hai — integer arithmetic me 'infinity' ka koi representable concept nahi hai, isliye CLR exception throw karta hai; floating point me `Infinity`/`NaN` valid, representable values hain.",
    followUp: "Agar tumhe `float`/`double` calculation me `NaN` result mile, use kaise detect karoge?",
    redFlag: "'Har division by zero exception deta hai' bolna, floating-point ka special-case behavior na jaante hue.",
  },
  {
    id: "builtin-tr-3",
    question: "`IndexOutOfRangeException` aur `ArgumentOutOfRangeException` me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Dono out-of-range access represent karte hain, lekin `IndexOutOfRangeException` raw array access ke liye hai, `ArgumentOutOfRangeException` collections (`List<T>`) aur APIs apni parameter validation ke liye use karte hain.",
    detailedAnswer: "`int[] arr = {1,2,3}; arr[10]` throws `IndexOutOfRangeException` — ye CLR-level array bounds check hai. `List<int> list = new() {1,2,3}; list[10]` throws `ArgumentOutOfRangeException` — kyunki `List<T>` ka indexer apna explicit parameter validation karta hai jo `ArgumentOutOfRangeException` throw karta hai, na ki underlying array ka raw `IndexOutOfRangeException` leak hone deta. Ye distinction .NET BCL design guidelines me explicit hai.",
  },
  {
    id: "builtin-tr-4",
    question: "Ye code kya throw karega?\n```csharp\nvar emptyList = new List<int>();\nvar first = emptyList.First();\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "`InvalidOperationException` — \"Sequence contains no elements\".",
    detailedAnswer: "`Enumerable.First()` (bina predicate) ek empty sequence pe `InvalidOperationException` throw karta hai, kyunki 'first element' ek empty sequence me exist hi nahi karta — object (sequence) apni current state (empty) me ye operation support nahi karta, jo bilkul `InvalidOperationException` ka classic use case hai. `FirstOrDefault()` safer alternative hai jo empty sequence pe default value (jaise `0` for int) return karta hai, exception nahi.",
    followUp: "`Single()` aur `First()` ke behavior me kya fark hai jab collection me multiple elements hon?",
  },
  {
    id: "builtin-tr-5",
    question: "Production code me user-provided string ko integer me convert karna hai. `int.Parse` ya `int.TryParse` — kaunsa use karoge aur kyun?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer: "`int.TryParse` — kyunki invalid user input ek expected, common case hai, exception ke through control flow handle karna anti-pattern hai.",
    detailedAnswer: "`int.TryParse` `bool` return karta hai success/failure ke liye, `out` parameter me parsed value deta hai, kabhi exception throw nahi karta. User input jaise scenarios me invalid data aana genuinely expected hai (typo, empty field, wrong format) — ye 'exceptional' condition nahi hai, ye ek normal branch hai jo handle karna hai. `int.Parse` use karna yahan exceptions ko control flow ke liye use karne jaisa hai, jo perf-wise bhi expensive hai (stack trace capture) aur code flow ko obscure karta hai.",
  },
  {
    id: "builtin-tr-6",
    question: "`ArgumentNullException` throw karte waqt `nameof(parameter)` kyun use karte hain hardcoded string ke bajaye?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Refactor-safety — parameter ka naam change hone par `nameof` automatically update ho jaata hai, hardcoded string manually update karni padti.",
    detailedAnswer: "`throw new ArgumentNullException(\"input\")` me agar parameter ka naam `input` se `data` rename ho jaaye, string hardcoded rehti hai aur exception message misleading ho jaata hai. `throw new ArgumentNullException(nameof(input))` compile-time constant hai jo actual parameter identifier se derive hota hai — rename karne par compiler khud force karega ki `nameof` bhi update ho (ya IDE rename-refactor automatically handle kar dega).",
  },
  {
    id: "builtin-tr-7",
    question: "Ye code kya throw karega?\n```csharp\nobject value = DBNull.Value;\nstring s = (string)value;\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "`InvalidCastException` — `DBNull.Value` ek special object hai, `string` nahi, direct cast fail hoga.",
    detailedAnswer: "`DBNull.Value` .NET ka ek special singleton hai jo database NULL represent karta hai — ye `string` (ya koi bhi real type) nahi hai, apna khud ka type `DBNull` hai. Isko `string` me direct cast karne ki koshish `InvalidCastException` deti hai. ADO.NET code me is wajah se `reader.IsDBNull(columnIndex)` check karna zaroori hota hai before casting a column value.",
  },
  {
    id: "builtin-tr-8",
    question: "`InvalidOperationException` itna 'generic' kyun hai — ye exactly kab use karna chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Jab ek object apni CURRENT STATE me ek operation support nahi karta — state-dependent failure, invalid input ka issue nahi.",
    detailedAnswer: "`InvalidOperationException` tab appropriate hai jab problem input value ka nahi, object ki current STATE ka ho — jaise ek already-closed connection pe query chalane ki koshish, ek empty collection pe `.First()`, ya ek `IEnumerator` ko modify-hue-collection pe use karna. Ye `ArgumentException` se alag hai — `ArgumentException` tab hai jab specifically ek passed-in parameter invalid ho, `InvalidOperationException` tab hai jab object khud, apni current state ki wajah se, requested operation allow nahi karta.",
  },
];

export default questions;
