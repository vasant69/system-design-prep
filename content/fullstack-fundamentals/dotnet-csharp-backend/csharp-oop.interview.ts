import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "coop-1",
    question: "Polymorphism ka ek real faayda batao, sirf definition nahi.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ek call site (`method.Pay(amount)`) alag-alag concrete types ke liye alag behaviour chalata hai bina caller ko type jaane. Isse `switch`/`if (x is CreditCard)` chains khatam hoti hain aur naya type add karna existing code ko chhue bina ho jaata hai (open/closed).",
    detailedAnswer:
      "Concrete: ek `PaymentProcessor` jo `PaymentMethod` base type leta hai. `virtual Pay` har subclass me override hota hai. Naya `NetBanking` add karo — processor unchanged. Interface (`IRefundable`) optional capabilities ke liye: `if (method is IRefundable r) r.Refund(...)` — ye type check nahi, capability check hai.",
    followUp: "`virtual`/`override` aur `new` (method hiding) me kya farak hai?",
  },
  {
    id: "coop-2",
    question: "Encapsulation kis cheez se bachata hai? Ek concrete invariant do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Object ko invalid state me jaane se. `BankAccount` me `_balance` private hai aur sirf `Deposit`/`Withdraw` se badalta hai, jo `amount > 0` aur `balance >= amount` enforce karte hain. `_balance` public field hota to koi bhi `acc._balance = -5000` kar sakta.",
    detailedAnswer:
      "Encapsulation ka payoff sirf 'hiding' nahi — ye ek single choke point deta hai jahan rules lagte hain aur representation baad me badal sakti hai (decimal se ek Money type) bina callers ko toote. Auto-property `{ get; private set; }` ya `init` accessors iske modern tools hain.",
  },
  {
    id: "coop-3",
    question: "Base class constructor se `virtual` method call karna kyun khatarnak hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "C# me base constructor derived constructor body se pehle chalta hai, par virtual dispatch already derived override ko point karta hai. Toh override tab chalta hai jab derived class ke fields abhi initialise nahi hue — NullReferenceException ya galat behaviour.",
    detailedAnswer:
      "Example: base ctor `Initialize()` (virtual) call karta hai, derived override `_config.Value` use karta hai, par `_config` derived ctor me set hota hai jo abhi chala nahi. Fix: constructors se virtual calls avoid karo; setup ke liye ek explicit `Init()` method ya factory method use karo. Ye C++ se ulta hai jahan base ctor base version call karta.",
    redFlag: "Ye maan lena ki base ctor base version call karega — C# aur Java derived override call karte hain.",
  },
];

export default questions;
