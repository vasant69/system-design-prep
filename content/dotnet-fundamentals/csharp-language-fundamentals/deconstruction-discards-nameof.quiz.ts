import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "deconstruct-1",
    question: "Custom class me deconstruction enable karne ke liye kaunsa method define karna zaroori hai?",
    options: [
      "Konsa bhi naam, bas out parameters ho",
      "Exactly `Deconstruct` naam ka method, `out` parameters ke saath",
      "`ToTuple()` naam ka method",
      "IDeconstructable interface implement karna",
    ],
    correctIndex: 1,
    explanation:
      "Compiler specifically `Deconstruct` naam ke method ko hi recognize karta hai deconstruction ke liye — method `out` parameters use karta hai, aur naam exactly yahi hona chahiye. Koi special interface implement karne ki zarurat nahi hai (Option D galat), bas method signature match hona chahiye.",
    difficulty: "medium",
  },
  {
    id: "deconstruct-2",
    question: "`nameof(age)` compile-time pe kya resolve hota hai, aur agar `age` rename ho jaaye to kya hota hai?",
    options: [
      "Ek hardcoded string jo rename ke baad bhi purani hi rehti hai",
      "Ek string jo symbol se genuinely linked hai — rename hone par compile error aata hai agar purana reference reh jaaye",
      "Runtime pe dynamically resolve hoti hai",
      "Rename se koi fark nahi padta, nameof() hamesha kaam karta rahega",
    ],
    correctIndex: 1,
    explanation:
      "`nameof()` compile-time pe string me resolve hota hai, lekin ye genuinely us symbol ka reference hai — agar `age` rename ho jaaye aur `nameof(age)` update na kiya jaaye, compile error aayega (kyunki `age` naam ab exist nahi karta). Ye ek hardcoded string se fundamentally alag, safer behavior hai.",
    difficulty: "medium",
  },
  {
    id: "deconstruct-3",
    question: "`var (name, _) = GetPerson();` me `_` kya karta hai?",
    options: [
      "Ek variable banata hai jiska naam '_' hai",
      "Second tuple value ko explicitly discard karta hai, koi variable allocate nahi hoti",
      "Compile error deta hai",
      "Pehle value ko bhi affect karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`_` ek discard hai — compiler ko batata hai ki ye specific value genuinely nahi chahiye, koi actual variable allocate nahi hoti uske liye. Multiple `_` ek scope me use ho sakte hain bina conflict ke, jabki `int x, int x` naming conflict deta.",
    difficulty: "easy",
  },
  {
    id: "deconstruct-4",
    question: "Positional `record Person(string Name, int Age);` ke saath deconstruction (`var (name, age) = person;`) automatically kaam karta hai kyun?",
    options: [
      "Records special compiler magic use karte hain jo tuples se alag hai",
      "Compiler positional records ke liye automatically ek Deconstruct method generate karta hai",
      "Ye kaam nahi karta, manually Deconstruct likhna padta hai",
      "Sirf agar record struct ho, class record ke saath nahi",
    ],
    correctIndex: 1,
    explanation:
      "Compiler positional record declarations ke liye automatically ek `Deconstruct(out string Name, out int Age)` method generate kar deta hai — isliye deconstruction bina developer ko kuch explicitly likhe kaam karta hai. Option D galat hai — ye class records aur record structs dono ke liye kaam karta hai.",
    difficulty: "hard",
  },
];

export default quiz;
