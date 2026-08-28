import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "docker-compose-with-sql-server-1",
    question:
      "`api` service me plain `depends_on: [db]` ke bajaye `depends_on: db: condition: service_healthy` kyun likhte hain?",
    options: [
      "Plain `depends_on` compose file me allowed hi nahi hai",
      "Plain `depends_on` sirf container start-order deta hai; `condition: service_healthy` API ko tab tak start nahi karne deta jab tak `db` ka healthcheck (sqlcmd query) pass na ho — yani SQL Server genuinely connections accept kar raha ho",
      "`service_healthy` API ko automatically retry logic de deta hai",
      "Isse dono services ek hi container me chalte hain",
    ],
    correctIndex: 1,
    explanation:
      "SQL Server container start hone ke baad bhi 20-40 second warm-up leta hai. Plain `depends_on` sirf itna kehta hai ki `db` container start ho chuka — process ready hai ya nahi, iski parwah nahi. `condition: service_healthy` compose ko batata hai ki `db` ke healthcheck ke `healthy` hone tak `api` start na kare. Retry logic ye nahi deta (wo app ka kaam hai). Dono alag containers hi rehte hain.",
    difficulty: "medium",
  },
  {
    id: "docker-compose-with-sql-server-2",
    question:
      "API ka connection string `Server=db,1433` use karta hai. Ye `db` resolve kaise hota hai, aur `Server=localhost` kyun kaam nahi karta?",
    options: [
      "`db` ek hardcoded IP alias hai jo Docker har machine pe same rakhta hai",
      "Compose default bridge network banata hai aur usme har service apne service-name se DNS ke through reachable hota hai; container ke andar `localhost` matlab wahi container, isliye `Server=localhost` khud API ko point karta hai, DB ko nahi",
      "`Server=localhost` kaam karta hai, `Server=db` galat hai",
      "`db` sirf tab resolve hota hai jab dono services `network_mode: host` par hon",
    ],
    correctIndex: 1,
    explanation:
      "Compose har project ke liye ek default bridge network banata hai aur usme services ko join karta hai; us network ka embedded DNS service name (`db`) ko us container ke IP par resolve karta hai. `localhost` har container ke andar khud us container ko point karta hai, isliye API ke andar `Server=localhost,1433` API ke apne container me DB dhoondhega aur `connection refused` dega. IP hardcode karne ki zaroorat nahi — service name portable hai.",
    difficulty: "medium",
  },
  {
    id: "docker-compose-with-sql-server-3",
    question:
      "`docker compose down` aur `docker compose down -v` me kya farak hai, aur `db` service ke liye ye kyun matter karta hai?",
    options: [
      "Koi farak nahi, `-v` sirf verbose logging hai",
      "`down` containers aur network hataata hai par named volumes rakhta hai; `-v` named volumes bhi delete karta hai — `db` ka data `/var/opt/mssql` par ek named volume me hai, to `-v` matlab poora database (migrations + seed data) chala gaya",
      "`down` kuch delete nahi karta, `-v` sirf containers hataata hai",
      "`-v` sirf tab kaam karta hai jab volume anonymous ho",
    ],
    correctIndex: 1,
    explanation:
      "`docker compose down` containers + default network remove karta hai lekin `volumes:` block me declare kiye named volumes ko chhod deta hai, taaki data agli `up` par bacha rahe. `-v` un named (aur anonymous) volumes ko bhi delete karta hai. Kyunki SQL Server apna data `/var/opt/mssql` par rakhta hai aur wo `mssql-data` named volume par mapped hai, `down -v` ek clean slate deta hai — CI me useful, local pe tab jab fresh DB chahiye. `-v` verbose nahi hai.",
    difficulty: "easy",
  },
  {
    id: "docker-compose-with-sql-server-4",
    question:
      "Container DB pe EF Core migrations apply karne ke liye kaunsa statement sahi hai?",
    options: [
      "Production me sabse safe tarika hai `db.Database.MigrateAsync()` ko har API replica ke startup pe bina guard chalana",
      "`dotnet ef migrations bundle` ek self-contained executable deta hai jise deploy pipeline me ek alag step ke roop me ek baar chalaya jaata hai — replica race nahi, aur app runtime user ko DDL permission ki zaroorat nahi",
      "Migrations sirf `docker compose` ke andar apply ho sakti hain, pipeline se nahi",
      "Init container approach me API pehle start hota hai, phir migrations chalti hain",
    ],
    correctIndex: 1,
    explanation:
      "Startup `MigrateAsync()` local/dev ke liye theek hai par `IsDevelopment()` guard ke saath — bina guard, multiple replicas ek saath migrate karne ki koshish karte hain (lock race), app ko schema-owner permission chahiye, aur slow migration health-probe crash loop banati hai. Migration bundle isi ko fix karta hai: ek executable, pipeline ka ek step, ek baar chalta hai, alag least-privilege migrator login se. Init container ka pura point hi ye hai ki wo API se PEHLE chalta hai aur complete hone par hi API start hota hai.",
    difficulty: "hard",
  },
];

export default quiz;
