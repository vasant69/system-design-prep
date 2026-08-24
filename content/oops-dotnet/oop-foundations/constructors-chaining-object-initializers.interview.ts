import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "constructors-tr-1",
    question: "Constructor kya hota hai, aur default constructor vs parameterized constructor me kya difference hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer: "Constructor ek special method hai jo object creation ke waqt exactly ek baar run hota hai; default constructor parameter-less hota hai (compiler-generated agar khud koi nahi likha), parameterized constructor arguments leta hai custom initialization ke liye.",
    detailedAnswer:
      "Constructor class ke naam wala ek special method hai, jiska koi return type nahi hota, aur jo `new` call hone par exactly ek baar run hota hai — object ko valid initial state me laane ke liye. Agar developer koi constructor define nahi karta, compiler khud ek parameterless default constructor generate karta hai jo fields ko unke default values pe set karta hai. Jaise hi koi custom constructor likha jaata hai, ye implicit generation ruk jaata hai.",
    followUp: "Agar mujhe parameterless aur parameterized dono constructors chahiye, ek doosre ko kaise reuse kar sakte hain?",
  },
  {
    id: "constructors-tr-2",
    question: "Constructor chaining kya hota hai, `: this(...)` syntax kaise kaam karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Ek constructor `: this(...)` ke through usi class ke doosre constructor ko call karta hai, jo pehle poora run hota hai, phir calling constructor ki apni body (agar koi hai).",
    detailedAnswer:
      "`: this(...)` syntax ek constructor ko usi class ke doosre constructor ko delegate karne deta hai — jaise `public Order() : this(\"UNKNOWN\", 0) { }`. Yahan target constructor (do-parameter wala) pehle POORA run hota hai, uske baad calling constructor (parameterless) ki apni body run hoti hai agar usme kuch likha ho. Ye common initialization logic ko ek jagah rakhne deta hai, duplication avoid karta hai.",
  },
  {
    id: "constructors-tr-3",
    question: "Ye output kya hoga?\n```csharp\npublic class Item\n{\n    public string Name { get; }\n    public decimal Price { get; }\n\n    public Item(string name) : this(name, 0m)\n    {\n        Console.WriteLine(\"1-param ctor\");\n    }\n\n    public Item(string name, decimal price)\n    {\n        Name = name;\n        Price = price;\n        Console.WriteLine(\"2-param ctor\");\n    }\n}\n\nvar item = new Item(\"Book\");\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "'2-param ctor' phir '1-param ctor' — chained constructor pehle poora run hota hai, phir calling constructor ki body.",
    detailedAnswer:
      "`new Item(\"Book\")` 1-parameter constructor call karta hai, jo `: this(name, 0m)` ke through 2-parameter constructor ko chain karta hai. Chaining me target constructor (2-parameter) PEHLE poora execute hota hai — isliye '2-param ctor' pehle print hota hai. Uske baad 1-parameter constructor ki apni body (jo sirf `Console.WriteLine` hai) run hoti hai, isliye '1-param ctor' doosra print hota hai.",
    followUp: "Agar 2-parameter constructor khud kisi teesre ko chain karta, execution order kya hota?",
  },
  {
    id: "constructors-tr-4",
    question: "Object-initializer syntax (`new T { Prop = value }`) exactly kab run hota hai — constructor ke pehle, saath, ya baad me?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Constructor ke BAAD — constructor poora complete hone ke baad hi object-initializer ki property assignments run hoti hain.",
    detailedAnswer:
      "Ye ek guaranteed, fixed order hai: pehle chosen constructor poora run hota hai (saari initialization logic ke saath), phir object-initializer ki har property assignment order me (jaise likhi hai) run hoti hai. Isliye agar constructor ke andar koi property ko ek value set karta hai, aur object-initializer usi property ko dobara set karta hai, initializer ki value hi final rehti hai — constructor ki value overwrite ho jaati hai.",
    redFlag: "Ye sochna ki object-initializer constructor ke 'saath' ya 'andar' merge ho jaata hai — actually ye do completely separate, sequential steps hain.",
  },
  {
    id: "constructors-tr-5",
    question: "Ek `Order` class ka constructor validate karta hai ki `Quantity > 0`, warna exception throw karta hai. Lekin `Quantity` property ka set accessor plain auto-property hai. Kya `new Order { Quantity = -5 }` is validation ko bypass kar sakta hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Haan — agar constructor object-initializer me Quantity set nahi kar raha (ya default constructor use ho raha hai), object-initializer ki assignment plain auto-property set hai, koi validation nahi chalti.",
    detailedAnswer:
      "Agar `Order` ka parameterless constructor call ho raha hai (jisme validation Quantity ke liye specific nahi hai, ya validation sirf parameterized constructor me hai) aur phir object-initializer `Quantity = -5` set karta hai, ye sirf ek plain property assignment hai — jab tak property ka apna `set` accessor khud validation na kare, koi check nahi lagega. Constructor-time validation object-initializer path ko cover nahi karti agar wahi property baad me initializer se overwrite ho rahi hai. Fix: validation ko property ke apne `set`/`init` accessor me daalo, sirf constructor pe depend mat karo.",
    followUp: "`required` keyword is problem ko kaise partially address karta hai (aur kya nahi karta)?",
  },
  {
    id: "constructors-tr-6",
    question: "EF Core entities me aksar ek `protected`/`private` parameterless constructor hota hai, saath me ek public parameterized constructor bhi. Ye pattern kyun use kiya jaata hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "EF Core database se object materialize karte waqt parameterless constructor use karta hai; application code business-valid state banane ke liye parameterized constructor use karta hai.",
    detailedAnswer:
      "EF Core jab database se rows ko entity objects me convert karta hai (materialization), usse ek constructor chahiye hota hai jise wo call kar sake, typically parameterless. Agar wo public ho, application code accidentally ek invalid, half-initialized entity bana sakta hai (`new Order()` bina zaroori fields ke). Isliye ise `protected`/`private` rakha jaata hai — sirf EF (aur derived classes) access kar sakte hain — jabki application code ek public, parameterized constructor use karta hai jo hamesha valid state guarantee karta hai.",
  },
  {
    id: "constructors-tr-7",
    question: "Primary constructors (C# 12) traditional constructors se kaise different hain, aur kab use karne chahiye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Primary constructors class declaration line me hi parameters define karte hain — chhoti, simple classes/DTOs ke liye boilerplate kam karte hain; complex validation logic ke liye traditional constructor zyada readable rehta hai.",
    detailedAnswer:
      "C# 12 se `public class Order(string productId, int quantity) { ... }` likh sakte ho — parameters poore class body me available rehte hain, alag se field assign karne ki zaroorat nahi agar directly property initializer me use karo (`public string ProductId { get; } = productId;`). Ye chhoti DTOs/simple classes ke liye kaafi boilerplate bachata hai. Lekin agar constructor me multi-step validation ya complex logic chahiye, traditional constructor body zyada readable/debuggable rehta hai — primary constructor har jagah blindly use karna readability kharab kar sakta hai.",
  },
  {
    id: "constructors-tr-8",
    question: "Do constructors ek dusre ko call kar rahe hain — `A() : this(B-args)` aur us doosre constructor me `: this(A-args)` — kya ye valid hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — ye circular chaining hai, compiler isko compile-time error deta hai.",
    detailedAnswer:
      "C# compiler constructor chaining me circular reference detect karta hai aur compile error deta hai ('constructors cannot call each other circularly'). Chaining hamesha ek directed, acyclic path follow karni chahiye — ek 'base' constructor tak pahunchna chahiye jo kisi aur ko chain nahi karta. Ye interviewers ke liye ek quick trap hai — candidate agar bolta hai 'runtime pe stack overflow hoga' wo bhi galat hai, ye compile time pe hi pakda jaata hai.",
    redFlag: "'Ye runtime StackOverflowException dega' bolna — actual behavior ek compile-time error hai, runtime tak pahunchta hi nahi.",
  },
  {
    id: "constructors-tr-9",
    question: "Coding: Ek `Product` class banao jisme `Name` (required), `Price` (required, must be > 0), aur `Category` (optional, default 'General') ho. Constructor chaining aur validation dono demonstrate karo.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer: "Do constructors — ek 2-param jo Category default deta hai, doosra 3-param jo actual validation karta hai; do-param wala 3-param ko `: this(...)` se chain karta hai.",
    detailedAnswer:
      "Expected shape:\n```csharp\npublic class Product\n{\n    public string Name { get; }\n    public decimal Price { get; }\n    public string Category { get; }\n\n    public Product(string name, decimal price)\n        : this(name, price, \"General\")\n    {\n    }\n\n    public Product(string name, decimal price, string category)\n    {\n        if (string.IsNullOrWhiteSpace(name))\n            throw new ArgumentException(\"Name is required\");\n        if (price <= 0)\n            throw new ArgumentException(\"Price must be greater than zero\");\n\n        Name = name;\n        Price = price;\n        Category = category;\n    }\n}\n```\nValidation sirf ek jagah (3-param constructor) hai — chaining ki wajah se 2-param constructor bhi usi validation se guaranteed guzarta hai, duplication nahi hai.",
  },
];

export default questions;
