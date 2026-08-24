import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "abstract-vs-interface-tr-1",
    question: "Abstract class aur interface me choose kaise karte ho? Kya rule of thumb follow karte ho?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Sabse pehle poochta hoon: shared instance state chahiye? Haan to abstract class, nahi to default interface.",
    detailedAnswer:
      "Main 'it depends' nahi bolta — main ek concrete question se shuru karta hoon: kya implementers ke beech genuinely shared instance state (fields) ya constructor logic chahiye? Agar haan, abstract class hi option hai kyunki interface (default interface methods hone ke baad bhi) instance fields nahi rakh sakta. Agar nahi, main default interface choose karta hoon — zyada flexible, multiple implementers, aasan testing.",
    followUp: "'Is-a vs can-do' framing ko kyun primary factor nahi maante ho?",
  },
  {
    id: "abstract-vs-interface-tr-2",
    question: "'Is-a vs can-do' rule kaafi nahi hai — kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Kyunki bahut saari valid 'is-a' relationships bina kisi shared state ke bhi perfectly interface se model ho sakti hain.",
    detailedAnswer:
      "'Is-a vs can-do' directionally sahi hai lekin akela sufficient nahi — jaise `Order IS-A Auditable` ek valid is-a relationship lagti hai, lekin agar Auditable ke liye koi shared state nahi chahiye, ek interface (`IAuditable`) perfectly kaam karega, koi zaroorat nahi ki abstract class banayi jaaye. Isliye main shared-state question ko primary rakhta hoon, 'is-a vs can-do' ko sirf ek confirming, secondary signal.",
  },
  {
    id: "abstract-vs-interface-tr-3",
    question: "Default interface methods (DIM) ne is decision ko kaise affect kiya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Shared BEHAVIOR ka gap narrow kiya, lekin shared STATE ka gap wahi ka wahi raha — isliye rule mostly same reh gaya, sirf thoda evolve hua.",
    detailedAnswer:
      "C# 8 se pehle, 'shared concrete implementation' sirf abstract class de sakti thi. DIM ke baad, interface bhi ek default method BODY de sakta hai, jab tak usme koi field access na ho. Lekin fields (state) abhi bhi interfaces me nahi ja sakte. Isliye updated rule: agar chahiye sirf shared BEHAVIOR (no field access) — DIM se interface bhi kaam kar sakta hai. Agar chahiye shared STATE — abstract class hi ek option hai.",
    followUp: "Ek concrete example do jahan DIM se ek interface ka default method genuinely useful ho, bina kisi field access ke.",
  },
  {
    id: "abstract-vs-interface-tr-4",
    question: "Ye code compile hoga?\n```csharp\npublic abstract class BaseEntity\n{\n    public Guid Id { get; } = Guid.NewGuid();\n}\n\npublic interface ISoftDeletable\n{\n    bool IsDeleted { get; }\n}\n\npublic class Order : BaseEntity, ISoftDeletable\n{\n    public bool IsDeleted { get; private set; }\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Haan, compile hoga — ek class ek abstract class extend AND ek ya zyada interfaces implement dono simultaneously kar sakti hai.",
    detailedAnswer:
      "C# me ye bilkul valid pattern hai — single-class-inheritance limit sirf classes ke liye hai, interfaces alag hain aur unlimited count me implement ho sakte hain, ek class ke ek base class extend karne ke saath saath. `Order` ko `BaseEntity` se `Id` state milta hai, aur `ISoftDeletable` se ek independent capability milti hai — dono ek saath perfectly valid hain.",
  },
  {
    id: "abstract-vs-interface-tr-5",
    question: "Ye compile hoga ya error dega?\n```csharp\npublic abstract class Base1 { }\npublic abstract class Base2 { }\n\npublic class Combined : Base1, Base2 { }\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Compile error — ek class do abstract (ya kisi bhi) classes ko simultaneously extend nahi kar sakti, single inheritance limit lagta hai.",
    detailedAnswer:
      "C# multiple class inheritance allow hi nahi karta, chahe classes abstract hon ya concrete. `class Combined : Base1, Base2` compile error deta hai ('class cannot have multiple base classes'). Ye exactly wo scenario hai jahan agar dono capabilities chahiye, unme se kam se kam ek ko interface hona padega.",
  },
  {
    id: "abstract-vs-interface-tr-6",
    question: "Tum ek naya `AuditableEntity` (shared Id, CreatedAtUtc state) aur `ISoftDeletable` (unrelated capability) design kar rahe ho ek e-commerce codebase ke liye. `Order`, `Product`, aur `Coupon` sab entities hain, lekin sirf `Order` aur `Coupon` ko soft-delete support karna hai. Design kaise banaoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Sab entities AuditableEntity se extend karein (shared state), sirf Order aur Coupon ISoftDeletable bhi implement karein (selective capability).",
    detailedAnswer:
      "AuditableEntity (abstract class) sab entities ke liye common — Id, CreatedAtUtc, ModifiedAtUtc jaisa shared state, saath ek concrete Touch() method. Order, Product, Coupon sab isse extend karte hain. ISoftDeletable ek alag interface hai jo sirf Order aur Coupon implement karte hain — Product ko soft-delete ki zaroorat nahi, isliye wo implement hi nahi karta. Ye exactly demonstrate karta hai ki shared state ek broad base class me jaata hai, aur selective capabilities interfaces me — dono independently combine hote hain jahan zaroorat ho.",
    followUp: "Agar kal Product ko bhi soft-delete chahiye ho jaaye, kitna change karna padega?",
  },
  {
    id: "abstract-vs-interface-tr-7",
    question: "Tumhara senior kehta hai 'humesha interface use karo, abstract classes purani soch hai, sirf composition use karo.' Kya ye sahi advice hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Overgeneralized advice hai — jab genuinely shared state ho, abstract class sahi tool hai; interfaces state ke liye substitute nahi ho sakte.",
    detailedAnswer:
      "Modern .NET composition-first hai, aur zyadatar scenarios me interface hi better choice hoti hai — lekin 'humesha' ek absolute hai jo galat hai. Agar 5 entity types ko same Id/CreatedAtUtc field aur same constructor validation chahiye, ek shared abstract base class ye ek jagah handle karta hai; interface se ye karne ki koshish karoge to har class me duplicate fields aur duplicate constructor logic likhna padega — DRY principle violate hoga. Right tool depends on whether state is shared, not on a blanket rule.",
    redFlag: "'Abstract classes ab use nahi hoti' — ye ek overcorrection hai, real shared-state scenarios me abstract class abhi bhi sahi tool hai.",
  },
  {
    id: "abstract-vs-interface-tr-8",
    question: "Kya ye sahi hai ki 'agar sirf ek hi class implement kar rahi hai kisi contract ko, to interface likhne ka koi fayda nahi hai'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Partially misleading — testability/mockability ke liye interface tab bhi valuable hota hai, chahe production me sirf ek implementation ho.",
    detailedAnswer:
      "Ye ek tempting-lekin-incomplete statement hai. Haan, agar future me genuinely doosri implementation aane ka koi scenario hi nahi hai, ek extra interface unnecessary indirection lag sakta hai. Lekin ek bahut common, legitimate reason interface ka hota hai chahe abhi ek hi implementation ho: **unit testing** — `IOrderService` ko easily Moq se fake kiya jaa sakta hai, jabki concrete `OrderService` class ko mock karna (bina interface ke) mushkil/impossible hota hai agar uske methods virtual na hon. Isliye 'sirf ek implementation hai' akela reason interface hatane ka nahi hai.",
    redFlag: "Blanket statement ki single-implementation interfaces hamesha wasteful hain — testability ka angle miss kar deta hai.",
  },
  {
    id: "abstract-vs-interface-tr-9",
    question: "Ek candidate bolta hai: 'Interview me hamesha bolo abstract class better hai kyunki ye zyada powerful hai — implementation bhi de sakti hai, contract bhi.' Isme kya galat hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "'Zyada powerful' ka matlab 'hamesha better' nahi hota — abstract class ki extra power (state, constructor) ek cost bhi hai: single-inheritance limit consume karti hai aur flexibility kam karti hai.",
    detailedAnswer:
      "Abstract class me zyada capabilities hain (state + implementation + contract) ye sahi hai, lekin har capability ek trade-off ke saath aati hai — ek class sirf ek abstract class extend kar sakti hai, isliye har unnecessary abstract-class use ek future extension option consume kar leta hai. Interface ki 'kam power' actually ek feature hai — unlimited implementers, koi hierarchy lock-in nahi. 'Zyada powerful isliye hamesha better' ek flawed heuristic hai jo real design trade-offs ko ignore karta hai.",
    redFlag: "'Abstract class hamesha better hai kyunki zyada kar sakti hai' — power aur appropriateness alag cheezein hain.",
  },
];

export default questions;
