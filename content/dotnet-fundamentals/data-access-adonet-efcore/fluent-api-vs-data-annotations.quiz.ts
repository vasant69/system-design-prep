import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "fluent-annot-1",
    question: "Ek composite primary key (do properties milkar ek key) configure karne ke liye kya use kar sakte ho?",
    options: [
      "Data Annotations — [Key] attribute dono properties pe laga do",
      "Sirf Fluent API — koi Data Annotation equivalent exist nahi karta composite keys ke liye",
      "Koi bhi, dono equally support karte hain",
      "Ye EF Core me possible hi nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Composite primary keys sirf Fluent API se configure ho sakti hain (`modelBuilder.Entity<T>().HasKey(e => new { e.PropA, e.PropB })`) — Data Annotations me is functionality ka koi equivalent nahi hai, chahe tum `[Key]` dono properties pe laga do. Ye ek concrete example hai jahan Fluent API strictly zyada powerful hai.",
    difficulty: "medium",
  },
  {
    id: "fluent-annot-2",
    question: "Agar ek property pe Data Annotation aur Fluent API dono conflicting configuration dete hain, kaun jeetega?",
    options: ["Data Annotation hamesha jeetega", "Fluent API jeetega", "EF Core exception throw karega startup pe", "Dono ignore ho jaayenge"],
    correctIndex: 1,
    explanation:
      "Fluent API zyada specific/explicit configuration maana jaata hai, isliye conflict hone par ye Data Annotation ko override kar deta hai. Ye ek common interview 'gotcha' question hai jo dikhata hai ki candidate ne dono mechanisms ke interaction ko samjha hai, sirf unhe alag-alag options ki tarah nahi jaana.",
    difficulty: "medium",
  },
  {
    id: "fluent-annot-3",
    question: "Multi-tenant application me har query automatically current tenant tak restrict karni hai bina har query me manually filter likhe. Kaunsa feature use karoge?",
    options: [
      "[Required] attribute",
      "HasQueryFilter() — Fluent API-only global query filter",
      "[ForeignKey] attribute",
      "DbSet<T>.Where() har jagah manually likhna",
    ],
    correctIndex: 1,
    explanation:
      "`HasQueryFilter()` ek Fluent API-only feature hai jo `OnModelCreating` me ek baar configure hone ke baad, automatically har query pe apply hota hai bina developer ko manually har jagah filter likhna pade — ye exactly multi-tenant soft-filtering ka classic use case hai. Data Annotations me is feature ka koi equivalent nahi hai.",
    difficulty: "hard",
  },
  {
    id: "fluent-annot-4",
    question: "Ek badi EF Core model me saari configuration ek hi giant `OnModelCreating` method me likhi hui hai, jo maintain karna mushkil ho gaya hai. Better organization ke liye kya recommended pattern hai?",
    options: [
      "Sab kuch Data Annotations me convert kar do",
      "IEntityTypeConfiguration<T> classes banao (ek per entity) aur ApplyConfigurationsFromAssembly() use karo",
      "OnModelCreating ko multiple DbContext classes me split kar do",
      "Configuration ko XML file me move kar do",
    ],
    correctIndex: 1,
    explanation:
      "`IEntityTypeConfiguration<T>` pattern har entity ki Fluent API configuration ko apni khud ki class me organize karta hai, aur `modelBuilder.ApplyConfigurationsFromAssembly(...)` sabko automatically discover + apply karta hai `OnModelCreating` me. Ye Microsoft ka officially-recommended pattern hai bade models ke liye. Option A composite keys/query filters jaisi cheezon ke liye kaam nahi karega (Data Annotations equivalent nahi rakhta), aur options C, D standard EF Core patterns nahi hain.",
    difficulty: "medium",
  },
];

export default quiz;
