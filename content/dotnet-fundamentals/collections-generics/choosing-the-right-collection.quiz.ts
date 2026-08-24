import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "choosing-collection-1",
    question: "Lakhon user-IDs ke set me baar-baar check karna hai ki koi ID exist karti hai ya nahi, koi associated data nahi chahiye. Sabse appropriate collection kaunsa hai?",
    options: [
      "`List<int>` — simple aur intuitive hai",
      "`HashSet<int>` — O(1) average Contains, koi associated value ki zaroorat nahi",
      "`LinkedList<int>` — flexible insertion deta hai",
      "`SortedList<int, int>` — sorted order maintain karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Pure membership-check use case (koi associated value, koi ordering requirement nahi) exactly `HashSet<T>` ke liye design kiya gaya hai — hashing se O(1) average Contains, chahe set me lakhon items hon. Option A galat hai — List ka Contains O(n) hai, lakhon repeated checks me exponentially slow. Option C galat hai — LinkedList membership-check ke liye O(n) traversal maangta hai, koi fayda nahi is scenario me. Option D galat hai — sorted order yahan requirement hi nahi hai, unnecessary overhead.",
    difficulty: "medium",
  },
  {
    id: "choosing-collection-2",
    question: "Ek collection ka index-based access O(1) kyun hota hai lekin doosre ka (jaise LinkedList) nahi — root cause kya hai?",
    options: [
      "Ye sirf .NET ka design choice hai, koi underlying reason nahi",
      "Contiguous memory wale collections (Array, List) me address direct formula se calculate hota hai; linked structures me neighbours ke pointers follow karke traverse karna padta hai",
      "LinkedList slower isliye hai kyunki wo purana/legacy hai",
      "Dono actually same speed dete hain, ye myth hai ki fark hai",
    ],
    correctIndex: 1,
    explanation:
      "Ye root cause hai — jo collections contiguous memory block use karte hain (Array, List), unme kisi bhi index ka memory address ek direct arithmetic formula se calculate ho jaata hai (O(1)). LinkedList jaise linked structures me elements memory me scattered hote hain, sirf neighbour-pointers se connected — i-th position tak pahunchne ke liye actually traverse karna padta hai (O(n)). Options A, C, D sab galat hain — ye ek genuine data-structure-level consequence hai, design-choice ya myth nahi.",
    difficulty: "hard",
  },
  {
    id: "choosing-collection-3",
    question: "Ek LRU (Least Recently Used) cache implement karni hai jisme fast key-lookup bhi chahiye aur fast 'move to front / evict from back' bhi chahiye. Sabse practical approach kya hai?",
    options: [
      "Sirf ek `Dictionary<TKey,TValue>` — sab kuch handle kar lega",
      "Sirf ek `List<T>` — simplest option hai",
      "`Dictionary<TKey, LinkedListNode<T>>` aur `LinkedList<T>` ka combination — Dictionary fast lookup deta hai, LinkedList fast reordering/eviction deta hai",
      "Ye single collection se possible hi nahi hai C# me, custom data structure likhni padegi from scratch",
    ],
    correctIndex: 2,
    explanation:
      "Ye exactly wo scenario hai jahan koi single 'perfect' built-in collection nahi hai — LRU cache classic pattern `Dictionary` (O(1) key lookup, value ek `LinkedListNode<T>` reference) aur `LinkedList<T>` (O(1) known-node move/remove for recency-ordering) ka combination use karta hai. Options A aur B insufficient hain — Dictionary akela ordering-based eviction nahi deta easily, List akela slow hai dono operations ke liye. Option D galat hai — .NET ki built-in collections combine karke ye achieve ho sakta hai, poori custom data structure zaroori nahi.",
    difficulty: "hard",
  },
  {
    id: "choosing-collection-4",
    question: "`Dictionary<TKey,TValue>` ka lookup 'O(1) average' hai — 'average' kyun bola jaata hai, 'guaranteed' kyun nahi?",
    options: [
      "Kyunki Dictionary hamesha slow hota hai",
      "Kyunki heavy hash collisions (bahut saari keys same bucket me collide karein) ke worst case me lookup O(n) tak degrade ho sakta hai",
      "Kyunki Dictionary randomly kabhi fast kabhi slow hota hai bina kisi reason ke",
      "'Average' sirf marketing term hai, actually hamesha O(1) guaranteed hai",
    ],
    correctIndex: 1,
    explanation:
      "Hashing-based collections ka performance hash-function ki quality aur collision-rate pe depend karta hai. Typical, well-distributed cases me O(1) hota hai, lekin agar bahut saari keys same bucket me collide kar jaayein (bad hash function, ya adversarial input specifically crafted karke collisions cause karne ke liye), worst-case lookup O(n) tak degrade ho sakta hai (ek bucket ke andar sab entries linearly check karni padti hain). Isliye formally 'average case O(1), worst case O(n)' bola jaata hai. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
