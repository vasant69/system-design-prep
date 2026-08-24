import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "workstation-server-gc-tr-1",
    question: "Workstation GC aur Server GC me core difference kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft", "TCS", "Infosys"],
    shortAnswer: "Workstation GC single heap use karta hai, low-latency ke liye optimized; Server GC per-core heap + thread use karta hai, throughput ke liye optimized.",
    detailedAnswer:
      "Workstation GC ek single heap maintain karta hai aur collections allocating thread ke near/on hoti hain — design goal responsiveness hai, isliye chhoti, frequent pauses. Server GC har logical CPU core ke liye ek separate heap aur dedicated GC thread banata hai, sab parallel collect karte hain — design goal maximum throughput hai, zyada memory overhead ke trade-off pe. Workstation desktop/client apps ka default hai, Server ASP.NET Core ka.",
    followUp: "Kya Server GC ka memory overhead genuinely significant hota hai?",
  },
  {
    id: "workstation-server-gc-tr-2",
    question: "ASP.NET Core apps me by default kaunsa GC mode active hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Server GC — ASP.NET Core apps typically multi-core hardware pe high-throughput workloads chalate hain, isliye SDK-level default Server GC hai.",
    detailedAnswer:
      "ASP.NET Core (`Microsoft.NET.Sdk.Web`) apps me Server GC by default ON hota hai. Ye Microsoft ki apni benchmarking pe based hai — server workloads generally high allocation rate ke saath multi-core hardware pe chalte hain, jahan parallel per-core collection throughput ke liye clearly better hota hai. Desktop/console apps me iske contrast Workstation GC default hota hai, jahan responsiveness priority hoti hai.",
  },
  {
    id: "workstation-server-gc-tr-3",
    question: "Server GC heap architecture kaise kaam karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Har logical CPU core ke liye ek separate heap aur ek dedicated GC thread banaya jaata hai; collection trigger hone par sab threads parallel apni heap collect karte hain.",
    detailedAnswer:
      "Server GC ek machine ke har logical processor core ke liye ek independent heap allocate karta hai, saath me ek dedicated GC thread us heap ke liye. Jab collection trigger hoti hai, sab GC threads simultaneously apni-apni heap collect karte hain — kaam parallel split ho jaata hai, jisse total collection time drastically kam ho jaata hai multi-core machines pe compared to ek single-threaded sequential collection.",
  },
  {
    id: "workstation-server-gc-tr-4",
    question: "Server GC ka trade-off kya hai — 'free lunch' kyun nahi hai ye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Zyada memory overhead (multiple heaps) aur individual collection pauses Workstation se bade ho sakte hain, chahe total throughput better ho.",
    detailedAnswer:
      "Server GC har core ke liye alag heap maintain karta hai, jisme har heap ka apna overhead hota hai — total memory footprint Workstation GC se zyada hota hai. Individual GC pause bhi bada ho sakta hai kyunki design goal 'jaldi se jaldi sara collection nipta do' hai, chhote-chhote incremental pauses dena nahi. Ye trade-off high-throughput multi-core server workloads me worth hota hai, lekin low-core ya memory-constrained environments me overhead benefit se zyada ho sakta hai.",
    followUp: "Kaunse deployment scenario me tum explicitly Workstation GC choose karoge server app ke liye bhi?",
  },
  {
    id: "workstation-server-gc-tr-5",
    question: "Ek containerized microservice 1 CPU core wale pod me deploy hota hai, Server GC default se ON hai. Team memory usage aur latency issues dekh rahi hai. Kya karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "`ServerGarbageCollection` ko `false` set karke Workstation GC try karo — low-core environment me Server GC ka per-core-heap overhead benefit se zyada ho sakta hai.",
    detailedAnswer:
      "Server GC ka design assumption multiple cores hai jinme parallel work split ho sake. Sirf 1 core wale container me, Server GC still apna heap/thread overhead carry karta hai bina real parallelism benefit ke, jisse memory footprint aur scheduling overhead badh jaata hai. `.csproj` me `<ServerGarbageCollection>false</ServerGarbageCollection>` set karke Workstation GC try karna, aur before/after memory + latency measure karna, ek practical, evidence-based fix hai — blind assumption ('Server hamesha better') se bachna zaroori hai.",
  },
  {
    id: "workstation-server-gc-tr-6",
    question: "Kya ye statement sahi hai: 'Server GC naam se hi pata chalta hai ki ye server apps ke liye hamesha best choice hai, kabhi override nahi karna chahiye'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — deployment shape (especially core count) ke against Server GC suboptimal ho sakta hai, blindly trust karna sahi nahi hai.",
    detailedAnswer:
      "Ye ek common overconfident assumption hai. Server GC ka benefit multi-core parallelism se aata hai — agar deployment environment me cores limited hain (jaise 1-core containers), per-core-heap model ka overhead benefit se zyada ho sakta hai. Production me GC mode choice ko measured decision hona chahiye (profiling ke saath), naam ke basis pe assumption nahi.",
    redFlag: "'Server GC hamesha best hai kyunki server app hai' — evidence ke bina blanket statement dena weak signal hai.",
  },
  {
    id: "workstation-server-gc-tr-7",
    question: "Concurrent (background) GC mode Workstation/Server GC se kaise related hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Ye ek orthogonal setting hai — dono modes (Workstation aur Server) ka apna concurrent/background variant hota hai jo Gen 2 collection ka hissa background thread pe chala kar foreground pause aur kam karta hai.",
    detailedAnswer:
      "Concurrent GC (`ConcurrentGarbageCollection`) Workstation ya Server, dono modes ke saath combine ho sakta hai. Iska kaam Gen 2 (full) collection ke kuch phases ko ek background thread pe chalana hai jabki application thread(s) continue kar sakein — isse foreground application pause chhota hota hai, chahe poori tarah eliminate nahi hota (kuch synchronization phases still application ko pause karte hain). Ye setting mode se independent, additive optimization hai.",
  },
  {
    id: "workstation-server-gc-tr-8",
    question: "GC mode ko `.csproj` me kaise configure karte ho?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "`<ServerGarbageCollection>true|false</ServerGarbageCollection>` aur `<ConcurrentGarbageCollection>true|false</ConcurrentGarbageCollection>` `PropertyGroup` ke andar.",
    detailedAnswer:
      "```xml\n<PropertyGroup>\n  <ServerGarbageCollection>true</ServerGarbageCollection>\n  <ConcurrentGarbageCollection>true</ConcurrentGarbageCollection>\n</PropertyGroup>\n```\n`ServerGarbageCollection=true` Server GC enable karta hai (per-core heaps, parallel collection); `false` Workstation GC use karega. `ConcurrentGarbageCollection` independently background/concurrent collection enable/disable karta hai, dono modes ke saath compatible hai.",
  },
];

export default questions;
