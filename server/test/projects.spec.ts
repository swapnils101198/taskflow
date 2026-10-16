import { describe, it, expect } from 'vitest';
import { createProject } from '../src/domain/projects.js';
import { DomainError } from '../src/domain/errors.js';

describe('createProject', () => {
  it('creates a trimmed project', () => {
    const p = createProject({ id: 'p1', name: '  Demo  ' }, new Map());
    expect(p.name).toBe('Demo');
  });

  it('rejects empty names', () => {
    expect(() => createProject({ id: 'p1', name: '   ' }, new Map())).toThrowError(DomainError);
  });

  it('rejects duplicate ids', () => {
    const existing = new Map([['p1', { id: 'p1', name: 'x', createdAt: new Date() }]]);
    expect(() => createProject({ id: 'p1', name: 'y' }, existing)).toThrowError(DomainError);
  });
});
