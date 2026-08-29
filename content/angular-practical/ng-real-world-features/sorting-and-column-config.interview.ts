import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "scc-1",
    question: "Ek config-driven reusable data table design karo. Kya inputs/outputs, kaunse escape hatches?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`DataTable<T extends { id: number }>` — inputs: `columns: Column<T>[]` (`key`, `label`, `sortable`, `align`, `format`), `rows: T[]`, `sort: { field, dir } | null`, `loading`. Outputs: `sortChange(field)`, `rowClick(row)`, maybe `selectionChange`. OnPush. Escape hatch: a per-column `cellTemplate` (`ng-template`) map for custom cells (badges, buttons).",
    detailedAnswer:
      "The `format` fn covers simple display transforms; anything with markup/components needs a `TemplateRef`. Pattern: `@Input() cellTemplates?: Record<string, TemplateRef<{ $implicit: T }>>` and in the cell: `@if (cellTemplates?.[col.key]) { <ng-container *ngTemplateOutlet=\"...; context: { $implicit: row }\" /> } @else { {{ col.format ? col.format(row) : row[col.key] }} }`. Keep the table dumb — no data fetching, no sort logic beyond emitting the clicked key. Consumers own columns, data, and the sort cycle.",
    followUp: "`cellTemplate` context ko strongly-typed kaise rakhoge (`$implicit: T`)?",
  },
  {
    id: "scc-2",
    question: "Server-side sort ka state aur re-query flow — pagination aur filters ke saath kaise integrate hoga?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "A `sort` signal (`{ field, dir } | null`) joins the same `computed` query signal as filters and `page`/`pageSize`. Header click cycles asc → desc → none and updates the signal + URL (`?sort=salary:desc`). The one `switchMap` pipeline re-queries. Sort change usually keeps `page` (same set, new order); filter change resets `page`.",
    detailedAnswer:
      "One query = `{ ...filters, page, pageSize, sort }`. Serialize `sort` as `field:dir` (or two params). Hydrate from URL on init. The DataTable is dumb: it renders the arrow from the `sort` input and emits the clicked column key; the page component owns the cycle logic. Debounce isn't needed for sort (discrete clicks) but the shared pipeline's `debounceTime` is harmless. Multi-column sort (`sort=dept:asc,salary:desc`) is a `sort` array if the API supports it — most don't, so single-column is the default.",
    followUp: "Multi-column sort UX (shift-click) ko kaise design karoge?",
  },
  {
    id: "scc-3",
    question:
      "Team ek 'universal table' component bana rahi hai jiske 25 inputs ho gaye hain (pagination, sort, filter, selection, expand, inline-edit, export...). Feedback?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Ye 'framework in a component' anti-pattern hai — itni options matlab har feature half-configurable, aur consumers ke liye samajhna hand-writing se mushkil. Options: split into composable pieces (`DataTable` + `Paginator` + a `selection` directive), or adopt a mature table lib (Angular Material/CDK, AG Grid) instead of reinventing it.",
    detailedAnswer:
      "A good `DataTable` does: render columns + rows, emit sort/row-click, and offer a cell-template hook. Pagination is a sibling `Paginator`. Selection is a small directive or a `@Input() selectable` + `selectionChange`. Inline-edit and export are feature concerns, not table concerns. When requirements genuinely need a grid (virtual scroll, column resize/reorder, pinning, grouping, huge data) — use CDK Table or AG Grid; don't rebuild it. The 25-input component becomes unmaintainable and every consumer configures it slightly differently.",
    followUp: "CDK Table (`cdk-table`) aur ek hand-rolled config table — kab CDK par jaoge?",
  },
  {
    id: "scc-4",
    question: "Client-side sorting kab acceptable hai, aur uske stable-sort / locale issues?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Acceptable only when the whole dataset is loaded client-side (no server pagination) — a small bounded list. Then `[...rows].sort(comparator)` in a `computed`. Watch: `Array.prototype.sort` is stable in modern engines (good for multi-key), and string sort needs `localeCompare` (accents, case, numbers-in-strings) not `<`.",
    detailedAnswer:
      "`computed(() => [...this.rows()].sort(this.comparator()))` — copy first (don't mutate the source). Comparator per type: numbers `a - b`, strings `a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })`, dates by timestamp, nullables pushed to the end. Multi-key: chain comparators (`by(a).then(by(b))`). With server pagination this is wrong (only sorts the page). For a small lookup table it's instant and fine. Also: keep the sort in a `computed`, not in a subscription that mutates state.",
    followUp: "`localeCompare` ke bina string sort me kaunse concrete bugs aate hain?",
  },
  {
    id: "scc-5",
    question: "Column config ko strongly-typed rakhna — `keyof T` constraints kaise help/hinder karte hain?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`key: keyof T & string` catches typos and renames at compile time — if `Employee` loses `salary`, the column config errors. But computed columns (`fullName` that isn't a real key, or a 'Actions' column) don't fit `keyof T`, so you widen to `key: keyof T | string` or add a separate `id`/`slug` field, losing some safety.",
    detailedAnswer:
      "Pragmatic type: `type Column<T> = { key: string; label: string; sortable?: boolean; format?: (row: T) => string; }` with `format` typed to `T` (that's where the real safety is — the formatter can't access a non-existent field). Force real keys where possible via a helper `col<T>(key: keyof T & string, ...)`. 'Actions'/'select' columns get a sentinel key (`'__actions'`) and always a template. Over-constraining `key` to `keyof T` makes computed/virtual columns awkward; the formatter's `T` typing is the higher-value guarantee.",
    followUp: "'Actions' column (buttons, no data key) ko config me kaise represent karoge?",
  },
];

export default questions;
