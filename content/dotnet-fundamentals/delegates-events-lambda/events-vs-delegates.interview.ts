import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "events-delegates-tr-1",
    question: "Event aur delegate me exact fark kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Capgemini"],
    shortAnswer: "Event internally ek multicast delegate hi hai, lekin `event` keyword ek encapsulation layer add karta hai — bahar se sirf +=/-= allowed hai.",
    detailedAnswer:
      "Plain delegate field bahar se `=` assignment (poori list clear) aur direct invocation dono allow karta hai — encapsulation break karta hai. `event` keyword compiler-level restriction add karta hai: declaring class ke bahar se sirf `+=`/`-=` allowed hain, assignment aur invoke sirf class ke andar. Runtime mechanism same hai (Delegate.Combine/Remove) — ye ek language-level access-control feature hai, naya runtime construct nahi.",
    followUp: "Agar tum `event` na use karo aur plain delegate field use karo, kya practical problem aa sakti hai?",
  },
  {
    id: "events-delegates-tr-2",
    question: "Kya bahar se koi `pub.OnMessage = null;` likh sakta hai agar `OnMessage` ek `event` hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Nahi — compile error. `event` field ke bahar se sirf +=/-= allowed hai, direct assignment sirf declaring class ke andar.",
    detailedAnswer:
      "`event` keyword ke saath, C# compiler `=` assignment operator (aur direct invocation) ko sirf uss class ke andar allow karta hai jisme event declare hua hai. Bahar se koi bhi `= null` ya `= someHandler` likhne ki koshish karega to compile error milega: 'The event ... can only appear on the left hand side of += or -= (except when used from within the type ...)'.",
  },
  {
    id: "events-delegates-tr-3",
    question: "`EventHandler` aur `EventHandler<TEventArgs>` me kya fark hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "`EventHandler` (non-generic) plain `EventArgs` use karta hai (no extra data), `EventHandler<TEventArgs>` custom event-args class allow karta hai extra data carry karne ke liye.",
    detailedAnswer:
      "`EventHandler` ka signature `(object? sender, EventArgs e) -> void` hai — jab event ke saath koi extra data carry karne ki zaroorat nahi (`EventArgs.Empty` use hota hai). `EventHandler<TEventArgs>` generic hai — `TEventArgs` ko `EventArgs`-derived class se replace kiya ja sakta hai jisme custom properties ho (jaise `OrderPlacedEventArgs` me `OrderId`, `Amount`).",
  },
  {
    id: "events-delegates-tr-4",
    question: "Event subscriber ko unsubscribe karna kyun zaroori hai, aur agar na karein to kya hota hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Publisher subscriber ko internally rooted rakhta hai — agar unsubscribe nahi hua, subscriber garbage-collect nahi hota, memory leak hota hai.",
    detailedAnswer:
      "Jab `publisher.SomeEvent += subscriber.HandlerMethod;` hota hai, publisher ke internal invocation list me subscriber object ka reference store ho jaata hai (instance method ke Target ke through). Agar publisher lambe time tak alive rehta hai (jaise ek singleton service) aur subscriber `-=` se unsubscribe nahi karta, subscriber object ko GC collect nahi kar sakta chahe usse koi aur reference na ho — classic 'lapsed listener' memory leak.",
    followUp: "Isse avoid karne ke liye kya patterns exist karte hain (jaise WeakEventManager)?",
  },
  {
    id: "events-delegates-tr-5",
    question: "Callback aur event me kab kaunsa choose karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Callback jab ek direct, one-to-one 'jab khatam ho tab call karo' relationship ho. Event jab multiple, decoupled subscribers ek hi occurrence pe react karna ho aur publisher ko unke baare me pata na ho.",
    detailedAnswer:
      "Callback: ek method doosre method ko directly ek function pass karta hai expecting a specific, one-off response — jaise `DownloadFileAsync(url, onComplete: result => {...})`. Event: publisher sirf 'X hua' announce karta hai, khud ko koi idea nahi hota kaun sun raha hai — zero, ek, ya many subscribers ho sakte hain, aur naye subscribers baad me bina publisher ka code touch kiye add ho sakte hain. Decoupling chahiye ho aur multiple independent reactions ki zaroorat ho to event, warna simple direct case me callback sufficient hai.",
  },
  {
    id: "events-delegates-tr-6",
    question: "Agar `OnEvent?.Invoke(args)` execute hote waqt ek subscriber exception throw kare, baaki subscribers ka kya hoga?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Baaki subscribers call NAHI honge — event bhi internally multicast delegate hai, isliye same sequential-invocation-with-no-isolation behavior apply hota hai.",
    detailedAnswer:
      "Event ka `?.Invoke()` ultimately wahi multicast delegate invocation mechanism use karta hai jo plain `Action`/`Func` multicast delegate use karta hai — koi built-in per-subscriber exception isolation nahi hai. Agar list ke beech ka koi subscriber throw kare, uske baad ke subscribers skip ho jaate hain. Robust publish/subscribe code me, publisher `GetInvocationList()` se manually iterate karke har handler ko individual try-catch me wrap kar sakta hai.",
    redFlag: "Ye maan lena ki events automatically per-subscriber error isolation dete hain — actually wo bhi plain multicast delegates jaisa hi fragile behavior rakhte hain is regard me.",
  },
  {
    id: "events-delegates-tr-7",
    question: "`sender` parameter (`EventHandler`/`EventHandler<T>` ke first argument) ka practical use case kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ek shared/generic handler multiple publishers se aane wale events ko handle kar sake to `sender` se pata chalta hai kis object ne event fire kiya.",
    detailedAnswer:
      "Agar ek hi handler method multiple buttons ke `Click` event pe subscribe hai, `sender` parameter (jo `object`-typed hota hai, cast karke actual type nikalna padta hai) batata hai kaunsa specific button click hua — bina isse, handler ko ye differentiate karne ka koi built-in tareeka nahi hota, agar sab buttons wahi handler share kar rahe hain.",
  },
  {
    id: "events-delegates-tr-8",
    question: "Ek ride-hailing service me `RideAccepted` event pe teen subscribers hain — push notification, ETA calculation, analytics. Ek naya 'surge-pricing recalculation' feature add karna hai jab ride accept ho. Iske liye `RideService` class me kya change karna padega?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Kuch bhi nahi — bas naya handler `rideService.RideAccepted += RecalculateSurge;` se subscribe kar do. RideService ka source code untouched rehta hai.",
    detailedAnswer:
      "Ye exact event-driven design ka fayda hai — publisher (`RideService`) apne subscribers ke baare me kuch nahi jaanta, sirf 'RideAccepted' announce karta hai. Naya behavior add karne ke liye sirf ek naya `+=` subscription add karna hota hai kahin aur (jahan wiring set up hoti hai, jaise DI startup code me), `RideService` khud ko modify karne ki zaroorat nahi. Ye Open/Closed Principle ka ek practical, events-based demonstration hai.",
  },
];

export default questions;
