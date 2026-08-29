import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "angular-material-and-cdk-concepts-1",
    question: "Angular Material aur CDK me kya farak hai?",
    options: [
      "Dono same hain",
      "Material = styled Material Design components (button, dialog, table, datepicker). CDK = uske neeche ka unstyled behaviour layer (overlay positioning, a11y, drag-drop, virtual scroll, headless table, portal)",
      "CDK sirf testing ke liye hai",
      "Material free hai, CDK paid",
    ],
    correctIndex: 1,
    explanation:
      "Material CDK ke upar bana hai. Material ka apna look (Material Design) hai; CDK ka koi look nahi — wo sirf hard behaviour (positioning, focus trap, keyboard nav) deta hai jise aap apni styling ke saath use karte ho.",
    difficulty: "easy",
  },
  {
    id: "angular-material-and-cdk-concepts-2",
    question: "Apna custom design system (brand components) bana rahe ho. Overlay/dropdown/dialog ke liye kya karna chahiye?",
    options: [
      "Sab scratch se banao",
      "`@angular/cdk/overlay` + `@angular/cdk/a11y` use karo — positioning, focus trap, aur keyboard navigation scratch se sahi (aur accessible) banana bahut mushkil hai; CDK ye deta hai unstyled",
      "Material components use karo par CSS override karke",
      "jQuery plugins use karo",
    ],
    correctIndex: 1,
    explanation:
      "CDK exactly isi ke liye hai — behaviour without style. Overlay viewport-edge positioning, focus trapping, Escape/backdrop, arrow-key nav — ye sab hand-rolled versions me usually buggy/inaccessible hote hain.",
    difficulty: "medium",
  },
  {
    id: "angular-material-and-cdk-concepts-3",
    question: "50,000 rows ki list smooth render karne ke liye CDK me kya use karte hain?",
    options: [
      "`cdk-table`",
      "`cdk-virtual-scroll-viewport` (`ScrollingModule`) — sirf visible rows DOM me render karta hai, baaki virtualized",
      "`cdkDrag`",
      "`BreakpointObserver`",
    ],
    correctIndex: 1,
    explanation:
      "Virtual scrolling se 100k-row list bhi smooth rehti hai kyunki DOM me sirf viewport ke ~20 rows hote hain. Plain `@for` sab 50k render karega aur browser choke ho jaayega.",
    difficulty: "medium",
  },
  {
    id: "angular-material-and-cdk-concepts-4",
    question: "Ek app me Angular Material components aur ek custom design system dono use karne ka kya problem hai?",
    options: [
      "Bundle size double ho jaata hai bas",
      "Visual inconsistency — Material Design ka look custom brand ke saath clash karta hai; ek direction commit karo (Material, ya CDK-based custom)",
      "Koi problem nahi",
      "Angular allow nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "Material ka look strong aur specific hai. Custom components ke saath mix karne se UI adha-Material adha-brand dikhta hai. Ya poora Material adopt karo (theming ke saath), ya CDK par apna design system banao.",
    difficulty: "easy",
  },
];

export default quiz;
