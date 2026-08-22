import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "oop-intro-1",
    question: ".NET ke CLR me `System.Object` ka kya special role hai?",
    options: [
      "Sirf reference types isse derive karte hain",
      "Ye poore type system ka single root hai — reference types AND value types (jaise int) dono ultimately isi se derive karte hain",
      "Sirf classes isse derive karte hain, structs nahi",
      "Ye ek optional base class hai jo skip kiya ja sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "CTS (Common Type System) ka fundamental rule hai ki har type — reference ho ya value — ultimately System.Object se derive karta hai. Value types (jaise int) System.ValueType ke through derive karte hain, jo khud System.Object se aata hai. Isliye har type pe ToString()/Equals() jaisi methods available hoti hain. Option A aur C dono galat hain kyunki value types bhi isme included hain. Option D galat hai — ye mandatory hai, optional nahi.",
    difficulty: "easy",
  },
  {
    id: "oop-intro-2",
    question: "Procedural programming (jaise plain C) me codebase badhne par kaunsi problem sabse zyada aati hai jo OOP solve karta hai?",
    options: [
      "Procedural code hamesha slow hota hai",
      "Koi bhi function kahin bhi shared/global data modify kar sakta hai, jisse ek jagah change karne par kahin aur unpredictably kuch toot sakta hai",
      "Procedural languages compile nahi hoti",
      "Procedural code me functions likhna allowed nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "Procedural programming me data aur behavior alag hote hain, koi enforced ownership boundary nahi — koi bhi function shared state ko modify kar sakta hai. OOP isko object ke andar state+behavior bundle karke aur access control (encapsulation) ke through solve karta hai. Option A, C, D sab factually galat statements hain, performance/compilation/syntax se koi lena dena nahi hai is problem ka.",
    difficulty: "easy",
  },
  {
    id: "oop-intro-3",
    question: "Modern ASP.NET Core codebase me OOP ka 'inheritance-heavy' approach ki jagah kya zyada common hai?",
    options: [
      "Deep multi-level inheritance chains",
      "Interfaces + composition + dependency injection",
      "Global static classes ke through sab logic likhna",
      "OOP ka use hi nahi hota, sab functional style me likha jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Modern .NET/ASP.NET Core code interface-based abstraction, composition, aur DI ko heavily prefer karta hai deep inheritance chains ki jagah — jaise controller ek concrete service class ki jagah IOrderService interface pe depend karta hai. Ye OOP ka hi ek mature application hai, sirf hierarchy-heavy nahi. Option A dated approach hai jo fragile hota hai. Option C aur D dono factually galat hain — ASP.NET Core heavily OOP based hai, static classes ya pure functional style nahi.",
    difficulty: "medium",
  },
  {
    id: "oop-intro-4",
    question: "`int x = 5; object o = x;` likhne par kya hota hai jo interviewer test karna chahta hai?",
    options: [
      "Kuch special nahi hota, int already object hi hai koi cost ke bina",
      "Boxing hota hai — value type ka data heap par allocate hota hai taaki wo object reference ke through handle ho sake, jo ek real perf cost hai",
      "Ye compile error deta hai kyunki int object nahi ban sakta",
      "int automatically string me convert ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Jab ek value type (int) ko object type variable me assign kiya jaata hai, CLR 'boxing' karta hai — value ko heap par ek naye object me wrap karta hai. Ye ek real, measurable allocation cost hai jo pure reference types nahi paate. Option A galat hai kyunki ye cost-free nahi hai. Option C galat hai, ye valid, compiling code hai (int System.Object se hi derive karta hai). Option D bhi galat hai, koi string conversion nahi ho raha.",
    difficulty: "medium",
  },
];

export default quiz;
