import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "aot-and-readytorun-1",
    question: "Native AOT (.NET 7+) aur Normal JIT ke beech sabse fundamental difference kya hai?",
    options: [
      "Native AOT sirf Windows pe chalta hai, JIT sab OS pe",
      "Native AOT native code ko publish-time pe hi generate karta hai (no JIT/CLR dependency at runtime), JIT runtime pe method-by-method compile karta hai",
      "Native AOT sirf debug builds ke liye hai",
      "Dono exactly same kaam karte hain, sirf naam alag hai",
    ],
    correctIndex: 1,
    explanation:
      "Native AOT poori app ko native executable me compile kar deta hai publish-time pe hi — koi JIT step runtime pe nahi hota, CLR dependency bhi nahi. Normal JIT runtime pe, per-method, on first call compile karta hai. Option A galat hai — Native AOT cross-platform hai, bas platform-specific build banta hai. Option C irrelevant hai. Option D galat hai — inka mechanism aur trade-offs fundamentally alag hain.",
    difficulty: "medium",
  },
  {
    id: "aot-and-readytorun-2",
    question: "ReadyToRun (R2R) assembly ke andar kya-kya contain hota hai?",
    options: [
      "Sirf pre-compiled native code, IL bilkul nahi",
      "Pre-compiled native code AND full IL dono — agar native code use nahi ho sakta, JIT fallback ke liye IL available rehta hai",
      "Sirf IL, koi native code nahi",
      "Sirf configuration metadata, na IL na native code",
    ],
    correctIndex: 1,
    explanation:
      "R2R ek hybrid approach hai — assembly me dono cheezein hoti hain: pre-compiled native code (fast-path ke liye) aur full IL (fallback ke liye, agar native version kisi wajah se use na ho sake). Ye Normal JIT ki flexibility ko poora nahi chhodta, sirf startup ko fast karta hai jahan possible ho.",
    difficulty: "medium",
  },
  {
    id: "aot-and-readytorun-3",
    question: "Native AOT me migrate karte waqt sabse common compatibility issue kya hota hai?",
    options: [
      "Async/await support nahi karta",
      "Heavy runtime reflection/dynamic code loading trimming ke saath conflict karta hai",
      "LINQ queries kaam nahi karti",
      "String operations slow ho jaate hain",
    ],
    correctIndex: 1,
    explanation:
      "Native AOT publish-time trimming karta hai (unused code remove karta hai) — heavy runtime reflection ya dynamic `Assembly.Load` jaisi cheezein is trimming ke saath conflict kar sakti hain, kyunki compiler ko pata nahi hota reflection se kaunse types/members runtime pe access honge. Source generators (jaise `System.Text.Json`'s compile-time serialization) is problem ka modern solution hain. Options A, C, D factually galat hain — ye features Native AOT ke saath kaam karte hain.",
    difficulty: "hard",
  },
  {
    id: "aot-and-readytorun-4",
    question: "Ek team ko AWS Lambda pe deploy hone waale notification service ka cold-start latency kam karna hai, lekin unka code kuch reflection-based JSON serialization use karta hai. Best approach kya hoga?",
    options: [
      "Kuch mat karo, cold-start latency change nahi ho sakti",
      "Native AOT me migrate karo, aur reflection-based serialization ko source-generated (`System.Text.Json` source generators) me switch karo taaki trimming ke saath compatible ho",
      "Sirf Normal JIT use karte raho, AOT kabhi kaam nahi karega serverless ke liye",
      "ReadyToRun aur Native AOT dono ek saath enable karo",
    ],
    correctIndex: 1,
    explanation:
      "Ye exact real-world pattern hai — Native AOT cold-start ko drastically improve karta hai, lekin reflection-heavy code (jaise default `System.Text.Json` reflection-based serialization) ko trimming-compatible source-generated approach me switch karna padta hai. Option A galat hai — AOT genuinely fayda deta hai is scenario me. Option C galat hai — AOT serverless ke liye specifically achha fit hai jab compatibility handle ho. Option D invalid combination hai — ye do alag, mutually-exclusive-in-practice approaches hain.",
    difficulty: "hard",
  },
];

export default quiz;
