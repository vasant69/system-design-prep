import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "pitch-1",
    question:
      "Interviewer bolta hai \"quickly walk me through your project.\" Sabse appropriate response kya hai?",
    options: [
      "Poora 2-minute detailed pitch bolna, taaki kuch miss na ho",
      "~30-second elevator pitch bolna — stack, do highlight decisions, aur ruk jaana",
      "Sirf ye bolna \"it's a web app on AWS\" aur agle sawaal ka wait karna",
      "Poora architecture diagram whiteboard pe draw karna shuru kar dena",
    ],
    correctIndex: 1,
    explanation:
      "\"Quickly walk me through\" specifically ek short, elevator-length answer maang raha hai — ~30 seconds, stack + 1-2 sharp decisions ke saath, jo interviewer ke time-budget ko respect karta hai. Option A galat hai kyunki wo interviewer ka control le leta hai jab unhone specifically 'quickly' bola. Option C zyada thin hai, koi signal nahi deta. Option D scope se bahar jaata hai jab sirf ek quick walkthrough maanga gaya tha.",
    difficulty: "easy",
  },
  {
    id: "pitch-2",
    question:
      "2-minute detailed pitch ka structure kya hai, aur uska sabse zyada weight-carrying segment kaunsa hai?",
    options: [
      "Problem to Architecture to Key Decisions to Results/Learnings — Key Decisions sabse zyada weight carry karta hai",
      "Sirf Architecture walkthrough, baaki sab optional hai",
      "Results to Problem to Architecture — reverse chronological order me bolna better hai",
      "Learnings se shuru karke Problem pe khatam karna, kyunki interviewer learnings pehle sunna chahta hai",
    ],
    correctIndex: 0,
    explanation:
      "Structure hai Problem (~15s) to Architecture (~45s) to Key Decisions (~45s) to Results+Learnings (~15s). Key Decisions segment sabse zyada weight carry karta hai kyunki yahi jagah hai jahan 'maine X nahi liya kyunki Y' reasoning aata hai, jo tutorial-follower aur actual designer me farq dikhata hai. Options B, C, aur D sab structure ko galat represent karte hain — koi bhi interview coaching source is reverse ya partial order ko recommend nahi karta.",
    difficulty: "medium",
  },
  {
    id: "pitch-3",
    question:
      "Ek pitch ko 'demo' se 'design review' me kaunsa single habit sabse zyada badalta hai?",
    options: [
      "Zyada technical jargon use karna",
      "Har highlight decision ke saath 'maine X nahi liya kyunki Y' bolna — rejected alternative ko naam dena",
      "Pitch ko jitna ho sake lamba banana taaki sab detail cover ho jaaye",
      "Sirf numbers bolna, koi reasoning nahi",
    ],
    correctIndex: 1,
    explanation:
      "Ek rejected alternative naam lena ('maine X nahi liya kyunki Y') ye prove karta hai ki candidate ne actually options weigh kiye, sirf ek tutorial follow nahi kiya — ye single habit pitch ko sabse zyada upgrade karta hai. Option A jargon se depth nahi aati, confusion aa sakta hai. Option C length badhane se interviewer ka control chala jaata hai aur ye ek red flag hai (behavioral mistake). Option D bina reasoning ke numbers hollow lagte hain — numbers zaroori hain but akela kaafi nahi.",
    difficulty: "medium",
  },
  {
    id: "pitch-4",
    question:
      "Pitch ke Results + Learnings segment (~15 sec) ko skip karna kyun ek mistake maana jaata hai?",
    options: [
      "Kyunki ye segment technically sabse mushkil hai",
      "Kyunki isme concrete outcome (jaise cost number) aur genuine operational insight hota hai jo interviewer heavily weight karta hai",
      "Kyunki interviewer sirf architecture sunna chahta hai, kuch aur nahi",
      "Kyunki ye segment sirf freshers ke liye zaroori hai, experienced candidates ke liye optional hai",
    ],
    correctIndex: 1,
    explanation:
      "Results+Learnings me ek memorable outcome number (jaise ~$1/month cost) aur ek genuine reflection ('serverless me operational thinking kam nahi hoti, shift hoti hai') hota hai — dono strong signals hain jo interviewer specifically sunta hai. Option A galat hai, ye segment sabse short hai. Option C galat hai kyunki architecture-only pitch incomplete lagta hai. Option D bhi galat hai — ye segment sabhi candidates ke liye equally valuable hai.",
    difficulty: "easy",
  },
];

export default quiz;
