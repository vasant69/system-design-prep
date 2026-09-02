// Full Stack Interview Prep — Complete Question Bank.
//
// Verbatim transcription of the user-provided "Full Stack Interview Prep"
// document (Full Stack Developer, 4+ yrs Fintech; SQL / Angular / Node.js /
// ASP.NET Core Web API). No answers by design — each item carries the
// follow-ups an interviewer would drill into. Rendered as-is by
// app/interview-mode/page.tsx.

export type IQQuestion = {
  q: string;
  followups?: string[];
  /**
   * Optional worked answer. Lightweight markdown: blank-line-separated
   * paragraphs, `- ` bullet lists, ```lang fenced code blocks, `**bold**`,
   * and inline `code`. Rendered under a collapsed "Answer" toggle.
   */
  answer?: string;
};

export type IQCategory = {
  id: string;
  number: number;
  /** Display override for the number label, e.g. "16b". Falls back to `number`. */
  numLabel?: string;
  title: string;
  note?: string;
  questions: IQQuestion[];
};

export type IQPart = {
  id: string;
  label: string;
  title: string;
  blurb?: string;
  categories: IQCategory[];
};

export const INTERVIEW_PREP_META = {
  title: "Full Stack Interview Prep — Complete Question Bank",
  profile:
    "Full Stack Developer, 4+ yrs Fintech experience | Stack: SQL, Angular, Node.js, ASP.NET Core Web API",
  scope:
    "Everything a technical interview loop for this profile can realistically touch — core stack (theory + practical), system design, DSA basics, and the cross-cutting engineering topics (auth, security, patterns, DevOps, cloud) that senior-ish full-stack rounds pull from.",
  disclaimer:
    "Each item has follow-ups nested under it the way a real interviewer drills deeper. The SQL and Angular sections include a collapsible worked \"Answer\" with explanation and examples under each question; the rest are prompts only for now. Question count is intentionally large; skim first, then go deep only where you're weak.",
};

