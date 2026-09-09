import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cbh-1",
    question: "Callback kya hai, aur 'callback hell' kaise ban jaata hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Callback ek function hai jo argument ki tarah pass hota hai taaki baad mein (aksar async kaam khatam hone pe) call ho. Callback hell tab banta hai jab dependent async steps ek dusre ke callback mein nest hote jaate hain — deep indentation, repeated error handling, padhna mushkil.",
    detailedAnswer:
      "Example: `getUser(id, (err, user) => { getPosts(user.id, (err, posts) => { getComments(posts[0].id, (err, c) => { ... }) }) })`. Har step ko pichle ka data chahiye isliye nesting badhti hai. Problems: (1) rightward drift — code daayein bhagta hai, (2) har level pe `if (err)` duplicate, (3) control flow follow karna mushkil, (4) `try/catch` async boundary ke aar-paar kaam nahi karta. Fixes: named functions se flatten, ya promises (`.then` chain, ek `.catch`), ya async/await (sync-jaisa top-to-bottom).",
    followUp:
      "Promise chain callback version se behtar kyun — sirf indentation ka farak hai kya?",
    redFlag:
      "'Callback hell ka matlab performance kharab' — ye readability aur maintainability ka issue hai, speed ka nahi.",
  },
  {
    id: "cbh-2",
    question:
      "Async callback ke andar `throw` karoge to bahar ka `try/catch` use pakdega? Kyun ya kyun nahi?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Callback ek alag event-loop tick pe chalta hai jab surrounding `try` block kab ka poora ho chuka. Us waqt call stack pe koi `catch` nahi, to error `uncaughtException` ya `unhandledRejection` ban jaata hai.",
    detailedAnswer:
      "`try { setTimeout(() => { throw new Error('x'); }, 0); } catch (e) {}` — `catch` kabhi nahi chalega. `try/catch` sirf synchronous call stack ke frames pakadta hai; jab callback chalta hai to stack `try` se unrelated hota hai. Isliye Node ne error-first convention banayi — error ko `throw` mat karo, `callback(err)` se pass karo. Promises mein yahi kaam `.catch()` ya `try/catch` around `await` karta hai, kyunki `await` error ko usi async function ke frame mein wapas throw karta hai.",
    followUp:
      "`async/await` ke saath `try/catch` async error kaise pakad leta hai jab callback pattern nahi pakad paata?",
    redFlag:
      "'`try/catch` sab pakad leta hai' — synchronous frames aur `await` kiye gaye promises pakadta hai, bare async callbacks nahi.",
  },
  {
    id: "cbh-3",
    question:
      "`for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 100); }` — ye kya print karega, aur classic pre-`let` fix kya tha?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`3 3 3`. Teeno callbacks same `var i` pe closure banate hain; jab wo 100ms baad chalte hain, loop khatam ho chuka aur `i === 3`. Pre-`let` fix: IIFE se per-iteration scope, ya `setTimeout(fn, 100, i)` se value pass karna.",
    detailedAnswer:
      "`var` function-scoped hai, to ek hi `i` binding. Async callbacks event loop ke baad wale tick pe chalte hain — tab `i` 3. Fixes: (1) IIFE — `for (var i = 0; i < 3; i++) { (function (j) { setTimeout(() => console.log(j), 100); })(i); }`, har call apna `j` capture karta hai. (2) `setTimeout((j) => console.log(j), 100, i)` — extra args callback ko pass hote hain. (3) Modern: `let i` — spec har iteration ka fresh binding deta hai, output `0 1 2`.",
    followUp:
      "`let` version `0 1 2` kyun deta hai jabki loop to ek hi hai?",
    redFlag:
      "Bina reasoning ke `0 1 2` bol dena — `var` closure sharing samjha nahi.",
  },
  {
    id: "cbh-4",
    question:
      "Tumhe teen API calls ek sequence mein karni hain jahan har call ko pichle ka result chahiye. Callback style mein likhoge to kya dikkat, aur behtar kya?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Callback style mein teen level ki nesting, teen jagah error handling, padhna mushkil. Behtar: promise chain (`a().then(b).then(c).catch(...)`) ya `async/await` — flat sequence, ek error handler.",
    detailedAnswer:
      "Callback: `stepA((e, a) => { if (e) ...; stepB(a, (e, b) => { if (e) ...; stepC(b, (e, c) => { ... }); }); });`. `async/await` version: `try { const a = await stepA(); const b = await stepB(a); const c = await stepC(b); } catch (e) { handle(e); }` — chaar line, ek catch, debugger se step-through easy. Agar steps independent hote (ek dusre pe depend nahi) to `Promise.all([...])` se parallel bhi kar sakte the.",
    followUp: "Agar steps independent hote to code kaise badalta?",
    redFlag:
      "Callback nesting ko normal maan lena aur promises/async-await na jaanna.",
  },
];

export default questions;
