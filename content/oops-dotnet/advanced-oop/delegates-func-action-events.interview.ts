import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "delegates-tr-1",
    question: "Delegate kya hai, aur ise 'type-safe function pointer' kyun bola jaata hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer: "Delegate ek type jo ek ya zyada methods ko reference kar sakta hai jinka signature match karta ho — 'type-safe' isliye kyunki signature mismatch compile time pe hi catch ho jaata hai.",
    detailedAnswer:
      "Delegate ek reference type hai jo method(s) ko store aur invoke karne deta hai jaise wo values hon. C ke raw function pointers ke comparison me, C# delegates compile-time type checking enforce karte hain — agar method ka signature (parameters + return type) delegate type se match nahi karta, code compile hi nahi hoga. Ye undefined-behavior class of bugs ko eliminate karta hai jo raw pointers me possible hote hain.",
    followUp: "Func aur Action, custom delegate types se kaise alag hain?",
  },
  {
    id: "delegates-tr-2",
    question: "Func<>, Action<>, aur Predicate<> me kya fark hai — kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Func return value deta hai, Action nahi, Predicate<T> semantically Func<T,bool> jaisa hi hai (mostly legacy APIs me dikhta hai).",
    detailedAnswer:
      "Func<T1...TResult> tab use karo jab method kuch return karta ho — last type parameter return type hai. Action<T1...> tab use karo jab method void ho, kuch return na kare. Predicate<T> ek bool Predicate<T>(T obj) hai — functionally Func<T, bool> jaisa hi hai, lekin purani BCL APIs (jaise List<T>.Find/FindAll) me isko explicitly use kiya gaya hai historical reasons se. Naye code me generally Func<T, bool> hi zyada common hai.",
  },
  {
    id: "delegates-tr-3",
    question: "Ye kya print karega?\n```csharp\nAction<string> logger = msg => Console.WriteLine($\"A: {msg}\");\nlogger += msg => Console.WriteLine($\"B: {msg}\");\nlogger(\"test\");\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "A: test\\nB: test — dono methods multicast delegate ke through order me call hoti hain.",
    detailedAnswer:
      "Delegates inherently multicast hote hain. += operator dusri lambda ko pehle wali ke saath attach kar deta hai, replace nahi karta. logger(\"test\") call karne pe dono attached methods sequentially invoke hoti hain, attachment order me — pehle 'A: test', phir 'B: test'. Action void return karta hai isliye yahan koi return-value-discard gotcha nahi hai (wo sirf Func-type multicast delegates me hota hai).",
    followUp: "Agar ye Func<string, int> hota return value ke saath, to kya farak padta result me?",
  },
  {
    id: "delegates-tr-4",
    question: "Ye kya return karega?\n```csharp\nFunc<int> multi = () => 1;\nmulti += () => 2;\nmulti += () => 3;\nint result = multi();\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "3 — sirf last attached method ka return value milta hai, pehle do execute hote hain lekin unka result discard ho jaata hai.",
    detailedAnswer:
      "Ye classic multicast-delegate-with-return-value gotcha hai. Sab teeno lambdas actually EXECUTE hoti hain call ke dauran (side effects agar hon to sab honge), lekin caller ko sirf LAST attached method ka return value milta hai — yahan 3. Pehle do (1 aur 2) silently discard ho jaate hain. Agar sab results chahiye, GetInvocationList() se manually har delegate ko alag invoke karna padega.",
    redFlag: "Ye maan lena ki sabka result kisi tarah combine/aggregate ho jaata hai (jaise sum ya array) — koi automatic aggregation nahi hoti multicast delegates me.",
  },
  {
    id: "delegates-tr-5",
    question: "Kya ye compile hoga?\n```csharp\npublic class Publisher\n{\n    public event Action Notify;\n}\n\nvar p = new Publisher();\np.Notify();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — event ko class ke BAHAR se directly invoke nahi kiya ja sakta, sirf declaring class ke andar se.",
    detailedAnswer:
      "event keyword specifically ye restrict karta hai ki bahar se sirf += aur -= allowed hain. p.Notify() (direct invocation from outside) CS0070 compile error dega: 'The event can only appear on the left hand side of += or -= (except when used from within the type Publisher)'. Agar Notify() ek plain public Action field hota (event keyword ke bina), to ye bilkul valid hota — yahi exact fark hai jo event encapsulation deta hai.",
    followUp: "Agar tumhe Publisher class ke andar hi event ko safely invoke karna ho, kaunsa pattern use karoge null-reference se bachne ke liye?",
  },
  {
    id: "delegates-tr-6",
    question: "Tum ek OrderService bana rahe ho jisme order place hone pe email bhejna, inventory update karna, aur analytics log karna hai — teeno independent concerns hain. Delegates/events use karke isko kaise design karoge, aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "OrderService ek OrderPlaced event expose kare; email/inventory/analytics services independently isko subscribe karein — OrderService ko unke baare me kuch jaanne ki zaroorat nahi.",
    detailedAnswer:
      "```csharp\npublic class OrderService\n{\n    public event Action<Order>? OrderPlaced;\n\n    public async Task<Order> PlaceOrderAsync(CreateOrderDto dto)\n    {\n        var order = new Order(...);\n        // save order...\n        var handler = OrderPlaced;\n        handler?.Invoke(order);\n        return order;\n    }\n}\n```\nCompose root me: `orderService.OrderPlaced += email.Notify; orderService.OrderPlaced += inventory.Reserve;`. Ye Open/Closed Principle follow karta hai — naya subscriber (jaise ek future analytics service) add karne ke liye OrderService ka code touch nahi karna padta, sirf ek naya subscription line add hoti hai. Tight coupling (jaise OrderService khud EmailService ko directly call kare) avoid ho jaati hai.",
    followUp: "Agar ek subscriber exception throw kare (jaise EmailService down ho), baaki subscribers ka kya hoga?",
  },
  {
    id: "delegates-tr-7",
    question: "Production me ek OrderPlaced event hai jise multiple background workers subscribe karte hain, aur workers ka lifecycle order service se chhota hai (worker dispose ho jaata hai lekin unsubscribe nahi karta). Kya risk hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Memory leak jaisa pattern — OrderService (jo longer-lived hai) worker object ko reference hold kiye rehta hai event subscription ke through, isliye worker garbage collect nahi ho pata chahe uska koi aur use na ho.",
    detailedAnswer:
      "Event subscription ek reference create karta hai publisher se subscriber tak (delegate internally target object ko hold karta hai). Agar OrderService (publisher) subscriber se zyada der tak live rehta hai, aur subscriber ne -= karke explicitly unsubscribe nahi kiya apne dispose/cleanup ke waqt, to OrderService ka event delegate abhi bhi subscriber ko reference kiye hue hai — GC usse collect nahi kar sakta, chahe application ke baaki hisse me uska koi use na ho. Fix: subscriber ke Dispose()/cleanup logic me explicitly OrderPlaced -= handler karna chahiye — ye ek classic '.NET event memory leak' pattern hai.",
    followUp: "Weak event pattern kya hota hai, aur ye is problem ko kaise address karta hai?",
  },
  {
    id: "delegates-tr-8",
    question: "Kya ye statement sahi hai: 'event sirf delegate ka ek alias hai, functionally koi difference nahi'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — event access ko restrict karta hai (sirf +=/-= bahar se), plain delegate field bahar se freely invoke aur reassign ho sakta hai.",
    detailedAnswer:
      "Ye ek common oversimplification hai. Syntactically event ek delegate field jaisa hi dikhta hai, lekin compiler iske access ko significantly restrict karta hai: bahar se sirf += aur -= allowed hain, direct invocation (obj.SomeEvent(args)) aur direct assignment (obj.SomeEvent = handler, jo sab existing subscribers ko silently clear kar deta) — dono compile-time errors hain jab bahar se try kiye jaayein. Ye encapsulation ka delegate-specific application hai — bina iske, koi bhi external code accidentally (ya maliciously) sab subscribers clear kar sakta tha ek simple assignment se.",
    redFlag: "Interview me event aur delegate ko poori tarah interchangeable bol dena — ye encapsulation payoff ko completely miss karta hai jo event ka poora point hai.",
  },
];

export default questions;
