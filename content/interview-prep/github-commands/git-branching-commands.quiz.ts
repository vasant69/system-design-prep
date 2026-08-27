import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "git-branch-1",
    question: "Git mein HEAD kya represent karta hai?",
    options: [
      "Repository ka pehla commit jo kabhi bana tha",
      "Ek pointer jo batata hai working directory currently kis commit/branch ko reflect kar raha hai",
      "Remote repository ka main branch",
      "Sabse bada file jo repo mein hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — HEAD ek movable pointer hai, normally kisi branch ki taraf point karta hai, aur woh branch latest commit ki taraf. Branch switch karna sirf HEAD ka target badalta hai. A galat hai, pehla commit HEAD se unrelated hai. C galat hai, HEAD local concept hai, remote ke main branch se directly link nahi. D bilkul galat hai, file size ka HEAD se koi lena dena nahi.",
    difficulty: "medium",
  },
  {
    id: "git-branch-2",
    question: "git branch -d aur git branch -D mein farak kya hai?",
    options: [
      "Dono exactly same kaam karte hain",
      "-d safe delete hai (sirf agar merged hai), -D force delete hai (chahe unmerged ho)",
      "-d remote branch delete karta hai, -D local branch delete karta hai",
      "-d sirf naye branches delete kar sakta hai, -D sirf purane",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — -d (lowercase) Git ko check karne deta hai ki branch fully merged hai ya nahi, agar nahi to error deta hai, jabki -D (uppercase) bina check kiye force delete kar deta hai, jisse unmerged commits permanently lost ho sakte hain. A galat hai, behavior alag hai. C galat hai, dono local delete ke liye hain — remote delete alag command (push --delete) se hota hai. D bilkul irrelevant distinction hai.",
    difficulty: "medium",
  },
  {
    id: "git-branch-3",
    question: "git switch -c feature-x aur purane git checkout -b feature-x mein kya relationship hai?",
    options: [
      "Yeh dono completely unrelated commands hain, alag kaam karte hain",
      "switch -c wahi kaam karta hai jo checkout -b karta hai — naya branch banao aur turant switch ho jao, lekin switch zyaada focused/safe hai",
      "switch -c sirf remote branches ke liye kaam karta hai",
      "checkout -b deprecated hai aur ab bilkul kaam nahi karta",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — Git 2.23 mein git switch introduce hua taaki checkout ke overloaded (branch switching + file restore, dono) behavior ko split kiya ja sake. switch -c aur checkout -b functionally same result dete hain: naya branch + turant switch. A galat hai, yeh functionally equivalent hain. C galat hai, dono local aur remote-tracking branches ke liye kaam karte hain. D galat hai, checkout -b ab bhi kaam karta hai, sirf recommended nahi hai naye users ke liye.",
    difficulty: "medium",
  },
  {
    id: "git-branch-4",
    question: "Agar tum sirf git branch -d feature-x chalate ho, kya remote pe bhi woh branch delete ho jaata hai?",
    options: [
      "Haan, local aur remote dono automatically delete ho jaate hain",
      "Nahi, yeh sirf local branch delete karta hai — remote ke liye alag command chahiye: git push origin --delete feature-x",
      "Nahi, yeh kuch bhi delete nahi karta, sirf warning deta hai",
      "Haan, lekin sirf agar branch already merged ho",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — git branch -d sirf local repository se branch reference hataata hai. Remote repository (jaise GitHub) pe woh branch tab tak exist karega jab tak explicitly git push origin --delete branch-name se delete na kiya jaaye — yeh do alag, independent operations hain. A aur D galat hain kyunki remote delete automatically nahi hota. C galat hai, -d successfully local branch delete karta hai (agar merged ho).",
    difficulty: "easy",
  },
];

export default quiz;
