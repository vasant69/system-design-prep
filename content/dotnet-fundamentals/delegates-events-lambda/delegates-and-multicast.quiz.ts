import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "delegates-multicast-1",
    question: "Ek multicast delegate `int` return karta hai aur 3 methods subscribed hain (`+=` se). Invoke karne par caller ko kya return value milega?",
    options: [
      "Teeno methods ke return values ka sum",
      "Pehle subscribed method ka return value",
      "Sirf LAST subscribed method ka return value, baaki discard",
      "Compile error — multicast delegates kabhi value return nahi kar sakte",
    ],
    correctIndex: 2,
    explanation:
      "Multicast delegate invocation list ke sab methods sequentially call hote hain, lekin caller ko sirf LAST invoked method ka return value milta hai — beech ke sab return values silently discard ho jaate hain. Option A galat hai, koi automatic sum nahi hota. Option B galat hai, first nahi, last method ka value milta hai. Option D galat hai — multicast delegates value return kar sakte hain, bas sirf last wala visible hota hai.",
    difficulty: "medium",
  },
  {
    id: "delegates-multicast-2",
    question: "Ek multicast delegate ki invocation list me 3 methods hain — dusra method exception throw karta hai. Kya hoga?",
    options: [
      "Sab 3 methods call honge, exception sirf log ho jaayega",
      "Pehla method call hoga, dusre me exception throw hoga, aur teesra method KABHI call nahi hoga",
      "Exception silently swallow ho jaayega, sab methods complete honge",
      "Sirf teesra method skip hoga, pehla aur dusra dono complete honge",
    ],
    correctIndex: 1,
    explanation:
      "Invocation list sequentially chalta hai — jaise hi koi subscriber exception throw karta hai, execution wahin ruk jaata hai, baaki bache subscribers (yahan teesra) kabhi call nahi hote. Options A aur C galat hain — exception silently swallow nahi hota, propagate hota hai aur chain rok deta hai. Option D galat hai — pehla method complete hota hai, dusra exception throw karta hai (khud complete nahi hota), teesra skip ho jaata hai.",
    difficulty: "hard",
  },
  {
    id: "delegates-multicast-3",
    question: "`notify += Logger.LogToFile;` likhne par internally kya hota hai?",
    options: [
      "`notify` delegate object ko in-place mutate kar diya jaata hai",
      "`Delegate.Combine()` call hota hai jo ek NAYA delegate object return karta hai jise `notify` ko assign kiya jaata hai",
      "Ek naya thread spawn hota hai `LogToFile` ke liye",
      "`LogToFile` method ka source code `notify` me copy ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Delegates immutable hain — `+=` actually `Delegate.Combine()` call karta hai jo ek naya delegate object banata hai jisme pehle wali invocation list + naya method dono hote hain, aur wo naya object `notify` variable ko assign ho jaata hai. Option A galat hai — koi in-place mutation nahi hoti, delegates immutable hain. Options C aur D dono factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "delegates-multicast-4",
    question: "`public delegate int MathOperation(int a, int b);` declare karne ke baad, kaunsa method is delegate type ko assign kiya ja sakta hai?",
    options: [
      "Sirf static methods jinka naam 'MathOperation' se match kare",
      "Koi bhi method (static ya instance) jiska signature `int(int, int)` match kare",
      "Sirf instance methods, static methods delegates ko assign nahi ho sakte",
      "Sirf `MathOperation` class ke andar declare kiye methods",
    ],
    correctIndex: 1,
    explanation:
      "Delegate assignment sirf method SIGNATURE match karne pe depend karta hai — return type aur parameter types same hone chahiye, method ka naam ya class kuch matter nahi karta. Static aur instance dono methods equally assign ho sakte hain. Option A, C, aur D sab galat constraints add karte hain jo actually exist hi nahi karte.",
    difficulty: "easy",
  },
];

export default quiz;
