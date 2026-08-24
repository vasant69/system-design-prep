import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "delegates-1",
    question: "`Func<int, string, bool>` ka signature kya represent karta hai?",
    options: [
      "Ek method jo int aur string leta hai, kuch return nahi karta",
      "Ek method jo int aur string parameters leta hai aur bool return karta hai — last type parameter hamesha return type hota hai",
      "Ek method jo teen int parameters leta hai",
      "Ek method jo bool parameter leta hai aur int, string dono return karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Func<> me last type parameter hamesha return type hota hai, baaki sab input parameters. Func<int, string, bool> matlab: ek int aur ek string parameter leta hai, bool return karta hai. Option A galat hai kyunki Func hamesha value return karta hai (void ke liye Action use hota hai). Option C aur D dono type-parameter order ko galat samajhte hain.",
    difficulty: "easy",
  },
  {
    id: "delegates-2",
    question: "Ek multicast delegate (`Func<int>` type) me 3 methods attach hain jo respectively 1, 2, 3 return karte hain. `result = myFunc();` call karne pe kya milega?",
    options: [
      "Ek array [1, 2, 3]",
      "1 (pehla method ka result)",
      "3 (sirf last invoked method ka result — baaki discard ho jaate hain)",
      "6 (sabka sum)",
    ],
    correctIndex: 2,
    explanation:
      "Multicast delegate ke saath, agar delegate return value deta hai, sirf LAST attached method ka return value caller tak pahunchta hai — pehle wale methods bhi execute hote hain (side effects ke liye), lekin unke return values silently discard ho jaate hain. Ye ek classic gotcha hai. Option A, B, D sab is behavior ko galat samajhte hain — koi automatic aggregation ya array collection nahi hoti.",
    difficulty: "hard",
  },
  {
    id: "delegates-3",
    question: "`event Action<Order> OrderPlaced;` declare karne ke baad, class ke BAHAR se kaunsa operation allowed hai?",
    options: [
      "orderService.OrderPlaced(order); — direct invoke",
      "orderService.OrderPlaced = null; — sab subscribers clear karna",
      "orderService.OrderPlaced += handler; — subscribe karna",
      "Upar diye teeno operations allowed hain",
    ],
    correctIndex: 2,
    explanation:
      "event keyword sirf +=/-= (subscribe/unsubscribe) ko bahar se allow karta hai. Direct invocation (option A) CS0070 compile error deta hai, aur direct assignment jo sab subscribers clear kar de (option B) CS0079 compile error deta hai — dono sirf declaring class ke andar se allowed hain. Ye event ka encapsulation payoff hai. Option D isliye galat hai kyunki sirf ek operation (subscribe) allowed hai.",
    difficulty: "medium",
  },
  {
    id: "delegates-4",
    question: "`SomethingHappened?.Invoke(args)` pattern ke baare me kaunsa statement sahi hai?",
    options: [
      "Ye poori tarah thread-safe hai kisi bhi scenario me",
      "Single-threaded context me safe hai, lekin multi-threaded scenario me ek race condition possible hai (null-check ke baad, invoke se pehle last subscriber unsubscribe ho sakta hai)",
      "Ye kabhi kaam nahi karta agar koi subscriber na ho",
      "Ye sirf Action delegates ke saath kaam karta hai, Func ke saath nahi",
    ],
    correctIndex: 1,
    explanation:
      "Null-conditional operator (?.) ek atomic check-and-invoke guarantee nahi deta multi-threaded scenarios me — null-check pass hone ke baad, actual Invoke call se pehle, agar doosra thread last subscriber unsubscribe kar de, race condition ban sakta hai. Fully safe pattern: pehle local variable me copy karo (var handler = SomethingHappened;), phir handler?.Invoke() karo. Option A is nuance ko miss karta hai. Option C galat hai — ?. operator exactly isliye hai ki null hone par safely skip ho jaaye, crash na ho. Option D irrelevant hai.",
    difficulty: "hard",
  },
];

export default quiz;
