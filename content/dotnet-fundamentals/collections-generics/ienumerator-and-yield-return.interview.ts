import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "yield-return-tr-1",
    question: "`yield return` kya karta hai aur compiler internally kaise ise implement karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon"],
    shortAnswer: "Lazy, on-demand sequence generation. Compiler method ko ek hidden `IEnumerator<T>`-implementing state-machine class me rewrite karta hai.",
    detailedAnswer:
      "`yield return X` execution ko pause kar deta hai us line pe, `X` ko current value bana deta hai, aur control caller ko wapas de deta hai. Agla `MoveNext()` call exactly wahin se resume hota hai. Compiler ye behavior implement karne ke liye poore method ko ek hidden class me transform karta hai jo `IEnumerator<T>` implement karti hai — local variables class-level fields ban jaate hain (state ko survive karna hai pauses ke beech), aur ek internal state-tracking integer decide karta hai `MoveNext()` call pe kahan se resume karna hai.",
    followUp: "Ye async/await ke mechanism se kaise related hai?",
  },
  {
    id: "yield-return-tr-2",
    question: "Ek Fibonacci sequence generator likho `yield return` use karke jo pehli N numbers de.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer: "`while (true) { yield return a; (a, b) = (b, a + b); }` — infinite generator, `.Take(n)` se consume karo.",
    detailedAnswer:
      "```csharp\nIEnumerable<long> Fibonacci()\n{\n    long a = 0, b = 1;\n    while (true)\n    {\n        yield return a;\n        (a, b) = (b, a + b);\n    }\n}\n\nvar firstTen = Fibonacci().Take(10).ToList();\n```\nMethod genuinely infinite hai, lekin safe hai kyunki lazy hai — `Take(10)` sirf 10 `MoveNext()` calls karega, phir enumeration ruk jaayegi. Poori infinite sequence kabhi memory me nahi hoti.",
  },
  {
    id: "yield-return-tr-3",
    question: "5GB ki ek log file line-by-line process karni hai bina poori file memory me load kiye. `yield return` isme kaise help karega?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ek `IEnumerable<string>` method banao jo `StreamReader` se ek-ek line padhe aur `yield return line;` kare — is tarah har time sirf ek line memory me hoti hai, poori file nahi.",
    detailedAnswer:
      "```csharp\nIEnumerable<string> ReadLines(string path)\n{\n    using var reader = new StreamReader(path);\n    string? line;\n    while ((line = reader.ReadLine()) != null)\n    {\n        yield return line;\n    }\n}\n```\nIsse `foreach (var line in ReadLines(path))` consume karne par, ek time pe sirf ek line memory me load hoti hai — poori 5GB file kabhi ek saath memory me nahi aati, jabki `File.ReadAllLines()` poori file pehle load karta hai, jo out-of-memory issues de sakta hai bade files ke liye.",
  },
  {
    id: "yield-return-tr-4",
    question: "Ye code kya karega?\n```csharp\nIEnumerable<int> GetItems()\n{\n    yield return 1;\n    throw new InvalidOperationException();\n    yield return 2;\n}\n\nvar items = GetItems();\nConsole.WriteLine(\"Got iterator\");\nvar first = items.First();\nConsole.WriteLine(\"After first\");\nvar second = items.Skip(1).First();\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "'Got iterator' print hoga, phir 'After first' print hoga (exception abhi nahi aayi), aur `second` line pe exception throw hoga jab enumeration us point tak pahunchegi.",
    detailedAnswer:
      "`GetItems()` call sirf ek lazy iterator return karta hai, koi code turant nahi chalta — 'Got iterator' print hota hai bina kisi exception ke. `items.First()` internally ek naya enumeration shuru karta hai, `MoveNext()` call hota hai, jo `1` tak pahunchta hai (`yield return 1`) aur ruk jaata hai — `first = 1`, koi exception abhi tak nahi aayi (throw line abhi nahi chali). 'After first' print hoga. Phir `items.Skip(1).First()` ek NAYI enumeration shuru karta hai (First aur Skip alag calls independent enumerations hain) — is baar `MoveNext()` 1 se aage `throw` line tak pahunchega, aur exception yahan throw hoga.",
  },
  {
    id: "yield-return-tr-5",
    question: "`async`/`await` aur `yield return`/`IEnumerator` ke compiler-generated state machines me kya conceptual similarity hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Dono ek method ko 'pause, exit, resume-from-exact-point-later' pattern me transform karte hain — local state ko class fields me convert karke, aur ek internal position-tracker maintain karke.",
    detailedAnswer:
      "Dono cases me compiler method body ko ek hidden class me rewrite karta hai jisme local variables class-level fields ban jaate hain (state ko survive karna hai method ke 'exit' hone ke baad bhi), aur ek internal integer state track karta hai ki last pause kahan tha. `yield return` synchronous 'pause and give a value' ke liye hai (`MoveNext()` driven), `await` asynchronous 'pause until an operation completes' ke liye hai (continuation callback driven). Mechanism conceptually parallel hai, purpose alag hai.",
    followUp: "Async state machine me exceptions kaise propagate hoti hain compared to yield return methods me?",
  },
  {
    id: "yield-return-tr-6",
    question: "Kya ek `yield return` method me plain `return 5;` (koi value ke saath) likha ja sakta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — jis method me `yield return` hai, wo automatically ek iterator method ban jaata hai, aur usme value-returning `return` allowed nahi hai, sirf `yield break` (ya value-less `return;`) sequence end karne ke liye.",
    detailedAnswer:
      "Ek method jisme kahin bhi `yield return` (ya `yield break`) hai, C# compiler use ek 'iterator method' treat karta hai — poore method ki semantics badal jaati hai. Aise method me `return value;` (koi actual value ke saath) compile error dega, kyunki method ka return type effectively `IEnumerable<T>`/`IEnumerator<T>` hai, `T` nahi — sequence ko 'khatam' karna ho to `yield break;` (ya bina value ke `return;`) use karna padta hai.",
    redFlag: "Ye assume karna ki yield return aur normal return ek method me freely mix ho sakte hain jaisa normal C# me hota hai.",
  },
  {
    id: "yield-return-tr-7",
    question: "Ek generic tree structure traverse karke sab leaf nodes lazily return karne hain. `yield return` ka use kaise karoge?",
    type: "coding",
    difficulty: "advanced",
    shortAnswer: "Ek recursive iterator method banao jo har child ko traverse kare aur `yield return` foreach child ke recursive call ke results pe (`foreach (var leaf in TraverseLeaves(child)) yield return leaf;`).",
    detailedAnswer:
      "```csharp\nIEnumerable<T> TraverseLeaves<T>(TreeNode<T> node)\n{\n    if (node.Children.Count == 0)\n    {\n        yield return node.Value;\n        yield break;\n    }\n    foreach (var child in node.Children)\n    {\n        foreach (var leaf in TraverseLeaves(child))\n        {\n            yield return leaf;\n        }\n    }\n}\n```\nYe recursive lazy traversal hai — poori tree kabhi ek saath memory me materialize nahi hoti, leaves ek-ek karke on-demand yield hoti hain jaise caller unhe consume karta hai.",
  },
  {
    id: "yield-return-tr-8",
    question: "LINQ ka `Where()` method internally `yield return` kaise use karta hai, aur ye deferred execution se kaise connect hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`Where()` ka conceptual implementation ek `yield return` iterator hai — jab tak result enumerate na ho, koi filtering nahi hoti. Ye LINQ ke deferred-execution model ka underlying mechanism hai.",
    detailedAnswer:
      "`Enumerable.Where<T>` conceptually kuch is tarah implement hota hai: `foreach (var item in source) { if (predicate(item)) yield return item; }`. Isi lazy generation ki wajah se `var filtered = list.Where(x => x > 5);` call karne se turant koi filtering nahi hoti — filtering sirf tab hoti hai jab `filtered` ko actually enumerate kiya jaaye (`foreach`, `.ToList()`, etc.). Ye exactly wo 'deferred execution' hai jo LINQ ki ek defining characteristic hai, aur `yield return` hi iska underlying implementation mechanism hai.",
  },
];

export default questions;
