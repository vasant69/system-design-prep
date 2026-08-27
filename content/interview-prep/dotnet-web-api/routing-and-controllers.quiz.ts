import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "routing-and-controllers-1",
    question: "Web API projects me attribute routing conventional routing se zyada common kyun hai?",
    options: [
      "Attribute routing sirf GET requests handle kar sakta hai",
      "Route explicitly method ke upar visible hota hai aur REST-style nested resource URLs naturally express hoti hain",
      "Conventional routing .NET 8 me completely remove kar diya gaya hai",
      "Attribute routing automatically Swagger documentation generate karta hai jo conventional routing nahi kar sakta",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — attribute routing me route template directly method ke upar likha hota hai jisse dhoondhna asaan hota hai, aur nested REST resources jaise api/orders/{orderId}/items/{itemId} naturally express hoti hain. Option 1 galat hai, attribute routing sab verbs support karta hai. Option 3 galat hai, conventional routing abhi bhi available hai MVC views apps ke liye. Option 4 galat hai, Swagger generation routing style pe depend nahi karta.",
    difficulty: "easy",
  },
  {
    id: "routing-and-controllers-2",
    question: "Route template `api/orders/{id:int}` hai aur request `GET api/orders/abc` aata hai. Kya response milega?",
    options: [
      "400 Bad Request, kyunki action method chalta hai aur validation fail hoti hai",
      "404 Not Found, kyunki route constraint match hi nahi hota aur action method call hi nahi hota",
      "200 OK with an empty body",
      "500 Internal Server Error kyunki type conversion exception throw hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — route constraint (:int) routing stage pe hi format check karta hai; 'abc' int nahi hai, isliye route match hi fail ho jaata hai aur action method kabhi invoke hi nahi hota, result 404 hota hai. Option 1 galat hai kyunki action chalta hi nahi. Option 3 aur 4 ASP.NET Core ke actual behavior se match nahi karte.",
    difficulty: "medium",
  },
  {
    id: "routing-and-controllers-3",
    question: "Web API controllers ControllerBase se inherit karte hain, Controller se nahi. Iska primary reason kya hai?",
    options: [
      "ControllerBase faster hai runtime performance ke liye",
      "Controller class me view-rendering support (View(), ViewBag) hota hai jo Web APIs ko chahiye hi nahi",
      "ControllerBase automatically HTTPS enforce karta hai",
      "Controller class .NET 8 me deprecated ho chuki hai",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — Controller, ControllerBase ko extend karke view-rendering functionality (View(), PartialView(), ViewData/ViewBag) add karta hai jo sirf MVC views apps me relevant hai; Web APIs ko sirf data responses (JSON) chahiye, isliye ControllerBase sufficient aur cleaner intent hai. Option 1, 3, aur 4 factually incorrect hain.",
    difficulty: "medium",
  },
  {
    id: "routing-and-controllers-4",
    question: "[ApiController] attribute ek Web API controller class pe lagane se kya automatically enable hota hai?",
    options: [
      "Sirf Swagger UI generation",
      "Automatic 400 response on invalid ModelState, [FromBody] inference, aur binding source inference",
      "Sirf HTTPS redirection",
      "Database connection pooling",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai — [ApiController] attribute kaafi useful defaults enable karta hai: model validation fail hone pe automatic 400 response, complex type parameters ke liye [FromBody] inference, aur overall binding source inference jo boilerplate kam karta hai. Options 1, 3, aur 4 in se related nahi hain — wo alag configuration se aate hain (AddSwaggerGen, UseHttpsRedirection, DbContext setup respectively).",
    difficulty: "easy",
  },
];

export default quiz;
