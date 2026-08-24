import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "extension-tr-1",
    question: "Extension method kya hai, aur ise likhne ke liye kya syntax rules follow karne padte hain?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Ek static method jo instance-method-jaisi syntax deta hai kisi type ke liye — static class, static method, pehle parameter pe 'this' modifier.",
    detailedAnswer:
      "Extension method ek static class ke andar likha jaata hai, method khud static hota hai, aur pehle parameter pe 'this' modifier hota hai jo batata hai kaunsa type extend ho raha hai. Call site pe ye instance method jaisa dikhta hai (`myString.IsValidEmail()`), lekin compiler ise ek plain static call me translate kar deta hai. Ye C# 3.0 me LINQ ke saath introduce hua tha.",
    followUp: "Ise 'fake OOP' kyun bola jaata hai?",
  },
  {
    id: "extension-tr-2",
    question: "Extension methods ko kabhi-kabhi 'fake OOP' kyun bola jaata hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Kyunki ye actually type me koi naya member add nahi karte — sirf compile-time syntactic sugar hai ek static call ke liye, isliye real OOP polymorphism ke rules follow nahi karte.",
    detailedAnswer:
      "Real instance members (jaise virtual methods) type ke andar exist karte hain, private state access kar sakte hain, aur runtime polymorphism ke through dispatch hote hain. Extension methods dono se miss karte hain: ye type ke bahar defined hain isliye private/protected members access nahi kar sakte, aur ye compile-time (static) type ke basis pe resolve hote hain runtime type pe nahi, isliye override/virtual dispatch jaisa behavior nahi milta. Isi wajah se ye 'OOP jaisa dikhna' hai, actual OOP mechanism nahi.",
    followUp: "Kya extension method ek interface ko bhi 'implement' kar sakta hai kisi tarah?",
  },
  {
    id: "extension-tr-3",
    question: "Ye kya print karega?\n```csharp\npublic class Base { }\npublic class Derived : Base { }\n\npublic static class BaseExt\n{\n    public static string Greet(this Base b) => \"Base greet\";\n}\npublic static class DerivedExt\n{\n    public static string Greet(this Derived d) => \"Derived greet\";\n}\n\nBase obj = new Derived();\nConsole.WriteLine(obj.Greet());\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "\"Base greet\" — resolution compile-time (declared) type Base pe based hoti hai, runtime type Derived pe nahi.",
    detailedAnswer:
      "Extension method resolution ek compile-time decision hai — compiler `obj` ke DECLARED type (Base) ko dekhta hai, actual runtime object (Derived) ko nahi. Isliye BaseExt.Greet() call hota hai, DerivedExt.Greet() nahi — chahe obj actually ek Derived instance hold kar raha ho. Ye virtual method override se bilkul opposite hai, jahan runtime type decide karta hai kaunsi implementation chalegi.",
    followUp: "Agar Greet() Base class me ek virtual method hota (extension method ki jagah), to output kya hota?",
  },
  {
    id: "extension-tr-4",
    question: "Ye kya karega?\n```csharp\npublic static class Ext\n{\n    public static bool IsEmpty(this string? s) => string.IsNullOrEmpty(s);\n}\n\nstring? name = null;\nConsole.WriteLine(name.IsEmpty());\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "True, koi exception nahi — extension method call actually Ext.IsEmpty(null) hai, jo poori tarah valid hai.",
    detailedAnswer:
      "Ye ek surprising-lagne-wala lekin correct behavior hai. `name.IsEmpty()` compile-time pe `Ext.IsEmpty(name)` me translate hoti hai — ek plain static method call jisme name (jo null hai) sirf ek argument ke roop me pass ho raha hai. Koi instance method dispatch nahi ho raha (jo null pe NullReferenceException deta), isliye null receiver pe extension method call safely chal jaata hai. Method ke andar IsNullOrEmpty(s) khud null ko handle kar leta hai, isliye true return hota hai.",
    redFlag: "Ye expect karna ki name.IsEmpty() NullReferenceException throw karega kyunki name null hai — instance method ke intuition se ye galat expectation ban jaati hai, extension method is rule ko break karta hai.",
  },
  {
    id: "extension-tr-5",
    question: "Tumhare paas ek EF Core `Order` entity hai jise API response DTO me convert karna hai multiple controllers me. Extension method approach use karke isko kaise design karoge, aur is approach ka fayda kya hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ek OrderMappingExtensions static class me ToDto() extension method likho — mapping logic centralized rehti hai, entity class khud modify nahi karni padti.",
    detailedAnswer:
      "```csharp\npublic static class OrderMappingExtensions\n{\n    public static OrderDto ToDto(this Order order) =>\n        new(order.Id, order.ProductId, order.Quantity, order.Total);\n}\n```\nController me `order.ToDto()` likh sakte ho, jo readable/fluent hai. Fayda: Order entity class (jo aksar EF Core scaffolding ya shared domain layer se aati hai) ko modify nahi karna padta, mapping logic ek discoverable centralized jagah pe rehta hai, aur multiple controllers isi extension method ko reuse kar sakte hain bina duplicate mapping code likhe.",
    followUp: "Agar Order ke saath related entities (jaise OrderItems) bhi map karni hon, kaise structure karoge?",
  },
  {
    id: "extension-tr-6",
    question: "Do NuGet packages ne accidentally same-signature extension method (`IsValid()` on `string`) define kiya hai, aur tumne dono ke namespaces `using` kiye hain. Kya hoga jab tum `myString.IsValid()` call karo?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Compile error — ambiguous call, kyunki dono extension methods scope me hain aur signature match karta hai. Fully-qualified static call se resolve karna padega.",
    detailedAnswer:
      "Jab multiple namespaces se same-signature extension methods scope me aate hain (dono using se import hue), compiler decide nahi kar pata kaunsa use karna hai — ambiguous call compile error deta hai (CS0121). Fix: fully-qualified static syntax use karo (`PackageA.Extensions.IsValid(myString)`), ya sirf ek namespace ka using rakho, ya apna khud ka wrapper extension method likho jo explicitly ek specific package wale ko call kare.",
    redFlag: "Ye assume karna ki compiler automatically 'closest'/'most specific' extension method choose kar lega jaise overload resolution karta hai kabhi-kabhi — extension method namespace ambiguity explicit compile error deti hai, silent guess nahi.",
  },
  {
    id: "extension-tr-7",
    question: "Kya ye statement sahi hai: 'Extension methods LINQ ke through IEnumerable<T> interface me naye members add karte hain'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat — IEnumerable<T> interface khud unchanged rehta hai (sirf GetEnumerator() define karta hai); Where/Select/etc interface ke bahar, alag Enumerable class me defined static methods hain.",
    detailedAnswer:
      "Ye ek common misconception hai. Extension methods interface ki definition ko kabhi modify nahi karte — IEnumerable<T> aaj bhi sirf GetEnumerator() (aur non-generic IEnumerable ka GetEnumerator()) define karta hai, koi Where ya Select member nahi hai usme. Ye query operators System.Linq.Enumerable naam ki ek completely separate static class me defined hain, jinka pehla parameter 'this IEnumerable<T>' hai. Interface khud 'thin' rehta hai, saara extra behavior bahar se extension methods ke through 'attach' hota hai — ye ek design choice tha jisse interface implementers ko koi extra burden nahi pada.",
    redFlag: "Ye bolna ki 'IEnumerable<T> me Where method hai' — technically galat hai, ye statement interviewer ko turant lagta hai candidate ne interface aur extension method ke beech ka fark clearly nahi samjha.",
  },
];

export default questions;
