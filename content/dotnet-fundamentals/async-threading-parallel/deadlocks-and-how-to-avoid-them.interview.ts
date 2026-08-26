import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "deadlocks-tr-1",
    question: "Async deadlock ka classic scenario explain karo — exact mechanism ke saath, sirf definition nahi.",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "TCS", "Accenture"],
    shortAnswer:
      "Single-threaded SynchronizationContext wale environment me `.Result`/`.Wait()` se sync-block karne par, blocked thread aur uske andar ke await ka continuation dono ek hi thread ka wait karte reh jaate hain.",
    detailedAnswer:
      "Ek UI thread (ya classic ASP.NET request thread) `GetDataAsync().Result` call karta hai — ye thread ko synchronously freeze karta hai. `GetDataAsync()` ke andar `await` (bina `ConfigureAwait(false)`) us thread ki `SynchronizationContext` capture karta hai, matlab completion ke baad continuation usi thread pe resume hoga. Lekin wo thread already `.Result` me block hai — kabhi free nahi hoga continuation chalane ke liye. Dono ek dusre ka wait karte reh jaate hain — circular dependency, permanent hang, koi exception nahi.",
    followUp: "Isse fix karne ke do tarike batao.",
  },
  {
    id: "deadlocks-tr-2",
    question: "Ye code diya gaya hai:\n```csharp\npublic void OnButtonClick(object sender, EventArgs e)\n{\n    var result = GetDataAsync().Result;\n    DisplayResult(result);\n}\n\npublic async Task<string> GetDataAsync()\n{\n    await Task.Delay(1000);\n    return \"done\";\n}\n```\nYe WPF app me kya karega, aur ek console app me kya karega — aur fark kyun hai?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "WPF me deadlock hoga (UI thread ki SynchronizationContext ki wajah se); console app me usually complete ho jaayega kyunki wahan koi SynchronizationContext nahi hoti.",
    detailedAnswer:
      "WPF me UI thread ek `SynchronizationContext` associate karta hai jo ensure karta hai `await` ke baad ka code usi thread pe resume ho. `.Result` UI thread block karta hai, continuation ko chalne ke liye wahi thread chahiye — deadlock. Console app me by default koi `SynchronizationContext` install nahi hoti, isliye `await Task.Delay(1000)` ka continuation kisi bhi thread-pool thread pe chal sakta hai — `.Result` block hoga lekin eventually complete ho jaayega. Ye difference dikhata hai ki deadlock code ki wajah se nahi, execution environment ki wajah se hota hai.",
  },
  {
    id: "deadlocks-tr-3",
    question: "Agar `.Result`/`.Wait()` avoid karna possible na ho (jaise ek legacy sync interface implement karna hai jo internally async call karta hai), to deadlock-safe tarike se ye kaise karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Us called async method ke andar har `await` pe `ConfigureAwait(false)` lagao poore transitive call chain me, taaki continuation original context ka wait na kare.",
    detailedAnswer:
      "Agar top-level `.Result`/`.Wait()` remove karna genuinely possible nahi hai (legacy interface constraint), to called async method aur uske andar call hone wale har async method me `ConfigureAwait(false)` consistently lagana chahiye — isse koi bhi continuation original `SynchronizationContext` ka wait nahi karega, wo kisi bhi thread-pool thread pe resume ho sakta hai, jisse blocked thread ka wait na karna pade. Ye fragile hai (ek miss se deadlock wapas) isliye best long-term fix poori chain ko async banana hi hai jab possible ho.",
    followUp: "Isko poori codebase me consistently enforce karne ke liye kya tooling use kar sakte ho?",
  },
  {
    id: "deadlocks-tr-4",
    question: "Kya ye statement sahi hai: 'ASP.NET Core me `.Result`/`.Wait()` use karna bilkul safe hai kyunki deadlock nahi hota'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — deadlock scenario nahi hota, lekin thread-pool starvation ek real, alag problem reh jaata hai high-load me.",
    detailedAnswer:
      "ASP.NET Core me koi request-bound `SynchronizationContext` na hone ki wajah se ye classic circular-wait deadlock nahi hota. Lekin `.Result`/`.Wait()` phir bhi ek thread-pool thread ko synchronously occupy karta hai jab tak async operation complete na ho — high concurrency load me, bahut saare requests agar sync-block kar rahe hain, thread-pool exhaust ho sakta hai aur naye requests ko serve karne ke liye threads available nahi rehte, jisse overall throughput drastically gir jaata hai. Ye ek genuinely different failure mode hai, deadlock nahi, lekin utna hi serious.",
    redFlag: "'ASP.NET Core me to .Result use karna bilkul fine hai' bolna bina thread-pool starvation ke risk ko mention kiye.",
  },
  {
    id: "deadlocks-tr-5",
    question: "Ek production app hang ho gaya hai — koi exception log me nahi hai, lekin requests process nahi ho rahe. Ye async deadlock ho sakta hai ya nahi, ye kaise verify karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Deadlock koi exception throw nahi karta, isliye ek thread/memory dump lekar dekhna padega ki koi thread `.Result`/`.Wait()` ke andar block hai aur uska matching continuation kahin queued/stuck hai.",
    detailedAnswer:
      "Async deadlock silently hang karta hai — koi exception, koi stack trace log me nahi aata, isliye log-based debugging fail ho jaata hai. Correct approach: process ka thread dump (ya memory dump analyze karna, e.g. `dotnet-dump`, WinDbg, ya Visual Studio's Parallel Stacks window) lena aur dekhna ki koi thread `Task.Wait()`/`.Result`'s internal blocking call ke andar frozen hai, aur uska corresponding async continuation kahin scheduled-but-never-run state me hai. Ye pattern specifically is deadlock ki signature hai.",
  },
  {
    id: "deadlocks-tr-6",
    question: "WPF ke button-click handler ko `async void` banane se deadlock avoid ho jaata hai — kyun, aur `async void` ke saath kaunsi trade-off aati hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`async void OnButtonClick` ke andar `await GetDataAsync()` use karne se UI thread block nahi hota, deadlock avoid ho jaata hai — lekin exceptions caller ko propagate nahi hote, unhandled exceptions app crash kar sakte hain.",
    detailedAnswer:
      "`async void OnButtonClick(...) { var result = await GetDataAsync(); ... }` me `.Result` bilkul use nahi hota — `await` non-blocking hai, UI thread free rehta hai jab tak `GetDataAsync` complete na ho. Ye deadlock scenario ko structurally hi avoid kar deta hai. Trade-off: `async void` methods ke exceptions caller ke `try/catch` se catch nahi kiye ja sakte — wo seedha `SynchronizationContext` pe throw hote hain, jo typically process crash karta hai (agar andar handle na kiya jaaye). Isiliye `async void` sirf event handlers ke liye reserved hai, general methods ke liye `async Task` chahiye.",
    followUp: "Event handler ke andar exceptions ko safely kaise handle karoge?",
  },
  {
    id: "deadlocks-tr-7",
    question: "Ek library method jo internally `HttpClient.GetStringAsync` ko `await` karta hai — agar is method ke andar `ConfigureAwait(false)` consistently use kiya jaaye, kya ye guarantee deta hai ki us library ka koi bhi consumer kabhi deadlock nahi karega?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Largely haan for that specific call chain, lekin sirf agar library ke ANDAR ka har await isse cover kare — ek bhi miss hone se guarantee toot jaata hai.",
    detailedAnswer:
      "`ConfigureAwait(false)` sirf us specific `await` statement ke continuation ko affect karta hai. Agar library method ke andar chain me har single `await` (including nested private/internal methods) `ConfigureAwait(false)` use karte hain, to koi bhi continuation original caller ki `SynchronizationContext` ka wait nahi karega — is se caller ka `.Result`/`.Wait()` safe reh sakta hai. Lekin agar ek bhi nested `await` ise miss kar de (jaise ek naya contributor bina jaane add kar de), wo specific point phir se context capture karega aur poori chain ka guarantee toot sakta hai. Isliye ye consistent discipline maangta hai, ek-baar-set-karo-bhool-jao guarantee nahi hai.",
    redFlag: "'Ek jagah ConfigureAwait(false) laga diya, ab poori chain safe hai' — bina verify kiye ki har nested await bhi cover hai.",
  },
];

export default questions;
