import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "log-diff-history-1",
    question: "Tumne kuch changes kiye aur git add bhi kar diya. Ab plain git diff (bina flags ke) chalane pe kya dikhega?",
    options: [
      "Sab changes dikhenge, staged aur unstaged dono",
      "Kuch nahi dikhega, kyunki plain git diff sirf unstaged changes dikhata hai",
      "Sirf error message aayega",
      "Sirf commit history dikhegi"
    ],
    correctIndex: 1,
    explanation: "Plain git diff sirf working directory vs staging area compare karta hai — yaani sirf woh changes jo abhi tak git add nahi hue. Ek baar git add karne ke baad, woh changes staged ho jaate hain, aur unhe dekhne ke liye git diff --staged (ya --cached) use karna padta hai. Yeh teen-way distinction (diff, diff --staged, diff HEAD) newcomers ke liye common confusion point hai.",
    difficulty: "medium",
  },
  {
    id: "log-diff-history-2",
    question: "git log --oneline --graph --all kis situation mein sabse zyada useful hota hai?",
    options: [
      "Jab sirf ek commit ka full diff dekhna ho",
      "Jab ek glance mein pura branch structure aur merge history samajhna ho",
      "Jab kisi specific line ka author dhundhna ho",
      "Jab working directory ko clean karna ho"
    ],
    correctIndex: 1,
    explanation: "git log --oneline --graph --all ek compact, visual representation deta hai — ek line per commit, ASCII graph jo branches aur merges dikhata hai, aur --all se sirf current branch nahi balki sab branches include hoti hain. Yeh team confusion resolve karne ke liye ideal hai, jaise 'yeh feature branch kahan se diverge hua tha' jaise questions.",
    difficulty: "easy",
  },
  {
    id: "log-diff-history-3",
    question: "Production mein ek weird logic line dikhi, aur git blame check karne pe pata chala ki woh line ek bulk Prettier-formatting commit se attributed hai, actual logic author se nahi. Iska solution kya hai?",
    options: [
      "git blame ka result hamesha final hota hai, koi solution nahi",
      "git blame --ignore-rev ya ek .git-blame-ignore-revs file use karke formatting commits ko skip karo",
      "git log use karna band kar do",
      "Us file ko delete karke dobara banao"
    ],
    correctIndex: 1,
    explanation: "Bulk formatting commits (jaise Prettier ya ESLint auto-fix runs) git blame ko 'noisy' bana dete hain — har line us formatting commit ko point karti hai, actual logic author ko nahi. --ignore-rev <hash> flag (ya ek configured .git-blame-ignore-revs file) is specific commit ko skip karke asli author tak pahunchata hai.",
    difficulty: "hard",
  },
  {
    id: "log-diff-history-4",
    question: "git show <hash> aur git log -p mein basic relationship kya hai?",
    options: [
      "Dono bilkul unrelated commands hain",
      "git show ek single specific commit ka full diff + message dikhata hai, git log -p multiple commits ke diffs history ke saath dikhata hai",
      "git show sirf staged changes dikhata hai",
      "git log -p sirf branch comparison ke liye hai"
    ],
    correctIndex: 1,
    explanation: "git show <hash> ko git log -p ka 'single-commit version' samjho — jab tumhe exactly pata hai kaunsa commit dekhna hai (jaise git blame se mila hash), git show seedha us ek commit ka poora context (message + diff) de deta hai. git log -p yehi cheez multiple commits ke liye, history scroll karte hue dikhata hai.",
    difficulty: "medium",
  },
];

export default quiz;
