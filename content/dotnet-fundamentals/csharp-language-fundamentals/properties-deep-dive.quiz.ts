import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "properties-1",
    question: "`public string Name { get; init; }` waale object `p` pe, construction ke baad `p.Name = \"New\";` likhne se kya hoga?",
    options: [
      "Value silently update ho jaayegi",
      "Runtime exception aayega",
      "Compile error aayega",
      "Sirf agar Name pehle se null ho, tabhi allowed hoga",
    ],
    correctIndex: 2,
    explanation:
      "`init`-only setter sirf object-initializer/construction ke dauraan set ho sakta hai — construction complete hone ke baad koi bhi assignment attempt COMPILE ERROR deta hai, runtime tak pahunchta hi nahi. Options A, B, D sab galat hain.",
    difficulty: "medium",
  },
  {
    id: "properties-2",
    question: "`required` member (C# 11) kya guarantee deta hai?",
    options: [
      "Property ki value hamesha valid/non-empty hogi",
      "Property object-initializer ke dauraan zaroor set ki jaayegi, warna compile error",
      "Property automatically thread-safe hogi",
      "Property ko sirf constructor se hi set kiya ja sakta hai, object-initializer se nahi",
    ],
    correctIndex: 1,
    explanation:
      "`required` sirf ye compiler-enforce karta hai ki property object-initializer syntax me explicitly set ki jaaye — agar na ki jaaye, compile error aata hai. Ye VALUE ki validity check nahi karta (Option A galat) — empty string bhi 'set' maana jaayega. Option D ulta hai — required properties object-initializer se hi typically set hoti hain (init ke saath combine ho kar).",
    difficulty: "medium",
  },
  {
    id: "properties-3",
    question: "Auto-property (`{ get; set; }`) internally compiler kya karta hai?",
    options: [
      "Kuch nahi, ye sirf documentation hai",
      "Ek hidden, compiler-generated backing field banata hai",
      "Property ko interface me convert kar deta hai",
      "Runtime pe dynamically field banata hai",
    ],
    correctIndex: 1,
    explanation:
      "Compiler auto-property ke liye automatically ek anonymous, inaccessible backing field generate karta hai compile-time pe — functionally ye manually likhe gaye `private string _name; public string Name { get => _name; set => _name = value; }` ke equivalent IL produce karta hai.",
    difficulty: "easy",
  },
  {
    id: "properties-4",
    question: "Kya `init` property ke andar rakhi ek mutable `List<T>` ke elements construction ke baad modify ho sakte hain?",
    options: [
      "Nahi, init poori tarah deep-immutable bana deta hai",
      "Haan — init sirf property reference ko protect karta hai, list ke andar ke elements ab bhi modify ho sakte hain",
      "Sirf agar list empty ho",
      "List<T> ke saath init use hi nahi ho sakta",
    ],
    correctIndex: 1,
    explanation:
      "`init` sirf ye ensure karta hai ki property khud (reference) construction ke baad reassign na ho — lekin agar us property ka type ek mutable collection hai (`List<T>`), collection ke andar ke elements (`obj.MyList.Add(x)`) ab bhi normally modify ho sakte hain, kyunki wo collection ka apna behavior hai, property assignment nahi. Genuine deep immutability ke liye ImmutableList jaise types chahiye honge.",
    difficulty: "hard",
  },
];

export default quiz;
