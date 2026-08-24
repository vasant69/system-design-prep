import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "records-tr-1",
    question: "record class me kya extra milta hai jo plain class me manually likhna padta?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "Structural equality (Equals/GetHashCode/ToString) aur with-expression support — compiler automatically generate karta hai.",
    detailedAnswer:
      "Plain class me Equals(), GetHashCode(), ToString() ko value-based equality ke liye manually override karna padta hai — boilerplate aur error-prone (pichhle topic me dekha, GetHashCode bhoolna kitna common bug hai). record ye sab automatically generate karta hai based on uske properties, saath me with expression bhi deta hai jo non-destructive 'copy with change' pattern allow karta hai. Positional syntax bhi deconstruction support automatically de deta hai.",
    followUp: "Agar tum record me manually Equals() override karo, kya wo compiler-generated wale se conflict karega?",
  },
  {
    id: "records-tr-2",
    question: "record struct aur readonly struct me kya fark hai — dono immutability se related lagte hain.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "record struct ek record ka value-type version hai (mutable by default), readonly struct ek independent feature hai jo guarantee deta hai struct ke fields kabhi mutate nahi honge.",
    detailedAnswer:
      "Ye do alag features hain jo overlap kar sakte hain. record struct (C# 10) record ki convenience (structural equality, with expression, positional syntax) ko struct (value type) me laata hai — lekin by default MUTABLE hota hai. readonly struct (C# 7.2, records se pehle aaya feature) sirf ye guarantee deta hai ki struct ke saare fields readonly hain, koi record-specific features nahi deta khud se. Dono ko combine karke 'readonly record struct' likhne se tumhe records ki convenience AUR full immutability guarantee dono milti hai.",
    followUp: "Kya readonly record struct me bhi with expression kaam karta hai?",
  },
  {
    id: "records-tr-3",
    question: "Ye kya print karega?\n```csharp\npublic record Point(int X, int Y);\n\nvar p1 = new Point(3, 4);\nvar p2 = new Point(3, 4);\nConsole.WriteLine(p1 == p2);\nConsole.WriteLine(ReferenceEquals(p1, p2));\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "True phir False — record == structural equality use karta hai (compiler-generated), ReferenceEquals identity check karta hai.",
    detailedAnswer:
      "record ke liye compiler operator== ko bhi overload karta hai (Equals() ki tarah hi), isliye p1 == p2 property-by-property comparison karta hai — dono X=3, Y=4 hain, isliye true. Lekin ReferenceEquals hamesha memory identity check karta hai chahe type kuch bhi ho — p1 aur p2 do alag heap allocations hain (record class hone ki wajah se), isliye false. Ye class ke default == behavior se bilkul opposite hai — plain class me == default reference equality karta jab tak overload na ho.",
    followUp: "Agar Point plain class hota record ki jagah, to p1 == p2 ka result kya hota?",
  },
  {
    id: "records-tr-4",
    question: "Ye kya output dega?\n```csharp\npublic record struct Counter(int Value);\n\nvar c = new Counter(5);\nvoid Increment(Counter cnt) => cnt.Value++;\nIncrement(c);\nConsole.WriteLine(c.Value);\n```",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer: "5 — record struct value type hai, isliye pass-by-value hota hai, aur wo mutable bhi hai lekin copy pe hui increment original 'c' ko affect nahi karti.",
    detailedAnswer:
      "record struct by default mutable hota hai (Value property yahan settable hai, kyunki record struct ka default 'readonly' nahi hota jab tak explicitly likha na jaaye). Lekin Counter ek value type hai, isliye Increment(Counter cnt) method me PASS BY VALUE hota hai — cnt ek COPY hai c ka. cnt.Value++ sirf usi copy ko modify karta hai, original c untouched rehta hai. Isliye c.Value abhi bhi 5 hai. Ye value-vs-reference type semantics ka classic demonstration hai, records ke context me.",
    redFlag: "Ye maan lena ki record struct hamesha readonly hota hai isliye Value++ compile hi nahi hoga — plain 'record struct' (bina readonly ke) mutable properties allow karta hai.",
  },
  {
    id: "records-tr-5",
    question: "Tumhare paas ek high-throughput reconciliation job hai jo lakhon transaction records process karta hai, har ek ek Money value (Amount + Currency) carry karta hai. Kya use karoge — record, record struct, ya readonly record struct — aur kyun?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "readonly record struct — value type hone se lakhon objects ke liye heap allocation avoid hoti hai, aur readonly immutability guarantee deta hai jo financial correctness ke liye critical hai.",
    detailedAnswer:
      "record (class) har instance ke liye heap allocation karega — lakhon transactions ke liye ye significant GC pressure create karega. record struct heap allocation avoid karta hai (stack ya containing structure ke saath), lekin default mutable hai jo financial value objects ke liye risky hai (accidental mutation se amount corrupt ho sakta hai). readonly record struct dono fayde deta hai: koi heap allocation (perf) aur guaranteed immutability (correctness) — is scenario ke liye ideal choice hai.",
    followUp: "Agar Money struct bahut bada ho jaaye (bahut saari fields), kya large struct pass-by-value me koi downside hai?",
  },
  {
    id: "records-tr-6",
    question: "Ek team member ne with expression ko 'in-place update' bola code review comment me. Ye galat kyun hai, aur kya risk hai isse?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat hai — with hamesha ek naya instance banata hai, original ko kabhi mutate nahi karta. Isse galat samajhne se bugs aate hain jahan expected update actually apply hi nahi hota kyunki result discard ho gaya.",
    detailedAnswer:
      "Agar koi developer ye samajh kar `original with { Amount = newAmount };` likh de (result ko kisi variable me assign kiye bina, ye sochte hue ki 'original' khud update ho jaayega), to actual result silently discard ho jaata hai — original object bilkul unchanged rehta hai. Ye ek real, easy-to-miss bug hai. Sahi usage hamesha result ko capture karna hai: `original = original with { Amount = newAmount };` ya ek naye variable me assign karna.",
    redFlag: "with expression ka result assign na karna, ye sochte hue ki mutation ho jaayegi — records is class of bug se bachne ke liye hi immutable design kiye gaye hain, lekin galat mental model se ulta bug create ho sakta hai.",
  },
  {
    id: "records-tr-7",
    question: "Production me ek Dictionary<Money, ExchangeRate> cache hai jisme Money ek plain mutable class thi (record nahi). Kabhi-kabhi cache lookups fail ho jaate the chahe entry present ho. Immutable record me switch karne se ye kaise fix hua?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Mutable Money ke fields kahin accidentally change ho rahe the insertion ke baad, jisse GetHashCode() ka result badal jaata tha — record use karne se properties init-only ban gayin, mutation hi impossible ho gaya.",
    detailedAnswer:
      "Ye exactly pichhle topic wala 'mutable hash-key' bug hai. Plain mutable class me koi bhi code path galti se Money.Amount ko reassign kar sakta tha post-insertion, jisse hash code drift ho jaata aur Dictionary entry 'lost' ho jaati. record me switch karne se properties automatically init-only ban gayin — compile-time pe hi koi post-construction mutation possible nahi rahi, isliye ye poori class of bug root se eliminate ho gayi, sirf disciplined coding se nahi, language-enforced guarantee se.",
    followUp: "Agar Money ko record ki jagah readonly record struct banate, to iska Dictionary key ke roop me use hone pe koi additional consideration hai?",
  },
  {
    id: "records-tr-8",
    question: "Kya ek record ka Equals() manually override karna possible hai, ya compiler ka generated version hi use karna padta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Haan possible hai — record me manually Equals()/GetHashCode() override karke default structural equality ko customize kiya ja sakta hai.",
    detailedAnswer:
      "record 'sensible default' equality generate karta hai, lekin ye final/sealed nahi hai — tum apna khud ka Equals(Point other) (strongly-typed, IEquatable<T> pattern follow karte hue) likh sakte ho agar custom comparison logic chahiye (jaise kuch fields ko equality me ignore karna). Compiler tumhare explicit override ko respect karta hai, apna generated version nahi thopta. Ye flexibility record ko sirf 'boilerplate-reducer' nahi, ek genuinely customizable feature banati hai.",
  },
];

export default questions;
