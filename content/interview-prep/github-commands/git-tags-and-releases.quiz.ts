import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "git-tags-and-releases-1",
    question: "Lightweight tag aur annotated tag me fundamental difference kya hai?",
    options: [
      "Lightweight tag sirf branches pe lagta hai, annotated commits pe",
      "Annotated tag apna khud ka Git object banata hai (tagger, date, message ke saath), lightweight sirf bare pointer hai",
      "Lightweight tag automatically remote pe push ho jaata hai, annotated nahi",
      "Annotated tags sirf GitHub pe kaam karte hain, plain Git me nahi",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai -- annotated tag ek full Git object banata hai jisme tagger info, date, aur message store hota hai, aur GPG-signable bhi hota hai. Lightweight tag sirf direct commit pointer hai, koi extra object nahi. Option 1 galat hai, dono commits pe lagte hain. Option 3 galat hai, koi bhi tag automatically push nahi hota. Option 4 galat hai, ye plain Git feature hai, GitHub-specific nahi.",
    difficulty: "easy",
  },
  {
    id: "git-tags-and-releases-2",
    question: "`git push origin main` chalane ke baad naya tag remote pe kyun nahi dikh raha?",
    options: [
      "Tags sirf `git fetch --tags` ke through create hote hain",
      "Tags automatically normal push ke saath nahi jaate -- explicit `git push origin <tag>` ya `git push --tags` chahiye",
      "Tag naam invalid tha",
      "Remote repository tags support hi nahi karti",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai -- Git tags ko normal commit pushes ke saath automatically nahi bhejta, ye ek explicit action hai taaki accidental/temp tags share na ho jaayein. Option 1, 3, aur 4 factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "git-tags-and-releases-3",
    question: "SemVer format `v2.3.1` me agar sirf ek bug fix release hua hai (koi naya feature nahi, koi breaking change nahi), kaunsa number badhega?",
    options: [
      "MAJOR (2 se 3)",
      "MINOR (3 se 4)",
      "PATCH (1 se 2)",
      "Teeno numbers ek saath badhte hain",
    ],
    correctIndex: 2,
    explanation:
      "Sahi jawab option 3 hai -- PATCH version bug fixes ke liye badhta hai jab koi naya feature ya breaking change na ho. MAJOR breaking changes ke liye, MINOR backward-compatible naye features ke liye badhta hai. Option 4 galat hai, SemVer independently teeno parts ko badhata hai based on change type.",
    difficulty: "easy",
  },
  {
    id: "git-tags-and-releases-4",
    question: "Ek release tag `v1.0.0` ko remote se completely delete karne ke liye kaunsa sahi sequence hai?",
    options: [
      "Sirf `git tag -d v1.0.0` kaafi hai, remote automatically sync ho jaata hai",
      "`git tag -d v1.0.0` (local delete) phir `git push origin --delete v1.0.0` (remote delete)",
      "Sirf `git push origin --delete v1.0.0` chalao, local automatically clean ho jaata hai",
      "Tags kabhi delete nahi kiye ja sakte, sirf overwrite ho sakte hain",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai -- local aur remote tags independent hain, dono ko alag commands se delete karna padta hai: `git tag -d` local ke liye, `git push origin --delete` remote ke liye. Option 1 aur 3 galat hain kyunki ek command dusri location ko automatically sync nahi karta. Option 4 galat hai, tags delete ho sakte hain.",
    difficulty: "medium",
  },
];

export default quiz;
