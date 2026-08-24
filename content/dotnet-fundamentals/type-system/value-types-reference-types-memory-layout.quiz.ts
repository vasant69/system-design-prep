import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "value-ref-memory-1",
    question:
      "`var q = p;` jahan `p` ek `Person` (class) instance hai. `q.Name = \"Riya\";` karne ke baad `p.Name` kya hoga?",
    options: [
      "Original value, kyunki q ek independent copy hai",
      "\"Riya\" — kyunki p aur q dono same object ko point kar rahe hain",
      "Compile error, class ko is tarah assign nahi kar sakte",
      "null, kyunki q assignment ne p ko reset kar diya",
    ],
    correctIndex: 1,
    explanation:
      "`Person` ek reference type hai, isliye `q = p` sirf address copy karta hai — dono variables same heap object ko point karte hain. `q` ke through kiya gaya field mutation `p` se bhi dikhta hai, kyunki underlying object ek hi hai. Option A galat hai kyunki reference types independent copy nahi banate. Option C aur D dono factually galat hain, ye valid aur common C# code hai.",
    difficulty: "easy",
  },
  {
    id: "value-ref-memory-2",
    question:
      "Ek `void Reassign(Person p) { p = new Person(); }` method call karne ke baad, caller ka original `Person` variable kya reflect karega?",
    options: [
      "Naya Person object jo method ne banaya",
      "Original object hi rahega — reassignment sirf method ke andar local copy of the address ko badalta hai",
      "null",
      "Compile error",
    ],
    correctIndex: 1,
    explanation:
      "Parameter `p` ko address ka COPY milta hai. Us copy ko naye object se reassign karna sirf local copy ko badalta hai, caller ke original reference variable ko nahi — kyunki `ref` keyword use nahi hua. Isliye caller ka variable original object hi point karta rahega. Options A, C, D sab is behavior ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "value-ref-memory-3",
    question:
      "Ek `struct` jo kisi `class` ka field hai (jaise `Person.Address`, jahan `Address` ek struct hai), kahan store hota hai?",
    options: [
      "Hamesha stack pe, kyunki struct ek value type hai",
      "Heap pe, us containing Person object ke andar hi inline",
      "Ek alag, dedicated 'struct heap' pe",
      "Ye undefined behavior hai, C# spec me define nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Value type 'wahin store hota hai jahan uska container hota hai.' Agar container khud ek heap object (class instance) hai, uske value-type fields us object ke andar hi inline store hote hain — heap pe, stack pe nahi. 'Value types hamesha stack pe' ek common oversimplification hai jo galat hai jab value type kisi heap object ka field ho. Option C aur D dono fictional/galat hain.",
    difficulty: "hard",
  },
  {
    id: "value-ref-memory-4",
    question:
      "`int x = 5; int y = x; y = 10;` ke baad `x` ki value kya hai?",
    options: [
      "10, kyunki y aur x same memory share karte hain",
      "5 — value types copy hote hain, y ki apni independent memory hai",
      "Compile error",
      "0, kyunki reassignment se x reset ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`int` ek value type hai. `int y = x;` `x` ki value ka ek independent copy `y` ko deta hai. `y` ko baad me modify karna `x` ko bilkul affect nahi karta, kyunki dono ab completely separate memory locations hain. Ye value types ka defining behavior hai, reference types se bilkul ulta.",
    difficulty: "easy",
  },
];

export default quiz;
