import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "generics-tr-1",
    question: "Generics kyun banaye gaye? ArrayList se List<T> better kyun hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Accenture"],
    shortAnswer: "Compile-time type safety aur boxing avoidance ke liye — ArrayList object store karta tha jisse heap allocation aur runtime type errors dono hote the.",
    detailedAnswer:
      "ArrayList (aur Hashtable jaise non-generic collections) object type store karte the. Value type add karne pe boxing hoti (heap pe allocation), aur retrieve karte waqt explicit cast lagta — agar wrong type cast kiya to runtime InvalidCastException. List<T> dono problems solve karta hai: T ek concrete type hone se boxing nahi hoti value types ke liye, aur compiler compile-time pe hi galat type add hone se rok deta hai — koi runtime surprise nahi.",
    followUp: "Boxing exactly kab hoti hai, aur uska real perf cost kitna hota hai?",
  },
  {
    id: "generics-tr-2",
    question: "`where T : class, IEntity, new()` — is constraint list ka har part explain karo.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "T reference type ho, IEntity implement kare, aur uska public parameterless constructor ho — teeno combine hokar T pe kya operations safe hain define karte hain.",
    detailedAnswer:
      "`class` constraint T ko reference type tak restrict karta hai (structs allowed nahi). `IEntity` ensure karta hai T us interface ke members (jaise Id property) implement kare, isliye generic code safely `.Id` access kar sakta hai. `new()` guarantee karta hai T ka ek public parameterless constructor hai, isliye generic code `new T()` likh sakta hai. Rule: agar new() combine ho rahi hai doosre constraints ke saath, wo hamesha LAST likhna padta hai — ye ek syntax requirement hai.",
    followUp: "Agar tumhe T ka non-default constructor use karna ho (parameters ke saath), to kya karoge, kyunki new() sirf parameterless allow karta hai?",
  },
  {
    id: "generics-tr-3",
    question: "Covariance aur contravariance ka intuition kya hai — 'out' aur 'in' yaad rakhne ka easy tareeka?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "'out' (covariant) matlab T sirf produce/return hota hai — safe hai more-specific ko less-specific ki jagah use karna. 'in' (contravariant) matlab T sirf consume/accept hota hai — safe hai less-specific ko more-specific ki jagah use karna.",
    detailedAnswer:
      "Rote-learning ki jagah intuition use karo: agar ek interface sirf T 'deta' hai (return types me, jaise IEnumerable<T>.GetEnumerator()), to ek IEnumerable<string> ko IEnumerable<object> ki jagah use karna safe hai — jo bhi string milegi wo valid object bhi hai. Ye covariance hai, 'out' keyword se mark hota hai. Agar ek interface sirf T 'leta' hai (parameters me, jaise IComparer<T>.Compare(T,T)), to ek IComparer<object> ko IComparer<string> ki jagah use karna safe hai — agar wo kisi bhi object ko compare kar sakta hai, to string bhi kar sakta hai. Ye contravariance hai, 'in' keyword se mark hota hai.",
    followUp: "Func<T, TResult> me kaunsa parameter covariant hai aur kaunsa contravariant?",
  },
  {
    id: "generics-tr-4",
    question: "Ye code compile hoga ya error dega?\n```csharp\nList<string> strings = new List<string> { \"a\", \"b\" };\nList<object> objects = strings;\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error — List<T> invariant hai, sirf interfaces (jaise IEnumerable<out T>) variance support karte hain, generic classes nahi.",
    detailedAnswer:
      "List<T> khud invariant hai, isliye List<string> ko List<object> me directly assign nahi kiya ja sakta — CS0266 jaisa compile error milega. Iske contrast me, `IEnumerable<object> objects = strings;` compile ho jaata, kyunki List<T> IEnumerable<out T> implement karta hai aur us interface ke through covariance apply hoti hai. Ye ek classic gotcha hai — candidates aksar List<T> aur IEnumerable<T> ke variance behavior ko confuse karte hain.",
    redFlag: "Ye assume karna ki 'T covariant hai kahin bhi' — variance interface/delegate-specific hai, concrete generic class type pe nahi apply hoti.",
  },
  {
    id: "generics-tr-5",
    question: "Ye code kya karega?\n```csharp\nobject[] arr = new string[3];\narr[0] = 42;\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "Compile ho jaayega (array covariance), lekin runtime pe ArrayTypeMismatchException throw karega.",
    detailedAnswer:
      "C# arrays covariant hain — string[] ko object[] me assign karna allowed hai compile time pe, kyunki compiler string ko object ka valid substitute maanta hai. Lekin arrays type-unsafe covariant hain: runtime pe array apna actual element type (string[]) track karta hai, aur jab tum `arr[0] = 42` (ek int) assign karte ho, CLR check karta hai ki 42 actual array type (string) ke compatible hai ya nahi — nahi hai, isliye ArrayTypeMismatchException aati hai. Ye exactly wo scenario hai jo generic out/in variance AVOID karta hai — generic variance fully compile-time checked hai, arrays nahi.",
    followUp: "Generic IEnumerable<out T> ye same problem kyun nahi face karta?",
  },
  {
    id: "generics-tr-6",
    question: "Tumhe ek generic caching layer banana hai jo kisi bhi entity type ko cache kar sake, lekin sirf un types ke liye jo IEntity implement karte hain aur ek parameterless constructor rakhte hain. Kaise design karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Ek generic class banao `Cache<T> where T : class, IEntity, new()`, jisme Dictionary<int, T> internally IEntity.Id ke basis pe store kare.",
    detailedAnswer:
      "```csharp\npublic class Cache<T> where T : class, IEntity, new()\n{\n    private readonly Dictionary<int, T> _store = new();\n\n    public void Add(T item) => _store[item.Id] = item;\n    public T? Get(int id) => _store.TryGetValue(id, out var item) ? item : null;\n    public T CreateDefault() => new T();\n}\n```\nConstraints IEntity aur new() ki wajah se generic code safely `.Id` access kar sakta hai aur `new T()` bhi call kar sakta hai — bina in constraints ke compiler in operations ko allow nahi karta kyunki wo har possible T ke liye guarantee nahi kar sakta.",
    followUp: "Agar T struct bhi ho sakta hai, to class constraint kaise change hoga?",
  },
  {
    id: "generics-tr-7",
    question: "Ek library method hai `void Process<T>(IEnumerable<T> items) where T : IComparable<T>`. Ye constraint kyun zaroori hai agar method ke andar items ko sort karna hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Bina IComparable<T> constraint ke, compiler ko pata nahi hota ki T ke instances ek doosre se compare (< ya >) ho sakte hain ya nahi — sorting/comparison operations compile hi nahi honge.",
    detailedAnswer:
      "Generic type parameter T by default sirf System.Object ki guarantee deta hai (ToString, Equals, GetHashCode, GetType) — < ya > operators, ya CompareTo() jaisi methods available nahi hoti bina explicit constraint ke, kyunki compiler ko har possible T ke liye ye guarantee nahi hoti. `where T : IComparable<T>` add karne se compiler ko pata chalta hai T definitely CompareTo(T other) method rakhta hai, jisse method ke andar `items.OrderBy(x => x)` ya manual comparison logic safely likha ja sakta hai.",
  },
  {
    id: "generics-tr-8",
    question: "Kya ye statement sahi hai: 'IComparer<in T> contravariant hai, isliye IComparer<string> ko IComparer<object> ki jagah use kar sakte hain'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — direction ulta hai. Contravariance me IComparer<object> ko IComparer<string> ki jagah use karte hain, IComparer<string> ko IComparer<object> ki jagah nahi.",
    detailedAnswer:
      "Ye ek classic direction-confusion trap hai. Contravariance ka matlab hai: ek MORE GENERAL capability (jaise IComparer<object>, jo kisi bhi object ko compare kar sakta hai) ko ek MORE SPECIFIC requirement (jaise 'mujhe strings compare karne hain', IComparer<string>) ki jagah use kiya ja sakta hai. Ulta nahi — ek IComparer<string> (jo sirf strings compare karna jaanta hai) ko IComparer<object> ki jagah use nahi kar sakte, kyunki usse kisi bhi arbitrary object ko compare karne ko bola ja sakta hai jo wo handle nahi kar sakta. Sahi statement hoga: 'IComparer<object> ko IComparer<string> ki jagah use kar sakte hain.'",
    redFlag: "Covariance aur contravariance ki direction ko swap kar dena under interview pressure — ye bahut common hai, isliye intuition-based reasoning (produce vs consume) practice karna zaroori hai rote memorization ki jagah.",
  },
  {
    id: "generics-tr-9",
    question: "Generic constraints kitne 'runtime' checks avoid karte hain vs 'compile-time' checks — ye distinction interview me kaise explain karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Constraints compile-time checks hain — galat type use karne pe program compile hi nahi hoga, runtime tak koi surprise nahi bachta.",
    detailedAnswer:
      "Constraint violate karne ki koshish (jaise `where T : IEntity` wale generic method ko ek non-IEntity type ke saath call karna) ek COMPILE error deta hai, runtime exception nahi. Ye generics ka core value proposition hai non-generic (object-based) approach ke comparison me — non-generic code me galat type ka pata sirf runtime pe InvalidCastException se chalta, generics me compiler khud hi galat usage ko build fail kar deta hai, bug production tak pahunchne se pehle hi pakda jaata hai.",
  },
];

export default questions;
