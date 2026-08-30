import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cbh-1",
    question: "Callback hell kya hai? Kya ye sirf indentation ki problem hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Callback hell tab hota hai jab dependent async steps ek doosre ke callback ke andar nest hote hain — code right-drift karke pyramid banata hai. Indentation sirf symptom hai; asli problems hain repeated error handling, `err` shadowing, `try/catch` ka fail hona, aur intermediate values ko kai step aage forward karna.",
    detailedAnswer:
      "Jab ek async step ka result agle step ka input hota hai, callback-only world mein 'agla step' ka matlab hai 'ek aur level andar'. Teen dependent steps = teen level nesting:\n\n```javascript\ngetUser(id, (err, user) => {\n  if (err) return handle(err);\n  getOrders(user.id, (err, orders) => {\n    if (err) return handle(err);\n    getLineItems(orders[0].id, (err, items) => {\n      if (err) return handle(err);\n      console.log(items);\n    });\n  });\n});\n```\n\nProblems: (1) `if (err) return` teen baar copy-paste; (2) teenon `err` ek doosre ko shadow karte hain; (3) bahar wala `try/catch` async error nahi pakadta kyunki wo block khatam ho chuka hota hai; (4) agar sabse andar `user.name` chahiye toh use manually thread karna padta hai; (5) control flow follow karna hard. Prettier ya named functions indentation theek kar dete hain par baaki problems rehti hain — isiliye Promises language level pe standardise hue.",
    followUp: "Named functions se refactor karne ke baad kya kya problem bachi rehti hai?",
    redFlag: "\"Callback hell sirf ugly nesting hai, formatting se fix ho jata hai\" — error handling aur control-flow issues cosmetic nahi hain.",
  },
  {
    id: "cbh-2",
    question: "Ye code chalega? `try { fs.readFile('x.txt', cb) } catch (e) { console.log('caught') }` — file missing hone par 'caught' print hoga?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi, 'caught' print nahi hoga. `catch` sirf `fs.readFile` ko call karne ki synchronous error pakadta hai. File-not-found ek async error hai jo `cb` ke pehle argument (`err`) mein aati hai — us tak `try/catch` kabhi nahi pahunchta.",
    detailedAnswer:
      "`fs.readFile` turant return ho jata hai; callback baad ke event loop tick mein chalta hai, jab tak `try` block ka execution context ja chuka hota hai. Synchronous `catch` sirf usi call stack frame ki errors pakadta hai. Isiliye Node ki error-first convention exist karti hai:\n\n```javascript\nfs.readFile('x.txt', 'utf8', (err, data) => {\n  if (err) return console.log('caught', err.code); // 'ENOENT'\n  console.log(data);\n});\n```\n\nAgar callback ke andar `if (err)` bhi na ho toh `data` `undefined` hoga aur baad mein `data.toString()` jaisa access crash karega — par phir bhi wo crash bahar wale `try/catch` se nahi pakda jayega. async/await isko wapas theek karta hai: `await` ki hui rejection ko surrounding `try/catch` normally pakad leta hai.",
    followUp: "Toh async/await ke saath try/catch kyun kaam kar jata hai jab plain callback ke saath nahi?",
    redFlag: "\"try/catch har error pakad leta hai\" — async callbacks ke andar ki errors ise bypass karti hain.",
  },
  {
    id: "cbh-3",
    question: "Ek custom function likha: `if (err) callback(err); callback(null, result);`. Isme bug batao.",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`return` missing hai. Error case mein `callback(err)` chalta hai, phir execution neeche jaakar `callback(null, result)` bhi chala deta hai — callback do baar invoke ho jata hai. Fix: `if (err) return callback(err);`.",
    detailedAnswer:
      "Callback contract ye hai ki wo exactly ek baar call ho. `return` ke bina dono lines chalti hain jab `err` truthy ho. Consequences real hote hain: downstream `.then`-jaisa consumer duplicate data process karta hai, ek HTTP handler do baar `res.send` karta hai ('headers already sent' crash), ya ek retry-counter do baar decrement hota hai. Ek BFSI reporting job mein exactly yahi bug tha — ek branch ka data report mein do baar aa gaya. Correct:\n\n```javascript\nfunction load(id, callback) {\n  db.query(id, (err, rows) => {\n    if (err) return callback(err);\n    callback(null, transform(rows));\n  });\n}\n```\n\nDefensive version mein log ek `let called = false` guard bhi lagate hain.",
    followUp: "Promise is problem ko structurally kaise rokta hai?",
    redFlag: "\"Chalega, JS doosri call ignore kar dega\" — JS aisa kuch nahi karta, callback sach mein do baar chalta hai.",
  },
  {
    id: "cbh-4",
    question: "Callback pyramid ko named functions mein tod diya. Kya ye callback hell ka poora solution hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi, partial hai. Indentation flat ho jati hai, lekin control flow file mein bikhar jata hai (call site neeche, handlers upar), aur ek step ki value ko kai step aage le jaane ke liye use manually thread karna padta hai. Error handling ab ek helper mein ja sakti hai, jo improvement hai.",
    detailedAnswer:
      "Named-function version:\n\n```javascript\nfunction onUser(err, user) {\n  if (err) return handleError(err);\n  getOrders(user.id, onOrders);\n}\nfunction onOrders(err, orders) {\n  if (err) return handleError(err);\n  getLineItems(orders[0].id, onLineItems);\n}\nfunction onLineItems(err, items) {\n  if (err) return handleError(err);\n  console.log(items);\n}\ngetUser(userId, onUser);\n```\n\nJo theek hua: flat indentation, `handleError` ek jagah. Jo nahi hua: `onLineItems` ko agar `user.name` chahiye toh use `onUser -> onOrders -> onLineItems` explicitly pass karna padega (closure scope share nahi hota); reader ko flow samajhne ke liye teen jagah dekhna padta hai. Promise chain aur async/await dono ismein behtar hain — async/await mein `user`, `orders`, `items` sab ek hi scope mein rehte hain aur code upar-se-neeche linear padhta hai.",
    followUp: "async/await version likh ke dikhao aur batao intermediate values ab kaise accessible hain.",
  },
  {
    id: "cbh-5",
    question: "Promises exactly kis problem ko solve karne ke liye standardise hue? Callback abhi bhi kahan sahi hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Promises dependent async steps ke callback-nesting, repeated error handling, aur value-forwarding ki problem solve karte hain — flat `.then()` chain, single `.catch()`, aur values automatically aage flow karti hain. Callback abhi bhi sahi hai repeated events (`emitter.on`, stream `data`) aur single-shot event listeners ke liye, kyunki Promise sirf ek baar settle hota hai.",
    detailedAnswer:
      "Callback hell ke concrete issues jo Promises address karte hain: (1) nesting -> flat chain; (2) har level pe `if (err) return` -> ek terminal `.catch()`, aur beech ki koi bhi rejection seedhe wahan chali jati hai; (3) intermediate value threading -> `.then` ka return value agle `.then` ko milta hai; (4) `try/catch` fail -> async/await mein `await`ed rejection ko `try/catch` normally pakad leta hai. Isiliye ES2015 mein Promise standard bana aur ES2017 mein async/await (jo Promises ke upar syntax sugar hai). Callback ka legitimate use aaj: `stream.on('data', cb)` jo har chunk pe fire hota hai, `setInterval`, `server.on('request', handler)` — in cases mein 'ek baar settle' wala Promise model fit hi nahi hota. Legacy callback API ko `util.promisify` se wrap karke baaki modern code ke saath consistent rakhte hain.",
    followUp: "async/await Promises ke upar syntax sugar hai — 'sugar' se exactly kya matlab hai?",
    redFlag: "\"Callbacks ab useless hain, sab jagah async/await\" — repeated events ke liye Promise/async-await structurally fit nahi hai.",
  },
];

export default questions;
