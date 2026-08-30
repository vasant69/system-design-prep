import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "destructuring-1",
    question: "`const { a = 1, b = 2 } = { a: undefined, b: null };` — a aur b kya honge?",
    options: [
      "a = 1, b = 2 (dono defaults)",
      "a = 1, b = null",
      "a = undefined, b = null",
      "a = undefined, b = 2",
    ],
    correctIndex: 1,
    explanation:
      "Default value sirf tab lagti hai jab property ki value `undefined` ho. `a` undefined hai isliye default `1` lag gaya. `b` `null` hai — `null` `undefined` nahi hota, isliye default nahi lagta aur `b` `null` hi rehta hai. `null` ko bhi handle karna ho to `?? ` operator alag se use karo.",
    difficulty: "medium",
  },
  {
    id: "destructuring-2",
    question:
      "`function f({ x = 10 } = {}) { return x; }` — `f()` aur `f({})` kya return karte hain, aur `= {}` hataane se kya hota hai?",
    options: [
      "Dono 10; `= {}` hataane par f() TypeError deta hai",
      "Dono undefined; koi farak nahi",
      "f() TypeError, f({}) 10 — dono cases mein",
      "Dono 10; `= {}` hataane par bhi koi farak nahi",
    ],
    correctIndex: 0,
    explanation:
      "`f()` mein argument undefined hai, `= {}` uske jagah khaali object de deta hai, phir usme `x` missing hai to default `10`. `f({})` bhi same tarah `10`. Agar `= {}` hata do to `f()` mein `undefined` ko destructure karna padta — `TypeError: Cannot destructure property 'x' of undefined`. Isi liye options-object pattern mein `= {}` mandatory hai.",
    difficulty: "medium",
  },
  {
    id: "destructuring-3",
    question: "Bina temp variable ke `a` aur `b` swap karne ka sahi tarika?",
    options: [
      "a = b; b = a;",
      "[a, b] = [b, a];",
      "{ a, b } = { b, a };",
      "a, b = b, a;",
    ],
    correctIndex: 1,
    explanation:
      "`[a, b] = [b, a]` — right side pehle ek naya array `[b, a]` (purani values ke saath) banta hai, phir woh array destructure hoke a aur b mein assign hota hai. Isliye temp variable ki zaroorat nahi. Option A galat: `a = b` ke baad `b = a` purani `a` ko hi wapas de deta hai. Option C object shorthand galat shape hai. Option D comma operator hai, swap nahi karta.",
    difficulty: "easy",
  },
  {
    id: "destructuring-4",
    question:
      "`const user = { name: 'V' }; const { profile: { bio } } = user;` — kya hota hai?",
    options: [
      "bio = undefined",
      "bio = '' (empty string)",
      "TypeError, kyunki user.profile undefined hai aur undefined.bio access nahi ho sakta",
      "profile aur bio dono variables ban jaate hain, dono undefined",
    ],
    correctIndex: 2,
    explanation:
      "Nested destructuring `{ profile: { bio } }` pehle `user.profile` access karta hai (jo `undefined` hai), phir usme se `bio` nikaalne ki koshish karta hai — `undefined.bio` `TypeError` deta hai. Uncertain nested paths ke liye optional chaining use karo: `const bio = user.profile?.bio`. Note: `profile` khud koi variable nahi banta yaha, woh sirf path ke liye hai.",
    difficulty: "medium",
  },
];

export default quiz;
