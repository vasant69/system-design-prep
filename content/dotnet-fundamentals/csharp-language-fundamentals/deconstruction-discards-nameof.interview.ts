import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "deconstruct-tr-1",
    question: "`nameof()` ka use hardcoded strings ke bajaye kyun better practice hai? Ek concrete example do.",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Refactor-safe hai — symbol rename hone par nameof() compile error deta hai, hardcoded string silently stale reh jaata hai.",
    detailedAnswer:
      "```csharp\npublic void SetAge(int age)\n{\n    if (age < 0)\n        throw new ArgumentException(\"Invalid\", nameof(age)); // GOOD\n        // throw new ArgumentException(\"Invalid\", \"age\"); // RISKY\n}\n```\nAgar `age` parameter kabhi `yearsOld` me rename ho jaaye, `nameof(age)` line compile error dega (age ab exist nahi karta), jo developer ko force karega usse update karne ke liye. Hardcoded `\"age\"` string silently reh jaayegi, exception message galat parameter naam dikhata rahega, bina koi warning ke.",
    followUp: "nameof() sirf exception messages ke liye useful hai, ya aur bhi jagah?",
  },
  {
    id: "deconstruct-tr-2",
    question: "Ek custom `Point` class me deconstruction kaise enable karoge?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Ek `Deconstruct(out int x, out int y)` method add karo — compiler automatically recognize karta hai.",
    detailedAnswer:
      "```csharp\npublic class Point\n{\n    public int X { get; }\n    public int Y { get; }\n    public Point(int x, int y) { X = x; Y = y; }\n\n    public void Deconstruct(out int x, out int y)\n    {\n        x = X;\n        y = Y;\n    }\n}\n\nvar p = new Point(3, 4);\nvar (x, y) = p; // Deconstruct automatically called\n```\nCompiler `var (x, y) = p;` dekh kar automatically `p.Deconstruct(out x, out y);` call karta hai, method naam exactly `Deconstruct` hona zaroori hai.",
  },
  {
    id: "deconstruct-tr-3",
    question: "`int.TryParse(input, out _)` — is code me `_` ka kya role hai? Ye kab use karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Sirf success/fail (bool return) check karna hai, actual parsed value nahi chahiye — discard use karke us value ko explicitly ignore karte hain.",
    detailedAnswer:
      "`TryParse` ek `bool` return karta hai (success/failure) aur ek `out` parameter me actual parsed value deta hai. Agar caller ko sirf 'kya ye ek valid number hai' jaanna hai, actual value ki zarurat nahi — `out _` use kar ke explicitly signal karte hain 'value discard kar raha hoon.' Ye 'main jaanbujh kar ignore kar raha hoon' aur 'main bhool gaya use karna' ke beech ek clear, compiler-verified difference create karta hai.",
  },
  {
    id: "deconstruct-tr-4",
    question: "Kya deconstruction sirf tuples ke liye kaam karta hai, ya custom types ke liye bhi?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Dono — tuples ke liye built-in support hai, custom types ke liye ek `Deconstruct` method define karna hota hai.",
    detailedAnswer:
      "Tuples (`(string, int)`) ke liye deconstruction built-in hai, koi extra code nahi chahiye. Custom classes/structs ke liye, developer ko explicitly ek `Deconstruct` method likhna padta hai jo `out` parameters use kare. Ek genuine misconception hai ye sochna ki deconstruction sirf tuples tak limited hai — ye ek general-purpose language feature hai jo kisi bhi type ke liye extend ho sakta hai jab tak method-naming convention follow ho.",
    redFlag: "Ye assume karna ki custom types automatically deconstruct ho sakte hain bina Deconstruct method likhe.",
  },
  {
    id: "deconstruct-tr-5",
    question: "`nameof()` type ke naam ke liye bhi use ho sakta hai? Ek example do.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Haan — `nameof(Customer)` compile-time pe \"Customer\" string deta hai, refactor-safe tareeke se.",
    detailedAnswer:
      "```csharp\n_logger.LogError($\"{nameof(Customer)} not found for id {id}\");\n```\n`nameof()` sirf variables/parameters tak limited nahi hai — types, properties, methods, namespaces ke naam bhi is se resolve kiye ja sakte hain, hamesha compile-time pe string me convert hote hue, aur agar `Customer` class ka naam kabhi rename ho, ye reference bhi automatically compile-time pe flag ho jaayega agar update na kiya jaaye.",
  },
  {
    id: "deconstruct-tr-6",
    question: "Positional record `record Point(int X, int Y);` ke saath deconstruction bina kuch likhe kyun kaam karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Compiler positional records ke liye automatically ek Deconstruct method generate karta hai, unke primary-constructor parameters ke basis pe.",
    detailedAnswer:
      "Jab `record Point(int X, int Y);` likha jaata hai, compiler kai cheezein automatically generate karta hai — properties (`X`, `Y`), ek constructor, `Equals`/`GetHashCode`/`ToString` overrides, AUR ek `Deconstruct(out int X, out int Y)` method. Isi wajah se `var (x, y) = new Point(3, 4);` bina ek line manually likhe kaam karta hai — ye ek record-specific compiler convenience hai jo custom classes me manually likhni padti hai.",
  },
  {
    id: "deconstruct-tr-7",
    question: "Kya do alag `_` discards ek hi statement/scope me use ho sakte hain bina koi conflict ke?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Haan — discards actual variables nahi hain, isliye multiple `_` ek scope me freely coexist kar sakte hain, jabki do baar same-named real variable declare karna compile error deta.",
    detailedAnswer:
      "```csharp\nvar (_, age, _) = GetPersonWithThreeValues(); // multiple _ discards, no conflict\n```\nDiscard koi genuine variable allocate nahi karta — compiler har `_` ko independently 'ignore this value' ki tarah treat karta hai, koi naming-collision check nahi hoti unke beech. Ye asymmetric hai regular variable declaration se — `var (a, age, a) = ...` (dono baar `a`) genuinely compile error dega duplicate-name ki wajah se.",
  },
  {
    id: "deconstruct-tr-8",
    question: "Ek `ParsePriceRange` method likho jo ek string se min/max price nikaale, aur caller-side me deconstruction se consume ho.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Tuple return karne waala method + `var (min, max) = ParsePriceRange(...)` caller-side.",
    detailedAnswer:
      "```csharp\n(decimal Min, decimal Max) ParsePriceRange(string input)\n{\n    var parts = input.Split('-');\n    return (decimal.Parse(parts[0]), decimal.Parse(parts[1]));\n}\n\n// Caller:\nvar (min, max) = ParsePriceRange(\"1000-5000\");\nConsole.WriteLine($\"Range: {min} to {max}\");\n```\nNamed tuple elements (`Min`, `Max`) documentation-jaisa self-descriptive return type dete hain, aur caller-side deconstruction ek line me dono values ko meaningful naam de deta hai, bina intermediate `.Item1`/`.Item2` access ke.",
  },
];

export default questions;
