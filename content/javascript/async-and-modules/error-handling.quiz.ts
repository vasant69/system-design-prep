import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "error-handling-1",
    question:
      "`try { setTimeout(() => { throw new Error('boom'); }, 0); } catch (e) { console.log('caught'); }` — kya hota hai?",
    options: [
      "'caught' print hota hai",
      "Kuch print nahi hota, error silently ignore ho jaata hai",
      "'caught' print nahi hota; error uncaught exception ban jaata hai kyunki callback baad ke tick pe chalta hai",
      "SyntaxError, kyunki setTimeout ko try mein nahi likh sakte",
    ],
    correctIndex: 2,
    explanation:
      "`setTimeout` ka callback ek naye event-loop tick pe chalta hai, jab tak surrounding `try` block ka execution poora ho chuka hota hai. Isliye `catch` us throw ko nahi pakadta aur wo uncaught exception ban jaata hai. Option A galtfehmi hai ki try/catch time se independent hai. Option B galat — error ignore nahi hota, wo uncaught hota hai (console/process report karta hai). Option D galat — syntax bilkul valid hai.",
    difficulty: "medium",
  },
  {
    id: "error-handling-2",
    question: "`throw 'User not found'` vs `throw new Error('User not found')` — practical farak kya hai?",
    options: [
      "Koi farak nahi, dono same tarah catch hote hain",
      "String throw karne se catch block chalti hi nahi",
      "String throw karne se err.message aur err.stack nahi milte — debugging mushkil; Error object dono deta hai",
      "Error object throw karna slower hai isliye string better hai",
    ],
    correctIndex: 2,
    explanation:
      "`throw` kisi bhi value ko phenk sakta hai, par ek plain string mein na `.message` property hoti hai na `.stack` trace. `catch (err)` mein `err` bas ek string hota hai — `err.message` `undefined`, aur koi stack trace nahi jo bataye kahaan tuta. `new Error(...)` banate waqt engine stack snapshot leta hai. Option B galat — string bhi catch hoti hai. Option D galat — Error creation ka cost negligible hai aur trace ki value usse kahin zyada.",
    difficulty: "easy",
  },
  {
    id: "error-handling-3",
    question:
      "Ek custom error class banate waqt `this.name = 'ValidationError'` set karna kyun zaroori hai?",
    options: [
      "Warna class instantiate hi nahi hoti",
      "Warna err.name 'Error' rehta hai — logs aur error-type checks mein confuse karta hai; instanceof phir bhi chalega par name galat dikhega",
      "Warna super(message) call nahi hota",
      "Ye sirf TypeScript ke liye chahiye, plain JS mein optional aur bekar hai",
    ],
    correctIndex: 1,
    explanation:
      "`Error` constructor `.name` ko 'Error' set karta hai. Subclass banane par bhi wo inherit hoke 'Error' hi rehta hai jab tak tum explicitly `this.name = 'ValidationError'` na karo. Iske bina stack traces aur logs 'Error: Invalid email' dikhaate hain 'ValidationError: ...' ke bajaye, jo debugging aur name-based checks ko confuse karta hai. Option A/C galat — name set kiye bina bhi class banti hai aur `super()` alag baat hai. Option D galat — ye runtime behaviour hai, plain JS mein bhi matter karta hai.",
    difficulty: "medium",
  },
  {
    id: "error-handling-4",
    question:
      "`try { fetchData(); } catch (err) { handle(err); }` — `fetchData` ek async function hai jo reject ho sakta hai. Kya `catch` use pakadega?",
    options: [
      "Haan, async functions ki rejection bhi try/catch pakadta hai",
      "Nahi — bina `await` ke rejection try block ke bahar chali jaati hai aur unhandled rejection ban jaati hai",
      "Haan, par sirf agar fetchData arrow function ho",
      "Nahi, kyunki catch block ke pehle finally likhna zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "`try/catch` ek async operation ki rejection tabhi pakadta hai jab tum us promise ko `await` karo try block ke andar. `fetchData()` ko bina `await` call karne se function turant ek pending promise return karke aage badh jaata hai; jab wo baad mein reject hota hai tab tak `try` block khatam ho chuka hota hai, aur wo 'unhandled promise rejection' ban jaata hai. Fix: `await fetchData()` ya `fetchData().catch(handle)`. Option A/C galat. Option D galat — finally optional hai.",
    difficulty: "medium",
  },
];

export default quiz;
