import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pp-1",
    question: "`.pipe()` aur `stream.pipeline()` mein kya farak hai? Production mein kaunsa use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Dono Readable ko Writable se jodte hain aur backpressure automatically handle karte hain — ye farak nahi hai. Farak: `.pipe()` errors forward nahi karta (unhandled `'error'` = crash) aur failure pe streams destroy nahi karta (fd/socket leak, downstream hang). `pipeline` saare errors ek callback/promise mein laata hai aur failure pe har stream `destroy()` karta hai. Production mein hamesha `pipeline` (promise form).",
    detailedAnswer:
      "`a.pipe(b).pipe(c)` mein agar `b` fail ho jaaye: `a` khula reh jaata hai (fd/socket leak), `c` ko `'end'` kabhi nahi milta (hang), aur `b` ka `'error'` agar tumne handle nahi kiya toh process crash. Sahi karne ke liye tumhe `a.on('error')`, `b.on('error')`, `c.on('error')` — har ek mein baaki streams `.destroy()` — 15+ lines, aur ek miss = leak. `stream.pipeline(a, b, c, cb)` ye sab correct karta hai: internally har stream pe `stream.finished()` lagata hai, kisi bhi error/premature-close pe baaki sab `destroy(err)`, aur `cb(err)` (ya promise reject) ek jagah. Promise form: `const { pipeline } = require('stream/promises'); await pipeline(a, b, c);` + `try/catch`. `.pipe()` sirf REPL/throwaway scripts ke liye jahan crash acceptable hai.",
    followUp: "`pipeline` mein agar teesra stream already destroyed ho to wo kya karta hai?",
    redFlag: "\"pipe aur pipeline basically same hain\" ya \"pipe backpressure nahi karta\" (wo karta hai).",
  },
  {
    id: "pp-2",
    question: "Ye code likho: ek file ko gzip karke doosri file mein likho, saare errors ek jagah handle karke.",
    type: "coding",
    difficulty: "beginner",
    shortAnswer:
      "`stream/promises` ka `pipeline` use karo: `await pipeline(fs.createReadStream(input), zlib.createGzip(), fs.createWriteStream(output))` ek `try/catch` ke andar. Teeno streams ke errors (missing input, gzip failure, disk full) sab ek `catch` mein aa jaate hain aur failure pe sab destroy ho jaate hain.",
    detailedAnswer:
      "```javascript\nconst fs = require('fs');\nconst zlib = require('zlib');\nconst { pipeline } = require('stream/promises');\n\nasync function gzipFile(input, output) {\n  try {\n    await pipeline(\n      fs.createReadStream(input),\n      zlib.createGzip(),\n      fs.createWriteStream(output)\n    );\n  } catch (err) {\n    // input ENOENT, gzip error, output ENOSPC — sab yahan\n    throw new Error(`gzip ${input} failed: ${err.message}`);\n  }\n}\n```\n\n`.pipe()` version (`fs.createReadStream(input).pipe(zlib.createGzip()).pipe(fs.createWriteStream(output))`) same input pe missing file ke case mein read stream ka `'error'` unhandled hoga aur process crash karega — aur agar tum sirf read stream pe listener lagao toh gzip/write ke errors abhi bhi unhandled. Isliye pipeline.",
    followUp: "Agar output stream error kare (disk full) to input file descriptor ka kya hota hai dono approaches mein?",
  },
  {
    id: "pp-3",
    question: "Ek HTTP endpoint `fs.createReadStream(path).pipe(res)` se file serve karta hai. Users jo download beech mein cancel karte hain unse server memory badhti hai. Kya ho raha hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Client disconnect pe `res` `'close'`/`'aborted'` ho jaata hai, par `.pipe()` source read stream ko destroy nahi karta — wo file padhta rehta hai, chunks emit karta rehta hai jinka koi consumer nahi, aur wo data buffer mein atakta hai. Fix: `pipeline(fs.createReadStream(path), res, err => {})` — client disconnect turant read stream destroy karta hai.",
    detailedAnswer:
      "`.pipe()` ek-directional cleanup bhi theek se nahi karta: jab dest (`res`) error/close hota hai, `pipe` source ko `unpipe` karta hai par `destroy` nahi. Ek `fs` read stream jo unpiped hai wo abhi bhi file descriptor pakde hai aur agar wo flowing mode mein tha toh internal buffering ya event-loop churn hota hai. Bahut sare abandoned downloads = fd leak + memory + CPU. `stream.pipeline(readStream, res, (err) => { /* log */ })` mein `pipeline` `res` pe `stream.finished()` lagata hai jo `'close'` (premature) detect karta hai aur `readStream.destroy()` call karta hai — file descriptor turant free, generation/read ruk jata hai. Real-world impact: ek reporting service ne is switch se p99 memory 40% gira di kyunki abandoned PDF generations pile-up band ho gaye.",
    followUp: "`res` pe `'close'` aur `'finish'` mein kya farak hai is context mein?",
    redFlag: "\"Client disconnect Node khud detect karke sab clean kar deta hai\" — pipe ke saath nahi.",
  },
  {
    id: "pp-4",
    question: "`pipeline(a, b, c)` promise form ko `await` ya `.catch()` ke bina call karne pe kya hota hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Promise form bina `await`/`.catch()` — agar pipeline fail hota hai toh unhandled promise rejection (Node 15+ mein process crash). Callback form bina callback argument ke — `pipeline` turant throw karta hai (`ERR_MISSING_ARGS` / callback required). Dono form mein error handling mandatory hai.",
    detailedAnswer:
      "`stream.pipeline` deliberately error handling ko force karta hai kyunki uska pura maqsad hi safe error/cleanup hai. Callback form: `pipeline(a, b, c)` bina 4th arg = synchronous throw. Promise form: `pipeline(a, b, c)` returns a Promise jo reject ho sakta hai; ignore karoge toh `unhandledRejection` — modern Node isse default non-zero exit ke sathe crash karta hai. Sahi:\n\n```javascript\n// promise\nawait pipeline(a, b, c); // inside try/catch\n// ya\npipeline(a, b, c).catch(handleErr);\n\n// callback\npipeline(a, b, c, (err) => { if (err) handleErr(err); });\n```\n\nEk aur gotcha: callback/`catch` mein jo error aata hai wo pehle failure ka hai; baaki streams tab tak destroy ho chuke hote hain, unpe dobara operate mat karo (jaise `res.write`).",
    followUp: "`AbortSignal` ko `pipeline` ke saath kaise use karte hain timeout ke liye?",
  },
  {
    id: "pp-5",
    question: "Multi-stage pipeline `pipeline(read, decrypt, gunzip, parse, write)` mein `decrypt` galat key ki wajah se fail ho jaata hai. Baaki streams ka kya hota hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`pipeline` `decrypt` ka `'error'` pakadta hai aur turant baaki saare streams — `read`, `gunzip`, `parse`, `write` — pe `.destroy(err)` call karta hai, dono upstream aur downstream direction mein. Final promise us error ke saath reject hota hai. Koi stream open/hang nahi rehta, `write` ki partial output file handle bhi close ho jaata hai.",
    detailedAnswer:
      "Pipeline internally har adjacent pair ko jodta hai aur har stream pe `stream.finished()` monitor lagata hai. Jaise hi kisi stream pe `'error'` ya premature `'close'` aata hai: (1) pipeline propagation rok deta hai, (2) us stream ke alawa baaki sab pe `destroy(err)` — upstream streams isse padhна band kar dete hain, downstream apne resources release kar dete hain, (3) callback/promise ko wahi original error milta hai. `.pipe()` chain mein iske ulta: `decrypt` fail hota, `read` file padhta rehta (leak), `gunzip`/`parse`/`write` `'end'` ka intezaar karte hue hang, aur `decrypt` ka unhandled `'error'` crash. Isliye 2+ stages wale kisi bhi flow mein `pipeline` non-negotiable hai. Partial `write` output ko cleanup karna (adhuri file delete) abhi bhi tumhari zimmedari hai — pipeline stream destroy karta hai, file unlink nahi.",
    followUp: "Partial output file ko failure pe delete karne ka clean tareeka kya hai?",
    redFlag: "Ye sochna ki ek stage fail hone pe baaki apne aap gracefully finish ho jaate hain.",
  },
];

export default questions;
