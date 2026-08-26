import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "healthchecks-1",
    question: "Ek app ka database temporarily unreachable ho jaata hai (network blip, 10 seconds ke liye). Is check ko liveness probe me include kiya gaya tha. Kya hoga?",
    options: [
      "Kuch nahi hoga, liveness probe database checks ko ignore karta hai",
      "Kubernetes container ko restart kar dega, jo database issue ko solve nahi karega",
      "Traffic sirf temporarily rok diya jaayega, container safe rahega",
      "App automatically database se reconnect kar legi bina kisi orchestrator action ke",
    ],
    correctIndex: 1,
    explanation:
      "Liveness probe fail hone par orchestrator ka response hai container ko RESTART karna — ye assumption hai ki process fundamentally stuck hai. Agar database check galti se liveness me hai, ek transient database issue unnecessarily container restart trigger karega, jo database problem ko solve nahi karta aur ulta churn create karta hai. Option C ka behavior readiness probe ke liye sahi hota, liveness ke liye nahi.",
    difficulty: "hard",
  },
  {
    id: "healthchecks-2",
    question: "Readiness probe fail hone par orchestrator ka typical response kya hota hai?",
    options: [
      "Container ko turant restart kar deta hai",
      "Instance ko load balancer rotation se temporarily remove kar deta hai, bina restart kiye",
      "Poori application ko permanently terminate kar deta hai",
      "Koi action nahi leta, sirf log karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Readiness failure ka matlab hai instance abhi traffic serve karne ke liye ready nahi hai (jaise ek dependency temporarily down hai) — orchestrator sirf load-balancer se traffic route karna rok deta hai, container ko restart nahi karta, kyunki restart se ye specific problem solve nahi hoga. Options A, C, D readiness ke actual, intended behavior ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "healthchecks-3",
    question: "Fixed window rate limiting ki 'boundary-burst' weakness kya hai?",
    options: [
      "Ye kabhi kaam nahi karta, fundamentally broken hai",
      "Window ke exact boundary pe, ek client theoretically double rate achieve kar sakta hai — window end se pehle N requests, window start hote hi turant N aur",
      "Ye sirf HTTPS requests pe kaam karta hai",
      "Isme koi weakness nahi hai, ye sabse accurate algorithm hai",
    ],
    correctIndex: 1,
    explanation:
      "Fixed window discrete time buckets use karta hai — agar client window-end ke just pehle N requests bheje aur window-start hote hi turant N aur, effectively 2N requests ek chhote actual time-span me ho sakte hain, jo intended rate se zyada hai. Sliding window ya token bucket is issue ko smooth karte hain. Options A, C, D is specific limitation ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "healthchecks-4",
    question: "Token bucket rate limiting ka main advantage kya hai fixed window ke comparison me?",
    options: [
      "Ye implementation me simpler hai",
      "Ye short bursts ko naturally accommodate karta hai (jab tak tokens available hain) jabki sustained overuse ko still control karta hai",
      "Ye sirf authenticated requests ke liye kaam karta hai",
      "Ye rate limiting ki zaroorat hi khatam kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Token bucket ek accumulating pool of tokens use karta hai jo fixed rate se refill hoti hai — agar bucket full hai (recent low usage ke baad), client ek burst kar sakta hai bina turant reject hue, lekin agar bucket khaali ho jaaye (sustained high usage), further requests throttle ho jaati hain. Ye natural burst-tolerance real-world traffic patterns ke saath better fit hoti hai fixed window ke rigid time-buckets se. Options A, C, D is algorithm ke actual characteristics ko galat represent karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
