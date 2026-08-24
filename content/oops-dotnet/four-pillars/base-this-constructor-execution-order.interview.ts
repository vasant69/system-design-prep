import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "constructor-order-tr-1",
    question: "`base` aur `this` keywords constructors ke context me kya karte hain?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "`base(...)` explicitly parent class ka constructor call karta hai; `this(...)` same class ke ek doosre constructor ko chain/delegate karta hai.",
    detailedAnswer:
      "`base(...)` tab zaroori hai jab tumhe base class ka koi specific (non-default) constructor call karna ho, ya jab base class ke paas parameterless constructor exist hi na kare. `this(...)` code duplication avoid karne ke liye use hota hai — ek constructor doosre (usi class ke) ko delegate kar deta hai apni initialization logic ke liye.",
    followUp: "Agar main kuch bhi na likhun (na base, na this), kya hota hai by default?",
  },
  {
    id: "constructor-order-tr-2",
    question: "Ye code kya print karega?\n```csharp\npublic class A\n{\n    public A() => Console.WriteLine(\"A ctor\");\n}\npublic class B : A\n{\n    public B() => Console.WriteLine(\"B ctor\");\n}\n\nvar b = new B();\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "\"A ctor\" phir \"B ctor\" — base class ka constructor hamesha derived class ki constructor body se pehle poora chalta hai.",
    detailedAnswer:
      "Chahe explicitly `base()` na likha ho, C# implicitly B ke constructor me `A`'s parameterless constructor call karta hai sabse pehle. A ka constructor poora complete hota hai (yahan sirf print), TAB B ka constructor body shuru hoti hai.",
  },
  {
    id: "constructor-order-tr-3",
    question: "Ye exact order me kya print karega?\n```csharp\npublic class Grandparent\n{\n    private int _gp = Log(\"GP field\");\n    public Grandparent() => Console.WriteLine(\"GP ctor\");\n    static int Log(string s) { Console.WriteLine(s); return 0; }\n}\npublic class Parent : Grandparent\n{\n    private int _p = Log(\"P field\");\n    public Parent() => Console.WriteLine(\"P ctor\");\n    static int Log(string s) { Console.WriteLine(s); return 0; }\n}\n\nvar p = new Parent();\n```",
    type: "code-output",
    difficulty: "advanced",
    askedAt: ["Microsoft"],
    shortAnswer: "\"GP field\", \"GP ctor\", \"P field\", \"P ctor\" — is exact order me, kabhi interleaved nahi.",
    detailedAnswer:
      "Sabse pehle Grandparent ka field initializer chalta hai (\"GP field\"), phir Grandparent ka constructor body (\"GP ctor\") — Grandparent poora complete. Tab jaake Parent ka field initializer chalta hai (\"P field\"), phir Parent ka constructor body (\"P ctor\"). Har level poora complete hokar hi agla level shuru hota hai — ye hi exact interleaving hai jo interview me test hoti hai.",
    followUp: "Agar Grandparent ke constructor me exception throw ho jaaye, kya Parent ka field initializer chalega?",
  },
  {
    id: "constructor-order-tr-4",
    question: "Ye code kya print karega?\n```csharp\npublic class Employee\n{\n    public string Department { get; }\n    public Employee() : this(\"General\") => Console.WriteLine(\"Parameterless ctor body\");\n    public Employee(string dept)\n    {\n        Department = dept;\n        Console.WriteLine(\"Parameterized ctor body\");\n    }\n}\n\nvar e = new Employee();\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "\"Parameterized ctor body\" phir \"Parameterless ctor body\" — this(...) target pehle poora chalta hai, phir chaining constructor ka apna body.",
    detailedAnswer:
      "`Employee()` `this(\"General\")` ke through `Employee(string)` ko delegate karta hai. Delegation ka matlab hai target constructor (Employee(string)) PEHLE poora chalta hai (\"Parameterized ctor body\" print hota hai), TAB control wapas calling constructor (Employee()) ke apne body me aata hai (\"Parameterless ctor body\" print hota hai). Field initializers is chain me sirf ek baar chalte — actual base() call jahan hai, wahi.",
    followUp: "Is example me field initializers kitni baar chalenge agar Department ka koi field-initializer-based default value hota?",
  },
  {
    id: "constructor-order-tr-5",
    question: "Ek `TenantScopedEntity` base class hai jisme constructor `TenantId` current HTTP context se set karta hai. `Invoice : TenantScopedEntity` ke constructor body me `TenantId` use kiya jaata hai validation ke liye. Kya guarantee hai ki ye safe hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Haan, safe hai — C# guarantee karta hai ki base class (TenantScopedEntity) ka poora construction, TenantId set hona included, Invoice ki constructor body shuru hone se pehle hi complete ho chuka hoga.",
    detailedAnswer:
      "Execution order rule — base class ka poora construction (field initializers + constructor body) derived class ki body se pehle guaranteed complete hota hai — isi wajah se ye pattern safe hai. Agar ye guarantee na hoti, `Invoice` constructor me `TenantId` uninitialized/default (jaise `Guid.Empty`) ho sakta tha, jo multi-tenant system me ek serious cross-tenant data leakage bug create kar sakta tha.",
    followUp: "Agar TenantId HTTP context se async call se aata (jaise ek DB lookup), constructor me kya problem hoti?",
  },
  {
    id: "constructor-order-tr-6",
    question: "Kya ek constructor `base(...)` AUR `this(...)` dono ek saath use kar sakta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — ek constructor sirf ek hi initializer likh sakta hai, ya to `base(...)` ya `this(...)`, dono ek saath nahi.",
    detailedAnswer:
      "C# syntax hi ye allow nahi karta — ek constructor declaration me sirf ek constructor initializer ho sakta hai. Agar tumhe pehle same-class constructor ko chain karna hai AND ek specific base constructor bhi call karna hai, to `this(...)` waala target constructor khud apna `base(...)` call declare karega — chain automatically eventually base tak pahunch jaati hai, bas ek hi constructor me dono directly nahi likh sakte.",
    redFlag: "Ye assume kar lena ki `public Foo() : base(1) : this()` jaisa kuch likh sakte hain — ye syntax error hai.",
  },
  {
    id: "constructor-order-tr-7",
    question: "Agar `Grandparent` ke constructor me exception throw ho jaaye, kya `Parent` aur `Child` ke field initializers/constructors chalenge?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — agar chain me kahin bhi exception throw hota hai, poora object construction turant abort ho jaata hai, neeche wale levels kabhi nahi chalte.",
    detailedAnswer:
      "Construction ek strict sequential process hai — agar Grandparent ka constructor exception throw karta hai, Parent aur Child ke field initializers ya constructor bodies kabhi execute hi nahi hote. Poora `new Child()` expression fail ho jaata hai, aur exception caller tak propagate hoti hai — object kabhi partially-constructed state me caller ko return nahi hota.",
    followUp: "Iska matlab hai object references kabhi 'half-constructed' state me observable ho sakte hain kya?",
  },
  {
    id: "constructor-order-tr-8",
    question: "Primary constructors (C# 12) ke saath `Order(decimal total)` jaisa class declaration likhne par kya underlying execution order badal jaata hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Nahi — primary constructors sirf ek naya, concise declaration SYNTAX hain. Base-before-derived, field-initializer-before-body execution order bilkul wahi rehta hai jo traditional constructor syntax me hota hai.",
    detailedAnswer:
      "`public class Order(decimal total) : EntityBase` likhne se `total` parameter poori class body me available ho jaata hai, aur ek implicit constructor generate hota hai — lekin CLR level pe execution order same hi rehta hai: base class (EntityBase) pehle fully construct hoti hai, phir Order ke field initializers, phir Order ka baaki constructor logic. Primary constructors sirf boilerplate kam karte hain (ek alag, verbose constructor declaration likhne ki zaroorat nahi), semantics/ordering guarantee change nahi karte.",
    followUp: "Primary constructor parameters aur normal fields me visibility/usage ka kya farak hota hai?",
  },
];

export default questions;
