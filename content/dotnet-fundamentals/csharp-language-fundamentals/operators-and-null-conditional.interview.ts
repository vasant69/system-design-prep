import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "operators-null-tr-1",
    question: "Null-conditional operator (`?.`) kya karta hai, aur ye kaunse exception se bachata hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Cognizant"],
    shortAnswer: "`?.` left side null hone par poore expression ko short-circuit karke null return karta hai — NullReferenceException se bachata hai.",
    detailedAnswer:
      "`a?.B` check karta hai `a` null hai ya nahi. Agar null hai, poora expression evaluate hue bina `null` return kar deta hai. Agar non-null hai, normal member access hota hai (`a.B`). Ye NullReferenceException se directly bachata hai jab left side genuinely optional ho sakta ho, aur chain ho sakta hai (`a?.B?.C`) taaki har level pe explicit null-check na likhna pade.",
    followUp: "Agar `a?.B` ek method call ho jo `void` return karti hai, kya hota hai `a` null hone par?",
  },
  {
    id: "operators-null-tr-2",
    question: "`??=` kab introduce hua, aur ye `if (x == null) x = value;` se better kaise hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "C# 8.0 me aaya — same behavior, lekin ek concise line me, aur right side sirf tabhi evaluate hoti hai jab left null ho.",
    detailedAnswer:
      "`x ??= value;` functionally `if (x == null) { x = value; }` ke equivalent hai, lekin zyada concise aur readable hai, aur lazy-evaluation guarantee ke saath explicit — agar `value` ek expensive expression (jaise `new ExpensiveObject()`) hai, wo sirf tabhi evaluate hoti hai jab genuinely zarurat ho. Ye lazy-initialization pattern (caches, singletons) ke liye ek natural fit hai.",
  },
  {
    id: "operators-null-tr-3",
    question: "Ye code kya print karega?\n```csharp\nint? count = null;\nint result = count ?? GetDefault();\nConsole.WriteLine(result);\n```\n(maan lo `GetDefault()` 5 return karta hai)",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "5 — count null hai, isliye ?? ka right side (GetDefault()) evaluate ho kar use hota hai.",
    detailedAnswer:
      "`??` operator left operand (`count`) check karta hai. Wo null hai, isliye right operand `GetDefault()` evaluate hota hai aur uska return value (5) `result` me assign hota hai. Agar `count` non-null hota, `GetDefault()` call hi nahi hota (short-circuit evaluation).",
  },
  {
    id: "operators-null-tr-4",
    question: "Ek method `LogAndFetch()` ek logging side-effect ke saath value return karta hai. Kya `x ??= LogAndFetch();` likhna safe hai agar tum chahte ho ki log HAMESHA print ho, chahe `x` null ho ya na ho?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — `??=` sirf tabhi right side evaluate karta hai jab `x` null ho, isliye agar `x` already non-null hai, log kabhi print nahi hoga.",
    detailedAnswer:
      "`??=` ka right side conditionally evaluate hota hai — sirf jab left side currently null ho. Agar developer ye assume kare ki right side hamesha run hogi (jaise ek unconditional log statement), ye ek silent bug ban jaata hai jahan logging sirf 'first time when null' hoti hai, har baar nahi. Side-effect wali expressions ko `??=` ke right side me daalna generally avoid karna chahiye jab tak conditional-execution intentional na ho.",
    redFlag: "Ye maan lena ki `??=` ka right side hamesha evaluate hoti hai, jaisa ek normal assignment me hota — ye ek genuinely conditional operator hai.",
  },
  {
    id: "operators-null-tr-5",
    question: "`customer?.Orders?.Count()` aur `customer.Orders?.Count() ?? 0` me practical fark samjhao — kab konsa use karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Pehla poore expression ko nullable int? banata hai (customer null hone par bhi safe); doosra customer ko non-null assume karta hai lekin Orders ko optional treat karta hai, aur ek guaranteed non-null int deta hai.",
    detailedAnswer:
      "`customer?.Orders?.Count()` — agar customer YA Orders dono me se koi bhi null ho, poora result `int?` (null) hota hai; is result ko aage use karne se pehle phir null-check ya `??` chahiye hoga. `customer.Orders?.Count() ?? 0` assume karta hai customer kabhi null nahi hoga (agar wo null hua to NullReferenceException aayega on `customer.Orders`), lekin agar Orders null ho, `?? 0` ek guaranteed non-null `int` de deta hai. Konsa sahi hai depend karta hai domain invariant pe — kya customer genuinely kabhi null ho sakta hai is context me.",
  },
  {
    id: "operators-null-tr-6",
    question: "`a & b` aur `a && b` dono boolean expressions ke saath valid syntax hain. Ek scenario batao jahan `&` use karna genuinely galat/dangerous ho sakta hai.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Jab right side ek null-check pe depend karta ho — `&` use karne se right side hamesha evaluate hoga chahe left false ho, jisse NullReferenceException aa sakta hai.",
    detailedAnswer:
      "Classic example: `if (obj != null & obj.IsValid)` — agar `obj` null hai, `&` ke saath `obj.IsValid` bhi evaluate hoga (kyunki `&` short-circuit nahi karta), jisse NullReferenceException throw hoga. `&&` ke saath (`obj != null && obj.IsValid`), `obj` null hone par right side skip ho jaata, koi exception nahi aata. Ye exact wajah hai `&&`/`||` ko boolean logic ke liye almost always prefer kiya jaata hai `&`/`|` ke bajaye.",
  },
  {
    id: "operators-null-tr-7",
    question: "`?[]` (null-conditional indexer) kaise kaam karta hai, ek example do.",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Array/list ko index karta hai sirf agar reference null nahi hai — `arr?[0]` arr null hone par null return karta hai, IndexOutOfRangeException nahi.",
    detailedAnswer:
      "```csharp\nint[]? numbers = null;\nint? first = numbers?[0]; // first = null, koi exception nahi\n\nnumbers = new[] { 10, 20 };\nfirst = numbers?[0]; // first = 10\n```\n`numbers?[0]` sirf `numbers` null hone par short-circuit karta hai — agar `numbers` non-null hai lekin index out of range hai (e.g. `numbers?[5]`), ye still ek normal `IndexOutOfRangeException` throw karega, kyunki `?[]` sirf null-check karta hai, bounds-check nahi.",
  },
  {
    id: "operators-null-tr-8",
    question: "Kab `?.` overuse karna ek code-smell ban jaata hai, definitions ke against?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Jab ek genuinely-unexpected null ko silently swallow kar diya jaaye, jabki wo actually ek bug signal karta — fail-fast (exception) zyada sahi hota.",
    detailedAnswer:
      "`?.`/`??` ka purpose genuinely-optional values ko gracefully handle karna hai. Agar `customer` kabhi bhi genuinely null nahi hona chahiye is business logic me (ek invariant hai), aur phir bhi `customer?.Name ?? \"\"` likha jaaye, to ek real bug (customer somehow null aa gaya) silently ek empty string ban kar aage badh jaata hai — debugging bahut mushkil ho jaata hai kyunki koi crash nahi hota, sirf galat data flow hota hai. Aisi jagah ek explicit null-check + throw (ya ArgumentNullException) zyada correct hota hai.",
    redFlag: "Har jagah blindly ?./?? laga dena bina ye socha ki wahan null genuinely expected/valid hai ya nahi.",
  },
];

export default questions;
