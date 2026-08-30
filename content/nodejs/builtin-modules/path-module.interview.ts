import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "path-1",
    question: "`path.join` aur `path.resolve` mein kya farak hai? Kab kaunsa?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`join` segments ko OS separator se jodta hai aur `.`/`..` normalize karta hai — result relative reh sakta hai. `resolve` ek absolute path banata hai: segments ko right-se-left process karta hai jab tak absolute na bane, phir bhi na bane toh `process.cwd()` prepend karta hai. Poora location chahiye → resolve; sirf pieces jodne → join.",
    detailedAnswer:
      "`path.join('a', 'b', '..', 'c')` → `'a/c'` (relative). `path.resolve('a', 'b')` → `'/cwd/a/b'` (absolute). Key edge case: absolute segment. `join('/x', '/y')` → `'/x/y'` (dono jud gaye). `resolve('/x', '/y')` → `'/y'` (doosra absolute segment se restart). Practical rule: script-relative asset ka full path chahiye jo cwd pe depend na kare → `path.resolve(__dirname, 'templates', 'a.html')`. Do relative URL/path fragments jodne → `join`. Dono OS separator handle karte hain aur normalize karte hain.",
    followUp: "`path.resolve()` ko bina koi argument diye call karo toh kya milta hai?",
    redFlag: "\"Dono same hain bas naam alag\" — absolute-segment aur cwd behaviour alag hai.",
  },
  {
    id: "path-2",
    question: "String concat se path banana kyun bug-prone hai? Ek concrete failure batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Do reasons: OS separator alag (`/` POSIX, `\\` Windows) aur `.`/`..`/double-slash resolve nahi hote. Failure: Windows pe `dir + '/' + file` mixed `\\`/`/` produce karta hai; jab wo path aage `dirname` ya glob se process hota hai toh match fail hota hai ya galat folder milta hai.",
    detailedAnswer:
      "`path.join`/`path.resolve` current OS ka separator use karte hain aur `a/b/../c` → `a/c` normalize karte hain. Manual concat: (1) `a/b//c` (double slash agar ek segment trailing slash rakhta hai); (2) Windows pe `C:\\app` + `/logs` = `C:\\app/logs` — kuch APIs tolerate karti hain, kuch nahi; (3) `..` literally rehta hai, toh containment checks aur caching keys galat ho jaate hain. Ye 'works on my machine' bugs ka classic source hai — dev Windows, CI Linux.",
    followUp: "Agar mujhe hamesha forward-slash path chahiye (URL ke liye), chahe OS koi bhi ho?",
  },
  {
    id: "path-3",
    question:
      "User `?file=` query param bhejta hai jise tum `path.join('./uploads', name)` se resolve karte ho aur serve karte ho. Kya problem hai aur fix?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Path traversal: `name = '../../etc/passwd'` join ke baad uploads folder ke bahar chala jaata hai. Fix: `path.resolve` se full path banao aur verify karo ki wo `path.resolve('./uploads') + path.sep` se start hota hai; nahi toh 403.",
    detailedAnswer:
      "```javascript\nconst BASE = path.resolve('./uploads');\nconst target = path.resolve(BASE, req.query.file);\nif (target !== BASE && !target.startsWith(BASE + path.sep)) {\n  return res.sendStatus(403);\n}\n// ab fs.createReadStream(target) safe\n```\n\n`path.join`/`resolve` `..` ko normalize kar dete hain, isliye attacker `../` chain karke koi bhi file padh sakta hai (config, `/etc/passwd`, SSH keys). Sirf 'string mein `..` hai kya' check karna weak hai (encoding, `....//`); resolve-then-containment check robust hai. Additionally `path.basename(name)` le lo agar sirf flat filenames expect karte ho.",
    followUp: "`path.basename` akela is problem ke liye kaafi hai kya?",
    redFlag: "\"Main `name.replace('..','')` kar deta hoon\" — bypass ho jaata hai (`....//`).",
  },
  {
    id: "path-4",
    question: "ESM file (`type: module`) mein `__dirname` nahi milta. Kaise handle karoge?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`import.meta.url` (ek file:// URL) ko `fileURLToPath` se path mein badlo, phir `path.dirname`. Newer Node (v20.11+) mein seedha `import.meta.dirname` available hai.",
    detailedAnswer:
      "CommonJS mein `__dirname`/`__filename` module wrapper se milte hain. ESM mein wrapper nahi hai, par `import.meta.url` hai:\n\n```javascript\nimport { fileURLToPath } from 'node:url';\nimport path from 'node:path';\n\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = path.dirname(__filename);\n```\n\nNode 20.11 / 21.2 se: `import.meta.dirname` aur `import.meta.filename` directly. Alternative pattern for reading a sibling file: `new URL('./data.json', import.meta.url)` ko seedha `fs.readFile` accept kar leta hai — path string banane ki zaroorat hi nahi.",
    followUp: "`new URL('./x.json', import.meta.url)` ko fs.readFile directly le sakta hai kya?",
  },
  {
    id: "path-5",
    question: "`path.posix` aur `path.win32` kya hain, kab explicitly use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`require('node:path')` automatically current OS ka variant deta hai. `path.posix` hamesha `/` rules use karta hai, `path.win32` hamesha `\\` rules — chahe code kahin bhi chale. Explicitly use karo jab output ka format OS-independent hona chahiye: URLs, cross-platform config files, ya generated import statements → `path.posix`.",
    detailedAnswer:
      "Default `path` platform-aware hai — Windows pe `path.win32` ban jaata hai, baaki jagah `path.posix`. Problem: ek Windows dev machine URL paths `path.join` se banaye toh `\\` aa jaata hai. `path.posix.join('api', 'v1')` har jagah `'api/v1'` dega. Ulta case rare hai — `path.win32` tab jab tum Linux pe Windows paths manipulate kar rahe ho (e.g. ek deployment tool jo Windows target ke liye config likhta hai). Constants bhi variant pe depend karte hain: `path.posix.sep === '/'`, `path.win32.sep === '\\\\'`.",
    followUp: "`path.sep` aur `path.delimiter` mein kya farak hai?",
    redFlag: "\"posix aur win32 same output dete hain\" — separator aur absolute-path detection alag hai.",
  },
];

export default questions;
