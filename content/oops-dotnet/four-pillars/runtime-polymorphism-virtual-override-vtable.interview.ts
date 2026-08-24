import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "runtime-poly-tr-1",
    question: "Runtime polymorphism kya hai, aur C# me `virtual`/`override` se ye kaise achieve hota hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Base-typed reference se call karne par bhi actual (runtime) object ka overridden version chalta hai — base class method `virtual` mark hota hai, derived class `override` karti hai.",
    detailedAnswer:
      "`virtual` base class me batata hai ki ye method derived classes me redefine ho sakta hai. Derived class `override` se apna version deti hai. Jab base-typed reference se call hota hai (jaise `Shape s = new Circle(); s.Area();`), CLR runtime pe object ka ACTUAL type dekh kar sahi override choose karta hai — declared type (Shape) ka koi role nahi hota decision me.",
    followUp: "Ye 'kaise' achieve hota hai internally, CLR level pe?",
  },
  {
    id: "runtime-poly-tr-2",
    question: "Method table (vtable) kya hai, aur virtual dispatch me iska role kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Har type ki ek method table hoti hai jisme uske virtual methods ke actual implementation addresses hote hain. Object apni actual type ki table carry karta hai; har virtual call is table me lookup karta hai.",
    detailedAnswer:
      "CLR type-load time pe har type ke liye ek method table banata hai. Agar Circle, Shape.Area() override karta hai, to Circle ki table me Area slot Circle.Area implementation point karta hai. Runtime pe har object apne actual type ki table ka handle carry karta hai — reference variable ka declared type se koi lena dena nahi. Jab virtual method call hota hai, CLR object ke actual type ki table me relevant slot lookup karta hai aur wahan waali implementation invoke karta hai — yehi mechanism guarantee karta hai ki base-typed reference se bhi derived override chale.",
    followUp: "Ye lookup kitna expensive hai, aur JIT compiler kabhi isko optimize kar sakta hai?",
  },
  {
    id: "runtime-poly-tr-3",
    question: "Ye code kya print karega?\n```csharp\npublic class Shape { public virtual double Area() => 0; }\npublic class Circle : Shape { public override double Area() => 78.5; }\npublic class SpecialCircle : Circle { public override double Area() => base.Area() * 2; }\n\nShape s = new SpecialCircle();\nConsole.WriteLine(s.Area());\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "157 — SpecialCircle.Area() chalta hai (most-derived override), jo base.Area() (Circle.Area(), 78.5) ko 2 se multiply karta hai.",
    detailedAnswer:
      "`s` declared to Shape hai, lekin actual runtime type SpecialCircle hai — isliye SpecialCircle.Area() dispatch hoti hai (method table hamesha most-derived override point karti hai). SpecialCircle.Area() ke andar `base.Area()` explicitly Circle.Area() invoke karta hai (ek level upar, dynamic dispatch bypass karke), jo 78.5 return karta hai. 78.5 * 2 = 157.",
  },
  {
    id: "runtime-poly-tr-4",
    question: "Kya `virtual` method call `override` method call se slower hota hai? Explain karo.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Virtual call (jo runtime dispatch use karta hai) non-virtual call se thoda slower hota hai kyunki ek extra method-table lookup indirection involve hoti hai — lekin ye cost typically negligible hai.",
    detailedAnswer:
      "Non-virtual method call compile time pe hi resolve ho jaata hai — direct jump, koi lookup nahi. Virtual call me CLR ko pehle object ka actual type ki method table dhundhni padti hai, phir usme relevant slot lookup karna padta hai, tab jaake actual implementation invoke hoti hai. Ye ek extra indirection hai, lekin modern hardware pe nanoseconds ka difference hai — 99% real-world code isse affect nahi hota. JIT compiler kai cases me 'devirtualize' bhi kar sakta hai (jaise agar type statically provably known ho, ya class sealed ho) jisse ye cost bhi avoid ho jaata hai.",
    redFlag: "Ye bolna ki virtual calls ka 'koi cost nahi hota' — ye technically galat hai, senior interviewer isko pakad leta hai.",
  },
  {
    id: "runtime-poly-tr-5",
    question: "Tumhare paas ek `PaymentProcessor` abstract base class hai jisme `Process()` abstract hai, aur 3 concrete implementations (`UpiProcessor`, `CardProcessor`, `NetBankingProcessor`) hain. Checkout service ek `List<PaymentProcessor>` ke through loop karke sabko `Process()` call karta hai. Isme polymorphism kaise use ho raha hai, aur agar `abstract` ki jagah non-virtual method hota to kya toot jaata?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ye runtime polymorphism ka classic use hai — har processor apna sahi Process() implementation runtime pe execute karta hai. Agar non-virtual hota, sabke liye base class ka (agar hota) same behavior chalta, ya compile error aata (agar signature clash hoti bina virtual/override ke, agla topic dekho).",
    detailedAnswer:
      "`List<PaymentProcessor>` me alag-alag concrete types (UpiProcessor, CardProcessor, etc.) rakhe ja sakte hain kyunki sab PaymentProcessor se derive karte hain — ye abstraction hai. Loop me `processor.Process()` call karne par CLR har processor ke actual runtime type ki method table check karta hai aur sahi implementation invoke karta hai — ye polymorphism hai. Agar `Process()` abstract/virtual na hota (aur base class me koi concrete implementation hoti), to `override` use hi nahi ho sakta tha — derived classes 'new' se method hide kar sakti thin, lekin tab base-typed list se call karne par hamesha base class ka hi (galat) implementation chalta, jo poori tarah galat payment processing bug create karta.",
    followUp: "Agar kal ek naya `WalletProcessor` add karna ho, kya CheckoutService ka code kuch touch karna padega?",
  },
  {
    id: "runtime-poly-tr-6",
    question: "Ye kya print karega?\n```csharp\npublic abstract class Notification\n{\n    public abstract string Render();\n}\n\npublic class SmsNotification : Notification\n{\n    public override string Render() => \"SMS: OTP sent\";\n}\n\nList<Notification> notifications = new() { new SmsNotification() };\nforeach (var n in notifications)\n    Console.WriteLine(n.Render());\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "\"SMS: OTP sent\" — abstract Render() ko SmsNotification override karta hai, list element ka declared type Notification hone se koi farak nahi padta.",
    detailedAnswer:
      "`notifications` list `Notification` type ki hai, lekin har element ka actual runtime type wahi hai jo `new` se create hua (yahan SmsNotification). Loop me `n.Render()` call karne par CLR runtime dispatch se SmsNotification.Render() invoke karta hai — abstract method ka koi base implementation hai hi nahi jo galti se chal jaaye.",
  },
  {
    id: "runtime-poly-tr-7",
    question: "Ek naya developer kehta hai 'main sab methods ko `virtual` bana deta hoon by default, taaki flexibility rahe.' Kya ye achhi practice hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi, hamesha nahi — har method ko virtual banana unintended overriding allow karta hai (design contract break ho sakta hai future me), aur ek chhota (usually negligible, lekin fake-free-nahi) dispatch cost bhi add karta hai.",
    detailedAnswer:
      "Har method virtual banana 'open for extension by anyone, anytime' design signal deta hai — jo intentional API design ke against ja sakta hai. Agar ek method genuinely kabhi override hone ke liye intend nahi kiya gaya (jaise ek internal helper), use non-virtual rakhna behtar hai — ye compile-time guarantee deta hai ki behavior predictable rahega, aur JIT compiler ko devirtualize/inline karne ka better chance milta hai. Virtual sirf wahan use karo jahan genuinely extensibility intended ho — ye design decision hai, blanket rule nahi.",
    redFlag: "Bina kisi design justification ke 'sab kuch virtual rakho, extra flexibility milegi' bol dena — ye intentional API design vs accidental extensibility ke trade-off ko miss karta hai.",
  },
  {
    id: "runtime-poly-tr-8",
    question: "`sealed override` ka kya matlab hai, aur ye kab use karte ho?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Ek method ko override karte hue, aage kisi bhi deeper derived class ko usko FURTHER override karne se rokna — chain yahin lock ho jaati hai.",
    detailedAnswer:
      "`sealed override` do cheezein ek saath karta hai: pehla, ye current class me base ka behavior override karta hai (normal override); doosra, `sealed` keyword ye guarantee deta hai ki koi bhi neeche wali derived class isko dobara override nahi kar sakti — compile error dega agar koshish ki jaaye. Ye tab useful hai jab tumhe pata hai is level ka behavior FINAL hona chahiye (jaise ek security-critical validation method), aur intentionally future derived classes ko ise change karne se rokna hai. Bonus: JIT compiler ke liye ye ek devirtualization opportunity bhi khol deta hai us specific call site pe, kyunki ab guarantee hai ki koi aur override exist nahi karega.",
    followUp: "Agar tum poori class hi `sealed` kar do (na ki sirf ek method), kya farak padta hai?",
  },
];

export default questions;
