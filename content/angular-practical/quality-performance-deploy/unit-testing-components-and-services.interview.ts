import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "utcs-1",
    question: "Angular me service aur component testing ka overview do — tools aur approach.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`TestBed` builds a test module. Services: `provideHttpClientTesting()` + `HttpTestingController` (`expectOne`/`flush`/`verify`) or fake deps via `{ provide, useValue }`. Components: `TestBed.createComponent` -> fixture; `componentRef.setInput` for signal inputs; `detectChanges()`; query by `data-test`; assert emitted outputs. Async: `fakeAsync`+`tick`. Favour pure-function + dumb-component tests.",
    detailedAnswer:
      "The pyramid: mappers/validators/reducers (no `TestBed`, pure in->out) get the most tests; dumb components (`setInput`, `detectChanges`, assert DOM + outputs, no infra mocks) get many; smart components (fake `EmployeeService`/`Router`, assert critical flows) get few. `httpMock.verify()` in `afterEach` catches stray requests. Reactive forms let you test form logic without the DOM (`patchValue`, assert `errors`/`valid`, call `submit()`). CI: `ng test --watch=false --browsers=ChromeHeadless` (or Jest/Vitest).",
    followUp: "Jest/Vitest par migrate karne ke pros aur gotchas kya hain?",
  },
  {
    id: "utcs-2",
    question: "`HttpTestingController` se ek `getAll(filters)` method ka test kaise likhoge?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Subscribe to `service.getAll(filters)`, then `const req = httpMock.expectOne(r => r.url === 'http://test/employees' && r.params.get('search') === 'aar')`, assert `req.request.method === 'GET'`, `req.flush({ items: [dto], total: 1, ... })`, then assert the subscribed result's mapped shape. `afterEach(() => httpMock.verify())`.",
    detailedAnswer:
      "```ts\nit('sends filters as params and maps items', () => {\n  let res: Paged<Employee> | undefined;\n  service.getAll({ page: 1, pageSize: 20, search: 'aar' }).subscribe(r => res = r);\n  const req = httpMock.expectOne(r => r.url.endsWith('/employees'));\n  expect(req.request.params.get('page')).toBe('1');\n  expect(req.request.params.get('search')).toBe('aar');\n  req.flush({ items: [{ id: 1, first_name: 'Aarav', salary: '85000', ... }], total: 1, page: 1, pageSize: 20 });\n  expect(res!.items[0].firstName).toBe('Aarav');\n  expect(res!.items[0].salary).toBe(85000);\n});\n```\nAlso test the error path with `req.error(new ProgressEvent('error'), { status: 500 })` and assert your normalized error.",
    followUp: "`expectOne` ke predicate function aur string URL — kab kaunsa?",
  },
  {
    id: "utcs-3",
    question: "`fakeAsync` + `tick` aur `waitForAsync` + `whenStable()` — kab kaunsa?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "`fakeAsync` + `tick(ms)`/`flush()` for **synchronous control** of timers, `setTimeout`, `debounceTime`, and microtasks — you advance virtual time explicitly, so tests are deterministic and fast. `waitForAsync` + `fixture.whenStable()` for **real** promises/XHR you can't fast-forward. Prefer `fakeAsync` where possible.",
    detailedAnswer:
      "`fakeAsync` wraps the test so all async is queued in a virtual scheduler; `tick(300)` advances past a `debounceTime(300)`, `flush()` drains everything, `discardPeriodicTasks()` cleans up `interval`s. Great for async validators (`tick(400)`), debounced search pipelines, and effect timing. `waitForAsync` lets real microtasks resolve and you `await fixture.whenStable()` — needed when something genuinely uses real async you can't mock (rare with `HttpTestingController`). Gotcha: an unresolved timer in `fakeAsync` throws 'X periodic timer(s) still in the queue' — you must flush/discard them.",
    followUp: "`fakeAsync` me ek `HttpTestingController` request flush karна — order kya hota hai `tick` ke saath?",
  },
  {
    id: "utcs-4",
    question:
      "Team ke tests brittle hain — chhote refactors par bahut se tests toot-te hain. Kya galat ho raha hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Likely testing implementation details: private methods, exact internal call order, CSS-class DOM queries, snapshot tests of full markup, or over-mocking so tests assert 'this method called that method'. Fix: test observable behaviour — rendered output, emitted events, service calls with expected args — and query by `data-test`.",
    detailedAnswer:
      "Signs and fixes: (1) `spyOn(component as any, 'privateHelper')` -> test through the public API instead; (2) `expect(x).toHaveBeenCalledBefore(y)` on internals -> assert the end result; (3) `By.css('.btn-primary')` -> `data-test` attributes; (4) full-DOM snapshots -> assert the specific text/element that matters; (5) a giant `beforeEach` mocking 10 collaborators for one behaviour -> split the component or push logic into pure functions. Good tests survive refactors that don't change behaviour and fail when behaviour changes.",
    followUp: "Snapshot testing Angular components me kab useful hai aur kab liability?",
  },
  {
    id: "utcs-5",
    question:
      "Ek signal store (`EmployeesStore`) ko kaise test karoge — state, selectors, aur async actions?",
    type: "coding",
    difficulty: "advanced",
    shortAnswer:
      "Provide the store with a fake API in `TestBed` (or `new EmployeesStore()` with an injected fake). Call actions (`setSearch`, `load`), then assert selector signals: `expect(store.pageItems()).toEqual(...)`, `expect(store.totalPages()).toBe(3)`. For `load`, fake the API to return `of(pagedDto)`, call `store.load()`, assert `items`/`loading` transitions. Use `fakeAsync` if the pipeline debounces.",
    detailedAnswer:
      "Signal stores are very testable because state is a plain signal and selectors are `computed` — no DOM, no `detectChanges` for the store itself. `TestBed.runInInjectionContext(() => new EmployeesStore())` or provide it. Test: (1) initial state; (2) `setSearch('x')` resets `page` to 1 and updates the derived query; (3) `load()` sets `loading` true then false and populates `items`; (4) an API error sets `error` and clears `loading`; (5) optimistic `deleteEmployee` removes then restores on failure. Assert signals synchronously; wrap in `fakeAsync` + `tick` only where the store's pipeline has timers.",
    followUp: "`computed` selectors ke re-computation ko test me kaise verify karoge (memoization)?",
  },
];

export default questions;
