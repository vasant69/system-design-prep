import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "promises-in-depth-1",
    question:
      "`getUser().then(user => { getOrders(user.id); }).then(orders => console.log(orders))` — doosre `.then` mein `orders` kya hoga?",
    options: [
      "getOrders ka resolved array",
      "undefined — kyunki pehle `.then` handler ne `getOrders` ka Promise `return` nahi kiya, isliye chain ne uska wait nahi kiya",
      "Ek pending Promise object",
      "Ek error throw hoga",
    ],
    correctIndex: 1,
    explanation:
      "Handler ne `getOrders(user.id)` call kiya par `return` nahi kiya, isliye handler `undefined` return karta hai — wahi agle `.then` ko milta hai. Saath hi `getOrders` ki koi bhi rejection unhandled reh jati hai. Fix: `return getOrders(user.id)`. Option A tab sahi hota jab `return` hota. Option C galat — chain resolved value forward karti hai, pending Promise nahi. Option D galat — koi throw nahi hota, bas silent undefined.",
    difficulty: "medium",
  },
  {
    id: "promises-in-depth-2",
    question:
      "Ek Promise chain: `getA().then(step1).then(step2).catch(handleErr)`. Agar `step1` ke andar `throw new Error('bad')` ho toh kya chalega?",
    options: [
      "step2 pehle chalega, phir handleErr",
      "step2 skip ho jayega aur handleErr('bad') chalega — throw current .then ke returned Promise ko reject karta hai, jo aage propagate hoti hai",
      "Poora process crash ho jayega kyunki throw async context mein hai",
      "handleErr ko error nahi milega kyunki throw sirf sync errors ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "`.then` handler ke andar `throw` us `.then` ke returned Promise ko rejected bana deta hai. Rejection beech ke `.then` (step2) ko skip karke agle `.catch` pe jati hai. Isiliye Promise error handling callbacks se behtar hai — ek jagah catch. Option A galat — step2 skip hota hai. Option C galat — `.catch` hai isliye crash nahi. Option D galat — Promise machinery `throw` ko rejection mein convert karti hai, ye exactly kaam karta hai.",
    difficulty: "medium",
  },
  {
    id: "promises-in-depth-3",
    question:
      "`.finally(fn)` ke baare mein kaunsa statement sahi hai?",
    options: [
      "fn ko chain ki resolved value argument milti hai aur wo use badal sakta hai",
      "fn success aur failure dono mein chalta hai, koi argument nahi milta, aur normally chain ki final value/rejection ko pass-through karta hai (badalta nahi)",
      "fn sirf tab chalta hai jab chain successfully fulfil ho",
      "fn `.catch` se pehle chalta hai hamesha",
    ],
    correctIndex: 1,
    explanation:
      "`.finally` outcome-independent cleanup ke liye hai — DB connection release, spinner hide. Use na value milti hai na reason, aur wo chain ke settlement ko forward kar deta hai (jab tak `.finally` khud throw na kare). Option A galat — koi argument nahi, aur value badalta nahi. Option C galat — failure mein bhi chalta hai. Option D galat — order chain position pe depend karta hai, aur `.finally` typically end mein hota hai.",
    difficulty: "easy",
  },
  {
    id: "promises-in-depth-4",
    question:
      "Ek hi async operation ke liye caller ko callback bhi accept karana aur Promise bhi return karna — ye kyun galat pattern hai?",
    options: [
      "Kuch galat nahi, ye 'flexible API' hai",
      "Error double-report ho sakti hai (callback ko bhi, rejection ko bhi), consumers confuse hote hain ki kaunsa use karein, aur dono paths ko sync mein rakhna mushkil hai — ek API do: ya Promise ya callback",
      "Promise return karne se callback kabhi call nahi hoga",
      "JavaScript ek function ko dono nahi karne deta, syntax error milega",
    ],
    correctIndex: 1,
    explanation:
      "Dual API mein: error ya toh `cb(err)` se aayegi ya rejection se ya dono se (double handling); consumer ko pata nahi kaunsa authoritative hai; aur maintainers ko dono code paths consistent rakhne padte hain. Modern convention: ek clean API — Promise return karo, aur legacy callers ke liye `util.promisify.custom` ya alag callback shim do. Option A galat — ye maintenance aur correctness hazard hai. Option C aur D galat — technically dono chal sakte hain, yahi to problem hai.",
    difficulty: "medium",
  },
];

export default quiz;
