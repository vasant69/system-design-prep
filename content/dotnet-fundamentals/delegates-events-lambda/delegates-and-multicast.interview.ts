import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "delegates-multicast-tr-1",
    question: "Delegate kya hota hai C# me, aur ye function pointer se kaise alag hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer:
      "Delegate ek type-safe, object-oriented method reference hai — C/C++ ke raw function pointer jaisa kaam karta hai, lekin compile-time signature checking ke saath.",
    detailedAnswer:
      "Delegate `System.MulticastDelegate` se derive hota hai aur ek 'contract' define karta hai — kaunsa return type, kaunse parameters. Sirf usi signature ka method delegate variable ko assign ho sakta hai, jo compile-time pe verify hota hai. Raw function pointer (C/C++) me koi type-safety nahi hoti, kuch bhi memory address ho sakta hai. Delegate ke saath, invalid assignment compile hi nahi hoga.",
    followUp: "Delegate declare karne ke 3 tarike kya hain?",
  },
  {
    id: "delegates-multicast-tr-2",
    question: "Multicast delegate kya hai, aur `+=`/`-=` internally kya karte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ek delegate jisme multiple methods subscribed hote hain, invocation list ke through. `+=` = `Delegate.Combine()`, `-=` = `Delegate.Remove()`.",
    detailedAnswer:
      "`System.MulticastDelegate` ek internal invocation list maintain karta hai. `+=` operator `Delegate.Combine()` call karta hai jo ek naya delegate banata hai jisme pehle wali list + naya method dono ho — kyunki delegates immutable hain. `-=` similarly `Delegate.Remove()` ke through kaam karta hai. Invoke karne par list ke sab methods sequentially, order me call hote hain.",
  },
  {
    id: "delegates-multicast-tr-3",
    question: "Agar ek multicast delegate `int` return karta hai aur 3 methods subscribed hain, caller ko kya milta hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Sirf LAST subscribed method ka return value — baaki 2 ke return values silently discard ho jaate hain.",
    detailedAnswer:
      "Invocation list ke sab methods call hote hain (side-effects sabke honge), lekin overall delegate invocation ka return value sirf list ke aakhri (last-added) method ka hota hai. Beech ke methods ke return values kahin store nahi hote, silently lost ho jaate hain. Isliye return-value-wale kaam ke liye multicast delegate risky hai — agar sab return values chahiye, `GetInvocationList()` se manually har delegate invoke karna padega.",
    followUp: "To phir sab return values kaise collect karoge?",
  },
  {
    id: "delegates-multicast-tr-4",
    question: "Multicast delegate ke ek subscriber me exception aaye to kya hota hai baaki subscribers ka?",
    type: "scenario",
    difficulty: "advanced",
    askedAt: ["Accenture"],
    shortAnswer: "Invocation list wahin ruk jaati hai — jo subscribers exception ke baad list me hain, wo kabhi call nahi hote.",
    detailedAnswer:
      "Multicast delegate invocation ek simple sequential loop ki tarah kaam karta hai — koi built-in try-catch-per-subscriber nahi hai. Agar dusra subscriber exception throw kare, teesra aur uske baad ke sab subscribers skip ho jaate hain, exception caller tak propagate ho jaata hai. Production code me isse bachne ke liye `GetInvocationList()` se manually iterate karke har delegate ko individual try-catch me wrap karna best practice hai.",
    redFlag: "Ye maan lena ki multicast delegate automatically har subscriber ko isolate karta hai — asal me ek failure poori chain rok deta hai.",
  },
  {
    id: "delegates-multicast-tr-5",
    question: "Ye code kya print karega?\n```csharp\npublic delegate void Notify(string msg);\nNotify n = null;\nn += (msg) => Console.WriteLine(\"A: \" + msg);\nn += (msg) => Console.WriteLine(\"B: \" + msg);\nn(\"hi\");\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"A: hi\" phir \"B: hi\" — dono lambdas subscribed hain, order me call hote hain.",
    detailedAnswer:
      "`n` null se shuru hota hai, `+=` null delegate ke saath bhi kaam karta hai (Combine null-safe hai — pehla `+=` seedha assignment jaisa behave karta hai). Dono lambda expressions invocation list me add ho jaate hain, `n(\"hi\")` call karne par order me dono execute hote hain — pehle A, phir B.",
  },
  {
    id: "delegates-multicast-tr-6",
    question: "`-=` se ek subscribed method ko remove karna kabhi kaam nahi karta — ye kis scenario me ho sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Jab remove karne ki koshish kiya gaya delegate reference-equal na ho subscribe kiye gaye se — jaise ek naya lambda jo dikhta same hai lekin alag instance hai.",
    detailedAnswer:
      "`-=` (`Delegate.Remove`) reference/value equality check karta hai invocation list ke entries ke against. Agar subscribe karte waqt ek inline lambda use kiya gaya tha, aur remove karte waqt ek NAYA lambda likha jaaye jo identical dikhta hai lekin compiler-generated ek alag delegate instance hai, to `-=` silently kuch remove nahi karega (koi error bhi nahi aata). Fix: subscribe/unsubscribe dono jagah ek hi named method ya stored delegate variable use karo.",
    redFlag: "Event/delegate unsubscribe karte waqt naya inline lambda likhna jo original subscribe wale se syntactically same dikhta ho — memory leak aur silent no-op dono ka risk.",
  },
  {
    id: "delegates-multicast-tr-7",
    question: "Static method aur instance method — dono ek hi delegate type ko assign ho sakte hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Haan — delegate assignment sirf signature match karne pe depend karta hai, static ya instance hone se koi farak nahi padta.",
    detailedAnswer:
      "`public delegate int Op(int a, int b);` ko koi bhi static ya instance method assign ho sakta hai jiska signature `int(int, int)` ho. Instance method ke liye delegate internally uss object instance ka reference bhi store karta hai (`Target` property), taaki invoke karte waqt sahi instance pe call ho.",
  },
  {
    id: "delegates-multicast-tr-8",
    question: "`GetInvocationList()` kab use karoge, aur ye kya return karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Jab tumhe multicast delegate ke sab subscribers ke return values chahiye ho, ya har subscriber ko individually error-isolate karna ho. Ye `Delegate[]` array return karta hai.",
    detailedAnswer:
      "`GetInvocationList()` invocation list ke sab delegates ko ek `Delegate[]` array me return karta hai, jisse tum manually foreach karke har ek ko individually invoke kar sakte ho — har ek ka return value capture kar sakte ho, aur har ek ko apne try-catch me wrap kar sakte ho taaki ek failure baaki ko block na kare.",
  },
  {
    id: "delegates-multicast-tr-9",
    question: "Ek payment service me transaction complete hone par audit-log, SMS, aur analytics — teeno ek multicast `Action<Transaction>` delegate se trigger ho rahe hain. SMS method exception throw karta hai, analytics kabhi call nahi hota. Isko kaise fix karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "`GetInvocationList()` se manually iterate karo, har subscriber ko individual try-catch me wrap karo taaki ek failure baaki subscribers ko block na kare.",
    detailedAnswer:
      "Root cause: multicast delegate invocation sequential hai bina per-subscriber error isolation ke. Fix: `foreach (var d in notify.GetInvocationList()) { try { ((Action<Transaction>)d).Invoke(txn); } catch (Exception ex) { LogError(ex); } }` — is pattern se har subscriber independently run hota hai, ek ka fail hona baaki ko affect nahi karta.",
  },
  {
    id: "delegates-multicast-tr-10",
    question: "`event` keyword aur plain delegate field me kya relationship hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`event` ek constrained wrapper hai delegate ke upar — internally wahi multicast delegate mechanism use karta hai, bas external access restrict karta hai.",
    detailedAnswer:
      "Jab tum `public event Notify OnComplete;` likhte ho, compiler internally ek private multicast delegate field banata hai, aur bahar sirf `+=`/`-=` allow karta hai (declaring class ke bahar se `=` assignment ya `Invoke()` call nahi ho sakta). Isliye events isi delegate/multicast mechanism ka ek disciplined, encapsulated version hain — ek dedicated topic me isko poora explore karenge.",
    followUp: "Agar event ek plain public delegate field hota (event keyword ke bina), to kya problem aa sakti thi?",
  },
];

export default questions;
