import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "oop-intro-tr-1",
    question: "OOP kya hai, aur .NET isko kaise implement karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer:
      "OOP ek paradigm hai jisme program ko objects (state + behavior) ke through model karte hain; .NET isko CLR level pe enforce karta hai — har type System.Object se derive karta hai.",
    detailedAnswer:
      "OOP procedural style se alag hai kyunki data aur usko modify karne wale behavior ko ek object ke andar bundle kar deta hai, isolated boundaries ke saath. .NET me ye sirf ek coding style nahi hai — CTS (Common Type System) ye enforce karta hai ki har reference type aur value type ultimately System.Object se derive kare. Isi wajah se ek int variable pe bhi .ToString() call ho sakta hai.",
    followUp: "Achha, to value types aur reference types me exact difference kya hai memory ke level pe?",
  },
  {
    id: "oop-intro-tr-2",
    question: "System.Object ka role kya hai .NET type system me?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ye poore CLR type system ka single root hai — har type, chahe class ho ya struct, ultimately isi se derive karta hai.",
    detailedAnswer:
      "System.Object 4 methods deta hai har type ko: ToString(), Equals(), GetHashCode(), GetType(). Reference types isse directly ya indirectly (via inheritance chain) derive karte hain. Value types (structs, jaise int, bool) System.ValueType ke through derive karte hain, jo khud System.Object se aata hai. Ye single-root design multi-language interop enable karta hai — C#, F#, VB.NET sab same object model share karte hain, isliye ek language ka object doosri me seedha use ho sakta hai.",
    followUp: "To phir int aur ek custom class me structurally kya fundamental difference hai agar dono System.Object se hi aate hain?",
  },
  {
    id: "oop-intro-tr-3",
    question: "Modern ASP.NET Core code me OOP kaise apply hota hai — deep inheritance ya kuch aur?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Zyadatar interfaces + composition + dependency injection ke through, deep class hierarchies ke through nahi.",
    detailedAnswer:
      "Ek controller directly OrderService class pe depend nahi karta — wo IOrderService interface pe depend karta hai, aur actual implementation DI container inject karta hai. Ye abstraction + polymorphism ka real-world use hai, lekin inheritance chain ki jagah composition (interfaces ko implement karna, dependencies ko inject karna) prefer kiya jaata hai kyunki deep inheritance fragile ho jaata hai — base class ka koi change neeche har derived class ko unpredictably affect kar sakta hai.",
    redFlag: "Ye bolna ki 'OOP matlab bade inheritance hierarchies banana' — modern .NET codebases isse actively avoid karte hain.",
  },
  {
    id: "oop-intro-tr-4",
    question: "Class aur Object me exact difference kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Class ek blueprint/template hai; object uska ek actual instance hai jo memory me exist karta hai apne independent state ke saath.",
    detailedAnswer:
      "Class sirf ek definition hai — kaunse fields honge, kaunse methods honge — compile time pe likhi jaati hai, khud memory nahi leti (runtime metadata alag baat hai). Jab `new BankAccount()` call karte ho, ek object banta hai — actual memory me ek instance jiska apna independent state hota hai. Do alag objects same class se ban sakte hain lekin unka data completely independent rehta hai — ek ka Balance update karne se doosre ka nahi badalta.",
    redFlag: "Interview me 'class' aur 'object' ko casually interchange karke bolna — chhota slip lagta hai lekin concepts crisp na hone ka signal deta hai.",
  },
  {
    id: "oop-intro-tr-5",
    question: "Ye code kya print karega?\n```csharp\nvar acc1 = new BankAccount { Owner = \"Asha\" };\nvar acc2 = new BankAccount { Owner = \"Rohit\" };\nacc1.Deposit(500);\nConsole.WriteLine(acc1.Balance);\nConsole.WriteLine(acc2.Balance);\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "500 phir 0 — har object apna independent state carry karta hai.",
    detailedAnswer:
      "acc1 aur acc2 dono BankAccount class ke alag-alag instances hain. acc1.Deposit(500) sirf acc1 ka Balance field modify karta hai — acc2 ka Balance untouched rehta hai, kyunki dono objects ka memory alag hai chahe class definition same ho. Ye exactly wahi cheez hai jo class-vs-object distinction demonstrate karti hai.",
  },
  {
    id: "oop-intro-tr-6",
    question: "Ye compile hoga ya error dega, aur kyun?\n```csharp\nint x = 42;\nobject o = x;\nConsole.WriteLine(o.ToString());\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile hoga aur '42' print karega — boxing ho rahi hai, koi error nahi.",
    detailedAnswer:
      "int System.Object se (via System.ValueType) derive karta hai, isliye int ko object variable me assign karna valid hai — CLR isko 'boxing' karta hai, value ko heap par ek object wrapper me daal deta hai. ToString() call bilkul kaam karega kyunki ye System.Object se inherited method hai. Compile-time koi error nahi, lekin runtime pe ek heap allocation hoti hai jo pure reference-type assignment nahi karta.",
    followUp: "Boxing ka perf impact kitna real hai — kab worry karna chahiye iske baare me?",
  },
  {
    id: "oop-intro-tr-7",
    question: "Ye output kya hoga?\n```csharp\npublic class Counter { public int Value; }\n\nvoid Increment(Counter c) => c.Value++;\n\nvar counter = new Counter { Value = 0 };\nIncrement(counter);\nIncrement(counter);\nConsole.WriteLine(counter.Value);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "2 — Counter ek reference type (class) hai, isliye method ke andar modify karne se original object hi change hota hai.",
    detailedAnswer:
      "Counter class hai, isliye reference type hai. Jab counter ko Increment() method me pass kiya jaata hai, reference (pointer to the same object) copy hoti hai — value nahi. Method ke andar c.Value++ usi original object ko modify karta hai jo caller ke paas hai. Do baar call karne se Value 0 se 2 ho jaata hai. Agar Counter struct hota (value type), to har call ek copy pe operate karta aur original counter.Value 0 hi rehta.",
  },
  {
    id: "oop-intro-tr-8",
    question: "Tumhare paas ek Order class hai jisme sab fields public hain, aur kisi bhi jagah se koi bhi code directly Order.Total ko modify kar sakta hai. Iska kya risk hai, aur OOP isko kaise solve karta?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Uncontrolled mutation risk hai — koi bhi code invalid state bana sakta hai; encapsulation (private fields + controlled methods) isse solve karta hai.",
    detailedAnswer:
      "Agar Total public field hai, koi bhi caller directly `order.Total = -500` jaisa invalid value set kar sakta hai, koi validation ke bina. Isse business rules silently violate ho sakte hain. Solution: Total ko private field banao, aur sirf controlled methods (jaise ApplyDiscount(), AddItem()) ke through hi update hone do — jisme validation logic ho sakta hai. Ye encapsulation ka core purpose hai — data ko uske apne rules ke saath protect karna.",
    followUp: "Ye C# me kaise implement karoge — ek property ke saath ya method ke saath?",
  },
  {
    id: "oop-intro-tr-9",
    question: "Production me ek payment gateway integration hai jo abhi Razorpay use karta hai. Business ne bola kal PayU pe switch karna pad sakta hai. OOP principles use karke aisa design kaise karoge ki switch minimal-effort ho?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ek IPaymentGateway interface define karo, RazorpayGateway aur PayUGateway dono isko implement karein, controller/service sirf interface pe depend kare.",
    detailedAnswer:
      "Abstraction + polymorphism ka classic use case hai. IPaymentGateway interface me common methods define karo (jaise InitiatePayment, VerifyPayment). RazorpayGateway aur PayUGateway dono isko apne-apne tareeke se implement karte hain. Baaki application code (controller, order service) sirf IPaymentGateway pe depend karta hai — DI container decide karta hai runtime pe kaunsi concrete implementation use ho. Switch karne ke liye sirf DI registration line change karni padti hai, business logic touch nahi hota.",
    redFlag: "Directly RazorpayGateway class ko controller me hardcode karna 'kyunki abhi to yahi use ho raha hai' — ye future switch ko expensive bana deta hai.",
  },
  {
    id: "oop-intro-tr-10",
    question: "Kya ye statement sahi hai: 'C# me sab kuch object hai, isliye int aur ek custom class same tarah behave karte hain'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Partially sahi hai — dono System.Object se derive karte hain, lekin unka default memory behavior fundamentally alag hai (value type vs reference type).",
    detailedAnswer:
      "Ye ek classic trap statement hai. Haan, technically int System.Object se (System.ValueType ke through) derive karta hai, isliye 'sab kuch object hai' ka claim type-hierarchy ke level pe sahi hai. Lekin behavior me bahut fark hai: int ek value type hai — default me stack pe allocate hota hai (ya container ke andar inline), aur assignment/pass karne par poori value copy hoti hai. Custom class ek reference type hai — heap pe allocate hoti hai, assignment/pass karne par sirf reference copy hoti hai. Isliye 'same tarah behave karte hain' part galat hai — ye ek common misconception hai jo interviewer specifically probe karta hai.",
    redFlag: "Bina caveat ke 'haan sab object hai, sab same behave karta hai' bol dena — isse turant lagta hai ki value-vs-reference type distinction clear nahi hai.",
  },
];

export default questions;
