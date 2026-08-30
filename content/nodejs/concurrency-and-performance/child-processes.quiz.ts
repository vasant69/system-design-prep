import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "child-processes-1",
    question:
      "`exec(cmd, cb)` aur `execFile(file, args, cb)` mein security ke lihaz se kya farak hai?",
    options: [
      "Koi farak nahi, dono same tarah kaam karte hain",
      "exec poori command string ek shell (/bin/sh -c) ko deta hai, to shell metacharacters (;, |, `, $()) active rehte hain — user input ho to injection; execFile shell ke bina binary directly chalata hai, args plain data rehte hain",
      "execFile shell use karta hai, exec nahi",
      "exec zyada secure hai kyunki wo output validate karta hai",
    ],
    correctIndex: 1,
    explanation:
      "exec internally `spawn('/bin/sh', ['-c', cmd])` jaisa hai — poori string shell interpret karta hai, isliy `; rm -rf /` type input execute ho sakta hai. execFile shell ko bilkul bypass karta hai: binary directly, args ek array. User input hamesha execFile/spawn + args array se do. Option C ulta hai; option D galat.",
    difficulty: "easy",
  },
  {
    id: "child-processes-2",
    question:
      "Ek command 5 MB logs stdout par deti hai aur tum `execFile` use kar rahe ho default options ke saath. Kya hoga?",
    options: [
      "Poora output callback mein aa jayega, koi issue nahi",
      "Output default maxBuffer (1 MB) cross karne par process kill ho jayega aur err ERR_CHILD_PROCESS_STDOUT_MAXBUFFER ke saath aayega",
      "Output automatically ek file mein likh diya jayega",
      "execFile output ko streaming mode mein switch kar dega",
    ],
    correctIndex: 1,
    explanation:
      "execFile/exec poora output memory mein buffer karte hain; default maxBuffer 1 MB (Node 12+). Cross hote hi child process kill aur maxBuffer error. Bade ya streaming output ke liye spawn + stdout.on('data') use karo, ya output ko file par redirect karwao. Baaki options galat behaviour bata rahe hain.",
    difficulty: "medium",
  },
  {
    id: "child-processes-3",
    question:
      "`fork(modulePath)` `spawn` se kis cheez mein khaas hai?",
    options: [
      "fork ek naya thread banata hai, process nahi",
      "fork sirf shell commands chala sakta hai",
      "fork ek naya Node process launch karta hai aur automatically ek IPC channel set karta hai, jisse parent aur child process.send() / on('message') se structured messages exchange kar sakte hain",
      "fork output ko hamesha buffer karta hai",
    ],
    correctIndex: 2,
    explanation:
      "fork spawn ka special case hai: child hamesha ek Node script hota hai aur ek extra IPC file descriptor set hota hai jispe V8-serialized messages jaate hain. process.send/on('message') dono taraf kaam karte hain. Option A galat — fork process banata hai (worker_threads thread banata hai). Option B/D galat.",
    difficulty: "medium",
  },
  {
    id: "child-processes-4",
    question:
      "Kaunsa scenario `child_process` ke bajaye `worker_threads` ka case hai?",
    options: [
      "ffmpeg se video transcode karna",
      "Ek Python script se ML inference chalana",
      "Apne likhe hue pure-JS report generator ko main event loop se hataana, jab same process theek hai aur crash isolation ki zaroorat nahi",
      "Untrusted user-submitted code sandbox mein chalana",
    ],
    correctIndex: 2,
    explanation:
      "worker_threads CPU-bound JavaScript ke liye hai, same process, lighter (naya OS process ya V8 boot nahi jaisa fork mein). Options A/B external programs hain — child_process/spawn/execFile. Option D ke liye process-level isolation chahiye (segfault/OOM parent ko na maare) — child_process better. Report generator apna JS hai aur isolation zaroori nahi, to worker_threads sahi.",
    difficulty: "medium",
  },
];

export default quiz;
