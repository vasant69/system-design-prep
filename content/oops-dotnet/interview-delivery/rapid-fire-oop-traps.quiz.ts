import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "rapid-fire-1",
    question: "`private protected` access modifier ka exact meaning kya hai?",
    options: [
      "Protected OR internal (union) — same assembly me koi bhi, ya kisi bhi assembly ki derived class",
      "Protected AND internal (intersection) — sirf same assembly ke andar derived classes",
      "Sirf private, protected keyword ka koi effect nahi",
      "Sirf internal, private keyword ka koi effect nahi",
    ],
    correctIndex: 1,
    explanation:
      "private protected ek intersection hai — access sirf tab milta hai jab code same assembly ke andar ho AND derived class ho, dono conditions saath. protected internal (union) se ye alag hai, jahan koi bhi ek condition (same assembly, YA derived class) kaafi hai. Option A actually protected internal ka description hai, is question ka nahi. C aur D dono incomplete/galat hain.",
    difficulty: "hard",
  },
  {
    id: "rapid-fire-2",
    question: "Method hiding (new keyword) aur overriding (override keyword) me, base-type reference se call karne par result kaisa differ karta hai?",
    options: [
      "Dono hamesha same result dete hain, koi difference nahi",
      "Hiding compile-time/static reference type se resolve hota hai; overriding runtime/actual object type se resolve hota hai — isliye result different ho sakta hai",
      "Hiding runtime type se resolve hota hai, overriding compile-time se",
      "Dono compile error dete hain agar base-type reference use karo",
    ],
    correctIndex: 1,
    explanation:
      "Ye classic C# trap hai. new (hiding) wala method call compile-time pe, reference ke declared type ke basis pe resolve hota hai — polymorphism yahan kaam nahi karta. override wala method call runtime pe, object ke actual type ke basis pe resolve hota hai — true polymorphism. Isi wajah se base-type-typed reference se call karne par dono alag output de sakte hain same-looking code me.",
    difficulty: "hard",
  },
  {
    id: "rapid-fire-3",
    question: "Ek class me Equals() override kiya lekin GetHashCode() nahi kiya — kya risk hai?",
    options: [
      "Koi risk nahi, dono independent hain",
      "Compile error aayega turant",
      "Hash-based collections (Dictionary, HashSet) silently incorrect behave kar sakti hain — contract violate hota hai ki equal objects ka same hash code ho",
      "Runtime pe exception throw hoga har baar Equals call hone pe",
    ],
    correctIndex: 2,
    explanation:
      "Equals()/GetHashCode() ek contract follow karte hain — do objects jo Equals() ke through equal hain, unka GetHashCode() bhi same return karna chahiye. Agar sirf Equals() override kiya aur GetHashCode() purana (reference-based) reh gaya, Dictionary/HashSet jaisi hash-based collections galat bucket me daal sakti hain objects ko, jisse lookups silently fail ho sakte hain — koi compile error ya obvious exception nahi aata, bug subtle rehta hai.",
    difficulty: "medium",
  },
  {
    id: "rapid-fire-4",
    question: "DIP (Dependency Inversion Principle) aur DI (Dependency Injection) same cheez hain kya?",
    options: [
      "Haan, dono exactly same concept ko refer karte hain",
      "Nahi — DIP ek design principle hai (abstractions pe depend karo), DI ek technique hai dependencies supply karne ki; ek dusre ke bina bhi possible hain",
      "DI, DIP ka ek outdated naam hai",
      "DIP sirf interfaces ke liye hai, DI sirf classes ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Ye ek classically confused pair hai. DIP kehta hai high-level modules ko abstractions pe depend karna chahiye, low-level details pe nahi — ye ek design principle hai. DI ek technique/pattern hai jisse dependencies supply ki jaati hain (constructor injection, DI container). Tum DI use karke bhi DIP violate kar sakte ho (concrete class inject karke), aur DIP follow kar sakte ho bina DI container ke (manual factory se). Options C aur D dono factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
