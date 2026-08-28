import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "authorize-roles-policies-claims-1",
    question:
      "Ek policy me do requirements hain, aur ek requirement ke do handlers registered hain. Authorization kab succeed karti hai?",
    options: [
      "Jab dono requirements me se koi ek satisfy ho jaaye",
      "Jab dono requirements satisfy hon; ek requirement satisfy hota hai agar uske do handlers me se koi ek context.Succeed kare",
      "Jab dono requirements ke saare handlers context.Succeed karein",
      "Jab koi bhi ek handler context.Succeed kare, requirements ka farak nahi padta",
    ],
    correctIndex: 1,
    explanation:
      "Requirements AND ki tarah combine hote hain — sab satisfy hone chahiye. Ek requirement ke multiple handlers OR ki tarah — koi ek context.Succeed kar de to wo requirement met. Isliye 'dono requirements met, aur har requirement ke liye kam se kam ek handler succeed' sahi hai. Baaki options ya AND/OR ulta karte hain ya requirements ko ignore karte hain.",
    difficulty: "hard",
  },
  {
    id: "authorize-roles-policies-claims-2",
    question:
      "Tumne ek custom IAuthorizationRequirement aur uska AuthorizationHandler likha, policy me requirement add kiya, par har request 403 de rahi hai bina kisi error ke. Sabse likely wajah?",
    options: [
      "Handler ko Program.cs me AddScoped<IAuthorizationHandler, TheHandler>() se register nahi kiya",
      "Requirement class me koi property nahi hai",
      "Policy ka naam attribute me galat spell hua hai jo build fail karega",
      "AuthorizationHandler ko sealed banana zaroori tha",
    ],
    correctIndex: 0,
    explanation:
      "Handler DI me register na ho to wo kabhi instantiate/run nahi hota, requirement kabhi context.Succeed nahi paata, aur authorization silently fail (403) hoti hai — koi exception nahi. Requirement bina property ke (marker) bilkul valid hai. Galat policy naam runtime InvalidOperationException deta hai, build fail nahi. sealed optional hai.",
    difficulty: "medium",
  },
  {
    id: "authorize-roles-policies-claims-3",
    question:
      "'Ek employee sirf apna record padh sake, HR sabka' — is rule ke liye best approach kaunsa hai?",
    options: [
      "Endpoint pe [Authorize(Roles = Employee)] laga do",
      "Ek RequireClaim policy bana do jo employeeId claim check kare",
      "Action ke andar entity load karke IAuthorizationService.AuthorizeAsync(User, entity, policy) ya ek inline owner-check karo",
      "Client se aaye request body ke ownerId field pe bharosa karo",
    ],
    correctIndex: 2,
    explanation:
      "Decision specific entity (jo id maanga gaya) pe depend karta hai, isliye ye resource-based authorization hai — attribute ke paas entity nahi hoti. Action me entity load karke AuthorizeAsync ya owner-check sahi hai. Sirf role attribute ownership enforce nahi karta. RequireClaim entity se compare nahi kar sakta. Client body trust karna security hole hai.",
    difficulty: "medium",
  },
  {
    id: "authorize-roles-policies-claims-4",
    question:
      "[AllowAnonymous] ke baare me kaunsa statement sahi hai?",
    options: [
      "Wo sirf tab kaam karta hai jab controller pe koi [Authorize] na ho",
      "Wo controller-level aur globally lage [Authorize] dono ko us action ke liye override kar deta hai",
      "Wo 401 ki jagah 403 return karwata hai",
      "Wo authentication middleware ko poori tarah skip kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "[AllowAnonymous] har [Authorize] ko override karta hai — chahe wo action pe ho, controller pe, ya globally added ho. Isi liye login/register/health pe lagta hai. Wo status code ke baare me nahi hai, aur authentication middleware phir bhi chalta hai (agar token hai to User populate hota hai) — bas authorization requirement enforce nahi hoti.",
    difficulty: "easy",
  },
];

export default quiz;
