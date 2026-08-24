import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "concurrent-immutable-1",
    question:
      "`ConcurrentDictionary<TKey,TValue>.GetOrAdd(key, factory)` ka main fayda kya hai plain `Dictionary` + `lock` se check-then-add likhne ke muqable?",
    options: [
      "Ye value ko permanently immutable bana deta hai",
      "Ye ek atomic single-call operation hai, jisse manual check-then-act me hone waala race condition avoid ho jaata hai",
      "Ye automatically disk pe persist ho jaata hai",
      "Ye Dictionary se dheema hota hai isliye avoid karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "`GetOrAdd` ek atomic operation hai — key exist karti hai to value return, nahi to factory call karke insert aur return, sab ek call me. Manually `Dictionary` + `lock` se ye likhna requires check-then-act jo galat likha jaaye to race condition ban sakta hai. Option A galat hai — ye immutability se related nahi hai. Option C galat hai — koi persistence involved nahi. Option D galat hai — ye high-contention scenarios me actually better perform karta hai, categorically slow nahi hai.",
    difficulty: "medium",
  },
  {
    id: "concurrent-immutable-2",
    question:
      "`ImmutableList<int> updated = original.Add(4);` chalane ke baad, `original` list ka kya hota hai?",
    options: [
      "`original` bhi 4 element ka ho jaata hai, kyunki reference share hoti hai",
      "`original` unchanged rehta hai, `Add` ek naya list return karta hai",
      "Compile error — Immutable collections pe `Add` call nahi ho sakta",
      "`original` null ho jaata hai kyunki purana reference invalid ho gaya",
    ],
    correctIndex: 1,
    explanation:
      "Immutable collections kabhi mutate nahi hoti — `Add` original ko change nahi karta, ek NAYA collection return karta hai (structural sharing ke saath, efficient tareeke se). `original` apni purani state me hi rehta hai. Option A galat hai — yehi to immutability ka poora point hai ki dono independent hain. Option C galat hai — `Add` call valid hai, bas mutate nahi karta. Option D galat hai — `original` poori tarah valid reference hai, kuch invalid nahi hua.",
    difficulty: "easy",
  },
  {
    id: "concurrent-immutable-3",
    question:
      "`ImmutableList<T>` aur `ImmutableArray<T>` me performance ka kya fark hai jab bahut saare `Add` operations karne hon ek badi collection pe?",
    options: [
      "Dono exactly same performance dete hain, koi fark nahi",
      "`ImmutableList<T>` structural sharing (AVL tree) ke through O(log n) per Add deta hai, `ImmutableArray<T>` har Add pe poori array copy karta hai (O(n))",
      "`ImmutableArray<T>` hamesha faster hota hai sabhi operations ke liye",
      "`ImmutableList<T>` internally mutable array use karta hai isliye O(1) hai",
    ],
    correctIndex: 1,
    explanation:
      "`ImmutableList<T>` ek balanced tree (AVL) use karta hai jisme structural sharing hoti hai — sirf changed path allocate hota hai, isliye O(log n). `ImmutableArray<T>` ek plain array wrap karta hai — koi tree structure nahi, isliye har `Add` poori array copy karta hai, O(n). Option A galat hai — significant difference hai frequent-modification scenarios me. Option C galat hai — `ImmutableArray` reads ke liye fast hai lekin writes ke liye nahi. Option D galat hai — `ImmutableList` mutable array use nahi karta, tree-based hai.",
    difficulty: "hard",
  },
  {
    id: "concurrent-immutable-4",
    question:
      "`BlockingCollection<T>.Take()` ko call karne par agar collection empty hai to kya hota hai?",
    options: [
      "Immediately `InvalidOperationException` throw hota hai",
      "`default(T)` return ho jaata hai turant",
      "Calling thread block ho jaata hai jab tak koi item add na ho jaaye ya CompleteAdding call na ho",
      "Ye compile error deta hai kyunki Take() empty collection pe call hi nahi ho sakta",
    ],
    correctIndex: 2,
    explanation:
      "`BlockingCollection<T>` ka core feature hi ye hai ki `Take()` block karta hai jab collection empty ho — thread busy-poll nahi karta, wait karta hai jab tak koi item available ho ya `CompleteAdding()` call ho jaaye (jiske baad `InvalidOperationException` aata hai agar aur items nahi aane wale). Option A galat hai — ye immediately throw nahi karta, block karta hai. Option B galat hai — koi default silently return nahi hota. Option D galat hai — ye valid runtime call hai, koi compile error nahi.",
    difficulty: "medium",
  },
];

export default quiz;
