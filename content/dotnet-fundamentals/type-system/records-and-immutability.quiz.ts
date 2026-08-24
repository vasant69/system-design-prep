import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "records-immut-1",
    question: "`record Person(string Name); var p1 = new Person(\"Asha\"); var p2 = new Person(\"Asha\"); Console.WriteLine(p1 == p2);` kya print karega?",
    options: [
      "False — reference equality, class ki tarah",
      "True — records structural (value-based) equality use karte hain by default",
      "Compile error",
      "Depends on GC state",
    ],
    correctIndex: 1,
    explanation:
      "Record types compiler-generated structural equality use karte hain — do alag instances agar same property values rakhte hain, `==` aur `Equals()` dono `True` denge, chahe wo alag heap objects hon. Ye class ke default (reference equality) se fundamentally different hai.",
    difficulty: "medium",
  },
  {
    id: "records-immut-2",
    question: "`var updated = p1 with { Age = 29 };` execute hone ke baad, `p1` ka kya hoga?",
    options: [
      "p1.Age bhi 29 ho jaayega",
      "p1 completely unchanged rahega — with ek naya independent instance banata hai",
      "p1 null ho jaayega",
      "Compile error, records mutable nahi ho sakte",
    ],
    correctIndex: 1,
    explanation:
      "`with`-expression non-destructive mutation deta hai — ye ek naya record instance banata hai jisme specified properties change hoti hain, baaki original se copy hoti hain. Original `p1` bilkul untouched rehta hai. Ye exactly wo property hai jo records ko immutable-by-default aur aliasing-bug-safe banati hai.",
    difficulty: "easy",
  },
  {
    id: "records-immut-3",
    question: "C# ke type system me `record` konsa role play karta hai class aur struct ke comparison me?",
    options: [
      "record sirf struct ka alag naam hai",
      "record ek teesra category hai — reference type by default lekin struct jaisi structural equality",
      "record class aur struct dono ko replace karta hai",
      "record sirf interfaces ke liye use hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`record` C# 9 me ek naya, teesra type-category introduce karta hai — by default reference type hai (heap-allocated, class jaisa), lekin equality behavior structurally value-based hai (struct jaisa), compiler dwara automatically generate. Ye class aur struct dono ko replace nahi karta, ek naya alternative deta hai jab dono ke kuch aspects chahiye ho.",
    difficulty: "medium",
  },
  {
    id: "records-immut-4",
    question: "Immutability thread-safety kaise deti hai bina explicit locks ke?",
    options: [
      "Immutable objects automatically thread-pool pe run hote hain",
      "Agar object ke fields kabhi change hi nahi hote, multiple threads simultaneously safely read kar sakte hain — koi race condition possible nahi",
      "Immutability ka thread-safety se koi lena dena nahi",
      ".NET runtime automatically locks add karta hai immutable types ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Race conditions tab hoti hain jab multiple threads shared mutable state ko simultaneously modify karte hain. Agar object ke fields object-creation ke baad kabhi badalte hi nahi (immutable), to concurrent reads se koi conflict possible hi nahi hai — koi thread kisi state ko modify nahi kar raha, isliye lock ki zaroorat hi nahi. Ye ek structural guarantee hai, runtime feature nahi.",
    difficulty: "hard",
  },
];

export default quiz;
