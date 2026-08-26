import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "hostedservice-tr-1",
    question: "IHostedService aur BackgroundService me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Amazon"],
    shortAnswer: "IHostedService ek raw interface hai (StartAsync/StopAsync); BackgroundService ek abstract base class hai jo ise implement karta hai aur simpler ExecuteAsync loop deta hai continuous-work case ke liye.",
    detailedAnswer:
      "IHostedService interface directly implement karne me developer ko khud loop management, cancellation handling, aur start/stop coordination likhni padti hai. BackgroundService ye boilerplate abstract kar deta hai — developer sirf ExecuteAsync(CancellationToken stoppingToken) override karta hai jisme apna continuous/periodic work likh sakta hai, base class start/stop lifecycle internally handle kar leti hai. Zyaadatar real-world cases (periodic/continuous background work) BackgroundService se implement hote hain; raw IHostedService rarely, sirf jab bahut custom start/stop semantics chahiye hon.",
    followUp: "AddHostedService<T>() call karne se registered service ka lifetime kya hota hai?",
  },
  {
    id: "hostedservice-tr-2",
    question: "Ek BackgroundService ke andar DbContext (Scoped) kaise safely use karoge, given ki service khud Singleton hai?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "IServiceScopeFactory inject karo, har execution cycle me CreateScope() se naya scope banao, us scope se DbContext resolve karo.",
    detailedAnswer:
      "BackgroundService constructor me IServiceScopeFactory inject karo (ye khud Singleton-safe hai). ExecuteAsync ke loop ke andar, har iteration me using var scope = _scopeFactory.CreateScope() call karo, phir scope.ServiceProvider.GetRequiredService<AppDbContext>() se DbContext resolve karo. Ye ensure karta hai ki har cycle ko ek fresh, correctly-scoped DbContext instance mile, jo Scoped lifetime ke intended behavior ko respect karta hai — bina Singleton service ke andar ek single, long-lived DbContext instance ko incorrectly hold kiye (jo change-tracker bloat aur stale-data issues create karta).",
  },
  {
    id: "hostedservice-tr-3",
    question: "Kya ye statement sahi hai: 'BackgroundService use kar liya hai, isliye humara scheduled cleanup job reliably production me chalega'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Depends — agar job ka failure/loss acceptable hai (next cycle me phir chalega), theek hai. Agar job exactly-once/critical hai, BackgroundService insufficient hai kyunki app restart pe work silently lost ho sakta hai.",
    detailedAnswer:
      "BackgroundService reliability sirf 'jab tak app process chal rahi hai' tak guarantee karta hai. Agar app deployment/crash/scale-down se restart hoti hai exactly jab ek job mid-execution tha, wo work bina kisi trace ke lost ho jaata hai — koi automatic resume ya retry nahi hai. Low-stakes, self-correcting jobs (jaise periodic cache refresh, jahan next cycle automatically fix kar dega) ke liye ye acceptable hai. Lekin business-critical, exactly-once jobs (jaise financial settlement, notification sending) ke liye ye risk unacceptable hai — Hangfire/Quartz.NET jaisa persistent scheduler chahiye jo restart ke baad bhi incomplete jobs ko resume/retry kar sake.",
    redFlag: "Blanket assumption ki BackgroundService 'reliable' hai bina uski persistence-limitation ko consider kiye job ki criticality ke against.",
  },
  {
    id: "hostedservice-tr-4",
    question: "3 scaled instances me chal rahi ek app me, tumhe ek 'sirf ek baar globally' chalne wala scheduled job chahiye. BackgroundService se ye kaise achieve karoge, aur kya better alternative hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "BackgroundService se distributed locking manually implement karni padegi (complex, error-prone); better alternative hai Hangfire/Quartz.NET jo built-in distributed locking provide karte hain.",
    detailedAnswer:
      "BackgroundService khud koi distributed coordination provide nahi karta — har instance independently apna copy chalata hai. Isse 'run once globally' banane ke liye manually ek distributed lock (jaise Redis-based lock, ya database-level advisory lock) implement karna padega jisse sirf ek instance job actually execute kare, baaki wait/skip karein — ye genuinely complex hai (lock expiry, deadlock scenarios handle karne padte hain). Hangfire jaisi library ise already solve kar chuki hai — uski persistent job store (SQL/Redis-backed) automatically ensure karti hai ki ek scheduled job sirf ek worker instance dwara pick up ho, chahe kitni bhi app instances chal rahi hon.",
  },
  {
    id: "hostedservice-tr-5",
    question: "ExecuteAsync ke loop me `stoppingToken` ko `Task.Delay` call me pass na karna kya problem create karta hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Graceful shutdown broken/slow ho jaata hai — app shutdown signal aane par bhi delay poora complete hone tak service actually rukega nahi.",
    detailedAnswer:
      "Jab app shutdown ho rahi hoti hai, IHostedService.StopAsync() call hota hai jo internally cancellation token (stoppingToken) cancel karta hai. Agar Task.Delay(interval) is token ko pass nahi kar raha, delay apne full duration tak chalega chahe cancellation request ho chuki ho — service turant nahi rukega, shutdown slow ho jaata hai (ya host graceful-shutdown timeout ke baad forcefully kill kar deta hai, jo unclean hai). Task.Delay(interval, stoppingToken) pass karne se delay turant cancel ho jaata hai jab cancellation signal aata hai, allowing the loop to exit promptly.",
  },
  {
    id: "hostedservice-tr-6",
    question: "AddHostedService<T>() call karne pe registered service kis lifetime pe register hoti hai, aur iska practical implication kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Singleton — poori app lifetime ke liye ek hi instance. Iska implication ye hai ki Scoped dependencies directly inject nahi ho sakti, IServiceScopeFactory chahiye.",
    detailedAnswer:
      "AddHostedService<T>() internally Singleton registration create karta hai (ek instance jo app start hone se lekar shutdown tak zinda rehta hai). Ye practical implication rakhta hai — koi bhi Scoped dependency (jaise DbContext, ya koi bhi service jo per-request scope me register hui ho) directly constructor injection se available nahi hogi bina captive-dependency issue ke. Isliye IServiceScopeFactory pattern zaroori hota hai jab bhi Scoped services background service ke andar chahiye hon.",
  },
  {
    id: "hostedservice-tr-7",
    question: "Ek in-memory cache periodically (har 15 minutes) refresh karne wala BackgroundService likha gaya hai. App restart ho jaaye, kya production impact hoga?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer: "Minimal impact — restart ke baad naya cache-refresh cycle apne aap shuru ho jaayega; ye ek low-stakes, self-correcting use case hai jo BackgroundService ke liye genuinely appropriate hai.",
    detailedAnswer:
      "Ye ek ideal BackgroundService use case hai kyunki work inherently idempotent/self-correcting hai — restart hone par bhi, jaise hi app phir se start hoti hai, BackgroundService bhi phir se start hoga aur usual interval pe cache refresh karega. Koi 'missed work' permanently lost nahi hota in a way that matters — worst case cache thodi der stale rehti hai restart aur next cycle ke beech, jo typically acceptable hai. Ye contrast karta hai ek critical, non-idempotent job (jaise 'ek baar charge process karo') se, jahan restart-loss genuinely problematic hota.",
  },
  {
    id: "hostedservice-tr-8",
    question: "AddHostedService<T>() ko multiple baar, alag-alag T types ke saath call karna kya karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Har call ek independent background service register karta hai — sab simultaneously, apne-apne ExecuteAsync loop ke saath, app ke poore lifetime ke dauran chalte hain.",
    detailedAnswer:
      "AddHostedService<T>() ek call ek specific IHostedService implementation ko register karta hai. Ek app me multiple, unrelated background services (jaise ek OrderCleanupService, ek CacheWarmerService, ek EmailQueueProcessor) ho sakti hain — har ek apna khud ka AddHostedService<T>() call karega Program.cs me. Generic Host startup pe sab registered hosted services ke StartAsync() ko call karta hai (concurrently), aur shutdown pe sab ke StopAsync() ko — har service independently apna kaam karta hai, ek doosre se directly interact nahi karta jab tak explicitly design na kiya jaaye.",
  },
];

export default questions;
