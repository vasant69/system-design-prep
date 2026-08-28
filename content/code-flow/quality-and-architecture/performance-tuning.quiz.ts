import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "performance-tuning-1",
    question:
      "`GET /api/employees` 1.2 second le raha hai. Team ne bina profiler chalaye SQL Server ko bada instance diya aur indexes add kiye — 1.1 second. `dotnet-trace` chalane par kya seekh milti hai is approach se?",
    options: [
      "Ki indexes hamesha bekaar hote hain read endpoints ke liye",
      "Ki bottleneck DB me nahi tha (shayad serialization ya over-fetched object graph me) — bina measure kiye kiya gaya fix aksar galat jagah pe hota hai; pehle profile karo, phir ek targeted fix",
      "Ki 1.2s se 1.1s ek acceptable improvement hai aur aage kuch karne ki zaroorat nahi",
      "Ki `dotnet-trace` sirf production me chal sakta hai, local par nahi",
    ],
    correctIndex: 1,
    explanation:
      "Core lesson: measure first, don't guess. DB upgrade + indexes se sirf 100ms bachna signal hai ki asli time kahin aur ja raha hai — aksar JSON serialization of an over-fetched graph (poora `Department` + circular navigation). `dotnet-trace` ka CPU flame-graph exact method dikha deta hai. Sahi fix aksar ek `Select` projection DTO hota hai jo 5 fields laata hai — 1.2s se 80ms. Indexes filter/sort columns pe useful hote hain, bekaar nahi; par woh yahan bottleneck nahi tha. `dotnet-trace` local par bhi chalta hai.",
    difficulty: "medium",
  },
  {
    id: "performance-tuning-2",
    question:
      "`AsNoTracking()` ke baare me kaunsa statement sahi hai?",
    options: [
      "Ise har EF Core query par lagana chahiye, read ho ya write — hamesha tez hota hai",
      "Read-only queries par change tracking off karke CPU/memory bachata hai; par jis query ka result baad me update karke `SaveChanges` karna hai us par lagane se changes silently persist nahi honge",
      "Ye query result ko encrypt karta hai taaki cache safe rahe",
      "Ye sirf `IQueryable` ko `IEnumerable` me convert karta hai, performance par koi asar nahi",
    ],
    correctIndex: 1,
    explanation:
      "Default me EF Core har returned entity ka snapshot rakhta hai taaki `SaveChanges` par diff nikaal sake. Read-only endpoint ko iski zaroorat nahi — `AsNoTracking()` snapshot skip karta hai, kam memory aur CPU, badi result sets par 10-30% tak. Lekin agar tum entity ko modify karke `SaveChanges` karoge aur query par `AsNoTracking()` laga hai, to EF ke paas woh entity tracked hi nahi — change detect nahi hoga, update chup-chaap gum. Isliye update paths par tracking rehne do.",
    difficulty: "medium",
  },
  {
    id: "performance-tuning-3",
    question:
      "Page 800 (`Skip(15980).Take(20)`) bahut slow hai jabki page 1 fast hai. Wajah aur behtar approach?",
    options: [
      "Wajah: `Take(20)` chhota hai; `Take(200)` karo taaki round-trips kam hon",
      "Wajah: DB ko pehle saari 15980 skipped rows read/discard karni padti hain — jitna deep page, utna kaam. Behtar: keyset (seek) pagination — `Where(e => e.Id > lastSeenId).OrderBy(e => e.Id).Take(size)`, jo index seek karta hai aur har page par roughly constant",
      "Wajah: EF Core `Skip` support nahi karta; raw SQL likhni padegi",
      "Wajah: connection pool exhaust ho gaya; `poolSize` badhao",
    ],
    correctIndex: 1,
    explanation:
      "Offset pagination (`Skip().Take()`) me DB ko offset tak ki saari rows produce karke discard karni padti hain, isliye cost page depth ke saath linear badhti hai. Keyset/seek pagination last-seen key se aage index par seek karta hai (`WHERE Id > @lastSeenId ORDER BY Id`), to har page roughly constant time. Trade-off: arbitrary page number par jump nahi, sirf next/prev. `Take` size badhane se problem thodi shift hoti hai, khatam nahi. EF Core `Skip` support karta hai. Pool exhaustion ka alag symptom hota hai.",
    difficulty: "hard",
  },
  {
    id: "performance-tuning-4",
    question:
      "`IMemoryCache` se `Department` reference data cache kiya. Baad me API 4 instances par scale hui. Kya problem aa sakti hai aur production approach kya hai?",
    options: [
      "Koi problem nahi — `IMemoryCache` automatically saare instances me sync ho jaata hai",
      "`IMemoryCache` per-instance/in-process hota hai — 4 instances = 4 alag copies; ek instance par department add/invalidate karo to baaki 3 stale reh jaate hain. Multi-instance + coordinated invalidation ke liye Redis `IDistributedCache` (shared store, network + serialization cost)",
      "Problem ye ki `IMemoryCache` thread-safe nahi hai; `lock` lagana padega",
      "Problem ye ki `IMemoryCache` ka data disk par likhta hai aur disk bhar jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`IMemoryCache` process ki memory me rehta hai, isliye har API instance ka apna alag cache hota hai. Single instance ya truly static data ke liye ye perfect hai — fast, koi network hop nahi. Multi-instance par ek jagah invalidate karne se baaki stale ho jaate hain; tab `IDistributedCache` (Redis) — ek shared store, invalidation ek jagah — par har read/write par network round-trip aur serialization cost. Rule: simplest pehle (`IMemoryCache`), Redis tab jab multi-instance coordination chahiye. `IMemoryCache` thread-safe hai; disk par kuch nahi likhta.",
    difficulty: "hard",
  },
];

export default quiz;
