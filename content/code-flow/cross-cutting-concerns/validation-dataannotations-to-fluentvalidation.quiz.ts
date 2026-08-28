import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "validation-dataannotations-to-fluentvalidation-1",
    question:
      "Controller par `[ApiController]` laga hai aur `CreateEmployeeDto` par DataAnnotations. Client `Email` me `abc` bhejta hai. Action method ka code kab chalega?",
    options: [
      "Action chalega, aur andar tumhe khud `ModelState.IsValid` check karna padega",
      "Action bilkul nahi chalega — framework model binding ke baad automatic `400 ValidationProblemDetails` return kar deta hai",
      "Action chalega lekin `dto` `null` hoga",
      "Request `500 Internal Server Error` ban jaayegi kyunki email parse fail hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`[ApiController]` ka ek built-in behaviour hai: model binding ke baad agar `ModelState.IsValid == false` hai to framework action ko call kiye bina hi `400` with RFC 7807 `ValidationProblemDetails` bhej deta hai. Isliye option 1 galat — manual check ki zaroorat nahi. Option 3 galat — binding ho jaati hai, `dto` populated hota hai, bas invalid hai. Option 4 galat — invalid format `400` hai, `500` nahi.",
    difficulty: "easy",
  },
  {
    id: "validation-dataannotations-to-fluentvalidation-2",
    question:
      "`public int DepartmentId` property par `[Required]` laga kar tum expect karte ho ki `0` reject hoga. Kya hoga?",
    options: [
      "`0` reject ho jaayega kyunki `[Required]` har missing value pakadta hai",
      "`0` pass ho jaayega — non-nullable value type ke liye `0` default value hai aur present maana jaata hai; `[Range(1, int.MaxValue)]` ya `int?` chahiye",
      "Compile error aayega — `[Required]` value type par allowed nahi",
      "`0` tabhi reject hoga jab JSON me key bilkul present na ho",
    ],
    correctIndex: 1,
    explanation:
      "`[Required]` non-nullable value type par lagbhag bekaar hai: `int`/`decimal` kabhi null nahi hote, aur `0` unki default value hai jise validator present maanta hai. Sahi tareeke: property ko `int?` banao, ya `[Range(1, int.MaxValue)]` lagao. Option 3 galat — compile hota hai, bas kaam nahi karta. Option 4 galat — key missing ho tab bhi binder `0` set karta hai aur wo present count hoti hai.",
    difficulty: "medium",
  },
  {
    id: "validation-dataannotations-to-fluentvalidation-3",
    question:
      "Naya rule aaya: `Email` DB me pehle se exist nahi karna chahiye. Isko DataAnnotations custom attribute ke andar `repository.EmailExistsAsync(email).Result` se karna kaisa hai?",
    options: [
      "Bilkul theek — `ValidationAttribute` ke andar async call ka yahi tareeka hai",
      "Kharab — `.Result` / `.GetAwaiter().GetResult()` deadlock aur thread-pool starvation ka rasta hai; async uniqueness = FluentValidation `MustAsync`",
      "Theek hai agar attribute par `async` keyword laga do",
      "Theek hai lekin sirf `Development` environment me",
    ],
    correctIndex: 1,
    explanation:
      "DataAnnotations ka `IsValid` sync context hai — DI se repository inject karna bhi seedha possible nahi. Async ko `.Result` se block karna deadlock / thread starvation deta hai. Async DB rule ke liye FluentValidation ka `MustAsync` use karo jo async validation pipeline me chalta hai. Option 3 galat — `ValidationAttribute.IsValid` ko `async` nahi bana sakte. Option 4 galat — environment se koi lena-dena nahi.",
    difficulty: "medium",
  },
  {
    id: "validation-dataannotations-to-fluentvalidation-4",
    question:
      "`CreateEmployeeDtoValidator : AbstractValidator<CreateEmployeeDto>` likh liya, `AddFluentValidationAutoValidation()` bhi laga diya, par `AddValidatorsFromAssemblyContaining<CreateEmployeeDtoValidator>()` register karna bhool gaye. Sabse sambhavit natija?",
    options: [
      "App start pe crash ho jaayega",
      "Validator kabhi resolve hi nahi hota — auto-validation chup-chaap skip ho jaati hai aur invalid requests bina error ke service tak pahunch jaati hain",
      "Har request `400` ban jaati hai kyunki validator missing hai",
      "DataAnnotations rules apne aap double ho jaate hain",
    ],
    correctIndex: 1,
    explanation:
      "`AddValidatorsFromAssemblyContaining<T>()` us assembly ke saare `AbstractValidator` ko DI me scoped register karta hai. Bina iske auto-validation ko koi matching `IValidator<T>` milta hi nahi, wo silently kuch nahi karta, aur galat data (negative salary, duplicate email) service aur DB tak pahunch jaata hai — koi exception nahi, bas bura data. Option 1/3 galat — na crash, na blanket `400`.",
    difficulty: "hard",
  },
];

export default quiz;
