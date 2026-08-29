import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "drls-1",
    question: "Ek bade app me nayi CRUD feature add karna kitna kaam hai, aur wo kaise minimize karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "With the foundation in place, minimal: a `Column[]` config, a store from a `createListState` factory (page/pageSize/sort/filters + URL sync + the switchMap query), a reactive form (+ DTO mapper), and 3 lazy routes. Everything visual/behavioural (`DataTable`, `Paginator`, `ConfirmModal`, `StatusBadge`, `FieldError`) is reused.",
    detailedAnswer:
      "The leverage comes from up-front investment: (1) a generic list-state factory so page/filter/sort/URL logic isn't rewritten; (2) dumb reusable components with clean input/output APIs; (3) a CRUD service shape (or factory) per entity; (4) shared validators and a field-error component. A new feature then reads as configuration, not code. The anti-pattern is forking these per feature — when Departments 'needs something slightly different', extend the shared piece (a new `Column` option, a template slot) rather than copy it.",
    followUp: "`createListState` factory ki API kaise design karoge — kya configurable, kya fixed?",
  },
  {
    id: "drls-2",
    question: "RBAC ko Angular app me end-to-end kaise implement karoge? Trust boundary kahan?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Login response / decoded token gives the user's roles/effective permissions -> `AuthService.permissions` signal. UI: `*appHasPermission=\"'x'\"` structural directive hides actions; `permissionGuard('x')` (`CanMatch`) hides routes and skips lazy chunks. Trust boundary: none of this is security — every API endpoint authorizes the request itself, server-side.",
    detailedAnswer:
      "Layers: (1) permission strings in one shared constant (agreed with backend); (2) `hasPermission(p)` / `hasAnyRole(...)` on `AuthService` reading the signal; (3) the structural directive for buttons/menus; (4) `CanMatch` guards for routes (so non-permitted users don't even download the feature); (5) optionally, disabling vs hiding based on UX. The server independently checks roles/permissions/ownership on every mutating endpoint — because a client can call the API directly. Frontend RBAC = 'don't tempt the user with things they can't do'; backend RBAC = 'don't let them do it'.",
    followUp: "Fine-grained (row-level) permissions — jaise 'sirf apni department ke employees edit kar sakta hai' — kaise handle karoge?",
  },
  {
    id: "drls-3",
    question: "Leave-request approval workflow ko kaise model karoge — states, actions, gating?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "A `status` enum (`pending | approved | rejected | cancelled`). Allowed transitions: pending->approved/rejected (approver), pending->cancelled (owner). Actions in the UI are shown only when `currentUserCanDoIt && status allows it`. Each action is a `PATCH /leave/:id { status }` + refetch/optimistic + a notification.",
    detailedAnswer:
      "Represent transitions explicitly — a small map `{ pending: ['approved', 'rejected', 'cancelled'], approved: [], ... }` — so the UI (and ideally the server) can't do illegal moves. Gating combines role (`hasPermission('leave.approve')`), ownership (`req.employeeId === currentUser.id` for cancel), and status. Side effects on transition: notify the employee, maybe adjust a leave-balance, log an audit entry — keep these on the server; the front-end just reflects the new state. As workflows grow (multi-level approval, delegation), a proper state machine (XState-style) beats scattered `if`s.",
    followUp: "Multi-level approval (manager -> HR) ke liye status model kaise extend hoga?",
  },
  {
    id: "drls-4",
    question:
      "Departments feature ko 'thoda alag' chahiye (ek extra bulk-import button, ek custom column). Shared components ko fork karein ya extend?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Extend, don't fork. The extra button lives in the Departments page (composition), not the table. The custom column is a `Column` with a `cellTemplate` (the table's escape hatch). Only fork when the divergence is fundamental and permanent — and even then, prefer a second focused component over a fork with an `if` for every feature.",
    detailedAnswer:
      "Forking a shared component means every future fix must be applied twice and they drift. Cheaper: (1) the page composes extra UI around the shared table; (2) the table exposes a per-column `TemplateRef` for custom cells and maybe a toolbar `<ng-content>` slot; (3) genuinely feature-specific behaviour stays in the feature's store, not the shared component. If three features each want a different thing, that's a signal the shared component's API needs one well-chosen extension point, not three flags.",
    followUp: "Shared component me kitne extension points 'too many' hote hain — kaise judge karoge?",
  },
  {
    id: "drls-5",
    question: "Permission strings ko manage karne ka best approach kya hai front-end aur back-end ke beech?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "One canonical list, ideally generated or shared. If the backend is TypeScript, a shared package exports the `Permission` union type. Otherwise, the front-end keeps a `PERMISSIONS` const that mirrors the backend's, and a contract test / CI check flags drift. Never sprinkle raw permission literals through components.",
    detailedAnswer:
      "Raw literals (`*appHasPermission=\"'emplyee.delete'\"` — typo) fail silently: the check just returns false, the button hides, and nobody notices until a user complains. Mitigations: (1) `export const PERM = { EMPLOYEE_DELETE: 'employee.delete', ... } as const` and a `Permission = typeof PERM[keyof typeof PERM]` type so the directive/guard args are type-checked; (2) if possible, generate this from the backend's source of truth (OpenAPI extension, a shared JSON) so adding a permission is one place; (3) a startup assertion in dev that the token's permissions are a subset of the known list, logging unknowns.",
    followUp: "Front-end ko ek unknown permission string mile token me — kya karna chahiye?",
  },
];

export default questions;
