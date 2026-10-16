# AGENTS.md — rules for AI coding agents

## Golden rules

1. Never edit files outside the current ticket's scope. If you think you need to, stop and ask.
2. Tests come first. For behavior changes: write the test, run it, see it fail, then implement.
3. Never bypass CI. No --no-verify, no skipping hooks, no editing .github/workflows/ unless the ticket says so.
4. server/src/domain/ must not import Express, req, res, or anything HTTP. Pure rules only.
5. No any. No @ts-ignore. No "as unknown as" without a justifying comment.
6. One ticket = one PR. If a ticket grows, split it and add the new ticket to TICKETS.md.
7. Commit style: type(scope): summary — e.g. feat(domain): reject done task without assignee.
8. No new dependencies without a one-line justification in the PR body.
9. Run before opening a PR: npm run typecheck and npm test.
10. If a test fails, fix the code — do not weaken the test, unless the ticket explicitly says the test itself is wrong.

## Definition of done (per ticket)

- Behavior implemented
- Test added or updated and passing
- npm run typecheck and npm test green locally
- PR opened with the ticket ID in the title
- PR body filled using the template

## Refuse and ask when

- A ticket requires changing shared types across client and server
- A ticket would delete a test
- You are unsure which layer (domain / route / UI) a change belongs in
