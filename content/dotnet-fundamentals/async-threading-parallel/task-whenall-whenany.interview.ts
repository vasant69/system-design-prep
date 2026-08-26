import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "task-whenall-whenany-tr-1",
    question: "Task.WhenAll aur Task.WhenAny me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "WhenAll saare tasks ke complete hone ka wait karta hai; WhenAny pehle-complete-hue task ka wait karta hai, baaki chalte rehte hain.",
    detailedAnswer:
      "`Task.WhenAll` given tasks tab tak complete nahi hota jab tak SAARE tasks complete na ho jaayein — chahe success ho ya fail. `Task.WhenAny` jaise hi pehla task complete hota hai (success ya failure), turant us completed Task ko return kar deta hai — baaki tasks cancel nahi hote, background me chalte rehte hain. `WhenAll` ka classic use parallel independent data fetches hai; `WhenAny` ka classic use timeout patterns ya first-response-wins scenarios hain.",
    followUp: "Multiple tasks fail hone par WhenAll ka exception handling kaise kaam karta hai?",
  },
  {
    id: "task-whenall-whenany-tr-2",
    question: "Do tasks `Task.WhenAll` ke andar fail hote hain, alag exceptions ke saath. `await Task.WhenAll(...)` ke catch block me kaunsi exception milegi, aur baaki kaise dekhoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Sirf pehli exception catch block me milegi. Baaki dekhne ke liye Task object ka `.Exception` (AggregateException) explicitly check karna padega.",
    detailedAnswer:
      "`await Task.WhenAll(...)` readability ke liye sirf pehli fail hui exception ko re-throw karta hai. Lekin poori set lost nahi hoti — agar tum `Task.WhenAll(...)` ka return value ek variable me store karo (na ki seedha await karo), us Task object ka `.Exception` property `AggregateException` type ka hota hai, jiska `.InnerExceptions` collection saari fail hui exceptions rakhta hai. Production code me agar multiple failures ka detail chahiye, ye pattern use karna zaroori hai.",
  },
  {
    id: "task-whenall-whenany-tr-3",
    question: "Ye code kitna time lega approximately, agar teeno methods 200ms lete hain independently?\n```csharp\nawait FetchAAsync();\nawait FetchBAsync();\nawait FetchCAsync();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "~600ms — sequential execution, har call previous ke complete hone ka wait karta hai.",
    detailedAnswer:
      "Har `await` apne aap me us call ke complete hone tak wait karta hai before agli line execute ho — isliye ye teen independent 200ms operations ek ke baad ek chalte hain, total ~600ms. Agar ye teeno genuinely independent hain (ek doosre ke result par depend nahi karte), inhe pehle call karke (bina turant await kiye) phir `Task.WhenAll` se ek saath await karna chahiye — total time ~200ms ho jaayega.",
  },
  {
    id: "task-whenall-whenany-tr-4",
    question: "Ye code sahi hai ya galat, aur kyun?\n```csharp\nvar t1 = FetchAAsync();\nvar t2 = FetchBAsync();\nawait t1;\nawait t2;\n```",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Sahi hai (concurrent) — dono methods pehle hi call ho chuke hain (started), sequential awaits sirf unke already-running results ka wait kar rahe hain, isliye ye Task.WhenAll jaisa hi concurrent behavior deta hai.",
    detailedAnswer:
      "Ye ek common misconception ko test karta hai — log sochte hain 'sequential await = sequential execution,' lekin yahan `t1` aur `t2` dono PEHLE hi call ho chuke hain (turant start hue) is se pehle ki koi await ho. Isliye jab pehla `await t1` line execute hoti hai, `t2` already background me chal raha hai. Total time approximately `Task.WhenAll` jaisa hi hoga (slowest task jitna), functionally equivalent, sirf `WhenAll` zyada readable/idiomatic hai isi cheez ke liye.",
    redFlag: "Is code ko 'sequential, isliye slow' bol dena — start vs await ke distinction ki galat samajh dikhata hai.",
  },
  {
    id: "task-whenall-whenany-tr-5",
    question: "Task.WhenAny use karke ek timeout pattern implement karo — agar FetchDataAsync 5 seconds se zyada le, TimeoutException throw karo.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Task.Delay(5000) ko FetchDataAsync ke saath race karwao Task.WhenAny se, phir check karo kaunsa completed Task hai.",
    detailedAnswer:
      "```csharp\nTask<string> dataTask = FetchDataAsync();\nTask timeoutTask = Task.Delay(TimeSpan.FromSeconds(5));\n\nTask completedFirst = await Task.WhenAny(dataTask, timeoutTask);\nif (completedFirst == timeoutTask)\n    throw new TimeoutException(\"Fetch took too long\");\n\nstring result = await dataTask; // dataTask already complete hai yahan\n```\nDono tasks concurrently start kiye jaate hain, `WhenAny` jo bhi pehle complete ho uska reference deta hai — reference-equality se check kiya jaata hai kaunsa task tha. Note: `dataTask` khud cancel nahi hota agar timeout jeet jaaye — genuinely cancel karne ke liye `CancellationToken` (agla topic) zaroori hai.",
    followUp: "dataTask ko genuinely cancel karne ke liye kya karna padega?",
  },
  {
    id: "task-whenall-whenany-tr-6",
    question: "Kya Task.WhenAny automatically baaki, na-jeetne-wale tasks ko cancel kar deta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — baaki tasks background me chalte rehte hain, cancellation explicit hona padta hai CancellationToken ke through.",
    detailedAnswer:
      "`Task.WhenAny` sirf 'pehla complete hua task kaunsa hai' ye batata hai — baaki tasks ko automatically cancel nahi karta. Wo apna kaam continue karte hain, chahe unka result ab use na ho raha ho. Agar genuinely un baaki tasks ko rokna hai (resource waste avoid karne ke liye), explicitly `CancellationTokenSource` pass karna padega un underlying operations ko, jo agle topic (`ConfigureAwait` aur `CancellationToken`) me detail me cover hota hai.",
    redFlag: "'WhenAny jeetne ke baad baaki tasks apne aap ruk jaate hain' bolna — ye galat, unhandled resource-leak risk create kar sakta hai real code me.",
  },
  {
    id: "task-whenall-whenany-tr-7",
    question: "`Task.WhenAll` me agar ek task fail ho jaaye, kya baaki tasks turant cancel ho jaate hain?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — WhenAll saare tasks ke complete hone (success ya fail) ka wait karta hai, ek ke fail hone se baaki cancel nahi hote.",
    detailedAnswer:
      "`Task.WhenAll` design se hi 'wait for all' semantics follow karta hai — chahe koi ek task jaldi fail ho jaaye, baaki apna kaam continue karte hain jab tak wo khud complete (success ya fail) na ho jaayein. `WhenAll` khud tab hi complete hota hai jab SAARE given tasks complete ho chuke ho. Ye ensure karta hai ki tum saari possible failures ko dekh sako (`AggregateException.InnerExceptions` ke through), na ki sirf sabse pehli.",
  },
  {
    id: "task-whenall-whenany-tr-8",
    question: "Ek dashboard page teen alag microservices (Orders, Inventory, Shipping) se data fetch karta hai, koi ek doosre par depend nahi karta. Kaise structure karoge is code ko performance ke liye?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Teeno service calls ko pehle start karo (bina turant await kiye), phir Task.WhenAll se ek saath await karo.",
    detailedAnswer:
      "```csharp\nvar ordersTask = orderService.GetOrdersAsync(userId);\nvar inventoryTask = inventoryService.GetStatusAsync(userId);\nvar shippingTask = shippingService.GetTrackingAsync(userId);\n\nawait Task.WhenAll(ordersTask, inventoryTask, shippingTask);\n\nvar dashboard = new DashboardViewModel\n{\n    Orders = ordersTask.Result,\n    Inventory = inventoryTask.Result,\n    Shipping = shippingTask.Result\n};\n```\nChunki teeno services independent hain, unhe sequentially await karna (`await ordersTask; await inventoryTask;` ...) total response time ko unnecessarily badha dega. Concurrently start karke `WhenAll` se wait karne se total time sabse slow service jitna hi hota hai, sabka sum nahi.",
  },
];

export default questions;
