import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "stash-cleanup-1",
    question: "Tumne working directory mein WIP changes kiye hain, aur ek naya untracked file bhi banaya hai jo abhi tak git add nahi hua. Sirf git stash chalane pe kya hoga?",
    options: [
      "Sab kuch stash ho jayega, naya file bhi included hoga",
      "Sirf tracked changes stash honge, naya untracked file working directory mein reh jayega",
      "Command error dega kyunki untracked file hai",
      "Naya file automatically git add ho jayega phir stash hoga"
    ],
    correctIndex: 1,
    explanation: "git stash bina flags ke sirf tracked files (jo git already track kar raha hai) ko shelve karta hai. Untracked (naye) files ko include karne ke liye -u ya --include-untracked flag chahiye. Isliye plain git stash naya file ko chhod dega, aur woh working directory mein wapas rahega jab tum branch switch karoge.",
    difficulty: "medium",
  },
  {
    id: "stash-cleanup-2",
    question: "git stash pop aur git stash apply mein main difference kya hai?",
    options: [
      "pop sirf staged changes apply karta hai, apply sab apply karta hai",
      "pop apply karke stash ko list se remove kar deta hai, apply stash ko list mein rakhta hai",
      "apply sirf latest stash pe kaam karta hai, pop kisi bhi stash pe",
      "Dono same hain, sirf naming difference hai"
    ],
    correctIndex: 1,
    explanation: "git stash pop stash ko apply karke turant stash list se delete kar deta hai (agar conflict aaye to list mein reh jaata hai safety ke liye). git stash apply changes apply karta hai lekin stash ko list mein rakhta hai, jisse tum use dobara kisi aur branch pe bhi apply kar sako. Jab ek hi stash multiple jagah try karna ho, apply better choice hai.",
    difficulty: "medium",
  },
  {
    id: "stash-cleanup-3",
    question: "git clean -fd chalane se pehle sabse important habit kya honi chahiye?",
    options: [
      "git commit karna sab changes ka",
      "git clean -n (dry-run) se pehle preview dekhna",
      "git push karna remote pe",
      "git stash chalana pehle"
    ],
    correctIndex: 1,
    explanation: "git clean -fd untracked files aur directories ko PERMANENTLY delete karta hai — koi reflog recovery nahi hai kyunki woh files kabhi Git history mein thi hi nahi. Isliye -n (--dry-run) se pehle exactly dekhna chahiye ki kya delete hoga, taaki koi important untracked file (jaise ek nayi script jo abhi tak add nahi hui) galti se delete na ho jaaye.",
    difficulty: "easy",
  },
  {
    id: "stash-cleanup-4",
    question: "Ek feature 3-4 din tak incomplete rahega aur team ke saath share bhi karna hai. Is scenario mein stash ya WIP commit-to-branch mein kaunsa better approach hai?",
    options: [
      "git stash, kyunki yeh sabse fast hai",
      "Ek WIP commit ek dedicated branch pe, kyunki yeh remote pe push aur share ho sakta hai",
      "git clean, kyunki purana kaam clear karna zaroori hai",
      "Dono equally good hain, koi farak nahi padta"
    ],
    correctIndex: 1,
    explanation: "Stash local hai — kisi doosri machine ya team member tak nahi pahunchta, aur purane stashes eventually forget ho sakte hain ya garbage collected ho sakte hain. Jab kaam substantial ho, multiple din chalega, ya team visibility chahiye, ek dedicated WIP branch pe commit karke push karna better hai kyunki woh backed up aur shareable hai. Stash sirf quick, minutes-long context switches ke liye ideal hai.",
    difficulty: "hard",
  },
];

export default quiz;
