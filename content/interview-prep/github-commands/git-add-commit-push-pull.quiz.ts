import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "git-acpp-1",
    question: "git add -p flag ka kya purpose hai?",
    options: [
      "Saari files ek saath permanently commit kar deta hai",
      "Changes ko hunk-by-hunk interactively review karke selectively stage karne deta hai",
      "Sirf .gitignore mein listed files ko stage karta hai",
      "Remote pe directly push kar deta hai bina commit ke",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — git add -p (patch mode) har change ko chhote hunks mein todke dikhata hai aur developer ko decide karne deta hai kaunsa hunk stage karna hai, jisse clean aur focused commits banana easy ho jaata hai. A galat hai, add commit nahi karta. C galat hai, .gitignore se iska koi seedha connection nahi. D galat hai, push ek alag command hai jo staging/commit ke baad aata hai.",
    difficulty: "medium",
  },
  {
    id: "git-acpp-2",
    question: "git commit --amend kab risky ho jaata hai?",
    options: [
      "Jab commit abhi tak sirf local machine pe hai, push nahi hua",
      "Jab commit already remote pe push ho chuka hai aur teammates ne pull kar liya hai",
      "Jab commit message empty ho",
      "--amend kabhi risky nahi hota, hamesha safe hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — --amend commit ka hash badal deta hai, naya commit object banake purana replace karta hai. Agar woh commit already remote pe push ho chuka hai aur kisi aur ne pull kar liya hai, to unki local history se diverge ho jaata hai, jo confusing conflicts create karta hai. A safe scenario hai, risky nahi. C aur D dono galat hain — risk commit ke push-status pe depend karta hai, message ki length pe nahi, aur --amend hamesha safe nahi hota.",
    difficulty: "medium",
  },
  {
    id: "git-acpp-3",
    question: "git pull actually internally kya karta hai?",
    options: [
      "Sirf remote se naye commits download karta hai, kuch merge nahi karta",
      "git fetch (download) plus git merge (current branch mein merge) dono ek saath",
      "Sirf local commits ko remote pe upload karta hai",
      "Poore repo ko delete karke fresh clone kar deta hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — git pull do steps combine karta hai: pehle git fetch se remote ke naye commits download hote hain, phir git merge se woh current branch mein merge ho jaate hain. A galat hai, woh sirf git fetch ka behavior describe karta hai. C galat hai, upload karna git push ka kaam hai. D bilkul galat hai, pull kabhi repo delete nahi karta.",
    difficulty: "easy",
  },
  {
    id: "git-acpp-4",
    question: "git push -u origin feature-branch mein -u flag kyun important hai?",
    options: [
      "Yeh commit message automatically generate karta hai",
      "Yeh upstream tracking relationship set karta hai taaki future mein sirf git push chal sake",
      "Yeh staging area ko clear kar deta hai",
      "Yeh purani commits ko remote se delete kar deta hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — -u (--set-upstream) local branch ko corresponding remote branch se link karta hai, jisse aage se sirf git push (bina arguments) chalane se Git automatically sahi remote branch pe push kar dega. A, C, aur D sab galat hain — inka -u flag ke actual kaam se koi lena dena nahi hai.",
    difficulty: "easy",
  },
];

export default quiz;
