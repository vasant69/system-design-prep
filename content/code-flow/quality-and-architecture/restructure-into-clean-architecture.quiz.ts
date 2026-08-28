import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "restructure-into-clean-architecture-1",
    question:
      "Clean Architecture ka core 'Dependency Rule' kya kehta hai?",
    options: [
      "Har project ko har doosre project ka reference hona chahiye taaki code share ho sake",
      "Saari source-code dependencies andar, Domain ki taraf point karti hain; Domain kisi framework par depend nahi karta",
      "Domain project ko Infrastructure ka reference hona chahiye taaki repository implementations mil sakein",
      "Api project me koi business logic nahi, sirf Infrastructure me",
    ],
    correctIndex: 1,
    explanation:
      "Dependency Rule: dependencies inward point karti hain, Domain sabse andar aur framework-free. Option 1 galat hai — mutual references circular dependency banate hain. Option 3 ulta hai — interface Domain me, implementation Infrastructure me, isliye Domain ko Infrastructure ka ref nahi chahiye. Option 4 galat hai — business logic Application/Domain me hoti hai, Infrastructure me nahi.",
    difficulty: "easy",
  },
  {
    id: "restructure-into-clean-architecture-2",
    question:
      "`IEmployeeRepository` interface kis project me rakhni chahiye aur uska EF Core implementation `EmployeeRepository` kahan?",
    options: [
      "Dono Infrastructure me — interface aur implementation saath rehne chahiye",
      "Interface Domain (ya Application) me, implementation Infrastructure me",
      "Dono Api me, kyunki controller wahi use karta hai",
      "Interface Infrastructure me, implementation Domain me",
    ],
    correctIndex: 1,
    explanation:
      "Dependency Inversion: abstraction (interface) andar Domain/Application me, detail (EF Core implementation) bahar Infrastructure me. Isse Application ko Infrastructure ka reference nahi chahiye. Option 1 aur 4 dependency direction ulti kar dete hain; option 3 controller ke saath persistence contract mix kar deta hai.",
    difficulty: "medium",
  },
  {
    id: "restructure-into-clean-architecture-3",
    question:
      "Ek developer `EmployeeManagement.Domain.csproj` me `Microsoft.EntityFrameworkCore` PackageReference add kar deta hai 'thodi mapping ke liye'. Sabse bada long-term risk kya hai?",
    options: [
      "Build thoda slow ho jaayega, aur kuch nahi",
      "Domain framework-bound ho jaata hai — persistence ya ORM badalna ab poore Domain ko touch karta hai, jo Clean Architecture ka pura point khatam kar deta hai",
      "EF Core ka koi asar nahi kyunki wo sirf runtime par load hota hai",
      "Api project compile hona band ho jaayega",
    ],
    correctIndex: 1,
    explanation:
      "Domain ka framework-free hona hi wo cheez hai jo provider/ORM swaps ko localized rakhti hai. Ek baar EF Core ghusa, entities EF ki assumptions (proxies, navigation nullability) maangne lagti hain aur Dapper/PostgreSQL par shift mushkil ho jaata hai. Mapping `IEntityTypeConfiguration` me Infrastructure ke andar rakhni chahiye. Slow build (option 1) minor hai; option 3 aur 4 galat hain.",
    difficulty: "medium",
  },
  {
    id: "restructure-into-clean-architecture-4",
    question:
      "Kis situation me Clean Architecture ka 4-project split sabse zyada likely over-engineering hai?",
    options: [
      "Ek BFSI microservice jise API, ek background worker, aur ek scheduled job teeno same business logic share karte hain",
      "Ek 3-endpoint internal cafeteria-booking tool, solo developer, 2-week timeline, simple CRUD",
      "Ek 40-team-member product jahan persistence provider RBI norms ke chalte badal sakta hai",
      "Ek loan-origination service jisme audit-able business rules framework se isolate rakhne hain",
    ],
    correctIndex: 1,
    explanation:
      "Clean Architecture ka cost (boilerplate, slow build, 'ye kahan rakhoon' friction) tab justify hota hai jab multiple entry points, provider-change ka realistic chance, badi team, ya compliance ho — options 1, 3, 4. Ek chhote solo throwaway CRUD tool me 4 projects sirf friction hai; single project + folders sahi choice hai.",
    difficulty: "easy",
  },
];

export default quiz;
