# Daily agent cost log

Approximate cost per working day of agent usage in this repo. Update at end of day.

| Date       | Model       | Input tokens | Output tokens | Est. cost (USD) | Notes                            |
|------------|-------------|--------------|---------------|-----------------|----------------------------------|
| 2026-10-16 | claude-opus |              |               |                 | T-005, T-015, T-016 parallel run |

## How to fill this in

- Claude Code prints token usage per session; sum the sessions from one day.
- Multiply by the current model rates.
- The point is a rough daily number a reviewer can sanity-check, not accounting precision.

## Parallel-agent conflict handling

Three agents work in three git worktrees on three branches. Their file scopes do not overlap by design.
If a conflict does appear at merge time, GitHub flags the PR, the branch is rebased on origin/main, tests re-run, and the PR is re-reviewed before merge.
