import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "memory-leaks-1",
    question: "Ek `Publisher` (application-lifetime singleton) ke event ko ek short-lived `Subscriber` subscribe karta hai (`pub.Event += sub.Handler`) lekin kabhi unsubscribe nahi karta. Kya hoga?",
    options: [
      "Kuch nahi, Subscriber normally garbage collect ho jaayega jab uska use khatam ho",
      "Subscriber forever rooted rahega Publisher ke through, GC use kabhi collect nahi karega — 'lapsed listener' leak",
      "Publisher collect ho jaayega instead",
      "C# automatically weak reference use karta hai events ke liye, isliye koi leak nahi hoga"
    ],
    correctIndex: 1,
    explanation:
      "Event subscription se Publisher ke andar Subscriber ki taraf ek reference banta hai (delegate invocation list ke through) — direction counter-intuitive hai. Agar Publisher ka lifetime Subscriber se lamba hai aur unsubscribe kabhi nahi hota, Subscriber GC ke liye hamesha reachable rahega chahe application use logically na kar raha ho. Ye classic 'lapsed listener problem' hai. Option D galat hai — C# events by default strong references use karte hain, weak nahi.",
    difficulty: "hard",
  },
  {
    id: "memory-leaks-2",
    question: "Ek closure ye code chalata hai: `return () => Console.WriteLine(_reportName);` jahan `_reportName` ek instance field hai. Compiler kya capture karta hai?",
    options: [
      "Sirf `_reportName` string ki value",
      "Poora `this` (containing object) — kyunki instance field access karne ke liye object reference chahiye",
      "Kuch bhi capture nahi hota, `_reportName` direct copy ho jaata hai",
      "Sirf `_reportName` field ka address, `this` nahi"
    ],
    correctIndex: 1,
    explanation:
      "Jab lambda kisi instance field/method ko access karta hai, C# compiler poora `this` reference capture karta hai (kyunki field access implicitly `this._reportName` hai). Isliye agar containing object bade resources (jaise ek bada buffer) bhi hold karta hai, wo bhi indirectly rooted reh jaate hain jab tak closure reachable hai — chahe closure ko sirf ek chhoti field chahiye ho.",
    difficulty: "hard",
  },
  {
    id: "memory-leaks-3",
    question: "GC ka exact guarantee kya hai jo memory leaks possible banata hai despite garbage collection?",
    options: [
      "GC sirf unreachable objects reclaim karta hai — ye kabhi nahi poochta ki koi reachable object logically zaroori hai ya nahi",
      "GC har object ko 5 minute ke baad automatically collect kar deta hai chahe reachable ho ya na ho",
      "GC sirf explicitly marked objects collect karta hai",
      "GC memory leaks completely prevent karta hai, .NET me leak possible hi nahi hai"
    ],
    correctIndex: 0,
    explanation:
      "GC ka guarantee narrow hai: truly unreachable objects eventually reclaim honge. Ye kabhi evaluate nahi karta ki koi reachable object application ko genuinely chahiye ya nahi. Agar koi reference chain (static field, unsubscribed event, over-capturing closure) object ko artificially reachable banaye rakhe, GC use kabhi collect nahi karega — yahi managed memory leak ka mechanism hai.",
    difficulty: "medium",
  },
  {
    id: "memory-leaks-4",
    question: "Production me memory leak diagnose karte waqt, kaunsa signal sabse reliable indicator hai (sirf 'total memory usage high hai' dekhne se better)?",
    options: [
      "CPU usage",
      "Ek specific type ki instance count jo time ke saath monotonically badhti rahe, kabhi plateau na ho steady load ke under",
      "Disk I/O rate",
      "Number of HTTP requests handled"
    ],
    correctIndex: 1,
    explanation:
      "Total memory usage naturally fluctuate karta hai (GC apni marzi se collect karta hai), isliye akela reliable signal nahi hai. Lekin agar ek specific type (jaise `Subscriber` ya `CustomerData`) ki instance count time ke saath consistently badhti rahe bina plateau kiye steady load ke under, ye genuinely ek leak (objects jo collect hone chahiye the lekin ho nahi rahe) ka strong signature hai — jo memory profilers (dotnet-gcdump, Visual Studio Diagnostic Tools) specifically track karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
