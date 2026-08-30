import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "how-nodejs-executes-your-code-1",
    question:
      "`node app.js` chalane par execution ka sahi order kya hai?",
    options: [
      "Event loop pehle shuru hota hai, phir top-level code chalta hai callbacks ke beech interleave hote hue",
      "File read + CommonJS wrapper mein wrap + V8 parse/compile -> saara top-level SYNC code poora chalta hai -> process.nextTick queue drain -> microtask (Promise) queue drain -> phir event loop enter",
      "Node har line ko ek-ek karke chalata hai aur async operations ke liye rukta hai",
      "Async callbacks aur sync code random order mein chalte hain",
    ],
    correctIndex: 1,
    explanation:
      "Node file ko CommonJS wrapper function mein lapetta hai (`exports`, `require`, `module`, `__filename`, `__dirname` as parameters), V8 compile karta hai, phir saara top-level synchronous code poora chalata hai — koi async callback beech mein nahi. Uske baad `process.nextTick` queue, phir microtask queue drain hoti hai, aur tab event loop shuru. Option A ulta hai. Option C galat — Node sync code ke liye nahi 'rukta', wo pehle poora chalata hai. Option D galat — ordering deterministic hai.",
    difficulty: "medium",
  },
  {
    id: "how-nodejs-executes-your-code-2",
    question:
      "CommonJS module wrapper kya inject karta hai aur iska ek practical consequence kya hai?",
    options: [
      "Kuch nahi — Node file ka code as-is chalata hai",
      "Node tumhari file ke code ko `(function (exports, require, module, __filename, __dirname) { ... })` mein wrap karta hai; isliye `require`/`module`/`exports`/`__dirname`/`__filename` actually function parameters hain (globals nahi), aur top-level `var`/`function` file-scoped hain, global nahi",
      "Wrapper sirf error handling add karta hai",
      "Wrapper har file ko ek alag thread mein chalata hai",
    ],
    correctIndex: 1,
    explanation:
      "CommonJS mein Node module body ko ek function mein wrap karta hai jisse 5 values parameters ki tarah milti hain. Consequences: (1) `require` etc. magically available lagte hain par actually locals hain; (2) top-level `var x = 1` `global.x` nahi banata (browser se alag); (3) CommonJS mein top-level `this` `module.exports` ko point karta hai. ESM mein wrapper nahi hota. Option C/D galat.",
    difficulty: "medium",
  },
  {
    id: "how-nodejs-executes-your-code-3",
    question:
      "Ek script chalane par wo 'turant exit' ho jaati hai aur async se kuch print nahi hota. Sabse likely wajah aur fix?",
    options: [
      "Node mein bug hai; version upgrade karo",
      "Sync code khatam hone par koi pending timer, pending I/O callback, ya open handle nahi bacha — aksar ek `async` entrypoint call kiya lekin uska Promise `await`/`.catch` nahi kiya; fix: `main().catch((e) => { console.error(e); process.exitCode = 1; })`",
      "`console.log` async hota hai isliye output kho jaata hai",
      "Script ko `--keep-alive` flag ke saath chalana chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Event loop tab tak zinda rehta hai jab tak koi pending timer/I/O callback/open handle ho. Agar entrypoint ka Promise drive nahi kiya gaya aur andar real loop-ref karne wala I/O nahi hai, loop khali -> auto exit code 0, tumhara kaam kiye bina. Fix hai entrypoint ko `main().catch(...)` se drive karna. Option C partially true hai ek alag context mein (`process.exit` ke saath) par yahan wajah nahi. Option D aisa flag exist nahi karta.",
    difficulty: "medium",
  },
  {
    id: "how-nodejs-executes-your-code-4",
    question:
      "Ek CLI script ka kaam ho gaya, 'Done' print ho gaya, lekin terminal wapas nahi aata (hang). Sabse common wajah?",
    options: [
      "Node ne process ko crash kar diya lekin error chhupa liya",
      "Ek open handle event loop ko ref kar raha hai jo close nahi kiya gaya — jaise ek `pg.Pool` / Redis client / `setInterval` / listening socket; fix: `finally` block mein `pool.end()` / `client.quit()` / `clearInterval()` / `server.close()`",
      "`console.log` ne stdout buffer bhar diya",
      "Script ko `sudo` ke saath chalana chahiye tha",
    ],
    correctIndex: 1,
    explanation:
      "Open handles (DB pool, Redis client, active `setInterval`, listening server) event loop ko 'ref' karte hain — process tab tak exit nahi hoga jab tak unhe close na karo. Servers ke liye ye sahi hai, scripts ke liye bug. `try/finally` mein cleanup, ya `why-is-node-running` / `process.getActiveResourcesInfo()` se dekho kaunsa handle zinda hai. Option A/C/D galat.",
    difficulty: "easy",
  },
];

export default quiz;
