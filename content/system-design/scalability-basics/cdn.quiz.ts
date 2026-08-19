import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "cdn-1",
    question: "CDN mein anycast routing ka kaam kya hai?",
    options: [
      "Har user ko random ek PoP assign karna",
      "Ek hi IP address ko multiple PoPs se announce karna, taaki network routing layer khud user ki request ko topologically nearest PoP tak bhej de",
      "Sirf origin server ka IP address hide karna",
      "Video ko chhote segments mein todna",
    ],
    correctIndex: 1,
    explanation:
      "Anycast routing mein ek hi IP address duniya bhar ke multiple PoPs par announce hota hai, aur underlying network (BGP) automatically nearest PoP tak request route kar deta hai — yeh random nahi, topology-based hai (A galat). Yeh sirf IP hiding ka mechanism nahi hai (C galat). Video segmentation ek alag concept hai, adaptive streaming se related, anycast se nahi (D galat).",
    difficulty: "medium",
  },
  {
    id: "cdn-2",
    question: "Pull CDN aur push CDN mein core trade-off kya hai?",
    options: [
      "Pull CDN sirf videos ke liye hai, push sirf images ke liye",
      "Pull CDN pehli request par origin se fetch karta hai (simple setup, cold-start penalty on first request per PoP); push CDN content ko proactively pehle se upload karta hai (no cold-start penalty, zyada operational overhead)",
      "Push CDN hamesha slower hota hai pull CDN se",
      "Dono mein koi practical difference nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Pull CDN lazy-loads content on first request (simple lekin har naye PoP ke liye pehli request slow), jabki push CDN content ko origin se proactively edge tak bhej deta hai (cold-start avoid hota hai lekin manage karna zyada kaam hai). Content-type based split (A) galat hai — dono kisi bhi content type ke liye use ho sakte hain. Push hamesha slower (C) galat hai, ulta cold-start avoid karta hai. Trade-off genuinely real hai (D galat).",
    difficulty: "medium",
  },
  {
    id: "cdn-3",
    question: "Ek naya CDN region launch hota hai aur turant hazaaron requests aa jaati hain same popular content ke liye jo abhi tak us naye PoP par cache nahi hua. Origin server ko overwhelm hone se bachaane ka mechanism kya hai?",
    options: [
      "Har PoP ko individually origin se fetch karne dena, yeh apne aap resolve ho jaayega",
      "Origin shielding — ek intermediate shield layer multiple PoPs ke cache-miss requests ko consolidate karta hai, origin ko sirf ek baar (ya bahut kam baar) hit karta hai",
      "Cache-Control header ko no-store set kar dena",
      "CDN provider badal dena",
    ],
    correctIndex: 1,
    explanation:
      "Origin shielding exactly is problem ke liye design hua hai — cache misses ko ek intermediate layer mein consolidate karke origin ko duplicate load se bachaata hai, jo thundering-herd ka distributed-CDN-level version hai. Har PoP ko individually origin hit karne dena (A) hi asli problem hai, solution nahi. no-store (C) actually caching hi disable kar dega, origin load aur badhega. Provider badalna (D) is specific problem ko solve nahi karta.",
    difficulty: "hard",
  },
  {
    id: "cdn-4",
    question: "Kaunsa content type CDN caching ke liye sabse KHARAB fit hai?",
    options: [
      "Static JS/CSS files jo rarely change hoti hain",
      "Ek user ka live, per-user shopping cart data jo har second badal sakta hai",
      "Video streaming segments (HLS/DASH chunks)",
      "Product images",
    ],
    correctIndex: 1,
    explanation:
      "Highly dynamic, per-user personalized data (live shopping cart) CDN caching ke liye worst fit hai — har user ke liye unique hai aur frequently change hoti hai, isliye hit ratio bahut low rahega aur invalidation complexity fayde se zyada hogi. Static assets, video segments, aur images teeno classic strong CDN candidates hain kyunki woh sabhi users ke liye same aur largely immutable hote hain.",
    difficulty: "easy",
  },
];

export default quiz;
