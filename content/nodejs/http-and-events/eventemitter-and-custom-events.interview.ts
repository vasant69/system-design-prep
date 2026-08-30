import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "ece-1",
    question: "EventEmitter kya hai? Uska core API batao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Node ka built-in observer pattern (`require('events')`). `on(name, fn)` / `once(name, fn)` se listener register, `off(name, fn)` se remove, `emit(name, ...args)` se saare listeners fire. Ek event ke multiple listeners ho sakte hain, jo registration order mein chalte hain. Node core (http.Server, streams, process) isi par bana hai.",
    detailedAnswer:
      "Core methods: `on`/`addListener` (har emit par chale), `once` (ek baar, phir auto-remove), `off`/`removeListener` (same fn reference chahiye), `emit` (return `true` agar listener tha), `removeAllListeners`, `listenerCount`, `eventNames`, `prependListener` (list ke aage lagao), `setMaxListeners`. Custom emitter banane ke liye `class Job extends EventEmitter { constructor() { super(); } }` phir `this.emit('progress', data)`. Do gotchas hamesha yaad rakho: (1) `emit` synchronous hai — listeners usi stack par chalte hain; (2) `'error'` event ka listener na ho to emitted error throw hota hai aur process gira sakta hai.",
    followUp: "`emitter.on` aur `emitter.prependListener` mein kya farak hai aur wo kab matter karta hai?",
  },
  {
    id: "ece-2",
    question: "`emit` synchronous hai ya asynchronous? Iska practical consequence kya hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Synchronous. `emit(name, ...args)` saare listeners ko turant, registration order mein, usi call stack par chalata hai aur unke complete hone ke baad hi return karta hai. Consequence: ek slow/blocking listener `emit` ke baad ka sab code rok deta hai, aur ek listener ka uncaught throw `emit` ke caller tak propagate karta hai.",
    detailedAnswer:
      "```javascript\nconst bus = new EventEmitter();\nbus.on('x', () => console.log('2 listener'));\nconsole.log('1 before');\nbus.emit('x');\nconsole.log('3 after');\n// hamesha: 1, 2, 3\n```\n\nAgar tumhe listener 'baad mein' chahiye (taaki emit caller block na ho), listener ke andar khud `setImmediate(() => ...)` ya `queueMicrotask(...)` lagao — EventEmitter khud defer nahi karega. Ye stream design ke liye important hai: Node core aksar `process.nextTick` use karta hai taaki `'data'`/`'end'` listeners current operation ke baad chalein, current stack ke beech mein nahi. Interview trap: kaafi log maante hain `emit` event loop ke agle tick par chalta hai — galat.",
    followUp: "Agar ek listener error throw kare aur baaki listeners abhi chalne baaki hon, to kya hota hai?",
    redFlag: "\"emit async hai, listeners setTimeout jaisa deferred chalte hain\" — ye galat hai.",
  },
  {
    id: "ece-3",
    question: "`'error'` event special kyun hai? Ek stream ke saath dikhao kya galat ho sakta hai.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Agar EventEmitter `'error'` emit kare aur us event ka koi listener na ho, Node us `Error` ko throw kar deta hai. Async context (stream, socket, child process) mein ye `uncaughtException` ban ke process crash karta hai. Isliye har fail-able emitter par `.on('error', ...)` lagana mandatory hai.",
    detailedAnswer:
      "```javascript\nconst rs = fs.createReadStream('nahi-hai.txt');\nrs.on('data', (d) => process.stdout.write(d));\n// koi rs.on('error') nahi\n// file missing -> stream 'error' emit karta hai -> koi listener nahi\n// -> ENOENT error throw -> uncaughtException -> process crash\n```\n\nFix bas ek line: `rs.on('error', (err) => { console.error(err.code); /* cleanup */ });`. Ye design decision jaan-boojh ke hai — Node nahi chahta ki errors chupchaap gum ho jayein. `stream.pipeline()` aur `stream/promises` isi liye bane: wo har stage ka error automatically propagate aur cleanup karte hain, taaki tum har stream par manually listener na lagao. Related trap: `once('error', ...)` use karke, agar emitter do baar error emit kar sakta hai, doosre error par koi listener nahi bachta -> crash. Multi-error emitters par `on('error')` use karo.",
    followUp: "`process.on('uncaughtException')` handler laga dena — kya ye 'error' listener na lagane ka safe substitute hai?",
    redFlag: "Har stream/socket par `'error'` listener skip karna kyunki \"abhi to koi error nahi aata\".",
  },
  {
    id: "ece-4",
    question:
      "Ek `Job` class likho jo `EventEmitter` extend kare aur steps chalate hue `progress` aur `done` emit kare.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`class Job extends EventEmitter`, constructor mein `super()`. Ek `async run()` jo steps ke loop mein har step ke baad `this.emit('progress', { done, total, percent })` kare, sab ke baad `this.emit('done', ...)`, aur `catch` mein `this.emit('error', err)`. Consumer `job.on('progress'/'done'/'error', ...)` lagata hai.",
    detailedAnswer:
      "```javascript\nconst EventEmitter = require('events');\n\nclass Job extends EventEmitter {\n  constructor(steps) {\n    super();\n    this.steps = steps;\n  }\n  async run() {\n    try {\n      for (let i = 0; i < this.steps.length; i++) {\n        await this.steps[i]();\n        const done = i + 1;\n        this.emit('progress', {\n          done,\n          total: this.steps.length,\n          percent: Math.round((done / this.steps.length) * 100),\n        });\n      }\n      this.emit('done', { steps: this.steps.length });\n    } catch (err) {\n      this.emit('error', err);\n    }\n  }\n}\n\nconst job = new Job([stepA, stepB, stepC]);\njob.on('progress', (p) => console.log(p.percent + '%'));\njob.on('done', () => console.log('finished'));\njob.on('error', (e) => console.error('failed:', e.message));\njob.run();\n```\n\nDesign point: `Job` ko nahi pata kaun sun raha hai — ek UI progress bar, ek logger, ek metrics collector, sab independently `on` kar sakte hain. `'error'` listener zaroori warna emitted error process gira dega.",
    followUp: "Agar tumhe `job.run()` ke complete hone ka `await` bhi chahiye ho (event ke alawa), tum kaise design karoge?",
  },
  {
    id: "ece-5",
    question: "Events vs callback vs promise — teeno mein se kaunsa kab? Decision framework batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "One-shot async result jise chain karna hai → Promise/async-await (single value, single error path, return value milta hai). Multiple ya ongoing notifications, ya multiple independent consumers → EventEmitter (Promise ek hi baar settle hota hai). Ek single legacy/one-off listener jahan Promise wrap over-engineering ho → callback.",
    detailedAnswer:
      "Matrix: (1) Kitni baar? Ek baar → Promise. Baar-baar (stream chunks, progress, connection lifecycle) → EventEmitter/async-iterator. (2) Kitne consumers? Ek → Promise/callback. Kai independent → EventEmitter (fan-out). (3) Return value chahiye caller ko? Haan → Promise (`emit` sirf `true`/`false` deta hai). (4) Control flow sequential hai? Haan → async/await (events se 'pehle ye phir wo' likhna spaghetti banata hai). (5) Cross-process / durable / retryable? → message queue, in-process EventEmitter nahi. Real example: HTTP request handler ek EventEmitter callback hai (per request, ongoing); ek DB call Promise hai (one-shot); ek CSV parser jo har row `emit` karta hai EventEmitter hai (many rows, back-pressure ke liye async iterator aur bhi behtar).",
    followUp: "`events.on(emitter, 'data')` async iterator kaise EventEmitter aur `for await...of` ke beech pul banata hai?",
    redFlag: "\"EventEmitter purana hai, hamesha Promise use karo\" — repeated events aur fan-out ke liye Promise fit nahi hota.",
  },
];

export default questions;
