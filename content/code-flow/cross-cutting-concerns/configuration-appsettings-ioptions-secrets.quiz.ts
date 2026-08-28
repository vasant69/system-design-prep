import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "configuration-appsettings-ioptions-secrets-1",
    question:
      "appsettings.json me Jwt:ExpiryMinutes = 60 hai, aur app ko command line se --Jwt:ExpiryMinutes=5 diya jaata hai. Effective value kya hogi?",
    options: [
      "60 — JSON file hamesha jeetti hai",
      "5 — command-line args JSON ke baad add hote hain, isliye override karte hain",
      "App start pe error — same key do jagah define nahi ho sakti",
      "0 — dono conflict karte hain to fallback default lagta hai",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawaab 5 hai: default provider order me command-line args sabse aakhir me add hote hain, aur baad wala provider same key ke liye pehle wale ko override karta hai. '60' galat hai kyunki JSON base layer sabse kamzor hai, usse upar 4 aur providers override kar sakte hain. 'Error' galat hai — same key ko multiple providers me rakhna hi override mechanism ka poora point hai. '0' galat hai — conflict pe koi fallback nahi lagta, last-writer-wins hota hai.",
    difficulty: "medium",
  },
  {
    id: "configuration-appsettings-ioptions-secrets-2",
    question:
      "Ek singleton PanVerificationClient ko config chahiye jo runtime pe badal sakti hai. Konsa Options interface inject karna sahi hai?",
    options: [
      "IOptionsSnapshot<PanVerificationOptions>",
      "IOptions<PanVerificationOptions>",
      "IOptionsMonitor<PanVerificationOptions>",
      "Seedha IConfiguration inject karke har baar GetSection padho",
    ],
    correctIndex: 2,
    explanation:
      "IOptionsMonitor<T> sahi hai: ye singleton-safe hai aur .CurrentValue se hamesha latest bound value deta hai, plus OnChange callback. IOptionsSnapshot<T> galat hai kyunki wo scoped hai — singleton me inject karne se captive dependency ban jaati hai. IOptions<T> galat hai kyunki wo ek hi baar bind hota hai, reload support nahi. Raw IConfiguration kaam to karega lekin magic strings aur zero validation ke saath — Options pattern ka fayda chala jaata hai.",
    difficulty: "medium",
  },
  {
    id: "configuration-appsettings-ioptions-secrets-3",
    question:
      "AddOptions<FileStorageOptions>().Bind(section).ValidateDataAnnotations().ValidateOnStart() me .ValidateOnStart() ka effect kya hai?",
    options: [
      "Har HTTP request pe options ko dobara validate karta hai",
      "Options validation ko app boot ke time chala deta hai, na ki pehli baar inject hone pe — galat config pe app start hi fail hota hai",
      "DataAnnotations ke bina bhi validation enable kar deta hai",
      "Options ko singleton se scoped bana deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Sahi: by default options validation lazy hoti hai (pehli baar jab .Value resolve hota hai). .ValidateOnStart() ise startup pe force karta hai, taaki bad config production request ke bajaye deploy pe hi pakda jaaye. 'Per-request' galat — validation ek hi baar hoti hai. 'DataAnnotations ke bina' galat — kya validate hoga wo ValidateDataAnnotations ya custom .Validate(...) decide karta hai, ValidateOnStart sirf timing badalta hai. 'Lifetime badalna' galat — wo interface choice se hota hai.",
    difficulty: "hard",
  },
  {
    id: "configuration-appsettings-ioptions-secrets-4",
    question:
      "Local development me JWT signing key ko source control se bahar rakhne ka sahi tarika konsa hai?",
    options: [
      "appsettings.Development.json me daalo aur us file ko .gitignore me add kar do",
      "dotnet user-secrets se set karo — value user profile folder me store hoti hai, repo ke bahar, aur sirf Development environment me load hoti hai",
      "Key ko Program.cs me const string me rakho",
      "Key ko base64 encode karke appsettings.json me daal do",
    ],
    correctIndex: 1,
    explanation:
      "Sahi: Secret Manager (dotnet user-secrets) isi ke liye hai — secrets user profile ke UserSecrets folder me JSON me jaate hain (repo ke bahar), aur ye provider sirf Development me active hota hai. gitignore wala option brittle hai (dusre developers ke paas file nahi hoti) aur galti se commit ka risk. Program.cs const galat — key compiled binary aur git history dono me chali jaati hai. base64 galat — wo encryption nahi, koi bhi decode kar sakta hai aur key phir bhi git me hai.",
    difficulty: "easy",
  },
];

export default quiz;
