import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "rapid-fire-tr-1",
    question: "Rapid-fire: Struct ya class — agar keyword hi na likhein to default kya milta hai?",
    type: "trap",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Trick question — keyword likhna hi mandatory hai, koi default exist nahi karta, bina keyword ke syntax hi invalid hai.",
    detailedAnswer:
      "Bahut candidates is question ko sun ke sochte hain 'class default hai' — lekin actual reality ye hai ki C# me `struct` ya `class` keyword explicitly likhna hi zaroori hai type define karne ke liye. Bina keyword ke code compile hi nahi hoga, isliye 'default' jaisa koi concept yahan applicable nahi hai — ye khud ek trap hai jo sirf assumption test karta hai.",
  },
  {
    id: "rapid-fire-tr-2",
    question: "Rapid-fire: private protected aur protected internal me kya farak hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "private protected = intersection (protected AND internal); protected internal = union (protected OR internal).",
    detailedAnswer:
      "private protected sabse restrictive hai in dono me — access sirf tab milta hai jab code same assembly ke andar ho AND ek derived class ho, dono conditions ek saath chahiye. protected internal zyada permissive hai — same assembly ka koi bhi code, YA kisi bhi assembly ki derived class, in dono me se ek condition kaafi hai. Naming bahut similar sound karti hai isliye ye sabse common mix-up hai access modifiers me.",
    followUp: "Ek code example do jo protected internal ke saath compile ho lekin private protected ke saath na ho.",
  },
  {
    id: "rapid-fire-tr-3",
    question: "Rapid-fire: Method hiding (new) aur overriding (override) me, base-class-reference se call karne par kya difference aata hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Hiding compile-time (static) type se resolve hota hai, overriding runtime (actual object) type se — isliye result different ho sakta hai.",
    detailedAnswer:
      "Agar `Base b = new Derived();` hai, aur `Derived` ne `new` (hiding) se ek method redefine kiya hai, `b.Method()` call BASE class ka version chalayega — kyunki hiding compile-time reference type se resolve hota hai. Agar `override` use hota, `b.Method()` DERIVED class ka version chalata — kyunki overriding runtime object type se resolve hota hai (v-table ke through). Ye single most common OOP trap question hai interviews me.",
  },
  {
    id: "rapid-fire-tr-4",
    question: "Rapid-fire: Static constructor kitni baar chalta hai aur kaun call karta hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Sirf ek baar, CLR automatically call karta hai type ke pehle use se pehle — tum explicitly call nahi kar sakte.",
    detailedAnswer:
      "Static constructor no parameters leta hai, aur guarantee hoti hai ki wo exactly ek baar chalega — pehli baar jab type access hota hai (static member access ya instance creation), CLR se pehle. Tum ise explicitly invoke nahi kar sakte, aur ye multiple times nahi chal sakta chahe multiple instances banao.",
  },
  {
    id: "rapid-fire-tr-5",
    question: "Rapid-fire: Kya interface me constructor ho sakta hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Nahi — interfaces me constructors allow nahi hain.",
    detailedAnswer:
      "Sirf abstract (aur regular concrete) classes hi constructors define kar sakti hain. Abstract class ka constructor iss liye exist karta hai taaki derived classes `base()` ke through use call kar sakein, chahe abstract class khud instantiate na ho sake. Interfaces ka model hi different hai — koi state/instantiation logic wo carry nahi karte, isliye constructor ka concept applicable hi nahi hai.",
  },
  {
    id: "rapid-fire-tr-6",
    question: "Rapid-fire: Ek Singleton service ke andar ek Scoped dependency inject karna kyun dangerous hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Captive dependency problem — Scoped instance apni intended per-request lifetime se zyada der zinda reh jaati hai, capture ho jaati hai Singleton ke andar.",
    detailedAnswer:
      "Singleton sirf ek baar banta hai, poori application lifetime ke liye. Agar constructor injection ke through ek Scoped dependency le liya, wo Scoped instance us pehli resolution ke time capture ho jaati hai aur forever wahi instance reuse hoti rahegi — jabki Scoped ka intended behavior hai per-request fresh instance milna. Fix: `IServiceScopeFactory` inject karo aur zaroorat ke waqt ek naya scope create karo, ya design restructure karo.",
    followUp: "Transient dependency ko Singleton me inject karna bhi problematic hai kya?",
  },
  {
    id: "rapid-fire-tr-7",
    question: "Rapid-fire: `record` type ki default equality kaisi hoti hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Value-based (structural) equality — do records equal hain agar unke saare properties equal hain.",
    detailedAnswer:
      "Regular class ke liye default `==`/`Equals()` reference equality hoti hai — same memory location chahiye equal hone ke liye. `record` type (C# 9, 2020) compiler-generated structural equality deta hai by default — agar do record instances ke saare properties same values rakhte hain, wo equal maane jaate hain, chahe wo do alag heap allocations hi kyun na hon.",
  },
  {
    id: "rapid-fire-tr-8",
    question: "Rapid-fire: Kya ye sahi hai — 'Extension methods type me naya member add karte hain, jaise inheritance'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat — extension methods compile-time syntactic sugar hain, type ke andar koi naya real member add nahi hota.",
    detailedAnswer:
      "Extension method actually ek static method hai jiska first parameter `this` se marked hota hai — compiler isko instance-method-jaisi call syntax allow karta hai, lekin underlying reality ek plain static method call hai. Isliye extension methods private members access nahi kar sakte, aur polymorphically override bhi nahi ho sakte — ye 'fake OOP' isliye kehlate hain.",
    redFlag: "Extension methods ko genuine polymorphic behavior samajh lena — LINQ jaisa powerful lagta hai lekin underlying mechanism bilkul static hai.",
  },
  {
    id: "rapid-fire-tr-9",
    question: "Rapid-fire: `Square : Rectangle` inheritance LSP kyun violate karta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Kyunki Square ka SetWidth implicitly Height bhi change kar deta hai, jo Rectangle ke caller-expected behavior contract ko todta hai.",
    detailedAnswer:
      "LSP kehta hai ki ek subtype ko apne base type ki jagah substitute karna safe hona chahiye, bina caller ke expectations tode. Agar ek caller `Rectangle r` leke `r.SetWidth(5)` call karta hai, wo expect karta hai sirf Width change ho, Height untouched rahe. Agar `r` actually ek `Square` hai, `SetWidth` internally `Height` bhi update kar dega (square ki property maintain karne ke liye) — behavior silently different hai jo caller ne expect nahi kiya tha. Fix: composition use karo, ya dono ko ek common shared abstraction se derive karo jisme aisi assumption hi na ho.",
  },
  {
    id: "rapid-fire-tr-10",
    question: "Rapid-fire: `ControllerBase` aur `Controller` me kya farak hai, aur pure Web API me kaunsa use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Controller, ControllerBase ko extend karke extra view-support members add karta hai; pure Web APIs ko sirf ControllerBase chahiye.",
    detailedAnswer:
      "`ControllerBase` un sab basic members deta hai jo ek API controller ko chahiye (`Ok()`, `BadRequest()`, `CreatedAtAction()`, etc.). `Controller`, `ControllerBase` se inherit karke extra view-support members (`View()`, `ViewBag`, etc.) add karta hai jo Razor views render karne ke liye hain. Pure JSON Web APIs jo koi view render nahi karte, `ControllerBase` hi sahi choice hai — unnecessary members inherit karna avoid karta hai.",
  },
  {
    id: "rapid-fire-tr-11",
    question: "Rapid-fire: Async constructor kyun nahi likh sakte, aur workaround kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Constructor turant fully-built object return karta hai; async fundamentally Task return karta hai — incompatible. Workaround: static async factory method.",
    detailedAnswer:
      "Ye is section ka apna topic bhi hai (async-await-oop-constructors-iasyncdisposable) — detail wahan hai, lekin rapid-fire version: constructor ka contract hai object turant, synchronously fully-ready return karna. async method Task/Task<T> return karta hai jo future completion represent karta hai. Ye contracts fundamentally clash karte hain. Standard workaround: private constructor + `public static async Task<T> CreateAsync(...)` factory method.",
    followUp: "IAsyncDisposable ka is problem se kya connection hai?",
  },
  {
    id: "rapid-fire-tr-12",
    question: "Rapid-fire: Overload resolution me priority order kya hai — exact match, implicit conversion, ya params array?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Exact match sabse pehle, phir implicit conversion, phir params array — is exact order me compiler try karta hai.",
    detailedAnswer:
      "C# compiler overload resolution multiple stages me karta hai: pehle dekhta hai koi overload exact argument types se match karta hai kya. Agar nahi, implicit conversions (jaise int se long) allow karke best match dhoondta hai. Agar wo bhi na mile, `params` array wala overload consider karta hai (jo sabse loose match maana jaata hai). Agar do overloads equally good match hain, ambiguous call ka compile error aata hai.",
  },
];

export default questions;
