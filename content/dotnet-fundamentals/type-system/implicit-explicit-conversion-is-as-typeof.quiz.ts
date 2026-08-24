import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "conversion-1",
    question: "`object obj = 42; string? s = obj as string;` ke baad `s` ki value kya hogi?",
    options: [
      "\"42\" — automatically converted to string",
      "null — cast fail hua, `as` exception ki jagah null return karta hai",
      "InvalidCastException throw hoga",
      "Compile error",
    ],
    correctIndex: 1,
    explanation:
      "`as` operator failed cast pe exception throw nahi karta, `null` return karta hai. `obj` actually ek boxed `int` hai, `string` nahi, isliye cast fail hota hai aur `s` ko `null` milta hai. Option A galat hai — koi automatic string conversion nahi hoti. Option C galat hai — wo direct cast `(string)obj` ka behavior hota, `as` ka nahi.",
    difficulty: "medium",
  },
  {
    id: "conversion-2",
    question: "`typeof(Person)` aur `personInstance.GetType()` me fundamental difference kya hai?",
    options: [
      "Koi difference nahi, dono same cheez karte hain",
      "typeof compile-time hai (type name se resolve), GetType() runtime hai (instance ka actual concrete type)",
      "typeof sirf value types ke liye kaam karta hai, GetType() sirf reference types ke liye",
      "GetType() faster hai typeof se",
    ],
    correctIndex: 1,
    explanation:
      "`typeof(SomeType)` compile-time operator hai — directly type name se Type object resolve karta hai, koi instance nahi chahiye. `GetType()` runtime method hai — ek actual instance pe call hota hai, aur uska concrete runtime type return karta hai (declared/static type se independent). Options C aur D dono factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "conversion-3",
    question: "`int x = 5000000000;` (5 billion, jo int range se bahar hai) ye code kya karega?",
    options: [
      "Compile ho jaayega aur runtime pe silently truncate hoga",
      "Compile error — implicit conversion allowed nahi hai kyunki data loss ho sakti hai",
      "Runtime pe InvalidCastException",
      "Automatically long me convert ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "5 billion `int`'s range (~2.1 billion max) se bahar hai. Compiler implicit conversion allow nahi karta jab data loss possible ho — ye compile-time error dega, tumhe explicit cast likhna padega (`(int)5000000000L`) agar tum genuinely truncation chahte ho, jo phir tumhari deliberate choice hai.",
    difficulty: "hard",
  },
  {
    id: "conversion-4",
    question: "`if (obj is string s) { Console.WriteLine(s.Length); }` — ye C# 7+ pattern kya karta hai ek hi step me?",
    options: [
      "Sirf type check karta hai, cast nahi karta",
      "Type check karta hai, cast karta hai, aur naya variable declare karta hai — sab ek expression me",
      "Sirf cast karta hai, koi check nahi",
      "Ye invalid syntax hai C# me",
    ],
    correctIndex: 1,
    explanation:
      "Ye C# 7 se aaya pattern-matching form of `is` hai — ye check karta hai `obj` string hai ya nahi, aur agar hai, to usse ek naye typed variable `s` me cast bhi kar deta hai, jo `if` block ke andar safely use ho sakta hai — teeno cheezein (check + cast + declare) ek line me, purane 2-step approach (`is` check phir separate cast) se safer aur concise.",
    difficulty: "easy",
  },
];

export default quiz;
