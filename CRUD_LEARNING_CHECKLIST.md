# CRUD API Build Checklist — "Task Manager API"

Pick a genuinely simple domain (a Task/Todo API is ideal — one entity,
everyone understands it, no domain confusion to slow you down). Work
through phases in order; don't skip ahead even if something looks easy.

This is a personal practice project, separate from this repo — create
it in its own folder (e.g. `dotnet new webapi -n TaskManagerApi` run
somewhere outside `SystemDesignApplication`).

## Phase 0 — Environment

- [ ] Install .NET SDK (`dotnet --version` works in terminal)
- [ ] Install VS Code + C# Dev Kit extension (or Rider/Visual Studio)
- [ ] `dotnet new webapi -n TaskManagerApi`, `cd TaskManagerApi`, `dotnet run` — confirm it starts and Swagger UI loads in browser
- [ ] Install EF Core packages: `Microsoft.EntityFrameworkCore.Sqlite`, `Microsoft.EntityFrameworkCore.Design`

## Phase 1 — Minimal CRUD (follow the site's walkthrough, typed by hand)

- [ ] `TaskItem` Model (Id, Title, IsDone, CreatedAt)
- [ ] `AppDbContext` with `DbSet<TaskItem>`
- [ ] `ITaskService` interface — just `GetByIdAsync`, `CreateAsync` first
- [ ] `TaskService` implementing it, constructor-injects `AppDbContext`
- [ ] `TasksController` — constructor-injects `ITaskService`, one `GET /{id}` and one `POST` endpoint
- [ ] Wire DI in `Program.cs` (`AddDbContext`, `AddScoped<ITaskService, TaskService>`)
- [ ] `dotnet ef migrations add InitialCreate` + `dotnet ef database update` — real SQLite file created
- [ ] Test both endpoints in Swagger UI — confirm a row actually lands in the DB

## Phase 2 — Complete the CRUD, add real shape

- [ ] Add `GetAllAsync`, `UpdateAsync`, `DeleteAsync` to interface + service + controller (4 more endpoints)
- [ ] Introduce a `CreateTaskDto`/`UpdateTaskDto` — stop exposing the raw entity
- [ ] Add DataAnnotations validation on the DTO (`[Required]`, `[MaxLength]`) — confirm a bad request returns 400 automatically
- [ ] Return correct status codes: 201 on create (`CreatedAtAction`), 204 on delete, 404 when not found
- [ ] Add a second related entity (e.g. `Category` with `TaskItem.CategoryId`) — configure the relationship, add a migration

## Phase 3 — Harden it

- [ ] Global exception handling middleware — no raw stack traces leaking to the client
- [ ] Structured logging with `ILogger<T>` in the service layer
- [ ] Add pagination to the `GetAll` endpoint (`?page=1&pageSize=20`)
- [ ] Write 3–5 unit tests for `TaskService` using xUnit + Moq (mock `AppDbContext` is hard — mock at the repository/interface level or use EF Core InMemory)

## Phase 4 — Stretch (once Phase 1–3 feel natural, no notes needed)

- [ ] Add JWT authentication, lock down write endpoints with `[Authorize]`
- [ ] Swap SQLite for a real Postgres/SQL Server connection string
- [ ] Add an integration test with `WebApplicationFactory`
- [ ] Rebuild the **entire thing again from scratch** for a different entity (e.g. `Note` or `Expense`) — no reference material this time; this is the real test

## When you get stuck

Look up the matching topic on the site instead of guessing — but only
*after* you've hit the confusion while coding, not before:

- Stuck on the overall flow → `oops-dotnet/end-to-end-crud-walkthrough-model-to-controller`
- Stuck on DI → `oops-dotnet/dependency-injection-ioc-oop-payoff`
- Stuck on migrations → `dotnet-fundamentals/ef-core-migrations` or `dotnet-fundamentals/code-first-vs-database-first-migrations`
- Stuck on DTOs/validation → `oops-dotnet/dtos-model-binding-validation-mapping`
- Stuck on service lifetimes (Scoped/Singleton/Transient) → `oops-dotnet/service-lifetimes-captive-dependency`
- Stuck on relationships/N+1 → `dotnet-fundamentals/navigation-properties-and-relationships`, `dotnet-fundamentals/loading-strategies-and-n-plus-1`
- Stuck on testing → `dotnet-fundamentals/unit-testing-fundamentals-aaa`, `dotnet-fundamentals/mocking-with-moq-nsubstitute`
