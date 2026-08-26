import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "async-void-task-valuetask-tr-1",
    question: "async void kyun dangerous hai, aur ise kab use karna sahi hai?",
    type: "conceptual",
    difficulty: "advanced",
    askedAt: ["Microsoft", "Amazon", "TCS"],
    shortAnswer: "async void ke exceptions caller ka try/catch bypass karke process crash kar sakte hain. Sirf event handlers me use karna sahi hai.",
    detailedAnswer:
      "`async void` methods ke andar throw hui exceptions ko Task-based propagation path nahi milta — wo seedha SynchronizationContext par throw hoti hain, jo typically process crash kar deta hai, aur koi bhi caller-side try/catch ise catch nahi kar sakta. Ye sirf event handlers ke liye acceptable hai kyunki unka signature framework (WinForms/WPF/ASP.NET) dwara void-returning delegate ke roop me fixed hota hai — Task return karna structurally possible hi nahi hota wahan. Har doosri jagah `async Task` default hona chahiye.",
    followUp: "Agar ek event handler ke andar exception aaye, use kaise safely handle karoge?",
  },
  {
    id: "async-void-task-valuetask-tr-2",
    question: "`async Task` me exception handling `async void` se structurally kaise alag hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "async Task exception ko Task object me capture karta hai, await par re-throw hoti hai; async void ke paas ye capturing mechanism hi nahi hota.",
    detailedAnswer:
      "`async Task`/`async Task<T>` me, method ke andar throw hui koi bhi exception us returned `Task` object ke andar capture ho jaati hai (`Task.Exception` property). Jab caller us Task ko `await` karta hai, exception wahan properly re-throw hoti hai, normal try/catch se catchable. `async void` me koi Task return hi nahi hota jisme exception store ho sake — isliye exception directly current `SynchronizationContext` ko propagate hoti hai, jo usually unhandled exception ke roop me process crash kar deta hai.",
  },
  {
    id: "async-void-task-valuetask-tr-3",
    question: "Ye code run karne par kya hoga?\n```csharp\nasync void LogAndSave()\n{\n    await Task.Delay(100);\n    throw new Exception(\"failure during save\");\n}\n\ntry\n{\n    LogAndSave();\n    Console.WriteLine(\"After call\");\n}\ncatch\n{\n    Console.WriteLine(\"Caught it\");\n}\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "\"After call\" print hoga (kyunki LogAndSave turant return kar deta hai await ke point par), aur baad me exception process ko crash kar degi — \"Caught it\" kabhi print nahi hoga.",
    detailedAnswer:
      "`LogAndSave()` call hote hi `await Task.Delay(100)` tak synchronously chalta hai, phir control turant caller ko return ho jaata hai (state machine mechanics — pichhle topic dekho), isliye \"After call\" print hota hai. 100ms baad jab continuation resume hota hai aur exception throw hoti hai, us waqt tak original try/catch block already exit ho chuka hota hai (method call already 'return' kar chuka tha) — exception SynchronizationContext par unhandled jaati hai, process crash. \"Caught it\" kabhi print nahi hota.",
  },
  {
    id: "async-void-task-valuetask-tr-4",
    question: "Kya try/catch ko method call ke around wrap karna async void ki exception-handling problem ko solve kar sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — chahe kitni bhi carefully wrap kiya jaaye, async void ke exceptions caller ke try/catch tak pahunchte hi nahi hain.",
    detailedAnswer:
      "Ye is topic ka sabse commonly-tested trap hai. `async void` method ke andar exception ka koi Task-based 'return path' nahi hota caller tak — isliye chahe caller kitni bhi carefully try/catch me method call ko wrap kare, wo exception us try/catch tak kabhi pahunchti hi nahi. Ye ek fundamental structural limitation hai, coding style ki galti nahi jo fix ho sake — sirf solution hai method ko `async Task` banana (agar possible ho) ya method ke andar hi khud ek try/catch daal dena.",
    redFlag: "'Bas method call ko try/catch me wrap kar do' bolna async void ke exceptions handle karne ke liye — ye dikhata hai candidate ko underlying mechanism samajh nahi aaya.",
  },
  {
    id: "async-void-task-valuetask-tr-5",
    question: "ValueTask<T> ka use case kya hai, aur ise har jagah Task<T> ki jagah use karna kyun sahi nahi hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "ValueTask<T> hot-path, frequently-synchronously-completing operations ke liye allocation avoid karta hai, lekin sirf ek baar safely await ho sakta hai — general-purpose replacement nahi hai.",
    detailedAnswer:
      "`ValueTask<T>` ek struct hai — jab operation synchronously complete hoti hai (jaise cache hit), value directly struct me store hota hai, koi heap allocation nahi hoti. Ye measurable benefit deta hai sirf un scenarios me jahan method bahut frequently call hoti hai aur aksar synchronously complete hoti hai. Lekin `ValueTask<T>` sirf ek baar safely await/access kiya ja sakta hai — repeated access undefined behavior de sakta hai, jabki `Task<T>` multiple baar safely await/access ho sakta hai. Isliye ye general default nahi hai — sirf profiling-justified hot paths ke liye.",
    followUp: "Ek scenario batao jahan ValueTask genuinely fayda dega.",
  },
  {
    id: "async-void-task-valuetask-tr-6",
    question: "Ek scenario: tumhe ek `GetConfigValueAsync(string key)` method likhna hai jo 95% of the time ek already-loaded in-memory dictionary se turant value deta hai, aur sirf 5% time (cache miss) ek genuine async reload karta hai. Kya use karoge — Task<T> ya ValueTask<T>?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "ValueTask<T> — kyunki 95% calls synchronously complete hoti hain, aur agar ye method bahut frequently call hoti hai, Task<T> allocation overhead measurable ho sakta hai.",
    detailedAnswer:
      "Ye exactly `ValueTask<T>` ka intended use case hai — ek high-frequency call jahan majority path synchronous hai. `ValueTask<int>.FromResult`-jaisa pattern (ya seedha `new ValueTask<T>(value)`) us 95% path par koi heap allocation create nahi karta. Sirf 5% cache-miss path par genuinely ek `Task<T>` allocate hota hai (jo `ValueTask` internally wrap kar leta hai). Agar ye method rarely call hoti (low frequency), `Task<T>` ka simplicity benefit `ValueTask` ki complexity se zyada worth hota — decision frequency aur measured impact par depend karta hai.",
  },
  {
    id: "async-void-task-valuetask-tr-7",
    question: "Ek code review me tumhe ek helper method dikhta hai: `private async void ProcessQueueItem(Item item) { await SaveAsync(item); }` — jo kisi event handler se related nahi hai, seedha ek loop se call hota hai. Kya flag karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Haan — ye async void ka misuse hai. Non-event-handler code me async void kabhi appropriate nahi, exceptions silently process crash kar sakti hain.",
    detailedAnswer:
      "Ye method ek event handler nahi hai (seedha loop se call ho raha hai), isliye `async void` yahan bilkul unnecessary aur dangerous hai — signature ko `async Task` me badalna chahiye, aur calling loop ko har call ko properly `await` karna chahiye (ya `Task.WhenAll` agar concurrent processing intended ho). Agar `SaveAsync` ke andar koi exception aaye, current `async void` design me wo exception poore process ko crash kar sakti hai, jabki `async Task` me wo caller ke try/catch se gracefully handle ho sakti thi.",
    followUp: "Agar loop me multiple items concurrently process karne hain, code kaisa dikhega?",
  },
  {
    id: "async-void-task-valuetask-tr-8",
    question: "Kya `async Task` methods me bhi unhandled exceptions se process crash ho sakta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Haan, agar returned Task ko kabhi await/observe hi nahi kiya jaaye — lekin ye async void jitna guaranteed-fatal nahi hai, aur properly awaited hone par normal try/catch kaam karta hai.",
    detailedAnswer:
      "Agar tum `async Task` method call karte ho lekin uska returned Task kabhi await/observe nahi karte ('fire and forget' galti se), exception us Task ke andar hi capture ho jaati hai aur silently 'lost' reh sakti hai (kuch .NET versions me ek unobserved-task-exception event trigger hota hai, lekin default behavior version-dependent raha hai). Ye `async void` se better hai (process turant crash nahi hota, aur agar tum properly `await` karo to try/catch bilkul kaam karta hai), lekin best practice fir bhi hai: kabhi bhi ek Task-returning method ko bina await/observe kiye mat chhodo.",
  },
];

export default questions;
