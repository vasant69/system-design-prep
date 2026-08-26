import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "change-track-tr-1",
    question: "EF Core ka change tracker kaise kaam karta hai, aur `SaveChanges()` isse kaise use karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft", "TCS", "Amazon"],
    shortAnswer: "Har tracked entity ko ek EntityState (Added/Unchanged/Modified/Deleted/Detached) assign hoti hai; SaveChanges() us state ke basis pe exact SQL generate karta hai.",
    detailedAnswer:
      "EF Core ka `ChangeTracker` har entity jo query se load hoti hai ya `Add()`/`Remove()` se register hoti hai, uske liye original-value snapshot store karta hai aur ek `EntityState` maintain karta hai. Property assignment hone par, current value ko snapshot se compare karke state ko `Modified` mark kar deta hai automatically. `SaveChanges()` call hone par, ye saari tracked entities ko iterate karta hai, unki state dekhta hai, aur appropriate SQL generate karta hai — `Added` → INSERT, `Modified` → UPDATE (sirf changed columns), `Deleted` → DELETE, `Unchanged`/`Detached` → koi SQL nahi.",
    followUp: "UPDATE statement me sirf changed columns kaise include hote hain, poori row nahi?",
  },
  {
    id: "change-track-tr-2",
    question: "`AsNoTracking()` kya karta hai, aur ise kab use karna chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Read-only queries ke liye change tracking overhead skip karta hai — entities Detached state me aati hain, kabhi save nahi ki ja sakti.",
    detailedAnswer:
      "`AsNoTracking()` EF Core ko batata hai ki is query ke results ko change tracker me register mat karo — na original-value snapshot store hoga, na state maintain hogi. Ye entities `Detached` state me aati hain. Iska fayda dono directions me hai: performance (snapshot bookkeeping avoid hoti hai, bade result sets ke liye significant), aur correctness ka signal (ye data kabhi `SaveChanges()` se save nahi hoga). Use karna chahiye jahan bhi query genuinely read-only hai — GET endpoints, reports, dropdown data.",
  },
  {
    id: "change-track-tr-3",
    question: "Ye code me kya bug hai?\n```csharp\nvar product = await context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);\nproduct.Price = 199.99m;\nawait context.SaveChangesAsync();\n```",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Product AsNoTracking se aaya hai (Detached), isliye Price change silently ignore hoga, SaveChangesAsync kuch nahi karega is entity ke liye.",
    detailedAnswer:
      "`AsNoTracking()` se aayi entity `Detached` state me hoti hai — change tracker isse monitor hi nahi kar raha, isliye `Price` property change hone ka koi effect nahi hota tracker pe. `SaveChangesAsync()` call karne par, EF Core ko is entity ke baare me pata hi nahi (ye tracked nahi hai), isliye koi UPDATE generate nahi hoga — koi exception bhi nahi aayega, changes bas silently persist nahi honge. Fix: agar entity ko modify karke save karna hai, `AsNoTracking()` mat lagao — normal tracked query use karo, ya explicitly `context.Attach(product)` + state set karo.",
    redFlag: "Candidate ko is code me issue na dikhna, ya assume karna ki 'Price update ho jaayega kyunki humne set kiya hai'.",
  },
  {
    id: "change-track-tr-4",
    question: "Ek entity load hui aur uski `Name` property change hui. `SaveChanges()` call karne par, generated UPDATE statement me kaunse columns hote hain?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Sirf Name column — EF Core sirf actually-changed properties ko UPDATE me include karta hai, poori row ko nahi.",
    detailedAnswer:
      "Change tracker property-level granularity pe track karta hai ki kaunsi properties genuinely modify hui hain (original snapshot vs current value comparison se). `SaveChanges()` generated UPDATE statement me sirf wahi columns include karta hai jo actually change hui thi — is case me sirf `Name`. Ye efficient hai (kam data transfer, kam lock contention on unrelated columns) aur concurrency-friendly bhi (dusri properties pe concurrent updates conflict nahi karenge jab tak wo columns overlap na karein).",
  },
  {
    id: "change-track-tr-5",
    question: "Ek team dekhti hai ki unka high-traffic listing API endpoint memory-heavy hai aur GC pressure create kar raha hai. Profiling se pata chalta hai change tracker me bahut saari entities accumulate ho rahi hain. Root cause aur fix kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Read-only queries `AsNoTracking()` use nahi kar rahi — change tracker unnecessarily saari returned entities ko snapshot ke saath track kar raha hai.",
    detailedAnswer:
      "Agar ek listing/GET endpoint sirf data return karta hai (kabhi save nahi karta) lekin default tracked queries use kar raha hai, har request ke liye EF Core har returned entity ka original-value snapshot store karta hai change tracker me — bade result sets ke liye ye significant memory overhead hai, aur `DbContext` scope khatam hone tak (request end tak) ye memory hold rehta hai. Fix: is endpoint ki query me `.AsNoTracking()` add karo — snapshot bookkeeping completely skip ho jaati hai, memory footprint drop hota hai bina functional behavior change kiye (kyunki data kabhi save hota hi nahi tha).",
    followUp: "Kya `AsNoTracking()` lagane se query ki correctness (returned data) kisi tarah change hoti hai?",
  },
  {
    id: "change-track-tr-6",
    question: "Kya manually `context.Entry(entity).State = EntityState.Modified;` set karna kabhi zaroori hota hai, aur iska side-effect kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Haan, jab entity ek disconnected/detached scenario se aayi ho (jaise deserialize kiya gaya object) — lekin ye poori entity ko UPDATE me include karta hai, sirf changed properties ko nahi.",
    detailedAnswer:
      "Ye zaroori hota hai jab entity change tracker se independently create hui ho — jaise ek API request body se deserialize kiya gaya object jo already database me exist karta hai, ya ek disconnected scenario (SPA/mobile client se aaya data). Aisi entity ke paas koi original-value snapshot nahi hota comparison ke liye, isliye EF Core ye nahi jaan sakta kaunsi specific properties badli hain. Manually `EntityState.Modified` set karne se, EF Core **saari properties** ko changed maan leta hai aur poori row UPDATE karta hai — chahe sirf ek field genuinely change hui ho. Isse avoid karne ke liye, alternative hai `context.Entry(entity).Property(p => p.Name).IsModified = true;` jaisa granular control, sirf specific properties mark karne ke liye.",
  },
  {
    id: "change-track-tr-7",
    question: "Kya `Unchanged` state ka matlab hai entity database me bilkul nahi hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Nahi — `Unchanged` ka matlab hai entity database me EXIST karta hai, aur load hone ke baad koi modification nahi hui hai.",
    detailedAnswer:
      "`Unchanged` state confuse ho sakta hai naam se — iska matlab 'entity exist nahi karta' nahi hai, balki 'entity database se load hui hai (ya already saved hai), aur load/save hone ke baad koi property change nahi hui.' Normal query se aayi tracked entity default `Unchanged` state me hoti hai. `Detached` state hai jo 'change tracker se koi connection nahi' represent karta hai — naye create kiye gaye objects (bina `Add()` ke) ya `AsNoTracking()` se aayi entities is state me hoti hain.",
  },
];

export default questions;
