import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "overload-ext-tr-1",
    question: "Extension method kya hai aur ye kaunsa real-world problem solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Static method with a `this` modifier on the first parameter, called like an instance method — kisi existing (even sealed) type me functionality add karne deta hai bina uska source modify kiye.",
    detailedAnswer:
      "Extension method ek static class me static method hai jiska first parameter `this SomeType param` hota hai. Isse `param.MethodName()` jaisa call syntax milta hai, jaise wo `SomeType` ka genuine instance method ho — lekin compiler internally isse `StaticClass.MethodName(param)` me translate karta hai. Ye tab useful hai jab tumhe kisi type (jaise `string`, ya kisi third-party sealed class) me functionality add karni ho, lekin uska source code modify na kar sako.",
    followUp: "LINQ extension methods pe kaise depend karta hai?",
  },
  {
    id: "overload-ext-tr-2",
    question: "Agar ek class me genuinely ek instance method aur ek matching-signature extension method dono exist karein, konsa call hoga? Kyun?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Instance method hamesha wins — compiler pehle instance methods resolve karta hai, extension methods sirf fallback hote hain.",
    detailedAnswer:
      "C# overload resolution instance members ko extension methods se pehle consider karta hai. Agar ek matching instance method mil jaaye, extension method ko poori tarah ignore kar diya jaata hai — koi ambiguity error nahi aata, silently instance method win karta hai. Ye ek genuine gotcha hai — agar developer expect kar raha hai ki uski extension method call ho lekin actually ek unrelated instance method usi signature ke saath exist karta hai, unexpected behavior mil sakta hai bina koi compile-time warning ke.",
    redFlag: "Assume karna ki extension method 'override' kar sakti hai instance method ko — extension methods kabhi virtual/polymorphic nahi hote.",
  },
  {
    id: "overload-ext-tr-3",
    question: "Ye code likho: `string` type pe ek extension method `IsPalindrome()` jo check kare ki string palindrome hai ya nahi.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Static class me static method, `this string input` first parameter ke saath.",
    detailedAnswer:
      "```csharp\npublic static class StringExtensions\n{\n    public static bool IsPalindrome(this string input)\n    {\n        if (string.IsNullOrEmpty(input)) return false;\n        var cleaned = input.ToLowerInvariant();\n        return cleaned.SequenceEqual(cleaned.Reverse());\n    }\n}\n\n// Usage:\nbool result = \"madam\".IsPalindrome(); // true\n```\nCall site pe ye bilkul `string` ka apna instance method jaisa dikhta hai, lekin compiler ise `StringExtensions.IsPalindrome(\"madam\")` me resolve karta hai.",
  },
  {
    id: "overload-ext-tr-4",
    question: "Extension methods kya-kya NAHI kar sakte, jo instance methods kar sakte hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Private/protected members access nahi kar sakte, virtual/override behavior nahi de sakte, instance state (fields) add nahi kar sakte.",
    detailedAnswer:
      "Teen bade limitations: (1) Extension method sirf public API surface tak access rakhta hai — private/protected members ko access nahi kar sakta. (2) Extension methods polymorphic nahi ho sakte — inhe override nahi kiya ja sakta, aur runtime pe actual object type ke basis pe dispatch nahi hoti (compile-time static type ke basis pe resolve hote hain). (3) Ye sirf behavior add kar sakte hain, koi naya instance field ya state add nahi kar sakte — extension method call ke beech koi persistent state maintain nahi hoti unless externally (jaise ConditionalWeakTable) manage ki jaaye.",
  },
  {
    id: "overload-ext-tr-5",
    question: "`services.AddApplicationServices()` jaisa pattern ASP.NET Core codebases me kyun common hai, aur ye kaunsa concept demonstrate karta hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "IServiceCollection pe custom extension method — DI registration logic ko encapsulate karta hai bina Program.cs ko clutter kiye, third-party type extend karne ka real use case.",
    detailedAnswer:
      "`IServiceCollection` Microsoft's framework type hai — tum uska source modify nahi kar sakte. Ek extension method `public static IServiceCollection AddApplicationServices(this IServiceCollection services) { services.AddScoped<IMyService, MyService>(); ...; return services; }` likh kar, `Program.cs` me sirf ek line (`builder.Services.AddApplicationServices();`) rakhi ja sakti hai, poori registration logic kahin aur encapsulate ho jaati hai. Ye extension methods ke sabse practical, day-to-day-relevant real-world use cases me se ek hai.",
  },
  {
    id: "overload-ext-tr-6",
    question: "Extension method call syntax runtime pe actually kya banti hai? 'Syntactic sugar' ka exact matlab kya hai yahan?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Compile-time pe hi ek plain static method call me translate ho jaati hai — runtime pe koi special extension-method mechanism exist nahi karta.",
    detailedAnswer:
      "`myString.IsValidEmail()` compiler dwara compile-time pe `StringExtensions.IsValidEmail(myString)` me convert kar diya jaata hai — IL level pe bhi ye ek normal static method call hai, koi special 'extension method' runtime construct nahi hai. Isi wajah se extension methods late-bound nahi ho sakte, polymorphic nahi ho sakte — resolution completely compile-time, static-type-based hai.",
  },
  {
    id: "overload-ext-tr-7",
    question: "Agar tum ek extension method wale namespace ka `using` import karna bhool jaao, kya hoga?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Extension method call-site pe available hi nahi hogi — compile error 'method not found', jab tak namespace import na ho.",
    detailedAnswer:
      "Extension methods ka discovery `using` directives pe depend karta hai — agar tumne extension method jis namespace me define ki hai wo namespace import nahi kiya, compiler us extension method ko dhoondh hi nahi payega us call site pe, aur ek generic 'no method X on type Y' compile error dega. Ye naye developers ko confuse karta hai jab wo extension method dekh rahe hain (source me define hai) lekin call site pe IntelliSense/compiler use nahi dhoondh raha.",
    redFlag: "Ye assume karna ki ek extension method automatically globally available hai bina namespace import ke.",
  },
  {
    id: "overload-ext-tr-8",
    question: "Method overload resolution (`compile-time-polymorphism-overloading` topic wala) aur extension method resolution me kya connection hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Extension methods overload resolution ke fallback tier me participate karte hain — sabse pehle instance overloads try hote hain, tabhi extension method candidates consider hote hain.",
    detailedAnswer:
      "Jab compiler `obj.Method(args)` resolve karta hai, wo pehle `obj` ke type ke saare instance methods (aur unke overloads) check karta hai normal overload-resolution rules (best-match) se. Agar koi applicable instance method na mile, TABHI compiler in-scope extension methods (jo `using`-imported namespaces se available hain) ko candidates ki tarah consider karta hai, aur unke beech bhi normal overload-resolution rules hi apply hote hain agar multiple extension methods match karein. Isliye extension method resolution, overload resolution ka hi ek extended/fallback step hai, alag mechanism nahi.",
  },
];

export default questions;
