import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "lsp-tr-1",
    question: "LSP kya hai? Rectangle/Square example de kar samjhao.",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Amazon"],
    shortAnswer: "Derived type base type ki jagah substitute ho sakna chahiye bina behavior break kiye. Square, Rectangle se inherit karne par ye break karta hai.",
    detailedAnswer:
      "Square, Rectangle se inherit karta hai lekin Height set karne par Width bhi silently badal deta hai (square property maintain karne ke liye). Ek caller jo Rectangle-based code likhta hai aur assume karta hai Width/Height independent hain, Square substitute karne par galat result paata hai. Ye LSP violation hai kyunki compile hota hai lekin behavior contract todta hai.",
    followUp: "Iska sahi fix kya hai?",
  },
  {
    id: "lsp-tr-2",
    question: "Ye code kya print karega?\n```csharp\npublic void Resize(Rectangle r) { r.Width = 5; r.Height = 10; Console.WriteLine(r.Area()); }\nResize(new Square());\n```\n(Square class Width set karne par Height bhi sync karta hai aur vice-versa)",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "100, na ki expected 50 — Width=5 set hone ke baad Height=10 set hota hai jo Width ko bhi 10 kar deta hai.",
    detailedAnswer:
      "r.Width = 5 se Square ka Width aur Height dono 5 ho jaate hain (sync logic). Phir r.Height = 10 se dono 10 ho jaate hain. Area() = 10 * 10 = 100, jabki caller ka code (Rectangle-based) expect karta tha 5 * 10 = 50. Ye exactly wahi substitutability break hai jo LSP violate karta hai.",
    followUp: "Agar Resize() sirf Rectangle object ke saath call hota to kya result hota?",
  },
  {
    id: "lsp-tr-3",
    question: "Kya LSP violation compile-time pe pakda jaata hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — LSP violations valid, compiling code hote hain. Ye runtime behavior correctness ka issue hai.",
    detailedAnswer:
      "Compiler sirf structural/type correctness check karta hai — Square valid Rectangle hai type-hierarchy ke hisaab se. LSP violation behavioral hai — koi tool automatically detect nahi karta (kuch static analyzers heuristically try karte hain, lekin general case me nahi). Ye human judgment/design-review ka kaam hai, isliye interview me isko explicitly bolna important hai.",
    redFlag: "'Compiler LSP violations pakad leta hai' bolna — ye fundamentally galat hai aur samajh ki kami dikhata hai.",
  },
  {
    id: "lsp-tr-4",
    question: "Tumhare paas ek FileReader base class hai jiska Read() method kabhi exception nahi throw karta (documented behavior). Ek naya SecureFileReader subclass banaya gaya jo unauthorized path par UnauthorizedAccessException throw karta hai. Kya ye LSP violation hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Haan — ye precondition/postcondition strengthening hai. Existing callers jo 'Read() kabhi exception nahi throwega' assume karke likhe gaye the, crash ho sakte hain.",
    detailedAnswer:
      "SecureFileReader ne base class ke implicit contract ('never throws') ko violate kiya — ek naya exception-throwing behavior add kiya jo base type consumers expect nahi karte. Isse unhandled exceptions production me crash create kar sakte hain. Fix: ya to base contract me explicitly document karo ki exceptions possible hain (aur sab callers update karo), ya validation ko caller-side pehle hi handle karwao instead of subclass override me surprise add karna.",
    followUp: "Isko design-time hi kaise catch kar sakte the, code review ke through?",
  },
  {
    id: "lsp-tr-5",
    question: "Kya LSP violations sirf class inheritance me hote hain, ya interface implementations me bhi ho sakte hain?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Interface implementations me bhi hote hain — koi bhi implementation jo interface ke implicit behavioral contract se zyada restrictive ho, LSP violate karti hai.",
    detailedAnswer:
      "Ye ek common misconception hai ki LSP sirf class-inheritance topic hai. Example: INotificationService.SendAsync() ka koi length restriction nahi hai contract me, lekin agar SmsNotificationService implementation extra restriction (160-char limit) add karke exception throw kare, aur koi caller EmailNotificationService assume karke likha gaya ho, to substitution break hoti hai — same LSP violation, bas interface ke through.",
    redFlag: "'LSP sirf class hierarchies ke liye hai, interfaces safe hain' — ye galat hai.",
  },
  {
    id: "lsp-tr-6",
    question: "Ek LSP violation ko identify karne ke teen generic signals kya hain (Rectangle/Square-specific na ho kar)?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Strengthened preconditions, weakened postconditions, aur unexpected side effects/exceptions jo base contract me nahi the.",
    detailedAnswer:
      "1) Precondition strengthening — derived class ek method call hone ke liye MORE conditions demand karta hai (jaise SecureFileReader ka path-check). 2) Postcondition weakening — derived class LESS guarantee return karta hai jo base promise karta tha. 3) Unexpected side effects — derived override kuch aisa extra karta hai jo base ke contract me implied nahi tha (jaisa Square ka Width/Height sync). Kisi bhi ek ka present hona LSP violation ka strong signal hai.",
    followUp: "In teeno signals ko ek real code review checklist me kaise use karoge?",
  },
  {
    id: "lsp-tr-7",
    question: "'is-a' relationship (jaise 'Square is-a Rectangle') OOP inheritance ke context me kya matlab rakhta hai jo mathematics se alag hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "OOP me 'is-a' ka matlab 'behaviorally substitutable hai,' sirf data/structure ka 'is-a' nahi jaisa mathematics me hota hai.",
    detailedAnswer:
      "Mathematically 'square is-a rectangle' bilkul sahi hai (structural/data-level truth). Lekin OOP inheritance ka 'is-a' ek stronger claim hai — 'jahan bhi base type use hota hai, wahan derived type substitute ho sakta hai bina behavior toote.' Ye distinction hi Rectangle/Square example ka poora point hai — mathematically sahi 'is-a' bhi OOP me galat inheritance choice ho sakta hai.",
    redFlag: "'Mathematically sahi hai isliye inheritance bhi sahi hai' — ye exact wahi trap hai jo interviewer test kar raha hai.",
  },
  {
    id: "lsp-tr-8",
    question: "Fix karo: is code me Square, Rectangle se inherit karta hai aur LSP violate karta hai. Full working, LSP-compliant redesign likho.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer: "IShape interface banao jisme sirf Area() ho; Rectangle aur Square dono independently implement karein, koi ek dusre se inherit na kare.",
    detailedAnswer:
      "```csharp\npublic interface IShape\n{\n    int Area();\n}\n\npublic class Rectangle : IShape\n{\n    public int Width { get; set; }\n    public int Height { get; set; }\n    public int Area() => Width * Height;\n}\n\npublic class Square : IShape\n{\n    public int Side { get; set; }\n    public int Area() => Side * Side;\n}\n```\nAb dono independent hain — Square ka apna Side property hai, Rectangle ka Width/Height. Koi bhi caller jo IShape expect karta hai, dono ko safely substitute kar sakta hai kyunki IShape ka contract sirf Area() hai, jo dono correctly implement karte hain.",
  },
];

export default questions;
