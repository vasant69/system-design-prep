import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "serialization-json-xml-tr-1",
    question: "System.Text.Json aur Newtonsoft.Json me kya fundamental difference hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Flipkart"],
    shortAnswer:
      "System.Text.Json .NET Core 3.0 se built-in, high-performance default hai; Newtonsoft.Json purana industry-standard third-party library hai jiska customization surface abhi bhi zyada mature hai kuch advanced scenarios ke liye.",
    detailedAnswer:
      "System.Text.Json ko Microsoft ne performance-focused design (Span<T>/Utf8JsonReader-based, kam allocations) ke saath banaya, aur ye ASP.NET Core ke saath already integrated hai, koi extra NuGet dependency nahi chahiye. Newtonsoft.Json saalon tak industry standard raha, aur iska JObject/LINQ-to-JSON dynamic parsing aur complex custom converter model kuch scenarios me abhi bhi zyada ergonomic hai.",
    followUp: "Ek naye .NET 8 project me kaunsa default choice hoga aur kyun?",
  },
  {
    id: "serialization-json-xml-tr-2",
    question: "Kis situation me team abhi bhi Newtonsoft.Json choose karegi System.Text.Json ke bajaye?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Jab genuinely advanced customization chahiye ho (complex JsonConverter logic, dynamic/polymorphic JObject parsing) ya existing codebase already deeply Newtonsoft pe built ho.",
    detailedAnswer:
      "System.Text.Json ne saalon me kaafi gap close kiya hai, lekin kuch scenarios — jaise runtime pe unpredictable JSON shape ko dynamically parse karna, ya bahut advanced custom serialization logic — Newtonsoft ka mature API surface abhi bhi kam boilerplate maangta hai. Legacy codebases jahan migration cost genuine benefit se zyada ho, wahan bhi Newtonsoft continue karna pragmatic hai.",
  },
  {
    id: "serialization-json-xml-tr-3",
    question: "BinaryFormatter ko naye .NET code me kyun avoid karna chahiye?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Ye deprecated hai aur untrusted input deserialize karne par remote-code-execution ka genuine security risk create karta hai — sirf 'purana' hona iski asli problem nahi hai.",
    detailedAnswer:
      "BinaryFormatter ek well-documented insecure-deserialization vulnerability class ka source raha hai — agar attacker-controlled binary data deserialize ki jaaye, arbitrary code execute ho sakta hai. Isi wajah se Microsoft ne ise officially deprecated kiya aur .NET 9+ me by default disable/remove kar diya. Interview me sirf 'outdated hai' bolna incomplete answer hai — security angle explicitly mention karna chahiye.",
    redFlag: "Sirf 'BinaryFormatter purana hai, naye APIs use karo' bolna bina security risk mention kiye — ye incomplete/superficial answer signal karta hai.",
  },
  {
    id: "serialization-json-xml-tr-4",
    question: "Default `System.Text.Json` serialization me property names kis case me output hote hain, aur ise kaise change karte hain?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "By default PascalCase (jaisa C# property naming convention hai); `JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase` set karke camelCase me convert kiya ja sakta hai.",
    detailedAnswer:
      "System.Text.Json by default C# property names ko as-is serialize karta hai (PascalCase, jaise `OrderId`). Frontend/JS clients aksar camelCase expect karte hain, isliye `JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }` explicitly set karna padta hai — ASP.NET Core minimal APIs/controllers me ye already configured hota hai by default actually, lekin standalone `JsonSerializer.Serialize` calls me manually set karna padta hai.",
  },
  {
    id: "serialization-json-xml-tr-5",
    question: "XML serialization aaj kis context me relevant hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Mostly legacy SOAP/WCF-era system interop ke liye — naye REST APIs almost hamesha JSON use karte hain.",
    detailedAnswer:
      "`XmlSerializer`/`DataContractSerializer` .NET me lambe samay se hain aur SOAP-based services ka core mechanism the. Aaj JSON REST APIs dominant hain, isliye XML serialization mostly ek purane enterprise system ke saath interop karne ke liye zaroori hoti hai jo abhi bhi XML/SOAP expect karta hai, ya kuch specific config/document formats ke liye.",
  },
  {
    id: "serialization-json-xml-tr-6",
    question: "Kya System.Text.Json hamesha Newtonsoft.Json se 'better' hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi — performance aur built-in-ness ke lihaaz se better hai for most cases, lekin advanced customization/dynamic parsing scenarios me Newtonsoft abhi bhi zyada mature/ergonomic ho sakta hai.",
    detailedAnswer:
      "Ye ek trade-off hai, absolute superiority nahi. System.Text.Json zyada performant hai aur external dependency nahi maangta, jo isse most modern scenarios ke liye better default banata hai. Lekin genuinely complex customization ya dynamic JSON handling me Newtonsoft ka API surface abhi bhi kam boilerplate maangta hai — 'hamesha better' jaisa absolute claim interview me weak answer signal karta hai.",
    redFlag: "System.Text.Json ko unconditionally 'better' bol dena bina kisi trade-off acknowledge kiye.",
  },
  {
    id: "serialization-json-xml-tr-7",
    question: "Ek existing large codebase Newtonsoft.Json pe heavily built hai. Kya isse System.Text.Json pe migrate karna chahiye sirf 'modern hai' isliye?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Zaroori nahi — agar koi genuine performance/dependency issue nahi hai, migration cost (custom converters rewrite karna, edge cases test karna) benefit se zyada ho sakta hai.",
    detailedAnswer:
      "Migration decision ek cost-benefit analysis hai, sirf 'newer technology' ek sufficient reason nahi hai. Agar existing system stable hai, performance requirements already met hain, aur Newtonsoft ke advanced features (custom converters, dynamic parsing) heavily use ho rahe hain, migration ka risk/effort genuine business value se justify nahi ho sakta. Migration tab sensible hai jab measurable performance issue ho ya external dependency reduce karna genuinely priority ho.",
  },
];

export default questions;
