import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "json-1",
    question:
      "`JSON.stringify({ a: undefined, b: [undefined], c: NaN })` ka output kya hai?",
    options: [
      '`{"a":undefined,"b":[undefined],"c":NaN}`',
      '`{"b":[null],"c":null}`',
      '`{"a":null,"b":[null],"c":null}`',
      "SyntaxError throw hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Object mein `undefined`-valued key poori tarah drop hoti hai — isliye `a` gayab. Array mein `undefined` `null` ban jaata hai — isliye `b` `[null]`. `NaN` (aur `Infinity`) `null` ban jaate hain — isliye `c` `null`. Result: `{\"b\":[null],\"c\":null}`. Option A galat kyunki `undefined`/`NaN` valid JSON hi nahi. Option C galat kyunki object mein `a` drop hota hai, `null` nahi banta. Option D galat — ye values throw nahi karti (sirf BigInt aur circular refs karti hain).",
    difficulty: "medium",
  },
  {
    id: "json-2",
    question:
      "Ek API se `{ \"createdAt\": \"2024-01-01T00:00:00.000Z\" }` aaya aur tumne `JSON.parse` kiya. `result.createdAt` kis type ka hai?",
    options: [
      "Ek Date object — JSON.parse ISO strings ko auto-convert karta hai",
      "Ek string — JSON.parse Date restore nahi karta; new Date() ya reviver chahiye",
      "Ek number (epoch milliseconds)",
      "null, kyunki Date JSON mein represent nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "JSON mein `Date` type hai hi nahi. `JSON.stringify` `Date` ko `toJSON()` ke through ISO string banata hai, aur `JSON.parse` us string ko waise ka waisa string hi chhodta hai — koi auto-detection nahi. Wapas `Date` chahiye to `new Date(result.createdAt)` karo ya `JSON.parse` ko ek `reviver` function do jo us key pe `new Date(value)` return kare. Option A/C galat — koi automatic conversion nahi. Option D galat — value ek valid string hai, `null` nahi.",
    difficulty: "easy",
  },
  {
    id: "json-3",
    question:
      "`JSON.parse(JSON.stringify(obj))` deep clone ke liye — iska sabse bada risk kya hai jab `obj` mein circular reference ho?",
    options: [
      "Circular reference silently null ban jaata hai",
      "Clone ban jaata hai par circular part share hota hai (shallow)",
      "`JSON.stringify` ek TypeError throw karta hai — clone banta hi nahi",
      "Kuch nahi, JSON.stringify circular refs handle karta hai",
    ],
    correctIndex: 2,
    explanation:
      "`JSON.stringify` jaise hi ek object dobara encounter karta hai (jaise `obj.self = obj`), wo `TypeError: Converting circular structure to JSON` throw karta hai — poora operation fail, koi clone nahi. Ye is hack ki sabse tez-dikhne wali limit hai. Doosri lossy limits: `Date` -> string, `undefined`/functions drop, `Map`/`Set` toot-te hain. `structuredClone` circular refs aur ye types sahi handle karta hai. Option A/B galat — koi partial handling nahi. Option D galat.",
    difficulty: "medium",
  },
  {
    id: "json-4",
    question:
      "Config file mein `{ \"port\": 3000, // dev port\\n \"host\": \"local\", }` likha hai. `JSON.parse` pe kya hoga?",
    options: [
      "Sahi parse hota hai; JSON comments aur trailing commas allow karta hai",
      "SyntaxError — JSON mein na comments allowed hain na trailing comma",
      "Comment ignore hota hai par trailing comma se error aata hai",
      "port aur host dono parse hote hain, comment ek key ban jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "JSON spec strict hai: `//` ya `/* */` comments allowed nahi, aur aakhri property ke baad trailing comma bhi nahi. In dono mein se koi bhi `SyntaxError` deta hai — parsing turant fail. Isiliye `package.json` jaisi files mein comments nahi hote. Comments wali config chahiye to JSON5, YAML, ya TOML use karo, ya build step mein strip karo. Option A/C/D galat — JSON parser dono cheezon pe fail karta hai, koi lenient handling nahi.",
    difficulty: "easy",
  },
];

export default quiz;
