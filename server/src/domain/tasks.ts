import { DomainError } from './errors.js';
import type { Task, TaskPriority, TaskStatus } from './types.js';

export interface CreateTaskInput {
  readonly id: string;
  readonly projectId: string;
  readonly title: string;
  readonly priority?: TaskPriority | undefined;
  readonly status?: TaskStatus | undefined;
  readonly assigneeId?: string | null | undefined;
  readonly createdAt?: Date | undefined;
}

const VALID_TRANSITIONS: Record<TaskStatus, readonly TaskStatus[]> = {
  todo: ['doing'],
  doing: ['done', 'todo'],
  done: [],
};

export function createTask(input: CreateTaskInput, existing: ReadonlyMap<string, Task>): Task {
  const title = input.title.trim();
  if (title.length < 3) {
    throw new DomainError('TASK_INVALID_TITLE', 'task title must be at least 3 characters');
  }
  if (existing.has(input.id)) {
    throw new DomainError('TASK_DUPLICATE', `task already exists: ${input.id}`);
  }
  const status = input.status ?? 'todo';
  const assigneeId = input.assigneeId ?? null;

  if (status === 'done' && assigneeId === null) {
    throw new DomainError('TASK_DONE_WITHOUT_ASSIGNEE', 'a done task must have an assignee');
  }

  return Object.freeze({
    id: input.id,
    projectId: input.projectId,
    title,
    status,
    priority: input.priority ?? 'med',
    assigneeId,
    createdAt: input.createdAt ?? new Date(),
  });
}

export function transitionTask(
  task: Task,
  next: TaskStatus,
  assigneeId: string | null = task.assigneeId,
): Task {
  if (!VALID_TRANSITIONS[task.status].includes(next)) {
    throw new DomainError(
      'TASK_INVALID_TRANSITION',
      `invalid transition ${task.status} -> ${next}`,
    );
  }
  if (next === 'done' && assigneeId === null) {
    throw new DomainError('TASK_DONE_WITHOUT_ASSIGNEE', 'cannot mark done without an assignee');
  }
  // T-005 adds the "cannot start without assignee" rule below this line.
  return Object.freeze({ ...task, status: next, assigneeId });
}
