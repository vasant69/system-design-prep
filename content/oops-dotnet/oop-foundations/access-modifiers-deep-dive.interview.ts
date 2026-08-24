import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "access-modifiers-tr-1",
    question: "C# me kitne access modifiers hain, aur unke naam kya hain?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer: "Chhe hain: public, private, protected, internal, protected internal, aur private protected.",
    detailedAnswer:
      "public (kahin se bhi accessible), private (sirf declaring class ke andar), protected (declaring class + derived classes), internal (sirf same assembly), protected internal (union — protected OR internal), aur private protected (intersection — protected AND internal). In sabme sabse zyada interview me focus 'protected internal' vs 'private protected' pe hota hai kyunki ye do confusing hain.",
    followUp: "protected internal aur private protected me exact difference kya hai?",
  },
  {
    id: "access-modifiers-tr-2",
    question: "`protected internal` aur `private protected` me exact difference kya hai? Ek concrete example do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "protected internal ek UNION hai (protected OR internal); private protected ek INTERSECTION hai (protected AND internal).",
    detailedAnswer:
      "`protected internal` member ko access karne ke liye caller ko EK condition satisfy karni hoti hai: ya to wo derived class ho (kisi bhi assembly me), ya same assembly me ho (derived na bhi ho to chalega). `private protected` me caller ko DONO conditions ek saath satisfy karni hoti hain: derived class BHI ho AUR same assembly me BHI ho. Isliye ek doosri assembly ki derived class `protected internal` member access kar sakti hai, lekin `private protected` member access nahi kar sakti.",
    followUp: "Ye do assemblies ka scenario code me dikhao jahan same member ka behavior alag ho in dono modifiers ke saath.",
  },
  {
    id: "access-modifiers-tr-3",
    question: "Ye code, assuming `Base` aur `Derived` DO ALAG assemblies me hain, compile hoga ya error dega?\n```csharp\n// Assembly 1\npublic class Base\n{\n    protected internal void Method() { }\n}\n\n// Assembly 2 (references Assembly 1)\npublic class Derived : Base\n{\n    void Test() { Method(); }\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile ho jayega — Derived ek derived class hai, aur protected internal ke union rule me 'derived class' condition kaafi hai, assembly match zaroori nahi.",
    detailedAnswer:
      "`protected internal` union hai — access ke liye 'derived class HONA' YA 'same assembly me hona' me se koi ek kaafi hai. `Derived` class `Base` se derive karti hai (chahe alag assembly me ho), isliye protected condition satisfy hoti hai, aur access mil jaata hai. Ye compile ho jaayega.",
  },
  {
    id: "access-modifiers-tr-4",
    question: "Pichhle exact same code me agar `protected internal` ko `private protected` se replace kar diya jaaye (Base aur Derived abhi bhi alag assemblies me hain), kya hoga?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — private protected intersection hai, aur alag assembly hone ki wajah se 'same assembly' condition fail ho jaati hai, chahe Derived derived class hi kyun na ho.",
    detailedAnswer:
      "`private protected` intersection hai — dono conditions (derived class HONA AUR same assembly me hona) ek saath chahiye. Yahan `Derived` derived class hai (ek condition satisfy), lekin ALAG assembly me hai (doosri condition fail) — intersection satisfy nahi hoti. Compiler ye error dega ki `Method()` inaccessible hai due to its protection level. Ye exactly wahi trap hai jo interviewers ye pair test karne ke liye poochte hain.",
    followUp: "Agar dono classes SAME assembly me hote, to private protected ka result kya hota?",
  },
  {
    id: "access-modifiers-tr-5",
    question: "`internal` ka matlab 'same namespace' hota hai ya 'same assembly'? Ye do confuse kyun hote hain?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Same assembly — namespace se koi lena dena nahi. Ye confusion isliye hota hai kyunki namespace bhi ek 'organizational boundary' lagta hai, lekin C# me ye compile-unit (assembly) based hai.",
    detailedAnswer:
      "`internal` access sirf assembly boundary (ek compiled DLL/EXE unit) pe based hai — namespace ka koi role nahi hai. Do classes same namespace me ho sakti hain lekin alag assemblies me (jaise dono projects `MyCompany.Utils` namespace use karein) — tab bhi `internal` access nahi milega ek se doosre me. Ulta, ek assembly ke andar alag-alag namespaces ke beech `internal` access bilkul milta hai. Ye ek genuinely common misconception hai jo namespace aur assembly ko conflate karti hai.",
    redFlag: "'internal ka matlab same namespace hai' bolna — ye ek factually galat, bahut common misconception hai.",
  },
  {
    id: "access-modifiers-tr-6",
    question: "Ek badi codebase me `Core` assembly aur `Api` assembly hai (Api, Core ko reference karta hai). Core ke andar ek `ValidationHelper` class hai jo sirf Core ke apne domain logic ke liye internal helper hai, kabhi Api se directly use nahi honi chahiye. Isko kaise design karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`ValidationHelper` class (ya uske members) ko `internal` mark karo — isse Core assembly ke andar hi accessible rahega, Api assembly se bilkul access nahi hoga, compile time pe hi enforce hoga.",
    detailedAnswer:
      "`internal` access modifier exactly is scenario ke liye designed hai — implementation details ko apni assembly ke andar restrict karna, bina unhe fully `private` banaye (jo Core assembly ke andar bhi dusri classes ko use karne se rok deta). `internal class ValidationHelper` ya `internal` members us class ke andar, Core assembly ke andar sab jagah use ho sakte hain, lekin Api assembly compile hi nahi karega agar wo isko directly reference karne ki koshish kare — ye accidental cross-assembly coupling ko compile-time pe hi catch karta hai, code review pe depend nahi karna padta.",
  },
  {
    id: "access-modifiers-tr-7",
    question: "Kya ye statement sahi hai: 'protected internal aur private protected dono ka matlab practically same hai, bas naam alag hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Bilkul galat — dono opposite logic (union vs intersection) use karte hain, behavior fundamentally different hai jaise doosri assembly ki derived class ke liye dikha.",
    detailedAnswer:
      "Ye ek dangerous misconception hai jo naam ki similarity se aati hai. `protected internal` union hai (kam restrictive — do conditions me se ek kaafi), `private protected` intersection hai (zyada restrictive — dono conditions ek saath chahiye). Ek doosri-assembly ki derived class `protected internal` member access kar sakti hai lekin `private protected` member nahi — ye ek concrete, testable difference hai jo interview me code ke through demonstrate karni chahiye, sirf 'same lagte hain' bol dena galat aur red-flag-worthy hai.",
    redFlag: "In dono ko interchangeable ya 'roughly same' bolna — interviewer ke liye ye clear signal hai ki candidate ne exact semantics nahi samjhi.",
  },
  {
    id: "access-modifiers-tr-8",
    question: "Top-level class (namespace ke seedhe andar declared, kisi doosri class ke andar nested nahi) ka default access modifier kya hai agar kuch likha na jaaye?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "internal — class members ka default (private) se ye alag hai.",
    detailedAnswer:
      "Ye ek subtle lekin real distinction hai: class ke ANDAR ke members (fields, methods) ka default access `private` hota hai agar kuch na likho. Lekin ek top-level class declaration khud (`class Foo { }`, bina `public`/`internal` likhe) default `internal` hoti hai — matlab wo sirf usi assembly ke andar accessible hai, bahar se nahi, jab tak explicitly `public` na kiya jaaye. In dono defaults (member-level vs type-level) ko confuse karna common hai.",
  },
];

export default questions;
