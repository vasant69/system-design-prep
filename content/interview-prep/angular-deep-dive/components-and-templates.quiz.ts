import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "components-templates-1",
    question: "Interpolation `{{ price }}` aur property binding `[value]=\"price\"` me main farak kya hai?",
    options: [
      "Dono bilkul same hain, sirf syntax alag hai",
      "Interpolation sirf text/string output ke liye hai, property binding kisi bhi DOM property (boolean, object, number) ko bind kar sakta hai",
      "Interpolation two-way hai, property binding one-way hai",
      "Property binding sirf attributes ke liye hai, interpolation properties ke liye",
    ],
    correctIndex: 1,
    explanation: "Interpolation essentially ek special case hai jo hamesha string/text produce karta hai. Property binding zyada general hai — kisi bhi DOM property (jaise `disabled` boolean ya `src` string) ko directly bind kar sakta hai. Dono one-way hain (class se DOM ki taraf), so option C galat hai. Attributes vs properties ka farak alag concept hai, option D us differentiation ko galat jagah apply kar raha hai.",
    difficulty: "easy",
  },
  {
    id: "components-templates-2",
    question: "Default `ViewEncapsulation.Emulated` mode me Angular styles ko component tak kaise scope karta hai?",
    options: [
      "Native browser Shadow DOM use karke",
      "Har component ke elements pe ek unique attribute add karke aur usi attribute se CSS selectors ko scope karke",
      "Har component ki styles ko ek alag CSS file me automatically split karke",
      "Inline style attributes generate karke har element pe",
    ],
    correctIndex: 1,
    explanation: "Emulated mode Angular apne aap har rendered element pe ek unique attribute (jaise _ngcontent-xyz) daal deta hai aur us component ke CSS rules ko wahi attribute selector add karke rewrite kar deta hai — isse real Shadow DOM ke bina bhi scoping simulate hoti hai. Native Shadow DOM ShadowDom mode me hota hai, ye Emulated se alag hai.",
    difficulty: "medium",
  },
  {
    id: "components-templates-3",
    question: "Template reference variable `#emailInput` kis cheez ko refer karta hai jab ek plain `<input>` element pe lagaya jaata hai?",
    options: [
      "Component class ke andar ek naya TypeScript property automatically ban jaata hai",
      "Us input ke DOM element ko, jisse template ke andar hi (jaise button click handler me) access kar sakte hain",
      "Ek global variable jo poore app me accessible hota hai",
      "Us input ka current value permanently store ho jaata hai component state me",
    ],
    correctIndex: 1,
    explanation: "Template reference variable purely template-scoped hota hai — ye us DOM element (ya component/directive instance) ka ek local handle deta hai, jise sirf usi template ke andar doosre bindings me use kar sakte ho. Ye component TypeScript class me koi property create nahi karta, na hi global hota hai, na hi state me persist hota hai.",
    difficulty: "medium",
  },
  {
    id: "components-templates-4",
    question: "Chhote reusable components ke liye separate templateUrl/styleUrls files use karna inline template se production code me generally behtar kyun mana jaata hai?",
    options: [
      "Inline templates technically Angular me support hi nahi karte",
      "Separate files se HTML-specific IDE tooling (syntax highlighting, autocomplete) milta hai aur readability better rehti hai jaise template badhta hai",
      "Inline templates har render pe extra HTTP request trigger karte hain",
      "Separate files automatically better performance dete hain runtime pe",
    ],
    correctIndex: 1,
    explanation: "Inline template TypeScript string literal ke andar HTML hota hai, jisse editor ka HTML tooling zyada kaam nahi karta aur template badhne pe readability girti hai. Angular dono ko support karta hai, koi HTTP request nahi hota (build time pe hi resolve ho jaata hai), aur runtime performance dono cases me effectively same hoti hai.",
    difficulty: "easy",
  },
];

export default quiz;
