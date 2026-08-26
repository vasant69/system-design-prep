import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "race-1",
    question: "1000 threads ek shared `int _count` field ko bina lock ke `_count++` karte hain, har ek exactly ek baar. Final `_count` kya hoga?",
    options: [
      "Hamesha exactly 1000",
      "Hamesha 0",
      "Unpredictable — 1000 se kam ho sakta hai, run-to-run vary kar sakta hai",
      "Compile error aayega",
    ],
    correctIndex: 2,
    explanation:
      "`_count++` atomic nahi hai — read, increment, write teen alag steps hain. Multiple threads in steps ko interleave kar sakte hain, jisse lost updates hote hain. Result non-deterministic hota hai, thread-scheduling timing pe depend karta hai — 1000 se kam aa sakta hai, aur har run me different bhi ho sakta hai. Option A galat hai — ye sirf tab guaranteed hota agar synchronization ho. Option B aur D dono factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "race-2",
    question: "`lock (obj) { _count++; }` internally kya karta hai?",
    options: [
      "`_count` ko `volatile` bana deta hai",
      "`Monitor.Enter`/`Monitor.Exit` ka syntactic sugar hai, try/finally ke saath safe release ensure karta hai",
      "Naya thread create karta hai isolated execution ke liye",
      "`_count` ko automatically `Interlocked` operation me convert kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`lock` statement compiler-level syntactic sugar hai `Monitor.Enter(obj)`/`Monitor.Exit(obj)` ke liye, ek implicit `try/finally` ke saath taaki exception aane par bhi lock properly release ho. Ek time pe sirf ek thread block ke andar ja sakta hai. Options A, C, D sab galat mechanisms describe karte hain jo `lock` actually use nahi karta.",
    difficulty: "medium",
  },
  {
    id: "race-3",
    question: "Race condition bugs ko debug karna especially mushkil kyun hota hai?",
    options: [
      "Kyunki wo hamesha compile error dete hain",
      "Kyunki wo non-deterministic hote hain — thread-scheduling timing pe depend karte hain, isliye consistently reproduce nahi hote",
      "Kyunki .NET race conditions ko automatically silently fix kar deta hai",
      "Kyunki wo sirf single-threaded apps me hote hain",
    ],
    correctIndex: 1,
    explanation:
      "Race conditions timing-dependent hote hain — kaunsa thread pehle scheduled hoga, kab context-switch hoga, ye sab OS scheduler ke hath me hai, jo run-to-run vary karta hai. Isliye same code kabhi bug show karta hai, kabhi nahi — reliably reproduce karna mushkil hota hai, jo debugging ko significantly harder bana deta hai. Options A, C, D sab factually galat hain.",
    difficulty: "easy",
  },
  {
    id: "race-4",
    question: "Immutable objects race conditions se 'by construction' safe kyun mane jaate hain?",
    options: [
      "Kyunki immutable objects hamesha `lock` ke andar wrapped hote hain automatically",
      "Kyunki agar koi thread state modify hi nahi kar sakta banne ke baad, koi conflicting write exist hi nahi kar sakti",
      "Kyunki immutable objects hamesha ek hi thread pe rehte hain",
      "Kyunki .NET runtime immutable objects ko special hardware locks deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Race condition tabhi hoti hai jab shared state MUTABLE ho — multiple threads use read-and-write kar sakein. Agar object banne ke baad kabhi modify hi nahi ho sakta, to koi thread kisi doosre thread ka write overwrite kar hi nahi sakta, chahe kitne bhi threads simultaneously usse read kar rahe hon. Ye synchronization ki zaroorat hi khatam kar deta hai, kisi lock ki zaroorat nahi. Options A, C, D sab galat mechanisms describe karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
