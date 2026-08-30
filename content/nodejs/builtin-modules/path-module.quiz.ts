import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "path-module-1",
    question: "`path.join('/a', '/b')` aur `path.resolve('/a', '/b')` ka result kya hoga?",
    options: [
      "Dono `/a/b` denge",
      "join → `/a/b`, resolve → `/b` (resolve ke liye doosra absolute segment pehle wale ko discard kar deta hai)",
      "join → `/b`, resolve → `/a/b`",
      "Dono `/b` denge",
    ],
    correctIndex: 1,
    explanation:
      "join sirf segments ko jodta aur normalize karta hai, toh `/a` + `/b` = `/a/b`. resolve right-se-left chalta hai jab tak absolute path na bane; `/b` khud absolute hai isliye wahin ruk jata hai aur `/a` discard ho jata hai. Yahi in dono ka core farak hai.",
    difficulty: "medium",
  },
  {
    id: "path-module-2",
    question:
      "String concatenation se path banane (`dir + '/' + file`) ki sabse badi problem kya hai?",
    options: [
      "Ye slow hota hai kyunki string allocation hoti hai",
      "OS separator alag hota hai (POSIX `/`, Windows `\\`) aur `.`/`..` segments resolve nahi hote — cross-platform aur normalization bugs aate hain",
      "JavaScript strings ko concat nahi kar sakta",
      "path module concatenation ko block karta hai",
    ],
    correctIndex: 1,
    explanation:
      "path.join current OS ka sahi separator use karta hai aur `a/b/../c` ko `a/c` mein normalize karta hai. Manual concat Windows pe mixed `\\`/`/` produce kar sakta hai jo downstream tooling (glob, dirname) todta hai, aur `..` ko literally chhod deta hai. Option A/C/D galat — performance ya language limitation issue nahi hai.",
    difficulty: "easy",
  },
  {
    id: "path-module-3",
    question:
      "Ek Node service systemd se start hoti hai jiska working directory `/` hota hai. `fs.readFile('./config.json')` fail ho raha hai. Sabse sahi fix?",
    options: [
      "config.json ko `/` pe copy kar do",
      "`fs.readFile(path.resolve(__dirname, 'config.json'))` — path script ke location se banao, cwd se nahi",
      "systemd config badal ke cwd project folder kar do — code change ki zaroorat nahi",
      "`fs.readFileSync` use karo, wo cwd ignore karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`./config.json` process.cwd() ke relative resolve hota hai, jo systemd ke saath `/` hai. `path.resolve(__dirname, 'config.json')` file ke apne folder se anchor karta hai — kahin se bhi start karo, sahi rahega. Option A hacky; option C dependent on deployment config, code portable nahi rehta; option D galat — readFileSync bhi cwd-relative resolve karta hai.",
    difficulty: "medium",
  },
  {
    id: "path-module-4",
    question:
      "Ek REST client ke liye URL path banane ke liye Windows dev machine pe `path.join('api', 'v1', 'users')` use kiya. Kya hoga?",
    options: [
      "Sahi URL milega: `api/v1/users`",
      "`api\\v1\\users` milega — Windows separator, jo invalid URL path hai; URLs ke liye `path.posix.join` ya `new URL()` chahiye",
      "Error throw hoga kyunki path module URLs support nahi karta",
      "Empty string milega",
    ],
    correctIndex: 1,
    explanation:
      "path module current OS ke rules follow karta hai; Windows pe separator `\\` hai, toh `api\\v1\\users` banega — HTTP URLs ke liye galat. URL paths hamesha `/` use karte hain, isliye `path.posix.join` (jo har OS pe `/` deta hai) ya `new URL()` use karo. path module filesystem ke liye hai, web paths ke liye nahi.",
    difficulty: "easy",
  },
];

export default quiz;
