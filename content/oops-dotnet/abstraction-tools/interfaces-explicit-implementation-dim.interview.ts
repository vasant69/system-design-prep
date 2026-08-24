import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "interfaces-dim-tr-1",
    question: "Explicit interface implementation kya hai, aur ye normal implementation se kaise alag hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Wipro"],
    shortAnswer: "Explicit implementation `void IFoo.Bar()` syntax use karta hai — koi access modifier nahi, aur member sirf IFoo reference se accessible hota hai, class reference se nahi.",
    detailedAnswer:
      "Normal implementation me `public void Bar()` likhte ho — ye interface ka contract bhi satisfy karta hai aur class ke public API me bhi seedha available hota hai. Explicit implementation me `void IFoo.Bar()` likhte ho — koi access modifier allowed nahi, aur ye member class ke apne type se call nahi ho sakta, sirf `IFoo` type ke reference (ya explicit cast) se accessible hota hai.",
    followUp: "Explicit implementation kab actually zaroori ho jaata hai — do concrete reasons batao.",
  },
  {
    id: "interfaces-dim-tr-2",
    question: "Explicit interface implementation kab use karoge — do genuine scenarios batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Do interfaces ke beech same-signature member collision resolve karne ke liye, aur ek member ko class ke public surface se hide karne ke liye.",
    detailedAnswer:
      "Reason 1 — collision: do interfaces (jaise IEmailSender aur ISmsSender) dono ek same-signature member define karte hain, aur ek class dono implement karti hai but har ek ke liye alag behavior chahiye — explicit implementation har interface ko apna khud ka resolution deta hai. Reason 2 — hiding: kabhi ek member sirf infrastructure/framework code ko chahiye (jaise IStartupTask.ExecuteAsync), application developer ko galti se seedha call karne se rokne ke liye explicit banaya jaata hai, taaki wo class ke public API me dikhe hi na.",
  },
  {
    id: "interfaces-dim-tr-3",
    question: "Default Interface Methods (DIM) kya hain, aur ye kab (kis C# version me) aaye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "C# 8 (2019) me aaye — interface methods ab ek default body de sakte hain, taaki naye members add karne se existing implementers na toote.",
    detailedAnswer:
      "Pehle interface me sirf signatures likh sakte the, koi implementation nahi. DIM ke saath, ek interface method ko default body de sakta hai. Real-world payoff: agar tumhara interface production me kai classes implement karti hain aur tumhe ek naya method add karna hai, DIM ke bina ye breaking change hoga (sab implementers turant compile error denge). DIM ke saath, naya method default body ke saath add karo — purani classes bina kuch change kiye compile hoti rehti hain, jinhe actual support chahiye wo explicitly override kar sakti hain.",
    followUp: "Kya DIM ka matlab ye hai ki ab abstract classes ki zaroorat khatam ho gayi?",
  },
  {
    id: "interfaces-dim-tr-4",
    question: "Ye code compile hoga? Agar haan, `gateway.Send(...)` seedha call karne par kya hoga?\n```csharp\npublic interface IEmailSender { void Send(string to, string body); }\npublic interface ISmsSender { void Send(string to, string body); }\n\npublic class NotificationGateway : IEmailSender, ISmsSender\n{\n    void IEmailSender.Send(string to, string body) => Console.WriteLine(\"Email\");\n    void ISmsSender.Send(string to, string body) => Console.WriteLine(\"SMS\");\n}\n\nvar gateway = new NotificationGateway();\ngateway.Send(\"x\", \"y\");\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — Send() class ke public surface pe available hi nahi hai, dono explicit hain.",
    detailedAnswer:
      "`gateway.Send(...)` seedha call nahi ho sakta kyunki dono Send() explicitly implement kiye gaye hain — koi bhi class ke apne public type se accessible nahi hai. Ise call karne ke liye pehle `IEmailSender` ya `ISmsSender` type ke reference me cast/assign karna padega — jaise `((IEmailSender)gateway).Send(\"x\", \"y\")` ya `IEmailSender es = gateway; es.Send(\"x\", \"y\")`.",
  },
  {
    id: "interfaces-dim-tr-5",
    question: "Ye compile hoga? `RazorpayGateway` ne `RefundAsync` implement nahi kiya:\n```csharp\npublic interface IPaymentGateway\n{\n    Task ChargeAsync(decimal amount);\n    Task RefundAsync(string txnId) => throw new NotSupportedException();\n}\n\npublic class RazorpayGateway : IPaymentGateway\n{\n    public Task ChargeAsync(decimal amount) => Task.CompletedTask;\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Haan, compile hoga — DIM ki wajah se RefundAsync ka default body milta hai automatically.",
    detailedAnswer:
      "RefundAsync() ek default implementation ke saath define kiya gaya hai (DIM), isliye RazorpayGateway ko ise implement karna optional hai. Class compile ho jaati hai. Agar koi code `((IPaymentGateway)razorpayGateway).RefundAsync(...)` call kare, interface ka default body chalega — jo NotSupportedException throw karega. Agar RazorpayGateway apna khud ka RefundAsync likhe, wo default ko override kar dega.",
    followUp: "Agar RazorpayGateway apna RefundAsync implement kare `public` (non-explicit) ke saath, kya wo class-level reference se bhi accessible hoga?",
  },
  {
    id: "interfaces-dim-tr-6",
    question: "Tumhara `ICacheable` interface hai jisme `Invalidate()` method hai. Ye sirf internal cache-refresh job ko chahiye — koi application developer ko galti se seedha call nahi karna chahiye. Design kaise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Invalidate() ko explicitly implement karo class me — public API se hat jaayega, sirf ICacheable reference se accessible rahega.",
    detailedAnswer:
      "`void ICacheable.Invalidate()` likho class ke andar. Ab `shipmentStatus.Invalidate()` compile hi nahi hoga — sirf infrastructure code jo `ICacheable` type ke reference ke through kaam karta hai (jaise cache-refresh background job) hi ise access kar sakta hai — `((ICacheable)shipmentStatus).Invalidate()`. Ye intentional API design hai, ek accidental-misuse-prevention technique.",
  },
  {
    id: "interfaces-dim-tr-7",
    question: "Tumhara team lead kehta hai 'library ke saare interfaces me DIM use karo taaki har jagah default implementation mil jaaye, kam code likhna padega.' Kya ye achi advice hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Nahi, blanket advice galat hai — DIM specifically backward-compatible API evolution ke liye hai, casually har jagah use karna unnecessary complexity add karta hai.",
    detailedAnswer:
      "DIM primarily framework/library authors ke liye design kiya gaya feature hai — jab tum widely-implemented public interfaces evolve kar rahe ho bina consumers ko todhe. Apni khud ki application ke andar, agar shared implementation chahiye, ek abstract class ya composition/helper class aksar zyada clear hota hai — kyunki interface abhi bhi state nahi rakh sakta, aur DIM ki ambiguity rules (diamond problem) complexity add karti hain jo application code me avoid karni chahiye.",
    redFlag: "'DIM = kam code' — ye DIM ke asli purpose (compatibility, not convenience) ko miss karta hai.",
  },
  {
    id: "interfaces-dim-tr-8",
    question: "Kya explicit interface implementation aur `private` method same cheez hain?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — explicit implementation koi access modifier nahi rakhta, aur ye interface reference ke through poori tarah accessible/public hota hai, sirf class-reference se chhupa hota hai.",
    detailedAnswer:
      "Ye ek common misconception hai. `private` member class ke bahar kahin se bhi accessible nahi hota, chahe kaisa bhi reference/cast ho. Explicit interface implementation is opposite hai — ye interface type ke reference se koi bhi external code call kar sakta hai (`((IFoo)obj).Bar()`), sirf class ke apne type se seedha access blocked hai. Ye 'visibility scoping,' 'access control' nahi hai.",
    redFlag: "'Explicit implementation encapsulation ke liye hai, private jaisa' — technically inaccurate, ye scoping hai, security/encapsulation nahi.",
  },
  {
    id: "interfaces-dim-tr-9",
    question: "Ek naya developer bolta hai: 'Ab jab DIM available hai, humein sab interfaces me har method ko default body de deni chahiye taaki implementers kabhi kuch implement karne ke liye majboor na hon.' Isme kya risk hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Ye interface ke poore contract-enforcement purpose ko weaken karta hai — implementers silently galat/incomplete behavior ke saath compile ho jaayenge.",
    detailedAnswer:
      "Interface ka poora point hai ek contract enforce karna — 'ye members tumhe implement karne HI hain.' Agar har member ko default body de do, implementers accidentally kuch bhi implement na karke bhi compile ho jaayenge, aur runtime pe unexpected default behavior mil sakta hai (jaise silently kuch na karna, ya galat exception). DIM ka use judicious hona chahiye — sirf genuinely optional ya backward-compat members ke liye, core contract members ko abstract (bina default body ke) hi rehne do.",
    redFlag: "'Sab methods ko default de do, flexibility badhegi' — actual risk ye hai ki contract enforcement khatam ho jaata hai, bugs silently slip karte hain.",
  },
];

export default questions;
