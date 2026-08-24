import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "boilerplate-tr-1",
    question: "Top-level statements ka runtime pe kya actual effect hota hai? Ye traditional Main method se kaise related hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Koi runtime difference nahi — compiler internally same hidden Program class aur Main method generate karta hai, purely source-level ceremony reduce hoti hai.",
    detailedAnswer:
      "Jab tum top-level statements likhte ho (`Console.WriteLine(\"Hi\");` seedha file me, bina class/Main ke), compiler behind-the-scenes exactly waisa hi ek `Program` class aur `Main` method generate karta hai jaisa traditional syntax me manually likha jaata. IL output effectively identical hai — sirf source code me likhne ki zarurat kam ho gayi hai. Command-line `args` bhi automatically available hote hain is context me, bina explicit declaration ke.",
    followUp: "Ek project me kitni files top-level statements use kar sakti hain?",
  },
  {
    id: "boilerplate-tr-2",
    question: "Global usings kis specific pain-point ko solve karte hain multi-file projects me?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Common namespaces (System, System.Linq, etc.) ko har file me repeat karne ki zarurat khatam karta hai — ek jagah declare karo, poore project me apply hota hai.",
    detailedAnswer:
      "Pre-C#10, har `.cs` file ke top pe commonly-needed `using` statements (`System`, `System.Collections.Generic`, `System.Linq`) baar-baar likhne padte the — genuinely repetitive boilerplate. `global using X;` (kahin bhi ek file me likha) us namespace ko poore project ke har file me automatically available bana deta hai, bina repeat kiye. Ye compile-time convenience hai — jaise compiler har file ko treat kare jaise wo using waha bhi ho.",
  },
  {
    id: "boilerplate-tr-3",
    question: "File-scoped namespace declaration ka syntax kya hai, aur ye traditional block-syntax se kaise different hai?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "`namespace X;` (semicolon, no braces) — poori file automatically us namespace ke andar hoti hai, ek indentation level kam.",
    detailedAnswer:
      "```csharp\n// Traditional (block-scoped)\nnamespace MyApp.Services\n{\n    public class OrderService { }\n}\n\n// File-scoped (C# 10+)\nnamespace MyApp.Services;\n\npublic class OrderService { }\n```\nFile-scoped version braces use nahi karta — semicolon poore statement ko end karta hai, aur us point ke baad file ka SAARA content us namespace ke andar treat hota hai. Fayda: ek less indentation level, jo bade files me readability slightly improve karta hai.",
  },
  {
    id: "boilerplate-tr-4",
    question: "Kya ek file me do file-scoped namespace declarations likhi ja sakti hain?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — ek file me sirf EK file-scoped namespace allowed hai; multiple namespaces chahiye to traditional block-syntax use karni padegi.",
    detailedAnswer:
      "File-scoped namespace ka poora concept hi hai ki 'ye poori file is namespace ki hai' — isliye dusra file-scoped `namespace Y;` add karne ki koshish compile error dega. Agar genuinely ek hi file me do alag namespaces me types rakhne hain (rare, generally avoid kiya jaata hai code organization ke liye), traditional brace-based `namespace X { ... }` blocks use karne padenge, jo multiple ho sakte hain ek file me.",
    redFlag: "Ye assume karna ki file-scoped namespace multiple declarations support karta hai, jaise ek file me multiple classes ho sakti hain.",
  },
  {
    id: "boilerplate-tr-5",
    question: "`<ImplicitUsings>enable</ImplicitUsings>` .csproj setting kya karti hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Project type (Console, Web, Worker) ke basis pe SDK khud commonly-needed namespaces ko automatically global-using kar deta hai.",
    detailedAnswer:
      "Ye .NET 6+ SDK templates ka default setting hai — is se manually `global using System;` jaisi common lines likhne ki bhi zarurat nahi padti kai cases me, SDK khud project-type-appropriate namespaces (Console app ke liye `System`, `System.Linq`, etc.; Web app ke liye additionally `Microsoft.AspNetCore.Builder`, etc.) ko implicitly global-using kar deta hai ek auto-generated file ke through. Developer chahe to isse disable bhi kar sakta hai (`<ImplicitUsings>disable</ImplicitUsings>`) agar explicit control chahiye.",
  },
  {
    id: "boilerplate-tr-6",
    question: "Kya ye teeno features (top-level statements, global usings, file-scoped namespaces) code ki performance ko affect karte hain?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — teeno purely compile-time/source-level convenience hain, generated IL/runtime behavior par koi effect nahi.",
    detailedAnswer:
      "Ye ek common misconception-check hai interview me — teeno features 'less typing, same result' category me aate hain. Top-level statements same Main-method IL generate karte hain. Global usings sirf compiler ko batate hain kaunsa namespace kaunsi file me implicitly available hai (resolution compile-time pe hoti hai). File-scoped namespaces sirf ek syntactic restructuring hain, compiled metadata me namespace information same hi rehti hai. Koi bhi runtime performance implication nahi hai kisi teeno ka.",
    redFlag: "Ye claim karna ki ye 'modern' features apne aap performance better banate hain — ye purely developer-experience/ergonomics features hain.",
  },
  {
    id: "boilerplate-tr-7",
    question: "Ek team apne project me bahut saare unrelated namespaces ko global-using kar deti hai 'convenience' ke liye. Ye kyun problematic ho sakta hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Discoverability kam ho jaati hai — kisi file me ek type kahan se aa raha hai (kaunsa namespace) samajhna mushkil ho jaata hai bina explicit local using ke.",
    detailedAnswer:
      "Agar bahut saare, especially domain-specific ya rarely-used namespaces globally declared hon, ek developer jo ek specific file padh raha hai us type ka origin turant nahi samajh sakta — normally file ke top ke `using` statements se ye clear hota tha ki kaunse namespaces us file me relevant hain. Global usings ka best-practice use case genuinely-universal, almost-every-file-needs-it namespaces (System, LINQ) tak limited rakhna hai — domain-specific ya rarely-used namespaces ko file-local `using` rakhna better rehta hai readability/discoverability ke liye.",
  },
  {
    id: "boilerplate-tr-8",
    question: "ASP.NET Core ka `Program.cs` .NET 6+ me kaise dikhta hai, aur ye kaunse teenon features use karta hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Top-level statements (no class/Main), implicit usings (Microsoft.AspNetCore.Builder auto-available), aur typically file-scoped namespace agar koi custom types usi file me define ho.",
    detailedAnswer:
      "```csharp\nvar builder = WebApplication.CreateBuilder(args);\nbuilder.Services.AddControllers();\nvar app = builder.Build();\napp.MapControllers();\napp.Run();\n```\nYe pura setup code seedha top-level statements ke through likha jaata hai — koi `class Program`, koi `static void Main` explicitly nahi dikhta. `WebApplication.CreateBuilder` jaisi types ke liye `Microsoft.AspNetCore.Builder` namespace implicit usings ki wajah se automatically available hota hai bina explicit `using` ke. Ye .NET 6+ ka default, deliberately-simplified starter template hai.",
  },
];

export default questions;
