import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "equals-hashcode-1",
    question: "Agar tum ek class me `Equals()` ko override karte ho lekin `GetHashCode()` ko nahi, to kya risk hai?",
    options: [
      "Code compile nahi hoga",
      "Dictionary/HashSet me ek logically-equal object silently 'not found' aa sakta hai, kyunki bucket lookup hash code pe based hota hai",
      "Koi risk nahi, GetHashCode automatically sync ho jaata hai",
      "Runtime pe turant exception aayegi",
    ],
    correctIndex: 1,
    explanation:
      "Dictionary/HashSet pehle GetHashCode() se bucket locate karte hain, phir Equals() se compare karte hain. Agar GetHashCode override nahi kiya (default object-identity based rehta hai), to do logically-equal objects alag buckets me chale jaate hain aur lookup silently fail ho jaata hai — koi exception nahi aati. Option A galat hai, ye sirf compiler warning deta hai, error nahi. Option C galat hai, sync manually maintain karna padta hai. Option D galat hai, ye bug silent hota hai, loud nahi.",
    difficulty: "medium",
  },
  {
    id: "equals-hashcode-2",
    question: "`Point` class me `Equals()` ko override kiya gaya hai lekin `operator ==` overload nahi kiya gaya. `p1 == p2` (dono same X, Y wale alag instances) kya result dega?",
    options: [
      "true, kyunki Equals override ho chuka hai",
      "false, kyunki == operator alag mechanism hai aur reference equality hi use karta hai jab tak explicitly overload na ho",
      "Compile error aayega",
      "Runtime pe crash hoga",
    ],
    correctIndex: 1,
    explanation:
      "Equals() ko override karna == operator ko automatically change nahi karta — ye do independent mechanisms hain. Classes ke liye == default reference equality hi use karta hai jab tak tum operator == bhi explicitly overload na karo. Option A ek common misconception hai. Option C aur D dono galat hain, ye valid compiling code hai jo bas 'expected' result nahi deta.",
    difficulty: "hard",
  },
  {
    id: "equals-hashcode-3",
    question: "Ek object ko `Dictionary<TKey, TValue>` ki key banaya gaya hai, aur uske hash-contributing fields insert hone ke baad mutate ho gaye. Kya hoga?",
    options: [
      "Kuch nahi hoga, Dictionary automatically re-index kar deta hai",
      "Dictionary crash ho jaayega",
      "Wo entry effectively 'lost' ho jaati hai — same object reference ke saath bhi dobara dhoondi nahi ja sakti, kyunki hash code badal chuka hai",
      "GetHashCode() cached value use karega, koi problem nahi",
    ],
    correctIndex: 2,
    explanation:
      "Dictionary ek object ko uske insertion-time hash code ke basis pe ek specific bucket me store karta hai. Agar baad me hash-contributing fields mutate ho jaayein, naya GetHashCode() alag bucket point karega — lekin object abhi bhi purane bucket me pada hai. Isliye lookup fail ho jaata hai. Isi wajah se hash-key objects ke fields immutable rakhna best practice hai. Option A, B, D sab galat hain — Dictionary automatically re-index nahi karta, crash nahi hota, aur caching is problem ko solve nahi karta.",
    difficulty: "hard",
  },
  {
    id: "equals-hashcode-4",
    question: "`HashCode.Combine(field1, field2)` ka use kis liye kiya jaata hai?",
    options: [
      "Do fields ko concatenate karke ek string banane ke liye",
      "Ek achhi tarah distributed hash code generate karne ke liye jab GetHashCode() override kar rahe ho, bina manual XOR/prime-number logic likhe",
      "Equals() method ko replace karne ke liye",
      "Sirf struct types ke liye kaam karta hai, class ke liye nahi",
    ],
    correctIndex: 1,
    explanation:
      "System.HashCode.Combine(...) (.NET Core 2.1+) multiple field values ko lekar ek well-distributed hash code produce karta hai — manually XOR ya prime-number-multiplication logic likhne ki zaroorat nahi. Ye GetHashCode() override ke andar use hota hai, Equals() ko replace nahi karta. Option A galat hai, ye string concatenation nahi karta. Option D galat hai, ye class aur struct dono ke liye equally kaam karta hai.",
    difficulty: "easy",
  },
];

export default quiz;
