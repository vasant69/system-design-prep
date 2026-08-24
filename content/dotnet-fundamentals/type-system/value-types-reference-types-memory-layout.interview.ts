import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "value-ref-memory-tr-1",
    question: "Value type aur reference type me fundamental difference kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer:
      "Value type variable directly apni data hold karta hai; reference type variable ek address hold karta hai jo heap pe allocated actual object ko point karta hai.",
    detailedAnswer:
      "Value type (int, struct, bool, enum) ka variable khud data hai — copy karne par independent duplicate banta hai. Reference type (class, string, array) ka variable sirf ek pointer/address hai — actual object heap pe alag se exist karta hai, aur copy karne par sirf address copy hota hai, dono variables same object share karte hain.",
    followUp: "Agar reference type ko method me pass karke uska field modify karoon, caller ko dikhega ya nahi?",
  },
  {
    id: "value-ref-memory-tr-2",
    question: "Kya ye sahi hai ki 'value types hamesha stack pe store hote hain'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi, incomplete statement hai — value type wahin store hota hai jahan uska container hota hai. Local variable ho to stack, kisi heap object ka field ho to us object ke andar heap pe hi.",
    detailedAnswer:
      "Ye ek common oversimplification hai jo interview me specifically test hoti hai. Agar ek struct field kisi class (reference type) ke andar declared hai, wo struct us class instance ke saath hi heap pe allocate hota hai, inline — apni separate stack memory nahi milti. Sirf standalone local value-type variables (method scope ke andar) genuinely stack pe hote hain.",
    redFlag: "Bina qualify kiye 'value types stack pe, reference types heap pe' bol dena, jaise ye ek unconditional rule ho — ye batata hai candidate ne concept ko surface-level hi samjha hai.",
  },
  {
    id: "value-ref-memory-tr-3",
    question: "Ye code kya print karega?\n```csharp\nvoid Modify(Person p) { p.Name = \"Changed\"; }\nvoid Reassign(Person p) { p = new Person { Name = \"New\" }; }\n\nvar person = new Person { Name = \"Original\" };\nModify(person);\nConsole.WriteLine(person.Name);\nReassign(person);\nConsole.WriteLine(person.Name);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"Changed\" phir \"Changed\" (Reassign ka effect caller ko nahi dikhega).",
    detailedAnswer:
      "`Modify` method same object ke field ko mutate karta hai — chunki address ka copy same object ko point karta hai, ye change caller ko dikhta hai, isliye pehla print 'Changed'. `Reassign` method apne local parameter `p` ko naye object se reassign karta hai — ye sirf local copy of the address ko badalta hai, caller ka `person` variable original ('Changed' wala) object hi point karta rehta hai. Isliye doosra print bhi 'Changed' hi hoga, 'New' nahi.",
  },
  {
    id: "value-ref-memory-tr-4",
    question: "`List<T>` ek reference type hai. Agar main `var copy = originalList;` karoon aur `copy` me items add karoon, kya `originalList` bhi change hoga?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer: "Haan — dono variables same underlying List object ko point karte hain, isliye ek se kiya gaya change dusre se bhi dikhega.",
    detailedAnswer:
      "`List<T>` khud ek class (reference type) hai. `copy = originalList` sirf address copy karta hai — koi naya List object nahi banta. Agar independent copy chahiye, explicitly `new List<T>(originalList)` ya `.ToList()` use karna padega, jo genuinely ek naya List object banata hai (jiske andar ke elements, agar wo reference types hain, tab bhi shared rahenge — sirf shallow copy).",
  },
  {
    id: "value-ref-memory-tr-5",
    question: "Method parameters by default value se pass hote hain ya reference se, dono value aur reference types ke liye?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Dono default me by value pass hote hain — reference type ke case me, 'value' jo pass hoti hai wo address hai, object khud nahi.",
    detailedAnswer:
      "C# me by default HAR parameter by value pass hota hai. Value type ke liye ye actual data ka copy hai. Reference type ke liye ye address (pointer) ka copy hai — isliye field mutations visible hote hain (same object), lekin reassignment nahi hoti (local copy of address badalta hai). Genuine 'by reference' passing ke liye explicitly `ref`/`out`/`in` keywords chahiye, jo alag topic hai.",
    followUp: "ref keyword use karne se ye behavior kaise badal jaata hai?",
  },
  {
    id: "value-ref-memory-tr-6",
    question: "Ek `int[]` array reference type hai ya value type, aur kyun?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Array khud ek reference type hai (chahe uske elements value type hon) — array variable heap-allocated array object ka address hold karta hai.",
    detailedAnswer:
      "Arrays hamesha reference types hain in C#, chahe element type (`int`) value type ho. `int[] arr = new int[5];` — `arr` variable ek address hold karta hai jo heap pe allocated, 5 `int`s ke liye contiguous space wale array object ko point karta hai. Do array variables assign karne se (`arr2 = arr`) address copy hota hai, elements ka copy nahi — dono same array share karte hain.",
  },
  {
    id: "value-ref-memory-tr-7",
    question: "Stack aur heap ke deallocation mechanism me kya fundamental difference hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Stack deallocation automatic aur instant hai (method return pe frame pop), heap deallocation Garbage Collector karta hai, jab object unreachable ho jaaye.",
    detailedAnswer:
      "Stack ek simple LIFO structure hai — method call pe frame push hota hai, return pe pop, deterministic aur cost-free. Heap objects ka lifetime unpredictable hai — jab tak koi bhi reference us object ko point kar raha ho, GC usko collect nahi karega. Ye exactly wo mechanism hai jiski wajah se stack allocation heap allocation se cheaper aur predictable hai — koi GC involvement nahi.",
  },
  {
    id: "value-ref-memory-tr-8",
    question: "Do `Person` objects (dono ki Name property 'Asha' hai) ko `==` se compare karne par kya result milega, agar `Person` ek plain class hai bina override kiye Equals/`==`?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "`false` — default `==` reference equality karta hai (same object hai ya nahi), content compare nahi karta.",
    detailedAnswer:
      "Jab tak `Person` class explicitly `Equals()` ya `==` operator overload na kare, default behavior reference equality hai — dono variables ko same memory address point karna chahiye tabhi `true` milega. Do alag `new Person { Name = \"Asha\" }` calls do alag heap objects banate hain, content same hone ke bawajood — isliye `==` yahan `false` return karega. Ye value-vs-reference memory model ka direct consequence hai.",
    redFlag: "Ye maan lena ki `==` classes ke liye bhi content compare karega jaise value types ke liye karta hai — ye galat assumption hai jo memory model ki galat samajh dikhata hai.",
  },
];

export default questions;
