import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "async-ctor-1",
    question: "C# me async constructor kyun allow nahi hai?",
    options: [
      "Compiler team ne bas isko implement nahi kiya, koi technical reason nahi hai",
      "Constructor ka contract hai turant fully-constructed object return karna, jabki async ka contract hai Task return karna — dono incompatible hain",
      "Async constructors performance ke liye bahut slow hote hain isliye ban hai",
      "Sirf static classes me constructors async ho sakte hain",
    ],
    correctIndex: 1,
    explanation:
      "Constructor implicitly instance type return karta hai, koi return type declare nahi karta — object turant fully-ready hona chahiye. async method fundamentally Task/Task<T> return karta hai, jo future completion represent karta hai. Ye do contracts fundamentally conflict karte hain, isliye language level pe hi disallow hai. Option A galat hai — ye design decision hai, oversight nahi. Option C aur D dono factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "async-ctor-2",
    question: "Genuinely async initialization chahiye ho to standard .NET workaround pattern kya hai?",
    options: [
      "Constructor ke andar .Result call karke async code ko force-synchronous banao",
      "Ek private/minimal constructor rakho aur public static async Task<T> factory method (jaise CreateAsync) expose karo",
      "Constructor ko async keyword ke saath mark karo aur compiler warning ignore karo",
      "Async initialization possible hi nahi hai, sab kuch constructor se pehle karna padta hai",
    ],
    correctIndex: 1,
    explanation:
      "Standard pattern hai private constructor + static async factory method jo actual async work karke fully-ready object return karta hai. Option A technically kaam karega but deadlock/thread-pool-starvation risk create karta hai, best practice nahi hai. Option C compile hi nahi hoga. Option D galat hai, factory pattern exactly isi problem ko solve karta hai.",
    difficulty: "medium",
  },
  {
    id: "async-ctor-3",
    question: "IAsyncDisposable.DisposeAsync() kya return karta hai?",
    options: [
      "void",
      "Task",
      "ValueTask",
      "async void",
    ],
    correctIndex: 2,
    explanation:
      "DisposeAsync() ValueTask return karta hai, Task nahi — ye kam allocation overhead deta hai un cases me jahan result synchronously bhi ready ho sakta hai. Option A galat hai kyunki tab await nahi kar paate. Option B technically bhi kaam kar sakta tha lekin actual signature ValueTask hai. Option D syntax invalid hai methods ke liye is context me.",
    difficulty: "hard",
  },
  {
    id: "async-ctor-4",
    question: "Dispose() ke andar ek async cleanup operation ko .Wait() ya .Result se force-synchronous banane ka real risk kya hai?",
    options: [
      "Koi risk nahi hai, ye ek normal aur safe pattern hai",
      "Compile error aayega",
      "Deadlock ya thread-pool starvation ka real risk hai, especially high-throughput paths me",
      "Sirf code readability kam hoti hai, functionally koi farak nahi",
    ],
    correctIndex: 2,
    explanation:
      "Blocking calls (.Wait()/.Result) async paths ke andar thread-pool threads ko block kar dete hain jabki wo naya async work le sakte the, jisse under load starvation ho sakta hai, aur specific contexts me deadlock bhi. Isi wajah se IAsyncDisposable/await using ka pattern exist karta hai — genuinely non-blocking cleanup ke liye. Options A aur D dono is real risk ko underplay karte hain, B galat hai kyunki ye valid, compiling code hai.",
    difficulty: "hard",
  },
];

export default quiz;
