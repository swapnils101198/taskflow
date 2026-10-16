# PR review checklist

Reviewer reads the diff before approving. Agents do not self-merge.

## Scope

- Diff only touches files the ticket named
- No drive-by refactors
- No new dependencies unless the ticket justified them

## Correctness

- New behavior has a test that would fail without the change
- Domain rules live in server/src/domain/, not in routes
- Error paths return the right status (404 for missing, 422 for rule violations, 400 for malformed input)

## Quality

- No any, no @ts-ignore
- Names read like the domain (a task is done, not status === 2)
- No commented-out code left behind

## Before approving

- CI is green
- PR body references the ticket ID
- If the PR changes behavior that affects the client, the client build still passes
