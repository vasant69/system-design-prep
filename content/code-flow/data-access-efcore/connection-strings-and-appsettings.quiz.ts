import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "connection-strings-and-appsettings-1",
    question: "Asli SQL Server username-password wali connection string ke liye local development me sabse sahi jagah kaunsi hai?",
    options: [
      "appsettings.json — kyunki wahi standard config file hai",
      "appsettings.Development.json — kyunki woh sirf dev me load hoti hai",
      "dotnet user-secrets — repo ke bahar, per-machine store, kabhi commit nahi hota",
      "Program.cs me ek const string",
    ],
    correctIndex: 2,
    explanation:
      "User Secrets repo folder ke bahar (`%APPDATA%\\Microsoft\\UserSecrets\\`) store hota hai, sirf Development me merge hota hai, aur git me nahi jaata. Option A aur B galat — dono files git me commit hoti hain, secret leak ho jaayega (Development.json bhi tracked hoti hai). Option D galat — code me hardcode karna sabse bura, har environment ke liye rebuild aur source me password.",
    difficulty: "easy",
  },
  {
    id: "connection-strings-and-appsettings-2",
    question: "Linux container me production connection string ke liye kaunsa environment variable naam config key `ConnectionStrings:Default` se match karega?",
    options: [
      "ConnectionStrings:Default",
      "ConnectionStrings__Default",
      "ConnectionStrings.Default",
      "CONNECTIONSTRINGS-DEFAULT",
    ],
    correctIndex: 1,
    explanation:
      "Env var names me `:` allowed nahi hota kai platforms pe, isliye ASP.NET Core `__` (double underscore) ko `:` ki tarah treat karta hai — `ConnectionStrings__Default` == `ConnectionStrings:Default`. Option A Linux pe invalid var name. Option C aur D koi recognised convention nahi — config binder inhe map nahi karega.",
    difficulty: "medium",
  },
  {
    id: "connection-strings-and-appsettings-3",
    question: "Local SQL Server / LocalDB se connect karte waqt naye Microsoft.Data.SqlClient me `TrustServerCertificate=True` kyun aksar chahiye hota hai?",
    options: [
      "Kyunki iske bina connection encrypt hi nahi hoti",
      "Kyunki naye client me `Encrypt` ab default `True` hai aur local SQL Server ka self-signed certificate trust nahi hota — bina is flag ke handshake fail hota hai",
      "Kyunki ye connection ko tez banata hai",
      "Kyunki ye Windows authentication enable karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Naye SqlClient me `Encrypt=True` default hai, aur local instance ka self-signed cert trusted chain me nahi hota — isliye pre-login handshake / certificate-trust error. `TrustServerCertificate=True` client ko woh cert accept karne ko bolta hai (sirf local dev me acceptable). Option A ulta hai — `Encrypt` encryption karta hai, ye flag sirf cert validation skip karta hai. Option C aur D bilkul unrelated.",
    difficulty: "medium",
  },
  {
    id: "connection-strings-and-appsettings-4",
    question: "`Program.cs` me `var cs = builder.Configuration.GetConnectionString(\"Default\") ?? throw new InvalidOperationException(...)` — yahan `?? throw` ka maqsad kya hai?",
    options: [
      "Connection string ko encrypt karna",
      "Agar key missing hai to app ko startup pe hi saaf message ke saath fail karana, bajaye pehli DB query pe confusing null exception ke",
      "Multiple connection strings me se pehli valid choose karna",
      "Connection string ko cache karna taaki dobara na padhni pade",
    ],
    correctIndex: 1,
    explanation:
      "`GetConnectionString` `string?` return karta hai; key missing ho to `null`. `?? throw` 'fail fast' pattern hai — misconfiguration turant, clear message ke saath pakdo, na ki baad me kisi random DB call pe `ArgumentNullException`. Option A, C, D me se koi kaam `??` operator nahi karta — woh sirf 'left null ho to right' hai.",
    difficulty: "easy",
  },
];

export default quiz;
