import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dt-1",
    question: "2PC (Two-Phase Commit) mein coordinator phase 1 (prepare) complete kar leta hai — sab participants ne 'yes' vote kar diya hai aur resources lock kar rakhe hain — lekin phase 2 ka commit message bhejne se pehle hi coordinator crash ho jaata hai. Kya hota hai?",
    options: [
      "Participants automatically apna transaction abort kar dete hain kuch second mein",
      "Participants apne locked resources ke saath indefinitely stuck reh sakte hain jab tak coordinator wapas na aaye ya recovery na ho — isi wajah se 2PC ko 'blocking protocol' kaha jaata hai",
      "Participants apna transaction automatically commit kar dete hain assume karke ki sab theek hoga",
      "Yeh problem 2PC mein hoti hi nahi, coordinator failure automatically handle ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Yeh 2PC ki sabse badi real-world weakness hai — participants ko pata nahi hota commit karna hai ya abort, isliye woh apne locks release nahi kar sakte jab tak unhe definitive instruction na mile. Yeh unhe indefinitely blocked rakh sakta hai. Automatic abort (A) ya automatic commit (C) dono galat hain kyunki participant ko pata hi nahi ki baaki participants ne kya decide kiya — woh guess nahi kar sakta safely. Yeh problem 2PC ka well-known, real limitation hai, automatically handle nahi hoti (D galat).",
    difficulty: "medium",
  },
  {
    id: "dt-2",
    question: "E-commerce order flow mein Payment aur Inventory dono successfully commit ho chuke hain, lekin Shipping step fail ho jaata hai (invalid address). Saga pattern mein isko kaise handle kiya jaata hai?",
    options: [
      "Ek database-level rollback trigger hota hai jo Payment aur Inventory ke changes automatically undo kar deta hai",
      "Explicit compensating transactions trigger hoti hain — jaise Inventory reservation cancel karna (stock wapas add) aur Payment refund karna — yeh naye, intentional 'undo' business operations hain, database rollback nahi",
      "Kuch nahi hota, Shipping failure ko ignore kar diya jaata hai aur order 'confirmed' hi rehta hai",
      "Poora order automatically retry hota hai jab tak Shipping succeed na ho jaaye, Payment/Inventory unchanged rehte hain",
    ],
    correctIndex: 1,
    explanation:
      "Saga mein pichle steps already independently committed ho chuke hote hain (apne local databases mein), isliye unhe traditional database rollback se undo nahi kiya ja sakta. Iske bajaye explicit compensating transactions trigger hoti hain — refund karna, stock wapas add karna — jo forward-moving business operations hain jo effect ko reverse karte hain. Database rollback (A) yahan applicable nahi hai kyunki commits already independent hain. Failure ko ignore karna (C) data inconsistency chhod dega. Sirf blind retry (D) address invalid hone ki wajah se kaam nahi karega bina user intervention ke, aur Payment/Inventory ko unaddressed chhodna galat hoga.",
    difficulty: "easy",
  },
  {
    id: "dt-3",
    question: "Choreography-based saga aur orchestration-based saga mein fundamental difference kya hai, aur bade complex flows (5+ steps) ke liye kaunsa generally prefer kiya jaata hai?",
    options: [
      "Choreography mein events use hote hain, orchestration mein direct database calls — dono equally scalable hain complexity ke hisaab se",
      "Choreography mein har service events sunke independently react karta hai (no central coordinator), orchestration mein ek central orchestrator explicitly har step command karta hai — complex flows ke liye orchestration prefer hota hai kyunki poora flow ek jagah explicit/debuggable hota hai",
      "Orchestration purane systems ke liye hai, choreography naye microservices ke liye — modern systems hamesha choreography use karte hain",
      "Dono approaches identical hain, sirf naming difference hai",
    ],
    correctIndex: 1,
    explanation:
      "Choreography mein services events publish/subscribe karke react karte hain bina kisi central controller ke — simple flows ke liye achha hai lekin complex flows mein 'kaun kis event pe react karta hai' trace karna mushkil ho jaata hai. Orchestration mein ek central orchestrator explicitly commands deta hai, jisse poora flow ek jagah visible/debuggable hota hai — isliye complex flows ke liye zyada prefer hota hai. Dono database calls use nahi karte, events/messaging use karte hain (A galat premise). Yeh purane-vs-naye ka matter nahi hai (C galat), aur dono approaches genuinely different trade-offs rakhte hain (D galat).",
    difficulty: "medium",
  },
  {
    id: "dt-4",
    question: "Ek candidate interview mein bolta hai: '2PC hum production microservices system mein use karenge kyunki yeh strong consistency deta hai.' Yeh answer kyun incomplete/problematic hai?",
    options: [
      "2PC actually consistency deta hi nahi hai, yeh sirf availability ke liye hai",
      "2PC strong atomicity to deta hai, lekin coordinator failure ke case mein participants ko indefinitely blocked kar sakta hai aur locks hold karke throughput/availability ko badly hurt karta hai — isliye large-scale microservices systems mein yeh practical nahi hai aur Saga zyada common hai",
      "2PC sirf single-service systems ke liye design kiya gaya tha, multi-service ke liye kabhi kaam hi nahi karta",
      "Yeh answer bilkul sahi hai, koi problem nahi hai isme",
    ],
    correctIndex: 1,
    explanation:
      "Yeh answer theoretically sahi hai (2PC strong consistency deta hai) lekin practically incomplete hai — 2PC ki blocking nature (coordinator crash se participants stuck) aur scalability cost (locks held during full 2-phase process) ko address nahi karta, jo exactly wahi reasons hain jinki wajah se large-scale systems Saga prefer karte hain. 2PC consistency deta hai, yeh galat hai bolna ki nahi deta (A). 2PC technically multi-service ke liye hi design hua tha, 'kabhi kaam nahi karta' overstatement hai (C) — yeh kaam karta hai, bas scale pe practical nahi hai. Yeh answer incomplete hai, poori tarah correct nahi (D galat).",
    difficulty: "hard",
  },
];

export default quiz;
