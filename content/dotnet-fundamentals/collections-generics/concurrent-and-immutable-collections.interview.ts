import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "concurrent-immutable-tr-1",
    question: "Concurrent collections aur immutable collections dono thread safety dete hain — inke approach me kya fundamental fark hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "TCS"],
    shortAnswer:
      "Concurrent collections mutation ko safely allow karte hain (locking/lock-free algorithms se); immutable collections mutation ko hone hi nahi dete — kabhi change nahi hote, isliye safety automatic hai.",
    detailedAnswer:
      "`System.Collections.Concurrent` (ConcurrentDictionary, ConcurrentQueue, etc.) internally fine-grained locking ya lock-free (Interlocked) techniques use karke multiple threads ko safely read/write karne dete hain — mutation ho rahi hai, bas safely coordinate ki jaati hai. `System.Collections.Immutable` (ImmutableList, ImmutableArray) ek bilkul alag approach leta hai — collection ek baar create hone ke baad kabhi mutate hi nahi hoti, koi 'mutation' operation ek naya collection return karta hai. Isliye thread safety automatic hai — agar kuch change hi nahi ho sakta, race condition ka sawaal hi nahi uthta.",
    followUp: "Kis scenario me immutable collection concurrent collection se better choice hai?",
  },
  {
    id: "concurrent-immutable-tr-2",
    question: "Ye code kya karega?\n```csharp\nvar cache = new ConcurrentDictionary<string, int>();\ncache.AddOrUpdate(\"count\", 1, (key, old) => old + 1);\ncache.AddOrUpdate(\"count\", 1, (key, old) => old + 1);\nConsole.WriteLine(cache[\"count\"]);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "2 — pehli call me key exist nahi karti to 1 add hota hai, doosri call me key already exist karti hai to update-factory chalta hai (1 + 1 = 2).",
    detailedAnswer:
      "`AddOrUpdate(key, addValue, updateFactory)` — pehli baar 'count' key exist nahi karti, isliye `addValue` (1) insert hota hai. Doosri baar key exist karti hai (value 1), isliye `updateFactory` call hota hai jo `old + 1 = 2` return karta hai aur ye naya value store ho jaata hai. Final output `2` hai.",
  },
  {
    id: "concurrent-immutable-tr-3",
    question: "Ek high-traffic in-memory cache banana hai jise sainkdon threads simultaneously read/write karenge, alag-alag keys pe. Kaunsa collection choose karoge aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`ConcurrentDictionary<TKey,TValue>` — fine-grained locking se alag keys pe simultaneous writes bina blocking ke chal sakte hain, aur `GetOrAdd`/`AddOrUpdate` atomic composite operations dete hain.",
    detailedAnswer:
      "Plain `Dictionary` + single `lock` poore collection ko serialize kar dega — chahe threads alag-alag, unrelated keys pe kaam kar rahe hon, sab ek dusre ko block karenge. `ConcurrentDictionary` internally bucket-groups pe fine-grained locks maintain karta hai, isliye alag keys pe writes largely parallel chal sakte hain. Iske atomic `GetOrAdd`/`AddOrUpdate` methods bhi cache-population jaisa common pattern manually check-then-act likhne se zyada safe banate hain.",
  },
  {
    id: "concurrent-immutable-tr-4",
    question: "`ConcurrentBag<T>` ko FIFO queue ki tarah use karna chahte ho — ye sahi choice hai kya?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — `ConcurrentBag<T>` unordered hai, koi FIFO/LIFO guarantee nahi deta. Ordering chahiye to `ConcurrentQueue<T>` sahi choice hai.",
    detailedAnswer:
      "`ConcurrentBag<T>` specifically un scenarios ke liye optimize kiya gaya hai jahan ordering matter nahi karti, aur jo thread item add karta hai wahi usually use retrieve bhi karta hai (per-thread local storage optimization). Isse FIFO/LIFO order expect karna galat hai — items kisi bhi order me nikal sakte hain. Ordering guarantee chahiye to `ConcurrentQueue<T>` (FIFO) hi sahi tool hai.",
    redFlag: "'Bag' naam dekh kar bhi ordering assume kar lena — naming se collection ke actual guarantees samajhna zaroori hai, na ki assume karna.",
  },
  {
    id: "concurrent-immutable-tr-5",
    question: "Ye code kya print karega?\n```csharp\nImmutableList<int> a = ImmutableList.Create(1, 2);\nImmutableList<int> b = a.Add(3);\nConsole.WriteLine($\"{a.Count}, {b.Count}\");\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "\"2, 3\" — `a` unchanged rehta hai, `Add` ek naya list `b` return karta hai jisme 3 elements hain.",
    detailedAnswer:
      "Immutable collections kabhi mutate nahi hoti. `a.Add(3)` `a` ko modify nahi karta — ek naya `ImmutableList<int>` (`b`) return karta hai jisme original ke 2 elements plus naya `3` hai. `a` apni original 2-element state me hi rehta hai. Output: `2, 3`.",
  },
  {
    id: "concurrent-immutable-tr-6",
    question: "`BlockingCollection<T>` ka `Add()` method kab block hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Jab `BoundedCapacity` set ho aur collection us capacity tak already full ho — tab tak `Add()` wait karta hai jab tak koi item consume na ho jaaye.",
    detailedAnswer:
      "`BlockingCollection<T>` optionally ek `BoundedCapacity` le sakta hai constructor me. Agar ye set hai aur collection full hai, `Add()` block ho jaata hai jab tak koi consumer thread ek item `Take()` na kar le, capacity me jagah na bane. Ye backpressure mechanism hai — producer ko fast se fast items generate karne se rokta hai agar consumer utni fast process nahi kar pa raha, memory ko unbounded grow hone se bachata hai.",
  },
  {
    id: "concurrent-immutable-tr-7",
    question: "Ek fraud-rules cache hai jo har 5 minute refresh hoti hai aur sainkdon threads isse sirf READ karte hain. Refresh ke beech me bhi readers ko consistent snapshot chahiye. `ConcurrentDictionary` ya `ImmutableList` — kaunsa better fit hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "`ImmutableList<Rule>` — reads bina kisi locking ke ho sakte hain, aur refresh ek naya snapshot atomically swap karta hai bina readers ko torn-state dikhaye.",
    detailedAnswer:
      "Ye read-heavy, infrequent-write scenario hai — bilkul jahan immutable collections shine karte hain. Refresh operation ek naya `ImmutableList<Rule>` banata hai (existing readers unaffected rehte hain unki purani reference ke through) aur phir ek single reference ko atomically swap kar deta hai (jaise `Interlocked.Exchange` ya `volatile` field assignment). Sab reader threads bina kisi lock ke apni consistent snapshot padhte hain — refresh operation ke beech me bhi koi 'half-updated' state kabhi visible nahi hota, kyunki purana list tab tak intact rehta hai jab tak reference switch nahi ho jaata.",
    followUp: "Agar isi scenario me writes bhi frequent hote (jaise per-second), tab bhi ImmutableList sahi choice rehta?",
  },
  {
    id: "concurrent-immutable-tr-8",
    question: "Kya `ConcurrentDictionary` use karne ke baad bhi manually `lock` lagana chahiye 'extra safety' ke liye?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — ye unnecessary hai aur performance benefit khatam kar deta hai jiske liye `ConcurrentDictionary` choose kiya gaya tha.",
    detailedAnswer:
      "`ConcurrentDictionary` andar se already thread-safe hai — iske individual operations (Add, TryGetValue, GetOrAdd, etc.) atomic guarantees ke saath design kiye gaye hain. Upar se manually `lock` lagana redundant hai aur `ConcurrentDictionary` ki fine-grained locking ka poora fayda khatam kar deta hai — ab poora collection ek coarse `lock` ke peeche serialize ho raha hai, jaisa plain `Dictionary` + `lock` karta. Exception: agar tumhe MULTIPLE operations ko ek single atomic unit ki tarah treat karna hai (jaise 'do related keys ko ek saath update karo'), tab bhi bahar se `lock` chahiye ho sakta hai — lekin single-operation cases me ye pure overhead hai.",
    redFlag: "'Extra safety ke liye' ka justification dena bina samjhe ki collection already what guarantees deta hai — ye batata hai concurrency primitives ki depth samajh nahi hai.",
  },
];

export default questions;
