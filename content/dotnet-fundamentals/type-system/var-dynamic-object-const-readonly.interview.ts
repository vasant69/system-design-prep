import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "var-dynamic-tr-1",
    question: "var, dynamic, aur object me kya fundamental fark hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer: "var = compile-time inference (still static), dynamic = runtime resolution (DLR), object = universal base type jisme explicit cast chahiye.",
    detailedAnswer:
      "`var` sirf compiler ko batata hai 'type initializer expression se infer karo' — ek baar infer hone ke baad variable poori tarah statically typed hai, koi runtime difference nahi explicit type declaration se. `dynamic` genuinely compile-time type-checking skip karta hai, member resolution runtime pe DLR karta hai. `object` universal base type hai — koi bhi value hold kar sakta hai lekin member access ke liye explicit cast zaroori hai.",
    followUp: "dynamic use karne ka koi genuine valid use-case hai?",
  },
  {
    id: "var-dynamic-tr-2",
    question: "dynamic ka koi genuine, valid use-case batao jahan var/object se kaam nahi chalega.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "COM interop, reflection-heavy scenarios, ya truly dynamic data (ExpandoObject, dynamic JSON) jahan member names compile-time pe pata nahi hote.",
    detailedAnswer:
      "`dynamic` tab genuinely zaroori hai jab member names ya structure runtime pe hi pata chalti hai — jaise COM interop (Office automation APIs), ya `ExpandoObject`/dynamic JSON parsing jahan properties runtime data se aati hain. Regular business logic code me `dynamic` avoid karna chahiye kyunki compile-time safety poori tarah kho jaati hai.",
  },
  {
    id: "var-dynamic-tr-3",
    question: "const aur readonly me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "const compile-time constant hai, IL me baked hota hai. readonly runtime-settable-once field hai, constructor tak flexible.",
    detailedAnswer:
      "`const` value compile-time pe hi known honi chahiye, aur compiler isse consuming code ke IL me directly embed kar deta hai — literal substitution. `readonly` field runtime pe (declaration ya constructor me) set hota hai, aur ye actual field access rehta hai, IL me embed nahi hota. Isliye `readonly` cross-assembly recompile gotcha se safe hai, `const` nahi.",
    followUp: "Ye recompile gotcha exactly kaise manifest hota hai?",
  },
  {
    id: "var-dynamic-tr-4",
    question: "Ek shared library ka public const value change kiya gaya lekin consumer assembly recompile nahi ki gayi. Kya problem hoga?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Consumer purani, stale value use karta rahega — kyunki const value uske IL me compile-time pe hi baked ho chuki thi.",
    detailedAnswer:
      "Ye ek classic, real production gotcha hai. `const` value consuming assembly ke build ke time hi literal ke roop me IL me embed ho jaati hai — runtime pe koi lookup nahi hota, koi reference-to-latest-value nahi hota. Agar library update ho jaaye lekin consumer apna khud recompile na kare, wo purani value silently use karta rahega, koi error ya warning ke bina. Isi wajah se cross-assembly public constants ke liye `static readonly` recommend kiya jaata hai.",
    redFlag: "'const aur readonly basically same hain, bas syntax alag hai' bolna — ye gotcha ka pata na hona dikhata hai.",
  },
  {
    id: "var-dynamic-tr-5",
    question: "static readonly kab use karoge jab const bhi ek option ho sakta tha?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Jab value compile-time constant nahi hai (runtime pe compute hoti hai) ya future me change hone ki possibility hai, especially cross-assembly.",
    detailedAnswer:
      "`const` sirf primitive types aur strings ke liye allowed hai, aur value compile-time literal honi chahiye — koi runtime computation (jaise `DateTime.UtcNow`) `const` nahi ho sakta, wahan `static readonly` mandatory hai. Iske alawa, agar value future me change ho sakti hai aur ye public API/shared library ka hissa hai, `static readonly` safer hai kyunki cross-assembly staleness gotcha avoid hoti hai.",
  },
  {
    id: "var-dynamic-tr-6",
    question: "var use karne se koi runtime performance difference aata hai explicit type declaration ke comparison me?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Bilkul nahi — var pure compile-time syntax sugar hai, compiled IL identical hota hai explicit type ke saath.",
    detailedAnswer:
      "`var name = \"Asha\";` aur `string name = \"Asha\";` compile hoke exactly same IL produce karte hain. `var` ka existence sirf compiler ke liye hai — runtime pe iska koi concept hi nahi bachta, variable ka type poori tarah resolve ho chuka hota hai compile-time pe. Isliye 'var slower hai' ek common misconception hai jo galat hai.",
    redFlag: "Ye sochna ki var ek runtime overhead add karta hai — ye batata hai candidate ko var ka mechanism (pure compile-time) samajh nahi aaya.",
  },
  {
    id: "var-dynamic-tr-7",
    question: "Ye code kya karega?\n```csharp\nobject obj = \"hello\";\nConsole.WriteLine(obj.Length);\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Compile error — object type pe Length member exist nahi karta, cast zaroori hai.",
    detailedAnswer:
      "`obj` ka declared/static type `object` hai. Chahe actual runtime instance ek `string` ho, compiler sirf declared type dekh ke decide karta hai kaunse members accessible hain — `object` me `Length` nahi hota, isliye ye compile-time error hai, `dynamic` ki tarah runtime error nahi. Fix: `((string)obj).Length` ya `var`/`string`-typed variable use karo.",
  },
  {
    id: "var-dynamic-tr-8",
    question: "static readonly field ko multiple threads simultaneously read kar rahe hain initialization ke baad — kya ye thread-safe hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Haan — ek baar static constructor/initializer se set ho jaane ke baad, value kabhi change nahi hoti, isliye concurrent reads bina lock ke safe hain.",
    detailedAnswer:
      "`static readonly` field ki value application lifetime me ek baar set hoti hai (static constructor ya field initializer se), aur uske baad kabhi mutate nahi hoti. Immutable state ko multiple threads simultaneously read karna inherently safe hai — koi thread state modify nahi kar raha, isliye race condition ka scope hi nahi hai. Ye exactly wo reason hai jo static readonly ko configuration-jaisi shared values ke liye ek achha choice banata hai.",
  },
];

export default questions;
