import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "overloading-tr-1",
    question: "Method overloading kya hai, aur ise 'compile-time polymorphism' kyun kaha jaata hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Same method name, alag parameter lists — compiler compile time pe hi decide kar leta hai kaunsa version call hoga, argument types dekh kar.",
    detailedAnswer:
      "Overloading me ek hi class me multiple methods same naam ke ho sakte hain, jab tak unka parameter list (count, type, ya order) alag ho. 'Compile-time' isliye kyunki kaunsa exact method call hoga, ye decision program run hone se pehle hi, source code compile hote waqt, ho jaata hai — bilkul static analysis se, koi runtime object inspection nahi hoti.",
    followUp: "Kya sirf return type alag karke bhi overload bana sakte ho?",
  },
  {
    id: "overloading-tr-2",
    question: "Overload resolution algorithm explain karo — compiler kaise decide karta hai kaunsa overload call hoga?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Priority order: pehle exact type match, phir implicit conversion (jaise int se double), phir params array — jo pehla match mile wahi use hota hai.",
    detailedAnswer:
      "Compiler sabse pehle dekhta hai koi overload arguments se exact type match karta hai kya. Agar nahi, to implicit conversions try karta hai — jaise int ko double me widen karna. Agar phir bhi match na mile aur ek params array wala overload ho, wo sabse last resort use hota hai. Agar do overloads equally achhe match hon, compile error aata hai.",
    followUp: "params array overload ki priority sabse last kyun rakhi gayi hai?",
  },
  {
    id: "overloading-tr-3",
    question: "Ye code kya print karega?\n```csharp\nvoid Print(int x) => Console.WriteLine(\"int: \" + x);\nvoid Print(double x) => Console.WriteLine(\"double: \" + x);\n\nPrint(5);\nPrint(5.0);\nPrint(5L);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "\"int: 5\", \"double: 5\", \"double: 5\" — long ka koi exact overload nahi hai, isliye widen hoke double resolve hota hai.",
    detailedAnswer:
      "`Print(5)` — int literal, exact match Print(int). `Print(5.0)` — double literal, exact match Print(double). `Print(5L)` — long literal, koi Print(long) overload nahi hai; compiler implicit widening conversion try karta hai — long se double conversion valid hai, isliye Print(double) resolve hota hai. Ye exact-match-first, phir-implicit-conversion priority dikhata hai.",
  },
  {
    id: "overloading-tr-4",
    question: "Ye compile hoga ya error dega?\n```csharp\npublic void Log(int code, string msg) { }\npublic void Log(string msg, int code) { }\n\nLog(\"error\", 500);\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Compile ho jaayega, aur `Log(string, int)` resolve hoga — parameter ORDER bhi signature ka part hai, isliye ye do valid, distinguishable overloads hain.",
    detailedAnswer:
      "`Log(int, string)` aur `Log(string, int)` alag signatures hain kyunki parameter types ka order alag hai — dono valid overloads hain. Call `Log(\"error\", 500)` me pehla argument string hai, doosra int hai — ye exactly `Log(string, int)` se match karta hai, exact match, ambiguity nahi.",
    followUp: "Agar dono overloads ki jagah `Log(object a, object b)` bhi add kar do, kya `Log(\"error\", 500)` ka resolution badlega?",
  },
  {
    id: "overloading-tr-5",
    question: "Tumhare `OrderRepository` me `FindAsync(int id)` aur `FindAsync(string trackingNumber)` overloads hain. Ek naya requirement aata hai — email se bhi order dhundhna hai. Kaise design karoge, aur kya risk hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ek naya `FindAsync(string email)` overload nahi bana sakte agar already ek `FindAsync(string trackingNumber)` hai — signature clash ho jaayega, dono string parameter lete hain.",
    detailedAnswer:
      "Do overloads sirf tab distinct hote hain jab unka signature (parameter types) alag ho — parameter ka NAAM (trackingNumber vs email) compiler ke liye irrelevant hai, dono `string` hi hain. `FindAsync(string trackingNumber)` aur `FindAsync(string email)` ek saath define karna 'already defines a member with the same parameter types' compile error dega. Fix: ek explicitly named method banao jaise `FindByEmailAsync(string email)`, ya ek strongly-typed wrapper (jaise `record Email(string Value)`) use karo jisse signature genuinely distinct ho.",
    followUp: "Strongly-typed wrapper approach (jaise Email record) ka koi downside bhi hai kya?",
  },
  {
    id: "overloading-tr-6",
    question: "Ek variable ka compile-time type `object` hai lekin runtime pe usme ek `int` store hai. Ek overloaded method `Print(int)` aur `Print(object)` dono available hain. Kaunsa call hoga?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "`Print(object)` call hoga — overload resolution variable ke COMPILE-TIME (declared) type ko dekhta hai, uski runtime value ko nahi.",
    detailedAnswer:
      "Ye ek classic trap hai jo overloading (compile-time polymorphism) aur virtual dispatch (runtime polymorphism) ke beech confusion se aata hai. Overload resolution runtime pe object ka actual type inspect nahi karta — poora decision compile time pe, sirf static/declared type dekh kar, ho jaata hai. `object obj = 5;` likhne ke baad `obj` ka compile-time type hamesha `object` hi rahega, isliye `Print(obj)` hamesha `Print(object)` resolve karega, chahe runtime me kuch bhi ho.",
    redFlag: "Ye sochna ki overloading bhi 'runtime pe actual type dekh kar' resolve hoti hai jaise virtual methods — ye galat hai, aur overloading vs overriding ke beech sabse common confusion hai.",
  },
  {
    id: "overloading-tr-7",
    question: "Overloading (compile-time polymorphism) aur overriding (runtime polymorphism) me core difference kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Overloading same class me same-name, different-signature methods hai, resolved compile time pe. Overriding base/derived class me same-signature method hai, resolved runtime pe actual object type se.",
    detailedAnswer:
      "Overloading ka decision purely compile-time static analysis se hota hai — argument types dekh kar. Overriding (virtual/override) ka decision runtime pe hota hai — actual object ka runtime type dekh kar, chahe reference variable ka declared type kuch bhi ho. Isiliye overloading ko 'early/static binding' aur overriding ko 'late/dynamic binding' kehte hain.",
    followUp: "Kya ek method overloaded AND overridden dono ho sakta hai ek hi samay pe?",
  },
  {
    id: "overloading-tr-8",
    question: "Agar tum `params int[] numbers` waala ek overload aur `int a, int b` waala ek fixed-parameter overload dono define karo, `Sum(1, 2)` kaunsa call karega?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Fixed-parameter overload (`Sum(int, int)`) call hoga — params array hamesha sabse last priority pe try hota hai.",
    detailedAnswer:
      "Agar ek exact-match ya implicit-conversion-match fixed-parameter overload available hai, compiler use hi choose karega — params array wala overload sirf tab use hota hai jab koi fixed overload match hi na kare (jaise `Sum(1, 2, 3, 4)` agar sirf 2-parameter fixed overload ho). Ye design isliye hai taaki common, simple calls ke liye array allocation ka overhead avoid ho.",
  },
];

export default questions;