export const INTERVIEW_PREP_PARTS: IQPart[] = [
  {
    id: "part-a",
    label: "Part A",
    title: "Core Stack",
    categories: [
      {
        id: "sql-theoretical",
        number: 1,
        title: "SQL — Theoretical",
        questions: [
          {
            q: "Explain all types of joins: inner, left, right, full outer, self join, cross join.",
            followups: [
              "How does a left join behave if you add a WHERE clause filtering on the right table's column?",
              "Difference between a self join and simply aliasing the same table twice in a query?",
            ],
            answer:
              "**Inner join** returns only rows with a match on both sides. **Left (outer) join** returns all left rows plus matched right columns, NULLs where there's no match; **right join** is the mirror. **Full outer join** returns all rows from both sides, NULLs filling the missing side. **Cross join** is the Cartesian product (every left row paired with every right row) — no ON clause. **Self join** joins a table to itself via two aliases, e.g. to pair an employee with their manager.\n\n```sql\nSELECT e.name, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;\n```\n\n**Follow-up — WHERE on the right table:** a right-table predicate in WHERE silently turns a LEFT JOIN back into an INNER JOIN, because unmatched rows have `right.col = NULL`, which is not true. Put the filter in the ON clause (`LEFT JOIN ... ON ... AND right.col = 'x'`) to keep unmatched left rows.\n\n**Follow-up — self join vs two aliases:** they're the same thing. 'Self join' just means both aliases point at one physical table; there is no special syntax.",
          },
          {
            q: "Clustered vs non-clustered index — what's the difference?",
            followups: [
              "Can a table have more than one clustered index?",
              "How does column order in a composite index affect query performance (leftmost prefix rule)?",
            ],
            answer:
              "A **clustered index** defines the physical order of the rows — the table *is* the index; its B-tree leaves hold the full rows. A **non-clustered index** is a separate B-tree whose leaves hold the key columns plus a pointer back to the row (the clustered key, or a RID for a heap).\n\nConsequence: a clustered-key lookup is a single seek; a non-clustered lookup that needs columns not in the index does a second 'key lookup' per row — costly at volume, which is why covering indexes matter.\n\n**Follow-up — more than one clustered index:** no. Rows can only be physically ordered one way, so at most one per table. You can have many non-clustered indexes.\n\n**Follow-up — composite column order (leftmost prefix):** an index on `(a, b, c)` can seek on `a`, `a,b`, or `a,b,c`, but not `b` alone or `c` alone. Put equality-filtered, selective columns first and range columns last, and match the ORDER BY so you skip a sort.",
          },
          {
            q: "What is normalization? Explain 1NF, 2NF, 3NF, BCNF.",
            followups: [
              "Give an example of a table that violates 2NF.",
              "When would you intentionally denormalize a schema?",
            ],
            answer:
              "Normalization organizes columns and tables to remove redundancy and update anomalies, so every non-key fact depends on 'the key, the whole key, and nothing but the key.'\n\n- **1NF:** atomic values, no repeating groups or arrays in a column; a primary key exists.\n- **2NF:** 1NF and no *partial* dependency — non-key columns depend on the whole composite key, not part of it.\n- **3NF:** 2NF and no *transitive* dependency — non-key columns don't depend on other non-key columns.\n- **BCNF:** stricter 3NF — every determinant (left side of a functional dependency) is a candidate key.\n\n**Follow-up — 2NF violation:** `order_items(order_id, product_id, quantity, product_name)`. Key is `(order_id, product_id)` but `product_name` depends only on `product_id` — a partial dependency. Fix: move `product_name` into a `products` table.\n\n**Follow-up — when to denormalize:** read-heavy reporting, expensive repeated joins, or precomputed aggregates (a cached `account.balance`), always with a defined mechanism to keep the copy consistent (trigger, app logic, outbox, periodic rebuild).",
          },
          {
            q: "Explain ACID properties.",
            followups: [
              "Which ACID property is hardest to guarantee in a distributed database, and why?",
            ],
            answer:
              "- **Atomicity:** all-or-nothing; a failure rolls back every change in the transaction.\n- **Consistency:** a transaction moves the DB from one valid state to another, respecting constraints and triggers.\n- **Isolation:** concurrent transactions don't see each other's uncommitted intermediate state (degree set by the isolation level).\n- **Durability:** once committed, changes survive a crash (write-ahead log flushed to stable storage).\n\n**Follow-up — hardest in a distributed DB:** isolation/consistency across nodes. Atomicity across shards needs two-phase commit or sagas; global isolation needs distributed locking or a timestamp/consensus protocol (Spanner's TrueTime, Calvin). Partitions force the CAP trade-off, so many systems relax to eventual consistency or offer per-shard transactions only. Durability is comparatively easy — replicate the log to a quorum.",
          },
          {
            q: "What are SQL isolation levels? What anomalies does each prevent (dirty read, non-repeatable read, phantom read, lost update)?",
            followups: [
              "What isolation level would you pick for a banking balance transfer, and why?",
            ],
            answer:
              "- **Read Uncommitted:** allows dirty reads (seeing another txn's uncommitted data).\n- **Read Committed:** no dirty reads; still allows non-repeatable reads and phantoms. Default in most engines.\n- **Repeatable Read:** re-reading the same row gives the same value; phantoms (new rows matching a range) may still appear — except MySQL InnoDB, which blocks them with next-key locks.\n- **Serializable:** transactions behave as if run one at a time; no phantoms, no write skew.\n\n**Lost update** = two txns read-modify-write the same row and one silently overwrites the other; prevented by Serializable, `SELECT ... FOR UPDATE`, or an optimistic version check.\n\n**Follow-up — banking transfer:** Serializable, or Read Committed with `SELECT ... FOR UPDATE` on both account rows taken in a fixed id order. You must not lose an update or act on a stale balance; correctness beats the small concurrency cost, and you add retry-on-serialization-failure.",
          },
          {
            q: "What are window functions? Explain ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, PARTITION BY, NTILE.",
            followups: [
              "Difference between RANK and DENSE_RANK when there are ties?",
              "How would you find the 2nd highest salary per department using a window function?",
            ],
            answer:
              "Window functions compute a value across a set of rows 'related to the current row' without collapsing them like GROUP BY does. `OVER (PARTITION BY ... ORDER BY ...)` defines the window.\n\n- **ROW_NUMBER()** — unique 1..N sequence, ties broken arbitrarily.\n- **RANK()** — ties share a rank, then a gap (1, 1, 3).\n- **DENSE_RANK()** — ties share a rank, no gap (1, 1, 2).\n- **LAG/LEAD(col, n)** — value from n rows before/after — ideal for deltas.\n- **NTILE(k)** — splits rows into k roughly equal buckets (quartiles, deciles).\n\n**Follow-up — RANK vs DENSE_RANK:** RANK leaves a gap after a tie; DENSE_RANK doesn't.\n\n**Follow-up — 2nd highest salary per department:**\n```sql\nSELECT * FROM (\n  SELECT e.*,\n         DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk\n  FROM employees e\n) t\nWHERE rnk = 2;\n```",
          },
          {
            q: "CTE vs subquery vs temp table vs derived table (inline view) — differences and when to use each?",
            followups: ["Can a CTE be recursive? Give a real use case."],
            answer:
              "- **Derived table (inline view):** a subquery in FROM. Scoped to that one query; the optimizer folds it in.\n- **CTE (`WITH`):** a named, readable derived table, referenceable multiple times in the same statement, and able to be recursive. Usually not materialized (older Postgres was an exception).\n- **Scalar / correlated subquery:** returns one value / runs per outer row. Fine for small sets; slow if correlated over many rows.\n- **Temp table (`#t` / `CREATE TEMP TABLE`):** physically materialized, can be indexed, has statistics, lives for the session/proc. Use it when the intermediate result is large, reused across statements, or the optimizer misjudges a CTE.\n\nRule of thumb: CTE for readability in one query; temp table when you need to materialize, index, or reuse across statements.\n\n**Follow-up — recursive CTE:** yes. Use cases: walking an org chart or category tree, or a bill-of-materials explosion. Anchor member + recursive member joined with UNION ALL, terminating when the recursive part returns no rows.",
          },
          {
            q: "What causes a deadlock in SQL? How do you detect and prevent one?",
            answer:
              "A deadlock is a cycle: txn A holds a lock on resource 1 and wants 2; txn B holds 2 and wants 1. Neither can proceed. The engine's deadlock monitor detects the cycle and kills one transaction as the victim (usually the one with the least log to roll back); that session gets an error (SQL Server 1205, Postgres 40P01) and must retry.\n\nCauses: acquiring locks in inconsistent order across code paths, long transactions, lock escalation, missing indexes forcing wide scans/locks, or needlessly high isolation.\n\nPrevent / mitigate:\n- Access tables and rows in a **consistent order** everywhere.\n- Keep transactions **short** — no user interaction or slow I/O inside them.\n- Add indexes so updates touch few rows.\n- Use the lowest safe isolation level, or take the needed lock up front (`UPDLOCK` / `SELECT ... FOR UPDATE`).\n- Wrap the operation in **retry-on-deadlock** logic with small backoff.",
          },
          {
            q: "View vs stored procedure vs function vs trigger — differences?",
            followups: [
              "Can a view be updatable? When does that break?",
              "What's a materialized/indexed view and when would you use one?",
            ],
            answer:
              "- **View:** a named SELECT; a virtual table. No parameters, no side effects. Reuses query logic, can enforce column/row-level security.\n- **Stored procedure:** a routine that runs multiple statements, takes parameters, does DML, manages transactions, returns result sets. Called with `EXEC`.\n- **Function (UDF):** returns a scalar or table, meant for use *inside* a query; should be side-effect-free. Scalar UDFs can be slow (row-by-row) — prefer inline table-valued functions.\n- **Trigger:** code that fires automatically on INSERT/UPDATE/DELETE (or DDL). Good for audit trails and invariants; risky when overused (hidden logic, performance surprises).\n\n**Follow-up — updatable view:** works only if the view maps unambiguously to one base table's rows — no aggregates, DISTINCT, GROUP BY, UNION, most joins, or computed target columns. Otherwise use an `INSTEAD OF` trigger.\n\n**Follow-up — materialized / indexed view:** a view whose result is physically stored and kept in sync (Postgres `MATERIALIZED VIEW`, refreshed manually or on a schedule; SQL Server indexed view, maintained automatically). Use for expensive aggregations read far more often than the base data changes.",
          },
          {
            q: "What is the N+1 query problem? How do you fix it?",
            answer:
              "N+1 = 1 query to fetch a list of N parents, then 1 query per parent to load its children — N+1 round trips. Classic with lazy-loading ORMs: `foreach (var order in orders) { var lines = order.Lines; }`.\n\nSymptoms: a page that's fine with 10 rows and dies with 500; a profiler showing hundreds of near-identical small queries.\n\nFixes:\n- **Eager load / join:** EF `.Include(o => o.Lines)`, or one JOIN query.\n- **Batch the child query:** `WHERE parent_id IN (@ids)`, then group in memory (the dataloader pattern).\n- **Projection:** select exactly the columns the view needs in a single query.\n- Cache reference data that's read repeatedly.",
          },
          {
            q: "How do you read a query execution plan? What do you look for?",
            followups: [
              "Difference between a table scan, index scan, and index seek?",
              "What is a \"spool\" or a \"sort\" operator telling you about a bad plan?",
            ],
            answer:
              "Read it inner-to-outer / right-to-left — that's the data flow. Look for:\n- **Scans where you expected seeks** on a big table → missing/unusable index, or a non-SARGable predicate (function on the column, leading wildcard, implicit type cast).\n- **Estimated vs actual rows** far apart → stale statistics or parameter sniffing.\n- **Expensive operators:** large Sort, Hash Match spilling to tempdb, Key Lookup (add covering columns), Nested Loops over a big outer input.\n- **Warnings:** tempdb spill, implicit conversion, missing-index suggestion.\n- **Thick arrows** = many rows; find where the row count explodes.\n\n**Follow-up — scan vs index scan vs seek:** table scan = read every row of a heap; index scan = read every leaf of an index (all rows, narrower); index seek = B-tree navigation to an exact range — the only one that scales sublinearly.\n\n**Follow-up — spool / sort:** a Sort means the engine had to order data itself (no index provides the order, or it's needed for a merge join, ranking, or DISTINCT). A Spool means it's caching an intermediate result in tempdb to reuse — often a sign of redundant work or a missing index.",
          },
          {
            q: "What is a covering index?",
            answer:
              "A covering index contains every column a query needs — in the key or as INCLUDE'd columns — so the engine answers the query entirely from the index, with no key lookups into the base table. The plan shows an index seek/scan and no lookup.\n\n```sql\n-- query: SELECT status, amount FROM txns WHERE user_id = @u AND created_at >= @d;\nCREATE INDEX ix_txns_user_date\n  ON txns (user_id, created_at) INCLUDE (status, amount);\n```\n\nTrade-off: a wider index means more storage and slower writes. Cover the hot queries, not everything.",
          },
          {
            q: "When would you denormalize a schema for performance?",
            answer:
              "Denormalize when normalized reads are too slow or too complex for the workload and you can keep the redundancy correct:\n- Precomputed aggregates (`account.balance`, `post.comment_count`) updated by trigger / app / outbox.\n- Duplicated 'label' columns to avoid a join on a hot path — e.g. storing `product_name` on `order_items` as it was at purchase time (also a legitimate historical snapshot, not just a cache).\n- Reporting / OLAP star schemas, CQRS read models, search-index projections.\n\nCosts: write amplification, drift risk, more code paths. Always define how the copy stays in sync and how you'd rebuild it from the source of truth.",
          },
          {
            q: "Explain transactions — BEGIN/COMMIT/ROLLBACK, savepoints, nested transactions, transaction scope in application code.",
            answer:
              "`BEGIN TRANSACTION` starts a unit of work; `COMMIT` makes it durable; `ROLLBACK` undoes everything since BEGIN. **Savepoints** (`SAVE TRANSACTION sp` / `SAVEPOINT sp`) let you roll back part of a transaction (`ROLLBACK TO sp`) without aborting the whole thing.\n\n**Nested transactions** are mostly cosmetic in SQL Server — only the outermost COMMIT actually commits, `@@TRANCOUNT` tracks depth, and any ROLLBACK unwinds everything. Postgres has no true nesting, only savepoints.\n\n**In app code:** keep the scope tight — open late, commit early, never span a network call or user wait. Use the framework's unit-of-work (`TransactionScope`, EF `SaveChanges`, or `BEGIN`/`COMMIT` in `try/finally`). Set the isolation level explicitly for money operations and retry on deadlock/serialization errors.\n\n```sql\nBEGIN TRAN;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  SAVE TRAN after_debit;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\n  -- on credit failure: ROLLBACK TRAN after_debit; then handle\nCOMMIT;\n```",
          },
          {
            q: "Primary key vs unique key vs foreign key — constraints and behavior differences.",
            followups: [
              "What happens to child rows on delete with CASCADE vs RESTRICT vs SET NULL?",
            ],
            answer:
              "- **Primary key:** uniquely identifies a row; not null; one per table; usually the clustered index. The stable identity.\n- **Unique key/constraint:** enforces uniqueness on a column set; allows one NULL (SQL Server) or multiple NULLs (ANSI/Postgres) depending on engine; you can have several.\n- **Foreign key:** references a PK/UK in another (or the same) table; enforces referential integrity — no child pointing at a missing parent, no deleting a parent that still has children unless a referential action says otherwise.\n\n**Follow-up — delete actions on child rows:**\n- `ON DELETE CASCADE` — deleting the parent deletes its children.\n- `ON DELETE RESTRICT` / `NO ACTION` — blocks the parent delete while children exist (default).\n- `ON DELETE SET NULL` — children's FK column is set to NULL (must be nullable).\n- `SET DEFAULT` — sets the FK to its default value.",
          },
          {
            q: "Deadlock vs lock wait/timeout — how are they different and handled differently?",
            answer:
              "**Lock wait** = a session is blocked waiting for a lock another session holds; it *will* proceed once that lock releases. A **lock timeout** just means it waited past `LOCK_TIMEOUT` / `innodb_lock_wait_timeout` and gave up. There's no cycle — it's one-directional contention.\n\n**Deadlock** = a *cycle* of mutual waits that can never resolve itself, so the engine must detect it and kill a victim.\n\nHandling differs: for lock waits you reduce contention (shorter txns, better indexes, lower isolation, read replicas) and set a sensible timeout so a stuck request fails fast. For deadlocks you also enforce consistent lock ordering and add automatic retry, because the victim's error is transient and safe to re-run.",
          },
          {
            q: "Pagination strategies — OFFSET/FETCH vs keyset (seek) pagination. Performance implications at scale?",
            answer:
              "**OFFSET/FETCH (`LIMIT n OFFSET m`):** simple, allows jumping to any page, but the engine reads and discards all m skipped rows — page 10,000 gets linearly slower — and results shift if rows are inserted/deleted between page loads.\n\n**Keyset / seek pagination:** remember the last row's sort key and fetch 'the next N after it.' Constant time at any depth, stable under inserts. Downsides: no random page jumps, needs a unique ordered key.\n\n```sql\n-- next page after (created_at, id) = (@lastTs, @lastId), DESC order\nSELECT * FROM txns\nWHERE (created_at, id) < (@lastTs, @lastId)\nORDER BY created_at DESC, id DESC\nFETCH FIRST 20 ROWS ONLY;\n```\n\nFor infinite scroll, APIs, and exports, prefer keyset.",
          },
          {
            q: "How do you handle very large tables? Explain table/index partitioning (range, hash, list).",
            answer:
              "Partitioning splits one logical table into physical pieces by a partition key, so queries and maintenance touch only relevant pieces (partition pruning), and you can drop/archive a whole partition instantly instead of a huge DELETE.\n- **Range:** by date (most common for transactions/logs) or id range.\n- **List:** by a discrete value (region, tenant, status).\n- **Hash:** by hash of a key, to spread rows evenly when there's no natural range.\n\nOther large-table tactics: aligned local indexes, rolling-window archival (drop old partitions), compression on cold partitions, and ensuring queries include the partition key so pruning kicks in. Partitioning helps manageability and pruning — it is not a substitute for good indexes.",
          },
          {
            q: "UNION vs UNION ALL — difference and performance impact.",
            answer:
              "`UNION` concatenates two result sets **and removes duplicate rows**, which needs a sort or hash-distinct pass over the whole thing. `UNION ALL` just concatenates — no dedup, no sort — so it's much cheaper.\n\nUse `UNION ALL` whenever the inputs are known to be disjoint (or duplicates are acceptable). Only pay for `UNION` when you genuinely need distinct rows.",
          },
          {
            q: "DELETE vs TRUNCATE vs DROP — differences (logging, rollback, identity reset, permissions, triggers firing).",
            answer:
              "- **DELETE:** row-by-row DML, fully logged, supports WHERE, fires triggers, rolls back, keeps the table and identity seed. Slow for whole-table clears.\n- **TRUNCATE:** deallocates data pages, minimally logged, very fast, resets identity to seed, needs higher privilege (ALTER), doesn't fire DELETE triggers, can't be filtered, is blocked if the table is referenced by an enabled FK. Rollback-able inside a transaction in SQL Server/Postgres.\n- **DROP:** removes the table definition, data, indexes, constraints, permissions, and triggers entirely.\n\nRule: `DELETE` when you need a filter / triggers / audit, `TRUNCATE` to reset a whole staging table fast, `DROP` to remove the object.",
          },
          {
            q: "How do you prevent SQL injection? Explain parameterized queries / prepared statements.",
            answer:
              "SQL injection = user input concatenated into a SQL string so an attacker can change the query's structure (`'; DROP TABLE users; --`, `OR 1=1`).\n\nFix: **parameterized queries / prepared statements** — the SQL text with placeholders (`@id`, `?`, `$1`) is sent and compiled first; parameter values are then bound as *data*, never parsed as SQL, so structure can't be altered.\n\n```csharp\ncmd.CommandText = \"SELECT * FROM users WHERE email = @e\";\ncmd.Parameters.AddWithValue(\"@e\", input);\n```\n\nAlso: use an ORM/query builder that parameterizes by default; allowlist things that can't be parameters (table/column names, ORDER BY direction); run under least-privilege DB accounts; and inside stored procs use `sp_executesql` with parameters, never `EXEC(@sql)` built from raw input.",
          },
          {
            q: "Explain database replication — master-slave/primary-replica, read replicas, replication lag, synchronous vs asynchronous replication.",
            answer:
              "Replication copies data from a **primary** to one or more **replicas**. Reads can be spread across replicas; the primary takes all writes.\n- **Asynchronous:** primary commits without waiting for replicas → best write latency, but replicas lag and a primary crash can lose the last few transactions.\n- **Synchronous / semi-sync:** primary waits for at least one replica to acknowledge the log before committing → no data loss on failover, higher write latency, and a slow replica can stall writes.\n\n**Replication lag** is how far behind a replica is. It breaks 'read your own writes': a user updates their profile, the next request hits a lagging replica, they see stale data. Mitigate by routing freshness-sensitive reads to the primary, 'read from primary for N seconds after a write', or causal-consistency tokens.",
          },
          {
            q: "Optimistic vs pessimistic locking — when would you use each (e.g., updating an account balance)?",
            answer:
              "**Pessimistic:** lock the row on read (`SELECT ... FOR UPDATE` / `UPDLOCK`) so nobody else can change it until you commit. Good under high contention on the same rows, or when a lost update is unacceptable and retries are costly. Cost: blocking, reduced concurrency, deadlock risk.\n\n**Optimistic:** don't lock; read a version/timestamp column, and on update do `WHERE id = @id AND version = @oldVersion`. If 0 rows updated, someone else changed it — reload and retry, or surface a conflict. Good when conflicts are rare; no locks held across think-time.\n\n**Account balance:** either works. Pessimistic (`SELECT ... FOR UPDATE` on both accounts in a fixed id order inside the txn) is the usual choice for transfers because a debit/credit must not be lost. Optimistic with retry is fine when collisions on a single account are rare.",
          },
          {
            q: "What is a composite index and how does the query optimizer use it?",
            answer:
              "A composite (multi-column) index is a B-tree ordered by its columns in declared order. The optimizer can use it to:\n- **Seek** on a leading-column equality prefix (`a = ?`, `a = ? AND b = ?`).\n- **Range scan** when the last used predicate is a range (`a = ? AND b > ?`).\n- **Cover** the query if all needed columns are in the index (key or INCLUDE).\n- Provide **order** for ORDER BY / GROUP BY that matches the index, skipping a sort.\n\nIt can't efficiently serve a predicate on a non-leading column alone (`b = ?` with index `(a, b)`) — the leftmost-prefix rule. Design column order around your common WHERE patterns: equality columns first, then the range column, then covering columns.",
          },
          {
            q: "How do database statistics affect the query optimizer's choices, and what happens when they're stale?",
            answer:
              "The optimizer is cost-based: it estimates how many rows each operator produces using **statistics** — histograms of value distribution and density per column/index. From those estimates it picks join order, join type (loop vs hash vs merge), seek vs scan, and memory grants.\n\nWhen stats are **stale** (many changes since the last update, or an ascending key like a timestamp whose new values fall outside the histogram), estimates diverge from reality: it may choose a nested loop expecting 10 rows when there are 10 million, under-grant memory (tempdb spill), or scan instead of seek. Fixes: keep auto-update stats on, run `UPDATE STATISTICS` / `ANALYZE` after big loads, and for hot ascending columns update more often or use the relevant trace flags.",
          },
          {
            q: "What's the difference between a heap table and a table with a clustered index?",
            answer:
              "A **heap** has no clustered index — rows sit in no particular order, wherever there's free space; row identity is a physical RID (file:page:slot), and non-clustered indexes point to rows by RID.\n\nA **clustered table** stores rows in the B-tree of the clustered key, physically ordered by it; non-clustered indexes point to rows by the clustered key.\n\nHeaps can be fine for staging / bulk-load / write-only tables. For general OLTP a clustered index (usually the PK) is better: ordered range scans, no forwarded-record problem (heaps add forwarding pointers when an updated row grows and moves), and stable lookups from non-clustered indexes. Downside of a wide/random clustered key: page splits and fatter non-clustered indexes — hence narrow, ever-increasing keys.",
          },
          {
            q: "ORM (Entity Framework/Dapper/etc.) vs raw SQL/stored procedures — trade-offs for a fintech system?",
            followups: [
              "What is the \"leaky abstraction\" problem with ORMs, and where have you hit it?",
            ],
            answer:
              "**ORM (EF Core):** fast development, compile-time safety, change tracking, migrations, no mapping boilerplate, DB-portable. Costs: generated SQL can be suboptimal, easy to trigger N+1 or over-fetch columns, hard to express window functions / hints / bulk ops, and you still must know *what SQL it emits*.\n\n**Raw SQL / stored procs:** full control, tunable, DBA-reviewable, strong for set-based bulk work and reporting. Costs: manual mapping, more code, harder refactors, injection risk if careless, logic split between app and DB.\n\n**Fintech pragmatic mix:** ORM for straightforward CRUD and transactional writes; hand-written SQL or Dapper for hot read paths, reports, reconciliation, and bulk jobs. Always be able to see and profile the SQL.\n\n**Follow-up — leaky abstraction:** the ORM promises you needn't think about SQL, but you do — `IQueryable` composition that won't translate, lazy loading firing N+1, `.ToList()` in the wrong spot pulling a table into memory, transaction/locking semantics, and provider-specific features. You end up needing to know both the ORM and its generated SQL.",
          },
          {
            q: "How do you design a schema so that money amounts don't suffer floating-point rounding errors?",
            answer:
              "Never use `float`/`double`/`real` for money — binary floating point can't represent 0.10 exactly, so sums drift (`0.1 + 0.2 != 0.3`).\n\nUse an exact fixed-point representation:\n- **`DECIMAL(19,4)` / `NUMERIC`** in the DB — enough digits for the largest amount, scale for the currency's minor unit (4 leaves room for fractional-cent interest/FX).\n- **`decimal` in C#**, `BigDecimal` in Java, or store integer minor units (paise/cents as `BIGINT`).\n\nAlso: store a **currency code** with every amount, define rounding rules explicitly (half-up vs banker's), do arithmetic in the DB or in `decimal`, and round once at the presentation/settlement boundary — never mid-calculation.",
          },
          {
            q: "What's your approach to schema migrations in a live production database with zero downtime?",
            answer:
              "Make changes **backward-compatible** and roll them out in phases (expand / migrate / contract):\n1. **Expand:** add new nullable columns / new tables / new indexes (online, `CREATE INDEX CONCURRENTLY`). Never rename or drop in the same deploy.\n2. **Backfill** in throttled batches with small commits so you don't lock the table or blow the log.\n3. **Dual-write / dual-read:** ship app code that writes both shapes and reads the new one with a fallback.\n4. **Contract:** once every app instance uses the new shape and the backfill is verified, drop the old column/table in a later deploy.\n\nOther rules: additive, reversible steps; avoid long locks (watch metadata locks, FK validation, adding `NOT NULL` — add nullable, backfill, then enforce); rehearse on a prod-sized copy; have a rollback for each step.",
          },
          {
            q: "Backup and recovery basics — full vs differential vs transaction log backup, RPO/RTO in plain terms.",
            answer:
              "- **Full backup:** the entire database — the baseline for any restore.\n- **Differential:** everything changed since the last *full*. Faster to take and restore than replaying all logs.\n- **Transaction log backup:** all log records since the last log backup; enables point-in-time restore and truncates the log. Needs the full recovery model.\n\nRestore chain: last full + last diff + all log backups since that diff, up to the target time.\n\n- **RPO (Recovery Point Objective):** how much data you can afford to lose — drives backup/log frequency (log backups every 5 min → ≤5 min loss).\n- **RTO (Recovery Time Objective):** how long you can be down — drives strategy (hot standby / replica failover for minutes; restore-from-backup for hours).\n\nTest restores regularly — an untested backup isn't a backup.",
          },
          {
            q: "What is connection pooling and why does it matter for a high-throughput API?",
            answer:
              "Opening a DB connection is expensive — TCP handshake, TLS, auth, session setup, tens of milliseconds. A **connection pool** keeps a set of already-open physical connections; the app 'opens' and 'closes' logical handles that just borrow and return one.\n\nFor a high-throughput API this is essential: without it every request pays full connection cost and you exhaust the DB's max connections under load. With it, a small pool (say 20–100) serves thousands of short queries.\n\nGotchas: too large a pool overwhelms the DB (each connection is memory + a worker); too small causes request queueing (watch 'pool exhausted' / wait-time metrics). Always release promptly (`using`/`finally`), keep transactions short, and don't hold a connection across an external call.",
          },
          {
            q: "Explain database sharding at the SQL level — sharding key selection, cross-shard query problems.",
            answer:
              "Sharding = horizontal partitioning across **separate databases/servers**, each holding a subset of rows, to scale writes and data volume past one machine.\n\n**Shard key choice** is everything: it must spread load evenly and keep related rows together so most queries hit one shard. Common keys: `user_id` / `account_id` (co-locates a customer's data), or `tenant_id`. Hash the key for even spread; range sharding risks hotspots (all new rows on the newest shard).\n\n**Cross-shard problems:**\n- Queries spanning shards need scatter-gather + merge; no easy global JOIN / ORDER BY.\n- No cross-shard transactions without 2PC or sagas.\n- Global uniqueness / IDs need a scheme (UUID, snowflake, central sequence).\n- Rebalancing when adding shards (consistent hashing or a directory service helps).\n\nSharding is a last resort — exhaust vertical scaling, read replicas, caching, and archiving first.",
          },
        ],
      },
      {
        id: "sql-practical",
        number: 2,
        title: "SQL — Practical / Technical Round",
        questions: [
          {
            q: "Write a query to find duplicate rows in a table.",
            answer:
              "Group by the columns that define a duplicate and keep groups with more than one row:\n```sql\nSELECT email, COUNT(*) AS cnt\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1;\n```\nTo see the actual rows (and choose which to delete), number them within each group:\n```sql\nWITH d AS (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn\n  FROM users\n)\nSELECT * FROM d WHERE rn > 1;   -- rn = 1 is the keeper; delete rn > 1\n```",
          },
          {
            q: "Write a query to find the Nth highest salary (using a window function, not just LIMIT/TOP).",
            answer:
              "```sql\nWITH ranked AS (\n  SELECT salary,\n         DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n)\nSELECT MIN(salary) AS nth_highest\nFROM ranked\nWHERE rnk = @N;\n```\n`DENSE_RANK` so ties collapse to one level (the Nth-highest *distinct* salary). Use `ROW_NUMBER` instead if you want the Nth physical row regardless of ties.",
          },
          {
            q: "Write a query to find employees who earn more than their manager (self join).",
            answer:
              "One alias for the employee, one for the manager:\n```sql\nSELECT e.id, e.name, e.salary, m.name AS manager, m.salary AS mgr_salary\nFROM employees e\nJOIN employees m ON e.manager_id = m.id\nWHERE e.salary > m.salary;\n```\nAn INNER JOIN naturally drops the CEO (no manager row). Use LEFT JOIN if you needed to list them too.",
          },
          {
            q: "Write a query using a window function to compute a running total of transactions per user, ordered by date.",
            answer:
              "```sql\nSELECT\n  user_id,\n  txn_date,\n  amount,\n  SUM(amount) OVER (\n    PARTITION BY user_id\n    ORDER BY txn_date, id\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n  ) AS running_total\nFROM transactions\nORDER BY user_id, txn_date, id;\n```\n`PARTITION BY user_id` restarts the total per user; the explicit `ROWS` frame avoids the `RANGE` default that would lump same-date rows together; adding `id` to the ORDER BY makes ties deterministic.",
          },
          {
            q: "Write a query to find users who have never placed an order (left join + IS NULL).",
            answer:
              "```sql\nSELECT u.id, u.name\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;\n```\nThe LEFT JOIN keeps every user; `o.id IS NULL` is the anti-join filter. `NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)` is equivalent and often optimizes as well or better. Avoid `NOT IN` if `user_id` can be NULL — it returns no rows.",
          },
          {
            q: "Design and normalize (to 3NF) a schema for a wallet + transactions system (users, wallets, transactions, transaction_status). Justify your table/column choices.",
            answer:
              "```sql\nusers (\n  id            BIGINT PRIMARY KEY,\n  email         VARCHAR(255) NOT NULL UNIQUE,\n  full_name     VARCHAR(200) NOT NULL,\n  created_at    TIMESTAMP NOT NULL DEFAULT now()\n);\n\ntransaction_status (              -- lookup table, not a free-text column\n  code          VARCHAR(20) PRIMARY KEY,   -- 'PENDING','SUCCESS','FAILED','REVERSED'\n  description   VARCHAR(100) NOT NULL\n);\n\nwallets (\n  id            BIGINT PRIMARY KEY,\n  user_id       BIGINT NOT NULL REFERENCES users(id),\n  currency      CHAR(3) NOT NULL,          -- ISO 4217\n  balance_minor BIGINT NOT NULL DEFAULT 0, -- integer minor units, no float\n  created_at    TIMESTAMP NOT NULL DEFAULT now(),\n  UNIQUE (user_id, currency)\n);\n\ntransactions (\n  id              BIGINT PRIMARY KEY,\n  wallet_id       BIGINT NOT NULL REFERENCES wallets(id),\n  direction       CHAR(1) NOT NULL CHECK (direction IN ('C','D')),\n  amount_minor    BIGINT NOT NULL CHECK (amount_minor > 0),\n  status_code     VARCHAR(20) NOT NULL REFERENCES transaction_status(code),\n  idempotency_key VARCHAR(64) NOT NULL,\n  counterparty_wallet_id BIGINT REFERENCES wallets(id),\n  created_at      TIMESTAMP NOT NULL DEFAULT now(),\n  UNIQUE (wallet_id, idempotency_key)\n);\n```\nJustification: status is its own lookup table, so there's no repeated free-text and no transitive dependency on a status string (3NF). Money is stored as integer minor units to avoid float error. `wallets` is unique on `(user_id, currency)` — one wallet per currency per user. `transactions` is append-only; `wallets.balance_minor` is a denormalized cache updated in the same transaction that inserts the ledger row. `idempotency_key` unique per wallet blocks double-posting on retries. For strict double-entry, model each transfer as two rows (debit + credit) sharing a `transfer_id`.",
          },
          {
            q: "Write a recursive CTE for a hierarchical structure (e.g., an org chart or category tree).",
            answer:
              "Everyone under a given manager:\n```sql\nWITH RECURSIVE org AS (\n  SELECT id, name, manager_id, 1 AS depth\n  FROM employees\n  WHERE id = @rootId                 -- anchor\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id, o.depth + 1\n  FROM employees e\n  JOIN org o ON e.manager_id = o.id   -- recursive member\n)\nSELECT * FROM org ORDER BY depth, name;\n```\nThe anchor picks the start row(s); the recursive member joins the CTE to itself, adding one level per iteration; it stops when the join returns no new rows. Guard cycles with a depth cap or a visited-path array. (SQL Server: `WITH org AS (...)`, no `RECURSIVE` keyword.)",
          },
          {
            q: "Given a slow query and its execution plan, identify the missing index and rewrite the query.",
            answer:
              "Say the plan shows a **Clustered Index Scan** on `transactions` with predicate `user_id = @u AND created_at BETWEEN @a AND @b` plus a Sort for `ORDER BY created_at` — the whole table is scanned and sorted.\n\nDiagnosis: no index supports the `user_id` equality + `created_at` range, and none provides the sort order.\n\nFix — a composite, order-matching, covering index:\n```sql\nCREATE INDEX ix_txn_user_created\n  ON transactions (user_id, created_at)\n  INCLUDE (amount, status);\n```\nNow it's an index **seek** on `user_id`, a range scan on `created_at` (already ordered, so the Sort disappears), and `amount`/`status` come from the index (no key lookup). Also keep predicates SARGable — don't wrap `created_at` in `CAST`/`CONVERT`; compare to typed parameters.",
          },
          {
            q: "Write a stored procedure that transfers money between two accounts safely inside a transaction, handling rollback on failure.",
            answer:
              "```sql\nCREATE PROCEDURE transfer_funds\n  @from_id BIGINT, @to_id BIGINT, @amount DECIMAL(19,4), @idem_key VARCHAR(64)\nAS\nBEGIN\n  SET NOCOUNT ON;\n  SET XACT_ABORT ON;                 -- any error => auto rollback\n\n  IF @amount <= 0 THROW 50001, 'Amount must be positive', 1;\n\n  BEGIN TRY\n    BEGIN TRAN;\n\n    -- idempotency: replayed key => no-op\n    IF EXISTS (SELECT 1 FROM transfers WHERE idempotency_key = @idem_key)\n    BEGIN COMMIT TRAN; RETURN; END;\n\n    -- lock both rows in a fixed order to avoid deadlocks\n    DECLARE @lo BIGINT = IIF(@from_id < @to_id, @from_id, @to_id);\n    DECLARE @hi BIGINT = IIF(@from_id < @to_id, @to_id, @from_id);\n    SELECT id FROM accounts WITH (UPDLOCK, ROWLOCK) WHERE id IN (@lo, @hi);\n\n    IF (SELECT balance FROM accounts WHERE id = @from_id) < @amount\n      THROW 50002, 'Insufficient funds', 1;\n\n    UPDATE accounts SET balance = balance - @amount WHERE id = @from_id;\n    UPDATE accounts SET balance = balance + @amount WHERE id = @to_id;\n\n    INSERT INTO transfers (from_id, to_id, amount, idempotency_key, created_at)\n    VALUES (@from_id, @to_id, @amount, @idem_key, SYSUTCDATETIME());\n\n    COMMIT TRAN;\n  END TRY\n  BEGIN CATCH\n    IF XACT_STATE() <> 0 ROLLBACK TRAN;\n    THROW;                           -- bubble the error to the caller\n  END CATCH\nEND;\n```\nKey points: one transaction (atomic), `XACT_ABORT` + TRY/CATCH for guaranteed rollback, deadlock-safe lock ordering, an explicit insufficient-funds check, and an idempotency key so a retried call can't double-transfer.",
          },
          {
            q: "Given a transactions table, write a query to detect potentially duplicate/fraudulent transactions within a short time window (same user, same amount, within N minutes).",
            answer:
              "Self-join on same user + same amount inside a time window:\n```sql\nSELECT a.id, b.id AS dup_of, a.user_id, a.amount, a.created_at\nFROM transactions a\nJOIN transactions b\n  ON b.user_id = a.user_id\n AND b.amount  = a.amount\n AND b.id <> a.id\n AND b.created_at BETWEEN a.created_at AND DATEADD(MINUTE, @n, a.created_at)\nORDER BY a.user_id, a.created_at;\n```\nOr with `LAG` to compare each row to the previous same-(user, amount) row:\n```sql\nSELECT * FROM (\n  SELECT t.*,\n         LAG(created_at) OVER (PARTITION BY user_id, amount ORDER BY created_at) AS prev_at\n  FROM transactions t\n) x\nWHERE DATEDIFF(SECOND, prev_at, created_at) <= @n * 60;\n```\nIndex `(user_id, amount, created_at)` makes it cheap; add merchant/device for a tighter fraud signal.",
          },
          {
            q: "Write a query to find the top 3 highest-spending users per month.",
            answer:
              "```sql\nWITH monthly AS (\n  SELECT user_id,\n         DATE_TRUNC('month', created_at) AS mth,\n         SUM(amount) AS spent\n  FROM transactions\n  WHERE direction = 'D'\n  GROUP BY user_id, DATE_TRUNC('month', created_at)\n),\nranked AS (\n  SELECT *,\n         ROW_NUMBER() OVER (PARTITION BY mth ORDER BY spent DESC) AS rn\n  FROM monthly\n)\nSELECT mth, user_id, spent\nFROM ranked\nWHERE rn <= 3\nORDER BY mth, spent DESC;\n```\nAggregate to (user, month) first, then rank within each month. Use `RANK()` instead of `ROW_NUMBER()` to include ties for 3rd. (SQL Server: `DATEFROMPARTS(YEAR(created_at), MONTH(created_at), 1)`.)",
          },
          {
            q: "Write a query to pivot transaction data (rows to columns) — e.g., monthly totals per category as columns.",
            answer:
              "Conditional aggregation is portable and clear:\n```sql\nSELECT\n  DATE_TRUNC('month', created_at) AS mth,\n  SUM(CASE WHEN category = 'food'   THEN amount ELSE 0 END) AS food,\n  SUM(CASE WHEN category = 'travel' THEN amount ELSE 0 END) AS travel,\n  SUM(CASE WHEN category = 'bills'  THEN amount ELSE 0 END) AS bills\nFROM transactions\nGROUP BY DATE_TRUNC('month', created_at)\nORDER BY mth;\n```\nSQL Server also has a `PIVOT` operator, but the category list is still hard-coded. For a truly dynamic set of categories, build the SQL string dynamically or pivot in the reporting layer.",
          },
          {
            q: "Write a query to calculate month-over-month percentage growth in transaction volume.",
            answer:
              "```sql\nWITH monthly AS (\n  SELECT DATE_TRUNC('month', created_at) AS mth, SUM(amount) AS vol\n  FROM transactions\n  GROUP BY DATE_TRUNC('month', created_at)\n)\nSELECT\n  mth,\n  vol,\n  LAG(vol) OVER (ORDER BY mth) AS prev_vol,\n  ROUND(\n    100.0 * (vol - LAG(vol) OVER (ORDER BY mth))\n          / NULLIF(LAG(vol) OVER (ORDER BY mth), 0)\n  , 2) AS mom_pct\nFROM monthly\nORDER BY mth;\n```\n`LAG` pulls the previous month's volume; `NULLIF(prev, 0)` avoids divide-by-zero; the first month yields NULL growth, which is correct.",
          },
          {
            q: "Given two tables (internal ledger vs external payment provider export), write a query to find mismatched/missing records for reconciliation.",
            answer:
              "Full outer join on the business key, then flag rows missing on either side or with differing values:\n```sql\nSELECT\n  COALESCE(l.txn_ref, p.txn_ref) AS txn_ref,\n  l.amount AS ledger_amount,\n  p.amount AS provider_amount,\n  CASE\n    WHEN p.txn_ref IS NULL       THEN 'MISSING_IN_PROVIDER'\n    WHEN l.txn_ref IS NULL       THEN 'MISSING_IN_LEDGER'\n    WHEN l.amount <> p.amount    THEN 'AMOUNT_MISMATCH'\n    WHEN l.status <> p.status    THEN 'STATUS_MISMATCH'\n  END AS issue\nFROM internal_ledger l\nFULL OUTER JOIN provider_export p ON p.txn_ref = l.txn_ref\nWHERE p.txn_ref IS NULL\n   OR l.txn_ref IS NULL\n   OR l.amount <> p.amount\n   OR l.status <> p.status;\n```\nMySQL has no FULL OUTER JOIN — emulate with `LEFT JOIN ... UNION ... RIGHT JOIN`. Compare money as exact decimals/minor units, and normalize timezone and rounding before comparing.",
          },
          {
            q: "Write a query to implement keyset pagination on a transactions table ordered by created_at + id.",
            answer:
              "```sql\n-- first page\nSELECT id, user_id, amount, created_at\nFROM transactions\nORDER BY created_at DESC, id DESC\nFETCH FIRST 20 ROWS ONLY;\n\n-- next page: pass the last row's (created_at, id) as @lastTs, @lastId\nSELECT id, user_id, amount, created_at\nFROM transactions\nWHERE (created_at, id) < (@lastTs, @lastId)\nORDER BY created_at DESC, id DESC\nFETCH FIRST 20 ROWS ONLY;\n```\nThe row-value comparison `(created_at, id) < (@lastTs, @lastId)` is a correct strict 'before this row' boundary, including the `id` tie-break. Needs an index on `(created_at DESC, id DESC)`. Constant time at any depth and stable under inserts. (SQL Server doesn't support row-value `<` — expand to `created_at < @lastTs OR (created_at = @lastTs AND id < @lastId)`.)",
          },
          {
            q: "Design indexes for a `transactions` table that's queried heavily by `user_id + date range` and occasionally by `status`. Justify your index choices.",
            answer:
              "```sql\n-- workhorse: equality on user_id, range + sort on created_at, covers the list view\nCREATE INDEX ix_txn_user_created\n  ON transactions (user_id, created_at DESC)\n  INCLUDE (amount, status, counterparty_id);\n\n-- occasional status-only queries (e.g. a 'pending' worker) — only if selective\nCREATE INDEX ix_txn_status_created\n  ON transactions (status, created_at)\n  WHERE status IN ('PENDING','FAILED');   -- filtered/partial: small, hot\n```\nReasoning: `user_id` first (equality, high selectivity, always present), `created_at` second (range + ORDER BY, so no sort). INCLUDE the columns the list view needs so it's covering — no key lookups. Add a `status` index only if that query is frequent and `status` is selective, and make it a **filtered/partial index** on the few interesting statuses so it stays small and write-cheap. Don't broadly index low-cardinality `status` — it won't help and slows every insert. Every extra index is maintained on each write, so keep the set minimal.",
          },
        ],
      },
      {
        id: "angular-theoretical",
        number: 3,
        title: "Angular — Theoretical",
        questions: [
          {
            q: "How does Angular's change detection work? Default vs OnPush strategy.",
            followups: [
              "What actually triggers a change detection cycle?",
              "How do Angular signals change this picture? What is zone-less change detection?",
            ],
            answer:
              "Change detection (CD) syncs the DOM with the component model. **Default:** after any async event Angular dirty-checks every component's template bindings top-down and updates the DOM where a bound value changed. **OnPush:** Angular skips a component's subtree unless (a) an `@Input` *reference* changed, (b) an event fired inside it, (c) an `async` pipe / signal it reads emitted, or (d) you call `cdr.markForCheck()`. OnPush therefore needs immutable inputs — mutating an array in place is invisible to it.\n\n**Follow-up — what triggers a cycle:** Zone.js monkey-patches async APIs (`setTimeout`, `Promise`, DOM events, XHR); when one completes, the zone tells Angular to run CD from the root.\n\n**Follow-up — signals / zoneless:** reading a signal in a template registers a fine-grained dependency, so only components that read a changed signal are re-checked. Zoneless CD (`provideExperimentalZonelessChangeDetection`) removes Zone.js entirely — updates are driven by signals, the `async` pipe, and explicit `markForCheck` — meaning less work and a smaller bundle.",
          },
          {
            q: "Observable vs Promise vs Subject vs BehaviorSubject vs ReplaySubject vs AsyncSubject — differences and use cases.",
            followups: [
              "When would you use a BehaviorSubject instead of a plain Observable?",
            ],
            answer:
              "- **Promise** — one future value, eager (runs immediately), not cancellable.\n- **Observable** — a lazy stream of 0..N values; nothing runs until `subscribe()`; cancellable; composable with operators.\n- **Subject** — an Observable *and* an observer; `.next()` multicasts to current subscribers. No initial value; late subscribers miss past emissions.\n- **BehaviorSubject** — holds a current value, needs a seed, emits it immediately to new subscribers. Ideal for 'current state'.\n- **ReplaySubject(n)** — replays the last n emissions to new subscribers.\n- **AsyncSubject** — emits only the final value, and only on complete.\n\n**Follow-up — BehaviorSubject vs plain Observable:** use a BehaviorSubject when subscribers need the latest value the moment they subscribe (component state, a store, `isLoggedIn$`). A plain Observable/Subject gives late subscribers nothing until the next emission.",
          },
          {
            q: "Explain Angular lifecycle hooks and their order of execution.",
            answer:
              "For a component: `constructor` → `ngOnChanges` (before `ngOnInit`, and again on every bound-input change) → `ngOnInit` (once, after first inputs are set) → `ngDoCheck` → `ngAfterContentInit` → `ngAfterContentChecked` → `ngAfterViewInit` → `ngAfterViewChecked` → … (the `Check` hooks repeat every CD cycle) … → `ngOnDestroy`.\n\nKey points: `ngOnChanges` only fires for template-bound `@Input`s and runs *before* `ngOnInit`; `@ViewChild` results are ready in `ngAfterViewInit`, not `ngOnInit`; do subscription cleanup in `ngOnDestroy`. Parent `ngOnInit` runs before child `ngOnInit`, but parent `ngAfterViewInit` runs *after* all its children's.",
          },
          {
            q: "Explain dependency injection in Angular — hierarchical injectors, `providedIn: 'root'` vs component-level providers, multi-providers, injection tokens.",
            answer:
              "Angular has a hierarchical injector tree: an app-wide **environment/root injector** and an **element injector** per component/directive. Resolution walks from the component up to root; the first provider found wins.\n\n- `providedIn: 'root'` — one tree-shakable singleton for the whole app (dropped from the bundle if unused).\n- **Component `providers: []`** — a new instance per instance of that component and its subtree (e.g. a per-wizard state service).\n- **Multi-provider** (`multi: true`) — many values under one token, injected as an array (`HTTP_INTERCEPTORS`, `NG_VALIDATORS`, `APP_INITIALIZER`).\n- **Injection token** — `new InjectionToken<T>('desc')` for non-class deps (config objects, strings), since you can't inject an interface or primitive by type.\n\nProvider recipes: `useClass`, `useValue`, `useExisting`, `useFactory` (with `deps`). Modifiers `@Optional` / `@Self` / `@SkipSelf` / `@Host` tune the lookup.",
          },
          {
            q: "Reactive forms vs template-driven forms — trade-offs.",
            followups: [
              "How do you build a dynamic FormArray (e.g., adding/removing form rows)?",
              "How do you implement cross-field validation (e.g., password + confirm password)?",
            ],
            answer:
              "**Template-driven:** model built implicitly from `ngModel` directives; asynchronous, harder to unit-test, fine for small forms.\n**Reactive:** model defined explicitly in the component (`FormGroup`/`FormControl`/`FormArray`); synchronous, strongly typed, testable without the DOM, easy dynamic controls and custom validators — the choice for complex fintech forms.\n\n**Follow-up — dynamic FormArray:**\n```ts\nrows = this.fb.array<FormGroup>([]);\naddRow() { this.rows.push(this.fb.group({ amount: [0, Validators.required] })); }\nremoveRow(i: number) { this.rows.removeAt(i); }\n```\nBind with `formArrayName=\"rows\"` and `*ngFor` + `[formGroupName]=\"i\"`.\n\n**Follow-up — cross-field validation:** put the validator on the group so it can see siblings:\n```ts\nconst match: ValidatorFn = g =>\n  g.get('pwd')!.value === g.get('confirm')!.value ? null : { mismatch: true };\nthis.fb.group({ pwd: [''], confirm: [''] }, { validators: match });\n```\nRead `form.errors?.mismatch` in the template — the error sits on the group, not a control.",
          },
          {
            q: "RxJS: switchMap vs mergeMap vs concatMap vs exhaustMap — differences.",
            followups: [
              "Which operator would you use on a \"submit\" button to prevent duplicate submissions, and why?",
              "Explain `combineLatest`, `forkJoin`, `zip`, and `withLatestFrom` — when would you use each?",
            ],
            answer:
              "All flatten an outer stream into inner Observables; they differ on overlap:\n- **switchMap** — cancel the previous inner when a new value arrives. Typeahead, route-param → fetch.\n- **mergeMap** — run inners concurrently, interleave results. Independent parallel work.\n- **concatMap** — queue inners, one at a time, in order. Ordered writes / sequential saves.\n- **exhaustMap** — ignore new values while an inner runs. Submit buttons, login.\n\n**Follow-up — submit button:** `exhaustMap` — while the save is in flight, extra clicks are ignored, so no duplicate submissions. `mergeMap` would fire one request per click.\n\n**Follow-up — combination operators:**\n- `combineLatest` — emit the latest of each source whenever any emits (all must have emitted once). Live derived state.\n- `forkJoin` — wait for all sources to *complete*, emit their last values once. Parallel HTTP on load.\n- `zip` — pair emissions by index. Rarely needed.\n- `withLatestFrom` — on the primary source's emission, also grab the latest of others without triggering on them. 'On submit, take current form value + current user'.",
          },
          {
            q: "How do you prevent memory leaks from subscriptions? Explain async pipe, takeUntil, and DestroyRef.",
            answer:
              "An open subscription keeps its callback (and the component) alive after the view is destroyed and can fire against a dead component. Fixes:\n- **`async` pipe** — subscribes in the template and unsubscribes automatically on destroy. Preferred.\n- **`takeUntil(this.destroy$)`** — a `Subject` you `.next()` + `.complete()` in `ngOnDestroy`; place `takeUntil` last in the pipe.\n- **`takeUntilDestroyed()`** (Angular 16+) — ties the subscription to the injection context's `DestroyRef`; call it in a field initializer / constructor, or pass a `DestroyRef` explicitly elsewhere.\n- **Manual** — store the `Subscription` and `unsubscribe()` in `ngOnDestroy`; fine for one or two.\n\nHTTP calls that emit once and complete don't strictly leak, but cancelling still matters (that's what `switchMap` gives you).",
          },
          {
            q: "Route guards — CanActivate, CanDeactivate, CanMatch, Resolve. Give a real use case for each.",
            answer:
              "- **CanActivate** — allow/deny navigating *into* a route. Use: block `/admin` unless the user has the role; return a `UrlTree` to redirect to `/login`.\n- **CanActivateChild** — same, for every child of a section.\n- **CanDeactivate** — allow/deny *leaving*. Use: 'You have unsaved changes' prompt driven by `form.dirty`.\n- **CanMatch** — decide whether a route *definition* matches at all; lets you serve a different component/lazy bundle for the same path based on a flag or role. Better than CanActivate for auth-based swapping because the lazy chunk isn't even loaded when it doesn't match.\n- **Resolve** — pre-fetch data before activation so the component renders with data ready (no empty flash).\n\nModern guards are plain functions using `inject()`.",
          },
          {
            q: "HTTP interceptors — what are common use cases (auth token injection, global error handling, retry, loading spinner)?",
            followups: [
              "How do multiple interceptors chain together, and does order matter?",
            ],
            answer:
              "Interceptors sit in the `HttpClient` pipeline and can transform the request and/or response:\n- Attach `Authorization: Bearer <token>`.\n- Global error handling — map errors, show a toast, redirect on 401.\n- Retry transient failures with backoff.\n- A global loading indicator (counter + `finalize`).\n- Correlation IDs, base URL, response caching.\n\n**Follow-up — chaining / order:** interceptors form a chain; each calls `next(req)` to pass control on. Request transforms apply in registration order (first → last) outbound; response transforms apply in reverse inbound. Order matters: a retry interceptor should wrap (sit outside) the auth interceptor so each retry gets a fresh token; a logging interceptor that must not see the token should run before auth adds it.",
          },
          {
            q: "Lazy loading and preloading strategies — how and why?",
            answer:
              "**Lazy loading:** load a feature's code only when its route is visited — `loadChildren` for route arrays, `loadComponent` for standalone components. Cuts the initial bundle and time-to-interactive; each lazy area becomes its own chunk.\n\n**Preloading:** after the app is stable, fetch lazy chunks in the background so later navigation is instant. Strategies: `NoPreloading` (default), `PreloadAllModules`, or a custom `PreloadingStrategy` that preloads only routes flagged `data: { preload: true }` (skip rarely-used or data-heavy areas).\n\nVerify a split happened: separate hashed `chunk-*.js` files in the build output and the network tab.",
          },
          {
            q: "How do OnPush + immutable data + trackBy work together for performance?",
            answer:
              "They compound:\n- **OnPush** skips CD for a component unless an `@Input` *reference* changes.\n- **Immutable data** makes that reference change meaningful — replace the array/object (`[...items, x]`) instead of mutating, so OnPush detects real changes and ignores no-ops.\n- **trackBy** (`@for ... track item.id`) matches list items by a stable key, so on a new array reference Angular reuses DOM nodes for unchanged items and only creates/moves/removes what actually changed.\n\nResult: fewer components checked, fewer re-renders, minimal DOM churn on list updates.",
          },
          {
            q: "Angular signals vs RxJS — when would you reach for each? What is `computed()` and `effect()`?",
            answer:
              "- **Signals** — synchronous reactive values for *state*: `signal()` holds a value, `computed()` derives one (memoized, lazy — recomputes only when a read dependency changes), `effect()` runs a side effect when signals it reads change. Great for component/local state and template bindings; no subscription management.\n- **RxJS** — for *events and async over time*: HTTP, websockets, debounced input, combining/cancelling streams.\n\nUse signals for 'what is the current value', RxJS for 'a sequence of things happening'. Bridge with `toSignal(obs$)` and `toObservable(sig)`. Common shape: RxJS at the data-fetching edges, signals for the state the template renders.",
          },
          {
            q: "Standalone components vs NgModules — what changed and why?",
            answer:
              "Standalone components/directives/pipes declare their own `imports` and need no `NgModule`. `bootstrapApplication(AppComponent, { providers: [...] })` replaces `AppModule`; routes use `loadComponent`. Benefits: less boilerplate, dependencies visible on the component, simpler lazy loading, better tooling. NgModules still work and interop both ways, but new projects are standalone by default. 'Shared feature module' grouping becomes just importing what you need (or re-exporting an array of components).",
          },
          {
            q: "Content projection (`ng-content`), ViewChild vs ContentChild — differences.",
            answer:
              "**Content projection** (`<ng-content>`) renders markup the *parent* placed between your component's tags; multi-slot with `<ng-content select=\"[header]\">`. The projected content's lifecycle and CD belong to the parent, not your component.\n\n- **`@ViewChild`** queries an element/component/directive in *your own template* (the view). Ready in `ngAfterViewInit`.\n- **`@ContentChild`** queries *projected* content. Ready in `ngAfterContentInit`.\n\nSignal queries `viewChild()` / `contentChild()` (Angular 17.2+) are read reactively and sidestep the lifecycle timing.",
          },
          {
            q: "Custom directives — attribute directive vs structural directive, how do you build each?",
            answer:
              "- **Attribute directive** — changes the appearance/behaviour of the host element. `@Directive({ selector: '[appX]' })`, inject `ElementRef`/`Renderer2`, use `@HostListener`/`@HostBinding`.\n```ts\n@Directive({ selector: '[appHighlight]' })\nexport class HighlightDirective {\n  constructor(private el: ElementRef, private r: Renderer2) {}\n  @HostListener('mouseenter') on() { this.r.setStyle(this.el.nativeElement, 'background', 'yellow'); }\n}\n```\n- **Structural directive** — adds/removes DOM. Inject `TemplateRef` + `ViewContainerRef`; the `*appX` syntax desugars to an `<ng-template>` wrapper.\n```ts\n@Input() set appDelay(ms: number) {\n  setTimeout(() => this.vc.createEmbeddedView(this.tpl), ms);\n}\n```",
          },
          {
            q: "Pipes — pure vs impure, how do you build a custom pipe?",
            answer:
              "A **pure pipe** (default) re-runs only when its input *reference* (or primitive value) changes — cheap and safe. An **impure pipe** (`pure: false`) runs on *every* CD cycle — needed for `AsyncPipe` or filtering a mutable array, but a performance risk.\n\n```ts\n@Pipe({ name: 'initials' })\nexport class InitialsPipe implements PipeTransform {\n  transform(name: string, max = 2): string {\n    return name.split(' ').slice(0, max).map(w => w[0]).join('').toUpperCase();\n  }\n}\n```\nUsage: `{{ user.name | initials:3 }}`. Don't filter/sort big lists in a pipe — precompute in the component.",
          },
          {
            q: "State management approaches — service + BehaviorSubject vs NgRx vs signal-based store. Trade-offs?",
            followups: [
              "Explain the NgRx flow: actions, reducers, effects, selectors — what problem does each solve?",
            ],
            answer:
              "- **Service + BehaviorSubject** — a service holds `private state$ = new BehaviorSubject(initial)`, exposes `asObservable()` + update methods. Zero deps; perfect for small/medium apps.\n- **NgRx** — a single immutable store, unidirectional flow, devtools/time-travel. Boilerplate-heavy; worth it for large apps with complex shared state and strict traceability.\n- **Signal store** (`@ngrx/signals` or hand-rolled `signal`/`computed`) — signal ergonomics with store structure; the emerging middle ground.\n\n**Follow-up — NgRx flow:**\n- **Action** — a described event ('what happened'): `loadTxns`, `loadTxnsSuccess`.\n- **Reducer** — pure `(state, action) => newState`; the only place state changes.\n- **Effect** — listens for actions, does side effects (HTTP), dispatches result actions. Keeps async out of reducers.\n- **Selector** — memoized read of a state slice; recomputes only when its inputs change, which pairs well with OnPush.",
          },
          {
            q: "What is Angular Universal / SSR? Why and when would you use it? What is hydration?",
            answer:
              "**SSR** renders the initial HTML on a Node server so users see content fast and crawlers get real markup — good for SEO and first-contentful-paint on public pages. **Hydration** is the client then adopting that server DOM: Angular reuses the existing nodes and just attaches event listeners instead of re-rendering from scratch (non-destructive hydration, Angular 16+), avoiding a flash and cutting work. Use SSR for content/marketing/SEO routes; an internal dashboard usually doesn't need it. Costs: a Node runtime, guarding browser-only APIs (`window`, `document`), and transferring state so the client doesn't re-fetch.",
          },
          {
            q: "What are micro-frontends? How does Angular support this (e.g., Module Federation)?",
            answer:
              "Micro-frontends split a large app into independently built and deployed pieces owned by different teams, composed at runtime. Angular supports this via **Module Federation** (Webpack, or native): a shell app lazy-loads remote components/modules exposed by other builds, sharing singletons (Angular, RxJS) to avoid duplication. Trade-offs: independent deploys and team autonomy vs version-skew risk, bundle duplication, shared-state complexity, and harder end-to-end testing. Only worth it at real organizational scale.",
          },
          {
            q: "How do you unit test a component with an injected service dependency? (TestBed, spies/mocks)",
            answer:
              "Configure a `TestBed` with the component and a fake for its dependency, then drive it via the fixture:\n```ts\nconst svc = jasmine.createSpyObj('TxnService', ['list']);\nsvc.list.and.returnValue(of([{ id: 1 }]));\nawait TestBed.configureTestingModule({\n  imports: [TxnListComponent],\n  providers: [{ provide: TxnService, useValue: svc }],\n}).compileComponents();\nconst fixture = TestBed.createComponent(TxnListComponent);\nfixture.detectChanges();\nexpect(svc.list).toHaveBeenCalled();\nexpect(fixture.nativeElement.querySelectorAll('.row').length).toBe(1);\n```\nMock the dependency, `detectChanges()` to run bindings, query the DOM with `By.css`, assert on rendered output and service calls.",
          },
          {
            q: "Security in Angular — XSS protection, DomSanitizer, when Angular auto-sanitizes vs when you must handle it manually.",
            answer:
              "Angular treats interpolated values as untrusted: `{{ }}` and property bindings are **auto-sanitized by context** (HTML, style, URL, resource-URL), so `<script>` in a bound string is neutralised. You get XSS only if you bypass this — `[innerHTML]` with unsanitised input, or `bypassSecurityTrustHtml/Url/ResourceUrl`. Use those bypass methods **only** for values you fully control (a trusted iframe URL from config), never user input. Also: avoid `nativeElement.innerHTML =`, set a Content-Security-Policy, and still validate/encode on the server — Angular only protects the client render.",
          },
          {
            q: "Angular build optimization — tree shaking, differential loading, analyzing bundle size, lazy chunks.",
            answer:
              "- **AOT + tree shaking** — templates compiled ahead of time (no compiler shipped); dead code and unused exports dropped.\n- **Lazy chunks** — route-level code splitting keeps the initial bundle small.\n- **Bundle analysis** — `source-map-explorer` / `webpack-bundle-analyzer` (or `--stats-json`) to find bloat (moment, full lodash, an accidental full-library import).\n- **Budgets** in `angular.json` fail the build when a bundle grows past a threshold.\n- Other: `@defer` blocks, minification + critical-CSS inlining, `NgOptimizedImage`, importing only needed RxJS operators, avoiding barrel files that defeat tree-shaking.",
          },
          {
            q: "What's the difference between `ViewChild` static: true vs false?",
            answer:
              "`{ static: true }` resolves the query *before* the first change detection, so it's available in `ngOnInit` — valid only when the target always exists (not inside `*ngIf`/`*ngFor`). `{ static: false }` (default) resolves after the first CD, so it's available in `ngAfterViewInit` and updates when a structural directive adds/removes the element. Use `static: true` only for unconditional elements you need early (e.g. handing a `TemplateRef` to something in `ngOnInit`).",
          },
          {
            q: "Explain Angular's Ivy renderer at a high level — what changed from the old ViewEngine.",
            answer:
              "**Ivy** (default since Angular 9) replaced ViewEngine as the compile/render pipeline. Key changes: **locality** — each component compiles independently against its own template, enabling faster incremental builds and better tree-shaking; a smaller runtime; the compiler emits per-component instruction calls instead of a monolithic factory; better debugging (`ng.` APIs, real stack traces); and it enabled standalone components, `@defer`, and finer-grained future rendering. For app authors it's mostly transparent — smaller bundles, faster builds.",
          },
          {
            q: "How do you handle internationalization (i18n) in Angular?",
            answer:
              "Built-in i18n: mark text with the `i18n` attribute (`<h1 i18n=\"@@homeTitle\">Home</h1>`), `$localize` for TS strings, `i18n-title` for attributes. Extract with `ng extract-i18n` to XLIFF/JSON, translate per locale, then build once per locale — each build is a fully static, fast bundle with translations baked in. ICU expressions handle plurals/gender. Runtime libraries (`@ngx-translate`, Transloco) load JSON at runtime — switch language without reload, but no compile-time checking and a small runtime cost. Use locale-aware pipes with `registerLocaleData` for currency/date formatting.",
          },
          {
            q: "How do you handle accessibility (a11y) in an Angular app — ARIA attributes, keyboard navigation, focus management?",
            answer:
              "- **Semantic HTML first** — real `<button>`, `<label for>`, ordered headings; ARIA only to fill gaps (`role`, `aria-label`, `aria-live` for async status, `aria-expanded`).\n- **Keyboard** — everything operable without a mouse; move focus on route change and when opening dialogs/menus, trap it inside, restore it on close; keep visible focus outlines.\n- **Angular CDK a11y** — `FocusTrap`, `LiveAnnouncer`, `cdkTrapFocus`, `A11yModule`; Angular Material is accessible by default.\n- Test with axe / Lighthouse, a screen reader, and tab-only navigation.",
          },
          {
            q: "What is a global `ErrorHandler` in Angular and how do you use it to catch unhandled errors app-wide?",
            answer:
              "Implement `ErrorHandler` and provide it to catch every uncaught client error (template errors, thrown exceptions, unhandled rejections):\n```ts\n@Injectable()\nexport class GlobalErrorHandler implements ErrorHandler {\n  constructor(private logger: LogService, private zone: NgZone) {}\n  handleError(err: unknown) {\n    this.logger.report(err);\n    this.zone.run(() => /* toast / route to an error page */);\n  }\n}\n// providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]\n```\nUse it to ship errors to Sentry/AppInsights and show a friendly message. HTTP errors are better handled in an interceptor (you have request context); keep `ErrorHandler` for the unexpected.",
          },
          {
            q: "What are Angular environment files, and how do you manage config across dev/staging/prod builds?",
            answer:
              "`src/environments/environment.ts` (dev), `environment.prod.ts`, etc. hold **build-time** config (`apiUrl`, feature flags, the `production` flag). `angular.json` `fileReplacements` swaps in the right file per configuration (`ng build --configuration=staging`). Import `environment` anywhere — it's inlined and tree-shaken. These are public, so no secrets. For one artifact deployed to many environments, fetch a runtime `config.json` at startup via `APP_INITIALIZER` instead.",
          },
          {
            q: "What is a resolver and how does it differ from fetching data inside `ngOnInit`?",
            answer:
              "A **resolver** runs *before* the route activates and delays navigation until its data arrives, so the component renders once with data ready — no empty/spinner flash, and the URL only changes on success (you can redirect on error). Fetching in **`ngOnInit`** navigates immediately and the component must render loading/empty/error states itself. Downsides of resolvers: the app feels frozen during a slow fetch unless you show a route-change indicator (`router.events`), and they encourage over-fetching. Use resolvers for small must-have data; `ngOnInit` (or a signal / `async` pipe) for the rest.",
          },
          {
            q: "How would you implement a Progressive Web App (PWA) in Angular — what does the Angular service worker give you?",
            answer:
              "`ng add @angular/pwa` wires up `@angular/service-worker` with `ngsw-config.json`. It provides: **app-shell precaching** (instant load, offline shell + assets), **runtime caching** strategies for APIs (`freshness` vs `performance`), an **update flow** (`SwUpdate` to detect a new version and prompt reload), a web manifest for 'install to home screen', and optional push notifications. Good for flaky-network / mobile; be careful caching authenticated responses, and always ship the update prompt so users aren't stuck on a stale version.",
          },
          {
            q: "What's the Angular CLI doing under the hood when you run `ng build`? What are schematics?",
            answer:
              "`ng build` runs the Angular build (esbuild/Vite-based now, Webpack before): AOT-compiles templates, type-checks, bundles + tree-shakes + minifies, hashes filenames, splits lazy chunks, inlines critical CSS, enforces budgets. Output is static files for any host/CDN.\n\n**Schematics** are code generators/transformers the CLI runs: `ng generate component|service` scaffolds files and updates config; `ng add <pkg>` installs and wires up a library; `ng update` runs migration schematics that rewrite your code for breaking changes. Libraries can ship their own.",
          },
        ],
      },
      {
        id: "angular-practical",
        number: 4,
        title: "Angular — Practical / Technical Round",
        questions: [
          {
            q: "Build a parent-child component pair from scratch using `@Input()`/`@Output()` communication — no reference.",
            answer:
              "```ts\n@Component({ selector: 'app-counter', standalone: true, template: `\n  <button (click)=\"emit(-1)\">-</button>{{ value }}<button (click)=\"emit(1)\">+</button>` })\nexport class CounterComponent {\n  @Input() value = 0;\n  @Output() valueChange = new EventEmitter<number>();\n  emit(delta: number) { this.valueChange.emit(this.value + delta); }\n}\n// parent:  <app-counter [value]=\"qty\" (valueChange)=\"qty = $event\" />\n```\nParent passes data down via `[value]`; child pushes changes up via `valueChange.emit()`. Naming the output `<prop>Change` also enables `[(value)]` two-way binding. Signal equivalent: `value = input(0); valueChange = output<number>()`, or `value = model(0)`.",
          },
          {
            q: "Implement a custom synchronous AND asynchronous validator for a reactive form field.",
            answer:
              "```ts\n// sync — returns an error map or null immediately\nexport const noWhitespace: ValidatorFn = c =>\n  (c.value ?? '').trim().length ? null : { whitespace: true };\n\n// async — username availability, debounced, completes\nexport function usernameTaken(api: UserApi): AsyncValidatorFn {\n  return c => timer(300).pipe(\n    switchMap(() => api.exists(c.value)),\n    map(taken => (taken ? { taken: true } : null)),\n    catchError(() => of(null)),\n    first(),\n  );\n}\n// new FormControl('', { validators: [noWhitespace], asyncValidators: [usernameTaken(api)] });\n```\nThe async validator returns an Observable that must complete; the control shows `pending` until it resolves, so you can show a spinner.",
          },
          {
            q: "Build a search-as-you-type feature: debounce input, cancel previous in-flight request, switch to latest.",
            answer:
              "```ts\nresults$ = this.searchCtrl.valueChanges.pipe(\n  map(v => (v ?? '').trim()),\n  debounceTime(300),\n  distinctUntilChanged(),\n  switchMap(q => q ? this.api.search(q).pipe(catchError(() => of([]))) : of([])),\n);\n// template: @for (r of results$ | async; track r.id) { ... }\n```\n`debounceTime` waits for a typing pause; `distinctUntilChanged` skips no-op changes; `switchMap` cancels the previous in-flight request so only the latest response is used (fixes out-of-order results); the inner `catchError` keeps a failed search from killing the stream.",
          },
          {
            q: "Build an HTTP interceptor that attaches a JWT to every request and retries once on a 401 after refreshing the token.",
            answer:
              "```ts\nexport const authInterceptor: HttpInterceptorFn = (req, next) => {\n  const auth = inject(AuthService);\n  const withToken = (t: string) => req.clone({ setHeaders: { Authorization: `Bearer ${t}` } });\n  return next(withToken(auth.token)).pipe(\n    catchError(err => {\n      if (err.status !== 401 || req.url.includes('/refresh')) return throwError(() => err);\n      return auth.refresh().pipe(          // shareReplay(1) inside => single-flight\n        switchMap(t => next(withToken(t))),\n        catchError(e => { auth.logout(); return throwError(() => e); }),\n      );\n    }),\n  );\n};\n```\n`auth.refresh()` must be a shared `shareReplay(1)` Observable so N concurrent 401s trigger one refresh, not N.",
          },
          {
            q: "You're given a component rendering 1000+ list items and it's laggy — optimize it (virtual scroll / OnPush / trackBy) and explain the before/after.",
            answer:
              "**Before:** `Default` CD, no `trackBy`, all 1000 rows in the DOM → every CD cycle dirty-checks 1000 instances and re-creates rows on any array change.\n\n**After:**\n- `ChangeDetectionStrategy.OnPush` + immutable updates → the list is checked only when its input reference changes.\n- `@for (row of rows; track row.id)` → unchanged rows keep their DOM nodes.\n- **CDK virtual scroll** (`cdk-virtual-scroll-viewport` + `*cdkVirtualFor`) → only the ~20 visible rows exist in the DOM.\n\nMeasure with the Angular DevTools profiler: CD time per cycle drops from tens of ms to sub-ms; scrolling holds 60fps.",
          },
          {
            q: "Build a custom structural directive (e.g., `*appIf` that shows content after a delay).",
            answer:
              "```ts\n@Directive({ selector: '[appDelay]', standalone: true })\nexport class DelayDirective implements OnDestroy {\n  private timer?: ReturnType<typeof setTimeout>;\n  constructor(private tpl: TemplateRef<unknown>, private vc: ViewContainerRef) {}\n  @Input() set appDelay(ms: number) {\n    this.vc.clear();\n    clearTimeout(this.timer);\n    this.timer = setTimeout(() => this.vc.createEmbeddedView(this.tpl), ms);\n  }\n  ngOnDestroy() { clearTimeout(this.timer); }\n}\n// <div *appDelay=\"500\">shows after 500ms</div>\n```\nThe `*` desugars to `<ng-template [appDelay]=\"500\">`; the directive receives the `TemplateRef` and stamps it into the `ViewContainerRef` after the delay. Always clear the timer in `ngOnDestroy`.",
          },
          {
            q: "Implement shared state between two unrelated sibling components using a service.",
            answer:
              "```ts\n@Injectable({ providedIn: 'root' })\nexport class CartService {\n  private items$ = new BehaviorSubject<Item[]>([]);\n  readonly items = this.items$.asObservable();\n  readonly count = this.items$.pipe(map(i => i.length));\n  add(it: Item) { this.items$.next([...this.items$.value, it]); }\n}\n```\nBoth siblings inject `CartService`; one calls `add()`, the other binds `cart.count | async`. `providedIn: 'root'` makes it a shared singleton. Expose an Observable (not the Subject) and do immutable updates so consumers can't mutate state directly.",
          },
          {
            q: "Write unit tests for a component that depends on an injected service, mocking the service.",
            answer:
              "```ts\nlet svc: jasmine.SpyObj<TxnService>;\nbeforeEach(async () => {\n  svc = jasmine.createSpyObj('TxnService', ['load']);\n  svc.load.and.returnValue(of([{ id: 1, amount: 100 }]));\n  await TestBed.configureTestingModule({\n    imports: [TxnListComponent],\n    providers: [{ provide: TxnService, useValue: svc }],\n  }).compileComponents();\n});\nit('renders rows from the service', () => {\n  const f = TestBed.createComponent(TxnListComponent);\n  f.detectChanges();\n  expect(svc.load).toHaveBeenCalledTimes(1);\n  expect(f.nativeElement.querySelectorAll('[data-row]').length).toBe(1);\n});\n```\nSwap the real service for a spy via the provider, return canned data with `of(...)`, `detectChanges()`, then assert on the DOM and the spy.",
          },
          {
            q: "Build a multi-step form wizard with per-step validation and a review step at the end.",
            answer:
              "One typed `FormGroup` with a nested group per step:\n```ts\nform = this.fb.group({\n  personal: this.fb.group({ name: ['', Validators.required] }),\n  address:  this.fb.group({ pin: ['', Validators.required] }),\n});\nsteps = ['personal', 'address'] as const;\nstep = signal(0);\nnext() {\n  if (this.form.get(this.steps[this.step()])!.valid) this.step.update(s => s + 1);\n  else this.form.get(this.steps[this.step()])!.markAllAsTouched();\n}\n```\nRender only the current step's sub-group; 'Next' is disabled until that sub-group is `valid`; the review step shows `form.getRawValue()` and submits when `form.valid`. One form means values persist as the user steps back and forth.",
          },
          {
            q: "You're handed a component with a memory leak (unclosed subscription) — find it and fix it.",
            answer:
              "**Symptom:** `this.service.data$.subscribe(...)` in `ngOnInit` with no cleanup — after navigating away and back a few times the callback fires N times and memory grows (visible in the DevTools memory profiler).\n\n**Fix:**\n```ts\nprivate destroyRef = inject(DestroyRef);\nngOnInit() {\n  this.service.data$\n    .pipe(takeUntilDestroyed(this.destroyRef))\n    .subscribe(d => (this.data = d));\n}\n```\nOr drop the manual subscribe entirely and use the `async` pipe in the template.",
          },
          {
            q: "Build a table component with client-side sorting and filtering, no external library.",
            answer:
              "```ts\nrows = input<Row[]>([]);\nfilter = signal('');\nsortKey = signal<keyof Row>('name');\nsortDir = signal<1 | -1>(1);\nview = computed(() => {\n  const q = this.filter().toLowerCase();\n  return this.rows()\n    .filter(r => JSON.stringify(r).toLowerCase().includes(q))\n    .sort((a, b) => (a[this.sortKey()] > b[this.sortKey()] ? 1 : -1) * this.sortDir());\n});\ntoggleSort(k: keyof Row) {\n  this.sortKey() === k\n    ? this.sortDir.update(d => (d * -1) as 1 | -1)\n    : (this.sortKey.set(k), this.sortDir.set(1));\n}\n```\nA `computed()` recalculates the visible rows only when rows/filter/sort change; header click toggles direction; component is `OnPush` since it's all signals.",
          },
          {
            q: "Implement optimistic UI update for a \"like\"/\"favorite\" button (update UI immediately, roll back on API failure).",
            answer:
              "```ts\ntoggleLike(post: Post) {\n  const prev = post.liked;\n  post.liked = !prev;                       // update UI now\n  post.likes += post.liked ? 1 : -1;\n  this.api.setLike(post.id, post.liked).pipe(\n    catchError(() => {\n      post.liked = prev;                     // roll back on failure\n      post.likes += post.liked ? 1 : -1;\n      this.toast.error('Could not save');\n      return EMPTY;\n    }),\n  ).subscribe();\n}\n```\nApply locally first, fire the request, revert on error. Guard rapid clicks with `exhaustMap` on a click `Subject` (or disable while pending) so you never send contradictory requests.",
          },
          {
            q: "Combine two API calls with `forkJoin` and handle partial failure gracefully.",
            answer:
              "```ts\nforkJoin({\n  profile: this.api.profile().pipe(catchError(() => of(null))),\n  txns:    this.api.txns().pipe(catchError(() => of([] as Txn[]))),\n}).subscribe(({ profile, txns }) => {\n  this.profile = profile;   // null if that call failed\n  this.txns = txns;         // still populated even if profile failed\n});\n```\n`forkJoin` normally errors and drops *all* results if any source errors. Wrapping each inner call in `catchError` with a safe fallback makes one failure degrade gracefully. Track which parts failed to show partial-error UI.",
          },
          {
            q: "Build a reusable confirmation-modal service that any component can call and `await` a result from.",
            answer:
              "```ts\n@Injectable({ providedIn: 'root' })\nexport class ConfirmService {\n  private resolver?: (v: boolean) => void;\n  message = signal<string | null>(null);\n  ask(message: string): Promise<boolean> {\n    this.message.set(message);\n    return new Promise(res => (this.resolver = res));\n  }\n  answer(v: boolean) { this.message.set(null); this.resolver?.(v); }\n}\n```\nA single `<app-confirm-host>` near the app root renders when `message()` is set and calls `answer(true|false)`. Any component: `if (await this.confirm.ask('Delete this?')) { ... }`. One overlay, promise-based API, no per-component modal markup.",
          },
          {
            q: "Implement route-based lazy loading for a feature module and verify it in the network tab / bundle output.",
            answer:
              "```ts\n// app.routes.ts\n{ path: 'reports',\n  loadChildren: () => import('./reports/reports.routes').then(m => m.REPORTS_ROUTES) }\n// or a single standalone component:\n{ path: 'settings',\n  loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent) }\n```\nAfter `ng build`, confirm a separate hashed chunk exists for `reports`, and that the network tab requests it only when you navigate to `/reports`. Add a custom `PreloadingStrategy` if you want it fetched in the background after initial load.",
          },
        ],
      },
      {
        id: "angular-forms",
        number: 4,
        numLabel: "4a",
        title: "Angular — Reactive Forms & Validation (Deep Dive)",
        questions: [
          {
            q: "FormControl, FormGroup, FormArray, FormRecord — what does each represent and when do you reach for each?",
            answer:
              "- **FormControl** — one field: value + validators + state.\n- **FormGroup** — a fixed set of named controls; `.value` is an object. The whole form or a logical section.\n- **FormArray** — an ordered, dynamic list of controls (add/remove at runtime); `.value` is an array. Repeating rows.\n- **FormRecord** — like a FormGroup but with a dynamic, open-ended set of keys of the *same* control type (e.g. a map of toggles).\n\nUse FormArray when the count is dynamic and positional; FormRecord when keys are dynamic but not positional.",
          },
          {
            q: "How do you build a reactive form with FormBuilder vs instantiating FormControl/FormGroup by hand? What does FormBuilder actually save you?",
            answer:
              "By hand: `new FormGroup({ name: new FormControl('', { validators: [Validators.required], nonNullable: true }) })`. With `FormBuilder`: `this.fb.group({ name: ['', Validators.required] })` — the `[initial, syncValidators, asyncValidators]` shorthand is terser, and `this.fb.nonNullable.group(...)` makes every control non-nullable. It's pure ergonomics; functionally identical.",
          },
          {
            q: "What is the difference between `setValue()` and `patchValue()` on a FormGroup? When does `setValue()` throw?",
            answer:
              "`patchValue({ a: 1 })` updates only the keys you pass and ignores unknown ones. `setValue({ ... })` requires **every** control's value, exactly matching the shape — it throws if a key is missing or extra. Use `setValue` to be strict (catch shape drift), `patchValue` for partial updates like prefilling some fields from an API.",
          },
          {
            q: "What do `reset()`, `markAsPristine()`, `markAsTouched()`, and `markAllAsTouched()` do, and when would you call `markAllAsTouched()` on submit?",
            answer:
              "- `reset(value?)` — clears to `null`/the given value and resets `pristine` + `untouched`.\n- `markAsPristine()` / `markAsDirty()` — toggle the 'user changed it' flag.\n- `markAsTouched()` — mark one control blurred.\n- `markAllAsTouched()` — recursively mark every control touched.\n\nCall `markAllAsTouched()` in the submit handler when `form.invalid`, so error messages (usually shown only when `touched`) appear for fields the user never visited.",
          },
          {
            q: "Explain the control states: pristine/dirty, touched/untouched, valid/invalid, pending, disabled. Which combination decides whether you actually show an error message?",
            answer:
              "pristine/dirty = has the value changed; touched/untouched = has it been blurred; valid/invalid = do validators pass; pending = an async validator is running; disabled = excluded from value and validation. Typical show-error condition: `control.invalid && (control.touched || form.submitted)` — don't nag while the user is still typing in a field they haven't left yet.",
          },
          {
            q: "Why does a disabled control not appear in `form.value`, and how do you get the full value including disabled controls?",
            followups: ["What does `getRawValue()` return that `.value` doesn't?"],
            answer:
              "A disabled control is intentionally excluded from `form.value` and from validation — it's 'not part of this submission'. To read everything, use `form.getRawValue()`.\n\n**Follow-up:** `getRawValue()` returns the values of *all* controls including disabled ones, which `.value` omits — useful when a field is display-only in the UI but you still need to send it.",
          },
          {
            q: "How do `valueChanges` and `statusChanges` work? What's the common infinite-loop bug when you subscribe to `valueChanges` and also call `patchValue()` inside that subscription?",
            followups: [
              "How does `{ emitEvent: false }` help?",
            ],
            answer:
              "`valueChanges` emits the new value on every change; `statusChanges` emits `'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'`. Infinite loop: subscribing to `valueChanges` and calling `patchValue()` in the handler → the patch fires `valueChanges` again → recursion.\n\n**Follow-up:** pass `{ emitEvent: false }` to `patchValue` / `setValue` / `setValidators` so the programmatic change doesn't re-trigger `valueChanges`, breaking the cycle. Debouncing or a re-entrancy flag also works.",
          },
          {
            q: "What is the `updateOn` option (`change` / `blur` / `submit`) and when would you switch a form or control to `blur` or `submit`?",
            answer:
              "`updateOn` controls *when* a control syncs its value and runs validators: `'change'` (default, every keystroke), `'blur'` (on focus-out), `'submit'` (only on form submit). Use `'blur'` for expensive async validators or to cut `valueChanges` churn on large forms; `'submit'` when you only want to validate once at the end. Set per-control or on the group: `fb.group({...}, { updateOn: 'blur' })`.",
          },
          {
            q: "How do you build a dynamic FormArray — add row, remove row, reindex — and bind it in the template with `formArrayName` + `formGroupName`?",
            answer:
              "```ts\nlines = this.fb.array<FormGroup>([]);\nnewLine() { return this.fb.group({ qty: [1, Validators.min(1)], price: [0] }); }\nadd() { this.lines.push(this.newLine()); }\nremove(i: number) { this.lines.removeAt(i); }\n```\n```html\n<div formArrayName=\"lines\">\n  <div *ngFor=\"let g of lines.controls; let i = index\" [formGroupName]=\"i\">\n    <input formControlName=\"qty\"><input formControlName=\"price\">\n  </div>\n</div>\n```\nNo manual reindex — `removeAt` shifts the rest and the `*ngFor` index re-binds.",
          },
          {
            q: "How do you implement cross-field validation (password + confirmPassword) with a validator on the FormGroup, and how do you surface that error in the template since it lives on the group, not a control?",
            answer:
              "```ts\nconst passwordsMatch: ValidatorFn = g => {\n  const p = g.get('pwd')?.value, c = g.get('confirm')?.value;\n  return p === c ? null : { mismatch: true };\n};\nthis.fb.group({ pwd: [''], confirm: [''] }, { validators: passwordsMatch });\n```\nRead it as `form.hasError('mismatch')` in the template — not on either control. Optionally also `confirm.setErrors({ mismatch: true })` to put the message beside that field.",
          },
          {
            q: "Write a custom synchronous validator (e.g., a forbidden-value validator). What exact shape must it return on valid vs invalid?",
            answer:
              "```ts\nexport function forbiddenValue(bad: string): ValidatorFn {\n  return (c: AbstractControl): ValidationErrors | null =>\n    c.value === bad ? { forbidden: { value: c.value } } : null;\n}\n```\nReturn **`null`** when valid, or an **error object** `{ key: any }` when invalid — the payload under the key is available to the template (`c.errors?.['forbidden'].value`).",
          },
          {
            q: "Write a custom async validator that checks username availability against an API. How do you debounce it so it doesn't fire on every keystroke?",
            answer:
              "```ts\nexport function usernameAvailable(api: UserApi): AsyncValidatorFn {\n  return c => timer(300).pipe(          // debounce keystrokes\n    switchMap(() => api.exists(c.value)),\n    map(taken => (taken ? { taken: true } : null)),\n    catchError(() => of(null)),          // network error != invalid\n    first(),                            // must complete\n  );\n}\n```\nAttach via `asyncValidators`. Angular re-subscribes on each value change; `timer(300)` + `switchMap` means a fast typist triggers one API call.",
          },
          {
            q: "How does Angular know an async validator is still running? What is the `pending` status and how do you show a spinner for it?",
            answer:
              "While an async validator's Observable hasn't completed, the control's status is `'PENDING'` (`control.pending === true`) and it's neither valid nor invalid. Show `@if (ctrl.pending) { <spinner/> }`, and gate the submit button on `form.pending` as well as `form.invalid`.",
          },
          {
            q: "How do you pass a parameter into a custom validator (the validator-factory pattern)?",
            answer:
              "Return a `ValidatorFn` from a function that closes over the parameter:\n```ts\nexport const minWords = (n: number): ValidatorFn => c =>\n  (c.value ?? '').trim().split(/\\s+/).filter(Boolean).length >= n\n    ? null : { minWords: { required: n } };\n// usage: ['', [minWords(3)]]\n```\nThis is exactly how `Validators.minLength(5)` works — a factory returning the actual validator.",
          },
          {
            q: "`ValidatorFn` vs `AsyncValidatorFn` vs a directive-based validator registered with `NG_VALIDATORS` — when do you actually need the directive form?",
            answer:
              "`ValidatorFn` / `AsyncValidatorFn` are plain functions you attach in the component (reactive forms). You need the **directive form** (a `@Directive` providing `NG_VALIDATORS` with `multi: true`) when the validator must be usable **declaratively in template-driven forms**, e.g. `<input appForbidden=\"admin\" ngModel>` — the directive hooks itself into that control's validators automatically.",
          },
          {
            q: "How do you add or remove validators at runtime with `setValidators()` / `addValidators()` / `removeValidators()`, and why must you call `updateValueAndValidity()` afterwards?",
            answer:
              "`setValidators([...])` replaces the set; `addValidators` / `removeValidators` (Angular 12+) adjust it. Validity isn't recomputed automatically — you must call `control.updateValueAndValidity()` to re-run validation and emit `statusChanges`. Pass `{ emitEvent: false }` if you don't want to notify subscribers.",
          },
          {
            q: "Conditional validation: a field is required only when another field has a certain value — how do you wire that up without leaking subscriptions?",
            answer:
              "```ts\nthis.form.get('type')!.valueChanges\n  .pipe(takeUntilDestroyed())\n  .subscribe(type => {\n    const gst = this.form.get('gstNo')!;\n    type === 'business' ? gst.setValidators(Validators.required) : gst.clearValidators();\n    gst.updateValueAndValidity();\n  });\n```\n`takeUntilDestroyed()` (or `takeUntil(destroy$)`) ties the subscription to the component lifecycle so it can't leak.",
          },
          {
            q: "`control.errors` is an object of all failing keys — how do you cleanly display just the first relevant error message per control?",
            answer:
              "Keep a priority-ordered message map and pick the first present key:\n```ts\nconst MESSAGES: Record<string, string> = {\n  required: 'Required', email: 'Invalid email', minlength: 'Too short',\n};\nfirstError(c: AbstractControl) {\n  const key = Object.keys(c.errors ?? {})[0];\n  return key ? MESSAGES[key] ?? key : null;\n}\n```\nTemplate: `@if (ctrl.invalid && ctrl.touched) { {{ firstError(ctrl) }} }`. A shared error component keeps it DRY.",
          },
          {
            q: "What is `ControlValueAccessor` and what do its four methods (`writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`) each do?",
            answer:
              "`ControlValueAccessor` bridges a custom input and the forms API:\n- `writeValue(v)` — forms → view: the model pushes a value in, you render it.\n- `registerOnChange(fn)` — view → forms: store `fn`, call it when the user changes the value.\n- `registerOnTouched(fn)` — store `fn`, call it on blur so `touched` updates.\n- `setDisabledState(isDisabled)` — the form enabled/disabled it; reflect that in your UI.",
          },
          {
            q: "Build a custom form control (star-rating or currency input) that works with `formControlName`, `[(ngModel)]`, validation, and the disabled state.",
            answer:
              "```ts\n@Component({\n  selector: 'app-stars', standalone: true,\n  template: `<span *ngFor=\"let s of [1,2,3,4,5]\" (click)=\"pick(s)\">{{ s <= value ? '★' : '☆' }}</span>`,\n  providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => StarsComponent) }],\n})\nexport class StarsComponent implements ControlValueAccessor {\n  value = 0; disabled = false;\n  private onChange: (v: number) => void = () => {};\n  private onTouched: () => void = () => {};\n  writeValue(v: number) { this.value = v ?? 0; }\n  registerOnChange(fn: any) { this.onChange = fn; }\n  registerOnTouched(fn: any) { this.onTouched = fn; }\n  setDisabledState(d: boolean) { this.disabled = d; }\n  pick(s: number) { if (!this.disabled) { this.value = s; this.onChange(s); this.onTouched(); } }\n}\n```\nNow `<app-stars formControlName=\"rating\">` and `[(ngModel)]` both work, and validators on that control apply.",
          },
          {
            q: "Why do you register a custom control with `NG_VALUE_ACCESSOR` using `multi: true` and `forwardRef()`?",
            answer:
              "`multi: true` because `NG_VALUE_ACCESSOR` is a multi-provider token — many components each register their own accessor and Angular picks the one on the element. `forwardRef(() => MyComponent)` because the `providers` array is evaluated before the class declaration finishes, so you need a lazy reference to the class.",
          },
          {
            q: "How do you compose a child component's sub-form into a parent form — passing a `FormGroup` via `@Input` vs sharing a `ControlContainer`?",
            answer:
              "**@Input a FormGroup:** parent creates it, passes it in, child binds `[formGroup]=\"group\"`. Explicit but repetitive. **Shared ControlContainer:** the child injects the parent's `ControlContainer` and uses `formGroupName=\"address\"`, so its controls attach into the parent form automatically with nothing passed in. The ControlContainer approach is cleaner for deeply nested forms.",
          },
          {
            q: "What does providing `ControlContainer` via `viewProviders` with `formGroupName` give a sub-form component, and why is it better than passing the FormGroup as an input?",
            answer:
              "```ts\n@Component({\n  selector: 'app-address',\n  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],\n  template: `<ng-container formGroupName=\"address\"><input formControlName=\"pin\"></ng-container>`,\n})\n```\nThe child resolves `ControlContainer` from the parent's `FormGroupDirective`, so `formGroupName=\"address\"` binds into the parent form. Better than an `@Input` because there's nothing to pass, the child is self-contained, and refactoring the parent form doesn't change the child's API.",
          },
          {
            q: "Template-driven forms: how do `ngModel`, `ngForm`, `ngModelGroup`, and the exported `#f=\"ngForm\"` reference work together?",
            answer:
              "With `FormsModule`, `NgForm` auto-attaches to any `<form>`; `#f=\"ngForm\"` exports it so you can read `f.value`, `f.valid`, `f.submitted`. `ngModel` on an input registers a control into that form by its `name` attribute. `ngModelGroup` creates a nested sub-object. Submit with `(ngSubmit)=\"onSubmit(f)\"`.",
          },
          {
            q: "Template-driven vs reactive forms — give three concrete reasons to pick reactive for a complex fintech form.",
            answer:
              "1. **Testable without the DOM** — assert validity/values in a plain unit test; critical for money logic.\n2. **Dynamic structure** — `FormArray` for line items, runtime validator changes, conditional fields — awkward template-driven.\n3. **Synchronous explicit model** — you always know the current value/validity in code, and complex cross-field/async validation is first-class. Plus strong typing with typed forms.",
          },
          {
            q: "How do you strictly type a reactive form (typed forms, Angular 14+)? What broke, and what do `FormControl<string>` and `nonNullable` give you?",
            answer:
              "Since Angular 14, `FormControl` is generic and typed by default: `new FormControl('')` infers `FormControl<string | null>` (nullable because `reset()` can null it). `nonNullable: true` (or `fb.nonNullable`) gives `FormControl<string>` and makes `reset()` restore the initial value instead of null. `form.value` is a `Partial<T>` (disabled omitted); `getRawValue()` is the full `T`. What 'broke': untyped `AbstractControl` is now effectively `any` — legacy code opts into `UntypedFormControl`.",
          },
          {
            q: "Why can `form.get('a.b.c')` return `null`, and how do you access deeply nested controls safely?",
            answer:
              "`get()` returns `AbstractControl | null` — `null` if any path segment is misspelled or the control was removed, and TypeScript can't narrow it. Either non-null assert (`form.get('a.b.c')!`) when you're certain, or guard: `const c = form.get('a.b.c'); if (c) { ... }`. With typed forms, prefer `form.controls.a.controls.b` for compile-time safety.",
          },
          {
            q: "After a successful submit, how do you reset the form to initial values without leaving controls `touched`/`dirty` so old errors keep showing?",
            answer:
              "```ts\nthis.form.reset(this.initialValue);   // also resets pristine/untouched\n```\n`reset()` already resets `pristine` and `untouched`, so errors gated on `touched` disappear. If you rebuilt controls or only used `patchValue`, also call `markAsPristine()` + `markAsUntouched()`. With `nonNullable` controls, `reset()` restores initial values rather than null.",
          },
          {
            q: "How do you prevent a double submit — button disabled on `form.invalid || submitting`, and why is `exhaustMap` the right operator on the submit stream?",
            answer:
              "Disable the button: `[disabled]=\"form.invalid || submitting\"`. Model submit as a `Subject` and use `exhaustMap` so clicks during an in-flight save are ignored:\n```ts\nthis.submit$.pipe(\n  exhaustMap(() => this.api.save(this.form.getRawValue())\n    .pipe(finalize(() => (this.submitting = false)))),\n).subscribe();\n```\n`exhaustMap` (not `mergeMap`/`concatMap`) because you want to *drop* extra submits, not queue or parallelize them.",
          },
          {
            q: "How do you map server-side validation errors (a 422 response) back onto specific form controls using `setErrors()`?",
            answer:
              "```ts\nthis.api.save(dto).subscribe({\n  error: (e: HttpErrorResponse) => {\n    if (e.status === 422) {\n      for (const [field, messages] of Object.entries(e.error.errors)) {\n        this.form.get(field)?.setErrors({ server: (messages as string[])[0] });\n      }\n    }\n  },\n});\n```\n`setErrors({ server: msg })` puts the message on the control so your existing error display shows it. Clear these on the next `valueChanges` so the user can fix and retry.",
          },
          {
            q: "What's the performance concern with a very large reactive form where `valueChanges` fires constantly, and how do `updateOn: 'blur'` and `OnPush` help?",
            answer:
              "With hundreds of controls, default `updateOn: 'change'` re-runs validators and fires `valueChanges` on every keystroke, and any `valueChanges` subscription plus CD runs constantly. `updateOn: 'blur'` collapses that to one update per field exit. `OnPush` on the form and field components stops Angular re-checking the subtree on unrelated changes. Also split into child components, avoid heavy template getters, and debounce derived-value subscriptions.",
          },
          {
            q: "How do you build a multi-step wizard: one big FormGroup with nested groups per step vs separate FormGroups per step — and how do you validate step-by-step?",
            answer:
              "**One FormGroup with a nested group per step** is usually better: values persist when stepping back, one `form.valid` for final submit, easy review via `getRawValue()`. Validate a step by checking `form.get(stepKey)!.valid` before allowing 'Next' (and `markAllAsTouched()` on that sub-group if invalid). Separate FormGroups are fine if steps are truly independent or lazy-loaded, but you aggregate values yourself.",
          },
          {
            q: "How do you drive a \"you have unsaved changes\" `CanDeactivate` guard from `form.dirty`?",
            answer:
              "```ts\nexport interface DirtyForm { form: FormGroup; }\nexport const unsavedGuard: CanDeactivateFn<DirtyForm> = c =>\n  !c.form.dirty || confirm('Discard unsaved changes?');\n// route: canDeactivate: [unsavedGuard]\n```\nAfter a successful save, call `form.markAsPristine()` so the guard stops prompting. Swap `confirm()` for a modal service returning `Promise<boolean>` for a nicer UX.",
          },
          {
            q: "How do you unit-test a component with a reactive form — set control values, mark touched, assert validity, and assert the emitted output on submit?",
            answer:
              "```ts\nit('is invalid until required fields are set; emits on submit', () => {\n  const f = TestBed.createComponent(TransferComponent);\n  const c = f.componentInstance;\n  expect(c.form.valid).toBeFalse();\n  c.form.setValue({ to: 'acc-2', amount: 100 });\n  expect(c.form.valid).toBeTrue();\n  const spy = jasmine.createSpy();\n  c.submitted.subscribe(spy);\n  c.onSubmit();\n  expect(spy).toHaveBeenCalledWith({ to: 'acc-2', amount: 100 });\n});\n```\nNo DOM needed — set control values directly, assert `valid`/`errors`, and assert the `@Output` payload.",
          },
        ],
      },
      {
        id: "angular-rxjs",
        number: 4,
        numLabel: "4b",
        title: "Angular — RxJS in Angular (Deep Dive)",
        questions: [
          {
            q: "Observable vs Promise — lazy vs eager, one value vs many, cancellable vs not. Why does `HttpClient` return an Observable?",
            answer:
              "A Promise is eager (starts on creation), yields exactly one value or rejection, and can't be cancelled. An Observable is lazy (nothing runs until `subscribe`), can emit 0..N values over time, is cancellable (unsubscribe aborts the work), and composes with operators. `HttpClient` returns an Observable so a request can be cancelled (unsubscribe aborts the XHR — that's how `switchMap` powers typeahead), retried, timed out, and combined declaratively with other streams — and so it doesn't fire until something (or the `async` pipe) subscribes.",
          },
          {
            q: "Cold vs hot Observable — is an `HttpClient` request cold or hot, and what actually happens if you subscribe to it twice?",
            answer:
              "**Cold:** each subscriber gets its own producer; the work restarts per subscribe. **Hot:** one shared producer; subscribers see emissions from whenever they joined. `HttpClient` requests are **cold** — subscribing twice sends the HTTP request twice. That's why `| async` used twice in a template, or multiple components calling `service.getX()`, cause duplicate requests. Fix with `shareReplay(1)` or by caching the result in a service.",
          },
          {
            q: "Subject vs BehaviorSubject vs ReplaySubject vs AsyncSubject — the differences, and one real Angular use case for each.",
            answer:
              "- **Subject** — no initial value; late subscribers miss past emissions. Use: an event bus / `refresh$` trigger.\n- **BehaviorSubject** — needs a seed, replays the current value on subscribe. Use: current auth state, a store's state.\n- **ReplaySubject(n)** — replays the last n emissions. Use: last few notifications for a late-mounting component.\n- **AsyncSubject** — emits only the final value, on complete. Use: rare — a one-shot result surfaced after completion.",
          },
          {
            q: "When do you use a `BehaviorSubject` as the backing store of a stateful service, and why expose it via `.asObservable()`?",
            answer:
              "Use it when any subscriber must be able to read the current value immediately on subscribe (component state, a store). Update methods call `.next(newImmutableState)`. You expose `state$ = subject.asObservable()` so consumers can subscribe and `map` to slices but **cannot call `.next()`** — every mutation goes through the service's methods, keeping state changes centralized and traceable.",
          },
          {
            q: "`switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap` — describe the marble behaviour and give the canonical use case for each (typeahead, parallel, ordered, submit).",
            answer:
              "- **switchMap** — on a new source value, unsubscribe the previous inner and start a new one. Only the latest matters: typeahead, route param → fetch.\n- **mergeMap** — subscribe to every inner immediately; results interleave: independent parallel work.\n- **concatMap** — queue sources, run inners strictly one after another: ordered dependent writes.\n- **exhaustMap** — while an inner is active, ignore new source values: login / submit.",
          },
          {
            q: "Which flattening operator prevents duplicate form submissions, and what goes wrong if you use `mergeMap` there instead?",
            answer:
              "`exhaustMap`. While the save request is in flight it ignores further clicks, so button-mashing sends one request. With `mergeMap` every click starts a new request — duplicate transfers/orders. `concatMap` avoids concurrency but *queues* the extra clicks and replays them afterwards, which is still wrong for a submit.",
          },
          {
            q: "`combineLatest` vs `forkJoin` vs `zip` vs `withLatestFrom` — when does each emit, and when does each complete?",
            answer:
              "- **combineLatest** — first emits once every source has emitted, then on *every* subsequent emission of any source, with the latest of each. Completes when all complete.\n- **forkJoin** — emits *once*, when *all* complete, with each one's last value. Never emits if any source never completes.\n- **zip** — emits when every source has produced the value at that index (pairs by index). Completes with the shortest.\n- **withLatestFrom** — emits only when the *primary* source emits, attaching the latest of the others.",
          },
          {
            q: "Why does `forkJoin` emit nothing if one inner Observable never completes, and what's the fix when combining with a stream that doesn't complete?",
            answer:
              "`forkJoin` waits for **completion** of every source, then emits their last values. An HTTP call completes after one value, so it's fine — but `valueChanges`, a `Subject`, or `interval` never complete, so `forkJoin` hangs. Fix: give the non-completing source a completion (`take(1)` / `first()`), or use `combineLatest` / `withLatestFrom` if you actually want 'latest of each'.",
          },
          {
            q: "How do you handle partial failure in `forkJoin` — one of three calls fails but you still want the other two results?",
            answer:
              "Wrap each inner in `catchError` returning a sentinel so that source 'succeeds' with a fallback:\n```ts\nforkJoin({\n  a: apiA().pipe(catchError(() => of(null))),\n  b: apiB().pipe(catchError(() => of([]))),\n  c: apiC().pipe(catchError(() => of(null))),\n}).subscribe(({ a, b, c }) => { /* a/c may be null */ });\n```\nWithout it, one error makes `forkJoin` error and you lose *all* results. Track which keys returned the fallback to render partial-error UI.",
          },
          {
            q: "`debounceTime` vs `throttleTime` vs `auditTime` vs `sampleTime` — which for a search box, which for a scroll/resize handler, and why?",
            answer:
              "- **debounceTime(t)** — emit only after t of silence. Search boxes (wait for a typing pause).\n- **throttleTime(t)** — emit the first value, then ignore for t. Rate-limit a burst where you want the *leading* edge (rapid clicks).\n- **auditTime(t)** — on a value, wait t, emit the *latest*. Smooth trailing scroll/resize updates where the last position matters.\n- **sampleTime(t)** — every t, emit the most recent value if any. Periodic sampling of a noisy stream.",
          },
          {
            q: "`distinctUntilChanged` — how does it help a typeahead, and what's the gotcha when the values are objects?",
            answer:
              "It suppresses consecutive duplicate terms, so retyping the same text (or a focus/blur re-emitting the current value) doesn't refire the search. Gotcha: it compares with `===`, so two objects with identical contents are 'different' and always pass. Provide a comparator — `distinctUntilChanged((a, b) => a.id === b.id)` or `distinctUntilKeyChanged('id')` — or compare a primitive projection.",
          },
          {
            q: "Build search-as-you-type: `valueChanges` → `debounceTime` → `distinctUntilChanged` → `switchMap` → handle errors without killing the stream.",
            answer:
              "```ts\nresults$ = this.q.valueChanges.pipe(\n  map(v => (v ?? '').trim()),\n  debounceTime(300),\n  distinctUntilChanged(),\n  switchMap(term => term\n    ? this.api.search(term).pipe(catchError(() => of([])))\n    : of([])),\n);\n```\nThe `catchError` sits on the *inner* Observable, so a failed request yields `[]` and the outer stream keeps handling the next keystroke.",
          },
          {
            q: "Why does an error inside an inner Observable in `switchMap` complete the whole outer stream, and how do you contain it (`catchError` on the inner, returning `EMPTY` or `of(...)`)?",
            answer:
              "RxJS errors are terminal: an error from the inner propagates to the outer subscriber and tears everything down — no more keystrokes handled. Contain it *inside* the `switchMap` projection so it never leaves the inner:\n```ts\nswitchMap(term => this.api.search(term).pipe(catchError(() => of([]))))\n```\nReturn `of(fallback)` to emit a value, or `EMPTY` to emit nothing while keeping the outer alive.",
          },
          {
            q: "`catchError` — where do you place it (inner vs outer), what must it return, and what's the difference between returning `of([])` and rethrowing?",
            answer:
              "Place it **inside** the higher-order operator to keep the outer stream alive per item; place it **outer** only when an error should end the whole stream (then render an error state). It must return an Observable: `of(fallback)` substitutes a value and completes that inner; `throwError(() => err)` re-propagates. `of([])` = 'treat failure as empty results, carry on'; rethrow = 'fatal, let the subscriber's error handler deal with it'.",
          },
          {
            q: "How do you retry a failed HTTP call three times with exponential backoff using `retry({ count, delay })`?",
            answer:
              "```ts\nthis.api.get().pipe(\n  retry({\n    count: 3,\n    delay: (err, attempt) =>\n      err.status >= 500 ? timer(2 ** attempt * 300) : throwError(() => err),\n  }),\n);\n```\n`delay` returns an Observable whose emission triggers the retry; returning `throwError` for a non-retryable status (4xx) aborts immediately. Add jitter to avoid thundering herds, and only retry idempotent requests.",
          },
          {
            q: "What is `finalize` good for (hiding a loading spinner), and how is it different from the `complete` callback?",
            answer:
              "`finalize(fn)` runs `fn` when the Observable **terminates for any reason** — complete, error, *or* unsubscribe. The `complete` callback in `subscribe` runs only on normal completion. So `finalize(() => this.loading = false)` reliably hides a spinner even if the request errors or the component is destroyed mid-flight.",
          },
          {
            q: "How do you cancel an in-flight HTTP request in Angular? What actually triggers the cancellation?",
            answer:
              "Unsubscribing from the `HttpClient` Observable aborts the underlying XHR/fetch. That happens when you `subscription.unsubscribe()`, the `async` pipe's component is destroyed, or `switchMap` / `takeUntil` unsubscribes the inner (a new value arrived, or the notifier fired). There is no explicit `cancel()` — cancellation *is* unsubscription.",
          },
          {
            q: "List the four common fixes for subscription memory leaks: `async` pipe, `takeUntil(destroy$)`, `takeUntilDestroyed()`, and manual `unsubscribe()`. When is each appropriate?",
            answer:
              "- **`async` pipe** — default; template-owned, auto-unsubscribes. Use whenever the value is only consumed in the template.\n- **`takeUntilDestroyed()`** — for subscriptions created in an injection context (field initializer / constructor); cleanest for component code.\n- **`takeUntil(destroy$)`** — pre-16, or when you need a shared teardown notifier; must be the last operator.\n- **manual `unsubscribe()`** — one or two subscriptions with imperative setup/teardown, or non-Angular contexts.",
          },
          {
            q: "What are `takeUntilDestroyed()` and `DestroyRef` (Angular 16+), and when can you call `takeUntilDestroyed()` without passing a `DestroyRef`?",
            answer:
              "`DestroyRef` is an injectable for registering `onDestroy` callbacks outside `ngOnDestroy`. `takeUntilDestroyed(destroyRef?)` completes the stream when that context is destroyed. You can omit the argument only when called **within an injection context** (a field initializer or the constructor), where it grabs the current `DestroyRef` automatically; anywhere else you must pass one you injected.",
          },
          {
            q: "The `async` pipe — what does it do on subscribe, on destroy, and on reference change? Why do two `async` pipes on the same source cause two subscriptions, and how does `*ngIf ... as` fix it?",
            answer:
              "On first render it subscribes; on each emission it marks the component for check and returns the latest value; on destroy (or if the source reference changes) it unsubscribes the old and subscribes the new. Each `| async` is an independent subscription, so using it three times subscribes three times (and re-fetches a cold HTTP call). Fix by subscribing once and reusing: `@if (data$ | async; as data) { {{ data.x }} {{ data.y }} }`.",
          },
          {
            q: "`shareReplay({ bufferSize: 1, refCount: true })` — what problem does it solve for a shared HTTP call, and what's the `refCount` true-vs-false trade-off (leak vs re-request)?",
            answer:
              "It multicasts one execution to all current and future subscribers and replays the last value to latecomers — N components, one HTTP call. `refCount: true` drops the source when subscriber count hits 0 (no leak), but the *next* subscriber re-runs the request. `refCount: false` keeps the cached value forever (good for config), but leaks if the source is infinite. Screen-scoped data → `refCount: true`; fetched-once config → `refCount: false` / `shareReplay(1)`.",
          },
          {
            q: "How do you turn a value that changes over time (route params) into a data stream — `paramMap` → `switchMap(id => service.get(id))` → `async` pipe?",
            answer:
              "```ts\ntxn$ = this.route.paramMap.pipe(\n  map(p => p.get('id')!),\n  switchMap(id => this.api.getTxn(id).pipe(catchError(() => of(null)))),\n);\n// @if (txn$ | async; as txn) { ... }\n```\n`paramMap` emits on every navigation to the route (including `/txn/1` → `/txn/2` where the component instance is reused); `switchMap` cancels the previous fetch; the `async` pipe owns the subscription. No manual re-fetch in `ngOnInit`.",
          },
          {
            q: "`startWith`, `scan`, and `map` — how would you build a running-total or an accumulating-state stream?",
            answer:
              "```ts\ntotal$ = this.amountAdded$.pipe(\n  startWith(0),\n  scan((acc, n) => acc + n, 0),\n);\n```\n`scan` is `reduce` that emits the accumulator on every input — running totals, event logs, accumulated state. `startWith` seeds an initial emission so the UI shows `0` before any input. `map` transforms each value independently, with no accumulation.",
          },
          {
            q: "`EMPTY` vs `of()` vs `NEVER` — what does each do, and when do you return `EMPTY` from `catchError`?",
            answer:
              "- **`EMPTY`** — emits nothing, completes immediately.\n- **`of(x)`** — emits `x`, then completes.\n- **`NEVER`** — emits nothing, never completes (mostly test scaffolding).\n\nReturn `EMPTY` from `catchError` to swallow the error and produce *no* value while keeping the outer stream alive (e.g. an optimistic update already did the rollback). Return `of(fallback)` when downstream needs a value.",
          },
          {
            q: "How do you combine a manual \"refresh\" button with an initial auto-load — a `Subject` merged with a startup trigger, piped into `switchMap`?",
            answer:
              "```ts\nprivate refresh$ = new Subject<void>();\ndata$ = this.refresh$.pipe(\n  startWith(undefined),                       // initial auto-load\n  switchMap(() => this.api.list().pipe(catchError(() => of([])))),\n  shareReplay(1),\n);\nreload() { this.refresh$.next(); }\n```\n`startWith` triggers the first load; each `reload()` re-triggers; `switchMap` cancels a stale in-flight load.",
          },
          {
            q: "Signals vs RxJS — when do you reach for a signal, when for an Observable? What do `toSignal()` and `toObservable()` bridge?",
            answer:
              "Signals: synchronous, pull-based *state* with automatic dependency tracking — ideal for what the template renders and derived values (`computed`). RxJS: push-based *event/async streams* — HTTP, debounced input, websockets, cancellation, combination. `toSignal(obs$)` adapts a stream to a signal (auto-subscribe, auto-teardown with the injection context, optional `initialValue`); `toObservable(sig)` emits when the signal changes. Typical: fetch with RxJS, expose the result as a signal for the view.",
          },
          {
            q: "What does `toSignal()` do about the initial value and about unsubscription?",
            answer:
              "`toSignal(obs$)` subscribes immediately. Before the source emits, the signal is `undefined` unless you pass `{ initialValue: x }` (or `{ requireSync: true }` for synchronous sources like `BehaviorSubject`). It unsubscribes automatically when the surrounding injection context is destroyed — no manual teardown.",
          },
          {
            q: "Why is a nested `subscribe` inside another `subscribe` an anti-pattern? Rewrite it with a higher-order mapping operator.",
            answer:
              "```ts\n// bad\nthis.route.paramMap.subscribe(p => {\n  this.api.get(p.get('id')!).subscribe(x => (this.x = x));\n});\n// good\nthis.route.paramMap.pipe(\n  switchMap(p => this.api.get(p.get('id')!)),\n).subscribe(x => (this.x = x));\n```\nNested subscribes leak (the inner isn't cancelled when the outer re-emits), lose ordering, and can't be composed or cancelled as a unit. A higher-order operator flattens and manages the inner subscription.",
          },
          {
            q: "How do you unit-test RxJS code — marble testing with `TestScheduler`, `fakeAsync` + `tick()`, or subscribing and asserting? When does each fit?",
            answer:
              "- **Subscribe + assert** — simplest; for synchronous / `of()`-based streams, collect emissions into an array and assert.\n- **`fakeAsync` + `tick()`** — for time operators (`debounceTime`, `delay`) and Angular async; advance virtual time deterministically.\n- **Marble testing (`TestScheduler`)** — for complex operator combinations and precise timing/ordering; write `cold('-a-b|')` diagrams. Overkill for most component tests.",
          },
          {
            q: "How do you test a debounced typeahead in a `fakeAsync` zone with `tick(300)`?",
            answer:
              "```ts\nit('debounces then searches', fakeAsync(() => {\n  const spy = spyOn(api, 'search').and.returnValue(of([]));\n  comp.q.setValue('acc');\n  tick(200); expect(spy).not.toHaveBeenCalled();\n  tick(100); expect(spy).toHaveBeenCalledWith('acc');   // 300ms total\n}));\n```\n`tick` advances the virtual clock so `debounceTime(300)` fires with no real wait; the HTTP call is stubbed with `of()`.",
          },
          {
            q: "`tap` for side effects vs doing side effects in `map` or `subscribe` — when is `tap` the right tool?",
            answer:
              "`tap` is for side effects that don't change the stream — logging, `this.loading = true`, analytics — placed anywhere in the pipe, running per emission/error/complete without altering values. Side effects in `map` conflate transformation with effects (and `map` should stay pure); side effects in `subscribe` are fine for the *final* consumer but can't run at an intermediate stage or be shared across multiple subscribers.",
          },
          {
            q: "How do you process 100 items but cap it at five concurrent HTTP requests (`mergeMap` with a concurrency argument)?",
            answer:
              "```ts\nfrom(items).pipe(\n  mergeMap(\n    item => this.api.process(item).pipe(catchError(e => of({ item, error: e }))),\n    5,                                   // concurrency cap\n  ),\n  toArray(),\n).subscribe(results => { /* done, 5 at a time */ });\n```\n`mergeMap`'s third arg keeps at most 5 inner subscriptions active and starts the next as each finishes; `catchError` per item so one failure doesn't abort the batch.",
          },
          {
            q: "How do you share one HTTP response across multiple components without re-fetching?",
            answer:
              "Put it in a service and cache the stream:\n```ts\nprivate config$ = this.http.get<Config>('/config').pipe(shareReplay(1));\ngetConfig() { return this.config$; }\n```\nEvery component calls `getConfig()`; the request fires once on the first subscribe, and everyone — including late subscribers — gets the replayed value. For data that can change, add an invalidation `Subject` piped through `switchMap`.",
          },
          {
            q: "What is backpressure, and where might it actually bite in an Angular UI (rapid websocket messages, resize storms)?",
            answer:
              "Backpressure = the producer emits faster than the consumer can handle. Rare in typical UIs (user events are slow), but it bites with high-frequency websocket/SSE messages rendered per message (market data, logs), `mousemove` / `scroll` / `resize` storms, or `valueChanges` on a huge form. Mitigate with `throttleTime` / `auditTime` / `sampleTime`, `bufferTime`, batching updates, or moving work off the CD path with `runOutsideAngular`.",
          },
          {
            q: "How do you convert a DOM event, a `setInterval`, or a websocket into an Observable (`fromEvent`, `interval`, `new Observable`)?",
            answer:
              "```ts\nfromEvent(window, 'resize').pipe(debounceTime(100));\ninterval(1000);                        // 0,1,2… every second\nnew Observable<Msg>(sub => {\n  const ws = new WebSocket(url);\n  ws.onmessage = e => sub.next(JSON.parse(e.data));\n  ws.onerror = e => sub.error(e);\n  return () => ws.close();             // teardown on unsubscribe\n});\n```\nThe returned teardown function is what makes unsubscribe clean up the resource.",
          },
          {
            q: "Why should a service method return an Observable rather than subscribe internally and return `void`? What does the caller lose otherwise?",
            answer:
              "If the service subscribes internally and returns `void`, the caller can't cancel it, know when it finished or failed, combine it with other streams, retry it, or choose the execution operator (`switchMap` vs `concatMap`). Returning the cold Observable defers all those decisions to the caller, who has the component context. The service *describes* the work; the component decides *when and how* to run it.",
          },
        ],
      },
      {
        id: "angular-services-di",
        number: 4,
        numLabel: "4c",
        title: "Angular — Services, Dependency Injection & State",
        questions: [
          {
            q: "What is a service, and why move logic out of components? Make the testability and reuse argument.",
            answer:
              "A service is an injectable class holding logic/state that isn't about rendering — data access, business rules, cross-component state. Moving it out of components means: it's **reusable** (many components inject the same instance), **testable** (unit-test the class with fake deps, no `TestBed`/DOM), and components stay thin (just bind + delegate). It also gives one place to cache, log, and coordinate.",
          },
          {
            q: "`providedIn: 'root'` vs a component's `providers` array vs `providedIn: 'platform'` / `'any'` — how many instances and what scope does each give you?",
            answer:
              "- `providedIn: 'root'` — one app-wide singleton, tree-shakable.\n- Component `providers: [X]` — a new instance per component instance (and its subtree); destroyed with the component. Good for per-widget state.\n- `providedIn: 'platform'` — one instance shared across multiple Angular apps on the same page (rare).\n- `providedIn: 'any'` — a new instance per lazy-loaded injector, one shared for the eager app (mostly legacy; usually you want `'root'`).",
          },
          {
            q: "What are tree-shakable providers, and how does `providedIn` let the build drop an unused service?",
            answer:
              "With `@Injectable({ providedIn: 'root' })`, the provider lives *on the service class itself*, not in a module's `providers` array. If nothing injects the service, nothing references the class, so the bundler can tree-shake it entirely. Listing it in `NgModule.providers` instead creates a hard reference from the module, so it ships whether used or not.",
          },
          {
            q: "Explain the hierarchical injector tree — element injector vs environment injector. How does a component-level provider create a fresh instance for that subtree?",
            answer:
              "Angular has two parallel trees: **environment injectors** (root, lazy-route, `bootstrapApplication` providers) and **element injectors** (one per component/directive host element). Resolution walks up the element injectors, then into the environment injectors. When a component lists a provider in its `providers`, that provider lives on its element injector, so the component and every descendant resolve *that* instance — a fresh one, distinct from any ancestor's.",
          },
          {
            q: "What is an `InjectionToken`, and why do you need one for non-class dependencies (config objects, strings, primitives)?",
            answer:
              "DI keys are runtime values. A class can be its own key, but an interface/string/object can't (interfaces are erased, strings collide). `new InjectionToken<AppConfig>('app.config')` creates a unique typed key you provide with `useValue`/`useFactory` and inject with `inject(APP_CONFIG)`. It also supports a `factory` for a tree-shakable default.",
          },
          {
            q: "`useClass`, `useValue`, `useExisting`, `useFactory` — what does each provider recipe do? Give a real use case for `useFactory` with `deps`.",
            answer:
              "- `useClass: Impl` — instantiate this class for the token (swap implementations).\n- `useValue: obj` — provide a ready object/primitive (config, a mock).\n- `useExisting: OtherToken` — alias; both tokens resolve to the same instance.\n- `useFactory: (dep) => ..., deps: [Dep]` — compute the instance, with injected dependencies.\n\n`useFactory` use case: build a logger whose level comes from injected `APP_CONFIG`, or pick `RealPaymentGateway` vs `SandboxGateway` based on an env flag.",
          },
          {
            q: "What is a multi-provider (`multi: true`)? Name two Angular features built on it (`HTTP_INTERCEPTORS`, `NG_VALIDATORS`, `APP_INITIALIZER`).",
            answer:
              "`multi: true` lets many providers register under one token; injecting it yields an **array** of all of them. Angular uses it for `HTTP_INTERCEPTORS` (the interceptor chain), `NG_VALIDATORS` / `NG_ASYNC_VALIDATORS` (directive validators), `APP_INITIALIZER` (startup tasks), and route `Routes`. You use it to let feature code contribute to a list the framework consumes.",
          },
          {
            q: "The `inject()` function vs constructor injection — what can `inject()` do that a constructor can't, and where is it legal to call it?",
            answer:
              "`inject(Token)` works in **field initializers, the constructor, factory functions, and `runInInjectionContext`** — not in arbitrary methods or callbacks. It enables DI in places without a constructor: functional route guards/resolvers, functional interceptors, `@Injectable` factory functions, and helper functions. It also composes better than long constructor parameter lists and works with inheritance without re-declaring `super(...)` params.",
          },
          {
            q: "What is an injection context, and why does calling `inject()` outside a constructor / factory / `runInInjectionContext` throw?",
            answer:
              "The injection context is the window during which Angular knows *which* injector is 'current' — while constructing a class, running a DI factory, or inside `runInInjectionContext(injector, fn)`. `inject()` reads that ambient injector. Called later (in a method, a `setTimeout`, an event handler) there's no current injector, so it throws `NG0203`. Fix: call `inject()` in a field initializer/constructor and store the result, or wrap the later code in `runInInjectionContext`.",
          },
          {
            q: "`@Optional()`, `@Self()`, `@SkipSelf()`, `@Host()` — what does each resolution modifier change?",
            answer:
              "- `@Optional()` — return `null` instead of throwing if no provider is found.\n- `@Self()` — only look at this element's own injector, don't walk up.\n- `@SkipSelf()` — skip this element's injector, start at the parent (e.g. a service that wants its parent-scoped counterpart).\n- `@Host()` — stop searching at the host component boundary (used with content projection).",
          },
          {
            q: "What is the \"captive dependency\" problem (a singleton holding something shorter-lived), and how does it show up in Angular?",
            answer:
              "A longer-lived provider injects and holds a reference to a shorter-lived one, keeping it alive past its intended scope. In Angular it's less about lifetimes (no per-request scope like ASP.NET) and more about a `'root'` singleton capturing a component-provided instance, or holding a `DestroyRef`/`ElementRef` from one component forever. Symptom: stale data or a leaked component. Fix: don't inject narrower-scoped things into wider-scoped services; pass them per call instead.",
          },
          {
            q: "How do you provide a different service implementation for dev vs prod using a token + factory + environment?",
            answer:
              "```ts\nexport const ANALYTICS = new InjectionToken<Analytics>('analytics');\n// bootstrap providers:\n{ provide: ANALYTICS,\n  useFactory: () => environment.production ? new RealAnalytics() : new NoopAnalytics() }\n```\nOr `useClass: environment.production ? RealAnalytics : NoopAnalytics`. Consumers `inject(ANALYTICS)` and don't know or care which they got.",
          },
          {
            q: "`APP_INITIALIZER` — how do you load runtime config from an API before the app bootstraps?",
            answer:
              "```ts\nprovideAppInitializer(() => {\n  const http = inject(HttpClient), cfg = inject(ConfigService);\n  return firstValueFrom(http.get<AppConfig>('/config').pipe(tap(c => cfg.set(c))));\n})\n```\n(Or the classic `{ provide: APP_INITIALIZER, useFactory, deps, multi: true }`.) Angular waits for the returned promise/observable to resolve before rendering the app, so `ConfigService` is populated everywhere from the first render.",
          },
          {
            q: "How do you share state between two unrelated sibling components with a service — `BehaviorSubject` plus an exposed Observable and setter methods?",
            answer:
              "```ts\n@Injectable({ providedIn: 'root' })\nexport class FilterService {\n  private state$ = new BehaviorSubject<Filter>({ q: '', status: 'all' });\n  readonly filter$ = this.state$.asObservable();\n  patch(p: Partial<Filter>) { this.state$.next({ ...this.state$.value, ...p }); }\n}\n```\nComponent A calls `patch({ q })`; component B binds `filter$ | async`. Exposing only the Observable + methods keeps mutations centralized.",
          },
          {
            q: "Build a minimal store service: a private `BehaviorSubject<State>`, selectors via `map` + `distinctUntilChanged`, and immutable updates.",
            answer:
              "```ts\n@Injectable({ providedIn: 'root' })\nexport class CartStore {\n  private state$ = new BehaviorSubject<CartState>({ items: [], loading: false });\n  readonly items$ = this.select(s => s.items);\n  readonly count$ = this.select(s => s.items.length);\n  private select<T>(fn: (s: CartState) => T) {\n    return this.state$.pipe(map(fn), distinctUntilChanged());\n  }\n  private patch(p: Partial<CartState>) { this.state$.next({ ...this.state$.value, ...p }); }\n  add(item: Item) { this.patch({ items: [...this.state$.value.items, item] }); }\n}\n```\n`distinctUntilChanged` stops selectors re-emitting when an unrelated slice changes.",
          },
          {
            q: "Service-with-a-Subject vs NgRx vs `signalStore` — what does each solve, and when is NgRx overkill?",
            answer:
              "- **Service + Subject/signals** — minimal, no deps; perfect for most apps.\n- **NgRx** — strict unidirectional flow, devtools/time-travel, effect isolation, serializable actions; worth it for large apps with complex cross-cutting state and many contributors.\n- **`@ngrx/signals` signalStore** — NgRx structure with signal ergonomics and far less boilerplate; a strong default when you want structure.\n\nNgRx is overkill for a small/medium app or mostly-local state — the ceremony outweighs the traceability benefit.",
          },
          {
            q: "NgRx: what problem do actions, reducers, selectors, and effects each solve, and where does the HTTP call live?",
            answer:
              "- **Action** — a serializable record of 'what happened' (`[Cart] Add Item`). Decouples the trigger from the handling.\n- **Reducer** — a pure `(state, action) => state`; the single place state mutates, so it's replayable/testable.\n- **Selector** — a memoized, composable read of a state slice.\n- **Effect** — listens for actions, performs side effects (the **HTTP call lives here**), and dispatches a success/failure action. Keeps async and I/O out of reducers.",
          },
          {
            q: "What is a memoized selector (`createSelector`), and why does it matter for `OnPush` performance?",
            answer:
              "`createSelector(inputSelectors, projector)` caches its result and only recomputes when one of its input selectors' outputs changes (by reference). So a component subscribed via the store gets a **stable reference** when its slice didn't change — which means `OnPush` components don't re-render, and derived computations (filtering, totals) run once, not every dispatch.",
          },
          {
            q: "Signal-based state: `signal()`, `computed()`, `effect()`, `set()` / `update()` — build a small cart or counter store with them.",
            answer:
              "```ts\n@Injectable({ providedIn: 'root' })\nexport class CartStore {\n  private _items = signal<Item[]>([]);\n  readonly items = this._items.asReadonly();\n  readonly count = computed(() => this._items().length);\n  readonly total = computed(() => this._items().reduce((s, i) => s + i.price, 0));\n  add(i: Item) { this._items.update(list => [...list, i]); }\n  remove(id: string) { this._items.update(list => list.filter(x => x.id !== id)); }\n}\n```\n`set` replaces the value; `update` derives from the previous; `computed` memoizes; components read `store.count()` directly in the template.",
          },
          {
            q: "When does an `effect()` run, why should you avoid writing signals inside one, and what is `allowSignalWrites`?",
            answer:
              "An `effect()` runs once after creation, then again (in the next microtask, batched) whenever any signal it *read* changes. It's for side effects — logging, `localStorage`, DOM interop — not for deriving state (use `computed`). Writing a signal inside an effect can cause feedback loops and is blocked by default; `effect(fn, { allowSignalWrites: true })` opts out, but usually a `computed` or restructuring is the right fix.",
          },
          {
            q: "How do you keep a service a true singleton across a lazy-loaded feature without accidentally creating a second instance?",
            answer:
              "Use `@Injectable({ providedIn: 'root' })` and **do not** also list it in the lazy feature's `providers`. Listing it in a lazy route's providers (or a lazy `NgModule.providers`) creates a second instance in that lazy injector. If it must be lazy-only, provide it once at the feature's top route, not per component.",
          },
          {
            q: "How do you unit-test a service that depends on `HttpClient` using `provideHttpClientTesting` / `HttpClientTestingModule` and `HttpTestingController`?",
            answer:
              "```ts\nbeforeEach(() => TestBed.configureTestingModule({\n  providers: [TxnService, provideHttpClient(), provideHttpClientTesting()],\n}));\nit('GETs the list', () => {\n  const svc = TestBed.inject(TxnService);\n  const http = TestBed.inject(HttpTestingController);\n  let result: Txn[] | undefined;\n  svc.list().subscribe(r => (result = r));\n  http.expectOne('/api/txns').flush([{ id: 1 }]);\n  expect(result!.length).toBe(1);\n  http.verify();   // no outstanding requests\n});\n```",
          },
          {
            q: "How do you mock a service's dependency in `TestBed` with a provider override (`{ provide: X, useValue: spy }`)?",
            answer:
              "```ts\nconst api = jasmine.createSpyObj<Api>('Api', ['save']);\napi.save.and.returnValue(of({ ok: true }));\nTestBed.configureTestingModule({\n  providers: [PaymentService, { provide: Api, useValue: api }],\n});\nconst svc = TestBed.inject(PaymentService);\n```\nThe override replaces the real `Api` everywhere it's injected within this test module, so `PaymentService` gets the spy and you assert on `api.save.calls`.",
          },
          {
            q: "What's the risk of storing a mutable object in a service and handing the same reference to several components, and how do immutability + `OnPush` fix it?",
            answer:
              "If component A mutates the shared object in place, component B sees the change with no notification, `OnPush` components miss it (no reference change), and it's hard to trace who changed what. Fix: the service owns the state and only ever emits **new** references (`{ ...state, x }`), components treat received data as read-only, and `OnPush` reliably re-renders on the new reference.",
          },
          {
            q: "How would you cache API responses in a service (in-memory `Map`, `shareReplay`, or a TTL cache) and invalidate on a mutation?",
            answer:
              "```ts\nprivate cache = new Map<string, Observable<Txn>>();\nget(id: string) {\n  if (!this.cache.has(id)) {\n    this.cache.set(id, this.http.get<Txn>(`/txns/${id}`).pipe(shareReplay(1)));\n  }\n  return this.cache.get(id)!;\n}\nupdate(id: string, dto: Dto) {\n  return this.http.put(`/txns/${id}`, dto).pipe(tap(() => this.cache.delete(id)));\n}\n```\n`shareReplay(1)` shares one request; delete the key (or clear the map) on any write. For freshness, store `{ obs, at }` and treat entries older than a TTL as misses.",
          },
          {
            q: "Where should cross-cutting concerns live — an interceptor, a service, or a base class — for auth-token attach, logging, and error toasts?",
            answer:
              "- **HTTP-level concerns → interceptor:** attaching the auth token, request/response logging, retry, global 401/5xx → toast. It's automatic and centralised, and has request context.\n- **App logic reused across components → a service** injected where needed (a `NotificationService`, a `ConfigService`).\n- **Base classes → avoid;** prefer composition (inject a service) over inheritance, which couples components to a hierarchy and complicates testing.",
          },
        ],
      },
      {
        id: "angular-components-basics",
        number: 4,
        numLabel: "4d",
        title: "Angular — Components, Templates & Data Binding (Basics)",
        questions: [
          {
            q: "Which parts of the `@Component` decorator do you actually use (`selector`, `template`/`templateUrl`, `styles`, `changeDetection`, `standalone`, `imports`, `providers`, `host`)?",
            answer:
              "- `selector` — the element name.\n- `template` / `templateUrl` + `styles` / `styleUrls` — the view.\n- `changeDetection: OnPush` — near-mandatory for perf.\n- `imports: [...]` — for standalone components, the components/directives/pipes this template uses.\n- `providers` — DI instances scoped to this component's subtree.\n- `host: { '[class.x]': ..., '(click)': ... }` — host element bindings.\n- `standalone` — now the default (true), so you rarely write it.\n- `encapsulation`, `animations`, `viewProviders` occasionally.",
          },
          {
            q: "Interpolation `{{ }}` vs property binding `[prop]` vs attribute binding `[attr.x]` — when must you use `[attr.]` (e.g., `colspan`, ARIA attributes)?",
            answer:
              "`{{ }}` and `[prop]` bind to a DOM **property** of the element/component. `[attr.x]` binds to an HTML **attribute**. Use `[attr.]` when there's no matching property: `colspan`/`rowspan`, `aria-*`, `role`, SVG attributes, `data-*`, and setting `null` to remove an attribute entirely. Rule: property when one exists (`[value]`, `[disabled]`, `[src]`), `[attr.]` otherwise.",
          },
          {
            q: "Event binding `(click)` and `$event` — how do you get a typed DOM event, and what is `$event` for a custom `@Output`?",
            answer:
              "For a DOM event, `$event` is the native `Event`; type it in the handler (`onClick(e: MouseEvent)`) or cast `$event.target as HTMLInputElement`. For a custom `@Output`, `$event` is **the value you passed to `emit()`** — e.g. `@Output() saved = new EventEmitter<Txn>()` → `(saved)=\"onSaved($event)\"` gives you a `Txn`.",
          },
          {
            q: "Two-way binding `[(ngModel)]` — what two bindings does the \"banana in a box\" desugar to, and how do you make your own two-way-bindable `x` / `xChange` pair?",
            answer:
              "`[(x)]=\"y\"` desugars to `[x]=\"y\" (xChange)=\"y = $event\"`. So expose an `@Input() x` and an `@Output() xChange = new EventEmitter<T>()`, and call `this.xChange.emit(newVal)` when it changes. With signals, `x = model<T>()` gives you two-way binding in one declaration.",
          },
          {
            q: "`@Input()` — aliasing, required inputs, input setters vs `ngOnChanges`, and the new signal `input()` API.",
            answer:
              "- Aliasing: `@Input('data') items` (external name vs field).\n- Required: `@Input({ required: true }) id!: string` — build error if the parent omits it.\n- **Setter** `@Input() set value(v) { ... }` reacts to one input; **`ngOnChanges`** sees all inputs together with previous/current values — use it for cross-input logic.\n- Signal API: `id = input.required<string>()`, `count = input(0)`; read as `this.id()`, derive with `computed()`, no `ngOnChanges` needed.",
          },
          {
            q: "`@Output()` and `EventEmitter` — why is `EventEmitter` essentially a `Subject`, and should you ever `.subscribe()` to your own output inside the component?",
            answer:
              "`EventEmitter` extends RxJS `Subject` — `emit()` is `next()`. Angular subscribes to it to wire `(output)` bindings. Don't `.subscribe()` to your own output internally; if you need to react to something, react to the source that triggered the emit. Also don't use `EventEmitter` for non-output service events — use a plain `Subject`.",
          },
          {
            q: "`input()`, `output()`, `model()` signal APIs (Angular 17.1+) — how do they differ from the decorators?",
            answer:
              "`input()` returns a **read-only signal** (`this.name()`), supports `input.required()` and a `transform`, and integrates with `computed`/`effect` instead of `ngOnChanges`. `output()` is a lighter `EventEmitter` replacement (`this.saved.emit(x)`), not a Subject. `model()` is a writable signal that's two-way bindable (`[(value)]`), emitting `valueChange` automatically. They're type-safe and don't need decorator metadata.",
          },
          {
            q: "The new control flow `@if` / `@else`, `@for` (with mandatory `track`), `@switch`, `@defer` — how do they compare to `*ngIf` / `*ngFor` / `*ngSwitch`?",
            answer:
              "Built into the template compiler (no directive import), faster, and better-typed (narrowing in `@if`). `@for` **requires** `track` (forcing the perf-critical decision), adds `@empty`, and has faster diffing than `*ngFor`. `@defer` has no structural-directive equivalent — it lazy-loads a block on a trigger with `@placeholder`/`@loading`/`@error`. The `*` directives still work; new code uses the block syntax.",
          },
          {
            q: "Why is `trackBy` (or `@for` `track`) important for a list that re-renders, and what concretely goes wrong without it?",
            answer:
              "Without a track key, Angular identifies list items by object identity. If the array is replaced (new references from an API refresh or immutable update), every item looks new: Angular destroys and recreates **every** DOM node and component, losing focus, scroll position, input state, and animations, and thrashing CD. `track item.id` lets it match items by id and only touch what actually changed.",
          },
          {
            q: "`*ngIf` with `; else tpl` and an `as` local variable — how does it help you avoid repeated evaluation / multiple subscriptions?",
            answer:
              "`*ngIf=\"data$ | async as data; else loading\"` subscribes to `data$` **once**, binds the emitted value to `data` for the whole block, and shows `#loading` while it's null. Without `as`, you'd write `data$ | async` several times — each is a separate subscription (and re-fetch for a cold HTTP source) and each re-evaluates the pipe.",
          },
          {
            q: "`ng-template`, `ng-container`, `ng-content` — what is each for, and why does `ng-container` need to exist?",
            answer:
              "- `<ng-template>` — an inert template fragment, rendered only when something stamps it (`*ngIf` else, `ngTemplateOutlet`, structural directives).\n- `<ng-container>` — a logical grouping element that renders **no DOM node**; use it to apply a structural directive or group siblings without adding a wrapper `<div>` (which would break flex/grid/table layouts).\n- `<ng-content>` — the projection slot for parent-supplied content.",
          },
          {
            q: "Content projection — single-slot `<ng-content>`, multi-slot with `select`, and `@ContentChild`. Whose change detection and lifecycle owns projected content?",
            answer:
              "The **parent** that wrote the projected markup owns its bindings, change detection, and lifecycle — the child component just provides a slot. Single slot: one bare `<ng-content>`. Multi-slot: `<ng-content select=\"[header]\">`, `<ng-content select=\"app-actions\">`, plus a catch-all. `@ContentChild(X)` queries a projected element/component/directive, available in `ngAfterContentInit`.",
          },
          {
            q: "`@ViewChild` vs `@ContentChild` — the difference, when each is available (`static: true` vs `false`), and how the signal `viewChild()` query changes this.",
            answer:
              "`@ViewChild` queries your **own template**; `@ContentChild` queries **projected** content. `@ViewChild` is ready in `ngAfterViewInit` (or `ngOnInit` with `static: true`, only for unconditional targets); `@ContentChild` in `ngAfterContentInit`. Signal queries — `viewChild()` / `viewChild.required()` / `contentChild()` — return a signal you read anytime after view init, no lifecycle-hook timing to remember, and they update reactively.",
          },
          {
            q: "Template reference variables (`#ref`) — what do they point to for a plain element vs a component vs a directive with `exportAs`?",
            answer:
              "- Plain element: the native DOM element (`#box` → `HTMLDivElement`).\n- Component: that component's instance (`#child` → the component class).\n- `#f=\"ngForm\"` / `#t=\"matTooltip\"`: assigning `=\"exportAsName\"` gives you the directive instance that declared `exportAs`.\n\nUse them in the template (`{{ box.offsetWidth }}`) or query with `@ViewChild('box')`.",
          },
          {
            q: "List the lifecycle hooks in execution order and say which run once vs on every change-detection cycle.",
            answer:
              "`ngOnChanges` (on every bound-input change) → `ngOnInit` (once) → `ngDoCheck` (every CD) → `ngAfterContentInit` (once) → `ngAfterContentChecked` (every CD) → `ngAfterViewInit` (once) → `ngAfterViewChecked` (every CD) → `ngOnDestroy` (once). The `Checked`/`DoCheck` hooks fire every cycle — keep them cheap.",
          },
          {
            q: "Why does reading a `@ViewChild` in `ngOnInit` sometimes give `undefined`, and where should you read it instead?",
            answer:
              "By default (`static: false`) view queries resolve **after** the first change detection, so in `ngOnInit` they're still `undefined` — especially for elements behind `*ngIf`/`@if`. Read them in `ngAfterViewInit`. Use `{ static: true }` only for elements that always exist and that you need earlier. Signal `viewChild()` sidesteps this — read it once the view is initialised.",
          },
          {
            q: "What is `ExpressionChangedAfterItHasBeenCheckedError`, what causes it, and how do you fix it properly (not with `setTimeout`)?",
            answer:
              "In dev mode Angular runs CD twice and errors if a bound value changed between the two passes — meaning something mutated state *during* rendering (a child emitting to a parent in `ngAfterViewInit`, a getter with side effects, a parent reading a value the child just changed). Fix the cause: move the write earlier (`ngOnInit`), make it a pure `computed`/derived value, use `markForCheck()` after an intentional async update, or restructure so the parent doesn't depend on a value produced mid-render. `setTimeout` just hides it.",
          },
          {
            q: "`@HostBinding` / `@HostListener` and the `host` object — build a directive that toggles a class on click.",
            answer:
              "```ts\n@Directive({ selector: '[appToggleActive]', standalone: true })\nexport class ToggleActiveDirective {\n  @HostBinding('class.active') active = false;\n  @HostListener('click') toggle() { this.active = !this.active; }\n}\n```\nEquivalent via the decorator `host` object: `host: { '[class.active]': 'active', '(click)': 'toggle()' }`. `@HostBinding` binds a property/class/attr on the host element; `@HostListener` subscribes to a host (or `window`/`document`) event.",
          },
          {
            q: "`ngClass` vs `[class.x]` vs `ngStyle` vs `[style.x]` — which is most efficient, and which do you use for a single toggle?",
            answer:
              "`[class.active]=\"isActive\"` and `[style.width.px]=\"w\"` are the most efficient — direct, single-token bindings. `ngClass`/`ngStyle` take an object/array and diff it each CD cycle, which is fine for a dynamic *set* of classes but overkill for one toggle. Use `[class.x]` / `[style.x]` for one or two known toggles; `ngClass` when the class set is genuinely dynamic.",
          },
          {
            q: "View encapsulation: `Emulated` vs `ShadowDom` vs `None` — what does `Emulated` actually do with those attribute selectors?",
            answer:
              "- **Emulated** (default) — Angular adds a unique attribute (`_ngcontent-abc`) to the component's elements and rewrites each CSS selector to include `[_ngcontent-abc]`, so styles are scoped without real Shadow DOM. `:host` becomes `[_nghost-abc]`.\n- **ShadowDom** — real browser Shadow DOM; true isolation, but global styles don't leak in and `::ng-deep` won't work.\n- **None** — styles are injected globally, no scoping — leaks everywhere.",
          },
          {
            q: "`:host`, `:host-context()`, and `::ng-deep` (deprecated) — when do you need each, and what is the modern alternative to `::ng-deep`?",
            answer:
              "- `:host` — style the component's own host element.\n- `:host-context(.dark)` — style the host based on an ancestor's class (theming).\n- `::ng-deep` — pierce encapsulation to style a child component's internals; deprecated.\n\nModern alternatives: expose CSS custom properties the child consumes (`--btn-bg`), use `ViewEncapsulation.None` on a dedicated styling component, put the override in a global stylesheet, or use the child's documented `class`/`style` inputs.",
          },
          {
            q: "Standalone components vs NgModules — what changed, what is `bootstrapApplication`, and how do you lazy-load a standalone component?",
            answer:
              "Standalone components declare `imports` themselves — no `@NgModule` needed. `bootstrapApplication(AppComponent, { providers: [provideRouter(routes), provideHttpClient()] })` replaces `AppModule` + `platformBrowserDynamic().bootstrapModule`. Lazy-load with `loadComponent: () => import('./x/x.component').then(m => m.XComponent)` in a route, or `loadChildren` returning a standalone routes array.",
          },
          {
            q: "How do you create a component dynamically and pass it data (`ViewContainerRef.createComponent`, setting inputs, `NgComponentOutlet`)?",
            answer:
              "```ts\nconst ref = this.vcr.createComponent(ChartComponent);\nref.setInput('data', series);         // typed input setter (Angular 14.1+)\nref.instance.title = 'Q3';\nref.changeDetectorRef.detectChanges();\n// destroy: ref.destroy();\n```\nOr declaratively: `<ng-container *ngComponentOutlet=\"cmp; inputs: { data: series }\">`. Use dynamic creation for plugin-style UIs, modal hosts, and dashboards.",
          },
          {
            q: "Smart (container) vs dumb (presentational) components — what belongs in each, and how does the split help `OnPush` and testing?",
            answer:
              "**Smart/container** — injects services, fetches data, holds state, handles events, no styling. **Dumb/presentational** — only `@Input`s in, `@Output`s out, pure rendering, no service deps. The dumb component is trivially `OnPush` (inputs are immutable), trivially testable (set inputs, read DOM, spy outputs — no `HttpTestingController`), and reusable. The smart component's tests focus on orchestration with mocked services.",
          },
          {
            q: "How do you localize template text — the `i18n` attribute + `@angular/localize` vs a runtime translation library — and the trade-offs?",
            answer:
              "**Built-in (`i18n` + `@angular/localize`):** mark text, extract to XLIFF, translate, build one bundle per locale. Zero runtime cost, compile-time checks, but a separate deploy per locale and no in-app language switch without reload. **Runtime libs (Transloco, `@ngx-translate`):** load JSON at runtime, switch language live, simpler ops — at the cost of a runtime dependency, no compile-time key checking, and a small perf hit. Public multi-locale sites → built-in; apps needing a live switcher → runtime.",
          },
          {
            q: "Walk through unit-testing a component: `configureTestingModule`, `createComponent`, `detectChanges()`, querying with `By.css`, triggering events, asserting output.",
            answer:
              "```ts\nawait TestBed.configureTestingModule({\n  imports: [TxnRowComponent],\n  providers: [{ provide: Api, useValue: apiSpy }],\n}).compileComponents();\nconst f = TestBed.createComponent(TxnRowComponent);\nf.componentInstance.txn = { id: 1, amount: 100 };\nf.detectChanges();                                   // run bindings\nexpect(f.debugElement.query(By.css('.amount')).nativeElement.textContent).toContain('100');\nconst spy = jasmine.createSpy();\nf.componentInstance.selected.subscribe(spy);\nf.debugElement.query(By.css('button')).triggerEventHandler('click');\nexpect(spy).toHaveBeenCalledWith(1);\n```",
          },
        ],
      },
      {
        id: "angular-directives-pipes",
        number: 4,
        numLabel: "4e",
        title: "Angular — Directives, Pipes & Rendering",
        questions: [
          {
            q: "Attribute directive vs structural directive — what is the `*` sugar actually doing with `<ng-template>`?",
            answer:
              "**Attribute directive** — no `*`, attaches to an existing element and changes its look/behaviour (`[ngClass]`, `[cdkDrag]`). **Structural directive** — the `*` prefix — adds/removes DOM. `<div *ngIf=\"x\">` desugars to `<ng-template [ngIf]=\"x\"><div>...</div></ng-template>`; the directive gets a `TemplateRef` (the wrapped content) and a `ViewContainerRef` (where to stamp it) and decides whether/how many times to render it.",
          },
          {
            q: "Build a custom attribute directive (`appHighlight`) with `ElementRef` + `Renderer2` + `@HostListener`. Why prefer `Renderer2` over touching `nativeElement` directly?",
            answer:
              "```ts\n@Directive({ selector: '[appHighlight]', standalone: true })\nexport class HighlightDirective {\n  @Input('appHighlight') color = 'yellow';\n  constructor(private el: ElementRef, private r: Renderer2) {}\n  @HostListener('mouseenter') enter() { this.r.setStyle(this.el.nativeElement, 'background', this.color); }\n  @HostListener('mouseleave') leave() { this.r.removeStyle(this.el.nativeElement, 'background'); }\n}\n```\nPrefer `Renderer2` because it works in **non-DOM environments** (SSR, web workers), it's the sanctioned abstraction (future-proof), and it keeps you from bypassing Angular's security by directly assigning `innerHTML`/attributes.",
          },
          {
            q: "Build a custom structural directive (`*appDelay=\"500\"`) using `TemplateRef` + `ViewContainerRef`.",
            answer:
              "```ts\n@Directive({ selector: '[appDelay]', standalone: true })\nexport class DelayDirective implements OnDestroy {\n  private t?: ReturnType<typeof setTimeout>;\n  constructor(private tpl: TemplateRef<unknown>, private vc: ViewContainerRef) {}\n  @Input() set appDelay(ms: number) {\n    this.vc.clear(); clearTimeout(this.t);\n    this.t = setTimeout(() => this.vc.createEmbeddedView(this.tpl), ms);\n  }\n  ngOnDestroy() { clearTimeout(this.t); }\n}\n// <p *appDelay=\"500\">appears after 500ms</p>\n```",
          },
          {
            q: "How do you pass multiple inputs into a structural directive via microsyntax (`*appIf=\"cond as value; else tpl\"`)?",
            answer:
              "Microsyntax keys map to `@Input`s named `<directive><Key>` (camel-cased). `*appIf=\"user$ | async as user; else loading\"` binds `appIf` to the expression, exposes `user` as a local, and `appIfElse` to the `#loading` `TemplateRef`. In the directive you declare `@Input() set appIf(...)`, `@Input() set appIfElse(tpl: TemplateRef<any>)`, and pass a typed context object to `createEmbeddedView(tpl, { $implicit: value })` so `as` works.",
          },
          {
            q: "Pure vs impure pipes — when does a pure pipe re-run, and why is an impure pipe a performance risk?",
            answer:
              "A **pure** pipe (default) re-runs only when its input's *reference* (or a primitive value) changes — Angular caches the last result otherwise. An **impure** pipe (`pure: false`) runs on **every change-detection cycle**, for every use, regardless of inputs. That's fine for `AsyncPipe` (cheap), but a custom impure filter/sort pipe over a big array runs its full cost dozens of times per second.",
          },
          {
            q: "Build a custom pipe (`timeAgo`, `mask`, or `initials`) and show how you pass arguments to it.",
            answer:
              "```ts\n@Pipe({ name: 'mask', standalone: true })\nexport class MaskPipe implements PipeTransform {\n  transform(value: string, visible = 4, char = '•'): string {\n    if (!value) return '';\n    const tail = value.slice(-visible);\n    return char.repeat(Math.max(0, value.length - visible)) + tail;\n  }\n}\n// {{ account.number | mask:4:'X' }}   -> XXXXXXXX1234\n```\nArguments after the value are passed with `:` in the template and become the extra `transform` parameters.",
          },
          {
            q: "Why should you not filter or sort a large array inside a template pipe or a getter? Where should that work go instead?",
            answer:
              "A template getter or an impure pipe runs on every CD cycle — filtering/sorting 10k rows becomes O(n log n) work many times a second, and a pure pipe still needs a new array reference each time you change the query, which then defeats `trackBy`. Do the transform in the component in response to the actual inputs — a `computed()` signal, or a `valueChanges`-driven `combineLatest` — and bind the template to the precomputed result.",
          },
          {
            q: "`async`, `date`, `currency`, `number`, `percent`, `keyvalue`, `slice`, `json` pipes — which do you use, and what's the locale gotcha (`registerLocaleData`)?",
            answer:
              "Daily: `async` (unwrap Observables/Promises), `date`, `currency`, `number`, `percent` (locale-aware formatting), `slice` (paginate/truncate in the template), `keyvalue` (iterate an object with `@for`), `json` (debugging). Gotcha: the number/date/currency pipes need the locale's data loaded — outside `en-US` you must `registerLocaleData(localeHi)` and provide `LOCALE_ID`, or formatting silently falls back to `en-US` grouping and symbols.",
          },
          {
            q: "How does `CurrencyPipe` / `DecimalPipe` formatting interact with a fintech need for exact decimals and Indian digit grouping (lakh/crore)?",
            answer:
              "The pipes are **display only** — never do money math on their output. Keep amounts as `number`/decimal-string minor units and format at render time. For Indian grouping (12,34,567) set `LOCALE_ID` to `'en-IN'` and `registerLocaleData(localeEnIn)`; then `{{ amt | currency:'INR':'symbol':'1.2-2' }}` gives `₹12,34,567.00`. The `'1.2-2'` digitsInfo pins exactly two fraction digits so nothing is rounded away visually.",
          },
          {
            q: "How do you build a directive that also implements `ControlValueAccessor` (e.g., an input-mask directive usable with `formControlName`)?",
            answer:
              "```ts\n@Directive({\n  selector: 'input[appPhoneMask]', standalone: true,\n  providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => PhoneMaskDirective) }],\n})\nexport class PhoneMaskDirective implements ControlValueAccessor {\n  private onChange = (_: string) => {}; private onTouched = () => {};\n  constructor(private el: ElementRef<HTMLInputElement>, private r: Renderer2) {}\n  @HostListener('input') onInput() {\n    const digits = this.el.nativeElement.value.replace(/\\D/g, '').slice(0, 10);\n    this.el.nativeElement.value = digits.replace(/(\\d{5})(\\d+)/, '$1 $2');\n    this.onChange(digits);          // store raw, display masked\n  }\n  @HostListener('blur') onBlur() { this.onTouched(); }\n  writeValue(v: string) { this.r.setProperty(this.el.nativeElement, 'value', v ?? ''); }\n  registerOnChange(fn: any) { this.onChange = fn; }\n  registerOnTouched(fn: any) { this.onTouched = fn; }\n  setDisabledState(d: boolean) { this.r.setProperty(this.el.nativeElement, 'disabled', d); }\n}\n```\nNow `<input appPhoneMask formControlName=\"phone\">` stores the raw value and displays the mask.",
          },
          {
            q: "What is `NgTemplateOutlet`, and when do you use it instead of content projection?",
            answer:
              "`<ng-container *ngTemplateOutlet=\"tpl; context: { $implicit: row }\">` renders a `TemplateRef` you pass around, with a context object. Use it over `<ng-content>` when the *parent* needs to customise **how** a repeated item renders (a table where the consumer supplies a cell template per column), when you need the same template in multiple spots, or when you must render a template conditionally/dynamically. `<ng-content>` is for a fixed slot of parent-supplied markup.",
          },
          {
            q: "How do you unit-test a directive — a host component in `TestBed`, or `DebugElement.injector.get(Directive)`?",
            answer:
              "Create a tiny host component that uses the directive, add both to `TestBed`, then assert on the rendered DOM or grab the instance:\n```ts\n@Component({ template: `<div appHighlight=\"red\">hi</div>` }) class Host {}\nconst f = TestBed.createComponent(Host);\nf.detectChanges();\nconst el = f.debugElement.query(By.directive(HighlightDirective));\nel.triggerEventHandler('mouseenter');\nexpect(el.nativeElement.style.background).toBe('red');\n// or: el.injector.get(HighlightDirective)\n```",
          },
          {
            q: "What triggers a directive's `ngOnChanges` vs `ngDoCheck`, and how do you react to input changes efficiently?",
            answer:
              "`ngOnChanges` fires when a **template-bound `@Input` reference** changes, with a `SimpleChanges` map (previous/current). `ngDoCheck` fires **every CD cycle** — use it only for custom deep-diffing (e.g. a mutated array input) with `KeyValueDiffers`/`IterableDiffers`. Efficient pattern: prefer immutable inputs + `ngOnChanges` (or an input *setter*), and avoid heavy work in `ngDoCheck`.",
          },
          {
            q: "Which `Renderer2` methods do you actually use (`addClass`, `setStyle`, `listen`, `setAttribute`), and why do they matter for SSR and security?",
            answer:
              "`addClass`/`removeClass`, `setStyle`/`removeStyle`, `setAttribute`/`removeAttribute`, `setProperty`, `listen(target, event, handler)`, `createElement`/`appendChild`. They matter because they're **platform-agnostic** — the server renderer implements them to produce HTML strings, and a web-worker renderer proxies them — so directives written with `Renderer2` work under SSR. Directly setting `nativeElement.innerHTML` also bypasses Angular's sanitizer, an XSS risk; `Renderer2` keeps you on the safe path.",
          },
          {
            q: "Build an IntersectionObserver-based \"lazy load image\" directive and clean it up in `ngOnDestroy`.",
            answer:
              "```ts\n@Directive({ selector: 'img[appLazySrc]', standalone: true })\nexport class LazySrcDirective implements OnInit, OnDestroy {\n  @Input('appLazySrc') src!: string;\n  private io?: IntersectionObserver;\n  constructor(private el: ElementRef<HTMLImageElement>, private zone: NgZone) {}\n  ngOnInit() {\n    this.io = new IntersectionObserver(([e]) => {\n      if (e.isIntersecting) { this.el.nativeElement.src = this.src; this.io?.disconnect(); }\n    });\n    this.zone.runOutsideAngular(() => this.io!.observe(this.el.nativeElement));\n  }\n  ngOnDestroy() { this.io?.disconnect(); }\n}\n```\n`disconnect()` in `ngOnDestroy` prevents the observer leaking after the element is gone.",
          },
          {
            q: "Dynamic component rendering with `NgComponentOutlet` vs `ViewContainerRef.createComponent` — trade-offs.",
            answer:
              "`*ngComponentOutlet=\"cmp; inputs: {...}; injector: inj\"` is **declarative**, template-driven, auto-destroyed with the host view — great for simple 'render this component type here' cases. `ViewContainerRef.createComponent()` is **imperative**: you get the `ComponentRef` for fine control (`setInput`, subscribe to outputs, `destroy()`, insert at an index, multiple instances) — needed for modal hosts, dashboards, drag-drop, and plugin systems.",
          },
        ],
      },
      {
        id: "angular-routing",
        number: 4,
        numLabel: "4f",
        title: "Angular — Routing",
        questions: [
          {
            q: "How do you configure routes (`provideRouter` / `RouterModule.forRoot`), and why is match order sensitive (`''`, `pathMatch: 'full'`, wildcard `**`)?",
            answer:
              "Standalone: `bootstrapApplication(App, { providers: [provideRouter(routes)] })`; NgModule: `RouterModule.forRoot(routes)`. The router matches **top-down, first match wins**, so order matters: a redirect from `''` needs `pathMatch: 'full'` (otherwise `''` prefix-matches every URL), specific routes come before parameterised ones, and the `**` wildcard (404) must be **last** or it swallows everything after it.",
          },
          {
            q: "`routerLink`, `routerLinkActive`, `[queryParams]`, `[state]`, and programmatic `Router.navigate` / `navigateByUrl` — when do you use each?",
            answer:
              "- `routerLink=\"/x\"` / `[routerLink]=\"['/x', id]\"` — declarative navigation in templates.\n- `routerLinkActive=\"active\"` — toggle a class when that link's route is active.\n- `[queryParams]` / `[state]` — attach query string / history state to a link.\n- `router.navigate(['/x', id], { queryParams, state })` — navigation from component logic (after a save, a guard redirect).\n- `router.navigateByUrl('/x?y=1')` — when you have a full URL string.",
          },
          {
            q: "Route params vs query params vs matrix params vs route `data` vs `state` — how do you read each?",
            answer:
              "- **Route param** (`/user/:id`) → `route.paramMap` / `snapshot.paramMap.get('id')`. Identifies the resource.\n- **Query param** (`?tab=2`) → `route.queryParamMap`. Optional, cross-cutting (filters, pagination).\n- **Matrix param** (`/list;sort=asc`) → `route.paramMap` on that segment. Rare.\n- **Route `data`** (static config in the route def) → `route.data`. Titles, roles, feature flags.\n- **`state`** (via `NavigationExtras`) → `router.getCurrentNavigation()?.extras.state` or `history.state`. Transient, not in the URL.",
          },
          {
            q: "Why read `paramMap` as an Observable instead of `snapshot.params`? What breaks with `snapshot` when navigating from `/user/1` to `/user/2`?",
            answer:
              "When you navigate between two instances of the same route, Angular **reuses the component** — `ngOnInit` doesn't run again, and `route.snapshot` still holds the *old* params. Subscribing to `route.paramMap` (usually piped through `switchMap` to re-fetch) gets the new `id` every time. Only use `snapshot` when the component can't be reached from another instance of the same route.",
          },
          {
            q: "Child routes, nested `<router-outlet>`, and named/secondary outlets — give a real use case for a named outlet.",
            answer:
              "A parent route with `children: [...]` renders them into a nested `<router-outlet>` in the parent's template (a settings shell with sub-tabs). A **named outlet** `<router-outlet name=\"detail\">` renders an independent route segment in parallel: e.g. a master list in the primary outlet and a slide-over detail panel in a `detail` outlet, navigated as `router.navigate([{ outlets: { detail: ['txn', id] } }])`, so the panel has its own URL and back-button behaviour.",
          },
          {
            q: "Lazy loading with `loadChildren` vs `loadComponent` (standalone) — how do you verify a chunk actually splits in the build output?",
            answer:
              "`loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)` lazy-loads a routes array; `loadComponent: () => import('./x/x.component').then(m => m.XComponent)` lazy-loads one standalone component. Verify: `ng build` prints a separate lazy chunk line per split; in the browser Network tab the `chunk-*.js` loads only when you navigate there. `source-map-explorer` shows what's in each chunk.",
          },
          {
            q: "Preloading strategies — `PreloadAllModules`, `NoPreloading`, and a custom strategy that preloads only routes flagged in `data`.",
            answer:
              "`provideRouter(routes, withPreloading(PreloadAllModules))` fetches every lazy chunk after the app is stable; `NoPreloading` (default) fetches on demand. Custom:\n```ts\n@Injectable({ providedIn: 'root' })\nexport class SelectivePreload implements PreloadingStrategy {\n  preload(route: Route, load: () => Observable<any>) {\n    return route.data?.['preload'] ? load() : of(null);\n  }\n}\n// route: { path: 'reports', loadComponent: ..., data: { preload: true } }\n```",
          },
          {
            q: "Guards: `CanActivate`, `CanActivateChild`, `CanDeactivate`, `CanMatch`, `Resolve` — a concrete use case for each, and why `CanMatch` beats `CanActivate` for auth-based route swapping.",
            answer:
              "- `CanActivate` — block entry to `/admin` without a role.\n- `CanActivateChild` — apply that check to every child of a section.\n- `CanDeactivate` — 'unsaved changes?' prompt on leave.\n- `CanMatch` — decide whether the route *definition* applies; use two routes for the same path (`loadComponent: AdminDash` with `canMatch: [isAdmin]`, else `loadComponent: UserDash`).\n- `Resolve` — pre-fetch the record before the detail page shows.\n\n`CanMatch` beats `CanActivate` for swapping because it runs *before* the lazy chunk loads and lets the router fall through to an alternative route, instead of just allowing/denying.",
          },
          {
            q: "Rewrite a class-based `CanActivate` guard as a functional `CanActivateFn` using `inject()`.",
            answer:
              "```ts\nexport const authGuard: CanActivateFn = (route, state) => {\n  const auth = inject(AuthService);\n  const router = inject(Router);\n  return auth.isLoggedIn()\n    ? true\n    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });\n};\n// route: { path: 'account', canActivate: [authGuard], ... }\n```\nFunctional guards are tree-shakable, need no `@Injectable` class, and compose (`canActivate: [authGuard, roleGuard('admin')]`).",
          },
          {
            q: "`Resolve` vs fetching in `ngOnInit` — pros (no empty flash, data ready) and cons (navigation blocked). How do you show a loading indicator during resolve (`router.events`)?",
            answer:
              "**Resolve pros:** the component renders once with data present; no null-checks/skeleton; you can redirect on error before the route shows. **Cons:** navigation is *blocked* until it resolves, so a slow API feels like a frozen app, and it's easy to over-fetch. Mitigate by driving a top loading bar off router events:\n```ts\nrouter.events.subscribe(e => {\n  if (e instanceof NavigationStart) this.loading = true;\n  if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) this.loading = false;\n});\n```",
          },
          {
            q: "How do you protect against losing unsaved form changes with a `CanDeactivate` guard bound to `component.form.dirty`?",
            answer:
              "```ts\nexport interface HasDirtyForm { form: { dirty: boolean }; }\nexport const unsavedChangesGuard: CanDeactivateFn<HasDirtyForm> = c =>\n  !c.form.dirty || confirm('You have unsaved changes. Leave anyway?');\n// route: { path: 'edit/:id', component: EditComponent, canDeactivate: [unsavedChangesGuard] }\n```\nAfter a successful save call `form.markAsPristine()` so the guard stops firing. Return a `Promise<boolean>` from a modal service for a non-blocking dialog.",
          },
          {
            q: "How do you pass data to a route without putting it in the URL (`NavigationExtras.state`) and read it back (`getCurrentNavigation()`)?",
            answer:
              "```ts\nthis.router.navigate(['/confirmation'], { state: { orderId, amount } });\n// in the target component's constructor / ngOnInit:\nconst st = this.router.getCurrentNavigation()?.extras.state ?? history.state;\n```\n`state` rides in the History API entry, so it survives a refresh via `history.state` but isn't shareable or bookmarkable. Good for one-shot handoffs (a just-created id, a wizard payload).",
          },
          {
            q: "Using router events (`NavigationStart` / `End` / `Cancel` / `Error`), build a global route-change loading bar.",
            answer:
              "```ts\n@Component({ selector: 'app-progress', template: `@if (loading()) { <div class=\"bar\"></div> }` })\nexport class ProgressBar {\n  loading = signal(false);\n  constructor(router: Router) {\n    router.events.pipe(takeUntilDestroyed()).subscribe(e => {\n      if (e instanceof NavigationStart) this.loading.set(true);\n      else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError)\n        this.loading.set(false);\n    });\n  }\n}\n```\nPut `<app-progress>` in the app shell above the outlet.",
          },
          {
            q: "Scroll position restoration and anchor scrolling — `withInMemoryScrolling` / `scrollPositionRestoration`.",
            answer:
              "`provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }))`. `scrollPositionRestoration: 'enabled'` restores scroll to the top on forward navigation and to the saved position on back/forward; `'top'` always scrolls to top. `anchorScrolling: 'enabled'` makes `[routerLink]` with `fragment=\"section-2\"` scroll to `id=\"section-2\"`. For lazy content you may still need a manual scroll after data loads.",
          },
          {
            q: "How do you unit-test a component that uses `ActivatedRoute` — a stub with a `paramMap` Observable, or `RouterTestingModule` / `provideRouter`?",
            answer:
              "For a focused unit test, provide a stub:\n```ts\nproviders: [{ provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '42' })) } }]\n```\nFor navigation behaviour (guards, `routerLink`, redirects), use `provideRouter([...])` (or `RouterTestingModule.withRoutes`) with real routes and assert on `Location`/`Router.url` after `router.navigate(...)` + `tick()`.",
          },
          {
            q: "How do you handle a 404 / unknown route and a \"redirect old URL to new URL\" requirement?",
            answer:
              "```ts\nconst routes: Routes = [\n  { path: 'old-reports', redirectTo: 'reports', pathMatch: 'full' },\n  { path: 'reports', loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent) },\n  { path: '404', component: NotFoundComponent },\n  { path: '**', redirectTo: '404' },   // must be last\n];\n```\nFor dynamic old→new mapping, use a `CanMatch` guard that looks up a redirect table and returns a `UrlTree`.",
          },
        ],
      },
      {
        id: "angular-http-interceptors",
        number: 4,
        numLabel: "4g",
        title: "Angular — HttpClient & Interceptors",
        questions: [
          {
            q: "`provideHttpClient()` / `HttpClientModule`, typed responses (`http.get<T>()`), and why the response is an Observable you must subscribe to (or `async`-pipe).",
            answer:
              "`provideHttpClient(withInterceptors([...]))` (standalone) or `HttpClientModule` (NgModule) registers `HttpClient`. `http.get<Txn[]>('/txns')` types the *body* — it's a compile-time cast, not runtime validation. The return is a **cold Observable**: no request is sent until you `subscribe()` or the `async` pipe does, and each subscribe re-sends. That laziness is what makes cancellation, retry, and `switchMap` composition possible.",
          },
          {
            q: "How do you send query params (`HttpParams`), headers (`HttpHeaders`), read the full response (`observe: 'response'`), or track progress (`reportProgress`)?",
            answer:
              "```ts\nhttp.get<Txn[]>('/txns', {\n  params: new HttpParams({ fromObject: { status: 'PENDING', page: '2' } }),\n  headers: new HttpHeaders({ 'X-Trace': id }),\n  observe: 'response',                 // HttpResponse<T> incl. status + headers\n});\nhttp.post('/upload', form, { reportProgress: true, observe: 'events' });\n```\n`HttpParams`/`HttpHeaders` are **immutable** — `.set()` returns a new instance. `observe: 'events'` streams `HttpEvent`s (Sent, UploadProgress, Response).",
          },
          {
            q: "Functional interceptors (`HttpInterceptorFn`, Angular 15+) vs class interceptors — how do you register each, and does order matter?",
            answer:
              "Functional: `provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))` — plain functions `(req, next) => next(req).pipe(...)`, using `inject()` inside. Class: `{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }`. **Order matters** — request handling runs in array/registration order outbound, response handling unwinds in reverse. Put the retry interceptor outside auth so retries re-attach a fresh token; put a logger before auth if it must not see the token.",
          },
          {
            q: "Write an auth interceptor that attaches a JWT and, on a 401, refreshes the token once and retries the original request. How do you stop a refresh stampede when five requests 401 at the same time?",
            answer:
              "```ts\nexport const authInterceptor: HttpInterceptorFn = (req, next) => {\n  const auth = inject(AuthService);\n  const add = (t: string) => req.clone({ setHeaders: { Authorization: `Bearer ${t}` } });\n  return next(add(auth.token)).pipe(\n    catchError(err => {\n      if (err.status !== 401 || req.url.includes('/refresh')) return throwError(() => err);\n      return auth.refresh$().pipe(         // ONE shared stream, see below\n        switchMap(t => next(add(t))),\n        catchError(e => { auth.logout(); return throwError(() => e); }),\n      );\n    }),\n  );\n};\n```\nStampede fix: `auth.refresh$()` returns a single in-flight `shareReplay(1)` Observable — the first 401 starts the refresh, the other four subscribe to the same one and all retry with the new token.",
          },
          {
            q: "Write a global error interceptor that shows a toast and rethrows — without swallowing the error for the caller.",
            answer:
              "```ts\nexport const errorInterceptor: HttpInterceptorFn = (req, next) => {\n  const toast = inject(ToastService);\n  return next(req).pipe(\n    catchError((err: HttpErrorResponse) => {\n      if (err.status >= 500) toast.error('Something went wrong, try again.');\n      else if (err.status === 403) toast.warn('You do not have access.');\n      return throwError(() => err);        // caller still gets the error\n    }),\n  );\n};\n```\nRe-throwing (not returning `of(...)`) means the component's `error` callback still runs for context-specific handling.",
          },
          {
            q: "Build a loading-spinner interceptor — a counter in a service, guarded against going negative, using `finalize`.",
            answer:
              "```ts\n@Injectable({ providedIn: 'root' })\nexport class LoadingService {\n  private n = 0; readonly loading = signal(false);\n  inc() { this.loading.set(++this.n > 0); }\n  dec() { this.n = Math.max(0, this.n - 1); this.loading.set(this.n > 0); }\n}\nexport const loadingInterceptor: HttpInterceptorFn = (req, next) => {\n  const svc = inject(LoadingService);\n  svc.inc();\n  return next(req).pipe(finalize(() => svc.dec()));\n};\n```\n`finalize` runs on success, error, *and* cancellation, so the counter can't get stuck; `Math.max(0, ...)` guards against double-decrement.",
          },
          {
            q: "Build a retry interceptor with exponential backoff for idempotent GETs only — how do you decide it's safe to retry?",
            answer:
              "```ts\nexport const retryInterceptor: HttpInterceptorFn = (req, next) =>\n  req.method !== 'GET' ? next(req) : next(req).pipe(\n    retry({\n      count: 3,\n      delay: (err, i) => (err.status >= 500 || err.status === 0)\n        ? timer(2 ** i * 300 + Math.random() * 100)\n        : throwError(() => err),\n    }),\n  );\n```\nSafe to retry only **idempotent** methods (GET/HEAD/PUT/DELETE by spec) and only **transient** failures (network error `status 0`, 502/503/504). Never blindly retry POST — use an idempotency key if you must.",
          },
          {
            q: "How do you cancel a request when a component is destroyed mid-flight, and how does `switchMap` in a search feature do this automatically?",
            answer:
              "Unsubscribing aborts the HTTP request. The `async` pipe does this on component destroy; `takeUntilDestroyed()` does it for manual subscriptions. In a typeahead, `switchMap` unsubscribes the previous inner request the moment a new search term arrives — so stale responses never land, and the old XHR is cancelled at the network level.",
          },
          {
            q: "How do you test an interceptor with `HttpTestingController` — assert the outgoing header, flush a 401, assert the retry?",
            answer:
              "```ts\nTestBed.configureTestingModule({\n  providers: [provideHttpClient(withInterceptors([authInterceptor])),\n             provideHttpClientTesting(),\n             { provide: AuthService, useValue: fakeAuth }],\n});\nconst http = TestBed.inject(HttpClient), ctrl = TestBed.inject(HttpTestingController);\nhttp.get('/x').subscribe();\nconst r1 = ctrl.expectOne('/x');\nexpect(r1.request.headers.get('Authorization')).toBe('Bearer old');\nr1.flush(null, { status: 401, statusText: 'Unauthorized' });\nconst r2 = ctrl.expectOne('/x');             // the retry\nexpect(r2.request.headers.get('Authorization')).toBe('Bearer new');\nctrl.verify();\n```",
          },
          {
            q: "How do you do file upload with progress (`reportProgress: true`, `HttpEventType.UploadProgress`) and blob download (`responseType: 'blob'`)?",
            answer:
              "```ts\n// upload\nhttp.post('/upload', form, { reportProgress: true, observe: 'events' }).subscribe(e => {\n  if (e.type === HttpEventType.UploadProgress && e.total)\n    this.pct = Math.round(100 * e.loaded / e.total);\n});\n// download\nhttp.get('/report.pdf', { responseType: 'blob' }).subscribe(blob => {\n  const url = URL.createObjectURL(blob);\n  const a = Object.assign(document.createElement('a'), { href: url, download: 'report.pdf' });\n  a.click(); URL.revokeObjectURL(url);\n});\n```",
          },
          {
            q: "How do you mock the backend in development (an in-memory interceptor, `provideHttpClient` with a fake, or MSW)?",
            answer:
              "- **In-memory interceptor** — a functional interceptor that pattern-matches URLs and returns `of(new HttpResponse({ body: fixture }))`. Quick, no deps, only in the dev config.\n- **MSW (Mock Service Worker)** — intercepts at the network layer (service worker), so it also works for tests and shows real requests in devtools; more realistic.\n- **`angular-in-memory-web-api`** — older, CRUD-ish auto-backend.\n\nKeep the mock out of prod builds via environment-conditional providers.",
          },
          {
            q: "Where does response caching belong — an interceptor keyed by URL, or a service with `shareReplay`? Trade-offs.",
            answer:
              "**Interceptor keyed by URL+params** — transparent, app-wide, easy to add TTL and `Cache-Control` awareness, but it's a blunt instrument (which endpoints? how to invalidate after a write?) and hides caching from the code reading data. **Service with `shareReplay(1)` + an invalidation `Subject`** — explicit, per-resource, you control exactly when to bust it (after a mutation), and it's easy to reason about. Prefer the service approach for domain data; use an interceptor only for truly static GETs (config, reference lists).",
          },
        ],
      },
      {
        id: "angular-change-detection-perf",
        number: 4,
        numLabel: "4h",
        title: "Angular — Change Detection, Signals & Performance",
        questions: [
          {
            q: "How does Zone.js-based change detection work — what monkey-patched async API triggers a cycle, and what does \"dirty-check from the root\" mean?",
            answer:
              "Zone.js patches `setTimeout`, `setInterval`, `Promise.then`, `addEventListener`, XHR/`fetch`, etc. When one of these callbacks finishes, the `NgZone` fires `onMicrotaskEmpty`, and Angular runs change detection. 'Dirty-check from the root' means it walks the **entire component tree top-down**, re-evaluating every template binding and comparing to the previous value; any difference updates the DOM. It's fast per node but O(number of bindings) every cycle — hence `OnPush`.",
          },
          {
            q: "`Default` vs `OnPush` — with `OnPush`, what still triggers change detection for that component?",
            answer:
              "`Default` checks the component every cycle. `OnPush` skips it unless: (1) an `@Input` **reference** changed, (2) a DOM event fired **within** the component or a child, (3) an `async` pipe / signal read in its template emitted, or (4) code called `cdr.markForCheck()` (directly or via those mechanisms). Otherwise its whole subtree is skipped.",
          },
          {
            q: "Why does `OnPush` require immutable inputs? Show a bug where mutating an array in place doesn't update an `OnPush` child.",
            answer:
              "`OnPush` compares inputs by reference. Mutating keeps the same reference, so it decides 'nothing changed' and skips render.\n```ts\n// parent (OnPush child bound to [items]=\"list\")\naddItem(x: Item) {\n  this.list.push(x);          // BUG: same array reference -> child never updates\n}\naddItemFixed(x: Item) {\n  this.list = [...this.list, x];   // new reference -> child re-renders\n}\n```",
          },
          {
            q: "`ChangeDetectorRef` — `markForCheck()`, `detectChanges()`, `detach()`, `reattach()` — when do you use `markForCheck()` vs `detectChanges()`?",
            answer:
              "- `markForCheck()` — flag this component and its ancestors as dirty so the **next** CD cycle checks them. Use after an async update in an `OnPush` component (e.g. a manual `subscribe`).\n- `detectChanges()` — run CD on this component **synchronously, now**. Use in rare cases where you need the DOM updated immediately (outside a zone, before measuring).\n- `detach()` / `reattach()` — remove/restore a subtree from CD entirely; for a heavy widget you update on your own schedule.",
          },
          {
            q: "`trackBy` / `@for track` — describe the before/after on a 1000-row list re-render.",
            answer:
              "**Before (no track):** replacing the array (API refresh, immutable update) makes Angular treat all 1000 items as new — it destroys 1000 DOM subtrees/component instances and creates 1000 fresh ones. Visible jank, lost focus/scroll, ~tens of ms.\n**After (`track item.id`):** Angular matches by id, reuses the 1000 existing nodes, and only creates/removes/moves the handful that actually changed — sub-millisecond, no visual disruption.",
          },
          {
            q: "`NgZone.runOutsideAngular()` — when do you use it (rapid mousemove, animation loop, noisy third-party lib), and how do you re-enter the zone?",
            answer:
              "Wrap high-frequency work that shouldn't trigger CD on every tick — `mousemove`/`scroll`/`requestAnimationFrame` loops, a charting or map library's internal timers, a websocket firehose you batch yourself:\n```ts\nthis.zone.runOutsideAngular(() => {\n  el.addEventListener('mousemove', onMove);\n});\n// when you actually need Angular to react:\nthis.zone.run(() => this.position.set(p));\n```",
          },
          {
            q: "What is zoneless change detection (`provideExperimentalZonelessChangeDetection`), and what must the app rely on instead of Zone.js?",
            answer:
              "It removes Zone.js, so Angular no longer auto-runs CD after every async callback. Updates are then driven explicitly by: **signals** read in templates, the **`async` pipe**, `markForCheck()`, and template event bindings. Benefits: smaller bundle, no monkey-patching overhead, predictable CD. Cost: third-party code that relied on Zone to trigger updates needs `markForCheck()` or signal-based state.",
          },
          {
            q: "How do signals change the change-detection story — fine-grained template dependencies — and where is Angular heading with signal-based components?",
            answer:
              "When a template reads `count()`, Angular records that this view depends on that signal. Changing the signal marks **only** the views that read it for check — not the whole tree, not the whole component. The roadmap ('signal components') pushes this further: components with signal inputs/queries and no Zone, where CD becomes surgical DOM updates to exactly the bindings that changed, closer to fine-grained frameworks.",
          },
          {
            q: "`computed()` memoization and glitch-free propagation — why is a `computed` better than calling a method in the template?",
            answer:
              "`{{ total() }}` where `total = computed(() => heavyCalc(this.items()))` recomputes **only when `items` changes** and caches otherwise. `{{ heavyCalc(items) }}` (a method call) runs on **every** CD cycle. 'Glitch-free' means if several signals a `computed` depends on change in one tick, it recomputes once, after all of them settle — never with a half-updated intermediate value.",
          },
          {
            q: "`@defer` blocks — triggers (`on idle`, `on viewport`, `on interaction`, `when`), plus `@placeholder` / `@loading` / `@error` — how do they cut the initial bundle?",
            answer:
              "Components used **only** inside a `@defer` block are compiled into a **separate lazy chunk** that isn't downloaded until the trigger fires (`on idle`, `on viewport` = when scrolled near, `on interaction`, `on hover`, `when condition`). `@placeholder` renders first, `@loading` while the chunk fetches, `@error` on failure. Great for below-the-fold widgets, heavy charts, comment threads — the initial bundle only ships what's needed to paint the first screen.",
          },
          {
            q: "CDK virtual scrolling (`cdk-virtual-scroll-viewport`) — when is it worth it, and what's the pitfall with variable row heights?",
            answer:
              "Worth it when a list is long enough (hundreds–thousands of rows) that rendering every DOM node costs memory and CD time; virtual scroll keeps only the visible window (+ buffer) in the DOM. Pitfall: the default `FixedSizeVirtualScrollStrategy` needs a known `itemSize`. Variable-height rows (wrapping text, expandable cards) render with wrong offsets/scrollbar — you need `autosize` (from `@angular/cdk-experimental`) or a custom strategy, which is heavier and less smooth.",
          },
          {
            q: "How do you profile an Angular app — Angular DevTools profiler, `ng.profiler.timeChangeDetection()`, Chrome performance — and what do you look for?",
            answer:
              "**Angular DevTools → Profiler:** record an interaction; look for frequent CD cycles, components that check every cycle, and long bars — candidates for `OnPush`/`trackBy`/signals. **`ng.profiler.timeChangeDetection()`** (dev console): average ms per full CD pass; > a few ms means too many bindings or missing `OnPush`. **Chrome Performance tab:** long tasks, layout thrash, big script/GC time, bundle parse. Also check Network for oversized initial bundles and un-split lazy routes.",
          },
        ],
      },
      {
        id: "angular-testing-tooling",
        number: 4,
        numLabel: "4i",
        title: "Angular — Testing & Tooling",
        questions: [
          {
            q: "`TestBed` — what does `configureTestingModule` set up, and what's the cost of `compileComponents()` for a `templateUrl`?",
            answer:
              "`configureTestingModule({ imports, declarations, providers })` builds a throwaway Angular module/injector for the test — you register the component under test, its (real or fake) dependencies, and testing modules. `compileComponents()` is async and needed only when a component uses `templateUrl`/`styleUrls` (external files must be fetched and compiled); with inline `template` it's a no-op. The Angular CLI's Webpack/esbuild inlines templates, so you often don't need it there.",
          },
          {
            q: "`fixture.detectChanges()` — why must you call it, and when do you need to call it twice?",
            answer:
              "In tests, automatic change detection is off, so `detectChanges()` is what runs bindings and lifecycle hooks (`ngOnInit` on the first call). Call it **twice** when the first pass produces state that the template then reflects — e.g. `ngOnInit` sets data → first `detectChanges` runs `ngOnInit` → you update an input or an async value resolves → second `detectChanges` renders it. Or call `fixture.autoDetectChanges()` to mimic real behaviour.",
          },
          {
            q: "`fakeAsync` + `tick()` / `flush()` vs `waitForAsync` + `whenStable()` — when do you need each?",
            answer:
              "- **`fakeAsync` + `tick(ms)` / `flush()`** — synchronous, deterministic control of `setTimeout`, `debounceTime`, promises. `tick(300)` advances virtual time; `flush()` drains all pending timers. Preferred for timing logic.\n- **`waitForAsync` + `fixture.whenStable()`** — for real async you can't fake (an actual XHR, though you should mock it), returns a promise that resolves when the zone settles.\n\nUse `fakeAsync` for controllable async; `waitForAsync` only when something genuinely can't be virtualised.",
          },
          {
            q: "How do you mock a service in a component test (`useValue: jasmine.createSpyObj(...)`) and assert it was called with the right args?",
            answer:
              "```ts\nconst api = jasmine.createSpyObj<TxnApi>('TxnApi', ['transfer']);\napi.transfer.and.returnValue(of({ ok: true }));\nTestBed.configureTestingModule({ imports: [TransferComponent], providers: [{ provide: TxnApi, useValue: api }] });\nconst f = TestBed.createComponent(TransferComponent);\nf.componentInstance.form.setValue({ to: 'acc-2', amount: 500 });\nf.componentInstance.submit();\nexpect(api.transfer).toHaveBeenCalledOnceWith({ to: 'acc-2', amount: 500 });\n```",
          },
          {
            q: "`provideHttpClientTesting` / `HttpClientTestingModule` + `HttpTestingController` — `expectOne`, `flush`, `verify`.",
            answer:
              "```ts\nTestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });\nconst ctrl = TestBed.inject(HttpTestingController);\nservice.load().subscribe(r => (result = r));\nconst req = ctrl.expectOne(r => r.url === '/txns' && r.method === 'GET');\nreq.flush([{ id: 1 }]);                 // provide the fake response\n// req.flush(null, { status: 500, statusText: 'Err' }) for the error path\nctrl.verify();                          // fails the test if any request was left unmatched\n```",
          },
          {
            q: "How do you test `@Output` emissions and DOM interactions (`triggerEventHandler`, native `click`)?",
            answer:
              "```ts\nconst spy = jasmine.createSpy();\nf.componentInstance.saved.subscribe(spy);\n// via DebugElement (bypasses real DOM event dispatch)\nf.debugElement.query(By.css('button.save')).triggerEventHandler('click', null);\n// or a real DOM click\nf.nativeElement.querySelector('button.save').click();\nf.detectChanges();\nexpect(spy).toHaveBeenCalledWith(expectedPayload);\n```\n`triggerEventHandler` is faster and doesn't need a real event object; native `click()` is closer to reality for things like form submission.",
          },
          {
            q: "How do you test a component that depends on `Router` and `ActivatedRoute`?",
            answer:
              "For navigation-free unit tests, stub both:\n```ts\nproviders: [\n  { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },\n  { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '7' })), snapshot: { params: { id: '7' } } } },\n]\n```\nAssert `router.navigate` was called with the right commands. For real routing behaviour (guards, redirects), use `provideRouter([...])` and check `TestBed.inject(Router).url` after `navigate()` + `tick()`.",
          },
          {
            q: "Shallow vs deep component tests — `NO_ERRORS_SCHEMA` / `CUSTOM_ELEMENTS_SCHEMA` vs stubbing child components; trade-offs.",
            answer:
              "**Shallow:** don't render real children. `NO_ERRORS_SCHEMA` makes Angular ignore unknown elements/attrs — fast, isolated, but hides typos and real integration bugs. Better: provide **stub components** with the same selector/inputs/outputs so bindings are still type-checked. **Deep:** render the real child tree — catches integration issues but is slower, more brittle, and pulls in the children's dependencies. Default to shallow with stubs; use a few deep tests for critical flows.",
          },
          {
            q: "What makes an Angular test flaky (missing `detectChanges`, real timers, unmocked HTTP, fixture not destroyed)?",
            answer:
              "- Forgetting `detectChanges()` so the assertion runs against stale DOM.\n- Real `setTimeout`/`interval` instead of `fakeAsync` + `tick` — timing races.\n- Unmocked HTTP hitting the network, or not calling `httpMock.verify()`.\n- Shared mutable state / a singleton not reset between tests (order dependence).\n- Not destroying the fixture / leaving subscriptions open (`--detectOpenHandles` style leaks).\n- Asserting on animation-dependent state without disabling animations.",
          },
          {
            q: "What does `ng build` do under the hood (AOT, tree-shaking, budgets, esbuild/Vite), and what are schematics (`ng generate`, `ng add`, `ng update`)?",
            answer:
              "`ng build` (esbuild-based `@angular/build` now; Webpack previously) AOT-compiles templates to JS, type-checks, tree-shakes dead code, minifies, hashes filenames, code-splits lazy routes, inlines critical CSS, and fails on budget overruns configured in `angular.json`. **Schematics** are the CLI's codemods: `ng generate` scaffolds files + wires config, `ng add <pkg>` installs and configures a library, `ng update` runs the library's migration schematics to rewrite your code across major versions.",
          },
        ],
      },
      {
        id: "angular-practical-extended",
        number: 4,
        numLabel: "4j",
        title: "Angular — Practical Build Tasks (Extended)",
        questions: [
          {
            q: "Build a reusable confirm-dialog service any component can call and `await` a boolean from (component + `Subject` + overlay).",
            answer:
              "```ts\n@Injectable({ providedIn: 'root' })\nexport class ConfirmService {\n  request = signal<{ msg: string } | null>(null);\n  private resolve?: (v: boolean) => void;\n  ask(msg: string) { this.request.set({ msg }); return new Promise<boolean>(r => (this.resolve = r)); }\n  answer(v: boolean) { this.request.set(null); this.resolve?.(v); }\n}\n```\nRender `<app-confirm-host>` once in the app shell: `@if (confirm.request(); as r) { <dialog>{{ r.msg }} <button (click)=\"confirm.answer(true)\">OK</button> ...`. Callers: `if (await this.confirm.ask('Delete?')) { ... }`.",
          },
          {
            q: "Build a generic typed data-table component: `@Input` columns + rows, client-side sort, filter, and pagination, `OnPush`, no library.",
            answer:
              "```ts\n@Component({ selector: 'app-table', changeDetection: ChangeDetectionStrategy.OnPush, /* ... */ })\nexport class TableComponent<T> {\n  rows = input<T[]>([]);\n  columns = input<{ key: keyof T; label: string }[]>([]);\n  filter = signal(''); sortKey = signal<keyof T | null>(null); dir = signal<1 | -1>(1);\n  page = signal(0); size = 10;\n  private filtered = computed(() => {\n    const q = this.filter().toLowerCase();\n    let r = this.rows().filter(x => JSON.stringify(x).toLowerCase().includes(q));\n    const k = this.sortKey();\n    if (k) r = [...r].sort((a, b) => (a[k] > b[k] ? 1 : -1) * this.dir());\n    return r;\n  });\n  view = computed(() => this.filtered().slice(this.page() * this.size, (this.page() + 1) * this.size));\n  pages = computed(() => Math.ceil(this.filtered().length / this.size));\n}\n```\nAll-`computed` means recompute only on real input changes; `OnPush` since it's signal-driven.",
          },
          {
            q: "Build an `<app-currency-input>` custom form control (`ControlValueAccessor`) that stores a number but displays grouped INR formatting.",
            answer:
              "```ts\n@Component({\n  selector: 'app-currency-input', standalone: true,\n  template: `<input [value]=\"display\" (input)=\"onInput($event)\" (blur)=\"onTouched()\" [disabled]=\"disabled\">`,\n  providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => CurrencyInputComponent) }],\n})\nexport class CurrencyInputComponent implements ControlValueAccessor {\n  display = ''; disabled = false;\n  private fmt = new Intl.NumberFormat('en-IN');\n  private onChange = (_: number | null) => {};\n  onTouched = () => {};\n  onInput(e: Event) {\n    const digits = (e.target as HTMLInputElement).value.replace(/[^\\d]/g, '');\n    const n = digits ? Number(digits) : null;\n    this.display = n === null ? '' : this.fmt.format(n);\n    this.onChange(n);                       // model holds a number\n  }\n  writeValue(v: number | null) { this.display = v == null ? '' : this.fmt.format(v); }\n  registerOnChange(fn: any) { this.onChange = fn; }\n  registerOnTouched(fn: any) { this.onTouched = fn; }\n  setDisabledState(d: boolean) { this.disabled = d; }\n}\n```",
          },
          {
            q: "Build a debounced search field that cancels stale requests and shows loading / empty / error states from a single stream.",
            answer:
              "```ts\ntype State<T> = { status: 'idle' | 'loading' | 'ok' | 'error'; data?: T[] };\nvm$ = this.q.valueChanges.pipe(\n  map(v => (v ?? '').trim()), debounceTime(300), distinctUntilChanged(),\n  switchMap(term => term\n    ? this.api.search(term).pipe(\n        map(data => ({ status: 'ok', data } as State<Row>)),\n        startWith({ status: 'loading' } as State<Row>),\n        catchError(() => of({ status: 'error' } as State<Row>)))\n    : of({ status: 'idle' } as State<Row>)),\n);\n// template: @switch (vm.status) { @case ('loading') {...} @case ('error') {...}\n//   @case ('ok') { @if (!vm.data?.length) { empty } @else { list } } }\n```\nOne stream models every UI state; `switchMap` cancels the stale request.",
          },
          {
            q: "Build a multi-step wizard with one typed `FormGroup`, per-step validation gating the Next button, and a review step.",
            answer:
              "```ts\nform = this.fb.nonNullable.group({\n  account: this.fb.nonNullable.group({ ifsc: ['', Validators.required], acc: ['', Validators.required] }),\n  amount:  this.fb.nonNullable.group({ value: [0, [Validators.required, Validators.min(1)]] }),\n});\nsteps = ['account', 'amount'] as const;\nstep = signal(0);\ncurrent = computed(() => this.steps[this.step()]);\ncanNext = computed(() => this.form.get(this.current())!.valid);\nnext() { this.canNext() ? this.step.update(s => s + 1) : this.form.get(this.current())!.markAllAsTouched(); }\nsubmit() { if (this.form.valid) this.api.transfer(this.form.getRawValue()).subscribe(); }\n```\nRender only `form.get(current())`; the review step reads `form.getRawValue()`.",
          },
          {
            q: "Build an auth flow: login form → store JWT → `CanMatch` route guard → interceptor attaches token → refresh on 401.",
            answer:
              "1. **Login:** reactive form → `api.login(dto)` → `auth.setSession(res)` (store access token in memory + a signal; refresh token in an httpOnly cookie).\n2. **Guard:** `export const authMatch: CanMatchFn = () => inject(AuthService).isLoggedIn() || inject(Router).createUrlTree(['/login']);` on protected routes.\n3. **Interceptor:** clone the request with `Authorization: Bearer <token>`.\n4. **Refresh:** on a 401, call a single shared `auth.refresh$()` (`shareReplay(1)`), then `switchMap` to retry the original; on refresh failure, `auth.logout()` + redirect. Concurrent 401s share the one refresh.",
          },
          {
            q: "Build an \"unsaved changes\" `CanDeactivate` guard wired to a form's `dirty` state.",
            answer:
              "```ts\nexport interface DirtyCheck { canLeave(): boolean | Promise<boolean>; }\nexport const unsavedGuard: CanDeactivateFn<DirtyCheck> = c => c.canLeave();\n\n// in the component:\ncanLeave() { return !this.form.dirty || this.confirm.ask('Discard unsaved changes?'); }\n// route: { path: 'edit/:id', component: EditComponent, canDeactivate: [unsavedGuard] }\n```\nCall `this.form.markAsPristine()` after a successful save so navigating away no longer prompts.",
          },
          {
            q: "Build a dynamic form from a JSON schema (array of field configs → `FormGroup` + rendered controls).",
            answer:
              "```ts\ninterface Field { name: string; type: 'text' | 'number' | 'select'; label: string; required?: boolean; options?: string[]; }\nbuild(schema: Field[]) {\n  const group: Record<string, FormControl> = {};\n  for (const f of schema) {\n    group[f.name] = new FormControl(f.type === 'number' ? 0 : '',\n      f.required ? Validators.required : []);\n  }\n  return new FormGroup(group);\n}\n```\nTemplate loops the schema and renders an input per `type` inside `[formGroup]=\"form\"` with `[formControlName]=\"f.name\"`. Add async validators / conditional logic by extending the `Field` shape.",
          },
          {
            q: "Build optimistic UI for a favorite/like toggle — update state immediately, roll back on API error, dedupe rapid clicks with `exhaustMap`.",
            answer:
              "```ts\nprivate click$ = new Subject<void>();\nconstructor() {\n  this.click$.pipe(\n    exhaustMap(() => {\n      const prev = this.liked();\n      this.liked.set(!prev);                              // optimistic\n      return this.api.setLike(this.id, this.liked()).pipe(\n        catchError(() => { this.liked.set(prev); this.toast.error('Failed'); return EMPTY; }));\n    }),\n    takeUntilDestroyed(),\n  ).subscribe();\n}\ntoggle() { this.click$.next(); }\n```\n`exhaustMap` ignores clicks while a request is in flight, so state never desyncs from rapid toggling.",
          },
          {
            q: "Build a FormArray editor for line items (add / remove / reorder) with a live total via `valueChanges` or a signal.",
            answer:
              "```ts\nitems = this.fb.array<FormGroup>([]);\ntotal = toSignal(\n  this.items.valueChanges.pipe(\n    startWith(this.items.value),\n    map(rows => rows.reduce((s, r) => s + (r.qty ?? 0) * (r.price ?? 0), 0)),\n  ), { initialValue: 0 },\n);\nadd()    { this.items.push(this.fb.group({ qty: [1], price: [0] })); }\nremove(i: number) { this.items.removeAt(i); }\nmove(from: number, to: number) {\n  const c = this.items.at(from); this.items.removeAt(from); this.items.insert(to, c);\n}\n```\nBind with `formArrayName=\"items\"` + `[formGroupName]=\"i\"`; `{{ total() }}` updates live.",
          },
          {
            q: "Build a lazy-loaded route with `loadComponent` and verify the chunk split in the build.",
            answer:
              "```ts\n// app.routes.ts\n{ path: 'analytics',\n  loadComponent: () => import('./analytics/analytics.component').then(m => m.AnalyticsComponent),\n  canMatch: [authMatch] }\n```\n`ng build` output lists a `chunk-XXXX.js | analytics-component` line; the browser Network tab requests it only on navigating to `/analytics`. If a shared eager module imports `AnalyticsComponent` directly, the split silently collapses — check the stats/bundle report.",
          },
          {
            q: "Build a global `ErrorHandler` plus an HTTP error interceptor that together log to a service and show a toast.",
            answer:
              "```ts\n@Injectable()\nexport class GlobalErrorHandler implements ErrorHandler {\n  constructor(private log: LogService, private zone: NgZone, private toast: ToastService) {}\n  handleError(err: unknown) {\n    if (err instanceof HttpErrorResponse) return;      // handled by the interceptor\n    this.log.report(err);\n    this.zone.run(() => this.toast.error('Unexpected error'));\n  }\n}\nexport const errorInterceptor: HttpInterceptorFn = (req, next) => {\n  const log = inject(LogService), toast = inject(ToastService);\n  return next(req).pipe(catchError((e: HttpErrorResponse) => {\n    log.report(e, { url: req.url });\n    if (e.status >= 500) toast.error('Server error');\n    return throwError(() => e);\n  }));\n};\n// providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }, provideHttpClient(withInterceptors([errorInterceptor]))]\n```\nThe `ErrorHandler` skips `HttpErrorResponse` so errors aren't double-reported.",
          },
          {
            q: "Convert an RxJS-based component's state to signals (`toSignal`, `computed`) and note what got simpler.",
            answer:
              "Before: `items$`, `filter$` `BehaviorSubject`s, a `combineLatest` → `view$`, an `async` pipe per usage, `takeUntil` teardown.\n```ts\nafter:\nitems = toSignal(this.api.list(), { initialValue: [] });\nfilter = signal('');\nview = computed(() => this.items().filter(i => i.name.includes(this.filter())));\n```\nSimpler: no manual subscribe/teardown, no `async` pipe multi-subscription trap, synchronous reads in methods (`this.view()`), and `computed` memoization is automatic. RxJS stays only for the actual async source (`this.api.list()`).",
          },
          {
            q: "Build a paginated infinite-scroll list that never skips or duplicates rows as new data is prepended (keyset cursor).",
            answer:
              "Track the **last seen key**, not an offset:\n```ts\nprivate cursor: { ts: string; id: string } | null = null;\nrows = signal<Row[]>([]);\nloadMore() {\n  this.api.page({ afterTs: this.cursor?.ts, afterId: this.cursor?.id, limit: 20 })\n    .subscribe(batch => {\n      this.rows.update(r => [...r, ...batch]);\n      const last = batch.at(-1);\n      if (last) this.cursor = { ts: last.createdAt, id: last.id };\n    });\n}\n```\nBecause the next query is 'rows before `(ts, id)`', inserting new rows at the top doesn't shift the window — no skips or dupes, unlike `OFFSET`.",
          },
          {
            q: "Write unit tests for the debounced search component using `fakeAsync` + `HttpTestingController`.",
            answer:
              "```ts\nit('debounces, cancels stale, renders results', fakeAsync(() => {\n  const f = TestBed.createComponent(SearchComponent);\n  const ctrl = TestBed.inject(HttpTestingController);\n  f.detectChanges();\n  f.componentInstance.q.setValue('ac');\n  tick(150);\n  f.componentInstance.q.setValue('acc');   // supersedes before debounce fires\n  tick(300);\n  ctrl.expectOne(r => r.url.includes('q=acc')).flush([{ id: 1 }]);\n  ctrl.expectNone(r => r.url.includes('q=ac'));   // stale term never requested\n  f.detectChanges();\n  expect(f.nativeElement.querySelectorAll('[data-row]').length).toBe(1);\n  ctrl.verify();\n}));\n```",
          },
        ],
      },
      {
        id: "nodejs-theoretical",
        number: 5,
        title: "Node.js — Theoretical",
        questions: [
          {
            q: "Explain the Node.js event loop and its phases in detail (timers, pending callbacks, poll, check, close).",
          },
          {
            q: "Callback vs Promise vs async/await — how does error handling differ across the three?",
          },
          {
            q: "What is a stream? Explain the types (Readable, Writable, Duplex, Transform) and backpressure.",
          },
          { q: "Buffer vs Stream — when do you use each?" },
          {
            q: "Cluster module vs worker_threads vs child_process — differences and when to use each.",
          },
          {
            q: "Explain the Express middleware chain and how error-handling middleware differs from regular middleware.",
          },
          {
            q: "What commonly causes memory leaks in a Node app? How do you detect one (heap snapshots, `--inspect`)?",
          },
          {
            q: "What is EventEmitter used for internally in Node? How would you implement a simple pub/sub with it?",
          },
          {
            q: "Explain npm semantic versioning (`^`, `~`), `package-lock.json`, and peer dependencies.",
          },
          {
            q: "How do you manage environment/config and secrets safely across dev/staging/prod?",
          },
          {
            q: "Node security basics — helmet, rate limiting, input validation/sanitization, CORS, preventing NoSQL/SQL injection.",
          },
          {
            q: "How do microservices typically communicate? REST vs gRPC vs message queue trade-offs.",
          },
          {
            q: "Authentication approaches — session-based vs JWT vs OAuth2. Trade-offs?",
          },
          { q: "CommonJS vs ES Modules in Node — key differences." },
          {
            q: "`process.nextTick` vs `setImmediate` vs `setTimeout(fn, 0)` — execution order and why it matters.",
          },
          {
            q: "Error-first callback pattern — what is it, and how do you handle unhandled promise rejections?",
          },
          {
            q: "How do you approach logging and monitoring for a Node service in production?",
          },
          {
            q: "Unit vs integration testing in Node — how do you mock a database call in a test?",
          },
          {
            q: "How do you implement graceful shutdown (handling SIGTERM, draining in-flight requests, closing DB connections)?",
          },
          {
            q: "How would you add caching to a Node API (in-memory vs Redis)? How do you invalidate it?",
          },
          { q: "What is the difference between `require` and dynamic `import()`?" },
          {
            q: "How does Node handle uncaught exceptions vs unhandled promise rejections, and what should your app do about each?",
          },
          {
            q: "TypeScript with Node — what does it actually buy you at runtime (hint: nothing, it's compile-time) vs at dev-time?",
          },
          {
            q: "REST vs GraphQL — when would you choose GraphQL for a Node backend, and what are its downsides (caching, N+1 at resolver level)?",
          },
          {
            q: "WebSockets vs long polling vs Server-Sent Events — differences and when to use each for real-time features.",
          },
          {
            q: "ORMs in the Node world (TypeORM/Prisma/Sequelize) — how do they compare to writing raw SQL or using a query builder like Knex?",
          },
          { q: "What's the role of a reverse proxy (Nginx) in front of a Node app?" },
          {
            q: "How would you structure a monorepo containing multiple Node services (npm/yarn workspaces, Nx, Turborepo)?",
          },
        ],
      },
      {
        id: "nodejs-practical",
        number: 6,
        title: "Node.js — Practical / Technical Round",
        questions: [
          {
            q: "Build a small Express CRUD API for one resource with a centralized error-handling middleware.",
          },
          {
            q: "Implement JWT authentication: login endpoint, a protected route, and a refresh-token flow.",
          },
          {
            q: "Build a file upload endpoint that streams the file to disk instead of buffering it fully in memory.",
          },
          {
            q: "Implement rate-limiting middleware from scratch (token bucket algorithm), no library.",
          },
          { q: "You're given a snippet with a memory leak — find and fix it." },
          {
            q: "Write a script to process a large CSV file (bigger than available RAM) using streams.",
          },
          { q: "Implement a simple pub/sub system using EventEmitter across two modules." },
          { q: "Add request validation to an endpoint (e.g., with Joi or Zod, or hand-rolled)." },
          {
            q: "Write unit tests for an Express route handler, mocking the database layer.",
          },
          {
            q: "Implement graceful shutdown for an Express server — close the HTTP server, finish in-flight requests, close DB connections.",
          },
          {
            q: "Build a simple job queue processor (in-memory) that processes tasks with retry-on-failure logic and exponential backoff.",
          },
          {
            q: "Implement request logging middleware that logs method, path, status code, and response time.",
          },
          { q: "Build a WebSocket server that broadcasts a message to all connected clients." },
          {
            q: "Implement an idempotency-key check in Express middleware (reject/short-circuit a repeated request with the same key).",
          },
          {
            q: "Debug a Node process consuming 100% CPU — walk through your diagnostic approach (profiler, flame graph).",
          },
        ],
      },
      {
        id: "node-event-loop-async-internals",
        number: 6,
        numLabel: "6a",
        title: "Node.js — Event Loop, Timers & Async Internals",
        questions: [
          {
            q: "Walk through the event loop phases in order (timers, pending callbacks, poll, check, close) and what runs in each.",
          },
          {
            q: "What is the poll phase actually doing, and when does the loop block there vs move on to `check`?",
          },
          {
            q: "`process.nextTick()` vs `queueMicrotask()` vs `Promise.then()` — which queue does each use, and in what order do they drain relative to each other?",
          },
          {
            q: "`setTimeout(fn, 0)` vs `setImmediate(fn)` — which runs first, and why is the answer \"it depends\" at the top level but deterministic inside an I/O callback?",
          },
          {
            q: "Why can starving the loop with `process.nextTick()` recursion prevent I/O and timers from ever running?",
          },
          {
            q: "What is the libuv thread pool, what uses it (fs, crypto, dns.lookup, zlib), and what is `UV_THREADPOOL_SIZE`?",
          },
          {
            q: "Is network I/O handled by the thread pool? Explain why sockets use the OS async primitives (epoll/kqueue/IOCP) instead.",
          },
          {
            q: "What does \"non-blocking\" actually mean when Node is single-threaded? Where does the real concurrency come from?",
          },
          {
            q: "What is a \"blocking\" operation in Node, and name three ways to accidentally block the loop (sync fs, big JSON.parse, tight CPU loop, regex catastrophic backtracking).",
          },
          {
            q: "How do you measure event-loop lag / delay, and what tools report it (`perf_hooks.monitorEventLoopDelay`, clinic, APM)?",
          },
          {
            q: "Predict the output: a script mixing `setTimeout`, `setImmediate`, `Promise.resolve().then`, `process.nextTick`, and a sync `console.log`. Explain each line.",
          },
          {
            q: "What happens to timer accuracy under load — why is `setTimeout(fn, 100)` not exactly 100ms?",
          },
          {
            q: "What is `setInterval` drift, and how do you build a reliable recurring task instead?",
          },
          {
            q: "How does `async/await` desugar in terms of the microtask queue — how many microtask ticks does one `await` cost?",
          },
          {
            q: "What is `Atomics.wait` / `SharedArrayBuffer`, and why would you basically never use it in typical app code?",
          },
          {
            q: "How does the event loop shut down — what keeps the process alive (open handles, timers, sockets), and what is `ref()` / `unref()`?",
          },
          {
            q: "Why does an unhandled `await` on a never-resolving promise silently hang the process with exit code 0?",
          },
          {
            q: "What runs during the `close` phase, and give an example (`socket.on('close')`).",
          },
          {
            q: "How do worker threads get their own event loop, and how does message passing between them interact with each loop?",
          },
          {
            q: "What is `performance.now()` vs `Date.now()` for measuring elapsed time, and why does monotonicity matter?",
          },
          {
            q: "Explain how a single slow synchronous handler in one request degrades latency for every other concurrent request.",
          },
          {
            q: "What changed about `Promise` microtask ordering and `process.nextTick` across Node versions — why should you not rely on subtle ordering?",
          },
        ],
      },
      {
        id: "node-async-patterns",
        number: 6,
        numLabel: "6b",
        title: "Node.js — Async Patterns: Callbacks, Promises, async/await",
        questions: [
          {
            q: "The error-first callback convention — what is the signature, and why does the error come first?",
          },
          {
            q: "What is \"callback hell\" / the pyramid of doom, and what are three ways out (named functions, promises, async/await)?",
          },
          {
            q: "How does error handling differ across callbacks, promises (`.catch`), and `async/await` (`try/catch`)?",
          },
          {
            q: "Why does a `throw` inside a bare callback (not promise-wrapped) crash the process instead of being catchable by the caller?",
          },
          {
            q: "`util.promisify` — what contract must a function follow for it to work, and what is `util.promisify.custom`?",
          },
          {
            q: "`Promise.all` vs `Promise.allSettled` vs `Promise.race` vs `Promise.any` — behaviour on the first rejection and the return shape of each.",
          },
          {
            q: "With `Promise.all`, one of ten calls rejects — what happens to the other nine in-flight promises?",
          },
          {
            q: "How do you run N async tasks with a concurrency limit of K (hand-rolled pool, or `p-limit`)?",
          },
          {
            q: "`for...of` with `await` inside vs `array.map(async ...)` + `Promise.all` — sequential vs parallel, and when do you want each?",
          },
          {
            q: "Why is `array.forEach(async ...)` a bug for sequential async work, and what does it actually do?",
          },
          {
            q: "What is an unhandled promise rejection, what does modern Node do on one (`--unhandled-rejections=throw`), and how do you catch them globally?",
          },
          {
            q: "What is a floating promise, and how does `no-floating-promises` (TS/ESLint) catch it?",
          },
          {
            q: "Why is mixing `await` and `.then()` on the same chain a readability / error-handling hazard?",
          },
          {
            q: "How do you add a timeout to a promise that has no native timeout (`Promise.race` with a timer, or `AbortSignal.timeout`)?",
          },
          {
            q: "What is `AbortController` / `AbortSignal`, and how do you use it to cancel `fetch`, timers, and streams?",
          },
          {
            q: "How do you retry an async operation with exponential backoff and jitter, and how do you cap total attempts / total time?",
          },
          {
            q: "What is the difference between returning a promise from an async function and `await`-ing it before returning (`return p` vs `return await p`) — does it matter for stack traces / try-catch?",
          },
          {
            q: "How do you convert an EventEmitter-based flow (e.g., a stream) into an async iterator you can `for await ... of`?",
          },
          {
            q: "Sequential vs batched processing of a large array of async jobs — how do you avoid opening 10,000 DB connections at once?",
          },
          {
            q: "What are async generators, and give a real use case (paginating an API, streaming DB rows)?",
          },
          {
            q: "Why can a synchronous exception thrown before the first `await` in an async function behave differently from a rejection after an `await`?",
          },
          {
            q: "How do you memoize an in-flight async call so concurrent callers share one promise (cache the promise, not the result)?",
          },
        ],
      },
      {
        id: "node-streams-buffers-files",
        number: 6,
        numLabel: "6c",
        title: "Node.js — Streams, Buffers & File I/O",
        questions: [
          {
            q: "The four stream types — Readable, Writable, Duplex, Transform — with one concrete Node example of each.",
          },
          {
            q: "What is backpressure, and how does `pipe()` (or `pipeline()`) handle it for you?",
          },
          {
            q: "Flowing vs paused mode for a Readable — what switches between them (`data` listener, `pause()`, `resume()`, `read()`)?",
          },
          {
            q: "`stream.pipeline()` vs `.pipe()` — why is `pipeline` preferred (error propagation, cleanup)?",
          },
          {
            q: "How do you write a Transform stream (e.g., CSV line parser, gzip, redaction) — the `_transform` and `_flush` methods?",
          },
          {
            q: "How do you process a file larger than RAM line-by-line (`readline`, or a split Transform) without buffering it all?",
          },
          {
            q: "Buffer vs string — when does encoding matter, and what bug appears if a multi-byte UTF-8 character is split across two chunks?",
          },
          {
            q: "`Buffer.alloc` vs `Buffer.allocUnsafe` vs `Buffer.from` — why is `allocUnsafe` unsafe and when is it fine?",
          },
          {
            q: "How do you stream a file upload straight to disk or to S3 without holding it in memory (`req` is a Readable stream)?",
          },
          {
            q: "How do you stream a large response to the client (`res` is a Writable) — e.g., a CSV export of millions of rows?",
          },
          {
            q: "`highWaterMark` — what does it control, and how does tuning it trade memory for throughput?",
          },
          {
            q: "How do errors propagate through a pipe chain, and why can an unhandled error in one stream leak file descriptors?",
          },
          {
            q: "`fs.readFile` vs `fs.createReadStream` — memory profile and when each is correct.",
          },
          {
            q: "`fs.promises` vs callback `fs` vs `fs.*Sync` — when is a sync call acceptable (startup config) and when is it a crime (request path)?",
          },
          {
            q: "How do you safely write a file so a crash mid-write can't corrupt it (write to temp + atomic rename)?",
          },
          {
            q: "What is `for await (const chunk of readable)` and how does it simplify stream consumption?",
          },
          {
            q: "How do you compose gzip + encryption + a network write as one pipeline, and where do you put error handling?",
          },
          {
            q: "How would you implement a rate-limited / throttled stream (bytes per second)?",
          },
        ],
      },
      {
        id: "node-modules-npm",
        number: 6,
        numLabel: "6d",
        title: "Node.js — Modules, npm & Packaging",
        questions: [
          {
            q: "CommonJS vs ES Modules — `require`/`module.exports` vs `import`/`export`, sync vs async loading, and `__dirname` availability.",
          },
          {
            q: "How does `require` resolution work — core module, relative path, then `node_modules` walk-up? What does `require.cache` do?",
          },
          {
            q: "Why is a CJS module's `exports` a live-ish object but ESM exports are live bindings — what breaks when you reassign `module.exports` late?",
          },
          {
            q: "How do you use ESM in a package (`\"type\": \"module\"`, `.mjs`), and how do you interop with a CJS-only dependency?",
          },
          {
            q: "What is the `exports` map in `package.json`, and how does it let you define conditional / subpath entry points?",
          },
          {
            q: "`dependencies` vs `devDependencies` vs `peerDependencies` vs `optionalDependencies` — what goes where?",
          },
          {
            q: "Semver ranges: `^1.2.3` vs `~1.2.3` vs `1.2.x` vs pinned — what each allows on `npm install`.",
          },
          {
            q: "What does `package-lock.json` guarantee, and what's the difference between `npm install` and `npm ci`?",
          },
          {
            q: "What is a phantom / undeclared dependency, and why does it work locally then break in CI or Docker?",
          },
          {
            q: "`npx` — what does it actually do, and what's the security consideration with running arbitrary packages?",
          },
          {
            q: "How do npm workspaces (or pnpm / Yarn / Nx / Turborepo) structure a monorepo of multiple services, and what does hoisting do?",
          },
          {
            q: "What are `preinstall` / `postinstall` scripts, and why are they a supply-chain risk (`--ignore-scripts`)?",
          },
          {
            q: "`npm audit` — what does it check, and how do you triage a transitive vulnerability you can't directly upgrade (`overrides`)?",
          },
          {
            q: "How do you publish a package — `files` allowlist, `.npmignore`, `prepublishOnly`, `npm pack` to inspect the tarball?",
          },
          {
            q: "How do you ship a TypeScript library — `types`/`typesVersions`, `.d.ts` output, dual CJS+ESM build?",
          },
          {
            q: "What is `engines` in `package.json`, and how do you enforce a Node version in CI and locally (`.nvmrc`, Volta)?",
          },
        ],
      },
      {
        id: "node-express-http-apis",
        number: 6,
        numLabel: "6e",
        title: "Node.js — Express & HTTP API Building",
        questions: [
          {
            q: "The Express middleware chain — signature `(req, res, next)`, calling `next()` vs `next(err)` vs sending a response, and what happens if you forget `next()`.",
          },
          {
            q: "Error-handling middleware — the four-arg signature `(err, req, res, next)` — where must it sit in the chain and how do you forward async errors to it (pre-Express-5 vs Express 5)?",
          },
          {
            q: "`app.use` vs `router` — how do you structure a large API into feature routers, and how does mount-path prefixing work?",
          },
          {
            q: "Route matching order — how does Express pick a handler, and what's the gotcha with `/users/:id` vs `/users/me`?",
          },
          {
            q: "`req.params` vs `req.query` vs `req.body` — what parses each, and why isn't `req.body` populated without `express.json()`?",
          },
          {
            q: "How do you set a body-size limit, and why does it matter for DoS protection?",
          },
          {
            q: "How do you validate and coerce request input — Zod / Joi / class-validator — and where in the chain does validation belong?",
          },
          {
            q: "How do you return consistent error responses (an error shape, a status-code mapping, a base `AppError` class)?",
          },
          {
            q: "What does `res.json()` do that `res.send()` doesn't, and how do you set status + headers correctly?",
          },
          {
            q: "Idempotency keys — how do you implement middleware that short-circuits a replayed POST with the same key?",
          },
          {
            q: "How do you implement request-scoped context (a correlation ID available everywhere) with `AsyncLocalStorage`?",
          },
          {
            q: "How do you handle CORS correctly — preflight, credentials, allowed origins — and what's the risk of `origin: '*'` with cookies?",
          },
          {
            q: "How do you attach and enforce authentication middleware, and how do you make some routes public and others protected cleanly?",
          },
          {
            q: "How do you implement pagination on a list endpoint (offset vs keyset), and what do you return in the response envelope?",
          },
          {
            q: "How do you stream a large response (NDJSON / CSV) instead of building a giant array in memory?",
          },
          {
            q: "How do you implement graceful shutdown — stop accepting connections, drain in-flight requests, close DB pool, hard-exit after a timeout?",
          },
          {
            q: "Express vs Fastify vs Nest vs raw `http` — what does each buy you, and when would you pick Fastify for performance?",
          },
          {
            q: "What is the role of a reverse proxy (Nginx) in front of Node — TLS termination, compression, static files, buffering slow clients — and what is `trust proxy`?",
          },
          {
            q: "How do you handle file uploads (`multer`) — memory vs disk storage, size/type limits, and streaming to object storage?",
          },
          {
            q: "How do you version an HTTP API (URL segment vs header vs `Accept` param), and how do you deprecate a version without breaking clients?",
          },
          {
            q: "How do you set security headers (Helmet) and why does each matter (HSTS, `X-Content-Type-Options`, CSP)?",
          },
          {
            q: "How do you implement per-route and per-user rate limiting, and why is an in-memory limiter wrong behind multiple instances?",
          },
          {
            q: "How do you add request timeouts — server `headersTimeout` / `requestTimeout`, and per-handler deadlines for downstream calls?",
          },
          {
            q: "How do you generate and serve OpenAPI/Swagger docs, and why does the contract matter to frontend teams?",
          },
        ],
      },
      {
        id: "node-errors-logging-debugging",
        number: 6,
        numLabel: "6f",
        title: "Node.js — Errors, Logging & Debugging",
        questions: [
          {
            q: "`uncaughtException` vs `unhandledRejection` — what should your handler actually do (log + graceful exit, not \"keep running\")?",
          },
          {
            q: "Why is it dangerous to swallow `uncaughtException` and continue serving requests?",
          },
          {
            q: "How do you design a custom error hierarchy (`AppError`, `NotFoundError`, `ValidationError`) with a status code and an `isOperational` flag?",
          },
          {
            q: "Operational errors vs programmer errors — how do you treat each differently?",
          },
          {
            q: "Why do you lose the stack trace across async boundaries sometimes, and what is `--async-stack-traces` / `Error.captureStackTrace`?",
          },
          {
            q: "Structured logging (pino / winston) vs `console.log` — JSON logs, log levels, and why `console.log` is synchronous-ish and can block.",
          },
          {
            q: "What is a correlation/trace ID, how do you generate one per request, and how do you thread it through every log line (`AsyncLocalStorage`)?",
          },
          {
            q: "How do you redact secrets / PII (tokens, card numbers, passwords) from logs automatically?",
          },
          {
            q: "How do you take and analyze a heap snapshot to find a memory leak — what does \"retained size\" and a growing object count tell you?",
          },
          {
            q: "Common Node memory-leak causes — module-scope arrays/maps that only grow, un-removed event listeners, closures over big objects, timers never cleared.",
          },
          {
            q: "How do you profile CPU — `--prof`, `--cpu-prof`, `clinic flame`, `0x` — and read a flame graph?",
          },
          {
            q: "How do you attach a debugger (`--inspect`, `--inspect-brk`, Chrome DevTools / VS Code) to a running service?",
          },
          {
            q: "`MaxListenersExceededWarning` — what causes it and how do you fix the root cause rather than raising the limit?",
          },
          {
            q: "How do you detect and act on event-loop blocking in production (a watchdog, `blocked-at`, APM alerts)?",
          },
          {
            q: "How do you wire an APM / error tracker (OpenTelemetry, Sentry) into a Node service, and what do traces give you that logs don't?",
          },
          {
            q: "How do you reproduce and debug a bug that only happens under load or only in production?",
          },
        ],
      },
      {
        id: "node-performance-concurrency",
        number: 6,
        numLabel: "6g",
        title: "Node.js — Performance, Concurrency & Scaling",
        questions: [
          {
            q: "`cluster` vs `worker_threads` vs `child_process` — memory model, communication, and the right job for each.",
          },
          {
            q: "When does `cluster` (or a process manager running N instances) help, and when does it not (I/O-bound vs CPU-bound)?",
          },
          {
            q: "How do worker threads share memory (`SharedArrayBuffer`, `MessagePort`, `workerData`), and what gets structured-cloned vs transferred?",
          },
          {
            q: "You have a CPU-heavy task (PDF generation, image resize, crypto, big aggregation) — how do you keep it off the main loop?",
          },
          {
            q: "How do you build and reuse a worker-thread pool instead of spawning a worker per task (`piscina`)?",
          },
          {
            q: "`child_process.spawn` vs `exec` vs `execFile` vs `fork` — buffering, shell injection risk, and when to use each.",
          },
          {
            q: "Why is `exec` with interpolated user input a command-injection hole, and what's the safe alternative?",
          },
          {
            q: "How does a load balancer + N stateless Node instances scale horizontally, and what must you NOT keep in process memory (sessions, rate-limit counters, caches)?",
          },
          {
            q: "How do you find a bottleneck — is it CPU, event-loop lag, GC, a slow downstream, or connection-pool exhaustion? What signal points to each?",
          },
          {
            q: "How does the V8 garbage collector work at a high level (young/old generation, scavenge vs mark-sweep), and what causes long GC pauses?",
          },
          {
            q: "`--max-old-space-size` — when do you raise it, and why is raising it usually treating a symptom?",
          },
          {
            q: "How do you keep HTTP keep-alive connections and a connection pool healthy for a service making many downstream calls (`http.Agent`, `keepAlive`)?",
          },
          {
            q: "How do you cap concurrency to a slow downstream so your service degrades gracefully instead of piling up requests?",
          },
          {
            q: "What is a circuit breaker, and how would you add one around a flaky dependency in Node (`opossum`)?",
          },
          {
            q: "How do you benchmark an endpoint (autocannon / k6) and interpret p50/p95/p99 and throughput under increasing concurrency?",
          },
          {
            q: "What common patterns waste CPU in a hot path (JSON.parse/stringify of huge payloads, `JSON` deep-clone, sync crypto, `moment`, regex)?",
          },
          {
            q: "How do you cache computed results in-process safely (LRU with a size cap and TTL) vs pushing the cache to Redis?",
          },
          {
            q: "What is `AsyncLocalStorage`'s performance cost, and is it acceptable for per-request context?",
          },
        ],
      },
      {
        id: "node-security",
        number: 6,
        numLabel: "6h",
        title: "Node.js — Security",
        questions: [
          {
            q: "How do you prevent SQL / NoSQL injection in Node — parameterized queries, query builders, and never string-concatenating user input?",
          },
          {
            q: "What is a NoSQL injection via an object body (`{ \"$gt\": \"\" }`), and how do you stop it (sanitize, cast types, `mongo-sanitize`)?",
          },
          {
            q: "Command injection through `child_process` — the vulnerable pattern and the fix (`execFile` with an args array, allowlists).",
          },
          {
            q: "How do you validate and normalize all external input at the edge, and why is \"validate at the boundary\" a security principle, not just a correctness one?",
          },
          {
            q: "Prototype pollution — what is it, how does a malicious `__proto__` in a JSON body cause it, and how do you defend (`Object.create(null)`, schema validation, `--disable-proto`)?",
          },
          {
            q: "How do you store passwords — bcrypt / argon2id, per-user salt, a work factor you can raise over time — and why never a fast hash (MD5/SHA-256)?",
          },
          {
            q: "How do you generate secure random values (`crypto.randomBytes`, `crypto.randomUUID`) and why is `Math.random()` not acceptable for tokens?",
          },
          {
            q: "How do you compare secrets / HMACs in constant time (`crypto.timingSafeEqual`) and why does `===` leak?",
          },
          {
            q: "How do you verify an inbound webhook — HMAC signature over the raw body, timestamp tolerance, replay protection — and why must you use the raw bytes not the parsed JSON?",
          },
          {
            q: "How do you keep secrets out of the repo and out of logs — env vars, a secrets manager / Vault, `.env` only for local, and 12-factor config?",
          },
          {
            q: "SSRF — how could an \"import from URL\" or an image-proxy feature be abused to hit internal metadata endpoints, and how do you restrict it?",
          },
          {
            q: "Path traversal — how does `../../etc/passwd` sneak through a file-download endpoint, and how do you normalize and confine paths?",
          },
          {
            q: "Rate limiting and account lockout as defenses against credential stuffing and brute force — where do you apply them and what are the trade-offs?",
          },
          {
            q: "Supply-chain risk — lockfiles, `npm ci`, `--ignore-scripts`, provenance, Dependabot/Renovate, and minimizing dependency count.",
          },
          {
            q: "What does Helmet set, and which headers matter most for an API vs a server-rendered app (CSP, HSTS, `X-Frame-Options`)?",
          },
          {
            q: "How do you handle regex denial of service (ReDoS) — spotting catastrophic backtracking and using safe patterns or a timeout?",
          },
        ],
      },
      {
        id: "node-testing",
        number: 6,
        numLabel: "6i",
        title: "Node.js — Testing",
        questions: [
          {
            q: "Unit vs integration vs end-to-end for a Node API — what does each cover and what's a sane ratio?",
          },
          {
            q: "The built-in `node:test` runner vs Jest vs Vitest vs Mocha — trade-offs (ESM support, speed, mocking, watch).",
          },
          {
            q: "How do you mock a module dependency — `jest.mock`, `sinon`, or dependency injection — and why is DI easier to test than a hard `require`?",
          },
          {
            q: "How do you test an Express route handler in isolation — call it with fake `req`/`res`, or hit it through `supertest`?",
          },
          {
            q: "How do you mock the database layer — an in-memory fake, a repository interface, or `testcontainers` for a real DB?",
          },
          {
            q: "How do you test time-dependent code (`setTimeout`, TTLs, `Date.now()`) — fake timers and injectable clocks?",
          },
          {
            q: "How do you test code that uses randomness or UUIDs deterministically?",
          },
          {
            q: "How do you test retry / backoff logic without actually sleeping for seconds?",
          },
          {
            q: "How do you assert on emitted events, streamed output, or async iteration in a test?",
          },
          {
            q: "What makes a Node test flaky (real network, shared global state, unclosed handles, order dependence, real timers), and how do you find leaked handles (`--detectOpenHandles`)?",
          },
          {
            q: "How do you write an integration test that spins up the app, seeds a DB, runs requests, and tears down cleanly?",
          },
          {
            q: "What does code coverage miss — why can 100% line coverage still let a bug through?",
          },
          {
            q: "How do you structure test data / fixtures / factories so tests stay readable as they grow?",
          },
          {
            q: "How do you run tests in CI — parallelism, a fresh DB per shard, and keeping them under a few minutes?",
          },
        ],
      },
      {
        id: "node-data-access-caching",
        number: 6,
        numLabel: "6j",
        title: "Node.js — Databases, Caching & Data Access",
        questions: [
          {
            q: "Why does a connection pool matter, what happens when it's exhausted, and how do you size `min`/`max` for a given instance count?",
          },
          {
            q: "How do you run a multi-statement DB transaction correctly in Node (acquire a client, `BEGIN`/`COMMIT`/`ROLLBACK`, always release in `finally`)?",
          },
          {
            q: "Prisma vs TypeORM vs Sequelize vs Knex vs raw driver — what does each abstraction cost and buy you?",
          },
          {
            q: "What is the ORM N+1 problem in a Node API, how do you detect it (query logging), and how do you fix it (eager load / join / dataloader)?",
          },
          {
            q: "What is `DataLoader`, and how does per-request batching + caching solve N+1 in a GraphQL resolver?",
          },
          {
            q: "How do you paginate a large result set from Node without loading it all — cursor/keyset queries and streaming rows?",
          },
          {
            q: "How do you handle migrations in a Node deploy (a migration tool, run-on-boot vs a separate step, and backward-compatible changes for zero downtime)?",
          },
          {
            q: "Where do you add caching — in front of the DB (Redis read-through), in-process LRU, or HTTP caching — and how do you invalidate on write?",
          },
          {
            q: "Cache-aside vs write-through in a Node service — show the read and write path and the failure modes (stale data, thundering herd).",
          },
          {
            q: "How do you prevent a cache stampede when a hot key expires (lock / single-flight / probabilistic early expiry)?",
          },
          {
            q: "How do you use Redis for more than caching in Node — rate limiting, a distributed lock, a queue, pub/sub — and the caveats of each (Redlock debate)?",
          },
          {
            q: "How do you keep money-related reads correct under concurrency from Node — `SELECT ... FOR UPDATE`, optimistic version columns, or serializable isolation with retry?",
          },
          {
            q: "How do you retry a transient DB error (deadlock, connection reset) safely, and which errors must you NOT retry?",
          },
          {
            q: "How do you avoid leaking DB clients / handles on the error path, and how do you spot it in production (pool wait time climbing)?",
          },
          {
            q: "How would you implement a transactional outbox in a Node service so an event is published if and only if the DB write commits?",
          },
          {
            q: "How do you talk to a message broker from Node (Kafka / RabbitMQ / SQS) — consumer acking, at-least-once, and making the handler idempotent?",
          },
        ],
      },
      {
        id: "node-auth-sessions",
        number: 6,
        numLabel: "6k",
        title: "Node.js — Authentication & Sessions",
        questions: [
          {
            q: "Session-cookie auth vs stateless JWT in a Node API — where is state kept, how do you revoke, and how does each scale across instances?",
          },
          {
            q: "How do you implement server-side sessions (`express-session` + a Redis store) — cookie flags (`httpOnly`, `secure`, `sameSite`), TTL, and rolling sessions?",
          },
          {
            q: "How do you issue and verify a JWT in Node (`jsonwebtoken` / `jose`) — signing algorithm, `exp`/`iat`/`aud`/`iss`, and clock tolerance?",
          },
          {
            q: "Why must you pin the `algorithms` list when verifying a JWT, and what is the `alg: none` / algorithm-confusion attack?",
          },
          {
            q: "HS256 vs RS256 in a multi-service setup — who holds the secret vs the public key, and how do you rotate keys (a JWKS endpoint, `kid`)?",
          },
          {
            q: "Access token + refresh token flow in Node — storage on the client, refresh rotation, reuse detection, and \"logout everywhere\".",
          },
          {
            q: "When 5 concurrent requests all get a 401 and try to refresh at once, how do you single-flight the refresh on the client and/or server?",
          },
          {
            q: "How do you build role/permission checks as middleware (RBAC), and how do you avoid scattering `if (user.role === ...)` everywhere?",
          },
          {
            q: "How do you implement API-key auth for machine clients — hashing keys at rest, scoping, rotation, and rate limiting per key?",
          },
          {
            q: "OAuth2 authorization-code + PKCE flow — what does a Node backend-for-frontend actually do in each step (`passport`, or hand-rolled)?",
          },
          {
            q: "OAuth2 client-credentials flow for service-to-service — how do you fetch, cache, and refresh the token before it expires?",
          },
          {
            q: "CSRF — when is a Node API actually vulnerable (cookie auth) vs not (bearer token), and what's the mitigation (SameSite, CSRF token, double-submit)?",
          },
          {
            q: "How do you add step-up auth / MFA for a sensitive action even though the user already has a valid session?",
          },
          {
            q: "How do you store and verify TOTP secrets, and how do you rate-limit OTP verification to stop brute force?",
          },
        ],
      },
      {
        id: "node-practical-extended",
        number: 6,
        numLabel: "6l",
        title: "Node.js — Practical Build Tasks (Extended)",
        questions: [
          {
            q: "Build a CSV-to-DB import that streams a multi-GB file, validates each row, batches inserts, skips + reports bad rows, and is resumable.",
          },
          {
            q: "Build a large data export endpoint that streams NDJSON/CSV to the client without buffering, with a DB cursor.",
          },
          {
            q: "Implement an in-memory job queue with concurrency limit, retry with exponential backoff, and a dead-letter list.",
          },
          {
            q: "Implement token-bucket rate-limiting middleware from scratch (no library), then adapt it to be Redis-backed for multiple instances.",
          },
          {
            q: "Implement idempotency-key middleware backed by Redis: first request runs, replays return the stored response, concurrent replays wait.",
          },
          {
            q: "Implement graceful shutdown: stop the listener, finish in-flight requests, close DB + Redis, force-exit after a timeout, handle `SIGTERM`/`SIGINT`.",
          },
          {
            q: "Build request-context propagation with `AsyncLocalStorage` so every log line and downstream call carries the correlation ID.",
          },
          {
            q: "Build a worker-thread pool that offloads a CPU-heavy transform and returns results without blocking the API.",
          },
          {
            q: "Build a webhook receiver: verify HMAC over the raw body, dedupe by event ID, handle out-of-order delivery, ack fast and process async.",
          },
          {
            q: "Build an outgoing webhook sender with retries, exponential backoff, a max-attempts cap, and disabling of permanently-failing endpoints.",
          },
          {
            q: "Build a `fetch` wrapper with timeout (`AbortSignal`), retry on 5xx/network, circuit breaker, and structured error mapping.",
          },
          {
            q: "Build a money-transfer endpoint: DB transaction, row locking or optimistic concurrency, idempotency key, and a compensating action on partial failure.",
          },
          {
            q: "Build a WebSocket server that authenticates the connection, tracks clients, broadcasts, and cleans up on disconnect + heartbeats.",
          },
          {
            q: "Build a caching layer for a read-heavy endpoint with single-flight (no stampede), TTL, and explicit invalidation on write.",
          },
        ],
      },
      {
        id: "aspnet-theoretical",
        number: 7,
        title: "ASP.NET Core Web API — Theoretical",
        questions: [
          {
            q: "Explain the ASP.NET Core middleware pipeline. Does order matter? Give an example where it does.",
          },
          {
            q: "Explain DI lifetimes: Transient, Scoped, Singleton. What is the \"captive dependency\" problem?",
          },
          {
            q: "EF Core change tracking — what does `AsNoTracking()` do and when should you use it? Eager vs lazy vs explicit loading?",
          },
          {
            q: "How do EF Core migrations work? How do you handle migrations safely in a production deployment?",
          },
          {
            q: "How would you implement JWT authentication in a Web API? Explain token issuance, validation, refresh tokens, and claims-based authorization.",
          },
          {
            q: "Middleware vs filters vs attributes — how are they different and when do you use each?",
          },
          {
            q: "How does model binding work? What does `[ApiController]` do automatically for validation?",
          },
          { q: "How do you centralize exception handling? What is `ProblemDetails`?" },
          {
            q: "How do you configure CORS properly, and where in the pipeline does it need to sit?",
          },
          {
            q: "What are the API versioning strategies (URL segment, query string, header)? Trade-offs?",
          },
          {
            q: "Caching in ASP.NET Core — in-memory (`IMemoryCache`) vs distributed (Redis) vs output caching. How do you invalidate a cache entry?",
          },
          {
            q: "What is `IHostedService`/`BackgroundService` used for? Give a real use case.",
          },
          {
            q: "Explain the Options pattern (`IOptions<T>`, `IOptionsSnapshot<T>`, `IOptionsMonitor<T>`) for configuration.",
          },
          {
            q: "Why use structured logging (e.g., Serilog) over `Console.WriteLine`? What is a correlation ID and why does it matter?",
          },
          {
            q: "How do you unit test a controller/service that depends on EF Core? What's the role of `WebApplicationFactory` in integration tests?",
          },
          { q: "Minimal APIs vs Controller-based APIs — trade-offs?" },
          {
            q: "Async/await best practices in ASP.NET Core — how can misusing `async` cause a deadlock, and what does `ConfigureAwait` do?",
          },
          { q: "What are health checks and why are they important in production?" },
          {
            q: "How does the built-in .NET rate limiter work (fixed window, sliding window, token bucket, concurrency limiter)?",
          },
          {
            q: "Repository pattern on top of EF Core — pros and cons? Is it always necessary?",
          },
          { q: "gRPC vs REST in a .NET context — when would you pick gRPC?" },
          {
            q: "What is SignalR used for? High-level explanation of how it maintains a real-time connection (WebSockets fallback chain).",
          },
          {
            q: "How do you secure sensitive configuration (connection strings, API keys) in ASP.NET Core (User Secrets, Key Vault, environment variables)?",
          },
          {
            q: "Explain optimistic concurrency control in EF Core (`RowVersion`/concurrency tokens) — why does it matter for something like an account balance update?",
          },
          {
            q: "Kestrel vs IIS — what's Kestrel's role, and what does a reverse proxy (IIS/Nginx) add in front of it?",
          },
          {
            q: "In-process vs out-of-process hosting model on IIS — what's the difference?",
          },
          {
            q: "How do you containerize an ASP.NET Core API with Docker? What goes in a typical multi-stage Dockerfile?",
          },
          {
            q: "How do you generate and use Swagger/OpenAPI docs for a Web API, and why does that matter for frontend/consumer teams?",
          },
          {
            q: "Response compression and output caching in ASP.NET Core — when do they help vs hurt?",
          },
          {
            q: "How does culture/localization work in ASP.NET Core for a multi-region fintech product (currency formatting, decimal separators)?",
          },
          {
            q: "What's the difference between `IActionResult`, `ActionResult<T>`, and returning a POCO directly from a controller action?",
          },
          {
            q: "How would you implement request/response logging without leaking sensitive fields (card numbers, tokens) into logs?",
          },
        ],
      },
      {
        id: "aspnet-practical",
        number: 8,
        title: "ASP.NET Core Web API — Practical / Technical Round",
        questions: [
          {
            q: "Scaffold a Web API controller with full EF Core CRUD for one entity, from a blank project.",
          },
          {
            q: "Implement JWT authentication end-to-end: issue a token on login, protect an endpoint with `[Authorize]`, add role-based authorization.",
          },
          {
            q: "Write custom middleware that logs request method, path, and response time.",
          },
          {
            q: "You're given a deliberately N+1 EF Core query — fix it using `Include()` or a projection.",
          },
          {
            q: "Implement a `BackgroundService` that polls a queue/table every N seconds and processes new items.",
          },
          {
            q: "Set up global exception-handling middleware that returns a consistent JSON error response.",
          },
          {
            q: "Write an integration test for an API endpoint using `WebApplicationFactory`.",
          },
          {
            q: "Implement optimistic concurrency control on an entity update (e.g., prevent two concurrent updates from silently overwriting a wallet balance).",
          },
          {
            q: "Configure and use distributed caching (Redis) for a read-heavy endpoint, with a sensible invalidation strategy.",
          },
          {
            q: "Design and implement a money-transfer endpoint with proper transaction handling and idempotency-key support (same request replayed shouldn't double-transfer).",
          },
          {
            q: "Implement pagination (keyset-based) on a large transactions list endpoint.",
          },
          {
            q: "Add FluentValidation (or data annotations) to validate a complex request DTO with nested objects.",
          },
          {
            q: "Implement API versioning for an existing controller without breaking existing consumers.",
          },
          {
            q: "Add a health check endpoint that verifies both the database and a downstream dependency are reachable.",
          },
          {
            q: "Write a Dockerfile for the API and get it running with `docker run`, including environment-based configuration.",
          },
        ],
      },
    ],
  },
  {
    id: "part-b",
    label: "Part B",
    title: "System Design & Architecture",
    categories: [
      {
        id: "system-design-theoretical",
        number: 9,
        title: "System Design (Intermediate, Fintech-Flavored) — Theoretical",
        questions: [
          {
            q: "How does a load balancer decide where to route traffic? Explain L4 vs L7 load balancing and common algorithms (round robin, least connections, weighted).",
          },
          {
            q: "Explain caching strategies: cache-aside, write-through, write-behind. How and when do you invalidate?",
          },
          {
            q: "How do you scale a database — replication vs sharding? What is replication lag and why does it matter?",
          },
          {
            q: "Explain CAP theorem and how it applies to real distributed systems (given partitions are inevitable, what's the actual trade-off?).",
          },
          {
            q: "Why use a message queue between services? At-least-once vs exactly-once vs at-most-once delivery — what's realistically achievable?",
          },
          {
            q: "What is idempotency and why is it critical in payment APIs? How do you implement an idempotency key?",
          },
          {
            q: "Explain rate-limiting algorithms: token bucket, leaky bucket, fixed window, sliding window log/counter.",
          },
          {
            q: "What is the saga pattern for distributed transactions? Choreography vs orchestration?",
          },
          { q: "What does an API Gateway do in a microservices architecture?" },
          {
            q: "Strong consistency vs eventual consistency — when is eventual consistency acceptable, and when is it not (e.g., account balance)?",
          },
          {
            q: "How do you design for high availability — failover, redundancy, circuit breakers, retries with backoff?",
          },
          {
            q: "What is event-driven architecture? Briefly explain event sourcing and CQRS.",
          },
          {
            q: "How do you handle a distributed transaction that spans multiple services/databases without a 2-phase commit?",
          },
          {
            q: "How would you design an immutable audit trail / ledger for financial transactions?",
          },
          {
            q: "How do you prevent double-spending / race conditions when two requests try to debit the same account balance simultaneously?",
          },
          { q: "What is a circuit breaker pattern and when does it trip?" },
          {
            q: "How would you design a system to be resilient to a downstream payment provider being slow or down?",
          },
          {
            q: "What is consistent hashing and where is it used (e.g., distributed caching, sharding)?",
          },
          {
            q: "What role does a CDN play, and what would/wouldn't you put behind one in a fintech app?",
          },
          {
            q: "Explain DNS resolution at a level relevant to system design (why DNS matters for failover/latency).",
          },
          {
            q: "What is service discovery in a microservices setup, and why do you need it?",
          },
          {
            q: "What's the difference between horizontal and vertical scaling, and where does each hit a wall?",
          },
          {
            q: "How do you estimate capacity for a system (back-of-envelope: requests/sec, storage growth, bandwidth)?",
          },
          {
            q: "What is a bulkhead pattern, and how does it prevent one failing dependency from taking down the whole system?",
          },
        ],
      },
      {
        id: "system-design-practical",
        number: 10,
        title: "System Design — Practical (Design Exercises)",
        questions: [
          {
            q: "Design a digital wallet system: deposit, withdraw, transfer between users, balance check.",
          },
          {
            q: "Design a payment gateway integration layer that handles retries and idempotency correctly.",
          },
          { q: "Design a rate limiter for a public-facing API." },
          {
            q: "Design a transaction notification system (email/SMS/push) triggered on account activity.",
          },
          {
            q: "Design a high-level real-time fraud-flagging pipeline for incoming transactions.",
          },
          { q: "Design a URL shortener (classic warm-up system design question)." },
          {
            q: "Design a scalable transaction-history/ledger query system that stays fast as data grows (pagination, indexing, archiving strategy).",
          },
          {
            q: "Design a nightly reconciliation system that compares transaction records between two services and flags mismatches.",
          },
          {
            q: "Design the backend for a bill-split / group-expense feature (think Splitwise-style) with correct balance calculations.",
          },
          {
            q: "Design a system for scheduled/recurring payments (e.g., subscriptions or standing instructions).",
          },
          {
            q: "Design a KYC/document-upload and verification workflow (upload, virus-scan, review queue, status tracking).",
          },
          {
            q: "Design a system that enforces daily/monthly transaction limits per user across multiple concurrent requests.",
          },
          {
            q: "Design an audit-log service that every other microservice writes to, without becoming a bottleneck.",
          },
          {
            q: "Design a notification/alerting system for suspicious login attempts across multiple devices.",
          },
        ],
      },
      {
        id: "microservices-patterns",
        number: 11,
        title: "Microservices Architecture Patterns",
        questions: [
          {
            q: "Monolith vs microservices — what specific problems does splitting up actually solve, and what does it cost you?",
          },
          {
            q: "How do you handle shared data/config between microservices without tight coupling?",
          },
          {
            q: "Database-per-service vs shared database — trade-offs, and why is shared database usually discouraged?",
          },
          {
            q: "How do you handle versioned contracts between services (backward compatibility of APIs/events)?",
          },
          {
            q: "What is the strangler fig pattern for migrating a monolith to microservices?",
          },
          {
            q: "How do you trace a single request as it flows across 5 microservices (distributed tracing, correlation/trace IDs)?",
          },
          { q: "What is an anti-corruption layer, and when would you build one?" },
          {
            q: "How do you handle a partial failure where 2 of 3 services in a workflow succeeded and one failed?",
          },
        ],
      },
      {
        id: "message-brokers",
        number: 12,
        title: "Message Brokers (Kafka / RabbitMQ)",
        questions: [
          {
            q: "Kafka vs RabbitMQ — fundamental differences (log-based vs traditional queue) and when you'd pick each.",
          },
          {
            q: "What is a Kafka topic, partition, and consumer group? How does partitioning affect ordering guarantees?",
          },
          {
            q: "What is message ordering, and how do you guarantee order per key in Kafka?",
          },
          {
            q: "What happens when a consumer crashes mid-processing — how do you avoid losing or duplicating a message?",
          },
          { q: "What is a dead-letter queue, and how do you use one?" },
          {
            q: "Explain \"at-least-once\" delivery and why consumers need to be idempotent as a result.",
          },
        ],
      },
    ],
  },
  {
    id: "part-c",
    label: "Part C",
    title: "Data Structures & Algorithms",
    categories: [
      {
        id: "dsa-theoretical",
        number: 13,
        title: "DSA — Theoretical / Conceptual",
        questions: [
          { q: "Explain Big-O notation and best/worst/average case complexity." },
          {
            q: "Array vs Linked List — trade-offs in access, insertion, deletion.",
          },
          {
            q: "How does a hashmap work internally? How are collisions handled? What is load factor?",
          },
          { q: "Stack vs Queue — real-world use cases for each." },
          { q: "Explain the two-pointer technique with an example problem type." },
          { q: "Explain the sliding window technique with an example problem type." },
          {
            q: "Recursion vs iteration — what's the risk of deep recursion (stack overflow), and when do you prefer one over the other?",
          },
          {
            q: "Compare common sorting algorithms (bubble, insertion, selection, merge, quick, heap) by time/space complexity and stability.",
          },
          {
            q: "BFS vs DFS — differences, and which would you use for shortest path in an unweighted graph?",
          },
          {
            q: "Basic tree concepts — binary tree vs binary search tree, what property must a BST maintain?",
          },
          {
            q: "What is dynamic programming? How do you recognize a problem needs it (overlapping subproblems, optimal substructure)?",
          },
          {
            q: "Greedy vs DP — give an example where a greedy approach fails but DP works.",
          },
          {
            q: "How do you approach an unfamiliar coding problem in an interview (clarify → brute force → optimize)?",
          },
          {
            q: "What is a heap / priority queue, and what operations is it good for?",
          },
          {
            q: "What is a trie, and what kind of problems is it built for (prefix search, autocomplete)?",
          },
          {
            q: "What is backtracking, and how does it differ from plain recursion/brute force?",
          },
          {
            q: "Basic bit-manipulation concepts — how would you check if a number is a power of two, or count set bits?",
          },
          {
            q: "What is Dijkstra's algorithm used for, at a high level, and what's its complexity?",
          },
          {
            q: "What is topological sort, and what kind of problem requires it (e.g., task scheduling with dependencies)?",
          },
        ],
      },
      {
        id: "dsa-practical",
        number: 14,
        title: "DSA — Practical (Problem Patterns to Practice)",
        questions: [
          { q: "Two Sum / pair-sum-equals-target variants." },
          { q: "Longest substring without repeating characters (sliding window)." },
          { q: "Valid parentheses / balanced brackets (stack)." },
          { q: "Merge two sorted arrays or linked lists." },
          { q: "Find the duplicate number in an array." },
          { q: "Reverse a linked list (iterative and recursive)." },
          { q: "Detect a cycle in a linked list (Floyd's cycle detection)." },
          { q: "Binary tree level-order traversal (BFS)." },
          { q: "Find the Kth largest/smallest element in an array." },
          { q: "Group anagrams (hashmap-based grouping)." },
          { q: "Maximum subarray sum (Kadane's algorithm)." },
          { q: "Number of islands / basic grid DFS-BFS problem." },
          { q: "Move zeroes to the end of an array in-place." },
          { q: "Find the missing number in a range 1 to N." },
          {
            q: "Implement LRU cache (combines hashmap + doubly linked list — common in fintech-adjacent interviews too).",
          },
          { q: "Check if a binary tree is balanced / is a valid BST." },
          {
            q: "Find all pairs in an array that sum to a target (variations: unsorted, sorted, with duplicates).",
          },
          { q: "Rotate an array by K positions in-place." },
          {
            q: "Implement a basic rate limiter using a sliding window counter (DSA + system design crossover, common at fintech companies).",
          },
          {
            q: "Merge overlapping intervals (common for scheduling/time-range problems).",
          },
        ],
      },
    ],
  },
  {
    id: "part-d",
    label: "Part D",
    title: "Cross-Cutting Engineering",
    categories: [
      {
        id: "http-rest",
        number: 15,
        title: "HTTP & REST API Design",
        questions: [
          {
            q: "Explain the main HTTP methods (GET, POST, PUT, PATCH, DELETE) and their idempotency/safety guarantees.",
            followups: [
              "Is PUT idempotent? Is POST? Why does that matter for retries?",
            ],
          },
          {
            q: "What are the common HTTP status code ranges, and what do 401 vs 403 actually mean (and how are they different)?",
          },
          {
            q: "What makes an API \"RESTful\"? What is HATEOAS and is it actually used in practice?",
          },
          {
            q: "How do you design good REST resource URLs (nesting, filtering, pagination, sorting conventions)?",
          },
          { q: "What is the difference between PUT and PATCH for a partial update?" },
          { q: "How do you version a public API without breaking existing consumers?" },
          { q: "What is content negotiation (Accept/Content-Type headers)?" },
          {
            q: "How do you design an API to be idempotent for a non-idempotent operation like \"charge a card\"?",
          },
          {
            q: "What is HTTP/2 (or HTTP/3) and what does it improve over HTTP/1.1?",
          },
          {
            q: "Explain CORS from the browser's perspective — preflight requests, what triggers one.",
          },
        ],
      },
      {
        id: "auth",
        number: 16,
        title: "Authentication & Authorization",
        questions: [
          {
            q: "Session-based auth vs token-based (JWT) auth — trade-offs (statelessness, revocation, scaling).",
          },
          {
            q: "What's inside a JWT (header, payload, signature)? Is a JWT encrypted or just signed — what does that mean for sensitive data?",
          },
          {
            q: "How do you handle JWT revocation/logout if JWTs are stateless by design?",
          },
          {
            q: "Access token vs refresh token — why have both? Where should each be stored on the client (and why is localStorage risky for tokens)?",
          },
          {
            q: "Explain OAuth2 at a high level — what problem does it solve, and what are the main grant types (authorization code, client credentials)?",
          },
          {
            q: "OAuth2 vs OpenID Connect — what does OIDC add on top of OAuth2?",
          },
          {
            q: "What is SSO (Single Sign-On) and how does it typically work across multiple apps?",
          },
          {
            q: "Role-based access control (RBAC) vs claims-based / attribute-based access control (ABAC) — differences?",
          },
          {
            q: "How would you implement \"step-up authentication\" for a high-value action (e.g., requiring MFA before a large transfer)?",
          },
          {
            q: "What is CSRF, and how do you protect against it (especially relevant if you use cookies for auth)?",
          },
        ],
      },
      {
        id: "jwt-refresh-edge-cases",
        number: 16,
        numLabel: "16b",
        title: "JWT & Refresh Tokens — Tricky / Edge-Case Questions",
        questions: [
          {
            q: "If someone steals a JWT access token, how do you invalidate it before it naturally expires, given JWTs are stateless?",
            followups: [
              "Would you maintain a server-side blacklist? What does that cost you in terms of \"statelessness\"?",
            ],
          },
          {
            q: "Why is storing a JWT in localStorage considered risky? Why is an httpOnly cookie safer against XSS but not against CSRF? How would you protect against both at once?",
          },
          {
            q: "What is the \"alg: none\" JWT vulnerability, and how do you prevent it in your token verification code?",
          },
          {
            q: "Symmetric (HS256) vs asymmetric (RS256) signing — why would a microservices architecture prefer RS256?",
            followups: [
              "If Service A issues the token and Service B only verifies it, what does each side actually need (the secret vs the public key)?",
            ],
          },
          {
            q: "How do you rotate your JWT signing key without invalidating every currently-active session?",
          },
          {
            q: "What happens if there's clock skew between your auth server and your API server around the `exp`/`nbf` claims?",
          },
          {
            q: "You store user roles/permissions inside the JWT payload for fast authorization checks — what breaks when an admin revokes a user's role mid-session, before the token expires?",
          },
          {
            q: "Why have both a short-lived access token and a long-lived refresh token instead of just one long-lived token?",
          },
          {
            q: "Where should a refresh token be stored, and why (httpOnly secure cookie vs local storage vs a backend session store)?",
          },
          {
            q: "What is refresh token rotation, and how does it help detect token theft (reuse detection)?",
            followups: [
              "If a stolen refresh token is used after the legitimate user already rotated it, what should your system do?",
            ],
          },
          {
            q: "Two browser tabs both try to refresh the access token at the same time using the same refresh token — what race condition can occur, and how do you prevent it?",
          },
          { q: "How would you implement \"logout from all devices\"?" },
          {
            q: "What is a JWT replay attack, and what mitigations exist (short expiry, a nonce/`jti` claim, binding to IP/device)?",
          },
          {
            q: "If your JWT payload grows large (many claims), what problems does that cause (header size limits, cookie size limits, added latency)?",
          },
          {
            q: "How do you securely pass a JWT between a browser SPA and a backend when they're hosted on different subdomains/origins?",
          },
          {
            q: "Your access token expires while a long file upload is mid-flight — how should the client/server handle that gracefully?",
          },
        ],
      },
      {
        id: "two-factor-auth",
        number: 16,
        numLabel: "16c",
        title: "Two-Factor Authentication (2FA / MFA)",
        questions: [
          {
            q: "How does TOTP (Time-based One-Time Password, e.g., Google Authenticator) actually work under the hood?",
            followups: [
              "What role does the shared secret and the current timestamp play in generating the code?",
              "Why do TOTP validators usually allow a ±1 time-step window?",
            ],
          },
          {
            q: "SMS OTP vs authenticator-app TOTP vs push-based approval — trade-offs (security, cost, UX, SIM-swap risk)?",
          },
          {
            q: "How would you design account recovery when a user loses the device with their authenticator app?",
          },
          {
            q: "How do you rate-limit OTP verification attempts to prevent brute-forcing a 6-digit code?",
          },
          {
            q: "How would you securely store a user's TOTP secret on the server?",
          },
          {
            q: "What is \"2FA fatigue\" / MFA push-bombing, and how do you design push-based 2FA to resist it?",
          },
          {
            q: "How would you implement step-up authentication — requiring 2FA only for a sensitive action (e.g., a large money transfer) even though the user is already logged in?",
          },
          {
            q: "How do backup/recovery codes work, and how should they be stored and invalidated after use?",
          },
          {
            q: "Would you enforce 2FA on every login or only on new/unrecognized devices — what's the trade-off?",
          },
        ],
      },
      {
        id: "ldap-directory-auth",
        number: 16,
        numLabel: "16d",
        title: "LDAP & Enterprise Directory Authentication",
        questions: [
          {
            q: "What is LDAP, and what problem does it solve for enterprise authentication?",
          },
          {
            q: "Explain the LDAP bind authentication flow — how does an app verify a username/password against Active Directory/LDAP?",
          },
          {
            q: "LDAP vs OAuth2/SAML/OIDC — when would an enterprise fintech product actually need LDAP (hint: internal employee/admin tooling vs customer-facing auth)?",
          },
          {
            q: "What is LDAP injection, and how do you prevent it (same family of concern as SQL injection)?",
          },
          {
            q: "How would you integrate ASP.NET Core with an on-prem Active Directory for internal admin-tool authentication?",
          },
          {
            q: "How do you map LDAP/AD groups to application-level roles/permissions?",
          },
          {
            q: "What is LDAPS, and why would you require it over plain LDAP?",
          },
          {
            q: "What are the performance considerations of hitting an LDAP server on every request vs caching group membership?",
          },
        ],
      },
      {
        id: "patterns-solid",
        number: 17,
        title: "Design Patterns & SOLID Principles",
        questions: [
          {
            q: "Explain each SOLID principle with a short example from a system you've built.",
          },
          {
            q: "Singleton pattern — how is it implemented, and what problems can it cause (e.g., in testing, in DI containers)?",
          },
          {
            q: "Repository pattern and Unit of Work — what do they abstract, and are they redundant with EF Core's own `DbContext`?",
          },
          {
            q: "Factory pattern vs Dependency Injection — how do they relate?",
          },
          {
            q: "Strategy pattern — give an example (e.g., switching between payment providers at runtime).",
          },
          {
            q: "Observer pattern — where have you seen it used (hint: RxJS/EventEmitter are essentially this)?",
          },
          {
            q: "What is the Decorator pattern, and how does middleware relate to it?",
          },
          {
            q: "What is Clean Architecture / Onion Architecture, and why separate domain logic from infrastructure (DB, web framework)?",
          },
        ],
      },
      {
        id: "security-fundamentals",
        number: 18,
        title: "Security Fundamentals",
        questions: [
          {
            q: "Name a few items from the OWASP Top 10 and how you've mitigated them in real code.",
          },
          {
            q: "What is XSS, and how do frontend frameworks like Angular help prevent it by default?",
          },
          {
            q: "What is SQL injection, and why do parameterized queries fully prevent it?",
          },
          { q: "What is CSRF, and how is it different from XSS?" },
          {
            q: "How do you securely store passwords (hashing algorithms like bcrypt/argon2, salting)?",
          },
          {
            q: "What is HTTPS/TLS actually protecting against, at a high level (encryption in transit, certificate validation)?",
          },
          {
            q: "How would you handle PCI-DSS-adjacent concerns if your system ever touches card data (tokenization, not storing raw PAN)?",
          },
          {
            q: "What is rate limiting/throttling protecting against beyond just \"abuse\" (e.g., credential stuffing, brute force)?",
          },
          {
            q: "How do you avoid leaking sensitive data (PII, tokens, card numbers) in logs, error messages, or API responses?",
          },
        ],
      },
      {
        id: "git-version-control",
        number: 19,
        title: "Git & Version Control",
        questions: [
          {
            q: "Explain the difference between `git merge` and `git rebase`. When would you use each?",
          },
          { q: "What is a merge conflict, and how do you resolve one?" },
          {
            q: "What's your branching strategy for a team project (Git Flow, trunk-based, feature branches)?",
          },
          { q: "What does `git cherry-pick` do, and when have you used it?" },
          { q: "How do you undo a commit that's already been pushed, safely?" },
          {
            q: "What is a squash merge, and why might a team require it for PRs?",
          },
        ],
      },
      {
        id: "docker",
        number: 20,
        title: "Docker & Containerization",
        questions: [
          {
            q: "What problem does Docker solve compared to just running the app directly on a VM?",
          },
          { q: "Explain the difference between an image and a container." },
          {
            q: "What is a multi-stage Dockerfile, and why use one (smaller final image)?",
          },
          {
            q: "What is Docker Compose used for, and how would you use it to spin up your API + database + Redis locally?",
          },
          {
            q: "How do environment variables and secrets get passed into a containerized app?",
          },
        ],
      },
      {
        id: "cicd-devops",
        number: 21,
        title: "CI/CD & DevOps Basics",
        questions: [
          {
            q: "Walk through a typical CI/CD pipeline for a full-stack app (build → test → containerize → deploy).",
          },
          {
            q: "What is the difference between continuous delivery and continuous deployment?",
          },
          {
            q: "What is a blue-green deployment vs a canary deployment, and why do they reduce release risk?",
          },
          {
            q: "How do you handle a database migration as part of a zero-downtime deployment?",
          },
          { q: "What's your approach to rolling back a bad deployment quickly?" },
        ],
      },
      {
        id: "cloud-azure",
        number: 22,
        title: "Cloud Basics (Azure-Focused)",
        questions: [
          {
            q: "What is the difference between Azure App Service, Azure Functions, and running your own VM/container for hosting a Web API?",
          },
          {
            q: "What is Azure SQL Database / Managed Instance, and how does it differ from self-hosted SQL Server?",
          },
          {
            q: "What is Azure Service Bus / Azure Queue Storage used for, and how does it compare to Kafka/RabbitMQ?",
          },
          {
            q: "What is Azure Key Vault used for, and why not just put secrets in config files?",
          },
          {
            q: "What is Azure Application Insights, and what does it give you for observability?",
          },
          {
            q: "What's the difference between horizontal scaling (scale-out) settings and vertical scaling (scale-up) in a typical cloud App Service plan?",
          },
        ],
      },
      {
        id: "testing-strategy",
        number: 23,
        title: "Testing Strategy (Cross-Stack)",
        questions: [
          {
            q: "Explain the testing pyramid — unit vs integration vs end-to-end tests, and the right ratio between them.",
          },
          {
            q: "What is TDD (test-driven development), and have you practiced it — what's the actual workflow (red-green-refactor)?",
          },
          {
            q: "What makes a good unit test (isolation, determinism, speed)? What's a \"flaky test\" and what usually causes one?",
          },
          {
            q: "Mocking vs stubbing vs faking — differences, and when do you reach for each?",
          },
          {
            q: "How do you test code that depends on the current date/time or randomness?",
          },
          {
            q: "What's the difference between code coverage and actually having good tests — why can 100% coverage still hide bugs?",
          },
        ],
      },
      {
        id: "observability",
        number: 24,
        title: "Observability (Logging, Monitoring, Tracing)",
        questions: [
          {
            q: "What are the three pillars of observability — logs, metrics, traces — and what does each answer that the others don't?",
          },
          {
            q: "What is a correlation ID / trace ID, and how does it help debug an issue across multiple services?",
          },
          {
            q: "What's the difference between monitoring (dashboards/alerts) and logging (searchable event records)?",
          },
          {
            q: "What would you alert on for a payment API (error rate, latency percentiles, queue depth) and why those specifically?",
          },
          {
            q: "What's the difference between p50, p95, and p99 latency, and why do p95/p99 matter more than average latency?",
          },
        ],
      },
    ],
  },
  {
    id: "part-e",
    label: "Part E",
    title: "Domain",
    categories: [
      {
        id: "fintech-domain",
        number: 25,
        title: "Fintech-Specific / Domain Follow-ups",
        note: "Likely to come up given your background.",
        questions: [
          {
            q: "Walk me through a system you built or maintained — how was money movement/consistency handled?",
          },
          {
            q: "How did your team handle reconciliation between internal records and an external payment processor?",
          },
          {
            q: "How was idempotency handled for retried payment requests in a system you worked on?",
          },
          {
            q: "How did you handle PII/sensitive financial data — encryption at rest/in transit, masking, access control?",
          },
          {
            q: "Have you worked with any compliance/audit requirements (e.g., logging every balance-affecting change)? How was that implemented?",
          },
          {
            q: "How did your system handle a failed or partial transaction (rollback, compensating action)?",
          },
          {
            q: "What was your approach to testing money-related logic (edge cases like negative amounts, rounding, currency precision)?",
          },
          {
            q: "How would you design a system to handle multi-currency transactions and conversion correctly (precision, rounding rules)?",
          },
          {
            q: "How do you handle a scenario where a payment succeeded at the provider but your system's callback/webhook never arrived?",
          },
          {
            q: "What data type would you use to store money in the database and in application code, and why not float/double?",
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Practical Engineering Scenario Questions ("How Would You Build X").
// Kept separate from the theory bank on purpose — these are the "walk me
// through how you'd actually build this" prompts. Verbatim transcription.
// ---------------------------------------------------------------------------

export const SCENARIO_PREP_META = {
  title: "Practical Engineering Scenario Questions (\"How Would You Build X\")",
  whySeparate:
    "These aren't \"define X\" theory questions — they're the \"walk me through how you'd actually build this\" prompts (like the 10-lakh-record bulk upload one) where the interviewer wants to see your engineering judgment in real time: how you break the problem down, what you ask before designing, and what breaks at scale. No answers included — each scenario has follow-up angles the interviewer will likely push on next.",
  checklistTitle:
    "How to think about any question in this file, as a starting checklist:",
  checklist: [
    "Volume/scale: how big is \"big\" here (10 lakh rows? 10 GB file? 10k requests/sec?)",
    "Time budget: can this run synchronously, or does it need to be async/background?",
    "Failure mode: what happens to the 500,001st row if the 500,000th one fails?",
    "Idempotency/retries: what happens if the same job/request runs twice?",
    "Visibility: how does the user/caller know it's still running, done, or failed?",
    "Resource limits: memory, DB connections, downstream API rate limits.",
  ],
};

export const SCENARIO_PREP_CATEGORIES: IQCategory[] = [
  {
    id: "scn-bulk-data-operations",
    number: 1,
    title: "Bulk Data Operations",
    questions: [
      {
        q: "You need to bulk upload 10 lakh (1 million) records from a CSV/Excel file into the database. Walk me through your design.",
        followups: [
          "How do you avoid loading the whole file into memory?",
          "How do you avoid the HTTP request timing out?",
          "How would you show the user real-time progress (e.g., \"45,000 / 10,00,000 processed\")?",
          "What happens if row 500,001 has bad data — do you fail the whole batch, skip it, or stop?",
          "How do you avoid hammering the database with 10 lakh individual INSERTs?",
          "How would you make the upload resumable if the server restarts halfway through?",
          "How do you handle duplicate records within the file, and duplicates against existing DB data?",
          "How would this design change if the file were 1 crore (10 million) rows instead of 10 lakh?",
        ],
      },
      {
        q: "Design a bulk export feature — a user clicks \"Export all transactions\" and there are 50 lakh rows.",
        followups: [
          "Would you generate the file synchronously or asynchronously? Why?",
          "How do you notify the user when the export is ready (polling, email, websocket)?",
          "How do you avoid the export query itself locking or slowing down the production database?",
          "Where would you store the generated file, and how would you expire/clean it up later?",
        ],
      },
      {
        q: "Design a bulk update feature — e.g., \"mark all transactions from vendor X as reconciled\" affecting lakhs of rows.",
        followups: [
          "How do you avoid a single massive UPDATE statement locking the table for other users?",
          "How would you batch this safely, and how would you track progress/failures?",
        ],
      },
      {
        q: "Design a bulk delete feature for old records (e.g., purging transaction logs older than 7 years).",
        followups: [
          "How do you avoid a single DELETE blowing up the transaction log / taking the DB down?",
          "Would you hard-delete or soft-delete/archive first? Why?",
        ],
      },
      {
        q: "A bulk import needs to validate every row against business rules (e.g., valid account number, sufficient KYC) before committing. How do you design validation to not become the bottleneck?",
      },
      {
        q: "How would you let a user \"undo\" a bulk operation that already partially succeeded?",
      },
      {
        q: "How would you re-run only the failed rows from a bulk upload without redoing the whole file?",
      },
    ],
  },
  {
    id: "scn-file-report-processing",
    number: 2,
    title: "File & Report Processing",
    questions: [
      {
        q: "A user uploads a 2 GB CSV file — how does your API even receive it without running out of memory or hitting a request-size limit?",
      },
      {
        q: "Design a system that generates a large PDF/Excel report (e.g., annual transaction statement) on demand.",
        followups: [
          "Sync vs async generation — how do you decide?",
          "How would you paginate/chunk report generation for a report spanning millions of rows?",
        ],
      },
      {
        q: "How would you validate that an uploaded file is well-formed (correct columns, correct data types) before processing even starts?",
      },
      {
        q: "How would you process multiple uploaded files in parallel without overwhelming the system?",
      },
      {
        q: "Design a CSV-to-database import pipeline that needs to support multiple file formats/column mappings from different partner banks.",
      },
      {
        q: "How would you show a preview of the first N rows of a huge file to the user before they confirm the import?",
      },
    ],
  },
  {
    id: "scn-background-jobs",
    number: 3,
    title: "Background Jobs & Async Processing",
    questions: [
      {
        q: "How do you design a background job system for long-running tasks (bulk upload, report generation, batch reconciliation)?",
        followups: [
          "In-process job queue vs a dedicated queue (Hangfire, Azure Service Bus, BullMQ, RabbitMQ) — how do you decide?",
          "How do you handle a job that crashes halfway — does it resume, restart, or fail permanently?",
          "How do you prevent the same job from running twice if triggered twice (idempotency)?",
        ],
      },
      {
        q: "How would you implement a retry mechanism for a background job that depends on a flaky external API, with exponential backoff?",
      },
      {
        q: "How do you prioritize jobs — e.g., a small 100-row upload shouldn't wait behind someone else's 10-lakh-row upload.",
      },
      {
        q: "How do you monitor and alert if background jobs are backing up (queue depth growing) or a worker has died?",
      },
      {
        q: "How would you design a scheduled nightly batch job (e.g., interest calculation for all accounts) to run within its time window even as data grows?",
      },
    ],
  },
  {
    id: "scn-search-retrieval-scale",
    number: 4,
    title: "Search & Data Retrieval at Scale",
    questions: [
      {
        q: "Design a search/filter feature over a transactions table with crores of rows (search by user, date range, amount, status).",
        followups: [
          "Would you rely purely on SQL indexes, or introduce a search engine (Elasticsearch)? Why?",
        ],
      },
      {
        q: "Design an autocomplete/typeahead feature (e.g., searching for a beneficiary by name) that needs to respond in under 100ms.",
      },
      {
        q: "How would you implement infinite-scroll pagination on a list that's constantly getting new rows inserted (avoiding skipped/duplicated items)?",
      },
      {
        q: "How would you build a dashboard that needs to show aggregate stats (totals, counts) over a huge, constantly growing table without recalculating from scratch every time?",
      },
      {
        q: "How would you design full-text search across transaction notes/descriptions?",
      },
    ],
  },
  {
    id: "scn-realtime-notification",
    number: 5,
    title: "Real-Time & Notification Features",
    questions: [
      {
        q: "Design a feature that shows the user live progress of their bulk upload (e.g., a progress bar updating in real time).",
        followups: [
          "WebSockets vs Server-Sent Events vs polling — which would you pick here, and why?",
        ],
      },
      {
        q: "Design a notification system that sends an SMS/email/push alert on every transaction, at high volume, without becoming a bottleneck on the transaction-processing path itself.",
      },
      {
        q: "How would you design a real-time balance update so a user sees their new balance instantly after a transaction, even if the ledger update happens slightly after?",
      },
      {
        q: "Design a system for real-time fraud alerts that must evaluate every transaction within milliseconds without slowing down the transaction itself.",
      },
    ],
  },
  {
    id: "scn-third-party-integration",
    number: 6,
    title: "Third-Party Integration & Reliability",
    questions: [
      {
        q: "You call an external payment provider's API to process a transaction, and the call times out — you don't know if it succeeded on their end or not. What do you do?",
      },
      {
        q: "Design a webhook receiver for an external payment provider — how do you handle out-of-order delivery, duplicate deliveries, and verifying the webhook is genuinely from them?",
      },
      {
        q: "Design an outgoing webhook delivery system (your service notifying a partner) with retries — how do you avoid retrying forever on a permanently broken endpoint?",
      },
      {
        q: "A downstream service you depend on is rate-limited to 100 requests/sec, but your bulk job needs to call it 10 lakh times. How do you design around that?",
      },
      {
        q: "How would you design your system to gracefully degrade if a non-critical downstream dependency (e.g., a notification service) is completely down?",
      },
    ],
  },
  {
    id: "scn-data-integrity",
    number: 7,
    title: "Data Integrity & Consistency Scenarios",
    questions: [
      {
        q: "Two requests try to debit the same account at the exact same millisecond — how do you make sure you don't allow the balance to go negative incorrectly?",
      },
      {
        q: "How would you design a system so that a crashed process mid-transaction never leaves the database in a half-updated state?",
      },
      {
        q: "How would you reconcile 10 lakh transaction records between your system and a partner bank's file at the end of each day and flag mismatches?",
      },
      {
        q: "How do you guarantee an operation like \"transfer money\" either fully happens or fully doesn't, even across two different services/databases?",
      },
      {
        q: "How would you design an append-only ledger table so that historical records can never be silently altered, only corrected via new offsetting entries?",
      },
    ],
  },
  {
    id: "scn-multitenancy-security",
    number: 8,
    title: "Multi-Tenancy, Security & Compliance Scenarios",
    questions: [
      {
        q: "Design a system so that a bulk export or bulk query can never accidentally leak one tenant's/customer's data to another.",
      },
      {
        q: "How would you design row-level access control so a support agent can only see transactions they're authorized to view?",
      },
      {
        q: "How would you design an audit trail that records who changed what and when, for every balance-affecting operation, without the logging itself becoming a performance bottleneck?",
      },
      {
        q: "A bulk upload file might contain sensitive data (PII) — how do you make sure it's not sitting unencrypted on disk or in logs at any stage?",
      },
    ],
  },
  {
    id: "scn-performance-scaling",
    number: 9,
    title: "Performance & Scaling Scenarios (Feature-Level)",
    questions: [
      {
        q: "Your bulk upload of 10 lakh records currently takes 2 hours — how would you profile and figure out what's actually slow?",
      },
      {
        q: "How would you redesign a feature that works fine at 10,000 users but starts timing out at 1,000,000 users?",
      },
      {
        q: "How would you design an API endpoint that needs to handle a sudden traffic spike (e.g., salary day, everyone checking balance at once)?",
      },
      {
        q: "Your database CPU spikes every time the nightly batch job runs and it slows down live customer traffic — how do you fix this?",
      },
      {
        q: "How would you test that your bulk upload feature can actually handle 10 lakh rows before it goes to production (load testing approach)?",
      },
    ],
  },
  {
    id: "scn-fintech-operational",
    number: 10,
    title: "Fintech Operational Scenarios",
    questions: [
      {
        q: "Design a system to process end-of-day interest calculation for lakhs of savings accounts, all before the next business day starts.",
      },
      {
        q: "Design a bulk KYC-verification pipeline that has to call an external verification API for every uploaded document.",
      },
      {
        q: "Design a system for bulk-generating and sending monthly account statements to all customers.",
      },
      {
        q: "Design a recurring-payments engine that has to trigger lakhs of scheduled debits on the same day (e.g., 1st of every month) without missing any or double-charging any.",
      },
      {
        q: "How would you design a system to detect and pause suspicious bulk activity (e.g., someone trying to bulk-transfer out of many accounts rapidly)?",
      },
    ],
  },
  {
    id: "scn-batch-processing-deep-dive",
    number: 11,
    title: "Batch Processing — Deep Dive",
    questions: [
      {
        q: "What's the difference between batch processing and stream processing, and how do you decide which fits a given problem?",
      },
      {
        q: "How do you choose a batch/chunk size for processing millions of records — what goes wrong if it's too small vs too large?",
      },
      {
        q: "How would you parallelize batch processing across multiple worker threads/processes safely, avoiding two workers processing the same chunk?",
      },
      {
        q: "How do you implement checkpointing so a batch job can resume from where it left off after a crash, instead of restarting from zero?",
      },
      {
        q: "How do you make a batch job idempotent so that re-running it (accidentally, or as a retry) doesn't double-process records?",
      },
      {
        q: "What's the fastest way to bulk-insert millions of rows into SQL Server (e.g., `SqlBulkCopy`) vs doing it row-by-row through EF Core — why is the difference so large?",
      },
      {
        q: "How would you isolate failures in a batch job so that one bad record doesn't stop or corrupt the entire batch?",
      },
      {
        q: "Would you run a batch job as a single large transaction or commit in smaller chunks? What are the trade-offs (lock duration, rollback cost, partial completion on crash)?",
      },
      {
        q: "How do you schedule and coordinate batch jobs across multiple server instances so the same job doesn't accidentally run twice (distributed locking / leader election)?",
      },
      {
        q: "How do you monitor a long-running batch job's health and alert if it's stuck, crashed, or falling behind schedule?",
      },
      {
        q: "If a batch job needs to call a rate-limited external API once per record, how do you throttle it without massively slowing down the whole batch?",
      },
      {
        q: "How would you design a batch job that processes \"today's data\" but must avoid reading records that are still mid-write by the live system (dirty/in-flight reads)?",
      },
      {
        q: "Your nightly batch job used to finish in 1 hour; after 6 months of data growth it now takes 6 hours and is bleeding into business hours — how do you diagnose and fix this?",
      },
      {
        q: "How would you design a batch job's retry policy — retry the whole job, retry only failed chunks, or retry only failed rows? What decides which approach fits?",
      },
    ],
  },
];

