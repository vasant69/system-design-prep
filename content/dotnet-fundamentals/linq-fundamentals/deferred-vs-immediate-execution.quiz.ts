import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "deferred-1",
    question: "```csharp\nvar numbers = new List<int> { 1, 2, 3 };\nvar query = numbers.Where(n => n > 1);\nnumbers.Add(10);\nvar result = query.ToList();\n```\n`result` me kya hoga?",
    options: [
      "{ 2, 3 } — kyunki query pehle hi define ho chuki thi",
      "{ 2, 3, 10 } — kyunki query deferred hai aur .ToList() call hote waqt current source use hota hai",
      "Compile error — collection modified after query defined",
      "Runtime exception — InvalidOperationException",
    ],
    correctIndex: 1,
    explanation:
      "`Where()` deferred execution use karta hai — jab tak enumerate na ho (yahan `.ToList()` call ke through), filtering chalti hi nahi. `.ToList()` call hote waqt `numbers` me `{1,2,3,10}` hai, isliye `n > 1` filter se `{2,3,10}` milega. Option A galat hai kyunki ye assume karta hai query define hote hi snapshot le liya gaya, jo galat hai deferred execution ke saath. Options C aur D dono galat hain — ye valid, exception-free code hai.",
    difficulty: "hard",
  },
  {
    id: "deferred-2",
    question: "In operators me se kaunsa IMMEDIATE execution force karta hai?",
    options: [
      "Where",
      "Select",
      "ToList()",
      "OrderBy",
    ],
    correctIndex: 2,
    explanation:
      "`ToList()` query ko turant enumerate karke ek naya, materialized `List<T>` return karta hai — immediate execution. `Where`, `Select`, aur `OrderBy` teeno deferred (lazy) operators hain — sirf query describe karte hain, enumerate hone tak nahi chalte.",
    difficulty: "easy",
  },
  {
    id: "deferred-3",
    question: "Ek deferred LINQ query ko 3 baar alag-alag jagah `foreach` se enumerate kiya jaaye, aur beech-beech me source list modify hoti rahe. Kya teeno enumerations same result denge?",
    options: [
      "Haan, hamesha same result denge — query ek baar hi execute hoti hai",
      "Nahi zaroori nahi — har enumeration ek fresh, independent execution hai jo current source state use karti hai",
      "Sirf pehli enumeration hi actual result deti hai, baaki cached result dete hain",
      "Ye undefined behavior hai, C# specification isko define nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Deferred query koi caching nahi karti — har enumeration query ko poora dobara execute karti hai, current source state ke against. Agar source enumerations ke beech modify hui hai, alag-alag enumerations genuinely alag results de sakti hain. Option A galat hai — ye immediate-execution ka behavior hai, deferred ka nahi. Option C galat hai, koi caching nahi hoti. Option D galat hai — ye well-defined, documented behavior hai.",
    difficulty: "medium",
  },
  {
    id: "deferred-4",
    question: "`.ToList()` se materialize karne ka sabse bada practical fayda kya hai jab query result multiple jagah use hona ho?",
    options: [
      "Memory usage kam hoti hai",
      "Query ek baar hi execute hoti hai — result ek independent snapshot ban jaata hai jo source ke aage change hone se unaffected rehta hai, aur repeated computation avoid hota hai",
      "LINQ operators ka poora set method syntax me available ho jaata hai",
      "Compile-time type checking strict ho jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "`.ToList()` deferred query ko ek baar enumerate karke ek concrete, independent list bana deta hai — uske baad source change hone ka koi effect nahi hota, aur agar wahi result multiple jagah use karna ho, repeated execution (aur agar computation expensive hai to repeated cost) avoid ho jaati hai. Option A galat hai — materializing actually extra memory leti hai (poora result store hota hai). Options C aur D is context se unrelated hain.",
    difficulty: "medium",
  },
];

export default quiz;
