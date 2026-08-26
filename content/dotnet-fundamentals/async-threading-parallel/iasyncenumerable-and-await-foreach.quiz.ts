import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "iasyncenumerable-1",
    question: "`IAsyncEnumerable<T>` `IEnumerable<T>` se fundamentally kaise alag hai?",
    options: [
      "`IAsyncEnumerable<T>` sirf arrays ke saath kaam karta hai",
      "`IAsyncEnumerable<T>` ka `MoveNext` equivalent (`MoveNextAsync`) await-able hai, isliye har item ke beech genuinely async wait ho sakta hai",
      "`IAsyncEnumerable<T>` thread-safe hai, `IEnumerable<T>` nahi",
      "Dono functionally identical hain, sirf naming difference hai",
    ],
    correctIndex: 1,
    explanation:
      "`IAsyncEnumerable<T>`'s enumerator `MoveNextAsync()` deta hai jo ek `ValueTask<bool>` return karta hai — is se har item produce hone se pehle genuinely async wait ho sakta hai (jaise network call). `IEnumerable<T>`'s `MoveNext()` synchronous hai. Option A galat hai — arrays se koi restriction nahi. Option C galat hai — thread-safety ek unrelated concern hai. Option D galat hai — behavior fundamentally different hai, sirf naming nahi.",
    difficulty: "medium",
  },
  {
    id: "iasyncenumerable-2",
    question: "`await foreach` loop ke andar `break` lagane ka kya effect hota hai jab source ek paginated API-backed `IAsyncEnumerable<T>` ho?",
    options: [
      "Poori sequence pehle hi fetch ho chuki hoti hai, break sirf display rok deta hai",
      "Baaki ke pages ab bhi background me fetch honge",
      "Abhi tak fetch nahi kiye gaye pages fetch hi nahi honge — jitna zaroori tha utna hi kaam hua",
      "Compile error aayega",
    ],
    correctIndex: 2,
    explanation:
      "Ye streaming ka bada practical fayda hai — kyunki items lazily, ek-ek karke produce hote hain, `break` lagane par baaki ka data source (jaise agle pages) fetch hi nahi hote. Ye materializing approach (`Task<List<T>>`) se fundamentally alag hai jahan sab kuch pehle hi fetch ho chuka hota. Options A aur B galat hain, aur ye compile-safe operation hai isliye Option D bhi galat hai.",
    difficulty: "medium",
  },
  {
    id: "iasyncenumerable-3",
    question: "Async-iterator method me `CancellationToken` parameter ko `[EnumeratorCancellation]` se mark karna kyun zaroori hai?",
    options: [
      "Warna method compile hi nahi hoga",
      "Taaki consumer ka `.WithCancellation(ct)` diya gaya token, method ke andar wale parameter tak properly wire ho",
      "Ye sirf documentation ke liye hai, functionally kuch nahi karta",
      "Ye deprecated attribute hai, use nahi karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "`[EnumeratorCancellation]` compiler ko batata hai ki jab consumer `await foreach` ke saath `.WithCancellation(token)` use kare, wo token `GetAsyncEnumerator(CancellationToken)` se, is parameter tak flow ho. Bina is attribute ke, method-level token aur externally-provided WithCancellation token properly connect nahi hote. Option A galat hai — method attribute ke bina bhi compile hoga, bas cancellation wiring kaam nahi karegi. Options C aur D dono factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "iasyncenumerable-4",
    question: "Kab `IAsyncEnumerable<T>` use karna genuinely fayda dega, plain `Task<List<T>>` ke muqable?",
    options: [
      "Jab data already ek chhoti, in-memory list me hai",
      "Jab result set bada ho, source genuinely async (paginated API/DB cursor) ho, aur caller early results pe turant kaam shuru kar sakta ho",
      "Sirf tab jab data synchronous ho",
      "Kabhi nahi, dono hamesha equivalent perform karte hain",
    ],
    correctIndex: 1,
    explanation:
      "`IAsyncEnumerable<T>` ka fayda tab hota hai jab poore result set ka wait karna wasteful ho — bada dataset, genuinely incremental async source, aur caller jo early items pe kaam shuru kar sake ya beech me ruk sake. Chhote already-in-memory collections ke liye (Option A) ye extra complexity hai bina fayde ke. Options C aur D dono factually galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
