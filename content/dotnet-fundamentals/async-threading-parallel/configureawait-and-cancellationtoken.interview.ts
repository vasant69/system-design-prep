import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "configureawait-tr-1",
    question: "`ConfigureAwait(false)` kya karta hai, aur kab use karna chahiye?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "TCS", "Cognizant"],
    shortAnswer:
      "Continuation ko original SynchronizationContext capture kiye bina, kisi bhi thread-pool thread pe resume hone deta hai — library/shared code me use karo, UI-layer code me nahi.",
    detailedAnswer:
      "Default `await` current `SynchronizationContext`/`TaskScheduler` capture karta hai taaki continuation wahin resume ho — UI apps ke liye zaroori (UI controls ko sahi thread se update karne ke liye). `ConfigureAwait(false)` is capture ko skip karta hai — continuation kisi bhi available thread-pool thread pe chal sakta hai, jo perf overhead kam karta hai aur context-capture-dependent deadlock avoid karta hai. Library/shared code me best practice hai kyunki caller ka context pata nahi hota; UI event handlers me avoid karo kyunki wahan UI thread pe wapas aana genuinely zaroori hai.",
    followUp: "ASP.NET Core me iski zaroorat classic ASP.NET se kaise kam ho gayi?",
  },
  {
    id: "configureawait-tr-2",
    question: "`CancellationToken` ko 'cooperative' cancellation kyun kaha jaata hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Kyunki .NET forcefully thread kill nahi karta — running operation ko khud signal check karna padta hai aur gracefully rukna padta hai.",
    detailedAnswer:
      "Forceful thread termination unsafe hai — locks held reh sakte hain, partial state corrupt ho sakta hai. Isliye `CancellationToken` sirf ek signal deliver karta hai (`CancellationTokenSource.Cancel()`); operation ko khud `IsCancellationRequested` check karna hota hai (silent early exit ke liye) ya `ThrowIfCancellationRequested()` call karna hota hai (`OperationCanceledException` throw karta hai, jo cancellation ka standard convention-based signal hai). Agar operation kabhi check hi nahi karta, cancellation request bilkul ignore ho jaata hai.",
  },
  {
    id: "configureawait-tr-3",
    question: "Ye code kya karega jab `cts.CancelAfter(TimeSpan.FromSeconds(2))` chal chuka ho aur `LongRunningWork` andar koi cancellation check hi na kare?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Kuch nahi hoga cancellation ke roop me — operation poora chalega, cancellation silently ignore ho jaayega kyunki koi check hi nahi hai.",
    detailedAnswer:
      "`CancellationTokenSource` sirf signal set karta hai ki `Token.IsCancellationRequested == true` ho jaaye 2 second baad. Agar `LongRunningWork` ke andar koi `ThrowIfCancellationRequested()` ya `IsCancellationRequested` check nahi hai (aur wo koi aisa `await` call bhi nahi karta jo token accept karke khud check kare, jaise `Task.Delay(ms, token)`), to signal set hone ke bawajood operation poora chalega, koi exception nahi aayega, koi early-stop nahi hoga.",
    followUp: "To phir ek genuinely cancellable loop kaise likhoge?",
  },
  {
    id: "configureawait-tr-4",
    question: "WPF ke ek button-click event handler me `ConfigureAwait(false)` use karne se kya problem aa sakti hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "await ke baad ka code UI thread pe resume nahi hoga — direct UI control update (jaise TextBox.Text = ...) cross-thread exception de sakta hai.",
    detailedAnswer:
      "WPF/WinForms me UI controls sirf UI thread se update kiye ja sakte hain. Agar `await SomeAsync().ConfigureAwait(false)` use kiya jaaye event handler ke andar, continuation kisi thread-pool thread pe resume hota hai — us thread se seedha `TextBox.Text = result` set karna `InvalidOperationException` (cross-thread operation) throw karega. Isliye UI-layer code me `ConfigureAwait(false)` avoid karna best practice hai — default context-capturing behavior hi chahiye hota hai wahan.",
  },
  {
    id: "configureawait-tr-5",
    question: "Ek library method `Task<Data> FetchAsync(CancellationToken ct = default)` deta hai jahan `ct` ko koi default value diya gaya hai. Iska implication kya hai caller ke liye?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Caller cancellation support optional treat kar sakta hai — token pass na karne par operation kabhi cancel nahi hoga, jo silently 'always runs to completion' behavior deta hai.",
    detailedAnswer:
      "`CancellationToken ct = default` ka matlab hai `CancellationToken.None` — ek token jo kabhi 'cancelled' state me nahi jaata. Agar caller apna token pass nahi karta, method genuinely never respond karega kisi bhi cancellation attempt ko, chahe caller ke paas apna `CancellationTokenSource` ho ya na ho. Production code me long-running/network operations ke liye caller ko hamesha apna real token pass karna chahiye, default pe rely nahi karna chahiye.",
  },
  {
    id: "configureawait-tr-6",
    question: "Kya ye statement sahi hai: 'CancellationToken pass karne se operation turant, us instant, ruk jaata hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — cancellation cooperative hai, operation apni agli check point tak chalta rehta hai, turant nahi rukta.",
    detailedAnswer:
      "Ye ek common misconception hai. `CancellationToken` sirf ek flag set karta hai; operation ko khud apne code ke beech me periodically ye check karna hota hai (`ThrowIfCancellationRequested()` ya similar). Agar checks bahut door-door hain (jaise ek bade loop me sirf shuru me ek check hai), cancellation request set hone ke baad bhi operation kaafi der tak chal sakta hai jab tak agla check point na aaye. Iska matlab hai cancellation-aware code likhte waqt checks ko reasonably frequent rakhna zaroori hai.",
    redFlag: "'Cancel() call karte hi thread turant mar jaata hai' bolna — ye .NET ke cooperative cancellation model ki galat samajh dikhata hai.",
  },
  {
    id: "configureawait-tr-7",
    question: "Library code me `ConfigureAwait(false)` consistently use karna kyun 'best practice' maana jaata hai, sirf 'nice to have' nahi?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Kyunki library ko apne caller ka execution context pata nahi hota — WPF ho, classic ASP.NET ho, console app ho — galat assumption deadlock ya perf regression de sakta hai.",
    detailedAnswer:
      "Ek NuGet package ya shared library kisi bhi type ke application me consume ho sakti hai. Agar library apne internal `await` calls me `ConfigureAwait(false)` nahi use karti, aur koi consumer (jaise classic ASP.NET ya WPF) us library ka async method `.Result`/`.Wait()` se synchronously call karta hai, deadlock ho sakta hai (agar us context ki SynchronizationContext single-threaded hai). `ConfigureAwait(false)` is risk ko library ke andar hi eliminate kar deta hai, consumer ke behavior pe depend kiye bina.",
  },
  {
    id: "configureawait-tr-8",
    question: "`CancellationTokenSource` ko `using` statement ke andar rakhna kyun important hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`CancellationTokenSource` IDisposable hai — especially timer-based (CancelAfter) sources internal resources hold karte hain jo explicitly release karne chahiye.",
    detailedAnswer:
      "`CancellationTokenSource` internally ek timer allocate kar sakta hai (jab `CancelAfter` use ho) aur kuch handle-jaisi state maintain karta hai. `IDisposable` implement karta hai isliye taaki ye resources deterministically release ho sakein jab source ki zaroorat khatam ho jaaye. `using`/`using var` na lagana ek chhota, easy-to-miss resource leak create karta hai, especially high-throughput code paths me jahan bahut saare short-lived `CancellationTokenSource` instances banaye jaate hain.",
  },
];

export default questions;
