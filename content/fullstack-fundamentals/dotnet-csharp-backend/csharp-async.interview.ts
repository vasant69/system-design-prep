import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "casync-1",
    question: "`async`/`await` ASP.NET Core me server throughput kaise badhata hai? Kya wo request ko tez karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Ek individual request usually tez nahi hoti. Jab request ek I/O call (`await db...`, `await http...`) par wait karti hai, thread pool thread wapas pool me chala jaata hai aur doosri request serve kar sakta hai. Isliye same threads se zyada concurrent requests handle hoti hain.",
    detailedAnswer:
      "Sync I/O me ek thread poore DB round-trip ke liye blocked padi rehti hai — 200 concurrent slow queries = 200 blocked threads = thread-pool starvation. Async me wo threads free hote hain. CPU-bound work ke liye async kuch nahi deta; wahan scaling ka jawab zyada cores / offloading hai, `await` nahi.",
    followUp: "CPU-bound work ko `Task.Run` me daalna ASP.NET me kyun aksar galat hai?",
  },
  {
    id: "casync-2",
    question: "`.Result` ya `.Wait()` se deadlock kaise hota hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Ek SynchronizationContext (classic ASP.NET, WinForms/WPF) me `await` continuation ko captured context par wapas post karta hai. Agar tumne us context ki thread ko `.Result` se block kar rakha hai, continuation us thread ka intezaar karta hai jo tumhara block release hone ka intezaar kar raha hai — dono atak jaate hain.",
    detailedAnswer:
      "Fixes: poora call chain `await` karo, kabhi block mat karo. Library code me `ConfigureAwait(false)` continuation ko context se detach karta hai. ASP.NET Core me koi SynchronizationContext nahi hai, isliye ye specific deadlock nahi hota — par sync-over-async abhi bhi thread-pool starvation aur scalability problems deta hai, isliye pattern har jagah avoid karo.",
    redFlag: "'ASP.NET Core me SynchronizationContext nahi hai to `.Result` safe hai' — throughput abhi bhi girta hai.",
  },
  {
    id: "casync-3",
    question: "`async void` kab theek hai, aur warna kya galat hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Sirf event handlers ke liye theek hai (signature demand karta hai). Warna: caller `Task` nahi le sakta isliye await/observe nahi kar sakta; method ke andar unhandled exception directly `SynchronizationContext` par raise hota hai aur aksar process crash karta hai; unit test complete hone ka pata nahi kar sakta.",
    detailedAnswer:
      "Hamesha `async Task` (ya `Task<T>`) return karo taaki exceptions Task par capture hon aur caller compose kar sake. Fire-and-forget genuinely chahiye to ek explicit background mechanism (`Channel<T>` + `BackgroundService`, `IHostedService`) use karo jahan exceptions logged hon.",
  },
];

export default questions;
