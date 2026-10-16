import { DomainError } from './errors.js';
import type { Project } from './types.js';

export interface CreateProjectInput {
  readonly id: string;
  readonly name: string;
  readonly createdAt?: Date | undefined;
}

export function createProject(
  input: CreateProjectInput,
  existing: ReadonlyMap<string, Project>,
): Project {
  const name = input.name.trim();
  if (name.length === 0) {
    throw new DomainError('PROJECT_INVALID_NAME', 'project name is required');
  }
  if (existing.has(input.id)) {
    throw new DomainError('PROJECT_DUPLICATE', `project already exists: ${input.id}`);
  }
  return Object.freeze({
    id: input.id,
    name,
    createdAt: input.createdAt ?? new Date(),
  });
}
