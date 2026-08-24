import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "list-dict-hashset-tr-1",
    question: "`List<T>`, `Dictionary<TKey,TValue>`, aur `HashSet<T>` — teeno ka internal data structure kya hai aur inka lookup complexity kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "`List<T>` internally ek plain array hai (index access O(1), search O(n)); `Dictionary` aur `HashSet` dono hash table hain (average O(1) lookup/Contains).",
    detailedAnswer:
      "`List<T>` ek dynamic array hai — resize hone par internally naya bada array allocate hota hai. Index-based access O(1) hai (direct address calculation), lekin value-based search O(n) hai (linear scan). `Dictionary<TKey,TValue>` aur `HashSet<T>` dono hash tables hain — key/element ko ek hash function se bucket-index me convert karte hain, jisse lookup/Contains average O(1) ban jaata hai, worst case (heavy collisions) O(n) tak degrade ho sakta hai.",
    followUp: "Hash collision hone par internally kya hota hai?",
  },
  {
    id: "list-dict-hashset-tr-2",
    question: "Ye code kya print karega?\n```csharp\nvar set = new HashSet<int> { 1, 2, 3 };\nbool added = set.Add(2);\nConsole.WriteLine($\"{added}, {set.Count}\");\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "\"False, 3\" — 2 already exist karta hai, isliye Add false return karta hai aur Count unchanged rehta hai.",
    detailedAnswer:
      "`HashSet<T>.Add()` ek `bool` return karta hai — `true` agar item naya add hua, `false` agar wo already exist karta tha (duplicate silently ignored). Yahan `2` already set me hai, isliye `Add(2)` `false` return karta hai aur `Count` `3` hi rehta hai, `4` nahi.",
  },
  {
    id: "list-dict-hashset-tr-3",
    question: "Ek incoming batch me 100,000 order-IDs hain, jinme kuch duplicates ho sakte hain. Tumhe efficiently unique IDs nikaalne hain. Kaunsa approach loge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`HashSet<string>` me sabko add karo — duplicates automatically drop ho jaayenge, poora operation O(n) average me ho jaata hai.",
    detailedAnswer:
      "`HashSet<string>` me sab 100,000 IDs `Add()` karne se — jo bhi duplicate hai wo silently ignore ho jaayega (Add false return karega us case me), aur end me `HashSet` me sirf unique IDs bachenge. Poora operation average O(n) hai (n Adds, har ek O(1) average). Alternative galat approach: `List<string>` me manually `Contains` check karke add karna — ye O(n^2) ban jaata hai bade batches me, kyunki har `Contains` khud O(n) hai.",
  },
  {
    id: "list-dict-hashset-tr-4",
    question: "`dict.TryGetValue(key, out value)` aur `dict[key]` (indexer) me practical difference kya hai jab key exist na kare?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "Indexer missing key par exception throw karta hai; `TryGetValue` `false` return karta hai bina exception ke, aur ek `bool` check se safely handle ho jaata hai.",
    detailedAnswer:
      "`dict[missingKey]` `KeyNotFoundException` throw karta hai — control flow ke liye exceptions use karna anti-pattern hai jab missing key ek expected, normal case ho. `dict.TryGetValue(missingKey, out var value)` `false` return karta hai (aur `value` ko default set kar deta hai), koi exception nahi — ye 'key ho sakti hai ya nahi' jaise genuinely uncertain cases ke liye sahi tool hai.",
  },
  {
    id: "list-dict-hashset-tr-5",
    question: "Ye code kya print karega?\n```csharp\nvar list = new List<int> { 5, 3, 8, 1 };\nlist.Insert(0, 100);\nConsole.WriteLine(string.Join(\",\", list));\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "\"100,5,3,8,1\" — `Insert(0, 100)` sab existing elements ko ek position right shift karke naya element index 0 pe daal deta hai.",
    detailedAnswer:
      "`List<T>.Insert(index, item)` given index pe item daalta hai, aur usse aage ke sab elements ko ek position right shift karta hai (O(n) operation, kyunki internally array-based hai). Yahan `100` index 0 pe insert hota hai, baaki sab (5, 3, 8, 1) ek position aage shift ho jaate hain. Final list: `100, 5, 3, 8, 1`.",
  },
  {
    id: "list-dict-hashset-tr-6",
    question: "Kya `Dictionary<TKey,TValue>` guaranteed insertion order maintain karta hai jab tum use enumerate (foreach) karte ho?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — practically kabhi-kabhi insertion order jaisa dikh sakta hai, lekin ye ek documented guarantee nahi hai, aur is par relies karna bug-prone hai.",
    detailedAnswer:
      "`Dictionary<TKey,TValue>` ka enumeration order Microsoft docs ke mutabik explicitly 'not guaranteed' hai — internal implementation detail hai jo .NET versions ke beech change ho sakta hai (aur historically kuch versions me change bhi hua hai). Kabhi-kabhi ye insertion-order-jaisa dikhta hai current implementation ki wajah se, lekin isse code me dependency banana galat hai. Order guaranteed chahiye to `SortedDictionary<TKey,TValue>` (key-order) use karo, ya explicit list/array me store karo insertion sequence preserve karne ke liye.",
    redFlag: "Production code me Dictionary ke 'apparent' insertion order par rely karna — ye ek silent, version-dependent bug ban sakta hai.",
  },
  {
    id: "list-dict-hashset-tr-7",
    question: "`HashSet<T>` aur `Dictionary<TKey, bool>` dono se 'membership check' implement kiya ja sakta hai. Kaunsa better choice hai aur kyun?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "`HashSet<T>` — semantically correct choice, kyunki koi actual value associate nahi karni hai. `Dictionary<TKey, bool>` ek code smell hai jahan value ki koi real zaroorat nahi.",
    detailedAnswer:
      "Dono technically same time-complexity dete hain (O(1) average), lekin `Dictionary<TKey, bool>` semantically galat signal deta hai — reader ko lagta hai har key ke saath koi meaningful boolean value associated hai, jabki actually sirf presence/absence matter karti hai. `HashSet<T>` exactly is use case ke liye design kiya gaya hai — clean intent, thoda kam memory overhead (koi value slot store nahi karna padta).",
  },
  {
    id: "list-dict-hashset-tr-8",
    question: "`List<T>` me index se element access (`list[i]`) O(1) hai, lekin `LinkedList<T>` me nahi. Ye fark kyun hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`List<T>` internally contiguous array hai — address direct calculate ho jaata hai. `LinkedList<T>` nodes hain jo pointers se connected hain — i-th node tak pahunchne ke liye traverse karna padta hai.",
    detailedAnswer:
      "`List<T>` ka underlying storage ek plain, contiguous array hai — kisi bhi index `i` ka memory address direct formula (`base + i * elementSize`) se calculate ho jaata hai, koi traversal nahi chahiye — O(1). `LinkedList<T>` me har element ek separate node hai jo agle/pichhle node ka reference rakhta hai, koi contiguous block nahi — i-th node tak pahunchne ke liye shuru (ya end) se traverse karna padta hai, O(n).",
  },
];

export default questions;
