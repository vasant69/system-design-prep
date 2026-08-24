import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "list-dict-hashset-1",
    question: "1 million items wale `List<int>` aur `HashSet<int>` dono me ek same item exist karta hai ya nahi check karna hai baar-baar (loop me). Kaunsa collection significantly faster hoga aur kyun?",
    options: [
      "Dono same speed denge, koi fark nahi",
      "`List<int>` faster hoga kyunki simpler hai",
      "`HashSet<int>` faster hoga — O(1) average Contains, jabki List ka Contains O(n) linear scan hai",
      "Ye depend karta hai items ke order par",
    ],
    correctIndex: 2,
    explanation:
      "`HashSet<T>.Contains()` hashing use karta hai — direct bucket lookup, O(1) average, chahe collection kitni badi ho. `List<T>.Contains()` linear scan karta hai — worst case har item check karna padta hai, O(n). Bade dataset aur repeated checks me ye difference exponentially matter karta hai. Option A aur D dono galat hain — internal mechanism genuinely alag hai. Option B galat hai — 'simple' hone ka speed se koi lena dena nahi, algorithm complexity matter karti hai.",
    difficulty: "medium",
  },
  {
    id: "list-dict-hashset-2",
    question: "`Dictionary<string, int> ages` me `ages[\"Unknown\"]` access karna (indexer se, key exist nahi karti) kya karega?",
    options: [
      "`0` return karega (default value)",
      "`null` return karega",
      "`KeyNotFoundException` throw karega",
      "Silently naya entry create kar dega value 0 ke saath",
    ],
    correctIndex: 2,
    explanation:
      "Dictionary ka indexer (`dict[key]`) agar key exist nahi karti to `KeyNotFoundException` throw karta hai — safe alternative `TryGetValue` ya `ContainsKey` check karna hai. Option A aur B galat hain — koi silent default nahi milta indexer se. Option D galat hai — read-access naya entry create nahi karta (ye behavior sirf write-side, jaise `dict[key] = value`, me hota hai, wo bhi sirf assignment ke through).",
    difficulty: "easy",
  },
  {
    id: "list-dict-hashset-3",
    question: "`List<int>.Add()` ko 'amortized O(1)' kyun kaha jaata hai, sirf 'O(1)' kyun nahi?",
    options: [
      "Kyunki List internally ek linked structure hai",
      "Kyunki zyaadatar Add calls O(1) hain, lekin kabhi-kabhar internal array full hone par O(n) resize-and-copy hota hai — averaged out, ye O(1) per-operation kehlata hai",
      "Kyunki Add hamesha O(n) hai, 'amortized' sirf marketing term hai",
      "Kyunki List me Add ka time har baar random hota hai",
    ],
    correctIndex: 1,
    explanation:
      "'Amortized O(1)' ka matlab hai average performance over many operations O(1) hai, chahe individual occasional operations O(n) lein. List ka internal array jab full ho jaata hai, ek naya bada array allocate hota hai aur sab elements copy hote hain (O(n)) — lekin ye rarely hota hai (typically doubling strategy se), isliye averaged out per-Add cost O(1) hi rehta hai. Option A galat hai — List internally array-based hai, linked list nahi. Option C galat hai — zyaadatar operations genuinely O(1) hain. Option D galat hai — behavior deterministic hai, random nahi.",
    difficulty: "hard",
  },
  {
    id: "list-dict-hashset-4",
    question: "Ek custom class `Product` ko `HashSet<Product>` me use karna hai jahan do `Product` objects 'same' maane jaayein agar unka `Id` same ho. Kya karna zaroori hai?",
    options: [
      "Kuch nahi, HashSet automatically Id property dhoondh lega",
      "`Product` class me `GetHashCode()` aur `Equals()` dono ko `Id` ke basis par override karna",
      "Sirf `ToString()` override karna kaafi hai",
      "`Product` ko `struct` banana zaroori hai, `class` nahi chalega",
    ],
    correctIndex: 1,
    explanation:
      "`HashSet<T>` (aur `Dictionary` keys) default me reference equality use karte hain classes ke liye — do alag `Product` instances, chahe same Id ho, alag treat honge jab tak `Equals()` aur `GetHashCode()` dono explicitly override na kiye jaayein (dono ek saath, consistently, warna hashing collections me undefined/buggy behavior aa sakta hai). Option A galat hai — koi automatic detection nahi hoti. Option C galat hai — `ToString()` ka equality se koi lena dena nahi. Option D galat hai — class ya struct dono HashSet me use ho sakte hain, struct hona mandatory nahi.",
    difficulty: "hard",
  },
];

export default quiz;
