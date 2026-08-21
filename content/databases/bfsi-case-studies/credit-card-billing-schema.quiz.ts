import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "ccbill-1",
    question: "Credit card transaction ke liye AUTHORIZED aur SETTLED ko do alag status values kyun rakha jaata hai, ek single 'completed' status ke bajaye?",
    options: [
      "Kyunki database mein ek row pe do baar likhna zaroori hota hai",
      "Kyunki authorization sirf ek hold hota hai available credit pe, jabki actual merchant settlement din baad, alag event ke roop mein hota hai — aur authorization kabhi settle na bhi ho sakti hai",
      "Kyunki har transaction ke liye alag currency track karni padti hai",
      "Kyunki minimum due calculate karne ke liye yeh zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "Authorization aur settlement real card networks mein genuinely alag events hain — authorization ek hold hai jo turant available credit reduce karta hai, lekin actual merchant ko paisa milna (settlement) din baad hota hai, aur agar merchant kabhi batch submit nahi karta, authorization expire ho jaati hai bina settle hue. Options A, C, D is core distinction se unrelated hain.",
    difficulty: "easy",
  },
  {
    id: "ccbill-2",
    question: "'Available credit right now' query ko real-time authorization latency requirement ke saath scale karne ke liye best approach kya hai?",
    options: [
      "Har authorization check pe saari transactions SUM karke balance compute karo",
      "Card table pe ek maintained available_credit column rakho jo har authorization/settlement/expiry pe transactionally update ho",
      "Ek nightly batch job available_credit calculate kare aur cache kare",
      "available_credit ko client-side app mein calculate karo",
    ],
    correctIndex: 1,
    explanation:
      "Ek maintained column O(1) read deta hai (primary key lookup), jo sub-second authorization latency ke liye zaroori hai. Har baar SUM karna (A) history badhne ke saath slow hota jaata hai. Nightly batch (C) stale data dega, real-time authorization ke liye unsafe. Client-side calculation (D) trust nahi kiya ja sakta aur concurrent updates handle nahi karta.",
    difficulty: "medium",
  },
  {
    id: "ccbill-3",
    question: "Do simultaneous swipes ek hi credit card pe, dono terminals se, dono ek stale available_credit read karke approve ho jaate hain, aur combined spend credit limit se upar chala jaata hai. Yeh kaunsa problem hai aur best fix kya hai?",
    options: [
      "Yeh ek network latency issue hai, fix retry logic se hota hai",
      "Yeh lost-update race condition hai — fix: atomic conditional UPDATE (rows-affected check) ya SELECT FOR UPDATE se check-and-mutate ko ek indivisible step banao",
      "Yeh currency conversion ka issue hai, fix multi-currency support add karke hota hai",
      "Yeh sirf ek UI bug hai, backend mein koi fix nahi chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Yeh classic lost-update race condition hai — dono transactions same stale value read karke independently decide karte hain. Fix ek atomic UPDATE ... WHERE available_credit >= amount (rows-affected check) ya explicit SELECT FOR UPDATE lock se hota hai, jo check-and-mutate ko ek indivisible operation banata hai. Options A, C, D is concurrency problem se unrelated hain.",
    difficulty: "hard",
  },
  {
    id: "ccbill-4",
    question: "card_transaction table mein settled_amount ko auth_amount se alag column kyun rakha jaata hai?",
    options: [
      "Kyunki dono columns ka data type alag hota hai",
      "Kyunki settlement amount authorization amount se legitimately differ kar sakta hai — tips, currency conversion, ya partial shipments jaise real cases mein",
      "Kyunki auth_amount sirf testing ke liye use hota hai",
      "Database normalization rules isse mandate karte hain",
    ],
    correctIndex: 1,
    explanation:
      "Real-world cases jaise restaurant tips (final bill authorization se zyada), foreign currency conversion, ya e-commerce partial shipment mein actual settled amount authorization ke time ke amount se alag ho sakta hai. Isliye dono ko alag columns mein rakhna zaroori hai taaki settlement ke time correct extra/less amount handle ho sake. Options A, C, D galat reasoning hain.",
    difficulty: "medium",
  },
];

export default quiz;
