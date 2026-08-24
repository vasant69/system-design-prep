import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "gc-gen-loh-tr-1",
    question: ".NET GC me generations (Gen 0/1/2) kyun exist karti hain?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft", "Amazon", "TCS"],
    shortAnswer: "Generational hypothesis ke wajah se — zyadatar objects short-lived hote hain, isliye naye objects ko pehle, chhote region me check karna GC ko bahut fast bana deta hai.",
    detailedAnswer:
      "Generational hypothesis kehta hai zyadatar objects short-lived hote hain, aur jo lambe samay tak survive karte hain wo aksar bahut lambe samay tak zinda rehte hain. GC is observation ko exploit karta hai teen generations bana kar: Gen 0 (naye objects, chhota, frequently collected), Gen 1 (intermediate), Gen 2 (long-lived, rare lekin expensive collection). Isse zyadatar collection work chhota aur fast rehta hai, kyunki full-heap scan sirf occasionally (Gen 2) hota hai.",
    followUp: "Ek object Gen 1 ya Gen 2 tak kaise pahunchta hai?",
  },
  {
    id: "gc-gen-loh-tr-2",
    question: "Object promotion ka rule kya hai — object ek generation se agli me kab jaata hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Agar object apni current generation ka collection survive kare (still reachable), wo agli generation me promote ho jaata hai.",
    detailedAnswer:
      "Jab GC ek generation collect karta hai, jo objects reachable (alive) paaye jaate hain unhe agli generation me promote kar diya jaata hai — Gen 0 survivors Gen 1 me, Gen 1 survivors Gen 2 me. Jo objects unreachable milte hain wo reclaim ho jaate hain, promote nahi hote. Isliye genuinely short-lived objects Gen 0 me hi mar jaate hain, kabhi Gen 1/2 tak pahunchte hi nahi.",
  },
  {
    id: "gc-gen-loh-tr-3",
    question: "Large Object Heap (LOH) kya hai aur ek object kab isme allocate hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "85KB ya usse bada object normal Gen 0/1/2 heap ki jagah Large Object Heap pe allocate hota hai.",
    detailedAnswer:
      "LOH ek separate heap hai jahan 85,000 bytes (85KB) ya usse bade objects (bade arrays, strings, buffers) allocate hote hain, normal generational Gen 0/1/2 heap ki jagah. Ye separation isliye hai kyunki bade objects ko compaction ke dauraan memory me copy/move karna expensive hai — is cost ko avoid karne ke liye LOH ko by default compact hi nahi kiya jaata.",
    followUp: "LOH ko compact na karne ka side-effect kya hai?",
  },
  {
    id: "gc-gen-loh-tr-4",
    question: "LOH by default compact kyun nahi hota, aur iska practical downside kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Bade objects ko copy karna expensive hai, isliye LOH compact nahi hota by default — downside: fragmentation, jisse effective memory usage badh sakta hai chahe live data kam ho.",
    detailedAnswer:
      "Normal Gen 0/1/2 collection ka ek part surviving objects ko contiguous memory me move karna (compaction) hota hai, jisse fragmentation kam rahe. Ek 10MB object ko baar-baar copy karna bahut CPU/memory-bandwidth expensive hoga, isliye LOH ye compaction skip karta hai by default. Side-effect: agar alag-alag sizes ke large objects repeatedly allocate/free hote rahein, gaps ban jaate hain jo future (thode bade) allocations reuse nahi kar paate — process ko naya memory OS se maangna padta hai, memory usage badhta rehta hai chahe live data stable ho.",
    followUp: "Is fragmentation ko production me kaise avoid ya fix karoge?",
  },
  {
    id: "gc-gen-loh-tr-5",
    question: "Ek high-throughput image-processing service per-request 500KB byte arrays allocate karta hai. Kuch weeks baad memory usage steadily badh raha hai. Debug approach kya hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "LOH fragmentation suspect karo (500KB > 85KB threshold) — memory profiler se LOH size/fragmentation check karo, fix `ArrayPool<byte>` se buffer reuse hai.",
    detailedAnswer:
      "500KB arrays LOH pe jaate hain (85KB threshold se bahut bada). Repeated allocate/discard cycles LOH fragment kar sakte hain kyunki LOH by default compact nahi hota. Memory profiler (jaise dotnet-counters, dotMemory) se LOH size aur fragmentation percentage check karna pehla step hai. Agar confirm ho jaaye, fix typically `ArrayPool<byte>.Shared` use karke buffers ko rent/return karna hai instead of fresh allocation har request pe — isse LOH allocation churn khatm ho jaata hai.",
  },
  {
    id: "gc-gen-loh-tr-6",
    question: "Kya har GC collection poori heap scan karta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — Gen 0 collection sirf Gen 0 region scan karta hai. Poori heap sirf full (Gen 2) collection me scan hoti hai.",
    detailedAnswer:
      "Ye ek common misconception hai. GC collections generation-scoped hote hain — ek 'Gen 0 collection' sirf Gen 0 region check karta hai (chhota, fast). Ek 'Gen 1 collection' Gen 0 aur Gen 1 dono check karta hai. Sirf ek 'full' ya 'Gen 2' collection poori heap (Gen 0, 1, 2, aur LOH) scan karta hai — ye sabse expensive aur sabse rare hota hai. Ye hierarchy hi generational GC ko efficient banati hai.",
    redFlag: "'GC har baar poori heap check karta hai' bol dena — batata hai generational design ki basic samajh nahi hai.",
  },
  {
    id: "gc-gen-loh-tr-7",
    question: "LOH collections kab trigger hote hain — kya inka apna alag schedule hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "LOH collections Gen 2 collections ke saath hi trigger hote hain, apna separate independent schedule nahi hai.",
    detailedAnswer:
      "LOH conceptually Gen 2 ke saath collect kiya jaata hai — jab Gen 2 (full) collection chalta hai, LOH bhi usi cycle me process hota hai. Isliye bahut saare large-object allocations Gen 2 collection ki frequency ko bhi effectively badha sakte hain, jo already expensive collection ko aur zyada frequent bana deta hai — ye ek real performance concern hai high-allocation-rate services me.",
  },
  {
    id: "gc-gen-loh-tr-8",
    question: "Ye code consider karo:\n```csharp\nfor (int i = 0; i < 1000; i++)\n{\n    var buffer = new byte[100_000]; // 100KB\n    ProcessBuffer(buffer);\n}\n```\nIska GC pe kya impact hoga, aur better approach kya hai?",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Har 100KB array LOH pe allocate hoga (85KB se bada) — 1000 allocations LOH churn aur potential fragmentation create karenge. Better: `ArrayPool<byte>.Shared` se buffer rent/return karo.",
    detailedAnswer:
      "Har iteration me 100,000 bytes ka array 85KB threshold se bada hone ki wajah se LOH pe allocate hota hai, loop khatam hote hi (agar `ProcessBuffer` reference store nahi karta) garbage ban jaata hai. 1000 aisi allocations repeated LOH churn create karti hain, jo (a) Gen 2 collection frequency badha sakta hai, (b) fragmentation ka risk carry karta hai. Better approach: `ArrayPool<byte>.Shared.Rent(100_000)` se buffer lo, use ke baad `Return()` karo — isse actual allocation sirf pool-miss cases me hoti hai, LOH pressure drastically kam ho jaata hai.",
  },
];

export default questions;
