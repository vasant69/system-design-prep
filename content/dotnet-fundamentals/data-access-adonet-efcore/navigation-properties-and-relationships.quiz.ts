import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "nav-props-1",
    question: "One-to-One relationship configure karte waqt Fluent API me kaunsa method call zaroori hai kaunsi entity 'dependent' hai (FK holds) ye disambiguate karne ke liye?",
    options: ["WithOne() akela", "HasForeignKey<TDependent>()", "HasMany()", "IsRequired()"],
    correctIndex: 1,
    explanation:
      "One-to-one relationships me, `HasForeignKey<TDependent>()` explicitly batata hai kaunsi entity foreign key hold karti hai (dependent side) — bina iske, EF Core ambiguous ho sakta hai konsi taraf FK honi chahiye, kyunki dono entities symmetric lag sakti hain relationship declaration me.",
    difficulty: "medium",
  },
  {
    id: "nav-props-2",
    question: "EF Core 5.0 se pehle, many-to-many relationships kaise configure karni padti thi?",
    options: [
      "Automatically, koi extra configuration nahi chahiye thi kabhi",
      "Hamesha ek explicit join entity ke through — implicit many-to-many support nahi tha",
      "Sirf raw SQL se, EF Core many-to-many support hi nahi karta tha",
      "Sirf Database-First approach se possible tha",
    ],
    correctIndex: 1,
    explanation:
      "EF Core 5.0 (2020) se pehle, many-to-many relationships hamesha ek explicit join entity (jaise `OrderItem` apne khud ke primary key/properties ke saath) maangte the — implicit join table support EF Core 5.0+ ka naya feature hai. Ye ek genuinely version-specific fact hai jo interview me poocha jaata hai.",
    difficulty: "hard",
  },
  {
    id: "nav-props-3",
    question: "Ek `Order`-`Product` many-to-many relationship me, join table me `Quantity` aur `UnitPrice` bhi store karni hai. Kaunsa approach sahi hai?",
    options: [
      "Implicit many-to-many use karo — EF Core khud handle kar lega",
      "Explicit join entity (jaise OrderItem) banao jisme Quantity aur UnitPrice properties ho",
      "Quantity ko Order entity me hi ek property bana do",
      "Ye possible nahi hai EF Core me",
    ],
    correctIndex: 1,
    explanation:
      "Jab join relationship ko extra data carry karni hai (quantity, price, timestamp, etc.), ek explicit join entity mandatory hai — implicit many-to-many (EF Core 5+) sirf simple, data-less associations ke liye hai. `OrderItem` jaisi entity, apne khud ke properties ke saath, exactly is scenario ka standard solution hai.",
    difficulty: "medium",
  },
  {
    id: "nav-props-4",
    question: "Ek `OrderItem` class me property naam `SupplierRef` hai jo `Supplier` entity ko point karti hai (instead of standard `SupplierId`). Kya EF Core ise automatically foreign key ki tarah recognize karega?",
    options: [
      "Haan, EF Core kisi bhi naam se FK detect kar leta hai",
      "Nahi — naming convention (`<Entity>Id`) match nahi karti, explicit [ForeignKey] ya Fluent API configuration chahiye hogi",
      "Haan, lekin sirf agar property int type ki ho",
      "Nahi, EF Core aisi relationships support hi nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "EF Core convention-based foreign key detection standard naming patterns (`<PrincipalEntity>Id` ya `<NavigationProperty>Id`) pe depend karta hai. `SupplierRef` is convention ko match nahi karta, isliye EF Core ise automatically FK ki tarah recognize nahi karega — developer ko explicitly `[ForeignKey(\"SupplierRef\")]` attribute ya Fluent API se relationship configure karna padega.",
    difficulty: "medium",
  },
];

export default quiz;
