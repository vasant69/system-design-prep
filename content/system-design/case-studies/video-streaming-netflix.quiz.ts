import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "vsn-1",
    question: "Adaptive Bitrate Streaming (ABR) mein quality-switching decision actually kaun leta hai?",
    options: [
      "Server, jo har request pe client ka bandwidth measure karke bitrate assign karta hai",
      "CDN edge node, jo automatically quality downgrade karta hai load ke basis pe",
      "Client player, jo apna measured throughput aur buffer health dekh kar agla segment ki quality khud choose karta hai",
      "Load balancer, jo round-robin se alag-alag bitrate renditions assign karta hai",
    ],
    correctIndex: 2,
    explanation:
      "ABR poori tarah client-driven hai — player khud apna achieved throughput aur buffer occupancy measure karta hai aur agle segment ke liye best possible quality choose karta hai. Server (A) sirf renditions available karta hai, decision nahi leta. CDN edge (B) sirf cached files serve karta hai, koi decision logic nahi rakhta. Load balancer (D) ka is decision se koi lena-dena nahi hai.",
    difficulty: "medium",
  },
  {
    id: "vsn-2",
    question: "Video transcoding pipeline ko synchronous (request-time) ke bajaye async batch job kyun design kiya jaata hai?",
    options: [
      "Kyunki users VOD content dekhne se pehle wait nahi karna chahte, aur transcoding compute-heavy/slow hai (minutes se ghante)",
      "Kyunki synchronous transcoding technically possible hi nahi hai kisi bhi system mein",
      "Kyunki async jobs hamesha cheaper hote hain compute cost mein, isliye hi karte hain",
      "Kyunki CDN sirf async-generated files ko cache kar sakta hai",
    ],
    correctIndex: 0,
    explanation:
      "Transcoding CPU-heavy aur slow operation hai — ek movie ki poori bitrate ladder banane mein compute-minutes se ghante lag sakte hain, isliye yeh upload ke baad async pipeline mein hoti hai, playback request se pehle hi complete. Yeh technically possible hai synchronously bhi (B galat), cost sirf ek factor hai, main reason latency hai (C incomplete/galat framing), aur CDN caching ka async/sync se direct connection nahi hai (D galat).",
    difficulty: "easy",
  },
  {
    id: "vsn-3",
    question: "Origin shield layer ka primary purpose kya hai video streaming architecture mein?",
    options: [
      "User ke device pe local caching karna taaki offline playback ho sake",
      "Video quality ko encrypt karna DRM ke liye",
      "Ek naye popular release pe aane wale lakhon simultaneous cache-miss requests ko coalesce karke origin ko thundering herd se bachana",
      "ABR algorithm ko client-side run karne se rokna",
    ],
    correctIndex: 2,
    explanation:
      "Origin shield edge aur true origin ke beech baithta hai — jab ek hot naya title release hota hai aur lakhon requests same content maangte hain, shield unhe coalesce karke origin ko sirf ek baar hit karta hai, baaki request wahin se serve hoti hain. Yeh user-device caching nahi hai (A galat), DRM se seedha lena-dena nahi (B galat), aur ABR client-side hi rehta hai origin shield ke bawajood (D galat premise hai).",
    difficulty: "medium",
  },
  {
    id: "vsn-4",
    question: "Hotstar ka live IPL streaming, Netflix ke VOD streaming se fundamentally kyun harder hai?",
    options: [
      "Kyunki live video ki resolution hamesha 4K hoti hai jabki VOD kam resolution mein hoti hai",
      "Kyunki live content ko pre-transcode ya pre-cache nahi kiya ja sakta (abhi generate ho raha hai), aur traffic spike ek predictable time (match start) pe achanak, extreme scale mein aata hai",
      "Kyunki live streaming HTTP use nahi karta, sirf VOD HTTP-based hota hai",
      "Kyunki live streaming mein CDN ki zaroorat hi nahi padti",
    ],
    correctIndex: 1,
    explanation:
      "Live ka core difficulty yeh hai ki content real-time generate ho raha hai isliye pre-processing/pre-caching possible nahi, aur viewership spike ek fixed predictable moment (jaise toss/match start) pe minutes ke andar extreme scale tak pahunchta hai, jiske liye proactive pre-scaling chahiye hoti hai. Resolution (A) koi fundamental difference nahi hai. Live streaming bhi HTTP-based hi hota hai (HLS/DASH), C galat hai. Live streaming ko bhi CDN chahiye hoti hai fan-out ke liye (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
