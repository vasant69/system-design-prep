import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "fluent-annot-tr-1",
    question: "Data Annotations aur Fluent API me kya fark hai, aur kya ye dono functionally equivalent hain?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer: "Nahi, equivalent nahi hain — Fluent API strictly superset hai. Data Annotations attributes hain class pe, Fluent API OnModelCreating me centralized configuration hai.",
    detailedAnswer:
      "Data Annotations (`[Required]`, `[MaxLength]`, `[Key]`) directly entity class pe attributes ki tarah lagti hain — chhote, simple configurations ke liye convenient. Fluent API `DbContext.OnModelCreating` me chainable method calls ke through configuration deta hai — ye zyada powerful hai kyunki kuch configurations (composite primary keys, global query filters, table splitting, owned entity types) ka koi Data Annotation equivalent hi nahi hai. Isliye Fluent API strictly superset hai, functionally equivalent nahi.",
    followUp: "Ek concrete example do jahan sirf Fluent API kaam karega, Data Annotation nahi.",
  },
  {
    id: "fluent-annot-tr-2",
    question: "Composite primary key configure karna hai (`OrderId` + `ProductId` milkar ek key). Kaise karoge?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Fluent API mandatory hai — `modelBuilder.Entity<OrderItem>().HasKey(oi => new { oi.OrderId, oi.ProductId });`",
    detailedAnswer:
      "Composite keys ke liye Data Annotations me koi support nahi hai — `[Key]` attribute ek single property pe lagega, do properties pe lagane se composite key nahi banti. Sirf Fluent API se, `HasKey()` method ko ek anonymous type dekar (jisme dono properties shaamil hon), composite key configure hoti hai: `modelBuilder.Entity<OrderItem>().HasKey(oi => new { oi.OrderId, oi.ProductId });`",
  },
  {
    id: "fluent-annot-tr-3",
    question: "Ek property pe `[MaxLength(50)]` Data Annotation bhi hai, aur `OnModelCreating` me Fluent API se `.HasMaxLength(100)` bhi set hai. Actual applied max length kya hogi?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "100 — Fluent API configuration Data Annotation ko override kar deta hai conflict hone par.",
    detailedAnswer:
      "EF Core me, agar same property ke liye Data Annotation aur Fluent API dono conflicting configuration dete hain, Fluent API jeetta hai kyunki ye zyada explicit/specific mechanism maana jaata hai. Isliye is case me actual database column `NVARCHAR(100)` banega, `[MaxLength(50)]` ignore ho jaayega. Ye ek subtle interview trap hai — candidates aksar sochte hain 'jo pehle define hua wo apply hoga' ya 'attribute jeetega kyunki wo entity pe hai', dono galat hain.",
    redFlag: "Candidate ko conflict resolution rule pata na hona, ya galat direction bataana.",
  },
  {
    id: "fluent-annot-tr-4",
    question: "Ek multi-tenant SaaS application me, tumhe chahiye ki har `DbSet<T>` query automatically sirf current tenant ka data return kare, bina har query me manually `Where(e => e.TenantId == currentTenant)` likhe. Ye kaise implement karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "HasQueryFilter() — ek Fluent API-only global query filter jo OnModelCreating me ek baar configure hota hai.",
    detailedAnswer:
      "`modelBuilder.Entity<Order>().HasQueryFilter(o => o.TenantId == _currentTenantId);` — ye filter automatically har LINQ query pe apply hota hai us entity ke liye, bina developer ko manually har jagah `Where` likhne ki zaroorat. Ye feature sirf Fluent API me available hai — Data Annotations me iska koi equivalent nahi hai, kyunki ye ek dynamic, runtime-context-dependent (`_currentTenantId` ek field/service se aata hai) configuration hai jo attribute-based static declaration se express nahi ho sakti.",
    followUp: "Agar kisi specific query me is filter ko bypass karna ho (jaise admin panel ke liye), kaise karoge?",
  },
  {
    id: "fluent-annot-tr-5",
    question: "Kya Data Annotations use karna 'galat' hai aur hamesha Fluent API use karna chahiye?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — chhote, simple configurations ke liye Data Annotations convenient aur readable hain; Fluent API tab mandatory hai jab annotation equivalent exist hi nahi karta.",
    detailedAnswer:
      "Ye ek false binary hai. Data Annotations simple cases (required, max length, basic key) ke liye genuinely convenient hain — configuration entity ke saath co-located rehti hai, extra file dhoondhna nahi padta. Fluent API tab mandatory ban jaata hai jab feature ka koi annotation equivalent hi nahi hai (composite keys, query filters, table splitting). Bade production codebases me common practical approach Fluent API ko primary bana dena hai consistency ke liye (`IEntityTypeConfiguration<T>` pattern), lekin ye 'Data Annotations galat hain' isliye nahi, balki organization/consistency ke liye hota hai.",
    redFlag: "'Data Annotations kabhi use nahi karni chahiye' jaisa absolute statement — nuanced trade-off thinking ki kami dikhata hai.",
  },
  {
    id: "fluent-annot-tr-6",
    question: "`IEntityTypeConfiguration<T>` pattern kya hai, aur ye bade EF Core models me kya problem solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Har entity ki Fluent API configuration ko apni khud ki class me organize karta hai, ek giant OnModelCreating method banne se bachata hai.",
    detailedAnswer:
      "`IEntityTypeConfiguration<T>` ek interface hai jise implement karke, ek specific entity ki saari Fluent API configuration ek dedicated class me likh sakte ho (`ProductConfiguration : IEntityTypeConfiguration<Product>`). `modelBuilder.ApplyConfigurationsFromAssembly(assembly)` call karke, EF Core automatically saari aisi configuration classes discover aur apply kar deta hai. Ye bade models (50+ entities) me ek single, unmanageable `OnModelCreating` method banne se bachata hai — har entity ki config apni file me, easily locatable aur testable.",
  },
  {
    id: "fluent-annot-tr-7",
    question: "Kya Data Annotations entity classes ko 'persistence-aware' bana deti hain, aur ye kyun kuch teams ke liye concern hota hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Haan — attributes EF Core-specific namespaces reference karte hain entity class me, jo DDD-style 'persistence-ignorant domain model' principle ko violate karta hai.",
    detailedAnswer:
      "Data Annotations use karne se, entity class ko `System.ComponentModel.DataAnnotations`/`System.ComponentModel.DataAnnotations.Schema` namespaces import karne padte hain, jo entity ko EF Core ki specific ki taraf couple karta hai. Domain-Driven Design (DDD) jaisi architectures me, ek principle hota hai ki domain entities 'persistence-ignorant' rahein — unhe pata na ho ki wo EF Core, ya kisi bhi specific ORM se persist ho rahe hain. Fluent API is separation ko maintain karta hai kyunki saari EF Core-specific configuration `DbContext`/configuration classes me rehti hai, entity class clean POCO rehta hai.",
    followUp: "Kya ye separation har project me zaroori hai, ya sirf kuch specific architectural styles me matter karta hai?",
  },
];

export default questions;
