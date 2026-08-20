import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "rls-1",
    question:
      "Ek rate limiter ko embedded library (har service instance apna local counter rakhe) ki jagah centralized shared service banane ka sabse bada fayda kya hai?",
    options: [
      "Centralized service kabhi bhi latency add nahi karti",
      "Cross-instance consistent limiting milta hai — kyunki sab instances ek hi shared state dekhte hain, na ki apne alag local counters",
      "Centralized service ko kabhi highly available banane ki zaroorat nahi",
      "Embedded library approach hamesha zyada accurate hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "Centralized service ka core fayda hai ki saare instances ek shared state (jaise Redis) consult karte hain, isliye limit accurately enforce hoti hai chahe kitne bhi service instances ho. Yeh hamesha ek network hop add karti hai (A galat). Isko khud extremely highly available banana hi is design ka sabse critical requirement hai (C galat). Embedded library actually kam accurate hai cross-instance context mein (D galat).",
    difficulty: "easy",
  },
  {
    id: "rls-2",
    question:
      "Redis ka INCR command rate limiter counting ke liye kyun important hai?",
    options: [
      "Kyunki INCR data ko permanently disk par persist karta hai",
      "Kyunki INCR atomic operation hai — read-then-increment ko ek indivisible step mein karta hai, isliye concurrent requests ke beech race condition nahi hoti",
      "Kyunki INCR automatically rate limit value calculate kar deta hai",
      "Kyunki INCR sirf ek single-threaded application mein kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "INCR ek atomic operation hai — agar count check aur increment do separate steps hote, concurrent requests dono ko stale count dikh sakta tha aur actual limit exceed ho sakta tha. Atomicity is race condition ko prevent karti hai. Disk persistence (A) INCR ka core purpose nahi hai. INCR khud limit calculate nahi karta, application logic decide karti hai (C galat). Yeh multi-threaded/multi-client concurrent access ke liye hi design hai (D galat).",
    difficulty: "medium",
  },
  {
    id: "rls-3",
    question:
      "Rate limiter service ke replicas apni high availability ke liye local approximate counting use karte hain instead of har check par shared Redis hit karna. Yeh design choice kya represent karti hai?",
    options: [
      "Ek clear bug jo turant fix karna chahiye",
      "Ek genuine, reasonable trade-off — thodi si accuracy chhod kar lower latency aur better availability paana, kyunki rate limiter ka main purpose overload-protection hai, perfect precision nahi",
      "Yeh sirf tab use hota hai jab company ke paas paisa kam ho Redis infra ke liye",
      "Yeh approach kabhi production mein use nahi hoti",
    ],
    correctIndex: 1,
    explanation:
      "Local approximation ek deliberate latency-vs-accuracy trade-off hai — thodi looseness accept karke better latency aur availability milti hai, jo rate limiter ke actual goal (system ko protect karna) ke liye zyada important hai perfect precision se. Isse bug (A) kehna galat framing hai. Yeh cost ka issue nahi hai (C), balki latency/availability ka. Yeh approach real production systems mein genuinely use hoti hai (D galat).",
    difficulty: "hard",
  },
  {
    id: "rls-4",
    question:
      "Rate limiter service ka backing Redis store down ho jaata hai. 'Fail open' approach lene ka matlab kya hai, aur yeh usually better default kyun mana jaata hai?",
    options: [
      "Saari requests deny kar do jab tak Redis recover na ho — yeh safest hai",
      "Saari requests allow kar do temporarily — kyunki rate limiter ka purpose overload prevent karna hai, khud ek company-wide outage cause karna nahi",
      "Fail open ka matlab hai limiter automatically restart ho jaata hai",
      "Fail open sirf tab applicable hai jab traffic bahut kam ho",
    ],
    correctIndex: 1,
    explanation:
      "Fail open matlab hai backing store down hone par saari requests allow ki jaati hain, taaki rate limiter khud company-wide outage na cause kare — yeh usually safer default hai kyunki iska purpose defensive/protective hona hai, khud failure point banna nahi. Fail closed (A) ka description sahi hai lekin yeh actually zyada risky hai kyunki poori company ki APIs block ho sakti hain. Fail open restart trigger nahi karta (C galat). Yeh traffic volume se independent design choice hai (D galat).",
    difficulty: "medium",
  },
];

export default quiz;
