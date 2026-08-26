import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "behavioural-patterns-tr-1",
    question: "Observer pattern C# me kaise implement hota hai, aur kya hume ise manually implement karna padta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Swiggy"],
    shortAnswer: "Nahi — C# ka `event` keyword Observer pattern ka language-level implementation hai, manually hand-roll karne ki zaroorat nahi.",
    detailedAnswer:
      "Observer pattern ka core idea hai: ek subject apni state change hone par sabhi subscribed observers ko notify kare, bina unhe directly jaane. C# me ye `event` keyword ke through directly supported hai — subject ek `event EventHandler<T>` declare karta hai, observers `+=` se subscribe karte hain, aur subject `?.Invoke(...)` se sabko notify kar deta hai. Ye ek language-level feature hai, isliye Java jaisi languages ki tarah manually Observer interface/Subject class banane ki zaroorat C# me nahi padti.",
    followUp: "Agar ek observer exception throw kare event handler ke andar, baaki observers ka kya hoga?",
  },
  {
    id: "behavioural-patterns-tr-2",
    question: "Template Method aur Strategy pattern me kya difference hai, aur kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Template Method inheritance-based hai (kuch steps customizable, skeleton fixed); Strategy composition-based hai (poora algorithm swappable).",
    detailedAnswer:
      "Template Method: base class me algorithm ka poora sequence fix hota hai (jaise `FetchData -> FormatData -> Save -> Notify`), subclasses sirf individual abstract/virtual steps override karte hain — overall flow kabhi change nahi hota. Strategy: poora algorithm hi ek interchangeable object hota hai jo constructor/property ke through inject kiya jaata hai, runtime pe swap ho sakta hai. Template Method use karo jab structure fixed rakhna ho aur sirf kuch steps vary karne hon (jaise report generation ka flow same, data source alag). Strategy use karo jab poora approach hi runtime pe badalna ho (jaise different pricing algorithms).",
  },
  {
    id: "behavioural-patterns-tr-3",
    question: "Command pattern ka MediatR library se kya connection hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "MediatR ka IRequest/IRequestHandler Command pattern ka standardized, framework-level implementation hai.",
    detailedAnswer:
      "Command pattern ka core idea hai ek request (operation + uske parameters) ko ek standalone object me encapsulate karna, taaki usse decouple, queue, log, ya later execute kiya ja sake. MediatR isi idea ko formalize karta hai — `IRequest<TResponse>` command/query object banata hai, `IRequestHandler<TRequest, TResponse>` uska execution logic hold karta hai, aur `IMediator.Send()` dono ko wire karta hai bina caller ko handler ka direct reference lene diye. Ye Command pattern ka production-grade, CQRS-flavored version hai.",
  },
  {
    id: "behavioural-patterns-tr-4",
    question: "Chain of Responsibility pattern ka ek real .NET example do jo har developer ne already use kiya ho.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "ASP.NET Core middleware pipeline — har request handlers ki chain se guzarta hai, har handler independently decide karta hai handle karna hai ya next ko pass karna hai.",
    detailedAnswer:
      "`app.Use(...)`/`app.UseMiddleware<T>()` se register kiye gaye har middleware component ek chain link hai — request aata hai, har middleware decide karta hai (a) khud handle karke response return kare, (b) `next()` call karke chain me aage badhaye, ya (c) dono (kaam karo, phir aage bhi bhejo). Ye exactly Chain of Responsibility ka canonical structure hai. Detailed mechanism `oops-dotnet`'s `middleware-pipeline-chain-of-responsibility` topic me cover hota hai.",
  },
  {
    id: "behavioural-patterns-tr-5",
    question: "Ye code kya output dega?\n```csharp\npublic class Counter\n{\n    public event EventHandler? Incremented;\n    public void Increment() => Incremented?.Invoke(this, EventArgs.Empty);\n}\n\nvar c = new Counter();\nint count = 0;\nc.Incremented += (s, e) => count++;\nc.Incremented += (s, e) => count++;\nc.Increment();\nConsole.WriteLine(count);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "2 — do observers subscribe hue hain, `Increment()` ek baar call hone par dono trigger hote hain.",
    detailedAnswer:
      "`Incremented` ek multicast event hai — `+=` se do alag lambda handlers subscribe kiye gaye hain. `c.Increment()` call hone par `Incremented?.Invoke(...)` dono subscribed handlers ko sequentially invoke karta hai, har ek `count++` karta hai. Isliye `count` 2 print hoga. Ye Observer pattern ka multicast/broadcast nature demonstrate karta hai — ek single event raise, multiple independent reactions.",
  },
  {
    id: "behavioural-patterns-tr-6",
    question: "Kya ye statement sahi hai: 'Template Method pattern me subclass base class ke template method (jaise Generate()) ko bhi override kar sakti hai, koi restriction nahi hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Technically possible agar method sealed/non-virtual na ho, lekin ye pattern ke intent ko violate karta hai — template method ka poora point hi fixed sequence maintain karna hai.",
    detailedAnswer:
      "Agar template method (jaise `Generate()`) `virtual` hai aur subclass usko override kar deti hai, wo poore fixed-sequence guarantee ko break kar sakti hai — jo Template Method pattern ka core value proposition hai. Best practice: template method ko non-virtual rakho (ya `sealed override` agar intermediate class me hai), sirf individual steps (`FetchData`, `FormatData`) ko `abstract`/`virtual` banao. Interview me ye trap isliye hai kyunki C# syntactically override rokta nahi agar method virtual hai — discipline design se aati hai, language enforcement se nahi.",
    redFlag: "'Template method ko override karna bilkul normal hai' bolna bina ye samjhe ki iska side-effect kya hoga — batata hai pattern ka intent nahi samjha.",
  },
  {
    id: "behavioural-patterns-tr-7",
    question: "Ek shopping cart feature me 'undo last action' implement karna hai. Kaunsa pattern fit hoga, aur kaise design karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Command pattern — har action (add/remove item) ko ek IUndoableCommand object banao, executed commands ko stack me track karo, undo = top command ka Undo() call karna.",
    detailedAnswer:
      "`IUndoableCommand` interface banayenge jisme `Execute()` aur `Undo()` dono methods hon. Har user action (jaise `AddItemCommand`) is interface ko implement karega — `Execute()` item add karega, `Undo()` usse remove karega. Ek `Stack<IUndoableCommand>` executed commands track karega. Jab user 'undo' click kare, stack se top command pop karke uska `Undo()` call kiya jaayega. Ye Command pattern ka classic use case hai kyunki har operation ek self-contained, reversible object ban jaata hai.",
    followUp: "Multiple undo levels (redo bhi) support karna ho to design me kya add karoge?",
  },
  {
    id: "behavioural-patterns-tr-8",
    question: "Observer pattern (C# events) aur pub/sub messaging system (jaise a message queue) me kya fundamental difference hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "C# events in-process, synchronous, aur tightly-coupled-to-lifetime hain; pub/sub messaging systems distributed, typically async, aur decoupled-across-process-boundaries hote hain.",
    detailedAnswer:
      "C# ka `event` mechanism ek single process ke andar, same memory space me kaam karta hai — publisher aur subscriber dono ek hi application instance me exist karte hain, aur agar publisher garbage collect ho jaaye ya process crash ho, sab subscriptions bhi gone. Ek pub/sub messaging system (jaise RabbitMQ, Azure Service Bus, Kafka) processes/services ke beech, network ke through, typically asynchronously kaam karta hai — publisher aur subscriber independently deploy/scale/crash ho sakte hain. Dono Observer pattern ke conceptual variants hain, lekin scope aur coupling-level bahut alag hai — ek in-process design pattern hai, doosra ek distributed-systems architecture concern hai.",
  },
];

export default questions;
