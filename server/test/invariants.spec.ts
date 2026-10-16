import { describe, it, expect } from 'vitest';
import { createTask, transitionTask } from '../src/domain/tasks.js';
import { DomainError } from '../src/domain/errors.js';

describe('task invariants', () => {
  it('refuses to create a done task without an assignee', () => {
    expect(() =>
      createTask({ id: 't1', projectId: 'p1', title: 'ship it', status: 'done' }, new Map()),
    ).toThrowError(DomainError);
  });

  // T-005 will un-skip this test and add the rule in transitionTask.
  it.todo('refuses todo to doing when no assignee is set');
});
