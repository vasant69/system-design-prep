import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "rest-semantics-1",
    question: "Kaunsa HTTP verb by definition idempotent NAHI hai?",
    options: ["GET", "PUT", "DELETE", "POST"],
    correctIndex: 3,
    explanation:
      "POST typically ek naya resource create karta hai — same request N baar bhejne se N alag resources ban sakte hain (bina explicit idempotency-key mechanism ke). GET (read-only), PUT (full replace), aur DELETE (remove) teeno idempotent hain — repeat calls final server state ko same rakhte hain.",
    difficulty: "easy",
  },
  {
    id: "rest-semantics-2",
    question: "Ek POST request valid JSON bhejti hai lekin `quantity: -5` (business rule ke against, negative quantity allowed nahi hai). Sabse precise status code kaunsa hai?",
    options: [
      "400 Bad Request",
      "422 Unprocessable Entity",
      "409 Conflict",
      "500 Internal Server Error",
    ],
    correctIndex: 1,
    explanation:
      "Request syntactically valid hai (well-formed JSON, correct types), lekin semantically ek business rule violate karti hai — ye exactly 422 Unprocessable Entity ka use case hai. 400 (Option A) structural/malformed request errors ke liye hai, jo yahan case nahi hai. 409 (Option C) resource-state-conflict ke liye hai, applicable nahi. 500 (Option D) server-side unexpected error ke liye hai, ye ek expected validation failure hai.",
    difficulty: "medium",
  },
  {
    id: "rest-semantics-3",
    question: "`DELETE /orders/5` pehli baar call hone par order delete hota hai (204 response). Dusri baar same request bheja jaata hai. Idempotency ka matlab yahan kya guarantee karta hai?",
    options: [
      "Dusri call bhi exactly same response (204) dena chahiye, warna idempotency broken hai",
      "Server ki final state ('order 5 doesn't exist') consistent rehti hai — response code (jaise 404 dusri baar) alag ho sakta hai",
      "DELETE verb sirf ek baar hi call kiya ja sakta hai, dusri baar error hoga hamesha",
      "DELETE actually idempotent nahi hai, ye ek common misconception hai",
    ],
    correctIndex: 1,
    explanation:
      "Idempotency ka guarantee resulting server STATE ke baare me hai, exact HTTP response ke baare me nahi. Pehli DELETE call resource remove karti hai (204); dusri call same 'already gone' state confirm karti hai, chahe response 404 ho. State ek hi jagah settle hoti hai ('resource doesn't exist'), isliye DELETE idempotent hai. Option A galat hai — response identical hone ki guarantee nahi hai. Option D factually galat hai.",
    difficulty: "hard",
  },
  {
    id: "rest-semantics-4",
    question: "Payment-creating endpoint pe duplicate-charge risk (network timeout ke baad client retry) ko kaise mitigate karte hain, given ki POST idempotent nahi hai?",
    options: [
      "POST ko PUT me convert kar dete hain",
      "Client-generated Idempotency-Key header use karte hain jise server track karke duplicate requests ko original response wapas deta hai",
      "Client ko kabhi retry nahi karne dete",
      "Har request ko automatically 2 second delay ke saath process karte hain",
    ],
    correctIndex: 1,
    explanation:
      "Idempotency-Key pattern industry-standard solution hai — client ek unique key generate karta hai request ke saath, server us key ko short-lived store me track karta hai. Agar same key doosri baar aaye (retry), server duplicate operation perform nahi karta, original stored response return kar deta hai. Option A verb semantics ko change kar deta (galat approach, PUT ka apna specific meaning hai). Options C aur D practical solutions nahi hain.",
    difficulty: "hard",
  },
];

export default quiz;
