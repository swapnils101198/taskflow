# Tickets

Small, mergeable units. One ticket = one PR. An agent should finish a ticket in 5–20 minutes.

**Scope discipline:** Each ticket is scoped to a specific set of files. When three agents work in parallel on different tickets, their file sets must not overlap. If a ticket would touch a file outside its scope, split it.

## T-001 — domain types and errors
Add server/src/domain/types.ts and server/src/domain/errors.ts. Export TaskStatus, TaskPriority, Project, Task, and DomainError with codes. No logic yet.

## T-002 — createProject
Add server/src/domain/projects.ts with createProject(input, existing). Rules: trim name, reject empty, reject duplicate id. Test in server/test/projects.spec.ts.

## T-003 — createTask
Add server/src/domain/tasks.ts with createTask(input, existing). Rules: title min 3 chars, reject duplicate id, default status todo, default priority med, reject status done when assigneeId is null.

## T-004 — transitionTask
Add transitionTask(task, next) in server/src/domain/tasks.ts. Allowed: todo to doing, doing to done, doing to todo. Reject done to anything. Reject to done when assignee is null.

## T-005 — cannot start without assignee
New rule: todo to doing requires assigneeId to be non-null. Write the test in server/test/invariants.spec.ts FIRST, watch it fail, then implement in transitionTask.
**Files:** server/test/invariants.spec.ts, server/src/domain/tasks.ts.
This ticket is used for the recording's failing-test-blocks-the-change shot.

## T-006 — express app skeleton
server/src/app.ts, server/src/server.ts, request-id middleware, error handler mapping DomainError to 4xx.

## T-007 — projects routes
GET /projects and POST /projects with Zod validation.

## T-008 — tasks routes
GET /tasks, POST /tasks, POST /tasks/:id/transition.

## T-009 — client scaffold
Vite plus React entry, App.tsx, layout.

## T-010 — projects page
Fetch and render projects. Loading and error states.

## T-011 — tasks page
Fetch and render tasks grouped by status.

## T-012 — CI workflow
GitHub Actions: install, typecheck, test, build. Blocking on main.

## T-013 — DELETE /tasks/:id
Add DELETE handler to server/src/routes/tasks.ts. Returns 204 on success, 404 with { error: { code: 'TASK_NOT_FOUND' } } if missing. Tests in server/test/api.e2e.spec.ts.

## T-014 — DELETE /projects/:id
Add DELETE handler to server/src/routes/projects.ts. Also deletes every task whose projectId matches. Returns 204 on success, 404 with { error: { code: 'PROJECT_NOT_FOUND' } } if missing. Tests.

## T-015 — edit task (PATCH /tasks/:id)
Add PATCH /tasks/:id in server/src/routes/tasks.ts. Accepts { title?, priority? }. Returns 200 with updated task, 404 if missing, 422 on invalid title. Tests in api.e2e.spec.ts.
Client: add updateTask() in api/client.ts. Add an "Edit" button in TaskItem that opens an inline editor (title + priority + Save/Cancel). Wire to store and toasts.
**Files:** server/src/routes/tasks.ts, server/test/api.e2e.spec.ts, client/src/api/client.ts, client/src/features/tasks/TaskItem.tsx.
**Does not touch:** ProjectsPage, domain, invariants tests.

## T-016 — task count per project
Show "N tasks" badge on each project row in ProjectsPage. Derive from store — no new API call. Use the existing Badge component. New test file client/test/ProjectsPage.tasks.test.tsx with 2 projects and 3 tasks, asserting "2 tasks" and "1 task".
**Files:** client/src/features/projects/ProjectsPage.tsx, client/test/ProjectsPage.tasks.test.tsx.
**Does not touch:** server, other client files.

## Parallel batch (used for the recording)
T-005, T-015, and T-016 are designed to run in parallel. Their file sets do not overlap. Do not let one agent edit another's files.
