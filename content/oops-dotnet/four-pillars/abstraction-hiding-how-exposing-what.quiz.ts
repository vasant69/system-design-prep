import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "abstraction-1",
    question: "Encapsulation aur abstraction me core difference kya hai?",
    options: [
      "Dono bilkul same concept hain, alag naam bas",
      "Encapsulation state ko protect karta hai (kaun modify kar sakta hai), abstraction complexity ko hide karta hai (caller ko kya dikhta hai)",
      "Encapsulation sirf interfaces me hota hai, abstraction sirf classes me",
      "Abstraction runtime concept hai, encapsulation compile-time concept hai",
    ],
    correctIndex: 1,
    explanation:
      "Encapsulation 'how state is protected' ke baare me hai — private fields, validated methods. Abstraction 'what is exposed' ke baare me hai — caller ko implementation detail se decouple karna. Option A galat hai, ye distinct concerns hain. Option C aur D dono technically inaccurate hain, dono concepts classes aur interfaces dono me apply hote hain aur dono primarily design/compile-time concerns hain.",
    difficulty: "medium",
  },
  {
    id: "abstraction-2",
    question: "Ek method `IOrderService.PlaceOrderAsync` directly `SqlException` throw karta hai underlying database error hone par. Ye kya problem hai?",
    options: [
      "Koi problem nahi, ye normal hai",
      "Leaky abstraction — implementation detail (SQL Server use ho raha hai) contract se leak ho gayi, jo abstraction ka purpose defeat karta hai",
      "Ye ek performance issue hai",
      "Ye ek encapsulation violation hai, abstraction se koi lena dena nahi",
    ],
    correctIndex: 1,
    explanation:
      "Achhi abstraction implementation-specific detail (jaise ADO.NET ka SqlException) leak nahi hone deti — apne khud ke domain exceptions define karti hai. SqlException directly throw karna caller ko force karta hai ki wo underlying technology ke baare me jaane, jo poora abstraction ka point defeat karta hai. Options A, C, D is specific issue (leaky abstraction) ko correctly identify nahi karte.",
    difficulty: "hard",
  },
  {
    id: "abstraction-3",
    question: "C# me interface aur abstract class dono abstraction ke tools hain. Ek fundamental structural difference kya hai?",
    options: [
      "Interfaces kabhi implementation nahi rakh sakte, abstract classes hamesha pura implementation rakhte hain",
      "Ek class multiple interfaces implement kar sakti hai lekin sirf ek base class se inherit kar sakti hai",
      "Abstract classes sirf structs ke liye hote hain",
      "Interfaces sirf static methods rakh sakte hain",
    ],
    correctIndex: 1,
    explanation:
      "Multiple interface implementation allowed hai C# me, lekin single class inheritance hi allowed hai — ye asymmetry directly influence karti hai ki kab kya choose karo. Option A galat hai kyunki C# 8+ default interface methods allow karta hai. Option C factually galat hai, abstract classes sirf reference types (classes) ke liye hote hain, structs abstract nahi ho sakte. Option D galat hai, interfaces instance methods bhi rakh sakte hain.",
    difficulty: "medium",
  },
  {
    id: "abstraction-4",
    question: "`OrdersController` `IOrderService` pe depend karta hai, seedha `OrderService` class pe nahi. Iska sabse bada practical benefit kya hai?",
    options: [
      "Code chalega faster",
      "Implementation (OrderService ke andar database/notifier logic) badalne par controller ka code change nahi karna padta, aur testing ke liye ek fake implementation inject ki ja sakti hai",
      "Memory usage kam hogi",
      "Ye C# me mandatory syntax hai, koi choice nahi",
    ],
    correctIndex: 1,
    explanation:
      "Abstraction (interface) pe depend karne se caller implementation detail se decouple ho jaata hai — implementation swap karna (naya database, naya notification provider) ya unit test ke liye mock/fake inject karna, dono possible ho jaate hain bina controller code touch kiye. Options A, C, D is core benefit se unrelated hain.",
    difficulty: "easy",
  },
];

export default quiz;
