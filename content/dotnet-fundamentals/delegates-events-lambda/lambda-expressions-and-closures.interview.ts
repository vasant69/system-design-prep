import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "lambda-closures-tr-1",
    question: "Closure kya hota hai C# me?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Ek mechanism jisse lambda apne surrounding scope ke variables ko access/capture kar sakta hai — reference se, value snapshot se nahi.",
    detailedAnswer:
      "Jab ek lambda expression apne enclosing method ke kisi local variable ko use karta hai (jo uska apna parameter nahi hai), compiler internally ek hidden class generate karta hai jisme wo variable ek field ban jaata hai. Ye 'capture' REFERENCE-based hai — lambda hamesha variable ki current value dekhta hai invoke hone ke waqt, capture-time ki value ka koi snapshot nahi liya jaata.",
    followUp: "Isse kya bug ho sakta hai loops me?",
  },
  {
    id: "lambda-closures-tr-2",
    question: "`for` loop me ek lambda capture karte waqt classic bug kya hota hai, aur kyun?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Sab lambdas ek hi shared loop-counter variable ko capture karte hain — loop khatam hone tak counter final value pe pahunch chuka hota hai, sab lambdas wahi value dekhte hain.",
    detailedAnswer:
      "`for (int i = 0; i < 3; i++)` me `i` poore loop ke liye EK variable hai, har iteration me reused hota hai. Agar har iteration me `() => Console.WriteLine(i)` jaisa lambda list me add kiya jaaye, sab lambdas usi SHARED `i` variable ko capture karte hain — loop khatam hone ke baad jab lambdas invoke hote hain, sab teeno 'i ki final value' (3, agar loop 0,1,2 tak chala) print karte hain, expected 0,1,2 nahi. Fix: loop ke andar `int localCopy = i;` banakar `localCopy` capture karo.",
    redFlag: "Ye bhoolna ki `for` loop me ye behavior aaj bhi exist karta hai — kai candidates sochte hain C# 5.0 ne isse universally fix kar diya, jabki sirf `foreach` fix hua tha.",
  },
  {
    id: "lambda-closures-tr-3",
    question: "`for` aur `foreach` loops me closure-capture behavior alag kyun hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "C# 5.0 (2012) ne specifically `foreach` ke liye har iteration ko apna scoped variable dena shuru kiya — `for` loop ka counter variable semantically differently declared hota hai, isliye wo change nahi hua.",
    detailedAnswer:
      "C# 5.0 se pehle, `foreach` bhi `for` jaisa hi ek shared iteration variable use karta tha — bahut real-world bugs report hue closures ke saath. Microsoft ne ise ek deliberate breaking change ke roop me fix kiya `foreach` ke liye: ab har iteration apna khud ka, naya-scoped loop variable paata hai. `for` loop me ye extend nahi kiya gaya — `for` ka counter ek explicit, single variable declaration hai jiska scope loop ke bahar-tak bhi thoda different tarike se define hota hai, isliye similar fix wahan apply nahi hua. Developers ko `for` loops me manually local-copy pattern use karna padta hai.",
  },
  {
    id: "lambda-closures-tr-4",
    question: "Ye code kya print karega?\n```csharp\nvar actions = new List<Action>();\nforeach (int i in new[] { 10, 20, 30 })\n{\n    actions.Add(() => Console.WriteLine(i));\n}\nforeach (var a in actions) a();\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "10, 20, 30 — foreach (C# 5+) me har iteration ka apna scoped variable hota hai.",
    detailedAnswer:
      "C# 5.0 ke baad, `foreach` loop ka iteration variable (`i`) har iteration me FRESH, alag scope me declare hota hai. Isliye har lambda apne khud ke iteration ki value capture karta hai, aur output '10 20 30' aata hai — expected, per-iteration behavior. Ye `for` loop ke shared-variable behavior se contrast karta hai.",
  },
  {
    id: "lambda-closures-tr-5",
    question: "Expression lambda aur statement lambda me syntax ka fark kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Expression lambda ek single expression hai, implicit return (`x => x * 2`). Statement lambda ek `{}` block hai, explicit `return` chahiye multi-statement logic ke liye.",
    detailedAnswer:
      "Expression lambda: `x => x * x` — single expression, uska result implicitly return hota hai, koi curly braces ya `return` keyword nahi chahiye. Statement lambda: `x => { int y = x * x; return y; }` — jab multiple statements chahiye, curly braces me likha jaata hai aur explicit `return` zaroori hai (agar delegate value return karta hai).",
  },
  {
    id: "lambda-closures-tr-6",
    question: "Anonymous methods aur lambda expressions — kaunsa modern C# code me prefer kiya jaata hai, aur kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Lambda expressions almost hamesha preferred hain — zyada concise syntax, aur additionally Expression Trees me convert ho sakte hain jo IQueryable/EF Core ke liye zaroori hai.",
    detailedAnswer:
      "Anonymous methods (`delegate (int a, int b) { return a + b; }`) C# 2.0 se valid hain aur aaj bhi compile hote hain, lekin practically obsolete hain — lambdas (`(a, b) => a + b`) wahi kaam karte hain kam syntax me, aur additionally Expression Tree conversion support karte hain jo EF Core jaise LINQ providers ko SQL translation ke liye chahiye hota hai. Anonymous methods ye capability nahi rakhte.",
  },
  {
    id: "lambda-closures-tr-7",
    question: "Ek dashboard me `for` loop se dynamically buttons banaye gaye, har button ka click-handler lambda hai jo loop ke `orderId` variable ko capture karta hai. Sab buttons same orderId show kar rahe hain click karne par — root cause aur fix?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Classic for-loop closure-capture bug — loop counter/variable shared hai, sab lambdas final value dekhte hain. Fix: loop ke andar local copy banao aur usse capture karo.",
    detailedAnswer:
      "`for (int idx = 0; idx < orders.Count; idx++) { var orderId = orders[idx].Id; button.OnClick += () => Show(orderId); }` — agar `orderId` DECLARE loop ke andar ho (jaisa yahan hai), C# me actually ye already per-iteration fresh variable hai (kyunki `var orderId = ...` har iteration me naya declaration hai) — to ye specific case theek chalega. Lekin agar bug hua, likely wajah ye hai ki `idx` (loop counter) ko directly capture kiya gaya bina intermediate variable ke. Fix universal pattern: loop body ke andar, capture se PEHLE, ek fresh local variable banao aur usi ko lambda me use karo.",
  },
  {
    id: "lambda-closures-tr-8",
    question: "Closures perf ke angle se kya cost aati hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Har closure ek hidden class instance allocate kar sakta hai heap pe (captured variables ke liye) — tight loops me repeatedly lambda banate rehna allocation pressure badha sakta hai.",
    detailedAnswer:
      "Jab lambda kisi outer variable ko capture karta hai, compiler ek 'display class' generate karta hai jisme wo variable field banta hai, aur lambda ek instance method ban jaata hai us class ka. Ye class heap pe allocate hoti hai. Agar ek lambda baar-baar (jaise ek hot loop ke andar) naye sirre se banaya jaaye jo kuch capture karta hai, har baar naya allocation ho sakta hai — GC pressure badhata hai. Agar lambda kuch capture NAHI karta (pure function, sirf apne parameters use karta hai), compiler usko cache/reuse kar sakta hai, allocation avoid ho jaata hai.",
    followUp: "Isse avoid karne ka koi pattern hai perf-critical code me?",
  },
];

export default questions;
