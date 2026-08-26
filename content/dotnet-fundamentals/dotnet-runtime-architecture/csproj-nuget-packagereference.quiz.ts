import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "csproj-nuget-packagereference-1",
    question: "Modern SDK-style `.csproj` files legacy `.csproj` files se kaafi chhote kyun hote hain?",
    options: [
      "Kyunki naya format compression use karta hai",
      "Kyunki project folder ki saari `.cs` files implicitly include ho jaati hain — har file ko manually list karne ki zaroorat nahi",
      "Kyunki naya format comments allow nahi karta",
      "Kyunki naya format sirf ek file per project allow karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Legacy `.csproj` me har source file explicitly `<Compile Include=\"...\">` se list karni padti thi. Modern SDK-style project folder ki saari `.cs` files implicitly include kar leta hai — bas file drop karo, wo automatically project ka hissa ban jaati hai. Isse file drastically chhoti ho jaati hai aur merge conflicts bhi kam hote hain. Options A, C, D factually galat hain.",
    difficulty: "easy",
  },
  {
    id: "csproj-nuget-packagereference-2",
    question: "`PackageReference`, legacy `packages.config` se kaise better hai transitive dependencies ke maamle me?",
    options: [
      "Dono same tareeke se transitive dependencies handle karte hain",
      "`PackageReference` transitive dependencies automatically resolve karta hai; `packages.config` me sab explicitly list karni padti thin",
      "`PackageReference` transitive dependencies support hi nahi karta",
      "`packages.config` automatically karta tha, `PackageReference` manual hai",
    ],
    correctIndex: 1,
    explanation:
      "`PackageReference` ke saath sirf direct dependencies list karni hoti hain — NuGet baaki transitive dependencies khud resolve kar leta hai. `packages.config` ke era me, agar Package A Package B pe depend karta tha, dono explicitly list karni padti thin. Option B correctly is improvement ko describe karta hai; baaki options is fact ko ulta ya galat batate hain.",
    difficulty: "medium",
  },
  {
    id: "csproj-nuget-packagereference-3",
    question: "NuGet packages `PackageReference` model me kahan store hote hain?",
    options: [
      "Project folder ke andar ek `packages/` sub-folder me, jise commit karna padta hai",
      "Ek shared, machine-level global cache me (jaise `~/.nuget/packages`), project folder me nahi",
      "Directly `.csproj` file ke andar binary format me embedded",
      "Cloud me, local machine pe kabhi download nahi hote",
    ],
    correctIndex: 1,
    explanation:
      "`PackageReference` model me packages ek shared global NuGet cache me store hote hain (`~/.nuget/packages` ya Windows pe `%userprofile%\\.nuget\\packages`), project folder me nahi — isliye repo chhota rehta hai aur multiple projects same package version share kar sakte hain bina duplicate download ke. Legacy `packages.config` model project-local `packages/` folder use karta tha (Option A), jo isi problem ko fix karne ke liye replace kiya gaya.",
    difficulty: "medium",
  },
  {
    id: "csproj-nuget-packagereference-4",
    question: "`Directory.Packages.props` (Central Package Management) ka purpose kya hai?",
    options: [
      "Har project ka apna independent package version rakhna",
      "Ek single, central file se multi-project solution me saari package versions consistently manage karna",
      "NuGet packages ko compile-time pe encrypt karna",
      "Sirf test projects ke liye packages define karna",
    ],
    correctIndex: 1,
    explanation:
      "Central Package Management (`.NET 6+`) ek root-level `Directory.Packages.props` file me saari package versions centrally define karne deta hai — individual `.csproj` files sirf `PackageReference Include` karte hain bina version ke, version centrally control hoti hai. Isse bade multi-project solutions me version drift/mismatch bugs avoid hote hain. Baaki options is feature ka galat purpose batate hain.",
    difficulty: "hard",
  },
];

export default quiz;
