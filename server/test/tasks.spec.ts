import { describe, it, expect } from 'vitest';
import { createTask, transitionTask } from '../src/domain/tasks.js';
import { DomainError } from '../src/domain/errors.js';

describe('createTask', () => {
  it('creates a todo task by default', () => {
    const t = createTask({ id: 't1', projectId: 'p1', title: 'write docs' }, new Map());
    expect(t.status).toBe('todo');
    expect(t.priority).toBe('med');
    expect(t.assigneeId).toBeNull();
  });

  it('rejects short titles', () => {
    expect(() => createTask({ id: 't1', projectId: 'p1', title: 'hi' }, new Map())).toThrowError(
      DomainError,
    );
  });

  it('rejects done without assignee', () => {
    expect(() =>
      createTask({ id: 't1', projectId: 'p1', title: 'ship it', status: 'done' }, new Map()),
    ).toThrowError(DomainError);
  });
});

describe('transitionTask', () => {
  it('moves todo to doing', () => {
    const t = createTask({ id: 't1', projectId: 'p1', title: 'write docs' }, new Map());
    expect(transitionTask(t, 'doing').status).toBe('doing');
  });

  it('rejects done to todo', () => {
    const t = createTask(
      { id: 't1', projectId: 'p1', title: 'write docs', status: 'doing', assigneeId: 'u1' },
      new Map(),
    );
    const done = transitionTask(t, 'done');
    expect(() => transitionTask(done, 'todo')).toThrowError(DomainError);
  });
});
