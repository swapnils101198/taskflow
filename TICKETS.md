# Tickets

Small, mergeable units. One ticket = one PR. An agent should finish a ticket in 5–20 minutes.

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
