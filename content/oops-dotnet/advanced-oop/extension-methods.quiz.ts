import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "extension-1",
    question: "`public static bool IsValidEmail(this string input) { ... }` likhne ke liye kaunse teen rules follow karne padte hain?",
    options: [
      "Method instance method hona chahiye, class abstract honi chahiye, parameter ref honi chahiye",
      "Method static hona chahiye, ek static class ke andar likha hona chahiye, aur pehle parameter pe this modifier hona chahiye",
      "Method virtual hona chahiye, interface ke andar likha hona chahiye",
      "Method private hona chahiye, sealed class ke andar likha hona chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Extension method ke teen requirements hain: static method, static class ke andar, aur pehle parameter pe 'this' modifier jo extend hone wale type ko specify karta hai. Options A, C, D sab in requirements ko galat batate hain — extension method instance, virtual, ya private nahi hota, aur interface ke andar nahi likha jaata.",
    difficulty: "easy",
  },
  {
    id: "extension-2",
    question: "`\"test@x.com\".IsValidEmail()` call ko compiler actually kaise translate karta hai?",
    options: [
      "Ye ek real instance method call rehta hai, koi translation nahi hoti",
      "StringExtensions.IsValidEmail(\"test@x.com\") — ek plain static method call",
      "Ye reflection use karke dynamically resolve hota hai",
      "Ye runtime pe interface ke through dispatch hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Extension method call sirf syntactic sugar hai — compiler ise ek plain static method call me translate kar deta hai (ClassName.MethodName(receiver, ...args)). Ye compile-time translation hai, koi runtime magic, reflection, ya interface dispatch nahi. Options A, C, D sab is mechanism ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "extension-3",
    question: "Agar `Animal` (base class) aur `Dog` (derived class) dono ke liye alag-alag same-signature extension methods defined hon, to kaunsa call hoga jab `Animal a = new Dog(); a.SomeExtension();` likha jaaye?",
    options: [
      "Dog wala extension method, kyunki runtime type Dog hai",
      "Animal wala extension method, kyunki resolution compile-time (declared) type pe based hoti hai, runtime type pe nahi",
      "Compile error aayega, ambiguous call",
      "Dono methods call honge",
    ],
    correctIndex: 1,
    explanation:
      "Extension method resolution COMPILE-TIME type pe based hoti hai, jo yahan Animal hai (variable ka declared type), Dog nahi (runtime/actual object type). Isliye Animal wala extension method call hoga, chahe actual object Dog ho. Ye virtual/override polymorphism se bilkul opposite hai jo runtime type pe based hota hai. Option A common galat intuition hai jo runtime polymorphism se confuse karti hai. Options C aur D is scenario ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "extension-4",
    question: "LINQ ke `Where`, `Select`, `OrderBy` jaise operators kahan defined hain, aur `IEnumerable<T>` interface se unka kya relation hai?",
    options: [
      "Ye IEnumerable<T> interface ke members hain, directly usme defined",
      "Ye System.Linq.Enumerable static class me extension methods hain jo IEnumerable<T> ko extend karte hain — interface khud sirf GetEnumerator() define karta hai",
      "Ye har collection class (List, Array, etc.) me individually implement kiye gaye hain",
      "Ye compiler built-in keywords hain, koi method hi nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "IEnumerable<T> interface khud sirf ek method define karta hai — GetEnumerator(). Where/Select/OrderBy/etc sab System.Linq.Enumerable static class me extension methods ke roop me defined hain, jo IEnumerable<T> ko extend karte hain. Isi wajah se 'using System.Linq;' likhna zaroori hai inhe use karne ke liye. Option A galat hai, interface itna simple hai. Option C galat hai, per-collection implementation ki zaroorat nahi padti extension methods ki wajah se. Option D bhi galat hai, ye real methods hain, keywords nahi.",
    difficulty: "medium",
  },
];

export default quiz;
