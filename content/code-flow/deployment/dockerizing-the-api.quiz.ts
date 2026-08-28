import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dockerizing-the-api-1",
    question:
      "Multi-stage Dockerfile me `COPY *.csproj` + `RUN dotnet restore` ko `COPY . .` se PEHLE rakhne ka kya faayda hai?",
    options: [
      "Isse final image chhoti ho jaati hai",
      "`restore` sirf project files padhta hai; agar sirf `.cs` file badle to yeh layer (NuGet download included) cache se aati hai aur restore dobara nahi chalta",
      "Isse `dotnet publish` ko `--no-restore` ki zaroorat nahi padti",
      "Isse container non-root user ke roop me chalta hai",
    ],
    correctIndex: 1,
    explanation:
      "Docker har instruction ko ek cached layer banata hai; layer tabhi rebuild hoti hai jab uska input badle. `dotnet restore` ka input sirf `.csproj`/`.sln` hai, isliye pehle wahi copy karke restore karne se code-only changes par NuGet download wali layer `CACHED` rehti hai — ~40s ka restore ~0s ho jaata hai. Final image size runtime stage aur `.dockerignore` se ghata hai, layer order se nahi. `--no-restore` alag flag hai jo publish ko dobara restore karne se rokta hai. Non-root `USER app` line se aata hai.",
    difficulty: "medium",
  },
  {
    id: "dockerizing-the-api-2",
    question:
      ".NET 8 container image me app kis port par listen karti hai by default, aur pehle ke .NET images se yeh alag kyun hai?",
    options: [
      "Port 80 — hamesha se yahi raha hai",
      "Port 5000 — Kestrel ka dev default",
      "Port 8080 — pre-.NET 8 images 80 use karti thi jiske liye ports under 1024 par bind karne ke liye root chahiye tha; 8080 non-privileged hai to non-root user bind kar sakta hai",
      "Koi default nahi — hamesha `ASPNETCORE_URLS` explicitly set karna padta hai",
    ],
    correctIndex: 2,
    explanation:
      ".NET 8 se container images `ASPNETCORE_HTTP_PORTS=8080` default rakhti hain. Purane images 80 par listen karti thi, aur Linux me 1024 se kam port par bind karne ke liye elevated privileges chahiye — jo non-root container ke saath conflict karta hai. 8080 non-privileged hai, isliye `aspnet` image ka built-in non-root `app` user bina extra capability ke bind kar sakta hai. Isi wajah se `-p 80:80` karna .NET 8 image ke saath connection refused deta hai — andar kuch 80 par sun hi nahi raha.",
    difficulty: "medium",
  },
  {
    id: "dockerizing-the-api-3",
    question:
      "`ENTRYPOINT` ko exec form (JSON array: `[dotnet, EmployeeManagement.Api.dll]`) me likhna zaroori kyun hai, shell form (`ENTRYPOINT dotnet EmployeeManagement.Api.dll`) ke bajaye?",
    options: [
      "Exec form thoda tez start hota hai",
      "Shell form me app `/bin/sh -c` ka child ban jaata hai, isliye `docker stop` ka `SIGTERM` app tak nahi pahunchta — graceful shutdown tootta hai aur 10s baad `SIGKILL` se container marta hai",
      "Shell form me environment variables expand nahi hote",
      "Exec form ke bina image build hi nahi hoti",
    ],
    correctIndex: 1,
    explanation:
      "Exec form (JSON array) me `dotnet` process container ka PID 1 banta hai aur signals seedha use milte hain. Shell form me `sh -c dotnet ...` PID 1 hota hai aur `dotnet` uska child — `sh` `SIGTERM` ko forward nahi karta, isliye ASP.NET Core ka graceful shutdown (in-flight requests drain karna, `IHostApplicationLifetime` hooks) chalta hi nahi; `docker stop` 10 second wait karke `SIGKILL` bhej deta hai. Env var expansion shell form ka ek side-benefit hai par yeh yahan ka issue nahi. Image dono forms se build ho jaati hai.",
    difficulty: "hard",
  },
  {
    id: "dockerizing-the-api-4",
    question:
      "Ek team ne single-stage Dockerfile me `COPY . .` kiya bina `.dockerignore` ke aur `sdk:8.0` image hi ship kar di. Kaunse problems ek saath aaye?",
    options: [
      "Sirf ek: image thodi badi hui",
      "Image ~800 MB+, build tools/compiler production container me (bada attack surface), aur `bin/`/`obj/`/local `appsettings.Development.json` image layers me leak (`docker history` se visible)",
      "App chal hi nahi paayegi kyunki runtime image chahiye hoti hai",
      "Container automatically root ke bajaye `app` user use karega",
    ],
    correctIndex: 1,
    explanation:
      "Poori SDK image ship karne se compiler, MSBuild aur NuGet cache production me aa jaate hain — ~800 MB+ aur bada attack surface (ek RCE bug in tools ko reachable bana deta hai). `.dockerignore` ke bina `COPY . .` local build output aur `appsettings.Development.json` (jisme aksar ek dev connection string hoti hai) image me daal deta hai, jo `docker history` ya layer inspection se dikhta hai — security scan release block kar sakta hai. App chal to jaayegi SDK image me bhi (usme runtime included hai), par yeh galat approach hai. Non-root tabhi milta hai jab `USER app` likha ho.",
    difficulty: "easy",
  },
];

export default quiz;
