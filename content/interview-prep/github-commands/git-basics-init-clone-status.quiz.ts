import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "git-basics-1",
    question: "git init aur git clone mein sabse bada functional farak kya hai?",
    options: [
      "Dono exactly same kaam karte hain, sirf naam alag hai",
      "git init ek naya empty repo banata hai (no history, no remote), git clone existing remote repo ki full history copy karta hai",
      "git init sirf GitHub ke liye hai, git clone sirf GitLab ke liye",
      "git clone naya repo banata hai, git init existing repo copy karta hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — git init scratch se ek khaali repository banata hai jisme koi history ya remote nahi hota, jabki git clone ek existing remote repository ki poori commit history aur automatically ek origin remote local machine pe la deta hai. A galat hai kyunki dono ka behavior bilkul alag hai. C aur D galat hain kyunki yeh commands kisi specific platform (GitHub/GitLab) se bandhe nahi hain aur D ne functionality reverse kar di.",
    difficulty: "easy",
  },
  {
    id: "git-basics-2",
    question: "git clone --depth 1 karne se kya hota hai aur iska trade-off kya hai?",
    options: [
      "Sirf latest commit download hota hai, faster clone, lekin purani history operations (jaise old commit checkout) fail ho sakte hain",
      "Poori history download hoti hai lekin compressed format mein, koi trade-off nahi",
      "Sirf branch names download hote hain, koi file content nahi",
      "Yeh sirf private repos ke liye kaam karta hai",
    ],
    correctIndex: 0,
    explanation: "Sahi answer A hai — --depth 1 shallow clone karta hai jisme sirf latest snapshot download hota hai, isse clone fast aur lightweight hota hai (CI pipelines mein common), lekin purani commits pe operations (checkout, blame) shallow history ki wajah se fail ho sakte hain jab tak git fetch --unshallow na karo. B, C, aur D sab galat hain kyunki woh depth flag ke actual behavior ko misrepresent karte hain.",
    difficulty: "medium",
  },
  {
    id: "git-basics-3",
    question: "git status ke output mein 'Untracked files' section ka matlab kya hai?",
    options: [
      "Yeh files hain jo staged hain aur agle commit mein jaayenge",
      "Yeh files hain jo Git ne kabhi track nahi ki hain — na staged, na committed",
      "Yeh files hain jo remote pe delete ho chuki hain",
      "Yeh files hain jo .gitignore mein already listed hain",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — Untracked files woh naye files hain jinke baare mein Git ko abhi tak pata hi nahi tha, na woh staging area mein hain na commit history mein. A galat hai kyunki staged files 'Changes to be committed' section mein aati hain. C galat hai, yeh remote se koi seedha connection nahi rakhta. D galat hai — agar file .gitignore mein listed ho to woh normally status output mein dikhti hi nahi.",
    difficulty: "easy",
  },
  {
    id: "git-basics-4",
    question: "git remote -v command kya dikhata hai?",
    options: [
      "Sirf current branch ka naam",
      "Configured remotes ke fetch aur push URLs",
      "Poori commit history ek list mein",
      "Staging area mein pade files",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — git remote -v verbose mode mein configured remotes (jaise origin) ke fetch aur push URLs dikhata hai, jisse pata chalta hai local repo kaunse remote se linked hai. A, C, aur D sab alag commands (git branch, git log, git status) ka kaam hain, remote -v ka nahi.",
    difficulty: "easy",
  },
];

export default quiz;
