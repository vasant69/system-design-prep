import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "es6-plus-features-roundup-1",
    question: "`const limit = userInput ?? 20;` vs `const limit = userInput || 20;` — jab `userInput` `0` ho to?",
    options: [
      "Dono 20 dete hain",
      "?? version 0 rakhta hai; || version 20 deta hai (kyunki 0 falsy hai)",
      "?? version 20 deta hai; || version 0 rakhta hai",
      "Dono 0 rakhte hain",
    ],
    correctIndex: 1,
    explanation:
      "`??` (nullish coalescing) sirf `null` aur `undefined` pe right-hand side deta hai — `0` in dono mein se nahi, isliye `limit` `0` rehta hai. `||` har **falsy** value pe right-hand side deta hai, aur `0` falsy hai — isliye `limit` `20` ban jaata hai, jo aksar ek bug hota hai (valid `0` input kho gaya). Isiliye numeric/boolean defaults ke liye `??` prefer karo. Option A/C/D galat.",
    difficulty: "easy",
  },
  {
    id: "es6-plus-features-roundup-2",
    question: "async/await aur Promises kaunse ECMAScript versions mein aaye?",
    options: [
      "Dono ES2015 mein",
      "Promises ES2015 (ES6) mein; async/await ES2017 mein",
      "Promises ES2017 mein; async/await ES2015 mein",
      "Dono ES2020 mein",
    ],
    correctIndex: 1,
    explanation:
      "Promises ES2015 (ES6) ke bade release ka hissa the — classes, arrow functions, modules, destructuring ke saath. async/await do saal baad ES2017 mein aaya, aur wo koi naya concurrency model nahi — bas Promises ke upar ek syntax layer jo async code ko synchronous-jaisa likhne deta hai. Option A/C/D galat versions batate hain. Ye ek common interview trivia question hai.",
    difficulty: "medium",
  },
  {
    id: "es6-plus-features-roundup-3",
    question: "`user?.profile.avatar` — `user` ek object hai par `user.profile` `null` hai. Kya hota hai?",
    options: [
      "undefined milta hai — optional chaining poori chain ko guard karta hai",
      "TypeError — ?. sirf 'user' step ko guard karta hai; profile null hone par .avatar phir bhi crash karta hai",
      "null milta hai",
      "avatar ki jagah empty string milti hai",
    ],
    correctIndex: 1,
    explanation:
      "Optional chaining `?.` sirf usi ek step ko short-circuit karta hai jahaan wo likha hai. `user?.` ne `user` ke `null`/`undefined` hone ko handle kiya, par `user.profile` `null` hai aur uske baad `.avatar` bina guard ke access ho raha hai — `TypeError: Cannot read properties of null`. Har uncertain step pe `?.` chahiye: `user?.profile?.avatar`. Option A ek aam galatfehmi hai. Option C/D galat.",
    difficulty: "medium",
  },
  {
    id: "es6-plus-features-roundup-4",
    question: "Tumne `arr.toSorted()` (ES2023) use kiya par production mein `TypeError: arr.toSorted is not a function` aaya. Sabse likely reason?",
    options: [
      "toSorted sirf strings pe kaam karta hai, arrays pe nahi",
      "Target runtime (purana browser / Node version) us feature ko support nahi karta aur koi transpile/polyfill setup nahi hai",
      "toSorted ko import karna padta hai kisi module se",
      "toSorted ka naam galat hai, sahi naam sortImmutable hai",
    ],
    correctIndex: 1,
    explanation:
      "`toSorted` ek naya (ES2023) API hai. Naya syntax Babel transpile kar deta hai, par naye **APIs** ke liye alag se polyfill (core-js) chahiye — aur agar tumhara `browserslist` target ya deployed Node version usse purana hai aur polyfill configured nahi, to wo method runtime pe exist hi nahi karta. Fix: target upgrade karo, ya polyfill add karo, ya `[...arr].sort()` use karo. Option A/C/D galat — `toSorted` arrays ka native method hai, import nahi chahiye, naam sahi hai.",
    difficulty: "medium",
  },
];

export default quiz;
