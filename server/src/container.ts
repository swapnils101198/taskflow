import type { Project, Task } from './domain/types.js';

export interface Store {
  projects: Map<string, Project>;
  tasks: Map<string, Task>;
}

export interface Container {
  store: Store;
}

export function createContainer(): Container {
  return { store: { projects: new Map(), tasks: new Map() } };
}
