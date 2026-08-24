import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "hiding-vs-overriding-1",
    question: "```csharp\npublic class Animal\n{\n    public string Describe() => \"Animal\";\n}\npublic class Dog : Animal\n{\n    public new string Describe() => \"Dog\";\n}\n\nAnimal a = new Dog();\nConsole.WriteLine(a.Describe());\n```\nYe kya print karega?",
    options: [
      "\"Dog\", kyunki actual object Dog hai",
      "\"Animal\", kyunki `Describe()` `new` se hidden hai aur resolution reference ke DECLARED type (Animal) se hoti hai",
      "Compile error dega",
      "\"DogAnimal\", dono methods chalenge",
    ],
    correctIndex: 1,
    explanation:
      "Method hiding (`new`) compile-time (declared) type se resolve hoti hai, runtime (actual) type se nahi — ye overriding se fundamentally alag hai. `a` ka declared type Animal hai, isliye Animal.Describe() chalta hai, chahe actual object Dog ho. Option A overriding ke behavior ko hiding pe galat apply kar raha hai. Options C aur D dono is mechanism ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "hiding-vs-overriding-2",
    question: "`override` aur `new` (method hiding) me core mechanism-level difference kya hai?",
    options: [
      "Koi difference nahi, dono same kaam karte hain",
      "`override` same virtual slot replace karta hai (runtime resolve hota hai), `new` ek bilkul naya unrelated method banata hai (compile-time resolve hota hai)",
      "`new` sirf static methods pe use hota hai",
      "`override` sirf interfaces me use hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Ye exact distinction hai jo interview me test hoti hai — override ek existing virtual slot ki implementation change karta hai (runtime dispatch), jabki new ek completely separate, unrelated method create karta hai jo sirf naam se match karta hai (compile-time resolve). Options A, C, D sab factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "hiding-vs-overriding-3",
    question: "Agar base class me ek NON-virtual method hai aur derived class me same signature ka method bina `new` ya `override` ke likha jaata hai, kya hota hai?",
    options: [
      "Compile error aata hai",
      "Compile ho jaata hai (implicit hiding), lekin compiler CS0108 warning deta hai suggest karte hue ki `new` intentional hai to add karo",
      "Runtime exception aata hai",
      "Dono methods automatically merge ho jaate hain",
    ],
    correctIndex: 1,
    explanation:
      "C# ye scenario compile hone deta hai (implicit hiding hoti hai) lekin ek warning deta hai — 'hides inherited member, use new keyword if hiding was intended.' Ye warning hi wo signal hai jo developers ko accidental hiding se bachata hai. Options A aur C exaggerated/incorrect hain. Option D bilkul galat mechanism describe karta hai.",
    difficulty: "medium",
  },
  {
    id: "hiding-vs-overriding-4",
    question: "Ek `List<BaseAuditLogger> loggers` hai jisme actual objects `SecurityAuditLogger` hain, jinhone `Log()` ko `new` se (accidentally, `override` ki jagah) hide kiya hai. `loggers` ke through loop karke `Log()` call karne par kya risk hai?",
    options: [
      "Koi risk nahi, sahi hi behave karega",
      "Har call BaseAuditLogger ka generic Log() chalayega, na ki SecurityAuditLogger ka specific version — silently galat/incomplete logging hogi",
      "Runtime exception aayega",
      "Compile hi nahi hoga",
    ],
    correctIndex: 1,
    explanation:
      "Kyunki List ka declared element type BaseAuditLogger hai, aur Log() hidden (new) hai na ki overridden, resolution compile-time declared type (BaseAuditLogger) se hoti hai — har call silently BaseAuditLogger.Log() chalayega, SecurityAuditLogger ka specific behavior kabhi nahi milega. Ye exactly wo real-world danger hai jo hiding vs overriding confusion se aata hai. Options A, C, D is core risk ko miss karte hain.",
    difficulty: "hard",
  },
];

export default quiz;
