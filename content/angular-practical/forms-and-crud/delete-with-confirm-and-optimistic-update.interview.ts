import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "dcou-1",
    question: "Delete-after-confirm ke baad list update karne ke tareeke aur trade-offs.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "(1) Refetch: `DELETE` -> `reload()` the current page. Simple, always server-consistent, one extra request, small visible delay. (2) Optimistic: remove from local state now, `DELETE`, restore a snapshot on failure. Instant UX, but snapshot/rollback code and edge cases (paged away, totals). Default to refetch; optimistic when instant feedback genuinely matters.",
    detailedAnswer:
      "Refetch is the boring correct choice for most admin CRUD — no divergence between client and server, no rollback bugs. Optimistic shines on slow networks / mobile / high-interaction lists. Encapsulate optimistic delete + rollback in a store method so every list doesn't re-implement it. Both need: a confirm step, a per-row `deletingId` spinner, and an error toast. Bulk delete scales the same choice with `forkJoin` + per-request `catchError` for partial-failure reporting.",
    followUp: "Optimistic delete ke baad user turant filter/page change kare aur phir DELETE fail ho — rollback kaha aur kaise?",
  },
  {
    id: "dcou-2",
    question: "Ek reusable confirm dialog design karo jo `window.confirm` replace kare.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`<app-confirm-modal>` with inputs `open`, `title`, `message`, `confirmText`, `danger`, and outputs `confirmed`/`cancelled`. Parent holds `pendingDelete = signal<T | null>(null)`; `[open]=\"pendingDelete() !== null\"`; `(confirmed)` -> do the action + clear; `(cancelled)` -> clear. OnPush, focus-trapped, Escape-to-close.",
    detailedAnswer:
      "Slot-based body via `<ng-content>` for custom content, or just `message`. Accessibility: `role=\"dialog\"` `aria-modal`, trap focus, return focus on close, close on Escape/backdrop. For a promise-y API, a `ConfirmService.ask(opts): Observable<boolean>` that renders the modal via CDK Overlay — then `confirm.ask({...}).pipe(filter(Boolean), switchMap(() => api.remove(id)))`. This one component then covers delete, discard-changes, leave-page, and 'are you sure' everywhere.",
    followUp: "Slot-based `<app-modal>` component vs service-driven `dialog.open(Component)` — kab kaunsa?",
  },
  {
    id: "dcou-3",
    question:
      "Optimistic delete ke edge cases kya hain, aur unhe kaise handle karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "(1) Failure ke time user ne page/filter change kar diya -> restoring the snapshot into a now-different view is wrong; instead re-fetch or show a toast + re-fetch. (2) Pagination total stale -> decrement or refetch. (3) The deleted row was on a page that's now empty -> jump to the previous page. (4) Concurrent deletes -> operate on a snapshot per call, not shared mutable state.",
    detailedAnswer:
      "Practical policy: optimistic remove for the instant feel, but on **failure** do a `reload()` rather than a blind `set(snapshot)` if the view context may have changed — it's more robust than trying to reconstruct. Keep `total` in sync (`total.update(t => t - 1)` on success, `+ 1` on rollback) or just refetch. Empty-page-after-delete: `if (pageItems().length === 0 && page() > 1) page.update(p => p - 1)`. All of this belongs in the store, tested once.",
    followUp: "Store me optimistic delete ka test kaisa likhoge — success aur rollback dono?",
  },
  {
    id: "dcou-4",
    question: "Bulk delete (12 selected) ko kaise implement karoge, aur partial failures?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Confirm 'Delete 12?'. Then `forkJoin(ids.map(id => api.remove(id).pipe(map(() => ({ id, ok: true })), catchError(() => of({ id, ok: false })))))`. Collect results: remove the `ok` ones from state, keep the failed ones, toast '10 deleted, 2 failed'.",
    detailedAnswer:
      "Key: each inner request must have its own `catchError` so `forkJoin` doesn't abort on the first failure. Optimistic variant: remove all 12 now, then re-insert the failed ones from the snapshot. For very large selections, consider a dedicated bulk endpoint (`DELETE /employees?ids=1,2,3`) so it's one request and one transaction server-side — far better than N requests. Show progress for long-running bulk ops. Always re-fetch or fix pagination after.",
    followUp: "N individual requests vs ek bulk endpoint — kis selection size par switch karoge?",
  },
  {
    id: "dcou-5",
    question: "Delete ko soft-delete (archive) vs hard-delete banane ka front-end pe kya asar hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Soft-delete: the record still exists (an `isArchived`/`deletedAt` flag), so the UI 'removes' it from the default list but may offer an 'Archived' filter and an 'Undo/Restore' action. Hard-delete: gone; 'Undo' isn't possible, so the confirm step matters more and you might add a longer 'Undo' toast window before the request actually fires.",
    detailedAnswer:
      "Soft-delete UX: list filters out archived by default; a toggle shows them; each has 'Restore'. The 'delete' call is really `PATCH { isArchived: true }`. Hard-delete UX: stronger confirm copy ('This cannot be undone'), and optionally a delayed-execution 'Undo' pattern — show a toast with 'Undo' for 5s and only fire `DELETE` if not undone (Gmail-style). Front-end code differs: soft-delete is just a filtered list + a status field; hard-delete benefits from the delayed-request safety net.",
    followUp: "Gmail-style 'Undo send' (delayed request) pattern Angular me kaise implement karoge?",
  },
];

export default questions;
