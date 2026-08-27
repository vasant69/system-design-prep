import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "undoing-changes-1",
    question: "Tumne local commit kiya, lekin realize hua ki commit message galat hai aur ek file miss ho gayi thi. Yeh commit abhi tak push nahi hua. Best command kaunsa hai?",
    options: [
      "git revert HEAD",
      "git reset --soft HEAD~1",
      "git reset --hard HEAD~1",
      "git restore file.js"
    ],
    correctIndex: 1,
    explanation: "git reset --soft HEAD~1 sirf commit ko undo karta hai — changes staging area mein staged hi reh jaate hain. Isse missing file ko add karke aur sahi message ke saath dobara commit kiya ja sakta hai, bina kisi data loss ke. --hard yahan galat hoga kyunki woh staging aur working directory bhi wipe kar deta, aur revert unpushed local commits ke liye zyada complex approach hai.",
    difficulty: "medium",
  },
  {
    id: "undoing-changes-2",
    question: "Ek bad commit already team ke saath shared branch pe push ho chuka hai aur doosre engineers ne usko pull kar liya hai. Isko undo karne ka safe tarika kya hai?",
    options: [
      "git reset --hard aur force-push",
      "git revert <commit-hash>",
      "git restore --staged .",
      "git clean -fd"
    ],
    correctIndex: 1,
    explanation: "git revert ek naya commit banata hai jo purane commit ke changes ko reverse karta hai, bina history rewrite kiye. Yeh shared/pushed history ke liye safe hai kyunki koi force-push nahi chahiye aur team ki local history remote se sync rehti hai. git reset --hard + force-push existing history ko rewrite kar deta jo doosre engineers ke local clones ko diverge kara dega.",
    difficulty: "medium",
  },
  {
    id: "undoing-changes-3",
    question: "git reset ke teen modes (--soft, --mixed, --hard) mein basic difference kya hai?",
    options: [
      "Teeno same effect dete hain, sirf naming different hai",
      "Farak hai ki staging area aur working directory ka kya hota hai HEAD move hone ke baad",
      "--soft sirf remote branches pe kaam karta hai",
      "--hard sirf staged changes ko affect karta hai, working directory ko nahi"
    ],
    correctIndex: 1,
    explanation: "Teeno mode HEAD ko move karte hain, lekin farak hai staging area aur working directory pe effect mein: --soft staging area ko as-is rakhta hai (changes staged reh jaate hain), --mixed (default) staging reset kar deta hai lekin working directory mein changes rehte hain unstaged, aur --hard dono staging aur working directory reset kar deta hai — jo bhi uncommitted tha, permanently gone.",
    difficulty: "easy",
  },
  {
    id: "undoing-changes-4",
    question: "git reset --hard chalane ke baad, kya sab kuch reflog se recover ho sakta hai?",
    options: [
      "Haan, sab kuch hamesha recover ho sakta hai",
      "Committed commits reflog se recoverable hote hain kuch time tak, lekin uncommitted working directory changes ka koi recovery nahi hai",
      "Nahi, reflog kabhi kuch recover nahi kar sakta",
      "Sirf staged files recover hoti hain, committed nahi"
    ],
    correctIndex: 1,
    explanation: "Agar commits already ban chuke the (committed), toh woh dangling objects ban jaate hain jo git reflog se kuch samay tak (default gc settings ke hisaab se typically 30-90 days) recoverable hote hain. Lekin working directory ke uncommitted changes — jo kabhi commit hi nahi hue — Git ke object store mein kabhi the hi nahi, isliye unka koi recovery path nahi hai reset --hard ke baad.",
    difficulty: "hard",
  },
];

export default quiz;
