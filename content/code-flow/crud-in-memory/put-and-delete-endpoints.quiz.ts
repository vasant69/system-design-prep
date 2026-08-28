import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "put-and-delete-endpoints-1",
    question: "PUT /api/employees/7 call hui lekin id 7 store me nahi hai. Sahi response kya hai?",
    options: [
      "200 OK, aur naya employee id 7 ke saath create kar do",
      "404 Not Found",
      "204 No Content, kyunki PUT hamesha success return karta hai",
      "400 Bad Request",
    ],
    correctIndex: 1,
    explanation:
      "Is course ke design me PUT sirf existing resource ko replace karta hai, isliye missing id par 404. Option 1 (naive upsert) ghost records banata hai jab tak API contract explicitly upsert na maange. 204 tabhi jab update actually hua ho. 400 body invalid hone par milta, id-not-found ke liye nahi.",
    difficulty: "easy",
  },
  {
    id: "put-and-delete-endpoints-2",
    question: "DELETE endpoint idempotent hai iska practical fayda kya hai?",
    options: [
      "Response hamesha 200 OK aata hai",
      "Client ne timeout ke baad DELETE retry ki to server state kharab nahi hota — pehli call ne hata diya, agli calls no-op hain",
      "DELETE ke baad resource turant list me wapas aa jaata hai",
      "Ek hi request me multiple resources delete ho sakte hain",
    ],
    correctIndex: 1,
    explanation:
      "Idempotency ka matlab: N identical calls = 1 call jaisa final state. Isliye flaky network par DELETE retry safe hai. 200 vs 204 vs 404 — response code idempotency ka point nahi hai. Resource wapas nahi aata. Multiple delete ka idempotency se koi lena-dena nahi.",
    difficulty: "medium",
  },
  {
    id: "put-and-delete-endpoints-3",
    question: "PUT me client ne body me sirf Email bheja aur baaki fields chhod diye. Full-replace PUT semantics ke hisaab se sahi behaviour kya hai?",
    options: [
      "Sirf Email update ho, baaki fields waise hi rahein",
      "Missing fields ko unki default/empty value maana jaaye — poora resource replace hota hai",
      "Request 500 se fail ho jaaye",
      "Server missing fields ko database se merge kar le",
    ],
    correctIndex: 1,
    explanation:
      "PUT poora resource replace karta hai — jo body me nahi aaya use cleared maana jaata hai. Sirf changed fields update karne wala behaviour PATCH ka hai. Isiliye partial updates ke liye PATCH (JSON Merge Patch / JSON Patch) use karte hain, PUT nahi.",
    difficulty: "medium",
  },
  {
    id: "put-and-delete-endpoints-4",
    question: "BFSI employee/loan data ke liye hard DELETE ke bajaye soft delete kyun preferred hai?",
    options: [
      "Soft delete tez hota hai",
      "Audit aur regulatory requirements ke liye record ka history rakhna zaroori hota hai; row physically hataane se woh evidence gayab ho jaata hai",
      "Soft delete se index chhota rehta hai",
      "Hard DELETE ASP.NET Core me supported nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "BFSI me regulator ko withdrawn/closed records bhi dikhane padte hain, isliye DELETE internally IsActive=false / DeletedAtUtc set karta hai aur list queries by default use exclude karti hain. Performance ya framework limitation wajah nahi hai — hard DELETE bilkul possible hai, bas allowed nahi.",
    difficulty: "easy",
  },
];

export default quiz;
