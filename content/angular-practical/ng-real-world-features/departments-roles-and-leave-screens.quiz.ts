import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "departments-roles-and-leave-screens-1",
    question: "Foundation ban jaane ke baad ek nayi plain-CRUD feature (Departments) banane me kya lagta hai?",
    options: [
      "Poora naya table, paginator, modal, aur store from scratch",
      "Roughly ek `Column[]` config + ek store (list-state factory se) + ek reactive form + 3 lazy routes — shared `DataTable`/`Paginator`/`ConfirmModal` reuse karke",
      "Ek naya Angular project",
      "Sirf backend changes",
    ],
    correctIndex: 1,
    explanation:
      "Reusable pieces (table, paginator, modal, list-state factory, CRUD service shape) ban chuke hain, to nayi entity = column config + store + form + routes. 'New feature' ka cost chhota hota hai.",
    difficulty: "easy",
  },
  {
    id: "departments-roles-and-leave-screens-2",
    question: "`*appHasPermission` directive aur `permissionGuard` kis liye hain?",
    options: [
      "Server-side authorization — inke hone se API checks ki zaroorat nahi",
      "Sirf UX — buttons chhupana/dikhana aur routes hide karna; har sensitive API endpoint ko server par independently authorize karna hi hoga (client bypass ho sakta hai)",
      "Data encryption ke liye",
      "Performance optimization ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Frontend permission checks sirf 'button mat dikhao' hain. User Postman se seedha `PATCH /leave/88 { status: 'approved' }` bhej sakta hai. Authorization server par enforce hoti hai.",
    difficulty: "medium",
  },
  {
    id: "departments-roles-and-leave-screens-3",
    question: "Leave Request par Approve/Reject buttons ko kin conditions par dikhana chahiye?",
    options: [
      "Sirf agar user ke paas `leave.approve` permission ho",
      "`hasPermission('leave.approve')` AUR `request.status === 'pending'` — dono; already-approved request par 'Approve' dikhana galat hai",
      "Hamesha, sabko",
      "Sirf request banane wale employee ko",
    ],
    correctIndex: 1,
    explanation:
      "Workflow actions ko role AUR current status dono se gate karo. Sirf role check karne se already-decided requests par bhi buttons dikhenge. Employee ko apni pending request par 'Cancel' dikhta hai, 'Approve' nahi.",
    difficulty: "medium",
  },
  {
    id: "departments-roles-and-leave-screens-4",
    question: "User ke role me permission add hui (backend par). UI me change kab dikhega?",
    options: [
      "Turant, real-time",
      "Jab user ki effective `permissions` signal refresh ho — usually next token refresh ya re-login par; isliye ya to user ko batao ya ek forced refresh trigger karo",
      "Kabhi nahi",
      "Page reload karne par hamesha",
    ],
    correctIndex: 1,
    explanation:
      "`AuthService.permissions` signal login/token se populate hota hai. Backend role change tab tak reflect nahi hoga jab tak wo signal update na ho. UX: 'permissions updated, please re-login' ya ek silent token refresh.",
    difficulty: "medium",
  },
];

export default quiz;
