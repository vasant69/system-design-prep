import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "policy-authz-1",
    question: "`[Authorize(Roles = \"Admin,Manager\")]` ka matlab kya hai?",
    options: [
      "User ke paas Admin AUR Manager dono roles hone chahiye",
      "User ke paas Admin YA Manager, koi bhi ek role ho to kaafi hai (OR logic)",
      "Ye invalid syntax hai, compile error dega",
      "Sirf Admin role check hota hai, Manager ignore ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Comma-separated roles Roles parameter me OR logic represent karte hain — koi bhi ek role match kare, authorization pass ho jaata hai. AND logic (dono roles chahiye) ke liye multiple stacked [Authorize] attributes likhne padte hain. Options A, C, D is syntax ke actual behavior ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "policy-authz-2",
    question: "Ek business rule hai: 'user sirf apni khud ki banayi hui order edit kar sakta hai.' Ye kis authorization model se sabse sahi tarike se express hoti hai?",
    options: [
      "Role-based authorization — ek 'OrderOwner' role banao",
      "Resource-based authorization — custom IAuthorizationHandler jo order.CreatedByUserId ko current user se compare kare",
      "Claims-based authorization — user ke claims me sirf order IDs store karo",
      "Ye express hi nahi ho sakti ASP.NET Core ke authorization system se",
    ],
    correctIndex: 1,
    explanation:
      "Ye rule specific resource (is particular order) ki data (CreatedByUserId) pe depend karta hai, na ki sirf user ki static identity pe. Role-based (Option A) ya claims-based (Option C) approaches user ke claims tak limited hain, resource ki state dekh nahi sakte. Resource-based authorization specifically isके liye design hui hai — handler ko actual resource object diya jaata hai comparison ke liye.",
    difficulty: "hard",
  },
  {
    id: "policy-authz-3",
    question: "Resource-based authorization (custom IAuthorizationHandler ke saath) declarative `[Authorize]` attribute se automatically trigger hoti hai kya?",
    options: [
      "Haan, [Authorize(Policy = \"...\")] lagane se ye automatic ho jaati hai",
      "Nahi — resource ko pehle action ke andar fetch karna padta hai, phir explicitly AuthorizationService.AuthorizeAsync() call karni padti hai",
      "Haan, lekin sirf agar resource GET request me query parameter se aaye",
      "Nahi, resource-based authorization ASP.NET Core me support hi nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Resource-based authorization ko resource object chahiye hoti hai evaluate karne ke liye, jo attribute-evaluation-time pe (action invoke hone se pehle) available nahi hota. Isliye ye action code ke andar explicitly call karni padti hai — resource fetch karo, phir AuthorizeAsync(User, resource, policyName) call karo. Options A aur C is mechanism ko galat represent karte hain, D factually galat hai (ye supported feature hai).",
    difficulty: "hard",
  },
  {
    id: "policy-authz-4",
    question: "Ek already-authenticated user ek policy check fail karta hai (jaise MinimumAge policy). Sahi response kya hoga?",
    options: [
      "401 Unauthorized",
      "403 Forbidden",
      "400 Bad Request",
      "500 Internal Server Error",
    ],
    correctIndex: 1,
    explanation:
      "User already authenticated hai — problem authorization me hai, authentication me nahi. Policy check fail hona ek authorization denial hai, jiska sahi response 403 Forbidden hai. 401 (Option A) authentication failure ke liye reserved hai. 400 aur 500 (Options C, D) is scenario se related nahi hain.",
    difficulty: "medium",
  },
];

export default quiz;
