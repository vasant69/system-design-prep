import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "first-controller-and-get-endpoint-1",
    question:
      "Hamare JSON Employee API ke controller ko kaunsi base class se inherit karna chahiye, aur kyun?",
    options: [
      "Controller — kyunki usme Ok() aur NotFound() helpers hote hain",
      "ControllerBase — API helpers deta hai (Ok, NotFound, CreatedAtAction) bina View/Razor machinery ke",
      "ApiController — ye ek base class hai jo sab kuch handle kar deti hai",
      "Object — controller ko kisi base class ki zaroorat nahi",
    ],
    correctIndex: 1,
    explanation:
      "ControllerBase API ke liye hai — usse Ok(), NotFound(), CreatedAtAction(), ModelState, User milte hain, par koi View rendering nahi. Controller usko extend karke View(), ViewBag, TempData add karta hai jo sirf HTML/Razor pages ke liye hai — JSON API me wo dead weight hai. ApiController koi base class nahi, wo ek attribute hai. Bina base class ke Ok()/NotFound() helpers nahi milte.",
    difficulty: "easy",
  },
  {
    id: "first-controller-and-get-endpoint-2",
    question:
      "In-memory demo list `private readonly List<Employee> _employees` (bina static) rakhi gayi. Module 2 me POST add karne par kya symptom dikhega?",
    options: [
      "POST compile hi nahi hoga",
      "POST 500 error dega",
      "POST 201 dega par turant GET karne par naya record gaayab hoga",
      "Sab theek chalega, static aur non-static me koi farak nahi",
    ],
    correctIndex: 2,
    explanation:
      "Har request ek naya controller instance banati hai. Instance field wali list har request pe seed records ke saath dobara banti hai, isliye pichhli request ka Add() agli request me dikhta hi nahi — POST 201 deta hai par agla GET sirf seed records dikhata hai. static list process me ek hi baar banti hai aur sab requests use share karti hain. Compile theek hota hai aur koi exception nahi, isliye 500 bhi nahi.",
    difficulty: "medium",
  },
  {
    id: "first-controller-and-get-endpoint-3",
    question:
      "[ApiController] attribute lagane se ek POST action me invalid request body aane par kya hota hai?",
    options: [
      "Action chalti hai aur employee parameter null hota hai",
      "Framework action chalne se pehle 400 Bad Request + problem-details JSON return karta hai",
      "Kuch nahi — tumhe khud ModelState.IsValid check karna padta hai",
      "Request 500 Internal Server Error deti hai",
    ],
    correctIndex: 1,
    explanation:
      "[ApiController] automatic model validation on karta hai — invalid body (missing required field, type mismatch, malformed JSON) par action chalne se PEHLE 400 + standard problem-details JSON chala jaata hai. Isliye action ke andar if (!ModelState.IsValid) return BadRequest(...) likhne ki zaroorat nahi. Bina [ApiController] ke tumhe wo check khud likhna padta. Ye 500 nahi, client-error 400 hai.",
    difficulty: "medium",
  },
  {
    id: "first-controller-and-get-endpoint-4",
    question:
      "Route template `api/[controller]` me `[controller]` token EmployeesController ke liye kya resolve karta hai, aur literal `api/employees` ke mukable iska ek risk kya hai?",
    options: [
      "api/EmployeesController — aur koi risk nahi",
      "api/employees — risk: class rename (jaise StaffController) karne par client URLs chup-chaap toot jaate hain",
      "api/employee — risk: ye singular ban jaata hai",
      "Kuch nahi resolve karta — [controller] sirf Minimal API me chalta hai",
    ],
    correctIndex: 1,
    explanation:
      "[controller] token class ke naam se Controller suffix hata ke lowercase kar deta hai: EmployeesController -> employees, to route api/employees. Ye DRY hai par risk ye hai ki URL ek public contract hai — agar koi class ko StaffController rename kare to route api/staff ban jaata hai aur saare purane client URLs bina warning ke toot jaate hain. Literal string is se bandha nahi.",
    difficulty: "medium",
  },
];

export default quiz;
