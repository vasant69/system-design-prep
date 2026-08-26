import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "nav-props-tr-1",
    question: "Navigation properties kya hain, aur ye raw foreign key values se kaise alag hain?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "Navigation properties relationship ko object reference ki tarah traverse karne dete hain (order.Customer.Name), na ki sirf raw FK value (order.CustomerId) manually query karke.",
    detailedAnswer:
      "Ek raw foreign key value (`CustomerId`) sirf ek integer hai — related data access karne ke liye manually ek dusri query likhni padti. Navigation property (`Order.Customer`) EF Core ko us relationship ko object graph ki tarah traverse karne deta hai — `order.Customer.Name` seedha likh sakte ho (agar related data loaded hai — Include/lazy load ke through). EF Core in navigation properties ko convention ya explicit configuration se underlying foreign keys ke saath wire karta hai.",
    followUp: "Agar navigation property loaded nahi hai (na Include, na lazy loading), kya hoga access karne par?",
  },
  {
    id: "nav-props-tr-2",
    question: "Order/OrderItem/Product schema design karo — teeno relationships explain karo (Order-OrderItem, OrderItem-Product) aur batao Order-Product ka relationship effectively kya hai.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Order-OrderItem: one-to-many. OrderItem-Product: many-to-one. Order-Product: effectively many-to-many, with OrderItem as the explicit join entity.",
    detailedAnswer:
      "`Order` aur `OrderItem` ke beech one-to-many hai — ek `Order` ke multiple `OrderItem`s ho sakte hain, `OrderItem.OrderId` FK hai. `OrderItem` aur `Product` ke beech many-to-one hai — ek `Product` multiple `OrderItem`s me appear ho sakta hai (different orders me), `OrderItem.ProductId` FK hai. In dono relationships ko combine karke, `Order` aur `Product` effectively many-to-many ban jaate hain (ek order me multiple products, ek product multiple orders me) — lekin `OrderItem` ko explicit entity ki tarah model kiya jaata hai, implicit join table nahi, kyunki isme `Quantity`/`UnitPrice` jaisi order-specific extra data honi zaroori hai.",
  },
  {
    id: "nav-props-tr-3",
    question: "EF Core 5.0 se pehle aur baad me many-to-many relationships configure karne me kya fark aaya?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "EF Core 5.0 se pehle hamesha explicit join entity chahiye thi; 5.0+ me implicit join tables auto-generate ho sakti hain simple (data-less) cases ke liye.",
    detailedAnswer:
      "EF Core 5.0 se pehle, koi bhi many-to-many relationship — chahe usme extra data ho ya na ho — ek explicit join entity class define karna zaroori tha, aur do one-to-many relationships us join entity ke through manually configure karni padti thi. EF Core 5.0 (2020) ne implicit many-to-many support add kiya — agar join relationship ko koi extra column nahi chahiye, do collection navigation properties (`ICollection<Product> Products` on `Order`, `ICollection<Order> Orders` on `Product`) likh kar EF Core khud ek hidden join table generate kar deta hai, koi explicit entity zaroori nahi.",
    followUp: "Agar tumhe baad me join table me ek naya column add karna pade, implicit approach se explicit approach me migrate karna kitna painful hoga?",
  },
  {
    id: "nav-props-tr-4",
    question: "Ek one-to-one relationship (`Order` aur `OrderInvoice`) configure karte waqt, kaise decide karte ho kaunsi entity 'principal' hai aur kaunsi 'dependent'?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Dependent woh entity hai jiske paas foreign key hoti hai — typically jo entity 'baad me create hoti hai' ya 'jiska existence dusri entity pe depend karta hai' (Invoice ek Order ke baad hi banta hai).",
    detailedAnswer:
      "Principal entity woh hai jo independently exist kar sakti hai (`Order`), dependent entity woh hai jiska existence principal pe depend karta hai aur jiske paas foreign key column hota hai (`OrderInvoice.OrderId`). One-to-one relationships me ye distinction explicitly specify karni padti hai `HasForeignKey<TDependent>(...)` se, kyunki dono entities symmetric lag sakti hain declaration me — EF Core khud guess nahi kar sakta bina explicit hint ke ki kaunsi taraf FK honi chahiye.",
  },
  {
    id: "nav-props-tr-5",
    question: "Ye code me kya issue ho sakta hai?\n```csharp\npublic class Order\n{\n    public int Id { get; set; }\n    public List<OrderItem> OrderItems { get; set; } // not initialized\n}\n```",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "OrderItems collection null ho sakta hai naye-create kiye gaye Order instance ke liye — NullReferenceException agar access kiya jaaye without initializing.",
    detailedAnswer:
      "Agar ek `Order` object manually `new Order()` se create hota hai (na ki database se load), `OrderItems` property `null` hogi jab tak explicitly `= new List<OrderItem>()` se initialize na ki jaaye. Agar code isko access kare (jaise `order.OrderItems.Add(...)`) bina initialization ke, `NullReferenceException` aayega. Best practice: collection navigation properties ko property declaration me hi initialize karo (`public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();`), taaki ye newly-created entities ke liye bhi safe rahe.",
    redFlag: "Candidate ko is uninitialized collection me issue na dikhna.",
  },
  {
    id: "nav-props-tr-6",
    question: "Kya EF Core foreign key naming convention se automatically relationship detect kar sakta hai, aur ye convention kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Haan — `<PrincipalEntity>Id` ya `<NavigationProperty>Id` pattern wali properties automatically FK ki tarah recognize hoti hain.",
    detailedAnswer:
      "EF Core convention-based configuration me, agar ek entity me ek property hai jiska naam `<PrincipalEntityName>Id` (jaise `CustomerId` in an `Order` class jo `Customer` ko reference karti hai) ya navigation property ke naam se match karta hai, EF Core automatically ise foreign key ki tarah recognize kar leta hai aur relationship wire kar deta hai — koi explicit configuration ki zaroorat nahi hoti. Agar naming ye convention follow nahi karti, `[ForeignKey]` attribute ya Fluent API `.HasForeignKey()` explicitly specify karna padta hai.",
  },
  {
    id: "nav-props-tr-7",
    question: "Ek team ne shuru me `Order`-`Tag` ko implicit many-to-many (EF Core 5+) bana diya tha, ab requirement aayi hai ki 'kis user ne kab tag apply kiya' bhi track karna hai. Iska kya implication hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Implicit join table me extra columns add nahi ho sakte — migrate karna hoga ek explicit join entity (OrderTag) ki taraf jisme AppliedBy/AppliedAt properties ho.",
    detailedAnswer:
      "Implicit many-to-many join tables EF Core khud manage karta hai, aur inme custom columns add karne ka koi supported tareeka nahi hai — ye sirf do foreign keys hold karti hain. Naya requirement (kaunsa user, kab) genuinely extra data hai jo join relationship ke saath associated honi chahiye — is case me team ko implicit many-to-many se explicit join entity (`OrderTag` with `OrderId`, `TagId`, `AppliedByUserId`, `AppliedAt` properties) me migrate karna padega, jo ek schema migration (data preserve karte hue) aur code changes dono involve karega. Ye exactly wo scenario hai jo shuru se explicit entity design ko justify karta hai jab extra-data ki possibility genuine ho.",
    followUp: "Aisi migration ke liye tum kya approach loge existing data ko preserve karte hue?",
  },
];

export default questions;
