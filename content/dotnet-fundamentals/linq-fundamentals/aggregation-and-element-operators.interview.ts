import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "aggregation-tr-1",
    question: "`First`, `Single`, aur `SingleOrDefault` me precisely kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft", "Amazon", "TCS"],
    shortAnswer:
      "First = pehla match, multiple matches theek. Single = exactly ek match enforce karta hai, zero ya multiple par throws. SingleOrDefault = sirf zero-match ko default banata hai, multiple-match par abhi bhi throws.",
    detailedAnswer:
      "`First(predicate)` pehla matching element deta hai — agar koi match nahi, throws; agar kai match hain, farak nahi padta, pehla mil jaata hai. `Single(predicate)` uniqueness enforce karta hai — sirf tab element return karta hai jab EXACTLY ek match ho, zero ya multiple dono cases exception dete hain. `SingleOrDefault(predicate)` sirf zero-match case ko default(T) me convert karta hai — multiple-match case abhi bhi `InvalidOperationException` throw karta hai, ye subtlety bahut candidates miss karte hain.",
    followUp: "Kis real-world scenario me tum First ke bajaye Single choose karoge?",
  },
  {
    id: "aggregation-tr-2",
    question: "Ye statement sahi hai ya galat: 'SingleOrDefault kabhi exception nahi throw karta'?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Galat — SingleOrDefault sirf zero-match case ko default se replace karta hai; multiple matches milne par abhi bhi InvalidOperationException throw karta hai.",
    detailedAnswer:
      "`SingleOrDefault` ka naam misleading lag sakta hai — 'OrDefault' sirf 'zero-match case me exception ki jagah default value do' ka matlab rakhta hai. Agar sequence me EK se zyada matching elements hain, `SingleOrDefault` uniqueness violation ko exception se hi report karta hai, kisi default value se nahi. Ye difference `First`/`FirstOrDefault` se fundamentally alag hai — wahan multiple matches kabhi exception nahi dete.",
    redFlag: "'OrDefault wale operators kabhi exception nahi dete' bolna — ye galat hai for Single/SingleOrDefault ka multiple-match case.",
  },
  {
    id: "aggregation-tr-3",
    question: "Ek claims-lookup system me `claims.First(c => c.PolicyNumber == policyNum)` use ho raha tha, aur duplicate policy numbers wala ek data bug months tak undetected raha. Kya galat tha, aur kaise fix karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "First silently pehla match return kar deta hai chahe duplicates hon — Single use karna chahiye tha, jo uniqueness violation par turant exception dega.",
    detailedAnswer:
      "`First` ka design hi ye hai ki multiple matches ho to bhi silently pehla return kar de — is wajah se ek data-integrity bug (duplicate policy numbers) turant surface nahi hua, kyunki application 'working' dikh raha tha (koi error nahi, bas galat/arbitrary record use ho raha tha). Fix: `Single(c => c.PolicyNumber == policyNum)` use karna — agar policy number genuinely unique hona chahiye, `Single` duplicate milte hi exception throw karega, jo bug ko turant, loudly detect kar dega bajaye hafton tak silently chalte rehne ke.",
  },
  {
    id: "aggregation-tr-4",
    question: "Ye code kya karega?\n```csharp\nvar list = new List<int>();\nvar result = list.Aggregate(0, (acc, n) => acc + n);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "result = 0 — seeded Aggregate empty sequence par exception nahi deta, seed value return kar deta hai.",
    detailedAnswer:
      "Ye `Aggregate` ka seeded overload hai (`seed = 0`) — agar sequence empty hai, accumulator function kabhi call hi nahi hota, aur seed value directly return ho jaata hai. Bina seed wale overload (`list.Aggregate((acc, n) => acc + n)`) ke saath ye same empty list `InvalidOperationException` throw karta — kyunki us overload me pehla element hi implicit seed banta hai, aur empty sequence me koi 'pehla element' nahi hota.",
  },
  {
    id: "aggregation-tr-5",
    question: "`Count(predicate) > 0` aur `Any(predicate)` functionally same result dete hain, lekin performance me fark hai. Kya fark hai aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Any() pehla match milte hi short-circuit ho jaata hai; Count(predicate) poori sequence enumerate karta hai exact count ke liye — Any hamesha existence-check ke liye behtar hai.",
    detailedAnswer:
      "`Any(predicate)` internally pehla matching element milte hi `true` return kar deta hai, baaki sequence enumerate hi nahi karta. `Count(predicate)` ka design hi ye hai ki poori sequence ko traverse karke total matching count nikale — chahe tumhe sirf 'kam se kam ek hai ya nahi' jaanna ho, ye poori sequence process karega. Bade collections ke liye ye difference genuinely measurable ho sakta hai — best practice hamesha existence-check ke liye `Any` use karna hai.",
  },
  {
    id: "aggregation-tr-6",
    question: "`ElementAt` aur `ElementAtOrDefault` me kya fark hai, aur ye kab use hote hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "ElementAt(i) invalid index par throws (ArgumentOutOfRangeException); ElementAtOrDefault(i) invalid index par default(T) return karta hai.",
    detailedAnswer:
      "Dono position-based access dete hain (0-based index). `ElementAt(i)` agar index sequence ki bounds se bahar hai, exception throw karta hai. `ElementAtOrDefault(i)` same case me exception ki jagah `default(T)` (jaise `null` reference types ke liye, `0` numeric types ke liye) return kar deta hai. Ye specific-position access ke liye useful hain, jaise pagination logic ya index-known scenarios — comparatively kam common hain filter/aggregate operators ki tulna me.",
  },
  {
    id: "aggregation-tr-7",
    question: "`Aggregate` operator `Sum`/`Count` jaise built-in aggregation operators se kaise alag hai, aur ye kab genuinely zaroori hota hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Aggregate ek arbitrary custom accumulator logic allow karta hai jo built-in operators (Sum/Min/Max) express nahi kar sakte — jab custom combining logic chahiye ho.",
    detailedAnswer:
      "`Sum`/`Min`/`Max`/`Average` fixed, predefined aggregation logic implement karte hain. `Aggregate` ek generic reduce operation hai jaha tum khud accumulator function define karte ho — jaise numbers ka product nikalna (`Aggregate((acc, n) => acc * n)`), ya strings ko ek custom delimiter format ke saath combine karna, ya koi bhi non-standard combining logic. Jab tumhara use-case built-in operators me fit nahi hota, `Aggregate` wahi flexibility deta hai jo ek manual `foreach` loop ke saath accumulator variable maintain karne se milti, LINQ-idiomatic style me.",
  },
  {
    id: "aggregation-tr-8",
    question: "Ek code review me tumhe `.First()` (bina predicate, bina OrDefault) dikha jo ek potentially-empty list par call ho raha hai. Kya risk hai, aur kya suggest karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "List empty hone par InvalidOperationException aayega — agar empty case genuinely valid ho sakta hai, FirstOrDefault() use karna chahiye aur result ko explicitly null-check karna chahiye.",
    detailedAnswer:
      "`First()` (bina predicate) empty sequence par `InvalidOperationException` ('Sequence contains no elements') deta hai. Agar list genuinely kabhi empty ho sakti hai (jaise koi optional filter result), ye ek unhandled exception ban sakta hai jo production crash de. Suggestion: `FirstOrDefault()` use karo aur result ko explicitly `null`/`default` ke against check karo before use — ye caller ko empty-case ko intentionally handle karne majboor karta hai, bajaye ek uncaught exception crash hone dene ke.",
  },
];

export default questions;
