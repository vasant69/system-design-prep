import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dependencies-vs-devdependencies-1",
    question:
      "Ek package ko `dependencies` mein daalna hai ya `devDependencies` mein — decide karne ka sabse saaf rule kya hai?",
    options: [
      "Popular packages dependencies mein, chhote packages devDependencies mein",
      "Kya running production process ise import/require karega? Haan -> dependencies, Nahi (sirf build/test/lint/dev) -> devDependencies",
      "Jo pehle install kiye wo dependencies, baad wale devDependencies",
      "Sab kuch dependencies mein daalo, devDependencies optional hai",
    ],
    correctIndex: 1,
    explanation:
      "Test hamesha yehi: deployed, running production process ko ye package chahiye kya. express/pg/zod -> haan -> dependencies. typescript/jest/eslint/nodemon -> sirf build/test -> devDependencies. Option A/C arbitrary hain. Option D galat — sab dependencies mein daalna prod image bloat aur attack surface badhata hai.",
    difficulty: "easy",
  },
  {
    id: "dependencies-vs-devdependencies-2",
    question:
      "`npm ci --omit=dev` production image mein chalane ka main fayda kya hai?",
    options: [
      "Ye dependencies ko latest version pe update kar deta hai",
      "devDependencies (aur unki exclusive transitive deps) skip ho jati hain -> chhoti image, tez cold start, kam attack surface (kam packages jinka code prod mein reachable hai)",
      "Ye package-lock.json ko regenerate karta hai",
      "Ye tests ko production mein chalata hai",
    ],
    correctIndex: 1,
    explanation:
      "`--omit=dev` sirf `dependencies` install karta hai. typescript, jest, eslint, @types/* — sab image se bahar. Ek TS backend image aksar 100-200MB chhoti ho jati hai, container tez start hota hai, aur `npm audit --omit=dev` ki vuln count girti hai kyunki dev tooling ke CVEs image mein hai hi nahi. Option A/C/D `--omit=dev` ka kaam nahi.",
    difficulty: "easy",
  },
  {
    id: "dependencies-vs-devdependencies-3",
    question:
      "Ek developer `dotenv` ko `npm install -D dotenv` se add karta hai. App boot pe `require('dotenv')` karta hai. Local dev aur CI tests pass ho jate hain. Production mein kya hoga?",
    options: [
      "Production mein bhi sab theek chalega",
      "Production deploy `npm ci --omit=dev` chalata hai, dotenv install hi nahi hota, aur app boot pe `Cannot find module 'dotenv'` se crash karta hai",
      "npm automatically dotenv ko dependencies mein move kar dega",
      "dotenv dev mein disable ho jayega",
    ],
    correctIndex: 1,
    explanation:
      "Local `npm install` aur CI dono buckets laate hain, isliye galat classification chhupi rehti hai. Production `--omit=dev` sirf `dependencies` laata hai — dotenv missing -> boot crash. Fix: dotenv ko `dependencies` mein move karo, aur CI mein ek `npm ci --omit=dev && node dist/index.js` prod-parity check add karo. Option C/D galat — npm khud kuch move nahi karta.",
    difficulty: "medium",
  },
  {
    id: "dependencies-vs-devdependencies-4",
    question:
      "Ek React component library `react` ko `peerDependencies` mein kyun rakhti hai, `dependencies` mein kyun nahi?",
    options: [
      "peerDependencies tez install hoti hain",
      "Taaki library aur consumer app ek hi React copy share karein — library apni react copy dependencies mein rakhe toh app mein React ki do copies aa sakti hain aur hooks/context toot jate hain",
      "react ek devDependency hai",
      "peerDependencies ko npm ignore kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "React hooks aur context 'same module instance' pe depend karte hain. Agar library apni React copy bundle kare, toh app mein do React copies ho sakti hain aur runtime errors aate hain ('Invalid hook call'). `peerDependencies: { react: '>=18' }` bolta hai 'host app React provide karega' — ek shared copy. Option A/C/D galat.",
    difficulty: "medium",
  },
];

export default quiz;
