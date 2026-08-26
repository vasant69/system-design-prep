import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "structural-patterns-1",
    question: "Ek team ek third-party payment SDK integrate kar rahi hai jiska method signature unke apne `IPaymentGateway` interface se match nahi karta, aur SDK source modify nahi kiya ja sakta. Kaunsa pattern fit hai?",
    options: [
      "Facade — SDK ke saamne ek simple entry point bana do",
      "Adapter — SDK ko wrap karke `IPaymentGateway` shape me convert karo",
      "Proxy — SDK calls ko intercept karo access control ke liye",
      "Composite — SDK aur apne code ko ek tree me combine karo",
    ],
    correctIndex: 1,
    explanation:
      "Ye exactly Adapter ka classic use case hai — ek incompatible existing interface ko client ke expected interface me translate karna, bina original SDK ko modify kiye. Facade (option A) tab use hota jab multiple subsystems ko ek call ke peeche coordinate karna ho, sirf ek interface translate nahi karna. Proxy (option C) same interface rakhta hai aur access control/caching add karta hai, interface translate nahi karta. Composite (option D) tree-structured data ke liye hai, is scenario me applicable nahi.",
    difficulty: "medium",
  },
  {
    id: "structural-patterns-2",
    question: "Proxy pattern aur Decorator pattern implementation me near-identical dikh sakte hain. Inme primary differentiator kya hai?",
    options: [
      "Proxy sirf static classes ke saath kaam karta hai, Decorator instance ke saath",
      "Intent — Proxy access control/lazy-loading provide karta hai, Decorator naya behavior add karta hai",
      "Proxy hamesha async hota hai, Decorator hamesha sync",
      "Decorator sirf UI code me use hota hai, Proxy sirf backend me",
    ],
    correctIndex: 1,
    explanation:
      "Dono patterns same interface implement karte hain aur ek inner object ko wrap karte hain, isliye code-shape se near-identical dikhte hain. Real differentiator intent hai: Proxy access ko control karta hai (caching, lazy-init, authorization gate), Decorator existing behavior ke upar naya behavior add karta hai (jaise logging) bina interface badle. Options A, C, aur D factually galat hain — koi bhi sync/async ya static/instance ya UI/backend restriction nahi hai.",
    difficulty: "hard",
  },
  {
    id: "structural-patterns-3",
    question: "Ek `OrderCheckoutFacade` class Inventory, Payment, Shipping, aur Notification services ko coordinate karti hai ek single `PlaceOrderAsync` method ke through. Facade pattern ka primary benefit yahan kya hai?",
    options: [
      "Ye performance improve karta hai kyunki fewer method calls hote hain",
      "Ye client-facing complexity kam karta hai — ek simple call, poora multi-subsystem orchestration hidden",
      "Ye automatically har subsystem ko cache kar deta hai",
      "Ye subsystems ko ek doosre se completely decouple kar deta hai runtime pe",
    ],
    correctIndex: 1,
    explanation:
      "Facade ka core purpose complexity hiding hai — client (jaise controller) ko sirf ek simple entry-point call karni padti hai, internally multiple subsystems ka coordination Facade ke andar chhupa rehta hai. Ye performance ka pattern nahi hai (option A galat), na hi caching automatically provide karta hai (option C galat — wo Proxy ka kaam hai). Subsystems abhi bhi Facade ke through coupled hain, complete decoupling nahi hoti (option D galat).",
    difficulty: "easy",
  },
  {
    id: "structural-patterns-4",
    question: "`MenuCategory` class khud `IMenuComponent` implement karti hai aur andar `List<IMenuComponent>` hold karti hai jisme aur `MenuItem` ya nested `MenuCategory` objects ho sakte hain. Ye kaunsa pattern hai, aur iska core idea kya hai?",
    options: [
      "Composite — leaf aur branch dono ko same interface ke through uniformly treat karna, recursion se poore tree me operations propagate hote hain",
      "Facade — ek complex subsystem ko simple interface ke peeche hide karna",
      "Adapter — ek incompatible interface ko convert karna",
      "Proxy — access ko control karna ek stand-in object ke through",
    ],
    correctIndex: 0,
    explanation:
      "Ye Composite pattern hai — `MenuCategory` khud bhi `IMenuComponent` hai aur andar aur `IMenuComponent`s hold karta hai, isliye `GetPrice()` jaisi call recursively poore tree (individual items aur nested categories dono) me propagate ho jaati hai bina client ko farak pade ki wo leaf pe hai ya branch pe. Facade (B), Adapter (C), aur Proxy (D) sab different problems solve karte hain — koi bhi tree-uniform-treatment ka core idea nahi hai.",
    difficulty: "medium",
  },
];

export default quiz;
