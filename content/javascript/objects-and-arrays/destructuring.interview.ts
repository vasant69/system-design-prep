import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dstr-1",
    question: "Array destructuring aur object destructuring mein kya farak hai? Dono ke examples do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Array destructuring position se match karta hai — `const [a, b] = arr`, a = arr[0], b = arr[1], commas se slots skip kar sakte ho. Object destructuring property naam se match karta hai — `const { x, y } = obj` — aur rename support karta hai `const { x: newX } = obj`. Dono defaults aur rest pattern support karte hain.",
    detailedAnswer:
      "Array form: left side ek array-jaisa pattern, right side koi bhi iterable. Matching index-by-index hoti hai. `const [first, , third] = arr` — beech ka element skip. `const [head, ...tail] = arr` — tail baaki elements ka naya array. Order matters, naam tumhari marzi.\n\nObject form: left side ek object-jaisa pattern, matching property key se. `const { name } = user` property `name` dhoondta hai. Rename: `const { name: userName } = user`. Default: `const { role = 'member' } = user`. Rest: `const { id, ...rest } = user` — rest ek naya object baaki properties ke saath. Yaha order matter nahi karta, key naam matter karta hai.\n\nDono forms mein: default value sirf `undefined` pe lagti hai (null pe nahi), aur source `null`/`undefined` ho to `TypeError`.",
    followUp: "React useState array kyun return karta hai object ke bajaye?",
    redFlag: "Yeh kehna ki object destructuring bhi position se hoti hai — woh purely key-name se hoti hai.",
  },
  {
    id: "dstr-2",
    question:
      "Options-object pattern kya hai? `function createUser({ name, role = 'member' } = {})` mein aakhri `= {}` kis liye hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Options-object pattern: function ek single object argument leta hai jise parameter position pe hi destructure kiya jaata hai, taaki caller ko argument order yaad na rakhna pade aur defaults ek jagah declare hon. `= {}` isliye hai taaki bina argument call (`createUser()`) karne par `undefined` ko destructure na karna pade — warna TypeError.",
    detailedAnswer:
      "Jab function ke 3+ config-jaise arguments hon, positional args (`createUser(name, role, active, teamId)`) yaad rakhna mushkil hai aur `createUser('V', undefined, undefined, 5)` jaise gaps aate hain. Solution: ek object lo aur signature mein destructure karo:\n\n```javascript\nfunction createUser({ name, role = 'member', active = true } = {}) {\n  // ...\n}\ncreateUser({ name: 'Vasant', role: 'admin' });\n```\n\nCaller named-arguments jaisa feel paata hai, order irrelevant, missing fields defaults se bhar jaate hain. `= {}` (parameter default) tab kick karta hai jab argument hi na diya jaaye: `createUser()` -> argument `undefined` -> `= {}` se `{}` -> phir usme se destructure. Bina `= {}` ke `createUser()` `undefined` ko destructure karega aur crash karega. `createUser({})` dono cases mein chalta hai kyunki `{}` khud missing-property defaults trigger karta hai.",
    followUp: "Agar ek required field missing ho to tum kaise handle karoge — default ya throw?",
  },
  {
    id: "dstr-3",
    question:
      "Yeh kya print karega? `const { a, b = a + 1 } = { a: 5 }; console.log(b);`",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "6. Destructuring left-to-right chalti hai, isliye `a` pehle bind ho jaata hai (5), phir `b` ka default expression `a + 1` evaluate hota hai = 6, kyunki `b` object mein missing hai.",
    detailedAnswer:
      "Destructuring pattern ke bindings order mein process hote hain. Pehle `a` -> object mein `a: 5` hai to `a = 5`. Phir `b` -> object mein `b` nahi hai to default expression `a + 1` chalta hai; is waqt tak `a` already bound hai (5), to `b = 6`. Yeh 'later default can reference earlier binding' pattern kabhi-kabhi useful hai (jaise `{ width, height = width } = opts`). Agar order ulta hota (`{ b = a + 1, a }`) to `b` ke default evaluate hote waqt `a` abhi TDZ mein hota aur `ReferenceError` aata.",
    followUp: "`const { b = a + 1, a } = { a: 5 }` — ab kya hoga?",
  },
  {
    id: "dstr-4",
    question:
      "`const { x } = null` kya karta hai? Aur real code mein yeh galti kahan hoti hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`TypeError: Cannot destructure property 'x' of null` (as it is null). null aur undefined dono ko destructure karna throw karta hai. Real code mein yeh tab hota hai jab source ek function ka result ho jo kabhi null/undefined de sakta hai — jaise `array.find(...)` ya ek API call jo error pe null deti hai.",
    detailedAnswer:
      "Object destructuring internally source pe property access karta hai. `null` aur `undefined` pe property access illegal hai, isliye pattern match se pehle hi `TypeError`. Common jagah:\n\n```javascript\nconst { name } = users.find(u => u.id === id); // find undefined de sakta hai\nconst { data } = await fetchUser();            // error pe null return karti ho\nconst { city } = user.address;                 // address optional field\n```\n\nFix: nullish coalescing se fallback object do — `const { name } = users.find(...) ?? {}` — ya nested/uncertain single field ke liye optional chaining — `const city = user.address?.city`. Primitives (`0`, `''`, `false`) pe destructuring throw nahi karti (woh temporarily box ho jaate hain), sirf `null`/`undefined` pe.",
    followUp: "Optional chaining aur `?? {}` guard mein se kab kaunsa choose karoge?",
    redFlag: "Yeh maan lena ki `const { x } = null` bas `x = undefined` de dega.",
  },
  {
    id: "dstr-5",
    question: "Destructuring kab use nahi karna chahiye? Kuch concrete cases batao.",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Jab sirf ek property ek hi baar chahiye (seedha `obj.prop` clearer), jab nesting bahut deep ho (missing intermediate pe TypeError, optional chaining safer), jab source null/undefined ho sakta hai bina guard ke, aur jab renaming ki chain itni lambi ho jaaye ki original naam se rishta toot jaaye.",
    detailedAnswer:
      "Destructuring boilerplate kam karne ka tool hai — jab boilerplate hi nahi to woh sirf noise hai. `return user.id;` ko `const { id } = user; return id;` banana ulta lamba hai. Deep nesting `const { a: { b: { c } } } = obj` ek missing level pe crash karta hai aur padhna mushkil — `obj.a?.b?.c` intent bhi clear rakhta hai aur safe bhi. Uncertain source (API result, `find`, DOM query jo `null` de sakti hai) ko bina `?? {}` guard ke destructure karna production crash hai. Aur agar har field rename ho raha hai (`{ a: alpha, b: bravo, c: charlie }`) to reader ko ab do naam yaad rakhne padte hain — kabhi-kabhi plain object rakh ke `obj.a` use karna simpler hai. Rule: 2+ values ya defaults involved hon tabhi destructure karo.",
    followUp: "Ek function jo 5 values return karta hai — array return kare ya object? Kis basis pe decide karoge?",
  },
];

export default questions;
