import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "proto-1",
    question: "Prototype chain kya hai? Property lookup kaise kaam karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Har object ka ek hidden `[[Prototype]]` link doosre object par hota hai. Property read karte waqt engine pehle object ka own property dekhta hai, na mile to `[[Prototype]]` par, phir uske prototype par... `Object.prototype` -> `null` tak. Na mile to `undefined`.",
    detailedAnswer:
      "Prototype chain delegation ka mechanism hai. `const a = new User()` mein `a` ka `[[Prototype]]` `User.prototype` hai, jiska `[[Prototype]]` `Object.prototype` hai, jiska `[[Prototype]]` `null`. `a.greet()` par: `a` ke own props mein `greet` nahi -> `User.prototype` par mila -> call ho gaya (`this` `a` rehta hai). Isi wajah se shared methods sirf `User.prototype` par ek baar rakhe jaate hain, har instance mein duplicate nahi. Ek important asymmetry: read lookup chain follow karta hai, par write hamesha khud object par hota hai — `a.greet = ...` `User.prototype.greet` ko chhue bina `a` par ek own property bana deta hai jo prototype wale ko shadow kar deta hai.",
    followUp: "`class` keyword is chain ke oopar kya add karta hai — kuch naya ya sirf syntax?",
    redFlag: "\"Har object apne parent ke saare methods ki copy rakhta hai\" — nahi, wo delegate karta hai, copy nahi.",
  },
  {
    id: "proto-2",
    question: "`__proto__` aur `prototype` mein farak kya hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`prototype` sirf functions par hoti hai — wo object jo us function ko `new` karne par banne wale instances ka `[[Prototype]]` banega. `__proto__` (ya `Object.getPrototypeOf(x)`) kisi bhi object par hota hai — wo uska actual `[[Prototype]]` link hai.",
    detailedAnswer:
      "`User.prototype` ek plain object hai jahan tum shared methods rakhte ho. `new User()` ke waqt engine naye instance ka `[[Prototype]]` `User.prototype` par set kar deta hai. To `(new User()).__proto__ === User.prototype` `true`. Instances ke paas khud `prototype` property nahi hoti — sirf constructor functions ke paas. `__proto__` ek legacy accessor hai (ab standardised par deprecated style); modern code `Object.getPrototypeOf` / `Object.setPrototypeOf` use karta hai. Yaad rakhne ka tareeka: `prototype` = 'meri bani hui cheezon ka blueprint', `__proto__` = 'main khud kisko delegate karta hoon'.",
    followUp: "`fn.prototype.constructor` kya point karta hai, aur kab wo galat ho jaata hai?",
  },
  {
    id: "proto-3",
    question:
      "`function P() {} P.prototype.x = 1; const a = new P(); a.x = 2; delete a.x; console.log(a.x);` — output aur wajah?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`1`. `a.x = 2` ne `a` par ek own property banayi jo `P.prototype.x` ko shadow karti thi. `delete a.x` sirf us own property ko hataata hai — prototype wali `x` untouched, to ab lookup dobara `P.prototype.x` -> `1` par pahunchta hai.",
    detailedAnswer:
      "Teen states: (1) shuru mein `a` ke paas own `x` nahi, `a.x` -> prototype se `1`. (2) `a.x = 2` write hai -> `a` par own `x = 2` ban gaya, prototype wali chhupi rahi. (3) `delete a.x` own `x` hataata hai; `delete` chain par upar nahi jaata, to `P.prototype.x` bacha rehta hai. Ab `a.x` phir se `1`. Isse pata chalta hai ki shadowing non-destructive hai — instance ki value hatao to inherited default wapas dikhne lagta hai.",
    followUp: "`delete P.prototype.x` karne par sab `P` instances par kya asar padega?",
  },
  {
    id: "proto-4",
    question:
      "`class` aur prototype ka kya rishta hai? `class` aane se pehle inheritance kaise likhte the?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "`class` prototype-based inheritance ke oopar syntax sugar hai — koi naya inheritance model nahi. `class` ke methods `Class.prototype` par jaate hain; `extends` `Child.prototype` ka `[[Prototype]]` `Parent.prototype` par set karta hai. Pehle yeh haath se hota tha: constructor function + `Child.prototype = Object.create(Parent.prototype)`.",
    detailedAnswer:
      "ES5 pattern:\n```js\nfunction Animal(name) { this.name = name; }\nAnimal.prototype.speak = function () { return this.name + ' makes a sound'; };\n\nfunction Dog(name) { Animal.call(this, name); }        // super constructor\nDog.prototype = Object.create(Animal.prototype);        // link the chains\nDog.prototype.constructor = Dog;                        // fix constructor ref\nDog.prototype.speak = function () { return this.name + ' barks'; };\n```\n`class Dog extends Animal { ... }` bilkul yahi karta hai, plus `super()` calls enforce karta hai aur methods non-enumerable banata hai. Runtime par debugger mein tumhe wahi `Dog.prototype -> Animal.prototype -> Object.prototype` chain dikhegi. Isliye 'class JS mein real classes nahi hain, prototypes hi hain' wali baat interview mein aati hai.",
    followUp: "`class` methods enumerable hote hain ya nahi, aur isse `for...in` par kya farak padta hai?",
  },
];

export default questions;
