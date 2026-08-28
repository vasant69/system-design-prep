import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "health-checks-and-deployment-overview-1",
    question:
      "Liveness aur readiness health check me core farak kya hai, orchestrator ki action ke terms me?",
    options: [
      "Dono same hain, bas endpoint ka naam alag hota hai",
      "Liveness fail = orchestrator pod ko restart karta hai (aur liveness ko external dependency check nahi karni chahiye); readiness fail = pod ko load balancer / Service endpoints se hata deta hai bina restart ke",
      "Liveness fail = pod traffic se hat-ta hai; readiness fail = pod restart hota hai",
      "Readiness sirf startup pe ek baar chalta hai, liveness kabhi nahi",
    ],
    correctIndex: 1,
    explanation:
      "Liveness ka sawaal `kya process responsive hai` — fail hone par restart hi ek option hai, isliye ise DB/cache/downstream par depend nahi karna chahiye (warna dependency down = restart storm). Readiness ka sawaal `kya ye instance abhi serve kar sakta hai` — DB, cache, downstream check hote hain, aur fail hone par instance ko traffic rotation se nikaala jaata hai, restart nahi. Roles ulte batana galat hai. Dono probes periodically chalte hain (k8s me har ~10s), sirf startup pe nahi.",
    difficulty: "medium",
  },
  {
    id: "health-checks-and-deployment-overview-2",
    question:
      "`MapHealthChecks` ke `HealthCheckOptions` me `Predicate` aur `ResponseWriter` ka kya role hai?",
    options: [
      "`Predicate` request ko authenticate karta hai; `ResponseWriter` logs likhta hai",
      "`Predicate` decide karta hai is endpoint pe kaunse registered checks chalein (aksar tag se filter, jaise sirf `ready`-tagged); `ResponseWriter` response ka format decide karta hai — default plain text, custom se per-check JSON",
      "`Predicate` retry count set karta hai; `ResponseWriter` status code set karta hai",
      "Dono sirf tab kaam karte hain jab koi check `Unhealthy` return kare",
    ],
    correctIndex: 1,
    explanation:
      "Ek hi `AddHealthChecks()` par tum kai checks register karte ho aur unhe tags dete ho. `Predicate` un checks me se filter karta hai — liveness endpoint par koi check nahi, readiness endpoint par `ready`-tagged. `ResponseWriter` default me sirf overall status ka plain text deta hai; custom writer har check ka naam, status aur duration JSON me likhta hai jo dashboards aur debugging ke kaam aata hai. Auth, retry, logging iska kaam nahi.",
    difficulty: "medium",
  },
  {
    id: "health-checks-and-deployment-overview-3",
    question:
      "Rolling update ke dauraan ek EF Core migration jo column ko rename karti hai kyun khatarnaak hai, aur sahi tarika kya hai?",
    options: [
      "Rename bilkul safe hai, EF automatically dono naam handle karta hai",
      "Rolling update me kuch time purana aur naya code dono live hote hain; rename ke baad purana code missing column pe crash karega. Sahi tarika expand/contract hai — pehle naya column add (nullable), phir code switch, phir agli release me purana drop",
      "Migration ko sirf blue-green deploy me hi chalaya ja sakta hai, rolling me nahi",
      "Problem sirf performance ki hai, correctness ki nahi",
    ],
    correctIndex: 1,
    explanation:
      "Rolling update ek instance ek baar replace karta hai, to ek mixed-version window hota hai jahan purane aur naye dono pods DB se baat karte hain. Agar ek hi migration column rename kar de, purana code (jo purana naam expect karta hai) turant tootega. Expand/contract isse todta hai: release 1 naya column add karta hai (nullable, dono versions kaam karein), release 2 data populate aur code ko naye column pe switch karta hai, release 3 purana column drop karta hai. Har step backward-compatible. Blue-green isse thoda aasan banata hai par rolling me bhi ye rule chahiye.",
    difficulty: "hard",
  },
  {
    id: "health-checks-and-deployment-overview-4",
    question:
      "Ek CI/CD pipeline image ko `latest` ke bajaye commit SHA se tag karti hai. Iska concrete faayda kya hai?",
    options: [
      "SHA tag image ko chhota bana deta hai",
      "Har deployed image ek exact commit se traceable hoti hai, rollback unambiguous hota hai (purana SHA dobara deploy karo), aur node kabhi stale `latest` cache nahi chalata",
      "SHA tag ke bina `docker push` kaam hi nahi karta",
      "Isse tests skip ho jaate hain aur deploy tez hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`latest` mutable hai — do builds baad tumhe nahi pata kaunsa commit live hai, aur alag nodes apni cached `latest` chala sakte hain. Commit SHA (`ghcr.io/acme/emp-api:<sha>`) immutable aur unique hai: production me kaun sa code chal raha hai instantly pata, aur rollback matlab bas pichhla SHA re-deploy karna. Image size, push ka kaam karna, ya test execution se iska koi lena-dena nahi — tests deploy se pehle ka alag gate hain.",
    difficulty: "easy",
  },
];

export default quiz;
