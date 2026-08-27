import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "model-binding-and-validation-1",
    question: "Controller class pe [ApiController] laga hai aur ek POST action ka [FromBody] parameter DataAnnotations validation fail karta hai. Kya hoga?",
    options: [
      "Action method body normally run hota hai, andar manually ModelState check karna padta hai",
      "Automatically 400 Bad Request return hota hai ValidationProblemDetails ke saath, action body kabhi run nahi hota",
      "500 Internal Server Error aata hai kyunki validation ek unhandled exception throw karti hai",
      "Request silently ignore ho jaati hai, koi response nahi bhejta",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — [ApiController] attribute model validation failure pe automatically 400 Bad Request return kar deta hai RFC 7807-shaped ValidationProblemDetails ke saath, action method body us case me kabhi execute hi nahi hota. Option 1 galat hai kyunki manual check redundant ho jaata hai [ApiController] ke saath. Option 3 aur 4 ASP.NET Core ke actual behavior se match nahi karte.",
    difficulty: "medium",
  },
  {
    id: "model-binding-and-validation-2",
    question: "DataAnnotations validation attributes (Required, Range, RegularExpression) kis type ki validation cover karte hain?",
    options: [
      "Sirf structural/format validation -- business rules jaise database state checks cover nahi hoti",
      "Business rules bhi automatically validate ho jaate hain, jaise stock availability",
      "Sirf authentication aur authorization checks",
      "Database-level foreign key constraints",
    ],
    correctIndex: 0,
    explanation:
      "Sahi jawab option 1 hai — DataAnnotations sirf structural/format checks karte hain jo model ki properties pe hi based hote hain (required field, range, regex pattern). Business rules jo external state (database, other services) pe depend karte hain unhe explicitly action ya service layer code me check karna padta hai. Options 2, 3, aur 4 galat hain kyunki ye DataAnnotations ka scope nahi hai.",
    difficulty: "easy",
  },
  {
    id: "model-binding-and-validation-3",
    question: "Ek action method me do parameters ko [FromBody] attribute lagane ki koshish karo to kya hota hai?",
    options: [
      "Dono parameters correctly populate ho jaate hain JSON body ke different sections se",
      "Runtime error aata hai kyunki HTTP request body stream sirf ek baar read ho sakta hai -- ek combined DTO use karna sahi approach hai",
      "Pehla parameter populate hota hai, doosra hamesha null rehta hai bina kisi error ke",
      "Compile-time error aata hai",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — HTTP request body ek stream hai jo sirf ek baar read ho sakta hai, isliye sirf ek parameter ko [FromBody] se bind kiya ja sakta hai; multiple [FromBody] parameters try karne pe runtime error aata hai. Sahi solution ek wrapper DTO banana hai jisme saari zaroori fields ho. Options 1, 3, aur 4 actual behavior describe nahi karte.",
    difficulty: "medium",
  },
  {
    id: "model-binding-and-validation-4",
    question: "Cross-field validation (jaise EndDate hamesha StartDate se baad honi chahiye) implement karne ka better approach kaunsa hai?",
    options: [
      "Ek single-property ValidationAttribute jo sirf EndDate property pe lage",
      "IValidatableObject interface class-level implement karna, jahan poore object ki properties ek saath accessible hoti hain",
      "[Required] attribute dono properties pe lagana",
      "Route constraint use karna jaise {endDate:mindate}",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — IValidatableObject class-level interface implement karne se Validate() method ke andar poore object ki saari properties ek saath accessible hoti hain, jisse cross-field comparisons clean tarike se ho sakte hain. Option 1 galat hai kyunki single-property attribute ko doosri property tak easy access nahi milta us pattern me. Option 3 sirf presence check karta hai, comparison nahi. Option 4 aisa koi built-in route constraint exist nahi karta.",
    difficulty: "medium",
  },
];

export default quiz;
