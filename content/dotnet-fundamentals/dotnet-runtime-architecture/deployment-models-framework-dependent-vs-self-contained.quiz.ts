import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "deployment-models-fdd-scd-1",
    question: "Default `dotnet publish` (bina extra flags ke) kaunsa deployment model produce karta hai?",
    options: [
      "Self-contained deployment",
      "Framework-dependent deployment",
      "Dono ek saath",
      "Koi bhi nahi, error dega",
    ],
    correctIndex: 1,
    explanation:
      "Bina `--self-contained` flag specify kiye, `dotnet publish` default se Framework-Dependent Deployment produce karta hai — sirf app code aur NuGet dependencies publish hoti hain, .NET Runtime khud shamil nahi hota. Target machine pe matching Runtime pehle se installed hona chahiye.",
    difficulty: "easy",
  },
  {
    id: "deployment-models-fdd-scd-2",
    question: "Self-contained deployment ka sabse bada disadvantage kya hai?",
    options: [
      "Ye kabhi bhi kaam nahi karta production me",
      "Output size significantly bada hota hai, aur Runtime security patches ke liye poori app re-publish karni padti hai",
      "Ye sirf Windows pe kaam karta hai",
      "Ye NuGet packages support nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Self-contained deployment poora .NET Runtime bundle karta hai, isliye output size kaafi bada ho jaata hai (typically 70-100MB extra). Aur jab Runtime me koi security vulnerability fix hoti hai, Framework-dependent apps ko sirf machine-level Runtime update se fayda mil jaata hai, lekin self-contained apps ko individually re-publish/re-deploy karna padta hai. Options A, C, D factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "deployment-models-fdd-scd-3",
    question: "Self-contained deployment karte waqt Runtime Identifier (RID, jaise `linux-x64`) specify karna kyun zaroori hai?",
    options: [
      "Ye sirf cosmetic naming ke liye hai",
      "Kyunki self-contained output me actual platform-specific Runtime binaries bundle hoti hain — ek RID ka build doosre platform pe nahi chalega",
      "RID sirf documentation purpose ke liye hai",
      "Framework-dependent deployment ko bhi RID chahiye hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Self-contained deployment me actual, platform-specific native Runtime binaries bundle hoti hain — isliye ek `linux-x64` self-contained build Windows pe nahi chal sakta, alag RID ke liye alag publish chahiye. Framework-dependent deployment (Option D) generally RID-agnostic ho sakta hai kyunki wo target machine ke already-installed Runtime pe depend karta hai.",
    difficulty: "medium",
  },
  {
    id: "deployment-models-fdd-scd-4",
    question: "Kis scenario me Self-Contained deployment Framework-Dependent se better choice hai?",
    options: [
      "Jab multiple apps ek hi controlled server pe deploy ho rahi hon aur disk space priority ho",
      "Jab target machine (jaise customer ka on-premise machine) pe .NET install hone ki guarantee nahi hai",
      "Jab hamesha latest Runtime patches automatically milni chahiye bina re-deploy ke",
      "Jab output size sabse important priority ho",
    ],
    correctIndex: 1,
    explanation:
      "Self-contained deployment tab shine karta hai jab target environment control me nahi hai — jaise customer machines jahan .NET install hone ki koi guarantee nahi. Options A, C, D actually Framework-Dependent ke fayde hain (shared Runtime, central patching, chhota size) — inn scenarios me FDD better choice hoga.",
    difficulty: "hard",
  },
];

export default quiz;
