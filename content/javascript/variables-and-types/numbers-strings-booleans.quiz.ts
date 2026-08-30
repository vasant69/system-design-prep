import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "numbers-strings-booleans-1",
    question: "`0.1 + 0.2 === 0.3` kya deta hai aur kyun?",
    options: [
      "true — JS decimal arithmetic exact karta hai",
      "false — 0.1 aur 0.2 binary float64 mein exactly represent nahi hote, chhoti rounding error carry hoti hai",
      "TypeError — floats ko === se compare nahi kar sakte",
      "true — 0.30000000000000004 automatically 0.3 pe round hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`number` IEEE-754 double hai. `0.1` aur `0.2` binary mein infinite repeating hain (jaise 1/3 decimal mein), engine unhe nearest representable value pe round karta hai, aur error add hone pe `0.30000000000000004` milta hai — jo `0.3` ke barabar nahi. Isliye floats ko `Math.abs(a-b) < Number.EPSILON` se compare karte hain. Option C galat — comparison chalta hai, bas false deta hai.",
    difficulty: "easy",
  },
  {
    id: "numbers-strings-booleans-2",
    question: "`if (new Boolean(false)) { console.log('hi'); }` — 'hi' print hota hai?",
    options: [
      "Nahi — andar false hai, condition falsy",
      "Haan — new Boolean(false) ek object hai, aur har object truthy hota hai",
      "TypeError — Boolean ko new ke saath use nahi kar sakte",
      "Nahi — new Boolean(false) exactly false primitive return karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`new Boolean(false)` ek wrapper OBJECT banata hai (`typeof` `\"object\"`), primitive nahi. JavaScript mein `null`/`undefined` chhod ke har object truthy hai — chahe andar `false` ho. Isliye `if` block chalta hai. Isi wajah se wrapper types ke saath `new` kabhi use nahi karte; `Boolean(x)` bina `new` ke honest primitive return karta hai.",
    difficulty: "medium",
  },
  {
    id: "numbers-strings-booleans-3",
    question: "`let s = 'hello'; s[0] = 'H'; console.log(s);` — output?",
    options: [
      "'Hello' — index assignment se pehla char badal gaya",
      "'hello' — strings immutable hain, index assignment silently ignore hota hai (strict mode mein TypeError)",
      "'H' — s ab sirf assigned char rakhta hai",
      "TypeError hamesha",
    ],
    correctIndex: 1,
    explanation:
      "Strings primitive aur immutable hain. `s[0] = 'H'` non-strict mode mein silently kuch nahi karta; strict mode mein `TypeError` deta hai. String badalne ka tarika: naya string banao aur reassign karo — `s = 'H' + s.slice(1)` ya `s = s.replace('h', 'H')`. Har string method (`toUpperCase`, `slice`, `replace`) naya string return karta hai, original untouched.",
    difficulty: "easy",
  },
  {
    id: "numbers-strings-booleans-4",
    question:
      "Backend ek 64-bit database ID bhejta hai jo Number.MAX_SAFE_INTEGER se badi hai. Client-side ise kaise handle karna chahiye?",
    options: [
      "JSON.parse se number banao, JS bade numbers automatically handle karta hai",
      "ID ko string mein rakho end-to-end — number mein parse karne pe 2^53 ke aage precision khatam ho jaati hai aur alag IDs collide karti hain",
      "parseInt(id, 10) use karo taaki precision bani rahe",
      "Number(id).toFixed(0) se safe integer ban jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "`number` sirf `2^53 - 1` tak integers exactly represent kar sakta hai. Us se badi ID ko `number` banaoge to trailing digits lose ho jaati hain aur do alag records same value pe map ho sakte hain (Twitter/X ka classic bug). Solution: ID ko string ke roop mein carry karo (`id_str` pattern), ya `BigInt` use karo agar arithmetic chahiye. `parseInt`/`toFixed` bhi underlying float64 se hi kaam karte hain, help nahi karte.",
    difficulty: "medium",
  },
];

export default quiz;
