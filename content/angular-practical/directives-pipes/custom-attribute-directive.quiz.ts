import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "custom-attribute-directive-1",
    question: "Custom attribute directive ka selector kaisa hota hai?",
    options: [
      "Element selector jaise `app-highlight`",
      "Attribute selector jaise `[appHighlight]` — bracketed, aur app-prefixed taaki HTML/library attributes se clash na ho",
      "Class selector jaise `.appHighlight`",
      "Koi selector nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "Attribute directives `[appX]` style selector use karti hain taaki kisi bhi element par as an attribute lag sakein. Element selector components ke liye hota hai. Prefix (`app`) naming collisions rokta hai.",
    difficulty: "easy",
  },
  {
    id: "custom-attribute-directive-2",
    question: "`@HostListener(\"mouseenter\")` aur `@HostBinding(\"class.active\")` me kya farak hai?",
    options: [
      "Dono same hain",
      "`@HostListener` host element par ek event sunta hai aur method chalata hai; `@HostBinding` host element ki ek property/class/style ko directive ki value se bind karta hai",
      "`@HostBinding` sirf components me kaam karta hai",
      "`@HostListener` sirf `click` ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "`@HostListener(event)` = host par listener (auto-cleanup). `@HostBinding('class.x' | 'attr.y' | 'style.z')` = host ki property ko directive expression se drive karna. `host: { ... }` metadata dono kaam karta hai.",
    difficulty: "medium",
  },
  {
    id: "custom-attribute-directive-3",
    question: "Directive me `ElementRef.nativeElement` ko directly manipulate karne ke bajaye kya prefer karna chahiye, aur kyun?",
    options: [
      "Kuch nahi, `nativeElement` hi standard hai",
      "`@HostBinding`/`host` bindings ya `inject(Renderer2)` — kyunki direct DOM access SSR pe break ho sakta hai aur `innerHTML` jaise ops XSS risk hote hain",
      "`document.querySelector`",
      "jQuery",
    ],
    correctIndex: 1,
    explanation:
      "Angular ki DOM abstraction (host bindings, `Renderer2`) server-side rendering aur non-browser environments me safely kaam karti hai aur sanitization respect karti hai. Raw `nativeElement` access simple cases me theek, par default choice abstraction honi chahiye.",
    difficulty: "medium",
  },
  {
    id: "custom-attribute-directive-4",
    question: "Ek directive ko `*appHasPermission=\"'x'\"` (structural, `*` ke saath) use karne ke liye usme kya inject karna zaroori hai?",
    options: [
      "Sirf `ElementRef`",
      "`TemplateRef` (host template) aur `ViewContainerRef` (jahan view create/clear karna hai)",
      "`HttpClient`",
      "`ChangeDetectorRef`",
    ],
    correctIndex: 1,
    explanation:
      "`*` syntax host ko ek `<ng-template>` me wrap karta hai. Directive `TemplateRef` se us template ko aur `ViewContainerRef` se render location ko access karti hai; phir `createEmbeddedView(tpl)` / `clear()` se element ko conditionally DOM me daalti/hataati hai.",
    difficulty: "hard",
  },
];

export default quiz;
