import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "models-vs-dtos-and-mapping-1",
    question:
      "POST /api/employees ka action `[FromBody] Employee` bind karta hai. Client body me `isActive` aur `salary` bhi bhej deta hai. Isko kya kehte hain aur asli fix kya hai?",
    options: [
      "Under-posting; fix hai `[ApiController]` hata dena",
      "Over-posting (mass assignment); fix hai ek `CreateEmployeeDto` jisme sirf allowed fields ho",
      "Model binding error; fix hai `[FromForm]` use karna",
      "Serialization bug; fix hai `System.Text.Json` ko `Newtonsoft` se replace karna",
    ],
    correctIndex: 1,
    explanation:
      "Poori entity bind karne se client koi bhi entity field set kar sakta hai — yahi over-posting/mass assignment hai. Request DTO me woh field hoti hi nahi, to binder use kahin se le nahi sakta. `[ApiController]` hataane se validation/400 behaviour jaata hai, over-posting nahi rukti. `[FromForm]` sirf content-type badalta hai. Serializer badalne se problem waisi ki waisi.",
    difficulty: "easy",
  },
  {
    id: "models-vs-dtos-and-mapping-2",
    question:
      "DTOs ke liye `record` aur entity ke liye `class` — is choice ki main wajah kya hai?",
    options: [
      "`record` tez compile hota hai",
      "`record` immutable-by-default (`init`) aur value equality deta hai, jo ek request/response payload ke liye sahi hai; entity ko mutable aur EF-trackable rehna hota hai",
      "`class` JSON me serialize nahi hota",
      "`record` me properties nahi ho sakti",
    ],
    correctIndex: 1,
    explanation:
      "DTO ek payload hai jo ban kar aata hai aur badalna nahi chahiye — `record` ka immutability aur value equality yahi fit karta hai. Entity ko service layer aur EF Core mutate/track karte hain, isliye mutable `class`. Compile speed relevant nahi. `class` bhi serialize hota hai. `record` me properties bilkul ho sakti hain (positional ya normal).",
    difficulty: "medium",
  },
  {
    id: "models-vs-dtos-and-mapping-3",
    question:
      "AutoMapper use karte waqt kisi ne `Employee.Salary` ko `AnnualCtc` rename kiya par `EmployeeResponseDto.Salary` waisa hi chhod diya. Sabse likely result?",
    options: [
      "Build compile-time error deta hai rename ki wajah se",
      "AutoMapper startup pe crash karta hai",
      "Koi error nahi; `EmployeeResponseDto.Salary` chup-chaap `0` (default) map hota hai aur runtime pe galat data jaata hai",
      "Response me `salary` field poori tarah gayab ho jaati hai",
    ],
    correctIndex: 2,
    explanation:
      "AutoMapper convention/reflection se map karta hai — source me matching naam na mile to destination member apni default value (`decimal` ke liye `0`) reh jaata hai, koi exception nahi. Isiliye silent mis-map iska bada con hai. `AssertConfigurationIsValid()` kuch cases pakadta hai par har rename nahi. Mapperly jaisa source generator yahan compile-time error deta.",
    difficulty: "hard",
  },
  {
    id: "models-vs-dtos-and-mapping-4",
    question:
      "Ek naye internal-tool project me sirf 4 DTOs hain aur team AutoMapper me fluent nahi hai. Guide ke hisaab se sahi choice?",
    options: [
      "AutoMapper add karo kyunki industry standard hai",
      "Manual mapping (static/extension helpers) — 4 mappings, zero dependency, explicit aur greppable",
      "Har endpoint pe entity hi return karo, mapping ki zaroorat nahi",
      "Reflection se ek generic auto-mapper khud likho",
    ],
    correctIndex: 1,
    explanation:
      "Is scale pe manual mapping 10-minute ka kaam hai, koi package nahi, aur 'ye value kahan se aayi' code me dikhta hai. AutoMapper tab jab boilerplate genuinely dard de aur team ready ho. Entity return karna over-posting/coupling laata hai. Apna reflection mapper likhna AutoMapper ke saare cons plus maintenance bojh.",
    difficulty: "medium",
  },
];

export default quiz;
