import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "system-object-1",
    question: "`System.Object` ke 4 methods me se kaunsa method `virtual` NAHI hai?",
    options: ["ToString()", "Equals(object)", "GetHashCode()", "GetType()"],
    correctIndex: 3,
    explanation:
      "`GetType()` deliberately sealed hai — virtual nahi — taaki koi derived class runtime type identity ko fake na kar sake. ToString, Equals, aur GetHashCode teeno virtual hain aur commonly override kiye jaate hain. Ye design choice reflection aur type-checking ki reliability ke liye zaroori hai.",
    difficulty: "medium",
  },
  {
    id: "system-object-2",
    question:
      "Do `struct` instances (dono same field values ke saath) ko bina override kiye default `Equals()` se compare karne par kya milega?",
    options: [
      "False, kyunki structs bhi reference equality use karte hain",
      "True — default struct Equals() reflection-based field-by-field comparison karta hai",
      "Compile error, structs Equals() support nahi karte",
      "Undefined behavior",
    ],
    correctIndex: 1,
    explanation:
      "Struct ka default `Equals()` (`System.ValueType` se inherited) reflection use karke field-by-field comparison karta hai. Agar dono instances ke saare fields same hain, result `True` hoga. Ye class ke default Equals (reference equality) se fundamentally different hai. Options A aur C dono galat hain.",
    difficulty: "hard",
  },
  {
    id: "system-object-3",
    question: "Do `class` instances (dono same field values ke saath, koi Equals override nahi) ko default `Equals()` se compare karne par kya milega?",
    options: [
      "True, kyunki content same hai",
      "False — default class Equals() reference equality karta hai, alag heap objects hain",
      "Compile error",
      "Depends on GC state",
    ],
    correctIndex: 1,
    explanation:
      "Class (reference type) ka default `Equals()` sirf reference equality karta hai — same memory location point kar rahe hain ya nahi. Do alag `new` calls do alag heap objects banate hain, isliye content identical hone ke bawajood `Equals()` False dega jab tak explicitly override na kiya jaaye.",
    difficulty: "medium",
  },
  {
    id: "system-object-4",
    question: "`object obj = new Person(); Console.WriteLine(obj.GetType().Name);` kya print karega?",
    options: [
      "\"object\" — declared type",
      "\"Person\" — actual runtime type",
      "Compile error, GetType() object type pe kaam nahi karta",
      "null",
    ],
    correctIndex: 1,
    explanation:
      "`GetType()` hamesha actual runtime type return karta hai, declared/static type nahi. Chahe `obj` ka compile-time type `object` ho, actual instance ek `Person` hai, isliye `GetType().Name` \"Person\" dega. Ye exactly wo behavior hai jo `GetType()` ko sealed/non-virtual rakhne se guarantee hota hai.",
    difficulty: "easy",
  },
];

export default quiz;
