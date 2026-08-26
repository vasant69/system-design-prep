import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "quantifiers-tr-1",
    question: "`Where` aur `TakeWhile` me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer: "Where poori sequence scan karke SAB matching elements deta hai; TakeWhile pehli non-matching element pe permanently ruk jaata hai.",
    detailedAnswer:
      "`Where(predicate)` poori sequence ko traverse karta hai aur har element check karta hai — jo bhi predicate satisfy kare, wo result me shamil hota hai, chahe wo sequence me kahin bhi ho. `TakeWhile(predicate)` sequence ko start se process karta hai aur PEHLI baar predicate false hone par turant, permanently ruk jaata hai — us point ke aage ke elements, chahe wo predicate satisfy karte hon, kabhi check hi nahi hote. Isliye `{1,2,3,10,4,5}.Where(n => n < 5)` = `{1,2,3,4}` lekin `{1,2,3,10,4,5}.TakeWhile(n => n < 5)` = `{1,2,3}`.",
    followUp: "Kis scenario me TakeWhile genuinely useful hota hai jahan Where nahi?",
  },
  {
    id: "quantifiers-tr-2",
    question: "Ek empty list par `All(predicate)` call karne se kya result milega, aur ye kyun surprising lag sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "true — vacuous truth ki wajah se. Surprising isliye lagta hai kyunki intuitively lagta hai 'koi element hi nahi hai to condition kaise satisfy hui', lekin logically 'koi bhi element violate nahi karta' isliye true hai.",
    detailedAnswer:
      "`All()` mathematically 'for all elements, predicate holds' check karta hai. Jab sequence empty hai, 'for all' condition vacuously satisfied ho jaati hai — koi counter-example (koi element jo predicate fail kare) exist hi nahi karta. Ye standard logic ka rule hai (vacuous truth), aur .NET isko consistently follow karta hai. Practical impact: agar business logic assume kar rahi hai empty-list case `false` dega, ye ek silent bug ban sakta hai — 'koi bhi item out-of-stock nahi hai' jaisi flag empty search result par bhi `true` dikha sakti hai.",
    redFlag: "'All() empty list par false dega kyunki koi elements hi nahi' bolna — ye galat hai, .NET ka actual behavior vacuous-truth follow karta hai.",
  },
  {
    id: "quantifiers-tr-3",
    question: "Pagination implement karni hai — page number aur pageSize diye gaye hain. LINQ query kaise likhoge, aur EF Core ke saath ye kaise translate hoti hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "query.OrderBy(...).Skip((page - 1) * pageSize).Take(pageSize) — EF Core ke saath ye SQL OFFSET/FETCH (ya LIMIT/OFFSET) me translate hoti hai, database-side hi sirf relevant rows fetch hoti hain.",
    detailedAnswer:
      "Standard formula: `Skip((pageNumber - 1) * pageSize).Take(pageSize)`, hamesha `OrderBy` ke baad (bina consistent ordering ke, pagination ka result deterministic nahi hota). `IQueryable` (EF Core `DbSet`) ke saath, ye poora expression SQL Server ke `OFFSET ... FETCH NEXT ... ROWS ONLY` (ya provider-specific equivalent, jaise PostgreSQL ka `LIMIT`/`OFFSET`) me translate hota hai — matlab sirf current page ki rows database se fetch hoti hain, poori table memory me nahi aati.",
  },
  {
    id: "quantifiers-tr-4",
    question: "`Distinct()` ek custom class (`Product`) ki list par call kiya gaya, lekin duplicates remove nahi hue jabki unka data identical tha. Kya galat ho sakta hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Product class ne Equals/GetHashCode override nahi kiya — bina override ke, reference equality use hoti hai, isliye same-data-alag-object instances unequal maane jaate hain.",
    detailedAnswer:
      "`Distinct()` (aur `Union`/`Intersect`/`Except`) default `Object.Equals`/`GetHashCode` use karte hain jab tak type khud inhe override na kare ya ek custom `IEqualityComparer<T>` overload me pass na kiya jaaye. Reference types ke liye default `Equals` REFERENCE equality hai — do alag heap objects, chahe unke property values identical hon, unequal honge. Fix: `Product` class me `Equals`/`GetHashCode` ko meaningful business-key (jaise `Id`) ke basis par override karo, ya `Distinct(IEqualityComparer<Product>)` overload use karo.",
  },
  {
    id: "quantifiers-tr-5",
    question: "`Any()` (bina predicate) aur `Count() > 0` me practical fark kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Any() pehla element milte hi short-circuit ho jaata hai; Count() poori sequence enumerate karta hai exact count ke liye — Any hamesha existence-check ke liye behtar hai.",
    detailedAnswer:
      "`sequence.Any()` internally sirf enumerator ka pehla `MoveNext()` call check karta hai — agar kuch bhi mila, turant `true` return, aage enumerate nahi karta. `sequence.Count() > 0` (jab sequence `ICollection` na ho aur count cached na ho) poori sequence traverse karta hai exact count nikalne ke liye, phir usse `0` se compare karta hai — bade ya deferred (lazy, database-backed) sequences ke liye ye unnecessary extra kaam hai. `Any()` isliye idiomatic aur zyada efficient choice hai simple existence checks ke liye.",
  },
  {
    id: "quantifiers-tr-6",
    question: "`Union`, `Intersect`, aur `Except` teeno set operations me kya semantic fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Union = dono sequences ke sab unique elements combined. Intersect = sirf dono me common elements. Except = pehli sequence me hai lekin doosri me nahi.",
    detailedAnswer:
      "Agar `A = {1,2,3,4}` aur `B = {3,4,5,6}`: `A.Union(B)` = `{1,2,3,4,5,6}` (dono ke sab unique elements, duplicates removed). `A.Intersect(B)` = `{3,4}` (sirf jo dono me hain). `A.Except(B)` = `{1,2}` (A me hai, B me nahi — ye asymmetric hai, `B.Except(A)` different result dega: `{5,6}`). Teeno mathematical set theory ke operations hain, aur equality comparison ke liye same rules follow karte hain (default `Equals`/`GetHashCode` ya custom comparer).",
  },
  {
    id: "quantifiers-tr-7",
    question: "Ek search API me `products.All(p => p.InStock)` use karke ek 'sab items in stock' badge set kiya gaya, lekin empty search results par bhi badge `true` dikh raha tha. Root cause aur fix?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Root cause: All() empty sequence par vacuously true return karta hai. Fix: products.Any() && products.All(p => p.InStock)",
    detailedAnswer:
      "Jab search result genuinely empty tha (koi matching product hi nahi), `products.All(p => p.InStock)` vacuous truth ki wajah se `true` return kar raha tha — koi element hi nahi tha jo condition violate kare. UI is `true` ko 'sab in stock hain' samajh kar galat badge dikha raha tha. Fix seedha hai: pehle explicitly check karo ki list empty nahi hai — `products.Any() && products.All(p => p.InStock)` — taaki empty-case ke liye badge `false` (ya hide) ho jaaye, meaningful sirf tab `true` ho jab genuinely kuch products hon aur sab in-stock hon.",
    redFlag: "All() ko empty-safe assume karna bina explicitly Any() check kiye — ye bahut common, silent production bug hai.",
  },
  {
    id: "quantifiers-tr-8",
    question: "`Skip` aur `SkipWhile` me kya fark hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Skip(n) count-based hai — hamesha exactly n elements chhodta hai. SkipWhile(predicate) condition-based hai — jab tak condition true rahe tab tak chhodta hai, pehli false milte hi rukta hai aur baaki sab return kar deta hai chahe wo phir se condition satisfy karein.",
    detailedAnswer:
      "`Skip(3)` hamesha pehle 3 elements chhod deta hai, chahe unki value kuch bhi ho — ye purely position-based hai. `SkipWhile(n => n < 5)` elements ko tab tak chhodta hai jab tak `n < 5` true rahe — jaise hi ek element mile jiske liye ye false ho (jaise `10`), `SkipWhile` wahin se lekar sequence ke AAKHIR tak sab kuch return kar deta hai, chahe aage phir se `n < 5` wale elements hon. Ye same asymmetry hai jo `Take` vs `TakeWhile` me hai — count-based operators position se driven hain, `While` variants condition se, aur ek baar condition false ho jaaye to `TakeWhile`/`SkipWhile` apna decision permanently lock kar dete hain.",
  },
];

export default questions;
