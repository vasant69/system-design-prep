import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "callbacks-and-callback-hell-1",
    question: "Node ke error-first callback convention mein callback ka shape kya hota hai?",
    options: [
      "`(data, err) => {}` — result pehle, error baad mein",
      "`(err, data) => {}` — error pehla parameter (ya null), result doosra",
      "`(err) => {}` — sirf error, result alag se return hota hai",
      "`(data) => {}` — error `throw` hota hai, callback mein nahi aata",
    ],
    correctIndex: 1,
    explanation:
      "Node convention: pehla parameter hamesha `err` (error object ya `null` agar sab theek), doosra actual result. Isiliye har callback `if (err) return callback(err)` se shuru hota hai. Option A ka order ulta hai. Option C/D galat — async callback mein error `throw` nahi hota kyunki wo `try/catch` tak nahi pahunchta; error explicitly pehle argument mein diya jaata hai.",
    difficulty: "easy",
  },
  {
    id: "callbacks-and-callback-hell-2",
    question:
      "`try { getUser(id, cb); } catch (e) { console.log('caught'); }` — `getUser` ek async operation hai jo fail ho jaata hai. `catch` chalega?",
    options: [
      "Haan, `catch` 'caught' print karega",
      "Nahi — async error `try/catch` tak nahi pahunchta; wo `cb` ke `err` parameter mein aata hai, aur `try` block tab tak execute ho chuka hota hai",
      "Haan, lekin sirf strict mode mein",
      "Program crash ho jaayega bina `catch` chale",
    ],
    correctIndex: 1,
    explanation:
      "`getUser` turant return karta hai (async kaam delegate karke), `try` block poora ho jaata hai, aur `catch` scope se bahar nikal jaata hai. Baad ke tick mein jab async operation fail hota hai, uska stack alag hota hai — `try/catch` waha nahi hai. Error `cb(err, ...)` ke pehle argument mein aata hai. Isiliye callbacks mein error handling har callback ke andar `if (err)` se hoti hai. `async/await` ke saath `try/catch` phir se kaam karta hai.",
    difficulty: "medium",
  },
  {
    id: "callbacks-and-callback-hell-3",
    question: "\"Inversion of control\" ka callbacks ke context mein kya matlab hai?",
    options: [
      "Callback synchronous ki jagah asynchronous ho jaata hai",
      "Tum apna function kisi doosre code ko de dete ho aur trust karte ho ki wo use exactly ek baar, sahi arguments ke saath, error case mein bhi call karega",
      "Control flow upar se neeche ki jagah neeche se upar chalta hai",
      "Event loop callback ka control browser ko de deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Normally tum apna code khud call karte ho. Callback dene par control ulat jaata hai — koi doosri (aksar third-party) library tumhara code call karti hai, uski shurton pe. Risk: wo callback ko 0 baar call kare (tumhara flow hang), 2 baar call kare (double effect), error par call na kare (tumhara error handler kabhi na chale), ya galat timing pe call kare. Promises isse fix karte hain — wo guarantee dete hain ki settle exactly ek baar hoga. Option A/C/D 'inversion of control' term ko galat cheez se jodte hain.",
    difficulty: "medium",
  },
  {
    id: "callbacks-and-callback-hell-4",
    question:
      "Neeche wale mein se kaunsa callback ka bilkul sahi (idiomatic) use hai, callback hell nahi?",
    options: [
      "5 sequential API calls jaha har call pichle ke result par depend karti hai",
      "`button.addEventListener('click', handler)` — ek recurring event ke liye handler",
      "3 dependent database queries ek doosre ke andar nested",
      "Ek async step ke baad doosra async step uske callback ke andar",
    ],
    correctIndex: 1,
    explanation:
      "`addEventListener` recurring event hai — click baar baar hota hai — aur Promise (jo sirf ek baar settle hota hai) yaha fit nahi baithta; callback hi sahi model hai. Array methods, streams, `setInterval` bhi aise hi. Option A/C/D sab 'sequential dependent async steps' hain — yahi callback hell ka source hai, aur inhe Promise chain ya `async/await` se likhna chahiye.",
    difficulty: "easy",
  },
];

export default quiz;
