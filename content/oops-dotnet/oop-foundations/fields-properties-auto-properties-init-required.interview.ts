import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "fields-props-tr-1",
    question: "Field aur property me kya difference hai, aur property kyun use karte hain jab field se bhi same kaam ho jaata hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Capgemini"],
    shortAnswer: "Field raw storage hai bina control ke; property get/set methods ke peeche state expose karti hai, jisse bina API surface change kiye validation/logic add ho sakti hai.",
    detailedAnswer:
      "Field ek plain variable hai — koi bhi caller directly set kar sakta hai bina kisi check ke. Property syntactically field jaisi dikhti hai use karte waqt (`obj.Balance`), lekin actually get_/set_ methods hain. Isse validation ya logic add karna possible hota hai bina caller ke code ko todke — property compile hoke methods banti hai, isliye ise ek raw field ki jagah use karna future-proof hota hai.",
    followUp: "Auto-property me backing field kahan hota hai — hum use directly access kar sakte hain kya?",
  },
  {
    id: "fields-props-tr-2",
    question: "Auto-property kaise kaam karti hai internally?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Compiler khud ek hidden, unnamed backing field generate karta hai jise sirf us property ke get/set access kar sakte hain.",
    detailedAnswer:
      "`public string Name { get; set; }` likhne par compiler background me ek private, compiler-generated backing field banata hai (kuch is tarah ka naam jo tum directly reference nahi kar sakte) aur uske around get_Name()/set_Name() methods generate karta hai. Developer ko manually field likhne ki zaroorat nahi padti jab tak custom get/set logic na chahiye ho — tab explicit backing field declare karte hain.",
  },
  {
    id: "fields-props-tr-3",
    question: "`init` accessor `private set` se kaise different hai — dono to immutability jaisa lagte hain?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "`private set` class ke andar kabhi bhi (koi bhi method se) set ho sakta hai; `init` sirf construction ke exact window me set ho sakta hai, class ke andar se bhi baad me nahi.",
    detailedAnswer:
      "`private set` ek normal setter hai jiski visibility private hai — class ke andar koi bhi method use kabhi bhi call kar sakta hai, jaise ek `Deposit()` method internally `Balance = newValue` set kar sakta hai. `init` isse strictly zyada restrictive hai — wo sirf object-initializer ya constructor ke andar hi call ho sakti hai; ek baar object fully constructed ho gaya, wo property CLASS KE ANDAR SE BHI kabhi set nahi ho sakti. Isliye `init` true immutability-after-construction deta hai, `private set` sirf external immutability deta hai.",
    redFlag: "'init aur private set same hain, dono immutable rakhte hain' bol dena — dono me construction ke baad ka behavior fundamentally different hai.",
  },
  {
    id: "fields-props-tr-4",
    question: "Ye code compile hoga ya error dega, aur kyun?\n```csharp\npublic class Order\n{\n    public string OrderId { get; init; } = \"\";\n}\n\nvar order = new Order { OrderId = \"ORD-1\" };\norder.OrderId = \"ORD-2\";\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error hoga dusri line pe — `init` property object-initializer ke baad kabhi set nahi ho sakti.",
    detailedAnswer:
      "Pehli statement valid hai — `OrderId` object-initializer syntax ke andar set ho raha hai, jo `init` allow karta hai. Dusri line, `order.OrderId = \"ORD-2\"`, object fully construct hone ke baad hai — `init` accessor sirf construction window me hi call ho sakta hai, isliye ye compile-time error deta hai ('init-only property can only be assigned in an object initializer').",
  },
  {
    id: "fields-props-tr-5",
    question: "Ye code compile hoga ya error dega?\n```csharp\npublic class CreateUserRequest\n{\n    public required string Email { get; init; }\n    public required string Name { get; init; }\n}\n\nvar req = new CreateUserRequest { Name = \"Rohit\" };\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — `Email` required hai lekin object-initializer me set nahi kiya gaya.",
    detailedAnswer:
      "`required` (C# 11) compiler ko force karta hai ki har `required` member object-initializer syntax me explicitly set ho, warna compile error. Yahan `Email` required hai lekin sirf `Name` set kiya gaya hai — compiler build-time pe hi ise pakad lega, code compile nahi hoga. Ye exactly wo gap fix karta hai jo pehle `init`-only auto-properties me tha — pehle koi field bhool sakta tha, ab compiler force karta hai.",
    followUp: "Agar `Email` required nahi hota (sirf `init`), to ye code kya karta — koi warning ya silent behavior?",
  },
  {
    id: "fields-props-tr-6",
    question: "Ek team KYC onboarding DTO me `PanNumber` field ko plain public field (`public string PanNumber;`) rakh rahi hai 'jaldi ke liye.' Iska production risk kya hai, aur better approach kya hoga?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Koi bhi caller invalid/empty PAN set kar sakta hai bina validation ke; better approach: `required` property ya validation wali property banao.",
    detailedAnswer:
      "Plain public field ka matlab hai koi bhi code, kahin bhi, bina kisi check ke `PanNumber` set kar sakta hai — empty string, galat format, kuch bhi. Agar kal validation add karni pade (format check, length check), field-to-property conversion binary-incompatible change hoti hai already-compiled consumers ke liye. Better approach: shuru se hi property use karo — agar simple validation chahiye, `required string PanNumber { get; init; }` with a validating constructor/factory, ya custom backing-field property agar complex validation chahiye.",
    redFlag: "'Field use karna fine hai, baad me property me convert kar lenge' — ye future breaking change ka risk create karta hai jo shuru se avoid kiya ja sakta tha.",
  },
  {
    id: "fields-props-tr-7",
    question: "`required` runtime pe bhi enforce hota hai, ya sirf compile time pe?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Primarily compile-time check hai — normal `new` + object-initializer path me compiler enforce karta hai; reflection/deserialization jaise paths alag behave kar sakte hain.",
    detailedAnswer:
      "`required` ka core enforcement compile-time hai — agar tum `new SomeType { }` object-initializer syntax use karke code likhte ho, compiler required members ke bina compile hone hi nahi deta. Lekin agar object reflection ke through (`Activator.CreateInstance`) ya kuch specific deserialization paths se banaya jaaye jo object-initializer pattern follow nahi karte, behavior implementation-specific ho sakta hai — `System.Text.Json` jaisi libraries ne is case ko specially handle kiya hai, lekin blindly assume nahi karna chahiye ki HAR path se required enforce hoga waise hi jaise normal code me hota hai.",
    redFlag: "'required ek runtime validation hai jaise DataAnnotations' bol dena — ye primarily ek compile-time language feature hai, runtime validation framework nahi.",
  },
  {
    id: "fields-props-tr-8",
    question: "`init` ka introduction kis C# version me hua, aur `required` ka kis version me? Ye order kyun important hai interview me bolna?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`init` C# 9 (2020) me aaya, `required` C# 11 (2022) me — sahi version bolna accuracy aur up-to-date knowledge dikhata hai.",
    detailedAnswer:
      "`init`-only setters C# 9 (2020) me introduce hue, `record` types ke saath hi ship hue taaki immutable-by-default types easily ban sakein. `required` members do saal baad C# 11 (2022) me aaye, specifically 'init property bhool jaana' gap ko fix karne ke liye. Interview me exact version bolna (ya kam se kam sahi RELATIVE order bolna — required, init ke baad aaya) accuracy signal deta hai; galat version bolna ('required C# 9 me aaya') ek chhota lekin real red flag hai.",
  },
  {
    id: "fields-props-tr-9",
    question: "Kab tumhe backing field ke saath explicit property likhni chahiye, aur kab plain auto-property kaafi hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Auto-property jab tak koi custom validation/transformation logic get ya set pe nahi chahiye; backing field jab custom logic (validation, computed value, side-effect) chahiye ho.",
    detailedAnswer:
      "Agar property sirf value store/retrieve karti hai bina kisi extra logic ke, auto-property (`{ get; set; }` ya `{ get; init; }`) sabse clean choice hai — kam code, same safety. Jaise hi set ya get pe koi custom behavior chahiye ho — validation (`if (value < 0) throw`), transformation (trim/normalize), ya side-effect (jaise ek event raise karna) — explicit backing field wali property likhni padti hai kyunki auto-property me get/set body customize nahi kar sakte.",
  },
];

export default questions;
