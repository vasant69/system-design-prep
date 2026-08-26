import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "microservices-monolith-tr-1",
    question: "Monolith aur microservices architecture me fundamental difference kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Flipkart"],
    shortAnswer: "Monolith ek single deployment unit hai jahan components in-process calls se baat karte hain; microservices independently deployable services hain jo network calls se baat karte hain.",
    detailedAnswer:
      "Monolith me poora application — API, business logic, data access — ek hi codebase, ek hi build, ek hi deployment unit hota hai, typically ek hi database ke saath, aur components ke beech calls in-process method calls hote hain (fast, almost-never-fail, ACID-transactional). Microservices me application multiple independent services me split hota hai, har service apna deployment aur typically apna database rakhta hai, aur services network calls (HTTP/gRPC/message queue) ke through baat karte hain — slower, aur genuinely failure-prone.",
    followUp: "Ek chhoti team ke liye tum kaunsa recommend karoge, aur kyun?",
  },
  {
    id: "microservices-monolith-tr-2",
    question: "Microservices architecture ki genuine cost/downsides kya hain jo monolith me nahi hoti?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Network calls fail ho sakte hain, ACID transactions ki jagah eventual consistency, aur significant operational overhead (deployment/monitoring/tracing per service).",
    detailedAnswer:
      "Teen main costs: (1) Network calls jahan pehle method calls the — timeout, service-down, ya network-partition se fail ho sakte hain, jo poore application ko explicitly retries/circuit-breakers handle karne padte hain. (2) ACID transactions ki jagah eventual consistency — cross-service data updates ke liye Saga jaisi distributed-transaction patterns chahiye, aur data temporarily inconsistent state me reh sakta hai. (3) Operational overhead — har service ka apna deployment pipeline, monitoring, logging, health check; distributed tracing ek nayi problem hai jo monolith me exist hi nahi karti thi, aur local development bhi zyada complex ho jaata hai (multiple services ek saath run karni padti hain).",
  },
  {
    id: "microservices-monolith-tr-3",
    question: "'Monolith-first' approach kya hai, aur is pattern ka koi real-world example do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Naye project ko monolith se shuru karna, genuine organizational/scaling problems aane par selectively microservices me split karna — Amazon isi approach ka widely-cited example hai.",
    detailedAnswer:
      "Shuru me business requirements aur service boundaries clear nahi hote — galat boundaries draw karna aur baad me fix karna (do live services ke beech data-ownership untangle karna) monolith ke andar module refactor karne se kaafi zyada costly hai. Amazon apne early years me ek monolith the aur genuinely organizational scale (hazaaron engineers) justify karne ke baad hi split kiya — ye industry-wide widely-referenced example hai ki microservices ek starting point nahi, ek scaling response hain.",
  },
  {
    id: "microservices-monolith-tr-4",
    question: "Ek e-commerce monolith me Order place hone par Order aur Inventory dono ek hi `SaveChangesAsync()` call me update hote hain. Isi flow ko microservices me split kar diya jaaye (alag Order aur Inventory services, alag databases), to consistency guarantee kaise change hoga?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "ACID guarantee khatam ho jaata hai — ab do alag network calls/transactions hain, beech me temporary inconsistency ka window ban sakta hai, isliye Saga pattern jaisi approach chahiye hogi.",
    detailedAnswer:
      "Monolith me ek single database transaction dono updates (Order create, Inventory deduct) ko atomically commit karta tha — dono ya hote hain ya koi nahi. Microservices split ke baad, `Order Service` apni DB me order create karega, phir `Inventory Service` ko separately call/message karega inventory deduct karne ke liye — ye do alag operations hain, aur beech me agar Inventory call fail ho jaaye (network issue, service down), order created hai lekin inventory deduct nahi hui — temporary inconsistent state. Isse handle karne ke liye Saga pattern (choreography ya orchestration-based) use hota hai — agar ek step fail ho, compensating actions (jaise order cancel karna) trigger hote hain.",
    followUp: "Choreography-based aur orchestration-based Saga me kya difference hai?",
  },
  {
    id: "microservices-monolith-tr-5",
    question: "Kya ye statement sahi hai: 'Microservices hamesha better architecture hain, monolith outdated approach hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — dono context-dependent trade-offs hain. Microservices ek specific set of organizational/scaling problems solve karte hain, universal upgrade nahi.",
    detailedAnswer:
      "Ye ek classic interview trap hai jo candidates ki real understanding test karta hai. Microservices ka poora justification independent scaling aur independent deployment (large multi-team orgs ke liye) hai — agar ye problems exist hi nahi karte (chhoti team, unclear domain boundaries), microservices sirf distributed-systems complexity (network failures, eventual consistency, operational overhead) add karte hain bina proportional benefit ke. 'Monolith-first' industry me widely-agreed-upon default hai bilkul isi wajah se. Senior-level answer context-dependent hota hai, unconditional nahi.",
    redFlag: "'Hum microservices use karenge kyunki wo modern/scalable hai' jaisa justification bina specific organizational ya scaling problem identify kiye — buzzword-driven decision-making dikhata hai.",
  },
  {
    id: "microservices-monolith-tr-6",
    question: "Microservices architecture me service boundaries kaise draw karni chahiye, aur galat approach kya problem create karta hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Business capabilities ke around (Order, Payment, Inventory) draw karo, technical layers ke around nahi (UI, Database) — galat approach 'distributed monolith' create karta hai.",
    detailedAnswer:
      "Service boundaries business capabilities ke around draw karni chahiye taaki har service ek independently-deployable, independently-scalable unit ho jo apne domain ke saare concerns (API, logic, data) khud handle kare. Agar boundaries technical layers ke around draw ki jaayein (jaise ek 'UI Service' jo saari APIs expose kare aur ek 'Database Service' jo sirf data access kare), services ab bhi tightly coupled reh jaate hain — ek feature change ke liye multiple services touch karne padte hain — lekin ab additionally network-call latency aur failure-modes bhi jhelni padti hain. Ye 'distributed monolith' anti-pattern hai — saari microservices complexity, koi real microservices benefit nahi.",
  },
  {
    id: "microservices-monolith-tr-7",
    question: "Conway's Law microservices architecture decisions ko kaise influence karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Conway's Law kehta hai systems ki structure organization ki communication structure ko reflect karti hai — isliye service boundaries aksar team boundaries ke saath align honi chahiye.",
    detailedAnswer:
      "Conway's Law ka core idea hai: koi bhi organization jo system design karta hai, wo design us organization ke communication structure ki copy hoga. Practically, agar ek company me 5 independent teams hain jo alag business areas (Orders, Payments, Search, Inventory, Notifications) own karti hain, microservices split isi boundary ke around karna natural aur effective hota hai — har team apni service independently own/deploy karti hai bina doosri teams ko block kiye. Agar service boundaries team-structure se mismatch ho (jaise ek service jo do teams shared-own karti hain), coordination overhead badh jaata hai aur microservices ka independent-deployment benefit hi kam ho jaata hai.",
  },
  {
    id: "microservices-monolith-tr-8",
    question: "Ek startup apna MVP bana raha hai aur founder insist kar raha hai 'hum shuru se hi microservices banayenge kyunki future me scale karna hoga.' Isme kya risk hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Shuru me business domain clear nahi hota, isliye service boundaries galat draw hone ka high risk hai — jo baad me fix karna monolith refactor se kaafi zyada costly hota hai, aur team ko premature operational complexity bhi jhelni padti hai.",
    detailedAnswer:
      "MVP stage pe business requirements aur domain boundaries abhi evolve ho rahe hote hain — kaunsa data kis service ka hona chahiye, ye clarity genuinely time ke saath aati hai. Agar galat boundaries ke saath microservices bana di jaayein, baad me unhe fix karna (data ownership migrate karna do live, independently-deployed services ke beech) monolith ke andar sirf module-boundaries refactor karne se kaafi zyada painful hai. Additionally, team ko din 1 se hi operational complexity (multiple deployments, distributed tracing, service discovery) jhelni padti hai jab unki actual priority fast iteration honi chahiye thi. 'Monolith-first' isi risk ko avoid karne ke liye recommend kiya jaata hai — jab genuine scaling need aaye, tab selectively split karo.",
    followUp: "Agar founder phir bhi insist kare, tum kya compromise suggest karoge?",
  },
];

export default questions;
