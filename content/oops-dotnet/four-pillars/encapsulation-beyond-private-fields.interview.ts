import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "encapsulation-tr-1",
    question: "Encapsulation kya hai? Ek concrete example ke saath samjhao.",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer:
      "State ko behavior ke saath bundle karna, aur mutation ko sirf validated methods/properties ke through allow karna, taaki object kabhi invalid state me na jaa sake.",
    detailedAnswer:
      "Encapsulation ka real payoff invariant protection hai. Jaise Order class me Total private set hai — external code sirf AddItem() ya ApplyDiscount() ke through use modify kar sakta hai, jinke andar validation hoti hai. Isse guarantee milti hai ki Total kabhi negative nahi ho sakta, kyunki mutation ka koi aur raasta hi nahi hai.",
    followUp: "Agar setter me koi validation na ho, kya wo ab bhi encapsulation counted hoga?",
  },
  {
    id: "encapsulation-tr-2",
    question: "Public field aur private field + public getter/setter (bina validation) me actual difference kya hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Behavior ke level pe koi meaningful difference nahi hai agar setter me validation na ho — dono external code ko unrestricted mutation dete hain.",
    detailedAnswer:
      "Ye ek classic trap hai. Syntax-wise private field + public auto-property 'encapsulated' dikhta hai, lekin agar setter bina validation ke hai, to koi bhi value set ho sakti hai — bilkul public field jaisa hi. Real encapsulation tabhi shuru hoti hai jab access control ke saath ek invariant bhi enforce ho raha ho. Sirf syntax badalna encapsulation nahi hai.",
    redFlag: "Ye bolna ki 'main sab fields ko properties bana deta hoon, isliye mera code encapsulated hai' — bina ye check kiye ki properties me actual validation logic hai ya nahi.",
  },
  {
    id: "encapsulation-tr-3",
    question: "Ye code kya print karega?\n```csharp\npublic class Order\n{\n    public decimal Total { get; private set; }\n    public void AddItem(decimal price) => Total += price;\n}\n\nvar order = new Order();\norder.AddItem(100);\norder.AddItem(50);\nConsole.WriteLine(order.Total);\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "150 — AddItem se hi Total update ho raha hai, external code directly Total set nahi kar sakta.",
    detailedAnswer:
      "`Total` ki setter `private` hai, isliye sirf Order class ke andar (yahan AddItem method me) hi modify ho sakti hai. Do AddItem calls se 100 + 50 = 150. Agar koi bahar se `order.Total = 500` likhne ki koshish kare, wo compile-time error dega kyunki setter accessible hi nahi hai bahar se.",
  },
  {
    id: "encapsulation-tr-4",
    question: "Ye compile hoga ya error dega?\n```csharp\npublic class Percentage\n{\n    public int Value { get; }\n    public Percentage(int value)\n    {\n        if (value < 0 || value > 100)\n            throw new ArgumentOutOfRangeException(nameof(value));\n        Value = value;\n    }\n}\n\nvar p = new Percentage(50);\np.Value = 75; // this line\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Compile error hoga — `Value` ka koi setter hi nahi hai (get-only auto-property), isliye construction ke baad change nahi ho sakti.",
    detailedAnswer:
      "`{ get; }` (koi set nahi) ka matlab hai property sirf constructor ke andar (ya field initializer se) assign ho sakti hai, uske baad kabhi nahi — bilkul readonly field jaisa behavior. `p.Value = 75` likhna 'Property or indexer cannot be assigned to -- it is read only' error dega. Ye ek strong construction-time invariant guarantee hai.",
    followUp: "Agar Value ko baad me kabhi update karna pade to design kaise change karoge?",
  },
  {
    id: "encapsulation-tr-5",
    question: "Tumhare paas ek `BankAccount` class hai jisme `Balance` public settable property hai. Production me ek bug report aaya hai ki kisi user ka balance negative ho gaya. Root cause aur fix kya hoga?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Root cause: koi code path directly Balance set kar raha hai bina validation ke. Fix: Balance ko private set karo, sirf Credit()/Debit() methods se mutate hone do jo negative-check enforce karein.",
    detailedAnswer:
      "Public settable Balance ka matlab hai koi bhi caller — ek buggy background job, ek missed validation, ek future developer jisse pata nahi tha invariant ke baare me — directly `account.Balance = -50` likh sakta tha. Fix: `Balance` ko `private set` karo, aur sirf `Debit(decimal amount)` method se hi decrease ho, jisme `if (amount > Balance) throw ...` jaisi check ho. Isse ye bug class of problems compile-time pe hi impossible ho jaata hai — future me koi is bug ko dobara introduce nahi kar sakta.",
    followUp: "Agar multiple threads simultaneously Debit() call karein to kya extra concern aata hai?",
  },
  {
    id: "encapsulation-tr-6",
    question: "Ek naya developer tumhare code review me kehta hai ki har private field ko wrap karke public get/set property banana chahiye 'best practice ke liye', chahe validation ho ya na ho. Kya tum agree karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Nahi — bina validation ke wrapper property koi extra benefit nahi deti, sirf boilerplate hai. Encapsulation sirf tab lagao jahan actual invariant protect karna ho.",
    detailedAnswer:
      "Blanket rule galat hai. Agar ek field ka koi invariant nahi hai (jaise ek simple DTO ka field), use plain public property/field rakhna theek hai. Wrapping sirf tab value-add hai jab: (a) future me validation add karne ki flexibility chahiye, ya (b) abhi hi koi validation/side-effect logic hai. Blindly har field ko wrap karna 'encapsulation theatre' hai — dikhta hai encapsulated, actually kuch protect nahi karta.",
    redFlag: "Bina kisi justification ke 'hamesha properties use karo, kabhi public fields nahi' jaisi absolute rule bol dena — nuance miss karna signal hai ki concept ka 'why' clear nahi hai.",
  },
  {
    id: "encapsulation-tr-7",
    question: "`init`-only setter aur `private set` me kab kaunsa choose karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`init` jab value sirf object creation ke time set honi chahiye aur uske baad kabhi nahi (even class ke andar se bhi nahi); `private set` jab class ke andar (kisi method se) baad me bhi update karna ho.",
    detailedAnswer:
      "`init` (C# 9) object initializer syntax ke saath compatible hai lekin construction ke baad — chahe class ke andar se ho ya bahar se — kabhi assign nahi ho sakti. `private set` ek zyada flexible option hai: class ke andar koi bhi method usko baad me update kar sakta hai (jaise Total ko AddItem se), sirf external world se blocked hai. Immutable-after-construction properties (jaise ek DTO ka Id) ke liye `init` sahi hai; evolving state (jaise Order.Total) ke liye `private set`.",
    followUp: "Ye dono `readonly` field se kaise alag hain?",
  },
  {
    id: "encapsulation-tr-8",
    question: "System.String immutable kyun hai, aur ye encapsulation ka example kaise hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "String ka internal character buffer kabhi mutate nahi hota — har 'mutating' operation naya string return karti hai. Ye 'value kabhi change nahi hogi' invariant ko encapsulation se enforce karta hai.",
    detailedAnswer:
      "String immutability .NET ka design decision hai — thread-safety (locks ki zaroorat nahi, kyunki koi bhi thread kabhi kisi string ko change nahi kar sakta), aur predictability (agar tumne ek string reference kahin pass kiya, guarantee hai wo kabhi change nahi hogi tumhare peeche se) ke liye. Yahi encapsulation ka essence hai — internal buffer completely hidden hai, sirf naye instances return karne waale methods expose hote hain, koi in-place mutation possible hi nahi.",
    followUp: "Isi wajah se loop me `+=` string concatenation karna kyun expensive hai?",
  },
  {
    id: "encapsulation-tr-9",
    question: "Ye kya print karega, aur kyun?\n```csharp\npublic class Counter\n{\n    public readonly int Start;\n    public Counter(int start) => Start = start;\n    public void Reset() => Start = 0; // this line\n}\n```",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Ye compile hi nahi hoga — `readonly` field sirf constructor me assign ho sakti hai, kisi aur method se nahi, even class ke andar se bhi nahi.",
    detailedAnswer:
      "Bahut candidates `readonly` aur `private set` ko confuse karte hain aur sochte hain readonly field class ke andar kahin bhi set ho sakti hai. Actually `readonly` field sirf constructor (ya field declaration) ke andar assign ho sakti hai — koi doosra method, chahe wo same class ka ho, use modify nahi kar sakta. `Reset()` method me `Start = 0` likhna 'A readonly field cannot be assigned to (except in a constructor)' compile error dega.",
    redFlag: "Ye maan lena ki readonly field private set jaisi hai — 'class ke andar to change ho hi sakti hai' — ye galat hai aur ek common misconception hai.",
  },
];

export default questions;
