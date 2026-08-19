import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "csw-1",
    question: "Ek chat system mein, jab sender A ka message recipient B tak deliver karna ho aur dono alag chat servers se connected hon, sender ka server sabse pehle kya karta hai?",
    options: [
      "Directly B ke device ko internet pe broadcast karta hai",
      "Presence/routing service se query karta hai ki B abhi kaunsi chat server pe connected hai",
      "Message ko seedha database mein likh deta hai aur bhool jaata hai",
      "B ko ek naya WebSocket connection open karne ke liye force karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Sender ka server pehle presence/routing service (jaise Redis-backed user_id -> server_id map) query karta hai taaki pata chale B ka live connection kis chat server pe hai, phir usi server ko message forward karta hai. Direct broadcast (A) scalable nahi hai. Sirf DB mein likh dena (C) delivery guarantee nahi deta agar B online hai. Naya connection force karna (D) unnecessary hai agar B already connected hai.",
    difficulty: "easy",
  },
  {
    id: "csw-2",
    question: "WhatsApp group chats ko ~1024 members tak cap kyun karta hai, jab fan-out-on-write approach use ho raha ho?",
    options: [
      "Technical limitation hai — encryption sirf 1024 keys tak support karta hai",
      "Fan-out-on-write mein ek message N members ke liye N individual writes/deliveries banata hai — bina cap ke, celebrity-scale unbounded groups mein yeh write amplification catastrophic ho jaata",
      "UI design constraint hai, backend se koi lena dena nahi",
      "Zyada members honge to messages automatically corrupt ho jaate hain",
    ],
    correctIndex: 1,
    explanation:
      "Fan-out-on-write mein har incoming message N writes (ek per member) mein convert hota hai — bounded group size ke andar yeh acceptable cost hai, lekin unbounded (millions) ke liye write load explode kar jaata. Encryption ka key-count se yeh limit nahi (A galat). Yeh purely UI nahi, backend scaling ka core reasoning hai (C galat). Message corruption ka isse koi lena dena nahi (D galat).",
    difficulty: "medium",
  },
  {
    id: "csw-3",
    question: "Agar server sender ko 'message sent' ack bhej deta hai message ko durably persist karne SE PEHLE, sabse bada risk kya hai?",
    options: [
      "Kuch nahi, ack aur persist ka order matter nahi karta",
      "Server crash ho jaaye ack ke baad aur persist se pehle, to message silently lost ho jaata hai bina sender ko pata chale",
      "Message double deliver ho jaayega recipient ko",
      "Recipient ka device automatically crash ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "Agar ack pehle bhej diya aur persist baad mein, us beech ke crash window mein message durably store hi nahi hua — sender ko lagta hai message chala gaya, lekin woh gaayab ho chuka hai. Order genuinely matter karta hai (A galat). Yeh problem duplicate delivery (C) nahi, silent loss create karta hai. Recipient device crash (D) ka is scenario se koi connection nahi hai.",
    difficulty: "hard",
  },
  {
    id: "csw-4",
    question: "Network retry ki wajah se ek hi message sender se do baar bhej diya jaata hai. Isse duplicate messages recipient ko dikhne se rokne ka standard tareeka kya hai?",
    options: [
      "Server har message ko manually admin se verify karwaata hai",
      "Client message create karte waqt ek unique message ID generate karta hai, aur server usi ID par dedup karta hai",
      "Recipient ka app khud decide karta hai kaunsa message asli hai based on timestamp guess",
      "Duplicate messages ko allow kar diya jaata hai, yeh ek acceptable trade-off hai",
    ],
    correctIndex: 1,
    explanation:
      "Client-generated unique message ID (jaise UUID) se server easily dedup kar sakta hai — same ID dobara aaye to woh no-op treat hoti hai, yeh classic idempotency pattern hai. Manual admin verification (A) scale par impossible hai. Timestamp-guessing (C) unreliable hai. Duplicates allow karna (D) poor UX hai aur avoidable bhi hai.",
    difficulty: "medium",
  },
];

export default quiz;
