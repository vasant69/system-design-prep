import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "buf-1",
    question: "Buffer kya hai aur normal JS array ya string se kaise alag hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Buffer fixed-length raw bytes (har ek 0 se 255) ka block hai jo V8 heap ke bahar allocate hota hai, aur `Uint8Array` ka subclass hai. String immutable, encoding-aware text hai; array resizable aur boxed numbers rakhta hai. Buffer binary I/O ke liye hai — files, sockets, crypto, image bytes.",
    detailedAnswer:
      "V8 strings UTF-16 code units rakhti hain aur immutable hain; binary data ko string mein rakhne pe encode/decode round-trips corruption la sakte hain. JS arrays dynamic, sparse, aur numbers ko boxed rakhte hain — bytes ke liye memory-heavy. Buffer ek contiguous, fixed, off-heap byte region hai jise C++ ya OS I/O directly bhar sakta hai bina copy ke. Off-heap isliye taaki large binary blobs GC ko pressure na dein aur native code ko stable pointer mile. Aaj Buffer `Uint8Array` extend karta hai, to koi bhi TypedArray API kaam karti hai, plus Node-specific helpers (`toString(encoding)`, `write`, `readUInt32BE`, `Buffer.concat`).",
    followUp: "Buffer heap ke bahar kyun rakha jaata hai — kya problem hoti agar wo V8 heap pe hota?",
    redFlag: "\"Buffer bas numbers ka array hai\" — off-heap allocation aur encoding semantics miss karna.",
  },
  {
    id: "buf-2",
    question: "`Buffer.from('₹99').length` kya hai aur `'₹99'.length` kya? Farak kyun?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`Buffer.from('₹99').length` = 5 (rupee sign UTF-8 mein 3 bytes, plus '9' plus '9'). `'₹99'.length` = 3 (string code units). Buffer bytes ginta hai, string characters/code units.",
    detailedAnswer:
      "Rupee sign ka code point U+20B9 hai. UTF-8 mein wo 3 bytes (E2 82 B9); UTF-16 (JS string ka internal form) mein 1 code unit. To `'₹99'` ke liye `.length` 3, par usi text ka UTF-8 Buffer 3 + 1 + 1 = 5 bytes. Practical impact: `buf.subarray(0, 3)` se rupee sign ke pehle 3 bytes lo to sahi decode hoga, par `buf.subarray(0, 2)` use aadha kaat dega -> `toString('utf8')` pe replacement char. Isliye byte offsets pe kaam karte waqt character boundaries ka dhyaan rakho, ya `string_decoder` / `setEncoding` use karo jo boundaries handle karta hai.",
    followUp: "Chunked stream mein ek multi-byte char do chunks mein bat jaaye to kaise bachoge?",
  },
  {
    id: "buf-3",
    question:
      "Ek endpoint uploaded image ko read karke resize karta hai. Dev ne chunks ko `data += chunk` se joda. Prod mein images corrupt aa rahi hain. Kya hua?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`data += chunk` ne har Buffer chunk ko string mein coerce kiya (`toString()`), UTF-8 assume karke. Binary image bytes valid UTF-8 nahi hote — invalid sequences replacement char ban gaye aur bytes lost. Fix: chunks ko array mein push karo aur `Buffer.concat(chunks)` karo, ya `pipeline` se seedha resize stream mein bhejo.",
    detailedAnswer:
      "String concatenation binary ke liye zeher hai: '' plus buffer `buffer.toString()` call karta hai jiska default 'utf8' hai. Image, gzip ya protobuf bytes mein aise byte sequences hote hain jo valid UTF-8 nahi — Node unhe U+FFFD (replacement char, 3 bytes EF BF BD) se replace kar deta hai. Ab length bhi badal gayi aur original bytes gone — irreversible. Correct patterns: (1) const chunks = []; req.on('data', c => chunks.push(c)); req.on('end', () => sharp(Buffer.concat(chunks))); (2) behtar: pipeline(req, sharp().resize(200), res) — kabhi poora buffer memory mein nahi, backpressure bhi free. Text ke liye bhi `chunk +=` risky hai kyunki multi-byte char chunk boundary pe tut sakta hai — `setEncoding('utf8')` ya StringDecoder use karo.",
    followUp: "Poori image memory mein load karne ki jagah streaming resize kaise karoge?",
    redFlag: "\"UTF-8 hi to hai, string mein rakhne mein kya dikkat\" — binary data text nahi hota.",
  },
  {
    id: "buf-4",
    question: "`Buffer.allocUnsafe(1024)` `Buffer.alloc(1024)` se faster hai — to hamesha `allocUnsafe` kyun na use karein?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`allocUnsafe` internal shared pool se uninitialised memory deta hai — usme pehle kisi variable ya request ka data ho sakta hai. Agar use fully overwrite kiye bina kahin bhej do to purana (possibly sensitive) data leak hota hai. `alloc` zeroed, predictable, safe default.",
    detailedAnswer:
      "`Buffer.alloc(n)` naye bytes ko 0 se fill karta hai — is zeroing ka CPU cost hota hai. `Buffer.allocUnsafe(n)` ek pre-allocated pool se slice deta hai; content jo bhi pehle wahan tha wahi rahega — doosre buffers ke remnants, freed strings, etc. Safe sirf tab jab agli line mein hi tum poora buffer likh do (`buf.fill(0)`, `buf.write(...)`, `fs.read` ka target). Purane `new Buffer(number)` behaviour se real security bugs aaye the isi wajah se. Rule: default `alloc`; `allocUnsafe` sirf hot paths mein jahan tum guarantee de sako ki har byte overwrite hoga.",
    followUp: "`new Buffer(50)` deprecate kyun hua — kya exact security issue tha?",
  },
];

export default questions;
