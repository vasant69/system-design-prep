import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "csproj-nuget-packagereference-tr-1",
    question: "`.csproj` file kya hai aur ye kis engine ka project file hai?",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys"],
    shortAnswer: "MSBuild ka XML project file — target framework, output type, dependencies, aur build settings define karta hai.",
    detailedAnswer:
      "`.csproj` MSBuild (.NET/Visual Studio ka build engine) ka project file hai. Isme `TargetFramework`, `OutputType` (exe/library), aur `PackageReference` entries (dependencies) hote hain. `<Project Sdk=\"...\">` attribute batata hai kaunsa SDK use ho raha hai (Web, Worker, plain), jo default build behavior set karta hai.",
    followUp: "Modern SDK-style aur legacy `.csproj` me kya structural fark hai?",
  },
  {
    id: "csproj-nuget-packagereference-tr-2",
    question: "Modern SDK-style `.csproj` legacy format se structurally kaise alag hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "SDK-style implicitly saari source files include karta hai; legacy format me har file explicitly list karni padti thi.",
    detailedAnswer:
      "Legacy `.csproj` (pre-2017, .NET Framework era) me har `.cs` file `<Compile Include=\"...\">` se manually declare karni padti thi — naya file add karo to project file bhi edit karna padta tha. Modern SDK-style project folder ki saari `.cs` files implicitly compile me include kar leta hai. Isse file bahut chhoti hoti hai aur 'file add karne pe merge conflict' jaisi problems kaafi kam hoti hain.",
  },
  {
    id: "csproj-nuget-packagereference-tr-3",
    question: "NuGet kya hai, aur `PackageReference` ka role isme kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer: "NuGet .NET ka package ecosystem hai; `PackageReference` .csproj ke andar dependencies declare karne ka modern tareeka hai.",
    detailedAnswer:
      "NuGet npm/Maven jaisा .NET ka official package manager hai — public feed (`nuget.org`) ya private company feeds se libraries consume ki jaati hain. `PackageReference` `.csproj` ke ItemGroup ke andar likha jaata hai (`<PackageReference Include=\"X\" Version=\"Y\" />`) aur `dotnet restore` in entries ko padh kar transitive dependencies resolve karta hai global NuGet cache se.",
  },
  {
    id: "csproj-nuget-packagereference-tr-4",
    question: "`PackageReference` model, legacy `packages.config` se kin do concrete tareekon se better hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "(1) Transitive dependencies automatically resolve hoti hain, (2) packages shared global cache me store hote hain, project folder me nahi.",
    detailedAnswer:
      "`packages.config` era me: (1) transitive dependencies bhi explicitly list karni padti thin — agar A, B pe depend karta tha, dono declare karna padta tha. (2) Actual downloaded package files project ke `packages/` folder ke andar physically rehte the, repo bloat karte the. `PackageReference` dono fix karta hai — sirf direct dependencies declare karo, NuGet baaki resolve karta hai, aur packages ek shared `~/.nuget/packages` cache me rehte hain, multiple projects usi cache ko reuse karte hain.",
    followUp: "Reproducible CI builds ke liye ek related feature kya hai?",
  },
  {
    id: "csproj-nuget-packagereference-tr-5",
    question: "`dotnet restore` actually kya karta hai, aur ye kab implicitly chalta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "`.csproj` ki `PackageReference` entries padh kar dependencies resolve/download karta hai; `dotnet build`/`run` isse implicitly invoke karte hain.",
    detailedAnswer:
      "`dotnet restore` `.csproj` (aur agar present ho to `packages.lock.json`) padhta hai, NuGet feeds se transitive dependency graph resolve karta hai, aur zaroori packages global cache me (agar already present nahi hain) download karta hai. `dotnet build` aur `dotnet run` dono implicitly ek restore step chalate hain pehle, isliye developers ko normally alag se `dotnet restore` chalane ki zaroorat nahi padti — lekin CI pipelines me caching optimize karne ke liye ise explicit step banaya jaata hai aksar.",
  },
  {
    id: "csproj-nuget-packagereference-tr-6",
    question: "Ek bade multi-project solution me alag-alag `.csproj` files ne same NuGet package ke alag-alag versions reference kar liye. Isse kaunse issues ho sakte hain, aur kaise fix karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Version drift se runtime binding conflicts ho sakte hain; fix hai Central Package Management (`Directory.Packages.props`) adopt karna.",
    detailedAnswer:
      "Alag-alag versions se assembly binding conflicts, subtle behavior differences, ya build-time warnings/errors aa sakte hain jab ek project doosre ko reference karta hai jisne alag version use kiya. Fix: root-level `Directory.Packages.props` file me saari versions centrally define karo, individual `.csproj` files sirf `<PackageReference Include=\"X\" />` (bina Version attribute) likhein. Isse ek single source of truth ban jaata hai aur version drift structurally hi possible nahi rehta.",
    followUp: "Central Package Management kis .NET version se available hai?",
  },
  {
    id: "csproj-nuget-packagereference-tr-7",
    question: "`packages.lock.json` file ka purpose kya hai aur ye kab use karni chahiye?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Exact resolved package versions lock karti hai reproducible restores ke liye — CI/CD pipelines me particularly useful.",
    detailedAnswer:
      "`RestorePackagesWithLockFile` set karne par `packages.lock.json` generate hoti hai, jo exact resolved version har transitive dependency ka lock kar deti hai. Bina isके, agar koi transitive dependency ne ek chhota patch release nikala, agla restore silently thoda different version resolve kar sakta hai — 'works locally, breaks in CI' jaisi cheezein. Lock file ise prevent karti hai, aur ise commit karna best practice hai reproducible builds ke liye, especially CI environments me.",
  },
  {
    id: "csproj-nuget-packagereference-tr-8",
    question: "Kya ye statement sahi hai: 'legacy `packages.config` aur modern `PackageReference` functionally identical hain, bas syntax alag hai'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat — functional differences hain: transitive dependency handling, storage location, aur project-file simplicity sab genuinely alag hain.",
    detailedAnswer:
      "Ye ek common galat samajh hai. Syntax se zyada, do genuine functional differences hain: (1) `PackageReference` transitive dependencies automatically resolve karta hai, `packages.config` me manual listing chahiye thi. (2) Package storage location alag hai — global shared cache vs project-local `packages/` folder, jisse disk usage aur repo size dono impact hote hain. Ye sirf 'syntax ka fark' nahi, real behavioral/architectural improvement hai.",
    redFlag: "'Bas naya syntax hai, kaam wahi hai' bolna — underlying transitive-resolution aur storage-model differences ko miss karna.",
  },
  {
    id: "csproj-nuget-packagereference-tr-9",
    question: "`<Project Sdk=\"Microsoft.NET.Sdk.Web\">` vs `<Project Sdk=\"Microsoft.NET.Sdk\">` — ye attribute value kya control karta hai?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "Konsa default MSBuild targets/imports lagenge — Web SDK ASP.NET Core hosting ke liye zaroori defaults deta hai, plain SDK console/library ke liye.",
    detailedAnswer:
      "`Sdk` attribute MSBuild ko batata hai kis 'SDK' (properties, targets, imports ka predefined set) ko project pe apply karna hai. `Microsoft.NET.Sdk.Web` ASP.NET Core-specific build behavior (jaise `wwwroot` handling, hosting defaults) add karta hai. `Microsoft.NET.Sdk` (plain) console apps/class libraries ke liye default hai. `Microsoft.NET.Sdk.Worker` background service projects ke liye hai. Galat SDK choose karne se build to ho sakta hai, lekin runtime behavior ya publish output galat ho sakta hai (jaise `wwwroot` content publish na hona).",
  },
];

export default questions;
