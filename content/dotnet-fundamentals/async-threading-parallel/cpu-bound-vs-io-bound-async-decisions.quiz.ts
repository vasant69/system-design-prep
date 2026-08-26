import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cpu-io-1",
    question: "Ek ASP.NET Core controller action ke andar `await _repository.GetOrderAsync(id)` (database call, I/O-bound) ko `Task.Run(() => _repository.GetOrderAsync(id))` me wrap kar diya gaya. Iska effect kya hoga?",
    options: [
      "Performance improve hogi kyunki kaam parallel ho jaayega",
      "Koi fayda nahi — ulta ek extra thread-pool thread unnecessarily occupy hota hai, kyunki request handler already thread-pool thread pe hai aur I/O-bound call ko koi thread occupy karne ki zaroorat hi nahi thi",
      "Compile error aayega",
      "Database call ab synchronous ho jaayegi",
    ],
    correctIndex: 1,
    explanation:
      "ASP.NET Core request handler already thread-pool thread pe chalta hai. I/O-bound operations (database, HTTP, file) OS-level I/O completion mechanism use karte hain jo wait ke dauraan koi thread occupy nahi karta. `Task.Run` lagana is I/O-bound call ko ek extra thread-pool thread pe schedule karta hai bina kisi genuine fayde ke — net effect thread-pool pe extra, unnecessary pressure hai. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "cpu-io-2",
    question: "`Task.Run` kis type ke workload ke liye sahi tool hai?",
    options: [
      "I/O-bound work jaise HTTP calls",
      "CPU-bound work jaise heavy mathematical computation ya image processing",
      "Koi bhi async operation, workload type se koi farq nahi padta",
      "Sirf database operations ke liye",
    ],
    correctIndex: 1,
    explanation:
      "`Task.Run` genuinely CPU-consuming computation ko ek thread-pool thread pe offload karta hai, taaki calling thread (UI thread ya server thread) free ho jaaye. I/O-bound work (Option A) ke liye ye galat hai kyunki underlying async I/O API already thread-free waiting deta hai — Task.Run yahan sirf ek extra thread waste karta hai. Options C aur D dono factually galat hain — workload type exactly wahi factor hai jo decide karta hai.",
    difficulty: "medium",
  },
  {
    id: "cpu-io-3",
    question: "Ye statement kyun galat hai: 'await hamesha kaam ko ek background thread pe bhej deta hai'?",
    options: [
      "Kyunki await sirf synchronous code me kaam karta hai",
      "Kyunki I/O-bound await ke dauraan koi thread bilkul occupy nahi hota (I/O completion ports) — 'background thread pe gaya' sirf Task.Run-wrapped CPU-bound kaam ke liye sahi hai",
      "Kyunki await hamesha main thread pe hi chalta hai, kabhi background thread pe nahi",
      "Kyunki .NET me background threads exist hi nahi karte",
    ],
    correctIndex: 1,
    explanation:
      "Ye ek common misconception hai jo interview me specifically test hoti hai. I/O-bound operations (jaise `HttpClient.GetStringAsync`) OS-level I/O completion ports use karte hain — wait ke dauraan na calling thread, na koi thread-pool thread busy hota hai. 'Background thread pe kaam chala gaya' wala mental model sirf `Task.Run`-wrapped CPU-bound work ke liye accurate hai, jahan genuinely ek thread-pool thread compute karta hai. Options A, C, D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "cpu-io-4",
    question: "Ek method image ko resize karta hai (pure CPU computation, koi network/disk call nahi) aur ise UI thread se directly call kiya jaata hai bina `Task.Run` ke. Kya problem hoga?",
    options: [
      "Koi problem nahi, UI thread automatically doosre kaam kar lega",
      "UI thread compute complete hone tak block/freeze ho jaayega, kyunki koi awaitable I/O nahi hai jo thread ko free kare",
      "App turant crash ho jaayega",
      "Resize operation automatically background thread pe chala jaayega bina kisi extra code ke",
    ],
    correctIndex: 1,
    explanation:
      "Agar resize method synchronous hai (CPU-bound, koi `await`-able I/O andar nahi), UI thread se seedha call karne par UI thread us poore computation ke dauraan busy/blocked rahega — UI freeze ho jaayegi jab tak computation complete na ho. Isse fix karne ke liye `Task.Run` chahiye taaki computation thread-pool thread pe chale aur UI thread free rahe. Options A, C, D sab galat hain — .NET aisa koi automatic offloading nahi karta bina explicit `Task.Run` ke.",
    difficulty: "medium",
  },
];

export default quiz;
